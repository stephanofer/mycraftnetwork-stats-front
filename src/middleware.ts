import type { MiddlewareHandler } from "astro";

const CONFIG = {
  blockedUserAgents: ["sqlmap", "nikto", "nmap", "masscan", "zgrab"],
};

export const onRequest: MiddlewareHandler = async ({ request, url }, next) => {
  const path = url.pathname;

  if (path.startsWith("/api/")) {
    const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
    const isBlocked = CONFIG.blockedUserAgents.some(blocked =>
      userAgent.includes(blocked)
    );

    if (isBlocked) {
      return new Response(JSON.stringify({ error: "Access denied" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const response = await next();
  const headers = new Headers(response.headers);

  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), geolocation=(), microphone=()");
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
