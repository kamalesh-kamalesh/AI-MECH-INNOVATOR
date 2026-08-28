import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push, remove, onValue, off } from "firebase/database";
import type { LeaderboardEntry } from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyAzJp-rxnGZ_qvc6m4iEWORnpZvkvSRMh4",
  authDomain: "mech-b3384.firebaseapp.com",
  databaseURL: "https://mech-b3384-default-rtdb.firebaseio.com",
  projectId: "mech-b3384",
  storageBucket: "mech-b3384.firebasestorage.app",
  messagingSenderId: "660452483555",
  appId: "1:660452483555:web:1f736d9a55c25dd14900d6"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

// ---- Leaderboard Operations ----

/** Submit or update a score entry in the leaderboard */
export async function submitScore(entry: LeaderboardEntry): Promise<void> {
  try {
    // Get current leaderboard
    const snapshot = await get(ref(database, "aimech_leaderboard"));
    let leaderboard: LeaderboardEntry[] = [];
    if (snapshot.exists()) {
      leaderboard = snapshot.val() || [];
    }

    // Add or replace entry for same team
    const existingIdx = leaderboard.findIndex(
      (e) => e.teamName.trim().toLowerCase() === entry.teamName.trim().toLowerCase()
    );

    if (existingIdx >= 0) {
      leaderboard[existingIdx] = entry;
    } else {
      leaderboard.unshift(entry);
    }

    // Sort descending by total score
    leaderboard.sort((a, b) => b.totalScore - a.totalScore);

    await set(ref(database, "aimech_leaderboard"), leaderboard);
  } catch (err) {
    console.error("Firebase submitScore error:", err);
  }
}

/** Listen to real-time leaderboard changes */
export function onLeaderboardChange(callback: (data: LeaderboardEntry[]) => void): () => void {
  const dbRef = ref(database, "aimech_leaderboard");
  const handler = onValue(dbRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() || []);
    } else {
      callback([]);
    }
  });

  // Return unsubscribe function
  return () => off(dbRef);
}

// ---- Team Operations ----

export interface AdminTeamEntry {
  id: string;
  name: string;
  avatar: string;
  members: [string, string];
  status: string;
  currentStage: string;
  currentRobot: string;
  aiCreditsUsed: number;
  aiCreditsRemaining: number;
  aiQuestionsAsked: number;
  aiHistorySummary: string[];
  robot1: any;
  robot2: any;
  aiStrategyScore: number;
  optimizationScore: number;
  totalScore: number;
  timeRemainingSeconds: number;
  progressPercent: number;
  loginTime: string;
  isDisqualified?: boolean;
}

