import React, { useState } from 'react';
import { ActiveTab, LanguageMode } from '../types';
import { 
  ChevronRight, 
  ChevronLeft, 
  Home, 
  Smartphone, 
  LayoutDashboard, 
  BookOpenCheck, 
  History, 
  RotateCcw, 
  Layers, 
  Newspaper, 
  PlusCircle, 
  FileText, 
  Calendar, 
  User, 
  Settings, 
  Map, 
  MessageSquare, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Bot, 
  X,
  FileCheck
} from 'lucide-react';

export interface BreadcrumbStep {
  id: string;
  label: string;
  shuarLabel?: string;
  iconType?: string;
  activeTab: ActiveTab;
  citizenSubTab?: 'inicio' | 'reportar' | 'mis_reportes' | 'noticias' | 'agenda' | 'perfil' | 'configuracion' | 'mapa' | 'pqrs' | 'directorio';
  selectedNewsId?: string | null;
  newsTitle?: string;
  adminSubTab?: 'activas' | 'atendidas';
  techPhaseId?: number;
}

interface BreadcrumbNavProps {
  history: BreadcrumbStep[];
  currentIndex: number;
  onNavigateToStep: (index: number) => void;
  onGoBack: () => void;
  onResetToHome: () => void;
  lang: LanguageMode;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  history,
  currentIndex,
  onNavigateToStep,
  onGoBack,
  onResetToHome,
  lang
}) => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Helper to render icon for step
  const renderStepIcon = (type?: string) => {
    const className = "w-3.5 h-3.5 flex-shrink-0";
    switch (type) {
      case 'home':
        return <Home className={`${className} text-[#0A4191]`} />;
      case 'citizen_app':
        return <Smartphone className={`${className} text-[#0A4191]`} />;
      case 'admin_dashboard':
        return <LayoutDashboard className={`${className} text-[#0A4191]`} />;
      case 'tech_docs':
        return <BookOpenCheck className={`${className} text-amber-600`} />;
      case 'noticias':
        return <Newspaper className={`${className} text-blue-600`} />;
      case 'reportar':
        return <PlusCircle className={`${className} text-emerald-600`} />;
      case 'mis_reportes':
        return <FileText className={`${className} text-indigo-600`} />;
      case 'agenda':
        return <Calendar className={`${className} text-purple-600`} />;
      case 'perfil':
        return <User className={`${className} text-teal-600`} />;
      case 'configuracion':
        return <Settings className={`${className} text-slate-600`} />;
      case 'mapa':
        return <Map className={`${className} text-emerald-700`} />;
      case 'pqrs':
        return <MessageSquare className={`${className} text-amber-700`} />;
      case 'directorio':
        return <Building2 className={`${className} text-[#0A4191]`} />;
      case 'activas':
        return <Clock className={`${className} text-amber-600`} />;
      case 'atendidas':
        return <CheckCircle2 className={`${className} text-emerald-600`} />;
      case 'phase':
        return <Layers className={`${className} text-emerald-600`} />;
      case 'news_detail':
        return <FileCheck className={`${className} text-blue-600`} />;
      default:
        return <Home className={`${className} text-[#0A4191]`} />;
    }
  };

  const activeHistory = history.slice(0, currentIndex + 1);
  const canGoBack = currentIndex > 0;

  return (
    <div className="bg-slate-100/95 border-b border-blue-200/90 text-xs text-[#0A4191] shadow-2xs sticky top-[108px] z-30 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        
        {/* Left Side: Back Button & Breadcrumb Trail */}
        <div className="flex items-center space-x-1.5 min-w-0">
          
          {/* Back Button */}
          {canGoBack && (
            <button
              type="button"
              onClick={onGoBack}
              id="btn-breadcrumb-back"
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white hover:bg-blue-100/80 text-[#0A4191] border border-blue-300 font-black shadow-2xs hover:shadow-xs transition-all cursor-pointer shrink-0 text-[11px]"
              title="Volver a la pantalla anterior (Atrás)"
            >
              <ChevronLeft className="w-3.5 h-3.5 stroke-[3] text-[#0A4191]" />
              <span className="hidden sm:inline">Volver</span>
            </button>
          )}

          {/* Breadcrumb Trail Items */}
          <nav aria-label="Historial de Navegación" className="flex items-center space-x-1 text-xs font-semibold overflow-x-auto scrollbar-none py-0.5 min-w-0">
            {activeHistory.map((step, idx) => {
              const isLast = idx === activeHistory.length - 1;
              const displayLabel = (lang === 'shuar' && step.shuarLabel) ? step.shuarLabel : step.label;

              return (
                <React.Fragment key={`crumb-${step.id}-${idx}`}>
                  {idx > 0 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mx-0.5 stroke-[2.5]" />
                  )}

                  <button
                    type="button"
                    onClick={() => onNavigateToStep(idx)}
                    disabled={isLast}
                    className={`flex items-center space-x-1.5 px-2 py-1 rounded-md transition-all whitespace-nowrap text-[11px] ${
                      isLast
                        ? 'bg-[#0A4191] text-white font-black shadow-2xs cursor-default max-w-[220px] sm:max-w-[320px] truncate'
                        : 'text-[#0A4191] hover:bg-blue-200/60 font-bold cursor-pointer hover:underline'
                    }`}
                    title={isLast ? `Pantalla Actual: ${displayLabel}` : `Ir a: ${displayLabel}`}
                  >
                    {renderStepIcon(step.iconType)}
                    <span className="truncate">{displayLabel}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Quick Actions (History Stack Log & Reset to Home) */}
        <div className="flex items-center space-x-1.5 shrink-0 text-[11px] font-bold">
          
          {/* History Count Badge & Modal Trigger */}
          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0A4191] border border-blue-200 transition-colors cursor-pointer"
            title="Ver historial de navegación completo de la sesión"
          >
            <History className="w-3.5 h-3.5 text-[#0A4191]" />
            <span className="hidden md:inline">Historial</span>
            <span className="bg-[#0A4191] text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ml-0.5">
              {activeHistory.length}
            </span>
          </button>

          {/* Reset to Home Button */}
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={onResetToHome}
              className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
              title="Ir al Inicio principal"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden lg:inline">Inicio</span>
            </button>
          )}

        </div>

      </div>

      {/* History Log Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border-2 border-[#0A4191] rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 text-slate-900 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2 text-[#0A4191]">
                <div className="p-2 rounded-xl bg-blue-50 border border-blue-200">
                  <History className="w-5 h-5 text-[#0A4191]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight text-[#0A4191]">
                    Historial de Navegación
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Pantallas visitadas en esta sesión ({activeHistory.length})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Visited Screens */}
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {activeHistory.map((step, idx) => {
                const isCurrent = idx === currentIndex;
                const displayLabel = (lang === 'shuar' && step.shuarLabel) ? step.shuarLabel : step.label;

                return (
                  <button
                    key={`hist-modal-${step.id}-${idx}`}
                    type="button"
                    onClick={() => {
                      onNavigateToStep(idx);
                      setShowHistoryModal(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#0A4191] text-white border-[#0A4191] font-extrabold shadow-sm'
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-800 border-slate-200 hover:border-blue-300 font-bold'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black ${
                        isCurrent ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {idx + 1}
                      </span>
                      {renderStepIcon(step.iconType)}
                      <span className="text-xs truncate">{displayLabel}</span>
                    </div>

                    {isCurrent ? (
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase shrink-0">
                        Actual
                      </span>
                    ) : (
                      <span className="text-[10px] text-blue-600 hover:underline shrink-0">
                        Ir aquí
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Haga clic en cualquier nivel para volver</span>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
