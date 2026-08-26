import { AdminTeam, ChallengeConfig, SystemServiceStatus } from '../types';

export const INITIAL_ADMIN_TEAMS: AdminTeam[] = [];

export const INITIAL_SYSTEM_STATUS: SystemServiceStatus = {
  gameServer: true,
  database: true,
  aiApi: true,
  simulationEngine: true,
  timerService: true,
};

export const INITIAL_CHALLENGE_CONFIG: ChallengeConfig = {
  robot1MissionId: 'm1_picker',
  robot2MissionId: 'm2_rescue',
  timeLimitMinutes: 45,
  aiCreditLimit: 5,
  maxWiringAttempts: 3,
  allowAiAdvisor: true,
  scoringRules: {
    functionalityMax: 15,
    engineeringMax: 10,
    selectionMax: 5,
    repairMax: 5,
    aiStrategyMax: 10,
    optimizationMax: 10,
  },
};

