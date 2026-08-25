import React, { useState } from 'react';
import { ComponentSelection, Mission, FinalOptimizationState } from '../types';
import { DRIVE_OPTIONS, BODY_OPTIONS, SENSOR_OPTIONS, GRIPPER_OPTIONS, MOTOR_OPTIONS } from '../data/components';
import { Scale, DollarSign, Zap, CheckCircle2, Sliders, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { playClickSound, playWireSuccessSound } from '../utils/audio';

interface FinalOptimizationProps {
  robot1Mission: Mission;
  robot1Selection: ComponentSelection;
  robot2Mission: Mission;
  robot2Selection: ComponentSelection;
  onCompleteOptimization: (bonusPoints: number) => void;
}

export const FinalOptimization: React.FC<FinalOptimizationProps> = ({
  robot1Mission,
  robot1Selection,
  robot2Mission,
  robot2Selection,
  onCompleteOptimization,
}) => {
  // Calculate base mass & cost for Robot 1 & Robot 2
  const getRobotMassCost = (sel: ComponentSelection) => {
    let mass = 0;
    let cost = 0;
    const d = DRIVE_OPTIONS.find((o) => o.id === sel.drive);
    const b = BODY_OPTIONS.find((o) => o.id === sel.body);
    const s = SENSOR_OPTIONS.find((o) => o.id === sel.sensor);
    const g = GRIPPER_OPTIONS.find((o) => o.id === sel.gripper);
    const m = MOTOR_OPTIONS.find((o) => o.id === sel.motor);

    if (d) { mass += d.massKg; cost += d.unitCost; }
    if (b) { mass += b.massKg; cost += b.unitCost; }
    if (s) { mass += s.massKg; cost += s.unitCost; }
    if (g) { mass += g.massKg; cost += g.unitCost; }
    if (m) { mass += m.massKg; cost += m.unitCost; }

    return { mass: mass || 25, cost: cost || 1600 };
  };

  const r1Base = getRobotMassCost(robot1Selection);
  const r2Base = getRobotMassCost(robot2Selection);
  const totalBaseMass = r1Base.mass + r2Base.mass;
  const totalBaseCost = r1Base.cost + r2Base.cost;

  // Interactive Sliders state
  const [weightReduction, setWeightReduction] = useState<number>(20); // target 20%
  const [costReduction, setCostReduction] = useState<number>(15);     // target 15%
  const [useTitaniumLightweighting, setUseTitaniumLightweighting] = useState<boolean>(true);
  const [useModularWiring, setUseModularWiring] = useState<boolean>(true);

  // Calculate current optimized metrics
  const currentMass = Math.max(5, Math.round(totalBaseMass * (1 - weightReduction / 100)));
  const currentCost = Math.max(100, Math.round(totalBaseCost * (1 - costReduction / 100)));

  // Performance degradation calculation:
  // Excessive weight reduction (>28%) or excessive cost cut (>25%) starts degrading performance
  const weightOvercut = Math.max(0, weightReduction - 25);
  const costOvercut = Math.max(0, costReduction - 22);
  const performanceIntegrity = Math.max(40, Math.min(100, 100 - weightOvercut * 3 - costOvercut * 4));

  // Optimization Score calculation out of 10 points
  let score = 0;
  if (weightReduction >= 20) score += 4;
  else score += Math.floor((weightReduction / 20) * 4);

  if (costReduction >= 15) score += 4;
  else score += Math.floor((costReduction / 15) * 4);

  if (performanceIntegrity >= 85) score += 2;
  else if (performanceIntegrity >= 70) score += 1;

  const handleFinish = () => {
    playWireSuccessSound();
    onCompleteOptimization(Math.min(10, score));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 border border-cyan-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase tracking-widest">
              STAGE 6 OF 7 • FINAL OPTIMIZATION CHALLENGE
            </span>
            <h1 className="text-2xl md:text-3xl font-black font-mono text-slate-100 uppercase tracking-tight">
              DUAL-ROBOT TRADE-OFF OPTIMIZATION
            </h1>
            <p className="text-slate-300 text-sm font-sans max-w-2xl leading-relaxed">
              Before final submission, tune the structural material density and component sourcing parameters for both{' '}
              <strong className="text-cyan-300">{robot1Mission.title}</strong> and{' '}
              <strong className="text-amber-300">{robot2Mission.title}</strong>.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-cyan-500/30 rounded-xl p-4 text-center shrink-0 min-w-[160px]">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">OPTIMIZATION SCORE</span>
            <span className="text-3xl font-black font-mono text-cyan-400">{score} / 10 PTS</span>
          </div>
        </div>
      </div>

      {/* Target Challenge Prompt Card */}
      <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-5 flex items-start gap-4">
        <Sliders className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
        <div>
          <h3 className="font-mono text-base font-bold text-amber-300 uppercase tracking-wide">
            🎯 MISSION DIRECTIVE: WEIGHT & COST REDUCTION
          </h3>
          <p className="text-slate-200 text-sm mt-1 leading-relaxed">
            Achieve at least a <strong className="text-emerald-400">20% Weight Reduction</strong> and{' '}
            <strong className="text-emerald-400">15% Cost Reduction</strong> across the dual-robot fleet without letting
            Performance Integrity drop below <strong className="text-amber-400">70%</strong>.
          </p>
        </div>
      </div>

      {/* Interactive Sliders & Gauges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Parameter Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-md">
          <h2 className="text-lg font-mono font-black text-slate-100 uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-5 h-5 text-cyan-400" />
            FLEET OPTIMIZATION CONTROLS
          </h2>

          {/* Weight Reduction Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-mono">
              <span className="text-slate-300 flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                Weight Reduction Target:
              </span>
              <span className="text-cyan-400 font-bold text-base">{weightReduction}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="1"
              value={weightReduction}
              onChange={(e) => {
                playClickSound();
                setWeightReduction(Number(e.target.value));
              }}
              className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono text-slate-500">
              <span>0% (Full Mass)</span>
              <span className="text-emerald-400 font-bold">20% Goal</span>
              <span>35% (Aggressive)</span>
            </div>
          </div>

          {/* Cost Reduction Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-mono">
              <span className="text-slate-300 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Component Cost Reduction:
              </span>
              <span className="text-emerald-400 font-bold text-base">{costReduction}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="1"
              value={costReduction}
              onChange={(e) => {
                playClickSound();
                setCostReduction(Number(e.target.value));
              }}
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono text-slate-500">
              <span>0% (Baseline)</span>
              <span className="text-emerald-400 font-bold">15% Goal</span>
              <span>35% (Budget Cut)</span>
            </div>
          </div>

          {/* Modular Options Toggles */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={useTitaniumLightweighting}
                onChange={(e) => {
                  playClickSound();
                  setUseTitaniumLightweighting(e.target.checked);
                }}
                className="w-4 h-4 accent-cyan-500 rounded"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-200 block">Honeycomb Topological Skeletoning</span>
                <span className="text-slate-400">Saves 3.5 kg frame weight without dropping payload yield.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={useModularWiring}
                onChange={(e) => {
                  playClickSound();
                  setUseModularWiring(e.target.checked);
                }}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-200 block">CAN-Bus Multiplex Wire Harness</span>
                <span className="text-slate-400">Reduces copper wire bundle weight by 1.8 kg and cuts cost by $120.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Right Column: Dynamic Engineering Metrics */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-md flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-lg font-mono font-black text-slate-100 uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
              <Zap className="w-5 h-5 text-amber-400" />
              SYSTEM METRICS & TRADE-OFF GAUGES
            </h2>

            {/* Combined Weight Metric */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase block">Total Dual-Robot Mass</span>
                <span className="text-2xl font-black font-mono text-slate-100">{currentMass} kg</span>
                <span className="text-xs text-slate-500 block">Original: {totalBaseMass} kg</span>
              </div>
              <div className="text-right">
                <span
                  className={`text-sm font-mono font-bold px-3 py-1 rounded-full border ${
                    weightReduction >= 20
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                      : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                  }`}
                >
                  {weightReduction >= 20 ? '✓ 20%+ Target Met' : `${weightReduction}% / 20%`}
                </span>
              </div>
            </div>

            {/* Combined Cost Metric */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase block">Total Hardware Unit Cost</span>
                <span className="text-2xl font-black font-mono text-slate-100">${currentCost}</span>
                <span className="text-xs text-slate-500 block">Original: ${totalBaseCost}</span>
              </div>
              <div className="text-right">
                <span
                  className={`text-sm font-mono font-bold px-3 py-1 rounded-full border ${
                    costReduction >= 15
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                      : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                  }`}
                >
                  {costReduction >= 15 ? '✓ 15%+ Target Met' : `${costReduction}% / 15%`}
                </span>
              </div>
            </div>

            {/* Performance Integrity Gauge */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-slate-300 uppercase font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Performance Integrity Rating
                </span>
                <span
                  className={`font-black ${
                    performanceIntegrity >= 85
                      ? 'text-emerald-400'
                      : performanceIntegrity >= 70
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  {performanceIntegrity}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    performanceIntegrity >= 85
                      ? 'bg-emerald-500'
                      : performanceIntegrity >= 70
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${performanceIntegrity}%` }}
                />
              </div>
              {performanceIntegrity < 70 && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-red-400 pt-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Warning: Over-thinning structure degrades motor payload reliability!</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleFinish}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-black uppercase text-base tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer mt-4"
          >
            <span>LOCK OPTIMIZATION & SUBMIT BOTH ROBOTS</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
