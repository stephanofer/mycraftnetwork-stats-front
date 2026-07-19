// @ts-check
import { defineConfig, envField, passthroughImageService } from "astro/config";
import sentry from "@sentry/astro";
import sitemap from "@astrojs/sitemap";
import vercel from '@astrojs/vercel';


// https://astro.build/config
const SECRET_SENTRY_AUTH_TOKEN = process.env.SECRET_SENTRY_AUTH_TOKEN;
const SITEMAP_PAGES = new Set([
  "https://estadisticas.mycraft.es/",
  "https://estadisticas.mycraft.es/smp",
  "https://estadisticas.mycraft.es/ranking/rpg/kills",
  "https://estadisticas.mycraft.es/ranking/rpg/maxstreak",
  "https://estadisticas.mycraft.es/ranking/rpg/koth",
  "https://estadisticas.mycraft.es/rpg/clans",
]);


export default defineConfig({
  output: "server",
  redirects: {
    "/dungeon": { status: 301, destination: "/smp" },
    "/ranking/rpg/kd": { status: 301, destination: "/ranking/rpg/kills" },
    "/ranking/rpg/elo": { status: 301, destination: "/ranking/rpg/kills" },
    "/ranking/rpg/level": { status: 301, destination: "/ranking/rpg/kills" },
    "/ranking/survival": { status: 301, destination: "/ranking/rpg/kills" },
    "/ranking/survival/kills": { status: 301, destination: "/ranking/rpg/kills" },
    "/ranking/survival/kd": { status: 301, destination: "/ranking/rpg/kills" },
    "/ranking/survival/maxstreak": { status: 301, destination: "/ranking/rpg/maxstreak" },
    "/ranking/survival/elo": { status: 301, destination: "/ranking/rpg/kills" },
    "/ranking/survival/koth": { status: 301, destination: "/ranking/rpg/koth" },
    "/ranking/survival/level": { status: 301, destination: "/ranking/rpg/kills" },
  },
  adapter: vercel({
    isr: {
      expiration: 60 * 15,
    },
  }),
  
  image: {
    service: passthroughImageService()
  },
  
  env: {
    schema: {
      RPG_DATABASE_URL: envField.string({ context: "server", access: "secret" }),
      SKINS_DATABASE_URL: envField.string({ context: "server", access: "secret" }),
      SECRET_SENTRY_DSN: envField.string({
        context: "client",
        access: "public",
      }),
    },
  },
  
  integrations: [
    sentry({
      sourceMapsUploadOptions: {
        project: "mycraftnetwork-front",
        authToken: SECRET_SENTRY_AUTH_TOKEN,
        telemetry: false
      },
    }),
    sitemap({
      customPages: [...SITEMAP_PAGES],
      serialize(item) {
        const url = item.url;
        
        if (url === 'https://estadisticas.mycraft.es/') {
          item.priority = 1.0;
          item.changefreq = "never" as any; 
          item.lastmod = new Date().toString();
          return item;
        }
        
        if (url.includes('/ranking/rpg/')) {
          item.priority = 0.9;
          item.changefreq = 'daily' as any; 
          item.lastmod = new Date().toString();
          return item;
        }
        
        if (url.includes('/rpg/clans')) {
          item.priority = 0.8;
          item.changefreq = 'daily' as any;
          return item;
        }
        return item;
      },
      
      filter: (page) => SITEMAP_PAGES.has(page),
    })
  ],

  site: "https://estadisticas.mycraft.es/",
  base: "/",
  
  vite: {
    logLevel: "error",
  },
});
