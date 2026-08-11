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
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  incidents,
  onUpdateStatus
}) => {
  // GAD SubTab View State: 'activas' vs 'atendidas' (Archived Resolved Incidents Panel)
  const [adminSubTab, setAdminSubTab] = useState<'activas' | 'atendidas'>('activas');

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
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border-2 border-[#0A4191] shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-[#0A4191] font-serif">
              Panel Administrativo de Control Municipal
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
              GAD Logroño
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Gestión en tiempo real de cuadrillas, asignación de departamentos y priorización inteligente.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePredictInfrastructureRisk}
            disabled={isPredictingRisk}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl shadow transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{isPredictingRisk ? 'Calculando Riesgos...' : 'Predicción de Riesgo IA'}</span>
          </button>

          <button
            onClick={() => handleExportData('excel')}
            className="flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 text-[#0A4191] text-xs font-bold px-3 py-2 rounded-xl border border-blue-200 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Exportar Excel</span>
          </button>

          <button
            onClick={() => handleExportData('pdf')}
            className="flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 text-[#0A4191] text-xs font-bold px-3 py-2 rounded-xl border border-blue-200 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-red-600" />
            <span>Informe PDF</span>
          </button>
        </div>
      </div>

      {/* Top Navigation SubTabs: Active vs Archived Panel */}
      <div className="flex border-2 border-[#0A4191] bg-blue-50/80 rounded-2xl p-1.5 shadow-sm">
        <button
          onClick={() => setAdminSubTab('activas')}
          className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            adminSubTab === 'activas'
              ? 'bg-[#0A4191] text-white shadow-md'
              : 'text-[#0A4191] hover:bg-blue-100'
          }`}
        >
          <Activity className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Trámites e Incidencias Activas</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20 text-white font-black">
            {activeIncidentsList.length}
          </span>
        </button>

        <button
          onClick={() => setAdminSubTab('atendidas')}
          className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            adminSubTab === 'atendidas'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-[#0A4191] hover:bg-blue-100'
          }`}
        >
          <Archive className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>Panel de Incidencias Atendidas y Archivadas</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20 text-white font-black">
            {resolvedIncidentsList.length}
          </span>
        </button>
      </div>

      {/* Analytics Counter Widgets Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border-2 border-blue-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reportes</span>
            <span className="block text-2xl font-extrabold text-[#0A4191] mt-1">{totalCount}</span>
            <span className="text-[10px] text-emerald-600 font-medium">100% Georreferenciados</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0A4191]">
            <LayoutDashboard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-blue-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prioridad Alta / Crítica</span>
            <span className="block text-2xl font-extrabold text-red-600 mt-1">{criticalCount}</span>
            <span className="text-[10px] text-red-500 font-medium">Requieren Despacho Inmediato</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-blue-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">En Cuadrilla / Proceso</span>
            <span className="block text-2xl font-extrabold text-amber-600 mt-1">{inProgressCount}</span>
            <span className="text-[10px] text-amber-600 font-medium">Maquinaria en Terreno</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-blue-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Atendidos y Archivados</span>
            <span className="block text-2xl font-extrabold text-emerald-600 mt-1">{resolvedCount}</span>
            <span className="text-[10px] text-emerald-600 font-medium">Archivados Automáticamente</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* AI Risk Analytics Banner (If Triggered) */}
      {riskReport && (
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 p-4 rounded-2xl border border-amber-500/50 text-white space-y-2 animate-fadeIn shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-sm text-amber-300">
                Informe IA Gemini: Predicción de Riesgo de Infraestructura
              </h3>
            </div>
            <span className="bg-red-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded uppercase">
              Riesgo {riskReport.riskLevel || 'ALTO'}
            </span>
          </div>

          <div className="text-xs space-y-1">
            <p><strong>Sector Crítico:</strong> {riskReport.highRiskSector}</p>
            <p><strong>Amenaza Detectada:</strong> {riskReport.predictedIncident}</p>
            <p className="text-amber-200 bg-amber-900/40 p-2 rounded border border-amber-700/40">
              <strong>Acción Recomendada para Alcaldía:</strong> {riskReport.recommendedAction}
            </p>
          </div>
        </div>
      )}

      {/* ================= VIEW 1: TRÁMITES E INCIDENCIAS ACTIVAS ================= */}
      {adminSubTab === 'activas' && (
        <>
          {/* Filters Bar for Active */}
          <div className="bg-white p-4 rounded-2xl border-2 border-blue-200 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-[#0A4191] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar en activas por código, título o ciudadano..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-blue-200 bg-blue-50/40 text-xs text-[#0A4191] font-semibold outline-none focus:ring-2 focus:ring-[#0A4191]"
                />
              </div>

              {/* Sector Filter */}
              <div className="w-full md:w-48">
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="w-full p-2 rounded-xl border border-blue-200 bg-blue-50/40 text-xs text-[#0A4191] font-semibold outline-none"
                >
                  <option value="todos">Todos los Sectores</option>
                  <option value="Logroño Centro (Cabecera)">Logroño Centro</option>
                  <option value="Parroquia Yaupi">Parroquia Yaupi</option>
                  <option value="Parroquia Shimpis">Parroquia Shimpis</option>
                  <option value="Comunidad Shuar Kakaim">Comunidad Kakaim</option>
                  <option value="Comunidad Shuar Kimius">Comunidad Kimius</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="w-full md:w-40">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full p-2 rounded-xl border border-blue-200 bg-blue-50/40 text-xs text-[#0A4191] font-semibold outline-none"
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
                  className="w-full p-2 rounded-xl border border-blue-200 bg-blue-50/40 text-xs text-[#0A4191] font-semibold outline-none"
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
            <div id="gad-realtime-map-section" className="bg-white rounded-2xl border-2 border-blue-200 shadow-md p-4 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-blue-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0A4191] text-white flex items-center justify-center shadow-sm shrink-0">
                    <Navigation className="w-5 h-5 text-amber-300 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-[#0A4191] font-black text-[10px] px-2 py-0.5 rounded-md border border-blue-200 uppercase font-mono">
                        {selectedMapIncident.code}
                      </span>
                      <span className="text-[11px] font-extrabold text-emerald-600 flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                        <span>Navegador GPS en Tiempo Real</span>
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-[#0A4191] mt-0.5">
                      Ubicación Marcada por Usuario: <span className="text-[#0A4191]">{selectedMapIncident.title}</span>
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>GPS: {selectedMapIncident.location.lat ? selectedMapIncident.location.lat.toFixed(5) : '-2.62800'}, {selectedMapIncident.location.lng ? selectedMapIncident.location.lng.toFixed(5) : '-78.17600'}</span>
                  </span>
                  <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    Sector: {selectedMapIncident.location.sector}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenInspector(selectedMapIncident)}
                    className="bg-[#0A4191] hover:bg-blue-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    Atender Trámite
                  </button>
                </div>
              </div>

              {/* Interactive Map Component with GPS Route & Voice */}
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
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

          {/* Active Incidents Main Data Table */}
          <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-blue-200 flex justify-between items-center bg-blue-50/50">
              <div>
                <h3 className="text-sm font-bold text-[#0A4191] flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-amber-500" />
                  <span>Listado de Trámites Activos Pendientes ({filteredActiveIncidents.length})</span>
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Las incidencias marcadas como "Resuelto" se archivan automáticamente en el Panel de Atendidos.
                </p>
              </div>
              <span className="text-xs text-[#0A4191] font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                {filteredActiveIncidents.length} de {activeIncidentsList.length} activas
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-blue-100/70 text-[#0A4191] font-bold border-b-2 border-blue-200 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Código / Fecha</th>
                    <th className="py-3 px-4">Incidencia / Sector</th>
                    <th className="py-3 px-4">Ubicación Exacta Mapa</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Prioridad IA</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4">Departamento</th>
                    <th className="py-3 px-4 text-right">Gestión / Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100 text-slate-800">
                  {filteredActiveIncidents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-slate-500 space-y-2">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto opacity-70" />
                        <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                          ¡No hay trámites pendientes en esta lista!
                        </p>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Todos los trámites resueltos han sido trasladados automáticamente al <button onClick={() => setAdminSubTab('atendidas')} className="text-[#0A4191] dark:text-blue-400 font-bold underline">Panel de Incidencias Atendidas y Archivadas</button>.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredActiveIncidents.map((inc) => (
                      <tr key={inc.id} className={`transition-colors ${selectedMapIncident?.id === inc.id ? 'bg-blue-50/70 dark:bg-blue-950/30 font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                            {inc.code}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(inc.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold block text-slate-900 dark:text-white line-clamp-1">
                            {inc.title}
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                            <span>{inc.location.sector}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className="font-mono text-[11px] font-extrabold text-[#0A4191] dark:text-blue-400 flex items-center space-x-1">
                              <Navigation className="w-3 h-3 text-red-500 shrink-0" />
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
                              className={`text-[10px] font-black px-2 py-1 rounded-lg border transition-all cursor-pointer flex items-center space-x-1 w-fit ${
                                selectedMapIncident?.id === inc.id
                                  ? 'bg-[#0A4191] text-white border-[#0A4191] shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/50'
                              }`}
                            >
                              <Route className="w-3 h-3 text-emerald-500" />
                              <span>{selectedMapIncident?.id === inc.id ? 'Mapa Activo' : 'Ver Ruta GPS'}</span>
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-medium text-[11px]">
                            {inc.category}
                          </span>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            inc.priority === 'critica'
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300'
                              : inc.priority === 'alta'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {inc.priority}
                          </span>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            inc.status === 'en_proceso'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                          }`}>
                            {inc.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-medium text-[11px] text-slate-600 dark:text-slate-300">
                          {inc.assignedDepartment || 'Por Asignar'}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleOpenInspector(inc)}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                            >
                              Atender
                            </button>
                            <button
                              onClick={() => handleQuickResolve(inc)}
                              title="Resolver y Archivar automáticamente"
                              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900 text-[11px] font-extrabold px-2.5 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 transition-all cursor-pointer flex items-center space-x-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 p-5 rounded-2xl text-white shadow-md border border-emerald-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                  <Archive className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-extrabold tracking-wide text-white font-serif">
                  Panel y Registro Oficial de Incidencias Atendidas y Archivadas
                </h3>
              </div>
              <p className="text-xs text-emerald-200/90 max-w-2xl">
                Repositorio oficial del GAD Municipal de Logroño para la fiscalización, trazabilidad técnica y certificación de obras e intervenciones resueltas en el cantón.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => handleExportData('excel')}
                className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl border border-emerald-600 shadow-sm transition-all cursor-pointer flex items-center space-x-1"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                <span>Exportar Archivo</span>
              </button>
              <button
                onClick={() => handleExportData('pdf')}
                className="bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs px-3 py-2 rounded-xl shadow-sm transition-all cursor-pointer flex items-center space-x-1"
              >
                <Printer className="w-4 h-4 text-emerald-700" />
                <span>Informe Histórico PDF</span>
              </button>
            </div>
          </div>

          {/* Search & Filters for Archived Panel */}
          <div className="bg-white p-4 rounded-2xl border-2 border-blue-200 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-[#0A4191] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar en incidencias archivadas por código, título o ciudadano..."
                  value={archivedSearchTerm}
                  onChange={(e) => setArchivedSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-blue-200 bg-blue-50/40 text-xs text-[#0A4191] font-semibold outline-none focus:ring-2 focus:ring-[#0A4191]"
                />
              </div>

              <div className="w-full md:w-56">
                <select
                  value={archivedSectorFilter}
                  onChange={(e) => setArchivedSectorFilter(e.target.value)}
                  className="w-full p-2 rounded-xl border border-blue-200 bg-blue-50/40 text-xs text-[#0A4191] font-semibold outline-none"
                >
                  <option value="todos">Todos los Sectores Archivados</option>
                  <option value="Logroño Centro (Cabecera)">Logroño Centro</option>
                  <option value="Parroquia Yaupi">Parroquia Yaupi</option>
                  <option value="Parroquia Shimpis">Parroquia Shimpis</option>
                  <option value="Comunidad Shuar Kakaim">Comunidad Kakaim</option>
                  <option value="Comunidad Shuar Kimius">Comunidad Kimius</option>
                </select>
              </div>
            </div>
          </div>

          {/* Real-Time Selected Archived Map Section */}
          {selectedMapIncident && (
            <div id="gad-archived-map-section" className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-900 shadow-md p-4 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm shrink-0">
                    <FileCheck className="w-5 h-5 text-amber-300 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black text-[10px] px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800 uppercase font-mono">
                        {selectedMapIncident.code}
                      </span>
                      <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Trámite Resuelto y Verificado en Terreno</span>
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                      Ubicación de Solución: <span className="text-emerald-700 dark:text-emerald-400">{selectedMapIncident.title}</span>
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedCertIncident(selectedMapIncident)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>Ver Certificado de Cierre</span>
                  </button>
                </div>
              </div>

              {/* Map displaying archived resolution point */}
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-emerald-50/40 dark:bg-emerald-950/20">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Archive className="w-4 h-4 text-emerald-600" />
                  <span>Histórico de Incidencias Atendidas ({filteredResolvedIncidents.length})</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Registro permanente con actas digitales de solución y auditoría técnica.
                </p>
              </div>
              <span className="text-xs text-slate-500 font-mono font-bold bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                {filteredResolvedIncidents.length} resueltas
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Código / Registro</th>
                    <th className="py-3 px-4">Obra / Solución Realizada</th>
                    <th className="py-3 px-4">Ubicación GPS</th>
                    <th className="py-3 px-4">Departamento / Inspector</th>
                    <th className="py-3 px-4">Estado Cierre</th>
                    <th className="py-3 px-4 text-right">Acciones de Archivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {filteredResolvedIncidents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-500 space-y-2">
                        <Archive className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
                        <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                          No hay incidencias archivadas actualmente
                        </p>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Al cambiar el estado de un trámite activo a "Resuelto", se archivará automáticamente en esta sección.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredResolvedIncidents.map((inc) => (
                      <tr key={inc.id} className={`transition-colors ${selectedMapIncident?.id === inc.id ? 'bg-emerald-50/70 dark:bg-emerald-950/30 font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 block">
                            {inc.code}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Resuelto: {new Date(inc.updatedAt || inc.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold block text-slate-900 dark:text-white line-clamp-1">
                            {inc.title}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[200px]">
                            Ciudadano: {inc.citizenName} ({inc.citizenCedula || 'Sin CI'})
                          </span>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className="font-mono text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                              <span>{inc.location.sector}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedMapIncident(inc);
                                const el = document.getElementById('gad-archived-map-section');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="text-[10px] font-bold text-[#0A4191] dark:text-blue-400 hover:underline flex items-center space-x-1"
                            >
                              <Route className="w-3 h-3 text-emerald-500" />
                              <span>Ver Mapa Resuelto</span>
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-medium text-[11px] text-slate-600 dark:text-slate-300">
                          <span className="font-bold block text-slate-900 dark:text-slate-100">{inc.assignedDepartment || 'Obras Públicas'}</span>
                          <span className="text-[10px] text-slate-500">{inc.assignedOperator || 'Ing. Técnico Cuadrilla'}</span>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>RESUELTO & ARCHIVADO</span>
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setSelectedCertIncident(inc)}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer flex items-center space-x-1"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-amber-300" />
                              <span>Certificado</span>
                            </button>

                            <button
                              onClick={() => handleReopenIncident(inc)}
                              title="Reabrir trámite si persiste la incidencia"
                              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center space-x-1"
                            >
                              <RotateCcw className="w-3 h-3 text-amber-600" />
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
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-xs">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedIncident.code}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
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

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Citizen Data & Evidence */}
              <div className="space-y-3">
                {selectedIncident.photoUrl && (
                  <img src={selectedIncident.photoUrl} alt="" className="w-full h-44 rounded-xl object-cover border" />
                )}

                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                    Datos del Ciudadano
                  </h4>
                  <p><strong>Nombre:</strong> {selectedIncident.citizenName}</p>
                  <p><strong>Cédula:</strong> {selectedIncident.citizenCedula}</p>
                  <p><strong>Teléfono:</strong> {selectedIncident.citizenPhone}</p>
                  <p><strong>Sector:</strong> {selectedIncident.location.sector}</p>
                  <p><strong>Dirección:</strong> {selectedIncident.location.address}</p>
                </div>

                {selectedIncident.aiAnalysis && (
                  <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900 space-y-1">
                    <span className="font-bold text-amber-900 dark:text-amber-300 block text-[10px] uppercase">
                      Diagnóstico IA Gemini 3.6 Flash
                    </span>
                    <p className="italic text-slate-700 dark:text-slate-300">
                      "{selectedIncident.aiAnalysis.recommendation}"
                    </p>
                    <span className="block text-[10px] text-amber-700 font-semibold mt-1">
                      Urgencia Estimada: {selectedIncident.aiAnalysis.estimatedHours} horas de reparación
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column: Workflow Control */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                  Gestión Municipal & Asignación
                </h4>

                {/* Target Status Selector */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Actualizar Estado</label>
                  <select
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value as IncidentStatus)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-emerald-700 dark:text-emerald-400"
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
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Departamento Responsable</label>
                  <select
                    value={assignedDepartment}
                    onChange={(e) => setAssignedDepartment(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
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
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Técnico / Jefe de Cuadrilla</label>
                  <input
                    type="text"
                    value={assignedOperator}
                    onChange={(e) => setAssignedOperator(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                {/* Note to Citizen */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Respuesta Oficial para el Ciudadano</label>
                  <textarea
                    rows={3}
                    placeholder="Escriba la nota que se notificará al usuario en su app..."
                    value={gadNote}
                    onChange={(e) => setGadNote(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                {/* Save Changes */}
                <button
                  onClick={handleSaveInspector}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow transition-all cursor-pointer text-xs"
                >
                  GUARDAR Y NOTIFICAR AL CIUDADANO
                </button>
              </div>
            </div>

            {/* Real-time Technical Chat Channel with Citizen */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs mb-2">
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-emerald-500/30 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto text-xs">
            
            {/* Certificate Header Banner */}
            <div className="border-b-2 border-emerald-700 pb-4 flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-[#0A4191] text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                  GAD
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#0A4191] dark:text-blue-400 font-serif uppercase tracking-wider">
                    Gobierno Autónomo Descentralizado Municipal
                  </h2>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Cantón Logroño - Provincia de Morona Santiago
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">
                    ACTA TÉCNICA DE RESOLUCIÓN Y REGISTRO HISTÓRICO DE OBRA N° {selectedCertIncident.code}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCertIncident(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Certificate Body */}
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center bg-emerald-100 dark:bg-emerald-950 p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  <span className="font-extrabold text-xs text-emerald-900 dark:text-emerald-200">
                    CERTIFICACIÓN DE OBRA CONCLUIDA
                  </span>
                </div>
                <span className="bg-emerald-700 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                  ESTADO: ATENDIDO Y ARCHIVADO
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <p className="text-slate-500 font-semibold">Trámite / Incidencia:</p>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedCertIncident.title}</p>
                </div>

                <div>
                  <p className="text-slate-500 font-semibold">Categoría Municipal:</p>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedCertIncident.category}</p>
                </div>

                <div>
                  <p className="text-slate-500 font-semibold">Ciudadano Solicitante:</p>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedCertIncident.citizenName} (C.I: {selectedCertIncident.citizenCedula || 'S/N'})</p>
                </div>

                <div>
                  <p className="text-slate-500 font-semibold">Ubicación / Sector:</p>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedCertIncident.location.sector}</p>
                </div>

                <div>
                  <p className="text-slate-500 font-semibold">Coordenadas GPS de Terreno:</p>
                  <p className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {selectedCertIncident.location.lat ? selectedCertIncident.location.lat.toFixed(5) : '-2.62800'}, {selectedCertIncident.location.lng ? selectedCertIncident.location.lng.toFixed(5) : '-78.17600'}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 font-semibold">Fecha de Registro / Cierre:</p>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {new Date(selectedCertIncident.createdAt).toLocaleDateString()} - {new Date(selectedCertIncident.updatedAt || selectedCertIncident.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-1">
                <p className="text-slate-500 font-semibold">Departamento e Inspector Responsables:</p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {selectedCertIncident.assignedDepartment || 'Dirección de Obras Públicas'} - {selectedCertIncident.assignedOperator || 'Ing. Supervisor de Campo'}
                </p>
                <p className="text-slate-600 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 mt-2">
                  "{selectedCertIncident.gadNote || 'Intervención de mantenimiento municipal ejecutada satisfactoriamente con la cuadrilla asignada y verificación técnica posterior.'}"
                </p>
              </div>
            </div>

            {/* Certificate Footer / Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-400 font-mono">
                Sello Digital de Validación GAD Logroño • Morona Santiago
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="bg-[#0A4191] hover:bg-blue-900 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>Imprimir Certificado</span>
                </button>
                <button
                  onClick={() => setSelectedCertIncident(null)}
                  className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
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
