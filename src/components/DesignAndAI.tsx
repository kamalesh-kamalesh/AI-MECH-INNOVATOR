import React, { useState } from 'react';
import { Mission, ComponentSelection, DriveType, BodyType, SensorType, GripperType, MotorPowerType, ChatMessage, GameRound } from '../types';
import { DRIVE_OPTIONS, BODY_OPTIONS, SENSOR_OPTIONS, GRIPPER_OPTIONS, MOTOR_OPTIONS } from '../data/components';
import { playClickSound } from '../utils/audio';
import { RoundHeader } from './RoundHeader';
import {
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Disc,
  CircleDot,
  Footprints,
  Layers,
  Feather,
  Shield,
  Box,
  Radio,
  Eye,
  Camera,
  Hand,
  Scissors,
  Magnet,
  Zap,
  Activity,
  Target,
  Bot,
  User,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface DesignAndAIProps {
  currentRound: GameRound;
  mission: Mission;
  selection: ComponentSelection;
  aiCredits: number;
  chatHistory: ChatMessage[];
  onSelectComponent: (type: 'drive' | 'body' | 'sensor' | 'gripper' | 'motor', value: string) => void;
  onSendAiQuestion: (question: string, provider?: 'nvidia' | 'gemini') => Promise<void>;
  onProceedToWiring: () => void;
}

const OPTION_ICONS: Record<string, React.ReactNode> = {
  Disc: <Disc className="w-5 h-5" />,
  CircleDot: <CircleDot className="w-5 h-5" />,
  Footprints: <Footprints className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Feather: <Feather className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Box: <Box className="w-5 h-5" />,
  Radio: <Radio className="w-5 h-5" />,
  Eye: <Eye className="w-5 h-5" />,
  Camera: <Camera className="w-5 h-5" />,
  Hand: <Hand className="w-5 h-5" />,
  Scissors: <Scissors className="w-5 h-5" />,
  Magnet: <Magnet className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
};

export const DesignAndAI: React.FC<DesignAndAIProps> = ({
  currentRound,
  mission,
  selection,
  aiCredits,
  chatHistory,
  onSelectComponent,
  onSendAiQuestion,
  onProceedToWiring,
}) => {
  const [questionInput, setQuestionInput] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'nvidia' | 'gemini'>('nvidia');
  const [expandedReasoningIds, setExpandedReasoningIds] = useState<Record<string, boolean>>({});

  const toggleReasoning = (id: string) => {
    setExpandedReasoningIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isAllSelected = Boolean(
    selection.drive && selection.body && selection.sensor && selection.gripper && selection.motor
  );

  const handleAskQuestion = async (textToAsk?: string) => {
    const questionText = textToAsk || questionInput.trim();
    if (!questionText || aiCredits <= 0 || isAsking) return;

    playClickSound();
    setIsAsking(true);
    setQuestionInput('');

    try {
      await onSendAiQuestion(questionText, selectedProvider);
    } catch (error) {
      console.error('Failed asking AI question:', error);
    } finally {
      setIsAsking(false);
    }
  };

  const sampleQuestions = [
    `Which drive performs best in ${mission.environment}?`,
    `How does payload mass affect our body frame choice?`,
    `Which sensor detects targets in dust or darkness?`,
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-6">
      <RoundHeader currentRound={currentRound} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Component Selection Sections */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Drive Selection */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-base font-bold text-slate-200 font-mono uppercase tracking-wide">
                  Drive Locomotion System
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                Selected: {selection.drive || 'None'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DRIVE_OPTIONS.map((opt) => {
                const isSelected = selection.drive === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      playClickSound();
                      onSelectComponent('drive', opt.id);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-400 text-slate-100 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-cyan-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold text-base">
                          {OPTION_ICONS[opt.icon]}
                          <span>{opt.title}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">${opt.unitCost}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{opt.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body Selection */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-950 border border-amber-500/40 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-base font-bold text-slate-200 font-mono uppercase tracking-wide">
                  Chassis Frame & Armor
                </h3>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold">
                Selected: {selection.body || 'None'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BODY_OPTIONS.map((opt) => {
                const isSelected = selection.body === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      playClickSound();
                      onSelectComponent('body', opt.id);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-950/70 border-amber-400 text-slate-100 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-amber-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-300 font-mono font-bold text-base">
                          {OPTION_ICONS[opt.icon]}
                          <span>{opt.title}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">${opt.unitCost}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{opt.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sensor Selection */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-base font-bold text-slate-200 font-mono uppercase tracking-wide">
                  Primary Sensor Suite
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Selected: {selection.sensor || 'None'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SENSOR_OPTIONS.map((opt) => {
                const isSelected = selection.sensor === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      playClickSound();
                      onSelectComponent('sensor', opt.id);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-400 text-slate-100 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-300 font-mono font-bold text-base">
                          {OPTION_ICONS[opt.icon]}
                          <span>{opt.title}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">${opt.unitCost}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{opt.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gripper Selection */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-purple-950 border border-purple-500/40 text-purple-400 font-mono text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h3 className="text-base font-bold text-slate-200 font-mono uppercase tracking-wide">
                  Gripper / Manipulator End-Effector
                </h3>
              </div>
              <span className="text-xs font-mono text-purple-400 font-bold">
                Selected: {selection.gripper || 'None'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {GRIPPER_OPTIONS.map((opt) => {
                const isSelected = selection.gripper === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      playClickSound();
                      onSelectComponent('gripper', opt.id);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-950/70 border-purple-400 text-slate-100 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-purple-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-purple-300 font-mono font-bold text-base">
                          {OPTION_ICONS[opt.icon]}
                          <span>{opt.title}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">${opt.unitCost}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{opt.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Motor Power Selection */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-red-950 border border-red-500/40 text-red-400 font-mono text-xs font-bold flex items-center justify-center">
                  5
                </span>
                <h3 className="text-base font-bold text-slate-200 font-mono uppercase tracking-wide">
                  Motor Actuators & Power Unit
                </h3>
              </div>
              <span className="text-xs font-mono text-red-400 font-bold">
                Selected: {selection.motor || 'None'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MOTOR_OPTIONS.map((opt) => {
                const isSelected = selection.motor === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      playClickSound();
                      onSelectComponent('motor', opt.id);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-red-950/70 border-red-400 text-slate-100 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-red-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-red-300 font-mono font-bold text-base">
                          {OPTION_ICONS[opt.icon]}
                          <span>{opt.title}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">${opt.unitCost}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{opt.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lock Design & Proceed Button */}
          <button
            onClick={() => {
              playClickSound();
              onProceedToWiring();
            }}
            disabled={!isAllSelected}
            className={`w-full py-4 px-6 rounded-xl font-mono font-black text-base tracking-wider uppercase flex items-center justify-center gap-3 transition-all ${
              isAllSelected
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer hover:scale-[1.01]'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            {isAllSelected ? 'LOCK COMPONENTS → WIRING PUZZLE' : 'SELECT ALL 5 COMPONENTS TO PROCEED'}
            <ArrowRight className="w-5 h-5 shrink-0" />
          </button>
        </div>

        {/* Right Column: AI Engineer Assistant */}
        <div className="lg:col-span-5 xl:col-span-4 bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-5 flex flex-col h-[680px] shadow-[0_0_20px_rgba(6,182,212,0.1)] sticky top-20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-mono uppercase flex items-center gap-1.5">
                  AI Engineer Assistant
                  <span className="text-[9px] bg-emerald-950 border border-emerald-500/40 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                    NVIDIA NIM
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">Powered by NVIDIA Nemotron 30B & Gemini</p>
              </div>
            </div>

            {/* Credit Pips (5 Credits Total) */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 font-mono text-xs text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Credits:</span>
              <div className="flex gap-1 ml-1">
                {[1, 2, 3, 4, 5].map((p) => (
                  <span
                    key={p}
                    className={`w-2.5 h-4 rounded-xs transition-all ${
                      p <= aiCredits
                        ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]'
                        : 'bg-slate-800 border border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Provider Selector Switcher */}
          <div className="mb-3 flex items-center justify-between bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-[10px] text-slate-400 px-2 uppercase font-bold">Engine:</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setSelectedProvider('nvidia');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  selectedProvider === 'nvidia'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>⚡ NVIDIA Nemotron</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setSelectedProvider('gemini');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  selectedProvider === 'gemini'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>✨ Gemini Flash</span>
              </button>
            </div>
          </div>

          <div className="mb-3 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-cyan-400" /> Tactical Questions (1 Credit):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskQuestion(q)}
                  disabled={aiCredits <= 0 || isAsking}
                  className="text-[11px] font-mono bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/40 px-2 py-1 rounded transition-colors text-left truncate max-w-full disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 font-sans text-xs scrollbar-thin">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500 space-y-2">
                <Bot className="w-8 h-8 text-slate-600" />
                <p className="font-mono text-xs text-slate-300">
                  Ask the NVIDIA Nemotron AI Engineer technical questions!
                </p>
                <p className="text-[11px] text-slate-500">
                  You have {aiCredits} / 5 credits available for the 2-robot match.
                </p>
              </div>
            ) : (
              chatHistory.map((msg) => {
                const isExpanded = Boolean(expandedReasoningIds[msg.id]);
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-6 h-6 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed font-sans ${
                        msg.sender === 'user'
                          ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-100 rounded-tr-none font-mono'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-1 mb-1.5 text-[9px] font-mono text-slate-500">
                        <span>{msg.sender === 'user' ? 'TEAM QUERY' : (msg.provider || 'AI ENGINEER')}</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Display NVIDIA Nemotron Reasoning if available */}
                      {msg.reasoning && (
                        <div className="mb-2 bg-slate-950/90 border border-emerald-500/30 rounded-lg p-2 font-mono text-[11px] text-emerald-300/90">
                          <button
                            type="button"
                            onClick={() => toggleReasoning(msg.id)}
                            className="flex items-center justify-between w-full font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                          >
                            <span className="flex items-center gap-1">
                              🧠 Nemotron Thinking Trace ({msg.reasoning.length} chars)
                            </span>
                            <span>{isExpanded ? '▲ Hide' : '▼ Expand'}</span>
                          </button>
                          {isExpanded && (
                            <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-slate-400 whitespace-pre-wrap max-h-36 overflow-y-auto scrollbar-thin leading-snug">
                              {msg.reasoning}
                            </div>
                          )}
                        </div>
                      )}

                      <div>{msg.text}</div>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-6 h-6 rounded bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {isAsking && (
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs p-2 bg-emerald-950/40 rounded-lg border border-emerald-500/30 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>NVIDIA Nemotron 3.5 Lightning reasoning over hardware specs...</span>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800">
            {aiCredits <= 0 ? (
              <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 text-amber-300 font-mono text-xs text-center flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                All 5 AI Credits Used for this Event Match!
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskQuestion();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder={`Ask ${selectedProvider === 'nvidia' ? 'NVIDIA Nemotron' : 'Gemini'} about hardware specs...`}
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 outline-none placeholder:text-slate-600"
                  disabled={isAsking || aiCredits <= 0}
                />
                <button
                  type="submit"
                  disabled={!questionInput.trim() || isAsking || aiCredits <= 0}
                  className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isAsking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};


