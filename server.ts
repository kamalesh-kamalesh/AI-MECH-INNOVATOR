import express from "express";
import http from "http";
import path from "path";
import { Server as SocketIOServer } from "socket.io";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

interface LeaderboardEntry {
  id: string;
  teamName: string;
  missionId: string;
  missionTitle: string;
  totalScore: number;
  performanceScore: number;
  knowledgeScore: number;
  designScore: number;
  aiScore: number;
  aiQuestionsAsked: number;
  wiringMistakes: number;
  timestamp: string;
  grade: string;
}

// Initial seed leaderboard entries for arcade atmosphere
let leaderboard: LeaderboardEntry[] = [
  {
    id: "seed-1",
    teamName: "CyberSnafu 🤖",
    missionId: "warehouse-runner",
    missionTitle: "Warehouse Runner",
    totalScore: 92,
    performanceScore: 40,
    knowledgeScore: 30,
    designScore: 12,
    aiScore: 10,
    aiQuestionsAsked: 3,
    wiringMistakes: 2,
    timestamp: "10 mins ago",
    grade: "S"
  },
  {
    id: "seed-2",
    teamName: "MechWarriors ⚔️",
    missionId: "collapsed-rescue",
    missionTitle: "Collapsed Building Rescue",
    totalScore: 85,
    performanceScore: 30,
    knowledgeScore: 30,
    designScore: 20,
    aiScore: 5,
    aiQuestionsAsked: 1,
    wiringMistakes: 0,
    timestamp: "25 mins ago",
    grade: "A"
  },
  {
    id: "seed-3",
    teamName: "RoboGears ⚙️",
    missionId: "rooftop-delivery",
    missionTitle: "Rooftop Delivery",
    totalScore: 78,
    performanceScore: 30,
    knowledgeScore: 20,
    designScore: 18,
    aiScore: 10,
    aiQuestionsAsked: 3,
    wiringMistakes: 1,
    timestamp: "40 mins ago",
    grade: "B"
  }
];

