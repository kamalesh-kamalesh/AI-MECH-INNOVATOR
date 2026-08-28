import { generateSmartBotAnswer } from '../../utils/smartBot';

interface Env {
  GEMINI_API_KEY?: string;
  NVIDIA_API_KEY?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as any;
    const { prompt, missionTitle, missionBrief, previousDrive, previousBody, previousSensor, provider } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemInstruction = `You are the AI Engineer inside a robotics-design arcade game called "AI Mech Innovator" for a mechanical engineering club event. Answer the team's question about their current mission in 2 to 4 short, energetic sentences. Be technically accurate, but give engineering reasoning rather than a flat final answer — they still have to decide. Current Mission: "${missionTitle || 'Robotics Mission'}": ${missionBrief || ''}. Selected Components so far: Drive=${previousDrive || 'None'}, Body=${previousBody || 'None'}, Sensor=${previousSensor || 'None'}. Keep tone fast, playful, and mission-control style!`;

    // If provider is nvidia, try NVIDIA first
    const nvidiaApiKey = context.env.NVIDIA_API_KEY || "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";

    if ((provider === 'nvidia' || !context.env.GEMINI_API_KEY) && nvidiaApiKey) {
      try {
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${nvidiaApiKey}`,
          },
          body: JSON.stringify({
            model: "nvidia/nemotron-3.5-lightning-30b-a3b",
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: prompt },
            ],
            temperature: 1,
            top_p: 0.95,
            max_tokens: 2048,
            stream: false,
          }),
        });

        if (response.ok) {
          const data = await response.json() as any;
          const contentText = data.choices?.[0]?.message?.content;
          if (contentText?.trim()) {
            return new Response(JSON.stringify({
              reply: contentText.trim(),
              reasoning: undefined,
              provider: "NVIDIA Nemotron 3.5 Lightning",
            }), {
              headers: { 'Content-Type': 'application/json' },
            });
          }
        }
      } catch (nvErr) {
        console.warn("[NVIDIA API Warning]", nvErr);
      }
    }

    // Try Gemini API
    const geminiKey = context.env.GEMINI_API_KEY;
    if (geminiKey) {
      const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro"];

      for (const modelName of modelsToTry) {
        try {
          const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                system_instruction: { parts: [{ text: systemInstruction }] },
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7 },
              }),
            }
          );

          if (geminiResponse.ok) {
            const geminiData = await geminiResponse.json() as any;
            const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              return new Response(JSON.stringify({
                reply: text,
                provider: "Gemini 1.5 Flash",
              }), {
                headers: { 'Content-Type': 'application/json' },
              });
            }
          }
        } catch (err) {
          console.warn(`[Gemini ${modelName} Error]`, err);
        }
      }
    }

    // Smart local fallback
    const smartAnswer = generateSmartBotAnswer(prompt, missionTitle, missionBrief, previousDrive, previousBody, previousSensor);
    return new Response(JSON.stringify(smartAnswer), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const body = await context.request.clone().json().catch(() => ({})) as any;
    const fallbackAnswer = generateSmartBotAnswer(body?.prompt || '', body?.missionTitle, body?.missionBrief, body?.previousDrive, body?.previousBody, body?.previousSensor);
    return new Response(JSON.stringify(fallbackAnswer), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
