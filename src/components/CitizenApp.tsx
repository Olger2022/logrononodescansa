import React, { useState } from 'react';
import { Incident, IncidentCategory, LogronoSector, LanguageMode, AIAnalysisResult, UserProfile } from '../types';
import { SHUAR_DICTIONARY } from '../data/shuarDictionary';
import { LogronoGoogleMap } from './LogronoGoogleMap';
import { 
  PlusCircle, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Send, 
  Sparkles, 
  PhoneCall, 
  ChevronRight, 
  FileText, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  RefreshCw,
  UserCheck,
  ShieldCheck,
  Flame,
  Ambulance,
  ArrowLeft,
  Bell,
  Calendar,
  Newspaper,
  Siren,
  FileCheck,
  Home,
  User,
  Plus,
  X,
  LogOut,
  Building2,
  HelpCircle,
  Map,
  Layers,
  Lightbulb,
  Droplets,
  Waves,
  Milestone,
  Trash2,
  Trees,
  ShieldAlert,
  Camera,
  Check,
  Upload,
  Navigation,
  Image as ImageIcon
} from 'lucide-react';

interface CitizenAppProps {
  incidents: Incident[];
  onAddIncident: (newInc: Incident) => void;
  lang: LanguageMode;
  isOnline: boolean;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
}

