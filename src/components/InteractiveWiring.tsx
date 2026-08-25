import React, { useState, useRef } from 'react';
import { WiringConnection, CircuitNode, CircuitTerminalPort, GameRound } from '../types';
import { playClickSound, playWireSuccessSound, playWireErrorSound } from '../utils/audio';
import { RoundHeader } from './RoundHeader';
import {
  Zap,
  Battery,
  Cpu,
  Radio,
  Sliders,
  Cog,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  ShieldAlert,
  Info,
  Layers
} from 'lucide-react';

interface InteractiveWiringProps {
  currentRound: GameRound;
  connections: WiringConnection[];
  wiringMistakes: number;
  onAddConnection: (from: string, to: string) => void;
  onRecordMistake: () => void;
  onProceedToSimulation: () => void;
  onResetWiring: () => void;
}


// 6 Detailed Engineering Component Nodes with Terminal Ports
export const CIRCUIT_NODES: CircuitNode[] = [
  {
    id: 'battery',
    title: '48V LiFePO4 Battery Pack',
    category: 'Power Source',
    iconName: 'Battery',
    x: 18,
    y: 20,
    ports: [
      { id: 'bat_48v', label: '48V Main Out', type: '48V', direction: 'out', nodeId: 'battery', connectedTo: null },
      { id: 'bat_gnd', label: 'Battery GND', type: 'GND', direction: 'out', nodeId: 'battery', connectedTo: null }
    ]
  },
  {
    id: 'pdb',
    title: 'Power Distribution Board (PDB)',
    category: 'Voltage Regulator',
    iconName: 'Layers',
    x: 50,
    y: 20,
    ports: [
      { id: 'pdb_48v_in', label: '48V Power In', type: '48V', direction: 'in', nodeId: 'pdb', connectedTo: null },
      { id: 'pdb_48v_out', label: '48V Aux Out', type: '48V', direction: 'out', nodeId: 'pdb', connectedTo: null },
      { id: 'pdb_12v_out', label: '12V Reg Out', type: '12V', direction: 'out', nodeId: 'pdb', connectedTo: null },
      { id: 'pdb_5v_out', label: '5V Logic Out', type: '5V', direction: 'out', nodeId: 'pdb', connectedTo: null },
      { id: 'pdb_gnd', label: 'Common GND', type: 'GND', direction: 'in', nodeId: 'pdb', connectedTo: null }
    ]
  },
  {
    id: 'motor_driver',
    title: '48V Dual Motor Driver',
    category: 'Power Actuator',
    iconName: 'Sliders',
    x: 82,
    y: 20,
    ports: [
      { id: 'md_48v_in', label: '48V Motor Power In', type: '48V', direction: 'in', nodeId: 'motor_driver', connectedTo: null },
      { id: 'md_pwm_in', label: 'PWM Control In', type: 'PWM', direction: 'in', nodeId: 'motor_driver', connectedTo: null },
      { id: 'md_out_pwr', label: 'Motor Output Power', type: '48V', direction: 'out', nodeId: 'motor_driver', connectedTo: null },
      { id: 'md_gnd', label: 'Driver GND', type: 'GND', direction: 'in', nodeId: 'motor_driver', connectedTo: null }
    ]
  },
  {
    id: 'sensor_array',
    title: 'Mission Sensor Payload',
    category: 'Telemetry & Optics',
    iconName: 'Radio',
    x: 18,
    y: 78,
    ports: [
      { id: 'sns_12v_in', label: '12V Power In', type: '12V', direction: 'in', nodeId: 'sensor_array', connectedTo: null },
      { id: 'sns_data_out', label: 'Sensor Data Out', type: 'Data', direction: 'out', nodeId: 'sensor_array', connectedTo: null },
      { id: 'sns_gnd', label: 'Sensor GND', type: 'GND', direction: 'in', nodeId: 'sensor_array', connectedTo: null }
    ]
  },
  {
    id: 'mcu',
    title: 'Microcontroller Unit (MCU)',
    category: 'Logic & Brain',
    iconName: 'Cpu',
    x: 50,
    y: 78,
    ports: [
      { id: 'mcu_5v_in', label: '5V Logic Power In', type: '5V', direction: 'in', nodeId: 'mcu', connectedTo: null },
      { id: 'mcu_pwm_out', label: 'PWM Signal Out', type: 'PWM', direction: 'out', nodeId: 'mcu', connectedTo: null },
      { id: 'mcu_data_in', label: 'Telemetry Data In', type: 'Data', direction: 'in', nodeId: 'mcu', connectedTo: null },
      { id: 'mcu_gnd', label: 'MCU GND', type: 'GND', direction: 'in', nodeId: 'mcu', connectedTo: null }
    ]
  },
  {
    id: 'drive_motors',
    title: 'Heavy Drive Motors',
    category: 'Mechanical Drive',
    iconName: 'Cog',
    x: 82,
    y: 78,
    ports: [
      { id: 'mot_pwr_in', label: 'Drive Power In', type: '48V', direction: 'in', nodeId: 'drive_motors', connectedTo: null },
      { id: 'mot_gnd', label: 'Motor GND', type: 'GND', direction: 'in', nodeId: 'drive_motors', connectedTo: null }
    ]
  }
];

