/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Electrodependent } from '../types';
import { HeartPulse, Search, ShieldAlert, ShieldCheck, Fuel, Users, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface ElectrodependientesProps {
  electrodependents: Electrodependent[];
  onSelectContingencyID: (id: string) => void;
}

export default function Electrodependientes({ electrodependents, onSelectContingencyID }: ElectrodependientesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [comunaFilter, setComunaFilter] = useState('Todas');
  const [priorityFilter, setPriorityFilter] = useState('Todos');

  // KPI calculations
  const totalRegistered = electrodependents.length;
  const totalAffected = electrodependents.filter(e => e.status === 'Sin suministro').length;
  const totalRestored = electrodependents.filter(e => e.status === 'Suministro normal' && e.contingencyId !== 'NINGUNA').length;
  const totalStable = electrodependents.filter(e => e.status === 'Suministro normal' && e.contingencyId === 'NINGUNA').length;
  const totalPending = totalAffected;

  // Max hours without supply currently active
  const maxHoursWithoutSupplyActive = useMemo(() => {
    const active = electrodependents.filter(e => e.status === 'Sin suministro');
    if (active.length === 0) return 0;
    return Math.max(...active.map(e => e.hoursWithoutSupply));
  }, [electrodependents]);

  // Filter application
  const filteredList = useMemo(() => {
    return electrodependents.filter(e => {
      const matchSearch = e.nameProtected.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.addressOrSector.toLowerCase().includes(searchTerm.toLowerCase());

      const matchComuna = comunaFilter === 'Todas' || e.comuna === comunaFilter;
      const matchPriority = priorityFilter === 'Todos' || e.priority === priorityFilter;

      return matchSearch && matchComuna && matchPriority;
    });
  }, [electrodependents, searchTerm, comunaFilter, priorityFilter]);

  return (
    <div className="space-y-6" id="electrodependientes-screen">
      {/* Upper header */}
      <div className="border-b border-slate-200 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-500 animate-pulse" />
            Monitoreo Crítico de Pacientes Electrodependientes
          </h2>
          <p className="text-xs text-slate-500">
            Módulo de monitoreo de vida. Control estricto de soporte de suministro eléctrico protegido para pacientes con hospitalización domiciliaria.
          </p>
        </div>
        <div className="bg-rose-50 text-rose-700 text-xs font-black border border-rose-200 rounded-lg px-3 py-1 flex items-center gap-1.5 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          Riesgo Vital Activo: {totalAffected} Pacientes Sin Luz
        </div>
      </div>

      {/* Critical Anonymization Disclaimer Note */}
      <div className="bg-amber-50 border-l-4 border-amber-500 text-slate-900 p-4 rounded-r-xl text-xs font-sans shadow-sm flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-extrabold text-slate-900 uppercase tracking-widest text-[10px]">
            Restricción Crítica de Confidencialidad (SEC)
          </p>
          <p className="font-black text-rose-700 tracking-tight text-[13px] my-1">
            “Datos anonimizados para fines de prototipo. Información sensible protegida.”
          </p>
          <p className="font-semibold leading-relaxed text-slate-650 text-slate-600">
            La información expuesta para los pacientes electrodependientes ha sido completamente anonimizada y reemplazada por identificadores codificados de uso restringido (ED-0001, ED-0002, ED-0003, etc.) y sectores generales de distribución en el entorno WAMP corporativo. No se exponen nombres, ubicaciones, NIS exactos ni datos médicos reales en cumplimiento legal de resguardo de identidad.
          </p>
        </div>
      </div>

      {/* KPI stats section */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3" id="electrodependientes-kpi">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Registrados en Base</span>
          <span className="text-xl font-mono font-black text-slate-800">{totalRegistered}</span>
          <span className="text-[10px] text-slate-400 block font-medium">Oficiales por Regulador (SEC)</span>
        </div>

        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl shadow-sm space-y-1 text-rose-905">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Pacientes Afectados</span>
          <span className="text-xl font-mono font-black text-rose-600">{totalAffected}</span>
          <span className="text-[10px] text-rose-400 block font-bold">Sin suministro activo</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl shadow-sm space-y-1 text-emerald-905">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Equipos Repuestos</span>
          <span className="text-xl font-mono font-black text-emerald-600">{totalRestored}</span>
          <span className="text-[10px] text-emerald-500 block font-semibold">Energía restablecida</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Suministro Estable</span>
          <span className="text-xl font-mono font-black text-emerald-600">{totalStable + totalRestored}</span>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-0.5 text-emerald-500" />
            Normalizados / Seguros
          </span>
        </div>

        <div className="bg-[#1e293b] text-white p-4 rounded-2xl shadow-sm space-y-1 col-span-2 lg:col-span-1 border border-slate-800">
          <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">Tiempo Máx. de Corte</span>
          <span className="text-xl font-mono font-black text-amber-400">{maxHoursWithoutSupplyActive.toFixed(1)} hrs</span>
          <span className="text-[10px] text-slate-300 block font-medium">Garantizado menor a 12h</span>
        </div>
      </div>

      {/* Control Filter panel */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs uppercase font-bold">
        {/* Search bar input */}
        <div className="relative">
          <label className="text-[10px] text-slate-404 text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Buscar Paciente</label>
          <div className="relative">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Escriba NIS, Tutor..."
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 pl-8 outline-none text-xs focus:ring-1 focus:ring-blue-600 font-semibold normal-case text-slate-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Comuna filter dropdown */}
        <div>
          <label className="text-[10px] text-slate-404 text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Filtrar por Comuna</label>
          <select 
            value={comunaFilter}
            onChange={(e) => setComunaFilter(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600 uppercase font-black"
          >
            <option value="Todas">Todas las comunas</option>
            <option value="Parral">Parral</option>
            <option value="San Carlos">San Carlos</option>
            <option value="Ñiquén">Ñiquén</option>
            <option value="Longaví">Longaví</option>
            <option value="Cauquenes">Cauquenes</option>
            <option value="Retiro">Retiro</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="text-[10px] text-slate-404 text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Clasificación de Riesgo</label>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600 uppercase font-black"
          >
            <option value="Todos">Todos</option>
            <option value="Crítica">Severidad: Crítica (Ej. Ventilador)</option>
            <option value="Alta">Severidad: Alta (Ej. Concentrador)</option>
          </select>
        </div>

        {/* Help block motogenerador */}
        <div className="bg-slate-100 border border-slate-200 text-slate-600 rounded-lg p-2.5 text-[10.5px] leading-normal flex items-start gap-1.5 md:col-span-1 lowercase first-letter:uppercase font-semibold">
          <Fuel className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>Alerta de Motogenerador: Se debe proveer un equipo electrógeno autónomo antes de cumplirse el límite safe de autonomía de batería del ventilador.</span>
        </div>
      </div>

      {/* Main electrodependent table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm" id="electrodep-list">
        <div className="overflow-x-auto uppercase">
          <table className="w-full text-left border-collapse text-xs font-bold leading-normal">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 tracking-wider">
                <th className="py-2.5 px-4">NIS</th>
                <th className="py-2.5 px-4">Ficha de Identidad Protegida</th>
                <th className="py-2.5 px-4">Comuna</th>
                <th className="py-2.5 px-4">Sector Físico</th>
                <th className="py-2.5 px-4">Estado de Suministro</th>
                <th className="py-2.5 px-4">Horas Sin Suministro</th>
                <th className="py-2.5 px-4">Autonomía Safe</th>
                <th className="py-2.5 px-4">Prioridad Clinica</th>
                <th className="py-2.5 px-4">Bitácora / Protocolo Técnico</th>
                <th className="py-2.5 px-4 text-center">Falla</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-bold uppercase">
              {filteredList.map((el) => {
                const isAffected = el.status === 'Sin suministro';
                const hasContingency = el.contingencyId && el.contingencyId !== 'NINGUNA';
                
                // Calculate time percentage remaining
                const percentDone = isAffected ? (el.hoursWithoutSupply / el.maxHoursWithoutSupply) * 100 : 0;
                const isWarningPct = percentDone > 50;

                return (
                  <tr key={el.nis} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-mono text-blue-700 font-extrabold">{el.nis}</td>
                    <td className="py-3.5 px-4 normal-case font-bold text-slate-800 text-[11px] font-sans">{el.nameProtected}</td>
                    <td className="py-3.5 px-4 text-slate-600">{el.comuna}</td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate normal-case font-medium">{el.addressOrSector}</td>
                    <td className="py-3.5 px-4">
                      {isAffected ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-100 flex items-center gap-1 w-max">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-60 animate-ping inline-block" />
                          {el.status}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 flex items-center gap-1 w-max">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-55 inline-block" />
                          Estable
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-750 font-bold">
                      {isAffected ? (
                        <span className="text-rose-600 font-black">{el.hoursWithoutSupply.toFixed(1)} hrs</span>
                      ) : (
                        <span className="text-slate-400 font-medium font-sans">0.0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex flex-col space-y-1">
                        <span className={`${isWarningPct && isAffected ? 'text-rose-600 font-black' : 'text-slate-500 font-medium'}`}>{el.maxHoursWithoutSupply} hrs Max</span>
                        {isAffected && (
                          <div className="w-14 bg-slate-100 h-1.5 rounded overflow-hidden">
                            <div className={`${percentDone > 75 ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'} h-full rounded`} style={{ width: `${Math.min(percentDone, 100)}%` }} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide inline-block ${
                        el.priority === 'Crítica' 
                          ? 'bg-rose-600 text-white shadow-xs animate-pulse' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {el.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 normal-case leading-normal font-medium text-slate-500 text-[10.5px]">
                      {el.observations}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {hasContingency ? (
                        <button 
                          onClick={() => onSelectContingencyID(el.contingencyId)}
                          className="bg-slate-50 hover:bg-slate-100 border border-slate-250 text-blue-600 hover:text-blue-700 px-2.5 py-1 rounded-lg text-[10px] font-black font-mono transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          {el.contingencyId}
                          <ArrowUpRight className="w-3 h-3 text-blue-500" />
                        </button>
                      ) : (
                        <span className="text-slate-400 font-medium font-sans text-[10px]">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 italic normal-case font-bold">
                    No se encontraron pacientes electrodependientes que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
