"use client";

import React, { useEffect, useRef, useState } from "react";

type EffectType = "clear" | "rain" | "snow";

export default function WeatherEffects() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [effect, setEffect] = useState<EffectType>("clear");

  // Keep canvas full-screen sized
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  // Particles
  type Particle = { x: number; y: number; vx: number; vy: number; r: number };
  const particlesRef = useRef<Particle[]>([]);

  const initParticles = (type: EffectType) => {
    const count = type === "snow" ? 120 : type === "rain" ? 160 : 0;
    const parts: Particle[] = [];
    const W = window.innerWidth;
    const H = window.innerHeight;
    for (let i = 0; i < count; i++) {
      if (type === "snow") {
        parts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: Math.random() * 0.6 - 0.3,
          vy: 1 + Math.random() * 1.2,
          r: 1 + Math.random() * 2.2,
        });
      } else if (type === "rain") {
        parts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: 0.5 + Math.random() * 0.8,
          vy: 6 + Math.random() * 7,
          r: 0.8,
        });
      }
    }
    particlesRef.current = parts;
  };

  const step = (type: EffectType) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;

    ctx.clearRect(0, 0, W, H);

    if (type === "snow") {
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > H + 4) p.y = -4;
        if (p.x > W + 4) p.x = -4;
        if (p.x < -4) p.x = W + 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === "rain") {
      ctx.strokeStyle = "rgba(150,170,255,0.6)";
      ctx.lineWidth = 1.2;
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        const len = 8;
        if (p.y > H + len) p.y = -len;
        if (p.x > W + 2) p.x = -2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - 2, p.y - len);
        ctx.stroke();
      }
    }

    rafRef.current = window.requestAnimationFrame(() => step(type));
  };

  const start = (type: EffectType) => {
    cancel();
    if (type === "clear") return;
    initParticles(type);
    rafRef.current = window.requestAnimationFrame(() => step(type));
  };

  const cancel = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("currentWeatherEffect") : null;
    const initial: EffectType = saved === "snow" || saved === "rain" ? (saved as EffectType) : "clear";
    setEffect(initial);
    resizeCanvas();
    start(initial);

    const onResize = () => {
      resizeCanvas();
    };
    window.addEventListener("resize", onResize);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "currentWeatherEffect") {
        const next: EffectType = e.newValue === "snow" || e.newValue === "rain" ? (e.newValue as EffectType) : "clear";
        setEffect(next);
        start(next);
      }
    };
    window.addEventListener("storage", onStorage);

    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent).detail as EffectType | undefined;
      const next: EffectType = detail === "snow" || detail === "rain" ? (detail as EffectType) : "clear";
      setEffect(next);
      start(next);
    };
    window.addEventListener("weather-changed", onCustom as EventListener);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("weather-changed", onCustom as EventListener);
      cancel();
    };
  }, []);

  // Hide canvas when clear to save paint cost
  const isHidden = effect === "clear";

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 30,
        pointerEvents: "none",
        opacity: isHidden ? 0 : 1,
        transition: "opacity 200ms ease",
      }}
    />
  );
}
