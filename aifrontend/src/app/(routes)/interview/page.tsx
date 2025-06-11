'use client'

import Image from 'next/image'
import { Chat } from '@/components/chat'
const InterviewPage = () => {
    return (
        <>
            <div className='flex flex-row'>
                <div className="relative bg-black min-h-screen  w-[90%]">
                    <h1 className="relative z-10 flex justify-center items-center text-[5rem] font-semibold text-transparent  bg-clip-text bg-gradient-to-r from-blue-700 via-white to-blue-500">
                        Interview Bot
                    </h1>
                    <video
                        src="/video@2.mp4"
                        className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
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
                        className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    />
                </div>
                <div className="w-[40%] bg-slate-200">
                    <h1 className="flex justify-center items-center font-semibold text-[3rem] mt-5
                     text-transparent  bg-clip-text bg-gradient-to-r from-blue-200 via-slate-600 to-blue-300">Chat</h1>
                    <Chat />
                </div>

            </div>
        </>
    )
}

export default InterviewPage
