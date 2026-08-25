# AI MECH INNOVATOR 🤖⚡

Tagline: **"Think it. Build it. Make the robot work!"**

A complete, production-ready web game created for mechanical engineering club events. Teams design, wire, and test a virtual robot against a randomly assigned tactical mission, consult an internal Gemini-powered AI Engineer, and land on a shared real-time Socket.io leaderboard.

---

## 🎮 Game Flow Overview (6 Rounds)

1. **Round 1 — Mission Briefing**: Teams read their assigned tactical mission (selected from a pool of 6+ real-world scenarios: *Warehouse Runner*, *Collapsed Building Rescue*, *Rooftop Delivery*, *Night Patrol*, *Assembly Line Sorter*, *Deep Shaft Inspector*).
2. **Round 2 — Components & AI Consultation**: Select 1 Drive (2-Wheel, 4-Wheel, Legged, Tracked), 1 Body (Lightweight, Heavy-Duty, Compact), and 1 Sensor (Ultrasonic, IR, Camera Vision). Ask the Gemini-powered AI Engineer up to 3 technical questions.
3. **Round 3 — Interactive Wiring**: Interactive circuit board with 7 nodes (`Battery`, `Motor`, `Drive Unit`, `Sensor`, `Controller`, `Servo`, `Gripper Arm`). Wire the 4 valid power & logic channels via touch/mouse drag or click-selection.
4. **Round 4 — Simulation Run**: Animate the robot rover moving across 4 checkpoints (Terrain 🛤️, Detection 👁️, Structure 📦, Circuit ⚡) with real-time pass/fail evaluation and mission flavor text.
5. **Round 5 — Emergency Repair**: For any failed checkpoints, troubleshoot with multiple-choice technical diagnostic questions (1 attempt only!) to recover lost points.
6. **Round 6 — Scoring & Leaderboard**: Calculates mathematical subscores out of 100:
   - **Robot Performance** (max 40 pts)
   - **Robotics Knowledge** (max 30 pts)
   - **Design / Wiring** (max 20 pts)
   - **AI Usage** (max 10 pts)
   Publishes score to the real-time Socket.io event leaderboard.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **Backend**: Express + Socket.io + TypeScript (`server.ts`)
- **AI Integration**: Gemini API (`@google/genai` SDK with `gemini-3.7-flash`) accessed via server-side `/api/gemini/chat`
- **Audio Synthesizer**: Web Audio API retro sci-fi HUD sound effects
- **Host Control**: Password-gated dashboard (`aimech2026`) with team removal, participant suspense/visibility toggle, and live telemetry stats.

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18+ recommended)
- `npm`

### Setup & Run
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables in `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Run development server (Express + Socket.io + Vite middleware):
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🌐 Deployment Instructions

### Full-Stack Build
Build the static frontend assets with Vite and bundle `server.ts` into CommonJS using esbuild:
```bash
npm run build
```

### Production Launch
Start the bundled CommonJS server:
```bash
npm run start
```
The application runs on port `3000` by default and serves both the Express backend, Socket.io WebSocket connections, and Vite SPA static assets.
