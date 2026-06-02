/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Contingency } from '../types';
import { 
  FileText, Download, FileSpreadsheet, Eye, Save, Settings2, Info, 
  Printer, UserCheck, Clock, FileCheck, CheckCircle
} from 'lucide-react';

interface ReportesCierreProps {
  contingencies: Contingency[];
  onCloseContingency: (id: string) => void;
}

export default function ReportesCierre({ contingencies, onCloseContingency }: ReportesCierreProps) {
  // Toggle selection for active target contingency
  const [selectedId, setSelectedId] = useState('CTG-2026-004');
  const [statusMsg, setStatusMsg] = useState('');
  
  // Internal Validation Fields for realistic WAMP ingestion
  const [responsable, setResponsable] = useState('Ing. Roberto Cáceres G.');
  const [revisadoPor, setRevisadoPor] = useState('Ing. Gisela Oñate R. (Superintendencia)');
  const [fechaCierre, setFechaCierre] = useState('2026-06-01 21:05:00');
  const [estadoReporte, setEstadoReporte] = useState('Listo para Auditoría');
  const [observaciones, setObservaciones] = useState(
    'Se completó exitosamente el recambio de postes quebrados en sectores rurales y el levante definitivo de las líneas cortadas. Todos los puntos y servicios críticos de agua potable (APR) y CESFAM operan normalmente.'
  );

  const targetContingency = useMemo(() => {
    return contingencies.find(c => c.id === selectedId);
  }, [contingencies, selectedId]);

  const handleAction = (actionType: 'pdf' | 'excel' | 'interno' | 'preparar' | 'guardar') => {
    if (!targetContingency) return;

    if (actionType === 'pdf') {
      setStatusMsg('Generando archivo PDF del reporte técnico consolidado...');
    } else if (actionType === 'excel') {
      setStatusMsg('Exportando planilla MS Excel (XLSX) con bitacora cronologica...');
    } else if (actionType === 'interno') {
      setStatusMsg('Generando borrador operativo del reporte interno de contingencia...');
    } else if (actionType === 'preparar') {
      setStatusMsg('Compilando expediente completo y preparando reporte para revisión técnica...');
    } else if (actionType === 'guardar') {
      setStatusMsg('Guardando cierre definitivo de la contingencia en base MySQL local...');
      onCloseContingency(targetContingency.id);
    }

    setTimeout(() => {
      setStatusMsg('');
      alert(`Acción "${actionType.toUpperCase()}" completada exitosamente en el servidor para el folio ${targetContingency.id}`);
    }, 1800);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="closure-reports-screen">
      
      {/* Upper header and selection */}
      <div className="border-b border-slate-200 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Consolidación de Reportes y Cierres Operativos (PHP Local)
          </h2>
          <p className="text-xs text-slate-500">
            Módulo interno de revisión y auditoría de incidentes. Ajuste los parámetros de control y exporte informes finales en un clic.
          </p>
        </div>

        {/* Dropdown selector */}
        <div className="flex items-center space-x-2 text-xs font-bold font-sans">
          <span className="text-slate-500 uppercase shrink-0">Seleccionar Incidente:</span>
          <select 
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600 uppercase font-extrabold cursor-pointer"
          >
            {contingencies.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} — [{c.status}] {c.comuna}
              </option>
            ))}
          </select>
        </div>
      </div>

      {statusMsg && (
        <div className="bg-slate-800 text-white p-3.5 rounded-xl text-xs font-bold font-sans flex items-center gap-2 animate-pulse shadow-sm">
          <Settings2 className="w-4 h-4 text-amber-500 animate-spin" />
          <span>{statusMsg}</span>
        </div>
      )}

      {targetContingency ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Main report preview - Left Column spans 3 */}
          <div className="xl:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 relative" id="printable-report-area">
            
            {/* Status Watermark */}
            <div className="absolute top-16 right-12 border-4 border-slate-300/30 text-slate-400/25 rounded-lg p-3 font-mono font-black tracking-widest text-sm select-none uppercase rotate-12 pointer-events-none">
              {targetContingency.status === 'Repuesta / cerrada' ? 'SITUACIÓN RESUELTA' : 'EVENTO EN CURSO'}
            </div>

            {/* Document Header */}
            <div className="flex justify-between items-start border-b border-slate-300 pb-4">
              <div className="flex items-center space-x-2">
                <svg className="w-8 h-8 opacity-90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#ffffff" strokeWidth="2" strokeDasharray="" />
                  <path d="M50 20 L24 40 L50 31 L76 40 Z" fill="#b91c1c" />
                  <path d="M50 33 L28 50 L50 42 L72 50 Z" fill="#FFFFFF" />
                  <path d="M50 45 L32 60 L50 53 L68 60 Z" fill="#1e3a8a" />
                  <path d="M50 56 L36 70 L50 64 L64 70 Z" fill="#FFFFFF" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-md font-black tracking-wide text-blue-900 italic flex items-center h-4">
                    LUZ<span className="text-rose-600">PARRAL</span>
                  </span>
                  <span className="text-[7.5px] uppercase font-bold tracking-widest text-slate-500">
                    SISTEMA WEB OPERACIONAL INTERNO
                  </span>
                </div>
              </div>

              <div className="text-right text-xs">
                <h4 className="font-extrabold text-slate-800">BORRADOR DE INFORME TÉCNICO INTERNO</h4>
                <p className="font-mono text-slate-500 text-[10px]">Folio Operativo: {targetContingency.id}</p>
                <p className="text-slate-400 text-[9px] font-sans font-semibold">Servidor de Enlace: localhost / WAMP</p>
              </div>
            </div>

            {/* Part 1: Operational Summary */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1">
                1. Resumen Técnico del Incidente
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-bold uppercase">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">ID Contingencia</span>
                  <span className="text-blue-800 font-mono text-xs block mt-0.5">{targetContingency.id}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Hora Inicio</span>
                  <span className="text-slate-700 font-mono text-xs block mt-0.5">{targetContingency.startTime}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Est. Reposición</span>
                  <span className="text-slate-700 font-mono text-xs block mt-0.5">{targetContingency.estimatedEndTime}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Alimentador Red</span>
                  <span className="text-rose-600 font-mono text-xs block mt-0.5">{targetContingency.feeder}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 col-span-2">
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Ubicación Coordinada</span>
                  <span className="text-slate-800 text-[10.5px] block mt-0.5 truncate normal-case">{targetContingency.comuna} — {targetContingency.sector}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Brigada Despachada</span>
                  <span className="text-slate-650 text-slate-600 font-mono text-[10px] block mt-0.5 truncate">{targetContingency.assignedTeam}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Duración Estimada</span>
                  <span className="text-slate-700 font-mono text-xs block mt-0.5">{Math.round(targetContingency.durationSeconds / 3600)} horas</span>
                </div>
              </div>

              {/* Statistical Counters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-bold">
                <div className="border border-slate-200 p-2 rounded-xl bg-slate-50/50 text-center">
                  <span className="text-slate-400 text-[8.5px] uppercase tracking-wider block">Clientes Regulados</span>
                  <span className="text-md font-mono font-black text-slate-800 mt-0.5 block">{targetContingency.clientsAffected.toLocaleString('cl')}</span>
                </div>
                <div className="border border-slate-200 p-2 rounded-xl bg-slate-50/50 text-center">
                  <span className="text-slate-400 text-[8.5px] uppercase tracking-wider block">Clientes Repuestos</span>
                  <span className="text-md font-mono font-black text-emerald-600 mt-0.5 block">{targetContingency.clientsRestored.toLocaleString('cl')}</span>
                </div>
                <div className="border border-slate-200 p-2 rounded-xl bg-slate-50/50 text-center">
                  <span className="text-slate-400 text-[8.5px] uppercase tracking-wider block">Puntos Críticos</span>
                  <span className="text-md font-mono font-black text-rose-600 mt-0.5 block">{targetContingency.criticalAffected}</span>
                </div>
                <div className="border border-slate-200 p-2 rounded-xl bg-slate-50/50 text-center">
                  <span className="text-slate-400 text-[8.5px] uppercase tracking-wider block font-extrabold">Electrodependientes</span>
                  <span className="text-md font-mono font-black text-amber-500 mt-0.5 block">{targetContingency.electrodependentAffected}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium text-xs leading-relaxed">
                <span className="font-extrabold text-slate-500 block text-[9.5px] uppercase tracking-wider mb-0.5">Descripción de Falla Técnica Recibida:</span>
                <p className="font-bold text-slate-800 uppercase text-[11px]">{targetContingency.description}</p>
              </div>
            </div>

            {/* Part 2: Chronological Log */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1">
                2. Log Cronológico de Acciones de Terreno
              </h3>

              <div className="overflow-x-auto text-[10.5px]">
                <table className="w-full text-left border-collapse text-xs font-bold leading-normal uppercase">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[9.5px] text-slate-500 tracking-wider">
                      <th className="py-2 px-3">Hora Log</th>
                      <th className="py-2 px-3">Estado Red</th>
                      <th className="py-2 px-3">Bitácora / Detalle</th>
                      <th className="py-2 px-3">Auditor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold uppercase">
                    {targetContingency.timeline.map((line, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-mono text-slate-550 text-slate-500">{line.time}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-[9px] bg-slate-50 border border-slate-200 text-blue-700 font-extrabold px-1.5 py-0.5 rounded-full">
                            {line.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 normal-case text-slate-600 font-bold leading-relaxed">{line.description}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500 text-[10px]">{line.responsible}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Part 3: Fields for internal validation showing PHP schema metadata */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest border-b border-slate-200 pb-1.5 flex items-center gap-1">
                <UserCheck className="w-4 h-4 text-blue-600" />
                3. Sección de Validación de Cierre Interno (Metadatos de Base Local)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-semibold">
                
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">Responsable del Reporte</span>
                  <div className="font-bold text-slate-800 text-[11px] bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{responsable}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">Revisado Por (Superintendencia)</span>
                  <div className="font-bold text-slate-800 text-[11px] bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{revisadoPor}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">Fecha y Hora de Cierre Definitivo</span>
                  <div className="font-bold text-slate-800 text-[11px] bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{fechaCierre} hrs</span>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-1">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">Observaciones Finales de Cierre (Tabla MySQL: audit_observations)</span>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-705 text-slate-700 italic font-medium normal-case leading-normal text-[11px]">
                    "{observaciones}"
                  </div>
                </div>

              </div>
            </div>

            {/* Verification Footer (No digital formal signatures or fake stamps as requested) */}
            <div className="border-t border-slate-200 pt-4 flex flex-col md:flex-row justify-between text-[10px] text-slate-400 font-sans font-bold uppercase gap-2">
              <div className="flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Estado de Registro: Base de Datos Validada Localmente en WAMP</span>
              </div>
              <div>
                <span>ID Repositorio Operacional: LUZ-REP-{targetContingency.id}-COMPILADO</span>
              </div>
            </div>

          </div>

          {/* Interactive fields editor and Operations Box - Right Column */}
          <div className="space-y-6">
            
            {/* Box 1: Campos de Validación Interna (Interactive Form to modify report) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 uppercase text-xs font-bold">
              <h3 className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-sm tracking-widest inline-block leading-none border border-slate-200 mb-1">
                Modificar Parámetros de Control
              </h3>

              <div className="space-y-3 font-bold">
                <div>
                  <label className="text-[9px] text-slate-400 uppercase tracking-widest block mb-0.5">Responsable</label>
                  <input 
                    type="text"
                    value={responsable}
                    onChange={(e) => setResponsable(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600 font-semibold normal-case text-slate-850 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 uppercase tracking-widest block mb-0.5">Revisado Por</label>
                  <input 
                    type="text"
                    value={revisadoPor}
                    onChange={(e) => setRevisadoPor(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600 font-semibold normal-case text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 uppercase tracking-widest block mb-0.5">Fecha Cierre</label>
                  <input 
                    type="text"
                    value={fechaCierre}
                    onChange={(e) => setFechaCierre(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 font-mono text-xs outline-none focus:ring-1 focus:ring-blue-600 font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 uppercase tracking-widest block mb-0.5">Estado del Reporte</label>
                  <select
                    value={estadoReporte}
                    onChange={(e) => setEstadoReporte(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600 font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="Borrador Técnico">Borrador Técnico</option>
                    <option value="Listo para Auditoría">Listo para Auditoría</option>
                    <option value="Aprobado Superintendencia">Aprobado Superintendencia</option>
                    <option value="Cierre Archivado">Cierre Archivado</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 uppercase tracking-widest block mb-0.5">Observaciones Finales</label>
                  <textarea 
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    rows={4}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-605 focus:ring-blue-600 font-medium normal-case text-slate-800 leading-normal"
                  />
                </div>
              </div>
            </div>

            {/* Box 2: Actions Box based solely on real requested PDF/Excel, Internal reports & Closure saves */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm uppercase text-xs font-bold space-y-3.5">
              <h3 className="text-[10px] text-slate-400 tracking-wider block border-b border-slate-50 pb-1 flex items-center gap-1 leading-none">
                <Settings2 className="w-4 h-4 text-slate-600" />
                Acciones Documentales Solicitadas
              </h3>

              <div className="space-y-2 font-black">
                {/* Save closure button */}
                {targetContingency.status !== 'Repuesta / cerrada' && (
                  <button 
                    onClick={() => handleAction('guardar')}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-amber-600"
                  >
                    <Save className="w-4 h-4 text-amber-50 shrink-0" />
                    Guardar Cierre de Contingencia
                  </button>
                )}

                {/* Technical pre-review button */}
                <button 
                  onClick={() => handleAction('preparar')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Eye className="w-4 h-4 text-slate-350 shrink-0" />
                  Preparar Reporte para Revisión
                </button>

                {/* Generate internal draft button */}
                <button 
                  onClick={() => handleAction('interno')}
                  className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-extrabold py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  Generar Reporte Interno
                </button>

                {/* Export PDF */}
                <button 
                  onClick={() => handleAction('pdf')}
                  className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-extrabold py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4 text-emerald-600 shrink-0" />
                  Exportar PDF
                </button>

                {/* Export Excel */}
                <button 
                  onClick={() => handleAction('excel')}
                  className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-extrabold py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4 text-indigo-600 shrink-0" />
                  Exportar Excel
                </button>
              </div>
            </div>

            {/* Informational Help card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[11px] leading-relaxed text-slate-600 font-medium font-sans">
              <span className="font-black text-slate-900 block uppercase text-[9px] tracking-widest mb-1 text-slate-500">Garantía de Resguardo Auditoría</span>
              <p className="lowercase first-letter:uppercase">Estas operaciones corren en primer plano procesando la bitácora técnica de la base local en MaríaDB. No comprometen enlaces de envío automático ni telecontrol eléctrico remoto.</p>
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-xs font-bold uppercase">
          Por favor seleccione un incidente de contingencia válido de la lista en la cabecera.
        </div>
      )}
    </div>
  );
}
