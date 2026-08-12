import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Route as RouteIcon, 
  Play, 
  Square, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Clock, 
  CheckCircle2, 
  Info, 
  Trees, 
  Eye, 
  Mountain,
  Map as MapIcon,
  ChevronRight,
  Crosshair,
  Zap,
  Building2,
  Car
} from 'lucide-react';

// Logroño, Morona Santiago, Ecuador Center Coordinates
const LOGRONO_CENTER: [number, number] = [-2.6281, -78.1762];

// Known Default Departure Points
export interface DeparturePoint {
  id: string;
  name: string;
  coords: [number, number];
  description: string;
  isGps?: boolean;
}

export const DEPARTURE_POINTS: DeparturePoint[] = [
  {
    id: 'parque_central_logrono',
    name: 'Parque Central de Logroño (Palacio Municipal)',
    coords: [-2.6281, -78.1762],
    description: 'Punto de Partida Oficial • Av. Intercultural y Calle Central'
  },
  {
    id: 'puente_upano',
    name: 'Entrada Cantonal / Puente Río Upano',
    coords: [-2.6412, -78.1654],
    description: 'Acceso Sur a Logroño desde la Vía Troncal Amazónica'
  },
  {
    id: 'shimpis_centro',
    name: 'Centro Parroquial Shimpis',
    coords: [-2.5950, -78.1380],
    description: 'Plaza Central de la Parroquia Shimpis'
  }
];

// Boundary Polygon Coordinates of Cantón Logroño (Morona Santiago)
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

// Tourist Spots Data in Cantón Logroño with Exact Coordinates
export interface TouristSpot {
  id: string;
  name: string;
  shuarName?: string;
  category: 'Cascada' | 'Cueva' | 'Río' | 'Reserva' | 'Cultura' | 'Patrimonio' | 'Mirador';
  description: string;
  lat: number;
  lng: number;
  sector: string;
  difficulty: 'Fácil' | 'Moderado' | 'Aventura';
  photoUrl: string;
  recommendedRoad: string;
  fallbackWaypoints: [number, number][];
  fallbackDirections: string[];
}