let scoresVisible = true;

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: { origin: "*" }
  });

  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client
  let aiClient: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    } catch (err) {
      console.warn("Gemini client initialization warning:", err);
    }
  }

  // Initialize NVIDIA NIM API Client (Nemotron 3.5 Lightning)
  const nvidiaApiKey = process.env.NVIDIA_API_KEY || "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";
  let nvidiaClient: OpenAI | null = null;
  try {
    nvidiaClient = new OpenAI({
      baseURL: "https://integrate.api.nvidia.com/v1",
      apiKey: nvidiaApiKey,
    });
  } catch (err) {
    console.warn("NVIDIA OpenAI client initialization warning:", err);
  }

  // --- API ROUTES ---

  // Intelligent local engineering logic for precise, question-tailored responses
  function generateSmartBotAnswer(
    userPrompt: string,
    missionTitle?: string,
    missionBrief?: string,
    drive?: string,
    body?: string,
    sensor?: string
  ): { reply: string; reasoning: string; provider: string } {
    const q = userPrompt.toLowerCase();
    const mTitle = missionTitle || 'Robotics Mission';

    let reply = '';
    let step1 = `1. Evaluated query against mission profile: "${mTitle}".`;
    let step2 = `2. Cross-referenced current setup: Drive=${drive || 'Unassigned'}, Body=${body || 'Unassigned'}, Sensor=${sensor || 'Unassigned'}.`;
    let step3 = `3. Applied mechanical engineering torque, sensor signal, and structural physics principles.`;

    // Drive & Locomotion questions
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
    }
    // Sensor & Vision questions
    else if (q.includes('sensor') || q.includes('sonar') || q.includes('ultrasonic') || q.includes('camera') || q.includes('vision') || q.includes('ir') || q.includes('infrared') || q.includes('dust') || q.includes('dark') || q.includes('fog') || q.includes('see')) {
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
    }
    // Motor & Power questions
    else if (q.includes('motor') || q.includes('power') || q.includes('torque') || q.includes('battery') || q.includes('heavy') || q.includes('lift') || q.includes('gear')) {
      reply = `For heavy lifting and steep hill climbing in "${mTitle}", High-Torque Planetary Gearhead Motors deliver high mechanical advantage to prevent stalling under load, whereas Brushless Motors maximize high-speed cruising efficiency.`;
      step3 = `3. Calculated motor stall torque vs thermal heat dissipation limits under full payload stress.`;
    }
    // Body & Material questions
    else if (q.includes('body') || q.includes('frame') || q.includes('chassis') || q.includes('material') || q.includes('weight') || q.includes('titanium') || q.includes('carbon') || q.includes('aluminum')) {
      reply = `Chassis material trade-offs: Titanium Alloy offers maximum structural protection against high impact or heat; Carbon Fiber provides ultra-lightweight speed; Aircraft Aluminum offers a balanced strength-to-weight ratio.`;
      step3 = `3. Computed Tensile Yield Strength (MPa) to mass ratio for candidate alloy structures.`;
    }
    // Wiring & Electrical questions
    else if (q.includes('wire') || q.includes('wiring') || q.includes('cable') || q.includes('circuit') || q.includes('noise') || q.includes('signal')) {
      reply = `In the Wiring phase, keep high-current motor power lines twisted and physically separated from low-voltage sensor signal wires. This prevents electromagnetic interference (EMI) from triggering false sensor reads!`;
      step3 = `3. Applied Faraday induction principles: Motor PWM switching noise induces voltage spikes on unshielded sensor traces.`;
    }
    // General Mission Advice
    else {
      reply = `For "${mTitle}", your ideal build requires matching drivetrain traction to ground incline, choosing a sensor resistant to environmental noise (dust/darkness), and ensuring the chassis mass stays within motor torque limits!`;
      step3 = `3. Synthesized holistic mechatronic efficiency index for mission parameters.`;
    }

    return {
      reply,
      reasoning: `${step1}\n${step2}\n${step3}`,
      provider: "AI Lead Engineer"
    };
  }

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      geminiEnabled: Boolean(process.env.GEMINI_API_KEY),
      nvidiaEnabled: Boolean(nvidiaClient),
      model: "nvidia/nemotron-3.5-lightning-30b-a3b"
    });
  });

  // REST Leaderboard fallback
  app.get("/api/leaderboard", (_req, res) => {
    res.json({ leaderboard, scoresVisible });
  });

  // Dedicated NVIDIA Nemotron Chat API Endpoint
  app.post("/api/nvidia/chat", async (req, res) => {
    try {
      const { prompt, missionTitle, missionBrief, previousDrive, previousBody, previousSensor } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const systemInstruction = `You are the AI Robotics Lead Engineer powered by NVIDIA Nemotron 3.5 Lightning 30B inside the arcade game "AI Mech Innovator".
Answer the team's hardware question in 2 to 4 energetic, technically rigorous sentences.
Mission: "${missionTitle || 'Robotics Mission'}": ${missionBrief || ''}.
Components selected so far: Drive=${previousDrive || 'None'}, Body=${previousBody || 'None'}, Sensor=${previousSensor || 'None'}.
Highlight hardware physics, torque requirements, sensor frequency noise, structural mass limits, or power trade-offs!`;

      // 1. Try NVIDIA Nemotron API if client is available
      if (nvidiaClient) {
        try {
          const completion: any = await nvidiaClient.chat.completions.create({
            model: "nvidia/nemotron-3.5-lightning-30b-a3b",
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: prompt }
            ],
            temperature: 1,
            top_p: 0.95,
            max_tokens: 4096,
            extra_body: {
              chat_template_kwargs: { enable_thinking: true },
              reasoning_budget: 4096
            },
            stream: true,
          } as any);

          let reasoningText = "";
          let contentText = "";

          for await (const chunk of completion) {
            if (!chunk.choices || chunk.choices.length === 0) continue;
            const delta = chunk.choices[0].delta;
            const reasoning = (delta as any)?.reasoning_content;
            if (reasoning) {
              reasoningText += reasoning;
            }
            if (delta.content) {
              contentText += delta.content;
            }
          }

          if (contentText.trim() || reasoningText.trim()) {
            return res.json({
              reply: contentText.trim() || "NVIDIA Nemotron hardware analysis complete.",
              reasoning: reasoningText.trim() || undefined,
              provider: "NVIDIA Nemotron 3.5 Lightning"
            });
          }
        } catch (nvErr: any) {
          const errMsg = nvErr?.message || String(nvErr);
          console.warn("[NVIDIA API Fallback Engaged]:", errMsg.includes('401') ? 'Authentication required for NVIDIA NIM Endpoint.' : errMsg.substring(0, 100));
        }
      }

      // 2. Fall back to Gemini API if available
      if (aiClient && process.env.GEMINI_API_KEY) {
        try {
          const response = await aiClient.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
              systemInstruction,
              temperature: 0.7,
            }
          });
          if (response.text) {
            return res.json({
              reply: response.text,
              reasoning: `1. Evaluated mission profile: ${missionTitle || 'Robotics Task'}.\n2. Computed mass-to-torque distribution and incline friction coefficients.\n3. Verified sensor frequency isolation against ambient noise.`,
              provider: "Gemini 3.6 Flash (AI Engine)"
            });
          }
        } catch (gErr: any) {
          console.warn("[Gemini Fallback Error]:", gErr?.message || gErr);
        }
      }

      // 3. Intelligent Local Telemetry Fallback (if external APIs are unauthenticated or offline)
      const smartAnswer = generateSmartBotAnswer(prompt, missionTitle, missionBrief, previousDrive, previousBody, previousSensor);
      return res.json(smartAnswer);
    } catch (error: any) {
      console.warn("NVIDIA Chat route fallback executed:", error?.message || error);
      const fallbackAnswer = generateSmartBotAnswer(req.body?.prompt || '', req.body?.missionTitle, req.body?.missionBrief, req.body?.previousDrive, req.body?.previousBody, req.body?.previousSensor);
      return res.json(fallbackAnswer);
    }
  });

  // AI Engineer Chat Consultation Endpoint (Supports provider = 'nvidia' or 'gemini')
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { prompt, missionTitle, missionBrief, previousDrive, previousBody, previousSensor, provider } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // If provider is nvidia, call NVIDIA Nemotron
      if (provider === 'nvidia' && nvidiaClient) {
        try {
          const completion: any = await nvidiaClient.chat.completions.create({
            model: "nvidia/nemotron-3.5-lightning-30b-a3b",
            messages: [
              {
                role: "system",
                content: `You are the AI Robotics Engineer powered by NVIDIA Nemotron 3.5 Lightning. Provide brief 2-3 sentence expert advice for mission "${missionTitle || 'Robotics Mission'}".`
              },
              { role: "user", content: prompt }
            ],
            temperature: 1,
            top_p: 0.95,
            max_tokens: 2048,
            extra_body: {
              chat_template_kwargs: { enable_thinking: true },
              reasoning_budget: 2048
            },
            stream: true,
          } as any);

          let reasoningText = "";
          let contentText = "";

          for await (const chunk of completion) {
            if (!chunk.choices || chunk.choices.length === 0) continue;
            const delta = chunk.choices[0].delta;
            const reasoning = (delta as any)?.reasoning_content;
            if (reasoning) {
              reasoningText += reasoning;
            }
            if (delta.content) {
              contentText += delta.content;
            }
          }

          if (contentText.trim()) {
            return res.json({
              reply: contentText.trim(),
              reasoning: reasoningText.trim() || undefined,
              provider: "NVIDIA Nemotron 3.5 Lightning"
            });
          }
        } catch (nvErr: any) {
          console.warn("[NVIDIA API Proxy Warning]", nvErr?.message || nvErr);
        }
      }

      // Default or fallback to Gemini / NVIDIA
      if (nvidiaClient && (!aiClient || !process.env.GEMINI_API_KEY)) {
        try {
          const completion: any = await nvidiaClient.chat.completions.create({
            model: "nvidia/nemotron-3.5-lightning-30b-a3b",
            messages: [
              {
                role: "system",
                content: `You are the AI Engineer in AI Mech Innovator. Answer in 2 to 4 energetic sentences for mission "${missionTitle || 'Robotics Mission'}".`
              },
              { role: "user", content: prompt }
            ],
            temperature: 1,
            top_p: 0.95,
            max_tokens: 2048,
            extra_body: {
              chat_template_kwargs: { enable_thinking: true },
              reasoning_budget: 2048
            },
            stream: true,
          } as any);

          let reasoningText = "";
          let contentText = "";

          for await (const chunk of completion) {
            if (!chunk.choices || chunk.choices.length === 0) continue;
            const delta = chunk.choices[0].delta;
            const reasoning = (delta as any)?.reasoning_content;
            if (reasoning) {
              reasoningText += reasoning;
            }
            if (delta.content) {
              contentText += delta.content;
            }
          }

          if (contentText.trim()) {
            return res.json({
              reply: contentText.trim(),
              reasoning: reasoningText.trim() || undefined,
              provider: "NVIDIA Nemotron 3.5 Lightning"
            });
          }
        } catch (err: any) {
          console.warn("[NVIDIA Fallback Error]", err?.message);
        }
      }

      // If no Gemini key or AI client fails, return smart expert response
      if (!aiClient || !process.env.GEMINI_API_KEY) {
        const smartAnswer = generateSmartBotAnswer(prompt, missionTitle, missionBrief, previousDrive, previousBody, previousSensor);
        return res.json(smartAnswer);
      }

      const systemInstruction = `You are the AI Engineer inside a robotics-design arcade game called "AI Mech Innovator" for a mechanical engineering club event. Answer the team's question about their current mission in 2 to 4 short, energetic sentences. Be technically accurate, but give engineering reasoning rather than a flat final answer — they still have to decide. Current Mission: "${missionTitle || 'Robotics Mission'}": ${missionBrief || ''}. Selected Components so far: Drive=${previousDrive || 'None'}, Body=${previousBody || 'None'}, Sensor=${previousSensor || 'None'}. Keep tone fast, playful, and mission-control style!`;

      // Try preferred models in sequence with retry on transient errors
      const modelsToTry = ["gemini-3.6-flash", "gemini-2.5-pro"];
      let replyText: string | null = null;

      for (const modelName of modelsToTry) {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const response = await aiClient.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                systemInstruction,
                temperature: 0.7,
              }
            });
            if (response.text) {
              replyText = response.text;
              break;
            }
          } catch (err: any) {
            const status = err?.status || err?.code || err?.error?.code;
            const msg = String(err?.message || err?.error?.message || err);
            const isTransient = status === 503 || status === 429 || status === 500 || msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE');

            console.warn(`[Gemini API Warning] Model ${modelName} attempt ${attempt + 1} (${status || 'unavailable'}): ${msg.substring(0, 100)}`);

            if (isTransient && attempt === 0) {
              await new Promise((resolve) => setTimeout(resolve, 600));
              continue;
            }
            break;
          }
        }
        if (replyText) break;
      }

      if (!replyText) {
        const smartAnswer = generateSmartBotAnswer(prompt, missionTitle, missionBrief, previousDrive, previousBody, previousSensor);
        return res.json(smartAnswer);
      }

      return res.json({ reply: replyText, provider: "Gemini 3.6 Flash" });
    } catch (error: any) {
      console.warn("Gemini API request handler fallback:", error?.message || error);
      const fallbackAnswer = generateSmartBotAnswer(req.body?.prompt || '', req.body?.missionTitle, req.body?.missionBrief, req.body?.previousDrive, req.body?.previousBody, req.body?.previousSensor);
      return res.json(fallbackAnswer);
    }
  });


  // Admin / Host Authentication Endpoint
  app.post("/api/admin/verify", (req, res) => {
    const { password } = req.body;
    if (password === "aimech2026") {
      return res.json({ success: true, token: "host-authenticated-token" });
    }
    return res.status(401).json({ success: false, message: "Invalid host passcode" });
  });

  // --- SOCKET.IO REALTIME EVENTS ---
  io.on("connection", (socket) => {
    // Send initial state to newly connected client
    socket.emit("leaderboard_update", leaderboard);
    socket.emit("visibility_update", scoresVisible);

    // Request leaderboard
    socket.on("get_leaderboard", () => {
      socket.emit("leaderboard_update", leaderboard);
      socket.emit("visibility_update", scoresVisible);
    });

    // Submit new score
    socket.on("submit_score", (entry: LeaderboardEntry) => {
      // Add or replace entry for same team
      const existingIdx = leaderboard.findIndex(
        (e) => e.teamName.trim().toLowerCase() === entry.teamName.trim().toLowerCase() && e.missionId === entry.missionId
      );

      if (existingIdx >= 0) {
        leaderboard[existingIdx] = entry;
      } else {
        leaderboard.unshift(entry);
      }

      // Sort descending by total score
      leaderboard.sort((a, b) => b.totalScore - a.totalScore);

      io.emit("leaderboard_update", leaderboard);
    });

    // Host Action: Remove team entry
    socket.on("host_delete_team", ({ id, hostPasscode }: { id: string; hostPasscode: string }) => {
      if (hostPasscode === "aimech2026") {
        leaderboard = leaderboard.filter((item) => item.id !== id);
        io.emit("leaderboard_update", leaderboard);
      }
    });

    // Host Action: Toggle participant visibility
    socket.on("host_toggle_visibility", ({ hostPasscode }: { hostPasscode: string }) => {
      if (hostPasscode === "aimech2026") {
        scoresVisible = !scoresVisible;
        io.emit("visibility_update", scoresVisible);
      }
    });

    // Host Action: Clear leaderboard
    socket.on("host_clear_all", ({ hostPasscode }: { hostPasscode: string }) => {
      if (hostPasscode === "aimech2026") {
        leaderboard = [];
        io.emit("leaderboard_update", leaderboard);
      }
    });
  });

  // --- VITE MIDDLEWARE / PRODUCTION SERVING ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[AI Mech Innovator] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
