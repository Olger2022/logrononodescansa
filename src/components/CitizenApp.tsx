import React, { useState } from 'react';
import { Incident, IncidentCategory, LogronoSector, LanguageMode, AIAnalysisResult, UserProfile, AgendaEvent } from '../types';
import { SHUAR_DICTIONARY } from '../data/shuarDictionary';
import { LogronoGoogleMap } from './LogronoGoogleMap';
import { WelcomeTouristMap } from './WelcomeTouristMap';
import { ReportIncidentChat } from './ReportIncidentChat';
import { validateName, validateEcuadorianCedula, validatePhone, validateEmail } from '../utils/validation';
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
  Settings,
  ListFilter,
  HardHat,
  Megaphone,
  MessageSquare,
  Edit3,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  LayoutGrid,
  Table,
  Users
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
  },
  {
    id: 'news-5',
    title: 'Feria Gastronómica y Artesanal Shuar en Logroño',
    date: '10/05/2024',
    category: 'eventos',
    categoryLabel: 'Eventos',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&auto=format&fit=crop&q=80',
    summary: 'Exposición de platos tradicionales, chicha de chonta y productos agrícolas locales en la Plaza Intercultural.',
    content: 'El departamento de Desarrollo Social y Turismo del GAD Logroño invita a toda la ciudadanía a disfrutar de la Gran Feria Intercultural. Habrá presentaciones de danza tradicional Shuar y emprendimientos agrícolas.'
  },
  {
    id: 'news-6',
    title: 'Construcción del nuevo Puente Peatonal sobre el Río Upano',
    date: '02/05/2024',
    category: 'obras',
    categoryLabel: 'Obras',
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&auto=format&fit=crop&q=80',
    summary: 'Firma de contrato de obra pública para conectar a las comunidades de Yaupi con la cabecera cantonal.',
    content: 'Con una inversión histórica municipal, el Alcalde dio inicio a las obras preliminares del puente colgante peatonal y carrozable ligero. Se beneficiará a más de 3.500 habitantes comunales.'
  }
];

export interface TramiteCatalogItem {
  id: string;
  code: string;
  name: string;
  department: string;
  category: 'avaluos' | 'obras' | 'agua' | 'patentes' | 'pqrs';
  categoryLabel: string;
  description: string;
  requirements: string[];
  responseTime: string;
  cost: string;
  isOnline: boolean;
}

export interface UserTramiteRecord {
  id: string;
  code: string;
  type: string;
  subject: string;
  department: string;
  date: string;
  status: 'aprobado' | 'en_proceso' | 'en_revision' | 'rechazado';
  applicant: string;
  observation: string;
  downloadUrl?: string;
}

export const MOCK_TRAMITES_CATALOG: TramiteCatalogItem[] = [
  {
    id: 'trm-cat-1',
    code: 'TRM-CAT-01',
    name: 'Certificado de No Adeudar al Municipio',
    department: 'Tesorería & Avalúos',
    category: 'avaluos',
    categoryLabel: 'Avalúos y Catastros',
    description: 'Documento oficial habilitante que valida que el ciudadano se encuentra al día en el pago de sus obligaciones tributarias cantonales.',
    requirements: ['Cédula de Identidad del titular', 'Papeleta de votación actualizada', 'Comprobante de pago de tasa de trámite ($2.00)'],
    responseTime: '24 horas hábiles',
    cost: '$2.00 USD',
    isOnline: true
  },
  {
    id: 'trm-cat-2',
    code: 'TRM-CAT-02',
    name: 'Solicitud de Conexión y Medidor de Agua Potable',
    department: 'Dirección de Agua Potable y Saneamiento',
    category: 'agua',
    categoryLabel: 'Agua y Alcantarillado',
    description: 'Trámite para solicitar la instalación del servicio de agua potable y medidor domiciliario en sectores urbanos y rurales del cantón Logroño.',
    requirements: ['Copia de escritura del predio o certificado de posesión', 'Cédula del propietario', 'Inspección técnica previa en el lugar'],
    responseTime: '3 a 5 días hábiles',
    cost: '$25.00 USD',
    isOnline: true
  },
  {
    id: 'trm-cat-3',
    code: 'TRM-CAT-03',
    name: 'Licencia de Construcción Menor y Cerramientos Prediales',
    department: 'Planificación Urbano-Rural y Obras Públicas',
    category: 'obras',
    categoryLabel: 'Obras y Planificación',
    description: 'Aprobación municipal para la edificación de cerramientos, remodelaciones o construcciones de un solo piso.',
    requirements: ['Croquis o plano arquitectónico de la obra', 'Certificado de Línea de Fábrica', 'Copias de cédula y papeleta de votación'],
    responseTime: '48 a 72 horas',
    cost: '$15.00 USD',
    isOnline: true
  },
  {
    id: 'trm-cat-4',
    code: 'TRM-CAT-04',
    name: 'Licencia Única de Funcionamiento y Patente Municipal (LUAE)',
    department: 'Rentas y Comisaría Municipal',
    category: 'patentes',
    categoryLabel: 'Patentes y Comercio',
    description: 'Permiso anual obligatorio para el funcionamiento de establecimientos comerciales, artesanales e industriales en el Cantón Logroño.',
    requirements: ['RUC activo del establecimiento', 'Formulario de declaración de patrimonio/activos', 'Inspección de prevención de incendios'],
    responseTime: '2 a 4 días hábiles',
    cost: 'Según activos ($10 - $50)',
    isOnline: true
  },
  {
    id: 'trm-cat-5',
    code: 'TRM-CAT-05',
    name: 'Certificado de Avalúos y Propiedad Catastral',
    department: 'Dirección de Avalúos y Catastros',
    category: 'avaluos',
    categoryLabel: 'Avalúos y Catastros',
    description: 'Emisión de certificado catastral que acredita los linderos, avalúo comercial y superficie del predio urbano o rural.',
    requirements: ['Número de clave catastral o dirección del predio', 'Cédula de identidad', 'Comprobante de pago de especies'],
    responseTime: '24 a 48 horas',
    cost: '$5.00 USD',
    isOnline: true
  },
  {
    id: 'trm-cat-6',
    code: 'TRM-CAT-06',
    name: 'Ingreso de Petición, Queja o Sugerencia (PQRS Ciudadana)',
    department: 'Secretaría General & Participación Ciudadana',
    category: 'pqrs',
    categoryLabel: 'PQRS y Atenciones',
    description: 'Canal de recepción de peticiones formales, quejas sobre servicios, solicitudes comunitarias o reclamos dirigidos a la Alcaldía.',
    requirements: ['Nombres completos y número de cédula', 'Detalle redactado del requerimiento', 'Documentación o fotos de respaldo (opcional)'],
    responseTime: '2 a 3 días hábiles',
    cost: 'Gratuito ($0.00)',
    isOnline: true
  }
];

export const INITIAL_USER_TRAMITES: UserTramiteRecord[] = [
  {
    id: 'usr-trm-1',
    code: 'TRM-2026-0811',
    type: 'Certificado de No Adeudar al Municipio',
    subject: 'Solicitud de Certificado de Solvencia Tributaria para Trámite Bancario',
    department: 'Tesorería Municipal',
    date: '11/08/2026',
    status: 'aprobado',
    applicant: 'María Fernanda Shakaim',
    observation: 'Trámite aprobado y firmado digitalmente. Certificado oficial disponible para descarga.',
    downloadUrl: '#'
  },
  {
    id: 'usr-trm-2',
    code: 'TRM-2026-0792',
    type: 'Conexión de Agua Potable',
    subject: 'Inspección técnica para acometida domiciliaria en Yaupi',
    department: 'Agua Potable y Saneamiento',
    date: '05/08/2026',
    status: 'en_proceso',
    applicant: 'María Fernanda Shakaim',
    observation: 'Brigada técnica programada para inspección en territorio el 14/08/2026.'
  },
  {
    id: 'usr-trm-3',
    code: 'TRM-2026-0640',
    type: 'Licencia de Cerramiento Predial',
    subject: 'Solicitud de construcción de muro perimetral en Barrio Central',
    department: 'Planificación Urbano-Rural',
    date: '20/07/2026',
    status: 'en_revision',
    applicant: 'María Fernanda Shakaim',
    observation: 'En revisión técnica de planos por el Comisario de Obras Públicas.'
  }
];

export type CitizenSubTab = 'inicio' | 'reportar' | 'mis_reportes' | 'noticias' | 'agenda' | 'perfil' | 'configuracion' | 'mapa' | 'pqrs' | 'directorio';

interface CitizenAppProps {
  incidents: Incident[];
  onAddIncident: (newInc: Incident) => void;
  lang: LanguageMode;
  isOnline: boolean;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  activeSubTab?: CitizenSubTab;
  onSubTabChange?: (tab: CitizenSubTab) => void;
  selectedNewsItem?: NewsItem | null;
  onSelectNewsItem?: (news: NewsItem | null) => void;
}

