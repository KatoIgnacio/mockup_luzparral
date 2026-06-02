/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DataSource } from '../types';
import { 
  Radio, RefreshCw, Cpu, Wifi, AlertTriangle, Upload, FileSpreadsheet, 
  Send, ShieldAlert, CheckCircle, Database, AlertCircle, PhoneCall, Trash2, ListFilter
} from 'lucide-react';

interface FuentesDatosProps {
  dataSources: DataSource[];
  onTriggerSync: () => void;
}

export default function FuentesDatos({ dataSources, onTriggerSync }: FuentesDatosProps) {
  // Mock states for interactive file upload simulation in the PHP workspace
  const [uploadType, setUploadType] = useState<string>('CIOP_Excel');
  const [mockFileName, setMockFileName] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedMessage, setProcessedMessage] = useState<string>('');
  const [recordsCount, setRecordsCount] = useState<number | null>(null);

  // Manual WhatsApp / Phone / Radio registration form state
  const [manualMedia, setManualMedia] = useState<string>('WhatsApp');
  const [manualComuna, setManualComuna] = useState<string>('Parral');
  const [manualSector, setManualSector] = useState<string>('');
  const [manualFeeder, setManualFeeder] = useState<string>('ALM-PAR-04');
  const [manualDetail, setManualDetail] = useState<string>('');
  const [isManualRecording, setIsManualRecording] = useState<boolean>(false);
  const [manualSuccessMsg, setManualSuccessMsg] = useState<string>('');

  // Local database synchronization & validation simulator
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationTime, setValidationTime] = useState<string>('2026-06-01 21:04:12');
  const [validationCompleted, setValidationCompleted] = useState<boolean>(false);

  // Simulated errors found in WAMP SQLite/MySQL load buffer
  const [loadErrors, setLoadErrors] = useState<{ id: number; source: string; detail: string; line: number }[]>([
    { id: 1, source: 'EXCEL CIOP', detail: 'Identificador NIS invalido "-1" en linea 18 de la planilla.', line: 18 },
    { id: 2, source: 'POWER ON XML', detail: 'Falta etiqueta de cierre en nodo <feeder> en registro ID CTG-092. Saltado por seguridad.', line: 142 },
    { id: 3, source: 'PLANTILLA SEC', detail: 'Advertencia: El identificador ED-007 ya cuenta con suministro activo. Registro conservado sin modificar.', line: 8 }
  ]);

  // Handle Drag Over
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle Drop and select file mock
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setMockFileName(e.dataTransfer.files[0].name);
    }
  };

  // Select file mock from manual click
  const selectMockFile = (name: string) => {
    setMockFileName(name);
  };

  // Run simulated script: `load_and_validate.php`
  const handleProcessUpload = () => {
    if (!mockFileName) return;
    setIsProcessing(true);
    setProcessedMessage('');
    
    setTimeout(() => {
      setIsProcessing(false);
      const randomCount = Math.floor(Math.random() * 80) + 15;
      setRecordsCount(randomCount);
      setProcessedMessage(`PHP SCRIPT SUCCESS: Se ha procesado el archivo "${mockFileName}". Se insertaron y validaron ${randomCount} registros operacionales en la base MaríaDB "luzparral_ciop".`);
      
      // Call parent update trigger to synchronize statistics
      onTriggerSync();
      // Remove file name
      setMockFileName('');
    }, 1800);
  };

  // Run simulated manual insertion: `insert_manual_report.php`
  const handleSaveManualRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDetail) return;
    
    setIsManualRecording(true);
    setManualSuccessMsg('');
    
    setTimeout(() => {
      setIsManualRecording(false);
      setManualSuccessMsg(`Registro manual insertado correctamente en MySQL (Comuna: ${manualComuna}, Alimentador: ${manualFeeder}).`);
      setManualDetail('');
      setManualSector('');
      onTriggerSync();
      setTimeout(() => setManualSuccessMsg(''), 4000);
    }, 1000);
  };

  // Run simulated db audit: `php bin/sql_validate.php`
  const handleRunDbValidation = () => {
    setIsValidating(true);
    setValidationCompleted(false);

    setTimeout(() => {
      setIsValidating(false);
      setValidationCompleted(true);
      const now = new Date();
      setValidationTime(now.toLocaleDateString() + ' ' + now.toTimeString().split(' ')[0]);
      
      // Clean first error to simulate resolving errors during validation
      if (loadErrors.length > 0) {
        setLoadErrors(prev => prev.slice(1));
      }
      onTriggerSync();
    }, 1500);
  };

  // Delete single warning/error from current buffer list
  const deleteErrorNode = (id: number) => {
    setLoadErrors(prev => prev.filter(err => err.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in" id="sources-screen">
      
      {/* Upper header portion indicating local PHP server ecosystem */}
      <div className="border-b border-slate-200 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Consolidación y Carga de Planillas Operacionales (PHP / MariaDB)
          </h2>
          <p className="text-xs text-slate-500">
            Interfaz de administración interna para subir, validar y procesar archivos planos, registros CIOP, Power On, OSF y dictado manual sobre base de datos local en servidor WAMP.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-800 text-xs font-black border border-blue-200 rounded-lg px-3 py-1 flex items-center gap-1.5 shadow-xs">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          Servidor WAMP Local: Activo (Apache/PHP 8.2 + MariaDB)
        </div>
      </div>

      {/* Main split work console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="sources-diagnostics-grid">
        
        {/* Left column spans 2 - Loader forms & Manual registrations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Drag & Drop PHP File Ingestion */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-blue-600" />
                Cargar Archivos de Contingencia (CSV, Excel, XML, JSON)
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Formato SQL Ingestor</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Selector for upload template type */}
              <div className="space-y-1 md:col-span-1">
                <label className="text-[9.5px] uppercase font-bold text-slate-400">Tipo de Archivo a Procesar</label>
                <select 
                  value={uploadType}
                  onChange={(e) => {
                    setUploadType(e.target.value);
                    setMockFileName('');
                    setProcessedMessage('');
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer text-slate-800"
                >
                  <option value="CIOP_Excel">Reporte CIOP en Excel/CSV</option>
                  <option value="PowerOn_XML">Reporte de Fallas Power On (XML)</option>
                  <option value="OSF_JSON">Planilla de Reclamos OSF (JSON)</option>
                  <option value="SEC_List">Planilla Interna SEC (Excel)</option>
                </select>
                <p className="text-[10px] text-slate-400 normal-case pt-1 font-semibold leading-relaxed">
                  {uploadType === 'CIOP_Excel' && 'Consolida listado general de clientes en interrupción reportados por comunas.'}
                  {uploadType === 'PowerOn_XML' && 'Estructura de telecomandos de reconectadores e interruptores primarios.'}
                  {uploadType === 'OSF_JSON' && 'Peticiones de reclamo telefónico cargados por el área comercial.'}
                  {uploadType === 'SEC_List' && 'Padrón oficial de electrodependientes para descarte anonimizado.'}
                </p>
              </div>

              {/* Upload Drop Zone mock */}
              <div className="md:col-span-2 space-y-3">
                <div 
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition cursor-pointer select-none ${
                    dragActive ? 'border-blue-600 bg-blue-50/20' : 'border-slate-300 bg-slate-50 hover:bg-slate-100/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => {
                    // Set a mock file name to represent choosing file
                    const mockNames: { [key: string]: string } = {
                      'CIOP_Excel': 'ciop_reporte_contingencias_2026.xlsx',
                      'PowerOn_XML': 'poweron_raw_fallas_01062026.xml',
                      'OSF_JSON': 'osf_reclamos_comerciales_import.json',
                      'SEC_List': 'padron_electrodependientes_sec_protegida.csv'
                    };
                    selectMockFile(mockNames[uploadType] || 'planilla_contingencias.csv');
                  }}
                >
                  <FileSpreadsheet className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-slate-700 block">Drag & Drop o presione para seleccionar archivo</span>
                  <span className="text-[10px] text-slate-400 font-medium lowercase">Límite de archivo sugerido: 50MB (.csv, .xlsx, .xml, .json)</span>
                </div>

                {/* Selected File Name Display */}
                {mockFileName && (
                  <div className="bg-blue-50 border border-blue-200 px-3 py-2.5 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-xs font-mono font-bold text-blue-900 truncate">{mockFileName}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setMockFileName('');
                      }} 
                      className="text-xs text-rose-600 font-bold hover:underline shrink-0"
                    >
                      Remover
                    </button>
                  </div>
                )}

                {/* Action button to trigger processing */}
                {mockFileName && (
                  <button
                    onClick={handleProcessUpload}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2 px-4 rounded-lg shadow-xs cursor-pointer flex items-center justify-center gap-2 transition"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Ejecutando upload_process.php en servidor...</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-3.5 h-3.5 text-blue-100" />
                        <span>Procesar e Insertar en Base de Datos MySQL</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Simulated success or response message */}
            {processedMessage && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-[11px] font-sans font-bold flex gap-2.5 text-emerald-905 text-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1 leading-relaxed">
                  <p className="text-emerald-800 font-extrabold">Ingestión de Archivo Completa</p>
                  <p className="font-semibold text-slate-700">{processedMessage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Form for Manual Digitization of Informal Streams (WhatsApp, Radio, Calls) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-blue-650 text-blue-600" />
                Registrar Información Manual (WhatsApp, Radio, Llamadas de Emergencia)
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Digitación Directa CIOP</span>
            </div>

            <form onSubmit={handleSaveManualRecord} className="grid grid-cols-2 md:grid-cols-4 gap-3 uppercase font-bold text-xs">
              
              {/* Media Channel Input */}
              <div className="flex flex-col space-y-0.5 col-span-1">
                <label className="text-[9px] text-slate-400 uppercase tracking-widest block font-extrabold">Canal / Medio</label>
                <select 
                  value={manualMedia}
                  onChange={(e) => setManualMedia(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 cursor-pointer font-bold"
                >
                  <option value="WhatsApp">Grupo WhatsApp Coordinación</option>
                  <option value="Radio">Canal de Radio Comunal</option>
                  <option value="Llamada">Llamada Telefónica Vecinal / Ret</option>
                  <option value="Terreno">Reporte Rápido Terreno</option>
                </select>
              </div>

              {/* Comuna Choice */}
              <div className="flex flex-col space-y-0.5 col-span-1">
                <label className="text-[9px] text-slate-400 uppercase tracking-widest block font-extrabold">Comuna del Evento</label>
                <select 
                  value={manualComuna}
                  onChange={(e) => setManualComuna(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 cursor-pointer font-bold"
                >
                  <option value="Parral">Parral</option>
                  <option value="San Carlos">San Carlos</option>
                  <option value="Ñiquén">Ñiquén</option>
                  <option value="Longaví">Longaví</option>
                  <option value="Cauquenes">Cauquenes</option>
                </select>
              </div>

              {/* Sector text input */}
              <div className="flex flex-col space-y-0.5 col-span-1">
                <label className="text-[9px] text-slate-400 uppercase tracking-widest block font-extrabold">Sector Físico General</label>
                <input 
                  type="text"
                  value={manualSector}
                  onChange={(e) => setManualSector(e.target.value)}
                  placeholder="Ej. Sector Cruce El Salto"
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 font-semibold normal-case"
                />
              </div>

              {/* Feeder select */}
              <div className="flex flex-col space-y-0.5 col-span-1">
                <label className="text-[9px] text-slate-400 uppercase tracking-widest block font-extrabold">Alimentador Eléctrico</label>
                <select 
                  value={manualFeeder}
                  onChange={(e) => setManualFeeder(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 cursor-pointer font-bold"
                >
                  <option value="ALM-PAR-04">ALM-PAR-04</option>
                  <option value="ALM-SCA-02">ALM-SCA-02</option>
                  <option value="ALM-NIQ-01">ALM-NIQ-01</option>
                  <option value="ALM-LON-02">ALM-LON-02</option>
                  <option value="ALM-CAU-08">ALM-CAU-08</option>
                </select>
              </div>

              {/* Message Details */}
              <div className="flex flex-col space-y-0.5 col-span-2 md:col-span-3">
                <label className="text-[9px] text-slate-400 uppercase tracking-widest block font-extrabold">Novedades Recibidas / Daño Inicial</label>
                <input 
                  type="text"
                  value={manualDetail}
                  onChange={(e) => setManualDetail(e.target.value)}
                  required
                  placeholder="Escriba el reporte. Ej: Camioneta municipal reporta rama pesada tocando línea de baja tensión..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600 normal-case text-slate-800 font-semibold"
                />
              </div>

              {/* Saving manual node trigger button */}
              <div className="flex flex-col justify-end col-span-2 md:col-span-1">
                <button
                  type="submit"
                  disabled={isManualRecording}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-3 rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5 h-[34px] shadow-sm uppercase font-mono"
                >
                  {isManualRecording ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Registrar</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {manualSuccessMsg && (
              <div className="bg-blue-50 border border-blue-200 text-blue-900 p-2.5 rounded-lg text-[11px] font-bold font-sans flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{manualSuccessMsg}</span>
              </div>
            )}
          </div>

        </div>

        {/* Right column spans 1 - Table with load metrics & validator */}
        <div className="space-y-6">
          
          {/* Section 3: WAMP DB Health, Table Row Metrics & Validation Trigger */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 font-bold text-xs uppercase">
            <h3 className="text-xs font-black text-slate-400 tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5 leading-none">
              <Database className="w-5 h-5 text-blue-700" />
              Consolidación SQL Interna
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] space-y-2 text-slate-705 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-450 normal-case text-slate-500">Última validación estructural:</span>
                <span className="font-mono text-slate-900">{validationTime.split(' ')[1]} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450 normal-case text-slate-500">Registros en MariaDB:</span>
                <span className="font-mono text-slate-900">1,219 Filas</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5">
                <span className="text-slate-405 normal-case text-slate-500">Host Base de Datos:</span>
                <span className="text-slate-805 font-mono">localhost:3306</span>
              </div>
            </div>

            <button
              onClick={handleRunDbValidation}
              disabled={isValidating}
              className="w-full bg-slate-900 hover:bg-slate-805 hover:bg-slate-850 text-white font-extrabold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {isValidating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Validando integridad (PHP)...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                  <span>Validar Registros Cargados</span>
                </>
              )}
            </button>

            {validationCompleted && (
              <div className="bg-emerald-50 text-emerald-900 border border-emerald-100 p-2.5 rounded-lg text-[10px] normal-case leading-relaxed font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Base de datos consolidadas. Se corrió el script de auditoría sql_validate.php de manera satisfactoria.</span>
              </div>
            )}
          </div>

          {/* Section 4: Load Errors / SQL warnings logs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                Errores de Carga Recientes
              </h3>
              <span className="bg-rose-100 text-rose-700 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {loadErrors.length}
              </span>
            </div>

            {loadErrors.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {loadErrors.map((err) => (
                  <div key={err.id} className="bg-rose-50/60 border border-rose-100 p-2.5 rounded-xl text-[10px] font-semibold text-rose-955 space-y-1 relative select-none">
                    <div className="flex justify-between text-[9px] font-extrabold uppercase text-rose-800">
                      <span>{err.source} [Fila: {err.line}]</span>
                      <button 
                        onClick={() => deleteErrorNode(err.id)}
                        className="text-slate-400 hover:text-rose-600 font-extrabold cursor-pointer"
                        title="Omitir o Resolver error"
                      >
                        <Trash2 className="w-3 h-3 shrink-0" />
                      </button>
                    </div>
                    <p className="normal-case leading-relaxed text-slate-700">{err.detail}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                <p className="text-xs text-slate-400 font-bold">¡Carga Impecable!</p>
                <p className="text-[10px] text-slate-400/80 lowercase italic font-semibold">Cero anomalías SQL de ingestión registradas en la cola.</p>
              </div>
            )}
          </div>

          {/* Section 5: Standard Operational Limits (SCADA Boundary warning) */}
          <div className="bg-slate-900 border border-slate-800 text-slate-305 text-slate-400 rounded-2xl p-4 space-y-3 font-bold text-xs">
            <h3 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5 leading-none">
              <Cpu className="w-5 h-5 text-rose-500" />
              Linderos Remotos Eléctricos
            </h3>
            <p className="normal-case text-[11px] font-semibold text-slate-350 text-slate-300 leading-normal">
              Esta herramienta actúa como un indexador PHP pasivo sobre base MariaDB local. No conecta controladores bidireccionales con relés primarios de red ni consolas de despacho en vivo, respetando los estándares de seguridad física de Luzparral.
            </p>
          </div>

        </div>

      </div>

      {/* Embedded statistics layout: Summary of load records and processed counters per source */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
          Resumen General de Registros Procesados por Fuente (MySQL DB Table Stats)
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {dataSources.map((ds, index) => {
            return (
              <div key={index} className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-1.5 font-bold text-xs uppercase">
                <span className="text-slate-400 text-[8.5px] uppercase tracking-widest block truncate">{ds.source}</span>
                <span className="text-lg font-mono font-black text-slate-800 block leading-none">{ds.recordsLoaded}</span>
                <span className="text-[9.5px] text-slate-500 font-semibold lowercase block leading-normal first-letter:uppercase truncate">
                  Última carga: {ds.lastUpdate.split(' ')[1] || 'S/H'} hrs
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black text-center border mt-1.5 inline-block ${
                  ds.status === 'actualizado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  ds.status === 'pendiente' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  ds.status === 'con errores' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {ds.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
