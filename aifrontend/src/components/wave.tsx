"use client";
import { cn } from "@/components/slider/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

type WavyBackgroundProps = {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
};

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill = "transparent", // default to transparent
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: WavyBackgroundProps) => {
// Define a noise function type
interface Noise3D {
    (x: number, y: number, z: number): number;
}

// Create the noise generator with proper typing
const noise: Noise3D = createNoise3D();
let w: number,
        h: number,
        nt: number,
        i: number,
        x: number,
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // NEW: container ref

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const init = () => {
    canvas = canvasRef.current!;
    if (!canvas) return; // Exit if canvas ref is null
    ctx = canvas.getContext("2d")!;
    // Use container size instead of window size
    const container = containerRef.current;
    w = ctx.canvas.width = container?.clientWidth || 0;
    h = ctx.canvas.height = container?.clientHeight || 0;
    ctx.filter = `blur(${blur}px)`;
    nt = 0;
    window.onresize = function () {
      w = ctx.canvas.width = container?.clientWidth || 0;
      h = ctx.canvas.height = container?.clientHeight || 0;
      ctx.filter = `blur(${blur}px)`;
    };
    render();
  };

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];
  const drawWave = (n) => {
    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      for (x = 0; x < w; x += 5) {
        var y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.5);
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

let animationId: number | undefined;
  const render = () => {
    ctx.fillStyle = backgroundFill || "transparent"; // transparent fill
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.clearRect(0, 0, w, h); // clear before drawing
    ctx.fillRect(0, 0, w, h);
    drawWave(5);
    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
    return () => {
      cancelAnimationFrame(animationId);
    };
    // eslint-disable-next-line
  }, []);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col items-center justify-center", // removed h-screen
        containerClassName
      )}
      style={{ width: "100%", height: "100%" }} // or set to your desired size
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          width: "100%",
          height: "100%",
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
          pointerEvents: "none",
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
