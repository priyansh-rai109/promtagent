import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCards() {
  const stats = [
    {
      title: "PROMPTS GENERATED",
      value: "12,458",
      color: "text-cyber-pink",
      borderColor: "rgba(255, 0, 255, 0.15)",
      shadowColor: "rgba(255, 0, 255, 0.05)",
      graph: (
        <svg className="w-full h-8 text-cyber-pink/50" viewBox="0 0 100 30" preserveAspectRatio="none">
          <path d="M0 25 Q15 20 30 10 T60 15 T90 5 L100 2 L100 30 L0 30 Z" fill="rgba(255,0,255,0.03)" />
          <path d="M0 25 Q15 20 30 10 T60 15 T90 5 L100 2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="2" r="1.5" fill="#ffffff" className="animate-ping" />
        </svg>
      )
    },
    {
      title: "TIME SAVED",
      value: "245 hrs",
      color: "text-cyber-blue",
      borderColor: "rgba(0, 217, 255, 0.15)",
      shadowColor: "rgba(0, 217, 255, 0.05)",
      graph: (
        <svg className="w-full h-8 text-cyber-blue/50" viewBox="0 0 100 30" preserveAspectRatio="none">
          <path d="M0 28 Q20 28 40 18 T80 8 L100 2 L100 30 L0 30 Z" fill="rgba(0,217,255,0.03)" />
          <path d="M0 28 Q20 28 40 18 T80 8 L100 2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="2" r="1.5" fill="#ffffff" className="animate-ping" />
        </svg>
      )
    },
    {
      title: "IDEAS ENHANCED",
      value: "8,732",
      color: "text-cyber-pink",
      borderColor: "rgba(255, 0, 255, 0.15)",
      shadowColor: "rgba(255, 0, 255, 0.05)",
      graph: (
        <svg className="w-full h-8 text-cyber-pink/50" viewBox="0 0 100 30" preserveAspectRatio="none">
          <path d="M0 15 Q15 25 30 20 T60 10 T90 2 L100 0 L100 30 L0 30 Z" fill="rgba(255,0,255,0.03)" />
          <path d="M0 15 Q15 25 30 20 T60 10 T90 2 L100 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="0" r="1.5" fill="#ffffff" className="animate-ping" />
        </svg>
      )
    },
    {
      title: "ACCURACY METER",
      value: "98.6%",
      color: "text-[#39ff14]",
      borderColor: "rgba(57, 255, 20, 0.15)",
      shadowColor: "rgba(57, 255, 20, 0.05)",
      graph: (
        <svg className="w-full h-8 text-[#39ff14]/50" viewBox="0 0 100 30" preserveAspectRatio="none">
          <path d="M0 25 Q20 25 40 15 T80 5 L100 2 L100 30 L0 30 Z" fill="rgba(57,255,20,0.03)" />
          <path d="M0 25 Q20 25 40 15 T80 5 L100 2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="2" r="1.5" fill="#ffffff" className="animate-ping" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid gap-4 w-full select-none pointer-events-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          className="glass-panel corner-decor rounded-2xl p-4 flex flex-col justify-between h-[110px] border transition-all duration-300 relative group overflow-hidden border-white/5"
          style={{ 
            boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 0 10px ${stat.shadowColor}`
          }}
          whileHover={{ 
            y: -2,
            borderColor: stat.color.includes('pink') ? 'rgba(255,0,255,0.3)' : stat.color.includes('blue') ? 'rgba(0,217,255,0.3)' : 'rgba(57,255,20,0.3)'
          }}
        >
          {/* Top Row: title */}
          <div className="flex items-start justify-between">
            <span className="text-[9.5px] font-hud text-slate-400 tracking-[1.5px] font-bold uppercase">{stat.title}</span>
          </div>

          {/* Middle Row: Numeric value */}
          <div className="my-0.5 flex items-baseline justify-between">
            <span className="text-xl font-cyber font-black tracking-wider text-white select-text">
              {stat.value}
            </span>
          </div>

          {/* Bottom Row: Graph */}
          <div className="w-full mt-1">
            {stat.graph}
          </div>

        </motion.div>
      ))}
    </div>
  );
}
