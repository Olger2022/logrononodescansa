import React, { useState } from 'react';
import { TECHNICAL_PHASES, TechnicalPhase } from '../data/technicalPhases';
import { 
  BookOpen, 
  Search, 
  Code2, 
  Table as TableIcon, 
  Layers, 
  CheckCircle, 
  Award, 
  Download,
  FileCheck
} from 'lucide-react';

interface TechnicalDocViewerProps {
  selectedPhaseId?: number;
  onSelectPhaseId?: (phaseId: number) => void;
}

export const TechnicalDocViewer: React.FC<TechnicalDocViewerProps> = ({
  selectedPhaseId: propSelectedPhaseId,
  onSelectPhaseId
}) => {
  const [internalPhaseId, setInternalPhaseId] = useState<number>(1);
  const selectedPhaseId = propSelectedPhaseId !== undefined ? propSelectedPhaseId : internalPhaseId;
  const setSelectedPhaseId = (id: number) => {
    setInternalPhaseId(id);
    if (onSelectPhaseId) onSelectPhaseId(id);
  };
  const [searchTerm, setSearchTerm] = useState<string>('');

  const activePhase = TECHNICAL_PHASES.find((p) => p.id === selectedPhaseId) || TECHNICAL_PHASES[0];

  const filteredPhases = TECHNICAL_PHASES.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPdfSpec = () => {
    const jsonStr = JSON.stringify(TECHNICAL_PHASES, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Especificacion_Tecnica_Logrono_Conecta_15_Fases.json';
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 space-y-6">
      
      {/* Document Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-5 rounded-2xl border border-emerald-800/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 tracking-wider uppercase">
              Tesis de Ingeniería de Software & Especificación GAD Logroño
            </span>
          </div>
          <h2 className="text-2xl font-extrabold font-serif mt-1">
            Documentación Técnica de Desarrollo (Fases 1 a 15)
          </h2>
          <p className="text-xs text-emerald-200/90 mt-1 max-w-3xl">
            Arquitectura escalable, estudio de usabilidad intercultural Shuar, modelo de datos 3NF, endpoints REST, desarrollo Android Jetpack Compose e IA Gemini.
          </p>
        </div>

        <button
          onClick={handleDownloadPdfSpec}
          className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4 text-slate-950" />
          <span>Exportar Especificación Completa</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar: Navigation Tree of 15 Phases */}
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Buscar en las 15 fases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none"
              />
            </div>

            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
              Índice de Fases del Proyecto ({filteredPhases.length})
            </span>

            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
              {filteredPhases.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setSelectedPhaseId(phase.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between border ${
                    selectedPhaseId === phase.id
                      ? 'bg-emerald-700 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="w-5 h-5 rounded-full bg-emerald-950/40 flex items-center justify-center text-[10px] font-mono shrink-0">
                      {phase.id}
                    </span>
                    <span className="truncate">{phase.title.split(':')[0]}</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${
                    selectedPhaseId === phase.id ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {phase.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Main Panel: Phase Detail Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Phase Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300 inline-block mb-2">
                {activePhase.category}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-serif">
                {activePhase.title}
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                {activePhase.subtitle}
              </p>
            </div>

            {/* Markdown Text Content */}
            <div className="prose dark:prose-invert max-w-none text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {activePhase.content}
            </div>

            {/* Tables if any */}
            {activePhase.tables && activePhase.tables.map((table, tIdx) => (
              <div key={tIdx} className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5 uppercase tracking-wider">
                  <TableIcon className="w-4 h-4 text-emerald-600" />
                  <span>{table.title}</span>
                </h4>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-700">
                        {table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 font-medium">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* Code Snippet if any */}
            {activePhase.codeSnippet && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5 uppercase tracking-wider">
                  <Code2 className="w-4 h-4 text-amber-500" />
                  <span>{activePhase.codeSnippet.title}</span>
                </h4>

                <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                  <pre>{activePhase.codeSnippet.code}</pre>
                </div>
              </div>
            )}

            {/* Phase Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
              <span>Especificación GAD Municipal del Cantón Logroño</span>
              <span className="font-semibold text-emerald-600">Aprobado para Desarrollo 2026</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
