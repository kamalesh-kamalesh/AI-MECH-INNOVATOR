import React, { useState } from 'react';
import { Mission } from '../types';
import { ROBOT1_MISSIONS, ROBOT2_MISSIONS } from '../data/missions';
import { playClickSound } from '../utils/audio';
import { RoundHeader } from './RoundHeader';
import {
  PackageSearch,
  Flame,
  Cpu,
  Pipette,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  AlertTriangle,
  Bot,
  Trophy,
  BrainCircuit,
  Sliders,
  Clock,
  Zap,
  HelpCircle
} from 'lucide-react';

interface MissionBriefingProps {
  robot1Mission: Mission;
  robot2Mission: Mission;
  teamName: string;
  onSetTeamName: (name: string) => void;
  onSelectRobot1Mission: (m: Mission) => void;
  onSelectRobot2Mission: (m: Mission) => void;
  onAcceptMissions?: () => void;
  onAcceptMission?: () => void;
}

const MISSION_ICONS: Record<string, React.ReactNode> = {
  PackageSearch: <PackageSearch className="w-8 h-8 text-cyan-400" />,
  Flame: <Flame className="w-8 h-8 text-amber-400" />,
  Cpu: <Cpu className="w-8 h-8 text-purple-400" />,
  Pipette: <Pipette className="w-8 h-8 text-cyan-400" />,
};

export const MissionBriefing: React.FC<MissionBriefingProps> = ({
  robot1Mission,
  robot2Mission,
  teamName,
  onSetTeamName,
  onSelectRobot1Mission,
  onSelectRobot2Mission,
  onAcceptMissions,
  onAcceptMission,
}) => {
  const [inputName, setInputName] = useState(teamName || '');
  const [nameError, setNameError] = useState('');

  const handleStartGame = () => {
    playClickSound();
    const trimmed = inputName.trim();
    if (!trimmed) {
      setNameError('Please enter a team name to proceed!');
      return;
    }
    setNameError('');
    onSetTeamName(trimmed);
    const acceptFn = onAcceptMissions || onAcceptMission;
    if (acceptFn) {
      acceptFn();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-6">
      {/* 1. Round Header */}
      <RoundHeader currentRound={1} />

      {/* 2. Hero Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border-2 border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_25px_rgba(6,182,212,0.15)] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-950 rounded-xl border border-cyan-500/30">
              <Bot className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                ROBOTICS CLUB EVENT CHALLENGE
              </span>
              <h1 className="text-2xl sm:text-3xl font-black font-mono text-slate-100 uppercase tracking-tight">
                AI MECH INNOVATOR — 2 ROBOT CHALLENGE
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>40 MINUTES MATCH TIME</span>
          </div>
        </div>

        {/* 100-Point Scoring & Rules Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-cyan-500/20 text-center">
            <span className="text-[11px] font-mono text-slate-400 uppercase block font-bold">ROBOT 1 CHALLENGE</span>
            <span className="text-xl font-black font-mono text-cyan-400">40 PTS</span>
            <span className="text-[10px] text-slate-500 block">Function, Component & Repair</span>
          </div>
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-amber-500/20 text-center">
            <span className="text-[11px] font-mono text-slate-400 uppercase block font-bold">ROBOT 2 INNOVATION</span>
            <span className="text-xl font-black font-mono text-amber-400">40 PTS</span>
            <span className="text-[10px] text-slate-500 block">Innovation, Adaptability & Repair</span>
          </div>
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-purple-500/20 text-center">
            <span className="text-[11px] font-mono text-slate-400 uppercase block font-bold">AI STRATEGY</span>
            <span className="text-xl font-black font-mono text-purple-400">10 PTS</span>
            <span className="text-[10px] text-slate-500 block">5 Credits Limit per Team</span>
          </div>
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-emerald-500/20 text-center">
            <span className="text-[11px] font-mono text-slate-400 uppercase block font-bold">FINAL OPTIMIZATION</span>
            <span className="text-xl font-black font-mono text-emerald-400">10 PTS</span>
            <span className="text-[10px] text-slate-500 block">Mass & Cost Reduction</span>
          </div>
        </div>
      </div>

      {/* 3. The 2 Robot Missions Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Robot 1 Mission Card */}
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 space-y-4 shadow-md relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              🤖 ROBOT 1 — BUILD CHALLENGE
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">{robot1Mission.difficulty}</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
              {MISSION_ICONS[robot1Mission.icon] || <PackageSearch className="w-8 h-8 text-cyan-400" />}
            </div>
            <div>
              <h3 className="text-lg font-bold font-mono text-slate-100 uppercase">{robot1Mission.title}</h3>
              <p className="text-xs font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{robot1Mission.environment}</span>
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-300 font-sans leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
            "{robot1Mission.brief}"
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">Select Build Challenge Variant:</span>
            <div className="grid grid-cols-2 gap-2">
              {ROBOT1_MISSIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    playClickSound();
                    onSelectRobot1Mission(m);
                  }}
                  className={`p-2 rounded-xl text-left font-mono text-xs border transition-all ${
                    m.id === robot1Mission.id
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="block truncate">{m.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Robot 2 Mission Card */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 space-y-4 shadow-md relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
              🤖 ROBOT 2 — INNOVATION CHALLENGE
            </span>
            <span className="text-xs font-mono text-amber-400 font-bold">{robot2Mission.difficulty}</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
              {MISSION_ICONS[robot2Mission.icon] || <Flame className="w-8 h-8 text-amber-400" />}
            </div>
            <div>
              <h3 className="text-lg font-bold font-mono text-slate-100 uppercase">{robot2Mission.title}</h3>
              <p className="text-xs font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{robot2Mission.environment}</span>
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-300 font-sans leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
            "{robot2Mission.brief}"
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">Select Innovation Variant:</span>
            <div className="grid grid-cols-2 gap-2">
              {ROBOT2_MISSIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    playClickSound();
                    onSelectRobot2Mission(m);
                  }}
                  className={`p-2 rounded-xl text-left font-mono text-xs border transition-all ${
                    m.id === robot2Mission.id
                      ? 'bg-amber-950 border-amber-400 text-amber-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="block truncate">{m.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Team Name Input & Action Button */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-md">
        <label className="block space-y-2">
          <span className="text-xs font-mono uppercase text-slate-200 font-bold flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            REGISTER YOUR TEAM NAME (2–3 PARTICIPANTS):
          </span>
          <input
            type="text"
            value={inputName}
            onChange={(e) => {
              setInputName(e.target.value);
              if (e.target.value.trim()) setNameError('');
            }}
            placeholder="e.g. Mech Titans 🤖"
            className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-3 text-slate-100 font-mono text-base outline-none transition-all placeholder:text-slate-600"
            maxLength={30}
          />
          {nameError && (
            <p className="text-xs font-mono text-red-400 flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {nameError}
            </p>
          )}
        </label>

        <button
          onClick={handleStartGame}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-black text-base sm:text-lg tracking-wider uppercase flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          ACCEPT MISSIONS → START ROBOT 1 BUILD
          <ArrowRight className="w-6 h-6 shrink-0" />
        </button>
      </div>
    </div>
  );
};


