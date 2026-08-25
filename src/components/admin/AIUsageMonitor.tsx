import React from 'react';
import { AdminTeam } from '../../types';
import { Sparkles, Brain, Cpu, ShieldCheck } from 'lucide-react';

interface AIUsageMonitorProps {
  teams: AdminTeam[];
}

export const AIUsageMonitor: React.FC<AIUsageMonitorProps> = ({ teams }) => {
  const totalQueries = teams.reduce((acc, t) => acc + t.aiQuestionsAsked, 0);
  const totalCreditsUsed = teams.reduce((acc, t) => acc + t.aiCreditsUsed, 0);
  const maxCreditsTotal = teams.length * 5;

  return (
    <div className="space-y-6 font-mono">
      {/* Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase block flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            TOTAL AI QUERIES
          </span>
          <div className="text-3xl font-black text-purple-400">{totalQueries}</div>
          <span className="text-[11px] text-slate-400 block">Queries executed by all teams</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase block flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
            TOTAL CREDITS USED
          </span>
          <div className="text-3xl font-black text-cyan-400">
            {totalCreditsUsed} <span className="text-sm font-normal text-slate-500">/ {maxCreditsTotal}</span>
          </div>
          <span className="text-[11px] text-slate-400 block">Allocated 5 credits per team</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase block flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            AI ADVISOR ENGINE
          </span>
          <div className="text-sm font-bold text-emerald-400">NVIDIA Nemotron 3.5 / Gemini 3.6</div>
          <span className="text-[11px] text-slate-400 block">Isolated per-team engineering context</span>
        </div>
      </div>

      {/* Team AI Usage Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              TEAM AI CONSULTATION TELEMETRY
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">Admin Only View • Private to players</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Team Name</th>
                <th className="py-2.5 px-3">Team ID</th>
                <th className="py-2.5 px-3 text-right">Used</th>
                <th className="py-2.5 px-3 text-right">Remaining</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">AI Strategy Score</th>
                <th className="py-2.5 px-3">Latest Query Topic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {teams.map((team) => (
                <tr key={team.id} className="hover:bg-slate-950/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-100 flex items-center gap-2">
                    <span>{team.avatar}</span>
                    <span>{team.name}</span>
                  </td>
                  <td className="py-3 px-3 text-cyan-400 font-bold">{team.id}</td>
                  <td className="py-3 px-3 text-right font-bold text-purple-300">
                    {team.aiCreditsUsed} / 5
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-cyan-300">
                    {team.aiCreditsRemaining}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        team.status === 'ACTIVE'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {team.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-amber-300">{team.aiStrategyScore} / 10</td>
                  <td className="py-3 px-3 text-slate-400 truncate max-w-xs text-[11px]">
                    {team.aiHistorySummary[team.aiHistorySummary.length - 1] || 'No queries yet'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
