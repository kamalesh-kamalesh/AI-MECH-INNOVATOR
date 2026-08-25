import React, { useState } from 'react';
import { AdminTeam } from '../../types';
import { playClickSound } from '../../utils/audio';
import { X, ChevronDown, AlertTriangle } from 'lucide-react';

interface TeamDetailModalProps {
  team: AdminTeam | null;
  onClose: () => void;
  onPauseTeam: (teamId: string) => void;
  onResumeTeam: (teamId: string) => void;
  onAddTime: (teamId: string, minutes: number) => void;
  onResetChallenge: (teamId: string) => void;
  onForceSubmit: (teamId: string) => void;
  onDisqualifyTeam: (teamId: string) => void;
}

export const TeamDetailModal: React.FC<TeamDetailModalProps> = ({
  team,
  onClose,
  onPauseTeam,
  onResumeTeam,
  onAddTime,
  onResetChallenge,
  onForceSubmit,
  onDisqualifyTeam,
}) => {
  const [showSecondaryMenu, setShowSecondaryMenu] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'reset' | 'force_submit' | 'disqualify' | null>(null);

  if (!team) return null;

  const handleActionConfirm = () => {
    playClickSound();
    if (confirmAction === 'reset') {
      onResetChallenge(team.id);
    } else if (confirmAction === 'force_submit') {
      onForceSubmit(team.id);
    } else if (confirmAction === 'disqualify') {
      onDisqualifyTeam(team.id);
    }
    setConfirmAction(null);
  };

  const isR1Done = team.robot1.isComplete;
  const isTest1Done = team.robot1.testAttempts > 0;
  const isR2Building = !team.robot2.isComplete && (team.currentStage.includes('ROBOT2') || isR1Done);
  const isR2Done = team.robot2.isComplete;
  const isTest2Done = team.robot2.testAttempts > 0;
  const isOptDone = team.currentStage === 'RESULTS' || team.optimizationScore > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm font-mono">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-slate-950 rounded-xl border border-slate-800">
              {team.avatar}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100 uppercase">{team.name}</h2>
                <span className="text-xs text-cyan-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {team.id}
                </span>
                <span className="text-xs text-slate-400">● {team.status}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Members: <strong className="text-slate-200">{team.members.join(', ')}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Banner */}
        {confirmAction && (
          <div className="bg-red-950/80 border border-red-500/50 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-red-200 text-xs font-bold uppercase">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Confirm {confirmAction.replace('_', ' ')} for {team.name}?</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleActionConfirm}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded font-bold text-xs cursor-pointer"
              >
                Execute
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Progress Checklist */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Current Progress
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Robot 1</span>
                <span className={isR1Done ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {isR1Done ? '✓ Complete' : '● Building'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Test 1</span>
                <span className={isTest1Done ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {isTest1Done ? '✓ Complete' : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Robot 2</span>
                <span className={isR2Done ? 'text-emerald-400 font-bold' : isR2Building ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                  {isR2Done ? '✓ Complete' : isR2Building ? '● Building' : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-300">Test 2</span>
                <span className={isTest2Done ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {isTest2Done ? '✓ Complete' : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-300">Optimization</span>
                <span className={isOptDone ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {isOptDone ? '✓ Complete' : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Usage & Current Score */}
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">AI Usage</span>
              <div className="text-lg font-bold text-cyan-300">
                AI Credits: <span className="text-slate-100">{team.aiCreditsUsed} / 5 used</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Score</span>
              <div className="text-2xl font-black text-cyan-400">
                {team.totalScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Robot Configuration */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Robot Configuration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Robot 1 Components */}
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-cyan-400 font-bold uppercase block">Robot 1</span>
              <div className="text-slate-300">Drive: <strong className="text-slate-100">{team.robot1.selectedDrive || 'None'}</strong></div>
              <div className="text-slate-300">Body: <strong className="text-slate-100">{team.robot1.selectedBody || 'None'}</strong></div>
              <div className="text-slate-300">Sensor: <strong className="text-slate-100">{team.robot1.selectedSensor || 'None'}</strong></div>
              <div className="text-slate-300">Gripper: <strong className="text-slate-100">{team.robot1.selectedGripper || 'None'}</strong></div>
            </div>

            {/* Robot 2 Components */}
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-purple-400 font-bold uppercase block">Robot 2</span>
              <div className="text-slate-300">Drive: <strong className="text-slate-100">{team.robot2.selectedDrive || 'None'}</strong></div>
              <div className="text-slate-300">Body: <strong className="text-slate-100">{team.robot2.selectedBody || 'None'}</strong></div>
              <div className="text-slate-300">Sensor: <strong className="text-slate-100">{team.robot2.selectedSensor || 'None'}</strong></div>
              <div className="text-slate-300">Motor: <strong className="text-slate-100">{team.robot2.selectedMotor || 'None'}</strong></div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Controls
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {team.status === 'PAUSED' ? (
              <button
                onClick={() => {
                  playClickSound();
                  onResumeTeam(team.id);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded transition-colors cursor-pointer"
              >
                RESUME
              </button>
            ) : (
              <button
                onClick={() => {
                  playClickSound();
                  onPauseTeam(team.id);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded transition-colors cursor-pointer"
              >
                PAUSE
              </button>
            )}

            <button
              onClick={() => {
                playClickSound();
                onAddTime(team.id, 2);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 rounded transition-colors cursor-pointer"
            >
              +2 MIN
            </button>

            <button
              onClick={() => setConfirmAction('reset')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 rounded transition-colors cursor-pointer"
            >
              RESET
            </button>

            <button
              onClick={() => setConfirmAction('force_submit')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded transition-colors cursor-pointer"
            >
              FORCE SUBMIT
            </button>

            {/* Secondary Menu toggle for dangerous actions */}
            <div className="relative ml-auto">
              <button
                onClick={() => setShowSecondaryMenu(!showSecondaryMenu)}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-bold border border-slate-800 rounded flex items-center gap-1 cursor-pointer"
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showSecondaryMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-40 bg-slate-900 border border-slate-800 rounded shadow-xl py-1 z-20">
                  <button
                    onClick={() => {
                      setShowSecondaryMenu(false);
                      setConfirmAction('disqualify');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-red-400 hover:bg-slate-800 cursor-pointer"
                  >
                    Disqualify Team
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
