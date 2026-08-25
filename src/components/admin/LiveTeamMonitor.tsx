import React, { useState } from 'react';
import { AdminTeam, TeamStatus } from '../../types';
import { playClickSound } from '../../utils/audio';
import { Search, Users } from 'lucide-react';

interface LiveTeamMonitorProps {
  teams: AdminTeam[];
  onSelectTeam: (team: AdminTeam) => void;
  onPauseTeam: (teamId: string) => void;
  onResumeTeam: (teamId: string) => void;
  onResetTeam: (teamId: string) => void;
}

export const LiveTeamMonitor: React.FC<LiveTeamMonitorProps> = ({
  teams,
  onSelectTeam,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TeamStatus | 'ALL'>('ALL');

  const filteredTeams = teams.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.members.some((m) => m.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: TeamStatus, isDisqualified?: boolean) => {
    if (isDisqualified) {
      return (
        <span className="bg-red-950 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
          DISQUALIFIED
        </span>
      );
    }
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            ACTIVE
          </span>
        );
      case 'TESTING':
        return (
          <span className="bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            TESTING
          </span>
        );
      case 'PAUSED':
        return (
          <span className="bg-amber-950 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            PAUSED
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="bg-purple-950 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            COMPLETED
          </span>
        );
      case 'DISCONNECTED':
        return (
          <span className="bg-red-950/60 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            DISCONNECTED
          </span>
        );
      default:
        return (
          <span className="bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            WAITING
          </span>
        );
    }
  };

  const getRobotCode = (team: AdminTeam) => {
    if (team.robot2.isComplete || team.currentStage.includes('ROBOT2')) return 'R2';
    return 'R1';
  };

  const getStageLabel = (stage: string) => {
    if (stage.includes('BUILD')) return 'Building';
    if (stage.includes('TEST')) return 'Testing';
    if (stage.includes('OPTIMIZ')) return 'Optimizing';
    if (stage === 'RESULTS') return 'Completed';
    return 'Briefing';
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Top Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teams..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-cyan-500"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1">
          {(['ALL', 'ACTIVE', 'WAITING', 'PAUSED', 'TESTING', 'COMPLETED', 'DISCONNECTED'] as const).map(
            (st) => {
              const isActive = statusFilter === st;
              return (
                <button
                  key={st}
                  onClick={() => {
                    playClickSound();
                    setStatusFilter(st);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Main Clean Admin Teams Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Robot</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4 text-right">AI</th>
                <th className="py-3 px-4 text-right">Time</th>
                <th className="py-3 px-4 text-right">Score</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2 py-6">
                      <Users className="w-10 h-10 text-slate-600 mb-1 stroke-[1.5]" />
                      <p className="text-sm font-bold text-slate-200 tracking-wider uppercase">
                        {teams.length === 0 ? 'NO TEAMS REGISTERED' : 'NO MATCHING TEAMS'}
                      </p>
                      <p className="text-xs text-slate-500 font-sans">
                        {teams.length === 0
                          ? 'Teams will appear here once participants join the competition.'
                          : 'Try searching with a different keyword or clearing filters.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{team.avatar}</span>
                        <div>
                          <span className="font-bold text-slate-100 block">{team.name}</span>
                          <span className="text-[10px] text-slate-500">{team.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {getStatusBadge(team.status, team.isDisqualified)}
                    </td>

                    <td className="py-3 px-4">
                      <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[11px] font-bold text-cyan-300">
                        {getRobotCode(team)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-300 font-medium">
                      {getStageLabel(team.currentStage)}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-slate-300">
                      {team.aiCreditsUsed}/5
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-amber-300 font-bold">
                      {formatTime(team.timeRemainingSeconds)}
                    </td>

                    <td className="py-3 px-4 text-right font-black text-cyan-400 text-sm">
                      {team.totalScore}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          playClickSound();
                          onSelectTeam(team);
                        }}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-bold transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
