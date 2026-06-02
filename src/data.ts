/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Contingency, ComunaStats, CriticalClient, Electrodependent, FieldReport, DataSource } from './types';

export const INITIAL_CONTINGENCIES: Contingency[] = [
  {
    id: 'CTG-2026-001',
    status: 'En reparación',
    comuna: 'Parral',
    sector: 'La Montaña / Viña del Mar',
    feeder: 'ALM-PAR-04',
    startTime: '2026-06-01 14:23:45',
    estimatedEndTime: '2026-06-01 23:30:00',
    durationSeconds: 24103, // approx 6.7 hours
    mainSource: 'Power On',
    assignedTeam: 'Mantenimiento Red AT-02 (C. Castro)',
    clientsAffected: 1420,
    clientsRestored: 450,
    criticalAffected: 3,
    electrodependentAffected: 2,
    powerOnOrders: 148,
    description: 'Falla en media tensión provocada por caída de árbol de gran envergadura sobre línea aérea trifásica. Daños estructurales de consideración en postes e infraestructura de soporte.',
    timeline: [
      {
        time: '14:23:45',
        status: 'Predicha',
        description: 'Detección automática de apertura de reconectador REC-PAR-41 en alimentador ALM-PAR-04.',
        source: 'Power On',
        responsible: 'Sistema Automático'
      },
      {
        time: '14:35:10',
        status: 'Asignada',
        description: 'Asignación de patrullero de turno para verificación en terreno.',
        source: 'CIOP Central',
        responsible: 'Claudio Martínez (Despachador)'
      },
      {
        time: '14:55:30',
        status: 'Confirmada',
        description: 'Patrullero confirma caída de pino oregón sobre línea aérea de media tensión, quebrando 2 postes de concreto.',
        source: 'Reporte de terreno',
        responsible: 'Juan Pérez (Inspector Terreno)'
      },
      {
        time: '15:10:00',
        status: 'En revisión en terreno',
        description: 'Inspección de sector adyacente para realizar maniobras de transferencia de carga.',
        source: 'WhatsApp Operaciones',
        responsible: 'Gisela Oñate (Jefa de Redes)'
      },
      {
        time: '16:00:00',
        status: 'En reparación',
        description: 'Arribo de brigada pesada de construcción para retiro de árbol e inicio de izamiento de nuevos postes.',
        source: 'Radio Luzparral',
        responsible: 'Mantenimiento Red AT-02'
      },
      {
        time: '18:15:00',
        status: 'Parcialmente repuesta',
        description: 'Maniobra selectiva de apertura permite energizar subestación Parral Norte. Recuperación de 450 clientes operados comercialmente.',
        source: 'Power On',
        responsible: 'Claudio Martínez (Despachador)'
      }
    ]
  },
  {
    id: 'CTG-2026-002',
    status: 'En revisión en terreno',
    comuna: 'San Carlos',
    sector: 'Bustamante / Camino Real',
    feeder: 'ALM-SCA-02',
    startTime: '2026-06-01 18:45:12',
    estimatedEndTime: '2026-06-02 01:00:00',
    durationSeconds: 8416, // approx 2.3 hours
    mainSource: 'OSF / Sistema Comercial',
    assignedTeam: 'Brigada Emergencias BE-09 (L. Díaz)',
    clientsAffected: 880,
    clientsRestored: 0,
    criticalAffected: 1,
    electrodependentAffected: 1,
    powerOnOrders: 92,
    description: 'Apertura de fusible de cabecera en ramal Bustamante. Reportes concentrados de clientes indican fuerte estruendo en sector de transformador TRA-3490.',
    timeline: [
      {
        time: '18:45:12',
        status: 'Predicha',
        description: 'Incremento repentino de llamadas e ingresos en portal OSF por baja de tensión y posterior corte.',
        source: 'OSF / Redes Sociales',
        responsible: 'Plataforma Digital'
      },
      {
        time: '19:05:00',
        status: 'Asignada',
        description: 'Despacho de brigada liviana BE-09 para aislar el punto y buscar la causa raíz de la falla.',
        source: 'CIOP Central',
        responsible: 'Margarita Soto (Turno Noche)'
      },
      {
        time: '19:40:00',
        status: 'Confirmada',
        description: 'Se confirma colisión de vehículo menor contra poste de baja tensión en calle central de Bustamante.',
        source: 'Reporte de terreno',
        responsible: 'Leonardo Díaz (Líder BE-09)'
      }
    ]
  },
  {
    id: 'CTG-2026-003',
    status: 'Confirmada',
    comuna: 'Ñiquén',
    sector: 'San Gregorio Rural',
    feeder: 'ALM-NIQ-01',
    startTime: '2026-06-01 19:15:00',
    estimatedEndTime: '2026-06-02 02:00:00',
    durationSeconds: 6628,
    mainSource: 'WhatsApp / Registro Manual',
    assignedTeam: 'Brigada de Zona Rural BR-04 (H. Cáceres)',
    clientsAffected: 340,
    clientsRestored: 0,
    criticalAffected: 0,
    electrodependentAffected: 2,
    powerOnOrders: 15,
    description: 'Falla de aisladores en línea de media tensión rural por acción de vientos costeros racheados. Reportado inicialmente por residentes del sector San Gregorio.',
    timeline: [
      {
        time: '19:15:00',
        status: 'Predicha',
        description: 'Reporte telefónico de bombero voluntario indica chispas en tendido eléctrico de Ñiquén poniente.',
        source: 'Llamada Telefónica',
        responsible: 'Mora Silva (Atención Clientes)'
      },
      {
        time: '19:30:00',
        status: 'Asignada',
        description: 'Asignación de inspección a operador de zona Ñiquén.',
        source: 'CIOP Central',
        responsible: 'Margarita Soto (Turno Noche)'
      },
      {
        time: '20:10:00',
        status: 'Confirmada',
        description: 'Se confirma herraje suelto y aislador roto en estructura de soporte H04.',
        source: 'Reporte de terreno',
        responsible: 'Hilda Cáceres (OFC Ñiquén)'
      }
    ]
  },
  {
    id: 'CTG-2026-004',
    status: 'Repuesta / cerrada',
    comuna: 'Longaví',
    sector: 'Cancha Alegre',
    feeder: 'ALM-LON-02',
    startTime: '2026-06-01 10:12:00',
    estimatedEndTime: '2026-06-01 13:45:00',
    durationSeconds: 12780, // 3h 33m
    mainSource: 'Power On',
    assignedTeam: 'Brigada Liviana BE-01',
    clientsAffected: 560,
    clientsRestored: 560,
    criticalAffected: 1,
    electrodependentAffected: 0,
    powerOnOrders: 34,
    description: 'Corte de puente de media tensión en transformador de distribución debido a golpe de ave silvestre. Normalizado tras maniobra de reposición de protecciones.',
    timeline: [
      {
        time: '10:12:00',
        status: 'Predicha',
        description: 'Apertura de reconectador REC-LON-26.',
        source: 'Power On',
        responsible: 'Sistema SCAD-Sim'
      },
      {
        time: '10:25:00',
        status: 'Asignada',
        description: 'Se despacha BE-01 al lugar.',
        source: 'CIOP Central',
        responsible: 'Claudio Martínez'
      },
      {
        time: '11:15:00',
        status: 'Confirmada',
        description: 'Se identifica ave atrapada en terminal secundario, quemando puente.',
        source: 'Reporte de terreno',
        responsible: 'Patricio Ruiz'
      },
      {
        time: '13:00:00',
        status: 'En reparación',
        description: 'Cambio de puente y limpieza de bornes de transformador terminado.',
        source: 'Reporte de terreno',
        responsible: 'Patricio Ruiz'
      },
      {
        time: '13:45:00',
        status: 'Repuesta / cerrada',
        description: 'Energización exitosa e información comercial reporta consumo de potencia normal en ramal Cancha Alegre.',
        source: 'Power On',
        responsible: 'Claudio Martínez'
      }
    ]
  },
  {
    id: 'CTG-2026-005',
    status: 'Asignada',
    comuna: 'Cauquenes',
    sector: 'Sauzal / Ruta Los Conquistadores',
    feeder: 'ALM-CAU-08',
    startTime: '2026-06-01 20:30:00',
    estimatedEndTime: '2026-06-02 04:00:00',
    durationSeconds: 2128,
    mainSource: 'Planilla interna',
    assignedTeam: 'Mantenimiento Red AT-05 (S. Alvear)',
    clientsAffected: 1100,
    clientsRestored: 0,
    criticalAffected: 2,
    electrodependentAffected: 1,
    powerOnOrders: 85,
    description: 'Desprendimiento de conductor de alta tensión provocado por ráfagas intensas en el sector cordillerano de Sauzal.',
    timeline: [
      {
        time: '20:30:00',
        status: 'Predicha',
        description: 'Pérdida de señal de telecontrol en equipos finales de Sauzal.',
        source: 'Power On',
        responsible: 'Sistema Central'
      },
      {
        time: '20:45:00',
        status: 'Asignada',
        description: 'Brigada pesada AT-05 movilizada desde Cauquenes centro al sector.',
        source: 'CIOP Central',
        responsible: 'Margarita Soto'
      }
    ]
  }
];

