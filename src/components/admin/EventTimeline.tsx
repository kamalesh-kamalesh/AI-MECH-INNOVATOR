import React from 'react';
import { AdminTeam, CompetitionStage } from '../../types';
import { CheckCircle2, PlayCircle, Users } from 'lucide-react';

interface EventTimelineProps {
  teams: AdminTeam[];
}

interface StageStep {
  id: CompetitionStage;
  label: string;
}

const STAGES: StageStep[] = [
  { id: 'LOGIN', label: 'LOGIN' },
  { id: 'MISSION_BRIEFING', label: 'BRIEFING' },
  { id: 'ROBOT1_BUILD', label: 'ROBOT 1 BUILD' },
  { id: 'ROBOT1_TEST', label: 'TEST 1' },
  { id: 'ROBOT2_BUILD', label: 'ROBOT 2 BUILD' },
  { id: 'ROBOT2_TEST', label: 'TEST 2' },
  { id: 'OPTIMIZATION', label: 'OPTIMIZATION' },
  { id: 'FINAL_SUBMISSION', label: 'SUBMISSION' },
  { id: 'RESULTS', label: 'RESULTS' },
];

export const EventTimeline: React.FC<EventTimelineProps> = ({ teams }) => {
  // Calculate count per stage
  const countsPerStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = teams.filter((t) => t.currentStage === stage.id).length;
    return acc;
  }, {} as Record<CompetitionStage, number>);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Event Progress Timeline & Stage Distribution
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>{teams.length} Teams Enrolled</span>
        </div>
      </div>

      {/* Flowchart Timeline */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 overflow-x-auto pb-1">
        {STAGES.map((step, idx) => {
          const count = countsPerStage[step.id] || 0;
          const hasTeams = count > 0;

          return (
            <div
              key={step.id}
              className={`relative flex flex-col items-center justify-between p-2.5 rounded-xl border transition-all ${
                hasTeams
                  ? 'bg-cyan-950/60 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-950/70 border-slate-800 opacity-70'
              }`}
            >
              <span className="text-[10px] text-slate-500 font-mono">STAGE 0{idx + 1}</span>
              
              <span
                className={`text-[11px] font-bold text-center uppercase my-1 leading-tight ${
                  hasTeams ? 'text-cyan-300' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>

              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  hasTeams
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                {hasTeams && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                <span>{count} {count === 1 ? 'Team' : 'Teams'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
