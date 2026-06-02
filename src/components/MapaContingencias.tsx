/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Contingency, ComunaStats, CriticalClient, Electrodependent } from '../types';
import { 
  Layers, ZoomIn, ZoomOut, Check, ArrowRight, Hospital, User, Info, RefreshCw, MapPin, ShieldAlert
} from 'lucide-react';

interface MapaContingenciasProps {
  contingencies: Contingency[];
  comunaStats: ComunaStats[];
  criticalClients: CriticalClient[];
  electrodependents: Electrodependent[];
  onSelectContingency: (id: string) => void;
}

export default function MapaContingencias({
  contingencies,
  onSelectContingency
}: MapaContingenciasProps) {
  // Map interactive state
  const [selectedEntityId, setSelectedEntityId] = useState<string>('CTG-2026-001'); // default to show first
  
  // Filter states
  const [filterComuna, setFilterComuna] = useState<string>('Todas');
  const [filterFeeder, setFilterFeeder] = useState<string>('Todos');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [filterCriticidad, setFilterCriticidad] = useState<string>('Todos');
  const [filterFecha, setFilterFecha] = useState<string>('Todas');

  // Coordinated locations for our interactive graphic grid map
  // Representing Maule Sur / Ñuble Norte Region with anonymized descriptors
  const mapNodes = useMemo(() => [
    {
      id: 'CTG-2026-001',
      type: 'falla',
      contingencyId: 'CTG-2026-001',
      comuna: 'Parral',
      sector: 'Sector La Montaña',
      x: 320,
      y: 190,
      status: 'En reparación',
      severity: 'Crítica',
      clientsAffected: 1420,
      clientsRestored: 450,
      criticalCount: 3,
      electrodepCount: 2,
      feeder: 'ALM-PAR-04',
      startTime: '2026-06-01 14:23:45',
      heading: 'Postes quebrados por caida de arbol',
      colorClass: 'fill-rose-500 stroke-rose-100',
      fecha: '2026-06-01'
    },
    {
      id: 'CTG-2026-002',
      type: 'falla',
      contingencyId: 'CTG-2026-002',
      comuna: 'San Carlos',
      sector: 'Sector Bustamante',
      x: 480,
      y: 380,
      status: 'En revisión en terreno',
      severity: 'Media',
      clientsAffected: 880,
      clientsRestored: 0,
      criticalCount: 1,
      electrodepCount: 1,
      feeder: 'ALM-SCA-02',
      startTime: '2026-06-01 18:45:12',
      heading: 'Choque de camioneta contra poste de baja tension',
      colorClass: 'fill-amber-500 stroke-amber-100',
      fecha: '2026-06-01'
    },
    {
      id: 'CTG-2026-003',
      type: 'falla',
      contingencyId: 'CTG-2026-003',
      comuna: 'Ñiquén',
      sector: 'Sector San Gregorio',
      x: 410,
      y: 290,
      status: 'Confirmada',
      severity: 'Alta',
      clientsAffected: 340,
      clientsRestored: 0,
      criticalCount: 1,
      electrodepCount: 2,
      feeder: 'ALM-NIQ-01',
      startTime: '2026-06-01 19:15:00',
      heading: 'Aislador de media tension trizado por viento',
      colorClass: 'fill-blue-500 stroke-blue-100',
      fecha: '2026-06-01'
    },
    {
      id: 'CTG-2026-004',
      type: 'falla_repuesta',
      contingencyId: 'CTG-2026-004',
      comuna: 'Longaví',
      sector: 'Sector Cancha Alegre',
      x: 440,
      y: 80,
      status: 'Repuesta / cerrada',
      severity: 'Baja',
      clientsAffected: 560,
      clientsRestored: 560,
      criticalCount: 1,
      electrodepCount: 0,
      feeder: 'ALM-LON-02',
      startTime: '2026-06-01 10:12:00',
      heading: 'Fusible quemado coordinado por cuadrilla local',
      colorClass: 'fill-emerald-600 stroke-emerald-100',
      fecha: '2026-06-01'
    },
    {
      id: 'CTG-2026-005',
      type: 'falla',
      contingencyId: 'CTG-2026-005',
      comuna: 'Cauquenes',
      sector: 'Sector Sauzal',
      x: 120,
      y: 160,
      status: 'Asignada',
      severity: 'Crítica',
      clientsAffected: 1100,
      clientsRestored: 0,
      criticalCount: 1,
      electrodepCount: 1,
      feeder: 'ALM-CAU-08',
      startTime: '2026-06-01 20:30:00',
      heading: 'Conductor desprendido por tormenta de viento',
      colorClass: 'fill-rose-500 stroke-rose-100',
      fecha: '2026-06-01'
    },
    // Virtual critical client nodes representing generic structures
    {
      id: 'MC-CRIT-1',
      type: 'hospital',
      comuna: 'Parral',
      sector: 'Sector Urbano Central s/n',
      name: 'Hospital Comunal',
      x: 290,
      y: 220,
      contingencyId: 'CTG-2026-001',
      status: 'Sin suministro',
      severity: 'Alta',
      fecha: '2026-06-01'
    },
    {
      id: 'MC-CRIT-2',
      type: 'hospital',
      comuna: 'San Carlos',
      name: 'Hospital Auxiliar de Mediana Complejidad',
      x: 520,
      y: 410,
      contingencyId: 'NINGUNA',
      status: 'Suministro normal',
      severity: 'Baja',
      fecha: '2026-06-01'
    },
    // Electrodependent client node
    {
      id: 'MC-ED-1',
      type: 'electrodependiente',
      comuna: 'Ñiquén',
      name: 'ED-0004 (Riesgo Vital Alta Prioridad)',
      x: 390,
      y: 260,
      contingencyId: 'CTG-2026-003',
      status: 'Sin suministro',
      severity: 'Crítica',
      fecha: '2026-06-01'
    }
  ], []);

  // Filter conditions
  const filteredNodes = useMemo(() => {
    return mapNodes.filter(node => {
      // Filter by Comuna
      if (filterComuna !== 'Todas' && node.comuna !== filterComuna) return false;
      
      // Filter by Feeder (Alimentador)
      if (filterFeeder !== 'Todos' && node.feeder && node.feeder !== filterFeeder) return false;

      // Filter by Status (Estado)
      if (filterStatus !== 'Todos' && node.status !== filterStatus) return false;

      // Filter by Fecha (Date)
      if (filterFecha !== 'Todas' && node.fecha && node.fecha !== filterFecha) return false;

      // Filter by Criticidad (Severity)
      if (filterCriticidad !== 'Todos' && node.severity !== filterCriticidad) return false;

      return true;
    });
  }, [mapNodes, filterComuna, filterFeeder, filterStatus, filterCriticidad, filterFecha]);

  // Find the selected entity details
  const selectedEntityDetails = useMemo(() => {
    const node = mapNodes.find(n => n.id === selectedEntityId);
    if (!node) return null;

    if (node.contingencyId && node.contingencyId !== 'NINGUNA') {
      const ctg = contingencies.find(c => c.id === node.contingencyId);
      return {
        ...node,
        contingency: ctg
      };
    }
    return {
      ...node,
      contingency: undefined
    };
  }, [selectedEntityId, mapNodes, contingencies]);

  return (
    <div className="space-y-4 animate-fade-in" id="map-contingency-screen">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Visualización Territorial de Contingencias (Capa Local Pasiva)
          </h2>
          <p className="text-xs text-slate-500">
            Cartografía esquemática de la red de distribución para la mitigación del silencio informativo. Proyección regional Maule Sur / Ñuble Norte.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold font-sans">
          <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 border border-emerald-200 rounded-full flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-500" /> Visualización de Red
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500 font-semibold text-rose-700">“Datos anonimizados para fines de prototipo. Información sensible protegida.”</span>
        </div>
      </div>

      {/* Control Filters Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-2 lg:grid-cols-6 gap-3 text-xs select-none shadow-xs uppercase font-bold">
        
        {/* Comuna filter */}
        <div className="flex flex-col space-y-1">
          <label className="font-extrabold text-slate-400 block text-[9px] uppercase tracking-wider">Comuna</label>
          <select 
            value={filterComuna}
            onChange={(e) => setFilterComuna(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none cursor-pointer font-bold"
          >
            <option value="Todas">Todas las comunas</option>
            <option value="Parral">Parral</option>
            <option value="San Carlos">San Carlos</option>
            <option value="Ñiquén">Ñiquén</option>
            <option value="Longaví">Longaví</option>
            <option value="Cauquenes">Cauquenes</option>
          </select>
        </div>

        {/* Feeder filter */}
        <div className="flex flex-col space-y-1">
          <label className="font-extrabold text-slate-400 block text-[9px] uppercase tracking-wider">Alimentador</label>
          <select 
            value={filterFeeder}
            onChange={(e) => setFilterFeeder(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none cursor-pointer font-bold"
          >
            <option value="Todos">Todos</option>
            <option value="ALM-PAR-04">ALM-PAR-04</option>
            <option value="ALM-SCA-02">ALM-SCA-02</option>
            <option value="ALM-NIQ-01">ALM-NIQ-01</option>
            <option value="ALM-LON-02">ALM-LON-02</option>
            <option value="ALM-CAU-08">ALM-CAU-08</option>
          </select>
        </div>

        {/* Status filter */}
        <div className="flex flex-col space-y-1">
          <label className="font-extrabold text-slate-400 block text-[9px] uppercase tracking-wider">Estado de Falla</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none cursor-pointer font-bold"
          >
            <option value="Todos">Todos</option>
            <option value="Asignada">Asignada</option>
            <option value="Confirmada">Confirmada</option>
            <option value="En revisión en terreno">En revisión en terreno</option>
            <option value="En reparación">En reparación</option>
            <option value="Repuesta / cerrada">Repuesta / cerrada</option>
          </select>
        </div>

        {/* Criticidad Filter */}
        <div className="flex flex-col space-y-1">
          <label className="font-extrabold text-slate-400 block text-[9px] uppercase tracking-wider">Criticidad</label>
          <select 
            value={filterCriticidad}
            onChange={(e) => setFilterCriticidad(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none cursor-pointer font-bold"
          >
            <option value="Todos">Todas</option>
            <option value="Crítica">Crítica</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        {/* Fecha filter (Date) */}
        <div className="flex flex-col space-y-1">
          <label className="font-extrabold text-slate-400 block text-[9px] uppercase tracking-wider">Fecha de Evento</label>
          <select 
            value={filterFecha}
            onChange={(e) => setFilterFecha(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none cursor-pointer font-bold"
          >
            <option value="Todas">Todas las fechas</option>
            <option value="2026-06-01">2026-06-01 (Hoy)</option>
          </select>
        </div>

        {/* Reset button */}
        <div className="flex flex-col justify-end">
          <button 
            onClick={() => {
              setFilterComuna('Todas');
              setFilterFeeder('Todos');
              setFilterStatus('Todos');
              setFilterCriticidad('Todos');
              setFilterFecha('Todas');
            }}
            className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-1.5 px-3 rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer h-[34px] shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500 animate-spin-once" />
            Restablecer
          </button>
        </div>
      </div>

      {/* Main Map workspace split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5" id="map-layout-grid">
        
        {/* SVG Map Rendering Console */}
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4.5 relative shadow-md overflow-hidden flex flex-col justify-between" style={{ minHeight: '480px' }}>
          
          {/* Top Indicators inside Map Overlay */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <span className="bg-slate-950/90 text-slate-100 border border-slate-800 text-[9px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1.5 uppercase font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              Entorno WAMP Interno Activo
            </span>
            <span className="bg-slate-950/90 text-amber-400 border border-slate-800 text-[9px] font-bold px-2.5 py-1 rounded-full shadow uppercase font-mono">
              Nodos Coincidentes: {filteredNodes.length}
            </span>
          </div>

          {/* Map Compass/Zoom Widget in top right */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
            <button className="w-8 h-8 rounded-lg bg-slate-950/90 hover:bg-slate-800 text-white font-bold border border-slate-800 flex items-center justify-center shadow-md transition cursor-pointer">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-slate-950/90 hover:bg-slate-800 text-white font-bold border border-slate-800 flex items-center justify-center shadow-md transition cursor-pointer">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Vector Schematic Map Area */}
          <div className="w-full flex-1 flex items-center justify-center p-2 mt-4">
            <svg className="w-full max-w-[700px] aspect-[4/3]" viewBox="0 0 680 480" fill="none">
              
              {/* Grid Background pattern simulating GIS coordinates */}
              <defs>
                <pattern id="gisPattern" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#101b2e" strokeWidth="1" opacity="0.8" />
                </pattern>
              </defs>
              <rect width="680" height="480" fill="url(#gisPattern)" rx="16" />

              {/* Comunas Schematic Boundaries */}
              {/* Cauquenes (West) */}
              <path d="M 50 100 L 190 80 L 210 240 L 40 230 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.6" />
              <text x="70" y="120" className="fill-slate-500 font-mono text-[9px] font-bold tracking-wider opacity-60">COMUNA CAUQUENES</text>

              {/* Longaví (Northeast) */}
              <path d="M 380 40 L 590 30 L 560 140 L 360 110 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.6" />
              <text x="440" y="60" className="fill-slate-500 font-mono text-[9px] font-bold tracking-wider opacity-60">ZONA RURAL LONGAVÍ</text>

              {/* Parral (Center) */}
              <path d="M 230 130 L 360 110 L 460 250 L 230 270 Z" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.25" opacity="0.7" />
              <text x="270" y="150" className="fill-slate-550 fill-slate-500 font-mono text-[9px] font-bold tracking-wider opacity-60">COMUNA PARRAL (CENTRO)</text>

              {/* Ñiquén (Center-South) */}
              <path d="M 300 270 L 460 250 L 490 340 L 330 360 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.6" />
              <text x="340" y="315" className="fill-slate-500 font-mono text-[9px] font-bold tracking-wider opacity-60">COMUNA ÑIQUÉN (RURAL)</text>

              {/* San Carlos (South) */}
              <path d="M 350 365 L 500 340 L 620 440 L 440 460 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.6" />
              <text x="460" y="440" className="fill-slate-500 font-mono text-[9px] font-bold tracking-wider opacity-60">COMUNA SAN CARLOS</text>

              {/* Conceptual Subtransmission Electric lines (High voltage grid interconnects) */}
              <g id="electric-transmission-lines">
                {/* Parral -> Cauquenes feeder line */}
                <path d="M 320 190 Q 220 180 120 160" fill="none" stroke="#1d4ed8" strokeWidth="1.5" strokeDasharray="5,3" />
                {/* Parral -> Longaví line */}
                <path d="M 320 190 Q 380 135 440 80" fill="none" stroke="#1d4ed8" strokeWidth="1.5" strokeDasharray="5,3" />
                {/* Parral -> Ñiquén -> San Carlos main line */}
                <path d="M 320 190 L 410 290 L 480 380" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeDasharray="8,4" />
                <path d="M 410 290 L 390 260" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="3,3" />
              </g>

              {/* Nodes and Pins elements */}
              <g id="map-interactive-nodes">
                {filteredNodes.map((node) => {
                  const isSelected = node.id === selectedEntityId;
                  const isFalla = node.type === 'falla' || node.type === 'falla_repuesta';
                  const isHospital = node.type === 'hospital';
                  const isED = node.type === 'electrodependiente';

                  return (
                    <g 
                      key={node.id} 
                      transform={`translate(${node.x}, ${node.y})`}
                      className="cursor-pointer transition hover:opacity-90 active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEntityId(node.id);
                      }}
                    >
                      {/* Active failing pulse ring */}
                      {isFalla && node.status !== 'Repuesta / cerrada' && (
                        <circle cx="0" cy="0" r="16" fill="none" className="stroke-rose-500/80 stroke-2 animate-ping" />
                      )}

                      {/* Map markers representation */}
                      {isFalla ? (
                        <>
                          <circle cx="0" cy="0" r="9" className={`${node.colorClass}`} strokeWidth={isSelected ? "3" : "1"} />
                          <circle cx="0" cy="0" r="4" fill={node.status === 'Repuesta / cerrada' ? '#10b981' : '#ffffff'} />
                        </>
                      ) : isHospital ? (
                        <g>
                          <rect x="-10" y="-10" width="20" height="20" rx="4" fill="#ffffff" stroke={node.status === 'Sin suministro' ? '#f43f5e' : '#3b82f6'} strokeWidth="1.5" />
                          <Hospital className={`w-3.5 h-3.5 absolute -translate-x-[7px] -translate-y-[7px] ${node.status === 'Sin suministro' ? 'text-rose-600' : 'text-blue-600'}`} />
                        </g>
                      ) : isED ? (
                        <g>
                          <circle cx="0" cy="0" r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                          <User className="w-3.5 h-3.5 text-white absolute -translate-x-[7px] -translate-y-[7px]" />
                        </g>
                      ) : null}

                      {/* Label block */}
                      <g transform="translate(12, -4)" className="opacity-0 md:opacity-100 scale-90">
                        <rect x="-2" y="-14" width="90" height="18" rx="4" fill="#090d16" stroke={isSelected ? "#2563eb" : "#1e293b"} strokeWidth="1" />
                        <text x="4" y="-2" className="fill-slate-300 font-mono text-[8.5px] font-bold">
                          {node.comuna}: {node.contingencyId ? node.contingencyId : 'CRÍTICO'}
                        </text>
                      </g>

                      {/* Blow chosen outlines */}
                      {isSelected && (
                        <circle cx="0" cy="0" r="14" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                      )}
                    </g>
                  );
                })}
              </g>

              <g opacity="0.5" pointerEvents="none" className="text-[10px]">
                <text x="320" y="170" className="fill-slate-400 font-mono text-[8.5px] font-bold">Subestación Parral</text>
                <text x="480" y="365" className="fill-slate-400 font-mono text-[8.5px] font-bold">Subestación S. Carlos</text>
              </g>

            </svg>
          </div>

          {/* Interactive Map Legend */}
          <div className="bg-slate-950/80 text-slate-300 rounded-xl border border-slate-800 p-3 flex flex-wrap justify-between items-center gap-3 text-[10px] uppercase font-bold tracking-tight">
            <div className="flex gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-slate-105 text-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-slate-900" />
                Falla CríticaActiva
              </span>
              <span className="flex items-center gap-1.5 text-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-slate-900" />
                Falla en Reparación
              </span>
              <span className="flex items-center gap-1.5 text-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900" />
                Falla Cerrada / Resuelta
              </span>
            </div>
            
            <div className="flex gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-slate-100">
                <span className="bg-white text-rose-500 px-1 py-0.5 rounded border border-rose-100 text-[8.0px] font-black">H</span>
                Establecimiento Crítico
              </span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center text-[7.5px] font-black">ED</span>
                Paciente Protegido
              </span>
            </div>
          </div>
        </div>

        {/* Selected Entity Context card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between" id="contingency-map-popup-panel">
          
          {/* Header of popup context card */}
          <div className="p-5 border-b border-slate-100 bg-slate-800 text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400">Inspección Territorial Pasiva</span>
              <span className="text-xs font-mono font-black">{selectedEntityId}</span>
            </div>
            <h3 className="text-sm font-bold text-slate-50 mt-1 flex items-center gap-1 uppercase">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              {selectedEntityDetails?.comuna} — {selectedEntityDetails?.sector}
            </h3>
          </div>

          <div className="p-5 flex-1 space-y-4 text-xs font-bold font-sans uppercase">
            
            {/* If Failure Node */}
            {selectedEntityDetails?.contingency ? (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[10.5px] leading-relaxed">
                  <span className="text-slate-400 font-bold block mb-1">Causa del Evento:</span>
                  <span className="text-slate-800 tracking-tight font-semibold block uppercase">{selectedEntityDetails.contingency.description || selectedEntityDetails.heading}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 text-[9px] uppercase font-extrabold block">Alimentador</span>
                    <span className="text-slate-700 font-mono font-extrabold block mt-0.5">{selectedEntityDetails.contingency.feeder}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 text-[9px] uppercase font-extrabold block">Hora Inicial</span>
                    <span className="text-slate-700 font-mono text-[10px] font-semibold block mt-0.5 text-center">{selectedEntityDetails.contingency.startTime.split(' ')[1]}</span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 p-2 border-b border-slate-200 text-[9.5px] uppercase font-extrabold text-slate-500">
                    Estadísticas de Afectación de Clientes
                  </div>
                  <div className="p-3 space-y-2 text-[11px] font-bold">
                    <div className="flex justify-between">
                      <span className="text-slate-550 text-slate-500 normal-case">Clientes con corte:</span>
                      <span className="font-mono text-rose-600">{selectedEntityDetails.contingency.clientsAffected}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-550 text-slate-500 normal-case">Clientes repuestos:</span>
                      <span className="font-mono text-emerald-600">{selectedEntityDetails.contingency.clientsRestored}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-105 border-slate-100 pt-1.5 font-black">
                      <span className="text-slate-800 normal-case">Clientes pendientes:</span>
                      <span className="font-mono text-rose-600">
                        {selectedEntityDetails.contingency.clientsAffected - selectedEntityDetails.contingency.clientsRestored}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-rose-50/40 border border-rose-100 rounded-xl p-2.5 text-[11px] space-y-1">
                  <div className="flex justify-between text-rose-900">
                    <span>Establecimientos Críticos:</span>
                    <span className="font-mono font-black">{selectedEntityDetails.contingency.criticalAffected}</span>
                  </div>
                  <div className="flex justify-between text-rose-900">
                    <span>Pacientes Electrodependientes:</span>
                    <span className="font-mono font-black">{selectedEntityDetails.contingency.electrodependentAffected}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                  <span className="text-slate-500">Estado:</span>
                  <span className="bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full text-[9px] uppercase border border-amber-200">
                    {selectedEntityDetails.contingency.status}
                  </span>
                </div>
              </div>
            ) : selectedEntityDetails?.type === 'hospital' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-rose-600 font-bold">
                  <Hospital className="w-5 h-5 text-rose-500" />
                  <span>CLIENTE CRÍTICO EN BASE SQL</span>
                </div>
                <div className="space-y-2.5 leading-relaxed text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100 uppercase">
                  <p><strong>Nis de Enlace:</strong> <span className="font-mono text-slate-700">{selectedEntityDetails.id}</span></p>
                  <p><strong>Tipo / Servicio:</strong> Hospital de Comuna</p>
                  <p><strong>Razón de Filtro:</strong> {selectedEntityDetails.name}</p>
                  <p><strong>Suministro:</strong> 
                    <span className={`ml-1 font-black ${selectedEntityDetails.status === 'Sin suministro' ? 'text-rose-605 text-rose-600' : 'text-emerald-600'}`}>
                      {selectedEntityDetails.status}
                    </span>
                  </p>
                  {selectedEntityDetails.contingencyId && selectedEntityDetails.contingencyId !== 'NINGUNA' && (
                    <p className="border-t border-slate-205 border-slate-200 mt-2 pt-2 text-rose-700">
                      <strong>Asociado a Falla:</strong> <span className="font-mono font-black">{selectedEntityDetails.contingencyId}</span>
                    </p>
                  )}
                </div>
              </div>
            ) : selectedEntityDetails?.type === 'electrodependiente' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600 font-bold">
                  <User className="w-5 h-5 text-amber-500" />
                  <span>REGISTRO ELECTRODEPENDIENTE</span>
                </div>
                <div className="space-y-2.5 leading-relaxed text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100 uppercase">
                  <p><strong>Identificador:</strong> {selectedEntityDetails.name}</p>
                  <p><strong>Comuna:</strong> {selectedEntityDetails.comuna}</p>
                  <p className="text-rose-600"><strong>Estado Suministro:</strong> {selectedEntityDetails.status}</p>
                  <p><strong>Falla Activa:</strong> <span className="font-mono font-black text-rose-600">{selectedEntityDetails.contingencyId}</span></p>
                </div>
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-3 text-[10px] text-amber-900 lowercase first-letter:uppercase leading-normal font-semibold">
                  <strong>Medida Preventiva:</strong> Se ha despachado equipamiento de respaldo a la zona y personal tecnico mantiene validación telefónica cada 2 horas.
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Info className="w-8 h-8 text-slate-200" />
                <p className="text-center font-medium normal-case">Seleccione un vector en el mapa para visualizar la ficha en MariaDB.</p>
              </div>
            )}
          </div>

          {/* Action Button to redirect to Detail - NO SCADA MANEUVER / SHUTDOWN CONTROLS ALLOWED */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
            {selectedEntityDetails?.contingencyId && selectedEntityDetails?.contingencyId !== 'NINGUNA' ? (
              <div className="space-y-3">
                <button
                  onClick={() => onSelectContingency(selectedEntityDetails.contingencyId!)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-4 rounded-lg text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Ver Detalle del Incidente {selectedEntityDetails.contingencyId}</span>
                  <ArrowRight className="w-4 h-4 text-blue-100" />
                </button>
                <div className="flex items-center gap-1.5 p-2.5 bg-rose-50 border border-rose-100 rounded-lg text-[9px] text-rose-800 leading-normal font-sans tracking-tight lowercase">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span><strong>Lindero de Seguridad:</strong> Lectura pasiva. Los comandos de bypass remotos, reconexión SCADA o apertura de reconectadores están desactivados en este portal corporativo.</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-[11px] text-slate-450 text-slate-450 text-slate-400 font-bold p-1">
                La capa de control remota en vivo no está instalada por diseño operacional.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
