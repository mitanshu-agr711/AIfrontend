
"use client"
// import { FlickeringGrid } from "@/components/magicui/flickering-grid"
// import Image from "next/image"
import Logo from "../../../lib/logo/page"
import { useRef, useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Clock, FileText } from "lucide-react"

export default function Home() {
  //   const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col ">

      <nav className="sticky top-0 z-50 bg-gray-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold mb-4 md:mb-0"><Logo /> AI Interview Tool</div>
            <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
              <li>
                <a href="/about" className="hover:text-blue-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-blue-400 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-blue-400 transition-colors">
                  Services
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {/* <section className="relative py-16 overflow-hidden">

        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <FlickeringGrid
            className="w-full h-full [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
            squareSize={4}
            gridGap={6}
            color="#60A5FA"
            maxOpacity={0.5}
            flickerChance={0.1}
            width={size.width}
            height={size.height}
          />
        </div>
       
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            Welcome to the AI Interview Tool
          </h1>
          <div className="flex justify-center items-center mt-10 gap-0">
            <div className="wave-hand">
              <Image
                src="/hand.png"
                alt="Hand"
                width={150}
                height={300}
                priority
              />
            </div>


            <Image
              src="/robot.png"
              alt="Robot"
              width={250}
              height={500}
              priority
            />
          </div>

        </div>
      </section> */}
      <section className="w-full">

        {/* writing heading */}
        <div>
          <p className="text-[6rem]  font-bold text-center mt-10">
            Challenge Yourself. 
          </p>
          <div className="text-[6rem] font-bold text-center">Conquer Tomorrow.</div>

        </div>

      </section>
      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Practice with AI?</h2>
          <div className="max-w-3xl mx-auto  p-8 rounded-xl shadow-lg">
            <p className="text-lg leading-relaxed space-y-4">
              <span className="block">
                While actual <span className="text-blue-600 font-semibold">AI gives you answers</span>, practicing with
                AI helps you understand the <span className=" px-1 font-bold">why</span> behind them.
              </span>

              <span className="block">
                Its not just about <span className="text-pink-600 font-semibold">getting things done</span> — its
                about <span className="px-1 font-bold">learning how</span> its done.
              </span>

              <span className="block">
                You develop <span className="text-cyan-600 font-semibold">critical thinking</span>, refine your
                approach, and truly grasp the
                <span className="text-purple-600 font-semibold"> logic behind decisions</span>.
              </span>

              <span className="block">
                You also <span className="text-rose-600 font-semibold">check your progress</span>,
                <span className="text-lime-600 font-semibold"> increase your confidence</span>, and build
                <span className="text-orange-600 font-semibold"> independence</span> — skills no tool can replace.
              </span>

              <span className="block mt-6 italic text-center">
                <span className="text-sky-600 font-medium block">Train with AI, not just on AI.</span>
                <span className="text-indigo-600 font-medium">
                  Practice makes precision — and AI is your smartest partner.
                </span>
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How to Get Started</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Follow these simple steps to begin your AI interview practice journey and boost your career prospects.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">

            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-400">1. Create Your Account</h3>
                <p className="text-gray-600">
                  Your journey starts with a simple registration — create your profile to track progress and save your
                  practice sessions.
                </p>
              </div>
            </div>


            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-400">2. Add Job Details</h3>
                <p className="text-gray-600">
                  Provide details about your desired job role, position, and career focus to get tailored interview
                  questions.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-400">3. Start Practicing</h3>
                <p className="text-gray-600">
                  Begin your interview simulation with our AI interviewer and receive instant feedback to improve your
                  responses.
                </p>
              </div>
            </div>
          </div>

          <section className="py-16 ">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">The Transformation Journey</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Before Column */}
                <div className="bg-gray-100 rounded-xl shadow-md p-6 relative">
                  <div className="absolute top-0 left-0 bg-red-500 text-white px-4 py-2 rounded-tl-xl font-bold">
                    BEFORE
                  </div>
                  <h3 className="text-xl font-bold mt-8 mb-4 text-red-600">Before Practice with AI</h3>
                  <ul className="space-y-3 text-black">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>Uncertain responses with frequent pauses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>Limited technical vocabulary and explanations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>Difficulty handling unexpected questions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>Lack of structured thought process</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>Anxiety and nervousness during interviews</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>Missed opportunities to highlight achievements</span>
                    </li>
                  </ul>
                </div>

                {/* After Column */}
                <div className="bg-gray-100 rounded-xl shadow-md p-6 relative">
                  <div className="absolute top-0 left-0 bg-green-500 text-white px-4 py-2 rounded-tl-xl font-bold">
                    AFTER
                  </div>
                  <h3 className="text-xl font-bold mt-8 mb-4 text-green-600">After Practice with AI</h3>
                  <ul className="space-y-3 text-black">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Confident, clear, and concise communication</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Rich industry-specific vocabulary and examples</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Adaptability to challenging and unexpected questions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Logical and structured response framework</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Calm and composed interview presence</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Strategic highlighting of relevant accomplishments</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center mt-12">
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  Our users report an average of <span className="font-bold text-green-600">70% improvement</span> in
                  interview confidence and <span className="font-bold text-green-600">40% higher</span> success rate in job
                  applications after practicing with our AI interview tool.
                </p>
              </div>
            </div>
          </section>



          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full inline-flex items-center transition-colors">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>


      <footer className="bg-gray-900 text-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} AI Interview Tool. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="/terms" className="hover:text-blue-400 transition-colors">
                Terms
              </a>
              <a href="/privacy" className="hover:text-blue-400 transition-colors">
                Privacy
              </a>
              <a href="/faq" className="hover:text-blue-400 transition-colors">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
