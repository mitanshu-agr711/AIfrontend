import { useEffect, useState } from 'react';
import { cn } from '@/components/lib/utils';

interface WaveAnimationProps {
  isActive: boolean;
  type: 'speaking' | 'listening';
  className?: string;
}

const WaveAnimation = ({ isActive, type, className }: WaveAnimationProps) => {
  const [waveHeights, setWaveHeights] = useState([20, 30, 25, 35, 28, 22, 32]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setWaveHeights(prev => 
        prev.map(() => Math.random() * (type === 'speaking' ? 40 : 25) + 10)
      );
    }, type === 'speaking' ? 150 : 300);

    return () => clearInterval(interval);
  }, [isActive, type]);

  const baseColor = type === 'speaking' ? 'bg-blue-500' : 'bg-emerald-500';
  const glowColor = type === 'speaking' ? 'shadow-blue-500/50' : 'shadow-emerald-500/50';

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {waveHeights.map((height, index) => (
        <div
          key={index}
          className={cn(
            "w-1 rounded-full transition-all duration-150 ease-in-out",
            baseColor,
            isActive ? `${glowColor} shadow-lg` : 'opacity-30',
            isActive && type === 'speaking' ? 'animate-pulse' : ''
          )}
          style={{
            height: isActive ? `${height}px` : '8px',
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

export default WaveAnimation;