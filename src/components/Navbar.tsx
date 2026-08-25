import React from 'react';
import { Cpu, Volume2, VolumeX, Trophy, ShieldCheck, Sparkles, Check, Lock } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface NavbarProps {
  currentRound: number;
  teamName: string;
  aiCredits: number;
  soundMuted: boolean;
  onToggleSound: () => void;
  onOpenLeaderboard: () => void;
  onOpenHostModal: () => void;
  onOpenAdminDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRound,
  teamName,
  aiCredits,
  soundMuted,
  onToggleSound,
  onOpenLeaderboard,
  onOpenHostModal,
  onOpenAdminDashboard,
}) => {
  const roundSteps = [
    { num: 0, label: '0 Login' },
    { num: 1, label: '1 Mission' },
    { num: 2, label: '2 Robot 1' },
    { num: 3, label: '3 Test 1' },
    { num: 4, label: '4 Robot 2' },
    { num: 5, label: '5 Test 2' },
    { num: 6, label: '6 Optimize' },
    { num: 7, label: '7 Score' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-3 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Game Title */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-wider text-cyan-300 font-mono uppercase">
              AI MECH INNOVATOR
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block font-mono">
              Robotics Arcade Challenge
            </p>
          </div>
        </div>

        {/* Game Progress Tracker */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-1 font-mono text-xs">
          {roundSteps.map((step) => {
            const isActive = currentRound === step.num;
            const isCompleted = currentRound > step.num;

            return (
              <div
                key={step.num}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold'
                    : isCompleted
                    ? 'text-emerald-400 bg-emerald-950/30 font-medium'
                    : 'text-slate-500 opacity-60'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                ) : isActive ? (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-600" />
                )}
                <span>{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Right Controls & Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Team Name Badge */}
          {teamName && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg font-mono text-sm text-amber-300">
              <span className="text-xs text-slate-500">TEAM:</span>
              <span className="truncate max-w-[120px] font-bold">{teamName}</span>
            </div>
          )}

          {/* AI Credits Pip Indicator */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-sm text-cyan-300" title="AI Consult Credits">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="hidden xs:inline text-xs text-slate-400">AI:</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((pip) => (
                <div
                  key={pip}
                  className={`w-2.5 h-4 rounded-sm transition-all ${
                    pip <= aiCredits
                      ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]'
                      : 'bg-slate-800 border border-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={() => {
              playClickSound();
              onToggleSound();
            }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
            title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Leaderboard Button - Locked during gameplay (Rounds 1-5), Active in Round 6 */}
          {currentRound < 6 ? (
            <button
              onClick={() => {
                playClickSound();
                onOpenLeaderboard();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs hover:border-slate-700 transition-colors cursor-pointer"
              title="View your current team status (Opponent ranks hidden during match)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Status</span>
            </button>
          ) : (
            <button
              onClick={() => {
                playClickSound();
                onOpenLeaderboard();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs transition-colors cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Final Ranks</span>
            </button>
          )}

          {/* Admin Control Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenAdminDashboard();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 border border-purple-500/50 text-purple-200 font-mono text-xs font-bold transition-all cursor-pointer shadow-[0_0_10px_rgba(147,51,234,0.3)]"
            title="Open Admin Control Center"
          >
            <ShieldCheck className="w-4 h-4 text-purple-300" />
            <span className="hidden sm:inline uppercase">ADMIN CONTROL</span>
          </button>
        </div>
      </div>
    </header>
  );
};

