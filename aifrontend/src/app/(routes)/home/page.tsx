
"use client"

import Logo from "../../../lib/logo/page"
import { useRef, useState, useEffect } from "react";
import { Menu, PanelRightClose } from "lucide-react";
import { SoundWaveAnimation } from "../../../components/soud-wave-animattion"
import { Button } from "../../../components/button"
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { GradientBackground } from "../../../components/gradient-background"
import { useScrollTransform } from "../../../components/image";


export default function Home() {

  const [size, setSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLElement>(null);

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



  const [menuOpen, setMenuOpen] = useState(false);


   const [leftRef1, leftStyle1] = useScrollTransform({
    fromX: -100, toX: 0, fromRot: -15, toRot: 0
  });

  const [leftRef2, leftStyle2] = useScrollTransform({
    fromX: -120, toX: 0, fromRot: -18, toRot: 0
  });

  const [rightRef, rightStyle] = useScrollTransform({
    fromX: 100, toX: 0, fromRot: 15, toRot: 0
  });

  const [rightRef2, rightStyle2] = useScrollTransform({
    fromX: 120, toX: 0, fromRot: 18, toRot: 0
  });

  return (
    <div className="flex min-h-screen flex-col  overflow-x-hidden">
      <GradientBackground />
      <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex justify-center items-center w-[60%] lg:w-1/2 rounded-full
    bg-transparent md:border-b md:border-white/20 shadow-md  backdrop-blur-md mb-30">
        <div className="container mx-auto px-4 py-4 ">
          <div className="flex flex-row  justify-between items-center">
            <div className="flex items-center justify-between w-full space-x-4">
              <div><Logo /> </div>
              <button
                className="md:hidden ml-auto text-2xl"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
              >
                {menuOpen ? (
                  <PanelRightClose size={32} />
                ) : (
                  <Menu size={32} />
                )}
              </button>
            </div>
            <ul className="hidden md:flex flex-row space-x-8 ml-8 text-2xl font-semibold">
              <li className="transition-all duration-300 hover:rounded-full px-2 py-2">
                <a href="/about" className="block font-semibold ">
                  About
                </a>
              </li>

              <li className="transition-all duration-300 hover:rounded-full px-2 py-2">
                <a href="/contact" className="font-semibold">
                  Contact
                </a>
              </li>
              <li className="transition-all duration-300 hover:rounded-full px-2 py-2">
                <a href="/services" className="font-semibold">
                  Services
                </a>
              </li>
            </ul>
          </div>


          {menuOpen && (
            <div className="md:hidden ">
              <ul className="flex flex-col space-y-2 z-50 bg-transparent py-4 font-semibold">
                <li className="hover:bg-gray-600 px-2 py-1 rounded">
                  <a
                    href="/about"
                    className="px-4 py-2 w-fit inline-block"
                    onClick={() => setMenuOpen(false)}
                  >
                    About
                  </a>
                </li>
                <li className="hover:bg-gray-600 px-2 py-1 rounded">
                  <a
                    href="/contact"
                    className="px-4 py-2 w-fit inline-block"
                    onClick={() => setMenuOpen(false)}
                  >
                    Contact
                  </a>
                </li>
                <li className="hover:bg-gray-600 px-2 py-1 rounded">
                  <a
                    href="/services"
                    className="px-4 py-2 w-fit inline-block"
                    onClick={() => setMenuOpen(false)}
                  >
                    Services
                  </a>
                </li>
              </ul>
            </div>
          )}

        </div>
      </nav>

      <main className="flex-1 sm:mt-30 mt-40 ">
        <section className="flex justify-center items-center space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 overflow-hidden">
          <SoundWaveAnimation className="top-1/2 -translate-y-1/2" />
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center relative z-10">
            <div className="rounded-full bg-blue-100 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-blue-700 border border-primary/20">
              Introducing Wavelength
            </div>
            <div className="hero-glow">
              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl  text-blue-500">
                AI-Powered Social Media Intelligence
              </h1>
            </div>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 glass-effect p-4 rounded-lg">
              Get on the same wavelength as your audience with real-time sentiment analysis, platform-specific content
              adaptation, and predictive trend integration.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600" asChild>
                <Link href="#demo">
                  Try Interactive Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="glass-button" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
       <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-32 overflow-hidden">
            
            {/* Feature 1 */}
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
                <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed">
                  Harness the power of advanced AI to analyze social media trends in real-time. Our intelligent system 
                  processes millions of data points to give you actionable insights that drive engagement and growth.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
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
                <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Smart Content Optimization
                </h2>
                <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed">
                  Transform your content strategy with AI-powered optimization. Our platform adapts your messaging 
                  for each social media platform, ensuring maximum reach and engagement across all channels.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
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
                <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
                  Predictive Trend Analysis
                </h2>
                <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed">
                  Stay ahead of the curve with our predictive analytics. Identify emerging trends before they go viral 
                  and position your brand at the forefront of social media conversations.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
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
                <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
                  Advanced Analytics Dashboard
                </h2>
                <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed">
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



{/* Hero Section */ }
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
