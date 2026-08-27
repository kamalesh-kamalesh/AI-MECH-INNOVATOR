import React from 'react';
import { playClickSound } from '../utils/audio';
import {
  BookOpen,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Bot,
  Trophy,
  BrainCircuit,
  Wrench,
  Clock,
  Layers,
  HelpCircle,
  AlertTriangle,
  Cpu,
  Users
} from 'lucide-react';

interface InstructionsPageProps {
  teamName: string;
  member1?: string;
  member2?: string;
  onProceed: () => void;
}

export const InstructionsPage: React.FC<InstructionsPageProps> = ({
  teamName,
  member1,
  member2,
  onProceed,
}) => {
  const handleProceed = () => {
    playClickSound();
    onProceed();
  };

  const steps = [
    {
      step: '01',
      title: 'MISSION BRIEFING',
      desc: 'Analyze environmental hazards, terrain incline, payload weight, and track constraints for Robot 1 and Robot 2.',
      icon: <BookOpen className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-300',
    },
    {
      step: '02',
      title: 'ROBOT 1 BUILD & WIRING',
      desc: 'Select chassis, drive motors, grippers, and sensors. Connect circuit board power, ground, and signal lines accurately.',
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
      color: 'border-blue-500/30 bg-blue-950/20 text-blue-300',
    },
    {
      step: '03',
      title: 'SIMULATION & EMERGENCY REPAIR',
      desc: 'Run Robot 1 through mission simulation track. If wiring or components fail, diagnose faults and perform emergency repairs.',
      icon: <Wrench className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-950/20 text-amber-300',
    },
    {
      step: '04',
      title: 'ROBOT 2 BUILD & WIRING',
      desc: 'Design and wire Robot 2 for a secondary hazardous or specialized mission requiring different drive & sensor choices.',
      icon: <Bot className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/30 bg-purple-950/20 text-purple-300',
    },
    {
      step: '05',
      title: 'SIMULATION & REPAIR 2',
      desc: 'Stress-test Robot 2 in extreme obstacle zones. Monitor real-time telemetry, detect circuit shorts, and repair issues.',
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      color: 'border-indigo-500/30 bg-indigo-950/20 text-indigo-300',
    },
    {
      step: '06',
      title: 'MASS & COST OPTIMIZATION',
      desc: 'Refine both robot designs to achieve up to 20% mass reduction and 15% cost savings for bonus optimization points.',
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300',
    },
    {
      step: '07',
      title: 'FINAL SCOREBOARD & RANKING',
      desc: 'Review your total 100-point performance breakdown and claim your rank on the live event leaderboard.',
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/40 bg-amber-950/30 text-amber-200',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 border-2 border-cyan-500/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.2)] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-950 rounded-xl border border-cyan-500/40 shadow-inner">
              <BookOpen className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">
                COMPETITION GUIDE & RULES
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight">
                AI MECH INNOVATOR INSTRUCTIONS
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs font-bold text-amber-300">
            <Users className="w-4 h-4 text-amber-400" />
            <span>TEAM: {teamName || 'UNREGISTERED'}</span>
          </div>
        </div>

        {/* Team Welcome Sub-banner */}
        <div className="bg-slate-950/90 p-4 rounded-xl border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
          <div>
            <p className="font-bold text-slate-100 text-sm">
              Welcome aboard, Team <span className="text-cyan-400">{teamName || 'Engineers'}</span>!
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Engineers: {member1 || 'Engineer 1'} {member2 ? `& ${member2}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 text-cyan-300 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-500/30 font-bold shrink-0">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Match Duration: 40 Minutes</span>
          </div>
        </div>
      </div>

      {/* 100-Point Scoring System Cards */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-200">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-black uppercase tracking-wider text-slate-100">
            100-POINT SCORING BREAKDOWN
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-900/90 p-4 rounded-xl border border-cyan-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase">ROBOT 1 CHALLENGE</span>
              <span className="text-lg font-black text-cyan-300">40 PTS</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-snug">
              Functionality, component selection, circuit wiring precision & repair speed.
            </p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-amber-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase">ROBOT 2 INNOVATION</span>
              <span className="text-lg font-black text-amber-300">40 PTS</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-snug">
              Adaptability, terrain handling, obstacle clearance & circuit stability.
            </p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-purple-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase">AI STRATEGY</span>
              <span className="text-lg font-black text-purple-300">10 PTS</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-snug">
              Smart utilization of AI Engineer consult credits (5 credits maximum).
            </p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase">OPTIMIZATION</span>
              <span className="text-lg font-black text-emerald-300">10 PTS</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-snug">
              Mass reduction (-20%) and budget cost reduction (-15%) efficiency bonuses.
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Competition Flow */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-200">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-black uppercase tracking-wider text-slate-100">
            CHALLENGE ROADMAP & STAGES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {steps.map((item) => (
            <div
              key={item.step}
              className={`p-4 rounded-xl border bg-slate-900/80 space-y-2 relative transition-all hover:border-cyan-400/50 ${item.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black font-mono tracking-widest text-slate-500">
                  STAGE {item.step}
                </span>
                <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                  {item.icon}
                </div>
              </div>

              <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-tight">
                {item.title}
              </h3>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Tips & Rules */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-3 shadow-md">
        <div className="flex items-center gap-2 text-amber-400">
          <Sparkles className="w-5 h-5" />
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
            PRO-TIPS FOR COMPETITORS
          </h3>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 font-sans">
          <li className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="font-mono text-cyan-400 font-bold block">1. AI Credits Budget</span>
            <span>You have 5 AI consult credits total across both robots. Ask specific engineering questions to optimize design!</span>
          </li>
          <li className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="font-mono text-amber-400 font-bold block">2. Precise Circuit Wiring</span>
            <span>Double check motor, sensor, and battery power polarity. Short circuits trigger test failures and repair penalties.</span>
          </li>
          <li className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="font-mono text-emerald-400 font-bold block">3. Mass vs. Torque</span>
            <span>Heavy chassis require high-torque motors. Lighter chassis increase speed and qualify for mass optimization bonus.</span>
          </li>
        </ul>
      </div>

      {/* Proceed CTA Button */}
      <div className="pt-2 text-center">
        <button
          onClick={handleProceed}
          className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-base uppercase tracking-wider inline-flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xl shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.99]"
        >
          <Zap className="w-5 h-5 fill-slate-950 shrink-0" />
          <span>UNDERSTOOD — PROCEED TO MISSION BRIEFING</span>
          <ArrowRight className="w-5 h-5 shrink-0" />
        </button>
      </div>
    </div>
  );
};
