import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Radio, 
  MapPin, 
  Activity, 
  CheckCircle2, 
  Volume2,
  Building2,
  Compass
} from 'lucide-react';
import { WelcomeTouristMap } from './WelcomeTouristMap';

interface WelcomeSplashProps {
  onStart: () => void;
}

import logronoLandscape from '../assets/images/logrono_landscape.jpg';

// Highlights ticker for dynamic animated presentation
const HIGHLIGHT_CAROUSEL = [
  { icon: Zap, label: "Reportes en Tiempo Real", color: "text-amber-500", bg: "bg-amber-50 border-amber-200" },
  { icon: MapPin, label: "Georreferenciación GPS", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  { icon: Volume2, label: "Audio-Guía Shuar Chicham", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  { icon: Activity, label: "Despacho Inmediato de Cuadrillas", color: "text-purple-600", bg: "bg-purple-50 border-purple-200" }
];

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onStart }) => {
  const [activeHighlight, setActiveHighlight] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHighlight((prev) => (prev + 1) % HIGHLIGHT_CAROUSEL.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const CurrentHighlightIcon = HIGHLIGHT_CAROUSEL[activeHighlight].icon;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-2 sm:p-4 font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Outer Mobile Container Frame */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm sm:max-w-md h-[830px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col justify-between border-2 border-[#0A4191] relative"
      >
        
        {/* TOP SECTION: Animated Header & Emblem */}
        <div className="bg-gradient-to-b from-blue-900 via-[#0A4191] to-[#072F6B] text-white pt-8 pb-10 px-6 relative flex flex-col items-center justify-center text-center overflow-hidden border-b-2 border-[#0A4191]">
          
          {/* Animated Background Mesh Glows */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 w-44 h-44 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 -left-10 w-44 h-44 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" 
          />

          {/* Municipal Tag Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-wider mb-4 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>GAD MUNICIPAL DE LOGROÑO • CONECTIVIDAD</span>
          </motion.div>

          {/* ANIMATED CIRCULAR LOGO EMBLEM WITH PULSING RINGS */}
          <div className="relative flex items-center justify-center my-1">
            {/* Pulsing Outer Concentric Rings */}
            <motion.div 
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-36 h-36 rounded-full border-2 border-emerald-400/40 pointer-events-none"
            />
            <motion.div 
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute w-40 h-40 rounded-full border border-blue-300/30 pointer-events-none"
            />

            {/* Circular Logo Card */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 120 }}
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white p-2 shadow-2xl border-4 border-amber-400 flex items-center justify-center relative z-10 group"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-b from-sky-50 via-white to-emerald-50 p-1 flex items-center justify-center relative overflow-hidden">
                
                {/* Emblem Artwork (Wi-Fi, Green Mountains, White Monument) */}
                <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
                  {/* Outer Sky Circle */}
                  <circle cx="60" cy="60" r="54" fill="#0A4191" opacity="0.08" />
                  
                  {/* Animated Wi-Fi Signal Waves */}
                  <motion.path 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
                    stroke="#0A4191" strokeWidth="3.5" strokeLinecap="round" fill="none" d="M42 32 Q60 22 78 32" 
                  />
                  <motion.path 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
                    stroke="#0A4191" strokeWidth="3.5" strokeLinecap="round" fill="none" d="M48 39 Q60 31 72 39" 
                  />
                  <motion.path 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: 0 }}
                    stroke="#0A4191" strokeWidth="3.5" strokeLinecap="round" fill="none" d="M54 46 Q60 40 66 46" 
                  />
                  <circle cx="60" cy="51" r="2.5" fill="#0A4191" />

                  {/* Green Mountain Background */}
                  <path fill="#159A44" d="M15 80 Q35 52 60 70 Q85 50 105 80 Z" />
                  <path fill="#128239" d="M35 80 Q60 55 85 80 Z" />

                  {/* White Monument / Tower in Center */}
                  <path fill="#FFFFFF" stroke="#0A4191" strokeWidth="1.5" d="M55 78 L57 58 L60 52 L63 58 L65 78 Z" />
                  <circle cx="60" cy="56" r="2" fill="#0A4191" />

                  {/* Lower Green Arch Swoosh */}
                  <path fill="#159A44" d="M8 82 Q60 108 112 82 Q60 115 8 82 Z" />
                  <path stroke="#FFFFFF" strokeWidth="2" fill="none" d="M10 82 Q60 105 110 82" />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Floating Pill Badge Right */}
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 right-3 bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-xl shadow-lg border border-amber-300 flex items-center space-x-1"
          >
            <Sparkles className="w-3 h-3 fill-slate-950" />
            <span>App Oficial</span>
          </motion.div>

          {/* Floating Pill Badge Left */}
          <motion.div 
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-20 left-3 bg-white/90 backdrop-blur-md text-[#0A4191] font-black text-[10px] px-2.5 py-1 rounded-xl shadow-lg border border-blue-200 flex items-center space-x-1"
          >
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span>24/7 Digital</span>
          </motion.div>

        </div>

        {/* MIDDLE SECTION: Title & Dynamic Feature Slider Card */}
        <div className="bg-white -mt-6 rounded-t-[36px] relative z-20 pt-6 pb-4 px-6 text-center shadow-lg flex flex-col items-center space-y-3">
          
          {/* Main Title: LOGROÑO CONECTA */}
          <motion.div 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-0"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A4191] tracking-tight font-sans uppercase">
              LOGROÑO
            </h1>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A4191] tracking-tight font-sans uppercase">
              CONECTA
            </h2>
          </motion.div>

          {/* Slogan Subtitle */}
          <motion.p 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-slate-600 font-bold text-xs sm:text-sm max-w-[280px] leading-snug"
          >
            Conectamos ciudadanos con un mejor cantón
          </motion.p>

          {/* Animated Feature Carousel Banner Pill */}
          <div className="w-full pt-1">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeHighlight}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className={`w-full py-2 px-3.5 rounded-2xl border-2 flex items-center justify-between text-xs font-black shadow-xs ${HIGHLIGHT_CAROUSEL[activeHighlight].bg}`}
              >
                <div className="flex items-center space-x-2">
                  <CurrentHighlightIcon className={`w-4 h-4 stroke-[2.5] ${HIGHLIGHT_CAROUSEL[activeHighlight].color}`} />
                  <span className="text-[#0A4191] text-[11px] sm:text-xs">
                    {HIGHLIGHT_CAROUSEL[activeHighlight].label}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {HIGHLIGHT_CAROUSEL.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === activeHighlight ? 'bg-[#0A4191] w-3' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* BOTTOM SECTION: Interactive Tourist Map of Logroño */}
        <div className="relative flex-1 min-h-[350px] overflow-hidden flex flex-col justify-between p-3 sm:p-4 bg-slate-900 border-t-2 border-[#0A4191]">
          
          {/* MAP TITLE BADGE & LIVE STATUS */}
          <div className="relative z-20 flex items-center justify-between mb-2 gap-2">
            <div className="bg-[#0A4191] text-white px-3 py-1.5 rounded-2xl border-2 border-[#0A4191] flex items-center space-x-2 shadow-lg">
              <Compass className="w-4 h-4 text-amber-400 stroke-[2.5] shrink-0" />
              <span className="font-black text-xs tracking-tight">Mapa Turístico & Rutas de Logroño</span>
            </div>

            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-300 shadow-md flex items-center space-x-1 shrink-0">
              <CheckCircle2 className="w-3 h-3" />
              <span className="hidden sm:inline">Logroño Vivo</span>
            </span>
          </div>

          {/* MEDIA CONTENT DISPLAY */}
          <div className="relative flex-1 w-full rounded-2xl overflow-hidden my-1">
            <WelcomeTouristMap onStartApp={onStart} className="w-full h-full min-h-[290px]" />
          </div>

          {/* Centered "Comenzar" Dynamic Button Block */}
          <motion.div 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="relative z-20 w-full flex flex-col items-center space-y-2 mt-2"
          >
            <button
              type="button"
              onClick={onStart}
              className="w-full max-w-[280px] bg-[#0A4191] hover:bg-[#072F6B] text-white font-black text-base py-3.5 px-6 rounded-2xl shadow-xl hover:shadow-blue-900/60 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center space-x-3 tracking-wide border-2 border-white/30 group relative overflow-hidden"
            >
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
              />

              <span className="relative z-10 font-sans uppercase tracking-wider text-sm">Comenzar</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-6 h-6 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors"
              >
                <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:text-slate-950 transition-colors stroke-[3]" />
              </motion.div>
            </button>

            {/* Official GAD Footer Label */}
            <div className="flex items-center space-x-2 text-[10px] text-white font-bold bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>GAD Municipal de Logroño 2026</span>
            </div>
          </motion.div>

        </div>

      </motion.div>
    </div>
  );
};

