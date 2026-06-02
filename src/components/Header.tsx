/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Clock, Cpu, Bell } from 'lucide-react';

interface HeaderProps {
  alertsCount: number;
  onNavigateToSources: () => void;
  onNavigateToAlerts: () => void;
  status: 'updated' | 'pending';
}

export default function Header({ alertsCount, onNavigateToSources, onNavigateToAlerts, status }: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const d = date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-6 shadow-sm flex select-none items-center justify-between text-slate-800" id="ciop-header">
      {/* Brand Logo and Title */}
      <div className="flex items-center space-x-4">
        {/* SVG Luzparral Logo */}
        <div className="flex items-center space-x-2">
          <svg className="w-10 h-10 drop-shadow-sm" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" fill="#003594" stroke="#ffffff" strokeWidth="2" />
            {/* White and Yellow Chevrons cascading down */}
            <path d="M50 20 L24 40 L50 31 L76 40 Z" fill="#FFD100" />
            <path d="M50 33 L28 50 L50 42 L72 50 Z" fill="#FFFFFF" />
            <path d="M50 45 L32 60 L50 53 L68 60 Z" fill="#FFD100" />
            <path d="M50 56 L36 70 L50 64 L64 70 Z" fill="#FFFFFF" />
            <path d="M50 67 L40 78 L50 73 L60 78 Z" fill="#FFD100" />
          </svg>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wide text-red-500 italic flex items-center h-6" style={{ fontFamily: '"Inter", sans-serif' }}>
              LUZ<span className="text-slate-900">PARRAL</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600">
              CIOP CENTRAL
            </span>
          </div>
        </div>
        <div className="hidden md:block h-8 w-px bg-slate-200" />
        <div className="hidden md:flex flex-col">
          <h1 className="text-sm font-bold text-slate-800">Sistema de Gestión de Contingencias Operenciales</h1>
          <p className="text-[10px] text-slate-500">Monitoreo Integrado y Toma de Decisiones en Eventos Críticos</p>
        </div>
      </div>

      {/* System Status, Clock and Active Alerts */}
      <div className="flex items-center space-x-4">
        {/* Connection Status */}
        <div 
          onClick={onNavigateToSources}
          className="cursor-pointer flex items-center space-x-2 bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all"
        >
          {status === 'updated' ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-emerald-600 uppercase leading-none">Fuentes Activas</span>
                <span className="text-[9px] text-slate-500 leading-none">Sincronizado</span>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-amber-600 uppercase leading-none">Datos Pendientes</span>
                <span className="text-[9px] text-amber-600 leading-none">Validación</span>
              </div>
            </>
          )}
        </div>

        {/* Real-time Clock */}
        <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
          <Clock className="w-4 h-4 text-blue-500" />
          <div className="flex flex-col text-right font-mono min-w-[130px]">
            <span className="text-xs font-bold text-slate-800 uppercase">{formatDate(time).split(' ')[1]}</span>
            <span className="text-[9px] text-slate-500">{formatDate(time).split(' ')[0]} (CLT)</span>
          </div>
        </div>

        {/* Alertas Activas Banner */}
        <button 
          onClick={onNavigateToAlerts}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-bold text-xs border transition-all ${
            alertsCount > 0 
              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 animate-pulse'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Bell className={`w-4 h-4 ${alertsCount > 0 ? 'text-rose-500 shrink-0' : 'text-slate-400 shrink-0'}`} />
          <span>{alertsCount} Alertas Activas</span>
        </button>
      </div>
    </header>
  );
}
