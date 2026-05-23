import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Cpu,
  Trash2,
  Copy,
  Star,
  Download,
  History,
  Play,
  Monitor,
  Code,
  Bot,
  PenTool,
  Gamepad,
  Image,
  Box,
  Megaphone,
  Lightbulb,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import StatsCards from '../components/StatsCards';

export default function Dashboard({
  categories,
  onSelectCategory,
  onGenerate,
  isGenerating,
  generatedPrompt,
  setGeneratedPrompt,
  onRefine,
  isRefining,
  historyList,
  onClearHistory
}) {
  const [rawIdea, setRawIdea] = useState("");
  const [temp, setTemp] = useState(0.7);
  const [tokens, setTokens] = useState(1500);
  const [model, setModel] = useState("llama-3.3-70b-versatile");
  const [refineFeedback, setRefineFeedback] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const getCategoryIcon = (name) => {
    switch (name) {
      case 'UI/UX': return Monitor;
      case 'Coding': return Code;
      case 'AI Agent': return Bot;
      case 'Logo Design': return PenTool;
      case 'Game Design': return Gamepad;
      case 'Thumbnail':
      case 'Thumbnail Design': return Image;
      case '3D Art': return Box;
      case 'Marketing': return Megaphone;
      case 'Startup Ideas': return Lightbulb;
      default: return Sparkles;
    }
  };

  const handleGenerate = () => {
    if (!rawIdea.trim()) return;
    onGenerate(rawIdea, "UI/UX", temp, tokens, model);
  };

  const handleRefine = () => {
    if (!refineFeedback.trim() || !generatedPrompt) return;
    onRefine(generatedPrompt, refineFeedback, "UI/UX", temp, tokens);
    setRefineFeedback("");
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <motion.div
      className="w-full flex flex-col gap-6 select-none pointer-events-auto"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >

      {/* 1. HEADING TITLE BRANDING */}
      <div className="text-left flex flex-col mt-1 relative">
        <motion.h1
          className="font-cyber text-3xl font-black bg-gradient-to-r from-cyber-blue via-cyber-cyan via-white to-cyber-purple bg-clip-text text-fill-transparent tracking-[3px] glow-cyan uppercase"
          animate={{ scale: [1, 1.005, 1] }}
          transition={{ duration: 4, repeat: -1 }}
        >
          AI Prompt Generator
        </motion.h1>
        <p className="mt-1 text-slate-400 font-hud tracking-[1.5px] text-xs uppercase">
          Transform simple ideas into powerful AI prompts.
        </p>
      </div>

      {/* 2. STATS CARDS BAR */}
      <StatsCards />

      {/* 3. CATEGORY DECK SELECTOR PANEL */}
      <div className="glass-panel corner-decor rounded-2xl p-5 flex flex-col gap-4 border-cyber-blue/15">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <h3 className="font-cyber text-xs tracking-[1.5px] font-bold text-white uppercase">Choose a Category</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 xl:grid-cols-10 gap-3 w-full">
          {Object.entries(categories).map(([name, meta]) => {
            const Icon = getCategoryIcon(name);
            return (
              <motion.div
                key={name}
                onClick={() => onSelectCategory(name, meta)}
                className="glass-panel corner-decor rounded-xl p-3 flex flex-col items-center justify-center gap-2 text-center cursor-pointer border border-white/5 hover:border-cyber-blue/35 transition-all group overflow-hidden h-[95px] relative"
                whileHover={{
                  scale: 1.03,
                  y: -2,
                  boxShadow: "0 0 15px rgba(0, 217, 255, 0.15), 0 8px 32px 0 rgba(0,0,0,0.6)"
                }}
              >
                <div className="absolute top-[-20px] right-[-20px] w-8 h-8 rounded-full bg-cyber-blue opacity-0 blur-[15px] group-hover:opacity-10 transition-opacity"></div>

                <div className="w-10 h-10 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20 flex items-center justify-center group-hover:bg-cyber-blue/10 group-hover:border-cyber-blue/30 transition-colors">
                  <Icon className="w-5 h-5 text-cyber-purple group-hover:text-cyber-cyan transition-colors filter drop-shadow-[0_0_4px_currentColor]" />
                </div>

                <span className="font-cyber text-[9px] text-slate-300 font-bold tracking-[1px] group-hover:text-white uppercase transition-colors">
                  {name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN CENTRAL INPUT/OUTPUT COCKPIT SPLIT WITH AI BADGE CONNECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative items-stretch">

        {/* Glowing middle AI Badge connector connector */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full border border-cyber-purple/40 bg-cyber-bg items-center justify-center shadow-[0_0_20px_#A855F7]">
          <div className="w-12 h-12 rounded-full border border-dashed border-cyber-blue/30 flex items-center justify-center animate-spin-slow"></div>
          <span className="absolute font-cyber text-[11px] text-cyber-purple glow-purple font-black">AI</span>
        </div>

        {/* LEFT COMPONENT: YOUR IDEA INPUT CARD */}
        <div className="glass-panel corner-decor rounded-2xl p-5 flex flex-col gap-4 justify-between border-cyber-blue/15">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyber-purple animate-pulse" />
                <span className="font-cyber text-xs tracking-[1.5px] font-bold text-white uppercase">Your Idea</span>
              </div>
              <button
                onClick={() => setRawIdea("")}
                className="text-[9.5px] font-cyber text-slate-500 hover:text-cyber-pink tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>

            <textarea
              placeholder="Enter your idea for UI/UX design...&#10;e.g. futuristic dashboard for AI analytics"
              value={rawIdea}
              onChange={(e) => setRawIdea(e.target.value)}
              className="w-full h-[220px] bg-black/60 border border-cyber-blue/15 rounded-xl p-4 text-xs text-cyber-cyan font-mono focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_12px_rgba(0,217,255,0.12)] transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <div className="flex justify-between items-center text-[10px] font-hud text-slate-500 tracking-[1.5px] uppercase pr-1">
              <span>{rawIdea.length} / 1000 characters</span>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !rawIdea.trim()}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-cyber text-[10.5px] font-bold tracking-widest uppercase transition-all btn-shine-sweep cursor-pointer ${isGenerating || !rawIdea.trim()
                  ? 'bg-slate-800/60 border border-white/5 text-slate-500'
                  : 'bg-gradient-to-r from-cyber-blue to-cyber-purple text-white hover:shadow-[0_0_18px_rgba(0,217,255,0.35)] hover:scale-[1.01]'
                }`}
            >
              {isGenerating ? (
                <>
                  <Cpu className="w-3.5 h-3.5 animate-spin text-cyber-cyan" />
                  SYNTHESIZING...
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  Generate Prompt
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COMPONENT: GENERATED PROMPT OUTPUT CARD */}
        <div className="glass-panel corner-decor rounded-2xl p-5 flex flex-col gap-4 justify-between border-cyber-blue/15">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyber-cyan" />
                <span className="font-cyber text-xs tracking-[1.5px] font-bold text-white uppercase">Generated Prompt</span>
              </div>
              <span className="text-[10px] font-hud text-cyber-purple tracking-[1.5px] uppercase font-bold animate-pulse">
                {isGenerating ? 'Synthesizing...' : 'Generated in 3.2s'}
              </span>
            </div>

            {generatedPrompt ? (
              <div className="bg-black/60 border border-cyber-purple/20 rounded-xl p-4 text-xs font-mono leading-relaxed text-slate-300 h-[220px] overflow-y-auto select-text select-all shadow-[0_0_15px_rgba(168,85,247,0.05)] border-l-4 border-l-cyber-purple">
                {generatedPrompt}
              </div>
            ) : (
              <div className="bg-black/30 border border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-center p-6 h-[220px]">
                <Sparkles className="w-6 h-6 text-slate-600 animate-pulse mb-3" />
                <p className="text-[9.5px] font-cyber text-slate-500 tracking-[1.5px] uppercase max-w-[280px]">
                  PROMPT CORES STANDING BY. LAUNCH A COCKPIT CONCEPT COMMAND TO GENERATE.
                </p>
              </div>
            )}

            {isCopied && (
              <div className="text-[9px] font-cyber text-cyber-cyan tracking-wider uppercase text-center animate-pulse">
                🚀 COPIED TO CLIPBOARD!
              </div>
            )}
          </div>

          {/* Action buttons row exactly matching the image */}
          <div className="flex justify-between items-center gap-3">
            <button
              onClick={handleCopy}
              disabled={!generatedPrompt}
              className={`flex-grow flex items-center justify-center gap-2 py-2.5 rounded-xl border font-cyber text-[9.5px] tracking-widest uppercase transition-all cursor-pointer ${generatedPrompt
                  ? 'border-cyber-blue/20 bg-cyber-blue/5 hover:border-cyber-cyan text-cyber-cyan shadow-neon'
                  : 'border-white/5 text-slate-600 cursor-not-allowed'
                }`}
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </button>

            <button
              disabled={!generatedPrompt}
              className={`flex-grow flex items-center justify-center gap-2 py-2.5 rounded-xl border font-cyber text-[9.5px] tracking-widest uppercase transition-all cursor-pointer ${generatedPrompt
                  ? 'border-cyber-purple/20 bg-cyber-purple/5 hover:border-cyber-purple text-cyber-purple'
                  : 'border-white/5 text-slate-600 cursor-not-allowed'
                }`}
            >
              <Star className="w-3.5 h-3.5" />
              Favorite
            </button>

            <button
              disabled={!generatedPrompt}
              className={`flex-grow flex items-center justify-center gap-2 py-2.5 rounded-xl border font-cyber text-[9.5px] tracking-widest uppercase transition-all cursor-pointer ${generatedPrompt
                  ? 'border-cyber-pink/20 bg-cyber-pink/5 hover:border-cyber-pink text-cyber-pink'
                  : 'border-white/5 text-slate-600 cursor-not-allowed'
                }`}
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>
        </div>

      </div>

      {/* 5. BOTTOM HORIZONTAL PROMPT HISTORY CAROUSEL MATCHING IMAGE DETAILS */}
      <div className="glass-panel corner-decor rounded-2xl p-5 flex flex-col gap-4 border-cyber-blue/15">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyber-purple" />
            <h3 className="font-cyber text-xs tracking-[1.5px] font-bold text-white uppercase">Prompt History</h3>
          </div>

          <div className="flex items-center gap-3">
            {historyList.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-[9.5px] font-cyber text-cyber-pink tracking-widest uppercase hover:underline cursor-pointer"
              >
                Clear History
              </button>
            )}
            <span className="text-[10px] font-cyber text-cyber-blue tracking-[1.5px] uppercase cursor-pointer hover:underline">View All ➔</span>
          </div>
        </div>

        {/* Carousel containing exactly the cards in the image */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full border border-white/5 bg-black/40 text-slate-500 hover:text-cyber-cyan cursor-pointer transition-all hover:border-cyber-cyan/30">
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex-grow flex gap-4 overflow-x-auto pb-1 scrollbar-thin">
            {(historyList.length > 0 ? historyList : [
              { category: "UI/UX", raw_idea: "Quantum Server Monitor", prompt: "A glassmorphic dashboard for a quantum computing server monitoring status with neon cyan and purple accents.", timestamp: "2 hrs ago" },
              { category: "Coding", raw_idea: "WebSocket Custom Hook", prompt: "Write a clean React custom hook that handles WebSocket reconnections with exponential backoff and connection status logging.", timestamp: "5 hrs ago" },
              { category: "AI Agent", raw_idea: "Jarvis OS Assistant", prompt: "Configure a cognitive system prompt defining an elite personal assistant acting as JARVIS with adaptive conversation depth.", timestamp: "1 day ago" },
              { category: "Logo Design", raw_idea: "Orbital Space Emblem", prompt: "Generate a vector logo prompt for an aerospace startup named Vortex Orbital - sleek geometries and planetary negative space.", timestamp: "2 days ago" }
            ]).map((item, idx) => (
              <motion.div
                key={idx}
                onClick={() => setGeneratedPrompt(item.prompt)}
                className="flex-shrink-0 w-[210px] rounded-xl border border-white/5 bg-white/[0.01] hover:bg-cyber-blue/5 hover:border-cyber-blue/20 transition-all p-3.5 cursor-pointer relative group flex flex-col justify-between h-[120px]"
                whileHover={{ y: -2 }}
              >
                <div className="absolute top-0 right-0 w-[30px] h-[30px] bg-cyber-blue rounded-full blur-[15px] opacity-0 group-hover:opacity-10 transition-opacity"></div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[7.5px] font-cyber px-1.5 py-0.5 rounded-full bg-cyber-purple/20 border border-cyber-purple/35 text-cyber-purple tracking-widest uppercase font-black">
                      {item.category}
                    </span>
                    <span className="text-[8.5px] font-hud text-slate-500 font-semibold uppercase">
                      {item.timestamp ? item.timestamp : 'Just now'}
                    </span>
                  </div>

                  <h4 className="text-[11.5px] font-cyber font-bold text-slate-100 tracking-[0.5px] line-clamp-1 group-hover:text-cyber-cyan transition-colors">
                    {item.raw_idea}
                  </h4>
                  <p className="text-[9px] text-slate-400 font-body leading-relaxed line-clamp-2 mt-1">
                    {item.prompt}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full border border-white/5 bg-black/40 text-slate-500 hover:text-cyber-cyan cursor-pointer transition-all hover:border-cyber-cyan/30">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </motion.div>
  );
}
