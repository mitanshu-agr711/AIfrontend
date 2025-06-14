'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Chat } from '@/components/chat'
import { GradientBackground } from "@/components/gradient-background"

const InterviewPage = () => {

    const [showBlur, setShowBlur] = useState(true)
    const [timer, setTimer] = useState(600)
    const [timerActive, setTimerActive] = useState(false)
    const [countdown, setCountdown] = useState(3)


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

    return (
        <div className='max-h-screen relative'>
            <GradientBackground />

            {showBlur && (
                <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-md transition-all">
                    <div className="text-white text-6xl font-bold">
                        <span>{countdown}</span>
                    </div>
                </div>
            )}


            <div className='flex sm:flex-row flex-col'>
                <div className="relative sm:bg-black sm:min-h-screen  sm:w-[90%] ">
                    <h1 className="relative z-10 flex justify-center items-center text-[3rem] lg-text-[5rem] 
                    font-semibold text-transparent  bg-clip-text  bg-sky-600 sm:bg-gradient-to-r from-blue-700 via-white to-blue-500 mb-20
                     mt-15 ">
                        Interview Bot
                    </h1>
                    <video
                        src="/video@2.mp4"
                        className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden sm:block"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                    <Image
                        src="/black_ball.png"
                        alt="Black Ball"
                        width={300}
                        height={300}
                        className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  w-1/4 sm:w-1/5 md:w-1/4 mt-20 sm:mt-0 "
                    />
                </div>

                <div className="w-full sm:w-[60%] lg:w-[40%] mt-15   flex flex-col">

                    <button className='fixed top-0 bg-red-400 p-3 w-1/5 sm:w-[10%] md:w-[8%] rounded-3xl right-0 m-2 font-bold text-lg shadow-lg text-amber-50 hover:bg-red-500 cursor-pointer'>End</button>
                    {timerActive && (
                        <div className="fixed top-0 p-3 bg-red-600 w-3/12 sm:w-[10%] md:w-[10%] flex justify-center rounded-3xl m-2 text-amber-50
        font-bold text-lg shadow-lg">
                            {formatTime(timer)}
                        </div>
                    )}

                    <Chat />
                </div>
            </div>
        </div>
    )
}

export default InterviewPage
