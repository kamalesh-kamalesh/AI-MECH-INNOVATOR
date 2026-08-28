interface Env {
  GEMINI_API_KEY?: string;
  NVIDIA_API_KEY?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  return new Response(JSON.stringify({
    status: "ok",
    geminiEnabled: Boolean(context.env.GEMINI_API_KEY),
    nvidiaEnabled: Boolean(context.env.NVIDIA_API_KEY),
    model: "nvidia/nemotron-3.5-lightning-30b-a3b",
    platform: "cloudflare-pages",
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
