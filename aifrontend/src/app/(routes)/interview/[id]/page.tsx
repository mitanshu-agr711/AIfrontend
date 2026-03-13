'use client'

import { useEffect, useState, useRef } from 'react'
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

const InterviewSessionPage = () => {
  const params = useParams()
  const router = useRouter()
  const interviewId = params.id as string

  const { isAuthenticated, hydrated } = useAuthStore()

  const [interviewInfo, setInterviewInfo] = useState<InterviewInfo | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [chatLog, setChatLog] = useState<ChatMessage[]>([])
  const [userAnswer, setUserAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loadingInterview, setLoadingInterview] = useState(true)
  const [startTime, setStartTime] = useState<number>(Date.now())

  const [showBlur, setShowBlur] = useState(true)
  const [countdown, setCountdown] = useState(3)
  const [timer, setTimer] = useState(600)
  const [timerActive, setTimerActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [finished, setFinished] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)

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
    if (!hydrated || !isAuthenticated || !interviewId) return

    const startInterview = async () => {
      try {
        setLoadingInterview(true)
        const result = await api.startInterview(interviewId) as {
          interview: InterviewInfo
          questions: Question[]
        }
        setInterviewInfo(result.interview)
        const normalizedQuestions = (result.questions || []).map((q) => ({
          ...q,
          id: q.id || q._id || q.questionId,
        }))
        setQuestions(normalizedQuestions)
        if (normalizedQuestions.length > 0) {
          setChatLog([{ role: 'bot', text: normalizedQuestions[0].question }])
          setIsSpeaking(true)
          setTimeout(() => setIsSpeaking(false), 2000)
        }
      } catch (err) {
        console.error('Failed to start interview:', err)
      } finally {
        setLoadingInterview(false)
      }
    }

    startInterview()
  }, [hydrated, isAuthenticated, interviewId])

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
  if (timer === 0 && !finished) {
    const autoSubmitInterview = async () => {
      try {
        setFinished(true)

        setChatLog(prev => [
          ...prev,
          { role: 'bot', text: '⏰ Time is up! Submitting your interview automatically.' }
        ])

        await api.completeInterview(interviewId)

        router.push(`/interview-complete?interviewId=${interviewId}`)
      } catch (err) {
        console.error('Auto submit failed:', err)
      }
    }

    autoSubmitInterview()
  }
}, [timer, finished, interviewId, router])

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
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
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
    setStartTime(Date.now())

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
        try { await api.completeInterview(interviewId) } catch { /* ignore */ }
        router.push(`/interview-complete?interviewId=${interviewId}`)
      }, 2500)
    }
  }

  const handleEndInterview = async () => {
    try { await api.completeInterview(interviewId) } catch { /* ignore */ }
    router.push(`/interview-complete?interviewId=${interviewId}`)
  }

  if (!hydrated || loadingInterview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
        <p className="text-white/70 text-lg">Preparing your interview...</p>
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
          onClick={handleEndInterview}
          className="bg-red-500/90 backdrop-blur-sm hover:bg-red-600 text-white shadow-lg cursor-pointer"
        >
          End Interview
        </Button>
      </div>

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
              onClick={() => setIsListening(prev => !prev)}
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

export default InterviewSessionPage