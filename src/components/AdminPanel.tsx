import React, { useState, useEffect } from 'react';
import { Incident, IncidentStatus, IncidentPriority, LogronoSector } from '../types';
import { LogronoGoogleMap } from './LogronoGoogleMap';
import { ReportIncidentChat } from './ReportIncidentChat';
import { 
  LayoutDashboard, 
  MapPin, 
  Search, 
  Filter, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  UserCheck, 
  Building2, 
  FileSpreadsheet, 
  FileText, 
  Activity, 
  Send,
  RefreshCw,
  TrendingUp,
  SlidersHorizontal,
  Navigation,
  Route,
  Volume2,
  VolumeX,
  Share2,
  ExternalLink,
  Compass,
  Crosshair,
  Archive,
  FileCheck,
  Printer,
  History,
  Award,
  RotateCcw,
  CheckCircle,
  X
} from 'lucide-react';

interface AdminPanelProps {
  incidents: Incident[];
  onUpdateStatus: (id: string, newStatus: IncidentStatus, department?: string, note?: string) => void;
  activeSubTab?: 'activas' | 'atendidas';
  onSubTabChange?: (subtab: 'activas' | 'atendidas') => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  incidents,
  onUpdateStatus,
  activeSubTab,
  onSubTabChange
}) => {
  // GAD SubTab View State: 'activas' vs 'atendidas' (Archived Resolved Incidents Panel)
  const [internalAdminSubTab, setInternalAdminSubTab] = useState<'activas' | 'atendidas'>('activas');
  const adminSubTab = activeSubTab !== undefined ? activeSubTab : internalAdminSubTab;
  const setAdminSubTab = (tab: 'activas' | 'atendidas') => {
    setInternalAdminSubTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  // Search & Filters for Active
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('todos');
  const [priorityFilter, setPriorityFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Search & Filters for Archived / Atendidas
  const [archivedSearchTerm, setArchivedSearchTerm] = useState('');
  const [archivedSectorFilter, setArchivedSectorFilter] = useState<string>('todos');

  // Real-Time Selected Map Incident State
  const [selectedMapIncident, setSelectedMapIncident] = useState<Incident | null>(null);

  // Inspector Modal
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [assignedDepartment, setAssignedDepartment] = useState('');
  const [assignedOperator, setAssignedOperator] = useState('');
  const [gadNote, setGadNote] = useState('');
  const [targetStatus, setTargetStatus] = useState<IncidentStatus>('en_proceso');

  // Certificate / Resolution Modal State
  const [selectedCertIncident, setSelectedCertIncident] = useState<Incident | null>(null);

  // AI Predictive Analytics Modal
  const [isPredictingRisk, setIsPredictingRisk] = useState(false);
  const [riskReport, setRiskReport] = useState<any>(null);

  // Separate Active vs Resolved Incidents
  const activeIncidentsList = incidents.filter((inc) => inc.status !== 'resuelto');
  const resolvedIncidentsList = incidents.filter((inc) => inc.status === 'resuelto');

  // Filtered Active Incidents (automatically excludes resolved ones)
  const filteredActiveIncidents = activeIncidentsList.filter((inc) => {
    const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.citizenName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'todos' || inc.location.sector === sectorFilter;
    const matchesPriority = priorityFilter === 'todos' || inc.priority === priorityFilter;
    const matchesStatus = statusFilter === 'todos' || inc.status === statusFilter;

    return matchesSearch && matchesSector && matchesPriority && matchesStatus;
  });

  // Filtered Archived/Resolved Incidents for the Dedicated Panel
  const filteredResolvedIncidents = resolvedIncidentsList.filter((inc) => {
    const matchesSearch = inc.title.toLowerCase().includes(archivedSearchTerm.toLowerCase()) || 
                          inc.code.toLowerCase().includes(archivedSearchTerm.toLowerCase()) ||
                          inc.citizenName.toLowerCase().includes(archivedSearchTerm.toLowerCase());
    const matchesSector = archivedSectorFilter === 'todos' || inc.location.sector === archivedSectorFilter;

    return matchesSearch && matchesSector;
  });

  useEffect(() => {
    if (adminSubTab === 'activas' && filteredActiveIncidents.length > 0 && !selectedMapIncident) {
      setSelectedMapIncident(filteredActiveIncidents[0]);
    } else if (adminSubTab === 'atendidas' && filteredResolvedIncidents.length > 0 && !selectedMapIncident) {
      setSelectedMapIncident(filteredResolvedIncidents[0]);
    }
  }, [filteredActiveIncidents, filteredResolvedIncidents, adminSubTab]);

  // Calculate Metrics
  const totalCount = incidents.length;
  const criticalCount = activeIncidentsList.filter((i) => i.priority === 'critica' || i.priority === 'alta').length;
  const inProgressCount = activeIncidentsList.filter((i) => i.status === 'en_proceso' || i.status === 'asignado').length;
  const resolvedCount = resolvedIncidentsList.length;

  // Open Inspector
  const handleOpenInspector = (inc: Incident) => {
    setSelectedIncident(inc);
    setAssignedDepartment(inc.assignedDepartment || 'Dirección de Obras Públicas Municipales');
    setAssignedOperator(inc.assignedOperator || 'Ing. Carlos Tiwiram');
    setTargetStatus(inc.status);
    setGadNote('');
  };

  // Save Operator Changes
  const handleSaveInspector = () => {
    if (!selectedIncident) return;
    onUpdateStatus(selectedIncident.id, targetStatus, assignedDepartment, gadNote || 'Estado actualizado por el Panel GAD Logroño');
    setSelectedIncident(null);
  };

  // Quick Resolve & Archive
  const handleQuickResolve = (inc: Incident) => {
    onUpdateStatus(
      inc.id,
      'resuelto',
      inc.assignedDepartment || 'Dirección de Obras Públicas Municipales',
      '✅ Trámite resuelto exitosamente por el GAD Municipal y archivado en el Panel de Atendidos.'
    );
  };

  // Re-open Incident from Archived Panel
  const handleReopenIncident = (inc: Incident) => {
    onUpdateStatus(
      inc.id,
      'en_proceso',
      inc.assignedDepartment || 'Dirección de Obras Públicas Municipales',
      '🔄 Trámite reabierto desde el Archivo Municipal para reinspección técnica.'
    );
  };

  // Trigger AI Predictive Analytics
  const handlePredictInfrastructureRisk = async () => {
    setIsPredictingRisk(true);
    setRiskReport(null);

    try {
      const response = await fetch('/api/ai-predictive-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidents })
      });
      const data = await response.json();
      if (data.success && data.riskReport) {
        setRiskReport(data.riskReport);
      }
    } catch (err) {
      console.warn('Fallback Risk Prediction:', err);
      setRiskReport({
        highRiskSector: 'Vía Logroño - Parroquia Yaupi (Km 4.5)',
        riskLevel: 'ALTO',
        predictedIncident: 'Saturación de alcantarillas transversales y desprendimiento de ladera por lluvias amazónicas.',
        recommendedAction: 'Desplegar la cuadrilla #2 de Obras Públicas para limpieza preventiva de cunetas en el sector Yaupi.'
      });
    } finally {
      setIsPredictingRisk(false);
    }
  };

  // Download PDF / Excel Simulation
  const handleExportData = (type: 'pdf' | 'excel') => {
    const listToExport = adminSubTab === 'activas' ? filteredActiveIncidents : filteredResolvedIncidents;
    const content = JSON.stringify(listToExport, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_GAD_Logrono_${adminSubTab.toUpperCase()}_${type.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 space-y-6 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-100 text-slate-800 rounded-3xl p-4 sm:p-6 border-2 border-[#0A4191] shadow-xl">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] p-5.5 rounded-2xl border-2 border-[#0A4191] shadow-md text-white">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight">
              Panel Administrativo de Control Municipal GAD
            </h2>
            <span className="bg-white/20 text-amber-300 text-xs font-black px-3 py-1 rounded-full border border-white/30 backdrop-blur-md shadow-2xs">
              GAD Logroño
            </span>
          </div>
          <p className="text-xs text-blue-100 font-medium mt-1">
            Gestión en tiempo real de cuadrillas, asignación de departamentos y priorización inteligente.
          </p>
        </div>

        {/* Action Buttons: Botones Profesionales con Gradientes */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePredictInfrastructureRisk}
            disabled={isPredictingRisk}
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl border border-amber-600 shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
            <span>{isPredictingRisk ? 'Calculando Riesgos...' : 'Predicción de Riesgo IA'}</span>
          </button>

          <button
            onClick={() => handleExportData('excel')}
            className="flex items-center space-x-1.5 bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl border border-white/30 shadow-2xs backdrop-blur-md cursor-pointer transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            <span>Exportar Excel</span>
          </button>

          <button
            onClick={() => handleExportData('pdf')}
            className="flex items-center space-x-1.5 bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl border border-white/30 shadow-2xs backdrop-blur-md cursor-pointer transition-all active:scale-95"
          >
            <FileText className="w-4 h-4 text-sky-300" />
            <span>Informe PDF</span>
          </button>
        </div>
      </div>

      {/* Top Navigation SubTabs: Pestañas Personalizadas con Combinación de Colores */}
      <div className="flex border-2 border-[#0A4191]/40 bg-slate-200/70 backdrop-blur-xs rounded-2xl p-1.5 shadow-inner gap-2">
        <button
          onClick={() => setAdminSubTab('activas')}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer border ${
            adminSubTab === 'activas'
              ? 'bg-gradient-to-r from-[#0A4191] to-[#0C51B6] text-white border-[#0A4191] shadow-md ring-2 ring-[#0A4191]/30'
              : 'bg-white/90 text-slate-700 border-slate-300 hover:bg-white hover:text-[#0A4191]'
          }`}
        >
          <Activity className={`w-4 h-4 shrink-0 ${adminSubTab === 'activas' ? 'text-amber-300' : 'text-[#0A4191]'}`} />
          <span>Trámites e Incidencias Activas</span>
          <span className={`ml-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
            adminSubTab === 'activas'
              ? 'bg-white/20 text-white border border-white/30'
              : 'bg-blue-100 text-[#0A4191] border border-blue-200'
          }`}>
            {activeIncidentsList.length}
          </span>
        </button>

        <button
          onClick={() => setAdminSubTab('atendidas')}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer border ${
            adminSubTab === 'atendidas'
              ? 'bg-gradient-to-r from-[#0A4191] to-[#0C51B6] text-white border-[#0A4191] shadow-md ring-2 ring-[#0A4191]/30'
              : 'bg-white/90 text-slate-700 border-slate-300 hover:bg-white hover:text-[#0A4191]'
          }`}
        >
          <Archive className={`w-4 h-4 shrink-0 ${adminSubTab === 'atendidas' ? 'text-emerald-300' : 'text-[#0A4191]'}`} />
          <span>Panel de Incidencias Atendidas y Archivadas</span>
          <span className={`ml-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
            adminSubTab === 'atendidas'
              ? 'bg-white/20 text-white border border-white/30'
              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
          }`}>
            {resolvedIncidentsList.length}
          </span>
        </button>
      </div>

      {/* Analytics Counter Widgets Grid: Tarjetas Personalizadas Combinadas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50/60 p-4 rounded-2xl border-2 border-[#0A4191]/40 shadow-xs flex items-center justify-between text-slate-800">
          <div>
            <span className="text-[11px] font-extrabold text-[#0A4191] uppercase tracking-wider">Total Reportes</span>
            <span className="block text-2xl font-black text-[#0A4191] mt-1">{totalCount}</span>
            <span className="text-[10px] text-slate-500 font-bold">100% Georreferenciados</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A4191] to-[#0C51B6] text-white flex items-center justify-center shadow-xs">
            <LayoutDashboard className="w-5 h-5 text-amber-300" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-white via-rose-50/30 to-amber-50/50 p-4 rounded-2xl border-2 border-rose-300/80 shadow-xs flex items-center justify-between text-slate-800">
          <div>
            <span className="text-[11px] font-extrabold text-rose-900 uppercase tracking-wider">Prioridad Alta / Crítica</span>
            <span className="block text-2xl font-black text-rose-700 mt-1">{criticalCount}</span>
            <span className="text-[10px] text-rose-600 font-bold">Despacho Inmediato</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex items-center justify-center shadow-xs">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/50 p-4 rounded-2xl border-2 border-purple-300/80 shadow-xs flex items-center justify-between text-slate-800">
          <div>
            <span className="text-[11px] font-extrabold text-purple-900 uppercase tracking-wider">En Cuadrilla / Proceso</span>
            <span className="block text-2xl font-black text-purple-700 mt-1">{inProgressCount}</span>
            <span className="text-[10px] text-purple-600 font-bold">Maquinaria en Terreno</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 p-4 rounded-2xl border-2 border-emerald-300/80 shadow-xs flex items-center justify-between text-slate-800">
          <div>
            <span className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider">Atendidos y Archivados</span>
            <span className="block text-2xl font-black text-emerald-700 mt-1">{resolvedCount}</span>
            <span className="text-[10px] text-emerald-600 font-bold">Archivados en Registro</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          </div>
        </div>
      </div>

      {/* AI Risk Analytics Banner (If Triggered) */}
      {riskReport && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-100/60 to-orange-100/40 border-2 border-amber-500 rounded-2xl p-4.5 text-slate-800 shadow-sm space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              <h3 className="font-extrabold text-sm text-slate-900">
                Informe IA Gemini: Predicción de Riesgo de Infraestructura
              </h3>
            </div>
            <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full uppercase shadow-2xs">
              Riesgo {riskReport.riskLevel || 'ALTO'}
            </span>
          </div>

          <div className="text-xs space-y-1.5 text-slate-700">
            <p><strong>Sector Crítico:</strong> {riskReport.highRiskSector}</p>
            <p><strong>Amenaza Detectada:</strong> {riskReport.predictedIncident}</p>
            <p className="text-amber-950 bg-amber-200/80 p-2.5 rounded-xl border border-amber-300 font-medium">
              <strong>Acción Recomendada para Alcaldía:</strong> {riskReport.recommendedAction}
            </p>
          </div>
        </div>
      )}

      {/* ================= VIEW 1: TRÁMITES E INCIDENCIAS ACTIVAS ================= */}
      {adminSubTab === 'activas' && (
        <>
          {/* Filters Bar for Active */}
          <div className="bg-gradient-to-r from-slate-100 via-blue-50/40 to-slate-100 p-4 rounded-2xl border-2 border-[#0A4191]/30 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-[#0A4191] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar en activas por código, título o ciudadano..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 font-bold outline-none focus:ring-2 focus:ring-[#0A4191]/40 focus:border-[#0A4191]"
                />
              </div>

              {/* Sector Filter */}
              <div className="w-full md:w-48">
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 font-bold outline-none focus:ring-2 focus:ring-[#0A4191]/40"
                >
                  <option value="todos">Todos los Sectores</option>
                  <option value="Logroño Centro (Cabecera)">Logroño Centro</option>
                  <option value="Parroquia Yaupi">Parroquia Yaupi</option>
                  <option value="Parroquia Shimpis">Parroquia Shimpis</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="w-full md:w-40">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 font-bold outline-none focus:ring-2 focus:ring-[#0A4191]/40"
                >
                  <option value="todos">Todas Prioridades</option>
                  <option value="critica">Crítica</option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-40">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 font-bold outline-none focus:ring-2 focus:ring-[#0A4191]/40"
                >
                  <option value="todos">Todos los Estados Activos</option>
                  <option value="reportado">Reportado</option>
                  <option value="asignado">Asignado</option>
                  <option value="en_proceso">En Proceso</option>
                </select>
              </div>
            </div>
          </div>

          {/* Real-Time Selected Map & GPS Route Navigation Panel */}
          {selectedMapIncident && (
            <div id="gad-realtime-map-section" className="bg-gradient-to-b from-white via-slate-50 to-blue-50/30 rounded-2xl border-2 border-[#0A4191] shadow-md p-4 space-y-3 text-slate-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-[#0A4191]/20 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A4191] to-[#0C51B6] text-white flex items-center justify-center shadow-xs shrink-0">
                    <Navigation className="w-5 h-5 text-amber-300 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-[#0A4191] text-white font-black text-[10px] px-2.5 py-0.5 rounded-md uppercase font-mono shadow-2xs">
                        {selectedMapIncident.code}
                      </span>
                      <span className="text-[11px] font-extrabold text-[#0A4191] flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-[#0A4191] animate-ping inline-block" />
                        <span>Navegador GPS en Tiempo Real</span>
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
                      Ubicación Marcada por Usuario: <span className="text-[#0A4191] font-black">{selectedMapIncident.title}</span>
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-slate-100 text-slate-800 text-xs font-mono font-bold px-3 py-1 rounded-lg border border-slate-300 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0A4191] shrink-0" />
                    <span>GPS: {selectedMapIncident.location.lat ? selectedMapIncident.location.lat.toFixed(5) : '-2.62800'}, {selectedMapIncident.location.lng ? selectedMapIncident.location.lng.toFixed(5) : '-78.17600'}</span>
                  </span>
                  <span className="bg-blue-100 text-[#0A4191] text-xs font-bold px-3 py-1 rounded-lg border border-blue-200">
                    Sector: {selectedMapIncident.location.sector}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenInspector(selectedMapIncident)}
                    className="bg-gradient-to-r from-[#0A4191] to-[#0C51B6] hover:from-[#083373] hover:to-[#0A4191] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer"
                  >
                    Atender Trámite
                  </button>
                </div>
              </div>

              {/* Interactive Map Component with GPS Route & Voice */}
              <div className="rounded-xl overflow-hidden border-2 border-[#0A4191]/60 shadow-inner">
                <LogronoGoogleMap
                  incidents={incidents}
                  selectedLat={selectedMapIncident.location.lat}
                  selectedLng={selectedMapIncident.location.lng}
                  selectableLocation={false}
                  showRoutePanel={true}
                  onSelectIncident={(inc) => setSelectedMapIncident(inc)}
                  className="h-[380px] w-full"
                />
              </div>
            </div>
          )}

          {/* ================= CONTENEDOR DE LISTADO DE TRÁMITES ACTIVOS PENDIENTES ================= */}
          <div className="bg-gradient-to-b from-white via-slate-50/50 to-blue-50/30 rounded-2xl border-2 border-[#0A4191] shadow-lg overflow-hidden text-[#0A4191]">
            
            {/* Header del Contenedor con Gradiente Combinado Azul Municipal */}
            <div className="p-4.5 bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] border-b-2 border-[#0A4191] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-white">
              <div className="space-y-0.5">
                <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 text-amber-300">
                    <Activity className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span>Listado de Trámites Activos Pendientes ({filteredActiveIncidents.length})</span>
                </h3>
                <p className="text-xs text-blue-100 font-medium pl-9">
                  Gestión priorizada en tiempo real. Al marcar como "Resuelto", el trámite se transfiere automáticamente al Registro Archivista.
                </p>
              </div>
              <span className="text-xs text-white font-mono font-black bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/30 shadow-xs shrink-0">
                {filteredActiveIncidents.length} de {activeIncidentsList.length} activas
              </span>
            </div>

            <div className="overflow-x-auto bg-white/80">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100 text-[#0A4191] font-black border-b-2 border-[#0A4191]/30 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Código / Fecha</th>
                    <th className="py-3.5 px-4">Incidencia / Sector</th>
                    <th className="py-3.5 px-4">Ubicación Exacta Mapa</th>
                    <th className="py-3.5 px-4">Categoría</th>
                    <th className="py-3.5 px-4">Prioridad IA</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4">Departamento</th>
                    <th className="py-3.5 px-4 text-right">Gestión / Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-200/70 text-slate-800">
                  {filteredActiveIncidents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-[#0A4191] space-y-2 bg-slate-50/50">
                        <CheckCircle2 className="w-10 h-10 text-[#0A4191] mx-auto animate-bounce" />
                        <p className="font-extrabold text-sm text-[#0A4191]">
                          ¡No hay trámites pendientes en esta lista!
                        </p>
                        <p className="text-xs text-slate-600 max-w-sm mx-auto">
                          Todos los trámites resueltos han sido trasladados automáticamente al <button onClick={() => setAdminSubTab('atendidas')} className="text-[#0A4191] font-bold underline cursor-pointer">Panel de Incidencias Atendidas y Archivadas</button>.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredActiveIncidents.map((inc) => (
                      <tr 
                        key={inc.id} 
                        className={`transition-all duration-150 ${
                          selectedMapIncident?.id === inc.id 
                            ? 'bg-blue-100/90 font-semibold border-l-4 border-l-[#0A4191]' 
                            : 'even:bg-slate-50/60 odd:bg-white hover:bg-amber-50/60'
                        }`}
                      >
                        {/* Código / Fecha */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-black text-white bg-[#0A4191] px-2.5 py-1 rounded-lg text-[11px] shadow-2xs inline-block">
                            {inc.code}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold block mt-1">
                            {new Date(inc.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        {/* Incidencia / Sector */}
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold block text-[#0A4191] text-xs line-clamp-1">
                            {inc.title}
                          </span>
                          <span className="text-[11px] text-slate-600 font-medium flex items-center space-x-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#0A4191] shrink-0" />
                            <span>{inc.location.sector}</span>
                          </span>
                        </td>

                        {/* Ubicación GPS Mapa */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center space-x-1 w-fit">
                              <Navigation className="w-3 h-3 text-[#0A4191] shrink-0" />
                              <span>{inc.location.lat ? inc.location.lat.toFixed(4) : '-2.6280'}, {inc.location.lng ? inc.location.lng.toFixed(4) : '-78.1760'}</span>
                            </span>
                            <span className="text-[10px] text-slate-500 max-w-[150px] truncate" title={inc.location.address || inc.location.sector}>
                              {inc.location.address || inc.location.sector}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedMapIncident(inc);
                                const el = document.getElementById('gad-realtime-map-section');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="bg-gradient-to-r from-[#0A4191] to-[#0d52b8] hover:from-[#083373] hover:to-[#0A4191] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center space-x-1 w-fit active:scale-95"
                            >
                              <Route className="w-3 h-3 text-amber-300" />
                              <span>{selectedMapIncident?.id === inc.id ? 'Mapa Activo' : 'Ver Ruta GPS'}</span>
                            </button>
                          </div>
                        </td>

                        {/* Categoría */}
                        <td className="py-3.5 px-4">
                          <span className="bg-indigo-50 border border-indigo-200/90 text-indigo-950 px-2.5 py-1 rounded-lg font-extrabold text-[11px] shadow-2xs inline-block">
                            {inc.category}
                          </span>
                        </td>

                        {/* Prioridad IA Combinada */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {inc.priority === 'critica' && (
                            <span className="bg-gradient-to-r from-red-100 to-rose-100 text-red-900 border border-red-300 font-black px-2.5 py-1 rounded-full text-[10px] uppercase flex items-center space-x-1 w-fit shadow-2xs">
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                              <span>CRÍTICA</span>
                            </span>
                          )}
                          {inc.priority === 'alta' && (
                            <span className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 border border-amber-300 font-extrabold px-2.5 py-1 rounded-full text-[10px] uppercase flex items-center space-x-1 w-fit shadow-2xs">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>ALTA</span>
                            </span>
                          )}
                          {inc.priority === 'media' && (
                            <span className="bg-gradient-to-r from-sky-100 to-blue-100 text-blue-900 border border-blue-300 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase flex items-center space-x-1 w-fit shadow-2xs">
                              <span>MEDIA</span>
                            </span>
                          )}
                          {inc.priority === 'baja' && (
                            <span className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 border border-emerald-300 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase flex items-center space-x-1 w-fit shadow-2xs">
                              <span>BAJA</span>
                            </span>
                          )}
                        </td>

                        {/* Estado Combinado */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {inc.status === 'en_proceso' && (
                            <span className="bg-purple-100 text-purple-900 border border-purple-300 font-extrabold px-2.5 py-1 rounded-full text-[10px] uppercase shadow-2xs inline-flex items-center space-x-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping inline-block" />
                              <span>EN PROCESO</span>
                            </span>
                          )}
                          {inc.status === 'asignado' && (
                            <span className="bg-blue-100 text-blue-900 border border-blue-300 font-extrabold px-2.5 py-1 rounded-full text-[10px] uppercase shadow-2xs inline-flex items-center space-x-1">
                              <span>ASIGNADO</span>
                            </span>
                          )}
                          {inc.status === 'reportado' && (
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2.5 py-1 rounded-full text-[10px] uppercase shadow-2xs inline-flex items-center space-x-1">
                              <span>REPORTADO</span>
                            </span>
                          )}
                        </td>

                        {/* Departamento */}
                        <td className="py-3.5 px-4 font-bold text-[11px] text-slate-700">
                          <span className="bg-slate-100/90 border border-slate-200/90 text-slate-800 px-2.5 py-1 rounded-lg inline-block">
                            {inc.assignedDepartment || 'Por Asignar'}
                          </span>
                        </td>

                        {/* Botones de Acción Profesionales dentro del Listado */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleOpenInspector(inc)}
                              className="bg-gradient-to-r from-[#0A4191] to-[#0C51B6] hover:from-[#083373] hover:to-[#0A4191] text-white border border-[#0A4191] text-[11px] font-extrabold px-3.5 py-1.5 rounded-xl shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer flex items-center space-x-1 active:scale-95"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                              <span>Atender</span>
                            </button>
                            <button
                              onClick={() => handleQuickResolve(inc)}
                              title="Resolver y Archivar automáticamente"
                              className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white border border-emerald-700 text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer flex items-center space-x-1.5 active:scale-95"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                              <span>Resolver & Archivar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ================= VIEW 2: PANEL DE INCIDENCIAS ATENDIDAS Y ARCHIVADAS ================= */}
      {adminSubTab === 'atendidas' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header Banner for Archived Panel */}
          <div className="bg-white p-5 rounded-2xl text-[#0A4191] shadow-xs border-2 border-[#0A4191] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-white border-2 border-[#0A4191] flex items-center justify-center text-[#0A4191]">
                  <Archive className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-extrabold tracking-wide text-[#0A4191] font-serif">
                  Panel y Registro Oficial de Incidencias Atendidas y Archivadas
                </h3>
              </div>
              <p className="text-xs text-[#0A4191] font-medium max-w-2xl">
                Repositorio oficial del GAD Municipal de Logroño para la fiscalización, trazabilidad técnica y certificación de obras e intervenciones resueltas en el cantón.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => handleExportData('excel')}
                className="bg-white hover:bg-blue-50 text-[#0A4191] font-bold text-xs px-3 py-2 rounded-xl border-2 border-[#0A4191] shadow-xs transition-all cursor-pointer flex items-center space-x-1"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#0A4191]" />
                <span>Exportar Archivo</span>
              </button>
              <button
                onClick={() => handleExportData('pdf')}
                className="bg-white hover:bg-blue-50 text-[#0A4191] font-bold text-xs px-3 py-2 rounded-xl border-2 border-[#0A4191] shadow-xs transition-all cursor-pointer flex items-center space-x-1"
              >
                <Printer className="w-4 h-4 text-[#0A4191]" />
                <span>Informe Histórico PDF</span>
              </button>
            </div>
          </div>

          {/* Search & Filters for Archived Panel */}
          <div className="bg-gradient-to-r from-slate-100 via-emerald-50/30 to-slate-100 p-4 rounded-2xl border-2 border-[#0A4191]/30 shadow-xs space-y-3 text-slate-800">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-[#0A4191] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar en incidencias archivadas por código, título o ciudadano..."
                  value={archivedSearchTerm}
                  onChange={(e) => setArchivedSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 font-bold outline-none focus:ring-2 focus:ring-[#0A4191]/40 focus:border-[#0A4191]"
                />
              </div>

              <div className="w-full md:w-56">
                <select
                  value={archivedSectorFilter}
                  onChange={(e) => setArchivedSectorFilter(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 font-bold outline-none focus:ring-2 focus:ring-[#0A4191]/40"
                >
                  <option value="todos">Todos los Sectores Archivados</option>
                  <option value="Logroño Centro (Cabecera)">Logroño Centro</option>
                  <option value="Parroquia Yaupi">Parroquia Yaupi</option>
                  <option value="Parroquia Shimpis">Parroquia Shimpis</option>
                  <option value="Comunidad Shuar Kimius">Comunidad Kimius</option>
                </select>
              </div>
            </div>
          </div>

          {/* Real-Time Selected Archived Map Section */}
          {selectedMapIncident && (
            <div id="gad-archived-map-section" className="bg-gradient-to-b from-white via-slate-50 to-emerald-50/20 rounded-2xl border-2 border-[#0A4191] shadow-md p-4 space-y-3 text-slate-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-[#0A4191]/20 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs shrink-0">
                    <FileCheck className="w-5 h-5 text-emerald-200 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-slate-800 text-white font-black text-[10px] px-2.5 py-0.5 rounded-md uppercase font-mono shadow-2xs">
                        {selectedMapIncident.code}
                      </span>
                      <span className="text-[11px] font-extrabold text-emerald-800 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Trámite Resuelto y Verificado en Terreno</span>
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
                      Ubicación de Solución: <span className="text-[#0A4191] font-black">{selectedMapIncident.title}</span>
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedCertIncident(selectedMapIncident)}
                    className="bg-gradient-to-r from-[#0A4191] to-[#0C51B6] hover:from-[#083373] hover:to-[#0A4191] text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>Ver Certificado de Cierre</span>
                  </button>
                </div>
              </div>

              {/* Map displaying archived resolution point */}
              <div className="rounded-xl overflow-hidden border-2 border-[#0A4191]/60 shadow-inner">
                <LogronoGoogleMap
                  incidents={resolvedIncidentsList}
                  selectedLat={selectedMapIncident.location.lat}
                  selectedLng={selectedMapIncident.location.lng}
                  selectableLocation={false}
                  showRoutePanel={true}
                  onSelectIncident={(inc) => setSelectedMapIncident(inc)}
                  className="h-[340px] w-full"
                />
              </div>
            </div>
          )}

          {/* Archived Incidents Table */}
          <div className="bg-gradient-to-b from-white via-slate-50/50 to-emerald-50/20 rounded-2xl border-2 border-[#0A4191] shadow-lg overflow-hidden text-slate-800">
            <div className="p-4.5 bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] border-b-2 border-[#0A4191] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-white">
              <div className="space-y-0.5">
                <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 text-emerald-300">
                    <Archive className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span>Histórico de Incidencias Atendidas ({filteredResolvedIncidents.length})</span>
                </h3>
                <p className="text-xs text-blue-100 font-medium pl-9">
                  Registro permanente con actas digitales de solución y auditoría técnica.
                </p>
              </div>
              <span className="text-xs text-white font-mono font-black bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/30 shadow-xs shrink-0">
                {filteredResolvedIncidents.length} resueltas
              </span>
            </div>

            <div className="overflow-x-auto bg-white/80">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-100 via-emerald-50/60 to-slate-100 text-[#0A4191] font-black border-b-2 border-[#0A4191]/30 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Código / Registro</th>
                    <th className="py-3.5 px-4">Obra / Solución Realizada</th>
                    <th className="py-3.5 px-4">Ubicación GPS</th>
                    <th className="py-3.5 px-4">Departamento / Inspector</th>
                    <th className="py-3.5 px-4">Estado Cierre</th>
                    <th className="py-3.5 px-4 text-right">Acciones de Archivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-200/70 text-slate-800">
                  {filteredResolvedIncidents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-[#0A4191] space-y-2 bg-slate-50/50">
                        <Archive className="w-10 h-10 text-[#0A4191] mx-auto opacity-70" />
                        <p className="font-extrabold text-sm text-[#0A4191]">
                          No hay incidencias archivadas actualmente
                        </p>
                        <p className="text-xs text-slate-600 max-w-sm mx-auto">
                          Al cambiar el estado de un trámite activo a "Resuelto", se archivará automáticamente en esta sección.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredResolvedIncidents.map((inc) => (
                      <tr 
                        key={inc.id} 
                        className={`transition-all duration-150 ${
                          selectedMapIncident?.id === inc.id 
                            ? 'bg-emerald-100/70 font-semibold border-l-4 border-l-emerald-600' 
                            : 'even:bg-slate-50/60 odd:bg-white hover:bg-emerald-50/50'
                        }`}
                      >
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-black text-white bg-slate-800 px-2.5 py-1 rounded-lg text-[11px] shadow-2xs inline-block">
                            {inc.code}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold block mt-1">
                            Resuelto: {new Date(inc.updatedAt || inc.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-extrabold block text-[#0A4191] text-xs line-clamp-1">
                            {inc.title}
                          </span>
                          <span className="text-[11px] text-slate-600 block truncate max-w-[200px]">
                            Ciudadano: {inc.citizenName} ({inc.citizenCedula || 'Sin CI'})
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className="font-mono text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5 text-[#0A4191] shrink-0" />
                              <span>{inc.location.sector}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedMapIncident(inc);
                                const el = document.getElementById('gad-archived-map-section');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="text-[10px] font-extrabold text-[#0A4191] hover:underline flex items-center space-x-1 cursor-pointer"
                            >
                              <Route className="w-3 h-3 text-[#0A4191]" />
                              <span>Ver Mapa Resuelto</span>
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-[11px]">
                          <span className="font-extrabold block text-[#0A4191]">{inc.assignedDepartment || 'Obras Públicas'}</span>
                          <span className="text-[10px] text-slate-500">{inc.assignedOperator || 'Ing. Técnico Cuadrilla'}</span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center space-x-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>RESUELTO & ARCHIVADO</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setSelectedCertIncident(inc)}
                              className="bg-gradient-to-r from-[#0A4191] to-[#0C51B6] hover:from-[#083373] hover:to-[#0A4191] text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center space-x-1 active:scale-95"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-amber-300" />
                              <span>Certificado</span>
                            </button>

                            <button
                              onClick={() => handleReopenIncident(inc)}
                              title="Reabrir trámite si persiste la incidencia"
                              className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-[11px] font-extrabold px-2.5 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1 active:scale-95"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                              <span>Reabrir</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Inspector & Workflow Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-b from-white via-slate-50 to-blue-50/20 rounded-3xl max-w-2xl w-full p-6 border-2 border-[#0A4191] shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-xs text-slate-800">
            
            {/* Header */}
            <div className="flex justify-between items-start bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] p-4.5 -mx-6 -mt-6 rounded-t-3xl border-b-2 border-[#0A4191] text-white">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-black text-white bg-white/20 px-2.5 py-0.5 rounded-md border border-white/30 shadow-2xs">
                  {selectedIncident.code}
                </span>
                <h3 className="text-lg font-black text-white">
                  {selectedIncident.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-white hover:bg-white/20 font-black text-base w-8 h-8 rounded-full border border-white/30 flex items-center justify-center cursor-pointer transition-all"
              >
                ✕
              </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Left Column: Citizen Data & Evidence */}
              <div className="space-y-3">
                {selectedIncident.photoUrl && (
                  <img src={selectedIncident.photoUrl} alt="" className="w-full h-44 rounded-2xl object-cover border-2 border-[#0A4191]/60 shadow-sm" />
                )}

                <div className="bg-white p-3.5 rounded-2xl border border-slate-300 shadow-2xs space-y-1.5 text-slate-800">
                  <h4 className="font-black text-[#0A4191] uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1">
                    Datos del Ciudadano Solicitante
                  </h4>
                  <p><strong>Nombre:</strong> {selectedIncident.citizenName}</p>
                  <p><strong>Cédula:</strong> {selectedIncident.citizenCedula}</p>
                  <p><strong>Teléfono:</strong> {selectedIncident.citizenPhone}</p>
                  <p><strong>Sector:</strong> {selectedIncident.location.sector}</p>
                  <p><strong>Dirección:</strong> {selectedIncident.location.address}</p>
                </div>

                {selectedIncident.aiAnalysis && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 p-3.5 rounded-2xl border border-blue-200 space-y-1 text-slate-800 shadow-2xs">
                    <span className="font-extrabold text-[#0A4191] block text-[10px] uppercase">
                      Diagnóstico IA Gemini 3.6 Flash
                    </span>
                    <p className="italic text-slate-700">
                      "{selectedIncident.aiAnalysis.recommendation}"
                    </p>
                    <span className="block text-[10px] text-[#0A4191] font-bold mt-1">
                      Urgencia Estimada: {selectedIncident.aiAnalysis.estimatedHours} horas de reparación
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column: Workflow Control */}
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-300 shadow-2xs">
                <h4 className="font-black text-[#0A4191] uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1">
                  Gestión Municipal & Asignación
                </h4>

                {/* Target Status Selector */}
                <div>
                  <label className="block font-extrabold mb-1 text-slate-800">Actualizar Estado</label>
                  <select
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value as IncidentStatus)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-800 focus:ring-2 focus:ring-[#0A4191]/30 focus:bg-white outline-none"
                  >
                    <option value="reportado">Reportado (Fase Inicial)</option>
                    <option value="en_revision">En Revisión Mesa Control</option>
                    <option value="asignado">Asignado a Cuadrilla</option>
                    <option value="en_proceso">En Proceso Terreno</option>
                    <option value="resuelto">Resuelto / Atendido</option>
                    <option value="rechazado">Rechazado (No Competencia GAD)</option>
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="block font-extrabold mb-1 text-slate-800">Departamento Responsable</label>
                  <select
                    value={assignedDepartment}
                    onChange={(e) => setAssignedDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-800 focus:ring-2 focus:ring-[#0A4191]/30 focus:bg-white outline-none"
                  >
                    <option value="Dirección de Obras Públicas Municipales">Dirección de Obras Públicas</option>
                    <option value="Unidad de Agua Potable y Saneamiento">Unidad de Agua Potable</option>
                    <option value="Servicios Municipales y Electricidad">Servicios Municipales</option>
                    <option value="Dirección de Gestión Ambiental y Parques">Gestión Ambiental</option>
                    <option value="Unidad de Gestión de Riesgos GAD">Gestión de Riesgos</option>
                  </select>
                </div>

                {/* Operator Name */}
                <div>
                  <label className="block font-extrabold mb-1 text-slate-800">Técnico / Jefe de Cuadrilla</label>
                  <input
                    type="text"
                    value={assignedOperator}
                    onChange={(e) => setAssignedOperator(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 font-bold focus:ring-2 focus:ring-[#0A4191]/30 focus:bg-white outline-none"
                  />
                </div>

                {/* Note to Citizen */}
                <div>
                  <label className="block font-extrabold mb-1 text-slate-800">Respuesta Oficial para el Ciudadano</label>
                  <textarea
                    rows={3}
                    placeholder="Escriba la nota que se notificará al usuario en su app..."
                    value={gadNote}
                    onChange={(e) => setGadNote(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 font-medium focus:ring-2 focus:ring-[#0A4191]/30 focus:bg-white outline-none"
                  />
                </div>

                {/* Save Changes Button: Botón Profesional con Gradiente Azul */}
                <button
                  onClick={handleSaveInspector}
                  className="w-full py-3 bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] hover:from-[#083373] hover:to-[#0A4191] text-white font-black rounded-xl shadow-md transition-all cursor-pointer text-xs uppercase tracking-wide active:scale-95 flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Guardar y Notificar al Ciudadano</span>
                </button>
              </div>
            </div>

            {/* Real-time Technical Chat Channel with Citizen */}
            <div className="pt-3 border-t-2 border-[#0A4191]/20">
              <h4 className="font-black text-[#0A4191] uppercase tracking-wider text-xs mb-2">
                Canal de Chat en Tiempo Real con el Ciudadano
              </h4>
              <ReportIncidentChat
                incident={selectedIncident}
                currentUser={{
                  id: 'admin-1',
                  name: assignedOperator || 'Técnico GAD Logroño',
                  email: 'tecnico@logrono.gob.ec',
                  role: 'tecnico',
                  provider: 'password'
                }}
              />
            </div>

          </div>
        </div>
      )}

      {/* Official Municipal Solution Certificate / Acta Modal */}
      {selectedCertIncident && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-b from-white via-slate-50 to-blue-50/20 rounded-3xl max-w-2xl w-full p-6 border-2 border-[#0A4191] shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto text-xs text-slate-800">
            
            {/* Certificate Header Banner */}
            <div className="bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] p-4.5 -mx-6 -mt-6 rounded-t-3xl border-b-2 border-[#0A4191] text-white flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-amber-300 flex items-center justify-center font-black text-sm shadow-xs">
                  GAD
                </div>
                <div>
                  <h2 className="text-sm font-black text-white font-serif uppercase tracking-wider">
                    Gobierno Autónomo Descentralizado Municipal
                  </h2>
                  <h3 className="text-xs font-bold text-blue-100">
                    Cantón Logroño - Provincia de Morona Santiago
                  </h3>
                  <p className="text-[10px] text-amber-300 font-mono font-bold mt-0.5">
                    ACTA TÉCNICA DE RESOLUCIÓN Y REGISTRO HISTÓRICO DE OBRA N° {selectedCertIncident.code}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCertIncident(null)}
                className="text-white hover:bg-white/20 font-black text-base w-8 h-8 rounded-full border border-white/30 flex items-center justify-center cursor-pointer transition-all"
              >
                ✕
              </button>
            </div>

            {/* Certificate Body */}
            <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-300 shadow-2xs pt-3">
              <div className="flex justify-between items-center bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-3 rounded-xl border border-emerald-300">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-emerald-700" />
                  <span className="font-extrabold text-xs text-emerald-950">
                    CERTIFICACIÓN DE OBRA CONCLUIDA
                  </span>
                </div>
                <span className="bg-emerald-600 text-white font-mono font-black text-[10px] px-2.5 py-1 rounded-md shadow-2xs">
                  ESTADO: ATENDIDO Y ARCHIVADO
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-[11px] text-slate-800">
                <div>
                  <p className="text-slate-500 font-bold">Trámite / Incidencia:</p>
                  <p className="font-extrabold text-[#0A4191]">{selectedCertIncident.title}</p>
                </div>

                <div>
                  <p className="text-slate-500 font-bold">Categoría Municipal:</p>
                  <p className="font-extrabold text-slate-800">{selectedCertIncident.category}</p>
                </div>

                <div>
                  <p className="text-slate-500 font-bold">Ciudadano Solicitante:</p>
                  <p className="font-extrabold text-slate-800">{selectedCertIncident.citizenName} (C.I: {selectedCertIncident.citizenCedula || 'S/N'})</p>
                </div>

                <div>
                  <p className="text-slate-500 font-bold">Ubicación / Sector:</p>
                  <p className="font-extrabold text-slate-800">{selectedCertIncident.location.sector}</p>
                </div>

                <div>
                  <p className="text-slate-500 font-bold">Coordenadas GPS de Terreno:</p>
                  <p className="font-mono font-extrabold text-[#0A4191]">
                    {selectedCertIncident.location.lat ? selectedCertIncident.location.lat.toFixed(5) : '-2.62800'}, {selectedCertIncident.location.lng ? selectedCertIncident.location.lng.toFixed(5) : '-78.17600'}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 font-bold">Fecha de Registro / Cierre:</p>
                  <p className="font-extrabold text-slate-800">
                    {new Date(selectedCertIncident.createdAt).toLocaleDateString()} - {new Date(selectedCertIncident.updatedAt || selectedCertIncident.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-1">
                <p className="text-slate-500 font-bold">Departamento e Inspector Responsables:</p>
                <p className="font-extrabold text-[#0A4191]">
                  {selectedCertIncident.assignedDepartment || 'Dirección de Obras Públicas'} - {selectedCertIncident.assignedOperator || 'Ing. Supervisor de Campo'}
                </p>
                <p className="text-slate-800 italic bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2">
                  "{selectedCertIncident.gadNote || 'Intervención de mantenimiento municipal ejecutada satisfactoriamente con la cuadrilla asignada y verificación técnica posterior.'}"
                </p>
              </div>
            </div>

            {/* Certificate Footer / Actions */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500 font-mono font-bold">
                Sello Digital de Validación GAD Logroño • Morona Santiago
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="bg-gradient-to-r from-[#0A4191] to-[#0C51B6] hover:from-[#083373] hover:to-[#0A4191] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>Imprimir Certificado</span>
                </button>
                <button
                  onClick={() => setSelectedCertIncident(null)}
                  className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer active:scale-95"
                >
                  Cerrar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
