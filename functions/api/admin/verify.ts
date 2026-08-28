export const onRequestPost: PagesFunction = async (context) => {
  try {
    const body = await context.request.json() as any;
    const { password } = body;

    if (password === "aimech2026") {
      return new Response(JSON.stringify({ success: true, token: "host-authenticated-token" }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: false, message: "Invalid host passcode" }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
