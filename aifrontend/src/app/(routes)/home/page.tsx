
"use client"
// import { FlickeringGrid } from "@/components/magicui/flickering-grid"
// import Image from "next/image"
import Logo from "../../../lib/logo/page"
import { useRef, useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Clock, FileText } from "lucide-react"
import { Button } from "../../../components/ui/moving-border";
import { WavyBackground } from "../../../components/wavyBackground/wave";
// import { BackgroundGradient } from "../../../components/gradient";
import { Menu, PanelRightClose } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


export default function Home() {
  //   const [isHovering, setIsHovering] = useState(false)
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


  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

   
    video.pause();

   
    const onLoadedMetadata = () => {
      
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

     
      gsap.to(video, {
        currentTime: video.duration || 1, 
        ease: "none",
        scrollTrigger: {
          trigger: container,        
          start: "top top",          
          end: "bottom top",         
          scrub: true,               
          pin: video,
          pinSpacing: false,              
         
        },
      });
    };

   
    if (video.readyState >= 1) {
      onLoadedMetadata();
    } else {
      video.addEventListener("loadedmetadata", onLoadedMetadata);
    }

   
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#cfdfeb' }}>

      <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 
                flex justify-center items-center w-1/2 
                rounded-full bg-gradient-to-r from-white/60 to-transparent 
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
      <section className="w-vw mt-30">
        {/* writing heading */}
        <div>
          <p className="text-4xl sm:text-[3rem] md:text-[4rem] lg:text-[7rem] font-bold  text-center mt-10 ">
            Challenge Yourself.
          </p>
          <div className="text-4xl sm:text-[3rem] md:text-[4rem]  lg:text-[6rem] font-bold   text-center m-6">Conquer Tomorrow.</div>
        </div>
        <p className="block  text-center m-5 text-xl mx-auto">"Interview prep just got real — build your zone, boost your skills, and bring your friends!"</p>

        <div className="flex items-center justify-center m-10">
          <Button
            borderRadius="1.75rem"
            className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 text-xl font-semibold hover:bg-sky-200 dark:hover:bg-slate-800 transition-colors duration-300 px-8 py-4 flex items-center gap-2"
          >
            Get Start
          </Button>
        </div>
      </section>

      {/* video Section */}
      <section
        ref={containerRef}
        className="flex items-center justify-center m-5" >

        <video
          ref={videoRef}
          width={640}
          height={360}
          muted
          playsInline
          controls={false}
          style={{
            background: "#000",
            boxShadow: "0 2px 32px #0002",
            borderRadius: 16,
            pointerEvents: "none", 
            width: "80vw",
            maxWidth: 900,
            height: "auto",
          }}
        >
          <source src="/robot.mp4" type="video/mp4" />
          
          Your browser does not support the video tag.
        </video>
        
        <style jsx global>{`
          video::-webkit-media-controls,
          video::-webkit-media-controls-enclosure {
            display: none !important;
          }
        `}</style>
      </section>
      <WavyBackground className="max-w-5xl mx-auto pb-40">

        <p className="m-10 flex font-semibold justify-center items-center text-2xl">"Prepare like a pro — your personal interview lab awaits. Invite friends and level up together!"</p>
        <div className="flex justify-center items-center tex-center text-xl mx-auto w-2/3">Answer a few quick questions about your experience and goals to set up your ideal interview workspace. Practice
          confidently, and visualize your improvement with a detailed progress graph once you finish. Share the
          journey with friends and motivate each other!</div>

      </WavyBackground>


      {/* About Section */}
      <section>

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
