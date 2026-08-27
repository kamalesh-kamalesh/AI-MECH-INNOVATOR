import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Mission,
  ComponentSelection,
  WiringConnection,
  CheckpointResult,
  GameScore,
  LeaderboardEntry,
  ChatMessage,
  GameRound,
  RobotBuildResult
} from './types';
import { ROBOT1_MISSIONS, ROBOT2_MISSIONS } from './data/missions';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { InstructionsPage } from './components/InstructionsPage';
import { MissionBriefing } from './components/MissionBriefing';
import { DesignAndAI } from './components/DesignAndAI';
import { InteractiveWiring } from './components/InteractiveWiring';
import { MissionSimulation } from './components/MissionSimulation';
import { EmergencyRepair } from './components/EmergencyRepair';
import { FinalOptimization } from './components/FinalOptimization';
import { ScoringAndLeaderboard } from './components/ScoringAndLeaderboard';
import { LeaderboardModal } from './components/LeaderboardModal';
import { HostDashboardModal } from './components/HostDashboardModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { isSoundMuted, toggleSoundMute } from './utils/audio';

let socket: Socket | null = null;

export default function App() {
  // Navigation Mode: 'player' | 'admin_login' | 'admin_dashboard'
  const [viewMode, setViewMode] = useState<'player' | 'admin_login' | 'admin_dashboard'>('player');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Game Flow State: Starts at Round 0 (Login Screen)
  const [currentRound, setCurrentRound] = useState<GameRound>(0);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [teamName, setTeamName] = useState<string>('');
  const [member1, setMember1] = useState<string>('');
  const [member2, setMember2] = useState<string>('');
  
  // Mission Selections for Robot 1 & Robot 2
  const [robot1Mission, setRobot1Mission] = useState<Mission>(ROBOT1_MISSIONS[0]);
  const [robot2Mission, setRobot2Mission] = useState<Mission>(ROBOT2_MISSIONS[0]);

  // Component Selections
  const [robot1Selection, setRobot1Selection] = useState<ComponentSelection>({
    drive: null,
    body: null,
    sensor: null,
    gripper: null,
    motor: null,
  });

  const [robot2Selection, setRobot2Selection] = useState<ComponentSelection>({
    drive: null,
    body: null,
    sensor: null,
    gripper: null,
    motor: null,
  });

  // AI State (5 credits total across the 2 robot challenges)
  const [aiCredits, setAiCredits] = useState<number>(5);
  const [aiQuestionsAsked, setAiQuestionsAsked] = useState<number>(0);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Wiring State for Robot 1 and Robot 2
  const [r1Connections, setR1Connections] = useState<WiringConnection[]>([]);
  const [r1WiringMistakes, setR1WiringMistakes] = useState<number>(0);
  const [r1InWiringMode, setR1InWiringMode] = useState<boolean>(false);

  const [r2Connections, setR2Connections] = useState<WiringConnection[]>([]);
  const [r2WiringMistakes, setR2WiringMistakes] = useState<number>(0);
  const [r2InWiringMode, setR2InWiringMode] = useState<boolean>(false);

  // Robot 1 Test & Repair Results
  const [r1CheckpointResults, setR1CheckpointResults] = useState<CheckpointResult[]>([]);
  const [r1RepairedCheckpointIds, setR1RepairedCheckpointIds] = useState<string[]>([]);

  // Robot 2 Test & Repair Results
  const [r2CheckpointResults, setR2CheckpointResults] = useState<CheckpointResult[]>([]);
  const [r2RepairedCheckpointIds, setR2RepairedCheckpointIds] = useState<string[]>([]);

  // Optimization Stage Points
  const [optimizationBonus, setOptimizationBonus] = useState<number>(10);

  // Leaderboard & Privacy
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [scoresVisible, setScoresVisible] = useState<boolean>(true);

  // Modals
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [soundMutedState, setSoundMutedState] = useState(isSoundMuted());

  // Socket.io initialization & cleanup
  useEffect(() => {
    if (!socket) {
      socket = io(window.location.origin, {
        transports: ['polling', 'websocket'],
        reconnectionAttempts: 10,
        timeout: 10000,
        autoConnect: true,
      });

      socket.on('connect_error', () => {
        // Suppress console error output for dev environment WebSocket limits
      });

      socket.on('error', () => {
        // Suppress socket errors
      });
    }

    socket.on('connect', () => {
      socket?.emit('get_leaderboard');
    });

    socket.on('leaderboard_update', (data: LeaderboardEntry[]) => {
      setLeaderboard(data);
    });

    socket.on('visibility_update', (visible: boolean) => {
      setScoresVisible(visible);
    });

    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) setLeaderboard(data.leaderboard);
        if (data.scoresVisible !== undefined) setScoresVisible(data.scoresVisible);
      })
      .catch((err) => console.warn('REST leaderboard fallback error:', err));

    return () => {
      socket?.off('leaderboard_update');
      socket?.off('visibility_update');
    };
  }, []);

  // Component selection handlers
  const handleSelectComponent = (
    type: 'drive' | 'body' | 'sensor' | 'gripper' | 'motor',
    value: string
  ) => {
    if (currentRound === 2) {
      setRobot1Selection((prev) => ({ ...prev, [type]: value }));
    } else if (currentRound === 4) {
      setRobot2Selection((prev) => ({ ...prev, [type]: value }));
    }
  };

  // AI Question Handler (supports NVIDIA Nemotron 3.5 Lightning & Gemini)
  const handleSendAiQuestion = async (questionText: string, provider: 'nvidia' | 'gemini' = 'nvidia') => {
    if (aiCredits <= 0) return;

    const activeMission = currentRound === 2 ? robot1Mission : robot2Mission;
    const activeSelection = currentRound === 2 ? robot1Selection : robot2Selection;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setAiCredits((prev) => Math.max(0, prev - 1));
    setAiQuestionsAsked((prev) => prev + 1);

    try {
      const endpoint = provider === 'nvidia' ? '/api/nvidia/chat' : '/api/gemini/chat';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: questionText,
          missionTitle: activeMission.title,
          missionBrief: activeMission.brief,
          previousDrive: activeSelection.drive,
          previousBody: activeSelection.body,
          previousSensor: activeSelection.sensor,
          provider,
        }),
      });

      const data = await response.json();
      const aiReplyText = data.reply || 'AI Engineer telemetry query complete.';

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
        reasoning: data.reasoning,
        provider: data.provider || (provider === 'nvidia' ? 'NVIDIA Nemotron 3.5 Lightning' : 'Gemini 3.6 Flash'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Failed querying AI endpoint:', error);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `[Offline Backup]: Match your drive locomotion to terrain friction, select proper motor power, and pair a sensor resilient against ambient environmental noise!`,
        provider: 'NVIDIA Nemotron (Offline Backup)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory((prev) => [...prev, fallbackMsg]);
    }
  };

  // Wiring Handlers
  const handleAddWiringConnection = (from: string, to: string) => {
    if (currentRound === 2) {
      setR1Connections((prev) => [...prev, { from, to }]);
    } else {
      setR2Connections((prev) => [...prev, { from, to }]);
    }
  };

  const handleRecordWiringMistake = () => {
    if (currentRound === 2) {
      setR1WiringMistakes((prev) => prev + 1);
    } else {
      setR2WiringMistakes((prev) => prev + 1);
    }
  };

  const handleResetWiring = () => {
    if (currentRound === 2) {
      setR1Connections([]);
    } else {
      setR2Connections([]);
    }
  };

  // Robot 1 Simulation Complete -> proceed to repair or Round 4
  const handleR1SimulationComplete = (results: CheckpointResult[], allPassed: boolean) => {
    setR1CheckpointResults(results);
    if (allPassed) {
      setCurrentRound(4); // Skip repair for R1, start R2 build
    }
  };

  const handleR1CompleteRepair = (repairedIds: string[]) => {
    setR1RepairedCheckpointIds(repairedIds);
    setCurrentRound(4); // Move to Robot 2 Build
  };

  // Robot 2 Simulation Complete -> proceed to repair or Round 6
  const handleR2SimulationComplete = (results: CheckpointResult[], allPassed: boolean) => {
    setR2CheckpointResults(results);
    if (allPassed) {
      setCurrentRound(6); // Skip repair for R2, move to Final Optimization
    }
  };

  const handleR2CompleteRepair = (repairedIds: string[]) => {
    setR2RepairedCheckpointIds(repairedIds);
    setCurrentRound(6); // Move to Final Optimization
  };

  // Final Optimization Complete -> Round 7
  const handleCompleteOptimization = (bonusPoints: number) => {
    setOptimizationBonus(bonusPoints);
    setCurrentRound(7);
  };

  // Submit Score to Leaderboard
  const handleSubmitScoreToLeaderboard = (scoreData: GameScore, teamNameInput: string) => {
    const totalMistakes = r1WiringMistakes + r2WiringMistakes;
    const entry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      teamName: teamNameInput,
      robot1MissionTitle: robot1Mission.title,
      robot2MissionTitle: robot2Mission.title,
      totalScore: scoreData.totalScore,
      robot1Score: scoreData.robot1Score,
      robot2Score: scoreData.robot2Score,
      aiScore: scoreData.aiScore,
      optimizationScore: scoreData.optimizationScore,
      aiQuestionsAsked,
      totalWiringMistakes: totalMistakes,
      timestamp: 'Just now',
      grade: scoreData.grade,
    };

    socket?.emit('submit_score', entry);
  };

  // Host Action Handlers
  const handleHostDeleteTeam = (id: string, hostPasscode: string) => {
    socket?.emit('host_delete_team', { id, hostPasscode });
  };

  const handleHostToggleVisibility = (hostPasscode: string) => {
    socket?.emit('host_toggle_visibility', { hostPasscode });
  };

  const handleHostClearAll = (hostPasscode: string) => {
    socket?.emit('host_clear_all', { hostPasscode });
  };

  // Start Challenge handler from Login Page
  const handleStartChallenge = (tName: string, m1: string, m2: string) => {
    setTeamName(tName);
    setMember1(m1);
    setMember2(m2);
    setShowInstructions(true); // Display instructions right after login page
  };

  // Reset Game
  const handlePlayAgain = () => {
    setShowInstructions(false);
    setRobot1Mission(ROBOT1_MISSIONS[0]);
    setRobot2Mission(ROBOT2_MISSIONS[0]);
    setRobot1Selection({ drive: null, body: null, sensor: null, gripper: null, motor: null });
    setRobot2Selection({ drive: null, body: null, sensor: null, gripper: null, motor: null });
    setAiCredits(5);
    setAiQuestionsAsked(0);
    setChatHistory([]);
    setR1Connections([]);
    setR1WiringMistakes(0);
    setR1InWiringMode(false);
    setR2Connections([]);
    setR2WiringMistakes(0);
    setR2InWiringMode(false);
    setR1CheckpointResults([]);
    setR1RepairedCheckpointIds([]);
    setR2CheckpointResults([]);
    setR2RepairedCheckpointIds([]);
    setOptimizationBonus(10);
    setCurrentRound(0);
  };

  // Synchronize live team progress to server & Admin Dashboard
  useEffect(() => {
    if (!teamName) return;
    const stageMap: Record<number, string> = {
      0: 'LOGIN',
      1: 'MISSION_BRIEFING',
      2: 'ROBOT1_BUILD',
      3: 'ROBOT1_TEST',
      4: 'ROBOT2_BUILD',
      5: 'ROBOT2_TEST',
      6: 'OPTIMIZATION',
      7: 'RESULTS',
    };
    const currentStage = stageMap[currentRound] || 'ACTIVE';
    socket?.emit('team_sync', {
      name: teamName,
      members: [member1 || 'Player 1', member2 || 'Player 2'],
      status: currentRound === 7 ? 'COMPLETED' : (currentRound === 3 || currentRound === 5 ? 'TESTING' : 'ACTIVE'),
      currentStage,
      currentRobot: currentRound <= 3 ? 'Robot 1' : (currentRound <= 5 ? 'Robot 2' : 'Finished'),
      aiCreditsUsed: 5 - aiCredits,
      aiCreditsRemaining: aiCredits,
      aiQuestionsAsked,
      progressPercent: Math.min(100, Math.round((currentRound / 7) * 100)),
      robot1: {
        missionTitle: robot1Mission.title,
        selectedDrive: robot1Selection.drive || 'None',
        selectedBody: robot1Selection.body || 'None',
        selectedSensor: robot1Selection.sensor || 'None',
        isComplete: currentRound >= 4,
      },
      robot2: {
        missionTitle: robot2Mission.title,
        selectedDrive: robot2Selection.drive || 'None',
        selectedBody: robot2Selection.body || 'None',
        selectedSensor: robot2Selection.sensor || 'None',
        isComplete: currentRound >= 6,
      },
    });
  }, [currentRound, teamName, member1, member2, aiCredits, aiQuestionsAsked, robot1Mission, robot2Mission, robot1Selection, robot2Selection]);

  const totalWiringMistakes = r1WiringMistakes + r2WiringMistakes;

  // Render Admin Dashboard View Mode
  if (viewMode === 'admin_dashboard') {
    return (
      <AdminDashboard
        socket={socket}
        onLogout={() => {
          setIsAdminAuthenticated(false);
          setViewMode('player');
        }}
        onSwitchToPlayerMode={() => setViewMode('player')}
      />
    );
  }

  // Render Admin Login View Mode
  if (viewMode === 'admin_login') {
    return (
      <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans">
        <Navbar
          currentRound={currentRound}
          teamName={teamName}
          aiCredits={aiCredits}
          soundMuted={soundMutedState}
          onToggleSound={() => {
            const muted = toggleSoundMute();
            setSoundMutedState(muted);
          }}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenHostModal={() => setIsHostModalOpen(true)}
          onOpenAdminDashboard={() => {
            if (isAdminAuthenticated) setViewMode('admin_dashboard');
            else setViewMode('admin_login');
          }}
        />
        <main className="flex-1 py-4 flex items-center justify-center">
          <AdminLogin
            onLoginSuccess={() => {
              setIsAdminAuthenticated(true);
              setViewMode('admin_dashboard');
            }}
            onCancel={() => setViewMode('player')}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top HUD Navigation Bar */}
      <Navbar
        currentRound={currentRound}
        teamName={teamName}
        aiCredits={aiCredits}
        soundMuted={soundMutedState}
        onToggleSound={() => {
          const muted = toggleSoundMute();
          setSoundMutedState(muted);
        }}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenHostModal={() => setIsHostModalOpen(true)}
        onOpenAdminDashboard={() => {
          if (isAdminAuthenticated) setViewMode('admin_dashboard');
          else setViewMode('admin_login');
        }}
        onOpenInstructions={() => setShowInstructions(true)}
      />

      {/* Main Game Screen View Port */}
      <main className="flex-1 py-4">
        {/* INSTRUCTIONS PAGE (Displayed after Login or when Rules button clicked) */}
        {showInstructions ? (
          <InstructionsPage
            teamName={teamName}
            member1={member1}
            member2={member2}
            onProceed={() => {
              setShowInstructions(false);
              if (currentRound === 0) {
                setCurrentRound(1);
              }
            }}
          />
        ) : (
          <>
            {/* ROUND 0: Login Page */}
            {currentRound === 0 && (
              <LoginPage
                initialTeamName={teamName}
                initialMember1={member1}
                initialMember2={member2}
                onStartChallenge={handleStartChallenge}
                onOpenAdminLogin={() => setViewMode('admin_login')}
              />
            )}

        {/* ROUND 1: Briefing & Mission Assignment */}
        {currentRound === 1 && (
          <MissionBriefing
            robot1Mission={robot1Mission}
            robot2Mission={robot2Mission}
            teamName={teamName}
            onSetTeamName={setTeamName}
            onSelectRobot1Mission={setRobot1Mission}
            onSelectRobot2Mission={setRobot2Mission}
            onAcceptMissions={() => setCurrentRound(2)}
          />
        )}

        {/* ROUND 2: Robot 1 Build & Wiring */}
        {currentRound === 2 && (
          !r1InWiringMode ? (
            <DesignAndAI
              currentRound={2}
              mission={robot1Mission}
              selection={robot1Selection}
              aiCredits={aiCredits}
              chatHistory={chatHistory}
              onSelectComponent={handleSelectComponent}
              onSendAiQuestion={handleSendAiQuestion}
              onProceedToWiring={() => setR1InWiringMode(true)}
            />
          ) : (
            <InteractiveWiring
              currentRound={2}
              connections={r1Connections}
              wiringMistakes={r1WiringMistakes}
              onAddConnection={handleAddWiringConnection}
              onRecordMistake={handleRecordWiringMistake}
              onProceedToSimulation={() => {
                setR1InWiringMode(false);
                setCurrentRound(3);
              }}
              onResetWiring={handleResetWiring}
            />
          )
        )}

        {/* ROUND 3: Robot 1 Test & Repair */}
        {currentRound === 3 && (
          r1CheckpointResults.length === 0 || r1CheckpointResults.every((c) => c.passed) ? (
            <MissionSimulation
              currentRound={3}
              mission={robot1Mission}
              selection={robot1Selection}
              wiringMistakes={r1WiringMistakes}
              onSimulationComplete={handleR1SimulationComplete}
            />
          ) : (
            <EmergencyRepair
              currentRound={3}
              mission={robot1Mission}
              selection={robot1Selection}
              wiringMistakes={r1WiringMistakes}
              failedCheckpoints={r1CheckpointResults.filter((c) => !c.passed)}
              onCompleteRepair={handleR1CompleteRepair}
            />
          )
        )}

        {/* ROUND 4: Robot 2 Build & Wiring */}
        {currentRound === 4 && (
          !r2InWiringMode ? (
            <DesignAndAI
              currentRound={4}
              mission={robot2Mission}
              selection={robot2Selection}
              aiCredits={aiCredits}
              chatHistory={chatHistory}
              onSelectComponent={handleSelectComponent}
              onSendAiQuestion={handleSendAiQuestion}
              onProceedToWiring={() => setR2InWiringMode(true)}
            />
          ) : (
            <InteractiveWiring
              currentRound={4}
              connections={r2Connections}
              wiringMistakes={r2WiringMistakes}
              onAddConnection={handleAddWiringConnection}
              onRecordMistake={handleRecordWiringMistake}
              onProceedToSimulation={() => {
                setR2InWiringMode(false);
                setCurrentRound(5);
              }}
              onResetWiring={handleResetWiring}
            />
          )
        )}

        {/* ROUND 5: Robot 2 Test & Repair */}
        {currentRound === 5 && (
          r2CheckpointResults.length === 0 || r2CheckpointResults.every((c) => c.passed) ? (
            <MissionSimulation
              currentRound={5}
              mission={robot2Mission}
              selection={robot2Selection}
              wiringMistakes={r2WiringMistakes}
              onSimulationComplete={handleR2SimulationComplete}
            />
          ) : (
            <EmergencyRepair
              currentRound={5}
              mission={robot2Mission}
              selection={robot2Selection}
              wiringMistakes={r2WiringMistakes}
              failedCheckpoints={r2CheckpointResults.filter((c) => !c.passed)}
              onCompleteRepair={handleR2CompleteRepair}
            />
          )
        )}

        {/* ROUND 6: Final Optimization */}
        {currentRound === 6 && (
          <FinalOptimization
            robot1Mission={robot1Mission}
            robot1Selection={robot1Selection}
            robot2Mission={robot2Mission}
            robot2Selection={robot2Selection}
            onCompleteOptimization={handleCompleteOptimization}
          />
        )}

        {/* ROUND 7: Scoring & Leaderboard */}
        {currentRound === 7 && (
          <ScoringAndLeaderboard
            robot1Mission={robot1Mission}
            robot1Selection={robot1Selection}
            r1RepairedCheckpointIds={r1RepairedCheckpointIds}
            r1InitialPassed={r1CheckpointResults.filter((c) => c.passed).length}
            robot2Mission={robot2Mission}
            robot2Selection={robot2Selection}
            r2RepairedCheckpointIds={r2RepairedCheckpointIds}
            r2InitialPassed={r2CheckpointResults.filter((c) => c.passed).length}
            wiringMistakes={totalWiringMistakes}
            aiQuestionsAsked={aiQuestionsAsked}
            optimizationBonus={optimizationBonus}
            teamName={teamName}
            leaderboard={leaderboard}
            scoresVisible={scoresVisible}
            onSubmitScoreToLeaderboard={handleSubmitScoreToLeaderboard}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </>
    )}
  </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-3 text-center text-xs font-mono text-slate-500">
        AI Mech Innovator • 2-Robot Mechanical Engineering Challenge • AI-Assisted Robotics Competition
      </footer>

      {/* Quick Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        leaderboard={leaderboard}
        scoresVisible={scoresVisible}
        currentRound={currentRound}
        teamName={teamName}
        wiringMistakes={totalWiringMistakes}
        aiCredits={aiCredits}
      />

      {/* Host Control Modal */}
      <HostDashboardModal
        isOpen={isHostModalOpen}
        onClose={() => setIsHostModalOpen(false)}
        leaderboard={leaderboard}
        scoresVisible={scoresVisible}
        onDeleteTeam={handleHostDeleteTeam}
        onToggleVisibility={handleHostToggleVisibility}
        onClearAll={handleHostClearAll}
      />
    </div>
  );
}

