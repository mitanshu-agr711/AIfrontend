'use client'

import React, { useEffect, useState } from "react";

const AnimatedIVLogo: React.FC = () => {
  const [animationStage, setAnimationStage] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    const sequence = [
      { stage: 1, delay: 500 },
      { stage: 2, delay: 1000 },
      { stage: 3, delay: 1500 },
      { stage: 4, delay: 2000 },
      { stage: 5, delay: 2500 },
    ];

    const timers: NodeJS.Timeout[] = [];

    const runAnimation = () => {
      sequence.forEach(({ stage, delay }) => {
        const timer = setTimeout(() => {
          setAnimationStage(stage);
          if (stage === 5) setIsComplete(true);
        }, delay);
        timers.push(timer);
      });
    };

    runAnimation();

    const resetInterval = setInterval(() => {
      setAnimationStage(0);
      setIsComplete(false);
      runAnimation();
    }, 6000);

    return () => {
      clearInterval(resetInterval);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="flex  items-center justify-center relative">
      
      {/* Main logo */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Letter I */}
        <div className="relative mr-4 flex items-center justify-center">
          {/* Ball animation */}
          <div
            className={`transform transition-all duration-1000 ease-out ${
              animationStage === 0
                ? "scale-0 opacity-0 -translate-x-[80px]"
                : animationStage === 1
                ? "scale-100 opacity-100 -translate-x-[80px]"
                : animationStage === 2
                ? "scale-100 opacity-100 translate-x-0"
                : animationStage >= 3
                ? "scale-100 opacity-0"
                : ""
            }`}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-500/50 animate-pulse">
              <div className="w-full h-full bg-gradient-to-br from-white/30 to-transparent rounded-full animate-spin" />
            </div>
          </div>

          {/* Letter I */}
          <div
            className={`absolute transform transition-all duration-800 ease-out ${
              animationStage < 3
                ? "scale-0 opacity-0 rotate-180"
                : "scale-100 opacity-100 rotate-0"
            }`}
          >
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-600 relative">
              I
              <div className="absolute inset-0 text-5xl font-black text-cyan-400 opacity-50 blur-sm animate-pulse">
                I
              </div>
            </div>
          </div>

          {/* Dot */}
          <div
            className={`absolute -top-2 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
              animationStage >= 3 ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce shadow-lg shadow-cyan-500/50" />
          </div>
        </div>

        {/* Letter V */}
        <div className="relative">
          <div
            className={`transform transition-all duration-1000 ease-out ${
              animationStage < 4
                ? "scale-0 opacity-0 rotate-[360deg]"
                : "scale-100 opacity-100 rotate-0"
            }`}
          >
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-purple-600 via-pink-500 to-red-500 relative">
              V
              <div className="absolute inset-0 text-6xl font-black text-pink-500 opacity-50 blur-sm animate-pulse">
                V
              </div>
            </div>
          </div>

          {/* Orbs */}
          <div className={`absolute inset-0 ${animationStage >= 4 ? "opacity-100" : "opacity-0"}`}>
            <div className="absolute inset-0 animate-spin">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-pink-500 rounded-full shadow-lg shadow-pink-500/50" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDirection: "reverse", animationDuration: "2s" }}>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "4s" }}>
              <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-1 h-1 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/50" />
            </div>
          </div>
        </div>

        {/* Final glow */}
        <div className={`absolute inset-0 transition-all duration-1000 ${isComplete ? "opacity-100" : "opacity-0"}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-2xl animate-pulse" />
        </div>
      </div> 

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedIVLogo;