export const INITIAL_COMUNA_STATS: ComunaStats[] = [
  {
    name: 'Parral',
    clientsAffected: 1420,
    clientsRestored: 450,
    criticalAffected: 3,
    electrodependentAffected: 2,
    activeContingencies: 1,
    avgDurationMinutes: 401,
    status: 'Alerta Roja'
  },
  {
    name: 'San Carlos',
    clientsAffected: 880,
    clientsRestored: 0,
    criticalAffected: 1,
    electrodependentAffected: 1,
    activeContingencies: 1,
    avgDurationMinutes: 140,
    status: 'Precaución'
  },
  {
    name: 'Ñiquén',
    clientsAffected: 340,
    clientsRestored: 0,
    criticalAffected: 0,
    electrodependentAffected: 2,
    activeContingencies: 1,
    avgDurationMinutes: 110,
    status: 'Precaución'
  },
  {
    name: 'Longaví',
    clientsAffected: 0,
    clientsRestored: 560,
    criticalAffected: 0,
    electrodependentAffected: 0,
    activeContingencies: 0,
    avgDurationMinutes: 213,
    status: 'Normal'
  },
  {
    name: 'Cauquenes',
    clientsAffected: 1100,
    clientsRestored: 0,
    criticalAffected: 2,
    electrodependentAffected: 1,
    activeContingencies: 1,
    avgDurationMinutes: 35,
    status: 'Alerta Roja'
  },
  {
    name: 'Retiro',
    clientsAffected: 0,
    clientsRestored: 0,
    criticalAffected: 0,
    electrodependentAffected: 0,
    activeContingencies: 0,
    avgDurationMinutes: 0,
    status: 'Normal'
  }
];

