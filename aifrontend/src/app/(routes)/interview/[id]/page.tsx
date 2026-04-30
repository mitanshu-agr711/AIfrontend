'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import InterviewBot from '@/components/InterviewBot'
import { Button } from '@/components/button'
import { Mic, MicOff, Volume2, VolumeX, ChevronRight, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'
import { AppError } from '@/lib/errorHandler'

interface Question {
  id?: string
  _id?: string
  questionId?: string
  question: string
}

interface InterviewInfo {
  id: string
  title: string
  topic: string
  status: string
  totalQuestions: number
}

interface ChatMessage {
  role: 'bot' | 'user'
  text: string
}

type SpeechRecognitionInstance = {
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  continuous: boolean
  interimResults: boolean
  lang: string
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

const InterviewSessionPage = () => {
  const params = useParams()
  const router = useRouter()
  const interviewId = params.id as string

  const { isAuthenticated, hydrated, setLastCompletedInterviewId } = useAuthStore()

  const [interviewInfo, setInterviewInfo] = useState<InterviewInfo | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [chatLog, setChatLog] = useState<ChatMessage[]>([])
  const [userAnswer, setUserAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loadingInterview, setLoadingInterview] = useState(true)
  const [startError, setStartError] = useState<string | null>(null)

  const [showBlur, setShowBlur] = useState(true)
  const [countdown, setCountdown] = useState(3)
  const [timer, setTimer] = useState(600)
  const [timerActive, setTimerActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [fullscreenPrompt, setFullscreenPrompt] = useState(false)
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0)
  const [speechError, setSpeechError] = useState<string | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const interviewSubmittedRef = useRef(false)
  const fullscreenExitCountRef = useRef(0)
  const speechRecognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const streamTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)


  const streamBotMessage = useCallback(async (message: string, delayMs = 110) => {
    const words = message.trim().split(/\s+/).filter(Boolean)

    let speechSynthesisPromise: Promise<void> = Promise.resolve()

    if (typeof window !== 'undefined' && !isMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1
      speechSynthesisRef.current = utterance

      // Create promise that resolves when speech synthesis finishes
      speechSynthesisPromise = new Promise<void>((resolve) => {
        const onEnd = () => {
          utterance.removeEventListener('end', onEnd)
          utterance.removeEventListener('error', onError)
          resolve()
        }
        const onError = () => {
          utterance.removeEventListener('end', onEnd)
          utterance.removeEventListener('error', onError)
          resolve() // Resolve on error too so flow continues
        }
        utterance.addEventListener('end', onEnd)
        utterance.addEventListener('error', onError)
        window.speechSynthesis.speak(utterance)
      })
    }

    if (streamTimeoutRef.current) {
      clearTimeout(streamTimeoutRef.current)
      streamTimeoutRef.current = null
    }

    if (words.length === 0) {
      setChatLog(prev => [...prev, { role: 'bot', text: message }])
      // Wait for speech to complete before returning
      await speechSynthesisPromise
      return
    }

    setChatLog(prev => [...prev, { role: 'bot', text: '' }])

    // Wait for both text streaming and speech synthesis to complete
    await Promise.all([
      new Promise<void>((resolve) => {
        let index = 0

        const emitWord = () => {
          index += 1
          const partial = words.slice(0, index).join(' ')

          setChatLog(prev => {
            if (prev.length === 0) return [{ role: 'bot', text: partial }]
            const updated = [...prev]
            updated[updated.length - 1] = { role: 'bot', text: partial }
            return updated
          })

          if (index < words.length) {
            streamTimeoutRef.current = setTimeout(emitWord, delayMs)
            return
          }
          streamTimeoutRef.current = null
          resolve()
        }

        streamTimeoutRef.current = setTimeout(emitWord, delayMs)
      }),
      speechSynthesisPromise,
    ])
  }, [isMuted])

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    if (isMuted) {
      window.speechSynthesis.cancel()
    }
  }, [isMuted])
  // Auth guard
  useEffect(() => {
    const init = async () => {
      if (!hydrated) return
      if (!isAuthenticated) {
        const restored = await api.restoreSession()
        if (!restored) router.push('/register')
      }
    }
    init()
  }, [hydrated, isAuthenticated, router])

  // Start interview on mount
  useEffect(() => {
    if (!hydrated || !interviewId) return

    const startInterview = async () => {
      try {
        setLoadingInterview(true)
        setStartError(null)

        const runStart = async () => {
          return await api.startInterview(interviewId) as {
            interview: InterviewInfo
            questions: Question[]
          }
        }

        let result: {
          interview: InterviewInfo
          questions: Question[]
        }

        try {
          result = await runStart()
        } catch (firstErr) {
          const statusCode =
            typeof firstErr === 'object' &&
            firstErr !== null &&
            'statusCode' in firstErr &&
            typeof (firstErr as { statusCode?: unknown }).statusCode === 'number'
              ? ((firstErr as { statusCode: number }).statusCode)
              : undefined

          if (statusCode === 401 || statusCode === 403) {
            const restored = await api.restoreSession()
            if (!restored) {
              router.push(`/register?next=/interview/${interviewId}`)
              return
            }
            result = await runStart()
          } else {
            throw firstErr
          }
        }

        setInterviewInfo(result.interview)
        const normalizedQuestions = (result.questions || []).map((q) => ({
          ...q,
          id: q.id || q._id || q.questionId,
        }))
        setQuestions(normalizedQuestions)
        if (normalizedQuestions.length > 0) {
          setChatLog([])
          setQuestionStartTime(Date.now())
          setIsSpeaking(true)
          await streamBotMessage(normalizedQuestions[0].question)
          setIsSpeaking(false)
        }
      } catch (err) {
        console.error('Failed to start interview:', err)
        const message =
          typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message?: string }).message || 'Unable to start this interview.')
            : 'Unable to start this interview.'
        setStartError(message)
      } finally {
        setLoadingInterview(false)
      }
    }

    void startInterview()
  }, [hydrated, interviewId, router, streamBotMessage])

  // Countdown blur
  useEffect(() => {
    if (!showBlur) return
    if (countdown === 0) { setShowBlur(false); setCountdown(3); return }
    const interval = setInterval(() => setCountdown(prev => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [showBlur, countdown])

  useEffect(() => {
    const t = setTimeout(() => { setShowBlur(false); setTimerActive(true) }, 3000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!timerActive || timer <= 0) return
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [timerActive, timer])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatLog])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let transcript = ''

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript
      }

      setUserAnswer(transcript.trim())
    }

    recognition.onerror = () => {
      setIsListening(false)
      setSpeechError('Speech recognition is not available right now in this browser.')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    speechRecognitionRef.current = recognition

    return () => {
      recognition.abort()
      speechRecognitionRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!speechError) return
    const timeout = setTimeout(() => setSpeechError(null), 3500)
    return () => clearTimeout(timeout)
  }, [speechError])

  useEffect(() => {
    return () => {
      if (streamTimeoutRef.current) {
        clearTimeout(streamTimeoutRef.current)
      }
    }
  }, [])

  const completeInterviewAndRedirect = useCallback(async (message?: string) => {
    if (interviewSubmittedRef.current) return

    interviewSubmittedRef.current = true
    setFinished(true)

    if (message) {
      setChatLog(prev => [...prev, { role: 'bot', text: message }])
    }

    try {
      const completeResult = await api.completeInterview(interviewId)
      console.log('Interview completed with result:', completeResult)
      setLastCompletedInterviewId(interviewId)
    } catch (err) {
      console.error('Failed to complete interview:', err)
    }

    // EXIT FULLSCREEN HERE ↓
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    }

    // Remove interview-mode class immediately so global footer becomes visible
    try { document.body.classList.remove('interview-mode') } catch { /* ignore */ }

    // Give backend time to process data (short delay)
    await new Promise(resolve => setTimeout(resolve, 1200))

    router.push(`/interview-complete?interviewId=${interviewId}`)
  }, [interviewId, router, setLastCompletedInterviewId])

  const requestInterviewFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      }
      setFullscreenPrompt(false)
    } catch {
      setFullscreenPrompt(true)
    }
  }

  useEffect(() => {
    if (timer === 0 && !finished) {
      void completeInterviewAndRedirect('Time is up! Submitting your interview automatically.')
    }
  }, [timer, finished, completeInterviewAndRedirect])

  useEffect(() => {
    if (loadingInterview || !hydrated || !isAuthenticated) return

    const timeout = setTimeout(() => {
      void requestInterviewFullscreen()
    }, 150)

    return () => clearTimeout(timeout)
  }, [loadingInterview, hydrated, isAuthenticated])

  useEffect(() => {
    const handleFullscreenChange = () => {
      const currentlyFullscreen = Boolean(document.fullscreenElement)

      if (currentlyFullscreen) {
        setFullscreenPrompt(false)
        return
      }

      if (finished || interviewSubmittedRef.current) return

      fullscreenExitCountRef.current += 1
      setFullscreenExitCount(fullscreenExitCountRef.current)

      if (fullscreenExitCountRef.current >= 2) {
        void completeInterviewAndRedirect('Full screen was exited twice. Interview submitted automatically.')
        return
      }

      setFullscreenPrompt(true)
      setChatLog(prev => [
        ...prev,
        { role: 'bot', text: 'Please return to full screen mode to continue your interview.' },
      ])
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [finished, completeInterviewAndRedirect])

  useEffect(() => {
    document.body.classList.add('interview-mode')
    return () => {
      document.body.classList.remove('interview-mode')
    }
  }, [])

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  const resolveQuestionId = (question: Question): string => {
    return question.id || question._id || question.questionId || ''
  }

  const asRecord = (value: unknown): Record<string, unknown> => {
    return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}
  }

  const pickString = (obj: Record<string, unknown>, keys: string[]): string => {
    for (const key of keys) {
      const value = obj[key]
      if (typeof value === 'string' && value.trim()) return value.trim()
    }
    return ''
  }

  const pickBoolean = (obj: Record<string, unknown>, keys: string[]): boolean | undefined => {
    for (const key of keys) {
      const value = obj[key]
      if (typeof value === 'boolean') return value
    }
    return undefined
  }

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || submitting || isSpeaking || showingCorrectAnswer || !questions[currentIndex]) return

    const question = questions[currentIndex]
    const elapsed = Math.floor((Date.now() - questionStartTime) / 1000)
    const resolvedQuestionId = resolveQuestionId(question)

    if (!resolvedQuestionId) {
      console.error('Missing questionId for current question:', question)
      return
    }

    setChatLog(prev => [...prev, { role: 'user', text: userAnswer.trim() }])
    const answerToSubmit = userAnswer.trim()
    setUserAnswer('')
    setIsListening(false)

    let submitSuccess = false
    let submitResponse: unknown = null

    try {
      setSubmitting(true)
      submitResponse = await api.submitAnswer({
        interviewId,
        questionId: resolvedQuestionId,
        userAnswer: answerToSubmit,
        timeTaken: elapsed,
      })
      submitSuccess = true
    } catch (err) {
      console.error('Failed to submit answer:', err)
    } finally {
      setSubmitting(false)
    }

    if (!submitSuccess) return

    const submitRecord = asRecord(submitResponse)
    const nestedData = asRecord(submitRecord.data)
    const submitCorrect = pickBoolean(submitRecord, ['correct', 'isCorrect']) ?? pickBoolean(nestedData, ['correct', 'isCorrect'])
    const submitCorrectAnswer =
      pickString(submitRecord, ['correctAnswer', 'correct_answer', 'answer']) ||
      pickString(nestedData, ['correctAnswer', 'correct_answer', 'answer'])
    const submitExplanation =
      pickString(submitRecord, ['explanation', 'correctedAnswer', 'reason']) ||
      pickString(nestedData, ['explanation', 'correctedAnswer', 'reason'])

    setShowingCorrectAnswer(true)
    let feedbackMessage = 'Answer received. Checking result...'
    let statusIsCorrect: boolean | undefined
    let statusShortReason = ''

    try {
      let statusResult: { isCorrect: boolean; shortReason: string } | null = null

      // Backend may take a moment to persist evaluation; retry quickly before falling back.
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const result = await api.getQuestionStatus(resolvedQuestionId)
          statusResult = { isCorrect: result.isCorrect, shortReason: result.shortReason }
          break
        } catch (statusErr) {
          if (statusErr instanceof AppError && statusErr.statusCode === 404 && attempt < 2) {
            await new Promise(resolve => setTimeout(resolve, 250))
            continue
          }
          throw statusErr
        }
      }

      if (statusResult) {
        statusIsCorrect = statusResult.isCorrect
        statusShortReason = statusResult.shortReason || ''
      }
    } catch (err) {
      if (err instanceof AppError && err.statusCode === 404) {
        feedbackMessage = 'No evaluation found yet for this question.'
      } else {
        console.error('Failed to fetch question status:', err)
      }
    }

    const resolvedIsCorrect = statusIsCorrect ?? submitCorrect

    if (resolvedIsCorrect === true) {
      feedbackMessage = 'Well done. Your answer is correct.'
    } else if (resolvedIsCorrect === false) {
      // const reasonText = statusShortReason || submitExplanation || 'Please review this concept and try again.'
      feedbackMessage = `Your answer is wrong. The correct answer is ${submitCorrectAnswer || 'not available'}`
    }

    setIsSpeaking(true)
    await streamBotMessage(feedbackMessage)
    setIsSpeaking(false)
    setShowingCorrectAnswer(false)

    const nextIndex = currentIndex + 1
    setQuestionStartTime(Date.now())

    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex)
      setIsSpeaking(true)
      await streamBotMessage(questions[nextIndex].question)
      setIsSpeaking(false)
    } else {
      setIsSpeaking(true)
      await streamBotMessage('All questions completed! Great job. Ending the interview now.')
      setIsSpeaking(false)
      setFinished(true)
      await completeInterviewAndRedirect()
    }
  }

  const handleMicToggle = () => {
    const recognition = speechRecognitionRef.current

    if (!recognition) {
      setSpeechError('This browser does not support speech recognition. Try Chrome or Edge.')
      return
    }

    if (isListening) {
      recognition.stop()
      setIsListening(false)
      return
    }

    setSpeechError(null)
    setUserAnswer('')

    try {
      recognition.start()
      setIsListening(true)
    } catch {
      setSpeechError('Speech recognition could not start. Please try again.')
    }
  }

  const handleEndInterview = async () => {
    setShowEndConfirm(false)
    await completeInterviewAndRedirect('Interview ended by user.')
  }

  if (!hydrated || loadingInterview) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-sky-50 flex flex-col items-center justify-center gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-5 shadow-lg backdrop-blur-sm flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
          <p className="text-slate-700 text-lg">Preparing your interview...</p>
        </div>
      </div>
    )
  }

  if (startError) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-sky-50 flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl">
          <h1 className="text-2xl font-bold text-slate-900">Unable to start interview</h1>
          <p className="mt-3 text-slate-600">{startError}</p>
          <Button
            onClick={() => router.push('/workspace')}
            className="mt-6 bg-sky-600 hover:bg-sky-700 text-white"
          >
            Back to Workspace
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-50 via-white to-sky-50 text-slate-800">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_24%)]" />

      {showBlur && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/35">
          <div className="rounded-full border border-slate-200 bg-white px-8 py-6 text-sky-700 text-6xl font-bold shadow-xl animate-pulse">{countdown}</div>
        </div>
      )}

      <div className="fixed top-4 right-4 z-40 flex gap-2 items-center">
        {timerActive && (
          <div className="bg-rose-50 backdrop-blur-sm px-4 py-2 rounded-xl text-rose-700 font-bold text-lg shadow-lg border border-rose-200">
            {formatTime(timer)}
          </div>
        )}
        <Button
          onClick={() => setIsMuted(!isMuted)}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        <Button
          onClick={() => setShowEndConfirm(true)}
          disabled={showingCorrectAnswer}
          className="bg-rose-500/90 backdrop-blur-sm hover:bg-rose-600 text-white shadow-lg cursor-pointer disabled:opacity-50"
        >
          End Interview
        </Button>
      </div>

      {speechError && (
        <div className="fixed top-20 right-4 z-40 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 shadow-lg backdrop-blur-sm">
          {speechError}
        </div>
      )}

      {fullscreenPrompt && !finished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-6 text-center shadow-2xl">
            <h3 className="text-xl font-semibold text-slate-900">Full screen required</h3>
            <p className="mt-2 text-sm text-slate-600">
              Please return to full screen mode to continue this interview.
            </p>
            <p className="mt-2 text-xs text-amber-600">
              Exit attempts: {fullscreenExitCount}/2
            </p>
            <Button
              onClick={() => void requestInterviewFullscreen()}
              className="mt-5 w-full bg-sky-600 hover:bg-sky-700 text-white"
            >
              Enter Full Screen
            </Button>
          </div>
        </div>
      )}

      {showEndConfirm && !finished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-slate-900 text-center">Are you sure?</h3>
            <p className="text-sm text-slate-600 text-center mt-2">
              Ending now will submit your interview and take you to the completion page.
            </p>
            <div className="mt-6 flex gap-3 hover:cursor-pointer">
              <Button
                onClick={() => setShowEndConfirm(false)}
                variant="outline"
                className="w-1/2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={() => void handleEndInterview()}
                className="w-1/2 bg-rose-500 hover:bg-rose-600 text-white hover:cursor:pointer"
              >
                Yes, End
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex lg:flex-row flex-col min-h-screen">

        {/* LEFT — Bot visual */}
        <div className="relative lg:w-[60%] w-full flex flex-col justify-center items-center p-8">
          {interviewInfo && (
            <div className="text-center mb-4">
              <h1 className="text-3xl lg:text-5xl font-bold text-slate-900">
                {interviewInfo.title || 'Interview Bot'}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Topic: <span className="text-slate-700 font-medium">{interviewInfo.topic.charAt(0).toUpperCase() + interviewInfo.topic.slice(1)}</span>
                &nbsp;•&nbsp;
                Question {Math.min(currentIndex + 1, questions.length)} of {questions.length}
              </p>
            </div>
          )}

          <video
            src="/video@2.mp4"
            className="absolute inset-0 w-full h-full object-cover opacity-5 -z-10"
            autoPlay loop muted playsInline
          />

          <InterviewBot
            isListening={isListening}
            isSpeaking={isSpeaking}
            className="flex-1 flex items-center justify-center"
          />

          <div className="mt-8 flex gap-4">
            <Button
              onClick={handleMicToggle}
              variant={isListening ? 'default' : 'outline'}
              disabled={finished || showingCorrectAnswer || isSpeaking}
              className={`${
                isListening ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-white hover:bg-slate-50'
              } backdrop-blur-sm border-slate-200 text-slate-700 cursor-pointer`}
            >
              {isListening ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
              {isListening ? 'Listening...' : 'Start Speaking'}
            </Button>
          </div>
        </div>

        {/* RIGHT — Chat + answer */}
        <div className="lg:w-[40%] w-full bg-white/80 backdrop-blur-sm border-l border-slate-200 flex flex-col shadow-[-12px_0_40px_rgba(15,23,42,0.04)]">
          <div className="p-4 border-b border-slate-200 bg-white/90">
            <h2 className="text-xl font-semibold text-slate-900">Chat Interface</h2>
            <p className="text-slate-500 text-sm">
              {interviewInfo
                ? `${interviewInfo.topic} Interview  of 30 questions`
                : 'Voice responses with text backup'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`rounded-2xl p-3 border ${msg.role === 'bot' ? 'bg-slate-50 border-slate-200' : 'bg-sky-50 border-sky-200 ml-8'}`}
              >
                <p className="text-xs text-slate-500 mb-1">{msg.role === 'bot' ? 'Bot' : 'You'}</p>
                <p className="text-sm text-slate-800">{msg.text}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {!finished && (
            <div className="p-4 border-t border-slate-200 bg-white/90">
              {showingCorrectAnswer && (
                <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-600 font-semibold mb-1">Correct Answer Feedback</p>
                  <p className="text-sm text-amber-900">Listening to the correct answer...</p>
                </div>
              )}
              <textarea
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitAnswer() }
                }}
                rows={3}
                placeholder="Type your answer here... (Enter to submit)"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 text-sm resize-none outline-none focus:border-sky-400 transition mb-2"
                disabled={submitting || showingCorrectAnswer}
              />
              <Button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim() || submitting || showingCorrectAnswer}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold cursor-pointer disabled:opacity-50"
              >
                {showingCorrectAnswer ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Waiting for feedback...</>
                ) : submitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
                ) : (
                  <><ChevronRight className="w-4 h-4 mr-2" />
                    {currentIndex + 1 < questions.length ? 'Submit & Next Question' : 'Submit & Finish'}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Hide global footer while interview session page is active.
const InterviewPageStyles = () => (
  <style jsx global>{`
    body.interview-mode #contact {
      display: none !important;
    }
  `}</style>
)

export default function InterviewSessionPageWithStyles() {
  return (
    <>
      <InterviewPageStyles />
      <InterviewSessionPage />
    </>
  )
}