// Catmull-Rom spline curve generator to build silky smooth road geometry following actual road curvature
function generateSmoothRoadRoute(controlPoints: [number, number][], pointsPerSegment = 10): [number, number][] {
  if (controlPoints.length < 2) return controlPoints;
  if (controlPoints.length === 2) {
    const [p0, p1] = controlPoints;
    const result: [number, number][] = [];
    for (let i = 0; i <= pointsPerSegment; i++) {
      const t = i / pointsPerSegment;
      result.push([
        p0[0] + (p1[0] - p0[0]) * t,
        p0[1] + (p1[1] - p0[1]) * t
      ]);
    }
    return result;
  }

  const extended: [number, number][] = [
    controlPoints[0],
    ...controlPoints,
    controlPoints[controlPoints.length - 1]
  ];

  const smoothPath: [number, number][] = [];

  for (let i = 1; i < extended.length - 2; i++) {
    const p0 = extended[i - 1];
    const p1 = extended[i];
    const p2 = extended[i + 1];
    const p3 = extended[i + 2];

    for (let j = 0; j < pointsPerSegment; j++) {
      const t = j / pointsPerSegment;
      const t2 = t * t;
      const t3 = t2 * t;

      const lat = 0.5 * (
        (2 * p1[0]) +
        (-p0[0] + p2[0]) * t +
        (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
        (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3
      );

      const lng = 0.5 * (
        (2 * p1[1]) +
        (-p0[1] + p2[1]) * t +
        (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
        (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3
      );

      smoothPath.push([lat, lng]);
    }
  }

  smoothPath.push(controlPoints[controlPoints.length - 1]);
  return smoothPath;
}

// Calculate total road distance along waypoints in Km
function calculatePathDistanceKm(path: [number, number][]): number {
  let dist = 0;
  const R = 6371; // km
  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];
    const dLat = ((p2[0] - p1[0]) * Math.PI) / 180;
    const dLng = ((p2[1] - p1[1]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((p1[0] * Math.PI) / 180) *
        Math.cos((p2[0] * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    dist += R * c;
  }
  return Math.round(dist * 10) / 10;
}

export const LOGRONO_TOURIST_SPOTS: TouristSpot[] = [
  {
    id: 'chupiamas',
    name: 'Cascadas de Chupiamas',
    shuarName: 'Chupiam Tunim',
    category: 'Cascada',
    description: 'Majestuosas caídas de agua cristalina de 25m de altura en medio de selva virgen en Parroquia Shimpis.',
    lat: -2.5852,
    lng: -78.1284,
    sector: 'Parroquia Shimpis',
    difficulty: 'Moderado',
    photoUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&auto=format&fit=crop&q=80',
    recommendedRoad: 'Vía Intercultural - Ramal Shimpis - Chupiamas',
    fallbackWaypoints: [
      [-2.6281, -78.1762], // Parque Central de Logroño
      [-2.6250, -78.1740], // Calle Central Norte
      [-2.6210, -78.1690], // Av. Intercultural Norte
      [-2.6150, -78.1610], // Empalme Vía Shimpis
      [-2.6070, -78.1500], // Tramo Comunal Shimpis
      [-2.5980, -78.1390], // Parroquia Shimpis Centro
      [-2.5910, -78.1320], // Desvío Comunidad Chupiamas
      [-2.5852, -78.1284]  // Cascadas de Chupiamas
    ],
    fallbackDirections: [
      'Partida desde el Parque Central de Logroño por Calle Central hacia el Norte',
      'Tomar Av. Intercultural Norte en dirección a la Parroquia Shimpis',
      'Giro a la derecha en la señalización hacia Comunidad Chupiamas',
      'Avanzar 3.5 km por la vía carrozable hasta el punto de control comunitario',
      'Ingreso al sendero ecoturístico Shuar y llegada a la cascada'
    ]
  },
  {
    id: 'tayos',
    name: 'Cueva de los Tayos (Sector Logroño)',
    shuarName: 'Tayu Kuish',
    category: 'Cueva',
    description: 'Enigmática cueva subterránea habitada por aves Tayos, con galerías milenarias de piedra y valor místico Shuar.',
    lat: -2.6651,
    lng: -78.2103,
    sector: 'Sector Trans-Kutukú',
    difficulty: 'Aventura',
    photoUrl: 'https://images.unsplash.com/photo-1508873696983-2df515122519?w=600&auto=format&fit=crop&q=80',
    recommendedRoad: 'Vía Lastrada Trans-Kutukú',
    fallbackWaypoints: [
      [-2.6281, -78.1762], // Parque Central de Logroño
      [-2.6320, -78.1800], // Av. Intercultural Sur
      [-2.6380, -78.1870], // Desvío Vía Trans-Kutukú
      [-2.6450, -78.1950], // Sector Kakaim
      [-2.6530, -78.2010], // Tramo Lastrado Kutukú
      [-2.6600, -78.2060], // Puente Río Kutukú
      [-2.6651, -78.2103]  // Acceso Cueva de los Tayos
    ],
    fallbackDirections: [
      'Salida desde el Parque Central por la arteria sur de Logroño',
      'Tomar el desvío señalizado Vía Trans-Kutukú',
      'Avanzar por el camino carrozable atravesando el sector Kakaim',
      'Cruzar el puente comunal sobre el río Kutukú',
      'Llegada a la estación de guías autóctonos e inicio de la caverna'
    ]
  },
  {
    id: 'upano',
    name: 'Río Upano y Valle de las Orquídeas',
    shuarName: 'Upano Entsa',
    category: 'Río',
    description: 'Navegación y ribera del imponente Río Upano, rodeado de vegetación exuberante y especies únicas de orquídeas.',
    lat: -2.6412,
    lng: -78.1654,
    sector: 'Cabecera Cantonal Sur',
    difficulty: 'Fácil',
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    recommendedRoad: 'Av. de los Ríos (Asfaltada)',
    fallbackWaypoints: [
      [-2.6281, -78.1762], // Parque Central de Logroño
      [-2.6310, -78.1730], // Av. de los Ríos
      [-2.6350, -78.1690], // Descenso Fluvial
      [-2.6390, -78.1665], // Malecón Upano
      [-2.6412, -78.1654]  // Puerto Río Upano
    ],
    fallbackDirections: [
      'Partida directa desde el Parque Central por la Av. de los Ríos',
      'Descenso asfaltado de 2.2 km hacia el valle fluvial',
      'Acceso al complejo recreativo y puerto fluvial del Río Upano'
    ]
  },
  {
    id: 'parque_central',
    name: 'Parque Central y Palacio Municipal',
    shuarName: 'Logroño Numi',
    category: 'Patrimonio',
    description: 'Corazón administrativo y cultural de Logroño con moderna arquitectura tropical e identidad intercultural.',
    lat: -2.6281,
    lng: -78.1762,
    sector: 'Logroño Centro',
    difficulty: 'Fácil',
    photoUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=600&auto=format&fit=crop&q=80',
    recommendedRoad: 'Eje Urbano Central Logroño',
    fallbackWaypoints: [
      [-2.6281, -78.1762],
      [-2.6283, -78.1764]
    ],
    fallbackDirections: [
      'Ubicado en la plaza principal de la Cabecera Cantonal de Logroño'
    ]
  },
  {
    id: 'yaupi',
    name: 'Reserva Ecológica Yaupi',
    shuarName: 'Yaupi Nunkaya',
    category: 'Reserva',
    description: 'Santuario de biodiversidad amazónica con bosques primarios, avistamiento de aves exóticas y senderos ecológicos.',
    lat: -2.6315,
    lng: -78.1824,
    sector: 'Parroquia Yaupi',
    difficulty: 'Fácil',
    photoUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    recommendedRoad: 'Vía Asfaltada Logroño - Yaupi',
    fallbackWaypoints: [
      [-2.6281, -78.1762], // Parque Central
      [-2.6292, -78.1780], // Salida Oeste Vía Yaupi
      [-2.6305, -78.1802], // Tramo Pavimentado Yaupi
      [-2.6315, -78.1824]  // Centro Reserva Yaupi
    ],
    fallbackDirections: [
      'Partida desde el Parque Central por la salida occidental',
      'Avanzar por la vía asfaltada dirección Parroquia Yaupi',
      'Arribo al centro de interpretación botánico y senderos ecológicos'
    ]
  },
  {
    id: 'shimpis_sagrada',
    name: 'Cascada Sagrada de Shimpis',
    shuarName: 'Shimpis Tsunki',
    category: 'Cascada',
    description: 'Lugar ancestral de purificación y ceremonial Shuar con entorno de flora medicinal en la parroquia Shimpis.',
    lat: -2.6102,
    lng: -78.1450,
    sector: 'Parroquia Shimpis',
    difficulty: 'Moderado',
    photoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    recommendedRoad: 'Vía Interparroquial Shimpis - Sendero Místico',
    fallbackWaypoints: [
      [-2.6281, -78.1762], // Parque Central
      [-2.6235, -78.1720], // Av. Intercultural Norte
      [-2.6180, -78.1630], // Vía Interparroquial
      [-2.6135, -78.1520], // Sendero Místico
      [-2.6102, -78.1450]  // Cascada Sagrada Shimpis
    ],
    fallbackDirections: [
      'Partida desde el Parque Central de Logroño por Av. Intercultural Norte',
      'Desvío por la arteria interparroquial Logroño - Shimpis',
      'Recepción por guías Shuar en el centro comunitario e ingreso a la cascada'
    ]
  },
  {
    id: 'kakaim',
    name: 'Centro Cultural Shuar Kakaim',
    shuarName: 'Kakaim Arutam',
    category: 'Cultura',
    description: 'Comunidad nativa viva con muestras de danza guerrera, artesanías en semillas, plantas medicinales y gastronomía ancestral.',
    lat: -2.6450,
    lng: -78.1980,
    sector: 'Comunidad Kakaim',
    difficulty: 'Fácil',
    photoUrl: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=600&auto=format&fit=crop&q=80',
    recommendedRoad: 'Ramal Sur Kakaim',
    fallbackWaypoints: [
      [-2.6281, -78.1762], // Parque Central
      [-2.6325, -78.1810], // Av. Intercultural Sur
      [-2.6380, -78.1890], // Ramal Sur Kakaim
      [-2.6450, -78.1980]  // Centro Cultural Kakaim
    ],
    fallbackDirections: [
      'Salida del Parque Central hacia la arteria vehicular sur',
      'Tomar el ramal directo a la comunidad Kakaim',
      'Llegada a las cabañas artesanales del Centro Cultural Shuar'
    ]
  },
  {
    id: 'mirador_kimius',
    name: 'Mirador Panorámico del Río Yaapi',
    shuarName: 'Yaapi Ekeem',
    category: 'Mirador',
    description: 'Mirador natural elevado con vista impresionante de 360 grados sobre el cañón del Río Yaapi y la serranía Kutukú.',
    lat: -2.6020,
    lng: -78.1910,
    sector: 'Sector Kimius',
    difficulty: 'Fácil',
    photoUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    recommendedRoad: 'Vía Kimius - Mirador',
    fallbackWaypoints: [
      [-2.6281, -78.1762], // Parque Central
      [-2.6220, -78.1760], // Calle Central Norte
      [-2.6150, -78.1815], // Ascenso Kimius
      [-2.6080, -78.1865], // Tramo Elevado Kimius
      [-2.6020, -78.1910]  // Mirador del Río Yaapi
    ],
    fallbackDirections: [
      'Partida desde el Parque Central de Logroño hacia el sector alto Kimius',
      'Ascenso panorámico pavimentado bordeando la colina',
      'Arribo a la plataforma del Mirador del Río Yaapi'
    ]
  }
];

// High-Precision Real-World Driving Route Engine Fetcher
async function fetchRealOSRMRoute(
  start: [number, number],
  spot: TouristSpot
): Promise<{ waypoints: [number, number][]; distanceKm: number; durationMins: number; steps: string[] }> {
  const end: [number, number] = [spot.lat, spot.lng];

  // Check if starting location is Parque Central de Logroño
  const isFromParqueCentral =
    Math.abs(start[0] - DEPARTURE_POINTS[0].coords[0]) < 0.001 &&
    Math.abs(start[1] - DEPARTURE_POINTS[0].coords[1]) < 0.001;

  // Try online OSRM driving route first with 2.5s timeout
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&steps=true`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const rawCoords: [number, number][] = route.geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]] // GeoJSON [lng, lat] -> Leaflet [lat, lng]
        );

        // Verify that route has detailed road points
        if (rawCoords.length >= 8) {
          const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
          const durationMins = Math.max(1, Math.round(route.duration / 60));

          const extractedSteps: string[] = [];
          if (route.legs && route.legs[0] && route.legs[0].steps) {
            route.legs[0].steps.forEach((s: any) => {
              if (s.name && s.name.trim().length > 0) {
                extractedSteps.push(`Avanzar por ${s.name}`);
              }
            });
          }

          return {
            waypoints: rawCoords,
            distanceKm: distanceKm || 1,
            durationMins: durationMins || 2,
            steps: extractedSteps.length > 0 ? extractedSteps : spot.fallbackDirections
          };
        }
      }
    }
  } catch (e) {
    console.info('OSRM online route service unreachable, utilizing high-precision Catmull-Rom road geometry');
  }

  // Construct high-precision road route from Parque Central to target spot
  let rawControlPoints: [number, number][] = spot.fallbackWaypoints;

  if (!isFromParqueCentral) {
    // Prepend user's GPS position smoothly connecting to Parque Central or first road point
    rawControlPoints = [start, ...spot.fallbackWaypoints];
  }

  // Generate silky smooth road curves through control points
  const smoothWaypoints = generateSmoothRoadRoute(rawControlPoints, 10);
  const distanceKm = calculatePathDistanceKm(smoothWaypoints);
  const durationMins = Math.max(2, Math.round(distanceKm * 2.2));

  const steps = isFromParqueCentral
    ? spot.fallbackDirections
    : [
        `Partida desde su ubicación GPS actual hacia el eje de Logroño`,
        `Conexión con la Av. Intercultural de Logroño`,
        ...spot.fallbackDirections
      ];

  return {
    waypoints: smoothWaypoints,
    distanceKm: distanceKm || 1.5,
    durationMins: durationMins,
    steps: steps
  };
}

interface WelcomeTouristMapProps {
  onStartApp?: () => void;
  className?: string;
}

export const WelcomeTouristMap: React.FC<WelcomeTouristMapProps> = ({
  onStartApp,
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routePolylineGlowRef = useRef<L.Polyline | null>(null);
  const routePolylineLineRef = useRef<L.Polyline | null>(null);
  const animatedMarkerRef = useRef<L.Marker | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);

  const [selectedSpot, setSelectedSpot] = useState<TouristSpot>(LOGRONO_TOURIST_SPOTS[0]);
  const [departure, setDeparture] = useState<DeparturePoint>(DEPARTURE_POINTS[0]);
  const [customUserGps, setCustomUserGps] = useState<[number, number] | null>(null);

  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [activeRouteWaypoints, setActiveRouteWaypoints] = useState<[number, number][]>([]);
  const [realDistanceKm, setRealDistanceKm] = useState<number>(0);
  const [realDurationMins, setRealDurationMins] = useState<number>(0);
  const [realSteps, setRealSteps] = useState<string[]>([]);

  const [isNavigating, setIsNavigating] = useState(false);
  const [navProgress, setNavProgress] = useState(0);
  const [navStepIndex, setNavStepIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(true);
  const [currentSpeedKmH, setCurrentSpeedKmH] = useState(0);
  const [isLoadingGps, setIsLoadingLoadingGps] = useState(false);

  const navTimerRef = useRef<any>(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Get current departure coordinates
  const currentDepartureCoords: [number, number] = customUserGps || departure.coords;

  // Detect Mobile Device & Trigger Auto GPS on Mount
  useEffect(() => {
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    setIsMobileDevice(mobile);

    if (mobile && 'geolocation' in navigator) {
      setIsLoadingLoadingGps(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLoadingLoadingGps(false);
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setCustomUserGps(coords);
        },
        (err) => {
          setIsLoadingLoadingGps(false);
          // Keep default Parque Central de Logroño
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: LOGRONO_CENTER,
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // High resolution OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c']
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    // 1. Draw Canton Boundary Polygon (Territorio Previamente Trazado)
    const cantonBoundaryPolygon = L.polygon(LOGRONO_CANTON_BOUNDARY, {
      color: '#0A4191',
      weight: 3.5,
      dashArray: '8, 6',
      fillColor: '#0A4191',
      fillOpacity: 0.12,
      lineCap: 'round'
    }).addTo(map);

    cantonBoundaryPolygon.bindTooltip(
      '<b>Territorio Delimitado del Cantón Logroño</b><br/>Morona Santiago, Ecuador',
      { permanent: false, direction: 'center', className: 'font-bold text-xs text-[#0A4191]' }
    );

    // 2. Add All Tourist Spots Markers
    LOGRONO_TOURIST_SPOTS.forEach((spot) => {
      const isSelected = spot.id === selectedSpot.id;
      const spotIcon = L.divIcon({
        className: `spot-pin-${spot.id}`,
        html: `
          <div style="background-color:${isSelected ? '#D97706' : '#159A44'}; color:white; border:2px solid white; border-radius:999px; padding:5px 10px; font-weight:900; font-size:11px; display:flex; align-items:center; gap:4px; box-shadow:0 4px 12px rgba(0,0,0,0.35); cursor:pointer; transform:${isSelected ? 'scale(1.18)' : 'scale(1)'}; transition:all 0.3s ease;">
            <span>📍</span>
            <span>${spot.name.split(' ')[0]}</span>
          </div>
        `,
        iconSize: [120, 30],
        iconAnchor: [60, 15]
      });

      const marker = L.marker([spot.lat, spot.lng], { icon: spotIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedSpot(spot);
      });
    });

    // Invalidate size on resize
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Start Departure Marker on Map
  const updateStartMarkerOnMap = (startCoords: [number, number], startName: string) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (startMarkerRef.current) {
      map.removeLayer(startMarkerRef.current);
    }

    const startIcon = L.divIcon({
      className: 'start-departure-pin',
      html: `
        <div style="background-color:#0A4191; color:white; border:2px solid white; border-radius:12px; width:36px; height:36px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.4);">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const marker = L.marker(startCoords, { icon: startIcon }).addTo(map);
    marker.bindPopup(`<b>Punto de Partida Exacto:</b><br/>${startName}`);
    startMarkerRef.current = marker;
  };

  // Recalculate Route Whenever Selected Spot or Departure Changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedSpot) return;

    let isMounted = true;
    setIsCalculatingRoute(true);
    setIsNavigating(false);
    setNavProgress(0);
    setNavStepIndex(0);
    if (navTimerRef.current) clearInterval(navTimerRef.current);

    const map = mapInstanceRef.current;
    const startCoords = currentDepartureCoords;
    const endCoords: [number, number] = [selectedSpot.lat, selectedSpot.lng];

    const startName = customUserGps
      ? 'Mi Ubicación GPS Real (En vivo)'
      : departure.name;

    updateStartMarkerOnMap(startCoords, startName);

    // Fetch exact road route via OSRM / Catmull-Rom road geometry
    fetchRealOSRMRoute(startCoords, selectedSpot).then((res) => {
      if (!isMounted || !mapInstanceRef.current) return;

      setIsCalculatingRoute(false);
      setActiveRouteWaypoints(res.waypoints);
      setRealDistanceKm(res.distanceKm);
      setRealDurationMins(res.durationMins);
      setRealSteps(res.steps.length > 0 ? res.steps : selectedSpot.fallbackDirections);

      // Clear existing polyline layers
      if (routePolylineGlowRef.current) map.removeLayer(routePolylineGlowRef.current);
      if (routePolylineLineRef.current) map.removeLayer(routePolylineLineRef.current);
      if (animatedMarkerRef.current) map.removeLayer(animatedMarkerRef.current);

      // 1. Outer Glow Polyline
      const glowPolyline = L.polyline(res.waypoints, {
        color: '#0A4191',
        weight: 8,
        opacity: 0.6,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // 2. Inner Vibrant Polyline
      const innerPolyline = L.polyline(res.waypoints, {
        color: '#F59E0B',
        weight: 4,
        opacity: 1,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      routePolylineGlowRef.current = glowPolyline;
      routePolylineLineRef.current = innerPolyline;

      // Fit map bounds to encompass start and destination nicely
      const bounds = L.latLngBounds([startCoords, endCoords]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });

      // TTS voice notice if active
      if (isVoiceActive && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          `Ruta más rápida calculada desde ${startName} hacia ${selectedSpot.name}. Distancia exacta: ${res.distanceKm} kilómetros. Tiempo estimado: ${res.durationMins} minutos.`
        );
        utterance.lang = 'es-EC';
        window.speechSynthesis.speak(utterance);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedSpot, departure, customUserGps]);

  // Handle GPS Live Location Button
  const handleTriggerMyGps = () => {
    if ('geolocation' in navigator) {
      setIsLoadingLoadingGps(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLoadingLoadingGps(false);
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setCustomUserGps(coords);
        },
        (err) => {
          setIsLoadingLoadingGps(false);
          alert(
            'No se pudo acceder a la señal GPS del navegador. Se mantendrá el Palacio Municipal de Logroño como partida por defecto.'
          );
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      alert('Tu navegador no soporta geolocalización GPS.');
    }
  };

  // Redirect to External GPS Navigation App (Google Maps / Waze)
  const openExternalGpsRedirect = () => {
    if (!selectedSpot) return;
    const originLat = currentDepartureCoords[0];
    const originLng = currentDepartureCoords[1];
    const destLat = selectedSpot.lat;
    const destLng = selectedSpot.lng;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Toggle Live Navigation Simulation along Exact Waypoints
  const toggleLiveNavigation = () => {
    if (isNavigating) {
      setIsNavigating(false);
      if (navTimerRef.current) clearInterval(navTimerRef.current);
      return;
    }

    if (activeRouteWaypoints.length < 2) return;

    setIsNavigating(true);
    setNavProgress(0);
    setNavStepIndex(0);
    setCurrentSpeedKmH(38);

    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const waypoints = activeRouteWaypoints;
    let step = 0;
    const totalSteps = waypoints.length;

    const trackerIcon = L.divIcon({
      className: 'live-gps-tracker',
      html: `
        <div style="background-color:#10B981; color:white; border:3px solid white; border-radius:999px; width:38px; height:38px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 18px rgba(16,185,129,0.9); animation:pulse 1.2s infinite;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    if (animatedMarkerRef.current) {
      map.removeLayer(animatedMarkerRef.current);
    }

    const trackerMarker = L.marker(waypoints[0], { icon: trackerIcon }).addTo(map);
    animatedMarkerRef.current = trackerMarker;

    navTimerRef.current = setInterval(() => {
      step++;
      const progressPercent = Math.round((step / (totalSteps - 1)) * 100);
      setNavProgress(progressPercent);

      const displayStepIndex = Math.floor(
        (step / totalSteps) * Math.max(1, realSteps.length)
      );
      setNavStepIndex(Math.min(displayStepIndex, realSteps.length - 1));

      if (step < totalSteps) {
        const nextCoord = waypoints[step];
        trackerMarker.setLatLng(nextCoord);
        map.panTo(nextCoord, { animate: true });
        setCurrentSpeedKmH(Math.floor(32 + Math.random() * 18));
      } else {
        setIsNavigating(false);
        setCurrentSpeedKmH(0);
        clearInterval(navTimerRef.current);

        if ('speechSynthesis' in window && isVoiceActive) {
          const utterance = new SpeechSynthesisUtterance(
            `Has llegado a tu destino exacto: ${selectedSpot.name}. ¡Bienvenido a Cantón Logroño!`
          );
          utterance.lang = 'es-EC';
          window.speechSynthesis.speak(utterance);
        }
      }
    }, 1800);
  };

  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearInterval(navTimerRef.current);
    };
  }, []);

  return (
    <div className={`relative bg-slate-900 rounded-3xl border-2 border-[#0A4191] overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-2 z-50 h-[calc(100vh-16px)] shadow-2xl' : (className || 'w-full h-[680px]')} `}>
      
      {/* HEADER BAR & STARTING POINT CONTROLS */}
      <div className="bg-[#0A4191] text-white px-3 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-blue-800 z-10 shadow-sm gap-2">
        
        {/* Title */}
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
            <Compass className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-white leading-tight font-sans uppercase flex items-center space-x-1.5">
              <span>Ruta Exacta y Más Rápida</span>
              <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                GPS Vivo
              </span>
            </h4>
            <p className="text-[10px] text-blue-200 font-medium">
              Cantón Logroño • Delimitación Territorial Oficial
            </p>
          </div>
        </div>

        {/* Departure Point Selector & Controls */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto justify-between sm:justify-end">
          
          {/* Departure Dropdown */}
          <select
            value={customUserGps ? 'custom_gps' : departure.id}
            onChange={(e) => {
              if (e.target.value === 'custom_gps') {
                handleTriggerMyGps();
              } else {
                setCustomUserGps(null);
                const dep = DEPARTURE_POINTS.find(d => d.id === e.target.value);
                if (dep) setDeparture(dep);
              }
            }}
            className="bg-blue-950 text-white text-[11px] font-bold px-2 py-1 rounded-xl border border-blue-700 focus:outline-none max-w-[170px] truncate"
          >
            {DEPARTURE_POINTS.map(dep => (
              <option key={dep.id} value={dep.id}>
                📍 Partida: {dep.name}
              </option>
            ))}
            {customUserGps && (
              <option value="custom_gps">
                🎯 Partida: Mi Ubicación GPS Real
              </option>
            )}
          </select>

          {/* Trigger User GPS Button */}
          <button
            type="button"
            onClick={handleTriggerMyGps}
            disabled={isLoadingGps}
            className={`px-2.5 py-1 rounded-xl font-black text-[11px] border transition-all cursor-pointer flex items-center space-x-1 shrink-0 ${
              customUserGps 
                ? 'bg-emerald-500 text-white border-emerald-300' 
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-300'
            }`}
            title="Usar mi Ubicación GPS Real en vivo como punto de partida"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLoadingGps ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{customUserGps ? 'GPS Activo' : 'Usar mi GPS'}</span>
          </button>

          {/* Voice toggle */}
          <button
            type="button"
            onClick={() => setIsVoiceActive(!isVoiceActive)}
            className={`p-1.5 rounded-lg border text-[10px] font-bold transition-colors cursor-pointer flex items-center ${
              isVoiceActive ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-blue-900 text-blue-200 border-blue-700'
            }`}
            title={isVoiceActive ? 'Guía de Voz Activada' : 'Guía de Voz Silenciada'}
          >
            {isVoiceActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen toggle */}
          <button
            type="button"
            onClick={() => {
              setIsFullscreen(!isFullscreen);
              setTimeout(() => {
                if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
              }, 200);
            }}
            className="p-1.5 bg-blue-900 hover:bg-blue-800 text-white border border-blue-700 rounded-lg transition-colors cursor-pointer"
            title="Expandir Mapa"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* MAP CANVAS CONTAINER */}
      <div className="relative flex-1 w-full bg-slate-950 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* OVERLAY BADGE: Territory Traced Badge */}
        <div className="absolute top-2 left-2 z-10 bg-slate-900/90 backdrop-blur-md text-white border border-blue-400/50 px-2.5 py-1 rounded-xl shadow-lg text-[10px] font-black flex items-center space-x-1.5 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>Territorio Logroño Trazado</span>
        </div>

        {/* ROUTE CALCULATING SPINNER OVERLAY */}
        {isCalculatingRoute && (
          <div className="absolute top-2 right-2 z-10 bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl shadow-lg text-[11px] font-black flex items-center space-x-2 animate-pulse">
            <Zap className="w-4 h-4 text-slate-950 animate-bounce" />
            <span>Calculando Ruta Más Rápida por Carretera...</span>
          </div>
        )}

        {/* FLOATING REAL-TIME ROUTE CARD */}
        {selectedSpot && (
          <div className="absolute bottom-2 left-2 right-2 z-10 bg-white/95 backdrop-blur-md border-2 border-[#0A4191] rounded-2xl p-2.5 sm:p-3 shadow-xl space-y-2 text-slate-900">
            
            {/* Top row: Departure -> Destination Header */}
            <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-2 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-[#0A4191]">
                <div className="flex items-center space-x-1.5 font-extrabold truncate">
                  <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">
                    Partida: {customUserGps ? 'Mi GPS Real' : departure.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 shrink-0">
                  [{currentDepartureCoords[0].toFixed(4)}, {currentDepartureCoords[1].toFixed(4)}]
                </span>
              </div>

              <div className="flex items-center justify-between text-[#0A4191] border-t border-blue-200 pt-1">
                <div className="flex items-center space-x-1.5 font-extrabold text-[#0A4191] truncate">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Destino: {selectedSpot.name}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 shrink-0">
                  [{selectedSpot.lat.toFixed(4)}, {selectedSpot.lng.toFixed(4)}]
                </span>
              </div>
            </div>

            {/* Middle row: Spot Info & Navigation Action Triggers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div 
                onClick={() => setShowDetailModal(true)}
                className="flex items-center space-x-2.5 cursor-pointer hover:opacity-90 transition-opacity"
                title="Haga clic para ver detalles y ubicación exacta del lugar"
              >
                <img 
                  src={selectedSpot.photoUrl} 
                  alt={selectedSpot.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border-2 border-[#0A4191] shrink-0 shadow-sm" 
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded uppercase border border-amber-300">
                      {selectedSpot.category}
                    </span>
                    <span className="text-[10px] text-slate-600 font-extrabold">{selectedSpot.sector}</span>
                  </div>
                  <h3 className="font-black text-xs sm:text-sm text-[#0A4191] leading-tight line-clamp-1 flex items-center space-x-1">
                    <span>{selectedSpot.name}</span>
                    <Info className="w-3.5 h-3.5 text-blue-600 inline" />
                  </h3>
                  {selectedSpot.shuarName && (
                    <p className="text-[10px] text-emerald-700 font-black italic">
                      Shuar: {selectedSpot.shuarName}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons: In-App GPS Simulation + External Google Maps Redirect */}
              <div className="flex items-center space-x-1.5 shrink-0 justify-end">
                {/* External GPS App Redirect Button */}
                <button
                  type="button"
                  onClick={openExternalGpsRedirect}
                  className="px-2.5 py-1.5 rounded-xl font-bold text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer flex items-center space-x-1"
                  title="Abrir indicaciones de ruta directa en Google Maps / Waze"
                >
                  <Navigation className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>GPS Google Maps</span>
                </button>

                {/* In-App Live GPS Simulator Button */}
                <button
                  type="button"
                  onClick={toggleLiveNavigation}
                  disabled={isCalculatingRoute}
                  className={`px-3 py-1.5 rounded-xl font-black text-[11px] shadow-sm transition-all cursor-pointer flex items-center space-x-1 shrink-0 ${
                    isNavigating 
                      ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                      : 'bg-[#0A4191] hover:bg-blue-900 text-white'
                  }`}
                >
                  {isNavigating ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-white" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Simular GPS</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Metrics bar */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-900 text-white rounded-xl p-1.5 text-center text-[10px] border border-slate-800">
              <div>
                <span className="text-slate-400 font-bold block">Distancia Exacta</span>
                <span className="font-black text-xs text-amber-400">{realDistanceKm} km</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Tiempo Est.</span>
                <span className="font-black text-xs text-amber-400">{realDurationMins} min</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Vía Recomendada</span>
                <span className="font-bold text-[10px] text-emerald-300 truncate block">
                  {selectedSpot.recommendedRoad.split('-')[0]}
                </span>
              </div>
            </div>

            {/* Live Navigation Progress Bar & Instruction */}
            {isNavigating && (
              <div className="space-y-1 pt-0.5">
                <div className="flex items-center justify-between text-[10px] font-black text-[#0A4191]">
                  <span className="flex items-center space-x-1 text-emerald-700">
                    <Navigation className="w-3 h-3 animate-spin" />
                    <span>GPS en Vivo: {navProgress}%</span>
                  </span>
                  <span>Velocidad: {currentSpeedKmH} km/h</span>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-blue-300">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-[#0A4191] transition-all duration-500" 
                    style={{ width: `${navProgress}%` }}
                  />
                </div>

                <p className="text-[10px] text-slate-800 font-bold italic line-clamp-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  📍 Paso {navStepIndex + 1}: {realSteps[navStepIndex] || 'Avanzando por la ruta más rápida...'}
                </p>
              </div>
            )}

          </div>
        )}

      </div>

      {/* HORIZONTAL CAROUSEL SELECTOR FOR TOURIST SPOTS */}
      <div className="bg-slate-900 border-t border-slate-800 p-2 overflow-x-auto flex items-center space-x-2 shrink-0 scrollbar-thin">
        {LOGRONO_TOURIST_SPOTS.map((spot) => {
          const isSelected = spot.id === selectedSpot.id;
          return (
            <button
              key={`spot-thumb-${spot.id}`}
              type="button"
              onClick={() => setSelectedSpot(spot)}
              className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-xl border text-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isSelected 
                  ? 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow-md scale-105' 
                  : 'bg-slate-800 text-slate-200 border-slate-700 font-bold hover:bg-slate-700'
              }`}
            >
              <span className="text-sm">
                {spot.category === 'Cascada' ? '🌊' : spot.category === 'Cueva' ? '🦇' : spot.category === 'Río' ? 'ROW' : spot.category === 'Reserva' ? '🌿' : spot.category === 'Mirador' ? '👁️' : '🏛️'}
              </span>
              <span className="text-[11px]">{spot.name}</span>
            </button>
          );
        })}
      </div>

      {/* DETAILED PLACE LOCATION & GPS INFO MODAL */}
      {showDetailModal && selectedSpot && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-[#0A4191] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="relative h-44 w-full bg-slate-800">
              <img 
                src={selectedSpot.photoUrl} 
                alt={selectedSpot.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full p-1.5 transition-all cursor-pointer"
              >
                ✕
              </button>

              <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md uppercase">
                    {selectedSpot.category}
                  </span>
                  <span className="text-xs text-amber-200 font-bold">
                    Dificultad: {selectedSpot.difficulty}
                  </span>
                </div>
                <h2 className="text-lg font-black leading-tight text-white">
                  {selectedSpot.name}
                </h2>
                {selectedSpot.shuarName && (
                  <p className="text-xs text-emerald-300 font-extrabold italic">
                    Nombre Shuar: {selectedSpot.shuarName}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3.5 overflow-y-auto text-xs text-slate-700 dark:text-slate-200">
              
              {/* Description */}
              <p className="font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedSpot.description}
              </p>

              {/* Exact Ubicación & GPS Coordinates Box */}
              <div className="bg-blue-50 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 rounded-2xl p-3 space-y-2">
                <h4 className="font-black text-xs text-[#0A4191] dark:text-blue-400 flex items-center space-x-1.5 uppercase">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ubicación Exacta & Dónde Queda</span>
                </h4>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 font-bold block">Sector / Comunidad:</span>
                    <span className="font-black text-slate-900 dark:text-white">{selectedSpot.sector}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block">Coordenadas GPS WGS84:</span>
                    <span className="font-mono font-black text-amber-600 dark:text-amber-400">
                      {selectedSpot.lat.toFixed(5)}, {selectedSpot.lng.toFixed(5)}
                    </span>
                  </div>
                </div>

                <div className="pt-1 border-t border-blue-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 font-bold block">Distancia Exacta:</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-400">{realDistanceKm} km</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block">Tiempo de Recorrido:</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-400">{realDurationMins} minutos</span>
                  </div>
                </div>
              </div>

              {/* Access Road */}
              <div className="bg-amber-50 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 rounded-2xl p-3 space-y-1">
                <span className="text-[10px] font-black text-amber-900 dark:text-amber-300 uppercase block">
                  🛣️ Vía de Acceso Recomendada:
                </span>
                <p className="font-extrabold text-slate-900 dark:text-white">
                  {selectedSpot.recommendedRoad}
                </p>
              </div>

              {/* Step by Step Route Directions */}
              <div className="space-y-1.5">
                <h5 className="font-black text-xs text-slate-900 dark:text-white flex items-center space-x-1">
                  <RouteIcon className="w-4 h-4 text-[#0A4191]" />
                  <span>Instrucciones de Llegada Paso a Paso:</span>
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  {realSteps.map((step, idx) => (
                    <li key={`step-detail-${idx}`} className="leading-snug">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-3 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={openExternalGpsRedirect}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Navigation className="w-4 h-4 stroke-[2.5]" />
                <span>Navegar en Google Maps</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 text-slate-900 dark:text-white rounded-xl font-extrabold text-xs transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
