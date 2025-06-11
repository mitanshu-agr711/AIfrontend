'use client';
import { fakeQAData } from "@/lib/fakedata";
import Image from "next/image";

export const Chat = () => {
    return (
        <div className="overflow-y-auto h-[80vh] p-4">
            {fakeQAData.map((item) => (
                <div key={item.id} className="mb-4 p-2">
                    <h2 className="font-bold flex space-x-1 shadow rounded-3xl p-4 m-2">
                        <div>{item.id}</div>
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