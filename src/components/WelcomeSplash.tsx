import React, { useState, useEffect, useRef } from 'react';
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
  TreePine,
  Upload,
  Camera,
  RotateCcw,
  Facebook,
  Twitter,
  MessageCircle,
  ExternalLink,
  Share2,
  Check
} from 'lucide-react';

interface WelcomeSplashProps {
  onStart: () => void;
}

import logronoLandscape from '../assets/images/logrono_landscape.jpg';
import palacioMunicipal from '../assets/images/palacio_municipal.png';

// Highlights ticker for dynamic animated presentation
const HIGHLIGHT_CAROUSEL = [
  { icon: Zap, label: "Reportes en Tiempo Real", color: "text-amber-500", bg: "bg-amber-50 border-amber-200" },
  { icon: MapPin, label: "Georreferenciación GPS", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  { icon: Volume2, label: "Audio-Guía Shuar Chicham", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  { icon: Activity, label: "Despacho Inmediato de Cuadrillas", color: "text-purple-600", bg: "bg-purple-50 border-purple-200" }
];

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onStart }) => {
  const [activeHighlight, setActiveHighlight] = useState(0);
  const [currentImage, setCurrentImage] = useState<string>(palacioMunicipal);
  const [isCustomImage, setIsCustomImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHighlight((prev) => (prev + 1) % HIGHLIGHT_CAROUSEL.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const processUploadedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCurrentImage(event.target.result as string);
        setIsCustomImage(true);
        showToast('¡Imagen de bienvenida actualizada con éxito!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleResetImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage(palacioMunicipal);
    setIsCustomImage(false);
    showToast('Imagen restaurada a la foto oficial del Palacio Municipal.');
  };

  const handleSocialClick = (platform: 'facebook' | 'whatsapp' | 'twitter') => {
    let url = '';
    let label = '';
    if (platform === 'facebook') {
      url = 'https://www.facebook.com/GADLogrono';
      label = 'Facebook del GAD Municipal';
    } else if (platform === 'whatsapp') {
      url = 'https://api.whatsapp.com/send?phone=593994321098&text=Hola%20GAD%20Municipal%20de%20Logro%C3%B1o%2C%20solicito%20informaci%C3%B3n%20y%20atenci%C3%B3n%20ciudadana.';
      label = 'WhatsApp de Atención Ciudadana';
    } else if (platform === 'twitter') {
      url = 'https://twitter.com/GADLogrono';
      label = 'Twitter / X Oficial';
    }

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      // safe fallback
    }
    showToast(`Conectando con ${label}...`);
  };

  const CurrentHighlightIcon = HIGHLIGHT_CAROUSEL[activeHighlight].icon;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-2 sm:p-4 font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Outer Mobile Container Frame */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm sm:max-w-md min-h-[850px] max-h-[96vh] sm:max-h-[920px] bg-white rounded-[32px] shadow-2xl overflow-y-auto overflow-x-hidden flex flex-col justify-between border-2 border-[#0A4191] relative scrollbar-thin scrollbar-thumb-slate-300"
      >
        
        {/* Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="absolute top-4 left-4 right-4 z-50 bg-slate-950/95 text-white border border-amber-400 text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="flex-1 text-[11px]">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP SECTION: Animated Header & Emblem */}
        <div className="bg-gradient-to-b from-blue-900 via-[#0A4191] to-[#072F6B] text-white pt-7 pb-8 px-6 relative flex flex-col items-center justify-center text-center overflow-hidden border-b-2 border-[#0A4191] shrink-0">
          
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
            className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-wider mb-3 shadow-sm"
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
              className="absolute w-32 h-32 rounded-full border-2 border-emerald-400/40 pointer-events-none"
            />
            <motion.div 
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute w-36 h-36 rounded-full border border-blue-300/30 pointer-events-none"
            />

            {/* Circular Logo Card */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 120 }}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white p-1.5 shadow-2xl border-4 border-amber-400 flex items-center justify-center relative z-10 group"
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
            className="absolute top-14 right-3 bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-xl shadow-lg border border-amber-300 flex items-center space-x-1"
          >
            <Sparkles className="w-3 h-3 fill-slate-950" />
            <span>App Oficial</span>
          </motion.div>

          {/* Floating Pill Badge Left */}
          <motion.div 
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-16 left-3 bg-white/90 backdrop-blur-md text-[#0A4191] font-black text-[10px] px-2.5 py-1 rounded-xl shadow-lg border border-blue-200 flex items-center space-x-1"
          >
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span>24/7 Digital</span>
          </motion.div>

        </div>

        {/* MIDDLE SECTION: Title & Dynamic Feature Slider Card */}
        <div className="bg-white -mt-5 rounded-t-[32px] relative z-20 pt-5 pb-3 px-6 text-center shadow-lg flex flex-col items-center space-y-2.5 shrink-0">
          
          {/* Main Title: LOGROÑO CONECTA */}
          <motion.div 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-0"
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A4191] tracking-tight font-sans uppercase">
              LOGROÑO
            </h1>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A4191] tracking-tight font-sans uppercase">
              CONECTA
            </h2>
          </motion.div>

          {/* Slogan Subtitle */}
          <motion.p 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-slate-600 font-bold text-xs max-w-[280px] leading-snug"
          >
            Conectamos ciudadanos con un mejor cantón
          </motion.p>

          {/* Animated Feature Carousel Banner Pill */}
          <div className="w-full pt-0.5">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeHighlight}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className={`w-full py-1.5 px-3 rounded-2xl border-2 flex items-center justify-between text-xs font-black shadow-xs ${HIGHLIGHT_CAROUSEL[activeHighlight].bg}`}
              >
                <div className="flex items-center space-x-2">
                  <CurrentHighlightIcon className={`w-3.5 h-3.5 stroke-[2.5] ${HIGHLIGHT_CAROUSEL[activeHighlight].color}`} />
                  <span className="text-[#0A4191] text-[11px]">
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

        {/* BOTTOM SECTION: Image Showcase, Upload Controls, Social Buttons & Big Action Button */}
        <div className="relative flex-1 flex flex-col justify-between p-3.5 sm:p-4 bg-slate-900 border-t-2 border-[#0A4191] space-y-3">
          
          {/* CONTENEDOR DE LA CARGA DE IMAGEN (HERO BANNER & UPLOAD ZONE) */}
          <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative w-full h-[210px] sm:h-[220px] rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-xl group ${
              isDragging 
                ? 'border-amber-400 scale-[1.02] ring-4 ring-amber-400/40 bg-slate-800' 
                : 'border-[#0A4191]/80 hover:border-blue-400/70 bg-slate-950'
            }`}
          >
            {/* Background Image Preview */}
            <img 
              src={currentImage} 
              alt="Palacio Municipal del Cantón Logroño" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />

            {/* Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />
            
            {/* Hidden Native File Input */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* TOP BAR INSIDE IMAGE CONTAINER: Badges & Upload / Change Controls */}
            <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between gap-1.5">
              <span className="bg-[#0A4191]/90 backdrop-blur-md text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full border border-blue-300/40 shadow-sm flex items-center space-x-1">
                <Building2 className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate max-w-[130px] sm:max-w-none">Morona Santiago • Ecuador</span>
              </span>

              {/* Action Buttons for Image Upload / Reset */}
              <div className="flex items-center space-x-1.5">
                {isCustomImage && (
                  <button
                    type="button"
                    onClick={handleResetImage}
                    title="Restaurar imagen oficial por defecto"
                    className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-700 shadow-md transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-400" />
                    <span className="hidden xs:inline">Original</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Cargar / Cambiar imagen de bienvenida"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-lg shadow-md transition-all flex items-center space-x-1 cursor-pointer border border-amber-300 hover:scale-105 active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                  <span>{isCustomImage ? 'Cambiar Foto' : 'Subir Foto'}</span>
                </button>
              </div>
            </div>

            {/* MIDDLE OVERLAY (Drop feedback) */}
            {isDragging && (
              <div className="absolute inset-0 z-30 bg-blue-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-1 animate-pulse">
                <Upload className="w-8 h-8 text-amber-400 animate-bounce" />
                <span className="font-extrabold text-xs">Suelta tu imagen aquí para cargar</span>
              </div>
            )}

            {/* BOTTOM SECTION INSIDE IMAGE CONTAINER: Title & Social Network Buttons (Facebook, WhatsApp, Twitter) */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex flex-col space-y-2">
              <div className="space-y-0.5">
                <div className="inline-flex items-center space-x-1 bg-amber-400 text-slate-950 font-black text-[8.5px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                  <TreePine className="w-2.5 h-2.5 text-slate-950" />
                  <span>Capital Ecológica & Intercultural</span>
                </div>
                <h3 className="text-white font-extrabold text-xs sm:text-sm leading-tight drop-shadow-md">
                  Gestión Cantonal e Interacción Ciudadana
                </h3>
              </div>

              {/* SOCIAL BUTTONS BAR (Facebook, WhatsApp, Twitter) */}
              <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                
                {/* BOTÓN FACEBOOK */}
                <button
                  type="button"
                  id="btn-welcome-facebook"
                  onClick={() => handleSocialClick('facebook')}
                  title="Visitar página oficial de Facebook del GAD Municipal de Logroño"
                  className="bg-[#1877F2] hover:bg-[#166fe5] active:scale-95 text-white font-black text-[10px] py-1.5 px-2 rounded-xl shadow-lg border border-blue-400/40 flex items-center justify-center space-x-1.5 transition-all cursor-pointer group"
                >
                  <Facebook className="w-3.5 h-3.5 fill-white text-white group-hover:scale-110 transition-transform shrink-0" />
                  <span className="tracking-tight">Facebook</span>
                </button>

                {/* BOTÓN WHATSAPP */}
                <button
                  type="button"
                  id="btn-welcome-whatsapp"
                  onClick={() => handleSocialClick('whatsapp')}
                  title="Contactar vía WhatsApp al canal de atención ciudadana"
                  className="bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-slate-950 font-black text-[10px] py-1.5 px-2 rounded-xl shadow-lg border border-emerald-300 flex items-center justify-center space-x-1.5 transition-all cursor-pointer group"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-slate-950 text-slate-950 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="tracking-tight">WhatsApp</span>
                </button>

                {/* BOTÓN TWITTER / X */}
                <button
                  type="button"
                  id="btn-welcome-twitter"
                  onClick={() => handleSocialClick('twitter')}
                  title="Seguir comunicados oficiales en Twitter / X"
                  className="bg-[#0f1419] hover:bg-[#1d2226] active:scale-95 text-white font-black text-[10px] py-1.5 px-2 rounded-xl shadow-lg border border-slate-700 flex items-center justify-center space-x-1.5 transition-all cursor-pointer group"
                >
                  <Twitter className="w-3.5 h-3.5 fill-sky-400 text-sky-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="tracking-tight">Twitter</span>
                </button>

              </div>
            </div>
          </div>

          {/* BOTON GRANDE ("COMENZAR • INGRESAR AL PORTAL CIUDADANO") */}
          <motion.div 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="relative z-20 w-full flex flex-col items-center space-y-2 pt-1"
          >
            <button
              type="button"
              id="btn-welcome-start-big"
              onClick={onStart}
              className="w-full bg-gradient-to-r from-[#0A4191] via-[#0D52B8] to-[#0A4191] hover:from-[#072F6B] hover:to-[#0D52B8] text-white font-black text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-2xl hover:shadow-blue-600/50 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center justify-between tracking-wide border-2 border-amber-400/80 group relative overflow-hidden"
            >
              {/* Animated Light Sweep Effect */}
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
              />

              {/* Left Star Glow Icon */}
              <div className="relative z-10 flex items-center space-x-3 text-left">
                <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-300 group-hover:text-slate-950 transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans uppercase font-extrabold text-sm sm:text-base tracking-wider leading-tight">
                    COMENZAR
                  </span>
                  <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider leading-none">
                    Ingresar al Portal Ciudadano
                  </span>
                </div>
              </div>

              {/* Right Animated Arrow */}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-amber-400 transition-colors shrink-0"
              >
                <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:text-slate-950 transition-colors stroke-[3]" />
              </motion.div>
            </button>

            {/* Official GAD Footer Label */}
            <div className="flex items-center space-x-2 text-[10px] text-slate-300 font-bold bg-slate-950/80 backdrop-blur-md px-3.5 py-1 rounded-full border border-slate-800 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>GAD Municipal del Cantón Logroño 2026</span>
            </div>
          </motion.div>

        </div>

      </motion.div>
    </div>
  );
};


