/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Contingency {
  id: string; // e.g., "CTG-2026-001"
  status: 'Predicha' | 'Asignada' | 'Confirmada' | 'En revisión en terreno' | 'En reparación' | 'Parcialmente repuesta' | 'Repuesta / cerrada';
  comuna: string;
  sector: string;
  feeder: string; // alimentador
  startTime: string;
  estimatedEndTime: string;
  durationSeconds: number;
  mainSource: string;
  assignedTeam: string;
  clientsAffected: number;
  clientsRestored: number;
  criticalAffected: number;
  electrodependentAffected: number;
  powerOnOrders: number;
  description: string;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  time: string;
  status: string;
  description: string;
  source: string;
  responsible: string;
}

export interface ComunaStats {
  name: string;
  clientsAffected: number;
  clientsRestored: number;
  criticalAffected: number;
  electrodependentAffected: number;
  activeContingencies: number;
  avgDurationMinutes: number;
  status: 'Alerta Roja' | 'Precaución' | 'Normal';
}

export interface CriticalClient {
  nis: string;
  name: string;
  type: 'Hospital' | 'Centro de salud' | 'APR' | 'Establecimiento educacional' | 'Municipalidad' | 'Bomberos' | 'Servicio esencial';
  comuna: string;
  address: string;
  contingencyId: string;
  status: 'Sin suministro' | 'Suministro normal';
  priority: 'Muy Alta' | 'Alta' | 'Media';
  startTime: string;
}

export interface Electrodependent {
  nis: string;
  nameProtected: string;
  comuna: string;
  addressOrSector: string;
  contingencyId: string;
  status: 'Sin suministro' | 'Suministro normal';
  hoursWithoutSupply: number;
  maxHoursWithoutSupply: number; // Max time safe without power
  priority: 'Crítica' | 'Alta';
  observations: string;
}

export interface FieldReport {
  id: string;
  contingencyId: string;
  comuna: string;
  sector: string;
  feeder: string;
  location: string;
  damageType: string;
  description: string;
  status: 'En revisión' | 'Falla confirmada' | 'Reparación en curso' | 'Reparación finalizada' | 'Requiere apoyo adicional' | 'Información pendiente de validar';
  date: string;
  reporter: string;
  photoUrl?: string;
  observations?: string;
}

export interface DataSource {
  source: string;
  type: string;
  lastUpdate: string;
  status: 'actualizado' | 'pendiente' | 'con errores' | 'requiere validación' | 'cargado manualmente';
  recordsLoaded: number;
  observations: string;
}
