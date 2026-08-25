import React, { useState, useEffect } from 'react';
import { GameRound } from '../types';
import { ROUNDS_CONFIG } from '../data/rounds';
import { Timer, Pause, Play, HelpCircle, ShieldAlert, Zap } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface RoundHeaderProps {
  currentRound: GameRound;
  onTimeExpired?: () => void;
}

export const RoundHeader: React.FC<RoundHeaderProps> = ({ currentRound, onTimeExpired }) => {
  const config = ROUNDS_CONFIG[currentRound];
  const [timeLeft, setTimeLeft] = useState<number>(config.suggestedSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Reset timer when round changes
  useEffect(() => {
    setTimeLeft(config.suggestedSeconds);
    setIsPaused(false);
  }, [currentRound, config.suggestedSeconds]);

  // Countdown timer logic
  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onTimeExpired) onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeLeft, onTimeExpired]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isWarningTime = timeLeft < 60;

  return (
    <div className="space-y-3 mb-6">
      {/* Question 1: Where Am I? + Difficulty Badge + Timer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:px-6 shadow-md">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-black uppercase tracking-wider text-cyan-400">
              ROUND {config.number} OF 6
            </span>

            {/* Difficulty Badge */}
            <span
              className={`px-3 py-0.5 rounded-full font-mono text-xs font-bold border uppercase tracking-wider flex items-center gap-1 ${config.badgeColor}`}
            >
              {config.difficulty === 'Easy' && '🟢 Easy'}
              {config.difficulty === 'Medium' && '🟡 Medium'}
              {config.difficulty === 'Hard' && '🔴 Hard'}
              {config.difficulty === 'Automatic' && '🟢 Automatic'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-100 uppercase">
            {config.title}
          </h2>
          <p className="text-sm font-mono text-slate-300">{config.subtitle}</p>
        </div>

        {/* Round Countdown Timer */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-mono text-base font-black transition-all ${
              isWarningTime
                ? 'bg-red-950 border-red-500 text-red-300 animate-pulse ring-2 ring-red-500/40'
                : 'bg-slate-950 border-slate-800 text-cyan-300'
            }`}
          >
            <Timer className={`w-5 h-5 ${isWarningTime ? 'text-red-400' : 'text-cyan-400'}`} />
            <span>⏱️ {formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => {
              playClickSound();
              setIsPaused(!isPaused);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors border border-slate-700"
            title={isPaused ? 'Resume Timer' : 'Pause Timer'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Question 2: What Do I Need To Do? (Instruction Alert Banner) */}
      <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl px-4.5 py-3.5 flex items-start gap-3 text-cyan-200 font-mono text-sm shadow-inner">
        <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-cyan-300 block mb-1 uppercase tracking-wide text-xs">
            OBJECTIVE & ACTION REQUIRED:
          </span>
          <p className="text-slate-100 font-sans text-sm sm:text-base leading-relaxed">{config.instruction}</p>
        </div>
      </div>
    </div>
  );
};
