import React, { useState, useEffect, useRef, useMemo } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Incident, IncidentStatus } from '../types';
import { MapPin, Navigation, Layers, ExternalLink, Key, Filter } from 'lucide-react';

const getApiKey = (): string => {
  if (typeof process !== 'undefined' && process.env?.GOOGLE_MAPS_PLATFORM_KEY) {
    return process.env.GOOGLE_MAPS_PLATFORM_KEY;
  }
  if ((import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY) {
    return (import.meta as any).env.VITE_GOOGLE_MAPS_PLATFORM_KEY;
  }
  if (typeof window !== 'undefined' && (window as any).GOOGLE_MAPS_PLATFORM_KEY) {
    return (window as any).GOOGLE_MAPS_PLATFORM_KEY;
  }
  return '';
};

interface LogronoGoogleMapProps {
  incidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
}

// Center of Logroño, Morona Santiago, Ecuador
const LOGRONO_CENTER = { lat: -2.6280, lng: -78.1760 };

const STATUS_FILTER_OPTIONS: { id: string; label: string; statusValue?: IncidentStatus }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'reportado', label: 'Reportado', statusValue: 'reportado' },
  { id: 'en_proceso', label: 'En Proceso', statusValue: 'en_proceso' },
  { id: 'resuelto', label: 'Resuelto', statusValue: 'resuelto' },
];

