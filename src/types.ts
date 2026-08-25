export type DriveType = '2-Wheel' | '4-Wheel' | 'Legged' | 'Tracked';
export type BodyType = 'Lightweight' | 'Heavy-Duty' | 'Compact';
export type SensorType = 'Ultrasonic' | 'IR' | 'Camera Vision';
export type GripperType = 'Pneumatic 2-Finger' | 'Servo Claw' | 'Magnetic Lifter';
export type MotorPowerType = 'Brushless High-Speed' | 'High-Torque DC' | 'Precision Stepper';

export interface Mission {
  id: string;
  title: string;
  type: 'Build Challenge' | 'Innovation Challenge';
  robotLabel: 'Robot 1' | 'Robot 2';
  icon: string;
  brief: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  environment: string;
  correctDrive: DriveType;
  correctBody: BodyType;
  correctSensor: SensorType;
  correctGripper?: GripperType;
  correctMotor?: MotorPowerType;
  terrainFailText: string;
  terrainPassText: string;
  detectionFailText: string;
  detectionPassText: string;
  structureFailText: string;
  structurePassText: string;
  circuitFailText: string;
  circuitPassText: string;
}

export interface ComponentOption<T extends string> {
  id: T;
  title: T;
  description: string;
  specs: string[];
  powerRequirement: 'Low' | 'Medium' | 'High';
  icon: string;
  unitCost: number; // in USD
  massKg: number;
}

export interface ComponentSelection {
  drive: DriveType | null;
  body: BodyType | null;
  sensor: SensorType | null;
  gripper?: GripperType | null;
  motor?: MotorPowerType | null;
}

// Engineering Port Terminal for Wiring Puzzle
export interface CircuitTerminalPort {
  id: string; 
  nodeId: string;
  label: string; 
  type: '48V' | '12V' | '5V' | 'PWM' | 'Data' | 'GND';
  direction: 'out' | 'in';
  connectedTo?: string;
}

export interface CircuitNode {
  id: string;
  label?: string;
  title?: string;
  sublabel?: string;
  category: 'Power Source' | 'Distribution' | 'Control' | 'Drive' | 'Sensor' | 'Actuator' | 'Voltage Regulator' | 'Power Actuator' | 'Telemetry & Optics' | 'Logic & Brain' | 'Mechanical Drive';
  iconName: string;
  x: number; 
  y: number; 
  ports: CircuitTerminalPort[];
}

export interface WiringConnection {
  fromPortId: string;
  toPortId: string;
  fromNodeId?: string;
  toNodeId?: string;
}

export interface CheckpointResult {
  id: 'terrain' | 'detection' | 'structure' | 'circuit';
  name: string;
  icon: string;
  passed: boolean;
  flavorText: string;
  categoryName: string;
}

export interface RepairQuestion {
  checkpointId: 'terrain' | 'detection' | 'structure' | 'circuit';
  title: string;
  question: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer?: string;
  isCorrect?: boolean;
}

export interface RobotBuildResult {
  robotId: 'robot1' | 'robot2';
  mission: Mission;
  selection: ComponentSelection;
  wiringMistakes: number;
  checkpointResults: CheckpointResult[];
  repairedCheckpointIds: string[];
  functionalityScore: number; // 15
  engineeringScore: number;    // 10
  selectionScore: number;      // 5 (Robot 1) or Innovation score (Robot 2)
  efficiencyScore: number;     // 5
  repairScore: number;         // 5
  totalScore: number;          // 40 max
}

export interface FinalOptimizationState {
  weightReductionPercent: number; // 0 to 30%
  costReductionPercent: number;   // 0 to 30%
  performancePreserved: boolean;  // whether valid
  optimizationScore: number;      // out of 10
}

export interface GameScore {
  robot1Score: number;            // out of 40
  robot2Score: number;            // out of 40
  aiScore: number;                // out of 10
  optimizationScore: number;      // out of 10
  totalScore: number;             // out of 100
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface LeaderboardEntry {
  id: string;
  teamName: string;
  robot1MissionTitle: string;
  robot2MissionTitle: string;
  totalScore: number;
  robot1Score: number;
  robot2Score: number;
  aiScore: number;
  optimizationScore: number;
  aiQuestionsAsked: number;
  totalWiringMistakes: number;
  timestamp: string;
  grade: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  reasoning?: string;
  provider?: string;
  timestamp: string;
}

export type GameRound = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface RoundInfo {
  number: GameRound;
  title: string;
  subtitle: string;
  instruction: string;
  ctaText: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Automatic';
  suggestedSeconds: number;
  badgeColor: string;
}

export type TeamStatus = 'WAITING' | 'ACTIVE' | 'PAUSED' | 'TESTING' | 'COMPLETED' | 'DISCONNECTED';

export type CompetitionStage = 
  | 'LOGIN' 
  | 'MISSION_BRIEFING' 
  | 'ROBOT1_BUILD' 
  | 'ROBOT1_TEST' 
  | 'ROBOT2_BUILD' 
  | 'ROBOT2_TEST' 
  | 'OPTIMIZATION' 
  | 'FINAL_SUBMISSION' 
  | 'RESULTS';

export interface RobotTeamPerformance {
  missionTitle: string;
  selectedDrive: string;
  selectedBody: string;
  selectedSensor: string;
  selectedGripper?: string;
  selectedMotor?: string;
  testAttempts: number;
  failuresCount: number;
  repairsCount: number;
  currentPerformanceScore: number;
  totalScore: number;
  isComplete: boolean;
}

export interface AdminTeam {
  id: string; // e.g., ROB-07
  name: string;
  avatar: string; // emoji or icon
  members: [string, string];
  status: TeamStatus;
  currentStage: CompetitionStage;
  currentRobot: 'Robot 1' | 'Robot 2' | 'None' | 'Finished';
  aiCreditsUsed: number;
  aiCreditsRemaining: number;
  aiQuestionsAsked: number;
  aiHistorySummary: string[];
  robot1: RobotTeamPerformance;
  robot2: RobotTeamPerformance;
  aiStrategyScore: number;
  optimizationScore: number;
  totalScore: number;
  timeRemainingSeconds: number;
  progressPercent: number;
  loginTime: string;
  isDisqualified?: boolean;
}

export interface SystemServiceStatus {
  gameServer: boolean;
  database: boolean;
  aiApi: boolean;
  simulationEngine: boolean;
  timerService: boolean;
}

export interface ChallengeConfig {
  robot1MissionId: string;
  robot2MissionId: string;
  timeLimitMinutes: number;
  aiCreditLimit: number;
  maxWiringAttempts: number;
  allowAiAdvisor: boolean;
  scoringRules: {
    functionalityMax: number;
    engineeringMax: number;
    selectionMax: number;
    repairMax: number;
    aiStrategyMax: number;
    optimizationMax: number;
  };
}


