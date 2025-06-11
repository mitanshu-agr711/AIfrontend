'use client'

import Image from 'next/image'
import { Chat } from '@/components/chat'
import { GradientBackground } from "@/components/gradient-background"

const InterviewPage = () => {
    return (
        <>
            <GradientBackground />
            <div className='flex sm:flex-row flex-col'>
                <div className="relative sm:bg-black sm:min-h-screen  sm:w-[90%] ">
                    <h1 className="relative z-10 flex justify-center items-center text-[3rem] lg-text-[5rem] 
                    font-semibold text-transparent  bg-clip-text  bg-sky-600 sm:bg-gradient-to-r from-blue-700 via-white to-blue-500 mb-5">
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
                        className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  w-1/4 sm:w-1/5 md:w-1/4 mt-20 sm:mt-0" 
                    />
                </div>
                <div className="w-full sm:w-[60%] lg:w-[40%]  mt-15">
                    
                    <Chat />
                </div>

            </div>
        </>
    )
}

export default InterviewPage
