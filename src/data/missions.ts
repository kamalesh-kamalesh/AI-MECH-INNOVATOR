import { Mission } from '../types';

export const ROBOT1_MISSIONS: Mission[] = [
  {
    id: 'pick-and-place',
    title: 'Pick & Place Payload Transporter',
    type: 'Build Challenge',
    robotLabel: 'Robot 1',
    icon: 'PackageSearch',
    brief: 'Design a robot capable of lifting and moving heavy 50kg industrial crates up slippery 25° incline oil ramps from Dock A to Bay B.',
    difficulty: 'Medium',
    environment: 'Industrial Floor / High Mass Ramps',
    correctDrive: 'Tracked',
    correctBody: 'Heavy-Duty',
    correctSensor: 'Ultrasonic',
    correctGripper: 'Pneumatic 2-Finger',
    correctMotor: 'High-Torque DC',
    terrainFailText: 'Smooth wheels spun uselessly on the slick oil ramp! Robot slid backward carrying the 50kg payload.',
    terrainPassText: 'CONTINUOUS TANK TREADS LOCKED ONTO THE OIL RAMP! Smooth 50kg payload climb achieved.',
    detectionFailText: 'Optical camera got blinded by high-bay warehouse sodium glare! Crashed into a forklift.',
    detectionPassText: 'ULTRASONIC ECHOES PENETRATED DUST & GLARE! Clean distance mapping around aisle obstacles.',
    structureFailText: 'Lightweight carbon frame crumpled under the 50kg payload weight during acceleration!',
    structurePassText: 'HEAVY-DUTY TITANIUM CHASSIS BORNE THE 50KG PAYLOAD WITH ZERO DEFORMATION!',
    circuitFailText: 'SPARKS FLYING! High current draw from heavy motor load tripped unshielded wiring terminals.',
    circuitPassText: 'SOLID 48V RAIL WIRING! Delivered continuous 25A current without voltage drop.'
  },
  {
    id: 'factory-sorter',
    title: 'Precision Factory Logistics Sorter',
    type: 'Build Challenge',
    robotLabel: 'Robot 1',
    icon: 'Cpu',
    brief: 'Pick, classify, and sort high-speed machined components off a fast 3 m/s conveyor belt without dropping parts.',
    difficulty: 'Medium',
    environment: 'High Speed Precision Factory',
    correctDrive: '2-Wheel',
    correctBody: 'Compact',
    correctSensor: 'Camera Vision',
    correctGripper: 'Servo Claw',
    correctMotor: 'Brushless High-Speed',
    terrainFailText: 'Heavy tracked chassis was too sluggish to reposition between rapid 500ms conveyor slots!',
    terrainPassText: '2-WHEEL HIGH-AGILITY PIVOTED INSTANTLY AT THE CONVEYOR SORTING STATION!',
    detectionFailText: 'Ultrasonic sensor could not distinguish between brass and steel component geometries!',
    detectionPassText: 'HIGH-FPS AI CAMERA VISION CLASSIFIED MACHINED PARTS IN 12 MILLISECONDS!',
    structureFailText: 'Overly bulky heavy-duty housing extended past the conveyor guardrail and tripped safety stop!',
    structurePassText: 'COMPACT SLIMLINE BODY FIT FLUSH INSIDE THE NARROW SORTING CELL WORKSPACE!',
    circuitFailText: 'TIMING LAG! Intermittent MCU signal wire noise dropped 15% of sorting triggers.',
    circuitPassText: 'PRECISION BUS WIRING! Synchronized PWM signals fired without microsecond latency.'
  }
];

export const ROBOT2_MISSIONS: Mission[] = [
  {
    id: 'disaster-rescue',
    title: 'Disaster Zone Rescue & Retrieval',
    type: 'Innovation Challenge',
    robotLabel: 'Robot 2',
    icon: 'Flame',
    brief: 'Navigate jagged collapsed concrete rubble, dust clouds, and narrow 40cm basement passages to locate trapped survivor beacons and retrieve thermal rescue kits.',
    difficulty: 'Hard',
    environment: 'Disaster Zone / Unstructured Rubble & Smoke',
    correctDrive: 'Legged',
    correctBody: 'Compact',
    correctSensor: 'IR',
    correctGripper: 'Servo Claw',
    correctMotor: 'Precision Stepper',
    terrainFailText: 'Continuous tracks got jammed on jagged concrete rebar! Robot stranded on rubble peak.',
    terrainPassText: 'QUADRUPED LEGGED ARTICULATION STEPPED OVER CONCRETE RUBBLE WITH SURGICAL PRECISION!',
    detectionFailText: 'Ultrasonic sound bounced erratically off angled cracked drywall! Lost survivor coordinates.',
    detectionPassText: 'THERMAL INFRARED MATRIX DETECTED HEAT SIGNATURES THROUGH DENSE SMOKE & DUST!',
    structureFailText: 'Heavy-duty chassis was too bulky to squeeze into the 40cm collapsed duct entryway!',
    structurePassText: 'COMPACT ALUMINUM FRAME SLIPPED SAFELY THROUGH THE CONFINED RUBBLE PASSAGE!',
    circuitFailText: 'SHORT CIRCUIT! Debris impact dislodged unshielded power distribution wires.',
    circuitPassText: 'SHOCK-ISOLATED HARNESS! Circuit pathways held 100% integrity through rubble drops.'
  },
  {
    id: 'hazardous-inspector',
    title: 'Hazardous Chemical Pipe Inspector',
    type: 'Innovation Challenge',
    robotLabel: 'Robot 2',
    icon: 'Pipette',
    brief: 'Lower down a vertical damp 15m drainage shaft containing corrosive gas fumes to detect micro-cracks and seal leaks with a magnetic patch.',
    difficulty: 'Extreme',
    environment: 'Vertical Pipe / Damp & Corrosive Gas',
    correctDrive: 'Tracked',
    correctBody: 'Compact',
    correctSensor: 'Ultrasonic',
    correctGripper: 'Magnetic Lifter',
    correctMotor: 'High-Torque DC',
    terrainFailText: 'Legged joints locked up against pipe wall curvature! Unable to descend vertical shaft.',
    terrainPassText: 'MAGNETIC DUAL TANK TRACKS HUGGED CORROSIVE STEEL PIPE WALLS FLawlessly!',
    detectionFailText: 'Camera optical lens fogged over completely in 100% humidity drainage gas fumes!',
    detectionPassText: 'ULTRASONIC ACOUSTIC ECHO MAPPED CRACK DEPTHS THROUGH HEAVY STEAM & GAS!',
    structureFailText: 'Lightweight carbon shell buckled under 15m hydrostatic pipe gas pressure!',
    structurePassText: 'COMPACT SEALED PRESSURE HOUSING DEFLECTED DAMP CORROSIVE FUMES!',
    circuitFailText: 'CORROSION SHORT! Condensation breached unsealed terminal logic blocks.',
    circuitPassText: 'HERMETICALLY SEALED WIRING! Power and data buses passed wet testing.'
  }
];

export const MISSION_POOL = [...ROBOT1_MISSIONS, ...ROBOT2_MISSIONS];

