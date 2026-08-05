import { Incident } from '../types';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-001',
    code: 'LOG-2026-0041',
    title: 'Deslizamiento menor y bacheo en vía Logroño - Yaupi',
    description: 'Debido a intensas lluvias en el sector Transkutukú, se produjo un desprendimiento de tierra y piedras tapando la cuneta de la vía principal a Yaupi.',
    category: 'Vías y Aceras',
    status: 'en_proceso',
    priority: 'alta',
    location: {
      lat: -2.6315,
      lng: -78.1824,
      address: 'Vía principal Logroño - Parroquia Yaupi km 4.5',
      sector: 'Parroquia Yaupi',
      reference: 'Junto a la curva del río Yaupi'
    },
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    assignedDepartment: 'Dirección de Obras Públicas Municipales',
    assignedOperator: 'Ing. Carlos Tiwiram',
    citizenName: 'Luis Shakaim',
    citizenPhone: '0984712039',
    citizenCedula: '1400829104',
    citizenSector: 'Parroquia Yaupi',
    aiAnalysis: {
      score: 4,
      priority: 'alta',
      suggestedCategory: 'Vías y Aceras',
      department: 'Dirección de Obras Públicas Municipales',
      estimatedHours: 24,
      tags: ['Vía Interparroquial', 'Deslizamiento', 'Maquinaria Pesada'],
      recommendation: 'Despachar minicargadora y equipo de limpieza de cuneta de inmediato.',
      urgencyExplanation: 'Riesgo de corte de transporte entre Logroño centro y Yaupi.'
    },
    comments: [
      {
        id: 'c1',
        author: 'Luis Shakaim',
        role: 'ciudadano',
        text: 'Los buses intercantonales tienen dificultad para pasar.',
        timestamp: '2026-08-04T08:30:00Z'
      },
      {
        id: 'c2',
        author: 'Ing. Carlos Tiwiram',
        role: 'tecnico_gad',
        text: 'Cuadrilla #2 enviada con la retroexcavadora municipal.',
        timestamp: '2026-08-04T10:15:00Z'
      }
    ],
    history: [
      { status: 'reportado', updatedBy: 'Sistema', timestamp: '2026-08-04T08:30:00Z' },
      { status: 'en_revision', updatedBy: 'Despacho GAD', timestamp: '2026-08-04T09:00:00Z' },
      { status: 'asignado', updatedBy: 'Obras Públicas', timestamp: '2026-08-04T09:45:00Z' },
      { status: 'en_proceso', updatedBy: 'Ing. Carlos Tiwiram', timestamp: '2026-08-04T10:15:00Z' }
    ],
    createdAt: '2026-08-04T08:30:00Z',
    updatedAt: '2026-08-04T10:15:00Z'
  },
  {
    id: 'inc-002',
    code: 'LOG-2026-0038',
    title: 'Fuga de agua potable en tubería principal de Shimpis',
    description: 'Rotura de tubería de 2 pulgadas en el centro poblado de Shimpis cerca de la plaza central. Pérdida continua de caudal.',
    category: 'Agua Potable y Alcantarillado',
    status: 'asignado',
    priority: 'critica',
    location: {
      lat: -2.6102,
      lng: -78.1450,
      address: 'Av. Intercultural y Calle Los Shuaras, Shimpis',
      sector: 'Parroquia Shimpis',
      reference: 'Frente a la Cancha Cubierta'
    },
    photoUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80',
    assignedDepartment: 'Unidad de Agua Potable y Saneamiento',
    assignedOperator: 'Téc. Marco Tsenkush',
    citizenName: 'María Nanki',
    citizenPhone: '0991204892',
    citizenCedula: '1400294812',
    citizenSector: 'Parroquia Shimpis',
    aiAnalysis: {
      score: 5,
      priority: 'critica',
      suggestedCategory: 'Agua Potable y Alcantarillado',
      department: 'Unidad de Agua Potable y Saneamiento',
      estimatedHours: 6,
      tags: ['Agua Potable', 'Rotura Tubería', 'Urgente'],
      recommendation: 'Cierre temporal de válvula sectorial y sustitución de tramo PVC 50mm.',
      urgencyExplanation: 'Afecta la provisión del servicio a 120 familias en Shimpis.'
    },
    comments: [
      {
        id: 'c3',
        author: 'María Nanki',
        role: 'ciudadano',
        text: 'No tenemos presión de agua en las viviendas desde la madrugada.',
        timestamp: '2026-08-04T06:10:00Z'
      }
    ],
    history: [
      { status: 'reportado', updatedBy: 'María Nanki', timestamp: '2026-08-04T06:10:00Z' },
      { status: 'en_revision', updatedBy: 'Mesa Control GAD', timestamp: '2026-08-04T07:00:00Z' },
      { status: 'asignado', updatedBy: 'Agua Potable', timestamp: '2026-08-04T07:45:00Z' }
    ],
    createdAt: '2026-08-04T06:10:00Z',
    updatedAt: '2026-08-04T07:45:00Z'
  },
  {
    id: 'inc-003',
    code: 'LOG-2026-0029',
    title: 'Luminarias apagadas en la Comunidad Shuar Kakaim',
    description: '3 postes de alumbrado público en el acceso a la comunidad Kakaim no encienden por las noches, dejando la pasarela comunitaria a oscuras.',
    category: 'Alumbrado Público',
    status: 'resuelto',
    priority: 'media',
    location: {
      lat: -2.6450,
      lng: -78.1980,
      address: 'Acceso a la Comunidad Kakaim',
      sector: 'Comunidad Shuar Kakaim',
      reference: 'Cerca de la Escuela Bilingüe'
    },
    photoUrl: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600&auto=format&fit=crop&q=80',
    assignedDepartment: 'Servicios Municipales y Electricidad',
    assignedOperator: 'Téc. Javier Uyunkar',
    citizenName: 'Efraín Wampankit',
    citizenPhone: '0981122334',
    citizenCedula: '1400593821',
    citizenSector: 'Comunidad Shuar Kakaim',
    aiAnalysis: {
      score: 2,
      priority: 'media',
      suggestedCategory: 'Alumbrado Público',
      department: 'Servicios Municipales y Electricidad',
      estimatedHours: 48,
      tags: ['Luminaria LED', 'Seguridad Nocturna', 'Comunidad Shuar'],
      recommendation: 'Reemplazar fotocélulas y lámparas LED de 100W.',
      urgencyExplanation: 'Mejora la seguridad peatonal de los estudiantes nocturnos.'
    },
    comments: [
      {
        id: 'c4',
        author: 'Téc. Javier Uyunkar',
        role: 'tecnico_gad',
        text: 'Se cambiaron 3 fotocélulas y se reestableció la iluminación completa.',
        timestamp: '2026-08-03T16:20:00Z'
      }
    ],
    history: [
      { status: 'reportado', updatedBy: 'Efraín Wampankit', timestamp: '2026-08-02T11:00:00Z' },
      { status: 'en_revision', updatedBy: 'Servicios Municipales', timestamp: '2026-08-02T14:00:00Z' },
      { status: 'asignado', updatedBy: 'Despacho', timestamp: '2026-08-03T09:00:00Z' },
      { status: 'en_proceso', updatedBy: 'Téc. Javier Uyunkar', timestamp: '2026-08-03T14:00:00Z' },
      { status: 'resuelto', updatedBy: 'Téc. Javier Uyunkar', timestamp: '2026-08-03T16:20:00Z' }
    ],
    createdAt: '2026-08-02T11:00:00Z',
    updatedAt: '2026-08-03T16:20:00Z'
  },
  {
    id: 'inc-004',
    code: 'LOG-2026-0045',
    title: 'Mantenimiento de juegos infantiles en Parque Central de Logroño',
    description: 'Columpio con cadena suelta y pintura desgastada en la zona recreativa infantil junto al Municipio.',
    category: 'Parques y Áreas Verdes',
    status: 'reportado',
    priority: 'baja',
    location: {
      lat: -2.6280,
      lng: -78.1760,
      address: 'Parque Central de Logroño, Calle 10 de Agosto',
      sector: 'Logroño Centro (Cabecera)',
      reference: 'Frente al Palacio Municipal'
    },
    photoUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&auto=format&fit=crop&q=80',
    assignedDepartment: 'Dirección de Gestión Ambiental y Parques',
    citizenName: 'Carmen Jaramillo',
    citizenPhone: '0978654321',
    citizenCedula: '1400192837',
    citizenSector: 'Logroño Centro (Cabecera)',
    aiAnalysis: {
      score: 1,
      priority: 'baja',
      suggestedCategory: 'Parques y Áreas Verdes',
      department: 'Dirección de Gestión Ambiental y Parques',
      estimatedHours: 72,
      tags: ['Parque Central', 'Mantenimiento Recreativo'],
      recommendation: 'Programar soldadura y pintura en el plan semanal de parque y jardines.',
      urgencyExplanation: 'Prevención de accidentes en juegos de niños.'
    },
    comments: [],
    history: [
      { status: 'reportado', updatedBy: 'Carmen Jaramillo', timestamp: '2026-08-04T15:00:00Z' }
    ],
    createdAt: '2026-08-04T15:00:00Z',
    updatedAt: '2026-08-04T15:00:00Z'
  }
];
