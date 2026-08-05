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
  ChevronLeft,
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
  Image as ImageIcon,
  ChevronDown,
  Key,
  Wrench,
  Shield,
  Lock,
  Globe,
  Moon,
  Sun,
  Info,
  Settings
} from 'lucide-react';

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: 'comunicados' | 'obras' | 'eventos';
  categoryLabel: string;
  image: string;
  summary: string;
  content: string;
}

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Mejoras en el sistema de Alumbrado Público',
    date: '24/05/2024',
    category: 'comunicados',
    categoryLabel: 'Comunicados',
    image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400&auto=format&fit=crop&q=80',
    summary: 'Sustitución de más de 120 luminarias a tecnología LED de alta eficiencia en el cantón Logroño.',
    content: 'La Dirección de Servicios Municipales del GAD Cantonal de Logroño continúa ejecutando el plan integral de modernización del alumbrado público. Se han intervenido calles principales y accesos a barrios periurbanos para garantizar mayor seguridad nocturnal a los vecinos.'
  },
  {
    id: 'news-2',
    title: 'Campaña de limpieza en el cantón',
    date: '20/05/2024',
    category: 'eventos',
    categoryLabel: 'Eventos',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&auto=format&fit=crop&q=80',
    summary: 'Minga cantonal de recolección de desechos sólidos y ornato comunitario en parques y avenidas.',
    content: 'Se invita a todas las familias y comités de barrio del cantón Logroño a participar en la gran minga de limpieza y recuperación de espacios públicos. Se habilitarán contenedores especiales de acopio.'
  },
  {
    id: 'news-3',
    title: 'Nuevas obras para nuestra comunidad',
    date: '18/05/2024',
    category: 'obras',
    categoryLabel: 'Obras',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=400&auto=format&fit=crop&q=80',
    summary: 'Asfaltado de vías principales y mejoramiento de la red de alcantarillado en sectores prioritarios.',
    content: 'El Alcalde y el equipo de Obras Públicas constatan el inicio de los trabajos de pavimentación y encunetado en los tramos de conexión vial hacia las parroquias Shimpis y Yaupi.'
  },
  {
    id: 'news-4',
    title: 'Atención en días feriados',
    date: '15/05/2024',
    category: 'comunicados',
    categoryLabel: 'Comunicados',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
    summary: 'Horarios especiales de atención ciudadana y brigadas de turno de agua potable y recolección.',
    content: 'Se informa a la ciudadanía del cantón Logroño que los servicios de recolección de basura y emergencia de agua potable operarán con normalidad durante los feriados.'
  }
];

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
  const [citizenTab, setCitizenTab] = useState<'inicio' | 'reportar' | 'mis_reportes' | 'noticias' | 'agenda' | 'perfil' | 'configuracion' | 'mapa' | 'pqrs' | 'directorio'>('inicio');
  const [reportStep, setReportStep] = useState<'category' | 'wizard'>('category');
  const [reportWizardStep, setReportWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [misReportesFilter, setMisReportesFilter] = useState<'todos' | 'en_proceso' | 'solucionados'>('todos');
  const [noticiasFilter, setNoticiasFilter] = useState<'todos' | 'comunicados' | 'obras' | 'eventos'>('todos');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedAgendaDay, setSelectedAgendaDay] = useState<number>(24);
  const [showReportInfo, setShowReportInfo] = useState<boolean>(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  // Configuration Settings State (Mockup 18: CONFIGURACIÓN)
  const [configNotificaciones, setConfigNotificaciones] = useState(true);
  const [configTema, setConfigTema] = useState<'Claro' | 'Oscuro' | 'Sistema'>('Claro');
  const [configIdioma, setConfigIdioma] = useState<'Español' | 'Kichwa' | 'English'>('Español');
  const [showTemaModal, setShowTemaModal] = useState(false);
  const [showIdiomaModal, setShowIdiomaModal] = useState(false);
  const [showPrivacidadModal, setShowPrivacidadModal] = useState(false);
  const [showAcercaModal, setShowAcercaModal] = useState(false);

  // User Profile State (Mockup 17: PERFIL)
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'María Fernanda',
    email: currentUser?.email || 'maria@gmail.com',
    phone: '098 471 2039',
    cedula: currentUser?.cedula || '1400829104',
    sector: currentUser?.sector || 'Logroño Centro (Cabecera)',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
  });

  // Profile Sub-modals & Edit States
  const [showMisDatosModal, setShowMisDatosModal] = useState(false);
  const [showNotifSettingsModal, setShowNotifSettingsModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showHelpSupportModal, setShowHelpSupportModal] = useState(false);
  const [profileToast, setProfileToast] = useState<string | null>(null);

  // Edit fields for "Mis datos"
  const [editName, setEditName] = useState(profileData.name);
  const [editEmail, setEditEmail] = useState(profileData.email);
  const [editPhone, setEditPhone] = useState(profileData.phone);
  const [editSector, setEditSector] = useState(profileData.sector);
  const [editCedula, setEditCedula] = useState(profileData.cedula);
  const [editAvatarUrl, setEditAvatarUrl] = useState(profileData.avatarUrl);

  // Notification settings state
  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);

  // Security settings state
  const [security2FA, setSecurity2FA] = useState(false);

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
            
            {/* SCREEN 14: DETALLE DE REPORTE (MATCHES MOCKUP 14 EXACTLY WHEN AN INCIDENT IS SELECTED) */}
            {selectedIncident ? (
              <div className="space-y-4 text-xs pb-4 animate-in fade-in duration-200">
                {/* Header Row: Back Arrow + Centered Title (Code) */}
                <div className="relative text-center pt-1 pb-1">
                  <button
                    type="button"
                    onClick={() => setSelectedIncident(null)}
                    className="absolute left-0 top-0.5 p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                  </button>
                  <h2 className="text-base font-black text-slate-900 dark:text-white font-mono tracking-tight">
                    {selectedIncident.code}
                  </h2>
                </div>

                {/* Status Banner Card (Matches Mockup 14) */}
                {(() => {
                  let bannerBg = 'bg-amber-100/90 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/50';
                  let iconBg = 'bg-amber-500 text-white';
                  let statusText = 'En proceso';
                  let subtitleText = 'Tu reporte está siendo atendido.';
                  let IconComp = Key;

                  if (selectedIncident.status === 'resuelto') {
                    bannerBg = 'bg-emerald-100/90 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/50';
                    iconBg = 'bg-emerald-500 text-white';
                    statusText = 'Solucionado';
                    subtitleText = 'Tu reporte ha sido resuelto y finalizado.';
                    IconComp = CheckCircle2;
                  } else if (selectedIncident.status === 'reportado') {
                    bannerBg = 'bg-blue-100/90 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-800/50';
                    iconBg = 'bg-[#0A4191] text-white';
                    statusText = 'Recibido';
                    subtitleText = 'Tu reporte fue recibido en el sistema municipal.';
                    IconComp = Clock;
                  } else if (selectedIncident.status === 'asignado' || selectedIncident.status === 'en_revision') {
                    bannerBg = 'bg-amber-100/90 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/50';
                    iconBg = 'bg-amber-500 text-white';
                    statusText = 'En revisión';
                    subtitleText = 'Tu reporte ha sido remitido al departamento técnico.';
                    IconComp = Wrench;
                  }

                  return (
                    <div className={`p-4 rounded-2xl border flex items-center space-x-3.5 shadow-sm ${bannerBg}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${iconBg}`}>
                        <IconComp className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {statusText}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                          {subtitleText}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Section Header: Progreso del reporte */}
                <div className="pt-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-xs">
                    Progreso del reporte
                  </h3>
                </div>

                {/* Vertical Timeline Stepper matching Mockup 14 */}
                <div className="relative pl-3 space-y-4 pt-1 pb-2">
                  {/* Vertical line connecting steps */}
                  <div className="absolute left-[21px] top-4 bottom-5 w-0.5 bg-slate-200 dark:bg-slate-700 -z-0" />

                  {/* Step 1: Recibido */}
                  <div className="flex items-center justify-between text-xs relative z-10">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-slate-500 dark:text-slate-400 font-bold">-</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">Recibido</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      24/05/2024 10:15
                    </span>
                  </div>

                  {/* Step 2: En revisión */}
                  <div className="flex items-center justify-between text-xs relative z-10">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-slate-500 dark:text-slate-400 font-bold">-</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">En revisión</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      24/05/2024 11:20
                    </span>
                  </div>

                  {/* Step 3: Asignado */}
                  <div className="flex items-center justify-between text-xs relative z-10">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-slate-500 dark:text-slate-400 font-bold">-</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">Asignado</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      24/05/2024 14:30
                    </span>
                  </div>

                  {/* Step 4: En proceso */}
                  <div className="flex items-center justify-between text-xs relative z-10">
                    <div className="flex items-center space-x-2">
                      {selectedIncident.status === 'resuelto' ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-[#0A4191] text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      <span className="text-slate-500 dark:text-slate-400 font-bold">-</span>
                      <span className={`font-extrabold ${selectedIncident.status === 'en_proceso' ? 'text-[#0A4191] dark:text-blue-400 font-black' : 'text-slate-900 dark:text-white'}`}>
                        En proceso
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      25/05/2024 09:00
                    </span>
                  </div>

                  {/* Step 5: Solucionado */}
                  <div className="flex items-center justify-between text-xs relative z-10">
                    <div className="flex items-center space-x-2">
                      {selectedIncident.status === 'resuelto' ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 flex-shrink-0" />
                      )}
                      <span className="text-slate-400 dark:text-slate-500 font-bold">-</span>
                      <span className={`font-semibold ${selectedIncident.status === 'resuelto' ? 'text-emerald-700 dark:text-emerald-400 font-extrabold' : 'text-slate-400 dark:text-slate-500'}`}>
                        Solucionado
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      {selectedIncident.status === 'resuelto' ? '26/05/2024 16:00' : ''}
                    </span>
                  </div>
                </div>

                {/* Bottom Collapsible Button: Información del reporte */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReportInfo(!showReportInfo)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl py-3 px-4 text-[#0A4191] dark:text-blue-400 font-bold text-center text-xs shadow-sm hover:shadow hover:border-blue-400 transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Información del reporte</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showReportInfo ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Collapsible Info Card */}
                  {showReportInfo && (
                    <div className="mt-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3 shadow-sm animate-in fade-in duration-200">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A4191] dark:text-blue-400 block">
                          {selectedIncident.category}
                        </span>
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5">
                          {selectedIncident.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {selectedIncident.description}
                        </p>
                      </div>

                      {selectedIncident.photoUrl && (
                        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48">
                          <img src={selectedIncident.photoUrl} alt="Foto evidencia" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Ubicación / Sector:</span>
                          <span className="font-bold text-slate-900 dark:text-white">{selectedIncident.location.sector}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Dirección:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-right truncate max-w-[180px]">{selectedIncident.location.address}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Departamento:</span>
                          <span className="font-bold text-[#159A44] truncate max-w-[180px]">{selectedIncident.assignedDepartment}</span>
                        </div>
                        {selectedIncident.assignedOperator && (
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Técnico a cargo:</span>
                            <span className="font-bold text-slate-900 dark:text-white">{selectedIncident.assignedOperator}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
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
                    onClick={() => {
                      setSelectedIncident(null);
                      setCitizenTab('noticias');
                    }}
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
                    onClick={() => {
                      setSelectedIncident(null);
                      setCitizenTab('agenda');
                    }}
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

            {/* TAB 7: NOTICIAS (MATCHES MOCKUP 15. NOTICIAS EXACTLY) */}
            {citizenTab === 'noticias' && (
              <div className="space-y-4 text-xs animate-in fade-in duration-200 pb-2">
                {/* Header Row: Back Arrow + Centered Title "Noticias" */}
                <div className="relative text-center pt-1 pb-1">
                  <button
                    type="button"
                    onClick={() => setCitizenTab('inicio')}
                    className="absolute left-0 top-0.5 p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                  </button>
                  <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                    Noticias
                  </h2>
                </div>

                {/* Filter Pills Row: Todos | Comunicados | Obras | Eventos */}
                <div className="grid grid-cols-4 gap-1.5 py-0.5">
                  {(['todos', 'comunicados', 'obras', 'eventos'] as const).map((filter) => {
                    const labels: Record<string, string> = {
                      todos: 'Todos',
                      comunicados: 'Comunicados',
                      obras: 'Obras',
                      eventos: 'Eventos'
                    };
                    const isActive = noticiasFilter === filter;
                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setNoticiasFilter(filter)}
                        className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center truncate ${
                          isActive
                            ? 'bg-[#0A4191] text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {labels[filter]}
                      </button>
                    );
                  })}
                </div>

                {/* List of News Cards matching Mockup 15 */}
                <div className="space-y-3 pt-1">
                  {MOCK_NEWS.filter((item) => {
                    if (noticiasFilter === 'todos') return true;
                    return item.category === noticiasFilter;
                  }).map((news) => (
                    <div
                      key={news.id}
                      onClick={() => setSelectedNews(news)}
                      className="bg-[#F8FAFC] dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-2.5 flex items-center space-x-3 shadow-xs hover:shadow-md hover:border-blue-400 cursor-pointer transition-all group"
                    >
                      {/* Left Thumbnail Image */}
                      <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-700">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>

                      {/* Middle Title & Date */}
                      <div className="flex-1 min-w-0 pr-1">
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-xs leading-tight line-clamp-2">
                          {news.title}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 font-medium mt-1">
                          {news.date}
                        </p>
                      </div>

                      {/* Right Chevron */}
                      <div className="flex-shrink-0 pr-1">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0A4191] dark:group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 8: AGENDA MUNICIPAL (MATCHES MOCKUP 16. AGENDA EXACTLY) */}
            {citizenTab === 'agenda' && (
              <div className="space-y-4 text-xs animate-in fade-in duration-200 pb-2">
                {/* Header Row: Back Arrow + Centered Title "Agenda Municipal" */}
                <div className="relative text-center pt-1 pb-1">
                  <button
                    type="button"
                    onClick={() => setCitizenTab('inicio')}
                    className="absolute left-0 top-0.5 p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                  </button>
                  <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                    Agenda Municipal
                  </h2>
                </div>

                {/* Calendar View Container */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-3.5 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-3">
                  {/* Month Header: < Mayo 2024 > */}
                  <div className="flex items-center justify-between px-3 pt-1">
                    <button
                      type="button"
                      className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    <span className="font-black text-sm text-slate-900 dark:text-white tracking-tight">
                      Mayo 2024
                    </span>
                    <button
                      type="button"
                      className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Days of week header: L  M  M  J  V  S  D */}
                  <div className="grid grid-cols-7 text-center font-extrabold text-slate-400 dark:text-slate-500 text-[11px] py-1">
                    <span>L</span>
                    <span>M</span>
                    <span>M</span>
                    <span>J</span>
                    <span>V</span>
                    <span>S</span>
                    <span>D</span>
                  </div>

                  {/* Days of month grid (May 2024 starts on Wednesday=1, Monday/Tuesday are 29/30 Apr) */}
                  <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center items-center">
                    {/* Row 1: 29 Apr, 30 Apr, 1, 2, 3, 4, 5 */}
                    <span className="text-[11px] font-medium text-slate-300 dark:text-slate-600 py-1">29</span>
                    <span className="text-[11px] font-medium text-slate-300 dark:text-slate-600 py-1">30</span>
                    {[1, 2, 3, 4, 5].map((d) => (
                      <button
                        key={`day-${d}`}
                        type="button"
                        onClick={() => setSelectedAgendaDay(d)}
                        className={`py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedAgendaDay === d
                            ? 'w-8 h-8 rounded-xl bg-[#0A4191] text-white flex items-center justify-center font-black shadow-md mx-auto'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {d}
                      </button>
                    ))}

                    {/* Row 2: 6, 7, 8, 9, 10, 11, 12 */}
                    {[6, 7, 8, 9, 10, 11, 12].map((d) => (
                      <button
                        key={`day-${d}`}
                        type="button"
                        onClick={() => setSelectedAgendaDay(d)}
                        className={`py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedAgendaDay === d
                            ? 'w-8 h-8 rounded-xl bg-[#0A4191] text-white flex items-center justify-center font-black shadow-md mx-auto'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {d}
                      </button>
                    ))}

                    {/* Row 3: 13, 14, 15, 16, 17, 18, 19 */}
                    {[13, 14, 15, 16, 17, 18, 19].map((d) => (
                      <button
                        key={`day-${d}`}
                        type="button"
                        onClick={() => setSelectedAgendaDay(d)}
                        className={`py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedAgendaDay === d
                            ? 'w-8 h-8 rounded-xl bg-[#0A4191] text-white flex items-center justify-center font-black shadow-md mx-auto'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {d}
                      </button>
                    ))}

                    {/* Row 4: 20, 21, 22, 23, 24, 25, 26 */}
                    {[20, 21, 22, 23, 24, 25, 26].map((d) => (
                      <button
                        key={`day-${d}`}
                        type="button"
                        onClick={() => setSelectedAgendaDay(d)}
                        className={`py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedAgendaDay === d
                            ? 'w-8 h-8 rounded-xl bg-[#0A4191] text-white flex items-center justify-center font-black shadow-md mx-auto'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {d}
                      </button>
                    ))}

                    {/* Row 5: 27, 28, 29, 30, 31, 1 Jun, 2 Jun */}
                    {[27, 28, 29, 30, 31].map((d) => (
                      <button
                        key={`day-${d}`}
                        type="button"
                        onClick={() => setSelectedAgendaDay(d)}
                        className={`py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedAgendaDay === d
                            ? 'w-8 h-8 rounded-xl bg-[#0A4191] text-white flex items-center justify-center font-black shadow-md mx-auto'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                    <span className="text-[11px] font-medium text-slate-300 dark:text-slate-600 py-1">1</span>
                    <span className="text-[11px] font-medium text-slate-300 dark:text-slate-600 py-1">2</span>
                  </div>
                </div>

                {/* Section Subtitle: Eventos del 24 de mayo */}
                <div className="pt-1 space-y-2.5">
                  <h3 className="font-black text-slate-900 dark:text-white text-xs tracking-tight">
                    Eventos del {selectedAgendaDay} de mayo
                  </h3>

                  {/* List of Event Cards */}
                  <div className="space-y-3">
                    {selectedAgendaDay === 24 ? (
                      <>
                        {/* Event 1: Minga comunitaria */}
                        <div className="bg-[#F8FAFC] dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3 flex items-center space-x-3.5 relative overflow-hidden shadow-xs hover:shadow-md transition-all">
                          {/* Left Cyan Accent Strip */}
                          <div className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full" />
                          
                          {/* Left Red Icon Badge */}
                          <div className="w-11 h-11 rounded-2xl bg-red-100 dark:bg-red-950/70 text-red-500 dark:text-red-400 flex items-center justify-center flex-shrink-0 ml-1.5 shadow-2xs">
                            <div className="w-7 h-7 bg-red-400/90 text-white rounded-xl flex items-center justify-center font-black text-xs">
                              ?
                            </div>
                          </div>

                          {/* Middle Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs leading-snug">
                              Minga comunitaria
                            </h4>
                            <p className="text-[11px] font-mono text-slate-400 dark:text-slate-400 font-medium mt-0.5">
                              08:00 AM - Parque Central
                            </p>
                          </div>
                        </div>

                        {/* Event 2: Sesión de Cabildo */}
                        <div className="bg-[#F8FAFC] dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3 flex items-center space-x-3.5 relative overflow-hidden shadow-xs hover:shadow-md transition-all">
                          {/* Left Amber Accent Strip */}
                          <div className="absolute left-0 top-2 bottom-2 w-1 bg-amber-400 rounded-r-full" />
                          
                          {/* Left Green Icon Badge */}
                          <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 ml-1.5 shadow-2xs">
                            <div className="w-7 h-7 bg-emerald-500/90 text-white rounded-xl flex items-center justify-center">
                              <Building2 className="w-4 h-4 stroke-[2.5]" />
                            </div>
                          </div>

                          {/* Middle Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs leading-snug">
                              Sesión de Cabildo
                            </h4>
                            <p className="text-[11px] font-mono text-slate-400 dark:text-slate-400 font-medium mt-0.5">
                              15:00 PM - Sala de Sesiones
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-[#F8FAFC] dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 text-center space-y-1">
                        <p className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                          No hay eventos programados para esta fecha
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Selecciona el día 24 de mayo para consultar los eventos del cantón.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 9: PERFIL (MATCHES MOCKUP 17. PERFIL EXACTLY) */}
            {citizenTab === 'perfil' && (
              <div className="space-y-4 text-xs animate-in fade-in duration-200 pb-2">
                {/* Header Row: Back Arrow + Centered Title "Mi perfil" + Settings button */}
                <div className="relative text-center pt-1 pb-1">
                  <button
                    type="button"
                    onClick={() => setCitizenTab('inicio')}
                    className="absolute left-0 top-0.5 p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                  </button>
                  <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                    Mi perfil
                  </h2>
                  <button
                    type="button"
                    onClick={() => setCitizenTab('configuracion')}
                    className="absolute right-0 top-0.5 p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
                    title="Configuración"
                  >
                    <Settings className="w-5 h-5 stroke-[2.2]" />
                  </button>
                </div>

                {/* Toast message if profile updated */}
                {profileToast && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 p-2.5 rounded-2xl flex items-center space-x-2 text-xs font-bold animate-in slide-in-from-top-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="flex-1">{profileToast}</span>
                  </div>
                )}

                {/* Avatar & User Details Container */}
                <div className="flex flex-col items-center justify-center text-center pt-1 pb-2 space-y-2">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-4 border-white dark:border-slate-800 shadow-md flex items-center justify-center">
                      {profileData.avatarUrl ? (
                        <img
                          src={profileData.avatarUrl}
                          alt={profileData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-slate-400" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditName(profileData.name);
                        setEditEmail(profileData.email);
                        setEditPhone(profileData.phone);
                        setEditSector(profileData.sector);
                        setEditCedula(profileData.cedula);
                        setEditAvatarUrl(profileData.avatarUrl);
                        setShowMisDatosModal(true);
                      }}
                      className="absolute bottom-0 right-0 w-7 h-7 bg-[#0A4191] text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-800 cursor-pointer transition-transform hover:scale-110"
                      title="Editar perfil"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                      {profileData.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {profileData.email}
                    </p>
                  </div>
                </div>

                {/* Menu List matching Mockup 17: PERFIL */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-2xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                  {/* 1. Mis datos */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(profileData.name);
                      setEditEmail(profileData.email);
                      setEditPhone(profileData.phone);
                      setEditSector(profileData.sector);
                      setEditCedula(profileData.cedula);
                      setEditAvatarUrl(profileData.avatarUrl);
                      setShowMisDatosModal(true);
                    }}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3.5">
                      <User className="w-5 h-5 text-slate-600 dark:text-slate-300 stroke-[2.2] group-hover:text-[#0A4191] dark:group-hover:text-blue-400 transition-colors" />
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                        Mis datos
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                  </button>

                  {/* 2. Notificaciones */}
                  <button
                    type="button"
                    onClick={() => setShowNotifSettingsModal(true)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3.5">
                      <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300 stroke-[2.2] group-hover:text-[#0A4191] dark:group-hover:text-blue-400 transition-colors" />
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                        Notificaciones
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                  </button>

                  {/* 3. Seguridad */}
                  <button
                    type="button"
                    onClick={() => setShowSecurityModal(true)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3.5">
                      <Shield className="w-5 h-5 text-slate-600 dark:text-slate-300 stroke-[2.2] group-hover:text-[#0A4191] dark:group-hover:text-blue-400 transition-colors" />
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                        Seguridad
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                  </button>

                  {/* 4. Ayuda y soporte */}
                  <button
                    type="button"
                    onClick={() => setShowHelpSupportModal(true)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3.5">
                      <HelpCircle className="w-5 h-5 text-slate-600 dark:text-slate-300 stroke-[2.2] group-hover:text-[#0A4191] dark:group-hover:text-blue-400 transition-colors" />
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                        Ayuda y soporte
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                  </button>

                  {/* 5. Cerrar sesión */}
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3.5">
                      <LogOut className="w-5 h-5 text-slate-600 dark:text-slate-300 stroke-[2.2] group-hover:text-red-600 transition-colors" />
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs group-hover:text-red-600 transition-colors">
                        Cerrar sesión
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>
            )}
            </>
            )}

          </div>

          {/* ==================== 3. BOTTOM NAVIGATION BAR (MATCHES SCREENSHOT EXACTLY) ==================== */}
          <div className="absolute bottom-0 inset-x-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-3 py-2 z-30 flex items-center justify-around shadow-2xl">
            
            {/* Nav 1: Inicio */}
            <button
              type="button"
              onClick={() => {
                setSelectedIncident(null);
                setCitizenTab('inicio');
              }}
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
              onClick={() => {
                setSelectedIncident(null);
                setCitizenTab('mis_reportes');
              }}
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
                setSelectedIncident(null);
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
              onClick={() => {
                setSelectedIncident(null);
                setCitizenTab('noticias');
              }}
              className={`flex flex-col items-center justify-center space-y-0.5 transition-colors cursor-pointer ${
                citizenTab === 'noticias' ? 'text-[#0A4191] dark:text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Newspaper className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px]">Noticias</span>
            </button>

            {/* Nav 5: Perfil */}
            <button
              type="button"
              onClick={() => {
                setSelectedIncident(null);
                setCitizenTab('perfil');
              }}
              className={`flex flex-col items-center justify-center space-y-0.5 transition-colors cursor-pointer ${
                citizenTab === 'perfil' ? 'text-[#0A4191] dark:text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <User className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px]">Perfil</span>
            </button>

          </div>

        </div>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* 1. NOTICIAS MODAL (MOCKUP 15 DESIGN) */}
      {showNewsModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            {/* Header Row: Back Arrow + Centered Title "Noticias" */}
            <div className="relative text-center pt-1 pb-1">
              <button
                type="button"
                onClick={() => setShowNewsModal(false)}
                className="absolute left-0 top-0.5 p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Noticias
              </h2>
            </div>

            {/* Filter Pills Row: Todos | Comunicados | Obras | Eventos */}
            <div className="grid grid-cols-4 gap-1.5 py-0.5">
              {(['todos', 'comunicados', 'obras', 'eventos'] as const).map((filter) => {
                const labels: Record<string, string> = {
                  todos: 'Todos',
                  comunicados: 'Comunicados',
                  obras: 'Obras',
                  eventos: 'Eventos'
                };
                const isActive = noticiasFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setNoticiasFilter(filter)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center truncate ${
                      isActive
                        ? 'bg-[#0A4191] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {labels[filter]}
                  </button>
                );
              })}
            </div>

            {/* List of News Cards matching Mockup 15 */}
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {MOCK_NEWS.filter((item) => {
                if (noticiasFilter === 'todos') return true;
                return item.category === noticiasFilter;
              }).map((news) => (
                <div
                  key={news.id}
                  onClick={() => {
                    setSelectedNews(news);
                    setShowNewsModal(false);
                  }}
                  className="bg-[#F8FAFC] dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-2.5 flex items-center space-x-3 shadow-xs hover:shadow-md hover:border-blue-400 cursor-pointer transition-all group"
                >
                  {/* Left Thumbnail Image */}
                  <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-700">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>

                  {/* Middle Title & Date */}
                  <div className="flex-1 min-w-0 pr-1">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-xs leading-tight line-clamp-2">
                      {news.title}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 font-medium mt-1">
                      {news.date}
                    </p>
                  </div>

                  {/* Right Chevron */}
                  <div className="flex-shrink-0 pr-1">
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0A4191] dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowNewsModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* SELECTED NEWS READER MODAL */}
      {selectedNews && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3.5 text-xs animate-in fade-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="bg-blue-100 dark:bg-blue-950/60 text-[#0A4191] dark:text-blue-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {selectedNews.categoryLabel}
              </span>
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 h-40">
              <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
            </div>

            <div>
              <span className="font-mono text-[11px] text-slate-400 font-medium block mb-1">
                {selectedNews.date}
              </span>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug">
                {selectedNews.title}
              </h3>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-xs">
              {selectedNews.content}
            </p>

            <button
              type="button"
              onClick={() => setSelectedNews(null)}
              className="w-full py-2.5 bg-[#0A4191] text-white font-bold rounded-xl cursor-pointer shadow-sm hover:bg-blue-900"
            >
              Volver a Noticias
            </button>
          </div>
        </div>
      )}

      {/* 2. AGENDA MODAL (MATCHES MOCKUP 16. AGENDA EXACTLY) */}
      {showAgendaModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            {/* Header Row: Back Arrow + Centered Title "Agenda Municipal" */}
            <div className="relative text-center pt-1 pb-1">
              <button
                type="button"
                onClick={() => setShowAgendaModal(false)}
                className="absolute left-0 top-0.5 p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Agenda Municipal
              </h2>
            </div>

            {/* Calendar View Container */}
            <div className="bg-[#F8FAFC] dark:bg-slate-800/80 rounded-3xl p-3 border border-slate-100 dark:border-slate-700/60 space-y-2.5">
              {/* Month Header: < Mayo 2024 > */}
              <div className="flex items-center justify-between px-2 pt-1">
                <button
                  type="button"
                  className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <span className="font-black text-sm text-slate-900 dark:text-white tracking-tight">
                  Mayo 2024
                </span>
                <button
                  type="button"
                  className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Days of week header: L  M  M  J  V  S  D */}
              <div className="grid grid-cols-7 text-center font-extrabold text-slate-400 dark:text-slate-500 text-[11px] py-1">
                <span>L</span>
                <span>M</span>
                <span>M</span>
                <span>J</span>
                <span>V</span>
                <span>S</span>
                <span>D</span>
              </div>

              {/* Days of month grid */}
              <div className="grid grid-cols-7 gap-y-1.5 gap-x-1 text-center items-center">
                <span className="text-[11px] font-medium text-slate-300 dark:text-slate-600 py-1">29</span>
                <span className="text-[11px] font-medium text-slate-300 dark:text-slate-600 py-1">30</span>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((d) => (
                  <button
                    key={`modal-day-${d}`}
                    type="button"
                    onClick={() => setSelectedAgendaDay(d)}
                    className={`py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedAgendaDay === d
                        ? 'w-7 h-7 rounded-xl bg-[#0A4191] text-white flex items-center justify-center font-black shadow-md mx-auto'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
                <span className="text-[11px] font-medium text-slate-300 dark:text-slate-600 py-1">1</span>
                <span className="text-[11px] font-medium text-slate-300 dark:text-slate-600 py-1">2</span>
              </div>
            </div>

            {/* Section Subtitle */}
            <div className="pt-0.5 space-y-2">
              <h3 className="font-black text-slate-900 dark:text-white text-xs tracking-tight">
                Eventos del {selectedAgendaDay} de mayo
              </h3>

              {/* List of Event Cards */}
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-0.5">
                {selectedAgendaDay === 24 ? (
                  <>
                    <div className="bg-[#F8FAFC] dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-2.5 flex items-center space-x-3 relative overflow-hidden shadow-xs">
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full" />
                      <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/70 text-red-500 dark:text-red-400 flex items-center justify-center flex-shrink-0 ml-1 shadow-2xs">
                        <div className="w-6 h-6 bg-red-400/90 text-white rounded-xl flex items-center justify-center font-black text-xs">
                          ?
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-xs leading-snug">
                          Minga comunitaria
                        </h4>
                        <p className="text-[11px] font-mono text-slate-400 dark:text-slate-400 font-medium mt-0.5">
                          08:00 AM - Parque Central
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#F8FAFC] dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-2.5 flex items-center space-x-3 relative overflow-hidden shadow-xs">
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-amber-400 rounded-r-full" />
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 ml-1 shadow-2xs">
                        <div className="w-6 h-6 bg-emerald-500/90 text-white rounded-xl flex items-center justify-center">
                          <Building2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-xs leading-snug">
                          Sesión de Cabildo
                        </h4>
                        <p className="text-[11px] font-mono text-slate-400 dark:text-slate-400 font-medium mt-0.5">
                          15:00 PM - Sala de Sesiones
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-[#F8FAFC] dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3 text-center">
                    <p className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                      No hay eventos en esta fecha
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAgendaModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
            >
              Cerrar
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

      {/* 5. PERFIL USER MODAL (MATCHES MOCKUP 17. PERFIL DESIGN) */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs animate-in fade-in duration-200">
            {/* Header Row: Back Arrow + Centered Title "Mi perfil" */}
            <div className="relative text-center pt-1 pb-1">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="absolute left-0 top-0.5 p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Mi perfil
              </h2>
            </div>

            {/* Toast feedback message */}
            {profileToast && (
              <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 p-2.5 rounded-2xl flex items-center space-x-2 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="flex-1">{profileToast}</span>
              </div>
            )}

            {/* Avatar & User Info Header */}
            <div className="flex flex-col items-center justify-center text-center pt-1 pb-2 space-y-2">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-4 border-white dark:border-slate-800 shadow-md flex items-center justify-center">
                  {profileData.avatarUrl ? (
                    <img
                      src={profileData.avatarUrl}
                      alt={profileData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-slate-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditName(profileData.name);
                    setEditEmail(profileData.email);
                    setEditPhone(profileData.phone);
                    setEditSector(profileData.sector);
                    setEditCedula(profileData.cedula);
                    setEditAvatarUrl(profileData.avatarUrl);
                    setShowProfileModal(false);
                    setShowMisDatosModal(true);
                  }}
                  className="absolute bottom-0 right-0 w-7 h-7 bg-[#0A4191] text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-800 cursor-pointer transition-transform hover:scale-110"
                  title="Editar datos"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                  {profileData.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {profileData.email}
                </p>
              </div>
            </div>

            {/* Menu Options List */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-2xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
              {/* 1. Mis datos */}
              <button
                type="button"
                onClick={() => {
                  setEditName(profileData.name);
                  setEditEmail(profileData.email);
                  setEditPhone(profileData.phone);
                  setEditSector(profileData.sector);
                  setEditCedula(profileData.cedula);
                  setEditAvatarUrl(profileData.avatarUrl);
                  setShowProfileModal(false);
                  setShowMisDatosModal(true);
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-slate-600 dark:text-slate-300 stroke-[2.2] group-hover:text-[#0A4191] dark:group-hover:text-blue-400 transition-colors" />
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                    Mis datos
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
              </button>

              {/* 2. Notificaciones */}
              <button
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  setShowNotifSettingsModal(true);
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300 stroke-[2.2] group-hover:text-[#0A4191] dark:group-hover:text-blue-400 transition-colors" />
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                    Notificaciones
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
              </button>

              {/* 3. Seguridad */}
              <button
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  setShowSecurityModal(true);
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-slate-600 dark:text-slate-300 stroke-[2.2] group-hover:text-[#0A4191] dark:group-hover:text-blue-400 transition-colors" />
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                    Seguridad
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
              </button>

              {/* 4. Ayuda y soporte */}
              <button
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  setShowHelpSupportModal(true);
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-slate-600 dark:text-slate-300 stroke-[2.2] group-hover:text-[#0A4191] dark:group-hover:text-blue-400 transition-colors" />
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                    Ayuda y soporte
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
              </button>

              {/* 5. Cerrar sesión */}
              <button
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  if (onLogout) onLogout();
                }}
                className="w-full p-3.5 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <LogOut className="w-5 h-5 text-slate-600 dark:text-slate-300 stroke-[2.2] group-hover:text-red-600 transition-colors" />
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs group-hover:text-red-600 transition-colors">
                    Cerrar sesión
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowProfileModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl cursor-pointer hover:bg-slate-800"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* SUB-MODAL 1: MIS DATOS (EDIT USER PROFILE INFORMATION) */}
      {showMisDatosModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3.5 text-xs max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
            {/* Header */}
            <div className="relative text-center pt-1 pb-1 border-b border-slate-100 dark:border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setShowMisDatosModal(false)}
                className="absolute left-0 top-0.5 p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Editar Mis Datos
              </h2>
            </div>

            {/* Avatar Choice Row */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-4 border-[#0A4191] shadow-md">
                <img src={editAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-500">Seleccionar estilo de avatar:</span>
              <div className="flex space-x-2">
                {[
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'
                ].map((url, idx) => (
                  <button
                    key={`avatar-${idx}`}
                    type="button"
                    onClick={() => setEditAvatarUrl(url)}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 cursor-pointer transition-transform hover:scale-110 ${
                      editAvatarUrl === url ? 'border-[#0A4191] scale-105 shadow-md' : 'border-slate-200 dark:border-slate-700 opacity-70'
                    }`}
                  >
                    <img src={url} alt="Option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 pt-1">
              {/* Field 1: Name */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Nombres y Apellidos *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ej: María Fernanda"
                />
              </div>

              {/* Field 2: Email */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="ejemplo@gmail.com"
                />
              </div>

              {/* Field 3: Phone */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Teléfono Móvil
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="099 123 4567"
                />
              </div>

              {/* Field 4: Cedula */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Cédula / DNI
                </label>
                <input
                  type="text"
                  value={editCedula}
                  onChange={(e) => setEditCedula(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="1400829104"
                />
              </div>

              {/* Field 5: Sector */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Parroquia / Sector
                </label>
                <select
                  value={editSector}
                  onChange={(e) => setEditSector(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Logroño Centro (Cabecera)">Logroño Centro (Cabecera)</option>
                  <option value="Yaupi (Parroquia Rural)">Yaupi (Parroquia Rural)</option>
                  <option value="Shimpis (Parroquia Rural)">Shimpis (Parroquia Rural)</option>
                  <option value="Comunidad Shuar Upano">Comunidad Shuar Upano</option>
                  <option value="Sector Transkutukú">Sector Transkutukú</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex space-x-2">
              <button
                type="button"
                onClick={() => setShowMisDatosModal(false)}
                className="w-1/2 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileData({
                    name: editName,
                    email: editEmail,
                    phone: editPhone,
                    cedula: editCedula,
                    sector: editSector,
                    avatarUrl: editAvatarUrl
                  });
                  setCitizenName(editName);
                  setCitizenPhone(editPhone);
                  setCitizenCedula(editCedula);
                  setShowMisDatosModal(false);
                  setProfileToast('¡Datos de usuario actualizados correctamente!');
                  setTimeout(() => setProfileToast(null), 3500);
                }}
                className="w-1/2 py-2.5 bg-[#0A4191] text-white font-bold rounded-xl cursor-pointer hover:bg-blue-900 shadow-sm"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 2: NOTIFICACIONES SETTINGS */}
      {showNotifSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs animate-in fade-in duration-200">
            <div className="relative text-center pt-1 pb-1 border-b border-slate-100 dark:border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setShowNotifSettingsModal(false)}
                className="absolute left-0 top-0.5 p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Notificaciones
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Notificaciones Push</h4>
                  <p className="text-[10px] text-slate-500">Avances de reportes y alertas cantonales</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifPush}
                  onChange={(e) => setNotifPush(e.target.checked)}
                  className="w-5 h-5 accent-[#0A4191] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Alertas por Correo</h4>
                  <p className="text-[10px] text-slate-500">Resúmenes semanales de obras en Logroño</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.checked)}
                  className="w-5 h-5 accent-[#0A4191] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Avisos SMS de Emergencia</h4>
                  <p className="text-[10px] text-slate-500">Alertas climáticas o de vías principales</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifSMS}
                  onChange={(e) => setNotifSMS(e.target.checked)}
                  className="w-5 h-5 accent-[#0A4191] rounded cursor-pointer"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowNotifSettingsModal(false);
                setProfileToast('Preferencias de notificaciones guardadas');
                setTimeout(() => setProfileToast(null), 3000);
              }}
              className="w-full py-2.5 bg-[#0A4191] text-white font-bold rounded-xl cursor-pointer hover:bg-blue-900"
            >
              Guardar Preferencias
            </button>
          </div>
        </div>
      )}

      {/* SUB-MODAL 3: SEGURIDAD */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3.5 text-xs animate-in fade-in duration-200">
            <div className="relative text-center pt-1 pb-1 border-b border-slate-100 dark:border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setShowSecurityModal(false)}
                className="absolute left-0 top-0.5 p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Seguridad
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 pt-2">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Autenticación en 2 Pasos (2FA)</h4>
                  <p className="text-[10px] text-slate-500">Verificación por código SMS al ingresar</p>
                </div>
                <input
                  type="checkbox"
                  checked={security2FA}
                  onChange={(e) => setSecurity2FA(e.target.checked)}
                  className="w-5 h-5 accent-[#0A4191] rounded cursor-pointer"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowSecurityModal(false);
                setNewPassword('');
                setConfirmPassword('');
                setProfileToast('Ajustes de seguridad guardados correctamente');
                setTimeout(() => setProfileToast(null), 3000);
              }}
              className="w-full py-2.5 bg-[#0A4191] text-white font-bold rounded-xl cursor-pointer hover:bg-blue-900"
            >
              Actualizar Seguridad
            </button>
          </div>
        </div>
      )}

      {/* SUB-MODAL 4: AYUDA Y SOPORTE */}
      {showHelpSupportModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3.5 text-xs animate-in fade-in duration-200 max-h-[85vh] overflow-y-auto">
            <div className="relative text-center pt-1 pb-1 border-b border-slate-100 dark:border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setShowHelpSupportModal(false)}
                className="absolute left-0 top-0.5 p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Ayuda y Soporte
              </h2>
            </div>

            <div className="space-y-2.5">
              <div className="bg-blue-50 dark:bg-blue-950/60 p-3 rounded-2xl border border-blue-100 dark:border-blue-900/50 space-y-1">
                <span className="font-extrabold text-[#0A4191] dark:text-blue-400 block text-xs">Atención Ciudadana GAD Logroño</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Horario: Lunes a Viernes 08:00 - 17:00</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Teléfono: (07) 2700-100</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Correo: soporte@logrono.gob.ec</p>
              </div>

              <div className="space-y-2 pt-1">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Preguntas Frecuentes</h4>
                <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">¿Cuánto tarda en atenderse un reporte?</span>
                  <p className="text-[10px] text-slate-500">Dependiendo de la prioridad, la inspección se realiza dentro de 24 a 48 horas laborables.</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">¿Puedo hacer un reporte de forma anónima?</span>
                  <p className="text-[10px] text-slate-500">Sí, puedes omitir la cédula o solicitar confidencialidad al registrar la incidencia.</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpSupportModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* 6. INCIDENT DETAIL MODAL (MOCKUP 14 DESIGN) */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            {/* Header Row: Back / Close Arrow + Centered Title (Code) */}
            <div className="relative text-center pt-1 pb-1">
              <button
                type="button"
                onClick={() => setSelectedIncident(null)}
                className="absolute left-0 top-0.5 p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <h2 className="text-base font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {selectedIncident.code}
              </h2>
            </div>

            {/* Status Banner Card (Matches Mockup 14) */}
            {(() => {
              let bannerBg = 'bg-amber-100/90 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/50';
              let iconBg = 'bg-amber-500 text-white';
              let statusText = 'En proceso';
              let subtitleText = 'Tu reporte está siendo atendido.';
              let IconComp = Key;

              if (selectedIncident.status === 'resuelto') {
                bannerBg = 'bg-emerald-100/90 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/50';
                iconBg = 'bg-emerald-500 text-white';
                statusText = 'Solucionado';
                subtitleText = 'Tu reporte ha sido resuelto y finalizado.';
                IconComp = CheckCircle2;
              } else if (selectedIncident.status === 'reportado') {
                bannerBg = 'bg-blue-100/90 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-800/50';
                iconBg = 'bg-[#0A4191] text-white';
                statusText = 'Recibido';
                subtitleText = 'Tu reporte fue recibido en el sistema municipal.';
                IconComp = Clock;
              } else if (selectedIncident.status === 'asignado' || selectedIncident.status === 'en_revision') {
                bannerBg = 'bg-amber-100/90 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/50';
                iconBg = 'bg-amber-500 text-white';
                statusText = 'En revisión';
                subtitleText = 'Tu reporte ha sido remitido al departamento técnico.';
                IconComp = Wrench;
              }

              return (
                <div className={`p-4 rounded-2xl border flex items-center space-x-3.5 shadow-sm ${bannerBg}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${iconBg}`}>
                    <IconComp className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {statusText}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                      {subtitleText}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Section Header: Progreso del reporte */}
            <div className="pt-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xs">
                Progreso del reporte
              </h3>
            </div>

            {/* Vertical Timeline Stepper matching Mockup 14 */}
            <div className="relative pl-3 space-y-4 pt-1 pb-2">
              {/* Vertical line connecting steps */}
              <div className="absolute left-[21px] top-4 bottom-5 w-0.5 bg-slate-200 dark:bg-slate-700 -z-0" />

              {/* Step 1: Recibido */}
              <div className="flex items-center justify-between text-xs relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 font-bold">-</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">Recibido</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  24/05/2024 10:15
                </span>
              </div>

              {/* Step 2: En revisión */}
              <div className="flex items-center justify-between text-xs relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 font-bold">-</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">En revisión</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  24/05/2024 11:20
                </span>
              </div>

              {/* Step 3: Asignado */}
              <div className="flex items-center justify-between text-xs relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 font-bold">-</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">Asignado</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  24/05/2024 14:30
                </span>
              </div>

              {/* Step 4: En proceso */}
              <div className="flex items-center justify-between text-xs relative z-10">
                <div className="flex items-center space-x-2">
                  {selectedIncident.status === 'resuelto' ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#0A4191] text-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                  <span className="text-slate-500 dark:text-slate-400 font-bold">-</span>
                  <span className={`font-extrabold ${selectedIncident.status === 'en_proceso' ? 'text-[#0A4191] dark:text-blue-400 font-black' : 'text-slate-900 dark:text-white'}`}>
                    En proceso
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  25/05/2024 09:00
                </span>
              </div>

              {/* Step 5: Solucionado */}
              <div className="flex items-center justify-between text-xs relative z-10">
                <div className="flex items-center space-x-2">
                  {selectedIncident.status === 'resuelto' ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 flex-shrink-0" />
                  )}
                  <span className="text-slate-400 dark:text-slate-500 font-bold">-</span>
                  <span className={`font-semibold ${selectedIncident.status === 'resuelto' ? 'text-emerald-700 dark:text-emerald-400 font-extrabold' : 'text-slate-400 dark:text-slate-500'}`}>
                    Solucionado
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  {selectedIncident.status === 'resuelto' ? '26/05/2024 16:00' : ''}
                </span>
              </div>
            </div>

            {/* Bottom Collapsible Button: Información del reporte */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowReportInfo(!showReportInfo)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl py-3 px-4 text-[#0A4191] dark:text-blue-400 font-bold text-center text-xs shadow-sm hover:shadow hover:border-blue-400 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Información del reporte</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showReportInfo ? 'rotate-180' : ''}`} />
              </button>

              {/* Collapsible Info Card */}
              {showReportInfo && (
                <div className="mt-3 bg-[#F8FAFC] dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3 shadow-sm animate-in fade-in duration-200 text-left">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A4191] dark:text-blue-400 block">
                      {selectedIncident.category}
                    </span>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5">
                      {selectedIncident.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {selectedIncident.description}
                    </p>
                  </div>

                  {selectedIncident.photoUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48">
                      <img src={selectedIncident.photoUrl} alt="Foto evidencia" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Ubicación / Sector:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedIncident.location.sector}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Dirección:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-right truncate max-w-[180px]">{selectedIncident.location.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Departamento:</span>
                      <span className="font-bold text-[#159A44] truncate max-w-[180px]">{selectedIncident.assignedDepartment}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedIncident(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
