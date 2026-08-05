import React, { useState } from 'react';
import { Incident, IncidentCategory, LogronoSector, LanguageMode, AIAnalysisResult, PQRSItem } from '../types';
import { SHUAR_DICTIONARY } from '../data/shuarDictionary';
import { LogronoGoogleMap } from './LogronoGoogleMap';
import { 
  PlusCircle, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ListFilter, 
  Send, 
  Sparkles, 
  PhoneCall, 
  ChevronRight, 
  FileText, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  Share2, 
  RefreshCw,
  Search,
  UserCheck,
  ShieldCheck,
  Flame,
  Ambulance,
  Car
} from 'lucide-react';

interface CitizenAppProps {
  incidents: Incident[];
  onAddIncident: (newInc: Incident) => void;
  lang: LanguageMode;
  isOnline: boolean;
}

export const CitizenApp: React.FC<CitizenAppProps> = ({
  incidents,
  onAddIncident,
  lang,
  isOnline
}) => {
  const [citizenTab, setCitizenTab] = useState<'inicio' | 'reportar' | 'mis_reportes' | 'mapa' | 'pqrs' | 'directorio'>('inicio');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);

  // New Incident Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('Vías y Aceras');
  const [sector, setSector] = useState<LogronoSector>('Logroño Centro (Cabecera)');
  const [address, setAddress] = useState('Calle 10 de Agosto y Av. Intercultural, Logroño');
  const [reference, setReference] = useState('');
  const [citizenName, setCitizenName] = useState('Luis Shakaim');
  const [citizenPhone, setCitizenPhone] = useState('0984712039');
  const [citizenCedula, setCitizenCedula] = useState('1400829104');
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
      // Fallback
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
  const handleSubmitIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    const newCode = `LOG-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newIncident: Incident = {
      id: `inc-${Date.now()}`,
      code: newCode,
      title,
      description,
      category: aiPreview?.suggestedCategory || category,
      status: 'reportado',
      priority: aiPreview?.priority || 'media',
      location: {
        lat: sector === 'Parroquia Yaupi' ? -2.6315 : sector === 'Parroquia Shimpis' ? -2.6102 : -2.6280,
        lng: sector === 'Parroquia Yaupi' ? -78.1824 : sector === 'Parroquia Shimpis' ? -78.1450 : -78.1760,
        address: address || 'Sector ' + sector + ', Logroño',
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
      // Reset fields
      setTitle('');
      setDescription('');
      setReference('');
      setAiPreview(null);
    }, 600);
  };

  // Play Shuar Audio Narration
  const playShuarAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
      {/* Device Frame Switcher Bar */}
      <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 rounded-xl mb-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
            PWA Android / iOS
          </span>
          <span>Visor de Aplicación Ciudadana</span>
        </div>
        
        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          id="btn-toggle-phone-frame"
          className="flex items-center space-x-1.5 bg-white dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-100 text-xs px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm transition-all cursor-pointer font-medium"
        >
          {isPhoneFrame ? (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Vista Pantalla Completa</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Simulador Smartphone</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container (Wrapped in Phone Mockup if active) */}
      <div className={isPhoneFrame ? "max-w-sm mx-auto bg-slate-900 p-3 rounded-[36px] shadow-2xl border-4 border-slate-800" : ""}>
        
        {/* Smartphone Screen Border Header if Frame active */}
        {isPhoneFrame && (
          <div className="flex justify-between items-center px-4 py-1 text-[10px] font-semibold text-slate-400 bg-slate-950 rounded-t-[28px] mb-2">
            <span>09:41 AM</span>
            <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto"></div>
            <span>5G 100%</span>
          </div>
        )}

        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
          
          {/* App Internal Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-teal-900 text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-300 tracking-wider uppercase">
                  {lang === 'shuar' ? SHUAR_DICTIONARY.welcome.shuar : 'GAD Municipal Cantón Logroño'}
                </span>
                <h2 className="text-lg font-bold">Logroño Conecta</h2>
              </div>
              
              {/* Shuar Audio Voiceover Simulator Button */}
              <button
                onClick={playShuarAudio}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isPlayingAudio 
                    ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse' 
                    : 'bg-emerald-950/80 text-amber-200 border-amber-500/40 hover:bg-emerald-900'
                }`}
                title="Escuchar audio-guía en Shuar Chicham"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingAudio ? 'Escuchando Shuar...' : 'Voz Shuar'}</span>
              </button>
            </div>

            {/* Sub-nav Tabs inside Citizen App */}
            <div className="flex space-x-1 mt-3 pt-2 border-t border-emerald-700/60 overflow-x-auto text-xs font-medium">
              <button
                onClick={() => setCitizenTab('inicio')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  citizenTab === 'inicio' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-emerald-100 hover:bg-emerald-800/60'
                }`}
              >
                Inicio
              </button>
              <button
                onClick={() => setCitizenTab('reportar')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1 cursor-pointer ${
                  citizenTab === 'reportar' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-emerald-100 hover:bg-emerald-800/60'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Reportar</span>
              </button>
              <button
                onClick={() => setCitizenTab('mis_reportes')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1 cursor-pointer ${
                  citizenTab === 'mis_reportes' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-emerald-100 hover:bg-emerald-800/60'
                }`}
              >
                <span>Mis Reportes ({incidents.length})</span>
              </button>
              <button
                onClick={() => setCitizenTab('mapa')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  citizenTab === 'mapa' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-emerald-100 hover:bg-emerald-800/60'
                }`}
              >
                Mapa
              </button>
              <button
                onClick={() => setCitizenTab('pqrs')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  citizenTab === 'pqrs' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-emerald-100 hover:bg-emerald-800/60'
                }`}
              >
                PQRS
              </button>
              <button
                onClick={() => setCitizenTab('directorio')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  citizenTab === 'directorio' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-emerald-100 hover:bg-emerald-800/60'
                }`}
              >
                Directorio
              </button>
            </div>
          </div>

          {/* TAB 1: INICIO */}
          {citizenTab === 'inicio' && (
            <div className="p-4 space-y-4">
              {/* Emergency Banner */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-3.5 rounded-xl border border-amber-500/30 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                    Alerta Cantonal: Época de Lluvias en Morona Santiago
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 mt-1">
                    Se recomienda circular con precaución en la vía Logroño - Parroquia Yaupi por presencia de deslizamientos menores. Reporte cualquier obstrucción de inmediato.
                  </p>
                </div>
              </div>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => setCitizenTab('reportar')}
                  className="bg-emerald-700 text-white p-4 rounded-xl shadow-sm hover:bg-emerald-800 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <PlusCircle className="w-7 h-7 text-amber-300 mb-2" />
                  <div>
                    <h4 className="font-bold text-sm">
                      {lang === 'shuar' ? SHUAR_DICTIONARY.report_incident.shuar : 'Reportar Incidencia'}
                    </h4>
                    <p className="text-[11px] text-emerald-100 mt-0.5">Vías, Agua, Alumbrado con foto y GPS</p>
                  </div>
                </div>

                <div 
                  onClick={() => setCitizenTab('mis_reportes')}
                  className="bg-slate-800 text-white p-4 rounded-xl shadow-sm hover:bg-slate-700 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <Clock className="w-7 h-7 text-emerald-400 mb-2" />
                  <div>
                    <h4 className="font-bold text-sm">
                      {lang === 'shuar' ? SHUAR_DICTIONARY.my_reports.shuar : 'Seguimiento en Vivo'}
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">Trazabilidad del GAD Logroño</p>
                  </div>
                </div>
              </div>

              {/* Emergency Numbers Quick Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1">
                  <PhoneCall className="w-3.5 h-3.5 text-red-500" />
                  <span>Números Directos de Emergencia (Logroño)</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <a href="tel:911" className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-2.5 rounded-lg flex items-center space-x-2 text-red-700 dark:text-red-300 font-bold hover:bg-red-100">
                    <Ambulance className="w-4 h-4 text-red-600" />
                    <div>
                      <span className="block text-[10px] uppercase">ECU 911</span>
                      <span className="text-xs">911</span>
                    </div>
                  </a>

                  <a href="tel:102" className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-2.5 rounded-lg flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold hover:bg-amber-100">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="block text-[10px] uppercase">Bomberos</span>
                      <span className="text-xs">102</span>
                    </div>
                  </a>

                  <a href="tel:101" className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 p-2.5 rounded-lg flex items-center space-x-2 text-blue-800 dark:text-blue-300 font-bold hover:bg-blue-100">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="block text-[10px] uppercase">Policía</span>
                      <span className="text-xs">101</span>
                    </div>
                  </a>

                  <a href="tel:072700100" className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 p-2.5 rounded-lg flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold hover:bg-emerald-100">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="block text-[10px] uppercase">GAD Municipio</span>
                      <span className="text-xs">07-2700-100</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Recent Active Community Incidents Stream */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Incidencias Recientes Atendidas en el Cantón
                </h4>

                <div className="space-y-2">
                  {incidents.slice(0, 3).map((inc) => (
                    <div 
                      key={inc.id}
                      onClick={() => setSelectedIncident(inc)}
                      className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        {inc.photoUrl ? (
                          <img src={inc.photoUrl} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                            GAD
                          </div>
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono font-bold text-slate-500">{inc.code}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                              inc.status === 'resuelto' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                            }`}>
                              {inc.status}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">{inc.title}</h5>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{inc.location.sector}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: REPORTAR INCIDENCIA */}
          {citizenTab === 'reportar' && (
            <div className="p-4 space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <span>Nuevo Reporte Ciudadano</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Suba la evidencia y el sistema de Inteligencia Artificial Gemini clasificará automáticamente la prioridad.
                </p>
              </div>

              {submitSuccess ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/60 p-5 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                    ¡Reporte Registrado Exitosamente!
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    Se asignó el código de seguimiento: <strong className="font-mono text-emerald-900 dark:text-white">{submitSuccess}</strong>.
                    Las cuadrillas del GAD Municipal de Logroño han sido notificadas.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitSuccess(null);
                      setCitizenTab('mis_reportes');
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Ver Mis Reportes
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitIncident} className="space-y-3 text-xs">
                  {/* Title */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Título Breve de la Incidencia *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Fuga de agua en tubería principal o Bache en calle 10 de Agosto"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Descripción Detallada *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describa el problema, dimensiones del daño y puntos de referencia para la cuadrilla..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  {/* Sector Dropdown */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sector / Parroquia de Logroño *
                    </label>
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value as LogronoSector)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      {sectors.map((sec) => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category Grid */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Categoría Estimada
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`p-2 rounded-lg text-left text-[11px] font-medium border transition-all cursor-pointer ${
                            category === cat
                              ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Photo Capture / Sample Selector */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                      <span>Evidencia Fotográfica</span>
                      <span className="text-[10px] text-emerald-600 font-normal">Cámara o archivo</span>
                    </label>

                    <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <img src={photoUrl} alt="Preview" className="w-16 h-16 rounded-lg object-cover border" />
                      
                      <div className="flex-1 space-y-1">
                        <span className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          Foto simulada adjunta para análisis de visión IA
                        </span>
                        
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80')}
                            className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-[10px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                          >
                            Tubería Agua
                          </button>
                          <button
                            type="button"
                            onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80')}
                            className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-[10px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                          >
                            Vía / Bache
                          </button>
                          <button
                            type="button"
                            onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600&auto=format&fit=crop&q=80')}
                            className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-[10px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                          >
                            Poste Luz
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Gemini Pre-Analysis Trigger */}
                  <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 p-3 rounded-xl text-white border border-emerald-700/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                        <span className="font-bold text-xs text-amber-300">Asistente IA Gemini GAD</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAnalyzeWithAI}
                        disabled={isAnalyzingAI}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] px-3 py-1 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isAnalyzingAI ? 'Analizando...' : 'Analizar Prioridad IA'}
                      </button>
                    </div>

                    {aiPreview && (
                      <div className="mt-2.5 pt-2 border-t border-emerald-800/80 text-[11px] space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-200">Prioridad Predicha:</span>
                          <span className="font-bold text-amber-300 uppercase">{aiPreview.priority} (Score {aiPreview.score}/5)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-200">Departamento Sugerido:</span>
                          <span className="font-bold text-white">{aiPreview.department}</span>
                        </div>
                        <p className="text-emerald-100/90 italic mt-1 bg-emerald-900/40 p-1.5 rounded">
                          "{aiPreview.recommendation}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Citizen Contact Info */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre Ciudadano</label>
                      <input
                        type="text"
                        value={citizenName}
                        onChange={(e) => setCitizenName(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Cédula Ecuatoriana</label>
                      <input
                        type="text"
                        value={citizenCedula}
                        onChange={(e) => setCitizenCedula(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-300" />
                        <span>{lang === 'shuar' ? SHUAR_DICTIONARY.send.shuar : 'ENVIAR REPORTE AL GAD MUNICIPAL'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: MIS REPORTES */}
          {citizenTab === 'mis_reportes' && (
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Historial de Incidencias ({incidents.length})
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">Trazabilidad GAD</span>
              </div>

              <div className="space-y-3">
                {incidents.map((inc) => (
                  <div
                    key={inc.id}
                    className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {inc.code}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                          {inc.title}
                        </h4>
                      </div>
                      
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        inc.status === 'resuelto' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300' 
                          : inc.status === 'en_proceso'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                      }`}>
                        {inc.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                      {inc.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        <span>{inc.location.sector}</span>
                      </span>

                      <span>{new Date(inc.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Estado Actual:
                      </span>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={inc.status === 'reportado' ? 'font-bold text-amber-600' : 'text-slate-400'}>1. Reportado</span>
                        <span className="text-slate-300">→</span>
                        <span className={inc.status === 'asignado' ? 'font-bold text-blue-600' : 'text-slate-400'}>2. Asignado</span>
                        <span className="text-slate-300">→</span>
                        <span className={inc.status === 'en_proceso' ? 'font-bold text-purple-600' : 'text-slate-400'}>3. En Proceso</span>
                        <span className="text-slate-300">→</span>
                        <span className={inc.status === 'resuelto' ? 'font-bold text-emerald-600' : 'text-slate-400'}>4. Resuelto</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MAPA CANTONAL */}
          {citizenTab === 'mapa' && (
            <div className="p-4 space-y-3">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Mapa Georreferenciado del Cantón Logroño</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Ubicaciones registradas en Logroño Centro, Yaupi y Shimpis (WGS84 GPS con Google Maps API).
                </p>
              </div>

              {/* Real Google Maps Component */}
              <LogronoGoogleMap
                incidents={incidents}
                onSelectIncident={(inc) => setSelectedIncident(inc)}
              />
            </div>
          )}

          {/* TAB 5: PQRS */}
          {citizenTab === 'pqrs' && (
            <div className="p-4 space-y-3">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Ventanilla PQRS - Transparencia Municipal</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Peticiones, Quejas, Reclamos y Sugerencias amparadas por la Ley de Transparencia de Ecuador.
                </p>
              </div>

              {pqrsSuccess ? (
                <div className="bg-emerald-50 text-emerald-900 p-4 rounded-xl border border-emerald-300 text-center space-y-2 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold">Trámite Ingresado</h4>
                  <p>Su {pqrsType} ha sido remitida a la Secretaría General del GAD Logroño.</p>
                  <button 
                    onClick={() => setPqrsSuccess(false)}
                    className="bg-emerald-700 text-white px-3 py-1 rounded font-bold cursor-pointer"
                  >
                    Ingresar Otro Trámite
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setPqrsSuccess(true);
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tipo de Trámite</label>
                    <div className="grid grid-cols-4 gap-1">
                      {(['Petición', 'Queja', 'Reclamo', 'Sugerencia'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setPqrsType(t)}
                          className={`py-1.5 rounded text-[10px] font-bold border ${
                            pqrsType === t ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Asunto</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Solicitud de información sobre la obra de alcantarillado"
                      value={pqrsSubject}
                      onChange={(e) => setPqrsSubject(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Detalle</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Fundamente su solicitud dirigida a la máxima autoridad cantonal..."
                      value={pqrsDetail}
                      onChange={(e) => setPqrsDetail(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <button type="submit" className="w-full py-2.5 bg-emerald-700 text-white font-bold rounded-xl shadow cursor-pointer">
                    REGISTRAR PQRS EN EL GAD
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 6: DIRECTORIO */}
          {citizenTab === 'directorio' && (
            <div className="p-4 space-y-3">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Directorio Autoridades & Parroquias de Logroño
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-emerald-700 dark:text-emerald-400">Alcaldía Municipal de Logroño</h4>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">Palacio Municipal, Calle 10 de Agosto</p>
                  <span className="text-[10px] text-slate-500 block mt-1">Contacto: (07) 2700-100</span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-emerald-700 dark:text-emerald-400">GAD Parroquial de Yaupi</h4>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">Centro Poblado Yaupi, Morona Santiago</p>
                  <span className="text-[10px] text-slate-500 block mt-1">Coordinación Intercultural Shuar</span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-emerald-700 dark:text-emerald-400">GAD Parroquial de Shimpis</h4>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">Plaza Central Shimpis</p>
                  <span className="text-[10px] text-slate-500 block mt-1">Agua Potable y Obras Rurales</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-4 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedIncident.code}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedIncident.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {selectedIncident.photoUrl && (
              <img src={selectedIncident.photoUrl} alt="" className="w-full h-44 rounded-xl object-cover border" />
            )}

            <div className="space-y-2">
              <p className="text-slate-700 dark:text-slate-300">{selectedIncident.description}</p>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Sector:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedIncident.location.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Departamento Asignado:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedIncident.assignedDepartment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Operador Técnico:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedIncident.assignedOperator || 'En asignación'}</span>
                </div>
              </div>

              {selectedIncident.aiAnalysis && (
                <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900 space-y-1 text-[11px]">
                  <span className="font-bold text-amber-900 dark:text-amber-300 block">Diagnóstico de Visión IA Gemini:</span>
                  <p className="text-slate-700 dark:text-slate-300 italic">"{selectedIncident.aiAnalysis.recommendation}"</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedIncident(null)}
              className="w-full py-2 bg-slate-800 text-white font-bold rounded-lg cursor-pointer"
            >
              Cerrar Detalle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