export const LogronoGoogleMap: React.FC<LogronoGoogleMapProps> = ({
  incidents,
  onSelectIncident
}) => {
  const apiKey = getApiKey();
  const hasValidKey = Boolean(apiKey) && apiKey !== 'YOUR_API_KEY';

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'hybrid' | 'satellite'>('roadmap');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Multi-select state variable for status filters ('reportado', 'en_proceso', 'resuelto')
  const [selectedStatuses, setSelectedStatuses] = useState<IncidentStatus[]>([
    'reportado',
    'en_proceso',
    'resuelto'
  ]);

  const toggleStatusFilter = (status: IncidentStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const toggleAllStatuses = () => {
    if (selectedStatuses.length === 3) {
      setSelectedStatuses([]);
    } else {
      setSelectedStatuses(['reportado', 'en_proceso', 'resuelto']);
    }
  };

  // Filtered incidents based on active multi-select status filter
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => selectedStatuses.includes(inc.status));
  }, [incidents, selectedStatuses]);

  // Sector Fly-to Handler
  const handleFlyToSector = (lat: number, lng: number, zoom: number = 14) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat, lng });
      mapInstanceRef.current.setZoom(zoom);
    }
  };

  // Toggle Map Type
  const handleMapTypeChange = (type: 'roadmap' | 'hybrid' | 'satellite') => {
    setMapTypeId(type);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(type);
    }
  };

  // Initialize Map via @googlemaps/js-api-loader
  useEffect(() => {
    if (!hasValidKey || !mapContainerRef.current) return;

    setOptions({
      key: apiKey,
      v: 'weekly',
      libraries: ['maps', 'marker']
    });

    let isMounted = true;

    async function initMap() {
      try {
        const { Map } = await importLibrary('maps');
        await importLibrary('marker');

        if (!isMounted || !mapContainerRef.current) return;

        const map = new Map(mapContainerRef.current, {
          center: LOGRONO_CENTER,
          zoom: 14,
          mapId: 'DEMO_MAP_ID',
          mapTypeId: mapTypeId,
          gestureHandling: 'greedy'
        });

        mapInstanceRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();
        clustererRef.current = new MarkerClusterer({ map });
        setIsMapLoaded(true);
      } catch (err) {
        console.warn('Google Maps API Loader Error:', err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [apiKey, hasValidKey]);

  // Update Markers and MarkerClusterer whenever filteredIncidents change or map loads
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current || !clustererRef.current) return;

    // Clear previous markers & cluster
    clustererRef.current.clearMarkers();
    markersRef.current = [];

    const map = mapInstanceRef.current;
    const infoWindow = infoWindowRef.current || new google.maps.InfoWindow();

    filteredIncidents.forEach((inc, index) => {
      // Pin styling
      let pinBg = '#10B981'; // Emerald
      if (inc.priority === 'critica') pinBg = '#EF4444'; // Red
      else if (inc.priority === 'alta') pinBg = '#F59E0B'; // Amber

      const pinElement = new google.maps.marker.PinElement({
        background: pinBg,
        glyphColor: '#FFFFFF',
        borderColor: '#0F172A'
      });

      // Apply entrance bounce/drop animation with staggered delay
      const pinDom = pinElement.element;
      pinDom.style.animation = 'markerDrop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both';
      pinDom.style.animationDelay = `${index * 90}ms`;
      pinDom.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease, filter 0.2s ease';
      pinDom.style.cursor = 'pointer';

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: inc.location.lat, lng: inc.location.lng },
        title: `${inc.code} - ${inc.title}`,
        content: pinDom
      });

      // Mouseover and Mouseout handlers for visual hover feedback
      const handleMouseOver = () => {
        pinDom.style.transform = 'scale(1.25)';
        pinDom.style.opacity = '0.95';
        pinDom.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))';
        marker.zIndex = 999;
      };

      const handleMouseOut = () => {
        pinDom.style.transform = 'scale(1)';
        pinDom.style.opacity = '1';
        pinDom.style.filter = 'none';
        marker.zIndex = null;
      };

      marker.addListener('mouseover', handleMouseOver);
      marker.addListener('mouseout', handleMouseOut);

      // DOM fallback hover listeners
      pinDom.addEventListener('mouseenter', handleMouseOver);
      pinDom.addEventListener('mouseleave', handleMouseOut);

      // Marker Click Handler to open InfoWindow with incident details
      const handleMarkerClick = () => {
        const statusStyle =
          inc.status === 'resuelto'
            ? 'background:#d1fae5; color:#065f46;'
            : inc.status === 'en_proceso'
            ? 'background:#dbeafe; color:#1e40af;'
            : 'background:#fef3c7; color:#92400e;';

        const priorityStyle =
          inc.priority === 'critica'
            ? 'background:#fee2e2; color:#991b1b;'
            : inc.priority === 'alta'
            ? 'background:#fef3c7; color:#92400e;'
            : 'background:#d1fae5; color:#065f46;';

        const contentString = `
          <div style="padding:4px; max-width:260px; font-family:sans-serif; font-size:12px; color:#0f172a;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:4px; margin-bottom:6px;">
              <span style="font-family:monospace; font-weight:bold; color:#047857;">${inc.code}</span>
              <div>
                <span style="font-size:9px; font-weight:bold; padding:2px 6px; border-radius:4px; text-transform:uppercase; margin-right:4px; ${statusStyle}">
                  ${inc.status.replace('_', ' ')}
                </span>
                <span style="font-size:9px; font-weight:bold; padding:2px 6px; border-radius:4px; text-transform:uppercase; ${priorityStyle}">
                  ${inc.priority}
                </span>
              </div>
            </div>
            <h4 style="font-weight:bold; margin:0 0 4px 0; font-size:13px; line-height:1.2; color:#0f172a;">${inc.title}</h4>
            ${inc.photoUrl ? `<img src="${inc.photoUrl}" style="width:100%; height:90px; object-fit:cover; border-radius:8px; margin-bottom:6px; border:1px solid #cbd5e1;" />` : ''}
            <div style="font-size:10px; color:#475569; margin-bottom:8px;">
              📍 <strong>${inc.location.sector}</strong>
            </div>
            <button id="btn-inspect-${inc.id}" style="width:100%; background:#047857; color:#ffffff; font-weight:bold; font-size:11px; border:none; padding:7px; border-radius:6px; cursor:pointer; font-family:sans-serif; transition:background 0.2s;">
              Ver Detalle Completo
            </button>
          </div>
        `;

        infoWindow.setContent(contentString);
        infoWindow.open({
          anchor: marker,
          map
        });

        // Attach event listener for the InfoWindow button
        google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
          const btn = document.getElementById(`btn-inspect-${inc.id}`);
          if (btn) {
            btn.addEventListener('click', () => {
              infoWindow.close();
              onSelectIncident(inc);
            });
          }
        });
      };

      marker.addListener('gmp-click', handleMarkerClick);
      marker.addListener('click', handleMarkerClick);

      markersRef.current.push(marker);
    });

    clustererRef.current.addMarkers(markersRef.current);
  }, [filteredIncidents, isMapLoaded, onSelectIncident]);

  if (!hasValidKey) {
    return (
      <div className="space-y-4">
        {/* Splash screen instructions for setting Google Maps API key */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 rounded-2xl border border-emerald-700/60 shadow-lg space-y-3">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30 shrink-0 mt-0.5">
              <Key className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-amber-300">
                Se requiere Clave de API de Google Maps Platform
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Para visualizar el mapa satelital e interactivo con la API oficial de Google Maps Platform, configure la clave de API:
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-2 font-sans">
            <p className="font-semibold text-emerald-400">Instrucciones de Configuración:</p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
              <li>
                Obtenga una Clave de API en{' '}
                <a
                  href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 underline font-medium inline-flex items-center space-x-0.5"
                >
                  <span>Google Cloud Console</span>
                  <ExternalLink className="w-3 h-3 inline" />
                </a>
              </li>
              <li>
                Abra <strong>Ajustes</strong> (icono de engranaje ⚙️ en la esquina superior derecha de la pantalla).
              </li>
              <li>
                Seleccione <strong>Secrets / Variables de Entorno</strong>.
              </li>
              <li>
                Escriba <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono">GOOGLE_MAPS_PLATFORM_KEY</code> y presione <strong>Enter</strong>.
              </li>
              <li>Pegue la clave de API y presione <strong>Enter</strong>. El proyecto se compilará automáticamente.</li>
            </ol>
          </div>
        </div>

        {/* Status Filter Control Panel for Fallback */}
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-300">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Filtrar por Estado:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { status: 'reportado' as IncidentStatus, label: 'Reportado', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/50' },
              { status: 'en_proceso' as IncidentStatus, label: 'En Proceso', badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/50' },
              { status: 'resuelto' as IncidentStatus, label: 'Resuelto', badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' }
            ].map(({ status, label, badgeClass }) => {
              const isSelected = selectedStatuses.includes(status);
              const count = incidents.filter((i) => i.status === status).length;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => toggleStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer flex items-center space-x-1 ${
                    isSelected
                      ? `${badgeClass} ring-1 ring-white/20 shadow-sm opacity-100`
                      : 'bg-slate-800 text-slate-400 border-slate-700/60 opacity-50 hover:opacity-80'
                  }`}
                >
                  <span>{label}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-black/40 font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fallback Interactive Map View with Incident Markers */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Vista Georreferenciada de Incidencias en Logroño (WGS84)</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
              {filteredIncidents.length} {filteredIncidents.length === 1 ? 'Punto Activo' : 'Puntos Activos'}
            </span>
          </div>

          <div className="relative w-full h-[380px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex flex-col justify-between p-4">
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]"></div>

            <div className="relative z-10 flex justify-between items-center text-[10px] text-white bg-slate-900/80 p-2 rounded-xl border border-slate-800 backdrop-blur-sm">
              <div className="flex items-center space-x-2 font-mono">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Cantón Logroño (Morona Santiago, Ecuador)</span>
              </div>
              <span className="bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-700">
                Coordenadas GPS Reales
              </span>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-2 my-auto">
              {filteredIncidents.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-slate-400 text-xs">
                  No hay incidencias registradas con el estado seleccionado.
                </div>
              ) : (
                filteredIncidents.map((inc) => (
                  <button
                    key={inc.id}
                    onClick={() => onSelectIncident(inc)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer backdrop-blur-md ${
                      inc.priority === 'critica'
                        ? 'bg-red-950/90 border-red-500/80 text-red-100 hover:bg-red-900'
                        : inc.priority === 'alta'
                        ? 'bg-amber-950/90 border-amber-500/80 text-amber-100 hover:bg-amber-900'
                        : 'bg-emerald-950/90 border-emerald-500/80 text-emerald-100 hover:bg-emerald-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-amber-300">{inc.code}</span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-black/40">
                        {inc.priority}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs line-clamp-1 mt-1 text-white">{inc.title}</h4>
                    <div className="text-[10px] text-slate-300 flex items-center justify-between mt-1">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{inc.location.sector}</span>
                      </span>
                      <span className="font-mono text-[9px] text-slate-400">
                        {inc.location.lat}, {inc.location.lng}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="relative z-10 flex justify-between items-center text-[10px] text-slate-400 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <span>Sectores: Logroño Centro • Yaupi • Shimpis • Kakaim</span>
              <span className="text-emerald-400 font-bold">GAD Municipal Logroño</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Top Map Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5 mb-2 sm:mb-0">
          <button
            type="button"
            onClick={() => handleFlyToSector(-2.6280, -78.1760, 14)}
            className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 transition-all cursor-pointer flex items-center space-x-1"
          >
            <Navigation className="w-3 h-3 text-emerald-400" />
            <span>Logroño Centro</span>
          </button>

          <button
            type="button"
            onClick={() => handleFlyToSector(-2.6315, -78.1824, 14)}
            className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 transition-all cursor-pointer flex items-center space-x-1"
          >
            <Navigation className="w-3 h-3 text-amber-400" />
            <span>Parroquia Yaupi</span>
          </button>

          <button
            type="button"
            onClick={() => handleFlyToSector(-2.6102, -78.1450, 14)}
            className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 transition-all cursor-pointer flex items-center space-x-1"
          >
            <Navigation className="w-3 h-3 text-blue-400" />
            <span>Parroquia Shimpis</span>
          </button>

          <button
            type="button"
            onClick={() => handleFlyToSector(-2.6450, -78.1980, 14)}
            className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 transition-all cursor-pointer flex items-center space-x-1"
          >
            <Navigation className="w-3 h-3 text-purple-400" />
            <span>Comunidad Kakaim</span>
          </button>
        </div>

        <div className="flex items-center space-x-1.5 self-end sm:self-auto">
          <span className="hidden md:flex items-center space-x-1 text-[10px] font-bold bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-lg border border-slate-700">
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>Loader API & MarkerClusterer</span>
          </span>

          <button
            type="button"
            onClick={() => handleMapTypeChange('roadmap')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              mapTypeId === 'roadmap'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Mapa Vías
          </button>
          <button
            type="button"
            onClick={() => handleMapTypeChange('hybrid')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              mapTypeId === 'hybrid'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Satelital
          </button>
        </div>
      </div>

      {/* Inline styles for marker entrance keyframe animations */}
      <style>{`
        @keyframes markerDrop {
          0% {
            transform: translateY(-45px) scale(0.3);
            opacity: 0;
          }
          65% {
            transform: translateY(8px) scale(1.15);
            opacity: 1;
          }
          85% {
            transform: translateY(-4px) scale(0.95);
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>

      {/* Main Google Maps Container via Loader with floating control panel */}
      <div
        id="map-container"
        ref={mapContainerRef}
        className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-md bg-slate-900"
      >
        {/* Floating Control Panel for Multi-Select Status Marker Visibility */}
        <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2.5 rounded-xl shadow-xl space-y-2 max-w-[calc(100%-24px)] sm:max-w-md">
          <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-100">
            <div className="flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Visibilidad de Marcadores:</span>
            </div>
            <button
              type="button"
              onClick={toggleAllStatuses}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
            >
              {selectedStatuses.length === 3 ? 'Desmarcar todos' : 'Marcar todos'}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { status: 'reportado' as IncidentStatus, label: 'Reportado', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/50' },
              { status: 'en_proceso' as IncidentStatus, label: 'En Proceso', badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/50' },
              { status: 'resuelto' as IncidentStatus, label: 'Resuelto', badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' }
            ].map(({ status, label, badgeClass }) => {
              const isSelected = selectedStatuses.includes(status);
              const count = incidents.filter((i) => i.status === status).length;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => toggleStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center space-x-1.5 ${
                    isSelected
                      ? `${badgeClass} ring-1 ring-white/20 shadow-sm opacity-100`
                      : 'bg-slate-800/80 text-slate-400 border-slate-700/60 opacity-50 hover:opacity-80'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    status === 'reportado' ? 'bg-amber-400' : status === 'en_proceso' ? 'bg-blue-400' : 'bg-emerald-400'
                  }`} />
                  <span>{label}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
