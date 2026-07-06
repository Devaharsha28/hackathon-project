'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';

interface HeroFuturisticProps {
  onExploreClick?: () => void;
  title?: string;
  subtitle?: string;
}

export default function HeroFuturistic({ 
  onExploreClick,
  title = "Academic & Career Hub",
  subtitle = "Telangana State Polytechnic Diploma Companion Gateway"
}: HeroFuturisticProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [visibleWords, setVisibleWords] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);

  const titleWords = title.split(' ');

  // Animate text entry
  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 350);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setSubtitleVisible(true), 400);
      return () => clearTimeout(timeout);
    }
  }, [visibleWords, titleWords.length]);

  // Track pointer coordinates relative to viewport
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setPointer({ x, y });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Load abstract technical/blueprint background image matching light mode
    const bgImage = new Image();
    bgImage.src = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80';
    let imageLoaded = false;
    bgImage.onload = () => {
      imageLoaded = true;
    };

    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      canvas.width = rect?.width || window.innerWidth;
      canvas.height = rect?.height || window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      time += 0.015;
      const width = canvas.width;
      const height = canvas.height;

      // Clear with elegant off-white background
      ctx.fillStyle = '#f8fafc'; // slate-50
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid pattern
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.04)'; // indigo-600 with 4% opacity
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Parallax shifts from mouse pointer input
      const dx = pointer.x * 25;
      const dy = pointer.y * -25;

      // Draw background abstract image with depth parallax
      if (imageLoaded) {
        ctx.save();
        ctx.globalAlpha = 0.09; // soft background tint
        
        // Draw centered and slightly enlarged for parallax overflow
        const imgWidth = width * 0.9;
        const imgHeight = (imgWidth / bgImage.width) * bgImage.height;
        const imgX = (width - imgWidth) / 2 + dx * 0.5;
        const imgY = (height - imgHeight) / 2 + dy * 0.5;

        ctx.drawImage(bgImage, imgX, imgY, imgWidth, imgHeight);
        ctx.restore();
      }

      // Scanner progress calculation
      const scanProgress = (Math.sin(time * 0.7) * 0.5 + 0.5); // ranges 0 to 1
      const scanY = scanProgress * height;

      // Draw a glowing matrix dot pattern inside a scanning flow block
      const rows = 35;
      const cols = 35;
      const xSpacing = width / cols;
      const ySpacing = height / rows;

      for (let r = 0; r < rows; r++) {
        const dotY = r * ySpacing + dy * 0.2;
        
        // Check distance to the vertical scan line
        const distToScan = Math.abs(dotY - scanY);
        const nearScan = Math.max(0, 1 - distToScan / 140); // 1.0 when on scan line, 0 when far

        for (let c = 0; c < cols; c++) {
          const dotX = c * xSpacing + dx * 0.2;
          
          // Cellular noise simulation based on trigonometry
          const noise = Math.sin(c * 0.4 + r * 0.3 + time) * Math.cos(c * 0.1 - time * 0.5);
          
          if (noise > 0.1) {
            // Animate scale/brightness based on scanning laser closeness
            const size = (noise * 1.5) + (nearScan * 2.5);
            ctx.beginPath();
            ctx.arc(dotX, dotY, Math.max(0.5, size), 0, Math.PI * 2);
            
            if (nearScan > 0.1) {
              // Highlighted dot near the laser scanner bar
              ctx.fillStyle = `rgba(79, 70, 229, ${0.15 + nearScan * 0.5})`; // indigo
            } else {
              // Soft background matrix dot
              ctx.fillStyle = 'rgba(79, 70, 229, 0.08)';
            }
            ctx.fill();
          }
        }
      }

      // Draw horizontal scanning laser bar
      const gradient = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
      gradient.addColorStop(0, 'rgba(79, 70, 229, 0)');
      gradient.addColorStop(0.5, 'rgba(79, 70, 229, 0.25)'); // glowing scanner line
      gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 60, width, 120);

      // Solid crisp scanning line with neon amber indicator on top
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Soft light radial aura following mouse pointer
      const mouseX = (pointer.x + 1) * 0.5 * width;
      const mouseY = (-pointer.y + 1) * 0.5 * height;
      
      const radialGlow = ctx.createRadialGradient(mouseX, mouseY, 10, mouseX, mouseY, 300);
      radialGlow.addColorStop(0, 'rgba(245, 158, 11, 0.06)'); // warm amber accent
      radialGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 300, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [pointer]);

  return (
    <div 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] overflow-hidden select-none flex flex-col justify-center items-center px-6 text-center border-b border-slate-200"
      id="hero-futuristic-container"
    >
      {/* Background Interactive WebGL-like Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Decorative Cyber Grid Corners */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-indigo-500/30 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-indigo-500/30 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-indigo-500/30 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-indigo-500/30 rounded-br-lg pointer-events-none" />

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          <span>Unified Diploma Gateway</span>
        </div>

        {/* Word-by-word glitchy fade-in effect */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-slate-900 leading-tight">
          <span className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            {titleWords.map((word, index) => (
              <span
                key={index}
                className={`transition-all duration-700 ease-out transform ${
                  index < visibleWords 
                    ? 'opacity-100 translate-y-0 scale-100 filter blur-none' 
                    : 'opacity-0 translate-y-4 scale-95 filter blur-xs'
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                {word}
              </span>
            ))}
          </span>
        </h1>

        {/* Subtitle animation delay */}
        <p 
          className={`text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-semibold transition-all duration-1000 ease-out transform ${
            subtitleVisible 
              ? 'opacity-100 translate-y-0 filter blur-none' 
              : 'opacity-0 translate-y-4 filter blur-xs'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          {subtitle}
        </p>

        {/* Scroll button */}
        <div 
          className={`pt-2 transition-all duration-1000 ease-out transform ${
            subtitleVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <button
            onClick={onExploreClick}
            className="group inline-flex items-center space-x-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-indigo-600 text-xs font-black uppercase tracking-wider px-5 py-3 rounded-2xl shadow-sm hover:shadow transition duration-200 active:scale-97 cursor-pointer"
            id="hero-explore-btn"
          >
            <span>Launch Portal Below</span>
            <ArrowDown className="w-4 h-4 text-indigo-500 animate-bounce group-hover:text-indigo-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
