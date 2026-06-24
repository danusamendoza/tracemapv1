import { Incident } from './types';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'incident-1',
    category: 'accidente',
    title: 'Línea 2 - accidente',
    line: 'Línea 2',
    location: 'Estación Puerta del Sol (a 200m de ti)',
    timeAgo: 'Hace 5 min',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: 'critical',
    verified: true,
    votes: 45,
    voted: null,
    lat: 40.4168,
    lng: -3.7038,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ75tcsyl50c_Tm-B9ul0_5T4-YddkrUhOkr2Lsbfkn5UkHZ74U_ZOVfsikg-91rf7AFrdxXdEJqSpp6jlOqnO_aiDexXDWuA_awDei46dlXo9t7wi6NT95lBM6d5i3hbjfFpcRCgFESJffLpIgD4M_iKW0hIK1b-K5NGe_-splclbgAoE3SMUF6A06bNfoQPkd6qVXs8EIF9RGG8s-PZ4cM6TdyaTVU6z3qVQRYVBOB_JvQG8Rkw9K-wdZuH2nvtyV7EysOYryWU',
    description: 'Se ha reportado un incidente técnico en el tramo central. Los servicios de emergencia están trabajando en la zona. Los trenes están parados en el túnel.',
    comments: [
      {
        id: 'c1',
        user: 'Carlos Ruiz',
        timeAgo: 'Hace 2 min',
        text: 'Los trenes están parados en el túnel. Llevamos 10 minutos esperando entre Sol y Ópera.',
        verified: true,
        level: 'Nivel 2'
      },
      {
        id: 'c2',
        user: 'Marta Gómez',
        timeAgo: 'Hace 8 min',
        text: 'Hay mucha gente en el andén. Recomiendo tomar el autobús 150 como alternativa.',
        verified: false,
        level: 'Experto en rutas'
      }
    ]
  },
  {
    id: 'incident-2',
    category: 'congestion',
    title: 'Estación Central - congestión',
    line: 'Línea 1',
    location: 'Atocha (en tu estación actual)',
    timeAgo: 'Hace 12 min',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    status: 'warning',
    verified: true,
    votes: 18,
    voted: null,
    lat: 40.4036,
    lng: -3.6892,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ-aVQqcF_uDabflO-MLmEaUV5CRcTTDE2VH3L-wo25Rv6In4ZaME6m3nmbQq3dVRy2zc9tGiGhjoAsyL6kM8DjoCs7RmiOKAwGMzaj_TMVkss_YXntGm7FtrBrjtSlVANeihlbY_kdybXrnvusiqNQckRRwvITVhXJo-o4EzLZYmm1A7l8RZLbb-6A84fP3jZE9Muo8vjuuZS3wl8QD5UX4KsYLrlZf2oSKjObap22VCZl_Wc-urjjemApniCd-3dL6E8VCIcDFM',
    description: 'Alta afluencia de pasajeros en los andenes principales. Se recomienda considerar rutas alternativas si es posible debido al embotellamiento.',
    comments: [
      {
        id: 'c3',
        user: 'Andrés Marín',
        timeAgo: 'Hace 5 min',
        text: 'Los accesos por la calle Méndez Álvaro están colapsados. Buscad alternativa si vais con prisa.',
        verified: true,
        level: 'Nivel 3'
      }
    ]
  },
  {
    id: 'incident-3',
    category: 'retraso',
    title: 'Línea 5 - Retraso técnico',
    line: 'Línea 5',
    location: 'Ópera (a 450m de ti)',
    timeAgo: 'Hace 18 min',
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
    status: 'secondary',
    verified: false,
    votes: 9,
    voted: null,
    lat: 40.4181,
    lng: -3.7097,
    description: 'Frecuencia de paso alterada por avería de señalización. Los tiempos de espera son de unos 12 minutos.',
    comments: []
  },
  {
    id: 'incident-4',
    category: 'seguridad',
    title: 'Línea 10 - Alerta de seguridad',
    line: 'Línea 10',
    location: 'Nuevos Ministerios (a 800m de ti)',
    timeAgo: 'Hace 25 min',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    status: 'critical',
    verified: false,
    votes: 22,
    voted: null,
    lat: 40.4469,
    lng: -3.6922,
    description: 'Presencia policial reforzada por altercado en vestíbulo. Evitar acceso principal si es posible.',
    comments: [
      {
        id: 'c4',
        user: 'Laura Pérez',
        timeAgo: 'Hace 10 min',
        text: 'Acceso por calle Orense operativo. Entrada principal cerrada temporalmente.',
        verified: true,
        level: 'Nivel 2'
      }
    ]
  },
  {
    id: 'incident-5',
    category: 'obras',
    title: 'Línea 1 - Obras en andén',
    line: 'Línea 1',
    location: 'Estación Sol - andén 2',
    timeAgo: 'Hace 40 min',
    timestamp: new Date(Date.now() - 40 * 60 * 1000),
    status: 'info',
    verified: true,
    votes: 6,
    voted: null,
    lat: 40.4172,
    lng: -3.7025,
    description: 'Mantenimiento programado en andén 2. Desvío de pasajeros al andén 1 durante 2 horas.',
    comments: []
  },
  {
    id: 'incident-6',
    category: 'congestion',
    title: 'Autobús 150 - alta demanda',
    line: 'Autobús 150',
    location: 'Plaza de Cibeles (a 350m de ti)',
    timeAgo: 'Hace 8 min',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    status: 'warning',
    verified: false,
    votes: 14,
    voted: null,
    lat: 40.4193,
    lng: -3.6931,
    description: 'Cola de espera superior a 15 minutos en parada de autobús por retrasos del metro.',
    comments: []
  },
  {
    id: 'incident-7',
    category: 'retraso',
    title: 'Cercanías C3 - retraso',
    line: 'Cercanías C3',
    location: 'Atocha Cercanías',
    timeAgo: 'Hace 15 min',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: 'warning',
    verified: true,
    votes: 11,
    voted: null,
    lat: 40.4062,
    lng: -3.6908,
    description: 'Retraso medio de 18 minutos por incidencia previa en vía. Se recomienda salir con margen.',
    comments: []
  }
];
