import React, { useState } from 'react';
import { AdminTeam } from '../../types';
import { playClickSound } from '../../utils/audio';

interface AdminScoreboardProps {
  teams: AdminTeam[];
  scoresVisibleToPlayers: boolean;
  onToggleScoresVisibility: () => void;
  onSelectTeam: (team: AdminTeam) => void;
}

type SortField = 'rank' | 'name' | 'totalScore';

export const AdminScoreboard: React.FC<AdminScoreboardProps> = ({
  teams,
  scoresVisibleToPlayers,
  onToggleScoresVisibility,
  onSelectTeam,
}) => {
  const [sortBy, setSortBy] = useState<SortField>('rank');
  const [sortAsc, setSortAsc] = useState(true);

  // Compute ranks first based on totalScore descending
  const teamsWithRank = [...teams]
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((t, idx) => ({ ...t, rank: idx + 1 }));

  const sortedTeams = [...teamsWithRank].sort((a, b) => {
    let comp = 0;
    if (sortBy === 'rank') comp = a.rank - b.rank;
    else if (sortBy === 'name') comp = a.name.localeCompare(b.name);
    else if (sortBy === 'totalScore') comp = b.totalScore - a.totalScore;
    return sortAsc ? comp : -comp;
  });

  const handleSort = (field: SortField) => {
    playClickSound();
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6 font-mono max-w-5xl">
      {/* Top Banner & Public Scoreboard Toggle */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            LIVE SCOREBOARD
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Admin competition control ranking view
          </p>
        </div>

        {/* Small Toggle */}
        <button
          onClick={() => {
            playClickSound();
            onToggleScoresVisibility();
          }}
          className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer border ${
            scoresVisibleToPlayers
              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          Public Scoreboard: <span className={scoresVisibleToPlayers ? 'text-emerald-400 font-bold' : 'text-slate-400 font-bold'}>{scoresVisibleToPlayers ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Clean Ranking Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th
                  onClick={() => handleSort('rank')}
                  className="py-3 px-4 w-16 text-center cursor-pointer hover:text-slate-200"
                >
                  Rank {sortBy === 'rank' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-200"
                >
                  Team {sortBy === 'name' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th className="py-3 px-4 text-center">Robot 1</th>
                <th className="py-3 px-4 text-center">Robot 2</th>
                <th className="py-3 px-4 text-center">AI</th>
                <th className="py-3 px-4 text-center">Opt.</th>
                <th
                  onClick={() => handleSort('totalScore')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-200"
                >
                  Total {sortBy === 'totalScore' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {sortedTeams.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs font-mono">
                    No team scores recorded yet.
                  </td>
                </tr>
              ) : (
                sortedTeams.map((team) => (
                <tr key={team.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                    {team.rank}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-100">
                    <div className="flex items-center gap-2">
                      <span>{team.avatar}</span>
                      <span>{team.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center text-slate-300">
                    {team.robot1.totalScore}
                  </td>

                  <td className="py-3.5 px-4 text-center text-slate-300">
                    {team.robot2.totalScore}
                  </td>

                  <td className="py-3.5 px-4 text-center text-slate-300">
                    {team.aiStrategyScore}
                  </td>

                  <td className="py-3.5 px-4 text-center text-slate-300">
                    {team.optimizationScore}
                  </td>

                  <td className="py-3.5 px-4 text-right font-black text-base text-cyan-400">
                    {team.totalScore}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => {
                        playClickSound();
                        onSelectTeam(team);
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                      View
                    </button>
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
