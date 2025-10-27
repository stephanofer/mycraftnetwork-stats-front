;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="6a25e7b2-6a41-47d6-804f-8cc41edda5bc",e._sentryDebugIdIdentifier="sentry-dbid-6a25e7b2-6a41-47d6-804f-8cc41edda5bc")}catch(e){}}();import './chunks/astro-designed-error-pages_BfML2Ii8.mjs';
import './chunks/astro/server_D4xJ1nRx.mjs';
import { s as sequence } from './chunks/index_CzGU-WsT.mjs';
import { onRequest as onRequest$1 } from '@sentry/astro/middleware';

const onRequest = sequence(
	onRequest$1,
	
	
);

export { onRequest };
