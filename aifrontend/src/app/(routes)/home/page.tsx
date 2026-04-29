"use client"

// import { useRef, useState } from "react";
import { SoundWaveAnimation } from "@/components/soud-wave-animattion"
import { Button } from "@/components/button"
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { GradientBackground } from "@/components/gradient-background"
import { useScrollTransform } from "@/components/image";
import { useState } from "react";
import { Menu, PanelRightClose } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "@/components/lib/logo/page";
import AuthModal from "@/components/AuthModal";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";


export default function Home() {
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);



  const { isAuthenticated, user, hydrated } = useAuthStore();
  // console.log("User:", user);
  // console.log("User Avatar:", user?.avatar);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const [leftRef1, leftStyle1] = useScrollTransform({
    fromX: -100, toX: 0, fromRot: -15, toRot: 0
  }) as [React.RefObject<HTMLDivElement>, React.CSSProperties];

  const [leftRef2, leftStyle2] = useScrollTransform({
    fromX: -120, toX: 0, fromRot: -18, toRot: 0
  }) as [React.RefObject<HTMLDivElement>, React.CSSProperties];

  const [rightRef, rightStyle] = useScrollTransform({
    fromX: 100, toX: 0, fromRot: 15, toRot: 0
  }) as [React.RefObject<HTMLDivElement>, React.CSSProperties];

  const [rightRef2, rightStyle2] = useScrollTransform({
    fromX: 120, toX: 0, fromRot: 18, toRot: 0
  }) as [React.RefObject<HTMLDivElement>, React.CSSProperties];

  const handleLogout = async () => {
    await api.logout();
    setProfileOpen(false);
    setMenuOpen(false);
    router.replace("/register");
  };

  // const { isUserLoggedIn } = useAuthStore();

  return (
    <div className="flex min-h-screen flex-col  overflow-x-hidden">
      <GradientBackground />

      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] md:w-3/4 lg:w-1/2 rounded-full shadow-xl border border-white/20 backdrop-blur-lg bg-white/70 transition-all cursor-pointer">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <Logo />
          </div>

          <ul className="hidden md:flex items-center space-x-6 text-lg font-medium">
            <li>
              <a href="#about" className="px-4 py-2 rounded-full transition-all  hover:text-white hover:bg-sky-600">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="px-4 py-2 rounded-full transition-all  hover:text-white hover:bg-sky-600">
                Contact
              </a>
            </li>
            <li>
              <a href="#features" className="px-4 py-2 rounded-full transition-all  hover:text-white hover:bg-sky-600">
                Features
              </a>
            </li>
            <li>
              {hydrated && isAuthenticated && user ? (
                <div className="relative">

                  {/* Avatar Button */}
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-3 px-6 py-2 cursor-pointer"
                    title="User profile menu"
                  >
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-sky-500"
                    />
                  </button>

                  {/* Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl rounded-lg border border-gray-300 py-2 z-50">

                      <div className="px-4 py-2 text-gray-700 font-medium border-b hover:bg-sky-600 transition-all cursor-pointer
                       hover:text-white">
                        <Link href="/feedback">{user.name}</Link>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                      >
                        Logout
                      </button>

                    </div>
                  )}

                </div>
              ) : (
                <button
                  className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:from-sky-600 hover:to-blue-600 transition-all cursor-pointer"
                  onClick={() => {
                    setShowAuth(true);
                    setMenuOpen(false);
                  }}
                >
                  Register
                </button>
              )}
            </li>
          </ul>

          <button
            className="md:hidden text-sky-700 dark:text-sky-300 p-2 rounded-full hover:bg-sky-100 dark:hover:bg-gray-800 transition-all"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <PanelRightClose size={32} /> : <Menu size={32} />}
          </button>
        </div>

        <div
          className={`md:hidden absolute left-0 right-0 top-full bg-white/90 dark:bg-gray-900/90 shadow-xl rounded-b-3xl transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-60 py-4" : "max-h-0 py-0"
            }`}
        >
          <ul className="flex flex-col items-center space-y-3 text-lg font-medium">
            <li>
              <a
                href="#about"
                className="block px-6 py-2 rounded-full hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-gray-800 w-full text-center"
                onClick={() => setMenuOpen(false)}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="block px-6 py-2 rounded-full hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-gray-800 w-full text-center"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="/feature"
                className="block px-6 py-2 rounded-full hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-gray-800 w-full text-center"
                onClick={() => setMenuOpen(false)}
              >
                Feature
              </a>
            </li>
            <li>
              {hydrated && isAuthenticated && user ? (
                <div className="relative">

                  {/* Avatar Button */}
                  <button
                    className="flex items-center gap-3 px-6 py-2 cursor-pointer"
                    onClick={() => setProfileOpen(!profileOpen)}
                    title="avatar"
                  >
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-sky-500"
                    />
                  </button>

                  {/* Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl rounded-lg border border-gray-200 py-2 z-50">

                      <div className="px-4 py-2 text-gray-700 font-medium border-b">
                        {user.name}
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                      >
                        Logout
                      </button>

                    </div>
                  )}

                </div>
              ) : (
                <button
                  className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:from-sky-600 hover:to-blue-600 transition-all cursor-pointer"
                  onClick={() => {
                    setShowAuth(true);
                    setMenuOpen(false);
                  }}
                >
                  Register
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        mode="modal"
      />

      <main className="flex-1 sm:mt-30 mt-40 ">
        <section className="flex justify-center items-center space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 overflow-hidden">
          <SoundWaveAnimation className="top-1/2 -translate-y-1/2" />
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center relative z-10">
            <div className="rounded-full bg-blue-100 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-blue-700 border border-primary/20">
              Introducing Wavelength
            </div>
            <div className="hero-glow">
              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl  text-blue-500">
                AI that senses skills, strengths, weaknesses.
              </h1>
            </div>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 glass-effect p-4 rounded-lg">
              Experience real-time AI analysis, smart content optimization, predictive trend insights, and a powerful advanced analytics dashboard—all in one intelligent interview platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 cursor-pointer" asChild>
                <Link href="/workspace">
                  Start Interview <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" className="glass-button hover:bg-blue-600 cursor-pointer" asChild>
                <Link href="/feedback">View Your Progress</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-36 px-4 sm:px-6 lg:px-8 pb-24 pt-10 md:pb-32">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-4xl border border-sky-200/70 bg-white/95 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:p-10">
            <div className="absolute inset-x-6 top-6 h-px bg-linear-to-r from-transparent via-sky-400/70 to-transparent" />
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-sm font-medium text-sky-700 shadow-sm">
                  About the product
                </div>
                <div className="space-y-4">
                  <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-slate-900">
                    One interview platform that listens, analyzes, and guides every step.
                  </h2>
                  <p className="max-w-2xl text-base sm:text-lg leading-8 text-slate-600">
                    Wavelength combines live AI evaluation, structured workspace management, and instant feedback so
                    candidates can practice smarter and teams can review performance with confidence. It brings skill
                    signals, strengths, gaps, and progress tracking into one focused product experience.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-sky-50 to-white p-4 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.2em] text-sky-600">Live AI</p>
                    <p className="mt-2 text-sm text-slate-600">Continuous analysis during interviews and practice sessions.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-emerald-50 to-white p-4 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.2em] text-emerald-600">Smart Feedback</p>
                    <p className="mt-2 text-sm text-slate-600">Clear recommendations that highlight strengths and weak spots.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-violet-50 to-white p-4 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.2em] text-violet-600">Progress</p>
                    <p className="mt-2 text-sm text-slate-600">Track improvement across sessions in one shared workspace.</p>
                  </div>
                </div>
              </div>

              <div className="relative min-h-80 overflow-hidden rounded-[1.75rem] border border-sky-200 bg-linear-to-br from-sky-50 via-white to-indigo-50">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.14),transparent_30%)]" />
                <SoundWaveAnimation className="left-0 top-1/2 h-full -translate-y-1/2 opacity-85" />
                <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-8">
                  <div className="max-w-sm space-y-3 rounded-3xl border border-white/70 bg-white/85 p-5 shadow-lg backdrop-blur-md">
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-sky-600">AI insight layer</p>
                    <p className="text-sm leading-6 text-slate-600">
                      The animated waveform represents the product’s live reasoning engine: it captures signals,
                      interprets responses, and turns every session into actionable feedback.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* // Features Section */}


        <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-32 overflow-hidden">
            <h1 className="font-bold text-[4rem] sm:text-[5rem] lg:text-[10rem] text-transparent  bg-clip-text bg-gradient-to-r from-blue-700 via-white to-blue-500">Features</h1>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20 overflow-hidden">
              <div
                ref={leftRef1}
                style={leftStyle1}
                className="w-full lg:w-1/2 transition-all duration-700 ease-out max-w-full"
              >
                <div className="relative group max-w-full">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <Image
                    src="/first.png"
                    alt="AI illustration"
                    width={600}
                    height={450}
                    className="relative rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500 max-w-full h-auto"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                 AI-Powered Interview Generation
                </h2>
                <p className="text-xl sm:text-2xl text-gray-400 leading-relaxed">
                Effortlessly generate high-quality, topic-specific interview questions using 
                advanced AI, helping you prepare smarter and faster without manual effort.
                </p>
              </div>
            </div>


            <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-16 lg:gap-20 overflow-hidden">
              <div
                ref={rightRef}
                style={rightStyle}
                className="w-full lg:w-1/2 transition-all duration-700 ease-out max-w-full"
              >
                <div className="relative group max-w-full">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <Image
                    src="/second.png"
                    alt="AI illustration"
                    width={600}
                    height={450}
                    className="relative rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500 max-w-full h-auto"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                 Real-Time AI Evaluation & Feedback
                </h2>
                <p className="text-xl sm:text-2xl text-gray-400 leading-relaxed">
                 Receive instant AI-driven evaluation for every response, including correctness, detailed explanations,
                  and improved answers to accelerate your learning.
                </p>
              </div>
            </div>


            <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20 overflow-hidden">
              <div
                ref={leftRef2}
                style={leftStyle2}
                className="w-full lg:w-1/2 transition-all duration-700 ease-out max-w-full"
              >
                <div className="relative group max-w-full">
                  <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <Image
                    src="/third.png"
                    alt="AI illustration"
                    width={600}
                    height={450}
                    className="relative rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500 max-w-full h-auto"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                 Advanced Performance Analytics
                </h2>
                <p className="text-xl sm:text-2xl text-gray-400 leading-relaxed">
                 Gain deep insights into your performance with accuracy tracking, weak topic 
                 identification, and progress monitoring across multiple interviews.
                </p>
              </div>
            </div>


            <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-16 lg:gap-20 overflow-hidden">
              <div
                ref={rightRef2}
                style={rightStyle2}
                className="w-full lg:w-1/2 transition-all duration-700 ease-out max-w-full"
              >
                <div className="relative group max-w-full">
                  <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <Image
                    src="/four.png"
                    alt="AI illustration"
                    width={600}
                    height={450}
                    className="relative rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500 max-w-full h-auto"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 text-transparent bg-clip-text bg-gradient-to-r  from-blue-400 to-purple-600">
                  Seamless Workspace & Interview Management
                </h2>
                <p className="text-xl sm:text-2xl text-gray-400 leading-relaxed">
                 Organize, manage, and share your interviews efficiently within structured workspaces designed for smooth collaboration and easy access.
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>

    </div>
  )
}
