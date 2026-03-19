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
              <a href="/about" className="px-4 py-2 rounded-full transition-all  hover:text-white hover:bg-sky-600">
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
                href="/about"
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
                    src="/ai.webp"
                    alt="AI illustration"
                    width={600}
                    height={450}
                    className="relative rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500 max-w-full h-auto"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  Real-Time AI Analysis
                </h2>
                <p className="text-xl sm:text-2xl text-gray-400 leading-relaxed">
                  Harness the power of advanced AI to analyze social media trends in real-time. Our intelligent system
                  processes millions of data points to give you actionable insights that drive engagement and growth.
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
                    src="/ai.webp"
                    alt="AI illustration"
                    width={600}
                    height={450}
                    className="relative rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500 max-w-full h-auto"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  Smart Content Optimization
                </h2>
                <p className="text-xl sm:text-2xl text-gray-400 leading-relaxed">
                  Transform your content strategy with AI-powered optimization. Our platform adapts your messaging
                  for each social media platform, ensuring maximum reach and engagement across all channels.
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
                    src="/ai.webp"
                    alt="AI illustration"
                    width={600}
                    height={450}
                    className="relative rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500 max-w-full h-auto"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  Predictive Trend Analysis
                </h2>
                <p className="text-xl sm:text-2xl text-gray-400 leading-relaxed">
                  Stay ahead of the curve with our predictive analytics. Identify emerging trends before they go viral
                  and position your brand at the forefront of social media conversations.
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
                    src="/ai.webp"
                    alt="AI illustration"
                    width={600}
                    height={450}
                    className="relative rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500 max-w-full h-auto"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 text-transparent bg-clip-text bg-gradient-to-r  from-blue-400 to-purple-600">
                  Advanced Analytics Dashboard
                </h2>
                <p className="text-xl sm:text-2xl text-gray-400 leading-relaxed">
                  Get comprehensive insights with our intuitive dashboard. Track performance metrics, audience sentiment,
                  and engagement patterns with beautiful visualizations and actionable recommendations.
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>

    </div>
  )
}
