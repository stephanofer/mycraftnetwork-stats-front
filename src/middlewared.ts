import type { MiddlewareHandler } from "astro";

const CONFIG = {
  blockedUserAgents: ["sqlmap", "nikto", "nmap", "masscan", "zgrab"],
};

export const onRequest: MiddlewareHandler = async ({ request, url }, next) => {
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
  const path = url.pathname;
  
  if (path.startsWith("/api/")) {
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
  
  if (!headers.has("Cache-Control")) {
    if (path.startsWith("/api/")) {
      headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
    } else if (path.startsWith("/player/") || path.startsWith("/staff/")) {
      headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    } else {
      headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
    }
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};