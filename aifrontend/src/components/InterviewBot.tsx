import { useState, useEffect } from 'react';
import Image from 'next/image';
import WaveAnimation from './interviewWave';
import { cn } from '@/components/lib/utils';

interface InterviewBotProps {
  isListening: boolean;
  isSpeaking: boolean;
  className?: string;
}

const InterviewBot = ({ isListening, isSpeaking, className }: InterviewBotProps) => {
  const [pulseIntensity, setPulseIntensity] = useState(0);

  useEffect(() => {
    if (isSpeaking || isListening) {
      const interval = setInterval(() => {
        setPulseIntensity(Math.random() * 0.3 + 0.7);
      }, 200);
      return () => clearInterval(interval);
    } else {
      setPulseIntensity(1);
    }
  }, [isSpeaking, isListening]);

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Bot Avatar with Dynamic Glow */}
      <div className="relative">
        <div 
          className={cn(
            "absolute inset-0 rounded-full blur-xl transition-all duration-300",
            isSpeaking ? "bg-blue-400/40" : isListening ? "bg-emerald-400/40" : "bg-gray-400/20"
          )}
          style={{
            transform: `scale(${pulseIntensity})`,
          }}
        />
        <Image
        //  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop&crop=center"
          alt="Interview Bot"
          width={200}
          height={200}

          className={cn(
            "relative z-10 rounded-full transition-all duration-300",
            (isSpeaking || isListening) ? "shadow-2xl" : "shadow-lg"
          )}
        />
        
        {/* Status Indicator */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg",
            isSpeaking ? "bg-blue-500" : isListening ? "bg-emerald-500" : "bg-gray-500"
          )}>
            {isSpeaking ? "Speaking..." : isListening ? "Listening..." : "Ready"}
          </div>
        </div>
      </div>

      {/* Wave Animation */}
      <div className="mt-8">
        <WaveAnimation 
          isActive={isSpeaking || isListening} 
          type={isSpeaking ? 'speaking' : 'listening'}
          className="h-12"
        />
      </div>

      {/* Audio Visualization Ring */}
      {(isSpeaking || isListening) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={cn(
            "w-64 h-64 rounded-full border-2 animate-ping",
            isSpeaking ? "border-blue-400/30" : "border-emerald-400/30"
          )} />
          <div className={cn(
            "absolute w-80 h-80 rounded-full border border-dashed animate-spin",
            isSpeaking ? "border-blue-300/20" : "border-emerald-300/20"
          )} style={{ animationDuration: '8s' }} />
        </div>
      )}
    </div>
  );
};

export default InterviewBot;