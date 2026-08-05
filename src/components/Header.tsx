import React from 'react';
import { ActiveTab, LanguageMode } from '../types';
import { SHUAR_DICTIONARY } from '../data/shuarDictionary';
import { 
  Building2, 
  Smartphone, 
  LayoutDashboard, 
  BookOpenCheck, 
  Bot, 
  Languages, 
  Wifi, 
  WifiOff, 
  ShieldAlert
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: LanguageMode;
  setLang: (l: LanguageMode) => void;
  isOnline: boolean;
  offlineCount: number;
  openLogroBot: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  isOnline,
  offlineCount,
  openLogroBot
}) => {
  return (
    <header className="bg-emerald-950 text-white shadow-lg border-b border-emerald-800 sticky top-0 z-40">
      {/* Top Banner: GAD Municipal Info */}
      <div className="bg-emerald-900/80 px-4 py-1.5 border-b border-emerald-800/60 text-xs text-emerald-100 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold tracking-wide">GOBIERNO AUTÓNOMO DESCENTRALIZADO MUNICIPAL DEL CANTÓN LOGROÑO</span>
          <span className="hidden sm:inline text-emerald-400">|</span>
          <span className="hidden sm:inline text-emerald-200">Morona Santiago, Ecuador</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Offline/Online Status Badge */}
          <div className="flex items-center space-x-1.5 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-medium text-emerald-200">Red Conectada</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-medium text-amber-300">Modo Offline ({offlineCount} en cola)</span>
              </>
            )}
          </div>

          {/* Shuar Intercultural Language Toggle */}
          <button
            onClick={() => setLang(lang === 'es' ? 'shuar' : 'es')}
            id="btn-language-toggle"
            className="flex items-center space-x-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-500/40 transition-colors cursor-pointer"
            title="Cambiar idioma intercultural (Español / Shuar Chicham)"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold tracking-wider">
              {lang === 'es' ? 'ESPAÑOL' : 'SHUAR CHICHAM'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('citizen_app')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-serif">
                Logroño Conecta
              </h1>
              <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-400/40 uppercase">
                2026 GAD Digital
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 font-medium">
              {lang === 'shuar'
                ? SHUAR_DICTIONARY.welcome.shuar
                : 'Participación Ciudadana y Gestión Inteligente de Incidencias'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 bg-emerald-900/60 p-1 rounded-xl border border-emerald-800/80 overflow-x-auto max-w-full">
          <button
            id="nav-tab-citizen-app"
            onClick={() => setActiveTab('citizen_app')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'citizen_app'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>App Ciudadana (PWA)</span>
          </button>

          <button
            id="nav-tab-admin-dashboard"
            onClick={() => setActiveTab('admin_dashboard')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'admin_dashboard'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Panel Municipal GAD</span>
          </button>

          <button
            id="nav-tab-tech-docs"
            onClick={() => setActiveTab('tech_docs')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'tech_docs'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
            }`}
          >
            <BookOpenCheck className="w-4 h-4 text-amber-300" />
            <span>Documentación Técnica (15 Fases)</span>
          </button>

          <button
            id="nav-tab-logrobot-ai"
            onClick={openLogroBot}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md font-bold cursor-pointer"
          >
            <Bot className="w-4 h-4 text-slate-950" />
            <span>LogroBot IA</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
