import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface WelcomeSplashProps {
  onStart: () => void;
}

// Generated landscape photo path
const logronoLandscape = '/src/assets/images/logrono_landscape_1785899342636.jpg';

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-2 sm:p-4 font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Outer Mobile Container Frame */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm sm:max-w-md h-[800px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between border border-slate-200 relative"
      >
        
        {/* TOP SECTION: Royal Blue Header with Emblem Logo */}
        <div className="bg-gradient-to-b from-[#083578] via-[#0A4191] to-[#0D4FB0] pt-12 pb-14 px-6 relative flex flex-col items-center justify-center text-center">
          
          {/* Subtle Decorative Background Circles */}
          <div className="absolute top-4 right-4 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* CIRCULAR LOGO EMBLEM */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white p-2 shadow-2xl border-4 border-[#072F6B] flex items-center justify-center relative z-10"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-b from-sky-50 to-emerald-50 p-1 flex items-center justify-center relative overflow-hidden">
              
              {/* Emblem Artwork (Wi-Fi, Green Mountains, White Monument) */}
              <svg viewBox="0 0 120 120" className="w-full h-full">
                {/* Outer Sky Circle */}
                <circle cx="60" cy="60" r="54" fill="#0A4191" opacity="0.1" />
                
                {/* Wi-Fi Signal Waves at top */}
                <path stroke="#0A4191" strokeWidth="3.5" strokeLinecap="round" fill="none" d="M42 32 Q60 22 78 32" />
                <path stroke="#0A4191" strokeWidth="3.5" strokeLinecap="round" fill="none" d="M48 39 Q60 31 72 39" />
                <path stroke="#0A4191" strokeWidth="3.5" strokeLinecap="round" fill="none" d="M54 46 Q60 40 66 46" />
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

        {/* MIDDLE SECTION: Smooth Curved White Card with Titles */}
        <div className="bg-white -mt-8 rounded-t-[36px] relative z-20 pt-7 pb-4 px-6 text-center shadow-lg border-t border-slate-100 flex flex-col items-center">
          
          {/* Main Title: LOGROÑO CONECTA */}
          <motion.div 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="space-y-0.5"
          >
            <h1 className="text-3xl sm:text-4xl font-black text-[#0A4191] tracking-tight font-serif uppercase">
              LOGROÑO
            </h1>
            <h2 className="text-3xl sm:text-4xl font-black text-[#159A44] tracking-tight font-serif uppercase">
              CONECTA
            </h2>
          </motion.div>

          {/* Slogan Subtitle */}
          <motion.p 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-slate-600 font-medium text-sm sm:text-base mt-3 max-w-[280px] leading-snug"
          >
            Conectamos ciudadanos con un mejor cantón
          </motion.p>
        </div>

        {/* BOTTOM SECTION: Logroño Landscape Photo & Action Button */}
        <div className="relative flex-1 min-h-[300px] overflow-hidden flex flex-col items-center justify-end p-6">
          
          {/* Real Landscape Photo */}
          <img 
            src={logronoLandscape}
            alt="Paisaje de Logroño Morona Santiago"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          />

          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-white/40" />

          {/* Centered "Comenzar" Button */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="relative z-10 w-full flex flex-col items-center space-y-3 mb-2"
          >
            <button
              type="button"
              onClick={onStart}
              className="w-full max-w-[240px] bg-[#0A4191] hover:bg-[#072F6B] text-white font-black text-lg py-3.5 px-8 rounded-2xl shadow-2xl hover:shadow-blue-900/50 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center space-x-2 tracking-wide border border-white/20"
            >
              <span>Comenzar</span>
              <ArrowRight className="w-5 h-5 text-emerald-400" />
            </button>

            <div className="flex items-center space-x-1.5 text-[11px] text-white/90 font-medium bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>GAD Municipal de Logroño 2026</span>
            </div>
          </motion.div>

        </div>

      </motion.div>
    </div>
  );
};
