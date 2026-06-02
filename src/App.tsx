/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from './components/Header';
import PanelGeneral from './components/PanelGeneral';
import MapaContingencias from './components/MapaContingencias';
import DetalleContingencia from './components/DetalleContingencia';
import Comunas from './components/Comunas';
import ClientesCríticos from './components/ClientesCriticos';
import Electrodependientes from './components/Electrodependientes';
import ReportesTerreno from './components/ReportesTerreno';
import ReportesCierre from './components/ReportesCierre';
import FuentesDatos from './components/FuentesDatos';

// Types & Data
import { Contingency, ComunaStats, FieldReport, TimelineEvent } from './types';
import { 
  INITIAL_CONTINGENCIES, 
  INITIAL_COMUNA_STATS, 
  INITIAL_CRITICAL_CLIENTS, 
  INITIAL_ELECTRODEPENDENTS, 
  INITIAL_FIELD_REPORTS, 
  INITIAL_DATA_SOURCES 
} from './data';

import { 
  LayoutDashboard, Map, FileCode, Users, HeartPulse, ClipboardCheck, FileText, Database, ShieldAlert, Cpu, Clock 
} from 'lucide-react';

export default function App() {
  // Main centralized state engine
  const [activeTab, setActiveTab] = useState<string>('Panel General');
  const [selectedContingencyId, setSelectedContingencyId] = useState<string>('CTG-2026-001');

  const [contingencies, setContingencies] = useState<Contingency[]>(INITIAL_CONTINGENCIES);
  const [comunaStats, setComunaStats] = useState<ComunaStats[]>(INITIAL_COMUNA_STATS);
  const [criticalClients, setCriticalClients] = useState(INITIAL_CRITICAL_CLIENTS);
  const [electrodependents, setElectrodependents] = useState(INITIAL_ELECTRODEPENDENTS);
  const [fieldReports, setFieldReports] = useState<FieldReport[]>(INITIAL_FIELD_REPORTS);
  const [dataSources, setDataSources] = useState(INITIAL_DATA_SOURCES);

  // Status state (Shows updated or warning)
  const isDataUpdated = contingencies.filter(c => c.status === 'Confirmada' || c.status === 'Asignada').length === 0;
  const dataStatusState = isDataUpdated ? 'updated' : 'pending';

  // Calculate critical active warnings
  const activeAlertsCount = contingencies.filter(c => c.status !== 'Repuesta / cerrada' && (c.criticalAffected > 0 || c.electrodependentAffected > 0)).length;

  // Handlers
  const handleSelectContingency = (id: string) => {
    setSelectedContingencyId(id);
    setActiveTab('Detalle de Falla');
  };

  const handleNavigateToMapForIncident = (id: string) => {
    setSelectedContingencyId(id);
    setActiveTab('Mapa de Contingencias');
  };

  // State Updates: 1. Update status of a contingency
  const handleUpdateContingencyStatus = (id: string, newStatus: Contingency['status'], notes: string) => {
    setContingencies(prev => {
      return prev.map(c => {
        if (c.id === id) {
          const timestamp = new Date().toTimeString().split(' ')[0];
          
          // If moving to closed, let's restore clients
          let restored = c.clientsRestored;
          if (newStatus === 'Repuesta / cerrada') {
            restored = c.clientsAffected;
          }

          const updatedTimeline: TimelineEvent[] = [
            ...c.timeline,
            {
              time: timestamp,
              status: newStatus,
              description: notes,
              source: 'CIOP Central / Manual',
              responsible: 'Claudio Martínez (Jefe de Despacho)'
            }
          ];

          return {
            ...c,
            status: newStatus,
            clientsRestored: restored,
            timeline: updatedTimeline
          };
        }
        return c;
      });
    });

    // Side effect: update comuna stats and client statuses as well!
    if (newStatus === 'Repuesta / cerrada') {
      const target = contingencies.find(c => c.id === id);
      if (target) {
        // Restore comuna stats
        setComunaStats(prev => {
          return prev.map(cm => {
            if (cm.name === target.comuna) {
              return {
                ...cm,
                clientsAffected: Math.max(0, cm.clientsAffected - target.clientsAffected),
                clientsRestored: cm.clientsRestored + target.clientsAffected,
                criticalAffected: Math.max(0, cm.criticalAffected - target.criticalAffected),
                electrodependentAffected: Math.max(0, cm.electrodependentAffected - target.electrodependentAffected),
                activeContingencies: Math.max(0, cm.activeContingencies - 1)
              };
            }
            return cm;
          });
        });

        // Normalize critical clients
        setCriticalClients(prev => {
          return prev.map(cl => {
            if (cl.contingencyId === id) {
              return { ...cl, status: 'Suministro normal' };
            }
            return cl;
          });
        });

        // Normalize electrodependents
        setElectrodependents(prev => {
          return prev.map(ed => {
            if (ed.contingencyId === id) {
              return { ...ed, status: 'Suministro normal', hoursWithoutSupply: 0 };
            }
            return ed;
          });
        });
      }
    }
  };

  // State Updates: 2. Add Timeline event
  const handleAddTimelineEvent = (id: string, newEvent: TimelineEvent) => {
    setContingencies(prev => {
      return prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            timeline: [...c.timeline, newEvent]
          };
        }
        return c;
      });
    });
  };

  // State Updates: 3. Add Terrain Report
  const handleAddNewReport = (report: FieldReport) => {
    setFieldReports(prev => [report, ...prev]);

    // Side effect: If associated with a contingency, append to its timeline!
    if (report.contingencyId && report.contingencyId !== 'NINGUNA') {
      const timeOnly = report.date.split(' ')[1] || 'Ahora';
      const event: TimelineEvent = {
        time: timeOnly,
        status: report.status === 'Reparación finalizada' ? 'En reparación' : 'Confirmada',
        description: `Nuevo reporte técnico '${report.id}' por ${report.reporter}: ${report.damageType} - ${report.description}`,
        source: 'Reporte de terreno',
        responsible: report.reporter
      };
      handleAddTimelineEvent(report.contingencyId, event);
    }
  };

  // State Updates: 4. Reload logs simulation
  const handleTriggerSync = () => {
    const timeNowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setDataSources(prev => {
      return prev.map(ds => ({
        ...ds,
        lastUpdate: timeNowStr,
        status: ds.status === 'con errores' || ds.status === 'pendiente' ? 'actualizado' : ds.status
      }));
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800" id="luzparral-ciop-root">
      
      {/* Universal Header */}
      <Header 
        alertsCount={activeAlertsCount}
        status={dataStatusState}
        onNavigateToSources={() => setActiveTab('Fuentes de Datos')}
        onNavigateToAlerts={() => {
          // Point to critical list as default alerts view
          setActiveTab('Clientes Críticos');
        }}
      />

      <div className="flex-1 flex flex-col lg:flex-row relative">
        
        {/* Navigation Lateral Sidebar */}
        <aside className="lg:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 select-none shrink-0" id="ciop-sidebar">
          
          {/* Tabs Menu List */}
          <div className="p-4 space-y-1.5 flex-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block px-3 mb-2">
              Secciones Dashboard
            </span>

            <nav className="space-y-1" id="ciop-nav-menu">
              {/* Tab 1: Panel General */}
              <button
                onClick={() => setActiveTab('Panel General')}
                className={`w-full py-2.5 px-3 rounded text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'Panel General' 
                    ? 'bg-blue-600 text-white font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Panel General</span>
                </div>
              </button>

              {/* Tab 2: Mapa */}
              <button
                onClick={() => setActiveTab('Mapa de Contingencias')}
                className={`w-full py-2.5 px-3 rounded text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'Mapa de Contingencias' 
                    ? 'bg-blue-600 text-white font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Map className="w-4 h-4 shrink-0" />
                  <span>Mapa de Contingencias</span>
                </div>
              </button>

              {/* Tab 3: Comunas */}
              <button
                onClick={() => setActiveTab('Comunas')}
                className={`w-full py-2.5 px-3 rounded text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'Comunas' 
                    ? 'bg-blue-600 text-white font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 shrink-0" />
                  <span>Análisis Comunas</span>
                </div>
              </button>

              {/* Tab 4: Clientes Críticos */}
              <button
                onClick={() => setActiveTab('Clientes Críticos')}
                className={`w-full py-2.5 px-3 rounded text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'Clientes Críticos' 
                    ? 'bg-blue-600 text-white font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Clientes Críticos</span>
                </div>
                {criticalClients.filter(c => c.status === 'Sin suministro').length > 0 && (
                  <span className="bg-rose-500/20 text-rose-300 font-bold px-1.5 py-0.5 text-[9px] rounded-full">
                    {criticalClients.filter(c => c.status === 'Sin suministro').length}
                  </span>
                )}
              </button>

              {/* Tab 5: Electrodependientes */}
              <button
                onClick={() => setActiveTab('Electrodependientes')}
                className={`w-full py-2.5 px-3 rounded text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'Electrodependientes' 
                    ? 'bg-blue-600 text-white font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <HeartPulse className="w-4 h-4 shrink-0" />
                  <span>Electrodependientes</span>
                </div>
                {electrodependents.filter(e => e.status === 'Sin suministro').length > 0 && (
                  <span className="bg-rose-600 text-white font-black px-1.5 py-0.5 text-[9px] rounded-full animate-pulse">
                    {electrodependents.filter(e => e.status === 'Sin suministro').length}
                  </span>
                )}
              </button>

              {/* Tab 6: Reportes de Terreno */}
              <button
                onClick={() => setActiveTab('Reportes de Terreno')}
                className={`w-full py-2.5 px-3 rounded text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'Reportes de Terreno' 
                    ? 'bg-blue-600 text-white font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ClipboardCheck className="w-4 h-4 shrink-0" />
                  <span>Reportes de Terreno</span>
                </div>
              </button>

              {/* Tab 7: Reportes de Cierre */}
              <button
                onClick={() => setActiveTab('Reportes de Cierre')}
                className={`w-full py-2.5 px-3 rounded text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'Reportes de Cierre' 
                    ? 'bg-blue-600 text-white font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Reportes de Cierre</span>
                </div>
              </button>

              {/* Tab 8: Fuentes de Datos */}
              <button
                onClick={() => setActiveTab('Fuentes de Datos')}
                className={`w-full py-2.5 px-3 rounded text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'Fuentes de Datos' 
                    ? 'bg-blue-600 text-white font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 shrink-0" />
                  <span>Fuentes de Datos</span>
                </div>
              </button>

              {/* Secondary Sub-navigation for Falla deep dive details (Screen 3) */}
              <div className="h-px bg-slate-800 my-4" />

              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block px-3 mb-2">
                Ficha de Trabajo Activa
              </span>

              <button
                onClick={() => setActiveTab('Detalle de Falla')}
                className={`w-full py-2.5 px-3 rounded text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'Detalle de Falla' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold shadow-sm' 
                    : 'hover:bg-slate-800/50 bg-slate-950/20 text-slate-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 shrink-0 text-amber-450 text-amber-400" />
                  <span className="truncate">Detalle: {selectedContingencyId}</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Academic Signature Info Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[10px] text-slate-400 font-semibold space-y-1">
            <p className="font-bold uppercase text-slate-300">Anteproyecto de Tesis</p>
            <p>Ingeniería Civil en Informática</p>
            <p className="text-slate-500 font-mono tracking-tight text-[9px] mt-2">© 2026 Plataforma Operacional</p>
          </div>
        </aside>

        {/* Content rendering wrapper panel */}
        <main className="flex-1 p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 65px)' }}>
          {/* Router switch representation based on state */}
          {activeTab === 'Panel General' && (
            <PanelGeneral 
              contingencies={contingencies}
              comunaStats={comunaStats}
              dataSources={dataSources}
              onSelectContingency={handleSelectContingency}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'Mapa de Contingencias' && (
            <MapaContingencias 
              contingencies={contingencies}
              comunaStats={comunaStats}
              criticalClients={criticalClients}
              electrodependents={electrodependents}
              onSelectContingency={handleSelectContingency}
            />
          )}

          {activeTab === 'Detalle de Falla' && (
            <DetalleContingencia
              contingency={contingencies.find(c => c.id === selectedContingencyId)}
              contingencies={contingencies}
              fieldReports={fieldReports}
              onUpdateContingencyStatus={handleUpdateContingencyStatus}
              onAddTimelineEvent={handleAddTimelineEvent}
              onNavigateToMap={handleNavigateToMapForIncident}
            />
          )}

          {activeTab === 'Comunas' && (
            <Comunas comunaStats={comunaStats} />
          )}

          {activeTab === 'Clientes Críticos' && (
            <ClientesCríticos 
              criticalClients={criticalClients}
              onSelectContingencyID={handleSelectContingency}
            />
          )}

          {activeTab === 'Electrodependientes' && (
            <Electrodependientes 
              electrodependents={electrodependents}
              onSelectContingencyID={handleSelectContingency}
            />
          )}

          {activeTab === 'Reportes de Terreno' && (
            <ReportesTerreno 
              contingencies={contingencies}
              onAddNewReport={handleAddNewReport}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'Reportes de Cierre' && (
            <ReportesCierre 
              contingencies={contingencies}
              onCloseContingency={(id) => handleUpdateContingencyStatus(id, 'Repuesta / cerrada', 'Cierre oficial del folio técnico operado manualmente por despacho.')}
            />
          )}

          {activeTab === 'Fuentes de Datos' && (
            <FuentesDatos 
              dataSources={dataSources}
              onTriggerSync={handleTriggerSync}
            />
          )}
        </main>
      </div>

    </div>
  );
}
