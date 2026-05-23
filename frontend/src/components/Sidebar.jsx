import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  LayoutDashboard, 
  Sparkles, 
  History, 
  BookOpen, 
  Star, 
  Settings, 
  Moon,
  ChevronRight,
  Crown,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isMobile, onClose }) {
  const [darkMode, setDarkMode] = useState(true);

  // EXACT 6 MENU ITEMS FOR THE MASTER DASHBOARD
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'generate', name: 'Generate Prompt', icon: Sparkles },
    { id: 'history', name: 'Prompt History', icon: History },
    { id: 'templates', name: 'Prompt Templates', icon: BookOpen },
    { id: 'favorites', name: 'Favorites', icon: Star },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between glass-panel rounded-2xl corner-decor p-5 pointer-events-auto select-none border-cyber-blue/15">
      
      {/* 1. BRAND LOGO & APP BRANDING */}
      <div className="flex items-center justify-between mt-1 border-b border-white/5 pb-5 w-full">
        <div className="flex items-center gap-3">
          <motion.div 
            className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-tr from-cyber-purple to-cyber-blue shadow-neon p-[1.5px]"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-full h-full rounded-xl bg-cyber-bg flex items-center justify-center">
              <Bot className="w-6 h-6 text-cyber-cyan" />
            </div>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyber-cyan/50 blur-[0.5px] animate-bounce"></div>
          </motion.div>
          
          <div className="text-left">
            <h2 className="font-cyber text-sm font-black tracking-[1.5px] text-white glow-cyan uppercase">
              PromptCraft AI
            </h2>
            <span className="text-[9px] font-hud text-slate-400 tracking-[1px] uppercase">
              Unleash the Power of AI
            </span>
          </div>
        </div>

        {isMobile && (
          <button 
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl border border-cyber-pink/35 bg-cyber-pink/10 text-cyber-pink shadow-neon cursor-pointer hover:bg-cyber-pink/20 transition-all flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. NAVIGATION LINKS PANEL */}
      <div className="flex-grow my-5 flex flex-col gap-1.5 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <div 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative cursor-pointer"
            >
              <motion.div
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                  isActive 
                    ? 'bg-cyber-purple/10 border-cyber-purple/35 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                    : 'bg-transparent border-transparent text-slate-400 hover:text-cyber-cyan hover:bg-white/[0.01]'
                }`}
                whileHover={{ x: 4 }}
                transition={{ type: 'tween', duration: 0.15 }}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyber-purple glow-purple' : 'group-hover:text-cyber-cyan'}`} />
                  <span className="text-[10.5px] font-hud tracking-[1.5px] font-semibold uppercase">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyber-purple animate-pulse" />}
              </motion.div>

              {/* Active Tab Glow Indicator Left border */}
              {isActive && (
                <motion.div 
                  className="absolute left-0 top-[15%] w-[3px] h-[70%] bg-gradient-to-b from-cyber-purple to-cyber-blue rounded-full shadow-[0_0_8px_#A855F7]"
                  layoutId="activeTabIndicator"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 3. PREMIUM DECK CARD & HUD SETTINGS */}
      <div className="flex flex-col gap-4">
        
        {/* PREMIUM UPGRADE DECK */}
        <motion.div 
          className="relative rounded-2xl bg-gradient-to-b from-cyber-purple/15 to-cyber-pink/5 border border-cyber-purple/20 p-4 overflow-hidden"
          whileHover={{ scale: 1.01 }}
        >
          <div className="absolute top-[-20px] right-[-20px] w-12 h-12 rounded-full bg-cyber-pink/20 blur-[20px]"></div>

          <div className="flex items-center gap-2 text-cyber-pink border-b border-white/5 pb-2">
            <Crown className="w-4 h-4 text-cyber-purple animate-pulse" />
            <span className="text-[10px] font-cyber tracking-[1.5px] uppercase font-black">Upgrade to Premium</span>
          </div>

          <ul className="text-[9.5px] text-slate-400 font-body flex flex-col gap-1.5 mt-3 list-disc list-inside pl-1">
            <li>Unlimited Generations</li>
            <li>Priority Access</li>
            <li>Advanced Models</li>
          </ul>
          
          <button className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-cyber text-[9px] font-bold tracking-widest uppercase hover:shadow-[0_0_15px_#00D9FF] hover:scale-[1.02] transition-all btn-shine-sweep cursor-pointer">
            Upgrade Now
          </button>
        </motion.div>

        {/* DARK MODE SWITCHER */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Moon className="w-3.5 h-3.5" />
            <span className="text-[10.5px] font-hud tracking-[1.5px] font-semibold uppercase">Dark Mode</span>
          </div>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-10 h-5 rounded-full p-[2px] transition-colors cursor-pointer ${
              darkMode ? 'bg-cyber-purple shadow-[0_0_8px_#A855F7]' : 'bg-slate-800'
            }`}
          >
            <motion.div 
              className="w-4 h-4 rounded-full bg-white shadow-md"
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              animate={{ x: darkMode ? 20 : 0 }}
            />
          </button>
        </div>

      </div>

    </div>
  );
}