export const INITIAL_CRITICAL_CLIENTS: CriticalClient[] = [
  {
    nis: 'NIS-502391',
    name: 'Hospital Comunal',
    type: 'Hospital',
    comuna: 'Parral',
    address: 'Sector Urbano Central s/n',
    contingencyId: 'CTG-2026-001',
    status: 'Sin suministro', // It's undergoing power restoration/using generators
    priority: 'Muy Alta',
    startTime: '2026-06-01 14:23:45'
  },
  {
    nis: 'NIS-201884',
    name: 'Centro de Salud Familiar (CESFAM) Oriente',
    type: 'Centro de salud',
    comuna: 'Parral',
    address: 'Calle Municipal Principal',
    contingencyId: 'CTG-2026-001',
    status: 'Sin suministro',
    priority: 'Alta',
    startTime: '2026-06-01 14:23:45'
  },
  {
    nis: 'NIS-308127',
    name: 'Agua Potable Rural (APR) Sector Rural',
    type: 'APR', // Agua Potable Rural
    comuna: 'Ñiquén',
    address: 'Sector Rural s/n',
    contingencyId: 'CTG-2026-003',
    status: 'Sin suministro',
    priority: 'Alta',
    startTime: '2026-06-01 19:15:00'
  },
  {
    nis: 'NIS-448201',
    name: 'Hospital Auxiliar de Mediana Complejidad',
    type: 'Hospital',
    comuna: 'San Carlos',
    address: 'Sector Central Urbano',
    contingencyId: 'NINGUNA',
    status: 'Suministro normal',
    priority: 'Muy Alta',
    startTime: ''
  },
  {
    nis: 'NIS-992381',
    name: 'Centro de Salud Familiar (CESFAM) Central',
    type: 'Centro de salud',
    comuna: 'San Carlos',
    address: 'Calle Principal Urbano',
    contingencyId: 'CTG-2026-002',
    status: 'Sin suministro',
    priority: 'Alta',
    startTime: '2026-06-01 18:45:12'
  },
  {
    nis: 'NIS-887102',
    name: 'Cuerpo de Bomberos Comunal',
    type: 'Bomberos',
    comuna: 'Cauquenes',
    address: 'Sector Sauzal Centro',
    contingencyId: 'CTG-2026-005',
    status: 'Sin suministro',
    priority: 'Media',
    startTime: '2026-06-01 20:30:00'
  },
  {
    nis: 'NIS-502120',
    name: 'Planta Elevadora de Filtros (Servicio Esencial)',
    type: 'Servicio esencial',
    comuna: 'Parral',
    address: 'Sector Rural s/n',
    contingencyId: 'CTG-2026-001',
    status: 'Sin suministro',
    priority: 'Alta',
    startTime: '2026-06-01 14:23:45'
  },
  {
    nis: 'NIS-102948',
    name: 'Centro de Salud Familiar (CESFAM) Comunal Norte',
    type: 'Centro de salud',
    comuna: 'Longaví',
    address: 'Calle Pública de Longaví s/n',
    contingencyId: 'CTG-2026-004',
    status: 'Suministro normal', // Back to normal
    priority: 'Alta',
    startTime: '2026-06-01 10:12:00'
  }
];

