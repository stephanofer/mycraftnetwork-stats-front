;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="0ea0cb6d-0ead-4866-bd1c-f8d535f0a43b",e._sentryDebugIdIdentifier="sentry-dbid-0ea0cb6d-0ead-4866-bd1c-f8d535f0a43b")}catch(e){}}();import { N as NOOP_MIDDLEWARE_HEADER } from './astro/server_D4xJ1nRx.mjs';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

export { NOOP_MIDDLEWARE_FN as N };
