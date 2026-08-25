import React, { useState } from 'react';
import { Mission, ComponentSelection, CheckpointResult, RepairQuestion } from '../types';
import { DRIVE_OPTIONS, BODY_OPTIONS, SENSOR_OPTIONS } from '../data/components';
import { playClickSound, playPassSound, playFailSound } from '../utils/audio';
import { RoundHeader } from './RoundHeader';
import { RobotSimulationArena } from './RobotSimulationArena';
import {
  Wrench,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface EmergencyRepairProps {
  currentRound: number;
  mission: Mission;
  selection: ComponentSelection;
  wiringMistakes: number;
  failedCheckpoints: CheckpointResult[];
  onCompleteRepair: (repairedCheckpointIds: string[]) => void;
}

export const EmergencyRepair: React.FC<EmergencyRepairProps> = ({
  currentRound,
  mission,
  selection,
  wiringMistakes,
  failedCheckpoints,
  onCompleteRepair,
}) => {
  // Generate repair questions dynamically based on failed checkpoints
  const generateQuestions = (): RepairQuestion[] => {
    return failedCheckpoints.map((fail) => {
      if (fail.id === 'terrain') {
        const options = DRIVE_OPTIONS.map((d) => d.id);
        return {
          checkpointId: 'terrain',
          title: 'Terrain Traversal Diagnostic',
          question: `Your drive system failed with telemetry: "${fail.flavorText}". Which drive upgrade resolves this terrain obstacle?`,
          options,
          correctAnswer: mission.correctDrive,
        };
      } else if (fail.id === 'detection') {
        const options = SENSOR_OPTIONS.map((s) => s.id);
        return {
          checkpointId: 'detection',
          title: 'Sensor Payload Diagnostic',
          question: `Sensor array failed with telemetry: "${fail.flavorText}". Which sensor payload provides optimal detection clarity for this mission environment?`,
          options,
          correctAnswer: mission.correctSensor,
        };
      } else if (fail.id === 'structure') {
        const options = BODY_OPTIONS.map((b) => b.id);
        return {
          checkpointId: 'structure',
          title: 'Chassis & Payload Mass Diagnostic',
          question: `Structural chassis failed with telemetry: "${fail.flavorText}". Which body configuration balances payload capacity and dimensions correctly?`,
          options,
          correctAnswer: mission.correctBody,
        };
      } else {
        // Circuit failure
        return {
          checkpointId: 'circuit',
          title: 'Electrical Circuit Diagnostic',
          question: `Circuit integrity failed with telemetry: "${fail.flavorText}". What is the primary diagnostic step to stabilize electrical current?`,
          options: [
            'Isolate logic controller ground bus & lock power connections with zip ties',
            'Increase motor voltage beyond 48V without fuse protection',
            'Disconnect battery safety relay during mission run',
            'Replace copper wire harnesses with unshielded aluminum foil',
          ],
          correctAnswer: 'Isolate logic controller ground bus & lock power connections with zip ties',
        };
      }
    });
  };

  const [questions, setQuestions] = useState<RepairQuestion[]>(generateQuestions);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [repairedIds, setRepairedIds] = useState<string[]>([]);

  const handleSelectOption = (checkpointId: string, option: string) => {
    if (submitted) return;
    playClickSound();
    setAnswers((prev) => ({ ...prev, [checkpointId]: option }));
  };

  const handleSubmitRepairs = () => {
    playClickSound();
    setSubmitted(true);

    const newlyRepaired: string[] = [];
    questions.forEach((q) => {
      const chosen = answers[q.checkpointId];
      if (chosen === q.correctAnswer) {
        newlyRepaired.push(q.checkpointId);
      }
    });

    setRepairedIds(newlyRepaired);

    if (newlyRepaired.length > 0) {
      playPassSound();
    } else {
      playFailSound();
    }
  };

  const isAllAnswered = questions.every((q) => answers[q.checkpointId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* 1. Standard Round Header */}
      <RoundHeader currentRound={currentRound as any} />

      {/* Repair Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const selectedOption = answers[q.checkpointId];
          const isCorrect = submitted && selectedOption === q.correctAnswer;

          return (
            <div
              key={q.checkpointId}
              className={`bg-slate-900/90 border-2 rounded-2xl p-5 sm:p-6 space-y-4 transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-500 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                    : 'border-red-500 bg-red-950/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-amber-950 border border-amber-500/40 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
                    {qIdx + 1}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 font-mono">
                    {q.title}
                  </h3>
                </div>

                {submitted && (
                  <span
                    className={`px-3 py-1 rounded-md font-mono text-xs font-bold flex items-center gap-1.5 ${
                      isCorrect ? 'bg-emerald-950 text-emerald-300 border border-emerald-500' : 'bg-red-950 text-red-300 border border-red-500'
                    }`}
                  >
                    {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {isCorrect ? 'REPAIRED (+10 Pts)' : 'REPAIR FAILED'}
                  </span>
                )}
              </div>

              <p className="text-base text-slate-100 font-sans leading-relaxed">
                {q.question}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {q.options.map((opt) => {
                  const isSelected = selectedOption === opt;
                  const isThisCorrect = submitted && opt === q.correctAnswer;

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(q.checkpointId, opt)}
                      disabled={submitted}
                      className={`p-4 rounded-xl border text-left font-mono text-xs sm:text-sm transition-all relative cursor-pointer ${
                        submitted
                          ? isThisCorrect
                            ? 'bg-emerald-950 border-emerald-400 text-emerald-200 font-bold'
                            : isSelected
                            ? 'bg-red-950 border-red-400 text-red-200'
                            : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-50'
                          : isSelected
                          ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)] font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Initial Submission Control */}
      {!submitted && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-slate-400">
            Select one diagnostic repair answer for each failed checkpoint above.
          </div>
          <button
            onClick={handleSubmitRepairs}
            disabled={!isAllAnswered}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-mono font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
              isAllAnswered
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer hover:scale-[1.02]'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <Wrench className="w-5 h-5 shrink-0" />
            SUBMIT DIAGNOSTIC REPAIRS
          </button>
        </div>
      )}

      {/* Post-Repair Simulation Victory Re-Run Section */}
      {submitted && (
        <div className="space-y-4 pt-4 border-t border-slate-800 animate-fade-in">
          <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-base">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>RECOVERY RE-TEST RUN: WATCH YOUR REPAIRED ROBOT IN ACTION</span>
          </div>

          <RobotSimulationArena
            mission={mission}
            selection={selection}
            wiringMistakes={wiringMistakes}
            repairedCheckpointIds={repairedIds}
            isReRun={true}
            onSimulationComplete={() => {
              onCompleteRepair(repairedIds);
            }}
          />
        </div>
      )}
    </div>
  );
};