export const INITIAL_ELECTRODEPENDENTS: Electrodependent[] = [
  {
    nis: 'NIS-ED-0001',
    nameProtected: 'ED-0001',
    comuna: 'Parral',
    addressOrSector: 'Sector Parral Poniente (Urbano)',
    contingencyId: 'CTG-2026-001',
    status: 'Sin suministro',
    hoursWithoutSupply: 6.7,
    maxHoursWithoutSupply: 12,
    priority: 'Crítica',
    observations: 'Paciente requiere ventilación asistida continua. Registro de cuadrilla indica entrega de generador de respaldo en el domicilio.'
  },
  {
    nis: 'NIS-ED-0002',
    nameProtected: 'ED-0002',
    comuna: 'Parral',
    addressOrSector: 'Sector Rural Fundo Parral (Coordenada Anonimizada)',
    contingencyId: 'CTG-2026-001',
    status: 'Sin suministro',
    hoursWithoutSupply: 6.7,
    maxHoursWithoutSupply: 8,
    priority: 'Crítica',
    observations: 'Requiere concentrador de oxígeno. Movilización prioritaria de brigada rural de apoyo para despacho de equipamiento de socorro.'
  },
  {
    nis: 'NIS-ED-0003',
    nameProtected: 'ED-0003',
    comuna: 'San Carlos',
    addressOrSector: 'Sector San Carlos Central (Urbano)',
    contingencyId: 'CTG-2026-002',
    status: 'Sin suministro',
    hoursWithoutSupply: 2.3,
    maxHoursWithoutSupply: 15,
    priority: 'Alta',
    observations: 'Aspirador de secreciones intermitente. Familia cuenta con equipo electrógeno portátil ya operativo.'
  },
  {
    nis: 'NIS-ED-0004',
    nameProtected: 'ED-0004',
    comuna: 'Ñiquén',
    addressOrSector: 'Sector Ñiquén Poniente (Rural)',
    contingencyId: 'CTG-2026-003',
    status: 'Sin suministro',
    hoursWithoutSupply: 1.8,
    maxHoursWithoutSupply: 6,
    priority: 'Crítica',
    observations: 'Ventilador pediátrico de alto flujo. Prioridad vial de despacho. Canal de bomberos rurales alertado preventivamente.'
  },
  {
    nis: 'NIS-ED-0005',
    nameProtected: 'ED-0005',
    comuna: 'Ñiquén',
    addressOrSector: 'Sector Estación Ñiquén (Urbano)',
    contingencyId: 'CTG-2026-003',
    status: 'Sin suministro',
    hoursWithoutSupply: 1.8,
    maxHoursWithoutSupply: 24,
    priority: 'Alta',
    observations: 'Colchón antiescaras eléctrico. Estabilidad evaluada por central telefónica.'
  },
  {
    nis: 'NIS-ED-0006',
    nameProtected: 'ED-0006',
    comuna: 'Cauquenes',
    addressOrSector: 'Sector Sauzal Rural (Cauquenes)',
    contingencyId: 'CTG-2026-005',
    status: 'Sin suministro',
    hoursWithoutSupply: 0.6,
    maxHoursWithoutSupply: 10,
    priority: 'Crítica',
    observations: 'Oxigenoterapia dependiente. Asignación inmediata por supervisor de zona para entrega de motogenerador.'
  },
  {
    nis: 'NIS-ED-0007',
    nameProtected: 'ED-0007',
    comuna: 'Retiro',
    addressOrSector: 'Sector Retiro Central',
    contingencyId: 'NINGUNA',
    status: 'Suministro normal',
    hoursWithoutSupply: 0,
    maxHoursWithoutSupply: 12,
    priority: 'Alta',
    observations: 'Suministro estable'
  }
];

