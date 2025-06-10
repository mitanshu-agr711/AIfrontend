'use client'

import Image from 'next/image'


const InterviewPage = () => {
  return (
    <>
    <div className='flex flex-row'>
    <div className="relative bg-black min-h-screen  w-[90%]">
         <h1 className="relative z-10 flex justify-center items-center text-[5rem] font-semibold text-white">
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
      <div className="w-1/3 bg-slate-500">
        <h1 className='flex justify-center item font-semibold text-[2rem]'>Chat</h1>
      </div>
      </div>
    </>
  )
}

export default InterviewPage
