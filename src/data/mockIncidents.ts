import { Incident } from '../types';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-001',
    code: 'RPT-2024-00045',
    title: 'Poste de luz quemado y fotocélula dañada',
    description: 'El poste de alumbrado público frente a la vivienda no enciende por las noches.',
    category: 'Alumbrado Público',
    status: 'en_proceso',
    priority: 'media',
    location: {
      lat: -2.6280,
      lng: -78.1760,
      address: 'Calle 24 de Mayo y Sucre',
      sector: 'Logroño Centro (Cabecera)',
      reference: 'Frente a la plaza central'
    },
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    assignedDepartment: 'Servicios Municipales y Electricidad',
    assignedOperator: 'Téc. Javier Uyunkar',
    citizenName: 'María Shakaim',
    citizenPhone: '0984712039',
    citizenCedula: '1400829104',
    citizenSector: 'Logroño Centro (Cabecera)',
    aiAnalysis: {
      score: 3,
      priority: 'media',
      suggestedCategory: 'Alumbrado Público',
      department: 'Servicios Municipales y Electricidad',
      estimatedHours: 24,
      tags: ['Alumbrado', 'Luminaria'],
      recommendation: 'Reemplazar fotocélula y foco LED 100W.',
      urgencyExplanation: 'Falta de luz nocturna en sector residencial.'
    },
    comments: [
      {
        id: 'msg-init-1',
        author: 'María Shakaim',
        role: 'ciudadano',
        text: 'Buenas tardes, ¿cuándo podrían acudir a revisar la fotocélula del poste?',
        timestamp: '2024-05-24T10:15:00Z'
      },
      {
        id: 'msg-init-2',
        author: 'Téc. Javier Uyunkar',
        role: 'tecnico_gad',
        text: 'Estimada María, la unidad eléctrica programó la inspección técnica para el turno nocturno de hoy.',
        timestamp: '2024-05-24T14:10:00Z'
      }
    ],
    history: [
      { status: 'reportado', updatedBy: 'María Shakaim', timestamp: '2024-05-24T10:00:00Z' },
      { status: 'en_proceso', updatedBy: 'Servicios Municipales', timestamp: '2024-05-24T14:00:00Z' }
    ],
    createdAt: '2024-05-24T10:00:00Z',
    updatedAt: '2024-05-24T14:00:00Z'
  },
  {
    id: 'inc-002',
    code: 'RPT-2024-00044',
    title: 'Bache profundo en la calzada vehicular',
    description: 'Deterioro de asfalto generando socavón en la vía principal.',
    category: 'Vías y Aceras',
    status: 'en_proceso',
    priority: 'alta',
    location: {
      lat: -2.6315,
      lng: -78.1824,
      address: 'Av. Intercultural y 10 de Agosto',
      sector: 'Logroño Centro (Cabecera)',
      reference: 'Junto a la gasolinera municipal'
    },
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    assignedDepartment: 'Dirección de Obras Públicas Municipales',
    assignedOperator: 'Ing. Carlos Tiwiram',
    citizenName: 'María Shakaim',
    citizenPhone: '0984712039',
    citizenCedula: '1400829104',
    citizenSector: 'Logroño Centro (Cabecera)',
    aiAnalysis: {
      score: 4,
      priority: 'alta',
      suggestedCategory: 'Vías y Aceras',
      department: 'Dirección de Obras Públicas Municipales',
      estimatedHours: 48,
      tags: ['Vía', 'Bacheo'],
      recommendation: 'Cuadrilla de bacheo frío para sellado inmediato.',
      urgencyExplanation: 'Peligro para vehículos y transeúntes.'
    },
    comments: [
      {
        id: 'msg-init-3',
        author: 'María Shakaim',
        role: 'ciudadano',
        text: '¿Cuánto tiempo tomará la reparación del bache en la Av. Intercultural?',
        timestamp: '2024-05-20T09:30:00Z'
      },
      {
        id: 'msg-init-4',
        author: 'Ing. Carlos Tiwiram',
        role: 'tecnico_gad',
        text: 'Saludos cordiales. La cuadrilla de Obras Públicas se desplaza hoy con asfalto en frío. Tiempo estimado: 48 horas.',
        timestamp: '2024-05-20T11:20:00Z'
      }
    ],
    history: [
      { status: 'reportado', updatedBy: 'María Shakaim', timestamp: '2024-05-20T09:00:00Z' },
      { status: 'en_proceso', updatedBy: 'Obras Públicas', timestamp: '2024-05-20T11:00:00Z' }
    ],
    createdAt: '2024-05-20T09:00:00Z',
    updatedAt: '2024-05-20T11:00:00Z'
  },
  {
    id: 'inc-003',
    code: 'RPT-2024-00043',
    title: 'Contenedor de basura desbordado',
    description: 'Acumulación de residuos sólidos en el contenedor del mercado comunal.',
    category: 'Gestión de Residuos',
    status: 'resuelto',
    priority: 'media',
    location: {
      lat: -2.6102,
      lng: -78.1450,
      address: 'Calle del Comercio y Central',
      sector: 'Logroño Centro (Cabecera)',
      reference: 'Frente al mercado'
    },
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    assignedDepartment: 'Gestión Ambiental y Limpieza',
    assignedOperator: 'Téc. Marco Tsenkush',
    citizenName: 'María Shakaim',
    citizenPhone: '0984712039',
    citizenCedula: '1400829104',
    citizenSector: 'Logroño Centro (Cabecera)',
    aiAnalysis: {
      score: 3,
      priority: 'media',
      suggestedCategory: 'Gestión de Residuos',
      department: 'Gestión Ambiental y Limpieza',
      estimatedHours: 12,
      tags: ['Recolección', 'Basura'],
      recommendation: 'Enviar camión recolector y desinfección.',
      urgencyExplanation: 'Riesgo sanitario por acumulación.'
    },
    comments: [],
    history: [
      { status: 'reportado', updatedBy: 'María Shakaim', timestamp: '2024-05-18T08:00:00Z' },
      { status: 'resuelto', updatedBy: 'Gestión Ambiental', timestamp: '2024-05-18T16:00:00Z' }
    ],
    createdAt: '2024-05-18T08:00:00Z',
    updatedAt: '2024-05-18T16:00:00Z'
  },
  {
    id: 'inc-004',
    code: 'RPT-2024-00042',
    title: 'Mantenimiento de césped en Parque Central',
    description: 'Corte de maleza alta y poda de árboles en los alrededores del parque.',
    category: 'Parques y Áreas Verdes',
    status: 'resuelto',
    priority: 'baja',
    location: {
      lat: -2.6280,
      lng: -78.1760,
      address: 'Parque Central de Logroño',
      sector: 'Logroño Centro (Cabecera)',
      reference: 'Junto al Palacio Municipal'
    },
    photoUrl: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600&auto=format&fit=crop&q=80',
    assignedDepartment: 'Gestión Ambiental y Parques',
    assignedOperator: 'Téc. Javier Uyunkar',
    citizenName: 'María Shakaim',
    citizenPhone: '0984712039',
    citizenCedula: '1400829104',
    citizenSector: 'Logroño Centro (Cabecera)',
    aiAnalysis: {
      score: 2,
      priority: 'baja',
      suggestedCategory: 'Parques y Áreas Verdes',
      department: 'Gestión Ambiental y Parques',
      estimatedHours: 24,
      tags: ['Parques', 'Mantenimiento'],
      recommendation: 'Poda y desbroce del área verde.',
      urgencyExplanation: 'Mantenimiento regular de espacio público.'
    },
    comments: [],
    history: [
      { status: 'reportado', updatedBy: 'María Shakaim', timestamp: '2024-05-15T11:00:00Z' },
      { status: 'resuelto', updatedBy: 'Gestión Ambiental', timestamp: '2024-05-15T17:00:00Z' }
    ],
    createdAt: '2024-05-15T11:00:00Z',
    updatedAt: '2024-05-15T17:00:00Z'
  }
];
