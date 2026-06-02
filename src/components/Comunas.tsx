/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ComunaStats } from '../types';
import { BarChart, AreaChart, PieChart, Users, MapPin, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ComunasProps {
  comunaStats: ComunaStats[];
}

export default function Comunas({ comunaStats }: ComunasProps) {
  const [selectedComunaDetail, setSelectedComunaDetail] = useState<string | null>('Parral');

  const totalAffected = comunaStats.reduce((sum, c) => sum + c.clientsAffected, 0);

  // Computed data for charts
  const chartHeight = 160;
  const chartWidth = 480;
  const paddingX = 40;
  const paddingY = 20;

  // Find selected comuna data
  const selectedComunaData = comunaStats.find(c => c.name === selectedComunaDetail);

  return (
    <div className="space-y-6" id="comunas-screen">
      {/* Overview header */}
      <div className="border-b border-slate-200 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Análisis de Impacto por Comuna
          </h2>
          <p className="text-xs text-slate-500">
            Módulo analítico que desglosa el impacto, severidad y tasa de reposición por límites administrativos municipales.
          </p>
        </div>
        <div className="bg-slate-50 px-3 py-1 rounded-lg text-xs font-bold text-blue-700 border border-slate-200">
          Total de Clientes Interrumpidos: <span className="text-rose-600 font-mono">{totalAffected.toLocaleString('cl')}</span>
        </div>
      </div>

      {/* Analytical Charts Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="comunas-charts-grid">
        
        {/* Chart 1: Bar Chart of Outages by Comune */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <BarChart className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Clientes sin suministro por comuna</h3>
          </div>

          <div className="relative pt-2">
            {/* Custom SVG Bar Chart */}
            <svg viewBox="0 0 340 160" width="100%" height={chartHeight} fill="none">
              {/* Grid Lines */}
              {[40, 80, 120].map((yVal, idx) => (
                <line key={idx} x1="10" y1={yVal} x2="330" y2={yVal} stroke="#e2e8f0" strokeDasharray="2,2" />
              ))}

              {comunaStats.map((com, idx) => {
                const maxVal = 1500;
                const barHeight = com.clientsAffected > 0 ? (com.clientsAffected / maxVal) * 110 : 3;
                const barWidth = 24;
                const gap = 20;
                const x = 30 + idx * (barWidth + gap);
                const y = 130 - barHeight;

                return (
                  <g key={idx} className="group cursor-pointer">
                    {/* Background hover guide */}
                    <rect x={x - 4} y="10" width={barWidth + 8} height="120" rx="3" className="fill-slate-50/0 hover:fill-slate-50/50 transition duration-150-colors" />
                    
                    {/* Actual Bar Column */}
                    <rect 
                      x={x} 
                      y={y} 
                      width={barWidth} 
                      height={barHeight} 
                      rx="3" 
                      fill={com.clientsAffected > 1000 ? '#e11d48' : com.clientsAffected > 400 ? '#f59e0b' : '#3b82f6'} 
                    />

                    {/* Numeric value at top */}
                    {com.clientsAffected > 0 && (
                      <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" className="fill-slate-600 font-mono text-[9px] font-bold">
                        {com.clientsAffected}
                      </text>
                    )}

                    {/* Commune label bottom */}
                    <text x={x + barWidth / 2} y="145" textAnchor="middle" className="fill-slate-500 font-sans text-[8.5px] font-bold uppercase tracking-tight">
                      {com.name.slice(0, 5)}.
                    </text>
                  </g>
                );
              })}
              <line x1="10" y1="130" x2="330" y2="130" stroke="#cbd5e1" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Chart 2: Outage Percentage distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <PieChart className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Distribución porcentual del total</h3>
          </div>

          <div className="flex flex-col justify-between h-[160px] pt-1">
            <p className="text-[11px] text-slate-400 font-bold mb-2">PROPORCIÓN DE CARGA INTERRUMPIDA POR COMUNA:</p>
            <div className="space-y-2">
              {comunaStats.filter(c => c.clientsAffected > 0).map((com, idx) => {
                const percent = totalAffected > 0 ? (com.clientsAffected / totalAffected) * 100 : 0;
                const colors = ['bg-[#dc2626]', 'bg-[#fb7185]', 'bg-[#f59e0b]', 'bg-[#2563eb]'];
                const useColor = colors[idx % colors.length];

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-700">{com.name}</span>
                      <span className="text-slate-600 font-mono">{percent.toFixed(1)}%</span>
                    </div>
                    {/* Mini progress bar segment representing pct */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className={`${useColor} h-full rounded-full`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart 3: Recovery trend progress card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <AreaChart className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Tendencia de recuperación acumulada</h3>
          </div>

          <div className="space-y-3 pt-1">
            {comunaStats.map((com, idx) => {
              const totalCom = com.clientsAffected + com.clientsRestored;
              const rate = totalCom > 0 ? (com.clientsRestored / totalCom) * 100 : 100;
              
              return (
                <div key={idx} className="flex items-center gap-3 text-[10px] font-bold">
                  <span className="w-16 font-semibold text-slate-500 uppercase tracking-tight">{com.name}</span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-md overflow-hidden flex">
                    <div className="bg-emerald-500 h-full" style={{ width: `${rate}%` }} />
                    <div className="bg-rose-500 h-full" style={{ width: `${100 - rate}%` }} />
                  </div>
                  <span className="font-mono text-emerald-600 w-10 text-right">{rate.toFixed(0)}% OK</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Detailed Comunas Tabular Representation */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">Tabla comparativa de comunas</h3>

        <div className="overflow-x-auto uppercase">
          <table className="w-full text-left border-collapse text-xs font-bold leading-normal">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-505 text-slate-400 tracking-wider font-bold">
                <th className="py-3 px-4">Comuna</th>
                <th className="py-3 px-4">Clientes Sin Suministro</th>
                <th className="py-3 px-4">Clientes Repuestos</th>
                <th className="py-3 px-4">Críticos Afectados</th>
                <th className="py-3 px-4">Electrodependientes Afectados</th>
                <th className="py-3 px-4">Contingencias Activas</th>
                <th className="py-3 px-4">Tiempo Promedio</th>
                <th className="py-3 px-4">Estado Comunal</th>
                <th className="py-3 px-4 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100" id="comunas-list">
              {comunaStats.map((col, idx) => {
                const isSelected = selectedComunaDetail === col.name;
                const isCritical = col.status === 'Alerta Roja';
                const isWarning = col.status === 'Precaución';

                return (
                  <tr 
                    key={idx} 
                    onClick={() => setSelectedComunaDetail(col.name)}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-blue-50/50 border-l-4 border-l-blue-600 font-bold' 
                        : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-slate-850 text-slate-800 font-extrabold">{col.name}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-600">
                      {col.clientsAffected.toLocaleString('cl')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-600">{col.clientsRestored.toLocaleString('cl')}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-605 text-slate-600">{col.criticalAffected}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-605 text-slate-600">
                      <span className={col.electrodependentAffected > 0 ? 'text-rose-500 font-black' : ''}>
                        {col.electrodependentAffected}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-605 text-slate-600">{col.activeContingencies}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-605 text-slate-600">{col.avgDurationMinutes} mins</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide inline-block ${
                        isCritical 
                          ? 'bg-rose-600 text-white' 
                          : isWarning 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {col.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-blue-600 hover:underline whitespace-nowrap">
                      {isSelected ? 'Seleccionado \u2714' : 'Ver Ficha &arr;'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Detail Card for Selected Comuna */}
      {selectedComunaData && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Ficha Comunal Consolidada</h4>
            <h3 className="text-lg font-extrabold text-slate-950">{selectedComunaData.name}</h3>
            <p className="text-xs text-slate-600 font-medium">
              Actualmente {selectedComunaData.activeContingencies === 0 ? 'sin contingencias vigentes.' : `posee ${selectedComunaData.activeContingencies} contingencia(s) activas bajo monitoreo.`}
            </p>
          </div>

          <div className="flex gap-4 text-xs font-bold font-mono">
            <div className="bg-white p-3.5 border border-slate-200 rounded-xl flex flex-col min-w-[105px]">
              <span className="text-slate-400 font-sans font-extrabold text-[9px] uppercase">Riesgo Vital</span>
              <span className="text-lg font-black text-rose-600">{selectedComunaData.electrodependentAffected} ED</span>
            </div>

            <div className="bg-white p-3.5 border border-slate-200 rounded-xl flex flex-col min-w-[105px]">
              <span className="text-slate-400 font-sans font-extrabold text-[9px] uppercase">Puntos Críticos</span>
              <span className="text-lg font-black text-slate-805 text-slate-800">{selectedComunaData.criticalAffected} afectados</span>
            </div>

            <div className="bg-white p-3.5 border border-blue-600 rounded-xl flex flex-col min-w-[130px] text-right">
              <span className="text-slate-400 font-sans font-extrabold text-[9px] uppercase">Suministro Pendiente</span>
              <span className="text-lg font-black text-rose-600">{selectedComunaData.clientsAffected.toLocaleString('cl')} Clientes</span>
            </div>
          </div>
        </div>
      )}

      {/* Academic context explanation */}
      <div className="bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl p-4.5 text-xs leading-relaxed uppercase font-bold">
        <strong>Beneficio en toma de decisiones:</strong> Esta pantalla consolida la tasa de reposición territorial. Facilita la priorización del despacho de brigadas pesadas a comunas con mayor concentración de clientes críticos.
      </div>
    </div>
  );
}
