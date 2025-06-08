
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
import "taos/dist/taos.css";


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

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [])

   useEffect(() => {
    require("taos");
  }, []);


  return (
    <div className="flex min-h-screen flex-col">
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
        <section
          id="feature"
          className="flex flex-col justify-center items-center min-h-screen w-full mx-auto space-y-10"
        >
          <div className="flex flex-row justify-center items-center space-x-20 w-full max-w-5xl mx-auto">
            <div className="w-1/3 "data-taos="fade-right" >
              <Image src="/ai.webp" alt="AI illustration" width={1000} height={800} />
            </div>
            <div className="w-1/3">
              <h1 className="font-bold text-5xl">Real-Time Practice with AI</h1>
              <p className="text-2xl m-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, delectus sit sunt quam iste eveniet deleniti doloribus voluptatum fugiat, ex necessitatibus voluptate eius tempora! Laudantium eaque consequuntur maiores unde rerum..
              </p>
            </div>
          </div>

          <div className="flex flex-row justify-center items-center space-x-20 w-full max-w-5xl mx-auto">
            <div className="w-1/3">
              <h1 className="font-bold text-5xl">Real-Time Practice with AI</h1>
              <p className="text-2xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, delectus sit sunt quam iste eveniet deleniti doloribus voluptatum fugiat, ex necessitatibus voluptate eius tempora! Laudantium eaque consequuntur maiores unde rerum..
              </p>
            </div>
            <div className="w-1/3" data-taos="fade-left">
              <Image src="/ai.webp" alt="AI illustration" width={1000} height={800} />
            </div>
          </div>

          <div className="flex flex-row justify-center items-center space-x-20 w-full max-w-5xl mx-auto">
            <div className="w-1/3">
              <Image src="/ai.webp" alt="AI illustration" width={1000} height={800} />
            </div>
            <div className="w-1/3">
              <h1 className="font-bold text-5xl">Real-Time Practice with AI</h1>
              <p className="text-2xl m-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, delectus sit sunt quam iste eveniet deleniti doloribus voluptatum fugiat, ex necessitatibus voluptate eius tempora! Laudantium eaque consequuntur maiores unde rerum..
              </p>
            </div>
          </div>
          
          <div className="flex flex-row justify-center items-center space-x-20 w-full max-w-5xl mx-auto">
            <div className="w-1/3">
              <h1 className="font-bold text-5xl">Real-Time Practice with AI</h1>
              <p className="text-2xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, delectus sit sunt quam iste eveniet deleniti doloribus voluptatum fugiat, ex necessitatibus voluptate eius tempora! Laudantium eaque consequuntur maiores unde rerum..
              </p>
            </div>
            <div className="w-1/3">
              <Image src="/ai.webp" alt="AI illustration" width={1000} height={800} />
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
