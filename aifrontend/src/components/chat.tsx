'use client';
import { fakeQAData } from "@/Api/fakedata";
import Image from "next/image";

export const Chat = () => {
    return (
        <div className="overflow-y-auto max-h-screen p-4">
            <h1 className=" flex justify-center items-center font-semibold text-[3rem] mt-5
                                 text-transparent  bg-clip-text bg-gradient-to-r from-blue-200 via-slate-600 to-blue-300">Chat</h1>
            {fakeQAData.map((item) => (
                <div key={item.id} className="mb-4 p-2">
                    <h2 className="font-bold flex space-x-1 shadow rounded-3xl p-4 m-2 text-lg">
                        <div>{item.id}.</div>
                        <div className="text-lg">{item.question}</div>
                    </h2>
                    <div className=" space-y-2 p-4  rounded-lg">
                        <p className="flex flex-row space-x-2 p-2 bg-blue-200 rounded-2xl"><Image src="/man.png" alt="assiant" width={20} height={20} className="w-[10%] h-[5%]" /><div className="text-lg">{item.userAnswer}</div></p>
                        <p className="flex flex-row space-x-2 p-2 bg-blue-500 rounded-2xl"><Image src="/assistant.png" alt="assiant" width={25} height={25} className="w-[10%] h-[15%]" /><div className="text-lg">{item.botAnswer}</div></p>
                    </div>
                </div>
            ))}
        </div>
    )
}