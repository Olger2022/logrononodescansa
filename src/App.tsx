/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, Incident, IncidentStatus, LanguageMode, UserProfile } from './types';
import { INITIAL_INCIDENTS } from './data/mockIncidents';
import { Header } from './components/Header';
import { CitizenApp } from './components/CitizenApp';
import { AdminPanel } from './components/AdminPanel';
import { TechnicalDocViewer } from './components/TechnicalDocViewer';
import { LogroBotModal } from './components/LogroBotModal';
import { LoginModule } from './components/LoginModule';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('login');
  const [lang, setLang] = useState<LanguageMode>('es');
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isLogroBotOpen, setIsLogroBotOpen] = useState<boolean>(false);

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

  // Login Success Callback
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('admin_dashboard');
    } else {
      setActiveTab('citizen_app');
    }
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

  // If active tab is login or user is not logged in, display full login screen module
  if (activeTab === 'login' || !currentUser) {
    return <LoginModule onLoginSuccess={handleLoginSuccess} lang={lang} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        isOnline={isOnline}
        offlineCount={offlineCount}
        openLogroBot={() => setIsLogroBotOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-12">
        {activeTab === 'citizen_app' && (
          <CitizenApp
            incidents={incidents}
            onAddIncident={handleAddIncident}
            lang={lang}
            isOnline={isOnline}
          />
        )}

        {activeTab === 'admin_dashboard' && (
          <AdminPanel
            incidents={incidents}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {activeTab === 'tech_docs' && (
          <TechnicalDocViewer />
        )}
      </main>

      {/* LogroBot Floating AI Assistant Modal */}
      <LogroBotModal
        isOpen={isLogroBotOpen}
        onClose={() => setIsLogroBotOpen(false)}
        lang={lang}
      />

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-200 text-xs py-4 px-4 border-t border-emerald-800 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 GAD Municipal del Cantón Logroño - Morona Santiago, Ecuador. Todos los derechos reservados.
          </span>
          <div className="flex items-center space-x-3 text-[11px] text-emerald-400">
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