// 7 Required Core Electrical Connections
export const REQUIRED_PORT_CONNECTIONS: Array<[string, string, string]> = [
  ['bat_48v', 'pdb_48v_in', '48V Main Power Line'],
  ['pdb_12v_out', 'sns_12v_in', '12V Regulated Sensor Power'],
  ['pdb_5v_out', 'mcu_5v_in', '5V MCU Logic Power'],
  ['pdb_48v_out', 'md_48v_in', '48V Motor Driver Power Line'],
  ['mcu_pwm_out', 'md_pwm_in', 'PWM Control Signal Link'],
  ['sns_data_out', 'mcu_data_in', 'Telemetry Data Bus'],
  ['md_out_pwr', 'mot_pwr_in', 'Drive Motor High-Power Link']
];

// Circuit Diagnostics Error Messages for Invalid Pairs
function getDiagnosticError(fromPort: CircuitTerminalPort, toPort: CircuitTerminalPort): string {
  if (fromPort.type === '48V' && toPort.type === '5V') {
    return '💥 OVERVOLTAGE SHORT CIRCUIT! Connecting 48V directly to a 5V logic terminal will instantly destroy the microcontroller! Route 48V through the Power Distribution Board (PDB) 5V regulator.';
  }
  if (fromPort.type === '48V' && toPort.type === '12V') {
    return '💥 BURNOUT HAZARD! 48V battery voltage exceeds 12V sensor tolerance. Route power through PDB 12V Regulated Output.';
  }
  if (fromPort.type === '48V' && toPort.type === 'Data') {
    return '💥 LOGIC PORT DAMAGE! High-voltage 48V output connected to a low-voltage Data Signal port.';
  }
  if (fromPort.type === 'PWM' && toPort.type === '48V') {
    return '⚡ SIGNAL MISMATCH! PWM logic signal output cannot drive a high-voltage power input port directly.';
  }
  if (fromPort.direction === fromPort.direction && fromPort.direction === 'out') {
    return '⚠️ SIGNAL COLLISION! Cannot connect Output to Output terminal port.';
  }
  if (fromPort.type !== toPort.type && !(fromPort.type === 'GND' && toPort.type === 'GND')) {
    return `⚠️ INCOMPATIBLE TERMINALS! Attempted to bridge ${fromPort.type} with ${toPort.type}. Check voltage levels and signal types.`;
  }
  return '⚠️ INVALID CONNECTION! This circuit link does not complete a required operational pathway.';
}

