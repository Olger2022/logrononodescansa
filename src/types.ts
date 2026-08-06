export type IncidentStatus = 
  | 'reportado' 
  | 'en_revision' 
  | 'asignado' 
  | 'en_proceso' 
  | 'resuelto' 
  | 'rechazado';

export type IncidentPriority = 'baja' | 'media' | 'alta' | 'critica';

export type IncidentCategory = 
  | 'Vías y Aceras'
  | 'Alumbrado Público'
  | 'Agua Potable y Alcantarillado'
  | 'Parques y Áreas Verdes'
  | 'Fauna Urbana y Limpieza'
  | 'Gestión de Residuos'
  | 'Seguridad y Ruidos'
  | 'Infraestructura Shuar / Comunitaria';

export type LogronoSector = 
  | 'Logroño Centro (Cabecera)'
  | 'Parroquia Yaupi'
  | 'Parroquia Shimpis'
  | 'Comunidad Shuar Kakaim'
  | 'Comunidad Shuar Kimius'
  | 'Sector Río Upano'
  | 'Sector Transkutukú';

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  sector: LogronoSector;
  reference?: string;
}

export interface AIAnalysisResult {
  score: number; // 1-5 urgency
  priority: IncidentPriority;
  suggestedCategory: IncidentCategory;
  department: string;
  estimatedHours: number;
  tags: string[];
  recommendation: string;
  urgencyExplanation: string;
  aiDetectedDamage?: string;
}

export interface IncidentComment {
  id: string;
  author: string;
  role: 'ciudadano' | 'tecnico_gad' | 'sistema';
  text: string;
  timestamp: string;
}

export interface IncidentStatusHistory {
  status: IncidentStatus;
  updatedBy: string;
  timestamp: string;
  note?: string;
}

export interface Incident {
  id: string;
  code: string; // LOG-2026-0012
  title: string;
  description: string;
  category: IncidentCategory;
  status: IncidentStatus;
  priority: IncidentPriority;
  location: LocationData;
  photoUrl?: string;
  assignedDepartment?: string;
  assignedOperator?: string;
  citizenName: string;
  citizenPhone: string;
  citizenCedula: string;
  citizenSector: LogronoSector;
  aiAnalysis?: AIAnalysisResult;
  comments: IncidentComment[];
  history: IncidentStatusHistory[];
  createdAt: string;
  updatedAt: string;
  isOfflineQueued?: boolean;
}

export interface PQRSItem {
  id: string;
  type: 'Petición' | 'Queja' | 'Reclamo' | 'Sugerencia';
  subject: string;
  detail: string;
  citizenName: string;
  citizenEmail: string;
  status: 'Abierto' | 'En Trámite' | 'Respondido';
  date: string;
}

export type ActiveTab = 'splash' | 'login' | 'citizen_app' | 'admin_dashboard' | 'tech_docs' | 'ai_assistant';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  cedula?: string;
  sector?: LogronoSector;
  role: 'ciudadano' | 'admin' | 'tecnico';
  avatarUrl?: string;
  provider: 'password' | 'google';
}

export type LanguageMode = 'es' | 'shuar';

export interface ShuarTerm {
  es: string;
  shuar: string;
  phonetic: string;
}

export interface AgendaEvent {
  id: string;
  title: string;
  day: number;
  month: string;
  year: number;
  time: string;
  location: string;
  description?: string;
  category?: 'Minga' | 'Cabildo' | 'Cultura' | 'Deportes' | 'Inauguración' | 'General';
}
