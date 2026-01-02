// @ts-check
import { defineConfig, envField, passthroughImageService } from "astro/config";
import sentry from "@sentry/astro";
import sitemap from "@astrojs/sitemap";
import vercel from '@astrojs/vercel';


// https://astro.build/config
const SECRET_SENTRY_DSN = process.env.SECRET_SENTRY_DSN;
const SECRET_SENTRY_AUTH_TOKEN = process.env.SECRET_SENTRY_AUTH_TOKEN;


export default defineConfig({
  output: "server",
  adapter: vercel({}),
  
  image: {
    service: passthroughImageService()
  },
  
  env: {
    schema: {
      API_RPG: envField.string({ context: "server", access: "secret" }),
      API_SURVI: envField.string({ context: "server", access: "secret" }),
      API_PLAYERS_RPG: envField.string({ context: "server", access: "secret" }),
      API_PLAYERS_SURVI: envField.string({
        context: "server",
        access: "secret",
      }),
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
        
        if (url.includes('/ranking/survival/')) {
          item.priority = 0.9;
          item.changefreq = 'daily' as any; 
          item.lastmod = new Date().toString();
          return item;
        }
      },
      
      filter: (page) => {
        return !page.includes('/admin/') && 
               !page.includes('/api/') &&
               !page.includes('/404') &&
               !page.includes('/500');
      }
    })
  ],

  site: "https://estadisticas.mycraft.es/",
  base: "/",
  
  vite: {
    logLevel: "error",
  },
});