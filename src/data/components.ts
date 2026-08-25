import { ComponentOption, DriveType, BodyType, SensorType, GripperType, MotorPowerType } from '../types';

export const DRIVE_OPTIONS: ComponentOption<DriveType>[] = [
  {
    id: '2-Wheel',
    title: '2-Wheel',
    description: 'High agility, lightweight dual-motor differential drive for smooth factory floors.',
    specs: ['Max Speed: 12 km/h', 'Agility: High', 'Terrain Traction: Low', 'Weight: 4 kg'],
    powerRequirement: 'Low',
    icon: 'Disc',
    unitCost: 250,
    massKg: 4
  },
  {
    id: '4-Wheel',
    title: '4-Wheel',
    description: 'Balanced all-terrain drive with independent suspension and steady torque.',
    specs: ['Max Speed: 18 km/h', 'Agility: Medium', 'Terrain Traction: High', 'Weight: 8 kg'],
    powerRequirement: 'Medium',
    icon: 'CircleDot',
    unitCost: 450,
    massKg: 8
  },
  {
    id: 'Legged',
    title: 'Legged',
    description: 'Quadruped articulated robotic legs capable of stepping over extreme obstacles and rubble.',
    specs: ['Max Speed: 6 km/h', 'Agility: Very High', 'Terrain Traction: Extreme', 'Weight: 14 kg'],
    powerRequirement: 'High',
    icon: 'Footprints',
    unitCost: 1200,
    massKg: 14
  },
  {
    id: 'Tracked',
    title: 'Tracked',
    description: 'Continuous heavy rubber treads providing max grip on mud, stairs, and loose slopes.',
    specs: ['Max Speed: 9 km/h', 'Agility: Medium', 'Terrain Traction: Max', 'Weight: 16 kg'],
    powerRequirement: 'High',
    icon: 'Layers',
    unitCost: 750,
    massKg: 16
  }
];

export const BODY_OPTIONS: ComponentOption<BodyType>[] = [
  {
    id: 'Lightweight',
    title: 'Lightweight',
    description: 'Honeycomb carbon-fiber frame designed for speed and minimum battery consumption.',
    specs: ['Armor: Low', 'Mass: 5 kg', 'Payload Capacity: 15 kg', 'Energy Draw: Low'],
    powerRequirement: 'Low',
    icon: 'Feather',
    unitCost: 600,
    massKg: 5
  },
  {
    id: 'Heavy-Duty',
    title: 'Heavy-Duty',
    description: 'Titanium-reinforced structural chassis capable of bearing massive payloads and impacts.',
    specs: ['Armor: Extreme', 'Mass: 25 kg', 'Payload Capacity: 100 kg', 'Energy Draw: High'],
    powerRequirement: 'High',
    icon: 'Shield',
    unitCost: 950,
    massKg: 25
  },
  {
    id: 'Compact',
    title: 'Compact',
    description: 'Ultra-slim sealed aluminum housing built to fit narrow pipes, ducts, and tight gaps.',
    specs: ['Armor: Medium', 'Mass: 9 kg', 'Payload Capacity: 30 kg', 'Energy Draw: Medium'],
    powerRequirement: 'Medium',
    icon: 'Box',
    unitCost: 500,
    massKg: 9
  }
];

export const SENSOR_OPTIONS: ComponentOption<SensorType>[] = [
  {
    id: 'Ultrasonic',
    title: 'Ultrasonic',
    description: 'Acoustic pulse sonar sensor that detects distances reliably through smoke, fog, and dust.',
    specs: ['Range: 0.1m - 5m', 'Lighting Required: None', 'Resolution: Coarse (Distance)', 'Dust Immune: Yes'],
    powerRequirement: 'Low',
    icon: 'Radio',
    unitCost: 150,
    massKg: 1.5
  },
  {
    id: 'IR',
    title: 'IR',
    description: 'Infrared thermal matrix sensor that detects heat signatures and objects in pitch darkness.',
    specs: ['Range: 0.5m - 15m', 'Lighting Required: None', 'Resolution: Medium Thermal', 'Heat Detection: High'],
    powerRequirement: 'Medium',
    icon: 'Eye',
    unitCost: 350,
    massKg: 2.0
  },
  {
    id: 'Camera Vision',
    title: 'Camera Vision',
    description: 'High-definition RGB optical AI vision system for detailed object sorting and shape recognition.',
    specs: ['Range: 0.1m - 30m', 'Lighting Required: Medium/High', 'Resolution: 4K High Detail', 'AI Classification: High'],
    powerRequirement: 'High',
    icon: 'Camera',
    unitCost: 550,
    massKg: 2.5
  }
];

export const GRIPPER_OPTIONS: ComponentOption<GripperType>[] = [
  {
    id: 'Pneumatic 2-Finger',
    title: 'Pneumatic 2-Finger',
    description: 'Heavy pneumatic parallel claw for secure, high-force payload clamping.',
    specs: ['Grip Force: 400N', 'Speed: Fast', 'Mass: 4.5 kg', 'Best For: Crates & Heavy Payloads'],
    powerRequirement: 'High',
    icon: 'Hand',
    unitCost: 400,
    massKg: 4.5
  },
  {
    id: 'Servo Claw',
    title: 'Servo Claw',
    description: 'Precision articulated multi-joint claw for delicate object sorting & rescue kit handling.',
    specs: ['Grip Force: 120N', 'Precision: Sub-mm', 'Mass: 2.0 kg', 'Best For: Sorting & Rescue Tools'],
    powerRequirement: 'Medium',
    icon: 'Scissors',
    unitCost: 300,
    massKg: 2.0
  },
  {
    id: 'Magnetic Lifter',
    title: 'Magnetic Lifter',
    description: 'Electromagnetic contact head engineered to clamp steel pipes and ferrous metal plates.',
    specs: ['Grip Force: 600N (Ferrous)', 'Precision: Contact', 'Mass: 3.5 kg', 'Best For: Steel Pipe Patches'],
    powerRequirement: 'Medium',
    icon: 'Magnet',
    unitCost: 350,
    massKg: 3.5
  }
];

export const MOTOR_OPTIONS: ComponentOption<MotorPowerType>[] = [
  {
    id: 'High-Torque DC',
    title: 'High-Torque DC',
    description: 'Geared brushed DC motor providing maximum stall torque for heavy ramps and pipe ascents.',
    specs: ['Stall Torque: 45 Nm', 'Max RPM: 3,000', 'Mass: 5.0 kg', 'Efficiency: High Load'],
    powerRequirement: 'High',
    icon: 'Zap',
    unitCost: 320,
    massKg: 5.0
  },
  {
    id: 'Brushless High-Speed',
    title: 'Brushless High-Speed',
    description: 'High-efficiency 3-phase BLDC motor for rapid acceleration and high-speed factory conveyor sorting.',
    specs: ['Stall Torque: 15 Nm', 'Max RPM: 12,000', 'Mass: 2.5 kg', 'Efficiency: High Speed'],
    powerRequirement: 'Medium',
    icon: 'Activity',
    unitCost: 420,
    massKg: 2.5
  },
  {
    id: 'Precision Stepper',
    title: 'Precision Stepper',
    description: 'Micro-stepping closed-loop motor offering exact angular position control for legged locomotion.',
    specs: ['Step Accuracy: 0.9°', 'Holding Torque: 28 Nm', 'Mass: 3.5 kg', 'Efficiency: High Precision'],
    powerRequirement: 'High',
    icon: 'Target',
    unitCost: 380,
    massKg: 3.5
  }
];

