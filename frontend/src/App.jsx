import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Star, Settings, Menu, X, ChevronRight, BookOpen } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Brain from './components/Brain';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';

// BACKEND API URL ROOT (Fallback to local origin for absolute path portability)
const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:8000' : window.location.origin;

const REAL_TEMPLATES = [
  {
    title: "Quantum Dashboard",
    category: "UI/UX",
    description: "Glassmorphic dashboard interface for a high-security quantum computing server tracking live memory, CPU, and node status.",
    text: "A glassmorphic dashboard interface for a high-security quantum computing server tracking live memory, CPU, and network node status in real-time with ambient cyan spotlights."
  },
  {
    title: "DeFi Landing Page",
    category: "UI/UX",
    description: "High-conversion Web3 landing page with interactive connect-wallet states.",
    text: "A futuristic DeFi dashboard landing page featuring a hero section, live token pricing grids, and dynamic connect-wallet button states with neon glow effects."
  },
  {
    title: "Async API Server",
    category: "Coding",
    description: "FastAPI boilerplate with concurrency and database connection pools.",
    text: "Write a high-performance FastAPI server template with asynchronous database querying using asyncpg, full Pydantic models validation, and connection pooling."
  },
  {
    title: "WebSocket Hook",
    category: "Coding",
    description: "React WebSocket custom hook with backoff reconnection.",
    text: "Write a production-grade React hook for WebSocket connections featuring automated exponential backoff reconnection, heartbeat checks, and error boundaries."
  },
  {
    title: "Jarvis Cognitive Loop",
    category: "AI Agent",
    description: "ReAct reasoning loop assistant persona with safety constraints.",
    text: "Configure a highly autonomous personal AI assistant acting with a Jarvis persona, utilizing a ReAct reasoning framework (Thought -> Action -> Observation) and vector-indexed memory boundaries."
  },
  {
    title: "Code Auditor Agent",
    category: "AI Agent",
    description: "CI/CD static code auditing agent checking for security issues.",
    text: "Configure a static analysis compliance agent for CI/CD environments that scans Git diff payloads for critical CVE vulnerabilities and suggests localized patches."
  },
  {
    title: "Tech Review Frame",
    category: "Thumbnail Design",
    description: "High-CTR tech review thumbnail layout using saturated neon highlights.",
    text: "Create a dramatic high-contrast YouTube thumbnail art brief featuring futuristic holographic goggles as the focal subject, illuminated by neon cyan rim lighting on the right third of the frame."
  },
  {
    title: "AI Apocalypse CTR Boost",
    category: "Thumbnail Design",
    description: "High-emotion thumbnail layout featuring a humanoid robot silhouette.",
    text: "Create a highly clickable, high-contrast video thumbnail brief showing a close-up of a humanoid robot's face with glowing cyan eyes, positioned to capture immediate user curiosity."
  },
  {
    title: "SaaS Launch Sequence",
    category: "Marketing",
    description: "Three-tiered launch sequence emails optimized with PAS framework hooks.",
    text: "Write a product launch email sequence using the Problem-Agitate-Solve (PAS) copywriting framework to launch an automated AI productivity tool to tech-focused early adopters."
  },
  {
    title: "Persuasive Landing Copy",
    category: "Marketing",
    description: "SaaS landing page copy highlighting automated workflows.",
    text: "Write compelling landing page hero copy and structured benefit cards for a developer-first SaaS platform, focusing on authentic, developer-friendly voice and clear CTAs."
  },
  {
    title: "Edge Database Service",
    category: "Startup Ideas",
    description: "Decentralized database startup blueprint and SaaS roadmap.",
    text: "A decentralized edge database service that synchronizes peer-to-peer with zero network latency, targeting high-concurrency real-time developer applications."
  },
  {
    title: "Solar Grid Sharing",
    category: "Startup Ideas",
    description: "Decentralized local energy sharing business outline.",
    text: "A decentralized solar-grid sharing platform connecting IoT home battery metrics to localized peer-to-peer trade nodes using smart contract tokens."
  },
  {
    title: "WebGL Creative Hub",
    category: "UI/UX",
    displayCategory: "Portfolio",
    description: "Interactive WebGL creative hub layout with fluid animations.",
    text: "A premium interactive WebGL portfolio hub design specification for a futuristic graphic designer, utilizing a fluid 3D grid layout, glassmorphic card overlays, and Outfit typography."
  },
  {
    title: "Holographic Resume Card",
    category: "UI/UX",
    displayCategory: "Portfolio",
    description: "Personal resume card with responsive cyber HUD details.",
    text: "A highly interactive, glassmorphic holographic personal resume component brief, using responsive flex layout structures, styled custom widgets, and Orbitron typography."
  },
  {
    title: "Orbiting City Shot",
    category: "Video Generation",
    description: "Dolly crane panning sequence over high-contrast cityscape.",
    text: "A 10-second cinematic drone shot flying over a neon-drenched dystopian cityscape during a rainstorm, zooming into a towering corporate skyscraper with volumetric fog."
  },
  {
    title: "Microchip Zoom In",
    category: "Video Generation",
    description: "Macro cinematic transition into computer motherboard.",
    text: "A macro close-up camera sequence zooming deep inside a quantum computer motherboard, highlighting glowing circuits and volumetric light rays reflecting off chrome surfaces."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedCatMeta, setSelectedCatMeta] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // API Core States
  const [categories, setCategories] = useState({});
  const [historyList, setHistoryList] = useState([]);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [systemStatus, setSystemStatus] = useState("CORE ONLINE");
  const [preloadedIdea, setPreloadedIdea] = useState("");
  const [templateFilter, setTemplateFilter] = useState("All");

  // Fetch initial configs on mount
  useEffect(() => {
    fetchCategories();
    fetchHistory();
    fetchSystemStatus();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error("Error fetching categories:", e);
      // Local UI fallback metadata if server offline
      setCategories({
        "UI/UX": { icon: "🎨", description: "User Interfaces", samples: ["Glassmorphic server status dashboard"] },
        "Coding": { icon: "💻", description: "Scripts & Codebases", samples: ["Asynchronous Python scraper"] },
        "AI Agent": { icon: "🤖", description: "Agentic Behaviors", samples: ["Vulnerability compliance static auditor"] },
        "Logo Design": { icon: "⚡", description: "Sleek Branding Marks", samples: ["Geometric aerospace emblem"] },
        "Game Design": { icon: "🎮", description: "Mechanics Loops", samples: ["Space dogfighter flight design documentation"] },
        "Thumbnail Design": { icon: "🖼️", description: "High-CTR Graphic Assets", samples: ["Neon YouTube developer frame"] },
        "Video Generation": { icon: "🎬", description: "Motion & Camera Blockings", samples: ["Neo-Tokyo tracking wide shot"] },
        "3D Art": { icon: "📐", description: "High Fidelity Asset Shading", samples: ["OCTANE console shader rig"] },
        "Marketing": { icon: "📈", description: "Landing Page Copywriting", samples: ["TaskFlow SaaS copy hook"] },
        "Startup Ideas": { icon: "💡", description: "Lean Business Deep Techs", samples: ["Decentralized edge energy micro-grid"] }
      });
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/history`);
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data);
      }
    } catch (e) {
      console.error("Error fetching prompt history:", e);
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/system-status`);
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data.api_state || "CORE ONLINE");
      }
    } catch (e) {
      setSystemStatus("🛡️ OFFLINE (SIMULATION FALLBACK ENGINE ACTIVE)");
    }
  };

  const handleClearHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/history/clear`, { method: "POST" });
      if (res.ok) {
        setHistoryList([]);
      }
    } catch (e) {
      console.error("Error flushing history database:", e);
    }
  };

  const handleGeneratePrompt = async (rawIdea, category, temp, tokens, model) => {
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_idea: rawIdea,
          category: category,
          temperature: temp,
          max_tokens: tokens,
          selected_model: model
        })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedPrompt(data.generated_prompt);
        fetchHistory(); // Refresh history log rolling stack
      } else {
        setGeneratedPrompt("⚠️ **API ERROR**: Backend synthesis returned an execution warning. Try again.");
      }
    } catch (e) {
      console.error("Connection failed:", e);
      setGeneratedPrompt("⚠️ **CONNECTION FAILED**: Core API server offline. Synaptic routing failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefinePrompt = async (currentPrompt, feedback, category, temp, tokens) => {
    setIsRefining(true);
    try {
      const res = await fetch(`${API_BASE}/api/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_prompt: currentPrompt,
          feedback: feedback,
          category: category,
          temperature: temp,
          max_tokens: tokens
        })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedPrompt(data.generated_prompt);
        fetchHistory();
      }
    } catch (e) {
      console.error("Refinement connection failed:", e);
    } finally {
      setIsRefining(false);
    }
  };

  const selectCategory = (name, meta) => {
    setSelectedCat(name);
    setSelectedCatMeta(meta);
    setPreloadedIdea("");
    setActiveTab('workspace');
  };

  const returnToDashboard = () => {
    setSelectedCat(null);
    setSelectedCatMeta(null);
    setPreloadedIdea("");
    setActiveTab('dashboard');
  };

  const handleUseTemplate = (template) => {
    const catName = template.category;
    const meta = categories[catName] || { icon: "🔮", description: catName + " Workspace" };
    setPreloadedIdea(template.text);
    setSelectedCat(catName);
    setSelectedCatMeta(meta);
    setActiveTab('workspace');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex bg-cyber-bg text-slate-100 p-4 md:p-6 select-none font-body">

      {/* HUD SCI-FI OVERLAYS */}
      <div className="scanlines"></div>

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden pointer-events-auto"
            />
            {/* Sidebar Drawer Container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[312px] bg-[#050816] z-50 lg:hidden p-4 border-r border-cyber-blue/20 pointer-events-auto flex flex-col h-screen"
            >
              <Sidebar 
                activeTab={activeTab} 
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setMobileSidebarOpen(false);
                }} 
                isMobile={true}
                onClose={() => setMobileSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CORE GRID LAYOUT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_340px] w-full h-full gap-6 relative z-10 overflow-hidden">

        {/* LEFT BAR PANEL */}
        <div className="hidden lg:block h-full overflow-hidden">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* MAIN HUD CONTROL DASHBOARD CENTER */}
        <div className="flex flex-col h-full overflow-hidden gap-6">

          {/* HEADER NAV STATUS BAR */}
          <div className="glass-panel corner-decor rounded-2xl px-6 py-4 flex items-center justify-between pointer-events-auto flex-shrink-0 border-cyber-blue/15">
            <div className="flex items-center gap-4">
              {/* Mobile Sidebar Toggle */}
              <button 
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden flex items-center justify-center w-8 h-8 rounded-xl border border-cyber-blue/35 bg-cyber-blue/10 text-cyber-cyan shadow-neon cursor-pointer hover:bg-cyber-cyan/20 transition-all"
              >
                <Menu className="w-4.5 h-4.5" />
              </button>
              <div>
                <span className="text-[10px] font-cyber text-cyber-blue tracking-[3px] uppercase">PROMPT_CRAFT_AI // HUD_CORE_v2.5</span>
                <h2 className="text-xs font-hud text-slate-400 tracking-[1.5px] mt-1 font-semibold uppercase">
                  AI CORE STATE: <span className="text-cyber-cyan">{systemStatus}</span>
                </h2>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-cyber text-slate-500 tracking-[2px] uppercase">SYS_GRID_DOCKS</span>
            </div>
          </div>

          {/* ACTIVE ROUTING SCREEN COMPONENT WITH TRANSITIONS */}
          <div className="flex-grow overflow-y-auto pr-1">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <Dashboard
                  key="dashboard"
                  categories={categories}
                  onSelectCategory={selectCategory}
                  onGenerate={handleGeneratePrompt}
                  isGenerating={isGenerating}
                  generatedPrompt={generatedPrompt}
                  setGeneratedPrompt={setGeneratedPrompt}
                  onRefine={handleRefinePrompt}
                  isRefining={isRefining}
                  historyList={historyList}
                  onClearHistory={handleClearHistory}
                />
              )}

              {activeTab === 'workspace' && selectedCat && (
                <Workspace
                  key="workspace"
                  category={selectedCat}
                  meta={selectedCatMeta}
                  preloadedIdea={preloadedIdea}
                  setPreloadedIdea={setPreloadedIdea}
                  onBack={returnToDashboard}
                  onGenerate={handleGeneratePrompt}
                  isGenerating={isGenerating}
                  generatedPrompt={generatedPrompt}
                  setGeneratedPrompt={setGeneratedPrompt}
                  onRefine={handleRefinePrompt}
                  isRefining={isRefining}
                />
              )}

              {activeTab === 'templates' && (
                <motion.div
                  key="templates"
                  className="glass-panel corner-decor rounded-2xl p-5 border border-cyber-blue/15 flex flex-col gap-5 pointer-events-auto h-[480px] overflow-hidden"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/5 pb-3 gap-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-cyber-cyan" />
                      <h2 className="font-cyber text-sm font-black tracking-[1.5px] text-white uppercase">Prompt Templates</h2>
                    </div>
                    <span className="text-[10px] font-cyber text-slate-500 tracking-[1.5px] uppercase">
                      Select a template to preload it in the workspace
                    </span>
                  </div>

                  {/* Horizontal Category Filters */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cyber-purple/20">
                    {["All", "UI/UX", "Coding", "AI Agent", "Thumbnail", "Marketing", "Startup", "Portfolio", "Video Generation"].map((filterOpt) => (
                      <button
                        key={filterOpt}
                        onClick={() => setTemplateFilter(filterOpt)}
                        className={`px-3 py-1.5 rounded-xl border text-[9.5px] font-cyber tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                          templateFilter === filterOpt
                            ? 'bg-cyber-purple/20 border-cyber-purple text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                            : 'border-white/5 text-slate-400 hover:text-cyber-cyan hover:bg-white/[0.01]'
                        }`}
                      >
                        {filterOpt}
                      </button>
                    ))}
                  </div>

                  {/* Templates Grid Container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-1 flex-grow pb-4 scrollbar-thin scrollbar-thumb-cyber-blue/10">
                    {REAL_TEMPLATES.filter(tpl => {
                      if (templateFilter === "All") return true;
                      if (templateFilter === "Portfolio") return tpl.displayCategory === "Portfolio";
                      if (templateFilter === "Thumbnail") return tpl.category === "Thumbnail Design";
                      if (templateFilter === "Startup") return tpl.category === "Startup Ideas";
                      return tpl.category === templateFilter;
                    }).map((template, idx) => (
                      <motion.div
                        key={idx}
                        className="rounded-xl border border-white/5 bg-white/[0.01] hover:bg-cyber-blue/5 hover:border-cyber-blue/20 transition-all p-4 flex flex-col justify-between gap-4 text-left group relative"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className={`text-[8.5px] font-cyber px-2 py-0.5 rounded border ${
                              template.displayCategory === 'Portfolio' 
                                ? 'border-cyber-pink/30 bg-cyber-pink/5 text-cyber-pink shadow-[0_0_5px_rgba(255,0,255,0.05)]'
                                : template.category === 'UI/UX'
                                ? 'border-cyber-blue/30 bg-cyber-blue/5 text-cyber-cyan shadow-[0_0_5px_rgba(0,217,255,0.05)]'
                                : template.category === 'Coding'
                                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
                                : template.category === 'AI Agent'
                                ? 'border-cyber-purple/30 bg-cyber-purple/5 text-cyber-purple shadow-[0_0_5px_rgba(168,85,247,0.05)]'
                                : 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400'
                            } tracking-widest uppercase`}>
                              {template.displayCategory || template.category}
                            </span>
                          </div>
                          <h4 className="text-[11.5px] font-cyber font-bold text-slate-100 group-hover:text-cyber-cyan transition-colors uppercase tracking-[0.5px]">
                            {template.title}
                          </h4>
                          <p className="text-[9.5px] text-slate-400 font-hud tracking-[0.5px] uppercase leading-relaxed mt-1">
                            {template.description}
                          </p>
                        </div>

                        <button
                          onClick={() => handleUseTemplate(template)}
                          className="w-full py-2 flex items-center justify-center gap-1.5 rounded-xl border border-cyber-purple/30 bg-cyber-purple/5 hover:border-cyber-purple text-white font-cyber text-[9px] tracking-widest uppercase hover:shadow-[0_0_12px_#A855F7] transition-all cursor-pointer text-center font-bold"
                        >
                          Use Template
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'favorites' && (
                <motion.div
                  key="favorites"
                  className="glass-panel corner-decor rounded-2xl p-8 text-center flex flex-col items-center justify-center h-[350px] pointer-events-auto border-cyber-blue/15"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <Star className="w-12 h-12 text-cyber-pink animate-pulse mb-4" />
                  <h2 className="font-cyber text-lg tracking-widest text-white uppercase">FAVORITES VAULT SECURE</h2>
                  <p className="text-xs font-hud text-slate-400 mt-2 uppercase">
                    Your starred prompts will sync and save safely here under secure session locks.
                  </p>
                  <button
                    onClick={returnToDashboard}
                    className="mt-6 px-6 py-2 rounded bg-cyber-pink hover:bg-cyber-pink/80 text-white font-cyber text-[10px] tracking-widest uppercase hover:shadow-[0_0_12px_#FF00FF]"
                  >
                    RETURN TO CORE
                  </button>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  className="glass-panel corner-decor rounded-2xl p-8 text-center flex flex-col items-center justify-center h-[350px] pointer-events-auto border-cyber-blue/15"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <Settings className="w-12 h-12 text-cyber-cyan animate-spin-slow mb-4" />
                  <h2 className="font-cyber text-lg tracking-widest text-white uppercase">SETTINGS HUD CORE</h2>
                  <p className="text-xs font-hud text-slate-400 mt-2 uppercase">
                    Configure API fallback thresholds, secure Groq keys, and visual scanline levels.
                  </p>
                  <button
                    onClick={returnToDashboard}
                    className="mt-6 px-6 py-2 rounded bg-cyber-blue hover:bg-cyber-blue/80 text-white font-cyber text-[10px] tracking-widest uppercase hover:shadow-[0_0_12px_#00D9FF]"
                  >
                    RETURN TO CORE
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DYNAMIC COPYRIGHT HUD FOOTER */}
          <div className="text-center font-hud text-[10px] text-slate-600 tracking-[3px] py-4 border-t border-white/5 uppercase flex-shrink-0">
            PROMPTCRAFT_AI // v2.5 // CORE POWERED BY GROQ HIGH VELOCITY ENGINE ⚡
          </div>

        </div>

        {/* RIGHT COLUMN: FLOATING HOLOGRAPHIC BRAIN HUD */}
        <div className="hidden xl:flex flex-col items-center justify-center p-6 border border-cyber-blue/15 bg-black/40 backdrop-blur-xl rounded-2xl corner-decor h-full select-none">
          <Brain />
        </div>

      </div>

    </div>
  );
}
