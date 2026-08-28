import React, { useState, useEffect } from 'react';
import {
  AdminTeam,
  ChallengeConfig,
  SystemServiceStatus,
  TeamStatus
} from '../../types';
import {
  INITIAL_ADMIN_TEAMS,
  INITIAL_CHALLENGE_CONFIG,
  INITIAL_SYSTEM_STATUS
} from '../../data/adminMockData';
import { AdminOverview } from './AdminOverview';
import { LiveTeamMonitor } from './LiveTeamMonitor';
import { TeamDetailModal } from './TeamDetailModal';
import { RoundControl } from './RoundControl';
import { AIUsageMonitor } from './AIUsageMonitor';
import { AdminScoreboard } from './AdminScoreboard';
import { ChallengeManagement } from './ChallengeManagement';
import { AdminResults } from './AdminResults';
import { playClickSound } from '../../utils/audio';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  PlayCircle,
  Sparkles,
  Trophy,
  Sliders,
  Award,
  Settings,
  LogOut,
  Monitor,
  Clock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

import { onTeamsChange, clearAll } from '../../firebase';

interface AdminDashboardProps {
  onLogout: () => void;
  onSwitchToPlayerMode: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onSwitchToPlayerMode,
}) => {
  // Master State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [teams, setTeams] = useState<AdminTeam[]>(INITIAL_ADMIN_TEAMS);
  const [systemStatus, setSystemStatus] = useState<SystemServiceStatus>(INITIAL_SYSTEM_STATUS);
  const [challengeConfig, setChallengeConfig] = useState<ChallengeConfig>(INITIAL_CHALLENGE_CONFIG);

  // Round Control State
  const [currentRoundName, setCurrentRoundName] = useState('ROBOT 1 — BUILD & TEST');
  const [roundStatus, setRoundStatus] = useState<'ACTIVE' | 'PAUSED' | 'ENDED'>('ACTIVE');
  const [masterTimerSeconds, setMasterTimerSeconds] = useState(2700); // 45 mins
  const [scoresVisibleToPlayers, setScoresVisibleToPlayers] = useState(true);
  const [resultsLocked, setResultsLocked] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Modal State for inspecting individual team
  const [selectedTeam, setSelectedTeam] = useState<AdminTeam | null>(null);

  // Live Clock
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Firebase real-time listener for teams
  useEffect(() => {
    const unsub = onTeamsChange((liveTeams) => {
      if (Array.isArray(liveTeams) && liveTeams.length > 0) {
        setTeams(liveTeams);
      }
    });

    return () => unsub();
  }, []);

  const handleResetCompetition = async () => {
    playClickSound();
    setTeams([]);
    setMasterTimerSeconds(2700);
    setRoundStatus('ACTIVE');
    setCurrentRoundName('ROBOT 1 — BUILD & TEST');
    setSelectedTeam(null);
    setShowResetModal(false);

    // Clear Firebase data directly
    await clearAll();
  };

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Simulated Real-Time Engine (ticks timers down & simulates live updates)
  useEffect(() => {
    if (roundStatus !== 'ACTIVE') return;

    const timer = setInterval(() => {
      setMasterTimerSeconds((prev) => Math.max(0, prev - 1));

      setTeams((prevTeams) =>
        prevTeams.map((team) => {
          if (team.status === 'ACTIVE' || team.status === 'TESTING') {
            const newTime = Math.max(0, team.timeRemainingSeconds - 1);
            return {
              ...team,
              timeRemainingSeconds: newTime,
            };
          }
          return team;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [roundStatus]);

  // Telemetry Counts
  const totalTeamsCount = teams.length;
  const activeTeamsCount = teams.filter(
    (t) => t.status === 'ACTIVE' || t.status === 'TESTING'
  ).length;
  const completedTeamsCount = teams.filter((t) => t.status === 'COMPLETED').length;

  // Toggle Service Health
  const handleToggleService = (serviceKey: keyof SystemServiceStatus) => {
    setSystemStatus((prev) => ({
      ...prev,
      [serviceKey]: !prev[serviceKey],
    }));
  };

  // Team Control Handlers
  const handlePauseTeam = (teamId: string) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, status: 'PAUSED' as TeamStatus } : t))
    );
    if (selectedTeam?.id === teamId) {
      setSelectedTeam((prev) => (prev ? { ...prev, status: 'PAUSED' as TeamStatus } : null));
    }
  };

  const handleResumeTeam = (teamId: string) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, status: 'ACTIVE' as TeamStatus } : t))
    );
    if (selectedTeam?.id === teamId) {
      setSelectedTeam((prev) => (prev ? { ...prev, status: 'ACTIVE' as TeamStatus } : null));
    }
  };

  const handleAddTime = (teamId: string, minutes: number) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? { ...t, timeRemainingSeconds: t.timeRemainingSeconds + minutes * 60 }
          : t
      )
    );
    if (selectedTeam?.id === teamId) {
      setSelectedTeam((prev) =>
        prev ? { ...prev, timeRemainingSeconds: prev.timeRemainingSeconds + minutes * 60 } : null
      );
    }
  };

  const handleResetChallenge = (teamId: string) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              currentStage: 'ROBOT1_BUILD',
              robot1: { ...t.robot1, testAttempts: 0, failuresCount: 0, repairsCount: 0, totalScore: 0, isComplete: false },
              totalScore: Math.max(0, t.totalScore - 30),
            }
          : t
      )
    );
    if (selectedTeam?.id === teamId) {
      setSelectedTeam(null);
    }
  };

  const handleForceSubmitTeam = (teamId: string) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              status: 'COMPLETED' as TeamStatus,
              currentStage: 'RESULTS',
              robot1: { ...t.robot1, isComplete: true },
              robot2: { ...t.robot2, isComplete: true },
            }
          : t
      )
    );
    if (selectedTeam?.id === teamId) {
      setSelectedTeam(null);
    }
  };

  const handleDisqualifyTeam = (teamId: string) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              status: 'DISCONNECTED' as TeamStatus,
              isDisqualified: true,
              totalScore: 0,
            }
          : t
      )
    );
    if (selectedTeam?.id === teamId) {
      setSelectedTeam(null);
    }
  };

  // Master Round Control Actions
  const handleStartRound = () => setRoundStatus('ACTIVE');
  const handlePauseAll = () => {
    setRoundStatus('PAUSED');
    setTeams((prev) => prev.map((t) => ({ ...t, status: 'PAUSED' as TeamStatus })));
  };
  const handleResumeAll = () => {
    setRoundStatus('ACTIVE');
    setTeams((prev) =>
      prev.map((t) => (t.status === 'PAUSED' ? { ...t, status: 'ACTIVE' as TeamStatus } : t))
    );
  };
  const handleMasterAddTimeMinutes = (minutes: number) => {
    setMasterTimerSeconds((prev) => prev + minutes * 60);
    setTeams((prev) =>
      prev.map((t) => ({ ...t, timeRemainingSeconds: t.timeRemainingSeconds + minutes * 60 }))
    );
  };
  const handleEndRound = () => {
    setRoundStatus('ENDED');
    setMasterTimerSeconds(0);
  };
  const handleForceSubmitAll = () => {
    setRoundStatus('ENDED');
    setTeams((prev) =>
      prev.map((t) => ({
        ...t,
        status: 'COMPLETED' as TeamStatus,
        currentStage: 'RESULTS',
        robot1: { ...t.robot1, isComplete: true },
        robot2: { ...t.robot2, isComplete: true },
      }))
    );
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'teams', label: 'Teams', icon: <Users className="w-4 h-4" />, badge: activeTeamsCount },
    { id: 'scoreboard', label: 'Scoreboard', icon: <Trophy className="w-4 h-4" /> },
    { id: 'round_control', label: 'Round Control', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'challenges', label: 'Challenges', icon: <Sliders className="w-4 h-4" /> },
    { id: 'results', label: 'Results', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono flex flex-col">
      {/* System Warning Banner if AI Service Down */}
      {!systemStatus.aiApi && (
        <div className="bg-amber-950 border-b border-amber-500/50 px-4 py-1.5 text-center text-xs text-amber-300 font-bold flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>⚠ AI SERVICE UNAVAILABLE — Fallback mode active</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Main Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wider text-slate-100 uppercase">
                AI MECH INNOVATOR — ADMIN CONTROL
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ● LIVE
                </span>
                <span>•</span>
                <span className="text-slate-300 font-medium">{currentTimeStr}</span>
              </div>
            </div>
          </div>

          {/* System Status Pills in Header */}
          <div className="flex items-center gap-4 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${systemStatus.gameServer ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className="font-bold text-slate-300">GAME</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${systemStatus.aiApi ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="font-bold text-slate-300">AI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${systemStatus.database ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className="font-bold text-slate-300">DATABASE</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                setShowResetModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-300 hover:text-red-100 text-xs font-bold transition-colors cursor-pointer shadow-sm"
              title="Start a new competition and reset all teams"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Competition</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                onSwitchToPlayerMode();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Player View</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                onLogout();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar & Content */}
      <div className="max-w-7xl mx-auto w-full flex-1 p-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* Compact Sidebar */}
        <aside className="md:col-span-1 space-y-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 space-y-1 sticky top-20">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playClickSound();
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isActive
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Tab View Area */}
        <main className="md:col-span-3 lg:col-span-4 space-y-6">
          {activeTab === 'overview' && (
            <AdminOverview
              teams={teams}
              systemStatus={systemStatus}
              currentRoundName={currentRoundName}
              roundStatus={roundStatus}
              remainingTimeSeconds={masterTimerSeconds}
              onToggleService={handleToggleService}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'teams' && (
            <LiveTeamMonitor
              teams={teams}
              onSelectTeam={(team) => setSelectedTeam(team)}
              onPauseTeam={handlePauseTeam}
              onResumeTeam={handleResumeTeam}
              onResetTeam={handleResetChallenge}
            />
          )}

          {activeTab === 'scoreboard' && (
            <AdminScoreboard
              teams={teams}
              scoresVisibleToPlayers={scoresVisibleToPlayers}
              onToggleScoresVisibility={() => setScoresVisibleToPlayers(!scoresVisibleToPlayers)}
              onSelectTeam={(team) => setSelectedTeam(team)}
            />
          )}

          {activeTab === 'round_control' && (
            <RoundControl
              currentRoundName={currentRoundName}
              roundStatus={roundStatus}
              remainingTimeSeconds={masterTimerSeconds}
              activeTeamsCount={activeTeamsCount}
              totalTeamsCount={totalTeamsCount}
              onStartRound={handleStartRound}
              onPauseAll={handlePauseAll}
              onResumeAll={handleResumeAll}
              onAddTimeMinutes={handleMasterAddTimeMinutes}
              onEndRound={handleEndRound}
              onForceSubmitAll={handleForceSubmitAll}
            />
          )}

          {activeTab === 'challenges' && (
            <ChallengeManagement
              config={challengeConfig}
              onUpdateConfig={(cfg) => setChallengeConfig(cfg)}
            />
          )}

          {activeTab === 'results' && (
            <AdminResults
              teams={teams}
              isLocked={resultsLocked}
              onToggleLock={() => setResultsLocked(!resultsLocked)}
            />
          )}
        </main>
      </div>

      {/* Team Detail Modal */}
      <TeamDetailModal
        team={selectedTeam}
        onClose={() => setSelectedTeam(null)}
        onPauseTeam={handlePauseTeam}
        onResumeTeam={handleResumeTeam}
        onAddTime={handleAddTime}
        onResetChallenge={handleResetChallenge}
        onForceSubmit={handleForceSubmitTeam}
        onDisqualifyTeam={handleDisqualifyTeam}
      />

      {/* Reset Competition Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/50 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-red-400 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-red-950 border border-red-500/30">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wider uppercase text-slate-100 font-mono">
                  START NEW COMPETITION?
                </h3>
                <p className="text-xs text-red-400/90 font-mono">Destructive Host Action</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 font-sans leading-relaxed">
              <p>
                This will reset the event state and start a completely fresh competition:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400 font-mono text-[11px]">
                <li>All teams, scores, and submissions will be cleared (0 teams).</li>
                <li>Leaderboard and rankings will start completely empty.</li>
                <li>Round 1 timer will reset to 45:00 fresh state.</li>
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-2 font-mono">
              <button
                onClick={handleResetCompetition}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                RESET COMPETITION
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setShowResetModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
