

"use client"

import Image from "next/image"
import { useState } from "react"
import { ArrowRight, CheckCircle, Clock, FileText } from "lucide-react"

export default function Home() {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
     
      <nav className="sticky top-0 z-50 bg-gray-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold mb-4 md:mb-0">AI Interview Tool</div>
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
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Welcome to the AI Interview Tool</h1>
            <Image
              src="/ai.webp"
              alt="AI Interview Assistant"
              width={500}
              height={500}
              className="mx-auto mt-10 transition-transform duration-300 transform hover:translate-y-[-10px]"
              priority
            />
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
                It's not just about <span className="text-pink-600 font-semibold">getting things done</span> — it's
                about <span className="px-1 font-bold">learning how</span> it's done.
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
