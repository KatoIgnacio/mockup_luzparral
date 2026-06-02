/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Contingency, ComunaStats, DataSource } from '../types';
import { 
  Activity, Users, Zap, TrendingUp, AlertTriangle, HeartPulse, Clock, MapPin, CheckCircle, RefreshCw, FileText 
} from 'lucide-react';

interface PanelGeneralProps {
  contingencies: Contingency[];
  comunaStats: ComunaStats[];
  dataSources: DataSource[];
  onSelectContingency: (id: string) => void;
  onNavigateToTab: (tabName: string) => void;
}

export default function PanelGeneral({ 
  contingencies, 
  comunaStats, 
  dataSources, 
  onSelectContingency,
  onNavigateToTab 
}: PanelGeneralProps) {

  // Calculate high-level KPIs based on state
  const activeCont = contingencies.filter(c => c.status !== 'Repuesta / cerrada').length;
  const totalClientsWithoutPower = contingencies
    .filter(c => c.status !== 'Repuesta / cerrada')
    .reduce((sum, c) => sum + (c.clientsAffected - c.clientsRestored), 0);
  
  const totalPowerOnOrders = contingencies
    .filter(c => c.status !== 'Repuesta / cerrada')
    .reduce((sum, c) => sum + c.powerOnOrders, 0);

  const totalClientsRestored = contingencies.reduce((sum, c) => sum + c.clientsRestored, 0);
  
  const totalCriticalAffected = contingencies
    .filter(c => c.status !== 'Repuesta / cerrada')
    .reduce((sum, c) => sum + c.criticalAffected, 0);

  const totalElectrodeptAffected = contingencies
    .filter(c => c.status !== 'Repuesta / cerrada')
    .reduce((sum, c) => sum + c.electrodependentAffected, 0);

  const activeComunasCount = comunaStats.filter(c => c.activeContingencies > 0).length;

  // Average interruption duration (mocked calculated)
  const averageInterruptionHeader = '6.2 hrs';

  // Sort comunas by affected to show top-4
  const topComunas = [...comunaStats]
    .sort((a, b) => b.clientsAffected - a.clientsAffected)
    .slice(0, 5);

  // Custom high-quality mock data for the 24h evolution SVG chart
  // Hours: T-24h to Now
  const points = [
    { hour: '20h', sinSuministro: 300, repuestos: 100, ordenes: 20 },
    { hour: '22h', sinSuministro: 550, repuestos: 180, ordenes: 45 },
    { hour: '00h', sinSuministro: 900, repuestos: 220, ordenes: 80 },
    { hour: '02h', sinSuministro: 1450, repuestos: 310, ordenes: 120 },
    { hour: '04h', sinSuministro: 1600, repuestos: 450, ordenes: 135 },
    { hour: '06h', sinSuministro: 1520, repuestos: 450, ordenes: 140 },
    { hour: '08h', sinSuministro: 1100, repuestos: 810, ordenes: 110 },
    { hour: '10h', sinSuministro: 950, repuestos: 1100, ordenes: 98 },
    { hour: '12h', sinSuministro: 1800, repuestos: 1210, ordenes: 150 }, // New outage
    { hour: '14h', sinSuministro: 2400, repuestos: 1450, ordenes: 190 },
    { hour: '16h', sinSuministro: 2850, repuestos: 1510, ordenes: 240 },
    { hour: '18h', sinSuministro: 3400, repuestos: 1620, ordenes: 310 },
    { hour: '20h (Act)', sinSuministro: totalClientsWithoutPower, repuestos: totalClientsRestored, ordenes: totalPowerOnOrders }
  ];

  // Helper values to map data into SVG coordinate space
  const chartWidth = 720;
  const chartHeight = 220;
  const paddingX = 45;
  const paddingY = 25;
  const maxXValue = points.length - 1;
  const maxYValue = 4000; // max clients bound for the scale

  const getSvgCoordinates = (index: number, value: number) => {
    const x = paddingX + (index / maxXValue) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (value / maxYValue) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  // Generate SVG polyline data
  const buildSvgPath = (key: 'sinSuministro' | 'repuestos' | 'ordenes') => {
    return points.map((p, idx) => {
      const { x, y } = getSvgCoordinates(idx, p[key]);
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="space-y-6" id="panel-general">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-850 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Panel General de Contingencias
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            Vista integrada de la red operacional Luzparral. Consolide las anomalías de suministro reportadas en tiempo real por el sistema ADMS, OSF comercial y cuadrillas terrestres.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button 
            onClick={() => onNavigateToTab('Reportes de Terreno')}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2 px-4 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            Ingresar Reporte de Terreno
          </button>
          <button 
            onClick={() => onNavigateToTab('Reportes de Cierre')}
            className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-xl text-xs font-medium border border-white/15 transition flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-300" />
            Generar Informe Cierre
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-grid">
        {/* KPI 1: Contingencias Activas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Contingencias Activas</span>
            <span className="text-2xl font-extrabold text-slate-900">{activeCont}</span>
            <span className="text-[10px] text-slate-400 block font-medium">Bajo despacho operativo</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Clientes Sin Suministro */}
        <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between transition ${
          totalClientsWithoutPower > 3000 
            ? 'bg-rose-50/50 border-rose-200 text-rose-900' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Clientes Sin Suministro</span>
            <span className="text-2xl font-extrabold text-rose-600">{totalClientsWithoutPower.toLocaleString('cl')}</span>
            <span className="text-[10px] text-rose-600 block font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse inline-block" />
              Suministro Interrumpido
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Órdenes Power On */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Órdenes Power On</span>
            <span className="text-2xl font-extrabold text-amber-500">{totalPowerOnOrders}</span>
            <span className="text-[10px] text-slate-400 block font-medium">Despachadas en ADMS</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: Clientes Repuestos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Clientes Repuestos</span>
            <span className="text-2xl font-extrabold text-emerald-600">{totalClientsRestored.toLocaleString('cl')}</span>
            <span className="text-[10px] text-emerald-600 block font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Durante Contingencia
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 5: Clientes Críticos Afectados */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Críticos Afectados</span>
            <span className={`text-2xl font-extrabold ${totalCriticalAffected > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
              {totalCriticalAffected}
            </span>
            <span className={`text-[10px] block font-medium ${totalCriticalAffected > 0 ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
              {totalCriticalAffected > 0 ? '¡Atención Prioritaria!' : 'Sin incidentes'}
            </span>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${totalCriticalAffected > 0 ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 6: Electrodependientes Afectados */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Electrodependientes</span>
            <span className={`text-2xl font-extrabold ${totalElectrodeptAffected > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
              {totalElectrodeptAffected}
            </span>
            <span className={`text-[10px] block font-bold ${totalElectrodeptAffected > 0 ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`}>
              {totalElectrodeptAffected > 0 ? 'Riesgo Vital - Seguimiento' : 'Monitoreo Estable'}
            </span>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${totalElectrodeptAffected > 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
            <HeartPulse className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 7: Tiempo Promedio de Interrupción */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Tiempo Promedio</span>
            <span className="text-2xl font-extrabold text-amber-600">{averageInterruptionHeader}</span>
            <span className="text-[10px] text-slate-400 block font-medium">SAIDI estimado móvil</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 8: Comunas Afectadas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Comunas Afectadas</span>
            <span className="text-2xl font-extrabold text-blue-600">{activeComunasCount}</span>
            <span className="text-[10px] text-slate-400 block font-medium">De un total de 6 comunas</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-500">
            <MapPin className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Charts & Rankings Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Evolution Line Chart Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900">Evolución de clientes sin suministro — últimas 24 horas</h3>
              <p className="text-[11px] text-slate-500">Gráfico consolidado de eventos en red de sub-transmisión y distribución</p>
            </div>
            {/* Chart Legend */}
            <div className="flex items-center space-x-3 text-[10px] font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#dc2626] inline-block rounded-full" />
                <span className="text-rose-600">Sin Suministro</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#10b981] inline-block rounded-full" />
                <span className="text-emerald-600">Repuestos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#f59e0b] inline-block rounded-full" />
                <span className="text-amber-600">Power On</span>
              </div>
            </div>
          </div>

          {/* Custom SVG Line Chart */}
          <div className="relative overflow-x-auto pt-2">
            <div className="min-w-[680px]">
              <svg className="w-full" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} fill="none" style={{ background: '#fcfcfc' }}>
                {/* Grids and Axes */}
                {Array.from({ length: 5 }).map((_, idx) => {
                  const val = idx * 1000;
                  const y = chartHeight - paddingY - (val / maxYValue) * (chartHeight - paddingY * 2);
                  return (
                    <g key={idx}>
                      <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="#edf2f7" strokeWidth="1" strokeDasharray="3,3" />
                      <text x={paddingX - 8} y={y + 4} textAnchor="end" className="fill-slate-400 font-mono text-[9px] font-semibold">
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* X labels (Hours) */}
                {points.map((p, idx) => {
                  const x = paddingX + (idx / maxXValue) * (chartWidth - paddingX * 2);
                  return (
                    <g key={idx}>
                      <line x1={x} y1={chartHeight - paddingY} x2={x} y2={chartHeight - paddingY + 4} stroke="#cbd5e0" />
                      <text x={x} y={chartHeight - paddingY + 16} textAnchor="middle" className="fill-slate-500 font-sans text-[10px] font-medium">
                        {p.hour}
                      </text>
                    </g>
                  );
                })}

                {/* Lines */}
                {/* 1. Clients without supply (Red Line) */}
                <polyline 
                  points={buildSvgPath('sinSuministro')} 
                  fill="none" 
                  stroke="#dc2626" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 2. Repuestos (Emerald Line) */}
                <polyline 
                  points={buildSvgPath('repuestos')} 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 3. Orders (Amber Line) */}
                <polyline 
                  points={buildSvgPath('ordenes')} 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="1.5" 
                  strokeDasharray="4,2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Dots on final index */}
                {(() => {
                  const lastIdx = points.length - 1;
                  const lastPt = points[lastIdx];
                  const c1 = getSvgCoordinates(lastIdx, lastPt.sinSuministro);
                  const c2 = getSvgCoordinates(lastIdx, lastPt.repuestos);
                  const c3 = getSvgCoordinates(lastIdx, lastPt.ordenes);
                  return (
                    <g>
                      <circle cx={c1.x} cy={c1.y} r="4.5" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx={c2.x} cy={c2.y} r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx={c3.x} cy={c3.y} r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                      
                      {/* Live callout */}
                      <g transform={`translate(${c1.x - 140}, ${c1.y - 35})`}>
                        <rect width="130" height="42" rx="4" fill="#0f172a" opacity="0.95" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" />
                        <text x="6" y="16" className="fill-white font-sans text-[9px] font-bold">REGISTRO ACTUAL:</text>
                        <text x="6" y="28" className="fill-rose-400 font-mono text-[10px] font-bold">
                          {lastPt.sinSuministro} sin suministro
                        </text>
                        <text x="6" y="37" className="fill-emerald-400 font-mono text-[9px]">
                          {lastPt.repuestos} repuestos
                        </text>
                      </g>
                    </g>
                  );
                })()}
              </svg>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center text-[10px] text-slate-500 font-medium">
            Nota: La consolidación se realiza automáticamente cruzando reportes de apertura de interruptores con llamados ingresados por el canal OSF.
          </div>
        </div>

        {/* Data Sources Status Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900">Estado de fuentes</h3>
              <p className="text-[11px] text-slate-500">Integración de canales operacionales múltiples</p>
            </div>
            <button 
              onClick={() => onNavigateToTab('Fuentes de Datos')}
              className="text-blue-600 hover:text-blue-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              Ver Todas
            </button>
          </div>

          <div className="divide-y divide-slate-100 uppercase animate-fade-in" id="source-feed-list">
            {dataSources.map((ds, sIdx) => {
              const statusColors = {
                'actualizado': { text: 'text-emerald-700 font-bold', bg: 'bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500', border: 'border-emerald-150', label: 'Actualizado' },
                'pendiente': { text: 'text-amber-700 font-bold', bg: 'bg-amber-50 border-amber-100', dot: 'bg-amber-500', border: 'border-amber-150', label: 'Pendiente' },
                'con errores': { text: 'text-rose-700 font-bold', bg: 'bg-rose-50 border-rose-100', dot: 'bg-rose-500', border: 'border-rose-150', label: 'Error' },
                'requiere validación': { text: 'text-orange-700 font-bold', bg: 'bg-orange-50 border-orange-100', dot: 'bg-orange-500', border: 'border-orange-150', label: 'Validar' },
                'cargado manualmente': { text: 'text-blue-700 font-bold', bg: 'bg-blue-50 border-blue-100', dot: 'bg-blue-500', border: 'border-blue-150', label: 'Manual' }
              };
              const config = statusColors[ds.status] || statusColors['pendiente'];

              return (
                <div key={sIdx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 tracking-tight lowercase first-letter:uppercase">{ds.source}</span>
                    <span className="text-[10px] text-slate-400 capitalize font-medium">{ds.type.split('/')[0]}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-right">
                    <div className="flex flex-col text-right">
                      <span className="font-mono text-[10px] font-bold text-slate-700">{ds.recordsLoaded} reg.</span>
                      <span className="text-[9px] text-slate-400 font-mono tracking-tight">{ds.lastUpdate.split(' ')[1]}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${config.text} ${config.bg} ${config.border} flex items-center gap-1`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      {config.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-[11px] text-slate-600 leading-normal">
            <strong>Arquitectura de Datos:</strong> Este panel demuestra la consolidación automatizada en tiempo de contingencia, resolviendo la dispersión de información del operador.
          </div>
        </div>
      </div>

      {/* Comunas Affected Ranking Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4" id="comunas-summary">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900">Top comunas afectadas</h3>
            <p className="text-[11px] text-slate-500">Ranking analítico de afectación por límites comunales</p>
          </div>
          <button 
            onClick={() => onNavigateToTab('Comunas')}
            className="mt-2 md:mt-0 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Ver Análisis por Comuna Completo
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 text-slate-500 uppercase text-[10px] tracking-wider font-bold border-b border-slate-100">
                <th className="py-3 px-4">Comuna</th>
                <th className="py-3 px-4">Clientes Sin Suministro</th>
                <th className="py-3 px-4">Clientes Repuestos</th>
                <th className="py-3 px-4">Críticos Afectados</th>
                <th className="py-3 px-4">Electrodependientes Afectados</th>
                <th className="py-3 px-4">Severidad / Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100" id="comunas-summary-list">
              {topComunas.map((col, cIdx) => {
                const isCritical = col.status === 'Alerta Roja';
                const isWarning = col.status === 'Precaución';
                
                return (
                  <tr key={cIdx} className="hover:bg-slate-50/55 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">{col.name}</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-mono font-bold ${col.clientsAffected > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                        {col.clientsAffected.toLocaleString('cl')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-600 font-semibold">{col.clientsRestored.toLocaleString('cl')}</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded-lg ${col.criticalAffected > 0 ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-slate-100 text-slate-500'}`}>
                        {col.criticalAffected}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded-lg ${col.electrodependentAffected > 0 ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                        {col.electrodependentAffected}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wide ${
                        isCritical 
                          ? 'bg-rose-600 text-white' 
                          : isWarning 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {col.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internal Active Incident Tracker list (Quick Jump to Detail) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Contingencias activas bajo seguimiento inmediato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="incident-tracker-list">
          {contingencies.filter(c => c.status !== 'Repuesta / cerrada').map((ctg, idx) => {
            return (
              <div 
                key={idx} 
                onClick={() => onSelectContingency(ctg.id)}
                className="border border-slate-200 rounded-xl p-4 hover:border-blue-650 hover:border-blue-600 hover:shadow-md transition duration-200 cursor-pointer bg-slate-50/20 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-rose-600">{ctg.id}</span>
                    <span className="bg-slate-900 text-slate-100 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                      {ctg.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{ctg.comuna} — {ctg.sector}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{ctg.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>Alimentador: <strong className="text-slate-600 font-mono">{ctg.feeder}</strong></span>
                  <span className="text-blue-600 font-bold hover:underline">Ver detalle e historial &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
