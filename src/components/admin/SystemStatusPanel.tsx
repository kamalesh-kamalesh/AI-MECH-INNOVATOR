import React from 'react';
import { SystemServiceStatus } from '../../types';
import { playClickSound } from '../../utils/audio';
import { Server, Database, Sparkles, Cpu, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SystemStatusPanelProps {
  status: SystemServiceStatus;
  onToggleService: (serviceKey: keyof SystemServiceStatus) => void;
}

export const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({
  status,
  onToggleService,
}) => {
  const services: { key: keyof SystemServiceStatus; name: string; icon: React.ReactNode }[] = [
    { key: 'gameServer', name: 'Game Server', icon: <Server className="w-4 h-4" /> },
    { key: 'database', name: 'Database', icon: <Database className="w-4 h-4" /> },
    { key: 'aiApi', name: 'AI API (NVIDIA/Gemini)', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'simulationEngine', name: 'Simulation Engine', icon: <Cpu className="w-4 h-4" /> },
    { key: 'timerService', name: 'Timer Service', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            SYSTEM STATUS & HEALTH
          </h3>
        </div>
        <span className="text-[10px] text-slate-400">Click toggle to simulate outage</span>
      </div>

      {!status.aiApi && (
        <div className="bg-red-950/80 border-2 border-red-500/60 p-3 rounded-xl flex items-center justify-between gap-3 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
            <div>
              <span className="font-bold text-xs uppercase block text-red-300">
                ⚠ AI SERVICE UNAVAILABLE
              </span>
              <span className="text-[11px] text-red-200">
                Fallback rules active: Competition & simulations remain fully operational using local rule engine!
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onToggleService('aiApi');
            }}
            className="px-3 py-1 rounded bg-red-800 hover:bg-red-700 text-white font-bold text-xs shrink-0 cursor-pointer"
          >
            RESTORE AI
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {services.map((srv) => {
          const isOnline = status[srv.key];
          return (
            <div
              key={srv.key}
              className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                isOnline
                  ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                  : 'bg-red-950/40 border-red-500/40 text-red-300'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className={isOnline ? 'text-cyan-400' : 'text-red-400'}>{srv.icon}</span>
                <span className="text-xs font-bold truncate">{srv.name}</span>
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  onToggleService(srv.key);
                }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                  isOnline
                    ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-900'
                    : 'bg-red-900 border border-red-500 text-red-100 hover:bg-red-800'
                }`}
                title={`Toggle ${srv.name}`}
              >
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