/** Sync a team's live progress to Firebase */
export async function syncTeam(incomingTeam: Partial<AdminTeamEntry> & { name: string }): Promise<void> {
  try {
    if (!incomingTeam?.name?.trim()) return;

    const snapshot = await get(ref(database, "aimech_teams"));
    let teams: AdminTeamEntry[] = [];
    if (snapshot.exists()) {
      teams = snapshot.val() || [];
    }

    const teamNameClean = incomingTeam.name.trim().toLowerCase();
    const existingIdx = teams.findIndex(
      (t) => t.name.trim().toLowerCase() === teamNameClean || (incomingTeam.id && t.id === incomingTeam.id)
    );

    if (existingIdx >= 0) {
      teams[existingIdx] = {
        ...teams[existingIdx],
        ...incomingTeam,
      };
    } else {
      const newTeam: AdminTeamEntry = {
        id: incomingTeam.id || `ROB-${String(teams.length + 1).padStart(2, '0')}`,
        name: incomingTeam.name,
        avatar: incomingTeam.avatar || '🤖',
        members: incomingTeam.members || ['Player 1', 'Player 2'],
        status: incomingTeam.status || 'ACTIVE',
        currentStage: incomingTeam.currentStage || 'LOGIN',
        currentRobot: incomingTeam.currentRobot || 'Robot 1',
        aiCreditsUsed: incomingTeam.aiCreditsUsed || 0,
        aiCreditsRemaining: incomingTeam.aiCreditsRemaining !== undefined ? incomingTeam.aiCreditsRemaining : 5,
        aiQuestionsAsked: incomingTeam.aiQuestionsAsked || 0,
        aiHistorySummary: incomingTeam.aiHistorySummary || [],
        robot1: incomingTeam.robot1 || {
          missionTitle: 'Robotics Mission 1',
          selectedDrive: 'None',
          selectedBody: 'None',
          selectedSensor: 'None',
          testAttempts: 0,
          failuresCount: 0,
          repairsCount: 0,
          currentPerformanceScore: 0,
          totalScore: 0,
          isComplete: false,
        },
        robot2: incomingTeam.robot2 || {
          missionTitle: 'Robotics Mission 2',
          selectedDrive: 'None',
          selectedBody: 'None',
          selectedSensor: 'None',
          testAttempts: 0,
          failuresCount: 0,
          repairsCount: 0,
          currentPerformanceScore: 0,
          totalScore: 0,
          isComplete: false,
        },
        aiStrategyScore: incomingTeam.aiStrategyScore || 0,
        optimizationScore: incomingTeam.optimizationScore || 0,
        totalScore: incomingTeam.totalScore || 0,
        timeRemainingSeconds: incomingTeam.timeRemainingSeconds !== undefined ? incomingTeam.timeRemainingSeconds : 2700,
        progressPercent: incomingTeam.progressPercent || 10,
        loginTime: incomingTeam.loginTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      teams.unshift(newTeam);
    }

    await set(ref(database, "aimech_teams"), teams);
  } catch (err) {
    console.error("Firebase syncTeam error:", err);
  }
}

/** Also update the team entry to COMPLETED status when score is submitted */
export async function submitScoreAndUpdateTeam(entry: LeaderboardEntry): Promise<void> {
  // First submit the score
  await submitScore(entry);

  // Then update the team status
  try {
    const snapshot = await get(ref(database, "aimech_teams"));
    let teams: AdminTeamEntry[] = [];
    if (snapshot.exists()) {
      teams = snapshot.val() || [];
    }

    const teamIdx = teams.findIndex(
      (t) => t.name.trim().toLowerCase() === entry.teamName.trim().toLowerCase()
    );

    if (teamIdx >= 0) {
      teams[teamIdx] = {
        ...teams[teamIdx],
        status: 'COMPLETED',
        currentStage: 'RESULTS',
        currentRobot: 'Finished',
        totalScore: entry.totalScore,
        robot1: {
          ...teams[teamIdx].robot1,
          totalScore: entry.robot1Score,
        },
        robot2: {
          ...teams[teamIdx].robot2,
          totalScore: entry.robot2Score,
        },
        aiStrategyScore: entry.aiScore,
        optimizationScore: entry.optimizationScore,
        progressPercent: 100,
      };
    } else {
      // Create a new team entry for teams that submitted without syncing
      const newTeam: AdminTeamEntry = {
        id: entry.id,
        name: entry.teamName,
        avatar: '🏆',
        members: ['Player 1', 'Player 2'],
        status: 'COMPLETED',
        currentStage: 'RESULTS',
        currentRobot: 'Finished',
        aiCreditsUsed: 0,
        aiCreditsRemaining: 5,
        aiQuestionsAsked: entry.aiQuestionsAsked || 0,
        aiHistorySummary: [],
        robot1: {
          missionTitle: entry.robot1MissionTitle,
          selectedDrive: 'Unknown',
          selectedBody: 'Unknown',
          selectedSensor: 'Unknown',
          testAttempts: 0,
          failuresCount: 0,
          repairsCount: 0,
          currentPerformanceScore: 0,
          totalScore: entry.robot1Score,
          isComplete: true,
        },
        robot2: {
          missionTitle: entry.robot2MissionTitle,
          selectedDrive: 'Unknown',
          selectedBody: 'Unknown',
          selectedSensor: 'Unknown',
          testAttempts: 0,
          failuresCount: 0,
          repairsCount: 0,
          currentPerformanceScore: 0,
          totalScore: entry.robot2Score,
          isComplete: true,
        },
        aiStrategyScore: entry.aiScore,
        optimizationScore: entry.optimizationScore,
        totalScore: entry.totalScore,
        timeRemainingSeconds: 0,
        progressPercent: 100,
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      teams.unshift(newTeam);
    }

    await set(ref(database, "aimech_teams"), teams);
  } catch (err) {
    console.error("Firebase updateTeamStatus error:", err);
  }
}

/** Listen to real-time team changes */
export function onTeamsChange(callback: (data: AdminTeamEntry[]) => void): () => void {
  const dbRef = ref(database, "aimech_teams");
  onValue(dbRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() || []);
    } else {
      callback([]);
    }
  });

  return () => off(dbRef);
}

// ---- Host Action Operations ----

/** Delete a team by ID (requires passcode check at caller) */
export async function deleteTeam(id: string): Promise<void> {
  try {
    // Remove from leaderboard
    const lbSnapshot = await get(ref(database, "aimech_leaderboard"));
    if (lbSnapshot.exists()) {
      const leaderboard: LeaderboardEntry[] = lbSnapshot.val() || [];
      const filtered = leaderboard.filter((item) => item.id !== id);
      await set(ref(database, "aimech_leaderboard"), filtered);
    }

    // Remove from teams
    const teamsSnapshot = await get(ref(database, "aimech_teams"));
    if (teamsSnapshot.exists()) {
      const teams: AdminTeamEntry[] = teamsSnapshot.val() || [];
      const filtered = teams.filter((item) => item.id !== id);
      await set(ref(database, "aimech_teams"), filtered);
    }
  } catch (err) {
    console.error("Firebase deleteTeam error:", err);
  }
}

/** Clear all leaderboard and teams */
export async function clearAll(): Promise<void> {
  try {
    await set(ref(database, "aimech_leaderboard"), []);
    await set(ref(database, "aimech_teams"), []);
  } catch (err) {
    console.error("Firebase clearAll error:", err);
  }
}

// ---- Visibility Toggle ----

/** Get/set the scores visibility flag */
export async function setVisibility(visible: boolean): Promise<void> {
  try {
    await set(ref(database, "aimech_scores_visible"), visible);
  } catch (err) {
    console.error("Firebase setVisibility error:", err);
  }
}

/** Listen to visibility changes */
export function onVisibilityChange(callback: (visible: boolean) => void): () => void {
  const dbRef = ref(database, "aimech_scores_visible");
  onValue(dbRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(true); // Default visible
    }
  });

  return () => off(dbRef);
}
