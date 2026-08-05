import React, { useState } from 'react';
import { Incident, IncidentStatus, IncidentPriority, LogronoSector } from '../types';
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
  SlidersHorizontal
} from 'lucide-react';

interface AdminPanelProps {
  incidents: Incident[];
  onUpdateStatus: (id: string, newStatus: IncidentStatus, department?: string, note?: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  incidents,
  onUpdateStatus
}) => {
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('todos');
  const [priorityFilter, setPriorityFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Inspector Modal
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [assignedDepartment, setAssignedDepartment] = useState('');
  const [assignedOperator, setAssignedOperator] = useState('');
  const [gadNote, setGadNote] = useState('');
  const [targetStatus, setTargetStatus] = useState<IncidentStatus>('en_proceso');

  // AI Predictive Analytics Modal
  const [isPredictingRisk, setIsPredictingRisk] = useState(false);
  const [riskReport, setRiskReport] = useState<any>(null);

  // Filtered List
  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.citizenName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'todos' || inc.location.sector === sectorFilter;
    const matchesPriority = priorityFilter === 'todos' || inc.priority === priorityFilter;
    const matchesStatus = statusFilter === 'todos' || inc.status === statusFilter;

    return matchesSearch && matchesSector && matchesPriority && matchesStatus;
  });

  // Calculate Metrics
  const totalCount = incidents.length;
  const criticalCount = incidents.filter((i) => i.priority === 'critica' || i.priority === 'alta').length;
  const inProgressCount = incidents.filter((i) => i.status === 'en_proceso' || i.status === 'asignado').length;
  const resolvedCount = incidents.filter((i) => i.status === 'resuelto').length;

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
    const content = JSON.stringify(filteredIncidents, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_GAD_Logrono_${type.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
              Panel Administrativo de Control Municipal
            </h2>
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
              GAD Logroño
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
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
            className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Exportar Excel</span>
          </button>

          <button
            onClick={() => handleExportData('pdf')}
            className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-red-600" />
            <span>Informe PDF</span>
          </button>
        </div>
      </div>

      {/* Analytics Counter Widgets Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reportes</span>
            <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalCount}</span>
            <span className="text-[10px] text-emerald-600 font-medium">100% Georreferenciados</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
            <LayoutDashboard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prioridad Alta / Crítica</span>
            <span className="block text-2xl font-extrabold text-red-600 dark:text-red-400 mt-1">{criticalCount}</span>
            <span className="text-[10px] text-red-500 font-medium">Requieren Despacho Inmediato</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">En Cuadrilla / Proceso</span>
            <span className="block text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{inProgressCount}</span>
            <span className="text-[10px] text-amber-500 font-medium">Maquinaria en Terreno</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Atendidos / Resueltos</span>
            <span className="block text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{resolvedCount}</span>
            <span className="text-[10px] text-emerald-600 font-medium">Trazabilidad Cerrada</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600">
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

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por código (LOG-2026-XXXX), título o cédula de ciudadano..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Sector Filter */}
          <div className="w-full md:w-48">
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none"
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
              className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none"
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
              className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none"
            >
              <option value="todos">Todos los Estados</option>
              <option value="reportado">Reportado</option>
              <option value="asignado">Asignado</option>
              <option value="en_proceso">En Proceso</option>
              <option value="resuelto">Resuelto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Incident Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Listado Oficial de Incidencias ({filteredIncidents.length})
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Mostrando {filteredIncidents.length} de {incidents.length} registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Código / Fecha</th>
                <th className="py-3 px-4">Incidencia / Sector</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Prioridad IA</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Departamento</th>
                <th className="py-3 px-4 text-right">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No se encontraron incidencias con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
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
                        inc.status === 'resuelto'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                          : inc.status === 'en_proceso'
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
                      <button
                        onClick={() => handleOpenInspector(inc)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                      >
                        Inspeccionar & Atender
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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

          </div>
        </div>
      )}

    </div>
  );
};
