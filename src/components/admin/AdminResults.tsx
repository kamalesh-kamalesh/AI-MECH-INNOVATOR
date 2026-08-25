import React, { useState } from 'react';
import { AdminTeam } from '../../types';
import { playClickSound } from '../../utils/audio';
import { Trophy } from 'lucide-react';

interface AdminResultsProps {
  teams: AdminTeam[];
  isLocked: boolean;
  onToggleLock: () => void;
}

export const AdminResults: React.FC<AdminResultsProps> = ({ teams, isLocked, onToggleLock }) => {
  const [showLockConfirm, setShowLockConfirm] = useState(false);

  const sortedTeams = [...teams].sort((a, b) => b.totalScore - a.totalScore);

  const handleExportCSV = () => {
    playClickSound();
    const headers = [
      'Rank',
      'Team ID',
      'Team Name',
      'Robot 1 Score',
      'Robot 2 Score',
      'AI Strategy Score',
      'Optimization Score',
      'Total Score',
      'Status',
    ];

    const rows = sortedTeams.map((t, idx) => [
      idx + 1,
      `"${t.id}"`,
      `"${t.name}"`,
      t.robot1.totalScore,
      t.robot2.totalScore,
      t.aiStrategyScore,
      t.optimizationScore,
      t.totalScore,
      `"${t.status}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AI_Mech_Innovator_Results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-mono max-w-4xl">
      {/* Header & Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            FINAL RESULTS
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Official competition final scores ledger
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-colors cursor-pointer"
          >
            EXPORT CSV
          </button>

          {!showLockConfirm ? (
            <button
              onClick={() => setShowLockConfirm(true)}
              className={`px-4 py-2 rounded text-xs font-bold transition-colors cursor-pointer border ${
                isLocked
                  ? 'bg-red-950 text-red-300 border-red-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              {isLocked ? 'FINAL RESULTS LOCKED' : 'LOCK FINAL RESULTS'}
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-red-950 p-1.5 rounded border border-red-500/50 text-xs">
              <span className="text-red-200 font-bold">
                {isLocked ? 'Unlock?' : 'Lock results permanently?'}
              </span>
              <button
                onClick={() => {
                  playClickSound();
                  onToggleLock();
                  setShowLockConfirm(false);
                }}
                className="px-3 py-1 bg-red-600 text-white font-bold rounded cursor-pointer"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowLockConfirm(false)}
                className="px-3 py-1 bg-slate-800 text-slate-300 font-bold rounded cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Clean Final Results Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4 text-right">Total Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {sortedTeams.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2 py-6">
                      <Trophy className="w-10 h-10 text-slate-600 mb-1 stroke-[1.5]" />
                      <p className="text-sm font-bold text-slate-200 tracking-wider uppercase">NO TEAMS REGISTERED</p>
                      <p className="text-xs text-slate-500 font-sans">Teams will appear here once participants join the competition.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedTeams.map((team, idx) => (
                <tr key={team.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-100">
                    <div className="flex items-center gap-2">
                      <span>{team.avatar}</span>
                      <span>{team.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-cyan-400 text-base">
                    {team.totalScore}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
