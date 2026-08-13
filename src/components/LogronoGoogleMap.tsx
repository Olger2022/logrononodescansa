import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { Incident, IncidentStatus, LogronoSector } from '../types';
import { MapPin, Navigation, Layers, Filter, CheckCircle2, Sparkles, LocateFixed, Compass, AlertCircle, Volume2, VolumeX, Share2, Send, Play, Square, Check, Route, Building2 } from 'lucide-react';

// Logroño, Morona Santiago, Ecuador
const LOGRONO_CENTER: [number, number] = [-2.6280, -78.1760];
const GAD_MUNICIPAL_COORDS: [number, number] = [-2.6280, -78.1760];

// Official Cantón Logroño Boundary Polygon Coordinates (Morona Santiago, Ecuador)
const LOGRONO_CANTON_BOUNDARY: [number, number][] = [
  [-2.5500, -78.2200],
  [-2.5200, -78.1500],
  [-2.5600, -78.0800],
  [-2.6100, -78.0500],
  [-2.6800, -78.0900],
  [-2.7400, -78.1600],
  [-2.7100, -78.2400],
  [-2.6300, -78.2300],
  [-2.5500, -78.2200]
];

// Cantón Logroño Parishes & Key Sectors
const LOGRONO_PARISHES = [
  {
    name: 'Logroño Centro (Cabecera Cantonal)',
    color: '#0A4191',
    center: [-2.6280, -78.1760] as [number, number],
    coords: [
      [-2.6150, -78.1900],
      [-2.6150, -78.1600],
      [-2.6400, -78.1600],
      [-2.6400, -78.1900]
    ] as [number, number][]
  },
  {
    name: 'Parroquia Yaupi',
    color: '#159A44',
    center: [-2.8250, -78.0350] as [number, number],
    coords: [
      [-2.7700, -78.0900],
      [-2.7700, -77.9700],
      [-2.8900, -77.9700],
      [-2.8900, -78.0900]
    ] as [number, number][]
  },
  {
    name: 'Parroquia Shimpis',
    color: '#D97706',
    center: [-2.5250, -78.0950] as [number, number],
    coords: [
      [-2.4600, -78.1500],
      [-2.4600, -78.0300],
      [-2.5800, -78.0300],
      [-2.5800, -78.1500]
    ] as [number, number][]
  }
];

export interface CommunityPoint {
  id: string;
  name: string;
  sector: string;
  type: 'cabecera' | 'comunidad' | 'equipamiento' | 'patrimonio';
  coords: [number, number];
  description: string;
}

export const LOGRONO_COMMUNITIES: CommunityPoint[] = [
  // Logroño Centro
  {
    id: 'lc-1',
    name: 'Palacio Municipal GAD Logroño',
    sector: 'Logroño Centro (Cabecera)',
    type: 'cabecera',
    coords: [-2.6280, -78.1760],
    description: 'Sede Principal del Gobierno Autónomo Descentralizado Municipal del Cantón Logroño'
  },
  {
    id: 'lc-2',
    name: 'Parque Central de Logroño',
    sector: 'Logroño Centro (Cabecera)',
    type: 'equipamiento',
    coords: [-2.6292, -78.1752],
    description: 'Plaza de la Interculturalidad y centro cívico cantonal'
  },
  {
    id: 'lc-3',
    name: 'Barrio Central',
    sector: 'Logroño Centro (Cabecera)',
    type: 'comunidad',
    coords: [-2.6270, -78.1740],
    description: 'Zona comercial y residencial urbana principal'
  },
  {
    id: 'lc-4',
    name: 'Centro de Salud Logroño',
    sector: 'Logroño Centro (Cabecera)',
    type: 'equipamiento',
    coords: [-2.6265, -78.1775],
    description: 'Atención médica cantonal MSP y emergencias 24h'
  },
  {
    id: 'lc-5',
    name: 'Mercado Municipal',
    sector: 'Logroño Centro (Cabecera)',
    type: 'equipamiento',
    coords: [-2.6275, -78.1745],
    description: 'Centro de abasto y feria de productos amazónicos'
  },

  // Parroquia Yaupi
  {
    id: 'yaupi-1',
    name: 'Yaupi Centro (Cabecera Parroquial)',
    sector: 'Parroquia Yaupi',
    type: 'cabecera',
    coords: [-2.8250, -78.0350],
    description: 'Junta Parroquial y centro de servicios de Yaupi'
  },
  {
    id: 'yaupi-2',
    name: 'Comunidad Kankaim',
    sector: 'Parroquia Yaupi',
    type: 'comunidad',
    coords: [-2.8400, -78.0500],
    description: 'Comunidad Ancestral Shuar Kankaim - Territorio Parroquia Yaupi'
  },
  {
    id: 'yaupi-3',
    name: 'Comunidad Kimius',
    sector: 'Parroquia Yaupi',
    type: 'comunidad',
    coords: [-2.8100, -78.0200],
    description: 'Comunidad Ancestral Shuar Kimius - Territorio Parroquia Yaupi'
  },
  {
    id: 'yaupi-4',
    name: 'Comunidad San José',
    sector: 'Parroquia Yaupi',
    type: 'comunidad',
    coords: [-2.8550, -78.0100],
    description: 'Comunidad Shuar y Centro Agrícola San José'
  },
  {
    id: 'yaupi-5',
    name: 'Comunidad Yukutais',
    sector: 'Parroquia Yaupi',
    type: 'comunidad',
    coords: [-2.7950, -78.0600],
    description: 'Comunidad Shuar Yukutais - Producción Amazónica'
  },

  // Parroquia Shimpis
  {
    id: 'shimpis-1',
    name: 'Shimpis Centro (Cabecera Parroquial)',
    sector: 'Parroquia Shimpis',
    type: 'cabecera',
    coords: [-2.5250, -78.0950],
    description: 'Junta Parroquial y centro comunitario de Shimpis'
  },
  {
    id: 'shimpis-2',
    name: 'Comunidad Ampama',
    sector: 'Parroquia Shimpis',
    type: 'comunidad',
    coords: [-2.5400, -78.1100],
    description: 'Comunidad Ancestral Shuar Ampama - Parroquia Shimpis'
  },
  {
    id: 'shimpis-3',
    name: 'Comunidad Wisui',
    sector: 'Parroquia Shimpis',
    type: 'comunidad',
    coords: [-2.5050, -78.0800],
    description: 'Comunidad Shuar Wisui - Cordillera del Kutukú'
  },
  {
    id: 'shimpis-4',
    name: 'Comunidad Yamanunka',
    sector: 'Parroquia Shimpis',
    type: 'comunidad',
    coords: [-2.5500, -78.0700],
    description: 'Comunidad Shuar Yamanunka - Artesanías y Naturaleza'
  },
  {
    id: 'shimpis-5',
    name: 'Comunidad Washapads',
    sector: 'Parroquia Shimpis',
    type: 'comunidad',
    coords: [-2.4900, -78.1200],
    description: 'Comunidad Shuar Washapads - Zona de Conservación'
  },
  {
    id: 'shimpis-6',
    name: 'Acceso Cueva de los Tayos',
    sector: 'Parroquia Shimpis',
    type: 'patrimonio',
    coords: [-2.5150, -78.1300],
    description: 'Ruta y acceso turístico a las místicas Cuevas de los Tayos'
  }
];

