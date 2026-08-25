import React, { useState } from 'react';
import { ChallengeConfig } from '../../types';
import { ROBOT1_MISSIONS, ROBOT2_MISSIONS } from '../../data/missions';
import { playClickSound } from '../../utils/audio';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';

interface ChallengeManagementProps {
  config: ChallengeConfig;
  onUpdateConfig: (newConfig: ChallengeConfig) => void;
}

export const ChallengeManagement: React.FC<ChallengeManagementProps> = ({
  config,
  onUpdateConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'r1' | 'r2'>('r1');
  const [localConfig, setLocalConfig] = useState<ChallengeConfig>(config);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Collapsible state
  const [openSection, setOpenSection] = useState<'mission' | 'time' | 'ai' | 'components' | 'scoring' | null>('mission');

  const selectedR1Mission =
    ROBOT1_MISSIONS.find((m) => m.id === localConfig.robot1MissionId) || ROBOT1_MISSIONS[0];
  const selectedR2Mission =
    ROBOT2_MISSIONS.find((m) => m.id === localConfig.robot2MissionId) || ROBOT2_MISSIONS[0];

  const handleSave = () => {
    playClickSound();
    onUpdateConfig(localConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const toggleSection = (sec: 'mission' | 'time' | 'ai' | 'components' | 'scoring') => {
    playClickSound();
    setOpenSection(openSection === sec ? null : sec);
  };

  const activeMission = activeTab === 'r1' ? selectedR1Mission : selectedR2Mission;

  return (
    <div className="space-y-6 font-mono max-w-4xl">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            CHALLENGE CONFIGURATION
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure missions, time limits, AI credits, and scoring parameter rules
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" /> Saved
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold transition-colors cursor-pointer"
          >
            Save Rules
          </button>
        </div>
      </div>

      {/* Tabs: ROBOT 1 / ROBOT 2 */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => {
            playClickSound();
            setActiveTab('r1');
          }}
          className={`px-6 py-2.5 text-xs font-bold uppercase transition-colors cursor-pointer border-b-2 ${
            activeTab === 'r1'
              ? 'border-cyan-400 text-cyan-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          ROBOT 1 — PICK & PLACE
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('r2');
          }}
          className={`px-6 py-2.5 text-xs font-bold uppercase transition-colors cursor-pointer border-b-2 ${
            activeTab === 'r2'
              ? 'border-purple-400 text-purple-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          ROBOT 2 — RECON DRONE
        </button>
      </div>

      {/* Collapsible Sections */}
      <div className="space-y-3">
        {/* Mission Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('mission')}
            className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-200 hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>Mission</span>
              <span className="text-slate-400 font-normal">({activeMission.title})</span>
            </div>
            {openSection === 'mission' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {openSection === 'mission' && (
            <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">
                  Active Mission Profile
                </label>
                <select
                  value={activeTab === 'r1' ? localConfig.robot1MissionId : localConfig.robot2MissionId}
                  onChange={(e) => {
                    if (activeTab === 'r1') {
                      setLocalConfig({ ...localConfig, robot1MissionId: e.target.value });
                    } else {
                      setLocalConfig({ ...localConfig, robot2MissionId: e.target.value });
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-100 font-medium outline-none focus:border-cyan-500"
                >
                  {(activeTab === 'r1' ? ROBOT1_MISSIONS : ROBOT2_MISSIONS).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.difficulty})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Description</span>
                <p className="text-slate-300 leading-relaxed bg-slate-900 p-3 rounded border border-slate-800">
                  {activeMission.brief}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Time Limit Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('time')}
            className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-200 hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>Time Limit</span>
              <span className="text-slate-400 font-normal">({localConfig.timeLimitMinutes} minutes)</span>
            </div>
            {openSection === 'time' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {openSection === 'time' && (
            <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3 text-xs">
              <div className="max-w-xs space-y-1">
                <label className="block text-slate-400 text-[10px] uppercase font-bold">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  value={localConfig.timeLimitMinutes}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, timeLimitMinutes: parseInt(e.target.value) || 15 })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-100 font-bold outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* AI Credits Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('ai')}
            className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-200 hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>AI Credits</span>
              <span className="text-slate-400 font-normal">({localConfig.maxAiCredits} credits max)</span>
            </div>
            {openSection === 'ai' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {openSection === 'ai' && (
            <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3 text-xs">
              <div className="max-w-xs space-y-1">
                <label className="block text-slate-400 text-[10px] uppercase font-bold">
                  Max AI Consultations Allowed Per Team
                </label>
                <input
                  type="number"
                  value={localConfig.maxAiCredits}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, maxAiCredits: parseInt(e.target.value) || 5 })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-100 font-bold outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Available Components */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('components')}
            className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-200 hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>Available Components</span>
              <span className="text-slate-400 font-normal">(4 categories)</span>
            </div>
            {openSection === 'components' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {openSection === 'components' && (
            <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-cyan-400 font-bold block mb-1">Drive Systems</span>
                  <span className="text-slate-300">Differential, Mecanum, Tank Tread, Quad-Rotor</span>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-cyan-400 font-bold block mb-1">Chassis / Body</span>
                  <span className="text-slate-300">Aluminium Frame, Carbon Fiber, Reinforced Steel</span>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-cyan-400 font-bold block mb-1">Sensors</span>
                  <span className="text-slate-300">LiDAR Scanner, Ultrasonic Array, Stereo Vision</span>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-cyan-400 font-bold block mb-1">Actuators</span>
                  <span className="text-slate-300">Vacuum Gripper, 2-Finger Claw, High-Torque Servo</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scoring Rules Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('scoring')}
            className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-200 hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>Scoring Rules</span>
              <span className="text-slate-400 font-normal">(Max 100 points)</span>
            </div>
            {openSection === 'scoring' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {openSection === 'scoring' && (
            <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3 text-xs">
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>Robot 1 Build & Simulation</span>
                  <strong className="text-cyan-400">40 Points</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>Robot 2 Build & Innovation</span>
                  <strong className="text-purple-400">40 Points</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>AI Consultation Strategy</span>
                  <strong className="text-amber-400">10 Points</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Code Optimization & Efficiency</span>
                  <strong className="text-emerald-400">10 Points</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