export const CitizenApp: React.FC<CitizenAppProps> = ({
  incidents,
  onAddIncident,
  lang,
  isOnline,
  currentUser,
  onLogout,
  activeSubTab,
  onSubTabChange,
  selectedNewsItem,
  onSelectNewsItem
}) => {
  const [internalTab, setInternalTab] = useState<CitizenSubTab>('inicio');
  const citizenTab = activeSubTab !== undefined ? activeSubTab : internalTab;
  const setCitizenTab = (tab: CitizenSubTab) => {
    setInternalTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  const [internalNews, setInternalNews] = useState<NewsItem | null>(null);
  const selectedNews = selectedNewsItem !== undefined ? selectedNewsItem : internalNews;
  const setSelectedNews = (news: NewsItem | null) => {
    setInternalNews(news);
    if (onSelectNewsItem) onSelectNewsItem(news);
  };

  const [mapSubTab, setMapSubTab] = useState<'turismo' | 'incidentes'>('turismo');
  const [reportStep, setReportStep] = useState<'category' | 'wizard'>('category');
  const [reportWizardStep, setReportWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [misReportesFilter, setMisReportesFilter] = useState<'todos' | 'en_proceso' | 'solucionados'>('todos');
  const [misReportesSortBy, setMisReportesSortBy] = useState<'fecha_desc' | 'fecha_asc' | 'prioridad_desc' | 'prioridad_asc'>('fecha_desc');
  const [noticiasFilter, setNoticiasFilter] = useState<'todos' | 'comunicados' | 'obras' | 'eventos'>('todos');
  const [noticiasViewMode, setNoticiasViewMode] = useState<'tarjetas' | 'tabla'>('tarjetas');
  const [noticiasSearchTerm, setNoticiasSearchTerm] = useState<string>('');
  const [noticiasSortOrder, setNoticiasSortOrder] = useState<'recientes' | 'antiguas'>('recientes');
  const SPANISH_MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const [currentCalendarYear, setCurrentCalendarYear] = useState<number>(new Date().getFullYear());
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<number>(new Date().getMonth());
  const [selectedAgendaDay, setSelectedAgendaDay] = useState<number>(new Date().getDate());
  const [showReportInfo, setShowReportInfo] = useState<boolean>(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);

  // Synchronize profile data and user fields when currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        cedula: currentUser.cedula || '',
        sector: currentUser.sector || 'Logroño Centro (Cabecera)',
        avatarUrl: currentUser.avatarUrl || ''
      });
      if (currentUser.name) setCitizenName(currentUser.name);
      if (currentUser.phone) setCitizenPhone(currentUser.phone);
      if (currentUser.cedula) setCitizenCedula(currentUser.cedula);
    }
  }, [currentUser]);

  // Dynamic Current Date Helper Constants
  const realCurrentYear = new Date().getFullYear();
  const realCurrentMonthName = SPANISH_MONTHS[new Date().getMonth()];
  const realCurrentDay = new Date().getDate();

  // Agenda Municipal State with Dynamic Events
  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>([
    {
      id: 'evt-1',
      title: 'Minga Comunitaria de Limpieza y Reforestación',
      day: realCurrentDay,
      month: realCurrentMonthName,
      year: realCurrentYear,
      time: '08:00 AM',
      location: 'Parque Central de Logroño',
      description: 'Jornada participativa con vecinos y comunidades para la limpieza de espacios verdes y reforestación con plantas nativas.',
      category: 'Minga'
    },
    {
      id: 'evt-2',
      title: 'Sesión Ordinaria de Cabildo Cantonal',
      day: realCurrentDay,
      month: realCurrentMonthName,
      year: realCurrentYear,
      time: '15:00 PM',
      location: 'Sala de Sesiones GAD Municipal',
      description: 'Tratamiento de ordenanzas cantonales y socialización de obras en el sector Transkutukú.',
      category: 'Cabildo'
    },
    {
      id: 'evt-3',
      title: 'Feria Intercultural Shuar y Agroecológica',
      day: Math.min(28, realCurrentDay + 1),
      month: realCurrentMonthName,
      year: realCurrentYear,
      time: '09:00 AM',
      location: 'Plaza Intercultural de Logroño',
      description: 'Exposición y venta de gastronomía típica, artesanías Shuar, medicina ancestral y productos agrícolas locales.',
      category: 'Cultura'
    },
    {
      id: 'evt-4',
      title: 'Campeonato Deportivo Interparroquial Yaupi - Shimpis',
      day: Math.min(28, realCurrentDay + 3),
      month: realCurrentMonthName,
      year: realCurrentYear,
      time: '10:00 AM',
      location: 'Estadio Municipal de Logroño',
      description: 'Encuentro relámpago de fútbol masculino, femenino y ecuavoley con delegaciones parroquiales.',
      category: 'Deportes'
    }
  ]);

  const [isSyncingAgenda, setIsSyncingAgenda] = useState<boolean>(false);
  const [agendaSyncToast, setAgendaSyncToast] = useState<string | null>(null);
  const [agendaToast, setAgendaToast] = useState<string | null>(null);

  // Agenda Modals & Form State
  const [showCreateAgendaModal, setShowCreateAgendaModal] = useState<boolean>(false);
  const [showEditAgendaModal, setShowEditAgendaModal] = useState<boolean>(false);
  const [editingAgendaEvent, setEditingAgendaEvent] = useState<AgendaEvent | null>(null);

  const [agendaFormTitle, setAgendaFormTitle] = useState('');
  const [agendaFormDay, setAgendaFormDay] = useState<number>(new Date().getDate());
  const [agendaFormMonth, setAgendaFormMonth] = useState<string>(SPANISH_MONTHS[new Date().getMonth()]);
  const [agendaFormYear, setAgendaFormYear] = useState<number>(new Date().getFullYear());
  const [agendaFormTime, setAgendaFormTime] = useState('09:00 AM');

  // Calendar Navigation Functions
  const handlePrevCalendarMonth = () => {
    if (currentCalendarMonth === 0) {
      setCurrentCalendarMonth(11);
      setCurrentCalendarYear((prev) => prev - 1);
    } else {
      setCurrentCalendarMonth((prev) => prev - 1);
    }
  };

  const handleNextCalendarMonth = () => {
    if (currentCalendarMonth === 11) {
      setCurrentCalendarMonth(0);
      setCurrentCalendarYear((prev) => prev + 1);
    } else {
      setCurrentCalendarMonth((prev) => prev + 1);
    }
  };

  const handleJumpCalendarToToday = () => {
    const now = new Date();
    setCurrentCalendarYear(now.getFullYear());
    setCurrentCalendarMonth(now.getMonth());
    setSelectedAgendaDay(now.getDate());
  };
  const [agendaFormLocation, setAgendaFormLocation] = useState('Parque Central de Logroño');
  const [agendaFormCategory, setAgendaFormCategory] = useState<'Minga' | 'Cabildo' | 'Cultura' | 'Deportes' | 'Inauguración' | 'General'>('General');
  const [agendaFormDescription, setAgendaFormDescription] = useState('');
  const [agendaFormError, setAgendaFormError] = useState<string | null>(null);

  const handleOpenCreateAgenda = (dayToSet?: number) => {
    setAgendaFormTitle('');
    setAgendaFormDay(dayToSet || selectedAgendaDay || new Date().getDate());
    setAgendaFormMonth(SPANISH_MONTHS[currentCalendarMonth]);
    setAgendaFormYear(currentCalendarYear);
    setAgendaFormTime('09:00 AM');
    setAgendaFormLocation('Logroño Centro / GAD Municipal');
    setAgendaFormCategory('General');
    setAgendaFormDescription('');
    setAgendaFormError(null);
    setShowCreateAgendaModal(true);
  };

  const handleOpenEditAgenda = (event: AgendaEvent) => {
    setEditingAgendaEvent(event);
    setAgendaFormTitle(event.title);
    setAgendaFormDay(event.day);
    setAgendaFormMonth(event.month || SPANISH_MONTHS[currentCalendarMonth]);
    setAgendaFormYear(event.year || currentCalendarYear);
    setAgendaFormTime(event.time);
    setAgendaFormLocation(event.location);
    setAgendaFormCategory(event.category || 'General');
    setAgendaFormDescription(event.description || '');
    setAgendaFormError(null);
    setShowEditAgendaModal(true);
  };

  const handleSaveCreateAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaFormTitle.trim()) {
      setAgendaFormError('Por favor ingresa el título de la agenda o evento.');
      return;
    }
    if (!agendaFormLocation.trim()) {
      setAgendaFormError('Por favor ingresa la ubicación o lugar.');
      return;
    }

    const newEvent: AgendaEvent = {
      id: `evt-${Date.now()}`,
      title: agendaFormTitle.trim(),
      day: Number(agendaFormDay),
      month: agendaFormMonth || SPANISH_MONTHS[currentCalendarMonth],
      year: Number(agendaFormYear) || currentCalendarYear,
      time: agendaFormTime.trim() || '09:00 AM',
      location: agendaFormLocation.trim(),
      category: agendaFormCategory,
      description: agendaFormDescription.trim()
    };

    setAgendaEvents((prev) => [newEvent, ...prev]);
    setSelectedAgendaDay(Number(agendaFormDay));
    setShowCreateAgendaModal(false);
    setAgendaToast(`Evento "${newEvent.title}" creado con éxito`);
    setTimeout(() => setAgendaToast(null), 3500);
  };

  const handleSaveEditAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgendaEvent) return;
    if (!agendaFormTitle.trim()) {
      setAgendaFormError('Por favor ingresa el título de la agenda.');
      return;
    }

    setAgendaEvents((prev) =>
      prev.map((ev) =>
        ev.id === editingAgendaEvent.id
          ? {
              ...ev,
              title: agendaFormTitle.trim(),
              day: Number(agendaFormDay),
              month: agendaFormMonth || SPANISH_MONTHS[currentCalendarMonth],
              year: Number(agendaFormYear) || currentCalendarYear,
              time: agendaFormTime.trim() || '09:00 AM',
              location: agendaFormLocation.trim(),
              category: agendaFormCategory,
              description: agendaFormDescription.trim()
            }
          : ev
      )
    );

    setShowEditAgendaModal(false);
    setEditingAgendaEvent(null);
    setAgendaToast(`Evento "${agendaFormTitle.trim()}" actualizado correctamente`);
    setTimeout(() => setAgendaToast(null), 3500);
  };

  const handleDeleteAgendaEvent = (eventId: string, title: string) => {
    setAgendaEvents((prev) => prev.filter((ev) => ev.id !== eventId));
    setAgendaToast(`Evento "${title}" eliminado de la agenda`);
    setTimeout(() => setAgendaToast(null), 3500);
  };

  const handleSyncAgenda = () => {
    setIsSyncingAgenda(true);
    setAgendaSyncToast('Sincronizando agenda municipal con el servidor...');
    setTimeout(() => {
      setIsSyncingAgenda(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setAgendaSyncToast(`Agenda sincronizada correctamente (${timeStr})`);
      setTimeout(() => setAgendaSyncToast(null), 4000);
    }, 1000);
  };

  // Agenda View Mode & Filter States
  const [agendaViewMode, setAgendaViewMode] = useState<'calendario' | 'tabla'>('calendario');
  const [agendaCategoryFilter, setAgendaCategoryFilter] = useState<'todos' | 'Minga' | 'Cabildo' | 'Cultura' | 'Deportes' | 'General'>('todos');
  const [agendaSearchTerm, setAgendaSearchTerm] = useState<string>('');

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
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    cedula: currentUser?.cedula || '',
    sector: currentUser?.sector || 'Logroño Centro (Cabecera)',
    avatarUrl: currentUser?.avatarUrl || ''
  });

  // Profile Sub-modals & Edit States
  const [showMisDatosModal, setShowMisDatosModal] = useState(false);
  const [showNotifSettingsModal, setShowNotifSettingsModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showHelpSupportModal, setShowHelpSupportModal] = useState(false);
  const [profileToast, setProfileToast] = useState<string | null>(null);
  const [profileValidationError, setProfileValidationError] = useState<string | null>(null);

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
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Confirmation Modals State (Logout and Cancel Procedure/Trámite)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showCancelTramiteConfirm, setShowCancelTramiteConfirm] = useState(false);
  const [pendingCancelType, setPendingCancelType] = useState<'pqrs' | 'wizard' | null>(null);

  const handleTriggerCancelTramite = (type: 'pqrs' | 'wizard') => {
    if (type === 'pqrs' && (pqrsSubject.trim() || pqrsDetail.trim())) {
      setPendingCancelType('pqrs');
      setShowCancelTramiteConfirm(true);
    } else if (type === 'pqrs') {
      setCitizenTab('inicio');
    } else if (type === 'wizard' && (description.trim() || reportWizardStep > 1)) {
      setPendingCancelType('wizard');
      setShowCancelTramiteConfirm(true);
    } else if (type === 'wizard') {
      setReportStep('category');
    }
  };

  const handleConfirmCancelTramite = () => {
    if (pendingCancelType === 'pqrs') {
      setPqrsSubject('');
      setPqrsDetail('');
      setPqrsType('Petición');
      setPqrsSuccess(false);
      setCitizenTab('inicio');
    } else if (pendingCancelType === 'wizard') {
      setReportStep('category');
      setReportWizardStep(1);
      setDescription('');
      setTitle('');
      setPhotoUrl('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80');
      setCitizenTab('inicio');
    }
    setShowCancelTramiteConfirm(false);
    setPendingCancelType(null);
  };

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
  const [reportLat, setReportLat] = useState<number>(-2.6280);
  const [reportLng, setReportLng] = useState<number>(-78.1760);
  const [reference, setReference] = useState('');
  const [citizenName, setCitizenName] = useState(currentUser?.name || profileData.name || '');
  const [citizenPhone, setCitizenPhone] = useState(currentUser?.phone || profileData.phone || '');
  const [citizenCedula, setCitizenCedula] = useState(currentUser?.cedula || profileData.cedula || '');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80');
  const [reportValidationError, setReportValidationError] = useState<string | null>(null);
  
  // AI Analysis State
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiPreview, setAiPreview] = useState<AIAnalysisResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Selected Incident for Detail Modal
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Shuar Audio Simulation State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // PQRS & Trámites Form state
  const [pqrsType, setPqrsType] = useState<'Petición' | 'Queja' | 'Reclamo' | 'Sugerencia' | 'Certificado' | 'Inspección'>('Petición');
  const [pqrsSubject, setPqrsSubject] = useState('');
  const [pqrsDetail, setPqrsDetail] = useState('');
  const [pqrsSuccess, setPqrsSuccess] = useState(false);

  // Trámites & Servicios State
  const [tramiteMainTab, setTramiteMainTab] = useState<'catalogo' | 'mis_tramites' | 'solicitar'>('catalogo');
  const [tramiteCatFilter, setTramiteCatFilter] = useState<'todos' | 'avaluos' | 'obras' | 'agua' | 'patentes' | 'pqrs'>('todos');
  const [tramiteSearch, setTramiteSearch] = useState<string>('');
  const [tramiteCatalogViewMode, setTramiteCatalogViewMode] = useState<'tabla' | 'tarjetas'>('tabla');
  const [selectedTramiteCatalog, setSelectedTramiteCatalog] = useState<TramiteCatalogItem | null>(null);
  const [userTramitesList, setUserTramitesList] = useState<UserTramiteRecord[]>(INITIAL_USER_TRAMITES);
  const [selectedUserTramite, setSelectedUserTramite] = useState<UserTramiteRecord | null>(null);

  // Edit & Delete Tramite State
  const [editingUserTramite, setEditingUserTramite] = useState<UserTramiteRecord | null>(null);
  const [deletingUserTramite, setDeletingUserTramite] = useState<UserTramiteRecord | null>(null);
  const [tramiteNoticeMsg, setTramiteNoticeMsg] = useState<string | null>(null);

  // Edit form state
  const [editType, setEditType] = useState<string>('');
  const [editSubject, setEditSubject] = useState<string>('');
  const [editDepartment, setEditDepartment] = useState<string>('');
  const [editStatus, setEditStatus] = useState<'aprobado' | 'en_proceso' | 'en_revision' | 'rechazado'>('en_proceso');
  const [editObservation, setEditObservation] = useState<string>('');

  const handleOpenEditUserTramite = (tr: UserTramiteRecord) => {
    setEditingUserTramite(tr);
    setEditType(tr.type);
    setEditSubject(tr.subject);
    setEditDepartment(tr.department);
    setEditStatus(tr.status);
    setEditObservation(tr.observation || '');
  };

  const handleSaveEditedUserTramite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserTramite) return;

    const updatedList = userTramitesList.map((tr) => {
      if (tr.id === editingUserTramite.id) {
        return {
          ...tr,
          type: editType,
          subject: editSubject,
          department: editDepartment,
          status: editStatus,
          observation: editObservation
        };
      }
      return tr;
    });

    setUserTramitesList(updatedList);
    if (selectedUserTramite && selectedUserTramite.id === editingUserTramite.id) {
      setSelectedUserTramite({
        ...selectedUserTramite,
        type: editType,
        subject: editSubject,
        department: editDepartment,
        status: editStatus,
        observation: editObservation
      });
    }
    setEditingUserTramite(null);
    setTramiteNoticeMsg(`¡Trámite ${editingUserTramite.code} actualizado exitosamente!`);
    setTimeout(() => setTramiteNoticeMsg(null), 4000);
  };

  const handleConfirmDeleteUserTramite = () => {
    if (!deletingUserTramite) return;
    const code = deletingUserTramite.code;
    setUserTramitesList(userTramitesList.filter((tr) => tr.id !== deletingUserTramite.id));
    if (selectedUserTramite?.id === deletingUserTramite.id) {
      setSelectedUserTramite(null);
    }
    setDeletingUserTramite(null);
    setTramiteNoticeMsg(`El trámite ${code} fue eliminado permanentemente.`);
    setTimeout(() => setTramiteNoticeMsg(null), 4000);
  };

  // Catalog List State & Handlers
  const [catalogList, setCatalogList] = useState<TramiteCatalogItem[]>(MOCK_TRAMITES_CATALOG);
  const [editingCatalogItem, setEditingCatalogItem] = useState<TramiteCatalogItem | null>(null);
  const [deletingCatalogItem, setDeletingCatalogItem] = useState<TramiteCatalogItem | null>(null);
  const [isAddingCatalogItem, setIsAddingCatalogItem] = useState<boolean>(false);
  const [catalogNoticeMsg, setCatalogNoticeMsg] = useState<string | null>(null);

  // Form State for Adding / Editing Catalog Items
  const [catCode, setCatCode] = useState<string>('');
  const [catName, setCatName] = useState<string>('');
  const [catDepartment, setCatDepartment] = useState<string>('');
  const [catCategory, setCatCategory] = useState<'avaluos' | 'obras' | 'agua' | 'patentes' | 'pqrs'>('avaluos');
  const [catCategoryLabel, setCatCategoryLabel] = useState<string>('Avalúos y Catastros');
  const [catDescription, setCatDescription] = useState<string>('');
  const [catResponseTime, setCatResponseTime] = useState<string>('24 horas hábiles');
  const [catCost, setCatCost] = useState<string>('$2.00 USD');
  const [catRequirementsStr, setCatRequirementsStr] = useState<string>('');

  const handleOpenAddCatalogItem = () => {
    setIsAddingCatalogItem(true);
    setEditingCatalogItem(null);
    setCatCode(`TRM-CAT-0${catalogList.length + 1}`);
    setCatName('');
    setCatDepartment('Dirección de Avalúos y Catastros');
    setCatCategory('avaluos');
    setCatCategoryLabel('Avalúos y Catastros');
    setCatDescription('');
    setCatResponseTime('24 a 48 horas');
    setCatCost('$2.00 USD');
    setCatRequirementsStr('Cédula de Identidad\nPapeleta de votación actualizada');
  };

  const handleOpenEditCatalogItem = (item: TramiteCatalogItem) => {
    setEditingCatalogItem(item);
    setIsAddingCatalogItem(false);
    setCatCode(item.code);
    setCatName(item.name);
    setCatDepartment(item.department);
    setCatCategory(item.category);
    setCatCategoryLabel(item.categoryLabel);
    setCatDescription(item.description);
    setCatResponseTime(item.responseTime);
    setCatCost(item.cost);
    setCatRequirementsStr(item.requirements.join('\n'));
  };

  const handleSaveCatalogItem = (e: React.FormEvent) => {
    e.preventDefault();
    const reqsArray = catRequirementsStr
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const categoryLabelsMap: Record<string, string> = {
      avaluos: 'Avalúos y Catastros',
      obras: 'Obras y Planificación',
      agua: 'Agua y Alcantarillado',
      patentes: 'Patentes y Comercio',
      pqrs: 'Secretaría & PQRS'
    };

    if (editingCatalogItem) {
      const updated = catalogList.map((item) => {
        if (item.id === editingCatalogItem.id) {
          return {
            ...item,
            code: catCode,
            name: catName,
            department: catDepartment,
            category: catCategory,
            categoryLabel: categoryLabelsMap[catCategory] || catCategoryLabel,
            description: catDescription,
            responseTime: catResponseTime,
            cost: catCost,
            requirements: reqsArray.length > 0 ? reqsArray : ['Sin requisitos adicionales']
          };
        }
        return item;
      });
      setCatalogList(updated);

      if (selectedTramiteCatalog && selectedTramiteCatalog.id === editingCatalogItem.id) {
        setSelectedTramiteCatalog({
          ...selectedTramiteCatalog,
          code: catCode,
          name: catName,
          department: catDepartment,
          category: catCategory,
          categoryLabel: categoryLabelsMap[catCategory] || catCategoryLabel,
          description: catDescription,
          responseTime: catResponseTime,
          cost: catCost,
          requirements: reqsArray.length > 0 ? reqsArray : ['Sin requisitos adicionales']
        });
      }

      setEditingCatalogItem(null);
      setCatalogNoticeMsg(`¡Trámite de catálogo ${catCode} actualizado exitosamente!`);
    } else if (isAddingCatalogItem) {
      const newItem: TramiteCatalogItem = {
        id: 'trm-cat-' + Date.now(),
        code: catCode || `TRM-CAT-0${catalogList.length + 1}`,
        name: catName,
        department: catDepartment,
        category: catCategory,
        categoryLabel: categoryLabelsMap[catCategory] || 'Servicio Municipal',
        description: catDescription,
        responseTime: catResponseTime,
        cost: catCost,
        requirements: reqsArray.length > 0 ? reqsArray : ['Sin requisitos registrados'],
        isOnline: true
      };
      setCatalogList([newItem, ...catalogList]);
      setIsAddingCatalogItem(false);
      setCatalogNoticeMsg(`¡Nuevo trámite ${newItem.code} agregado al catálogo municipal!`);
    }

    setTimeout(() => setCatalogNoticeMsg(null), 4000);
  };

  const handleConfirmDeleteCatalogItem = () => {
    if (!deletingCatalogItem) return;
    const code = deletingCatalogItem.code;
    setCatalogList(catalogList.filter((item) => item.id !== deletingCatalogItem.id));

    if (selectedTramiteCatalog && selectedTramiteCatalog.id === deletingCatalogItem.id) {
      setSelectedTramiteCatalog(null);
    }

    setDeletingCatalogItem(null);
    setCatalogNoticeMsg(`El trámite de catálogo ${code} ha sido eliminado.`);
    setTimeout(() => setCatalogNoticeMsg(null), 4000);
  };

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
    if (!description || !description.trim()) {
      setReportValidationError('Por favor ingrese una descripción del reporte.');
      return;
    }

    // Validate Citizen Details before submission
    const nameVal = validateName(citizenName);
    if (!nameVal.isValid) {
      setReportValidationError(`Nombre inválido: ${nameVal.error}`);
      return;
    }

    const cedulaVal = validateEcuadorianCedula(citizenCedula);
    if (!cedulaVal.isValid) {
      setReportValidationError(`Cédula inválida: ${cedulaVal.error}`);
      return;
    }

    const phoneVal = validatePhone(citizenPhone);
    if (!phoneVal.isValid) {
      setReportValidationError(`Teléfono inválido: ${phoneVal.error}`);
      return;
    }

    setReportValidationError(null);
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
        lat: reportLat,
        lng: reportLng,
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

  // User display name helper
  const userDisplayName = currentUser?.name?.trim() || profileData.name?.trim() || (currentUser?.email ? currentUser.email.split('@')[0] : 'Ciudadano');
  const userFirstName = userDisplayName ? userDisplayName.split(' ')[0] : 'Ciudadano';

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
      
      {/* Frame Switcher Bar */}
      <div className="flex justify-between items-center bg-slate-200 dark:bg-slate-800 p-2.5 rounded-2xl mb-4 border border-slate-300 dark:border-slate-700 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="bg-[#0A4191] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {isPhoneFrame ? "Vista Smartphone" : "Pantalla Normal Web"}
          </span>
          <span className="hidden sm:inline text-slate-600 dark:text-slate-300">
            {isPhoneFrame ? "Vista compacta de dispositivo móvil" : "Plantilla principal de pantalla normal completa"}
          </span>
        </div>
        
        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          id="btn-toggle-phone-frame"
          className="flex items-center space-x-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 shadow-xs transition-all cursor-pointer font-bold"
        >
          {isPhoneFrame ? (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-[#0A4191]" />
              <span>Cambiar a Pantalla Normal</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3.5 h-3.5 text-[#0A4191]" />
              <span>Simular Formato Celular</span>
            </>
          )}
        </button>
      </div>

      {/* Main Layout Box */}
      <div className={isPhoneFrame ? "max-w-sm sm:max-w-md mx-auto bg-slate-950 p-2 sm:p-3 rounded-[40px] shadow-2xl border-4 border-slate-800 transition-all duration-300" : "max-w-6xl mx-auto transition-all duration-300"}>
        
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

        {/* Screen Content Wrapper */}
        <div className={`bg-gradient-to-b from-slate-100 via-blue-50/40 to-slate-200 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 shadow-2xl overflow-hidden flex flex-col min-h-[720px] relative border-2 border-slate-300 dark:border-slate-800 ${
          isPhoneFrame ? "rounded-[32px]" : "rounded-3xl"
        }`}>
          
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
          <div className="flex-1 bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-100 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 rounded-t-[32px] -mt-7 relative z-20 px-3 sm:px-4 pt-5 pb-20 overflow-y-auto">
            
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

                {/* Real-time Technical Chat Section */}
                <div className="pt-2">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center space-x-1.5">
                      <MessageSquare className="w-4 h-4 text-[#0A4191] dark:text-blue-400" />
                      <span>Consulta en Tiempo Real al Técnico</span>
                    </h3>
                  </div>
                  <ReportIncidentChat
                    incident={selectedIncident}
                    currentUser={currentUser}
                    onNewComment={(incId, newComment) => {
                      setSelectedIncident((prev) =>
                        prev && prev.id === incId
                          ? { ...prev, comments: [...(prev.comments || []), newComment] }
                          : prev
                      );
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                {/* TAB 1: HOME / INICIO VIEW (PERSONALIZADO CON COLORES COMBINADOS, BOTONES PROFESIONALES Y TABLA) */}
                {citizenTab === 'inicio' && (
              <div className="space-y-5">
                
                {/* Greeting & Quick Stats Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#0A4191]/10 via-blue-50 to-emerald-50 dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-900 p-4 rounded-3xl border-2 border-blue-200 dark:border-slate-700 shadow-xs">
                  <div className="space-y-0.5">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2 font-serif">
                      <span>¡Hola, {userFirstName}!</span>
                      <span className="text-2xl">👋</span>
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
                      Bienvenido al Portal Ciudadano de Logroño
                    </p>
                  </div>

                  {/* KPI Stat Pills */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <div className="bg-gradient-to-br from-[#0A4191] to-[#0D4FB0] text-white px-3 py-1.5 rounded-2xl border border-blue-400/40 shadow-xs flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-200" />
                      <div>
                        <div className="text-[9px] font-extrabold uppercase tracking-wider text-blue-200">Activos</div>
                        <div className="text-xs font-black leading-none">{incidents.length}</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 px-3 py-1.5 rounded-2xl border border-amber-300/50 shadow-xs flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-950" />
                      <div>
                        <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-900">En Proceso</div>
                        <div className="text-xs font-black leading-none">
                          {incidents.filter((i) => i.status === 'en_proceso' || i.status === 'asignado').length || 2}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#159A44] to-emerald-800 text-white px-3 py-1.5 rounded-2xl border border-emerald-400/40 shadow-xs flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                      <div>
                        <div className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-200">Resueltos</div>
                        <div className="text-xs font-black leading-none">
                          {incidents.filter((i) => i.status === 'resuelto').length || 1}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Professional Action Hero Button: "Registrar Nueva Incidencia" */}
                <button
                  type="button"
                  onClick={() => {
                    setReportStep('category');
                    setCitizenTab('reportar');
                  }}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-[#083578] via-[#0A4191] to-[#0C51B6] hover:from-[#06295d] hover:via-[#083578] hover:to-[#0A4191] text-white p-4 sm:p-5 rounded-3xl shadow-xl hover:shadow-2xl border-2 border-blue-400/80 transition-all duration-300 cursor-pointer group text-left hover:scale-[1.005] active:scale-[0.99]"
                >
                  {/* Background Radial Glow */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between gap-3 relative z-10">
                    <div className="flex items-center space-x-3.5">
                      {/* Square Icon Container with Vibrant Gradient & Icon */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-white via-blue-50 to-blue-100 text-[#0A4191] border-2 border-white flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md shrink-0">
                        <PlusCircle className="w-8 h-8 sm:w-9 sm:h-9 text-[#0A4191] stroke-[2.5]" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/90 text-white border border-emerald-300 font-mono shadow-2xs flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping inline-block" />
                            <span>GAD Logroño • Portal En Línea 24/7</span>
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight font-sans uppercase">
                          Registrar Nueva Incidencia
                        </h3>
                        <p className="text-[11px] sm:text-xs font-semibold text-blue-100/90 line-clamp-1">
                          Notifica baches, alumbrado, agua potable o gestión de residuos en tiempo real
                        </p>
                      </div>
                    </div>

                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 group-hover:bg-white group-hover:text-[#0A4191] text-white flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm">
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform stroke-[3]" />
                    </div>
                  </div>
                </button>

                {/* Shuar Culture Audio Assist Banner */}
                <div className="bg-gradient-to-r from-amber-500/15 via-amber-100/80 to-amber-50 dark:from-amber-950/40 dark:via-slate-800 dark:to-slate-900 text-[#0A4191] dark:text-amber-200 p-3 rounded-2xl border-2 border-amber-400 flex items-center justify-between text-xs shadow-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold shadow-2xs">
                      <Sparkles className="w-4 h-4 text-slate-950" />
                    </div>
                    <div>
                      <span className="font-black text-xs text-slate-900 dark:text-amber-300 block leading-none">
                        Shuar Chicham Audio-Guía
                      </span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                        Asistente de audio e interculturalidad para la ciudadanía
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={playShuarAudio}
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-[11px] flex items-center space-x-1.5 cursor-pointer transition-all border-2 border-amber-500 shadow-xs active:scale-95 shrink-0"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isPlayingAudio ? 'Escuchando...' : 'Escuchar Audio'}</span>
                  </button>
                </div>

                {/* 6 PROFESSIONAL ACTION CARDS WITH VIBRANT COMBINED COLORS */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  
                  {/* Card 1: Mis reportes */}
                  <button
                    type="button"
                    onClick={() => setCitizenTab('mis_reportes')}
                    className="bg-gradient-to-br from-blue-50/90 via-slate-50 to-indigo-100/70 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 border-2 border-blue-300 dark:border-blue-800 hover:border-[#0A4191] rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group hover:scale-[1.02]"
                  >
                    <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-[#0A4191] to-blue-700 text-white flex items-center justify-center mb-2 shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <FileText className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-[#0A4191] dark:text-blue-300 leading-tight">
                      Mis Reportes
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                      Historial & Estado
                    </span>
                  </button>

                  {/* Card 2: Noticias */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIncident(null);
                      setCitizenTab('noticias');
                    }}
                    className="bg-gradient-to-br from-indigo-50/90 via-slate-50 to-blue-100/70 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 border-2 border-indigo-300 dark:border-indigo-800 hover:border-indigo-600 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group hover:scale-[1.02]"
                  >
                    <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-800 text-white flex items-center justify-center mb-2 shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <Newspaper className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-indigo-900 dark:text-indigo-300 leading-tight">
                      Noticias
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                      Comunicados GAD
                    </span>
                  </button>

                  {/* Card 3: Agenda */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIncident(null);
                      setCitizenTab('agenda');
                    }}
                    className="bg-gradient-to-br from-rose-50/90 via-slate-50 to-amber-100/70 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 border-2 border-rose-300 dark:border-rose-800 hover:border-rose-600 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group hover:scale-[1.02]"
                  >
                    <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex items-center justify-center mb-2 shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <Calendar className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-rose-900 dark:text-rose-300 leading-tight">
                      Agenda
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                      Eventos Cantonales
                    </span>
                  </button>

                  {/* Card 4: Emergencias */}
                  <button
                    type="button"
                    onClick={() => setShowEmergencyModal(true)}
                    className="bg-gradient-to-br from-red-100/90 via-rose-50 to-amber-100/80 dark:from-red-950/60 dark:via-slate-800 dark:to-slate-900 border-2 border-red-400 dark:border-red-700 hover:border-red-600 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group hover:scale-[1.02]"
                  >
                    <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-red-600 to-rose-800 text-white flex items-center justify-center mb-2 shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300 animate-pulse">
                      <Siren className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-red-900 dark:text-red-300 leading-tight">
                      Emergencias
                    </span>
                    <span className="text-[10px] text-red-700 dark:text-red-400 font-bold mt-0.5">
                      Contactos 911
                    </span>
                  </button>

                  {/* Card 5: Directorio */}
                  <button
                    type="button"
                    onClick={() => setCitizenTab('directorio')}
                    className="bg-gradient-to-br from-emerald-50/90 via-slate-50 to-teal-100/70 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 border-2 border-emerald-300 dark:border-emerald-800 hover:border-emerald-600 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group hover:scale-[1.02]"
                  >
                    <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center mb-2 shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <PhoneCall className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-emerald-950 dark:text-emerald-300 leading-tight">
                      Directorio
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                      Teléfonos GAD
                    </span>
                  </button>

                  {/* Card 6: Trámites */}
                  <button
                    type="button"
                    onClick={() => setCitizenTab('pqrs')}
                    className="bg-gradient-to-br from-amber-50/90 via-slate-50 to-yellow-100/70 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 border-2 border-amber-300 dark:border-amber-800 hover:border-amber-600 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group hover:scale-[1.02]"
                  >
                    <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 text-white flex items-center justify-center mb-2 shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <FileCheck className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-amber-950 dark:text-amber-300 leading-tight">
                      Trámites
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                      Catálogo PQRS
                    </span>
                  </button>

                </div>

                {/* TABLA PERSONALIZADA DE ESTADO DE TRÁMITES Y REPORTES RECIENTES */}
                <div className="bg-gradient-to-br from-slate-900 via-[#0A4191] to-slate-950 text-white rounded-3xl border-2 border-blue-400/80 shadow-xl overflow-hidden space-y-0">
                  {/* Table Header Controls */}
                  <div className="p-4 bg-slate-950/80 border-b border-blue-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-[#0A4191] text-white flex items-center justify-center shadow-xs shrink-0">
                        <FileText className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-white leading-tight">
                          Tabla de Seguimiento de Solicitudes y Trámites
                        </h3>
                        <p className="text-[10px] text-blue-200 font-medium">
                          Monitoreo en tiempo real del progreso municipal
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCitizenTab('mis_reportes')}
                      className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 hover:text-white border border-blue-400/40 rounded-xl font-extrabold text-xs transition-colors flex items-center space-x-1 cursor-pointer shrink-0"
                    >
                      <span>Ver Todos en Mis Reportes</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Custom Styled Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-950/60 text-blue-200 font-extrabold uppercase text-[10px] tracking-wider border-b border-white/10">
                          <th className="py-3 px-3.5">Código / Trámite</th>
                          <th className="py-3 px-3.5 hidden md:table-cell">Categoría & Sector</th>
                          <th className="py-3 px-3.5">Fecha</th>
                          <th className="py-3 px-3.5">Estado & Avance</th>
                          <th className="py-3 px-3.5 text-center">Gestión</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-slate-100 text-xs">
                        {incidents.slice(0, 4).map((inc) => {
                          let badgeBg = 'bg-amber-400 text-slate-950 font-black';
                          let progressPercent = '65%';
                          let statusLabel = 'En Proceso';

                          if (inc.status === 'resuelto') {
                            badgeBg = 'bg-emerald-400 text-slate-950 font-black';
                            progressPercent = '100%';
                            statusLabel = 'Solucionado';
                          } else if (inc.status === 'reportado') {
                            badgeBg = 'bg-blue-400 text-slate-950 font-black';
                            progressPercent = '25%';
                            statusLabel = 'Recibido';
                          } else if (inc.status === 'asignado') {
                            badgeBg = 'bg-amber-300 text-slate-950 font-black';
                            progressPercent = '50%';
                            statusLabel = 'Asignado';
                          }

                          return (
                            <tr key={inc.id} className="hover:bg-white/10 transition-colors">
                              <td className="py-3 px-3.5 font-bold">
                                <div className="font-mono text-[10px] text-amber-300 bg-black/40 px-2 py-0.5 rounded-md inline-block border border-white/10 mb-0.5">
                                  {inc.code}
                                </div>
                                <div className="text-white font-extrabold text-xs line-clamp-1">{inc.title}</div>
                              </td>

                              <td className="py-3 px-3.5 hidden md:table-cell text-slate-300 font-medium">
                                <span className="text-blue-300 font-bold block">{inc.category}</span>
                                <span className="text-[10px] text-slate-400">{inc.location.sector}</span>
                              </td>

                              <td className="py-3 px-3.5 font-mono text-[11px] text-blue-200">
                                {inc.createdAt ? inc.createdAt.split('T')[0] : '12/08/2026'}
                              </td>

                              <td className="py-3 px-3.5">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-black ${badgeBg}`}>
                                    {statusLabel}
                                  </span>
                                  <span className="text-[10px] font-mono text-blue-200 font-bold">{progressPercent}</span>
                                </div>
                                <div className="w-24 sm:w-28 h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/20">
                                  <div
                                    className={`h-full rounded-full ${
                                      inc.status === 'resuelto'
                                        ? 'bg-emerald-400'
                                        : inc.status === 'reportado'
                                        ? 'bg-blue-400'
                                        : 'bg-amber-400'
                                    }`}
                                    style={{ width: progressPercent }}
                                  />
                                </div>
                              </td>

                              <td className="py-3 px-3.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => setSelectedIncident(inc)}
                                  className="px-2.5 py-1.5 bg-white/15 hover:bg-white/30 text-white border border-white/30 rounded-xl font-extrabold text-[11px] transition-all cursor-pointer shadow-2xs inline-flex items-center space-x-1"
                                >
                                  <span>Seguimiento</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>



                {/* Cantonal Alert Box */}
                <div className="bg-gradient-to-r from-amber-500/15 via-amber-100 to-amber-50 dark:from-amber-950/50 dark:to-slate-900 border-2 border-amber-400 p-3 rounded-2xl flex items-start space-x-2.5 text-xs shadow-xs">
                  <div className="p-1.5 bg-amber-500 text-slate-950 rounded-xl shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="font-extrabold text-amber-950 dark:text-amber-300 block text-xs">
                      Aviso de Prevención Cantonal
                    </span>
                    <p className="text-slate-800 dark:text-slate-300 text-[11px] mt-0.5 font-semibold">
                      Vía Logroño - Yaupi habilitada con precaución por trabajos de limpieza de cuadrillas del GAD Municipal.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: REPORTAR INCIDENCIA - CUSTOMIZED MUNICIPAL BACKGROUND CANVAS */}
            {citizenTab === 'reportar' && (
              <div className="relative overflow-hidden bg-white p-4 sm:p-6 rounded-3xl border-2 border-[#0A4191] shadow-lg space-y-5 text-xs">
                {/* Decorative Subtle Background Glow Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                {/* STEP 1: CATEGORY SELECTION */}
                {reportStep === 'category' && (
                  <div className="space-y-4 relative z-10">
                    {/* Municipal Branding Header Title & Subtitle */}
                    <div className="text-center space-y-1.5 pt-1 pb-2">
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border-2 border-[#0A4191] text-[#0A4191] text-[10px] font-black uppercase tracking-wider mb-1 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0A4191] animate-pulse" />
                        <span>GAD Municipal Logroño • Portal de Reportes</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#0A4191] font-serif tracking-tight">
                        Reportar Incidencia
                      </h2>
                      <p className="text-xs text-[#0A4191] font-bold max-w-sm mx-auto">
                        Selecciona el servicio municipal o la categoría para iniciar tu trámite
                      </p>
                    </div>

                    {/* Grid of Categories - Square Well-Defined Containers with Large Icons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-1">
                      
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
                        className="bg-white border-2 border-[#0A4191] rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:bg-blue-50/60 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 border-2 border-[#0A4191] text-[#0A4191] flex items-center justify-center mb-2 group-hover:scale-105 group-hover:bg-[#0A4191] transition-all duration-300 shadow-2xs shrink-0">
                          <Lightbulb className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5] text-amber-500 group-hover:text-amber-300" />
                        </div>
                        <span className="text-xs sm:text-sm font-black text-[#0A4191] leading-tight">
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
                        className="bg-white border-2 border-[#0A4191] rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:bg-blue-50/60 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 border-2 border-[#0A4191] text-[#0A4191] flex items-center justify-center mb-2 group-hover:scale-105 group-hover:bg-[#0A4191] transition-all duration-300 shadow-2xs shrink-0">
                          <Droplets className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5] text-blue-600 group-hover:text-blue-200" />
                        </div>
                        <span className="text-xs sm:text-sm font-black text-[#0A4191] leading-tight">
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
                        className="bg-white border-2 border-[#0A4191] rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:bg-blue-50/60 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 border-2 border-[#0A4191] text-[#0A4191] flex items-center justify-center mb-2 group-hover:scale-105 group-hover:bg-[#0A4191] transition-all duration-300 shadow-2xs shrink-0">
                          <Waves className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5] text-sky-600 group-hover:text-sky-200" />
                        </div>
                        <span className="text-xs sm:text-sm font-black text-[#0A4191] leading-tight">
                          Alcantarillado
                        </span>
                      </button>

                      {/* 4. Calles y Aceras */}
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
                        className="bg-white border-2 border-[#0A4191] rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:bg-blue-50/60 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 border-2 border-[#0A4191] text-[#0A4191] flex items-center justify-center mb-2 group-hover:scale-105 group-hover:bg-[#0A4191] transition-all duration-300 shadow-2xs shrink-0">
                          <Milestone className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5] text-[#0A4191] group-hover:text-white" />
                        </div>
                        <span className="text-xs sm:text-sm font-black text-[#0A4191] leading-tight">
                          Calles y Aceras
                        </span>
                      </button>

                      {/* 5. Basura / Residuos */}
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
                        className="bg-white border-2 border-[#0A4191] rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:bg-blue-50/60 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 border-2 border-[#0A4191] text-[#0A4191] flex items-center justify-center mb-2 group-hover:scale-105 group-hover:bg-[#0A4191] transition-all duration-300 shadow-2xs shrink-0">
                          <Trash2 className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5] text-emerald-600 group-hover:text-emerald-200" />
                        </div>
                        <span className="text-xs sm:text-sm font-black text-[#0A4191] leading-tight">
                          Gestión de Residuos
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
                        className="bg-white border-2 border-[#0A4191] rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:bg-blue-50/60 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 border-2 border-[#0A4191] text-[#0A4191] flex items-center justify-center mb-2 group-hover:scale-105 group-hover:bg-[#0A4191] transition-all duration-300 shadow-2xs shrink-0">
                          <Trees className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5] text-emerald-600 group-hover:text-emerald-200" />
                        </div>
                        <span className="text-xs sm:text-sm font-black text-[#0A4191] leading-tight">
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
                        className="bg-white border-2 border-[#0A4191] rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:bg-blue-50/60 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 border-2 border-[#0A4191] text-[#0A4191] flex items-center justify-center mb-2 group-hover:scale-105 group-hover:bg-[#0A4191] transition-all duration-300 shadow-2xs shrink-0">
                          <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5] text-purple-600 group-hover:text-purple-200" />
                        </div>
                        <span className="text-xs sm:text-sm font-black text-[#0A4191] leading-tight">
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
                        className="bg-white border-2 border-[#0A4191] rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:bg-blue-50/60 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 border-2 border-[#0A4191] text-[#0A4191] flex items-center justify-center mb-2 group-hover:scale-105 group-hover:bg-[#0A4191] transition-all duration-300 shadow-2xs shrink-0">
                          <Building2 className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5] text-teal-600 group-hover:text-teal-200" />
                        </div>
                        <span className="text-xs sm:text-sm font-black text-[#0A4191] leading-tight">
                          Comunitaria Shuar
                        </span>
                      </button>

                    </div>
                  </div>
                )}

                {/* 4-STEP WIZARD */}
                {reportStep === 'wizard' && (
                  <div className="space-y-4 relative z-10">

                    {/* Stepper Header for Steps 1, 2, 3 */}
                    {reportWizardStep < 4 && (
                      <div className="space-y-2">
                        {/* Top navigation row with back arrow and cancel button */}
                        <div className="relative text-center pt-1 pb-1 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              if (reportWizardStep === 1) {
                                handleTriggerCancelTramite('wizard');
                              } else {
                                setReportWizardStep((prev) => (prev - 1) as any);
                              }
                            }}
                            className="p-1.5 text-[#0A4191] hover:bg-blue-50 rounded-full cursor-pointer"
                            title="Regresar / Cancelar"
                          >
                            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                          </button>
                          
                          <div className="flex-1 px-2">
                            <h2 className="text-base font-black text-[#0A4191] font-serif tracking-tight">
                              {reportWizardStep === 1 && (category || 'Alumbrado Público')}
                              {reportWizardStep === 2 && 'Ubicación del problema'}
                              {reportWizardStep === 3 && 'Confirmar información'}
                            </h2>
                            <p className="text-[11px] text-[#0A4191] font-bold">
                              {reportWizardStep === 1 && 'Cuéntanos más sobre el problema'}
                              {reportWizardStep === 2 && 'Confirma o ajusta la ubicación'}
                              {reportWizardStep === 3 && 'Revisa los datos antes de enviar'}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleTriggerCancelTramite('wizard')}
                            className="text-[11px] font-bold text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-lg cursor-pointer transition-colors border border-red-200"
                            title="Cancelar trámite o reporte"
                          >
                            Cancelar
                          </button>
                        </div>

                        {/* Numbered Stepper: 1 - 2 - 3 - 4 */}
                        <div className="flex items-center justify-center space-x-3.5 py-1">
                          {[1, 2, 3, 4].map((stepNum) => {
                            const isActive = reportWizardStep === stepNum;
                            const isCompleted = reportWizardStep > stepNum;
                            return (
                              <div
                                key={stepNum}
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                                  isActive
                                    ? 'bg-[#0A4191] text-white shadow-md scale-105'
                                    : isCompleted
                                    ? 'bg-blue-100 text-[#0A4191] border-2 border-[#0A4191]'
                                    : 'bg-slate-100 text-slate-400 border border-slate-300'
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
                          <label className="block text-xs font-bold text-[#0A4191]">
                            Descripción del problema
                          </label>
                          <div className="relative">
                            <textarea
                              rows={3}
                              maxLength={300}
                              placeholder="Describa los detalles de la incidencia..."
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              className="w-full p-3 text-xs rounded-xl border border-blue-200 bg-blue-50/40 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#0A4191] focus:bg-white shadow-xs resize-none"
                            />
                            <div className="text-[10px] text-slate-500 text-right mt-1 font-mono">
                              Caracteres: {description.length}/300
                            </div>
                          </div>
                        </div>

                        {/* Attach Photo Section */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-[#0A4191]">
                            Adjuntar fotografía
                          </label>

                          <div className="grid grid-cols-2 gap-3">
                            {/* Left Photo Preview Box */}
                            <div className="relative h-28 rounded-2xl overflow-hidden border-2 border-[#0A4191] bg-blue-50 shadow-sm group">
                              <img
                                src={photoUrl}
                                alt="Vista previa de incidencia"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-[10px] bg-[#0A4191] text-white px-2 py-0.5 rounded-full font-bold">
                                  Vista Previa
                                </span>
                              </div>
                            </div>

                            {/* Right Camera Upload Box */}
                            <label className="h-28 rounded-2xl border-2 border-dashed border-[#0A4191] bg-blue-50/50 hover:bg-blue-100/60 flex flex-col items-center justify-center text-[#0A4191] cursor-pointer transition-all shadow-sm">
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
                              <div className="w-10 h-10 rounded-full bg-blue-100 border border-[#0A4191] flex items-center justify-center mb-1 text-[#0A4191]">
                                <Camera className="w-5 h-5 stroke-[2.5]" />
                              </div>
                              <span className="text-[10px] font-bold text-[#0A4191]">
                                Tomar / Subir Foto
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Gemini AI Auto-Classify Trigger */}
                        <div className="bg-blue-50 text-[#0A4191] p-3 rounded-2xl border-2 border-[#0A4191] flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                            <span className="text-[11px] font-bold text-[#0A4191]">Visión IA Gemini</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleAnalyzeWithAI}
                            disabled={isAnalyzingAI}
                            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[10px] px-2.5 py-1 rounded-lg cursor-pointer border border-amber-500"
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
                              ? 'bg-[#0A4191] hover:bg-blue-800 text-white'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
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
                        <div className="relative rounded-2xl overflow-hidden border-2 border-[#0A4191] shadow-sm">
                          <LogronoGoogleMap
                            centerLat={reportLat}
                            centerLng={reportLng}
                            selectedLat={reportLat}
                            selectedLng={reportLng}
                            selectableLocation={true}
                            zoomLevel={15}
                            incidents={[]}
                            onLocationSelect={(lat, lng, newAddress, newSector) => {
                              setReportLat(lat);
                              setReportLng(lng);
                              if (newAddress) setAddress(newAddress);
                              if (newSector) setSector(newSector);
                            }}
                          />
                        </div>

                        {/* Sector Selector */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-[#0A4191]">
                            Parroquia / Sector de Logroño
                          </label>
                          <select
                            value={sector}
                            onChange={(e) => setSector(e.target.value as LogronoSector)}
                            className="w-full p-2.5 text-xs rounded-xl border border-blue-200 bg-blue-50/40 font-semibold text-[#0A4191] outline-none focus:ring-2 focus:ring-[#0A4191] focus:bg-white"
                          >
                            <option value="Logroño Centro (Cabecera)">Logroño Centro (Cabecera)</option>
                            <option value="Parroquia Yaupi">Parroquia Yaupi</option>
                            <option value="Parroquia Shimpis">Parroquia Shimpis</option>
                          </select>
                        </div>

                        {/* Address Field */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-[#0A4191]">
                            Dirección aproximada / Referencia
                          </label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Calle 24 de Mayo y Sucre"
                            className="w-full p-2.5 text-xs rounded-xl border border-blue-200 bg-blue-50/40 font-semibold text-[#0A4191] outline-none focus:ring-2 focus:ring-[#0A4191] focus:bg-white"
                          />
                          <div className="text-[10px] text-[#0A4191] font-mono flex items-center justify-between pt-0.5">
                            <span>Coordenadas GPS:</span>
                            <span className="font-bold text-[#0A4191]">{reportLat.toFixed(5)}, {reportLng.toFixed(5)}</span>
                          </div>
                        </div>

                        {/* Bottom Buttons: Atrás & Siguiente */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setReportWizardStep(1)}
                            className="py-3 rounded-2xl border-2 border-[#0A4191] bg-white text-[#0A4191] font-bold text-xs cursor-pointer hover:bg-blue-50"
                          >
                            Atrás
                          </button>
                          <button
                            type="button"
                            onClick={() => setReportWizardStep(3)}
                            className="py-3 rounded-2xl bg-[#0A4191] hover:bg-blue-800 text-white font-bold text-xs shadow-md cursor-pointer"
                          >
                            Siguiente
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: CONFIRMACIÓN */}
                    {reportWizardStep === 3 && (
                      <div className="space-y-4 pt-1">
                        {/* Summary Card */}
                        <div className="bg-white p-4 rounded-2xl border-2 border-[#0A4191] shadow-sm space-y-3">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#0A4191]/70 block tracking-wider">
                              Categoría
                            </span>
                            <p className="text-sm font-black text-[#0A4191] mt-0.5">
                              {category}
                            </p>
                          </div>

                          <div className="border-t border-blue-100 pt-2.5">
                            <span className="text-[10px] font-bold uppercase text-[#0A4191]/70 block tracking-wider">
                              Descripción
                            </span>
                            <p className="text-xs text-[#0A4191] font-semibold mt-0.5 leading-relaxed">
                              {description}
                            </p>
                          </div>

                          <div className="border-t border-blue-100 pt-2.5">
                            <span className="text-[10px] font-bold uppercase text-[#0A4191]/70 block tracking-wider">
                              Ubicación
                            </span>
                            <p className="text-xs font-bold text-[#0A4191] mt-0.5">
                              {address}
                            </p>
                          </div>

                          <div className="border-t border-blue-100 pt-2.5">
                            <span className="text-[10px] font-bold uppercase text-[#0A4191]/70 block tracking-wider mb-1.5">
                              Foto
                            </span>
                            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-[#0A4191]">
                              <img src={photoUrl} alt="Foto reporte" className="w-full h-full object-cover" />
                            </div>
                          </div>
                        </div>

                        {/* Citizen Information & Form Validation Card */}
                        <div className="bg-white p-4 rounded-2xl border-2 border-[#0A4191] shadow-sm space-y-3">
                          <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                            <div className="flex items-center space-x-2">
                              <UserCheck className="w-4 h-4 text-[#0A4191]" />
                              <span className="text-xs font-extrabold text-[#0A4191]">
                                Datos del Ciudadano Solicitante
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-[#0A4191] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                              Validación en Vivo
                            </span>
                          </div>

                          {/* Field 1: Nombre y Apellido */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <label className="text-[11px] font-bold text-[#0A4191]">
                                Nombres y Apellidos *
                              </label>
                              {validateName(citizenName).isValid ? (
                                <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Nombre Válido</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-red-500">Formato Requerido</span>
                              )}
                            </div>
                            <input
                              type="text"
                              value={citizenName}
                              onChange={(e) => {
                                setCitizenName(e.target.value);
                                setReportValidationError(null);
                              }}
                              placeholder="Ej: María Fernanda Shakaim"
                              className={`w-full p-2.5 text-xs rounded-xl border bg-blue-50/30 font-semibold text-[#0A4191] outline-none focus:ring-2 ${
                                validateName(citizenName).isValid
                                  ? 'border-blue-200 focus:ring-emerald-500'
                                  : 'border-red-300 focus:ring-red-500'
                              }`}
                            />
                            {!validateName(citizenName).isValid && citizenName && (
                              <p className="text-[10px] font-semibold text-red-500 mt-0.5">
                                {validateName(citizenName).error}
                              </p>
                            )}
                          </div>

                          {/* Field 2: Cédula de Ciudadanía */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <label className="text-[11px] font-bold text-[#0A4191]">
                                Cédula de Ciudadanía (Ecuador) *
                              </label>
                              {validateEcuadorianCedula(citizenCedula).isValid ? (
                                <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>Cédula Válida</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-red-500">Cédula Inválida</span>
                              )}
                            </div>
                            <input
                              type="text"
                              maxLength={10}
                              value={citizenCedula}
                              onChange={(e) => {
                                setCitizenCedula(e.target.value.replace(/\D/g, ''));
                                setReportValidationError(null);
                              }}
                              placeholder="1710034065"
                              className={`w-full p-2.5 text-xs rounded-xl border bg-blue-50/30 font-semibold text-[#0A4191] outline-none focus:ring-2 ${
                                validateEcuadorianCedula(citizenCedula).isValid
                                  ? 'border-blue-200 focus:ring-emerald-500'
                                  : 'border-red-300 focus:ring-red-500'
                              }`}
                            />
                            {!validateEcuadorianCedula(citizenCedula).isValid && citizenCedula && (
                              <p className="text-[10px] font-semibold text-red-500 mt-0.5">
                                {validateEcuadorianCedula(citizenCedula).error}
                              </p>
                            )}
                          </div>

                          {/* Field 3: Teléfono de Contacto */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <label className="text-[11px] font-bold text-[#0A4191]">
                                Teléfono de Contacto (Celular / Fijo) *
                              </label>
                              {validatePhone(citizenPhone).isValid ? (
                                <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Teléfono Válido</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-red-500">Teléfono Inválido</span>
                              )}
                            </div>
                            <input
                              type="text"
                              maxLength={10}
                              value={citizenPhone}
                              onChange={(e) => {
                                setCitizenPhone(e.target.value.replace(/\D/g, ''));
                                setReportValidationError(null);
                              }}
                              placeholder="0984712039"
                              className={`w-full p-2.5 text-xs rounded-xl border bg-blue-50/30 font-semibold text-[#0A4191] outline-none focus:ring-2 ${
                                validatePhone(citizenPhone).isValid
                                  ? 'border-blue-200 focus:ring-emerald-500'
                                  : 'border-red-300 focus:ring-red-500'
                              }`}
                            />
                            {!validatePhone(citizenPhone).isValid && citizenPhone && (
                              <p className="text-[10px] font-semibold text-red-500 mt-0.5">
                                {validatePhone(citizenPhone).error}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Error Banner if validation fails on submission attempt */}
                        {reportValidationError && (
                          <div className="bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 p-3 rounded-2xl flex items-start space-x-2 text-xs font-bold animate-in fade-in">
                            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <span>{reportValidationError}</span>
                          </div>
                        )}

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

            {/* TAB 3: MIS REPORTES (PLANTILLA PERSONALIZADA) */}
            {citizenTab === 'mis_reportes' && (
              <div className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 border-2 border-[#0A4191] rounded-3xl p-4 sm:p-6 shadow-lg space-y-4 text-xs text-slate-800">
                {/* Header Banner: Gradiente azul municipal con texto e insignias */}
                <div className="bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] text-white p-4 rounded-2xl border-b-2 border-[#0A4191] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 -mx-1 -mt-1">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setCitizenTab('inicio')}
                      className="p-1.5 text-white hover:bg-white/20 rounded-full cursor-pointer transition-colors border border-white/20 active:scale-95 shrink-0"
                      title="Volver al inicio"
                    >
                      <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black font-mono text-amber-300 bg-white/15 px-2 py-0.5 rounded border border-white/20 uppercase tracking-wider shadow-2xs">
                          Gestión Ciudadana GAD
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-white font-serif tracking-tight mt-0.5">
                        Mis Reportes & Trámites
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 self-end sm:self-auto text-[11px] font-bold">
                    <span className="bg-white/15 text-blue-100 px-3 py-1 rounded-xl border border-white/25 backdrop-blur-xs flex items-center space-x-1.5 shadow-2xs">
                      <FileText className="w-3.5 h-3.5 text-amber-300" />
                      <span>Histórico Cantonal Logroño</span>
                    </span>
                  </div>
                </div>

                {/* Quick Stats Summary Ribbon */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="bg-white/90 border border-slate-300 p-2.5 sm:p-3 rounded-2xl shadow-2xs flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#0A4191] flex items-center justify-center shrink-0">
                      <ListFilter className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Total</span>
                      <span className="text-sm font-black text-slate-900">{incidents.length}</span>
                    </div>
                  </div>

                  <div className="bg-amber-50/90 border border-amber-200 p-2.5 sm:p-3 rounded-2xl shadow-2xs flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-800 font-bold block uppercase tracking-wider">En Atención</span>
                      <span className="text-sm font-black text-amber-950">
                        {incidents.filter((i) => i.status !== 'resuelto').length}
                      </span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/90 border border-emerald-200 p-2.5 sm:p-3 rounded-2xl shadow-2xs flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-800 font-bold block uppercase tracking-wider">Solucionados</span>
                      <span className="text-sm font-black text-emerald-950">
                        {incidents.filter((i) => i.status === 'resuelto').length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filter & Sort Controls */}
                <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between py-0.5">
                  {/* Status Filter Pills: Todos | En proceso | Solucionados */}
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    <button
                      type="button"
                      onClick={() => setMisReportesFilter('todos')}
                      title="Ver todos los reportes"
                      className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1.5 border active:scale-95 ${
                        misReportesFilter === 'todos'
                          ? 'bg-gradient-to-r from-[#0A4191] to-[#0C51B6] text-white border-[#0A4191] shadow-md'
                          : 'bg-white/90 hover:bg-white text-slate-700 border-slate-300 shadow-2xs'
                      }`}
                    >
                      <ListFilter className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden xs:inline">Todos</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMisReportesFilter('en_proceso')}
                      title="Ver reportes en proceso"
                      className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1.5 border active:scale-95 ${
                        misReportesFilter === 'en_proceso'
                          ? 'bg-gradient-to-r from-[#0A4191] to-[#0C51B6] text-white border-[#0A4191] shadow-md'
                          : 'bg-white/90 hover:bg-white text-slate-700 border-slate-300 shadow-2xs'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden xs:inline">En proceso</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMisReportesFilter('solucionados')}
                      title="Ver reportes solucionados"
                      className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1.5 border active:scale-95 ${
                        misReportesFilter === 'solucionados'
                          ? 'bg-gradient-to-r from-[#0A4191] to-[#0C51B6] text-white border-[#0A4191] shadow-md'
                          : 'bg-white/90 hover:bg-white text-slate-700 border-slate-300 shadow-2xs'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden xs:inline">Solucionados</span>
                    </button>
                  </div>

                  {/* Dropdown Selector for Sorting */}
                  <div className="flex items-center space-x-2 bg-white/90 px-3 py-1.5 rounded-xl border border-slate-300 shadow-2xs">
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#0A4191] shrink-0" />
                    <label htmlFor="select-mis-reportes-sort" className="text-[11px] font-black text-slate-700 whitespace-nowrap">
                      Ordenar:
                    </label>
                    <select
                      id="select-mis-reportes-sort"
                      value={misReportesSortBy}
                      onChange={(e) => setMisReportesSortBy(e.target.value as any)}
                      className="bg-slate-50 text-slate-800 text-xs font-extrabold rounded-lg px-2 py-1 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A4191]/40 cursor-pointer shadow-2xs"
                    >
                      <option value="fecha_desc">Fecha (Recientes primero)</option>
                      <option value="fecha_asc">Fecha (Antiguos primero)</option>
                      <option value="prioridad_desc">Prioridad (Mayor a Menor)</option>
                      <option value="prioridad_asc">Prioridad (Menor a Mayor)</option>
                    </select>
                  </div>
                </div>

                {/* Custom Professional Data Table for Mis Reportes */}
                <div className="pt-1">
                  <div className="overflow-x-auto rounded-2xl border-2 border-[#0A4191]/60 shadow-md bg-gradient-to-b from-white via-slate-50/80 to-blue-50/20">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] text-white text-[11px] font-black uppercase tracking-wider">
                          <th className="py-3.5 px-3.5 border-r border-white/20">Código</th>
                          <th className="py-3.5 px-3.5 border-r border-white/20">Categoría / Asunto</th>
                          <th className="py-3.5 px-3.5 border-r border-white/20">Ubicación / Sector</th>
                          
                          {/* Column Header: Fecha (Interactive Sort) */}
                          <th
                            className="py-3.5 px-3.5 border-r border-white/20 cursor-pointer select-none hover:bg-white/10 transition-colors"
                            onClick={() => {
                              if (misReportesSortBy === 'fecha_desc') {
                                setMisReportesSortBy('fecha_asc');
                              } else {
                                setMisReportesSortBy('fecha_desc');
                              }
                            }}
                            title="Haz clic para ordenar por fecha de creación"
                          >
                            <div className="flex items-center space-x-1 text-white">
                              <span>Fecha</span>
                              {misReportesSortBy === 'fecha_desc' && <ArrowDown className="w-3.5 h-3.5 text-amber-300 stroke-[2.5]" />}
                              {misReportesSortBy === 'fecha_asc' && <ArrowUp className="w-3.5 h-3.5 text-amber-300 stroke-[2.5]" />}
                              {!misReportesSortBy.startsWith('fecha') && <ArrowUpDown className="w-3 h-3 text-white/60" />}
                            </div>
                          </th>

                          {/* Column Header: Días Transcurridos */}
                          <th
                            className="py-3.5 px-3.5 border-r border-white/20 cursor-pointer select-none hover:bg-white/10 transition-colors"
                            onClick={() => {
                              if (misReportesSortBy === 'fecha_asc') {
                                setMisReportesSortBy('fecha_desc');
                              } else {
                                setMisReportesSortBy('fecha_asc');
                              }
                            }}
                            title="Haz clic para ordenar por días transcurridos"
                          >
                            <div className="flex items-center space-x-1 text-white">
                              <span>Días Transcurridos</span>
                              {misReportesSortBy === 'fecha_asc' && <ArrowDown className="w-3.5 h-3.5 text-amber-300 stroke-[2.5]" />}
                              {misReportesSortBy === 'fecha_desc' && <ArrowUp className="w-3.5 h-3.5 text-amber-300 stroke-[2.5]" />}
                              {!misReportesSortBy.startsWith('fecha') && <ArrowUpDown className="w-3 h-3 text-white/60" />}
                            </div>
                          </th>

                          {/* Column Header: Prioridad (Interactive Sort) */}
                          <th
                            className="py-3.5 px-3.5 border-r border-white/20 cursor-pointer select-none hover:bg-white/10 transition-colors"
                            onClick={() => {
                              if (misReportesSortBy === 'prioridad_desc') {
                                setMisReportesSortBy('prioridad_asc');
                              } else {
                                setMisReportesSortBy('prioridad_desc');
                              }
                            }}
                            title="Haz clic para ordenar por nivel de prioridad"
                          >
                            <div className="flex items-center space-x-1 text-white">
                              <span>Prioridad</span>
                              {misReportesSortBy === 'prioridad_desc' && <ArrowDown className="w-3.5 h-3.5 text-amber-300 stroke-[2.5]" />}
                              {misReportesSortBy === 'prioridad_asc' && <ArrowUp className="w-3.5 h-3.5 text-amber-300 stroke-[2.5]" />}
                              {!misReportesSortBy.startsWith('prioridad') && <ArrowUpDown className="w-3 h-3 text-white/60" />}
                            </div>
                          </th>

                          <th className="py-3.5 px-3.5 border-r border-white/20">Estado</th>
                          <th className="py-3.5 px-3.5 text-center">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
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
                          .sort((a, b) => {
                            if (misReportesSortBy === 'fecha_desc') {
                              const timeA = new Date(a.createdAt).getTime() || 0;
                              const timeB = new Date(b.createdAt).getTime() || 0;
                              return timeB - timeA;
                            }
                            if (misReportesSortBy === 'fecha_asc') {
                              const timeA = new Date(a.createdAt).getTime() || 0;
                              const timeB = new Date(b.createdAt).getTime() || 0;
                              return timeA - timeB;
                            }
                            if (misReportesSortBy === 'prioridad_desc') {
                              const prioWeight: Record<string, number> = { critica: 4, alta: 3, media: 2, baja: 1 };
                              return (prioWeight[b.priority] || 0) - (prioWeight[a.priority] || 0);
                            }
                            if (misReportesSortBy === 'prioridad_asc') {
                              const prioWeight: Record<string, number> = { critica: 4, alta: 3, media: 2, baja: 1 };
                              return (prioWeight[a.priority] || 0) - (prioWeight[b.priority] || 0);
                            }
                            return 0;
                          })
                          .map((inc) => {
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

                            // Days elapsed calculation
                            const daysElapsed = (() => {
                              try {
                                const created = new Date(inc.createdAt);
                                if (isNaN(created.getTime())) return 0;
                                const now = new Date();
                                const diffTime = Math.max(0, now.getTime() - created.getTime());
                                return Math.floor(diffTime / (1000 * 60 * 60 * 24));
                              } catch {
                                return 0;
                              }
                            })();

                            // Priority styling badge with accessibility icons
                            const priorityBadge = (() => {
                              switch (inc.priority) {
                                case 'critica':
                                  return (
                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold inline-flex items-center space-x-1 bg-red-100 text-red-950 border border-red-300 shadow-2xs" title="Prioridad Crítica">
                                      <Flame className="w-3.5 h-3.5 shrink-0 text-red-600 fill-red-500 animate-pulse" />
                                      <span>Crítica</span>
                                    </span>
                                  );
                                case 'alta':
                                  return (
                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold inline-flex items-center space-x-1 bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs" title="Prioridad Alta">
                                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                                      <span>Alta</span>
                                    </span>
                                  );
                                case 'media':
                                  return (
                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold inline-flex items-center space-x-1 bg-blue-100 text-[#0A4191] border border-blue-300 shadow-2xs" title="Prioridad Media">
                                      <Clock className="w-3.5 h-3.5 shrink-0 text-[#0A4191]" />
                                      <span>Media</span>
                                    </span>
                                  );
                                default:
                                  return (
                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold inline-flex items-center space-x-1 bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs" title="Prioridad Baja">
                                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                                      <span>Baja</span>
                                    </span>
                                  );
                              }
                            })();

                            return (
                              <tr
                                key={inc.id}
                                onClick={() => setSelectedIncident(inc)}
                                className="odd:bg-white even:bg-slate-50/70 hover:bg-blue-50/80 transition-colors cursor-pointer group text-slate-800"
                              >
                                {/* Code Column */}
                                <td className="py-3 px-3.5 whitespace-nowrap border-r border-slate-200">
                                  <span className="font-mono font-black text-white bg-slate-800 px-2.5 py-0.5 rounded-md text-[10px] shadow-2xs">
                                    {inc.code}
                                  </span>
                                </td>

                                {/* Title / Category Column */}
                                <td className="py-3 px-3.5 border-r border-slate-200">
                                  <div className="font-black text-slate-900 group-hover:text-[#0A4191] transition-colors line-clamp-1">
                                    {inc.title}
                                  </div>
                                  <div className="text-[11px] font-semibold text-slate-500">
                                    {inc.category}
                                  </div>
                                </td>

                                {/* Location Column */}
                                <td className="py-3 px-3.5 border-r border-slate-200">
                                  <div className="font-extrabold text-[#0A4191]">
                                    {inc.location.sector}
                                  </div>
                                  <div className="text-[10px] text-slate-500 line-clamp-1">
                                    {inc.location.address}
                                  </div>
                                </td>

                                {/* Date Column */}
                                <td className="py-3 px-3.5 font-mono font-extrabold text-[11px] text-slate-700 whitespace-nowrap border-r border-slate-200">
                                  {dateFormatted}
                                </td>

                                {/* Days Elapsed Column */}
                                <td className="py-3 px-3.5 font-bold text-[11px] whitespace-nowrap border-r border-slate-200">
                                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black inline-flex items-center space-x-1 border shadow-2xs ${
                                    daysElapsed === 0
                                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                      : daysElapsed <= 3
                                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                                      : daysElapsed <= 7
                                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                                      : 'bg-red-100 text-red-900 border-red-300'
                                  }`}>
                                    <Clock className="w-3 h-3 shrink-0" />
                                    <span>
                                      {daysElapsed === 0 ? 'Hoy (0 días)' : daysElapsed === 1 ? '1 día' : `${daysElapsed} días`}
                                    </span>
                                  </span>
                                </td>

                                {/* Priority Column */}
                                <td className="py-3 px-3.5 whitespace-nowrap border-r border-slate-200">
                                  {priorityBadge}
                                </td>

                                {/* Status Column */}
                                <td className="py-3 px-3.5 whitespace-nowrap border-r border-slate-200">
                                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full inline-block shadow-2xs ${
                                    inc.status === 'resuelto' 
                                      ? 'bg-emerald-600 text-white border border-emerald-700' 
                                      : inc.status === 'reportado'
                                      ? 'bg-blue-600 text-white border border-blue-700'
                                      : 'bg-amber-500 text-slate-950 border border-amber-600 font-black'
                                  }`}>
                                    {inc.status === 'resuelto' ? 'Solucionado' : inc.status === 'reportado' ? 'Recibido' : 'En proceso'}
                                  </span>
                                </td>

                                {/* Action Column */}
                                <td className="py-3 px-3.5 text-center whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedIncident(inc);
                                    }}
                                    className="px-3 py-1.5 text-[11px] font-black bg-gradient-to-r from-[#0A4191] to-[#0C51B6] hover:from-[#083373] hover:to-[#0A4191] text-white rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center space-x-1 mx-auto"
                                  >
                                    <FileText className="w-3 h-3 text-blue-200" />
                                    <span>Ver Detalle</span>
                                  </button>
                                </td>
                              </tr>
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
                          <tr>
                            <td colSpan={8} className="text-center py-8 text-xs font-black text-slate-600 bg-white">
                              No hay reportes registrados en esta categoría.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: MAPA */}
            {citizenTab === 'mapa' && (
              <div className="space-y-3 text-xs">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-[#0A4191]" />
                      <span>Mapa Georreferenciado Cantonal de Logroño</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Delimitación Territorial, Atractivos Turísticos y Coordenadas GPS</p>
                  </div>

                  {/* Subtab Toggle Buttons */}
                  <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setMapSubTab('turismo')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                        mapSubTab === 'turismo'
                          ? 'bg-[#0A4191] text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      <span>🗺️ Turismo & Rutas GPS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMapSubTab('incidentes')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                        mapSubTab === 'incidentes'
                          ? 'bg-[#0A4191] text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      <span>🚨 Incidentes & Alertas</span>
                    </button>
                  </div>
                </div>

                {mapSubTab === 'turismo' ? (
                  <div className="w-full h-[680px] max-w-full rounded-2xl overflow-hidden border-2 border-[#0A4191] shadow-lg">
                    <WelcomeTouristMap className="w-full h-[680px]" />
                  </div>
                ) : (
                  <LogronoGoogleMap
                    incidents={incidents}
                    onSelectIncident={(inc) => setSelectedIncident(inc)}
                  />
                )}
              </div>
            )}

            {/* TAB 5: TRÁMITES & PQRS MUNICIPAL */}
            {citizenTab === 'pqrs' && (
              <div className="bg-[#F8FAFC] dark:bg-slate-900 border-2 border-[#0A4191] rounded-3xl p-4 sm:p-6 shadow-xl space-y-5 text-xs text-slate-800 dark:text-slate-200 animate-in fade-in duration-200">
                
                {/* Header Banner Header Principal (Combined Colors) */}
                <div className="bg-gradient-to-r from-[#0A4191] via-[#0D4EA8] to-[#083373] text-white p-4 sm:p-5 rounded-2xl border-2 border-[#0A4191] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
                      <FileCheck className="w-7 h-7 text-emerald-300 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-black text-base sm:text-lg tracking-tight text-white leading-tight">
                          Portal de Trámites & PQRS Municipal
                        </h3>
                        <span className="bg-emerald-500/30 border border-emerald-300/40 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Ventanilla Única
                        </span>
                      </div>
                      <p className="text-xs text-blue-100 font-medium mt-0.5">
                        Gobierno Autónomo Descentralizado Municipal de Logroño • Cantón Intercultural 2026
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setCitizenTab('inicio')}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Inicio</span>
                    </button>
                    <div className="bg-emerald-500 text-slate-950 font-black text-[11px] px-3 py-1.5 rounded-xl border border-emerald-300 shadow-sm flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
                      <span>Atención 24/7</span>
                    </div>
                  </div>
                </div>

                {/* Ribbon Metrics (Combined Color Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div 
                    onClick={() => setTramiteMainTab('catalogo')}
                    className="bg-gradient-to-br from-blue-50 via-white to-blue-100/60 dark:from-slate-800 dark:to-slate-900 border-2 border-blue-200 dark:border-blue-900/60 rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-[11px] font-extrabold text-[#0A4191] dark:text-blue-300 uppercase tracking-wider">
                        Catálogo Digital
                      </p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">
                        {MOCK_TRAMITES_CATALOG.length} <span className="text-xs font-semibold text-slate-500">Servicios</span>
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#0A4191] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </div>

                  <div 
                    onClick={() => setTramiteMainTab('mis_tramites')}
                    className="bg-gradient-to-br from-amber-50 via-white to-amber-100/60 dark:from-slate-800 dark:to-slate-900 border-2 border-amber-200 dark:border-amber-900/60 rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-[11px] font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                        Trámites en Proceso
                      </p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">
                        {userTramitesList.filter(t => t.status === 'en_proceso' || t.status === 'en_revision').length} <span className="text-xs font-semibold text-slate-500">Solicitudes</span>
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <Clock className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </div>

                  <div 
                    onClick={() => setTramiteMainTab('mis_tramites')}
                    className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100/60 dark:from-slate-800 dark:to-slate-900 border-2 border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                        Trámites Aprobados
                      </p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">
                        {userTramitesList.filter(t => t.status === 'aprobado').length} <span className="text-xs font-semibold text-slate-500">Listos</span>
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                {/* Sub-Navigation Buttons (Combined Professional Aesthetic) */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setTramiteMainTab('catalogo')}
                      className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all duration-200 flex items-center space-x-2 cursor-pointer shadow-xs ${
                        tramiteMainTab === 'catalogo'
                          ? 'bg-gradient-to-r from-[#0A4191] to-[#0C51B6] text-white border-2 border-[#0A4191] shadow-md ring-2 ring-blue-300/50'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-[#0A4191]'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Catálogo de Trámites Municipal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTramiteMainTab('mis_tramites')}
                      className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all duration-200 flex items-center space-x-2 cursor-pointer shadow-xs ${
                        tramiteMainTab === 'mis_tramites'
                          ? 'bg-gradient-to-r from-[#0A4191] to-[#0C51B6] text-white border-2 border-[#0A4191] shadow-md ring-2 ring-blue-300/50'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-[#0A4191]'
                      }`}
                    >
                      <Table className="w-4 h-4 text-emerald-500" />
                      <span>Mis Trámites Ingresados</span>
                      <span className="ml-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.2 rounded-full border border-emerald-300">
                        {userTramitesList.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTramiteMainTab('solicitar')}
                      className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all duration-200 flex items-center space-x-2 cursor-pointer shadow-xs ${
                        tramiteMainTab === 'solicitar'
                          ? 'bg-gradient-to-r from-[#159A44] to-emerald-700 text-white border-2 border-emerald-700 shadow-md ring-2 ring-emerald-300/50'
                          : 'bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Solicitar Nuevo Trámite / PQRS</span>
                    </button>
                  </div>

                  {tramiteMainTab === 'catalogo' && (
                    <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-800 p-1 border-2 border-slate-200 dark:border-slate-700 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setTramiteCatalogViewMode('tabla')}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 ${
                          tramiteCatalogViewMode === 'tabla'
                            ? 'bg-[#0A4191] text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                        title="Ver como Tabla Personalizada"
                      >
                        <Table className="w-4 h-4" />
                        <span className="hidden sm:inline">Tabla</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTramiteCatalogViewMode('tarjetas')}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 ${
                          tramiteCatalogViewMode === 'tarjetas'
                            ? 'bg-[#0A4191] text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                        title="Ver como Tarjetas"
                      >
                        <LayoutGrid className="w-4 h-4" />
                        <span className="hidden sm:inline">Tarjetas</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* SUB-VIEW 1: CATÁLOGO DE TRÁMITES */}
                {tramiteMainTab === 'catalogo' && (
                  <div className="space-y-4">
                    {/* Catalog Notice Banner */}
                    {catalogNoticeMsg && (
                      <div className="bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-400 text-emerald-900 dark:text-emerald-200 px-4 py-3 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
                        <div className="flex items-center space-x-2 font-black text-xs">
                          <CheckCircle2 className="w-5 h-5 text-[#159A44] shrink-0" />
                          <span>{catalogNoticeMsg}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCatalogNoticeMsg(null)}
                          className="p-1 text-emerald-800 hover:text-emerald-950 dark:hover:text-white rounded-lg cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Filter Pills & Search Bar & Add Button */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-blue-50/80 via-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-3 rounded-2xl border-2 border-blue-100 dark:border-slate-800 shadow-xs">
                      {/* Filter Pills */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-black text-slate-500 uppercase mr-1">Filtrar:</span>
                        {[
                          { key: 'todos', label: 'Todos' },
                          { key: 'avaluos', label: 'Avalúos y Catastros' },
                          { key: 'agua', label: 'Agua & Saneamiento' },
                          { key: 'obras', label: 'Obras Públicas' },
                          { key: 'patentes', label: 'Patentes & LUAE' },
                          { key: 'pqrs', label: 'PQRS & Atenciones' }
                        ].map((cat) => (
                          <button
                            key={cat.key}
                            type="button"
                            onClick={() => setTramiteCatFilter(cat.key as any)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer border ${
                              tramiteCatFilter === cat.key
                                ? 'bg-[#0A4191] text-white border-[#0A4191] shadow-xs'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      {/* Search Bar & Add Catalog Button */}
                      <div className="flex items-center space-x-2 min-w-[220px]">
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            placeholder="Buscar trámite o requisito..."
                            value={tramiteSearch}
                            onChange={(e) => setTramiteSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0A4191] transition-colors"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleOpenAddCatalogItem}
                          className="px-3 py-2 bg-gradient-to-r from-[#159A44] to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center space-x-1 shrink-0"
                          title="Agregar Nuevo Trámite al Catálogo"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="hidden sm:inline">Nuevo Trámite</span>
                        </button>
                      </div>
                    </div>

                    {/* Tabla Personalizada / Cards Container */}
                    {(() => {
                      const filteredCatalog = catalogList.filter((item) => {
                        const matchesCategory = tramiteCatFilter === 'todos' || item.category === tramiteCatFilter;
                        const matchesSearch =
                          item.name.toLowerCase().includes(tramiteSearch.toLowerCase()) ||
                          item.code.toLowerCase().includes(tramiteSearch.toLowerCase()) ||
                          item.department.toLowerCase().includes(tramiteSearch.toLowerCase()) ||
                          item.description.toLowerCase().includes(tramiteSearch.toLowerCase());
                        return matchesCategory && matchesSearch;
                      });

                      if (filteredCatalog.length === 0) {
                        return (
                          <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-2">
                            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
                            <p className="font-bold text-slate-700 dark:text-slate-300">No se encontraron trámites con ese criterio.</p>
                            <button
                              type="button"
                              onClick={() => {
                                setTramiteCatFilter('todos');
                                setTramiteSearch('');
                              }}
                              className="px-3 py-1.5 bg-[#0A4191] text-white rounded-xl font-bold text-xs cursor-pointer"
                            >
                              Restablecer Filtros
                            </button>
                          </div>
                        );
                      }

                      if (tramiteCatalogViewMode === 'tabla') {
                        return (
                          <div className="overflow-x-auto rounded-2xl border-2 border-[#0A4191] shadow-md bg-white dark:bg-slate-800">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] text-white text-[11px] font-black uppercase tracking-wider">
                                  <th className="py-3 px-3.5 border-r border-white/20">Código</th>
                                  <th className="py-3 px-3.5 border-r border-white/20">Trámite & Servicio Municipal</th>
                                  <th className="py-3 px-3.5 border-r border-white/20">Departamento</th>
                                  <th className="py-3 px-3.5 border-r border-white/20">Costo</th>
                                  <th className="py-3 px-3.5 border-r border-white/20">Tiempo Est.</th>
                                  <th className="py-3 px-3.5 text-center">Acciones & Gestión</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-xs text-slate-800 dark:text-slate-200">
                                {filteredCatalog.map((item, idx) => (
                                  <tr
                                    key={item.id}
                                    className={`transition-colors hover:bg-blue-50/90 dark:hover:bg-slate-700/80 ${
                                      idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/80 dark:bg-slate-800/60'
                                    }`}
                                  >
                                    <td className="py-3 px-3.5 font-extrabold text-[#0A4191] dark:text-blue-400 whitespace-nowrap border-r border-slate-200 dark:border-slate-700">
                                      <span className="bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-lg">
                                        {item.code}
                                      </span>
                                    </td>

                                    <td className="py-3 px-3.5 border-r border-slate-200 dark:border-slate-700">
                                      <div className="font-extrabold text-slate-900 dark:text-white leading-snug">
                                        {item.name}
                                      </div>
                                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                        {item.description}
                                      </p>
                                    </td>

                                    <td className="py-3 px-3.5 font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 whitespace-nowrap">
                                      <div className="flex items-center space-x-1.5">
                                        <Building2 className="w-3.5 h-3.5 text-[#0A4191] shrink-0" />
                                        <span>{item.department}</span>
                                      </div>
                                    </td>

                                    <td className="py-3 px-3.5 font-black text-emerald-800 dark:text-emerald-300 border-r border-slate-200 dark:border-slate-700 whitespace-nowrap">
                                      <span className="bg-emerald-50 dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-lg">
                                        {item.cost}
                                      </span>
                                    </td>

                                    <td className="py-3 px-3.5 font-bold text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 whitespace-nowrap">
                                      <div className="flex items-center space-x-1">
                                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                        <span>{item.responseTime}</span>
                                      </div>
                                    </td>

                                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                                      <div className="flex items-center justify-center space-x-1.5">
                                        <button
                                          type="button"
                                          onClick={() => setSelectedTramiteCatalog(item)}
                                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-[#0A4191] dark:text-blue-300 border border-blue-300 dark:border-slate-600 rounded-xl font-extrabold text-[11px] transition-all cursor-pointer flex items-center space-x-1"
                                          title="Ver Requisitos"
                                        >
                                          <FileText className="w-3.5 h-3.5" />
                                          <span>Requisitos</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleOpenEditCatalogItem(item)}
                                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-extrabold text-[11px] cursor-pointer transition-colors shadow-xs flex items-center space-x-1"
                                          title="Editar Trámite del Catálogo"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                          <span>Editar</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => setDeletingCatalogItem(item)}
                                          className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-extrabold text-[11px] cursor-pointer transition-colors shadow-xs flex items-center space-x-1"
                                          title="Eliminar Trámite del Catálogo"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                          <span>Eliminar</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => {
                                            setPqrsSubject(`Solicitud: ${item.name}`);
                                            setPqrsDetail(`Requerimiento para el trámite ${item.code} - ${item.name}.`);
                                            setTramiteMainTab('solicitar');
                                          }}
                                          className="px-3 py-1.5 bg-gradient-to-r from-[#0A4191] to-[#0C51B6] hover:from-[#083373] hover:to-[#0A4191] text-white rounded-xl font-extrabold text-[11px] shadow-xs cursor-pointer transition-all flex items-center space-x-1"
                                        >
                                          <span>Iniciar</span>
                                          <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      }

                      // Tarjetas View
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredCatalog.map((item) => (
                            <div
                              key={item.id}
                              className="bg-white dark:bg-slate-800 border-2 border-[#0A4191]/40 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-[#0A4191] transition-all flex flex-col justify-between space-y-3"
                            >
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <span className="bg-blue-50 dark:bg-slate-900 text-[#0A4191] dark:text-blue-300 font-extrabold text-[10px] px-2 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800">
                                      {item.code}
                                    </span>
                                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight mt-1">
                                      {item.name}
                                    </h4>
                                  </div>
                                  <span className="bg-emerald-50 text-emerald-800 dark:bg-slate-900 dark:text-emerald-300 font-black text-xs px-2.5 py-1 rounded-xl border border-emerald-300 dark:border-emerald-800 shrink-0">
                                    {item.cost}
                                  </span>
                                </div>

                                <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2">
                                  {item.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 pt-1">
                                  <span className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg">
                                    <Building2 className="w-3 h-3 text-[#0A4191]" />
                                    <span>{item.department}</span>
                                  </span>
                                  <span className="flex items-center space-x-1 bg-amber-50 dark:bg-slate-700 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-lg">
                                    <Clock className="w-3 h-3" />
                                    <span>{item.responseTime}</span>
                                  </span>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedTramiteCatalog(item)}
                                  className="text-[#0A4191] dark:text-blue-400 font-extrabold text-xs hover:underline cursor-pointer"
                                >
                                  Ver {item.requirements.length} Requisitos →
                                </button>

                                <div className="flex items-center space-x-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditCatalogItem(item)}
                                    className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-extrabold text-[11px] cursor-pointer transition-colors shadow-xs flex items-center space-x-1"
                                    title="Editar Trámite del Catálogo"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Editar</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setDeletingCatalogItem(item)}
                                    className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-extrabold text-[11px] cursor-pointer transition-colors shadow-xs flex items-center space-x-1"
                                    title="Eliminar Trámite del Catálogo"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Eliminar</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPqrsSubject(`Solicitud: ${item.name}`);
                                      setPqrsDetail(`Requerimiento para el trámite ${item.code} - ${item.name}.`);
                                      setTramiteMainTab('solicitar');
                                    }}
                                    className="px-3 py-1.5 bg-gradient-to-r from-[#0A4191] to-[#0C51B6] hover:from-[#083373] text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-xs transition-all flex items-center space-x-1"
                                  >
                                    <span>Solicitar</span>
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* SUB-VIEW 2: MIS TRÁMITES INGRESADOS (TABLA PERSONALIZADA DE SEGUIMIENTO) */}
                {tramiteMainTab === 'mis_tramites' && (
                  <div className="space-y-4">
                    {/* Notice Toast Banner */}
                    {tramiteNoticeMsg && (
                      <div className="bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-400 text-emerald-900 dark:text-emerald-200 px-4 py-3 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
                        <div className="flex items-center space-x-2 font-black text-xs">
                          <CheckCircle2 className="w-5 h-5 text-[#159A44] shrink-0" />
                          <span>{tramiteNoticeMsg}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTramiteNoticeMsg(null)}
                          className="p-1 text-emerald-800 hover:text-emerald-950 dark:hover:text-white rounded-lg cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 via-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-3.5 rounded-2xl border-2 border-blue-200 dark:border-slate-800 shadow-xs">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#0A4191] dark:text-blue-300">
                          Tabla Personalizada de Seguimiento de Trámites
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Historial y estado en tiempo real con opciones de gestión, edición y eliminación de solicitudes.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setTramiteMainTab('solicitar')}
                        className="px-3.5 py-2 bg-[#159A44] hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer transition-colors flex items-center space-x-1.5"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Nuevo Trámite</span>
                      </button>
                    </div>

                    {userTramitesList.length === 0 ? (
                      <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-3">
                        <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                        <h5 className="font-black text-slate-800 dark:text-slate-200 text-sm">No tiene trámites registrados en este momento.</h5>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Puede ingresar un nuevo trámite o PQRS haciendo clic en el botón inferior.
                        </p>
                        <button
                          type="button"
                          onClick={() => setTramiteMainTab('solicitar')}
                          className="px-4 py-2 bg-[#0A4191] text-white rounded-xl font-extrabold text-xs cursor-pointer shadow-xs"
                        >
                          Solicitar Trámite Ahora
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-2xl border-2 border-[#0A4191] shadow-md bg-white dark:bg-slate-800">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] text-white text-[11px] font-black uppercase tracking-wider">
                              <th className="py-3.5 px-3.5 border-r border-white/20">Código Trámite</th>
                              <th className="py-3.5 px-3.5 border-r border-white/20">Tipo & Asunto</th>
                              <th className="py-3.5 px-3.5 border-r border-white/20">Departamento</th>
                              <th className="py-3.5 px-3.5 border-r border-white/20">Fecha</th>
                              <th className="py-3.5 px-3.5 border-r border-white/20">Estado</th>
                              <th className="py-3.5 px-3.5 text-center">Acciones & Gestión</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-xs text-slate-800 dark:text-slate-200">
                            {userTramitesList.map((tr, idx) => (
                              <tr
                                key={tr.id}
                                className={`transition-colors hover:bg-blue-50/90 dark:hover:bg-slate-700/80 ${
                                  idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/80 dark:bg-slate-800/60'
                                }`}
                              >
                                <td className="py-3.5 px-3.5 font-black text-[#0A4191] dark:text-blue-400 whitespace-nowrap border-r border-slate-200 dark:border-slate-700">
                                  <span className="bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-xl">
                                    {tr.code}
                                  </span>
                                </td>

                                <td className="py-3.5 px-3.5 border-r border-slate-200 dark:border-slate-700">
                                  <div className="font-extrabold text-slate-900 dark:text-white leading-snug">
                                    {tr.type}
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                    {tr.subject}
                                  </p>
                                </td>

                                <td className="py-3.5 px-3.5 font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 whitespace-nowrap">
                                  <div className="flex items-center space-x-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-[#0A4191] shrink-0" />
                                    <span>{tr.department}</span>
                                  </div>
                                </td>

                                <td className="py-3.5 px-3.5 font-bold text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 whitespace-nowrap">
                                  {tr.date}
                                </td>

                                <td className="py-3.5 px-3.5 border-r border-slate-200 dark:border-slate-700 whitespace-nowrap">
                                  {tr.status === 'aprobado' && (
                                    <span className="bg-emerald-600 text-white font-black text-[11px] px-2.5 py-1 rounded-xl shadow-xs inline-flex items-center space-x-1">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Aprobado</span>
                                    </span>
                                  )}
                                  {tr.status === 'en_proceso' && (
                                    <span className="bg-[#0A4191] text-white font-black text-[11px] px-2.5 py-1 rounded-xl shadow-xs inline-flex items-center space-x-1">
                                      <Clock className="w-3.5 h-3.5 text-amber-300" />
                                      <span>En Proceso</span>
                                    </span>
                                  )}
                                  {tr.status === 'en_revision' && (
                                    <span className="bg-amber-500 text-slate-950 font-black text-[11px] px-2.5 py-1 rounded-xl shadow-xs inline-flex items-center space-x-1">
                                      <AlertTriangle className="w-3.5 h-3.5 text-slate-950" />
                                      <span>En Revisión</span>
                                    </span>
                                  )}
                                  {tr.status === 'rechazado' && (
                                    <span className="bg-rose-600 text-white font-black text-[11px] px-2.5 py-1 rounded-xl shadow-xs inline-flex items-center space-x-1">
                                      <X className="w-3.5 h-3.5" />
                                      <span>Rechazado</span>
                                    </span>
                                  )}
                                </td>

                                <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                                  <div className="flex items-center justify-center space-x-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedUserTramite(tr)}
                                      className="px-2.5 py-1.5 bg-[#0A4191] hover:bg-blue-800 text-white rounded-xl font-extrabold text-[11px] cursor-pointer transition-colors shadow-xs flex items-center space-x-1"
                                      title="Ver Detalle"
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                      <span>Detalle</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditUserTramite(tr)}
                                      className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-extrabold text-[11px] cursor-pointer transition-colors shadow-xs flex items-center space-x-1"
                                      title="Editar Trámite"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                      <span>Editar</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setDeletingUserTramite(tr)}
                                      className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-extrabold text-[11px] cursor-pointer transition-colors shadow-xs flex items-center space-x-1"
                                      title="Eliminar Trámite"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Eliminar</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* SUB-VIEW 3: SOLICITAR NUEVO TRÁMITE / PQRS FORM */}
                {tramiteMainTab === 'solicitar' && (
                  <div className="space-y-4">
                    {pqrsSuccess ? (
                      <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100 border-2 border-emerald-400 text-emerald-950 p-6 rounded-3xl text-center space-y-3 shadow-md">
                        <CheckCircle2 className="w-12 h-12 text-[#159A44] mx-auto animate-bounce" />
                        <h4 className="font-black text-base sm:text-lg">¡Trámite Registrado Exitosamente!</h4>
                        <p className="text-xs text-emerald-800 font-medium max-w-lg mx-auto">
                          Su requerimiento de tipo <strong className="font-extrabold text-emerald-900">{pqrsType}</strong> ha sido derivado a la Secretaría del GAD Logroño para su atención prioritaria.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPqrsSuccess(false);
                              setPqrsSubject('');
                              setPqrsDetail('');
                              setTramiteMainTab('mis_tramites');
                            }}
                            className="bg-[#0A4191] text-white px-4 py-2 rounded-xl font-extrabold text-xs cursor-pointer shadow-sm hover:bg-blue-800 transition-colors"
                          >
                            Ver en Mis Trámites Ingresados
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPqrsSuccess(false);
                              setPqrsSubject('');
                              setPqrsDetail('');
                            }}
                            className="bg-[#159A44] text-white px-4 py-2 rounded-xl font-extrabold text-xs cursor-pointer shadow-sm hover:bg-emerald-700 transition-colors"
                          >
                            Registrar Otro Trámite
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const newRecord: UserTramiteRecord = {
                            id: 'usr-trm-' + Date.now(),
                            code: `TRM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                            type: pqrsType,
                            subject: pqrsSubject || 'Solicitud de Trámite Municipal',
                            department: 'Secretaría General / Participación Ciudadana',
                            date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                            status: 'en_proceso',
                            applicant: citizenName || 'María Fernanda Shakaim',
                            observation: 'Su solicitud ha sido ingresada en el sistema del GAD Logroño y se le asignó técnico responsable.'
                          };
                          setUserTramitesList([newRecord, ...userTramitesList]);
                          setPqrsSuccess(true);
                        }}
                        className="bg-white dark:bg-slate-800 border-2 border-[#0A4191]/60 rounded-3xl p-5 sm:p-6 shadow-md space-y-4"
                      >
                        <div className="border-b border-slate-200 dark:border-slate-700 pb-3 flex items-center justify-between">
                          <div>
                            <h4 className="font-extrabold text-sm text-[#0A4191] dark:text-blue-300">
                              Formulario Oficial de Solicitud de Trámite / PQRS
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              Complete los campos requeridos para la gestión ante el GAD Municipal de Logroño.
                            </p>
                          </div>
                          <span className="bg-blue-50 text-[#0A4191] dark:bg-slate-900 dark:text-blue-300 font-extrabold text-[10px] px-2.5 py-1 rounded-xl border border-blue-200 dark:border-blue-800">
                            Paso 1 de 1
                          </span>
                        </div>

                        {/* Tipo de Trámite Selector Chips */}
                        <div>
                          <label className="block font-black text-slate-800 dark:text-slate-200 mb-1.5">
                            Seleccione el Tipo de Requerimiento:
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                            {(['Petición', 'Queja', 'Reclamo', 'Sugerencia', 'Certificado', 'Inspección'] as const).map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setPqrsType(t)}
                                className={`py-2 px-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                                  pqrsType === t
                                    ? 'bg-gradient-to-r from-[#0A4191] to-[#0C51B6] text-white border-[#0A4191] shadow-xs'
                                    : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:border-[#0A4191]'
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Asunto Input */}
                        <div>
                          <label className="block font-black text-slate-800 dark:text-slate-200 mb-1">
                            Asunto o Nombre del Trámite:
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. Solicitud de Certificado de No Adeudar o Permiso de Construcción"
                            value={pqrsSubject}
                            onChange={(e) => setPqrsSubject(e.target.value)}
                            className="w-full p-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0A4191] transition-colors"
                          />
                        </div>

                        {/* Detalle Textarea */}
                        <div>
                          <label className="block font-black text-slate-800 dark:text-slate-200 mb-1">
                            Fundamentación y Detalle del Requerimiento:
                          </label>
                          <textarea
                            required
                            rows={4}
                            placeholder="Describa con claridad su solicitud, predio involucrado, antecedentes o ubicación en el Cantón Logroño..."
                            value={pqrsDetail}
                            onChange={(e) => setPqrsDetail(e.target.value)}
                            className="w-full p-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0A4191] transition-colors"
                          />
                        </div>

                        {/* Solicitante Info (Pre-filled) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                          <div>
                            <label className="block font-bold text-slate-600 dark:text-slate-400 text-[11px] mb-0.5">
                              Nombres del Solicitante:
                            </label>
                            <input
                              type="text"
                              value={citizenName}
                              onChange={(e) => setCitizenName(e.target.value)}
                              className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-bold text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-600 dark:text-slate-400 text-[11px] mb-0.5">
                              Cédula / Identificación:
                            </label>
                            <input
                              type="text"
                              value={citizenCedula}
                              onChange={(e) => setCitizenCedula(e.target.value)}
                              className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-bold text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => handleTriggerCancelTramite('pqrs')}
                            className="w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-extrabold text-xs rounded-xl border-2 border-slate-300 dark:border-slate-600 cursor-pointer transition-colors"
                          >
                            Cancelar Trámite
                          </button>
                          <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-[#159A44] to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center space-x-2"
                          >
                            <Send className="w-4 h-4" />
                            <span>REGISTRAR Y ENVIAR TRÁMITE</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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

            {/* TAB 7: NOTICIAS (PLANTILLA PERSONALIZADA DE NOTICIAS CON ESTÉTICA COMBINADA, TABLA Y BOTONES PROFESIONALES) */}
            {citizenTab === 'noticias' && (
              <div className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 border-2 border-[#0A4191] rounded-3xl p-4 sm:p-6 shadow-lg space-y-4 text-xs text-slate-800 animate-in fade-in duration-200">
                {/* Header Banner: Gradiente azul municipal con texto e insignias */}
                <div className="bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] text-white p-4 rounded-2xl border-b-2 border-[#0A4191] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 -mx-1 -mt-1">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setCitizenTab('inicio')}
                      className="p-1.5 text-white hover:bg-white/20 rounded-full cursor-pointer transition-colors border border-white/20 active:scale-95 shrink-0"
                      title="Volver a Inicio"
                    >
                      <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black font-mono text-amber-300 bg-white/15 px-2 py-0.5 rounded border border-white/20 uppercase tracking-wider shadow-2xs">
                          Comunicación Oficial GAD
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-white font-serif tracking-tight mt-0.5">
                        Noticias & Comunicados Cantonales
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 self-end sm:self-auto text-[11px] font-bold">
                    <span className="bg-white/15 text-blue-100 px-3 py-1 rounded-xl border border-white/25 backdrop-blur-xs flex items-center space-x-1.5 shadow-2xs">
                      <Newspaper className="w-3.5 h-3.5 text-amber-300" />
                      <span>Informativo Logroño 2026</span>
                    </span>
                  </div>
                </div>

                {/* Quick Summary Ribbon */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="bg-white/90 border border-slate-300 p-2.5 sm:p-3 rounded-2xl shadow-2xs flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#0A4191] flex items-center justify-center shrink-0">
                      <Newspaper className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Publicaciones</span>
                      <span className="text-sm font-black text-slate-900">{MOCK_NEWS.length}</span>
                    </div>
                  </div>

                  <div className="bg-amber-50/90 border border-amber-200 p-2.5 sm:p-3 rounded-2xl shadow-2xs flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
                      <Megaphone className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-800 font-bold block uppercase tracking-wider">Comunicados</span>
                      <span className="text-sm font-black text-amber-950">
                        {MOCK_NEWS.filter((n) => n.category === 'comunicados').length}
                      </span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/90 border border-emerald-200 p-2.5 sm:p-3 rounded-2xl shadow-2xs flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0">
                      <HardHat className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-800 font-bold block uppercase tracking-wider">Obras & Eventos</span>
                      <span className="text-sm font-black text-emerald-950">
                        {MOCK_NEWS.filter((n) => n.category === 'obras' || n.category === 'eventos').length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filter Pills Row & Search/View Controls */}
                <div className="space-y-2.5">
                  {/* Top Filter Buttons: Todos | Comunicados | Obras | Eventos */}
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    {(['todos', 'comunicados', 'obras', 'eventos'] as const).map((filter) => {
                      const labels: Record<string, string> = {
                        todos: 'Todos',
                        comunicados: 'Comunicados',
                        obras: 'Obras',
                        eventos: 'Eventos'
                      };
                      const icons: Record<string, React.ReactNode> = {
                        todos: <ListFilter className="w-3.5 h-3.5 shrink-0" />,
                        comunicados: <Megaphone className="w-3.5 h-3.5 shrink-0" />,
                        obras: <HardHat className="w-3.5 h-3.5 shrink-0" />,
                        eventos: <Calendar className="w-3.5 h-3.5 shrink-0" />
                      };
                      const isActive = noticiasFilter === filter;
                      return (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setNoticiasFilter(filter)}
                          title={`Filtrar por ${labels[filter]}`}
                          className={`py-2 px-1.5 sm:px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center space-x-1.5 border active:scale-95 shadow-2xs ${
                            isActive
                              ? 'bg-gradient-to-r from-[#0A4191] to-[#0C51B6] text-white border-[#0A4191] shadow-md'
                              : 'bg-white/90 hover:bg-white text-slate-700 border-slate-300'
                          }`}
                        >
                          {icons[filter]}
                          <span className="truncate">{labels[filter]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Secondary Bar: Search Input + View Toggle (Tarjetas vs Tabla) + Sort Dropdown */}
                  <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between pt-1">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="text"
                        value={noticiasSearchTerm}
                        onChange={(e) => setNoticiasSearchTerm(e.target.value)}
                        placeholder="Buscar noticias o publicaciones..."
                        className="w-full pl-9 pr-8 py-2 bg-white/90 border border-slate-300 rounded-xl text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0A4191]/40 shadow-2xs"
                      />
                      {noticiasSearchTerm && (
                        <button
                          type="button"
                          onClick={() => setNoticiasSearchTerm('')}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* View Mode Switcher (Tarjetas vs Tabla) */}
                    <div className="flex items-center space-x-2">
                      <div className="bg-slate-200/80 p-1 rounded-xl border border-slate-300 flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setNoticiasViewMode('tarjetas')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                            noticiasViewMode === 'tarjetas'
                              ? 'bg-[#0A4191] text-white shadow-xs'
                              : 'text-slate-700 hover:bg-slate-300/60'
                          }`}
                          title="Vista Cuadrícula de Tarjetas"
                        >
                          <LayoutGrid className="w-3.5 h-3.5" />
                          <span className="hidden xs:inline">Tarjetas</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoticiasViewMode('tabla')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                            noticiasViewMode === 'tabla'
                              ? 'bg-[#0A4191] text-white shadow-xs'
                              : 'text-slate-700 hover:bg-slate-300/60'
                          }`}
                          title="Vista Tabla Personalizada"
                        >
                          <Table className="w-3.5 h-3.5" />
                          <span className="hidden xs:inline">Tabla</span>
                        </button>
                      </div>

                      {/* Sort Selector */}
                      <div className="flex items-center space-x-1.5 bg-white/90 px-2.5 py-1.5 rounded-xl border border-slate-300 shadow-2xs">
                        <ArrowUpDown className="w-3.5 h-3.5 text-[#0A4191] shrink-0" />
                        <select
                          value={noticiasSortOrder}
                          onChange={(e) => setNoticiasSortOrder(e.target.value as any)}
                          className="bg-transparent text-slate-800 text-xs font-extrabold focus:outline-none cursor-pointer"
                        >
                          <option value="recientes">Recientes</option>
                          <option value="antiguas">Antiguas</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Display: Cards vs Custom Table */}
                {(() => {
                  const filteredNews = MOCK_NEWS.filter((item) => {
                    if (noticiasFilter !== 'todos' && item.category !== noticiasFilter) return false;
                    if (noticiasSearchTerm.trim() !== '') {
                      const term = noticiasSearchTerm.toLowerCase();
                      return (
                        item.title.toLowerCase().includes(term) ||
                        item.summary.toLowerCase().includes(term) ||
                        item.content.toLowerCase().includes(term)
                      );
                    }
                    return true;
                  }).sort((a, b) => {
                    if (noticiasSortOrder === 'recientes') {
                      return b.date.localeCompare(a.date);
                    }
                    return a.date.localeCompare(b.date);
                  });

                  if (filteredNews.length === 0) {
                    return (
                      <div className="bg-white/80 border border-slate-300 rounded-2xl p-8 text-center space-y-2">
                        <Newspaper className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="font-bold text-slate-700">No se encontraron noticias con los criterios seleccionados.</p>
                        <p className="text-[11px] text-slate-500">Prueba ajustando el término de búsqueda o cambiando el filtro de categoría.</p>
                      </div>
                    );
                  }

                  if (noticiasViewMode === 'tabla') {
                    return (
                      <div className="overflow-x-auto rounded-2xl border-2 border-[#0A4191]/60 shadow-md bg-gradient-to-b from-white via-slate-50/80 to-blue-50/20">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] text-white text-[11px] font-black uppercase tracking-wider">
                              <th className="py-3.5 px-3.5 border-r border-white/20">Portada</th>
                              <th className="py-3.5 px-3.5 border-r border-white/20">Título & Resumen</th>
                              <th className="py-3.5 px-3.5 border-r border-white/20">Categoría</th>
                              <th className="py-3.5 px-3.5 border-r border-white/20">Fecha</th>
                              <th className="py-3.5 px-3.5 text-center">Acción</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                            {filteredNews.map((news) => (
                              <tr
                                key={news.id}
                                onClick={() => setSelectedNews(news)}
                                className="odd:bg-white even:bg-slate-50/70 hover:bg-blue-50/80 transition-colors cursor-pointer group"
                              >
                                {/* Thumbnail Column */}
                                <td className="py-3 px-3.5 whitespace-nowrap border-r border-slate-200">
                                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-300 shadow-2xs group-hover:border-[#0A4191] transition-colors bg-slate-100">
                                    <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                  </div>
                                </td>

                                {/* Title & Summary Column */}
                                <td className="py-3 px-3.5 border-r border-slate-200 max-w-xs sm:max-w-md">
                                  <h4 className="font-black text-slate-900 group-hover:text-[#0A4191] transition-colors line-clamp-1 text-xs">
                                    {news.title}
                                  </h4>
                                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                                    {news.summary}
                                  </p>
                                </td>

                                {/* Category Column */}
                                <td className="py-3 px-3.5 whitespace-nowrap border-r border-slate-200">
                                  {news.category === 'comunicados' && (
                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black inline-flex items-center space-x-1 bg-blue-100 text-blue-900 border border-blue-300 shadow-2xs">
                                      <Megaphone className="w-3 h-3 text-[#0A4191]" />
                                      <span>Comunicado</span>
                                    </span>
                                  )}
                                  {news.category === 'obras' && (
                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black inline-flex items-center space-x-1 bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                                      <HardHat className="w-3 h-3 text-amber-800" />
                                      <span>Obra Pública</span>
                                    </span>
                                  )}
                                  {news.category === 'eventos' && (
                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black inline-flex items-center space-x-1 bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                                      <Calendar className="w-3 h-3 text-emerald-800" />
                                      <span>Evento</span>
                                    </span>
                                  )}
                                </td>

                                {/* Date Column */}
                                <td className="py-3 px-3.5 font-mono font-extrabold text-[11px] text-slate-700 whitespace-nowrap border-r border-slate-200">
                                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 text-slate-800">
                                    {news.date}
                                  </span>
                                </td>

                                {/* Action Column */}
                                <td className="py-3 px-3.5 text-center whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedNews(news);
                                    }}
                                    className="px-3 py-1.5 text-[11px] font-black bg-gradient-to-r from-[#0A4191] to-[#0C51B6] hover:from-[#083373] hover:to-[#0A4191] text-white rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center space-x-1 mx-auto"
                                  >
                                    <FileText className="w-3 h-3 text-blue-200" />
                                    <span>Leer Noticia</span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }

                  {/* Grid of News Cards with Combined Colors */}
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      {filteredNews.map((news) => (
                        <div
                          key={news.id}
                          onClick={() => setSelectedNews(news)}
                          className="bg-white/95 hover:bg-white border-2 border-slate-300 hover:border-[#0A4191] rounded-2xl p-3.5 flex flex-col sm:flex-row items-stretch gap-3 shadow-2xs hover:shadow-md transition-all cursor-pointer group text-slate-800 relative"
                        >
                          {/* Thumbnail Image with Category Badge */}
                          <div className="w-full sm:w-28 h-32 sm:h-auto rounded-xl overflow-hidden shrink-0 border border-slate-200 relative bg-slate-100">
                            <img
                              src={news.image}
                              alt={news.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-1.5 left-1.5">
                              <span className="text-[9px] font-black bg-slate-900/80 text-white px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/20 uppercase">
                                {news.categoryLabel}
                              </span>
                            </div>
                          </div>

                          {/* Title, Summary & Footer Action */}
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-[10px] font-mono font-bold text-slate-500 flex items-center space-x-1">
                                  <Clock className="w-3 h-3 text-[#0A4191]" />
                                  <span>{news.date}</span>
                                </span>
                              </div>
                              <h4 className="font-black text-slate-900 group-hover:text-[#0A4191] text-xs leading-tight transition-colors line-clamp-2">
                                {news.title}
                              </h4>
                              <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-snug">
                                {news.summary}
                              </p>
                            </div>

                            <div className="pt-2 flex items-center justify-between mt-2 border-t border-slate-200">
                              <span className="text-[10px] font-bold text-[#0A4191] flex items-center space-x-1 group-hover:underline">
                                <span>Leer Noticia Completa</span>
                                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedNews(news);
                                }}
                                className="p-1.5 bg-blue-50 text-[#0A4191] hover:bg-[#0A4191] hover:text-white rounded-lg transition-colors border border-blue-200"
                                title="Ver detalle"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB 8: AGENDA MUNICIPAL (REDESIGNED COMBINED COLORS WITH CUSTOM TABLE AND PROFESSIONAL BUTTONS) */}
            {citizenTab === 'agenda' && (
              <div className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 border-2 border-[#0A4191] rounded-3xl p-4 sm:p-6 shadow-lg space-y-4 text-xs text-slate-800 animate-in fade-in duration-200 pb-3">
                {/* Header Banner: Combined colors gradient with official badges & professional action buttons */}
                <div className="bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] text-white p-4 rounded-2xl border-b-2 border-[#0A4191] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 -mx-1 -mt-1">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setCitizenTab('inicio')}
                      className="p-1.5 text-white hover:bg-white/20 rounded-full cursor-pointer transition-colors border border-white/20 active:scale-95 shrink-0"
                      title="Volver a Inicio"
                    >
                      <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black font-mono text-amber-300 bg-white/15 px-2 py-0.5 rounded border border-white/20 uppercase tracking-wider shadow-2xs">
                          Agenda Cantonal Municipal 2026
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-white font-serif tracking-tight mt-0.5">
                        Agenda & Eventos Municipales
                      </h2>
                      <p className="text-[11px] text-blue-100 font-extrabold">
                        Gobierno Autónomo Descentralizado Municipal de Logroño
                      </p>
                    </div>
                  </div>

                  {/* Top Action Buttons: Sincronizar & + Crear Agenda */}
                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={handleSyncAgenda}
                      disabled={isSyncingAgenda}
                      className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-xl font-extrabold text-xs flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-60 shadow-xs backdrop-blur-xs"
                      title="Sincronizar información de la agenda con el servidor"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${isSyncingAgenda ? 'animate-spin' : ''}`} />
                      <span>{isSyncingAgenda ? 'Sincronizando...' : 'Sincronizar'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenCreateAgenda()}
                      className="px-3.5 py-2 bg-gradient-to-r from-[#159A44] to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95 border border-emerald-400/40"
                      title="Crear nueva agenda o evento municipal"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Crear Agenda</span>
                    </button>
                  </div>
                </div>

                {/* Toast Notification Banners */}
                {agendaSyncToast && (
                  <div className="bg-blue-50 border-2 border-[#0A4191] text-[#0A4191] p-3 rounded-2xl flex items-center space-x-2 text-xs font-black animate-in slide-in-from-top-2 shadow-xs">
                    <RefreshCw className={`w-4 h-4 text-[#0A4191] flex-shrink-0 ${isSyncingAgenda ? 'animate-spin' : ''}`} />
                    <span className="flex-1">{agendaSyncToast}</span>
                  </div>
                )}

                {agendaToast && (
                  <div className="bg-emerald-50 border-2 border-emerald-600 text-emerald-900 p-3 rounded-2xl flex items-center space-x-2 text-xs font-black animate-in slide-in-from-top-2 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span className="flex-1">{agendaToast}</span>
                  </div>
                )}

                {/* Quick Summary Stats Ribbon (Combined Colors KPI Cards) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  <div className="bg-gradient-to-br from-white via-blue-50/60 to-slate-50 border-2 border-[#0A4191]/30 p-3 rounded-2xl shadow-xs flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0A4191] to-[#0C51B6] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Calendar className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-extrabold block uppercase tracking-wider">Total Agendas</span>
                      <span className="text-sm font-black text-slate-900">{agendaEvents.length}</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 via-amber-100/40 to-amber-50/80 border-2 border-amber-300/60 p-3 rounded-2xl shadow-xs flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-2xs font-black">
                      <Clock className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-900 font-extrabold block uppercase tracking-wider">Mes Actual</span>
                      <span className="text-sm font-black text-amber-950">
                        {agendaEvents.filter(ev => ev.month === SPANISH_MONTHS[currentCalendarMonth]).length}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 via-emerald-100/40 to-emerald-50/80 border-2 border-emerald-300/60 p-3 rounded-2xl shadow-xs flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Users className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-900 font-extrabold block uppercase tracking-wider">Mingas & Cabildos</span>
                      <span className="text-sm font-black text-emerald-950">
                        {agendaEvents.filter(ev => ev.category === 'Minga' || ev.category === 'Cabildo').length}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 via-purple-100/40 to-purple-50/80 border-2 border-purple-300/60 p-3 rounded-2xl shadow-xs flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Sparkles className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-900 font-extrabold block uppercase tracking-wider">Cultura & Deportes</span>
                      <span className="text-sm font-black text-purple-950">
                        {agendaEvents.filter(ev => ev.category === 'Cultura' || ev.category === 'Deportes').length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filter Chips, Search Bar & View Toggle (Calendario vs Tabla Personalizada) */}
                <div className="space-y-2.5 pt-1">
                  {/* Category Filter Chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-black text-slate-600 uppercase mr-1">Categoría:</span>
                    {(['todos', 'Minga', 'Cabildo', 'Cultura', 'Deportes', 'General'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setAgendaCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer border active:scale-95 shadow-2xs ${
                          agendaCategoryFilter === cat
                            ? 'bg-gradient-to-r from-[#0A4191] to-[#0C51B6] text-white border-[#0A4191] shadow-xs'
                            : 'bg-white/90 hover:bg-white text-slate-700 border-slate-300 hover:border-[#0A4191]'
                        }`}
                      >
                        {cat === 'todos' ? 'Todas' : cat}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar & View Switcher */}
                  <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
                    {/* Search Input */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="text"
                        value={agendaSearchTerm}
                        onChange={(e) => setAgendaSearchTerm(e.target.value)}
                        placeholder="Buscar por título, lugar o descripción..."
                        className="w-full pl-9 pr-8 py-2 bg-white/95 border border-slate-300 rounded-xl text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0A4191]/40 shadow-2xs"
                      />
                      {agendaSearchTerm && (
                        <button
                          type="button"
                          onClick={() => setAgendaSearchTerm('')}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* View Switcher: Calendario vs Tabla Personalizada */}
                    <div className="bg-slate-200/90 p-1 rounded-xl border border-slate-300 flex items-center space-x-1 shrink-0 self-end sm:self-auto shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setAgendaViewMode('calendario')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95 ${
                          agendaViewMode === 'calendario'
                            ? 'bg-gradient-to-r from-[#0A4191] to-[#0C51B6] text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-300/60'
                        }`}
                        title="Vista Calendario interactivo"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Calendario</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAgendaViewMode('tabla')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95 ${
                          agendaViewMode === 'tabla'
                            ? 'bg-gradient-to-r from-[#0A4191] to-[#0C51B6] text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-300/60'
                        }`}
                        title="Vista Tabla Personalizada"
                      >
                        <Table className="w-3.5 h-3.5" />
                        <span>Tabla Personalizada</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Content Render: Calendario vs Tabla Personalizada */}
                {(() => {
                  const currentMonthName = SPANISH_MONTHS[currentCalendarMonth];

                  // Filtered events master list
                  const filteredEventsMaster = agendaEvents.filter((ev) => {
                    const matchesCategory = agendaCategoryFilter === 'todos' || ev.category === agendaCategoryFilter;
                    const term = agendaSearchTerm.toLowerCase().trim();
                    const matchesSearch =
                      !term ||
                      ev.title.toLowerCase().includes(term) ||
                      ev.location.toLowerCase().includes(term) ||
                      (ev.description && ev.description.toLowerCase().includes(term));
                    return matchesCategory && matchesSearch;
                  });

                  if (agendaViewMode === 'tabla') {
                    return (
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-sm text-[#0A4191] flex items-center space-x-1.5">
                            <Table className="w-4 h-4 text-[#0A4191]" />
                            <span>Tabla Personalizada de Agendas y Eventos</span>
                            <span className="text-[10px] font-bold text-slate-500 font-mono">
                              ({filteredEventsMaster.length} registros)
                            </span>
                          </h3>
                        </div>

                        {filteredEventsMaster.length === 0 ? (
                          <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50/30 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-2">
                            <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
                            <p className="font-bold text-slate-700">No se encontraron eventos con los filtros aplicados.</p>
                            <button
                              type="button"
                              onClick={() => {
                                setAgendaCategoryFilter('todos');
                                setAgendaSearchTerm('');
                              }}
                              className="px-3.5 py-1.5 bg-[#0A4191] text-white rounded-xl font-bold text-xs cursor-pointer hover:bg-blue-900 transition-colors shadow-xs"
                            >
                              Restablecer Filtros
                            </button>
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-2xl border-2 border-[#0A4191] shadow-lg bg-gradient-to-b from-white via-slate-50/80 to-blue-50/30">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] text-white text-[11px] font-black uppercase tracking-wider">
                                  <th className="py-3.5 px-3.5 border-r border-white/20">Fecha & Hora</th>
                                  <th className="py-3.5 px-3.5 border-r border-white/20">Categoría</th>
                                  <th className="py-3.5 px-3.5 border-r border-white/20">Título & Descripción del Evento</th>
                                  <th className="py-3.5 px-3.5 border-r border-white/20">Lugar / Ubicación</th>
                                  <th className="py-3.5 px-3.5 text-center">Acciones & Gestión</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                                {filteredEventsMaster.map((ev, idx) => {
                                  const categoryStyle =
                                    ev.category === 'Minga'
                                      ? 'bg-blue-100 text-[#0A4191] border border-blue-300'
                                      : ev.category === 'Cabildo'
                                      ? 'bg-[#0A4191] text-white border border-blue-900'
                                      : ev.category === 'Cultura'
                                      ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                      : ev.category === 'Deportes'
                                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                      : 'bg-amber-100 text-amber-900 border border-amber-300';

                                  return (
                                    <tr
                                      key={ev.id}
                                      className={`transition-colors hover:bg-amber-50/80 ${
                                        idx % 2 === 0 ? 'bg-white/90' : 'bg-blue-50/40'
                                      }`}
                                    >
                                      {/* Fecha & Hora */}
                                      <td className="py-3.5 px-3.5 font-bold text-slate-800 whitespace-nowrap border-r border-slate-200">
                                        <div className="flex flex-col space-y-0.5">
                                          <span className="font-extrabold text-[#0A4191] text-xs">
                                            {ev.day} {ev.month || currentMonthName} {ev.year || currentCalendarYear}
                                          </span>
                                          <span className="text-[10px] font-mono font-bold text-slate-500 flex items-center space-x-1">
                                            <Clock className="w-3 h-3 text-amber-600" />
                                            <span>{ev.time}</span>
                                          </span>
                                        </div>
                                      </td>

                                      {/* Categoría */}
                                      <td className="py-3.5 px-3.5 whitespace-nowrap border-r border-slate-200">
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl uppercase tracking-wider inline-block shadow-2xs ${categoryStyle}`}>
                                          {ev.category || 'General'}
                                        </span>
                                      </td>

                                      {/* Título & Descripción */}
                                      <td className="py-3.5 px-3.5 border-r border-slate-200 max-w-xs sm:max-w-md">
                                        <div className="font-extrabold text-slate-900 leading-snug">
                                          {ev.title}
                                        </div>
                                        {ev.description && (
                                          <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed font-medium">
                                            {ev.description}
                                          </p>
                                        )}
                                      </td>

                                      {/* Lugar / Ubicación */}
                                      <td className="py-3.5 px-3.5 font-bold text-slate-700 border-r border-slate-200 whitespace-nowrap">
                                        <div className="flex items-center space-x-1.5">
                                          <MapPin className="w-3.5 h-3.5 text-[#0A4191] shrink-0" />
                                          <span className="truncate">{ev.location}</span>
                                        </div>
                                      </td>

                                      {/* Acciones & Gestión (Botones Profesionales) */}
                                      <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-1.5">
                                          <button
                                            type="button"
                                            onClick={() => handleOpenEditAgenda(ev)}
                                            className="px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl font-black text-[11px] cursor-pointer transition-all shadow-xs flex items-center space-x-1 border border-amber-400/40 active:scale-95"
                                            title="Editar Agenda"
                                          >
                                            <Edit3 className="w-3.5 h-3.5" />
                                            <span>Editar</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => handleDeleteAgendaEvent(ev.id, ev.title)}
                                            className="px-2.5 py-1.5 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white rounded-xl font-black text-[11px] cursor-pointer transition-all shadow-xs flex items-center space-x-1 border border-red-400/40 active:scale-95"
                                            title="Eliminar Agenda"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Eliminar</span>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Calendario View Mode
                  const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
                  const firstDayIndex = (new Date(currentCalendarYear, currentCalendarMonth, 1).getDay() + 6) % 7; // Mon=0 ... Sun=6
                  const prevMonthDaysCount = new Date(currentCalendarYear, currentCalendarMonth, 0).getDate();

                  const prevPaddingDays = Array.from({ length: firstDayIndex }, (_, i) => prevMonthDaysCount - firstDayIndex + i + 1);
                  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
                  const totalGridCells = firstDayIndex + daysInMonth;
                  const nextPaddingCount = (7 - (totalGridCells % 7)) % 7;
                  const nextPaddingDays = Array.from({ length: nextPaddingCount }, (_, i) => i + 1);

                  const isCurrentMonthReal = currentCalendarMonth === new Date().getMonth() && currentCalendarYear === new Date().getFullYear();
                  const todayDate = new Date().getDate();

                  const dayEvents = filteredEventsMaster.filter((ev) => {
                    return ev.day === selectedAgendaDay && 
                           (ev.month === currentMonthName || !ev.month) && 
                           (ev.year === currentCalendarYear || !ev.year);
                  });

                  return (
                    <div className="space-y-4">
                      {/* Calendar Box with Combined Colors Gradient & Dark Blue Border */}
                      <div className="bg-gradient-to-br from-white via-blue-50/40 to-slate-50 rounded-3xl p-4 sm:p-5 border-2 border-[#0A4191]/70 shadow-md space-y-4">
                        {/* Month Header: < Agosto 2026 > + Today jump button */}
                        <div className="flex items-center justify-between px-1 sm:px-3 pt-1">
                          <button
                            type="button"
                            onClick={handlePrevCalendarMonth}
                            className="p-2 text-[#0A4191] hover:bg-blue-100/80 rounded-2xl transition-all cursor-pointer border border-[#0A4191]/30 active:scale-95 shadow-2xs"
                            title="Mes anterior"
                          >
                            <ChevronLeft className="w-6 h-6 stroke-[3]" />
                          </button>

                          <div className="flex items-center space-x-3">
                            <span className="font-black text-base sm:text-xl text-[#0A4191] tracking-tight font-serif">
                              {currentMonthName} {currentCalendarYear}
                            </span>

                            <button
                              type="button"
                              onClick={handleJumpCalendarToToday}
                              className="px-3.5 py-1 bg-gradient-to-r from-[#0A4191] to-[#0C51B6] text-white font-black text-xs sm:text-sm rounded-xl border border-[#0A4191] hover:from-[#083373] hover:to-[#0A4191] transition-all cursor-pointer shadow-xs active:scale-95"
                              title="Ir al día de hoy"
                            >
                              Hoy
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={handleNextCalendarMonth}
                            className="p-2 text-[#0A4191] hover:bg-blue-100/80 rounded-2xl transition-all cursor-pointer border border-[#0A4191]/30 active:scale-95 shadow-2xs"
                            title="Mes siguiente"
                          >
                            <ChevronRight className="w-6 h-6 stroke-[3]" />
                          </button>
                        </div>

                        {/* Days of week header */}
                        <div className="grid grid-cols-7 text-center font-black text-[#0A4191] text-xs sm:text-sm py-2 bg-gradient-to-r from-blue-100/90 via-blue-50/80 to-blue-100/90 rounded-2xl border border-[#0A4191]/30 shadow-2xs">
                          <span>Lun</span>
                          <span>Mar</span>
                          <span>Mié</span>
                          <span>Jue</span>
                          <span>Vie</span>
                          <span>Sáb</span>
                          <span>Dom</span>
                        </div>

                        {/* Days of month grid */}
                        <div className="grid grid-cols-7 gap-y-2.5 gap-x-1.5 text-center items-center pt-1">
                          {/* Previous Month Padding */}
                          {prevPaddingDays.map((pDay) => (
                            <span key={`prev-p-${pDay}`} className="text-xs sm:text-sm font-extrabold text-slate-300 py-2 select-none">
                              {pDay}
                            </span>
                          ))}

                          {/* Current Month Real Days */}
                          {currentMonthDays.map((d) => {
                            const hasEvents = agendaEvents.some(
                              (ev) => ev.day === d && (ev.month === currentMonthName || !ev.month) && (ev.year === currentCalendarYear || !ev.year)
                            );
                            const isSelected = selectedAgendaDay === d;
                            const isToday = isCurrentMonthReal && d === todayDate;

                            return (
                              <button
                                key={`month-day-${d}`}
                                type="button"
                                onClick={() => setSelectedAgendaDay(d)}
                                className={`relative py-1 rounded-2xl text-sm sm:text-base transition-all cursor-pointer flex flex-col items-center justify-center mx-auto ${
                                  isSelected
                                    ? 'w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#0A4191] to-[#0C51B6] text-white font-black shadow-md ring-2 ring-blue-400 scale-105'
                                    : isToday
                                    ? 'w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 text-[#0A4191] border-2 border-[#0A4191] font-black shadow-xs'
                                    : 'w-10 h-10 sm:w-12 sm:h-12 text-[#0A4191] font-black hover:bg-blue-100/70 border border-slate-200 bg-white/90'
                                }`}
                              >
                                <span className="leading-none">{d}</span>
                                {/* Indicator for days with scheduled events */}
                                {hasEvents && (
                                  <span className={`w-2 h-2 rounded-full absolute bottom-1.5 ${
                                    isSelected ? 'bg-amber-300' : 'bg-[#0A4191]'
                                  }`} />
                                )}
                              </button>
                            );
                          })}

                          {/* Next Month Padding */}
                          {nextPaddingDays.map((nDay) => (
                            <span key={`next-p-${nDay}`} className="text-xs sm:text-sm font-extrabold text-slate-300 py-2 select-none">
                              {nDay}
                            </span>
                          ))}
                        </div>

                        {/* Visual Legend */}
                        <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs font-black text-slate-700">
                          <div className="flex items-center space-x-1.5">
                            <span className="w-3.5 h-3.5 rounded-lg bg-[#0A4191] inline-block shadow-2xs" />
                            <span>Día Seleccionado</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className="w-3.5 h-3.5 rounded-lg bg-amber-100 border-2 border-[#0A4191] inline-block" />
                            <span>Hoy</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#0A4191] inline-block" />
                            <span>Evento Programado</span>
                          </div>
                        </div>
                      </div>

                      {/* Section Subtitle & Event Cards */}
                      <div className="pt-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-black text-[#0A4191] text-xs tracking-tight flex items-center space-x-1.5">
                            <Calendar className="w-4 h-4 text-[#0A4191]" />
                            <span>Eventos del {selectedAgendaDay} de {currentMonthName.toLowerCase()} de {currentCalendarYear}</span>
                            <span className="text-[10px] font-bold text-slate-500 font-mono">
                              ({dayEvents.length})
                            </span>
                          </h3>

                          <button
                            type="button"
                            onClick={() => handleOpenCreateAgenda(selectedAgendaDay)}
                            className="text-[11px] font-black text-[#0A4191] hover:underline flex items-center space-x-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Agregar a esta fecha</span>
                          </button>
                        </div>

                        {/* List of Event Cards */}
                        <div className="space-y-3">
                          {dayEvents.length > 0 ? (
                            dayEvents.map((ev) => {
                              const categoryColor =
                                ev.category === 'Minga'
                                  ? 'bg-blue-100 text-[#0A4191] border border-blue-300'
                                  : ev.category === 'Cabildo'
                                  ? 'bg-[#0A4191] text-white border border-blue-900'
                                  : ev.category === 'Cultura'
                                  ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                  : ev.category === 'Deportes'
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300';

                              return (
                                <div
                                  key={ev.id}
                                  className="bg-gradient-to-br from-white via-slate-50 to-blue-50/30 border-2 border-slate-300 hover:border-[#0A4191] rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all space-y-2.5 relative overflow-hidden text-slate-800"
                                >
                                  {/* Top Bar: Category Badge + Time + Action Buttons */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${categoryColor}`}>
                                        {ev.category || 'General'}
                                      </span>
                                      <span className="text-[11px] font-mono font-bold text-slate-600 flex items-center space-x-1">
                                        <Clock className="w-3 h-3 text-[#0A4191]" />
                                        <span>{ev.time}</span>
                                      </span>
                                    </div>

                                    {/* PROFESSIONAL EDIT AND DELETE BUTTONS */}
                                    <div className="flex items-center space-x-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEditAgenda(ev)}
                                        className="px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl font-black text-[11px] cursor-pointer transition-all shadow-xs flex items-center space-x-1 border border-amber-400/40 active:scale-95"
                                        title="Editar esta agenda"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Editar</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteAgendaEvent(ev.id, ev.title)}
                                        className="px-2.5 py-1.5 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white rounded-xl font-black text-[11px] cursor-pointer transition-all shadow-xs flex items-center space-x-1 border border-red-400/40 active:scale-95"
                                        title="Eliminar esta agenda"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Eliminar</span>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Title & Description */}
                                  <div>
                                    <h4 className="font-extrabold text-slate-900 text-xs leading-snug">
                                      {ev.title}
                                    </h4>
                                    {ev.description && (
                                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed font-medium">
                                        {ev.description}
                                      </p>
                                    )}
                                  </div>

                                  {/* Location */}
                                  <div className="pt-2 border-t border-slate-200 flex items-center space-x-1.5 text-[11px] text-slate-700 font-bold">
                                    <MapPin className="w-3.5 h-3.5 text-[#0A4191] flex-shrink-0" />
                                    <span className="truncate">{ev.location}</span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="bg-white/90 border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2">
                              <p className="font-bold text-slate-800 text-xs">
                                No hay agendas programadas para el {selectedAgendaDay} de {currentMonthName.toLowerCase()} de {currentCalendarYear}
                              </p>
                              <p className="text-[11px] text-slate-500 max-w-xs mx-auto font-medium">
                                Puedes crear una nueva agenda municipal para esta fecha usando el botón a continuación.
                              </p>
                              <button
                                type="button"
                                onClick={() => handleOpenCreateAgenda(selectedAgendaDay)}
                                className="px-3.5 py-2 bg-gradient-to-r from-[#0A4191] to-[#0C51B6] hover:from-[#083373] hover:to-[#0A4191] text-white rounded-xl font-extrabold text-xs inline-flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-95 mt-1"
                              >
                                <Plus className="w-4 h-4 stroke-[3]" />
                                <span>Crear agenda para esta fecha</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
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
                    onClick={() => setShowLogoutConfirm(true)}
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
          <div className="absolute bottom-0 inset-x-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 sm:px-4 py-2 z-30 flex items-center justify-around shadow-2xl">
            
            {/* Nav 1: Inicio */}
            <button
              type="button"
              onClick={() => {
                setSelectedIncident(null);
                setCitizenTab('inicio');
              }}
              title="Ir a Inicio / Dashboard"
              className={`flex flex-col items-center justify-center space-y-0.5 transition-all cursor-pointer group ${
                citizenTab === 'inicio' ? 'text-[#0A4191] dark:text-blue-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Home className="w-5 h-5 stroke-[2.2] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] hidden xs:block font-medium">Inicio</span>
            </button>

            {/* Nav 2: Reportes */}
            <button
              type="button"
              onClick={() => {
                setSelectedIncident(null);
                setCitizenTab('mis_reportes');
              }}
              title="Ver Mis Reportes y Trámites"
              className={`flex flex-col items-center justify-center space-y-0.5 transition-all cursor-pointer group ${
                citizenTab === 'mis_reportes' ? 'text-[#0A4191] dark:text-blue-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-5 h-5 stroke-[2.2] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] hidden xs:block font-medium">Reportes</span>
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
              title="Crear Nuevo Reporte o Trámite"
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
              title="Ver Noticias y Comunicados Municipal"
              className={`flex flex-col items-center justify-center space-y-0.5 transition-all cursor-pointer group ${
                citizenTab === 'noticias' ? 'text-[#0A4191] dark:text-blue-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Newspaper className="w-5 h-5 stroke-[2.2] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] hidden xs:block font-medium">Noticias</span>
            </button>

            {/* Nav 5: Perfil */}
            <button
              type="button"
              onClick={() => {
                setSelectedIncident(null);
                setCitizenTab('perfil');
              }}
              title="Ajustes de Perfil y Cuenta"
              className={`flex flex-col items-center justify-center space-y-0.5 transition-all cursor-pointer group ${
                citizenTab === 'perfil' ? 'text-[#0A4191] dark:text-blue-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-5 h-5 stroke-[2.2] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] hidden xs:block font-medium">Perfil</span>
            </button>

          </div>

        </div>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* 1. NOTICIAS MODAL (MOCKUP 15 DESIGN) */}
      {showNewsModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 border-2 border-[#0A4191] shadow-2xl space-y-4 text-xs text-[#0A4191]">
            {/* Header Row: Back Arrow + Centered Title "Noticias" */}
            <div className="relative text-center pt-1 pb-1">
              <button
                type="button"
                onClick={() => setShowNewsModal(false)}
                className="absolute left-0 top-0.5 p-1 text-[#0A4191] hover:bg-blue-50 rounded-full cursor-pointer transition-colors"
                title="Cerrar"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <h2 className="text-base font-black text-[#0A4191] tracking-tight font-serif">
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
                    className={`py-2 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer text-center truncate border-2 border-[#0A4191] text-[#0A4191] ${
                      isActive
                        ? 'bg-blue-100 font-extrabold shadow-xs'
                        : 'bg-white font-bold hover:bg-blue-50'
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
                  className="bg-white border-2 border-[#0A4191] rounded-2xl p-2.5 flex items-center space-x-3 shadow-xs hover:shadow-md hover:bg-blue-50/60 cursor-pointer transition-all group text-[#0A4191]"
                >
                  {/* Left Thumbnail Image */}
                  <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-white border-2 border-[#0A4191]">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>

                  {/* Middle Title & Date */}
                  <div className="flex-1 min-w-0 pr-1">
                    <h4 className="font-black text-[#0A4191] text-xs leading-tight line-clamp-2">
                      {news.title}
                    </h4>
                    <p className="text-[11px] font-mono text-[#0A4191]/80 font-bold mt-1">
                      {news.date}
                    </p>
                  </div>

                  {/* Right Chevron */}
                  <div className="flex-shrink-0 pr-1">
                    <ChevronRight className="w-4 h-4 text-[#0A4191] stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowNewsModal(false)}
              className="w-full py-2.5 bg-white border-2 border-[#0A4191] text-[#0A4191] hover:bg-blue-50 font-black rounded-xl cursor-pointer shadow-xs transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* SELECTED NEWS READER MODAL */}
      {selectedNews && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 border-2 border-[#0A4191] shadow-2xl space-y-3.5 text-xs text-[#0A4191] animate-in fade-in duration-200">
            <div className="flex justify-between items-center border-b-2 border-[#0A4191]/30 pb-2">
              <span className="bg-blue-50 text-[#0A4191] border-2 border-[#0A4191] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {selectedNews.categoryLabel}
              </span>
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="text-[#0A4191] hover:bg-blue-50 rounded-full p-1 font-bold"
                title="Cerrar"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border-2 border-[#0A4191] h-40 bg-white">
              <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
            </div>

            <div>
              <span className="font-mono text-[11px] text-[#0A4191]/80 font-bold block mb-1">
                {selectedNews.date}
              </span>
              <h3 className="font-black text-[#0A4191] text-sm leading-snug">
                {selectedNews.title}
              </h3>
            </div>

            <p className="text-[#0A4191] leading-relaxed font-semibold bg-white p-3 rounded-2xl border-2 border-[#0A4191] text-xs">
              {selectedNews.content}
            </p>

            <button
              type="button"
              onClick={() => setSelectedNews(null)}
              className="w-full py-2.5 bg-white border-2 border-[#0A4191] text-[#0A4191] hover:bg-blue-50 font-black rounded-xl cursor-pointer shadow-xs transition-colors"
            >
              Volver a Noticias
            </button>
          </div>
        </div>
      )}

      {/* 2. AGENDA MODAL (MATCHES MOCKUP 16. AGENDA EXACTLY) */}
      {showAgendaModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 border-2 border-[#0A4191] shadow-2xl space-y-4 text-xs text-[#0A4191]">
            {/* Header Row: Back Arrow + Centered Title "Agenda Municipal" */}
            <div className="relative text-center pt-1 pb-1 border-b border-[#0A4191]/20 pb-2">
              <button
                type="button"
                onClick={() => setShowAgendaModal(false)}
                className="absolute left-0 top-0.5 p-1 text-[#0A4191] hover:bg-blue-50 rounded-full cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <h2 className="text-base font-black text-[#0A4191] tracking-tight font-serif">
                Agenda Municipal
              </h2>
            </div>

            {/* Calendar View Container */}
            <div className="bg-white rounded-3xl p-3.5 border-2 border-[#0A4191] space-y-3">
              {/* Month Header: < Mayo 2024 > */}
              <div className="flex items-center justify-between px-2 pt-1">
                <button
                  type="button"
                  className="p-1.5 text-[#0A4191] hover:bg-blue-100 rounded-xl transition-colors cursor-pointer border border-[#0A4191]/30"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[3]" />
                </button>
                <span className="font-black text-base text-[#0A4191] tracking-tight font-serif">
                  Mayo 2024
                </span>
                <button
                  type="button"
                  className="p-1.5 text-[#0A4191] hover:bg-blue-100 rounded-xl transition-colors cursor-pointer border border-[#0A4191]/30"
                >
                  <ChevronRight className="w-5 h-5 stroke-[3]" />
                </button>
              </div>

              {/* Days of week header: Lun  Mar  Mié  Jue  Vie  Sáb  Dom */}
              <div className="grid grid-cols-7 text-center font-black text-[#0A4191] text-xs py-1.5 bg-blue-50/80 rounded-xl border border-[#0A4191]/30">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>

              {/* Days of month grid */}
              <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center items-center">
                <span className="text-xs font-bold text-[#0A4191]/30 py-1">29</span>
                <span className="text-xs font-bold text-[#0A4191]/30 py-1">30</span>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((d) => (
                  <button
                    key={`modal-day-${d}`}
                    type="button"
                    onClick={() => setSelectedAgendaDay(d)}
                    className={`py-1 rounded-xl text-sm font-black transition-all cursor-pointer mx-auto flex items-center justify-center ${
                      selectedAgendaDay === d
                        ? 'w-9 h-9 bg-[#0A4191] text-white shadow-md ring-2 ring-blue-300'
                        : 'w-9 h-9 text-[#0A4191] hover:bg-blue-100/70 border border-[#0A4191]/15'
                    }`}
                  >
                    {d}
                  </button>
                ))}
                <span className="text-xs font-bold text-[#0A4191]/30 py-1">1</span>
                <span className="text-xs font-bold text-[#0A4191]/30 py-1">2</span>
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

            <div className="grid grid-cols-2 gap-3">
              <a href="tel:911" className="aspect-square bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-red-100 dark:hover:bg-red-900/60 transition-all shadow-xs hover:shadow-md cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/80 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <Ambulance className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <span className="font-black text-red-700 dark:text-red-300 block text-xs">ECU 911</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Nacional</span>
              </a>

              <a href="tel:102" className="aspect-square bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all shadow-xs hover:shadow-md cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/80 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <Flame className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="font-black text-amber-800 dark:text-amber-300 block text-xs">Bomberos Logroño</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Línea 102</span>
              </a>

              <a href="tel:101" className="aspect-square bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all shadow-xs hover:shadow-md cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/80 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-black text-blue-800 dark:text-blue-300 block text-xs">Policía Cantonal</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Línea 101</span>
              </a>

              <a href="tel:072700100" className="aspect-square bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all shadow-xs hover:shadow-md cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/80 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-6 h-6 text-[#159A44] dark:text-emerald-400" />
                </div>
                <span className="font-black text-emerald-800 dark:text-emerald-300 block text-xs">Despacho GAD</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">(07) 2700-100</span>
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

            {/* Form Fields with Validation Feedback */}
            <div className="space-y-3 pt-1">
              {profileValidationError && (
                <div className="bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 p-2.5 rounded-xl flex items-start space-x-2 text-[11px] font-bold">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{profileValidationError}</span>
                </div>
              )}

              {/* Field 1: Name */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                    Nombres y Apellidos *
                  </label>
                  {validateName(editName).isValid ? (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Válido</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-red-500">Requerido</span>
                  )}
                </div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
                    setProfileValidationError(null);
                  }}
                  className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:outline-none ${
                    validateName(editName).isValid
                      ? 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
                      : 'border-red-300 focus:ring-red-500'
                  }`}
                  placeholder="Ej: María Fernanda Shakaim"
                />
                {!validateName(editName).isValid && editName && (
                  <p className="text-[10px] font-semibold text-red-500 mt-0.5">
                    {validateName(editName).error}
                  </p>
                )}
              </div>

              {/* Field 2: Email */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                    Correo Electrónico *
                  </label>
                  {validateEmail(editEmail).isValid ? (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Válido</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-red-500">Inválido</span>
                  )}
                </div>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => {
                    setEditEmail(e.target.value);
                    setProfileValidationError(null);
                  }}
                  className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:outline-none ${
                    validateEmail(editEmail).isValid
                      ? 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
                      : 'border-red-300 focus:ring-red-500'
                  }`}
                  placeholder="ejemplo@gmail.com"
                />
                {!validateEmail(editEmail).isValid && editEmail && (
                  <p className="text-[10px] font-semibold text-red-500 mt-0.5">
                    {validateEmail(editEmail).error}
                  </p>
                )}
              </div>

              {/* Field 3: Phone */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                    Teléfono Móvil *
                  </label>
                  {validatePhone(editPhone).isValid ? (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Válido</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-red-500">Inválido</span>
                  )}
                </div>
                <input
                  type="text"
                  maxLength={10}
                  value={editPhone}
                  onChange={(e) => {
                    setEditPhone(e.target.value.replace(/\D/g, ''));
                    setProfileValidationError(null);
                  }}
                  className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:outline-none ${
                    validatePhone(editPhone).isValid
                      ? 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
                      : 'border-red-300 focus:ring-red-500'
                  }`}
                  placeholder="0984712039"
                />
                {!validatePhone(editPhone).isValid && editPhone && (
                  <p className="text-[10px] font-semibold text-red-500 mt-0.5">
                    {validatePhone(editPhone).error}
                  </p>
                )}
              </div>

              {/* Field 4: Cedula */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                    Cédula de Ciudadanía (Ecuador) *
                  </label>
                  {validateEcuadorianCedula(editCedula).isValid ? (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Cédula Válida</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-red-500">Inválida</span>
                  )}
                </div>
                <input
                  type="text"
                  maxLength={10}
                  value={editCedula}
                  onChange={(e) => {
                    setEditCedula(e.target.value.replace(/\D/g, ''));
                    setProfileValidationError(null);
                  }}
                  className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:outline-none ${
                    validateEcuadorianCedula(editCedula).isValid
                      ? 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
                      : 'border-red-300 focus:ring-red-500'
                  }`}
                  placeholder="1710034065"
                />
                {!validateEcuadorianCedula(editCedula).isValid && editCedula && (
                  <p className="text-[10px] font-semibold text-red-500 mt-0.5">
                    {validateEcuadorianCedula(editCedula).error}
                  </p>
                )}
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
                onClick={() => {
                  setShowMisDatosModal(false);
                  setProfileValidationError(null);
                }}
                className="w-1/2 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const nVal = validateName(editName);
                  const eVal = validateEmail(editEmail);
                  const pVal = validatePhone(editPhone);
                  const cVal = validateEcuadorianCedula(editCedula);

                  if (!nVal.isValid || !eVal.isValid || !pVal.isValid || !cVal.isValid) {
                    const err = nVal.error || eVal.error || pVal.error || cVal.error;
                    setProfileValidationError(`Datos inválidos: ${err}`);
                    return;
                  }

                  setProfileValidationError(null);
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

            {/* Real-time Technical Chat inside Modal 6 */}
            <div className="pt-2">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center space-x-1.5">
                  <MessageSquare className="w-4 h-4 text-[#0A4191] dark:text-blue-400" />
                  <span>Consulta en Tiempo Real al Técnico</span>
                </h3>
              </div>
              <ReportIncidentChat
                incident={selectedIncident}
                currentUser={currentUser}
                onNewComment={(incId, newComment) => {
                  setSelectedIncident((prev) =>
                    prev && prev.id === incId
                      ? { ...prev, comments: [...(prev.comments || []), newComment] }
                      : prev
                  );
                }}
              />
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

      {/* MODAL 1: Confirmación de Cierre de Sesión */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-4 text-slate-900 dark:text-slate-100 relative text-left">
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
              <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/80 flex items-center justify-center flex-shrink-0">
                <LogOut className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-extrabold text-base leading-tight">¿Cerrar Sesión?</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Prevención de acciones accidentales</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              ¿Está seguro de que desea salir? Se cerrará la sesión actual en la aplicación del GAD Municipal de Logroño.
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  if (onLogout) onLogout();
                }}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sí, salir</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Confirmación de Cancelación de Trámite */}
      {showCancelTramiteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-4 text-slate-900 dark:text-slate-100 relative text-left">
            <button
              type="button"
              onClick={() => {
                setShowCancelTramiteConfirm(false);
                setPendingCancelType(null);
              }}
              className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-3 text-amber-600 dark:text-amber-400">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-extrabold text-base leading-tight">¿Cancelar Trámite?</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Prevención de pérdida de datos</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Está a punto de cancelar el trámite o reporte en curso. Se perderán los datos ingresados. ¿Desea cancelar de todas formas?
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowCancelTramiteConfirm(false);
                  setPendingCancelType(null);
                }}
                className="py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                No, continuar
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelTramite}
                className="py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>Sí, cancelar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREAR NUEVA AGENDA MUNICIPAL */}
      {showCreateAgendaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-50 via-blue-50/60 to-slate-100 border-2 border-[#0A4191] rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 text-slate-800 relative text-left max-h-[90vh] overflow-y-auto text-xs">
            <button
              type="button"
              onClick={() => setShowCreateAgendaModal(false)}
              className="absolute top-4 right-4 p-1.5 text-white bg-white/20 hover:bg-white/30 rounded-full cursor-pointer transition-colors z-10 border border-white/20"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] text-white p-4 rounded-2xl border-b-2 border-[#0A4191] shadow-sm flex items-center space-x-3 -mx-1 -mt-1 relative">
              <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-2xs backdrop-blur-xs">
                <Calendar className="w-5 h-5 stroke-[2.2] text-amber-300" />
              </div>
              <div className="pr-6">
                <h3 className="font-extrabold text-base leading-tight text-white font-serif">Nueva Agenda Municipal</h3>
                <p className="text-[11px] text-blue-100 font-bold">Agregar evento al calendario del cantón</p>
              </div>
            </div>

            {agendaFormError && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-2xs">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{agendaFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCreateAgenda} className="space-y-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                  Título de la Agenda / Evento *
                </label>
                <input
                  type="text"
                  value={agendaFormTitle}
                  onChange={(e) => setAgendaFormTitle(e.target.value)}
                  placeholder="Ej: Minga de Limpieza en Sector Río Upano"
                  className="w-full px-3 py-2 bg-white/95 border border-slate-300 focus:border-[#0A4191] focus:ring-2 focus:ring-[#0A4191]/25 rounded-xl text-slate-800 text-xs font-extrabold focus:outline-none shadow-2xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                    Día ({SPANISH_MONTHS[currentCalendarMonth]}) *
                  </label>
                  <select
                    value={agendaFormDay}
                    onChange={(e) => setAgendaFormDay(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/95 border border-slate-300 focus:border-[#0A4191] focus:ring-2 focus:ring-[#0A4191]/25 rounded-xl text-slate-800 text-xs font-extrabold focus:outline-none shadow-2xs"
                  >
                    {Array.from({ length: new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate() }, (_, i) => i + 1).map((d) => (
                      <option key={`opt-day-${d}`} value={d}>
                        {d} de {SPANISH_MONTHS[currentCalendarMonth]} {currentCalendarYear}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                    Horario *
                  </label>
                  <input
                    type="text"
                    value={agendaFormTime}
                    onChange={(e) => setAgendaFormTime(e.target.value)}
                    placeholder="Ej: 09:00 AM"
                    className="w-full px-3 py-2 bg-white/95 border border-slate-300 focus:border-[#0A4191] focus:ring-2 focus:ring-[#0A4191]/25 rounded-xl text-slate-800 text-xs font-extrabold focus:outline-none shadow-2xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={agendaFormCategory}
                    onChange={(e) => setAgendaFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white/95 border border-slate-300 focus:border-[#0A4191] focus:ring-2 focus:ring-[#0A4191]/25 rounded-xl text-slate-800 text-xs font-extrabold focus:outline-none shadow-2xs"
                  >
                    <option value="Minga">Minga</option>
                    <option value="Cabildo">Cabildo</option>
                    <option value="Cultura">Cultura</option>
                    <option value="Deportes">Deportes</option>
                    <option value="Inauguración">Inauguración</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                    Lugar / Ubicación *
                  </label>
                  <input
                    type="text"
                    value={agendaFormLocation}
                    onChange={(e) => setAgendaFormLocation(e.target.value)}
                    placeholder="Ej: Parque Central Logroño"
                    className="w-full px-3 py-2 bg-white/95 border border-slate-300 focus:border-[#0A4191] focus:ring-2 focus:ring-[#0A4191]/25 rounded-xl text-slate-800 text-xs font-extrabold focus:outline-none shadow-2xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                  Descripción o Detalles
                </label>
                <textarea
                  rows={2.5}
                  value={agendaFormDescription}
                  onChange={(e) => setAgendaFormDescription(e.target.value)}
                  placeholder="Detalles adicionales sobre el evento o convocatoria comunitaria..."
                  className="w-full px-3 py-2 bg-white/95 border border-slate-300 focus:border-[#0A4191] focus:ring-2 focus:ring-[#0A4191]/25 rounded-xl text-slate-800 text-xs font-bold focus:outline-none resize-none shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateAgendaModal(false)}
                  className="py-2.5 rounded-xl border border-slate-300 bg-slate-200/90 hover:bg-slate-300 text-slate-800 font-extrabold text-xs transition-all cursor-pointer active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-gradient-to-r from-[#159A44] to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1 border border-emerald-400/40 active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Guardar Agenda</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDITAR AGENDA MUNICIPAL */}
      {showEditAgendaModal && editingAgendaEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-50 via-blue-50/60 to-slate-100 border-2 border-[#0A4191] rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 text-slate-800 relative text-left max-h-[90vh] overflow-y-auto text-xs">
            <button
              type="button"
              onClick={() => {
                setShowEditAgendaModal(false);
                setEditingAgendaEvent(null);
              }}
              className="absolute top-4 right-4 p-1.5 text-white bg-white/20 hover:bg-white/30 rounded-full cursor-pointer transition-colors z-10 border border-white/20"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] text-white p-4 rounded-2xl border-b-2 border-[#0A4191] shadow-sm flex items-center space-x-3 -mx-1 -mt-1 relative">
              <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-2xs backdrop-blur-xs">
                <Edit3 className="w-5 h-5 stroke-[2.2] text-amber-300" />
              </div>
              <div className="pr-6">
                <h3 className="font-extrabold text-base leading-tight text-white font-serif">Editar Agenda</h3>
                <p className="text-[11px] text-blue-100 font-bold">Modificar datos del evento programado</p>
              </div>
            </div>

            {agendaFormError && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-2xs">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{agendaFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditAgenda} className="space-y-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                  Título de la Agenda / Evento *
                </label>
                <input
                  type="text"
                  value={agendaFormTitle}
                  onChange={(e) => setAgendaFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white/95 border border-slate-300 focus:border-[#0A4191] focus:ring-2 focus:ring-[#0A4191]/25 rounded-xl text-slate-800 text-xs font-extrabold focus:outline-none shadow-2xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                    Día ({SPANISH_MONTHS[currentCalendarMonth]}) *
                  </label>
                  <select
                    value={agendaFormDay}
                    onChange={(e) => setAgendaFormDay(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/95 border border-slate-300 focus:border-[#0A4191] focus:ring-2 focus:ring-[#0A4191]/25 rounded-xl text-slate-800 text-xs font-extrabold focus:outline-none shadow-2xs"
                  >
                    {Array.from({ length: new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate() }, (_, i) => i + 1).map((d) => (
                      <option key={`edit-opt-day-${d}`} value={d}>
                        {d} de {SPANISH_MONTHS[currentCalendarMonth]} {currentCalendarYear}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                    Horario *
                  </label>
                  <input
                    type="text"
                    value={agendaFormTime}
                    onChange={(e) => setAgendaFormTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white/95 border border-slate-300 focus:border-[#0A4191] focus:ring-2 focus:ring-[#0A4191]/25 rounded-xl text-slate-800 text-xs font-extrabold focus:outline-none shadow-2xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={agendaFormCategory}
                    onChange={(e) => setAgendaFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white/95 border border-slate-300 focus:border-[#0A4191] focus:ring-2 focus:ring-[#0A4191]/25 rounded-xl text-slate-800 text-xs font-extrabold focus:outline-none shadow-2xs"
                  >
                    <option value="Minga">Minga</option>
                    <option value="Cabildo">Cabildo</option>
                    <option value="Cultura">Cultura</option>
                    <option value="Deportes">Deportes</option>
                    <option value="Inauguración">Inauguración</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                    Lugar / Ubicación *
                  </label>
                  <input
                    type="text"
                    value={agendaFormLocation}
                    onChange={(e) => setAgendaFormLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-white/95 border border-slate-300 focus:border-[#0A4191] focus:ring-2 focus:ring-[#0A4191]/25 rounded-xl text-slate-800 text-xs font-extrabold focus:outline-none shadow-2xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                  Descripción o Detalles
                </label>
                <textarea
                  rows={2.5}
                  value={agendaFormDescription}
                  onChange={(e) => setAgendaFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white/95 border border-slate-300 focus:border-[#0A4191] focus:ring-2 focus:ring-[#0A4191]/25 rounded-xl text-slate-800 text-xs font-bold focus:outline-none resize-none shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditAgendaModal(false);
                    setEditingAgendaEvent(null);
                  }}
                  className="py-2.5 rounded-xl border border-slate-300 bg-slate-200/90 hover:bg-slate-300 text-slate-800 font-extrabold text-xs transition-all cursor-pointer active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1 border border-amber-400/40 active:scale-95"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: DETALLE DE NOTICIA SELECCIONADA */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-2 border-[#0A4191] rounded-3xl p-5 max-w-lg w-full shadow-2xl space-y-4 text-slate-900 relative text-left max-h-[90vh] overflow-y-auto text-xs">
            <button
              type="button"
              onClick={() => setSelectedNews(null)}
              className="absolute top-3.5 right-3.5 p-1.5 text-white bg-slate-900/60 hover:bg-slate-900 rounded-full cursor-pointer transition-colors z-10 border border-white/20"
              title="Cerrar noticia"
            >
              <X className="w-4 h-4" />
            </button>

            {/* High-res Hero Image Banner */}
            <div className="relative -mx-5 -mt-5 h-48 sm:h-56 overflow-hidden rounded-t-3xl border-b-2 border-[#0A4191]">
              <img
                src={selectedNews.image}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#0A4191] text-white border border-white/30 shadow-xs">
                    {selectedNews.categoryLabel}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-white/20 backdrop-blur-xs">
                    {selectedNews.date}
                  </span>
                </div>
                <h3 className="font-black text-base sm:text-lg font-serif leading-tight drop-shadow-md text-white">
                  {selectedNews.title}
                </h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-3 pt-1">
              <div className="bg-blue-50/80 border border-blue-200 p-3 rounded-2xl text-slate-800 font-bold text-xs leading-relaxed shadow-2xs">
                {selectedNews.summary}
              </div>

              <div className="text-slate-700 space-y-2 text-xs leading-relaxed pt-1">
                <p>{selectedNews.content}</p>
                <p className="text-slate-500 italic text-[11px] border-l-2 border-[#0A4191] pl-2.5 mt-2">
                  Publicación oficial emitida por la Dirección de Comunicación y Relaciones Públicas del GAD Cantonal de Logroño.
                </p>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500 font-bold flex items-center space-x-1">
                  <Newspaper className="w-3.5 h-3.5 text-[#0A4191]" />
                  <span>Gobierno Autónomo Descentralizado de Logroño</span>
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedNews(null)}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#0A4191] to-[#0C51B6] hover:from-[#083373] hover:to-[#0A4191] text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center space-x-1"
                >
                  <span>Cerrar Noticia</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 22: Detalle de Trámite del Catálogo */}
      {selectedTramiteCatalog && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-2 border-[#0A4191] rounded-3xl p-5 max-w-lg w-full shadow-2xl space-y-4 text-slate-900 relative text-left max-h-[90vh] overflow-y-auto text-xs">
            <button
              type="button"
              onClick={() => setSelectedTramiteCatalog(null)}
              className="absolute top-3.5 right-3.5 p-1.5 text-white bg-slate-900/60 hover:bg-slate-900 rounded-full cursor-pointer transition-colors z-10 border border-white/20"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0A4191] via-[#0D4EA8] to-[#083373] text-white p-4 rounded-2xl border-2 border-[#0A4191] space-y-1">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-400/30 text-blue-100 font-extrabold text-[10px] px-2 py-0.5 rounded-lg border border-white/20">
                  {selectedTramiteCatalog.code}
                </span>
                <span className="bg-emerald-500/30 text-emerald-200 font-extrabold text-[10px] px-2 py-0.5 rounded-lg border border-white/20">
                  {selectedTramiteCatalog.categoryLabel}
                </span>
              </div>
              <h3 className="font-black text-base sm:text-lg text-white leading-tight">
                {selectedTramiteCatalog.name}
              </h3>
              <p className="text-xs text-blue-100 font-medium flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-amber-300" />
                <span>{selectedTramiteCatalog.department}</span>
              </p>
            </div>

            {/* Content Details */}
            <div className="space-y-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs mb-1">Descripción del Servicio:</h4>
                <p className="text-slate-700 bg-blue-50/60 border border-blue-200 p-3 rounded-2xl font-medium leading-relaxed">
                  {selectedTramiteCatalog.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-3 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Costo del Trámite:</span>
                  <span className="font-black text-emerald-800 text-sm">{selectedTramiteCatalog.cost}</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Tiempo Estimado:</span>
                  <span className="font-extrabold text-slate-900 text-xs">{selectedTramiteCatalog.responseTime}</span>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-xs mb-2 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-[#159A44]" />
                  <span>Requisitos Obligatorios:</span>
                </h4>
                <ul className="space-y-1.5 pl-1">
                  {selectedTramiteCatalog.requirements.map((req, i) => (
                    <li key={i} className="flex items-start space-x-2 text-slate-700 font-medium">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      const itemToEdit = selectedTramiteCatalog;
                      handleOpenEditCatalogItem(itemToEdit);
                    }}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs cursor-pointer transition-colors flex items-center space-x-1"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Editar Trámite</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeletingCatalogItem(selectedTramiteCatalog);
                    }}
                    className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer transition-colors flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTramiteCatalog(null)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-300 cursor-pointer"
                  >
                    Cerrar
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPqrsSubject(`Solicitud: ${selectedTramiteCatalog.name}`);
                      setPqrsDetail(`Requerimiento para el trámite ${selectedTramiteCatalog.code} - ${selectedTramiteCatalog.name}.`);
                      setSelectedTramiteCatalog(null);
                      setTramiteMainTab('solicitar');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[#159A44] to-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer hover:bg-emerald-800 transition-all flex items-center space-x-1"
                  >
                    <span>Iniciar Trámite</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 23: Detalle de Trámite del Usuario */}
      {selectedUserTramite && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-2 border-[#0A4191] rounded-3xl p-5 max-w-lg w-full shadow-2xl space-y-4 text-slate-900 relative text-left max-h-[90vh] overflow-y-auto text-xs">
            <button
              type="button"
              onClick={() => setSelectedUserTramite(null)}
              className="absolute top-3.5 right-3.5 p-1.5 text-white bg-slate-900/60 hover:bg-slate-900 rounded-full cursor-pointer transition-colors z-10 border border-white/20"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0A4191] via-[#0D4EA8] to-[#083373] text-white p-4 rounded-2xl border-2 border-[#0A4191] space-y-1">
              <div className="flex items-center justify-between">
                <span className="bg-white/20 text-white font-mono font-extrabold text-xs px-2.5 py-0.5 rounded-lg border border-white/30">
                  {selectedUserTramite.code}
                </span>
                {selectedUserTramite.status === 'aprobado' && (
                  <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                    Aprobado y Firmado
                  </span>
                )}
                {selectedUserTramite.status === 'en_proceso' && (
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                    En Proceso
                  </span>
                )}
                {selectedUserTramite.status === 'en_revision' && (
                  <span className="bg-blue-300 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                    En Revisión
                  </span>
                )}
              </div>
              <h3 className="font-black text-base text-white leading-tight pt-1">
                {selectedUserTramite.type}
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                {selectedUserTramite.department} • Ingresado el {selectedUserTramite.date}
              </p>
            </div>

            {/* Modal Body */}
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Asunto / Solicitud:</span>
                <p className="text-slate-800 font-extrabold bg-white p-3 rounded-2xl border border-slate-200">
                  {selectedUserTramite.subject}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Observación del Funcionario Responsable:</span>
                <p className="text-slate-800 bg-blue-50/80 border border-blue-200 p-3 rounded-2xl font-medium leading-relaxed">
                  {selectedUserTramite.observation}
                </p>
              </div>

              <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Solicitante:</span>
                  <span className="font-extrabold text-slate-900">{selectedUserTramite.applicant}</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Estado:</span>
                  <span className="font-black text-[#0A4191] uppercase">{selectedUserTramite.status}</span>
                </div>
              </div>

              {selectedUserTramite.status === 'aprobado' && (
                <div className="bg-emerald-50 border-2 border-emerald-300 p-3.5 rounded-2xl text-emerald-950 flex items-center justify-between">
                  <div>
                    <h5 className="font-black text-xs text-emerald-900">Documento Oficial Disponible</h5>
                    <p className="text-[11px] text-emerald-700 font-medium">Certificado con firma electrónica del GAD Logroño.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Descargando documento oficial para el trámite ${selectedUserTramite.code}...`)}
                    className="px-3 py-1.5 bg-[#159A44] hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer transition-colors shrink-0"
                  >
                    Descargar PDF
                  </button>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditUserTramite(selectedUserTramite)}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs cursor-pointer transition-colors flex items-center space-x-1"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Editar Trámite</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingUserTramite(selectedUserTramite)}
                    className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer transition-colors flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUserTramite(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-300 cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 24: Editar Trámite */}
      {editingUserTramite && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-2 border-amber-500 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 text-slate-900 relative text-left max-h-[90vh] overflow-y-auto text-xs">
            <button
              type="button"
              onClick={() => setEditingUserTramite(null)}
              className="absolute top-3.5 right-3.5 p-1.5 text-white bg-slate-900/60 hover:bg-slate-900 rounded-full cursor-pointer transition-colors z-10 border border-white/20"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 p-4 rounded-2xl border border-amber-400 space-y-1">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-slate-950" />
                <span className="font-mono font-black text-xs bg-slate-950 text-amber-300 px-2 py-0.5 rounded-lg">
                  {editingUserTramite.code}
                </span>
              </div>
              <h3 className="font-black text-base text-slate-950 leading-tight">
                Editar Trámite o PQRS
              </h3>
              <p className="text-[11px] font-bold text-slate-900">
                Modifique los campos correspondientes a la solicitud del ciudadano.
              </p>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveEditedUserTramite} className="space-y-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                  Tipo de Trámite / Requerimiento:
                </label>
                <input
                  type="text"
                  required
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                  Asunto / Descripción General:
                </label>
                <textarea
                  rows={3}
                  required
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                    Departamento:
                  </label>
                  <select
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Avalúos y Catastros">Avalúos y Catastros</option>
                    <option value="Agua Potable y Alcantarillado">Agua Potable & Saneamiento</option>
                    <option value="Obras Públicas">Obras Públicas</option>
                    <option value="Planificación Territorial">Planificación Territorial</option>
                    <option value="Rentas y Comisarías">Rentas y Comisarías</option>
                    <option value="Secretaría General">Secretaría General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                    Estado Actual:
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="en_proceso">En Proceso</option>
                    <option value="en_revision">En Revisión</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                  Observaciones / Respuesta Técnica:
                </label>
                <textarea
                  rows={2}
                  value={editObservation}
                  onChange={(e) => setEditObservation(e.target.value)}
                  placeholder="Escriba comentarios u observaciones del trámite..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingUserTramite(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 25: Confirmación de Eliminar Trámite */}
      {deletingUserTramite && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-50 via-white to-rose-50/40 border-2 border-rose-600 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 text-slate-900 relative text-left">
            <button
              type="button"
              onClick={() => setDeletingUserTramite(null)}
              className="absolute top-3.5 right-3.5 p-1.5 text-white bg-slate-900/60 hover:bg-slate-900 rounded-full cursor-pointer transition-colors z-10 border border-white/20"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 text-white p-4 rounded-2xl border border-rose-500 space-y-1">
              <div className="flex items-center space-x-2">
                <Trash2 className="w-5 h-5 text-white" />
                <span className="font-mono font-black text-xs bg-slate-950 text-white px-2 py-0.5 rounded-lg">
                  {deletingUserTramite.code}
                </span>
              </div>
              <h3 className="font-black text-base text-white leading-tight">
                Eliminar Trámite
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-700 font-medium leading-relaxed">
                ¿Está seguro de que desea eliminar permanentemente este trámite del sistema?
              </p>

              <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl space-y-1">
                <div className="font-extrabold text-rose-950">{deletingUserTramite.type}</div>
                <div className="text-[11px] text-rose-800">{deletingUserTramite.subject}</div>
                <div className="text-[10px] text-slate-500 font-bold">Ingresado: {deletingUserTramite.date}</div>
              </div>

              <p className="text-[11px] text-rose-600 font-bold flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Esta acción es irreversible.</span>
              </p>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setDeletingUserTramite(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteUserTramite}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Sí, Eliminar Trámite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 26: Editar / Crear Trámite de Catálogo */}
      {(editingCatalogItem || isAddingCatalogItem) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-2 border-[#0A4191] rounded-3xl p-5 max-w-lg w-full shadow-2xl space-y-4 text-slate-900 relative text-left max-h-[90vh] overflow-y-auto text-xs">
            <button
              type="button"
              onClick={() => {
                setEditingCatalogItem(null);
                setIsAddingCatalogItem(false);
              }}
              className="absolute top-3.5 right-3.5 p-1.5 text-white bg-slate-900/60 hover:bg-slate-900 rounded-full cursor-pointer transition-colors z-10 border border-white/20"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0A4191] via-[#0C51B6] to-[#083373] text-white p-4 rounded-2xl border border-blue-400 space-y-1">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-amber-300" />
                <span className="font-mono font-black text-xs bg-black/40 text-blue-200 px-2 py-0.5 rounded-lg border border-white/20">
                  {editingCatalogItem ? catCode : 'NUEVO TRÁMITE'}
                </span>
              </div>
              <h3 className="font-black text-base text-white leading-tight">
                {editingCatalogItem ? 'Editar Trámite del Catálogo Municipal' : 'Agregar Trámite al Catálogo Municipal'}
              </h3>
            </div>

            <form onSubmit={handleSaveCatalogItem} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 mb-1">
                    Código de Trámite *
                  </label>
                  <input
                    type="text"
                    value={catCode}
                    onChange={(e) => setCatCode(e.target.value)}
                    placeholder="Ej: TRM-CAT-07"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-xs focus:outline-none focus:border-[#0A4191]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 mb-1">
                    Categoría Municipal *
                  </label>
                  <select
                    value={catCategory}
                    onChange={(e) => setCatCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-xs focus:outline-none focus:border-[#0A4191]"
                  >
                    <option value="avaluos">Avalúos y Catastros</option>
                    <option value="agua">Agua y Alcantarillado</option>
                    <option value="obras">Obras y Planificación</option>
                    <option value="patentes">Patentes y Comercio (LUAE)</option>
                    <option value="pqrs">Secretaría & PQRS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del Trámite / Servicio *
                </label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Ej: Certificado de Borde y Línea de Fábrica"
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-xs focus:outline-none focus:border-[#0A4191]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 mb-1">
                    Costo (USD) *
                  </label>
                  <input
                    type="text"
                    value={catCost}
                    onChange={(e) => setCatCost(e.target.value)}
                    placeholder="Ej: $5.00 USD"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-xs focus:outline-none focus:border-[#0A4191]"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 mb-1">
                    Tiempo de Respuesta Estimado *
                  </label>
                  <input
                    type="text"
                    value={catResponseTime}
                    onChange={(e) => setCatResponseTime(e.target.value)}
                    placeholder="Ej: 24 a 48 horas hábiles"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-xs focus:outline-none focus:border-[#0A4191]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 mb-1">
                  Departamento / Dirección Responsable *
                </label>
                <input
                  type="text"
                  value={catDepartment}
                  onChange={(e) => setCatDepartment(e.target.value)}
                  placeholder="Ej: Dirección de Planificación Urbano-Rural"
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-xs focus:outline-none focus:border-[#0A4191]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 mb-1">
                  Descripción Corta del Servicio *
                </label>
                <textarea
                  rows={2}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="Detalle claro de la utilidad o alcance de este servicio municipal..."
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-medium text-xs focus:outline-none focus:border-[#0A4191] resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 mb-1">
                  Requisitos Obligatorios (Un requisito por línea) *
                </label>
                <textarea
                  rows={3}
                  value={catRequirementsStr}
                  onChange={(e) => setCatRequirementsStr(e.target.value)}
                  placeholder="Cédula de Identidad&#10;Papeleta de Votación&#10;Comprobante de Pago de Especie"
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-medium text-xs focus:outline-none focus:border-[#0A4191] resize-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCatalogItem(null);
                    setIsAddingCatalogItem(false);
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#0A4191] to-[#0C51B6] hover:from-[#083373] text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
                >
                  {editingCatalogItem ? 'Guardar Cambios en Catálogo' : 'Agregar al Catálogo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 27: Confirmación de Eliminar Trámite del Catálogo */}
      {deletingCatalogItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-50 via-white to-rose-50/40 border-2 border-rose-600 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 text-slate-900 relative text-left">
            <button
              type="button"
              onClick={() => setDeletingCatalogItem(null)}
              className="absolute top-3.5 right-3.5 p-1.5 text-white bg-slate-900/60 hover:bg-slate-900 rounded-full cursor-pointer transition-colors z-10 border border-white/20"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 text-white p-4 rounded-2xl border border-rose-500 space-y-1">
              <div className="flex items-center space-x-2">
                <Trash2 className="w-5 h-5 text-white" />
                <span className="font-mono font-black text-xs bg-slate-950 text-white px-2 py-0.5 rounded-lg">
                  {deletingCatalogItem.code}
                </span>
              </div>
              <h3 className="font-black text-base text-white leading-tight">
                Eliminar Trámite del Catálogo
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-700 font-medium leading-relaxed">
                ¿Está seguro de que desea eliminar permanentemente este trámite del catálogo de servicios municipales?
              </p>

              <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl space-y-1">
                <div className="font-extrabold text-rose-950">{deletingCatalogItem.name}</div>
                <div className="text-[11px] text-rose-800">{deletingCatalogItem.department}</div>
                <div className="text-[10px] text-slate-500 font-bold">Costo: {deletingCatalogItem.cost} | Tiempo: {deletingCatalogItem.responseTime}</div>
              </div>

              <p className="text-[11px] text-rose-600 font-bold flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Esta acción quitará el trámite de la oferta ciudadana.</span>
              </p>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setDeletingCatalogItem(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteCatalogItem}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Sí, Eliminar del Catálogo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