// Live Waypoints for GAD Technical Patrol Unit in Real-Time
const LIVE_PATROL_WAYPOINTS: [number, number][] = [
  [-2.6280, -78.1760], // Palacio Municipal GAD
  [-2.6295, -78.1780], // Av. Intercultural
  [-2.8250, -78.0350], // Parroquia Yaupi
  [-2.8400, -78.0500], // Comunidad Kankaim
  [-2.6280, -78.1760], // Cabecera Centro
  [-2.5250, -78.0950], // Parroquia Shimpis
  [-2.5400, -78.1100]  // Comunidad Ampama
];

export function getSectorFromCoords(lat: number, lng: number): { sector: LogronoSector; address: string } {
  const sectors: { name: LogronoSector; lat: number; lng: number; defaultStreet: string }[] = [
    { name: 'Logroño Centro (Cabecera)', lat: -2.6280, lng: -78.1760, defaultStreet: 'Calle 10 de Agosto y Av. Intercultural' },
    { name: 'Parroquia Yaupi', lat: -2.8250, lng: -78.0350, defaultStreet: 'Barrio Central, Parroquia Yaupi' },
    { name: 'Parroquia Shimpis', lat: -2.5250, lng: -78.0950, defaultStreet: 'Av. Principal, Parroquia Shimpis' }
  ];

  let closestSector = sectors[0];
  let minDistance = Infinity;

  sectors.forEach((s) => {
    const d = Math.hypot(lat - s.lat, lng - s.lng);
    if (d < minDistance) {
      minDistance = d;
      closestSector = s;
    }
  });

  const address = `${closestSector.defaultStreet} (GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  return { sector: closestSector.name, address };
}

export interface LogronoGoogleMapProps {
  incidents?: Incident[];
  onSelectIncident?: (inc: Incident) => void;
  centerLat?: number;
  centerLng?: number;
  zoomLevel?: number;
  selectableLocation?: boolean;
  selectedLat?: number;
  selectedLng?: number;
  onLocationSelect?: (lat: number, lng: number, address: string, sector: LogronoSector) => void;
  onDispatchToGAD?: (routeData: { lat: number; lng: number; address: string; sector: string; distance: string; time: string }) => void;
  showRoutePanel?: boolean;
  className?: string;
  defaultMapType?: 'hybrid' | 'roadmap';
  zoomPosition?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
  categoryFilter?: string;
  selectedSector?: string;
}

export const LogronoGoogleMap: React.FC<LogronoGoogleMapProps> = ({
  incidents = [],
  onSelectIncident,
  centerLat = -2.6280,
  centerLng = -78.1760,
  zoomLevel = 14,
  selectableLocation = false,
  selectedLat,
  selectedLng,
  onLocationSelect,
  onDispatchToGAD,
  showRoutePanel = true,
  className = '',
  defaultMapType = 'roadmap',
  zoomPosition = 'topleft',
  categoryFilter = 'Todas',
  selectedSector = 'Todos'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const incidentMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const cantonLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const patrolMarkerRef = useRef<L.Marker | null>(null);
  const selectedMarkerRef = useRef<L.Marker | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const userAccuracyCircleRef = useRef<L.Circle | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const gadMarkerRef = useRef<L.Marker | null>(null);
  const communitiesLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [mapType, setMapType] = useState<'hybrid' | 'roadmap'>(defaultMapType);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);
  const [showCantonBoundary, setShowCantonBoundary] = useState(true);
  const [patrolIndex, setPatrolIndex] = useState(0);
  const [activeCoords, setActiveCoords] = useState<{ lat: number; lng: number }>({
    lat: selectedLat || centerLat,
    lng: selectedLng || centerLng
  });

  // Voice Navigation State
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [activeVoiceStep, setActiveVoiceStep] = useState<number | null>(null);
  const [isSentToGAD, setIsSentToGAD] = useState(false);
  const [gadTrackingCode, setGadTrackingCode] = useState<string | null>(null);

  // Multi-select status filters for incidents map
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

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchStatus = selectedStatuses.includes(inc.status);
      const matchCategory =
        !categoryFilter ||
        categoryFilter === 'Todas' ||
        categoryFilter === 'Todas las Categorías' ||
        inc.category.toLowerCase().includes(categoryFilter.toLowerCase()) ||
        categoryFilter.toLowerCase().includes(inc.category.toLowerCase());
      return matchStatus && matchCategory;
    });
  }, [incidents, selectedStatuses, categoryFilter]);

  // Tile Layer URLs
  const tileUrls = {
    roadmap: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: 'Leaflet | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | GAD Logroño'
    },
    hybrid: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS | GAD Logroño'
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: zoomLevel,
      zoomControl: false
    });

    // Add Zoom Control at requested position (e.g. topleft)
    L.control.zoom({ position: zoomPosition as L.ControlPosition }).addTo(map);

    // Initial Tile Layer
    const layer = L.tileLayer(tileUrls[mapType].url, {
      maxZoom: 19,
      attribution: tileUrls[mapType].attribution
    }).addTo(map);

    tileLayerRef.current = layer;
    incidentMarkersLayerRef.current = L.layerGroup().addTo(map);
    cantonLayerGroupRef.current = L.layerGroup().addTo(map);
    communitiesLayerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Handle map click for selecting location
    map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setActiveCoords({ lat, lng });

      const { sector, address } = getSectorFromCoords(lat, lng);
      setGpsStatusMessage(`Punto seleccionado en mapa: ${sector}`);

      if (onLocationSelect) {
        onLocationSelect(lat, lng, address, sector);
      }
    });

    // Invalidate size on mount
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Map Type change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newLayer = L.tileLayer(tileUrls[mapType].url, {
      maxZoom: 19,
      attribution: tileUrls[mapType].attribution
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  }, [mapType]);

  // Handle Selected Sector Centering & Community Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !communitiesLayerGroupRef.current) return;

    communitiesLayerGroupRef.current.clearLayers();

    // 1. Center map according to selected sector
    if (selectedSector) {
      const sec = selectedSector.toLowerCase();
      if (sec.includes('yaupi')) {
        mapInstanceRef.current.flyTo([-2.8250, -78.0350], 13, { duration: 1.2 });
      } else if (sec.includes('shimpis')) {
        mapInstanceRef.current.flyTo([-2.5250, -78.0950], 13, { duration: 1.2 });
      } else if (sec.includes('logroño') || sec.includes('centro') || sec.includes('cabecera')) {
        mapInstanceRef.current.flyTo([-2.6280, -78.1760], 15, { duration: 1.2 });
      } else if (sec === 'todos' || sec === 'todas') {
        mapInstanceRef.current.flyTo([-2.6500, -78.1200], 11, { duration: 1.2 });
      }
    }

    // 2. Render Community Points
    const filteredCommunities = LOGRONO_COMMUNITIES.filter((comm) => {
      if (!selectedSector || selectedSector === 'Todos' || selectedSector === 'todos') return true;
      const s = selectedSector.toLowerCase();
      if (s.includes('yaupi')) return comm.sector.includes('Yaupi');
      if (s.includes('shimpis')) return comm.sector.includes('Shimpis');
      if (s.includes('centro') || s.includes('logroño')) return comm.sector.includes('Centro');
      return true;
    });

    filteredCommunities.forEach((comm) => {
      let badgeBg = '#0A4191';
      let iconSvg = '📍';
      if (comm.sector.includes('Yaupi')) {
        badgeBg = '#159A44';
        iconSvg = '🏞️';
      } else if (comm.sector.includes('Shimpis')) {
        badgeBg = '#D97706';
        iconSvg = '🌳';
      }

      if (comm.type === 'cabecera') iconSvg = '🏛️';
      else if (comm.type === 'patrimonio') iconSvg = '⛰️';
      else if (comm.type === 'equipamiento') iconSvg = '🏥';

      const communityIconHtml = `
        <div style="
          background: ${badgeBg};
          color: #ffffff;
          border: 2px solid #ffffff;
          border-radius: 18px;
          padding: 3px 8px;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        ">
          <span style="font-size:11px;">${iconSvg}</span>
          <span>${comm.name}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: communityIconHtml,
        className: `community-pin-${comm.id}`,
        iconSize: [130, 26],
        iconAnchor: [65, 13]
      });

      const marker = L.marker(comm.coords, { icon: customIcon });

      marker.bindPopup(`
        <div style="padding:6px; font-family:sans-serif; min-width:180px;">
          <span style="background:${badgeBg}; color:#fff; font-size:9px; font-weight:bold; padding:2px 6px; border-radius:4px; text-transform:uppercase;">
            ${comm.sector}
          </span>
          <strong style="color:#0A4191; font-size:13px; display:block; margin-top:4px;">${comm.name}</strong>
          <p style="font-size:11px; color:#475569; margin:4px 0 0 0; font-weight:500;">${comm.description}</p>
          <div style="margin-top:6px; padding-top:4px; border-top:1px solid #e2e8f0; font-size:10px; color:#159A44; font-weight:bold;">
            ✓ Ubicación Georreferenciada GAD Logroño
          </div>
        </div>
      `);

      communitiesLayerGroupRef.current?.addLayer(marker);
    });
  }, [selectedSector]);

  // Render Real-time Cantón Logroño Polygon Boundary & Parish Layers
  useEffect(() => {
    if (!mapInstanceRef.current || !cantonLayerGroupRef.current) return;

    cantonLayerGroupRef.current.clearLayers();

    if (!showCantonBoundary) return;

    // 1. Draw Cantón Logroño Outer Perimeter Polygon with Animated Real-time Border
    const cantonPolygon = L.polygon(LOGRONO_CANTON_BOUNDARY, {
      color: '#0A4191',
      weight: 3.5,
      opacity: 0.9,
      fillColor: '#0A4191',
      fillOpacity: 0.08,
      dashArray: '10, 8',
      className: 'animated-canton-border'
    });

    cantonPolygon.bindPopup(`
      <div style="padding:6px; font-family:sans-serif; text-align:center;">
        <strong style="color:#0A4191; font-size:13px;">Cantón Logroño • Morona Santiago</strong><br/>
        <span style="font-size:10px; color:#159A44; font-weight:bold;">Trazado Territorial Oficial en Tiempo Real</span><br/>
        <span style="font-size:10px; color:#64748b;">Superficie Aprox: 1.218 km² • Altitud: ~650 m.s.n.m.</span>
      </div>
    `);

    cantonLayerGroupRef.current.addLayer(cantonPolygon);

    // 2. Draw Parish Sub-polygons and Badges
    LOGRONO_PARISHES.forEach((parish) => {
      const parishPoly = L.polygon(parish.coords, {
        color: parish.color,
        weight: 2,
        opacity: 0.8,
        fillColor: parish.color,
        fillOpacity: 0.1,
        dashArray: '5, 5'
      });

      parishPoly.bindPopup(`
        <div style="padding:4px; font-family:sans-serif;">
          <strong style="color:${parish.color}; font-size:12px;">${parish.name}</strong><br/>
          <span style="font-size:10px; color:#334155;">Jurisdicción Municipal GAD Logroño</span>
        </div>
      `);

      cantonLayerGroupRef.current?.addLayer(parishPoly);

      // Parish Label Badge Marker
      const labelIcon = L.divIcon({
        html: `
          <div style="
            background: rgba(15, 23, 42, 0.85);
            color: #ffffff;
            border: 1px solid ${parish.color};
            border-radius: 6px;
            padding: 2px 6px;
            font-size: 9px;
            font-weight: 800;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            gap: 3px;
          ">
            <span style="width:6px; height:6px; border-radius:50%; background:${parish.color};"></span>
            <span>${parish.name.split(' ')[0]}</span>
          </div>
        `,
        className: `parish-label-${parish.name.replace(/\s+/g, '-')}`,
        iconSize: [80, 20],
        iconAnchor: [40, 10]
      });

      const labelMarker = L.marker(parish.center, { icon: labelIcon });
      cantonLayerGroupRef.current?.addLayer(labelMarker);
    });
  }, [showCantonBoundary]);

  // Real-time Live Patrol Unit Animation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setPatrolIndex((prev) => (prev + 1) % LIVE_PATROL_WAYPOINTS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (patrolMarkerRef.current) {
      patrolMarkerRef.current.remove();
      patrolMarkerRef.current = null;
    }

    const currentCoords = LIVE_PATROL_WAYPOINTS[patrolIndex];
    const { sector } = getSectorFromCoords(currentCoords[0], currentCoords[1]);

    const patrolIconHtml = `
      <div style="position:relative; width:34px; height:34px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; inset:-4px; background:rgba(21,154,68,0.35); border-radius:50%; animation:ping 2s infinite;"></div>
        <div style="
          width:28px; 
          height:28px; 
          background:#159A44; 
          border:2px solid #ffffff; 
          border-radius:50%; 
          box-shadow:0 4px 12px rgba(0,0,0,0.5); 
          display:flex; 
          align-items:center; 
          justify-content:center; 
          color:#ffffff;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        </div>
      </div>
    `;

    const customPatrolIcon = L.divIcon({
      html: patrolIconHtml,
      className: 'live-patrol-unit-icon',
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const marker = L.marker(currentCoords, { icon: customPatrolIcon }).addTo(mapInstanceRef.current);
    marker.bindPopup(`
      <div style="padding:4px; font-family:sans-serif; text-align:center;">
        <span style="background:#159A44; color:#fff; font-size:9px; font-weight:bold; padding:2px 6px; border-radius:4px; text-transform:uppercase;">Unidad Móvil GAD #01</span><br/>
        <strong style="color:#0A4191; font-size:12px; display:block; margin-top:4px;">Inspección Técnica en Tiempo Real</strong>
        <span style="font-size:10px; color:#475569;">Patrullando en sector: <strong>${sector}</strong></span><br/>
        <span style="font-size:9px; font-family:monospace; color:#16a34a; font-weight:bold;">📡 Señal GPS Telemetría Activa</span>
      </div>
    `);

    patrolMarkerRef.current = marker;
  }, [patrolIndex]);

  // Update selected pin when selectableLocation or activeCoords change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const currentLat = selectedLat || activeCoords.lat;
    const currentLng = selectedLng || activeCoords.lng;

    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.remove();
      selectedMarkerRef.current = null;
    }

    if (selectableLocation || (selectedLat && selectedLng)) {
      const pinHtml = `
        <div style="position:relative; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; inset:0; background:rgba(10,65,145,0.3); border-radius:50%; animation:ping 1.8s infinite;"></div>
          <div style="width:28px; height:28px; background:#0A4191; border:3px solid #ffffff; border-radius:50%; box-shadow:0 4px 10px rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; color:#ffffff;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-gps-pin',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([currentLat, currentLng], {
        icon: customIcon,
        draggable: true
      }).addTo(mapInstanceRef.current);

      marker.on('dragend', (e) => {
        const position = e.target.getLatLng();
        setActiveCoords({ lat: position.lat, lng: position.lng });
        const { sector, address } = getSectorFromCoords(position.lat, position.lng);
        setGpsStatusMessage(`Marcador arrastrado a: ${sector}`);
        if (onLocationSelect) {
          onLocationSelect(position.lat, position.lng, address, sector);
        }
      });

      selectedMarkerRef.current = marker;
    }

    // Render Route Polyline from Selected Pin to GAD Municipal Palacio
    if (mapInstanceRef.current) {
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
        routePolylineRef.current = null;
      }
      if (gadMarkerRef.current) {
        gadMarkerRef.current.remove();
        gadMarkerRef.current = null;
      }

      // Add GAD Municipal Destination Pin
      const gadPinHtml = `
        <div style="position:relative; width:32px; height:32px; display:flex; align-items:center; justify-content:center;">
          <div style="width:26px; height:26px; background:#159A44; border:2.5px solid #ffffff; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; color:#ffffff;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
              <path d="M6 12h12"/>
              <path d="M6 7h12"/>
              <path d="M6 17h12"/>
            </svg>
          </div>
        </div>
      `;

      const gadIcon = L.divIcon({
        html: gadPinHtml,
        className: 'gad-pin-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      gadMarkerRef.current = L.marker(GAD_MUNICIPAL_COORDS, { icon: gadIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="padding:4px; font-family:sans-serif; text-align:center;">
            <strong style="color:#0A4191; font-size:12px;">Palacio Municipal GAD Logroño</strong><br/>
            <span style="font-size:10px; color:#64748b;">Destino Final de Trámites y Gestión</span>
          </div>
        `);

      // Polyline route calculation with smooth bends
      const startLat = currentLat;
      const startLng = currentLng;
      const destLat = GAD_MUNICIPAL_COORDS[0];
      const destLng = GAD_MUNICIPAL_COORDS[1];

      // Draw polyline if not identical to GAD center
      if (Math.abs(startLat - destLat) > 0.0001 || Math.abs(startLng - destLng) > 0.0001) {
        const midLat = startLat + (destLat - startLat) * 0.5 + 0.0005;
        const midLng = startLng + (destLng - startLng) * 0.5 - 0.0008;

        const polylineCoords: [number, number][] = [
          [startLat, startLng],
          [midLat, midLng],
          [destLat, destLng]
        ];

        routePolylineRef.current = L.polyline(polylineCoords, {
          color: '#0A4191',
          weight: 5,
          opacity: 0.85,
          dashArray: '8, 8',
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(mapInstanceRef.current);
      }
    }

    if (selectedLat && selectedLng && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedLat, selectedLng], 15, { duration: 1.2 });
    }
  }, [selectedLat, selectedLng, activeCoords, selectableLocation]);

  // Render incident markers on map
  useEffect(() => {
    if (!mapInstanceRef.current || !incidentMarkersLayerRef.current) return;

    incidentMarkersLayerRef.current.clearLayers();

    filteredIncidents.forEach((inc) => {
      let pinBg = '#10B981'; // Emerald
      if (inc.priority === 'critica') pinBg = '#EF4444';
      else if (inc.priority === 'alta') pinBg = '#F59E0B';

      const pinHtml = `
        <div style="
          width:28px; 
          height:28px; 
          background:${pinBg}; 
          border:2px solid #0F172A; 
          border-radius:50%; 
          box-shadow:0 4px 10px rgba(0,0,0,0.4); 
          display:flex; 
          align-items:center; 
          justify-content:center; 
          color:#ffffff; 
          font-weight:bold;
          cursor:pointer;
          transition: transform 0.2s ease;
        " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: `incident-pin-${inc.id}`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([inc.location.lat, inc.location.lng], { icon: customIcon });

      const statusBadgeClass =
        inc.status === 'resuelto'
          ? 'background:#d1fae5; color:#065f46;'
          : inc.status === 'en_proceso'
          ? 'background:#dbeafe; color:#1e40af;'
          : 'background:#fef3c7; color:#92400e;';

      const priorityBadgeClass =
        inc.priority === 'critica'
          ? 'background:#fee2e2; color:#991b1b;'
          : inc.priority === 'alta'
          ? 'background:#fef3c7; color:#92400e;'
          : 'background:#d1fae5; color:#065f46;';

      const popupHtml = `
        <div style="padding:4px; max-width:240px; font-family:sans-serif; font-size:12px; color:#0f172a;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:4px; margin-bottom:6px;">
            <span style="font-family:monospace; font-weight:bold; color:#0A4191;">${inc.code}</span>
            <div>
              <span style="font-size:9px; font-weight:bold; padding:2px 6px; border-radius:4px; text-transform:uppercase; margin-right:4px; ${statusBadgeClass}">
                ${inc.status.replace('_', ' ')}
              </span>
              <span style="font-size:9px; font-weight:bold; padding:2px 6px; border-radius:4px; text-transform:uppercase; ${priorityBadgeClass}">
                ${inc.priority}
              </span>
            </div>
          </div>
          <h4 style="font-weight:bold; margin:0 0 4px 0; font-size:13px; line-height:1.2; color:#0f172a;">${inc.title}</h4>
          ${inc.photoUrl ? `<img src="${inc.photoUrl}" style="width:100%; height:85px; object-fit:cover; border-radius:8px; margin-bottom:6px; border:1px solid #cbd5e1;" />` : ''}
          <div style="font-size:10px; color:#475569; margin-bottom:8px;">
            📍 <strong>${inc.location.sector}</strong>
          </div>
          <button id="leaflet-btn-inspect-${inc.id}" style="width:100%; background:#0A4191; color:#ffffff; font-weight:bold; font-size:11px; border:none; padding:7px; border-radius:6px; cursor:pointer; font-family:sans-serif; transition:background 0.2s;">
            Ver Detalle Completo
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 260 });

      marker.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.getElementById(`leaflet-btn-inspect-${inc.id}`);
          if (btn && onSelectIncident) {
            btn.onclick = () => {
              onSelectIncident(inc);
            };
          }
        }, 100);
      });

      incidentMarkersLayerRef.current?.addLayer(marker);
    });
  }, [filteredIncidents, onSelectIncident]);

  // Real-time Geolocation Handler (Boton 'Ubicarme' mediante API de Geolocalización)
  const handleGetRealTimeLocation = () => {
    setIsLocating(true);
    setGpsStatusMessage('📍 Accediendo a la geolocalización de tu dispositivo...');

    if (!navigator.geolocation) {
      setIsLocating(false);
      setGpsStatusMessage('⚠️ Tu navegador no soporta la API de Geolocalización. Se usará el centro de Logroño.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        setActiveCoords({ lat, lng });

        // Add or update pulsing user marker and accuracy halo on map
        if (mapInstanceRef.current) {
          if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.remove();
            userLocationMarkerRef.current = null;
          }
          if (userAccuracyCircleRef.current) {
            userAccuracyCircleRef.current.remove();
            userAccuracyCircleRef.current = null;
          }

          const userPinHtml = `
            <div style="position:relative; width:32px; height:32px; display:flex; align-items:center; justify-content:center;">
              <div style="position:absolute; width:32px; height:32px; background:rgba(14, 165, 233, 0.4); border-radius:50%; animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="width:18px; height:18px; background:#0284c7; border:3px solid #ffffff; border-radius:50%; box-shadow:0 0 12px rgba(2,132,199,0.9); z-index:2;"></div>
            </div>
          `;

          const userIcon = L.divIcon({
            html: userPinHtml,
            className: 'user-gps-pin-icon',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          userLocationMarkerRef.current = L.marker([lat, lng], { icon: userIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div style="padding:4px; font-family:sans-serif; text-align:center;">
                <strong style="color:#0284c7; font-size:12px;">📍 Tu Posición Actual</strong><br/>
                <span style="font-size:10px; color:#475569;">Precisión GPS: ±${Math.round(accuracy || 10)}m</span>
              </div>
            `);

          if (accuracy && accuracy > 0) {
            userAccuracyCircleRef.current = L.circle([lat, lng], {
              radius: Math.max(accuracy, 25),
              color: '#0284c7',
              fillColor: '#38bdf8',
              fillOpacity: 0.15,
              weight: 1.5
            }).addTo(mapInstanceRef.current);
          }

          // Centrar suavemente el mapa en las coordenadas actuales
          mapInstanceRef.current.flyTo([lat, lng], 16, {
            duration: 1.2
          });
        }

        const { sector, address } = getSectorFromCoords(lat, lng);
        setGpsStatusMessage(`🎯 Mapa centrado en tu posición actual: ${sector} (±${Math.round(accuracy || 10)}m)`);

        if (onLocationSelect) {
          onLocationSelect(lat, lng, address, sector);
        }
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation warning/error:', error);

        let errorMsg = 'No se pudo obtener la posición exacta. Se fijó en Logroño Centro.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Permiso de geolocalización denegado en el navegador. Se fijó en Logroño Centro.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Señal GPS no disponible. Se fijó en Logroño Centro.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Tiempo de respuesta GPS agotado. Se fijó en Logroño Centro.';
        }

        const defaultLat = -2.6280;
        const defaultLng = -78.1760;
        setActiveCoords({ lat: defaultLat, lng: defaultLng });

        const { sector, address } = getSectorFromCoords(defaultLat, defaultLng);
        setGpsStatusMessage(`📍 ${errorMsg}`);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([defaultLat, defaultLng], 15, { duration: 1 });
        }

        if (onLocationSelect) {
          onLocationSelect(defaultLat, defaultLng, address, sector);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleFlyToSector = (lat: number, lng: number, zoom = 15) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1 });
      setActiveCoords({ lat, lng });
      const { sector, address } = getSectorFromCoords(lat, lng);
      setGpsStatusMessage(`Centrado en ${sector}`);
      if (onLocationSelect) {
        onLocationSelect(lat, lng, address, sector);
      }
    }
  };

  // Route Metrics & Calculations
  const routeDistanceKm = useMemo(() => {
    const currentLat = selectedLat || activeCoords.lat;
    const currentLng = selectedLng || activeCoords.lng;
    const dist = Math.hypot(currentLat - GAD_MUNICIPAL_COORDS[0], currentLng - GAD_MUNICIPAL_COORDS[1]) * 111;
    return Math.max(0.3, +dist.toFixed(2));
  }, [selectedLat, selectedLng, activeCoords]);

  const routeTimeMin = useMemo(() => {
    return Math.max(2, Math.round(routeDistanceKm * 2.8));
  }, [routeDistanceKm]);

  const currentSectorInfo = useMemo(() => {
    const currentLat = selectedLat || activeCoords.lat;
    const currentLng = selectedLng || activeCoords.lng;
    return getSectorFromCoords(currentLat, currentLng);
  }, [selectedLat, selectedLng, activeCoords]);

  // GPS Voice Navigation Instructions
  const gpsVoiceInstructions = useMemo(() => {
    return [
      `Iniciando navegación GPS hacia el GAD Municipal de Logroño desde ${currentSectorInfo.sector}.`,
      `Avanzar ${Math.round(routeDistanceKm * 280)} metros por la vía principal.`,
      `Gire a la derecha por la Avenida Intercultural del cantón Logroño.`,
      `Continúe directo durante ${(routeDistanceKm * 0.5).toFixed(1)} kilómetros.`,
      `Gire a la izquierda hacia la Calle 10 de Agosto.`,
      `Ha llegado a su destino en el Palacio Municipal del GAD Logroño.`
    ];
  }, [currentSectorInfo, routeDistanceKm]);

  const speakGpsInstruction = (stepIdx?: number) => {
    if (!('speechSynthesis' in window)) {
      alert('Su navegador no soporta la síntesis de voz GPS.');
      return;
    }
    window.speechSynthesis.cancel();

    const targetIdx = stepIdx !== undefined ? stepIdx : 0;
    setActiveVoiceStep(targetIdx);

    const textToSpeak = gpsVoiceInstructions[targetIdx] || gpsVoiceInstructions[0];
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'es-EC';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsVoiceSpeaking(true);
    utterance.onend = () => {
      setIsVoiceSpeaking(false);
    };
    utterance.onerror = () => setIsVoiceSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopGpsVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsVoiceSpeaking(false);
    setActiveVoiceStep(null);
  };

  const handleShareWhatsApp = () => {
    const currentLat = selectedLat || activeCoords.lat;
    const currentLng = selectedLng || activeCoords.lng;
    const text = `*📍 REPORTE Y RUTA GPS - CANTÓN LOGROÑO*\n\n` +
      `*Sector:* ${currentSectorInfo.sector}\n` +
      `*Ubicación:* ${currentSectorInfo.address}\n` +
      `*Coordenadas GPS:* ${currentLat.toFixed(5)}, ${currentLng.toFixed(5)}\n` +
      `*Ruta al GAD Municipal:* ${routeDistanceKm} km (~${routeTimeMin} min)\n\n` +
      `*Ver en Google Maps:* https://maps.google.com/?q=${currentLat},${currentLng}\n\n` +
      `_Logroño Conecta - Morona Santiago_`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleDispatchToGAD = () => {
    const currentLat = selectedLat || activeCoords.lat;
    const currentLng = selectedLng || activeCoords.lng;
    const code = 'TRM-2026-' + Math.floor(1000 + Math.random() * 9000);
    setGadTrackingCode(code);
    setIsSentToGAD(true);
    setGpsStatusMessage(`✅ Trámite Nº ${code} ingresado y derivado al Panel GAD Municipal.`);

    if (onDispatchToGAD) {
      onDispatchToGAD({
        lat: currentLat,
        lng: currentLng,
        address: currentSectorInfo.address,
        sector: currentSectorInfo.sector,
        distance: `${routeDistanceKm} km`,
        time: `${routeTimeMin} min`
      });
    }

    setTimeout(() => {
      setIsSentToGAD(false);
    }, 6000);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Map Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (mapInstanceRef.current) {
                const bounds = L.latLngBounds(LOGRONO_CANTON_BOUNDARY);
                mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30], duration: 1.2 });
                setGpsStatusMessage('🗺️ Vista Completa: Cantón Logroño (Morona Santiago)');
              }
            }}
            className="bg-[#0A4191] hover:bg-blue-900 text-white text-[10px] font-black px-2.5 py-1 rounded-lg border border-blue-400/30 transition-all cursor-pointer flex items-center space-x-1 shadow-xs"
            title="Ver mapa completo del Cantón Logroño trazado en tiempo real"
          >
            <Compass className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>Cantón Logroño Completo</span>
          </button>

          <button
            type="button"
            onClick={() => handleFlyToSector(-2.6280, -78.1760, 15)}
            className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 transition-all cursor-pointer flex items-center space-x-1"
          >
            <Navigation className="w-3 h-3 text-emerald-400" />
            <span>Logroño Centro</span>
          </button>

          <button
            type="button"
            onClick={() => handleFlyToSector(-2.6315, -78.1824, 15)}
            className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 transition-all cursor-pointer flex items-center space-x-1"
          >
            <Navigation className="w-3 h-3 text-amber-400" />
            <span>Parroquia Yaupi</span>
          </button>

          <button
            type="button"
            onClick={() => handleFlyToSector(-2.6102, -78.1450, 15)}
            className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 transition-all cursor-pointer flex items-center space-x-1"
          >
            <Navigation className="w-3 h-3 text-blue-400" />
            <span>Parroquia Shimpis</span>
          </button>
        </div>

        {/* Map Type Toggle */}
        <div className="flex items-center space-x-1.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              mapType === 'roadmap'
                ? 'bg-[#0A4191] text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Mapa Vías
          </button>
          <button
            type="button"
            onClick={() => setMapType('hybrid')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              mapType === 'hybrid'
                ? 'bg-[#0A4191] text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Satelital HD
          </button>
        </div>
      </div>

      {/* Main Map Canvas */}
      <div className="relative w-full h-[380px] sm:h-[450px] rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-md bg-slate-900">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Toolbar inside Map */}
        <div className="absolute top-3 left-3 right-3 z-10 pointer-events-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          {/* Status Filter Badges (if incidents present) */}
          {incidents.length > 0 && (
            <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 rounded-xl shadow-xl flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="flex items-center space-x-1">
                {[
                  { status: 'reportado' as IncidentStatus, label: 'Reportados', color: 'bg-amber-400' },
                  { status: 'en_proceso' as IncidentStatus, label: 'En Proceso', color: 'bg-blue-400' },
                  { status: 'resuelto' as IncidentStatus, label: 'Resueltos', color: 'bg-emerald-400' }
                ].map(({ status, label, color }) => {
                  const isSelected = selectedStatuses.includes(status);
                  const count = incidents.filter((i) => i.status === status).length;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => toggleStatusFilter(status)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                        isSelected
                          ? 'bg-slate-800 text-white border border-slate-600'
                          : 'bg-slate-950/60 text-slate-500 border border-slate-800'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
                      <span>{label}</span>
                      <span className="text-[9px] font-mono opacity-80">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Button: Ubicarme (API Geolocalización del Navegador) */}
          <div className="pointer-events-auto ml-auto">
            <button
              type="button"
              onClick={handleGetRealTimeLocation}
              disabled={isLocating}
              className="bg-[#0A4191] hover:bg-blue-900 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xl border border-blue-400/40 flex items-center space-x-2 transition-all cursor-pointer active:scale-95 disabled:opacity-75"
              title="Utilizar la API de geolocalización del navegador para centrar el mapa en tu posición actual"
            >
              {isLocating ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin shrink-0" />
                  <span>Obteniendo GPS...</span>
                </>
              ) : (
                <>
                  <LocateFixed className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                  <span>Ubicarme</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Floating Quick-Access 'Ubicarme' Control Button on Map Canvas */}
        <div className="absolute bottom-16 right-3 z-10 pointer-events-auto">
          <button
            type="button"
            onClick={handleGetRealTimeLocation}
            disabled={isLocating}
            className="bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-slate-800 font-extrabold text-xs px-3 py-2 rounded-xl shadow-2xl border-2 border-[#0A4191]/40 dark:border-blue-500/40 flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-75 backdrop-blur-md"
            title="Centrar el mapa en tu posición GPS actual"
          >
            <LocateFixed className={`w-4 h-4 text-[#0A4191] dark:text-blue-400 shrink-0 ${isLocating ? 'animate-spin text-amber-500' : ''}`} />
            <span className="font-extrabold">Ubicarme</span>
          </button>
        </div>

        {/* Floating status pill at bottom left */}
        {gpsStatusMessage && (
          <div className="absolute bottom-3 left-3 right-12 z-10 pointer-events-none">
            <div className="pointer-events-auto inline-flex items-center space-x-1.5 bg-slate-900/95 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-lg text-[11px] font-bold backdrop-blur-md animate-in fade-in">
              <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{gpsStatusMessage}</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Route Panel & Voice Navigation Controls */}
      {showRoutePanel && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm space-y-3 animate-in fade-in">
          {/* Header row: Route badge + Distance + Time */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-[#0A4191]/10 text-[#0A4191] dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center">
                <Route className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs leading-tight">
                  Ruta Recorrido al GAD Municipal Logroño
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Origen: {currentSectorInfo.sector}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] font-mono">
              <span className="bg-blue-50 dark:bg-blue-950/80 text-[#0A4191] dark:text-blue-300 px-2 py-0.5 rounded-md font-bold border border-blue-100 dark:border-blue-900">
                📏 {routeDistanceKm} km
              </span>
              <span className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md font-bold border border-emerald-100 dark:border-emerald-900">
                ⏱️ ~{routeTimeMin} min
              </span>
            </div>
          </div>

          {/* Action Buttons Row: Voice Guidance, WhatsApp Share, GAD Dispatch */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* 1. Direccionar con Voz GPS */}
            <button
              type="button"
              onClick={() => {
                if (isVoiceSpeaking) {
                  stopGpsVoice();
                } else {
                  speakGpsInstruction();
                }
              }}
              className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs ${
                isVoiceSpeaking
                  ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              title="Escuchar navegación guiada por voz GPS en español"
            >
              {isVoiceSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Detener Voz GPS</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Voz del GPS</span>
                </>
              )}
            </button>

            {/* 2. Compartir en WhatsApp */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="py-2 px-3 bg-[#25D366] hover:bg-emerald-600 text-white rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
              title="Compartir mapa, ruta y coordenadas por WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir WhatsApp</span>
            </button>

            {/* 3. Enviar a Panel GAD (Dar trámite real) */}
            <button
              type="button"
              onClick={handleDispatchToGAD}
              disabled={isSentToGAD}
              className="py-2 px-3 bg-[#0A4191] hover:bg-blue-900 text-white rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs disabled:opacity-80"
              title="Ingresar solicitud a la bandeja del GAD Municipal para trámite inmediato"
            >
              {isSentToGAD ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Enviado a GAD</span>
                </>
              ) : (
                <>
                  <Building2 className="w-4 h-4 text-amber-300" />
                  <span>Trámite Real GAD</span>
                </>
              )}
            </button>
          </div>

          {/* Success Banner when sent to GAD */}
          {gadTrackingCode && (
            <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 p-2.5 rounded-xl text-[11px] font-bold text-emerald-800 dark:text-emerald-200 flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                ¡Trámite Nº <strong className="font-mono text-[#0A4191] dark:text-blue-300">{gadTrackingCode}</strong> derivado exitosamente a la mesa de entrada del GAD Municipal de Logroño!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
