// import SideBar from '../../../slider/page';
import Image from "next/image";
import { useState } from "react";

const Home = () => {
    // const [animate, setAnimate] = useState(false);

    return (
        <>
            <nav>
                {/* <SideBar/> */}

                <ul className="flex gap-8 justify-center items-center bg-gray-800 text-white p-4">
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/services">Services</a></li>
                </ul>
                  </nav>
                <Image
                    src="/talk.webp"
                    alt="AI Image"
                    width={700}
                    height={700}
                    className="mx-auto mt-10 transition-transform duration-300 transform hover:scale-105 hover:translate-y-[-10px]"

                // className={`mx-auto mt-10 ${animate ? 'rotate-y-once' : ''}`}
                // onMouseEnter={() => setAnimate(true)}
                // onAnimationEnd={() => setAnimate(false)}
                />

                <h1 className="text-center text-3xl font-bold mt-5">Welcome to the AI Interview Tool</h1>

                {/* <h2 className="font-bold m-7 text-yellow-300 ">  Practicing with AI builds your mind, not just your results.</h2> */}

                <div className="flex m-15">
                    <div className=" w-11/12 md:w-3/4 lg:w-1/2 ">
                        <h2 className="font-bold m-7 text-yellow-300 text-shadow-amber-50 text-2xl">  Practicing with AI builds your mind, not just your results.</h2>
                        <p className="text-amber-50 text-lg leading-relaxed ml-4 p-6 rounded-xl shadow-md">
                            While actual <span className="text-blue-400 font-semibold">AI gives you answers</span>, practicing with AI helps you understand the <strong className="text-green-400">why</strong> behind them.
                            <br />
                            It’s not just about <span className="text-pink-400 font-semibold">getting things done</span> — it’s about <strong className="text-yellow-300">learning how</strong> it's done.
                            <br />
                            You develop <span className="text-cyan-400">critical thinking</span>, refine your approach, and truly grasp the <span className="text-purple-400">logic behind decisions</span>.
                            <br />
                            You also <span className="text-rose-400">check your progress</span>, <span className="text-lime-400">increase your confidence</span>, and build <span className="text-orange-300">independence</span> — skills no tool can replace.
                            <br /><br />
                            <em className="text-sky-400 font-medium">Train with AI, not just on AI.</em>
                            <br />
                            <em className="text-indigo-300 font-medium">Practice makes precision — and AI is your smartest partner.</em>
                        </p>


                    </div>
                    <Image
                        src="/talk.webp"
                        alt="AI Image"
                        width={300}
                        height={300}
                        className="mx-auto w-1/2 m-2"
                    />
                </div>
                
                <section>
                    
                </section>
                {/* <ul className="max-w-xl mx-auto mt-10 space-y-6">
                    <li className="flex items-start gap-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                            1
                        </span>
                        <p className="text-gray-800 text-lg font-medium">Make your account</p>
                    </li>

                    <li className="flex items-start gap-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                            2
                        </span>
                        <p className="text-gray-800 text-lg font-medium">
                            Provide basic information related to the job role and position
                        </p>
                    </li>

                    <li className="flex items-start gap-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                            3
                        </span>
                        <p className="text-gray-800 text-lg font-medium">Upload your resume</p>
                    </li>
                </ul>

                <div className="flex justify-center mt-5">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Get Started</button>
                </div> */}

          
        </>
    )
}

export default Home;