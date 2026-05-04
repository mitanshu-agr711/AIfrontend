"use client";
import { cn } from "@/components/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

const noise = createNoise3D();

type WavyBackgroundProps = React.HTMLAttributes<HTMLDivElement> & {
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
};

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill = "transparent",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  style,
  ...props
}: WavyBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const waveColors = colors ?? [
      "#38bdf8",
      "#818cf8",
      "#c084fc",
      "#e879f9",
      "#22d3ee",
    ];

    let width = 0;
    let height = 0;
    let time = 0;
    const speedStep = speed === "fast" ? 0.002 : 0.001;

    const resizeCanvas = () => {
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    const drawWave = (waveCount: number) => {
      for (let waveIndex = 0; waveIndex < waveCount; waveIndex += 1) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth ?? 50;
        ctx.strokeStyle = waveColors[waveIndex % waveColors.length];

        for (let currentX = 0; currentX < width; currentX += 5) {
          const y = noise(currentX / 800, 0.3 * waveIndex, time) * 100;
          ctx.lineTo(currentX, y + height * 0.5);
        }

        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      ctx.fillStyle = backgroundFill;
      ctx.globalAlpha = waveOpacity;
      ctx.clearRect(0, 0, width, height);
      ctx.fillRect(0, 0, width, height);
      drawWave(5);
      time += speedStep;
      animationFrameId.current = requestAnimationFrame(render);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [backgroundFill, blur, colors, speed, waveOpacity, waveWidth]);

  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome"),
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col items-center justify-center",
        containerClassName,
      )}
      style={{ width: "100%", height: "100%", ...style }}
      {...props}
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
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};