export const INITIAL_FIELD_REPORTS: FieldReport[] = [
  {
    id: 'REP-001',
    contingencyId: 'CTG-2026-001',
    comuna: 'Parral',
    sector: 'La Montaña Km 12',
    feeder: 'ALM-PAR-04',
    location: '-36.1432, -71.7454',
    damageType: 'Árbol sobre línea',
    description: 'Pino oregón de unos 15 metros de altura cayó desde predio particular adyacente sobre la red trifásica de media tensión. Dejó herraje torcido y desprendimiento total de cable en tres vanos. Quebró un poste terminal de hormigón (C-11.5/300) y dañó un transformador de 75kVA.',
    status: 'Reparación en curso',
    date: '2026-06-01 14:55:00',
    reporter: 'Juan Pérez (Inspector Terreno)',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop',
    observations: 'Trabajo complejo. Requiere camión maderero para trozar el pino antes de proceder con el levante del nuevo poste.'
  },
  {
    id: 'REP-002',
    contingencyId: 'CTG-2026-002',
    comuna: 'San Carlos',
    sector: 'Esquina Bustamante con Camino Real',
    feeder: 'ALM-SCA-02',
    location: '-36.4251, -71.9542',
    damageType: 'Poste chocado',
    description: 'Camión tres cuartos colisionó de frente contra poste de BT Luzparral de suministro rural. Poste quebrado en su base, sostenido de forma precaria por las mismas líneas. El transformador asociado no presenta fugas de aceite pero fue desenergizado preventivamente.',
    status: 'Falla confirmada',
    date: '2026-06-01 19:40:00',
    reporter: 'Leonardo Díaz (B. Emergencias BE-09)',
    photoUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop',
    observations: 'Carabineros ya se encuentra en el lugar regulando el tránsito. Se espera llegada de camión grúa y cuadrilla pesada para el cambio de estructura.'
  },
  {
    id: 'REP-003',
    contingencyId: 'CTG-2026-003',
    comuna: 'Ñiquén',
    sector: 'San Gregorio Poniente Estación',
    feeder: 'ALM-NIQ-01',
    location: '-36.2941, -71.8962',
    damageType: 'Fusible quemado / Aislador roto',
    description: 'Aislador de espiga quebrado por tracción excesiva debida a vientos intensos. Puentes chocaron provocando arco eléctrico y quema de portafusible aéreo de protección anterior.',
    status: 'Falla confirmada',
    date: '2026-06-01 20:10:00',
    reporter: 'Hilda Cáceres (OFC Ñiquén)',
    photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop',
    observations: 'Aislación temporal completada en vano intermedio. Brigada rural procede a reponer herrajes y fusible.'
  },
  {
    id: 'REP-004',
    contingencyId: 'CTG-2026-001',
    comuna: 'Parral',
    sector: 'Viña del Mar Sector Bajo',
    feeder: 'ALM-PAR-04',
    location: '-36.1488, -71.7511',
    damageType: 'Corte de puentes',
    description: 'Apertura deliberada de sectorizador SEC-PAR-41-B para aislar la zona crítica de La Montaña (REP-001) y poder energizar comercialmente el ramal Viña del Mar Bajo.',
    status: 'Reparación finalizada',
    date: '2026-06-01 18:10:00',
    reporter: 'Sergio Alvear (Mantenimiento Red)',
    observations: 'Exitoso. Permitió la normalización de 450 clientes residenciales y el CESFAM Oriente.'
  }
];

