import { RoundInfo } from '../types';

export const ROUNDS_CONFIG: Record<number, RoundInfo> = {
  0: {
    number: 0,
    title: 'TEAM LOGIN',
    subtitle: 'Register Team & Start Challenge',
    instruction: 'Enter your Team Name and Member Names to enter the AI Mech Innovator Arena.',
    ctaText: 'START CHALLENGE →',
    difficulty: 'Easy',
    suggestedSeconds: 300,
    badgeColor: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300',
  },
  1: {
    number: 1,
    title: 'MISSION BRIEFING',
    subtitle: 'Event Rules, Scoring & AI Allocation',
    instruction: 'Read the 2-Robot Challenge rules, inspect Robot 1 & Robot 2 mission specs, and confirm your team name.',
    ctaText: 'START ROBOT 1 BUILD →',
    difficulty: 'Easy',
    suggestedSeconds: 300, // 5 min
    badgeColor: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
  },
  2: {
    number: 2,
    title: 'ROBOT 1: BUILD & WIRE',
    subtitle: 'Build Challenge — Component Selection & Wiring',
    instruction: 'Analyze payload constraints, ask AI (5 credits total), select components, and complete circuit wiring.',
    ctaText: 'LAUNCH ROBOT 1 SIMULATION →',
    difficulty: 'Medium',
    suggestedSeconds: 600, // 10 min
    badgeColor: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
  },
  3: {
    number: 3,
    title: 'ROBOT 1: TEST & REPAIR',
    subtitle: 'Field Simulation & Telemetry Diagnostics',
    instruction: 'Observe Robot 1 performance on the track, detect engineering failures, and perform emergency repairs.',
    ctaText: 'PROCEED TO ROBOT 2 (INNOVATION) →',
    difficulty: 'Hard',
    suggestedSeconds: 300, // 5 min
    badgeColor: 'bg-red-950/80 border-red-500/50 text-red-300',
  },
  4: {
    number: 4,
    title: 'ROBOT 2: INNOVATION BUILD',
    subtitle: 'Innovation Challenge — Rescue & Hazard Mission',
    instruction: 'Analyze rescue zone constraints, reuse or swap specialized components, and wire Robot 2.',
    ctaText: 'LAUNCH ROBOT 2 SIMULATION →',
    difficulty: 'Hard',
    suggestedSeconds: 600, // 10 min
    badgeColor: 'bg-red-950/80 border-red-500/50 text-red-300',
  },
  5: {
    number: 5,
    title: 'ROBOT 2: TEST & REPAIR',
    subtitle: 'Hazard Zone Field Test & Repair',
    instruction: 'Stress-test Robot 2 through obstacles and hazardous terrain, diagnose issues, and fix failure modes.',
    ctaText: 'PROCEED TO FINAL OPTIMIZATION →',
    difficulty: 'Hard',
    suggestedSeconds: 300, // 5 min
    badgeColor: 'bg-red-950/80 border-red-500/50 text-red-300',
  },
  6: {
    number: 6,
    title: 'FINAL OPTIMIZATION',
    subtitle: 'Weight, Cost & Performance Trade-off Tuning',
    instruction: 'Optimize both robots to achieve a 20% weight reduction and 15% cost reduction without losing required performance!',
    ctaText: 'SUBMIT DUAL-ROBOT SYSTEM →',
    difficulty: 'Medium',
    suggestedSeconds: 300, // 5 min
    badgeColor: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300',
  },
  7: {
    number: 7,
    title: 'FINAL RESULT & LEADERBOARD',
    subtitle: '100-Point Evaluation & Event Submission',
    instruction: 'Review your 100-point score breakdown across Robot 1, Robot 2, AI Strategy, and Final Optimization.',
    ctaText: 'NEW EVENT MATCH 🔄',
    difficulty: 'Automatic',
    suggestedSeconds: 300, // 5 min
    badgeColor: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
  },
};

