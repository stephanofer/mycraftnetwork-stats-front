// @ts-check
import { defineConfig, envField, passthroughImageService } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from '@astrojs/vercel';


// https://astro.build/config
const SITEMAP_PAGES = new Set([
  "https://estadisticas.mycraft.es/",
  "https://estadisticas.mycraft.es/ranking/rpg/kills",
  "https://estadisticas.mycraft.es/ranking/rpg/maxstreak",
  "https://estadisticas.mycraft.es/ranking/rpg/koth",
  "https://estadisticas.mycraft.es/rpg/clans",
  "https://estadisticas.mycraft.es/rpg/clan-wars",
  "https://estadisticas.mycraft.es/rpg/clan-wars/clan-war-1-temporada-3",
]);


export default defineConfig({
  output: "server",
  redirects: {
    "/dungeon": { status: 301, destination: "/" },
    "/smp": { status: 301, destination: "/" },
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
      exclude: ["/rpg/clans/[id]/[slug]"],
    },
  }),
  
  image: {
    service: passthroughImageService()
  },
  
  env: {
    schema: {
      RPG_DATABASE_URL: envField.string({ context: "server", access: "secret" }),
      SKINS_DATABASE_URL: envField.string({ context: "server", access: "secret" }),
    },
  },
  
  integrations: [
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
        
        if (url.includes('/rpg/clans') || url.includes('/rpg/clan-wars')) {
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
