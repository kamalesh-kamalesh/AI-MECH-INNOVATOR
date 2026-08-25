import React from 'react';
import { AdminTeam, SystemServiceStatus } from '../../types';

interface AdminOverviewProps {
  teams: AdminTeam[];
  systemStatus: SystemServiceStatus;
  currentRoundName: string;
  roundStatus: string;
  remainingTimeSeconds: number;
  onToggleService: (serviceKey: keyof SystemServiceStatus) => void;
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  teams,
  currentRoundName,
}) => {
  const totalTeams = teams.length;
  const activeTeams = teams.filter((t) => t.status === 'ACTIVE' || t.status === 'TESTING').length;
  const completedTeams = teams.filter((t) => t.status === 'COMPLETED').length;

  // Stage counts derived from teams
  const buildingCount = teams.filter((t) => t.currentStage.includes('BUILD')).length;
  const testingCount = teams.filter((t) => t.currentStage.includes('TEST') || t.status === 'TESTING').length;
  const optimizingCount = teams.filter((t) => t.currentStage.includes('OPTIMIZ')).length;
  const doneCount = teams.filter((t) => t.currentStage === 'RESULTS' || t.status === 'COMPLETED').length;

  const stages = [
    { label: 'LOGIN', key: 'LOGIN' },
    { label: 'BRIEFING', key: 'BRIEFING' },
    { label: 'ROBOT 1', key: 'ROBOT1' },
    { label: 'TEST 1', key: 'TEST1', active: true },
    { label: 'ROBOT 2', key: 'ROBOT2' },
    { label: 'TEST 2', key: 'TEST2' },
    { label: 'OPTIMIZE', key: 'OPTIMIZE' },
    { label: 'SUBMIT', key: 'SUBMIT' },
  ];

  const recentActivities = [
    { time: '09:42', text: 'Team Cyber Snafu started Robot 1 testing' },
    { time: '09:40', text: 'Team MechaCore completed Robot 1' },
    { time: '09:39', text: 'Team RoboX used AI consultation' },
    { time: '09:37', text: 'Team Titan entered Robot 2' },
    { time: '09:35', text: 'Team Nova joined the challenge' },
  ];

  return (
    <div className="space-y-8 font-mono max-w-5xl">
      {/* Top Title & 4 Summary Values */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100 uppercase tracking-wide">
            AI MECH INNOVATOR
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase mt-0.5">
            ADMIN CONTROL
          </p>
        </div>

        {/* 4 Summary Values in Simple Typography */}
        <div className="flex flex-wrap items-center gap-8 text-sm pt-2 border-t border-slate-800">
          <div>
            <span className="text-slate-400 text-xs block uppercase">Total</span>
            <span className="text-slate-100 font-bold text-base">{totalTeams} Teams</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-slate-400 text-xs block uppercase">Active</span>
            <span className="text-emerald-400 font-bold text-base">{activeTeams} Active</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-slate-400 text-xs block uppercase">Completed</span>
            <span className="text-cyan-400 font-bold text-base">{completedTeams} Completed</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-slate-400 text-xs block uppercase">Round</span>
            <span className="text-amber-400 font-bold text-base">{currentRoundName.split(' ')[0] || 'Round 1'}</span>
          </div>
        </div>
      </div>

      {/* Current Stage Horizontal Progress Indicator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Current Stage Progress
          </span>
          <span className="text-xs font-bold text-cyan-400">
            Current Stage: Robot 1 — Testing
          </span>
        </div>

        {/* Horizontal Flow Line */}
        <div className="space-y-2 py-2">
          <div className="flex items-center justify-between overflow-x-auto pb-2 text-[11px] font-bold text-slate-400 gap-2">
            {stages.map((st, idx) => (
              <React.Fragment key={st.key}>
                <span className={st.active ? 'text-cyan-400 font-extrabold' : 'text-slate-400'}>
                  {st.label}
                </span>
                {idx < stages.length - 1 && <span className="text-slate-700">→</span>}
              </React.Fragment>
            ))}
          </div>

          <div className="flex justify-between px-2 text-cyan-400 text-xs">
            {stages.map((st) => (
              <span key={st.key} className="w-8 text-center">
                {st.active ? '●' : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Stage breakdown numbers */}
        <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-800 text-xs text-slate-400">
          <span><strong className="text-slate-200">{buildingCount || 7}</strong> Building</span>
          <span>•</span>
          <span><strong className="text-cyan-400">{testingCount || 2}</strong> Testing</span>
          <span>•</span>
          <span><strong className="text-amber-400">{optimizingCount || 1}</strong> Optimizing</span>
          <span>•</span>
          <span><strong className="text-emerald-400">{doneCount || 2}</strong> Completed</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3">
          Recent Activity
        </h3>

        <div className="space-y-2.5 text-xs text-slate-300">
          {recentActivities.map((act, i) => (
            <div key={i} className="flex items-center gap-4 py-1.5 border-b border-slate-800/40 last:border-none">
              <span className="text-slate-500 font-bold shrink-0">{act.time}</span>
              <span className="text-slate-200">{act.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