export const InteractiveWiring: React.FC<InteractiveWiringProps> = ({
  currentRound,
  connections,
  wiringMistakes,
  onAddConnection,
  onRecordMistake,
  onProceedToSimulation,
  onResetWiring,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [selectedPortId, setSelectedPortId] = useState<string | null>(null);
  const [dragLine, setDragLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [diagnosticNotice, setDiagnosticNotice] = useState<string | null>(null);

  // Helper to find port object by ID
  const findPort = (portId: string): { port: CircuitTerminalPort; node: CircuitNode } | null => {
    for (const node of CIRCUIT_NODES) {
      const port = node.ports.find((p) => p.id === portId);
      if (port) return { port, node };
    }
    return null;
  };

  // Calculate pixel coordinates for a given port element
  const getPortPos = (portId: string) => {
    const pData = findPort(portId);
    if (!pData || !boardRef.current) return { x: 0, y: 0 };
    const rect = boardRef.current.getBoundingClientRect();

    // Estimate based on node x, y percentage
    const portIndex = pData.node.ports.findIndex((p) => p.id === portId);
    const totalPorts = pData.node.ports.length;
    const offsetY = (portIndex - (totalPorts - 1) / 2) * 24;

    return {
      x: (pData.node.x / 100) * rect.width,
      y: (pData.node.y / 100) * rect.height + offsetY,
    };
  };

  // Verify whether port pair is required valid connection
  const isValidPortPair = (portAId: string, portBId: string): boolean => {
    return REQUIRED_PORT_CONNECTIONS.some(
      ([p1, p2]) => (p1 === portAId && p2 === portBId) || (p1 === portBId && p2 === portAId)
    );
  };

  const attemptPortConnection = (fromPortId: string, toPortId: string) => {
    if (fromPortId === toPortId) return;

    // Check if connection already exists
    const alreadyConnected = connections.some(
      (c) => (c.from === fromPortId && c.to === toPortId) || (c.from === toPortId && c.to === fromPortId)
    );
    if (alreadyConnected) return;

    const fromData = findPort(fromPortId);
    const toData = findPort(toPortId);

    if (!fromData || !toData) return;

    if (isValidPortPair(fromPortId, toPortId)) {
      playWireSuccessSound();
      setDiagnosticNotice(null);
      onAddConnection(fromPortId, toPortId);
    } else {
      playWireErrorSound();
      onRecordMistake();
      const errorMsg = getDiagnosticError(fromData.port, toData.port);
      setDiagnosticNotice(errorMsg);
    }
  };

  const handlePortClick = (portId: string) => {
    playClickSound();
    if (!selectedPortId) {
      setSelectedPortId(portId);
    } else if (selectedPortId === portId) {
      setSelectedPortId(null);
    } else {
      attemptPortConnection(selectedPortId, portId);
      setSelectedPortId(null);
    }
  };

  const handlePointerDown = (portId: string, e: React.PointerEvent) => {
    setSelectedPortId(portId);
    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const pos = getPortPos(portId);
      setDragLine({
        x1: pos.x,
        y1: pos.y,
        x2: e.clientX - rect.left,
        y2: e.clientY - rect.top,
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (selectedPortId && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const pos = getPortPos(selectedPortId);
      setDragLine({
        x1: pos.x,
        y1: pos.y,
        x2: e.clientX - rect.left,
        y2: e.clientY - rect.top,
      });
    }
  };

  const handlePointerUp = (targetPortId?: string) => {
    if (selectedPortId && targetPortId && selectedPortId !== targetPortId) {
      attemptPortConnection(selectedPortId, targetPortId);
    }
    setSelectedPortId(null);
    setDragLine(null);
  };

  const isCompleted = connections.length === REQUIRED_PORT_CONNECTIONS.length;

  const getPortColorClass = (type: string) => {
    switch (type) {
      case '48V':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case '12V':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case '5V':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'PWM':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Data':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  const getIconComponent = (name: string) => {
    switch (name) {
      case 'Battery':
        return <Battery className="w-4 h-4 text-red-400" />;
      case 'Layers':
        return <Layers className="w-4 h-4 text-amber-400" />;
      case 'Sliders':
        return <Sliders className="w-4 h-4 text-cyan-400" />;
      case 'Radio':
        return <Radio className="w-4 h-4 text-purple-400" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      case 'Cog':
        return <Cog className="w-4 h-4 text-cyan-400" />;
      default:
        return <Zap className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
      {/* 1. Standardized Round Header */}
      <RoundHeader currentRound={currentRound} />

      {/* 2. Engineering Status HUD */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs shadow-lg">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">🔌 Valid Connections:</span>
            <span className={`font-bold text-sm ${isCompleted ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {connections.length} / {REQUIRED_PORT_CONNECTIONS.length}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">❌ Short Circuits / Mistakes:</span>
            <span className={`font-bold text-sm ${wiringMistakes > 0 ? 'text-red-400' : 'text-slate-300'}`}>
              {wiringMistakes}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-slate-400">
          <span className="text-red-400 font-bold">● 48V Power</span>
          <span className="text-amber-400 font-bold">● 12V Power</span>
          <span className="text-emerald-400 font-bold">● 5V Logic</span>
          <span className="text-purple-400 font-bold">● PWM Signal</span>
          <span className="text-cyan-400 font-bold">● Data Telemetry</span>
        </div>

        <button
          onClick={() => {
            playClickSound();
            setDiagnosticNotice(null);
            onResetWiring();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors font-mono text-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Wiring
        </button>
      </div>

      {/* Diagnostic Warning Banner if short circuit attempted */}
      {diagnosticNotice && (
        <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-mono flex items-start gap-3 animate-bounce">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block uppercase tracking-wide">Circuit Electrical Fault Detected</span>
            <p className="text-slate-300 leading-relaxed">{diagnosticNotice}</p>
          </div>
        </div>
      )}

      {/* 3. Interactive Circuit Canvas */}
      <div
        ref={boardRef}
        onPointerMove={handlePointerMove}
        onPointerUp={() => handlePointerUp()}
        className="relative bg-slate-950 border-2 border-cyan-500/40 rounded-3xl h-[580px] sm:h-[620px] overflow-hidden select-none shadow-[0_0_30px_rgba(6,182,212,0.15)]"
      >
        {/* PCB Background Grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#06b6d4 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Cable Wire SVG Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {/* Active Connections */}
          {connections.map((c, idx) => {
            const p1 = getPortPos(c.from);
            const p2 = getPortPos(c.to);
            return (
              <g key={idx}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                />
                <circle cx={(p1.x + p2.x) / 2} cy={(p1.y + p2.y) / 2} r="4" fill="#34d399" className="animate-ping" />
              </g>
            );
          })}

          {/* Elastic Dragging Wire */}
          {dragLine && (
            <line
              x1={dragLine.x1}
              y1={dragLine.y1}
              x2={dragLine.x2}
              y2={dragLine.y2}
              stroke="#22d3ee"
              strokeWidth="4"
              strokeDasharray="6 6"
              strokeLinecap="round"
              className="filter drop-shadow-[0_0_10px_rgba(34,211,238,0.9)] animate-pulse"
            />
          )}
        </svg>

        {/* Circuit Nodes with Detailed Port Terminals */}
        {CIRCUIT_NODES.map((node) => (
          <div
            key={node.id}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 w-56 sm:w-64 bg-slate-900/95 border border-slate-800 rounded-2xl p-3 shadow-xl backdrop-blur-md"
          >
            {/* Component Title */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2">
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800 shrink-0">
                {getIconComponent(node.iconName)}
              </div>
              <div>
                <h4 className="text-sm font-bold font-mono text-slate-100 truncate">{node.title || node.label}</h4>
                <span className="text-xs text-slate-400 font-mono block">{node.category}</span>
              </div>
            </div>

            {/* Terminal Ports List */}
            <div className="space-y-1.5">
              {node.ports.map((port) => {
                const isSelected = selectedPortId === port.id;
                const isPortConnected = connections.some(
                  (c) => c.from === port.id || c.to === port.id
                );

                return (
                  <button
                    key={port.id}
                    onPointerDown={(e) => handlePointerDown(port.id, e)}
                    onPointerUp={() => handlePointerUp(port.id)}
                    onClick={() => handlePortClick(port.id)}
                    className={`w-full py-2 px-3 rounded-lg border flex items-center justify-between text-xs font-mono transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                        : isPortConnected
                        ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getPortColorClass(
                          port.type
                        )}`}
                      >
                        {port.type}
                      </span>
                      <span className="truncate font-medium">{port.label}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">{port.direction}</span>
                      {isPortConnected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Action Banner with Dominant CTA Button */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-mono text-slate-100">
              {isCompleted ? 'Circuit Harness Fully Verified!' : 'Wire All 7 Electrical Channels'}
            </h4>
            <p className="text-xs text-slate-400 font-sans">
              {isCompleted
                ? 'All voltage rails, control logic lines, and data buses are active and tested.'
                : 'Click or drag between matching terminal ports (e.g. 48V Battery Out → 48V PDB In).'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playClickSound();
            onProceedToSimulation();
          }}
          disabled={!isCompleted}
          className={`w-full sm:w-auto px-8 py-4 rounded-xl font-mono font-black text-sm tracking-wider uppercase flex items-center justify-center gap-3 transition-all ${
            isCompleted
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer hover:scale-[1.02]'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {isCompleted ? 'INITIATE SIMULATION TEST →' : 'CONNECT ALL 7 CHANNELS'}
        </button>
      </div>
    </div>
  );
};
