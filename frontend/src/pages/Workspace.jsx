import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  Cpu, 
  Trash2, 
  Copy, 
  Star, 
  Download, 
  Terminal,
  Play,
  ChevronRight
} from 'lucide-react';

export default function Workspace({ 
  category, 
  meta, 
  onBack, 
  onGenerate, 
  isGenerating, 
  generatedPrompt, 
  setGeneratedPrompt,
  onRefine,
  isRefining,
  preloadedIdea,
  setPreloadedIdea
}) {
  const [rawIdea, setRawIdea] = useState(preloadedIdea || "");
  const [temp, setTemp] = useState(0.7);
  const [tokens, setTokens] = useState(1500);
  const [model, setModel] = useState("llama-3.3-70b-versatile");
  const [refineFeedback, setRefineFeedback] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Return custom category-specific template presets matching the image exactly
  const getWorkspacePresets = (catName) => {
    switch (catName) {
      case 'UI/UX':
        return [
          { name: "Dashboard", desc: "Analytics dashboard templates", tpl: "A glassmorphic dashboard for a quantum computing server monitoring status with neon accents." },
          { name: "Landing Page", desc: "Modern landing pages", tpl: "A futuristic landing page hero section for a clean Web3 productivity SaaS tool." },
          { name: "Mobile App", desc: "Mobile application UI", tpl: "A futuristic mobile banking app interface with holographic transition animations." },
          { name: "E-commerce", desc: "Online store UI", tpl: "A cyberpunk e-commerce dashboard for high-tech bio-enhancements." }
        ];
      case 'Coding':
        return [
          { name: "Python", desc: "Python scripts", tpl: "Write a Python script executing async web-scraping using HTTPX and asyncio withSemaphore throttling." },
          { name: "JavaScript", desc: "JS projects", tpl: "Write a clean React custom hook that handles WebSocket reconnections with exponential backoff." },
          { name: "HTML/CSS", desc: "Web development", tpl: "Write a complete responsive Tailwind CSS layout implementing a glowing cyberpunk cockpit panel." },
          { name: "SQL", desc: "Database queries", tpl: "Write a highly optimized PostgreSQL query with CTEs to aggregate user metrics for analytics." }
        ];
      case 'AI Agent':
        return [
          { name: "Personal Assistant", desc: "Jarvis like assistant", tpl: "Configure a cognitive system prompt defining an elite personal assistant acting as JARVIS." },
          { name: "Customer Support", desc: "AI support agent", tpl: "Configure a robust customer support orchestrator routing and querying APIs autonomously." },
          { name: "Data Analyst", desc: "AI data analyst", tpl: "Configure an agent performing advanced automated static code compliance checks." },
          { name: "Task Automator", desc: "Automation agent", tpl: "Configure a multi-agent workflow manager that splits research tasks and synthesizes reports." }
        ];
      case 'Logo Design':
        return [
          { name: "AI Logo", desc: "Artificial intelligence", tpl: "Generate an art vector design prompt for a minimalist artificial consciousness logo." },
          { name: "Tech Logo", desc: "Technology company", tpl: "Generate a vector logo prompt for an aerospace startup named Vortex Orbital - sleek geometries." },
          { name: "Minimal Logo", desc: "Minimalist style", tpl: "Generate a geometric wordmark logo prompt utilizing negative space orbits." },
          { name: "3D Logo", desc: "3D modern logo", tpl: "Generate an isometric 3D glowing neon logo concept for a cyberpunk indie game studio." }
        ];
      case 'Game Design':
        return [
          { name: "RPG Game", desc: "Role playing game", tpl: "Create a detailed systems design quest tree for a neo-noir detective investigation." },
          { name: "Open World", desc: "Open world game", tpl: "Create an environmental level layout documentation for an abandoned Mars research biodome." },
          { name: "FPS Game", desc: "First person shooter", tpl: "Create combat flight telemetry mechanics guidelines for a space simulator dogfighter." },
          { name: "Story Game", desc: "Story based game", tpl: "Create detailed dialogues and lore triggers for a dark cyber-stealth infiltration level." }
        ];
      default:
        return [
          { name: "Preset Alpha", desc: "Standard visual card", tpl: `Synthesize a standard creative preset prompt optimized for ${catName} operations.` },
          { name: "Preset Beta", desc: "Production preset", tpl: `Synthesize a highly structured, descriptive preset prompt for advanced ${catName} tasks.` },
          { name: "Preset Gamma", desc: "Technical system", tpl: `Synthesize a highly constrained, production-ready prompt template for ${catName}.` },
          { name: "Preset Delta", desc: "SaaS framework", tpl: `Synthesize a comprehensive, modern master framework prompt for ${catName}.` }
        ];
    }
  };

  const presets = getWorkspacePresets(category);

  useEffect(() => {
    setRawIdea(preloadedIdea || "");
    setRefineFeedback("");
    setGeneratedPrompt("");
  }, [category, preloadedIdea]);

  const handleGenerate = () => {
    if (!rawIdea.trim()) return;
    onGenerate(rawIdea, category, temp, tokens, model);
  };

  const handleRefine = () => {
    if (!refineFeedback.trim() || !generatedPrompt) return;
    onRefine(generatedPrompt, refineFeedback, category, temp, tokens);
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      
      {/* 1. HUD WORKSPACE HEADER */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-4">
          <motion.button 
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 rounded-xl border border-cyber-blue/20 bg-cyber-blue/5 text-cyber-cyan shadow-neon hover:shadow-[0_0_12px_#00D9FF] transition-all cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
          
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xl">{meta.icon}</span>
              <h2 className="font-cyber text-lg font-black bg-gradient-to-r from-cyber-cyan via-white to-cyber-purple bg-clip-text text-fill-transparent tracking-[1px] glow-cyan uppercase">
                {category}
              </h2>
            </div>
            <p className="text-[10px] text-slate-400 font-hud tracking-[1px] mt-0.5 uppercase">
              {meta.description || 'Generate high quality prompts dynamically.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-cyber-blue/10">
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_8px_#00F5FF]"></div>
          <span className="text-[9px] font-cyber text-cyber-blue tracking-[1.5px] uppercase">DECK_ACTIVE</span>
        </div>
      </div>

      {/* 2. SYMMETRICAL SIDE-BY-SIDE GRID LAYOUT (EXACTLY MATCHING IMAGE SPLIT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch relative">
        
        {/* Glowing middle AI Badge connector */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full border border-cyber-purple/40 bg-cyber-bg items-center justify-center shadow-[0_0_20px_#A855F7]">
          <div className="w-12 h-12 rounded-full border border-dashed border-cyber-blue/30 flex items-center justify-center animate-spin-slow"></div>
          <span className="absolute font-cyber text-[11px] text-cyber-purple glow-purple font-black">AI</span>
        </div>

        {/* LEFT COLUMN: Describe your task input card */}
        <div className="glass-panel corner-decor rounded-2xl p-5 flex flex-col gap-4 justify-between border-cyber-blue/15">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="font-cyber text-xs tracking-[1.5px] font-bold text-slate-200 uppercase">
                Describe your {category.toLowerCase()}...
              </span>
              <button 
                onClick={() => setRawIdea("")}
                className="text-[9.5px] font-cyber text-slate-500 hover:text-cyber-pink tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>

            <textarea
              placeholder={`Describe your ${category.toLowerCase()} task detail...&#10;e.g. enter detailed parameters or select templates below`}
              value={rawIdea}
              onChange={(e) => setRawIdea(e.target.value)}
              className="w-full h-[220px] bg-black/60 border border-cyber-blue/15 rounded-xl p-4 text-xs text-cyber-cyan font-mono focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_12px_rgba(0,217,255,0.12)] transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <div className="flex justify-between items-center text-[10px] font-hud text-slate-500 tracking-[1.5px] uppercase">
              <span>{rawIdea.length} / 1000 characters</span>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !rawIdea.trim()}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-cyber text-[10.5px] font-bold tracking-widest uppercase transition-all btn-shine-sweep cursor-pointer ${
                isGenerating || !rawIdea.trim()
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

        {/* RIGHT COLUMN: Generated Prompt Output Card */}
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
                  PROMPT STANDING BY. LAUNCH GENERATE COMMAND TO COMPILE CORES.
                </p>
              </div>
            )}

            {isCopied && (
              <div className="text-[9px] font-cyber text-cyber-cyan tracking-wider uppercase text-center animate-pulse">
                🚀 COPIED TO CLIPBOARD!
              </div>
            )}
          </div>

          {/* Action buttons row */}
          <div className="flex justify-between items-center gap-3">
            <button 
              onClick={handleCopy}
              disabled={!generatedPrompt}
              className={`flex-grow flex items-center justify-center gap-2 py-2.5 rounded-xl border font-cyber text-[9.5px] tracking-widest uppercase transition-all cursor-pointer ${
                generatedPrompt 
                  ? 'border-cyber-blue/20 bg-cyber-blue/5 hover:border-cyber-cyan text-cyber-cyan shadow-neon' 
                  : 'border-white/5 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </button>
            
            <button 
              disabled={!generatedPrompt}
              className={`flex-grow flex items-center justify-center gap-2 py-2.5 rounded-xl border font-cyber text-[9.5px] tracking-widest uppercase transition-all cursor-pointer ${
                generatedPrompt 
                  ? 'border-cyber-purple/20 bg-cyber-purple/5 hover:border-cyber-purple text-cyber-purple' 
                  : 'border-white/5 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              Favorite
            </button>

            <button 
              disabled={!generatedPrompt}
              className={`flex-grow flex items-center justify-center gap-2 py-2.5 rounded-xl border font-cyber text-[9.5px] tracking-widest uppercase transition-all cursor-pointer ${
                generatedPrompt 
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

      {/* 3. DYNAMIC BOTTOM CATEGORY TEMPLATES CARD DECK GRID */}
      <div className="glass-panel corner-decor rounded-2xl p-5 flex flex-col gap-4 border-cyber-blue/15">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyber-purple" />
            <h3 className="font-cyber text-xs tracking-[1.5px] font-bold text-white uppercase">{category} Templates</h3>
          </div>
          <span className="text-[10px] font-cyber text-cyber-blue tracking-[1.5px] uppercase cursor-pointer hover:underline">View All ➔</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
          {presets.map((preset, idx) => (
            <motion.div
              key={idx}
              onClick={() => setRawIdea(preset.tpl)}
              className="rounded-xl border border-white/5 bg-white/[0.01] hover:bg-cyber-blue/5 hover:border-cyber-blue/20 transition-all p-4 cursor-pointer text-left group flex items-center justify-between"
              whileHover={{ x: 2 }}
            >
              <div className="flex-grow">
                <h4 className="text-[11.5px] font-cyber font-bold text-slate-100 group-hover:text-cyber-cyan transition-colors uppercase tracking-[0.5px]">
                  {preset.name}
                </h4>
                <p className="text-[9px] text-slate-400 font-hud tracking-[1px] uppercase mt-0.5">
                  {preset.desc}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyber-cyan transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
