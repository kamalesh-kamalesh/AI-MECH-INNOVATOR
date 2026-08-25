import React, { useState } from 'react';
import { LeaderboardEntry } from '../types';
import { playClickSound } from '../utils/audio';
import { Trophy, X, ShieldAlert, Users, Search, Lock, ShieldCheck, Activity, Cpu, Sparkles } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaderboard: LeaderboardEntry[];
  scoresVisible: boolean;
  currentRound: number;
  teamName: string;
  wiringMistakes?: number;
  aiCredits?: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  leaderboard,
  scoresVisible,
  currentRound,
  teamName,
  wiringMistakes = 0,
  aiCredits = 3,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const isMidGame = currentRound < 6;

  const filtered = leaderboard.filter(
    (e) =>
      e.teamName.toLowerCase().includes(search.toLowerCase()) ||
      e.missionTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 space-y-5 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${isMidGame ? 'bg-cyan-950 border-cyan-500/50 text-cyan-400' : 'bg-amber-950 border-amber-500/40 text-amber-400'}`}>
              {isMidGame ? <Lock className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 font-mono uppercase">
                {isMidGame ? 'Private Team Status & Telemetry' : 'Final Event Leaderboard'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {isMidGame ? 'Opponent scores are strictly hidden during active match' : 'Live Real-Time Standings'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MID-GAME STATUS VIEW (Rounds 1 to 5) */}
        {isMidGame ? (
          <div className="space-y-4">
            {/* Privacy Shield Banner */}
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-mono space-y-1.5 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>FAIR PLAY CONFIDENTIALITY MODE ACTIVE</span>
              </div>
              <p className="text-slate-300 font-sans leading-relaxed">
                To prevent distraction and ensure absolute fairness, other teams' scores, progress, and rankings are hidden during gameplay. Focus on perfecting your own robot design!
              </p>
            </div>

            {/* Current Team Telemetry Metrics */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3 font-mono">
              <h4 className="text-xs text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800 pb-2">
                MY TEAM TELEMETRY
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">TEAM NAME</span>
                  <span className="text-base font-bold text-amber-300 truncate block">{teamName || 'Unregistered Team'}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">CURRENT STAGE</span>
                  <span className="text-base font-bold text-cyan-400 block">Round {currentRound} of 6</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">CIRCUIT FAULTS</span>
                  <span className="text-base font-bold text-emerald-400 block">{wiringMistakes} Mistakes</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">AI CREDITS</span>
                  <span className="text-base font-bold text-purple-400 block">{aiCredits} / 3 Available</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              RETURN TO ROBOT WORKSHOP →
            </button>
          </div>
        ) : (
          /* POST-GAME LEADERBOARD VIEW (Round 6) */
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search team or mission..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-200 outline-none"
              />
            </div>

            {/* List Content */}
            {!scoresVisible ? (
              <div className="p-10 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
                <h4 className="font-mono text-sm font-bold text-slate-200">
                  Participant Scores Suspended
                </h4>
                <p className="text-xs text-slate-400 font-sans">
                  The event host has locked leaderboard visibility until the official final reveal.
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 font-mono space-y-2">
                <Trophy className="w-8 h-8 text-slate-600 mx-auto stroke-[1.5]" />
                <p className="font-bold text-slate-200 tracking-wider uppercase text-sm">NO TEAMS REGISTERED</p>
                <p className="text-xs text-slate-500 font-sans">Teams will appear here once participants join the competition.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                {filtered.map((entry, idx) => {
                  const rank = idx + 1;
                  const isCurrentTeam = entry.teamName.trim().toLowerCase() === teamName.trim().toLowerCase();

                  return (
                    <div
                      key={entry.id || idx}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 font-mono text-xs transition-all ${
                        rank === 1
                          ? 'bg-amber-950/50 border-amber-500/60 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                          : rank === 2
                          ? 'bg-slate-800/80 border-slate-500 text-slate-200'
                          : rank === 3
                          ? 'bg-amber-950/30 border-amber-800 text-amber-300'
                          : isCurrentTeam
                          ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 ring-1 ring-cyan-400/40'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center shrink-0 ${
                            rank === 1
                              ? 'bg-amber-500 text-slate-950'
                              : rank === 2
                              ? 'bg-slate-300 text-slate-950'
                              : rank === 3
                              ? 'bg-amber-700 text-slate-100'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          #{rank}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-100">{entry.teamName}</span>
                            {isCurrentTeam && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {entry.missionTitle} • Grade {entry.grade || 'A'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-sm text-amber-300 block">
                          {entry.totalScore} pts
                        </span>
                        <span className="text-[10px] text-slate-500 block">{entry.timestamp || 'Recent'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
