/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Contingency, FieldReport, TimelineEvent } from '../types';
import { 
  Building, MapPin, Zap, Clock, Users, ShieldAlert, HeartPulse, ClipboardList, 
  Map, FileText, Download, Plus, CheckSquare, MessageSquare, AlertCircle, Camera 
} from 'lucide-react';

interface DetalleContingenciaProps {
  contingency: Contingency | undefined;
  contingencies: Contingency[];
  fieldReports: FieldReport[];
  onUpdateContingencyStatus: (id: string, newStatus: Contingency['status'], notes: string) => void;
  onAddTimelineEvent: (id: string, event: TimelineEvent) => void;
  onNavigateToMap: (id: string) => void;
}

export default function DetalleContingencia({
  contingency,
  contingencies,
  fieldReports,
  onUpdateContingencyStatus,
  onAddTimelineEvent,
  onNavigateToMap
}: DetalleContingenciaProps) {
  // Modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  
  // Local form states
  const [selectedStatus, setSelectedStatus] = useState<Contingency['status']>('En reparación');
  const [statusLogNote, setStatusLogNote] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Find associated terrain reports for this contingency
  const associatedReports = fieldReports.filter(r => r.contingencyId === contingency?.id);

  if (!contingency) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500">
        <AlertCircle className="w-12 h-12 text-[#002E73] mx-auto mb-3" />
        <p className="font-bold">No se ha seleccionado ninguna contingencia.</p>
        <p className="text-xs mt-1">Regrese al Panel General o al Mapa y presione en "Ver detalle de falla".</p>
      </div>
    );
  }

  const clientsPending = contingency.clientsAffected - contingency.clientsRestored;

  // Handle updating status
  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateContingencyStatus(contingency.id, selectedStatus, statusLogNote || `Estado actualizado operativamente a: ${selectedStatus}`);
    
    // Add success indication
    setSuccessMessage('¡Estado operacional actualizado con éxito!');
    setShowStatusModal(false);
    setStatusLogNote('');
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  // Handle adding timeline log
  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const timeString = new Date().toTimeString().split(' ')[0];
    const newEvent: TimelineEvent = {
      time: timeString,
      status: contingency.status,
      description: newNoteText,
      source: 'CIOP Central / Manual',
      responsible: 'Claudio Martínez (Turno Central)'
    };

    onAddTimelineEvent(contingency.id, newEvent);
    setSuccessMessage('¡Observación agregada a la línea de tiempo!');
    setShowNotesModal(false);
    setNewNoteText('');

    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-6" id="contingency-detail-screen">
      {/* Interactive Title details */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <span className="text-[10px] bg-rose-50 text-rose-600 font-extrabold px-2.5 py-1 rounded-full tracking-wider uppercase border border-rose-100">Fallo Crítico En Monitoreo</span>
          <h2 className="text-xl font-black text-slate-900 mt-2">
            Detalle de Contingencia — Falla N° <span className="text-blue-600 font-mono">{contingency.id}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{contingency.comuna} &bull; Sector {contingency.sector}</p>
        </div>

        {/* State and actions bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-blue-600 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs uppercase shadow-sm">
            Estado: {contingency.status}
          </span>
          <span className="text-slate-200">|</span>
          <button 
            onClick={() => {
              setSelectedStatus(contingency.status);
              setShowStatusModal(true);
            }} 
            className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200 font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm cursor-pointer transition flex items-center gap-1"
          >
            <CheckSquare className="w-3.5 h-3.5 text-amber-700" />
            Actualizar Estado
          </button>
          <button 
            onClick={() => setShowNotesModal(true)}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm cursor-pointer transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Observación
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-550 bg-emerald-600 text-white font-bold p-3 rounded-lg text-xs flex items-center gap-2 shadow-sm animate-bounce">
          <CheckSquare className="w-5 h-5 text-emerald-100" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Stats Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Datos Generales */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-blue-600" />
            Datos generales de la contingencia
          </h3>
          
          <div className="space-y-3.5 text-xs text-slate-600 uppercase font-medium">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Código interno:</span>
              <span className="font-mono font-bold text-blue-700">{contingency.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Estado actual:</span>
              <span className="font-bold text-blue-700">{contingency.status}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Comuna:</span>
              <span className="font-bold text-slate-800">{contingency.comuna}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Sector afectado:</span>
              <span className="font-bold text-slate-800 normal-case">{contingency.sector}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Alimentador:</span>
              <span className="font-mono font-bold text-amber-600">{contingency.feeder}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Hora de inicio:</span>
              <span className="font-mono text-slate-700">{contingency.startTime}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">E.T.R (Est. Reposición):</span>
              <span className="font-mono text-amber-700 font-bold">{contingency.estimatedEndTime}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Duración acumulada:</span>
              <span className="font-mono text-slate-700">{Math.round(contingency.durationSeconds / 3600)} horas</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Fuente origen principal:</span>
              <span className="font-bold text-slate-800 lowercase first-letter:uppercase">{contingency.mainSource}</span>
            </div>
            <div className="flex flex-col py-1 space-y-1">
              <span className="text-slate-400">Brigada / Responsable Técnico:</span>
              <span className="font-bold text-blue-700 bg-slate-50 p-2.5 rounded-lg normal-case border border-slate-100 mt-1 font-mono text-[11px]">
                {contingency.assignedTeam}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right Col: Core Stats and Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Sub Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            
            {/* KPI A: Clientes Afectados */}
            <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex items-center space-x-3">
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex flex-col font-mono">
                <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Afectados</span>
                <span className="text-lg font-black text-rose-600">{contingency.clientsAffected.toLocaleString('cl')}</span>
              </div>
            </div>

            {/* KPI B: Clientes Repuestos */}
            <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex items-center space-x-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex flex-col font-mono">
                <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Repuestos</span>
                <span className="text-lg font-black text-emerald-600">{contingency.clientsRestored.toLocaleString('cl')}</span>
              </div>
            </div>

            {/* KPI C: Clientes Pendientes */}
            <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex items-center space-x-3 col-span-2 md:col-span-1">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex flex-col font-mono">
                <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Pendientes</span>
                <span className="text-lg font-black text-slate-800">{clientsPending.toLocaleString('cl')}</span>
              </div>
            </div>

            {/* Critical clients affected detail */}
            <div className="bg-rose-50 border border-rose-100 text-rose-950 rounded-2xl shadow-sm p-4 flex items-center gap-3">
              <Building className="w-6 h-6 text-rose-600 shrink-0" />
              <div className="font-mono">
                <span className="text-[10px] text-rose-700 font-sans font-bold uppercase block leading-none">Clientes Críticos</span>
                <span className="text-xl font-black mt-1 block">{contingency.criticalAffected} afectado(s)</span>
              </div>
            </div>

            {/* Electrodependients count */}
            <div className="bg-amber-50 border border-amber-100 text-amber-950 rounded-2xl shadow-sm p-4 flex items-center gap-3">
              <HeartPulse className="w-6 h-6 text-amber-600 shrink-0 animate-pulse" />
              <div className="font-mono">
                <span className="text-[10px] text-amber-700 font-sans font-bold uppercase block leading-none font-sans">Electrodependientes</span>
                <span className="text-xl font-black mt-1 block">{contingency.electrodependentAffected} afectado(s)</span>
              </div>
            </div>

            {/* Power On orders */}
            <div className="bg-slate-50 border border-slate-200 text-slate-850 rounded-2xl shadow-sm p-4 flex items-center gap-3 col-span-2 md:col-span-1">
              <Zap className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="font-mono">
                <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block leading-none">Órdenes PowerOn</span>
                <span className="text-lg font-black text-slate-705 text-slate-700 mt-1 block">{contingency.powerOnOrders} activas</span>
              </div>
            </div>
          </div>

          {/* Chronological Timeline Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
              Cronología de Eventos y Estados de la Falla
            </h3>

            {/* Timeline graphics */}
            <div className="relative border-l-2 border-slate-100 pl-6 ml-3 space-y-6 animate-in fade-in">
              {contingency.timeline.map((evt, eIdx) => {
                return (
                  <div key={eIdx} className="relative">
                    {/* Pulsing indicator bullet corresponding to event */}
                    <span className="absolute -left-[31px] top-0.5 w-4 h-4 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>

                    <div className="flex flex-col md:flex-row md:items-center justify-between text-xs font-bold bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-blue-700">{evt.time} hrs</span>
                          <span className="text-[9px] font-black uppercase text-amber-900 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100">
                            {evt.status}
                          </span>
                        </div>
                        <p className="font-semibold text-slate-700 normal-case leading-relaxed">{evt.description}</p>
                      </div>
                      <div className="mt-2 md:mt-0 text-[10px] text-slate-400 text-right flex md:flex-col justify-between items-end italic">
                        <span>Fuente: {evt.source}</span>
                        <span>Res: {evt.responsible}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Terrain Reports Table Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm uppercase mb-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
          <span>Reportes Técnicos Recibidos desde Terreno</span>
          <span className="text-[10px] text-slate-500 font-mono tracking-tight lowercase first-letter:uppercase bg-slate-100 px-2.5 py-1 rounded-full font-bold">
            {associatedReports.length} reportes asociados
          </span>
        </h3>

        {associatedReports.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-bold">
            No se han registrado reportes fotográficos de terreno todavía para esta falla.
          </div>
        ) : (
          <div className="overflow-x-auto text-xs font-bold leading-normal">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 tracking-wider">
                  <th className="py-2.5 px-4">Fecha / Hora</th>
                  <th className="py-2.5 px-4">Informante</th>
                  <th className="py-2.5 px-4">Tipo de Daño</th>
                  <th className="py-2.5 px-4">Inspección / Observación</th>
                  <th className="py-2.5 px-4">Evidencia Física</th>
                  <th className="py-2.5 px-4">Validación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {associatedReports.map((rep) => {
                  return (
                    <tr key={rep.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">{rep.date}</td>
                      <td className="py-3.5 px-4 text-blue-800 font-semibold">{rep.reporter}</td>
                      <td className="py-3.5 px-4 text-rose-600">{rep.damageType}</td>
                      <td className="py-3.5 px-4 max-w-xs font-medium text-slate-500 normal-case leading-relaxed">{rep.description}</td>
                      <td className="py-3.5 px-4">
                        {rep.photoUrl ? (
                          <div className="relative group w-14 h-10 bg-slate-200 border border-slate-300 rounded-lg overflow-hidden shadow-xs">
                            <img src={rep.photoUrl} alt="Evidencia" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                              <Camera className="w-3.5 h-3.5 text-white" />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium lowercase">Sin imagen</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          rep.status === 'Reparación finalizada' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {rep.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Global Actions Block */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
        <span className="text-xs text-slate-500 font-semibold uppercase">Acciones disponibles para el expediente de contingencia</span>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => onNavigateToMap(contingency.id)}
            className="bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 rounded-lg px-3 py-1.5 text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Map className="w-4 h-4 text-blue-600" />
            Ver en Mapa Operacional
          </button>
          <button 
            onClick={() => alert(`Informe consolidado de exportación generado para contingencia ${contingency.id}`)}
            className="bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 rounded-lg px-3 py-1.5 text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Generar Reporte Integral
          </button>
          <button 
            onClick={() => alert(`Datos de la falla ${contingency.id} exportados en formato Excel.`)}
            className="bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 rounded-lg px-3 py-1.5 text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Exportar CSV/XML
          </button>
        </div>
      </div>

      {/* MODAL 1: Actualizar Estado */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-300 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 border-b border-slate-100 bg-[#1e293b] text-white rounded-t-2xl flex justify-between items-center">
              <h3 className="text-sm font-bold">Cambio de Estado Operacional — {contingency.id}</h3>
              <button onClick={() => setShowStatusModal(false)} className="text-slate-300 hover:text-white font-extrabold text-lg cursor-pointer">&times;</button>
            </div>
            
            <form onSubmit={handleStatusSubmit} className="p-4 space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">Nuevo Estado de la Red</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as Contingency['status'])}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 outline-none font-bold"
                >
                  <option value="Predicha">Predicha</option>
                  <option value="Asignada">Asignada</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="En revisión en terreno">En revisión en terreno</option>
                  <option value="En reparación">En reparación</option>
                  <option value="Parcialmente repuesta">Parcialmente repuesta</option>
                  <option value="Repuesta / cerrada">Repuesta / cerrada</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">Nota u Observación de despachador</label>
                <textarea 
                  rows={3}
                  value={statusLogNote}
                  onChange={(e) => setStatusLogNote(e.target.value)}
                  placeholder="Describa brevemente las operaciones realizadas para documentar la línea de tiempo..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 outline-none font-medium text-slate-800"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowStatusModal(false)} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200 py-1.5 px-4 rounded-lg text-xs font-black transition cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Agregar Observación */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-300 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 border-b border-slate-105 bg-[#1e293b] text-white rounded-t-2xl flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Anexar comentario operacional</h3>
              <button onClick={() => setShowNotesModal(false)} className="text-slate-300 hover:text-white font-extrabold text-lg cursor-pointer">&times;</button>
            </div>
            
            <form onSubmit={handleNoteSubmit} className="p-4 space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-slate-500 block">Observación o Bitácora de Campo</label>
                <textarea 
                  rows={4}
                  required
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Por ejemplo: Brigada de construcción AT-02 reporta retiro temporal de postes caídos. Camino despejado..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 outline-none font-medium text-slate-800"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowNotesModal(false)} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-3 rounded-lg transition text-xs font-bold cursor-pointer"
                >
                  Regresar
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-4 rounded-lg transition text-xs font-bold cursor-pointer animate-pulse"
                >
                  Anexar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
