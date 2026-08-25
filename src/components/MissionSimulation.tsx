import React from 'react';
import { Mission, ComponentSelection, CheckpointResult } from '../types';
import { RoundHeader } from './RoundHeader';
import { RobotSimulationArena } from './RobotSimulationArena';

interface MissionSimulationProps {
  currentRound: number;
  mission: Mission;
  selection: ComponentSelection;
  wiringMistakes: number;
  onSimulationComplete: (results: CheckpointResult[], allPassed: boolean) => void;
}

export const MissionSimulation: React.FC<MissionSimulationProps> = ({
  currentRound,
  mission,
  selection,
  wiringMistakes,
  onSimulationComplete,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* 1. Standard Round Header */}
      <RoundHeader currentRound={currentRound as any} />

      {/* 2. Interactive Robot Simulation Arena */}
      <RobotSimulationArena
        mission={mission}
        selection={selection}
        wiringMistakes={wiringMistakes}
        onSimulationComplete={onSimulationComplete}
      />
    </div>
  );
};