export const CitizenApp: React.FC<CitizenAppProps> = ({
  incidents,
  onAddIncident,
  lang,
  isOnline,
  currentUser,
  onLogout
}) => {
  const [citizenTab, setCitizenTab] = useState<'inicio' | 'reportar' | 'mis_reportes' | 'mapa' | 'pqrs' | 'directorio'>('inicio');
  const [reportStep, setReportStep] = useState<'category' | 'wizard'>('category');
  const [reportWizardStep, setReportWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [misReportesFilter, setMisReportesFilter] = useState<'todos' | 'en_proceso' | 'solucionados'>('todos');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  // Modals state for 6-grid & nav items
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showAgendaModal, setShowAgendaModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // New Incident Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('Vías y Aceras');
  const [sector, setSector] = useState<LogronoSector>(currentUser?.sector || 'Logroño Centro (Cabecera)');
  const [address, setAddress] = useState('Calle 10 de Agosto y Av. Intercultural, Logroño');
  const [reference, setReference] = useState('');
  const [citizenName, setCitizenName] = useState(currentUser?.name || 'María Shakaim');
  const [citizenPhone, setCitizenPhone] = useState('0984712039');
  const [citizenCedula, setCitizenCedula] = useState(currentUser?.cedula || '1400829104');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80');
  
  // AI Analysis State
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiPreview, setAiPreview] = useState<AIAnalysisResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Selected Incident for Detail Modal
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Shuar Audio Simulation State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // PQRS Form state
  const [pqrsType, setPqrsType] = useState<'Petición' | 'Queja' | 'Reclamo' | 'Sugerencia'>('Petición');
  const [pqrsSubject, setPqrsSubject] = useState('');
  const [pqrsDetail, setPqrsDetail] = useState('');
  const [pqrsSuccess, setPqrsSuccess] = useState(false);

  // Categories list
  const categories: IncidentCategory[] = [
    'Vías y Aceras',
    'Agua Potable y Alcantarillado',
    'Alumbrado Público',
    'Parques y Áreas Verdes',
    'Fauna Urbana y Limpieza',
    'Gestión de Residuos',
    'Seguridad y Ruidos',
    'Infraestructura Shuar / Comunitaria'
  ];

  // Sectors list
  const sectors: LogronoSector[] = [
    'Logroño Centro (Cabecera)',
    'Parroquia Yaupi',
    'Parroquia Shimpis',
    'Comunidad Shuar Kakaim',
    'Comunidad Shuar Kimius',
    'Sector Río Upano',
    'Sector Transkutukú'
  ];

  // Trigger Gemini AI Pre-Analysis
  const handleAnalyzeWithAI = async () => {
    if (!title && !description) {
      alert('Por favor ingresa un título o descripción breve primero para que la IA lo analice.');
      return;
    }
    setIsAnalyzingAI(true);
    setAiPreview(null);

    try {
      const response = await fetch('/api/classify-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          sector,
          photoBase64: photoUrl
        })
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAiPreview(data.analysis);
      } else {
        throw new Error(data.error || 'No se pudo generar el análisis');
      }
    } catch (err) {
      console.warn('Fallback local AI classification:', err);
      setAiPreview({
        score: category === 'Agua Potable y Alcantarillado' ? 5 : 3,
        priority: category === 'Agua Potable y Alcantarillado' ? 'critica' : 'media',
        suggestedCategory: category,
        department: category === 'Agua Potable y Alcantarillado' 
          ? 'Unidad de Agua Potable y Saneamiento' 
          : 'Dirección de Obras Públicas Municipales',
        estimatedHours: 24,
        tags: ['Auto-Clasificado Gemini', sector, category],
        recommendation: 'Asignar inspección técnica prioritaria en el sector ' + sector,
        urgencyExplanation: 'Incidencia reportada con coordenadas GPS en ' + sector + '.'
      });
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  // Submit Incident Handler
  const handleSubmitIncident = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!description) return;

    setIsSubmitting(true);
    const randomNum = String(Math.floor(10 + Math.random() * 9899)).padStart(5, '0');
    const newCode = `RPT-2026-${randomNum}`;

    const newIncident: Incident = {
      id: `inc-${Date.now()}`,
      code: newCode,
      title: title || `${category} - ${address}`,
      description,
      category: aiPreview?.suggestedCategory || category,
      status: 'reportado',
      priority: aiPreview?.priority || 'media',
      location: {
        lat: sector === 'Parroquia Yaupi' ? -2.6315 : sector === 'Parroquia Shimpis' ? -2.6102 : -2.6280,
        lng: sector === 'Parroquia Yaupi' ? -78.1824 : sector === 'Parroquia Shimpis' ? -78.1450 : -78.1760,
        address: address || 'Calle 24 de Mayo y Sucre',
        sector,
        reference
      },
      photoUrl,
      assignedDepartment: aiPreview?.department || 'Dirección de Obras Públicas Municipales',
      citizenName,
      citizenPhone,
      citizenCedula,
      citizenSector: sector,
      aiAnalysis: aiPreview || undefined,
      comments: [
        {
          id: `c-${Date.now()}`,
          author: citizenName,
          role: 'ciudadano',
          text: description,
          timestamp: new Date().toISOString()
        }
      ],
      history: [
        {
          status: 'reportado',
          updatedBy: citizenName,
          timestamp: new Date().toISOString(),
          note: isOnline ? 'Reporte enviado vía App Logroño Conecta' : 'Guardado en cola offline del dispositivo'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOfflineQueued: !isOnline
    };

    setTimeout(() => {
      onAddIncident(newIncident);
      setIsSubmitting(false);
      setSubmitSuccess(newCode);
      setReportWizardStep(4);
    }, 600);
  };

  // Play Shuar Audio Narration
  const playShuarAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 3500);
  };

  // User display name helper (e.g., "María")
  const userFirstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'María';

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
      
      {/* Frame Switcher Bar */}
      <div className="flex justify-between items-center bg-slate-200 dark:bg-slate-800 p-2 rounded-xl mb-3 border border-slate-300 dark:border-slate-700">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="bg-[#0A4191] text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Logroño Conecta Mobile
          </span>
          <span className="hidden sm:inline">Vista de la Aplicación Móvil</span>
        </div>
        
        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          id="btn-toggle-phone-frame"
          className="flex items-center space-x-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-100 text-xs px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm transition-all cursor-pointer font-medium"
        >
          {isPhoneFrame ? (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Vista Extendida</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Formato Smartphone</span>
            </>
          )}
        </button>
      </div>

      {/* Main Smartphone Layout Box */}
      <div className={isPhoneFrame ? "max-w-sm mx-auto bg-slate-950 p-2 sm:p-3 rounded-[40px] shadow-2xl border-4 border-slate-800" : "max-w-2xl mx-auto"}>
        
        {/* Smartphone Screen Notch Header */}
        {isPhoneFrame && (
          <div className="flex justify-between items-center px-5 py-1 text-[10px] font-semibold text-slate-400 bg-slate-950 rounded-t-[32px]">
            <span>09:41</span>
            <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-800" />
            </div>
            <div className="flex items-center space-x-1">
              <span>5G</span>
              <div className="w-4 h-2 bg-emerald-500 rounded-xs" />
            </div>
          </div>
        )}

        {/* Smartphone Inner Screen Content */}
        <div className="bg-slate-100 dark:bg-slate-900 rounded-[32px] shadow-inner overflow-hidden flex flex-col min-h-[720px] relative border border-slate-300 dark:border-slate-800">
          
          {/* ==================== 1. ROYAL BLUE HEADER ==================== */}
          <div className="bg-gradient-to-b from-[#083578] via-[#0A4191] to-[#0D4FB0] text-white px-4 pt-4 pb-10 flex items-center justify-between relative z-10">
            {/* Left Action: Back / Logout */}
            <button
              type="button"
              onClick={() => {
                if (citizenTab !== 'inicio') {
                  setCitizenTab('inicio');
                } else if (onLogout) {
                  onLogout();
                }
              }}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-white/20"
              title="Volver al menú principal / Salir"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>

            {/* Title: LOGROÑO CONECTA */}
            <div className="text-center">
              <h1 className="text-lg font-black tracking-wider text-white uppercase font-serif">
                LOGROÑO CONECTA
              </h1>
            </div>

            {/* Right Action: Bell Notification */}
            <button
              type="button"
              onClick={() => setShowNotificationModal(true)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-white/20 relative"
              title="Notificaciones"
            >
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-[#0A4191] animate-ping" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-[#0A4191]" />
            </button>
          </div>

          {/* ==================== 2. MAIN SCREEN CONTENT AREA ==================== */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-t-[32px] -mt-7 relative z-20 px-4 pt-5 pb-20 overflow-y-auto">
            
            {/* TAB 1: HOME / INICIO VIEW (MATCHES SCREENSHOT EXACTLY) */}
            {citizenTab === 'inicio' && (
              <div className="space-y-5">
                
                {/* Greeting Section */}
                <div className="space-y-0.5">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2 font-serif">
                    <span>¡Hola, {userFirstName}!</span>
                    <span className="text-2xl">👋</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    ¿Cómo podemos ayudarte hoy?
                  </p>
                </div>

                {/* Primary Action Button: "Reportar incidencia" */}
                <button
                  type="button"
                  onClick={() => {
                    setReportStep('category');
                    setCitizenTab('reportar');
                  }}
                  className="w-full bg-[#159A44] hover:bg-[#128239] active:bg-[#0f6f30] text-white font-black py-4 px-6 rounded-2xl shadow-lg hover:shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2 text-base tracking-wide border border-emerald-500/30 group"
                >
                  <PlusCircle className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
                  <span>Reportar incidencia</span>
                </button>

                {/* Shuar Culture Audio Assist Banner */}
                <div className="bg-emerald-950/90 text-emerald-100 p-2.5 rounded-xl border border-emerald-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold">Shuar Chicham Audio-Guía</span>
                  </div>
                  <button
                    type="button"
                    onClick={playShuarAudio}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center space-x-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlayingAudio ? 'Escuchando...' : 'Escuchar'}</span>
                  </button>
                </div>

                {/* 6-GRID ACTION CARDS (2 rows x 3 columns) */}
                <div className="grid grid-cols-3 gap-3">
                  
                  {/* Card 1: Mis reportes */}
                  <button
                    type="button"
                    onClick={() => setCitizenTab('mis_reportes')}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group aspect-square"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0A4191] dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                      Mis reportes
                    </span>
                  </button>

                  {/* Card 2: Noticias */}
                  <button
                    type="button"
                    onClick={() => setShowNewsModal(true)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group aspect-square"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0A4191] dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Newspaper className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                      Noticias
                    </span>
                  </button>

                  {/* Card 3: Agenda */}
                  <button
                    type="button"
                    onClick={() => setShowAgendaModal(true)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-red-400 transition-all cursor-pointer group aspect-square"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Calendar className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                      Agenda
                    </span>
                  </button>

                  {/* Card 4: Emergencias */}
                  <button
                    type="button"
                    onClick={() => setShowEmergencyModal(true)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-red-400 transition-all cursor-pointer group aspect-square"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Siren className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                      Emergencias
                    </span>
                  </button>

                  {/* Card 5: Directorio */}
                  <button
                    type="button"
                    onClick={() => setCitizenTab('directorio')}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group aspect-square"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0A4191] dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <PhoneCall className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                      Directorio
                    </span>
                  </button>

                  {/* Card 6: Trámites */}
                  <button
                    type="button"
                    onClick={() => setCitizenTab('pqrs')}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group aspect-square"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#159A44] dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <FileCheck className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                      Trámites
                    </span>
                  </button>

                </div>

                {/* Map Quick Access Banner */}
                <div 
                  onClick={() => setCitizenTab('mapa')}
                  className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-all shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                      <Map className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">Mapa Georreferenciado</h4>
                      <p className="text-[10px] text-slate-300">Ver marcadores de Logroño, Yaupi y Shimpis</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </div>

                {/* Cantonal Alert Box */}
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3 rounded-2xl flex items-start space-x-2 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 dark:text-amber-300 block text-[11px]">
                      Aviso de Prevención Cantonal
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 text-[10px] mt-0.5">
                      Vía Logroño - Yaupi habilitada con precaución por cuadrillas del GAD Municipal.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: REPORTAR INCIDENCIA */}
            {citizenTab === 'reportar' && (
              <div className="space-y-4 text-xs">

                {/* STEP 1: CATEGORY SELECTION (MATCHES MOCKUP 08 EXACTLY) */}
                {reportStep === 'category' && (
                  <div className="space-y-4">
                    {/* Header Title & Subtitle */}
                    <div className="text-center space-y-1 pt-1 pb-2">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white font-serif tracking-tight">
                        Reportar incidencia
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Selecciona la categoría
                      </p>
                    </div>

                    {/* 2-Column Grid of Categories matching Mockup 08 */}
                    <div className="grid grid-cols-2 gap-3.5 pt-1">
                      
                      {/* 1. Alumbrado Público */}
                      <button
                        type="button"
                        onClick={() => {
                          setCategory('Alumbrado Público');
                          setTitle('Poste de luz quemado');
                          if (!description) setDescription('El poste de luz frente a mi casa no funciona desde hace 3 días.');
                          setPhotoUrl('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80');
                          setReportStep('wizard');
                          setReportWizardStep(1);
                        }}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group aspect-[4/3.2]"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                          <Lightbulb className="w-7 h-7 stroke-[2.2]" />
                        </div>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                          Alumbrado Público
                        </span>
                      </button>

                      {/* 2. Agua Potable */}
                      <button
                        type="button"
                        onClick={() => {
                          setCategory('Agua Potable y Alcantarillado');
                          setTitle('Fuga de agua en acera principal');
                          if (!description) setDescription('Fuga de agua constante en la acometida de la vivienda.');
                          setPhotoUrl('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80');
                          setReportStep('wizard');
                          setReportWizardStep(1);
                        }}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group aspect-[4/3.2]"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-500 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                          <Droplets className="w-7 h-7 stroke-[2.2]" />
                        </div>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                          Agua Potable
                        </span>
                      </button>

                      {/* 3. Alcantarillado */}
                      <button
                        type="button"
                        onClick={() => {
                          setCategory('Agua Potable y Alcantarillado');
                          setTitle('Alcantarilla obstruida');
                          if (!description) setDescription('Tapa de alcantarilla corrida y rebose de agua lluvia.');
                          setPhotoUrl('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80');
                          setReportStep('wizard');
                          setReportWizardStep(1);
                        }}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer group aspect-[4/3.2]"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                          <Waves className="w-7 h-7 stroke-[2.2]" />
                        </div>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                          Alcantarillado
                        </span>
                      </button>

                      {/* 4. Calles */}
                      <button
                        type="button"
                        onClick={() => {
                          setCategory('Vías y Aceras');
                          setTitle('Bache profundo en la calzada');
                          if (!description) setDescription('Bache de gran tamaño afectando el tránsito vehicular.');
                          setPhotoUrl('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80');
                          setReportStep('wizard');
                          setReportWizardStep(1);
                        }}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-slate-500 transition-all cursor-pointer group aspect-[4/3.2]"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                          <Milestone className="w-7 h-7 stroke-[2.2]" />
                        </div>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                          Calles
                        </span>
                      </button>

                      {/* 5. Basura */}
                      <button
                        type="button"
                        onClick={() => {
                          setCategory('Gestión de Residuos');
                          setTitle('Contenedor desbordado');
                          if (!description) setDescription('Acumulación de basura fuera del contenedor requiere recolección.');
                          setPhotoUrl('https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80');
                          setReportStep('wizard');
                          setReportWizardStep(1);
                        }}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group aspect-[4/3.2]"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#159A44] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                          <Trash2 className="w-7 h-7 stroke-[2.2]" />
                        </div>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                          Basura
                        </span>
                      </button>

                      {/* 6. Parques y Áreas Verdes */}
                      <button
                        type="button"
                        onClick={() => {
                          setCategory('Parques y Áreas Verdes');
                          setTitle('Mantenimiento de césped en parque');
                          if (!description) setDescription('Maleza alta en el parque central requiere corte y limpieza.');
                          setPhotoUrl('https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600&auto=format&fit=crop&q=80');
                          setReportStep('wizard');
                          setReportWizardStep(1);
                        }}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group aspect-[4/3.2]"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                          <Trees className="w-7 h-7 stroke-[2.2]" />
                        </div>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 line-clamp-1">
                          Parques y Áreas Verdes
                        </span>
                      </button>

                      {/* 7. Fauna y Limpieza */}
                      <button
                        type="button"
                        onClick={() => {
                          setCategory('Fauna Urbana y Limpieza');
                          setTitle('Limpieza de espacio público');
                          if (!description) setDescription('Solicitud de desbroce y desinfección en espacio comunal.');
                          setPhotoUrl('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80');
                          setReportStep('wizard');
                          setReportWizardStep(1);
                        }}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-purple-400 transition-all cursor-pointer group aspect-[4/3.2]"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                          <ShieldAlert className="w-7 h-7 stroke-[2.2]" />
                        </div>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 line-clamp-1">
                          Fauna y Limpieza
                        </span>
                      </button>

                      {/* 8. Comunitaria Shuar */}
                      <button
                        type="button"
                        onClick={() => {
                          setCategory('Infraestructura Shuar / Comunitaria');
                          setTitle('Inspección de obra comunitaria Shuar');
                          if (!description) setDescription('Solicitud de mantenimiento técnico en infraestructura comunal.');
                          setPhotoUrl('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80');
                          setReportStep('wizard');
                          setReportWizardStep(1);
                        }}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-teal-400 transition-all cursor-pointer group aspect-[4/3.2]"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                          <Building2 className="w-7 h-7 stroke-[2.2]" />
                        </div>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 line-clamp-1">
                          Comunitaria Shuar
                        </span>
                      </button>

                    </div>
                  </div>
                )}

                {/* 4-STEP WIZARD (MATCHES MOCKUPS 09, 10, 11, 12 EXACTLY) */}
                {reportStep === 'wizard' && (
                  <div className="space-y-4">

                    {/* Stepper Header for Steps 1, 2, 3 */}
                    {reportWizardStep < 4 && (
                      <div className="space-y-2">
                        {/* Top navigation row with back arrow */}
                        <div className="relative text-center pt-1 pb-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (reportWizardStep === 1) {
                                setReportStep('category');
                              } else {
                                setReportWizardStep((prev) => (prev - 1) as any);
                              }
                            }}
                            className="absolute left-0 top-0.5 p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer"
                          >
                            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                          </button>
                          
                          <h2 className="text-base font-black text-slate-900 dark:text-white font-serif tracking-tight">
                            {reportWizardStep === 1 && (category || 'Alumbrado Público')}
                            {reportWizardStep === 2 && 'Ubicación del problema'}
                            {reportWizardStep === 3 && 'Confirmar información'}
                          </h2>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {reportWizardStep === 1 && 'Cuéntanos más sobre el problema'}
                            {reportWizardStep === 2 && 'Confirma o ajusta la ubicación'}
                            {reportWizardStep === 3 && 'Revisa los datos antes de enviar'}
                          </p>
                        </div>

                        {/* Numbered Stepper: 1 - 2 - 3 - 4 */}
                        <div className="flex items-center justify-center space-x-3.5 py-1">
                          {[1, 2, 3, 4].map((stepNum) => {
                            const isActive = reportWizardStep === stepNum;
                            const isCompleted = reportWizardStep > stepNum;
                            return (
                              <div
                                key={stepNum}
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                                  isActive
                                    ? 'bg-[#0A4191] text-white shadow-md scale-105'
                                    : isCompleted
                                    ? 'bg-blue-100 text-[#0A4191] border border-blue-300 dark:bg-slate-700 dark:text-blue-300'
                                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                                }`}
                              >
                                {stepNum}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* STEP 1: 09. DETALLE CATEGORÍA */}
                    {reportWizardStep === 1 && (
                      <div className="space-y-4 pt-1">
                        {/* Textarea Section */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                            Descripción del problema
                          </label>
                          <div className="relative">
                            <textarea
                              rows={3}
                              maxLength={300}
                              placeholder="Describa los detalles de la incidencia..."
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#159A44] shadow-sm resize-none"
                            />
                            <div className="text-[10px] text-slate-400 text-right mt-1 font-mono">
                              Caracteres: {description.length}/300
                            </div>
                          </div>
                        </div>

                        {/* Attach Photo Section */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                            Adjuntar fotografía
                          </label>

                          <div className="grid grid-cols-2 gap-3">
                            {/* Left Photo Preview Box */}
                            <div className="relative h-28 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm group">
                              <img
                                src={photoUrl}
                                alt="Vista previa de incidencia"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-[10px] bg-black/70 text-white px-2 py-0.5 rounded-full font-bold">
                                  Vista Previa
                                </span>
                              </div>
                            </div>

                            {/* Right Camera Upload Box */}
                            <label className="h-28 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-all shadow-sm">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (typeof reader.result === 'string') {
                                        setPhotoUrl(reader.result);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <div className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-slate-700 flex items-center justify-center mb-1 text-slate-600 dark:text-slate-300">
                                <Camera className="w-5 h-5 stroke-[2]" />
                              </div>
                              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                Tomar / Subir Foto
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Gemini AI Auto-Classify Trigger */}
                        <div className="bg-slate-900 text-white p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                            <span className="text-[11px] font-bold text-amber-300">Visión IA Gemini</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleAnalyzeWithAI}
                            disabled={isAnalyzingAI}
                            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[10px] px-2.5 py-1 rounded-lg cursor-pointer"
                          >
                            {isAnalyzingAI ? 'Analizando...' : 'Clasificar con IA'}
                          </button>
                        </div>

                        {/* Bottom Button: Siguiente */}
                        <button
                          type="button"
                          onClick={() => setReportWizardStep(2)}
                          disabled={!description.trim()}
                          className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                            description.trim()
                              ? 'bg-[#159A44] hover:bg-emerald-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          Siguiente
                        </button>
                      </div>
                    )}

                    {/* STEP 2: 10. UBICACIÓN */}
                    {reportWizardStep === 2 && (
                      <div className="space-y-4 pt-1">
                        {/* Interactive Map Component */}
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm h-52">
                          <LogronoGoogleMap
                            centerLat={-2.6280}
                            centerLng={-78.1760}
                            zoomLevel={15}
                            incidents={[]}
                          />
                          {/* Floating Button: 📍 Usar mi ubicación actual */}
                          <div className="absolute bottom-3 left-3 right-3 z-10">
                            <button
                              type="button"
                              onClick={() => {
                                setAddress('Calle 24 de Mayo y Sucre');
                                setSector('Logroño Centro (Cabecera)');
                              }}
                              className="w-full py-2.5 px-3 bg-[#0A4191] hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
                            >
                              <Navigation className="w-4 h-4 text-sky-300 fill-current" />
                              <span>Usar mi ubicación actual</span>
                            </button>
                          </div>
                        </div>

                        {/* Address Field */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Dirección aproximada
                          </label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Calle 24 de Mayo y Sucre"
                            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#159A44]"
                          />
                        </div>

                        {/* Bottom Buttons: Atrás & Siguiente */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setReportWizardStep(1)}
                            className="py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                          >
                            Atrás
                          </button>
                          <button
                            type="button"
                            onClick={() => setReportWizardStep(3)}
                            className="py-3 rounded-2xl bg-[#159A44] hover:bg-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer"
                          >
                            Siguiente
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: 11. CONFIRMACIÓN */}
                    {reportWizardStep === 3 && (
                      <div className="space-y-4 pt-1">
                        {/* Summary Card */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                              Categoría
                            </span>
                            <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                              {category}
                            </p>
                          </div>

                          <div className="border-t border-slate-100 dark:border-slate-700/60 pt-2.5">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                              Descripción
                            </span>
                            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                              {description}
                            </p>
                          </div>

                          <div className="border-t border-slate-100 dark:border-slate-700/60 pt-2.5">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                              Ubicación
                            </span>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                              {address}
                            </p>
                          </div>

                          <div className="border-t border-slate-100 dark:border-slate-700/60 pt-2.5">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider mb-1.5">
                              Foto
                            </span>
                            <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                              <img src={photoUrl} alt="Foto reporte" className="w-full h-full object-cover" />
                            </div>
                          </div>
                        </div>

                        {/* Bottom Buttons: Atrás & Enviar reporte */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => setReportWizardStep(2)}
                            disabled={isSubmitting}
                            className="py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                          >
                            Atrás
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSubmitIncident()}
                            disabled={isSubmitting}
                            className="py-3 rounded-2xl bg-[#159A44] hover:bg-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center space-x-1.5"
                          >
                            {isSubmitting ? (
                              <RefreshCw className="w-4 h-4 animate-spin text-white" />
                            ) : (
                              <span>Enviar reporte</span>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: 12. REPORTE ENVIADO */}
                    {reportWizardStep === 4 && (
                      <div className="text-center space-y-4 py-4">
                        {/* Celebration Badges Graphic */}
                        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                          {/* Confetti Decorative Dots */}
                          <div className="absolute top-0 left-2 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping opacity-75" />
                          <div className="absolute top-2 right-1 w-2 h-2 bg-sky-400 rounded-full" />
                          <div className="absolute bottom-1 left-1 w-2 h-2 bg-purple-400 rounded-full" />
                          <div className="absolute bottom-2 right-3 w-2.5 h-2.5 bg-pink-400 rounded-full" />
                          
                          <div className="w-20 h-20 bg-[#159A44] rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-600/30 scale-100 transition-transform">
                            <Check className="w-10 h-10 stroke-[3.5]" />
                          </div>
                        </div>

                        {/* Title & Subtitle */}
                        <div className="space-y-1">
                          <h2 className="text-xl font-black text-slate-900 dark:text-white font-serif">
                            ¡Reporte enviado!
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Hemos recibido tu incidencia correctamente.
                          </p>
                        </div>

                        {/* Tracking Code Box (Screen 12 style) */}
                        <div className="bg-slate-100 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 max-w-xs mx-auto space-y-1 shadow-inner">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                            Código de seguimiento
                          </span>
                          <div className="text-lg font-black font-mono text-[#0A4191] dark:text-blue-400 tracking-wider">
                            {submitSuccess || 'RPT-2026-00045'}
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 px-4">
                          Te notificaremos sobre el estado de tu reporte.
                        </p>

                        {/* Action Buttons */}
                        <div className="space-y-2 pt-2 max-w-xs mx-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setSubmitSuccess(null);
                              setCitizenTab('mis_reportes');
                            }}
                            className="w-full py-3.5 bg-[#0A4191] hover:bg-blue-900 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer transition-all"
                          >
                            Ir a mis reportes
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setSubmitSuccess(null);
                              setReportStep('category');
                              setReportWizardStep(1);
                              setDescription('');
                              setTitle('');
                            }}
                            className="w-full py-2 text-[#0A4191] dark:text-blue-400 font-bold text-xs hover:underline cursor-pointer"
                          >
                            Nuevo reporte
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            )}

            {/* TAB 3: MIS REPORTES (MATCHES MOCKUP 13 EXACTLY) */}
            {citizenTab === 'mis_reportes' && (
              <div className="space-y-4 text-xs">
                {/* Header Row: Back Arrow + Centered Title */}
                <div className="relative text-center pt-1 pb-1">
                  <button
                    type="button"
                    onClick={() => setCitizenTab('inicio')}
                    className="absolute left-0 top-0.5 p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                  </button>
                  <h2 className="text-base font-black text-slate-900 dark:text-white font-serif tracking-tight">
                    Mis reportes
                  </h2>
                </div>

                {/* Filter Pills Bar: Todos | En proceso | Solucionados */}
                <div className="grid grid-cols-3 gap-2 py-0.5">
                  <button
                    type="button"
                    onClick={() => setMisReportesFilter('todos')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      misReportesFilter === 'todos'
                        ? 'bg-[#0A4191] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => setMisReportesFilter('en_proceso')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      misReportesFilter === 'en_proceso'
                        ? 'bg-[#0A4191] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    En proceso
                  </button>
                  <button
                    type="button"
                    onClick={() => setMisReportesFilter('solucionados')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      misReportesFilter === 'solucionados'
                        ? 'bg-[#0A4191] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Solucionados
                  </button>
                </div>

                {/* List of Incident Cards */}
                <div className="space-y-3 pt-1">
                  {incidents
                    .filter((inc) => {
                      if (misReportesFilter === 'en_proceso') {
                        return inc.status === 'en_proceso' || inc.status === 'reportado' || inc.status === 'asignado' || inc.status === 'en_revision';
                      }
                      if (misReportesFilter === 'solucionados') {
                        return inc.status === 'resuelto';
                      }
                      return true;
                    })
                    .map((inc) => {
                      // Icon & Category styling map according to Mockup 13
                      const getCategoryDetails = (cat: string) => {
                        const lower = cat.toLowerCase();
                        if (lower.includes('alumbrado') || lower.includes('luz')) {
                          return {
                            bg: 'bg-amber-100/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40',
                            icon: <Lightbulb className="w-6 h-6 text-amber-500 fill-amber-300/40 stroke-[2]" />,
                            label: 'Alumbrado Público'
                          };
                        }
                        if (lower.includes('vías') || lower.includes('calles') || lower.includes('acera')) {
                          return {
                            bg: 'bg-sky-100/80 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/40',
                            icon: <Milestone className="w-6 h-6 text-sky-600 stroke-[2]" />,
                            label: 'Calles'
                          };
                        }
                        if (lower.includes('residuos') || lower.includes('basura')) {
                          return {
                            bg: 'bg-emerald-100/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40',
                            icon: <Trash2 className="w-6 h-6 text-emerald-600 stroke-[2]" />,
                            label: 'Basura'
                          };
                        }
                        if (lower.includes('parques') || lower.includes('verdes')) {
                          return {
                            bg: 'bg-emerald-100/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40',
                            icon: <Trees className="w-6 h-6 text-emerald-600 fill-emerald-100 stroke-[2]" />,
                            label: 'Parques'
                          };
                        }
                        if (lower.includes('agua') || lower.includes('alcantarillado')) {
                          return {
                            bg: 'bg-blue-100/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40',
                            icon: <Droplets className="w-6 h-6 text-blue-600 fill-blue-200/40 stroke-[2]" />,
                            label: 'Agua Potable'
                          };
                        }
                        return {
                          bg: 'bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700',
                          icon: <AlertTriangle className="w-6 h-6 text-slate-600 dark:text-slate-300 stroke-[2]" />,
                          label: cat
                        };
                      };

                      const catDetails = getCategoryDetails(inc.category);

                      // Date formatting: DD/MM/YYYY
                      const dateFormatted = (() => {
                        try {
                          const d = new Date(inc.createdAt);
                          if (isNaN(d.getTime())) return '24/05/2024';
                          const day = String(d.getDate()).padStart(2, '0');
                          const month = String(d.getMonth() + 1).padStart(2, '0');
                          const year = d.getFullYear();
                          return `${day}/${month}/${year}`;
                        } catch {
                          return '24/05/2024';
                        }
                      })();

                      return (
                        <div
                          key={inc.id}
                          onClick={() => setSelectedIncident(inc)}
                          className="bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl p-3 flex items-center justify-between shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition-all space-x-3.5 group"
                        >
                          {/* Custom Category Icon Container */}
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${catDetails.bg}`}>
                            {catDetails.icon}
                          </div>

                          {/* Code + Subtitle Category Name */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs tracking-tight font-mono">
                              {inc.code}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate">
                              {catDetails.label}
                            </p>
                          </div>

                          {/* Date Column (matching screenshot 13 format) */}
                          <div className="text-right flex-shrink-0 space-y-0.5">
                            <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 block">
                              {dateFormatted}
                            </span>
                            <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 block">
                              {dateFormatted}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                  {incidents.filter((inc) => {
                    if (misReportesFilter === 'en_proceso') {
                      return inc.status === 'en_proceso' || inc.status === 'reportado' || inc.status === 'asignado' || inc.status === 'en_revision';
                    }
                    if (misReportesFilter === 'solucionados') {
                      return inc.status === 'resuelto';
                    }
                    return true;
                  }).length === 0 && (
                    <div className="text-center py-8 space-y-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        No hay reportes en esta categoría.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: MAPA */}
            {citizenTab === 'mapa' && (
              <div className="space-y-3 text-xs">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2 flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-[#159A44]" />
                      <span>Mapa Cantonal Logroño</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">Google Maps WGS84 GPS</p>
                  </div>
                </div>

                <LogronoGoogleMap
                  incidents={incidents}
                  onSelectIncident={(inc) => setSelectedIncident(inc)}
                />
              </div>
            )}

            {/* TAB 5: PQRS */}
            {citizenTab === 'pqrs' && (
              <div className="space-y-3 text-xs">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <FileCheck className="w-4 h-4 text-[#159A44]" />
                    <span>Trámites & PQRS Municipal</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Transparencia GAD Logroño</p>
                </div>

                {pqrsSuccess ? (
                  <div className="bg-emerald-50 text-emerald-900 p-4 rounded-2xl border border-emerald-300 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#159A44] mx-auto" />
                    <h4 className="font-bold">Trámite Ingresado</h4>
                    <p>Su {pqrsType} ha sido enviada a la Secretaría del GAD Logroño.</p>
                    <button 
                      type="button"
                      onClick={() => setPqrsSuccess(false)}
                      className="bg-[#159A44] text-white px-3 py-1.5 rounded-xl font-bold cursor-pointer"
                    >
                      Nuevo Trámite
                    </button>
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setPqrsSuccess(true);
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Trámite</label>
                      <div className="grid grid-cols-4 gap-1">
                        {(['Petición', 'Queja', 'Reclamo', 'Sugerencia'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setPqrsType(t)}
                            className={`py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                              pqrsType === t ? 'bg-[#159A44] text-white border-emerald-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Asunto</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Solicitud de certificado o consulta de obra"
                        value={pqrsSubject}
                        onChange={(e) => setPqrsSubject(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Detalle del Requerimiento</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Fundamente su solicitud dirigida al GAD Logroño..."
                        value={pqrsDetail}
                        onChange={(e) => setPqrsDetail(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <button type="submit" className="w-full py-3 bg-[#159A44] hover:bg-emerald-700 text-white font-bold rounded-2xl shadow cursor-pointer">
                      REGISTRAR TRÁMITE
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 6: DIRECTORIO */}
            {citizenTab === 'directorio' && (
              <div className="space-y-3 text-xs">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <PhoneCall className="w-4 h-4 text-[#0A4191]" />
                    <span>Directorio Municipal & Parroquia</span>
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-[#0A4191] dark:text-blue-400">Alcaldía Cantón Logroño</h4>
                    <p className="text-slate-600 dark:text-slate-300 mt-0.5">Palacio Municipal, Calle 10 de Agosto</p>
                    <span className="text-[10px] text-slate-500 block mt-1 font-semibold">Tel: (07) 2700-100</span>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-[#0A4191] dark:text-blue-400">GAD Parroquial de Yaupi</h4>
                    <p className="text-slate-600 dark:text-slate-300 mt-0.5">Centro Poblado Yaupi, Morona Santiago</p>
                    <span className="text-[10px] text-slate-500 block mt-1 font-semibold">Coordinación Shuar</span>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-[#0A4191] dark:text-blue-400">GAD Parroquial de Shimpis</h4>
                    <p className="text-slate-600 dark:text-slate-300 mt-0.5">Plaza Central Shimpis</p>
                    <span className="text-[10px] text-slate-500 block mt-1 font-semibold">Agua Potable & Obras</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ==================== 3. BOTTOM NAVIGATION BAR (MATCHES SCREENSHOT EXACTLY) ==================== */}
          <div className="absolute bottom-0 inset-x-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-3 py-2 z-30 flex items-center justify-around shadow-2xl">
            
            {/* Nav 1: Inicio */}
            <button
              type="button"
              onClick={() => setCitizenTab('inicio')}
              className={`flex flex-col items-center justify-center space-y-0.5 transition-colors cursor-pointer ${
                citizenTab === 'inicio' ? 'text-[#0A4191] dark:text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Home className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px]">Inicio</span>
            </button>

            {/* Nav 2: Reportes */}
            <button
              type="button"
              onClick={() => setCitizenTab('mis_reportes')}
              className={`flex flex-col items-center justify-center space-y-0.5 transition-colors cursor-pointer ${
                citizenTab === 'mis_reportes' ? 'text-[#0A4191] dark:text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <FileText className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px]">Reportes</span>
            </button>

            {/* Nav 3: FLOATING PLUS (+) BUTTON IN CENTER */}
            <button
              type="button"
              onClick={() => {
                setReportStep('category');
                setCitizenTab('reportar');
              }}
              className="w-12 h-12 rounded-full bg-[#159A44] hover:bg-[#128239] active:scale-95 text-white flex items-center justify-center shadow-lg -translate-y-3 transition-transform border-4 border-white dark:border-slate-900 cursor-pointer"
              title="Crear Nuevo Reporte"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>

            {/* Nav 4: Noticias */}
            <button
              type="button"
              onClick={() => setShowNewsModal(true)}
              className="flex flex-col items-center justify-center space-y-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <Newspaper className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px]">Noticias</span>
            </button>

            {/* Nav 5: Perfil */}
            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              className="flex flex-col items-center justify-center space-y-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <User className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px]">Perfil</span>
            </button>

          </div>

        </div>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* 1. NOTICIAS MODAL */}
      {showNewsModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Newspaper className="w-5 h-5 text-[#0A4191]" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Noticias del Cantón Logroño
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewsModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-emerald-600">04 de Agosto, 2026</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">
                  Avanza Obra de Saneamiento e Alcantarillado en Parroquia Shimpis
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                  La Dirección de Obras Públicas del GAD Logroño constata un 85% de avance en la instalación de tuberías beneficiando a familias de la zona.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-amber-600">02 de Agosto, 2026</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">
                  Feria de Emprendimiento Intercultural Shuar Kakaim
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                  Este fin de semana la plaza principal de Logroño acoge a productores de la cuenca del Río Upano con artesanías y productos locales.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowNewsModal(false)}
              className="w-full py-2.5 bg-[#0A4191] text-white font-bold rounded-xl cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* 2. AGENDA MODAL */}
      {showAgendaModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-red-600" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Agenda Municipal Logroño
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAgendaModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="bg-red-50 dark:bg-red-950/40 p-3 rounded-2xl border border-red-200 dark:border-red-900">
                <div className="flex justify-between items-center text-[10px] font-bold text-red-700 dark:text-red-300">
                  <span>Viernes, 10:00 AM</span>
                  <span className="bg-red-200 dark:bg-red-900 px-2 py-0.5 rounded-full">Audiencia Pública</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs mt-1">
                  Sesión de Concejo Cantonal Abierta
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  Discusión del plan vial rural Transkutukú en el Salón Municipal.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-2xl border border-blue-200 dark:border-blue-900">
                <div className="flex justify-between items-center text-[10px] font-bold text-blue-700 dark:text-blue-300">
                  <span>Sábado, 09:00 AM</span>
                  <span className="bg-blue-200 dark:bg-blue-900 px-2 py-0.5 rounded-full">Minga Comunitaria</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs mt-1">
                  Minga de Limpieza y Reforestación Parque Upano
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  Convocatoria abierta para ciudadanos y brigadas comunitarias.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAgendaModal(false)}
              className="w-full py-2.5 bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
            >
              Cerrar Agenda
            </button>
          </div>
        </div>
      )}

      {/* 3. EMERGENCIAS MODAL */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Siren className="w-5 h-5 text-red-600 animate-pulse" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Líneas de Emergencia Directa
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEmergencyModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <a href="tel:911" className="bg-red-50 border border-red-200 p-3 rounded-2xl text-center block hover:bg-red-100">
                <Ambulance className="w-6 h-6 text-red-600 mx-auto mb-1" />
                <span className="font-black text-red-700 block text-xs">ECU 911</span>
                <span className="text-[10px] text-slate-500">Nacional</span>
              </a>

              <a href="tel:102" className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-center block hover:bg-amber-100">
                <Flame className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                <span className="font-black text-amber-800 block text-xs">Bomberos Logroño</span>
                <span className="text-[10px] text-slate-500">Línea 102</span>
              </a>

              <a href="tel:101" className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-center block hover:bg-blue-100">
                <ShieldCheck className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <span className="font-black text-blue-800 block text-xs">Policía Cantonal</span>
                <span className="text-[10px] text-slate-500">Línea 101</span>
              </a>

              <a href="tel:072700100" className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-center block hover:bg-emerald-100">
                <UserCheck className="w-6 h-6 text-[#159A44] mx-auto mb-1" />
                <span className="font-black text-emerald-800 block text-xs">Despacho GAD</span>
                <span className="text-[10px] text-slate-500">(07) 2700-100</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setShowEmergencyModal(false)}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* 4. NOTIFICATION MODAL */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Notificaciones del Cantón
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNotificationModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 block">Actualización de Incidencia</span>
                <p className="text-slate-800 dark:text-slate-200 font-semibold text-xs">
                  Tu reporte LOG-2026-8812 sobre bacheo en Calle 10 de Agosto ha sido asignado a cuadrilla técnica.
                </p>
                <span className="text-[9px] text-slate-400 block mt-1">Hace 25 minutos</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowNotificationModal(false)}
              className="w-full py-2.5 bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* 5. PERFIL USER MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-[#0A4191]" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Perfil de Usuario Ciudadano
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-[#0A4191] text-white text-2xl font-black mx-auto flex items-center justify-center shadow">
                {userFirstName[0]}
              </div>
              <h4 className="font-black text-base text-slate-900 dark:text-white">
                {currentUser?.name || 'María Shakaim'}
              </h4>
              <p className="text-slate-500 font-medium text-xs">{currentUser?.email || 'maria.shakaim@logrono.gob.ec'}</p>
              
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-left text-[11px]">
                <div>
                  <span className="text-slate-400 block">Sector:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentUser?.sector || 'Logroño Centro'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Rol:</span>
                  <span className="font-bold text-emerald-600 uppercase">{currentUser?.role || 'Ciudadano'}</span>
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  onLogout();
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 cursor-pointer shadow"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6. INCIDENT DETAIL MODAL */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <span className="text-xs font-mono font-bold text-[#0A4191]">
                  {selectedIncident.code}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedIncident.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedIncident.photoUrl && (
              <img src={selectedIncident.photoUrl} alt="" className="w-full h-44 rounded-2xl object-cover border" />
            )}

            <div className="space-y-2">
              <p className="text-slate-700 dark:text-slate-300">{selectedIncident.description}</p>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Sector:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedIncident.location.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Departamento Asignado:</span>
                  <span className="font-bold text-[#159A44]">{selectedIncident.assignedDepartment}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedIncident(null)}
              className="w-full py-2.5 bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
            >
              Cerrar Detalle
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
