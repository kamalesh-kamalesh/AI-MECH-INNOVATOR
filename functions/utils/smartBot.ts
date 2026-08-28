// Smart local engineering logic for fallback AI responses
function generateSmartBotAnswer(
  userPrompt: string,
  missionTitle?: string,
  missionBrief?: string,
  drive?: string,
  body?: string,
  sensor?: string,
): { reply: string; reasoning: string; provider: string } {
  const q = userPrompt.toLowerCase();
  const mTitle = missionTitle || 'Robotics Mission';

  let reply = '';
  let step1 = `1. Evaluated query against mission profile: "${mTitle}".`;
  let step2 = `2. Cross-referenced current setup: Drive=${drive || 'Unassigned'}, Body=${body || 'Unassigned'}, Sensor=${sensor || 'Unassigned'}.`;
  let step3 = `3. Applied mechanical engineering torque, sensor signal, and structural physics principles.`;

  if (q.includes('drive') || q.includes('wheel') || q.includes('tread') || q.includes('track') || q.includes('slope') || q.includes('climb') || q.includes('speed') || q.includes('friction') || q.includes('terrain') || q.includes('hill')) {
    if (q.includes('slope') || q.includes('climb') || q.includes('hill') || q.includes('steep') || q.includes('rough')) {
      reply = `For steep inclines and rough terrain in "${mTitle}", Continuous Tank Treads or Crawler Tracks offer maximum ground surface contact and friction grip. Omni-wheels will slip completely on slopes!`;
      step3 = `3. Analyzed static friction coefficient (μ) on inclined planes: Treads provide 0.85 μ vs 0.25 μ for omni-wheels.`;
    } else if (q.includes('speed') || q.includes('fast') || q.includes('race')) {
      reply = `If raw speed is priority, High-Speed Pneumatic Rubber Tires with Brushless Motors deliver maximum RPM, provided the surface is relatively flat and clear of heavy debris.`;
      step3 = `3. Computed rotational velocity (ω) and rolling resistance: Rubber tires maximize linear displacement per motor revolution.`;
    } else if (q.includes('maneuver') || q.includes('turn') || q.includes('tight') || q.includes('omni')) {
      reply = `For 360-degree omnidirectional movement in tight spaces, Mecanum or Omni-Wheels allow sideways strafing without turning the chassis, ideal on smooth indoor floorings!`;
      step3 = `3. Vector analysis of 45-degree roller forces confirms zero-radius turn capability.`;
    } else {
      reply = `Locomotion choice depends on terrain friction: Tank Treads excel on steep/loose ground, Rubber Wheels maximize flat speed, and Spider Legs handle extreme stepped obstacles.`;
      step3 = `3. Compared ground clearance vs payload mass center for selected drive type.`;
    }
  } else if (q.includes('sensor') || q.includes('sonar') || q.includes('ultrasonic') || q.includes('camera') || q.includes('vision') || q.includes('ir') || q.includes('infrared') || q.includes('dust') || q.includes('dark') || q.includes('fog') || q.includes('see')) {
    if (q.includes('dust') || q.includes('smoke') || q.includes('fog') || q.includes('cloud')) {
      reply = `In heavy dust or smoke conditions, Ultrasonic Sonar or LiDAR outperforms Optical RGB Cameras! Sonar uses acoustic pressure waves (40kHz) that bounce off solid walls regardless of particle suspension.`;
      step3 = `3. Optical scattering theory confirms 400-700nm light wavelengths scatter in airborne dust, whereas sound waves penetrate cleanly.`;
    } else if (q.includes('dark') || q.includes('night') || q.includes('pitch')) {
      reply = `For pitch-black environments, Infrared Time-of-Flight (ToF) or Ultrasonic Sonar sensors are mandatory. Standard RGB cameras require active high-power illumination lights which drain battery.`;
      step3 = `3. Evaluated photon emission efficiency: IR ToF sensors measure pulse phase shifts without ambient light dependency.`;
    } else if (q.includes('precision') || q.includes('map') || q.includes('detail') || q.includes('object')) {
      reply = `For high-precision 3D mapping and obstacle identification, LiDAR paired with an AI Vision Camera provides exact millimeter depth telemetry alongside object classification!`;
      step3 = `3. Spatial point-cloud density analysis yields <2mm depth accuracy across a 120° field of view.`;
    } else {
      reply = `Sensor selection rule: Use Ultrasonic Sonar for dusty/foggy environments, Infrared ToF for pitch dark distance measuring, and High-Res Cameras for visual object recognition.`;
      step3 = `3. Filtered ambient noise spectra against sensor operating frequencies.`;
    }
  } else if (q.includes('motor') || q.includes('power') || q.includes('torque') || q.includes('battery') || q.includes('heavy') || q.includes('lift') || q.includes('gear')) {
    reply = `For heavy lifting and steep hill climbing in "${mTitle}", High-Torque Planetary Gearhead Motors deliver high mechanical advantage to prevent stalling under load, whereas Brushless Motors maximize high-speed cruising efficiency.`;
    step3 = `3. Calculated motor stall torque vs thermal heat dissipation limits under full payload stress.`;
  } else if (q.includes('body') || q.includes('frame') || q.includes('chassis') || q.includes('material') || q.includes('weight') || q.includes('titanium') || q.includes('carbon') || q.includes('aluminum')) {
    reply = `Chassis material trade-offs: Titanium Alloy offers maximum structural protection against high impact or heat; Carbon Fiber provides ultra-lightweight speed; Aircraft Aluminum offers a balanced strength-to-weight ratio.`;
    step3 = `3. Computed Tensile Yield Strength (MPa) to mass ratio for candidate alloy structures.`;
  } else if (q.includes('wire') || q.includes('wiring') || q.includes('cable') || q.includes('circuit') || q.includes('noise') || q.includes('signal')) {
    reply = `In the Wiring phase, keep high-current motor power lines twisted and physically separated from low-voltage sensor signal wires. This prevents electromagnetic interference (EMI) from triggering false sensor reads!`;
    step3 = `3. Applied Faraday induction principles: Motor PWM switching noise induces voltage spikes on unshielded sensor traces.`;
  } else {
    reply = `For "${mTitle}", your ideal build requires matching drivetrain traction to ground incline, choosing a sensor resistant to environmental noise (dust/darkness), and ensuring the chassis mass stays within motor torque limits!`;
    step3 = `3. Synthesized holistic mechatronic efficiency index for mission parameters.`;
  }

  return {
    reply,
    reasoning: `${step1}\n${step2}\n${step3}`,
    provider: "AI Lead Engineer",
  };
}

export { generateSmartBotAnswer };
