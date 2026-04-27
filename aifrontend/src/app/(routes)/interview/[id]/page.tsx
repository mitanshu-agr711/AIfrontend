'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import InterviewBot from '@/components/InterviewBot'
import { Button } from '@/components/button'
import { Mic, MicOff, Volume2, VolumeX, ChevronRight, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'

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

  const chatEndRef = useRef<HTMLDivElement>(null)
  const interviewSubmittedRef = useRef(false)
  const fullscreenExitCountRef = useRef(0)
  const speechRecognitionRef = useRef<SpeechRecognitionInstance | null>(null)

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
          setChatLog([{ role: 'bot', text: normalizedQuestions[0].question }])
          setQuestionStartTime(Date.now())
          setIsSpeaking(true)
          setTimeout(() => setIsSpeaking(false), 2000)
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

    startInterview()
  }, [hydrated, interviewId, router])

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

    // Give backend time to process data (500ms delay)
    await new Promise(resolve => setTimeout(resolve, 500))
    
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

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || submitting || !questions[currentIndex]) return

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

    try {
      setSubmitting(true)
      await api.submitAnswer({
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

    const nextIndex = currentIndex + 1
    setQuestionStartTime(Date.now())

    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex)
      setChatLog(prev => [...prev, { role: 'bot', text: questions[nextIndex].question }])
      setIsSpeaking(true)
      setTimeout(() => setIsSpeaking(false), 2000)
    } else {
      setChatLog(prev => [...prev, { role: 'bot', text: 'All questions completed! Great job. Ending the interview now.' }])
      setFinished(true)
      setIsSpeaking(true)
      setTimeout(async () => {
        setIsSpeaking(false)
        await completeInterviewAndRedirect()
      }, 2500)
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
        <p className="text-white/70 text-lg">Preparing your interview...</p>
      </div>
    )
  }

  if (startError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-2xl border border-white/20 bg-slate-900/85 p-8 text-center shadow-2xl">
          <h1 className="text-2xl font-bold text-white">Unable to start interview</h1>
          <p className="mt-3 text-white/70">{startError}</p>
          <Button
            onClick={() => router.push('/workspace')}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Workspace
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">

      {showBlur && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="text-white text-6xl font-bold animate-pulse">{countdown}</div>
        </div>
      )}

      <div className="fixed top-4 right-4 z-40 flex gap-2 items-center">
        {timerActive && (
          <div className="bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-xl text-white font-bold text-lg shadow-lg">
            {formatTime(timer)}
          </div>
        )}
        <Button
          onClick={() => setIsMuted(!isMuted)}
          variant="outline"
          size="sm"
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        <Button
          onClick={() => setShowEndConfirm(true)}
          className="bg-red-500/90 backdrop-blur-sm hover:bg-red-600 text-white shadowF-lg cursor-pointer"
        >
          End Interview
        </Button>
      </div>

      {speechError && (
        <div className="fixed top-20 right-4 z-40 rounded-xl border border-amber-400/30 bg-amber-500/15 px-4 py-2 text-sm text-amber-100 shadow-lg backdrop-blur-sm">
          {speechError}
        </div>
      )}

      {fullscreenPrompt && !finished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-slate-900/95 p-6 text-center shadow-2xl">
            <h3 className="text-xl font-semibold text-white">Full screen required</h3>
            <p className="mt-2 text-sm text-white/70">
              Please return to full screen mode to continue this interview.
            </p>
            <p className="mt-2 text-xs text-amber-300">
              Exit attempts: {fullscreenExitCount}/2
            </p>
            <Button
              onClick={() => void requestInterviewFullscreen()}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Enter Full Screen
            </Button>
          </div>
        </div>
      )}

      {showEndConfirm && !finished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-white text-center">Are you sure?</h3>
            <p className="text-sm text-white/70 text-center mt-2">
              Ending now will submit your interview and take you to the completion page.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => setShowEndConfirm(false)}
                variant="outline"
                className="w-1/2 border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={() => void handleEndInterview()}
                className="w-1/2 bg-red-500 hover:bg-red-600 text-white hover:cursor:pointer"
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
              <h1 className="text-3xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400">
                {interviewInfo.title || 'Interview Bot'}
              </h1>
              <p className="text-white/60 text-sm mt-1">
                Topic: <span className="text-white/90 font-medium">{interviewInfo.topic.charAt(0).toUpperCase() + interviewInfo.topic.slice(1)}</span>
                &nbsp;•&nbsp;
                Question {Math.min(currentIndex + 1, questions.length)} of {questions.length}
              </p>
            </div>
          )}

          <video
            src="/video@2.mp4"
            className="absolute inset-0 w-full h-full object-cover opacity-10 -z-10"
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
              disabled={finished}
              className={`${
                isListening ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-white/10 hover:bg-white/20'
              } backdrop-blur-sm border-white/20 text-white cursor-pointer`}
            >
              {isListening ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
              {isListening ? 'Listening...' : 'Start Speaking'}
            </Button>
          </div>
        </div>

        {/* RIGHT — Chat + answer */}
        <div className="lg:w-[40%] w-full bg-white/5 backdrop-blur-sm border-l border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Chat Interface</h2>
            <p className="text-white/60 text-sm">
              {interviewInfo
                ? `${interviewInfo.topic} Interview • ${interviewInfo.totalQuestions} questions`
                : 'Voice responses with text backup'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`rounded-lg p-3 ${msg.role === 'bot' ? 'bg-white/10' : 'bg-blue-500/20 ml-8'}`}
              >
                <p className="text-xs text-white/50 mb-1">{msg.role === 'bot' ? 'Bot' : 'You'}</p>
                <p className="text-sm text-white/90">{msg.text}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {!finished && (
            <div className="p-4 border-t border-white/10">
              <textarea
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitAnswer() }
                }}
                rows={3}
                placeholder="Type your answer here... (Enter to submit)"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 text-sm resize-none outline-none focus:border-blue-400 transition mb-2"
                disabled={submitting}
              />
              <Button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim() || submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
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