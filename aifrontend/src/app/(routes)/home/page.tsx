
"use client"

import Logo from "../../../lib/logo/page"
import { useRef, useState, useEffect } from "react";
import { WavyBackground } from "../../../components/wavyBackground/wave";
import { Menu, PanelRightClose } from "lucide-react";
import { SoundWaveAnimation } from "../../../components/soud-wave-animattion"
import { Button } from "../../../components/button"
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GradientBackground } from "../../../components/gradient-background"


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


  return (
     <div className="flex min-h-screen flex-col">
       <GradientBackground />
      <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50  flex justify-center items-center w-1/2 rounded-full bg-gradient-to-r from-white/60 to-transparent 
           backdrop-blur-md shadow-md p-4 mb-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo />
            {/* Hamburger Icon (Mobile Only) */}
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

            {/* Desktop Menu */}
            <ul className="hidden md:flex flex-row space-x-8 ml-8 text-2xl font-semibold">
              <li className="transition-all duration-300 hover:rounded-full hover:border border-blue-400 px-2 py-2">
                <a href="/about" className="block font-semibold ">
                  About
                </a>
              </li>

              <li className="transition-all duration-300 hover:rounded-full hover:border border-blue-400 px-2 py-2">
                <a href="/contact" className="font-semibold">
                  Contact
                </a>
              </li>
              <li className="transition-all duration-300 hover:rounded-full hover:border border-blue-400 px-2 py-2">
                <a href="/services" className="font-semibold">
                  Services
                </a>
              </li>
            </ul>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden mt-2">
              <ul className="flex flex-col space-y-2 z-50 bg-gradient-to-b from-white/60 to-transparent backdrop-blur-md shadow-md py-4 font-semibold">
                <li className="hover:bg-gray-600">
                  <a
                    // href="/about"
                    className="block px-4 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    About
                  </a>
                </li>
                <li className="hover:bg-gray-600">
                  <a
                    // href="/contact"
                    className="block px-4 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Contact
                  </a>
                </li>
                <li className="hover:bg-gray-600">
                  <a
                    // href="/services"
                    className="block px-4 py-2"
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
    
      <main className="flex-1">
       <section className=" flex justify-center top-10 items-center space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 overflow-hidden">
          <SoundWaveAnimation className="top-1/2 -translate-y-1/2" />
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center relative z-10">
            <div className="rounded-full bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary border border-primary/20">
              Introducing Wavelength
            </div>
            <div className="hero-glow">
              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl gradient-text">
                AI-Powered Social Media Intelligence
              </h1>
            </div>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 glass-effect p-4 rounded-lg">
              Get on the same wavelength as your audience with real-time sentiment analysis, platform-specific content
              adaptation, and predictive trend integration.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Button size="lg" className="bg-primary/90 backdrop-blur-sm" asChild>
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
 


      <WavyBackground className="max-w-5xl mx-auto pb-40">

        <p className="m-10 flex font-semibold justify-center items-center text-2xl">&ldquo;Prepare like a pro — your personal interview lab awaits. Invite friends and level up together!&rdquo;</p>
        <div className="flex justify-center items-center tex-center text-xl mx-auto w-2/3">Answer a few quick questions about your experience and goals to set up your ideal interview workspace. Practice
          confidently, and visualize your improvement with a detailed progress graph once you finish. Share the
          journey with friends and motivate each other!</div>
      </WavyBackground>

      
      </main>
    </div>
  )
}



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
      