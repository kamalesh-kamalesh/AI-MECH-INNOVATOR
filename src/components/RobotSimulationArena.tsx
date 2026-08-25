import React, { useState, useEffect, useRef } from 'react';
import { Mission, ComponentSelection, CheckpointResult } from '../types';
import { playScanSound, playPassSound, playFailSound, playTriumphSound, playClickSound } from '../utils/audio';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Bot,
  Zap,
  Activity,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Gauge,
  Cpu,
  FastForward,
  Wrench
} from 'lucide-react';

interface RobotSimulationArenaProps {
  mission: Mission;
  selection: ComponentSelection;
  wiringMistakes: number;
  repairedCheckpointIds?: string[]; // IDs of checkpoints repaired in Round 5
  onSimulationComplete: (results: CheckpointResult[], allPassed: boolean) => void;
  isReRun?: boolean; // True if running in Round 5 post-repair
}

export const RobotSimulationArena: React.FC<RobotSimulationArenaProps> = ({
  mission,
  selection,
  wiringMistakes,
  repairedCheckpointIds = [],
  onSimulationComplete,
  isReRun = false,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x or 2x
  const [progress, setProgress] = useState<number>(0); // 0 to 100%
  const [currentZoneIndex, setCurrentZoneIndex] = useState<number>(0); // 0: Terrain, 1: Detection, 2: Structure, 3: Circuit
  const [evaluatedResults, setEvaluatedResults] = useState<CheckpointResult[]>([]);
  const [simulationFinished, setSimulationFinished] = useState<boolean>(false);

  // References for requestAnimationFrame smooth animation loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Evaluate pass/fail logic considering original selection + Round 5 repairs
  const evaluateCheckpoints = (): CheckpointResult[] => {
    const isTerrainRepaired = repairedCheckpointIds.includes('terrain');
    const isDetectionRepaired = repairedCheckpointIds.includes('detection');
    const isStructureRepaired = repairedCheckpointIds.includes('structure');
    const isCircuitRepaired = repairedCheckpointIds.includes('circuit');

    const isTerrainPass = (selection.drive === mission.correctDrive) || isTerrainRepaired;
    const isDetectionPass = (selection.sensor === mission.correctSensor) || isDetectionRepaired;
    const isStructurePass = (selection.body === mission.correctBody) || isStructureRepaired;
    const isCircuitPass = (wiringMistakes === 0) || isCircuitRepaired;

    return [
      {
        id: 'terrain',
        name: 'Terrain Traversal',
        icon: '🛤️',
        categoryName: `Drive: ${selection.drive || 'Unassigned'}`,
        passed: isTerrainPass,
        flavorText: isTerrainPass
          ? isTerrainRepaired
            ? `[FIELD REPAIRED]: High-torque emergency differential enabled! ${mission.terrainPassText}`
            : mission.terrainPassText
          : mission.terrainFailText,
      },
      {
        id: 'detection',
        name: 'Object & Environment Sensing',
        icon: '👁️',
        categoryName: `Sensor: ${selection.sensor || 'Unassigned'}`,
        passed: isDetectionPass,
        flavorText: isDetectionPass
          ? isDetectionRepaired
            ? `[FIELD REPAIRED]: Optic gain & signal frequency recalibrated! ${mission.detectionPassText}`
            : mission.detectionPassText
          : mission.detectionFailText,
      },
      {
        id: 'structure',
        name: 'Chassis & Payload Mass',
        icon: '📦',
        categoryName: `Body: ${selection.body || 'Unassigned'}`,
        passed: isStructurePass,
        flavorText: isStructurePass
          ? isStructureRepaired
            ? `[FIELD REPAIRED]: Titanium reinforcement brace locked! ${mission.structurePassText}`
            : mission.structurePassText
          : mission.structureFailText,
      },
      {
        id: 'circuit',
        name: 'Electrical Circuit Integrity',
        icon: '⚡',
        categoryName: `Wiring Mistakes: ${wiringMistakes}`,
        passed: isCircuitPass,
        flavorText: isCircuitPass
          ? isCircuitRepaired
            ? `[FIELD REPAIRED]: Logic ground isolation patch secured! ${mission.circuitPassText}`
            : mission.circuitPassText
          : mission.circuitFailText,
      },
    ];
  };

  const results = evaluateCheckpoints();

  // Handle Animation Playback Loop (~24 seconds total @ 1x speed)
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const durationMs = 24000 / playbackSpeed; // 24 sec at 1x, 12 sec at 2x

    const step = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setProgress((prev) => {
        const next = prev + (elapsed / durationMs) * 100;
        if (next >= 100) {
          setIsPlaying(false);
          setSimulationFinished(true);
          const allPassed = results.every((r) => r.passed);
          if (allPassed) playTriumphSound();
          return 100;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  // Update current zone index based on progress % (0-25% -> 0, 25-50% -> 1, 50-75% -> 2, 75-100% -> 3)
  useEffect(() => {
    const idx = Math.min(3, Math.floor(progress / 25));
    if (idx !== currentZoneIndex) {
      setCurrentZoneIndex(idx);
      // Play audio cues on entering new checkpoint
      if (isPlaying) {
        playScanSound();
        const currentRes = results[idx];
        if (currentRes.passed) playPassSound();
        else playFailSound();
      }
    }
  }, [progress, currentZoneIndex, isPlaying]);

  // Update cumulative results feed as simulation progresses
  useEffect(() => {
    const currentMaxIndex = Math.min(3, Math.floor(progress / 25));
    if (progress > 0) {
      setEvaluatedResults(results.slice(0, currentMaxIndex + 1));
    }
  }, [progress]);

  const handleStartPlayback = () => {
    playClickSound();
    if (simulationFinished || progress >= 100) {
      setProgress(0);
      setSimulationFinished(false);
      setEvaluatedResults([]);
      setCurrentZoneIndex(0);
    }
    setIsPlaying(true);
    playScanSound();
  };

  const handlePausePlayback = () => {
    playClickSound();
    setIsPlaying(false);
  };

  const handleResetPlayback = () => {
    playClickSound();
    setIsPlaying(false);
    setProgress(0);
    setSimulationFinished(false);
    setEvaluatedResults([]);
    setCurrentZoneIndex(0);
  };

  // Telemetry Calculations for dynamic HUD
  const speedVal = isPlaying ? Math.round(18 + Math.sin(progress / 5) * 6) : 0;
  const currentRes = results[currentZoneIndex];
  const isCurrentlyPassing = currentRes?.passed ?? true;
  const voltageVal = isCurrentlyPassing ? '24.2 V' : '11.4 V (CRITICAL)';
  const integrityVal = isCurrentlyPassing ? '100%' : '48% (WARNING)';

  return (
    <div className="space-y-6">
      {/* Simulation Arena Box */}
      <div className="relative bg-slate-950 border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-7 space-y-6 shadow-[0_0_35px_rgba(6,182,212,0.15)] overflow-hidden">
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,182,212,0.04)_50%,transparent_100%)] bg-[length:100%_8px] pointer-events-none z-10" />

        {/* Top Control Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-300">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  {isReRun ? '⚡ RECOVERY DIAGNOSTIC RUN' : '🚀 INITIAL SIMULATION RUN'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-slate-300 border border-slate-700">
                  {((progress / 100) * 24).toFixed(1)}s / 24.0s
                </span>
              </div>
              <h3 className="text-lg font-bold font-mono text-slate-100 flex items-center gap-2">
                {mission.title}
              </h3>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                playClickSound();
                setPlaybackSpeed((s) => (s === 1 ? 2 : 1));
              }}
              className={`px-3 py-2 rounded-xl font-mono text-xs border flex items-center gap-1.5 transition-all cursor-pointer ${
                playbackSpeed === 2
                  ? 'bg-amber-950 border-amber-400 text-amber-300 font-bold'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>{playbackSpeed}x Speed</span>
            </button>

            {!isPlaying ? (
              <button
                onClick={handleStartPlayback}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-mono font-black text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                {progress > 0 && !simulationFinished ? 'RESUME' : simulationFinished ? 'RE-TEST RUN' : 'LAUNCH RUN'}
              </button>
            ) : (
              <button
                onClick={handlePausePlayback}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-black text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-current" />
                PAUSE
              </button>
            )}

            <button
              onClick={handleResetPlayback}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset Run"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2D VISUAL TRACK STAGE (ANIMATED CANVAS & GRAPHICS) */}
        <div className="relative h-64 sm:h-72 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner flex flex-col justify-between p-4">
          {/* Animated Background Environmental Grid */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Environmental Terrain Line at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent border-t border-slate-800/80">
            {/* Terrain Obstacles */}
            <div className="absolute inset-x-0 bottom-0 h-10 flex justify-between items-end px-4 pointer-events-none opacity-60">
              <span className="text-xl">🪨</span>
              <span className="text-xl">🧱</span>
              <span className="text-xl">⚡</span>
              <span className="text-xl">🏁</span>
            </div>
          </div>

          {/* 4 Track Zone Dividers */}
          <div className="absolute inset-x-0 top-0 bottom-16 grid grid-cols-4 pointer-events-none divide-x divide-slate-800/60 text-[10px] font-mono text-slate-600">
            <div className="p-2 font-bold uppercase flex items-start gap-1">
              <span>1. TERRAIN</span>
            </div>
            <div className="p-2 font-bold uppercase flex items-start gap-1">
              <span>2. SENSING</span>
            </div>
            <div className="p-2 font-bold uppercase flex items-start gap-1">
              <span>3. STRUCTURE</span>
            </div>
            <div className="p-2 font-bold uppercase flex items-start gap-1">
              <span>4. CIRCUIT</span>
            </div>
          </div>

          {/* Live Telemetry HUD Overlay (Top-Right) */}
          <div className="relative z-20 flex items-center justify-between gap-2 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Gauge className="w-4 h-4" />
              <span>SPD: <strong className="text-slate-100">{speedVal} km/h</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-400">
              <Radio className="w-4 h-4" />
              <span>SENSOR: <strong className="text-slate-100">{selection.sensor || 'None'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <Zap className="w-4 h-4" />
              <span>VOLT: <strong className={isCurrentlyPassing ? 'text-emerald-400' : 'text-red-400 animate-pulse'}>{voltageVal}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Activity className="w-4 h-4" />
              <span>HULL: <strong className={isCurrentlyPassing ? 'text-emerald-400' : 'text-red-400'}>{integrityVal}</strong></span>
            </div>
          </div>

          {/* DYNAMIC CUSTOM ROBOT AVATAR MOVING ALONG TRACK */}
          <div className="relative flex-1 my-auto flex items-center z-20">
            <div
              className="absolute transition-all duration-300 ease-out flex flex-col items-center -translate-x-1/2"
              style={{ left: `${Math.min(92, Math.max(8, progress))}%` }}
            >
              {/* Active Sensor Beam/Laser Effect Overlay */}
              {isPlaying && currentZoneIndex === 1 && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                  {selection.sensor === 'Camera Vision' && (
                    <div className="w-24 h-12 bg-gradient-to-t from-cyan-500/30 to-transparent clip-path-cone animate-pulse border-x border-cyan-400/50" />
                  )}
                  {selection.sensor === 'IR' && (
                    <div className="w-32 h-1 bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse" />
                  )}
                  {selection.sensor === 'Ultrasonic' && (
                    <div className="w-16 h-16 border-2 border-cyan-400/60 rounded-full animate-ping opacity-75" />
                  )}
                </div>
              )}

              {/* Sparking / Smoke FX on Failure */}
              {isPlaying && !isCurrentlyPassing && (
                <div className="absolute -top-8 -right-4 flex items-center gap-1 bg-red-950/90 border border-red-500 text-red-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold animate-bounce z-30">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  <span>FAULT DETECTED!</span>
                </div>
              )}

              {/* Emergency Repair Patch Active Badge */}
              {repairedCheckpointIds.length > 0 && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-400 text-emerald-300 text-[9px] font-mono font-bold whitespace-nowrap shadow-[0_0_10px_rgba(16,185,129,0.5)] z-30 flex items-center gap-1">
                  <Wrench className="w-2.5 h-2.5" />
                  REBOOT REPAIR ACTIVE
                </div>
              )}

              {/* THE TEAM'S CUSTOM ASSEMBLED ROBOT GRAPHIC */}
              <div
                className={`relative p-3 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center ${
                  !isCurrentlyPassing
                    ? 'bg-red-950/80 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
                    : 'bg-slate-900 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                }`}
              >
                {/* 1. SENSOR ARRAY HEAD (TOP) */}
                <div className="mb-1 flex items-center justify-center p-1 rounded-lg bg-slate-950 border border-cyan-500/60 text-cyan-300 text-xs font-mono font-bold">
                  {selection.sensor === 'Ultrasonic' && '📡 Sonar Dish'}
                  {selection.sensor === 'IR' && '🔴 IR Laser'}
                  {selection.sensor === 'Camera Vision' && '📷 AI Cam'}
                  {!selection.sensor && '❓ No Sensor'}
                </div>

                {/* 2. CHASSIS BODY FRAME (MIDDLE) */}
                <div
                  className={`px-4 py-2 rounded-xl border flex items-center justify-center font-mono text-xs font-bold ${
                    selection.body === 'Heavy-Duty'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                      : selection.body === 'Lightweight'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                      : 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                  }`}
                >
                  <Cpu className="w-4 h-4 mr-1.5" />
                  <span>{selection.body || 'Chassis'}</span>
                </div>

                {/* 3. DRIVE MOUNT SYSTEM (BOTTOM) */}
                <div className="mt-1.5 flex items-center justify-center gap-2 text-xs font-mono font-bold text-slate-300">
                  {selection.drive === '2-Wheel' && '⚙️ 2-Wheel'}
                  {selection.drive === '4-Wheel' && '🛞 4x4 Offroad'}
                  {selection.drive === 'Legged' && '🕷️ Legged Walk'}
                  {selection.drive === 'Tracked' && '🚜 Tank Treads'}
                  {!selection.drive && '❓ No Drive'}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Track Timeline Bar (Bottom) */}
          <div className="relative z-20 space-y-1">
            <div className="h-3 bg-slate-950 border border-slate-800 rounded-full w-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live Checkpoints Diagnostic Log Feed */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Live Mission Diagnostic Telemetry
          </h4>

          {evaluatedResults.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-slate-400 font-mono text-sm">
              Click <strong>"LAUNCH RUN"</strong> to watch your custom robot traverse the tactical mission course!
            </div>
          ) : (
            <div className="space-y-3">
              {evaluatedResults.map((res, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border font-mono text-sm space-y-1.5 transition-all ${
                    res.passed
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : 'bg-red-950/40 border-red-500/40 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-2 text-sm sm:text-base">
                      {res.icon} Checkpoint {idx + 1}: {res.name}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                        res.passed ? 'bg-emerald-950 border border-emerald-500 text-emerald-300' : 'bg-red-950 border border-red-500 text-red-300'
                      }`}
                    >
                      {res.passed ? '✓ PASSED' : '✕ FAILED'}
                    </span>
                  </div>
                  <p className="text-slate-200 font-sans text-sm italic leading-relaxed">
                    "{res.flavorText}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Post-Run Transition Footer */}
        {simulationFinished && (
          <div className="pt-4 border-t border-slate-800 relative z-20">
            {results.every((r) => r.passed) ? (
              <div className="bg-emerald-950/90 border-2 border-emerald-500 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-900 text-emerald-300 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold font-mono text-emerald-200">
                      MISSION ACCOMPLISHED! ALL 4 CHECKPOINTS PASSED!
                    </h4>
                    <p className="text-xs text-emerald-300/80 font-sans">
                      Your team's custom robot mastered all environmental challenges with maximum precision.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playClickSound();
                    onSimulationComplete(results, true);
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-mono font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] cursor-pointer"
                >
                  CALCULATE FINAL SCORE →
                </button>
              </div>
            ) : (
              <div className="bg-amber-950/90 border-2 border-amber-500 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(245,158,11,0.25)]">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-900 text-amber-300 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold font-mono text-amber-200">
                      {results.filter((r) => !r.passed).length} Checkpoint Failure(s) Recorded!
                    </h4>
                    <p className="text-xs text-amber-300/80 font-sans">
                      Enter Emergency Repair protocol to re-align circuitry & engineering components!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playClickSound();
                    onSimulationComplete(results, false);
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Wrench className="w-5 h-5 shrink-0" />
                  PROCEED TO REPAIR PROTOCOL →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
