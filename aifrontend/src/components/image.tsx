import { useRef, useEffect, useState } from "react";

export function useScrollTransform({ 
  fromX = 0, 
  toX = 0, 
  fromRot = 0, 
  toRot = 0,
  fromScale = 0.8,
  toScale = 1,
  fromOpacity = 0,
  toOpacity = 1
}) {
  const ref = useRef<HTMLElement>(null);
  const [style, setStyle] = useState({
    transform: `translateX(${fromX}px) rotate(${fromRot}deg) scale(${fromScale})`,
    opacity: fromOpacity,
  });

  useEffect(() => {
    function handleScroll() {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
     
      const startOffset = windowHeight * 0.8;
      const endOffset = windowHeight * 0.2;
      
     
      let progress = 0;
      
      if (rect.top <= startOffset && rect.bottom >= endOffset) {
       
        const totalDistance = startOffset - endOffset;
        const currentDistance = startOffset - rect.top;
        progress = Math.min(Math.max(currentDistance / totalDistance, 0), 1);
      } else if (rect.bottom < endOffset) {
       
        progress = 1;
      }
      
      
      const easeProgress = easeOutCubic(progress);
      
     
      const x = fromX + (toX - fromX) * easeProgress;
      const rot = fromRot + (toRot - fromRot) * easeProgress;
      const scale = fromScale + (toScale - fromScale) * easeProgress;
      const opacity = fromOpacity + (toOpacity - fromOpacity) * easeProgress;

      setStyle({
        transform: `translateX(${x}px) rotate(${rot}deg) scale(${scale})`,
        opacity,
      });
    }

    
    function easeOutCubic(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    
    let ticking = false;
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", requestTick, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", requestTick);
  }, [fromX, toX, fromRot, toRot, fromScale, toScale, fromOpacity, toOpacity]);

  return [ref, style];
}