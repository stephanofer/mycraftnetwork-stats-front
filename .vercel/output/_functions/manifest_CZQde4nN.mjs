;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="63d19c55-f2b9-4af8-9ab0-0ca56c594e36",e._sentryDebugIdIdentifier="sentry-dbid-63d19c55-f2b9-4af8-9ab0-0ca56c594e36")}catch(e){}}();import { e as decodeKey } from './chunks/astro/server_D4xJ1nRx.mjs';
import './chunks/astro-designed-error-pages_BfML2Ii8.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_3kxVj83o.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/stephanofer/workspace/mycraft/mycraftnetwork-stats-front/","cacheDir":"file:///home/stephanofer/workspace/mycraft/mycraftnetwork-stats-front/node_modules/.astro/","outDir":"file:///home/stephanofer/workspace/mycraft/mycraftnetwork-stats-front/dist/","srcDir":"file:///home/stephanofer/workspace/mycraft/mycraftnetwork-stats-front/src/","publicDir":"file:///home/stephanofer/workspace/mycraft/mycraftnetwork-stats-front/public/","buildClientDir":"file:///home/stephanofer/workspace/mycraft/mycraftnetwork-stats-front/dist/client/","buildServerDir":"file:///home/stephanofer/workspace/mycraft/mycraftnetwork-stats-front/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.gDnLjoVL.js"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@5.10.1_@types+node@22.15.3_rollup@4.38.0_typescript@5.8.3_yaml@2.8.0/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}}],"site":"https://estadisticas.mycraft.es/","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/stephanofer/workspace/mycraft/mycraftnetwork-stats-front/src/pages/ranking/[mode]/[type].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/ranking/[mode]/[type]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/home/stephanofer/workspace/mycraft/mycraftnetwork-stats-front/src/pages/404.astro",{"propagation":"none","containsHead":true}],["/home/stephanofer/workspace/mycraft/mycraftnetwork-stats-front/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-page:node_modules/.pnpm/astro@5.10.1_@types+node@22.15.3_rollup@4.38.0_typescript@5.8.3_yaml@2.8.0/node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/ranking/[mode]/[type]@_@astro":"pages/ranking/_mode_/_type_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","/home/stephanofer/workspace/mycraft/mycraftnetwork-stats-front/node_modules/.pnpm/astro@5.10.1_@types+node@22.15.3_rollup@4.38.0_typescript@5.8.3_yaml@2.8.0/node_modules/astro/dist/assets/services/noop.js":"chunks/noop_DCHC-j8N.mjs","\u0000@astrojs-manifest":"manifest_CZQde4nN.mjs","/home/stephanofer/workspace/mycraft/mycraftnetwork-stats-front/src/components/LeaderBoards.astro":"chunks/LeaderBoards_BbFAqc02.mjs","/home/stephanofer/workspace/mycraft/mycraftnetwork-stats-front/node_modules/.pnpm/astro@5.10.1_@types+node@22.15.3_rollup@4.38.0_typescript@5.8.3_yaml@2.8.0/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts":"_astro/ClientRouter.astro_astro_type_script_index_0_lang.Bx3K5vQB.js","astro:scripts/page.js":"_astro/page.gDnLjoVL.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/Add.B44nvKgw.svg","/_astro/Trophy.C6IH0R9a.svg","/_astro/KD.BBQ5DvkV.svg","/_astro/Elo.Dfk9T8_w.svg","/_astro/Koth.CkU3kzTr.svg","/_astro/MaxStreak.k6KSJT5w.svg","/_astro/Sword.mwCeU9ae.svg","/_astro/Level.wkAzM1lo.svg","/_astro/Subtract.BrxNbaVx.svg","/_astro/ArrowRight.Q62noj9s.svg","/_astro/_type_.x44biVon.css","/chunks/astro_DRH0WqyI.mjs.map","/chunks/astro/server_D4xJ1nRx.mjs.map","/chunks/noop-middleware_3kxVj83o.mjs.map","/chunks/runtime_Bd43pfw_.mjs.map","/chunks/path_Cff1tqkS.mjs.map","/chunks/noop_DCHC-j8N.mjs.map","/chunks/runtime_cirzW02G.mjs.map","/manifest_CZQde4nN.mjs.map","/chunks/astro-designed-error-pages_BfML2Ii8.mjs.map","/chunks/BaseLayout_BjgYSxbg.mjs.map","/chunks/LeaderBoards_Ck6sFQ_P.mjs.map","/chunks/_astro_assets_Ogb9U0OI.mjs.map","/chunks/index_DlITuZTi.mjs.map","/chunks/index_CzGU-WsT.mjs.map","/chunks/LeaderBoards_BbFAqc02.mjs.map","/_astro-internal_middleware.mjs.map","/_noop-actions.mjs.map","/renderers.mjs.map","/pages/404.astro.mjs.map","/entry.mjs.map","/pages/_image.astro.mjs.map","/pages/ranking/_mode_/_type_.astro.mjs.map","/pages/index.astro.mjs.map","/_@astrojs-ssr-adapter.mjs.map","/robots.txt","/_astro/ClientRouter.astro_astro_type_script_index_0_lang.Bx3K5vQB.js","/_astro/page.gDnLjoVL.js","/fonts/Clash.woff2","/fonts/Inter.woff2","/fonts/Seven.woff2","/images/favicon.webp","/images/image1.webp","/images/image2.webp","/_astro/page.gDnLjoVL.js","/404.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[["@/components/LeaderBoards.astro","LeaderBoards"]],"key":"LSn3rdEr8o8spTEM9X7XJHkz21K6cQUce9+mTOu3v4Q="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
