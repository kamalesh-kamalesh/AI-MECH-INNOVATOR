import React, { useState } from 'react';
import { Mission, ComponentSelection, GameScore, LeaderboardEntry } from '../types';
import { playClickSound, playTriumphSound } from '../utils/audio';
import { RoundHeader } from './RoundHeader';
import {
  Trophy,
  BarChart3,
  RotateCcw,
  Share2,
  ShieldAlert,
  Users,
  Search,
  Check,
  Sparkles,
  CheckCircle2,
  Award,
  ChevronDown
} from 'lucide-react';

interface ScoringAndLeaderboardProps {
  robot1Mission: Mission;
  robot1Selection: ComponentSelection;
  r1RepairedCheckpointIds: string[];
  r1InitialPassed: number;
  robot2Mission: Mission;
  robot2Selection: ComponentSelection;
  r2RepairedCheckpointIds: string[];
  r2InitialPassed: number;
  wiringMistakes: number;
  aiQuestionsAsked: number;
  optimizationBonus: number;
  teamName: string;
  leaderboard: LeaderboardEntry[];
  scoresVisible: boolean;
  onSubmitScoreToLeaderboard: (scoreData: GameScore, teamName: string) => void;
  onPlayAgain: () => void;
}

export const ScoringAndLeaderboard: React.FC<ScoringAndLeaderboardProps> = ({
  robot1Mission,
  robot1Selection,
  r1RepairedCheckpointIds,
  r1InitialPassed,
  robot2Mission,
  robot2Selection,
  r2RepairedCheckpointIds,
  r2InitialPassed,
  wiringMistakes,
  aiQuestionsAsked,
  optimizationBonus,
  teamName,
  leaderboard,
  scoresVisible,
  onSubmitScoreToLeaderboard,
  onPlayAgain,
}) => {
  const [submittedToLeaderboard, setSubmittedToLeaderboard] = useState(false);
  const [inputTeamName, setInputTeamName] = useState(teamName || 'CyberSnafu');
  const [searchFilter, setSearchFilter] = useState('');
  const [showLeaderboardSection, setShowLeaderboardSection] = useState(true);

  // 1. Calculate Robot 1 Score (Max 40 pts)
  const r1PassedCount = Math.min(4, r1InitialPassed + r1RepairedCheckpointIds.length);
  const r1Score = Math.round((r1PassedCount / 4) * 40);

  // 2. Calculate Robot 2 Score (Max 40 pts)
  const r2PassedCount = Math.min(4, r2InitialPassed + r2RepairedCheckpointIds.length);
  const r2Score = Math.round((r2PassedCount / 4) * 40);

  // 3. AI Usage Strategy (Max 10 pts)
  const aiScore = Math.min(10, Math.max(4, aiQuestionsAsked * 2 + 4));

  // 4. Optimization Score (Max 10 pts)
  const optScore = Math.min(10, Math.max(0, optimizationBonus));

  // Total 100-Point Score
  const totalScore = Math.min(100, r1Score + r2Score + aiScore + optScore);

  // Grade Tier
  const getGrade = (score: number) => {
    if (score >= 90) return { letter: 'S', title: 'Legendary Mech Innovator 🏆', color: 'text-amber-400 border-amber-500 bg-amber-950/40' };
    if (score >= 80) return { letter: 'A', title: 'Senior Systems Engineer ⚙️', color: 'text-cyan-400 border-cyan-500 bg-cyan-950/40' };
    if (score >= 70) return { letter: 'B', title: 'Robotics Specialist 💻', color: 'text-emerald-400 border-emerald-500 bg-emerald-950/40' };
    if (score >= 60) return { letter: 'C', title: 'Junior Technician 🔧', color: 'text-purple-400 border-purple-500 bg-purple-950/40' };
    return { letter: 'D', title: 'Lab Apprentice 🛠️', color: 'text-slate-400 border-slate-600 bg-slate-900/40' };
  };

  const gradeInfo = getGrade(totalScore);

  const scoreData: GameScore = {
    robot1Score: r1Score,
    robot2Score: r2Score,
    aiScore,
    optimizationScore: optScore,
    totalScore,
    grade: gradeInfo.letter as any,
  };

  const handleSaveScore = () => {
    playClickSound();
    playTriumphSound();
    setSubmittedToLeaderboard(true);
    onSubmitScoreToLeaderboard(scoreData, inputTeamName.trim() || 'Team Mech');
  };

  const filteredLeaderboard = leaderboard.filter(
    (e) =>
      e.teamName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      e.missionTitle.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-6">
      {/* 1. Standard Round Header */}
      <RoundHeader currentRound={6} />

      {/* 2. Primary YOUR RESULT Banner & Summary */}
      <div className="bg-slate-900/90 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Result Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>OFFICIAL MISSION RESULT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 font-mono tracking-tight uppercase mt-1">
              YOUR RESULT
            </h2>
            <div className="text-lg font-bold text-amber-300 font-mono mt-1">
              TEAM: {inputTeamName || teamName || 'CyberSnafu'}
            </div>
          </div>

          {/* Big Score Box & Mission Complete Badge */}
          <div className="flex flex-col items-center sm:items-end gap-2">
            <div className="px-6 py-3 bg-slate-950 border-2 border-amber-400 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)] text-center">
              <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono block leading-none">
                {totalScore}
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block mt-1">
                OUT OF 100 PTS
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 font-mono text-xs font-black uppercase tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Mission Complete ✓</span>
            </div>
          </div>
        </div>

        {/* Grade Title & Detailed Subscores */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Grade Badge Card (4 cols) */}
          <div className={`md:col-span-4 border-2 rounded-2xl p-6 text-center space-y-3 ${gradeInfo.color}`}>
            <div className="text-[10px] font-mono uppercase tracking-widest font-bold opacity-80">
              TELEMETRY GRADE
            </div>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-950/80 border-2 border-current shadow-[0_0_20px_currentColor]">
              <span className="text-5xl font-extrabold font-mono">{gradeInfo.letter}</span>
            </div>
            <div className="text-xs font-bold font-mono">{gradeInfo.title}</div>
          </div>

          {/* Subscores Progress Bars (8 cols) */}
          <div className="md:col-span-8 bg-slate-950/80 rounded-2xl border border-slate-800 p-5 space-y-3.5">
            <h4 className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5 border-b border-slate-800 pb-2 font-bold">
              <BarChart3 className="w-4 h-4 text-cyan-400" /> Performance Breakdown
            </h4>

            {/* Robot 1 Build & Test */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-300 font-medium">1. Robot 1 — {robot1Mission.title}</span>
                <span className="text-cyan-400 font-bold">{r1Score} / 40 pts</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${(r1Score / 40) * 100}%` }}
                />
              </div>
            </div>

            {/* Robot 2 Build & Test */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-300 font-medium">2. Robot 2 — {robot2Mission.title}</span>
                <span className="text-amber-400 font-bold">{r2Score} / 40 pts</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${(r2Score / 40) * 100}%` }}
                />
              </div>
            </div>

            {/* AI Consultation Strategy */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-300 font-medium">3. AI Engineering Consultation</span>
                <span className="text-purple-400 font-bold">{aiScore} / 10 pts</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-purple-400 transition-all duration-500"
                  style={{ width: `${(aiScore / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Final Optimization */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-300 font-medium">4. Mass & Cost Trade-off Optimization</span>
                <span className="text-emerald-400 font-bold">{optScore} / 10 pts</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${(optScore / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {!submittedToLeaderboard ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
              <input
                type="text"
                value={inputTeamName}
                onChange={(e) => setInputTeamName(e.target.value)}
                placeholder="Team Name"
                className="w-full sm:w-60 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-xs font-mono text-slate-100 outline-none"
              />
              <button
                onClick={handleSaveScore}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
              >
                <Share2 className="w-4 h-4 shrink-0" />
                PUBLISH SCORE TO EVENT
              </button>
            </div>
          ) : (
            <div className="px-4 py-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 font-mono text-xs text-center flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" /> Score Broadcasted to Event Host!
            </div>
          )}

          <button
            onClick={() => {
              playClickSound();
              onPlayAgain();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400 shrink-0" />
            PLAY AGAIN (NEW MISSION)
          </button>
        </div>
      </div>

      {/* 3. Final Event Leaderboard (Revealed After Completion) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 font-mono uppercase">
                Final Event Leaderboard
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {scoresVisible ? 'Official Competition Rankings' : 'Rankings Pending Organizer Reveal'}
              </p>
            </div>
          </div>

          {/* Search Filter */}
          {scoresVisible && (
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search team or mission..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-200 outline-none"
              />
            </div>
          )}
        </div>

        {!scoresVisible ? (
          <div className="p-10 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
            <h4 className="font-mono text-sm font-bold text-slate-200">
              Final Event Rankings Suspended
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto font-sans leading-relaxed">
              Your score has been safely logged! The event organizer will reveal the global standings on the main screen once all participating teams finish their runs.
            </p>
          </div>
        ) : filteredLeaderboard.length === 0 ? (
          <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-500 font-mono text-xs">
            No entries found on the leaderboard yet. Be the first team to publish!
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredLeaderboard.map((entry, idx) => {
              const rank = idx + 1;
              const isCurrentTeam = entry.teamName.trim().toLowerCase() === (inputTeamName || teamName).trim().toLowerCase();

              return (
                <div
                  key={entry.id || idx}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 font-mono text-xs transition-all ${
                    rank === 1
                      ? 'bg-amber-950/50 border-amber-500/60 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : rank === 2
                      ? 'bg-slate-800/80 border-slate-500 text-slate-200'
                      : rank === 3
                      ? 'bg-amber-950/30 border-amber-800 text-amber-300'
                      : isCurrentTeam
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 ring-1 ring-cyan-400/40'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`w-8 h-8 rounded-xl font-bold text-sm flex items-center justify-center shrink-0 ${
                        rank === 1
                          ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                          : rank === 2
                          ? 'bg-slate-300 text-slate-950'
                          : rank === 3
                          ? 'bg-amber-700 text-slate-100'
                          : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}
                    >
                      #{rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-100">{entry.teamName}</span>
                        {isCurrentTeam && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                        {entry.missionTitle} • Grade {entry.grade || 'A'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-lg text-amber-300 block leading-tight">
                      {entry.totalScore} <span className="text-[10px] text-slate-500 font-normal">pts</span>
                    </span>
                    <span className="text-[10px] text-slate-500 block">{entry.timestamp || 'Recent'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