export const INITIAL_DATA_SOURCES: DataSource[] = [
  {
    source: 'Carga Excel/CSV Reporte CIOP',
    type: 'Carga de Planilla Consolidada Operativa',
    lastUpdate: '2026-06-01 21:04:12',
    status: 'actualizado',
    recordsLoaded: 245,
    observations: 'Archivo subido manualmente e indexado en MySQL local. Verificado satisfactoriamente.'
  },
  {
    source: 'Carga Reporte Power On (XML)',
    type: 'Información de Fallas del Despacho',
    lastUpdate: '2026-06-01 21:01:45',
    status: 'actualizado',
    recordsLoaded: 840,
    observations: 'Importación de XML generada desde consulta local de base interna. Datos filtrados y consolidados.'
  },
  {
    source: 'Importación OSF Comerciales',
    type: 'Peticiones Comerciales de Clientes',
    lastUpdate: '2026-06-01 20:10:22',
    status: 'requiere validación',
    recordsLoaded: 4,
    observations: 'Análisis de consistencia con contingencias de terreno. Requiere aprobar asignación de NIS.'
  },
  {
    source: 'Planillas Internas (SEC)',
    type: 'Listas de Electrodep. Reguladas',
    lastUpdate: '2026-06-01 08:30:00',
    status: 'actualizado',
    recordsLoaded: 120,
    observations: 'Lista oficial cargada a la base de datos MariaDB para descarte de identidad real en visualización externa.'
  },
  {
    source: 'Registro WhatsApp/Llamadas',
    type: 'Digitación Manual de Canales Radiales',
    lastUpdate: '2026-06-01 20:48:50',
    status: 'pendiente',
    recordsLoaded: 14,
    observations: 'Notas transcritas a formulario SQL de ingreso de turnos. Pendiente de clasificar a contingencia.'
  }
];
