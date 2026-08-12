/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, Incident, IncidentStatus, LanguageMode, UserProfile } from './types';
import { INITIAL_INCIDENTS } from './data/mockIncidents';
import { Header } from './components/Header';
import { CitizenApp, CitizenSubTab, NewsItem, MOCK_NEWS } from './components/CitizenApp';
import { AdminPanel } from './components/AdminPanel';
import { TechnicalDocViewer } from './components/TechnicalDocViewer';
import { LogroBotModal } from './components/LogroBotModal';
import { LoginModule } from './components/LoginModule';
import { WelcomeSplash } from './components/WelcomeSplash';
import { BreadcrumbStep } from './components/BreadcrumbNav';
import { TECHNICAL_PHASES } from './data/technicalPhases';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('splash');
  const [lang, setLang] = useState<LanguageMode>('es');
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isLogroBotOpen, setIsLogroBotOpen] = useState<boolean>(false);

  // Subtab view states
  const [citizenSubTab, setCitizenSubTab] = useState<CitizenSubTab>('inicio');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [adminSubTab, setAdminSubTab] = useState<'activas' | 'atendidas'>('activas');
  const [techPhaseId, setTechPhaseId] = useState<number>(1);

  // Breadcrumb Navigation History Stack State
  const [history, setHistory] = useState<BreadcrumbStep[]>([
    {
      id: 'citizen-inicio',
      label: 'Inicio',
      shuarLabel: 'Pénker Pujustin',
      iconType: 'home',
      activeTab: 'citizen_app',
      citizenSubTab: 'inicio'
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Online / Offline Detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Helper to construct a step object
  const createStep = (
    tab: ActiveTab,
    cSubTab: CitizenSubTab = citizenSubTab,
    news: NewsItem | null = selectedNews,
    aSubTab: 'activas' | 'atendidas' = adminSubTab,
    tPhaseId: number = techPhaseId
  ): BreadcrumbStep => {
    if (tab === 'citizen_app') {
      if (news) {
        return {
          id: `citizen-${cSubTab}-news-${news.id}`,
          label: `Noticia: ${news.title}`,
          shuarLabel: `Chicham: ${news.title}`,
          iconType: 'news_detail',
          activeTab: 'citizen_app',
          citizenSubTab: cSubTab,
          selectedNewsId: news.id,
          newsTitle: news.title
        };
      }
      const labels: Record<CitizenSubTab, { es: string; shuar: string; icon: string }> = {
        inicio: { es: 'Inicio', shuar: 'Pénker Pujustin', icon: 'home' },
        reportar: { es: 'Reportar Incidencia', shuar: 'Najanma Chicham', icon: 'reportar' },
        mis_reportes: { es: 'Mis Reportes', shuar: 'Wi Najanma', icon: 'mis_reportes' },
        noticias: { es: 'Noticias & Comunicados', shuar: 'Chicham Umimamu', icon: 'noticias' },
        agenda: { es: 'Agenda Cantonal', shuar: 'Kakuin Takat', icon: 'agenda' },
        perfil: { es: 'Mi Perfil', shuar: 'Wi Profile', icon: 'perfil' },
        configuracion: { es: 'Configuración', shuar: 'Iwiaratai', icon: 'configuracion' },
        mapa: { es: 'Mapa Georreferenciado', shuar: 'Nununka Mapa', icon: 'mapa' },
        pqrs: { es: 'Atención PQRS', shuar: 'Anentai PQRS', icon: 'pqrs' },
        directorio: { es: 'Directorio GAD', shuar: 'GAD Aents', icon: 'directorio' }
      };
      const info = labels[cSubTab] || labels.inicio;
      return {
        id: `citizen-${cSubTab}`,
        label: info.es,
        shuarLabel: info.shuar,
        iconType: info.icon,
        activeTab: 'citizen_app',
        citizenSubTab: cSubTab
      };
    }

    if (tab === 'admin_dashboard') {
      if (aSubTab === 'atendidas') {
        return {
          id: 'admin-atendidas',
          label: 'Panel GAD (Atendidas)',
          shuarLabel: 'GAD Panel (Iwiarakamu)',
          iconType: 'atendidas',
          activeTab: 'admin_dashboard',
          adminSubTab: 'atendidas'
        };
      }
      return {
        id: 'admin-activas',
        label: 'Panel GAD (Activas)',
        shuarLabel: 'GAD Panel (Takastainiamu)',
        iconType: 'activas',
        activeTab: 'admin_dashboard',
        adminSubTab: 'activas'
      };
    }

    if (tab === 'tech_docs') {
      const phase = TECHNICAL_PHASES.find((p) => p.id === tPhaseId);
      const title = phase ? phase.title : `Fase ${tPhaseId}`;
      return {
        id: `tech-phase-${tPhaseId}`,
        label: `Fase ${tPhaseId}: ${title}`,
        shuarLabel: `Fase ${tPhaseId}: ${title}`,
        iconType: 'phase',
        activeTab: 'tech_docs',
        techPhaseId: tPhaseId
      };
    }

    return {
      id: `tab-${tab}`,
      label: tab === 'login' ? 'Inicio de Sesión' : 'Bienvenida',
      iconType: 'home',
      activeTab: tab
    };
  };

  // Push new step to history when user navigates
  const pushNavigationStep = (
    tab: ActiveTab,
    cSubTab: CitizenSubTab = citizenSubTab,
    news: NewsItem | null = selectedNews,
    aSubTab: 'activas' | 'atendidas' = adminSubTab,
    tPhaseId: number = techPhaseId
  ) => {
    const newStep = createStep(tab, cSubTab, news, aSubTab, tPhaseId);

    setHistory((prev) => {
      const sliced = prev.slice(0, currentIndex + 1);
      const currentStep = sliced[sliced.length - 1];

      // Avoid pushing duplicate step
      if (currentStep && currentStep.id === newStep.id) {
        return sliced;
      }

      // If step already exists earlier in stack, jump back to it
      const existingIndex = sliced.findIndex((s) => s.id === newStep.id);
      if (existingIndex !== -1) {
        setCurrentIndex(existingIndex);
        return sliced.slice(0, existingIndex + 1);
      }

      const updated = [...sliced, newStep];
      setCurrentIndex(updated.length - 1);
      return updated;
    });
  };

  // Tab & Subtab Nav Handlers
  const handleSelectActiveTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'citizen_app') {
      pushNavigationStep('citizen_app', citizenSubTab, selectedNews);
    } else if (tab === 'admin_dashboard') {
      pushNavigationStep('admin_dashboard', citizenSubTab, selectedNews, adminSubTab);
    } else if (tab === 'tech_docs') {
      pushNavigationStep('tech_docs', citizenSubTab, selectedNews, adminSubTab, techPhaseId);
    }
  };

  const handleCitizenSubTabChange = (subtab: CitizenSubTab) => {
    setCitizenSubTab(subtab);
    setSelectedNews(null);
    pushNavigationStep('citizen_app', subtab, null);
  };

  const handleSelectNewsItem = (news: NewsItem | null) => {
    setSelectedNews(news);
    pushNavigationStep('citizen_app', citizenSubTab, news);
  };

  const handleAdminSubTabChange = (aSubTab: 'activas' | 'atendidas') => {
    setAdminSubTab(aSubTab);
    pushNavigationStep('admin_dashboard', citizenSubTab, selectedNews, aSubTab);
  };

  const handleSelectTechPhaseId = (phaseId: number) => {
    setTechPhaseId(phaseId);
    pushNavigationStep('tech_docs', citizenSubTab, selectedNews, adminSubTab, phaseId);
  };

  // Restore State from Breadcrumb Step
  const applyStepState = (step: BreadcrumbStep) => {
    setActiveTab(step.activeTab);
    if (step.citizenSubTab) {
      setCitizenSubTab(step.citizenSubTab);
    }
    if (step.selectedNewsId !== undefined) {
      const newsItem = step.selectedNewsId
        ? MOCK_NEWS.find((n) => n.id === step.selectedNewsId) || null
        : null;
      setSelectedNews(newsItem);
    } else {
      setSelectedNews(null);
    }
    if (step.adminSubTab) {
      setAdminSubTab(step.adminSubTab);
    }
    if (step.techPhaseId) {
      setTechPhaseId(step.techPhaseId);
    }
  };

  const handleNavigateToStep = (index: number) => {
    if (index >= 0 && index < history.length) {
      setCurrentIndex(index);
      applyStepState(history[index]);
    }
  };

  const handleGoBack = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      applyStepState(history[prevIdx]);
    }
  };

  const handleResetToHome = () => {
    setCurrentIndex(0);
    applyStepState(history[0]);
  };

  // Login Success Callback
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    const targetTab: ActiveTab = user.role === 'admin' ? 'admin_dashboard' : 'citizen_app';
    setActiveTab(targetTab);

    // Reset breadcrumb history to initial landing tab
    const initialStep = createStep(targetTab, 'inicio', null, 'activas', 1);
    setHistory([initialStep]);
    setCurrentIndex(0);
  };

  // Logout Callback
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('login');
  };

  // Add Incident Callback
  const handleAddIncident = (newInc: Incident) => {
    setIncidents((prev) => [newInc, ...prev]);
  };

  // Update Status Callback from Admin Panel
  const handleUpdateStatus = (
    id: string,
    newStatus: IncidentStatus,
    department?: string,
    note?: string
  ) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          const newHistory = [
            ...inc.history,
            {
              status: newStatus,
              updatedBy: 'Despacho GAD Municipal Logroño',
              timestamp: new Date().toISOString(),
              note
            }
          ];
          const newComments = note
            ? [
                ...inc.comments,
                {
                  id: `c-${Date.now()}`,
                  author: 'GAD Municipal Logroño',
                  role: 'tecnico_gad' as const,
                  text: note,
                  timestamp: new Date().toISOString()
                }
              ]
            : inc.comments;

          return {
            ...inc,
            status: newStatus,
            assignedDepartment: department || inc.assignedDepartment,
            history: newHistory,
            comments: newComments,
            updatedAt: new Date().toISOString()
          };
        }
        return inc;
      })
    );
  };

  const offlineCount = incidents.filter((i) => i.isOfflineQueued).length;

  // If active tab is splash, show welcome splash screen first
  if (activeTab === 'splash') {
    return <WelcomeSplash onStart={() => setActiveTab('login')} />;
  }

  // If active tab is login or user is not logged in, display full login screen module
  if (activeTab === 'login' || !currentUser) {
    return (
      <LoginModule 
        onLoginSuccess={handleLoginSuccess} 
        lang={lang} 
        onBackToSplash={() => setActiveTab('splash')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-[#0A4191]">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleSelectActiveTab}
        lang={lang}
        setLang={setLang}
        isOnline={isOnline}
        offlineCount={offlineCount}
        openLogroBot={() => setIsLogroBotOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        breadcrumbHistory={history}
        breadcrumbIndex={currentIndex}
        onNavigateToStep={handleNavigateToStep}
        onGoBack={handleGoBack}
        onResetToHome={handleResetToHome}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-12">
        {activeTab === 'citizen_app' && (
          <CitizenApp
            incidents={incidents}
            onAddIncident={handleAddIncident}
            lang={lang}
            isOnline={isOnline}
            currentUser={currentUser}
            onLogout={handleLogout}
            activeSubTab={citizenSubTab}
            onSubTabChange={handleCitizenSubTabChange}
            selectedNewsItem={selectedNews}
            onSelectNewsItem={handleSelectNewsItem}
          />
        )}

        {activeTab === 'admin_dashboard' && (
          <AdminPanel
            incidents={incidents}
            onUpdateStatus={handleUpdateStatus}
            activeSubTab={adminSubTab}
            onSubTabChange={handleAdminSubTabChange}
          />
        )}

        {activeTab === 'tech_docs' && (
          <TechnicalDocViewer
            selectedPhaseId={techPhaseId}
            onSelectPhaseId={handleSelectTechPhaseId}
          />
        )}
      </main>

      {/* LogroBot Floating AI Assistant Modal */}
      <LogroBotModal
        isOpen={isLogroBotOpen}
        onClose={() => setIsLogroBotOpen(false)}
        lang={lang}
      />

      {/* Footer */}
      <footer className="bg-white text-[#0A4191] text-xs py-4 px-4 border-t-2 border-[#0A4191] text-center font-bold">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 GAD Municipal del Cantón Logroño - Morona Santiago, Ecuador. Todos los derechos reservados.
          </span>
          <div className="flex items-center space-x-3 text-[11px] text-[#0A4191]">
            <span>WCAG 2.2 AA Compliance</span>
            <span>•</span>
            <span>Shuar Chicham Intercultural</span>
            <span>•</span>
            <span>Powered by Google Gemini 3.6 Flash</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
