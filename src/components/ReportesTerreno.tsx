/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Contingency, FieldReport } from '../types';
import { 
  ClipboardCheck, FilePlus, Upload, Camera, Check, AlertTriangle, 
  MessageSquare, Radio, PhoneCall, Zap, RefreshCw 
} from 'lucide-react';

interface ReportesTerrenoProps {
  contingencies: Contingency[];
  onAddNewReport: (report: FieldReport) => void;
  onNavigateToTab: (tabName: string) => void;
}

export default function ReportesTerreno({ contingencies, onAddNewReport, onNavigateToTab }: ReportesTerrenoProps) {
  // Local state for all requested form fields
  const [contingencyId, setContingencyId] = useState('Ninguna');
  const [comuna, setComuna] = useState('Parral');
  const [sector, setSector] = useState('');
  const [feeder, setFeeder] = useState('ALM-PAR-04');
  const [damageType, setDamageType] = useState('Poste chocado');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<FieldReport['status']>('En revisión');
  const [horaReporte, setHoraReporte] = useState('2026-06-01 21:00');
  const [reporter, setReporter] = useState('');
  const [observations, setObservations] = useState('');
  
  // Optional photo evidence state
  const [mockPhoto, setMockPhoto] = useState<string>(''); 
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // Notification flow
  const [successNotif, setSuccessNotif] = useState(false);

  // Raw informal streams received over radio or messaging - Click to Autofill!
  const rawStreams = [
    {
      id: 'stream-1',
      media: 'WhatsApp',
      sender: 'WhatsApp Brigada BE-04 (Terreno)',
      time: '2026-06-01 14:50',
      text: 'Pino oregon caido en sector La Montaña Km 12, corto la trifasica de ALM-PAR-04. Poste de media tension dañado. Se requiere despeje maderero antes de izar poste.',
      payload: {
        contingencyId: 'CTG-2026-001',
        comuna: 'Parral',
        sector: 'La Montaña Km 12',
        feeder: 'ALM-PAR-04',
        damageType: 'Árbol sobre línea',
        description: 'Pino oregón de unos 15 metros cayó arrastrando líneas de media tensión trifásica en sector La Montaña Km 12. Dejó poste de hormigón quebrado.',
        reporter: 'Juan Pérez (Inspector BE-04)',
        horaReporte: '2026-06-01 14:50',
        observations: 'Requiere cuadrilla con motosierra y camión maderero.',
        photo: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop'
      }
    },
    {
      id: 'stream-2',
      media: 'Radio',
      sender: 'Radio Canal 2 — Sector Ñiquén',
      time: '2026-06-01 20:10',
      text: 'Inspector Hilda reporta aislador roto e interrupcion de baja tension en sector San Gregorio Poniente Estacion, alimentador ALM-NIQ-01. Reparacion menor por viento.',
      payload: {
        contingencyId: 'CTG-2026-003',
        comuna: 'Ñiquén',
        sector: 'San Gregorio Poniente Estación',
        feeder: 'ALM-NIQ-01',
        damageType: 'Aislador de espiga quebrado',
        description: 'Aislador de espiga quebrado por tracción excesiva de vientos intensos. Puentes flojos causando arco intermitente en sector San Gregorio.',
        reporter: 'Hilda Cáceres (Central Ñiquén)',
        horaReporte: '2026-06-01 20:10',
        observations: 'Sustitución rápida de aislación en curso.',
        photo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop'
      }
    },
    {
      id: 'stream-3',
      media: 'Llamada',
      sender: 'Llamada Telefónica (Central Retiro)',
      time: '2026-06-01 18:05',
      text: 'Vecino del Sector Viña del Mar Bajo reporta corte de puente por ráfaga severa sobre acometida aérea en ramal de baja tensión de ALM-PAR-04.',
      payload: {
        contingencyId: 'CTG-2026-001',
        comuna: 'Parral',
        sector: 'Viña del Mar Sector Bajo',
        feeder: 'ALM-PAR-04',
        damageType: 'Corte de puente',
        description: 'Puente secundario desprendido por ráfagas intensas de viento aéreo en ramal de distribución domiciliaria.',
        reporter: 'Sergio Alvear (Mantenimiento Red)',
        horaReporte: '2026-06-01 18:05',
        observations: 'Acceso en buena condición, maniobra de baja complejidad.',
        photo: ''
      }
    }
  ];

  // Apply autofill from raw informal stream
  const applyAutofill = (payload: typeof rawStreams[0]['payload']) => {
    setContingencyId(payload.contingencyId);
    setComuna(payload.comuna);
    setSector(payload.sector);
    setFeeder(payload.feeder);
    setDamageType(payload.damageType);
    setDescription(payload.description);
    setReporter(payload.reporter);
    setHoraReporte(payload.horaReporte);
    setObservations(payload.observations);
    if (payload.photo) {
      setMockPhoto(payload.photo);
      setFileName('foto_evidencia_autocompletado.jpg');
    } else {
      setMockPhoto('');
      setFileName('');
    }
  };

  // Sync comuna and fields when choosing contingency manual select
  const handleContingencyChange = (val: string) => {
    setContingencyId(val);
    if (val !== 'Ninguna') {
      const parent = contingencies.find(c => c.id === val);
      if (parent) {
        setComuna(parent.comuna);
        setFeeder(parent.feeder);
        setSector(parent.sector);
      }
    }
  };

  // Submit report to central parent state
  const handleSave = (e: React.FormEvent, shouldAssociate: boolean) => {
    e.preventDefault();
    if (!sector || !reporter || !description) {
      alert('Por favor complete los campos obligatorios: Sector, Descripción e Informante.');
      return;
    }

    const reportId = `REP-${String(Math.floor(Math.random() * 900) + 100)}`;

    const newReport: FieldReport = {
      id: reportId,
      contingencyId: shouldAssociate ? contingencyId : 'NINGUNA',
      comuna,
      sector,
      feeder,
      location: '-36.1432, -71.7454 (Coordenada Estimada)',
      damageType,
      description,
      status,
      date: horaReporte, // Uses the user-specified time instead of a forced real-time timestamp
      reporter,
      photoUrl: mockPhoto || '', // Empty photo is completely fine - optional photo evidence!
      observations
    };

    onAddNewReport(newReport);
    setSuccessNotif(true);
    resetForm();

    setTimeout(() => {
      setSuccessNotif(false);
      onNavigateToTab('Panel General'); // Return smoothly to general view
    }, 2500);
  };

  const resetForm = () => {
    setContingencyId('Ninguna');
    setComuna('Parral');
    setSector('');
    setFeeder('ALM-PAR-04');
    setDamageType('Poste chocado');
    setDescription('');
    setStatus('En revisión');
    setReporter('');
    setObservations('');
    setMockPhoto('');
    setFileName('');
    setHoraReporte('2026-06-01 21:00');
  };

  // Drag and Drop simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      setMockPhoto('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setMockPhoto('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="terrain-reports-screen">
      
      {/* Title */}
      <div className="border-b border-slate-200 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
            Ingreso Rápido de Reportes de Terreno (Canales Consolidados)
          </h2>
          <p className="text-xs text-slate-500">
            Formulario simplificado para digitalizar incidencias físicas informadas por radio, patrullas o mensajería WhatsApp.
          </p>
        </div>
      </div>

      {successNotif && (
        <div className="bg-emerald-600 text-white font-extrabold p-4 rounded-xl text-xs flex items-center gap-2 animate-bounce shadow-md">
          <Check className="w-5 h-5 text-emerald-100" />
          <span>Reporte de terreno registrado correctamente en base MariaDB local. Redireccionando...</span>
        </div>
      )}

      {/* Main split: Left Column has autofill sources tray, right cards have the simplified form */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Tray of incoming informal streams (WhatsApp, Radio, Calls) */}
        <div className="space-y-4 xl:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 uppercase font-bold text-xs">
            <h3 className="text-xs font-black text-rose-500 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-1.5 leading-none">
              <MessageSquare className="w-4 h-4 text-rose-400" />
              Bandeja de Canales Informales (WhatsApp / Radio)
            </h3>
            <p className="text-[11px] text-slate-500 normal-case leading-relaxed font-semibold">
              Haga clic en cualquiera de estas notificaciones en tiempo real recibidas por canales de comunicación alternativos para **autocompletar el formulario** y estructurar la información inmediatamente:
            </p>

            <div className="space-y-3">
              {rawStreams.map((stream) => {
                return (
                  <div 
                    key={stream.id}
                    onClick={() => applyAutofill(stream.payload)}
                    className="border border-slate-200 rounded-xl p-3 bg-slate-50 hover:bg-slate-100 transition cursor-pointer text-left uppercase text-slate-800 space-y-1.5 relative hover:border-blue-500"
                  >
                    <div className="flex justify-between items-center text-[9px] font-extrabold">
                      <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                        stream.media === 'WhatsApp' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        stream.media === 'Radio' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {stream.media === 'WhatsApp' && <MessageSquare className="w-2.5 h-2.5" />}
                        {stream.media === 'Radio' && <Radio className="w-2.5 h-2.5" />}
                        {stream.media === 'Llamada' && <PhoneCall className="w-2.5 h-2.5" />}
                        {stream.media}
                      </span>
                      <span className="font-mono text-slate-400">{stream.time.split(' ')[1]} hrs</span>
                    </div>

                    <div className="text-[9.5px] font-black text-slate-500 lowercase first-letter:uppercase truncate block">
                      Responsable: {stream.sender}
                    </div>

                    <p className="text-[10px] normal-case leading-relaxed font-semibold text-slate-600 line-clamp-2">
                      "{stream.text}"
                    </p>

                    <div className="text-right">
                      <span className="text-[9px] text-blue-600 font-extrabold flex items-center justify-end gap-0.5 hover:underline font-mono">
                        <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                        Autocompletar
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form and manual tools - Column Spans 2 */}
        <div className="xl:col-span-2 space-y-6">
          <form className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 text-xs font-bold font-sans" onSubmit={(e) => e.preventDefault()}>
            
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-1.5 leading-none mb-2">
              <FilePlus className="w-4 h-4 text-blue-600" />
              Estructura de Datos de Terreno
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Contingence association dropdown */}
              <div className="space-y-1">
                <label className="text-slate-405 text-slate-500 block">Contingencia Asociada (Folio Técnico)</label>
                <select 
                  value={contingencyId}
                  onChange={(e) => handleContingencyChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600 uppercase font-extrabold cursor-pointer"
                >
                  <option value="Ninguna">-- Sin Asociación (Falla Nueva) --</option>
                  {contingencies.filter(c => c.status !== 'Repuesta / cerrada').map(c => (
                    <option key={c.id} value={c.id}>{c.id} — {c.comuna} (Alim: {c.feeder})</option>
                  ))}
                </select>
              </div>

              {/* Comuna selection */}
              <div className="space-y-1">
                <label className="text-slate-500 block">Comuna Afectada *</label>
                <select 
                  value={comuna}
                  onChange={(e) => setComuna(e.target.value)}
                  disabled={contingencyId !== 'Ninguna'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-60 uppercase font-extrabold cursor-pointer"
                >
                  <option value="Parral">Parral</option>
                  <option value="San Carlos">San Carlos</option>
                  <option value="Ñiquén">Ñiquén</option>
                  <option value="Longaví">Longaví</option>
                  <option value="Cauquenes">Cauquenes</option>
                  <option value="Retiro">Retiro</option>
                </select>
              </div>

              {/* Sector Name */}
              <div className="space-y-1">
                <label className="text-slate-500 block">Sector Específico de Terreno *</label>
                <input 
                  type="text"
                  required
                  value={sector}
                  placeholder="Ej. Sector Cruce El Salto N° 45"
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600 font-medium text-slate-800"
                />
              </div>

              {/* Feeder code input */}
              <div className="space-y-1">
                <label className="text-slate-500 block">Alimentador de Red (Código Técnico)</label>
                <input 
                  type="text"
                  value={feeder}
                  placeholder="Ej. ALM-PAR-04"
                  onChange={(e) => setFeeder(e.target.value)}
                  disabled={contingencyId !== 'Ninguna'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600 font-mono font-bold disabled:opacity-60 text-slate-800"
                />
              </div>

              {/* Damage Classification dropdown */}
              <div className="space-y-1 text-slate-500">
                <label className="text-slate-500 block">Tipo de Daño Estructural Encontrado *</label>
                <select 
                  value={damageType}
                  onChange={(e) => setDamageType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-605 focus:ring-blue-600 uppercase font-extrabold cursor-pointer"
                >
                  <option value="Poste chocado">Poste quebrado por colisión vehicular</option>
                  <option value="Árbol sobre línea">Caída de pino o rama sobre tendido de media tensión</option>
                  <option value="Fusible quemado">Apertura o falla de fusible aéreo de protección</option>
                  <option value="Falla transformador">Falla técnica o recalentamiento de transformador</option>
                  <option value="Conductor desprendido">Corte de cables / conductor desprendido en poste</option>
                  <option value="Aislador de espiga quebrado">Aislador agrietado / daño por temporal de viento</option>
                  <option value="Corte de puente">Corte de puente eléctrico secundario resid.</option>
                </select>
              </div>

              {/* Date and hour of report (with custom editable state) */}
              <div className="space-y-1">
                <label className="text-slate-500 block">Hora del Reporte *</label>
                <input 
                  type="text"
                  required
                  value={horaReporte}
                  placeholder="Año-Mes-Día Hora:Min"
                  onChange={(e) => setHoraReporte(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-xs text-slate-800 focus:ring-1 focus:ring-blue-600 outline-none font-bold"
                />
              </div>

              {/* Status observed dropdown */}
              <div className="space-y-1">
                <label className="text-slate-500 block">Estado Observado en Terreno</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as FieldReport['status'])}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-600 uppercase font-extrabold cursor-pointer"
                >
                  <option value="En revisión">En diagnóstico de campo</option>
                  <option value="Falla confirmada">Falla técnica ratificada</option>
                  <option value="Reparación en curso">Reparación iniciada por brigada</option>
                  <option value="Reparación finalizada">Sustituciones completas y energizadas</option>
                </select>
              </div>

              {/* Reporter name/Crew of informers */}
              <div className="space-y-1">
                <label className="text-slate-500 block font-bold block">Informante / Cuadrilla de Emergencia *</label>
                <input 
                  type="text"
                  required
                  value={reporter}
                  placeholder="Ej. Juan Pérez (Cuadrilla BE-04)"
                  onChange={(e) => setReporter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-600 font-bold"
                />
              </div>

            </div>

            {/* General detailed description of outage */}
            <div className="space-y-1">
              <label className="text-slate-500 block">Descripción Técnica de lo Observado *</label>
              <textarea 
                required
                rows={3}
                value={description}
                placeholder="Indique con precisión el material dañado o hallazgos: ej. 2 postes quebrados de hormigón, cables cortados arrastrando arrastres domiciliarios, etc."
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-600 outline-none text-slate-800 normal-case font-semibold leading-relaxed"
              />
            </div>

            {/* Optional image panel conforming to file upload guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 items-start">
              
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-slate-500 block">Evidencia de Apoyo Opcional (Subida de Imagen)</label>
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-4 text-center transition cursor-pointer flex flex-col items-center justify-center ${
                    isDragging ? 'border-blue-500 bg-blue-50/10' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                  }`}
                  onClick={() => {
                    const input = document.getElementById('file-upload-input-photo');
                    if (input) input.click();
                  }}
                >
                  <input 
                    type="file" 
                    id="file-upload-input-photo" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                  <Camera className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="font-bold text-slate-700 block text-[11px]">Arrastrar imagen de campo o presione para cargar</span>
                  <span className="text-[9.5px] text-slate-400 font-medium lowercase">Fotografías de postes o herrajes caídos. Opcional.</span>
                </div>
              </div>

              {/* Result preview */}
              <div className="md:col-span-1 space-y-1 text-center flex flex-col justify-center h-full">
                {fileName ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 font-bold tracking-tight truncate block w-full">Cargado: {fileName.substring(0, 18)}...</span>
                    {mockPhoto && (
                      <img src={mockPhoto} alt="Evidencia opcional" className="rounded-lg object-cover w-24 h-16 shadow-xs" referrerPolicy="no-referrer" />
                    )}
                    <button 
                      type="button"
                      onClick={() => {
                        setMockPhoto('');
                        setFileName('');
                      }}
                      className="text-[9.5px] text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Remover Foto
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 font-bold border border-dashed border-slate-200 rounded-xl p-6 bg-slate-50">
                    Sin foto cargada
                  </div>
                )}
              </div>

            </div>

            {/* Submission triggers */}
            <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={(e) => handleSave(e, true)}
                disabled={contingencyId === 'Ninguna'}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-40"
              >
                <ClipboardCheck className="w-4 h-4 text-blue-105" />
                Guardar y Registrar bajo Folio Técnico
              </button>

              <button 
                type="button"
                onClick={(e) => handleSave(e, false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-extrabold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
              >
                Guardar Reporte Independiente
              </button>

              <button 
                type="button"
                onClick={resetForm}
                className="bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer text-center"
              >
                Limpiar
              </button>
            </div>

          </form>
        </div>

      </div>
      
    </div>
  );
}
