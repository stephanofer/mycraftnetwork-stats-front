import type { MiddlewareHandler } from "astro";

const ALLOWED_METHODS = new Set(["GET", "HEAD"]);
const MAX_PATH_LENGTH = 256;

export const onRequest: MiddlewareHandler = async ({ request, url }, next) => {
  if (!ALLOWED_METHODS.has(request.method)) {
    return new Response(null, {
      status: 405,
      headers: { Allow: "GET, HEAD" },
    });
  }
  if (url.pathname.length > MAX_PATH_LENGTH) {
    return new Response(null, { status: 414 });
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
