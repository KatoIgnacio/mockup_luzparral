/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CriticalClient } from '../types';
import { Building, Hospital, Info, Search, ShieldAlert, ShieldCheck, Heart, Droplet, ArrowUpRight, Filter } from 'lucide-react';

interface ClientesCriticosProps {
  criticalClients: CriticalClient[];
  onSelectContingencyID: (id: string) => void;
}

export default function ClientesCriticos({ criticalClients, onSelectContingencyID }: ClientesCriticosProps) {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedComuna, setSelectedComuna] = useState('Todas');
  
  // KPI Calculations
  const totalInBase = criticalClients.length;
  const totalAffected = criticalClients.filter(c => c.status === 'Sin suministro').length;
  const totalRestored = criticalClients.filter(c => c.status === 'Suministro normal' && c.contingencyId !== 'NINGUNA').length;
  const totalStable = criticalClients.filter(c => c.status === 'Suministro normal' && c.contingencyId === 'NINGUNA').length;
  const totalPending = totalAffected; // currently active outages

  // Comuna with highest concentration description
  const comunaConcentration = useMemo(() => {
    const counts: { [key: string]: number } = {};
    criticalClients.forEach(c => {
      if (c.status === 'Sin suministro') {
        counts[c.comuna] = (counts[c.comuna] || 0) + 1;
      }
    });
    let maxComuna = 'Ninguna';
    let maxVal = 0;
    Object.keys(counts).forEach(com => {
      if (counts[com] > maxVal) {
        maxVal = counts[com];
        maxComuna = com;
      }
    });
    return maxComuna === 'Ninguna' ? 'Monitoreo Estable' : `${maxComuna} (${maxVal} clientes)`;
  }, [criticalClients]);

  // Filter logic
  const filteredClients = useMemo(() => {
    return criticalClients.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchType = selectedType === 'Todos' || c.type === selectedType;
      const matchComuna = selectedComuna === 'Todas' || c.comuna === selectedComuna;

      return matchSearch && matchType && matchComuna;
    });
  }, [criticalClients, searchTerm, selectedType, selectedComuna]);

  // Helper icons based on item type
  const getClientIcon = (type: string) => {
    switch (type) {
      case 'Hospital':
      case 'Centro de salud':
        return <Hospital className="w-4 h-4 text-rose-600" />;
      case 'APR':
        return <Droplet className="w-4 h-4 text-blue-500" />;
      default:
        return <Building className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6" id="critical-clients-screen">
      {/* Title head */}
      <div className="border-b border-slate-200 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Administración de Puntos y Clientes Críticos
          </h2>
          <p className="text-xs text-slate-500">
            Monitoreo en tiempo real de servicios esenciales, centros de salud civil, APR (Agua Potable Rural), bomberos y seguridad municipal.
          </p>
        </div>
      </div>

      {/* Critical Anonymization Disclaimer Note */}
      <div className="bg-amber-50 border-l-4 border-amber-500 text-slate-900 p-4 rounded-r-xl text-xs font-sans shadow-sm flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-extrabold text-slate-900 uppercase tracking-widest text-[10px]">
            Restricción de Privacidad y Seguridad Operativa
          </p>
          <p className="font-black text-rose-700 tracking-tight text-[13px] my-1">
            “Datos anonimizados para fines de prototipo. Información sensible protegida.”
          </p>
          <p className="font-semibold leading-relaxed text-slate-655 text-slate-600">
            En consistencia con las políticas de resguardo de datos, la razón social, ubicaciones y NIS de los servicios críticos expuestos en esta plataforma web interna corresponden a datos genéricos simulados. No se muestra información sensitiva real que ponga en compromiso la seguridad civil ni física de las comunas monitoreadas.
          </p>
        </div>
      </div>

      {/* KPI stats bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3" id="critical-clients-kpi">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Total Críticos Registrados</span>
          <span className="text-xl font-mono font-black text-slate-800">{totalInBase}</span>
          <span className="text-[10px] text-slate-400 block font-medium">En base de datos SEC</span>
        </div>

        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl shadow-sm space-y-1 text-rose-950">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Críticos Afectados Activos</span>
          <span className="text-xl font-mono font-black text-rose-600">{totalAffected}</span>
          <span className="text-[10px] text-rose-400 block font-bold flex items-center gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            Sin suministro activo
          </span>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl shadow-sm space-y-1 text-emerald-955">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Críticos Repuestos</span>
          <span className="text-xl font-mono font-black text-emerald-600">{totalRestored}</span>
          <span className="text-[10px] text-emerald-500 block font-semibold">Repuestos durante hoy</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Críticos Suministro Normal</span>
          <span className="text-xl font-mono font-black text-emerald-600">{totalStable + totalRestored}</span>
          <span className="text-[10px] text-slate-400 block font-medium">Operación normalizada</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Mayor Afectación Sanitaria</span>
          <span className="text-xs font-bold text-slate-705 text-slate-700 truncate block mt-1">{comunaConcentration}</span>
          <span className="text-[9px] text-slate-400 block">Comuna con mayor carga</span>
        </div>
      </div>

      {/* Control Filter row */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs flex items-center">
        {/* Search Input bar */}
        <div className="relative font-bold">
          <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Buscar cliente</label>
          <div className="relative">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Escriba NIS, Hospital..."
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 pl-8 outline-none text-xs focus:ring-1 focus:ring-blue-600 font-medium"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Client Type select */}
        <div>
          <label className="text-[10px] text-slate-400 uppercase tracking-widest font-black block mb-1">Tipo de Servicio</label>
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600 font-bold"
          >
            <option value="Todos">Todos los servicios</option>
            <option value="Hospital">Hospital</option>
            <option value="Centro de salud">Centro de Salud (CESFAM)</option>
            <option value="APR">Agua Potable Rural (APR)</option>
            <option value="Establecimiento educacional">Educativo</option>
            <option value="Municipalidad">Municipalidad</option>
            <option value="Bomberos">Bomberos</option>
            <option value="Servicio esencial">Servicios Esenciales</option>
          </select>
        </div>

        {/* Comuna filter select */}
        <div>
          <label className="text-[10px] text-slate-400 uppercase tracking-widest font-black block mb-1">Filtrar por Comuna</label>
          <select 
            value={selectedComuna}
            onChange={(e) => setSelectedComuna(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600 font-bold"
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

        {/* Help block info */}
        <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-lg text-[11px] text-slate-600 leading-normal font-semibold flex items-start gap-1.5 md:col-span-1">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>Este listado prioriza automáticamente la asignación de generadores portátiles y camiones de emergencia de Luzparral.</span>
        </div>
      </div>

      {/* Main affected clients table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm" id="critical-clients-list">
        <div className="overflow-x-auto uppercase">
          <table className="w-full text-left border-collapse text-xs font-bold leading-normal">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-550 text-slate-500 tracking-wider">
                <th className="py-3 px-4">NIS</th>
                <th className="py-3 px-4">Ficha / Razón Social</th>
                <th className="py-3 px-4">Clasificación SEC</th>
                <th className="py-3 px-4">Comuna</th>
                <th className="py-3 px-4">Ubicación / Sector</th>
                <th className="py-3 px-4">Suministro Principal</th>
                <th className="py-3 px-4">Afectación</th>
                <th className="py-3 px-4">Prioridad</th>
                <th className="py-3 px-4 text-center">Falla Rel.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 uppercase text-slate-700 font-bold">
              {filteredClients.map((client) => {
                const isAffected = client.status === 'Sin suministro';
                const hasContingency = client.contingencyId && client.contingencyId !== 'NINGUNA';

                return (
                  <tr key={client.nis} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-mono text-blue-700 font-extrabold">{client.nis}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        {getClientIcon(client.type)}
                        <span className="font-extrabold normal-case text-slate-800">{client.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-550 text-slate-500 font-medium">{client.type}</td>
                    <td className="py-3.5 px-4 text-slate-700">{client.comuna}</td>
                    <td className="py-3.5 px-4 font-medium max-w-xs truncate normal-case text-slate-400">{client.address}</td>
                    <td className="py-3.5 px-4">
                      {isAffected ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-100 flex items-center gap-1 w-max">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                          {client.status}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 flex items-center gap-1 w-max">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 font-bold">
                      {isAffected ? (
                        <span className="text-rose-600 font-black">{client.startTime.split(' ')[1] || 'S/H'} hrs</span>
                      ) : (
                        <span className="text-slate-400 font-medium">Estable</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide inline-block ${
                        client.priority === 'Muy Alta' 
                          ? 'bg-rose-600 text-white shadow-xs' 
                          : client.priority === 'Alta' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {client.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {hasContingency ? (
                        <button 
                          onClick={() => onSelectContingencyID(client.contingencyId)}
                          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-blue-600 hover:text-blue-700 px-2.5 py-1 rounded-lg text-[10px] font-black font-mono transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          {client.contingencyId}
                          <ArrowUpRight className="w-3 h-3 text-blue-500" />
                        </button>
                      ) : (
                        <span className="text-slate-400 font-medium font-mono text-[10px]">Normal</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 font-bold italic normal-case">
                    No se encontraron clientes críticos que coincidan con los filtros seleccionados.
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
