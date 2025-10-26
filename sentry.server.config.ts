import * as Sentry from "@sentry/astro";
import { SECRET_SENTRY_DSN } from "astro:env/client";

Sentry.init({
  dsn: SECRET_SENTRY_DSN,
  sendDefaultPii: true,
  tracesSampleRate: 0.05,
});
