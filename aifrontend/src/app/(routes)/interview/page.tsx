'use client'

import { useEffect, useState } from 'react'
import InterviewBot from '@/components/InterviewBot'
import { Button } from '@/components/button'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'

const InterviewPage = () => {
    const [showBlur, setShowBlur] = useState(true)
    const [timer, setTimer] = useState(600)
    const [timerActive, setTimerActive] = useState(false)
    const [countdown, setCountdown] = useState(3)
    
   
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isMuted, setIsMuted] = useState(false)

    useEffect(() => {
        if (!showBlur) return
        if (countdown === 0) {
            setShowBlur(false)
            setCountdown(3)
            return
        }

        const interval = setInterval(() => {
            setCountdown(prev => prev - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [showBlur, countdown])

    useEffect(() => {
        const blurTimeout = setTimeout(() => {
            setShowBlur(false)
            setTimerActive(true)
        }, 3000)
        return () => clearTimeout(blurTimeout)
    }, [])

    useEffect(() => {
        if (!timerActive) return
        if (timer <= 0) return

        const interval = setInterval(() => {
            setTimer(prev => prev - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [timerActive, timer])

    const formatTime = (seconds: number): string => {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0')
        const s = String(seconds % 60).padStart(2, '0')
        return `${m}:${s}`
    }

    
    const handleBotSpeaking = (speaking: boolean) => {
        setIsSpeaking(speaking)
        if (speaking) setIsListening(false)
    }

    const handleUserSpeaking = (listening: boolean) => {
        setIsListening(listening)
        if (listening) setIsSpeaking(false)
    }

    const toggleMute = () => {
        setIsMuted(!isMuted)
    }

    const endInterview = () => {
        
        console.log('Interview ended')
    }

    return (
        <div className='min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
            {showBlur && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-all">
                    <div className="text-white text-6xl font-bold animate-pulse">
                        <span>{countdown}</span>
                    </div>
                </div>
            )}

          
            <div className="fixed top-4 right-4 z-40 flex gap-2">
                {timerActive && (
                    <div className="bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-xl text-white font-bold text-lg shadow-lg">
                        {formatTime(timer)}
                    </div>
                )}
                
                <Button
                    onClick={toggleMute}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>

                <Button
                    onClick={endInterview}
                    className="bg-red-500/90 backdrop-blur-sm hover:bg-red-600 text-white shadow-lg"
                >
                    End Interview
                </Button>
            </div>

            <div className='flex lg:flex-row flex-col min-h-screen'>
               
                <div className="relative lg:w-[60%] w-full flex flex-col justify-center items-center p-8">
                    <h1 className="text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 mb-8 text-center">
                        Interview Bot
                    </h1>
                    
                  
                    <video
                        src="/video@2.mp4"
                        className="absolute inset-0 w-full h-full object-cover opacity-10 -z-10"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />

                    <InterviewBot 
                        isListening={isListening}
                        isSpeaking={isSpeaking}
                        className="flex-1 flex items-center justify-center"
                    />

                 
                    <div className="mt-8 flex gap-4">
                        <Button
                            onClick={() => handleUserSpeaking(!isListening)}
                            variant={isListening ? "default" : "outline"}
                            className={`${
                                isListening 
                                    ? "bg-emerald-500 hover:bg-emerald-600" 
                                    : "bg-white/10 hover:bg-white/20"
                            } backdrop-blur-sm border-white/20 text-white`}
                        >
                            {isListening ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
                            {isListening ? "Listening..." : "Start Speaking"}
                        </Button>

                        <Button
                            onClick={() => handleBotSpeaking(!isSpeaking)}
                            variant="outline"
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20 text-white"
                        >
                            {isSpeaking ? "Stop Bot" : "Bot Speak"}
                        </Button>
                    </div>
                </div>

              
                <div className="lg:w-[40%] w-full bg-white/5 backdrop-blur-sm border-l border-white/10 flex flex-col">
                    <div className="p-4 border-b border-white/10">
                        <h2 className="text-xl font-semibold text-white">Chat Interface</h2>
                        <p className="text-white/70 text-sm">Voice responses with text backup</p>
                    </div>
                    
                    <div className="flex-1 overflow-hidden p-4">
                        <div className="text-white">
                          
                            <div className="space-y-4">
                                <div className="bg-white/10 rounded-lg p-3">
                                    <p className="text-sm text-white/80">Bot: Hello! I'm ready to start your interview.</p>
                                </div>
                                <div className="bg-blue-500/20 rounded-lg p-3 ml-8">
                                    <p className="text-sm text-white/80">You: Hi, I'm ready too.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InterviewPage