import React, { useState } from 'react';
import { LeaderboardEntry } from '../types';
import { playClickSound } from '../utils/audio';
import {
  ShieldCheck,
  X,
  Eye,
  EyeOff,
  Trash2,
  Lock,
  BarChart2,
  Users,
  Award,
  Sparkles,
  AlertTriangle,
  Trophy
} from 'lucide-react';

interface HostDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaderboard: LeaderboardEntry[];
  scoresVisible: boolean;
  onDeleteTeam: (id: string, hostPasscode: string) => void;
  onToggleVisibility: (hostPasscode: string) => void;
  onClearAll: (hostPasscode: string) => void;
}

export const HostDashboardModal: React.FC<HostDashboardModalProps> = ({
  isOpen,
  onClose,
  leaderboard,
  scoresVisible,
  onDeleteTeam,
  onToggleVisibility,
  onClearAll,
}) => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    if (passcode === 'aimech2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid host passcode! Default is: aimech2026');
    }
  };

  // Host telemetry calculations
  const totalTeams = leaderboard.length;
  const avgScore = totalTeams > 0
    ? Math.round(leaderboard.reduce((acc, curr) => acc + curr.totalScore, 0) / totalTeams)
    : 0;
  const totalAiQueries = leaderboard.reduce((acc, curr) => acc + (curr.aiQuestionsAsked || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-purple-500/50 rounded-3xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-950 border border-purple-500/50 text-purple-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-mono text-slate-100 uppercase">
                Host Control Dashboard
              </h3>
              <p className="text-xs text-slate-400 font-mono">Event Admin & Leaderboard Management</p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Password Lock Screen */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="p-8 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 max-w-md mx-auto text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-mono text-base font-bold text-slate-100">Host Access Verification</h4>
              <p className="text-xs text-slate-400 font-sans">Enter event host passcode to access admin controls.</p>
            </div>

            <input
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setAuthError('');
              }}
              placeholder="Passcode (default: aimech2026)"
              className="w-full bg-slate-900 border border-slate-800 focus:border-purple-400 rounded-xl px-4 py-3 text-xs font-mono text-slate-100 text-center outline-none"
            />

            {authError && (
              <p className="text-xs font-mono text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-slate-100 font-mono font-bold text-xs uppercase tracking-wide transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]"
            >
              Authenticate Host
            </button>
          </form>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-6">
            {/* Telemetry Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono">
                <span className="text-[10px] text-slate-400 block uppercase">Total Teams</span>
                <span className="text-2xl font-bold text-cyan-400">{totalTeams}</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono">
                <span className="text-[10px] text-slate-400 block uppercase">Average Score</span>
                <span className="text-2xl font-bold text-amber-400">{avgScore} <span className="text-xs font-normal">/ 100</span></span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono">
                <span className="text-[10px] text-slate-400 block uppercase">Total AI Consults</span>
                <span className="text-2xl font-bold text-purple-400">{totalAiQueries}</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono">
                <span className="text-[10px] text-slate-400 block uppercase">Public Visibility</span>
                <span className={`text-base font-bold ${scoresVisible ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {scoresVisible ? 'VISIBLE' : 'SUSPENDED'}
                </span>
              </div>
            </div>

            {/* Host Control Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <span>Participant Visibility:</span>
                <button
                  onClick={() => {
                    playClickSound();
                    onToggleVisibility(passcode);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold transition-all ${
                    scoresVisible
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-amber-950 border-amber-500 text-amber-300'
                  }`}
                >
                  {scoresVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {scoresVisible ? 'Scores Public' : 'Scores Hidden (Suspense Mode)'}
                </button>
              </div>

              {!showConfirmClear ? (
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-mono text-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Entire Leaderboard
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-red-950 p-2 rounded-xl border border-red-500 font-mono text-xs">
                  <span className="text-red-200">Confirm wipe all entries?</span>
                  <button
                    onClick={() => {
                      playClickSound();
                      onClearAll(passcode);
                      setShowConfirmClear(false);
                    }}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-slate-100 rounded font-bold"
                  >
                    YES, CLEAR
                  </button>
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Managed Leaderboard Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-slate-400">Manage Team Submissions</h4>
              {leaderboard.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 font-mono space-y-2">
                  <Trophy className="w-8 h-8 text-slate-600 mx-auto stroke-[1.5]" />
                  <p className="font-bold text-slate-200 tracking-wider uppercase text-sm">NO TEAMS REGISTERED</p>
                  <p className="text-xs text-slate-500 font-sans">Teams will appear here once participants join the competition.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
                  {leaderboard.map((entry, idx) => (
                    <div
                      key={entry.id || idx}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 font-mono text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-slate-900 border border-slate-800 text-slate-400 font-bold flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-sm text-slate-100 block">{entry.teamName}</span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            Missions: {entry.robot1MissionTitle} / {entry.robot2MissionTitle} • Score: {entry.totalScore} pts (R1={entry.robot1Score}, R2={entry.robot2Score}, Opt={entry.optimizationScore}, AI={entry.aiScore})
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          playClickSound();
                          onDeleteTeam(entry.id, passcode);
                        }}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-500 hover:text-red-400 border border-slate-800 hover:border-red-500/50 transition-colors"
                        title="Remove team entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
