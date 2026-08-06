import React, { useState } from 'react';
import { ActiveTab, LanguageMode, UserProfile } from '../types';
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
  ShieldAlert,
  LogOut,
  UserCheck,
  AlertTriangle,
  X
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: LanguageMode;
  setLang: (l: LanguageMode) => void;
  isOnline: boolean;
  offlineCount: number;
  openLogroBot: () => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  isOnline,
  offlineCount,
  openLogroBot,
  currentUser,
  onLogout
}) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
          <div className="flex items-center space-x-1.5 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-700/50" title={isOnline ? "Red Conectada" : `Modo Offline (${offlineCount} en cola)`}>
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-medium text-emerald-200 hidden sm:inline">Red Conectada</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-medium text-amber-300 hidden sm:inline">Offline ({offlineCount})</span>
                <span className="text-[10px] font-medium text-amber-300 sm:hidden">({offlineCount})</span>
              </>
            )}
          </div>

          {/* User Profile Badge & Logout */}
          {currentUser && (
            <div className="flex items-center space-x-2 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-600/60 text-[11px]">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold text-emerald-100 hidden sm:inline max-w-[120px] truncate">{currentUser.name}</span>
              {onLogout && (
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(true)}
                  className="ml-1 text-red-300 hover:text-red-200 flex items-center space-x-1 hover:underline cursor-pointer"
                  title="Cerrar sesión e ir al módulo de Login"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-[10px] hidden md:inline">Salir</span>
                </button>
              )}
            </div>
          )}

          {/* Shuar Intercultural Language Toggle */}
          <button
            onClick={() => setLang(lang === 'es' ? 'shuar' : 'es')}
            id="btn-language-toggle"
            className="flex items-center space-x-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-500/40 transition-colors cursor-pointer"
            title="Cambiar idioma intercultural (Español / Shuar Chicham)"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="text-[11px] font-bold tracking-wider hidden sm:inline">
              {lang === 'es' ? 'ESPAÑOL' : 'SHUAR CHICHAM'}
            </span>
            <span className="text-[11px] font-bold tracking-wider sm:hidden">
              {lang === 'es' ? 'ES' : 'SH'}
            </span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialog Modal for Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 text-slate-900 dark:text-slate-100 relative">
            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-3 text-amber-600 dark:text-amber-400">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-extrabold text-base leading-tight">¿Cerrar Sesión?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Confirmación para prevenir acciones accidentales</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Está a punto de salir de su cuenta municipal. Deberá iniciar sesión nuevamente para acceder a sus trámites y reportes.
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  if (onLogout) onLogout();
                }}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sí, salir</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
            title="App Ciudadana (PWA)"
            className={`flex items-center space-x-2 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'citizen_app'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">App Ciudadana</span>
          </button>

          <button
            id="nav-tab-admin-dashboard"
            onClick={() => setActiveTab('admin_dashboard')}
            title="Panel Municipal GAD"
            className={`flex items-center space-x-2 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'admin_dashboard'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Panel GAD</span>
          </button>

          <button
            id="nav-tab-tech-docs"
            onClick={() => setActiveTab('tech_docs')}
            title="Documentación Técnica (15 Fases)"
            className={`flex items-center space-x-2 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'tech_docs'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
            }`}
          >
            <BookOpenCheck className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <span className="hidden md:inline">Docs (15 Fases)</span>
          </button>

          <button
            id="nav-tab-logrobot-ai"
            onClick={openLogroBot}
            title="Asistente LogroBot IA"
            className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md font-bold cursor-pointer"
          >
            <Bot className="w-4 h-4 text-slate-950 flex-shrink-0" />
            <span className="hidden sm:inline">LogroBot IA</span>
            <span className="sm:hidden font-extrabold text-[11px]">IA</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
