import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Brain() {
  const brainRef = useRef(null);

  useEffect(() => {
    // Subtle breathing float animation using GSAP for organic feel
    gsap.to(brainRef.current, {
      y: -12,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }, []);

  return (
    <div className="relative w-[340px] h-[340px] flex items-center justify-center pointer-events-none select-none" ref={brainRef}>
      {/* GLOWING AMBIENT NEON BACKGROUND ORBS */}
      <div className="absolute w-[180px] h-[180px] rounded-full bg-cyber-blue opacity-10 blur-[80px] animate-pulse-slow"></div>
      <div className="absolute w-[140px] h-[140px] rounded-full bg-cyber-purple opacity-10 blur-[60px] animate-pulse-fast"></div>

      {/* SCI-FI COMPASS RADAR RING */}
      <svg className="absolute w-[360px] h-[360px] text-cyber-blue/15 animate-spin-slow" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="10 2 2 2" />
      </svg>

      {/* DYNAMIC ORBITING NEON RINGS (Tilted for 3D depth) */}
      <div className="absolute w-[320px] h-[320px] pointer-events-none" style={{ perspective: '800px' }}>
        {/* Outer Ring 1 (Electric Blue) */}
        <div
          className="absolute inset-0 rounded-full border border-cyber-blue/40 shadow-[0_0_15px_rgba(0,217,255,0.2)] animate-spin-slow"
          style={{ transform: 'rotateX(75deg) rotateY(15deg)' }}
        ></div>

        {/* Inner Ring 2 (Neon Pink - Reverse Spin) */}
        <div
          className="absolute inset-4 rounded-full border border-dashed border-cyber-pink/50 shadow-[0_0_15px_rgba(255,0,255,0.2)] animate-spin-reverse"
          style={{ transform: 'rotateX(75deg) rotateY(-15deg)' }}
        ></div>

        {/* Orbiting Quantum Core Node (Rotating on tilted Ring) */}
        <div
          className="absolute w-4 h-4 rounded-full bg-cyber-cyan shadow-[0_0_12px_#00F5FF] animate-ping opacity-60"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotateX(75deg) rotateY(15deg) translateY(-145px)'
          }}
        ></div>
      </div>

      {/* SVG NEURAL CORE BRAIN */}
      <svg
        className="relative w-[210px] h-[210px] text-cyber-cyan filter drop-shadow-[0_0_15px_rgba(0,245,255,0.65)]"
        viewBox="0 0 120 120"
      >
        {/* CUSTOM SVGs FILTER AURA GLOW */}
        <defs>
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#neon-glow)">
          {/* NEURAL PATHS / CONNECTIVITY LINES */}
          {/* Left Hemisphere Synapses */}
          <path d="M60 20 C40 20 25 35 25 55 C25 70 35 85 48 95 C52 98 56 100 60 100" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1 3" className="animate-pulse" />
          <path d="M60 35 C48 35 38 45 38 58 C38 68 45 78 54 85" fill="none" stroke="#A855F7" strokeWidth="0.6" />
          <path d="M60 50 C54 50 48 55 48 60 C48 65 52 70 60 70" fill="none" stroke="currentColor" strokeWidth="0.5" />

          {/* Right Hemisphere Synapses */}
          <path d="M60 20 C80 20 95 35 95 55 C95 70 85 85 72 95 C68 98 64 100 60 100" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1 3" className="animate-pulse" />
          <path d="M60 35 C72 35 82 45 82 58 C82 68 75 78 66 85" fill="none" stroke="#FF00FF" strokeWidth="0.6" />
          <path d="M60 50 C66 50 72 55 72 60 C72 65 68 70 60 70" fill="none" stroke="currentColor" strokeWidth="0.5" />

          {/* Sibling Synaptic Bridges */}
          <line x1="38" y1="58" x2="82" y2="58" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.4" />
          <line x1="25" y1="55" x2="95" y2="55" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.3" />
          <line x1="48" y1="95" x2="72" y2="95" stroke="#A855F7" strokeWidth="0.5" strokeOpacity="0.5" />
          <line x1="48" y1="35" x2="72" y2="35" stroke="#FF00FF" strokeWidth="0.5" strokeOpacity="0.5" />

          {/* ACTIVE GLOWING NEURAL NODE DOTS */}
          {/* Central Stem */}
          <circle cx="60" cy="20" r="2.5" fill="#00D9FF" className="animate-ping" />
          <circle cx="60" cy="20" r="1.5" fill="#ffffff" />
          <circle cx="60" cy="50" r="1.5" fill="#00F5FF" />
          <circle cx="60" cy="70" r="2" fill="#A855F7" />
          <circle cx="60" cy="100" r="2.5" fill="#FF00FF" />

          {/* Left Hemisphere Nodes */}
          <circle cx="25" cy="55" r="2.2" fill="#00F5FF" />
          <circle cx="48" cy="35" r="1.8" fill="#A855F7" />
          <circle cx="38" cy="58" r="2" fill="#ffffff" />
          <circle cx="48" cy="75" r="1.5" fill="#FF00FF" />
          <circle cx="48" cy="95" r="2" fill="#00D9FF" />

          {/* Right Hemisphere Nodes */}
          <circle cx="95" cy="55" r="2.2" fill="#00F5FF" />
          <circle cx="72" cy="35" r="1.8" fill="#FF00FF" />
          <circle cx="82" cy="58" r="2" fill="#ffffff" />
          <circle cx="72" cy="75" r="1.5" fill="#A855F7" />
          <circle cx="72" cy="95" r="2" fill="#00D9FF" />
        </g>
      </svg>

      {/* FLOATING STATUS HUD HUD OVERLAYS */}
      <div className="absolute -bottom-6 flex flex-col items-center gap-1">
        <span className="text-[10px] font-cyber text-cyber-blue tracking-[3px] uppercase animate-pulse">NEURAL_CORE: ACTIVE</span>
        <span className="text-[8px] font-mono text-slate-500 tracking-wider">SYNC_LOCK // 99.8% STABLE</span>
      </div>
    </div>
  );
}
