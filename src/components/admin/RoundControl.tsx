import React, { useState } from 'react';
import { playClickSound } from '../../utils/audio';
import { ChevronDown, AlertTriangle } from 'lucide-react';

interface RoundControlProps {
  currentRoundName: string;
  roundStatus: 'ACTIVE' | 'PAUSED' | 'ENDED';
  remainingTimeSeconds: number;
  activeTeamsCount: number;
  totalTeamsCount: number;
  onStartRound: () => void;
  onPauseAll: () => void;
  onResumeAll: () => void;
  onAddTimeMinutes: (minutes: number) => void;
  onEndRound: () => void;
  onForceSubmitAll: () => void;
}

export const RoundControl: React.FC<RoundControlProps> = ({
  currentRoundName,
  roundStatus,
  remainingTimeSeconds,
  onPauseAll,
  onResumeAll,
  onAddTimeMinutes,
  onEndRound,
  onForceSubmitAll,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [confirmModal, setConfirmModal] = useState<'end_round' | 'force_submit' | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirmAction = () => {
    playClickSound();
    if (confirmModal === 'end_round') {
      onEndRound();
    } else if (confirmModal === 'force_submit') {
      onForceSubmitAll();
    }
    setConfirmModal(null);
  };

  return (
    <div className="space-y-6 font-mono max-w-4xl">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3">
          ROUND CONTROL
        </h2>

        {/* Current Round, Status, Time Remaining */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 block">Current Round</span>
            <span className="text-sm font-bold text-slate-100 block">
              Round 1 — {currentRoundName.replace('ROBOT 1 — ', '') || 'AI Mech Innovator'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 block">Status</span>
            <span
              className={`text-sm font-bold block ${
                roundStatus === 'ACTIVE'
                  ? 'text-emerald-400'
                  : roundStatus === 'PAUSED'
                  ? 'text-amber-400'
                  : 'text-red-400'
              }`}
            >
              ● {roundStatus === 'ACTIVE' ? 'LIVE' : roundStatus}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 block">Time Remaining</span>
            <span className="text-2xl font-black text-amber-300 font-mono block">
              {formatTime(remainingTimeSeconds)}
            </span>
          </div>
        </div>

        {/* Confirmation Modal */}
        {confirmModal && (
          <div className="bg-red-950/80 border border-red-500/50 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-red-200 text-xs font-bold uppercase">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Confirm {confirmModal === 'end_round' ? 'END ROUND' : 'FORCE SUBMIT ALL'}?</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleConfirmAction}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold cursor-pointer"
              >
                Execute
              </button>
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-1.5 bg-slate-800 text-slate-300 rounded text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Essential Controls */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              playClickSound();
              onPauseAll();
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded transition-colors cursor-pointer"
          >
            PAUSE ALL
          </button>

          <button
            onClick={() => {
              playClickSound();
              onResumeAll();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded transition-colors cursor-pointer"
          >
            RESUME ALL
          </button>

          <button
            onClick={() => {
              playClickSound();
              onAddTimeMinutes(1);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 rounded transition-colors cursor-pointer"
          >
            +1 MIN
          </button>

          <button
            onClick={() => {
              playClickSound();
              onAddTimeMinutes(5);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 rounded transition-colors cursor-pointer"
          >
            +5 MIN
          </button>

          <button
            onClick={() => setConfirmModal('end_round')}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded transition-colors cursor-pointer"
          >
            END ROUND
          </button>

          {/* Secondary More Controls dropdown */}
          <div className="relative ml-auto">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 text-xs font-bold border border-slate-800 rounded flex items-center gap-1 cursor-pointer"
            >
              <span>More Controls</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-950 border border-slate-800 rounded shadow-xl py-1 z-20">
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    setConfirmModal('force_submit');
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-purple-400 hover:bg-slate-900 cursor-pointer"
                >
                  Force Submit All Teams
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
