import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const clanWars = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/clan-wars" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        season: z.number().int().positive(),
        number: z.number().int().positive(),
        status: z.enum(["announced", "completed", "cancelled"]),
        startsAt: z.coerce.date(),
        timezone: z.string(),
        timezoneLabel: z.string(),
        format: z.enum(["points", "control-time"]),
        objective: z.object({
            label: z.string(),
            value: z.number().positive(),
            unit: z.string(),
        }),
        koth: z.object({
            name: z.string(),
            warp: z.string().startsWith("/"),
        }),
        rewards: z.array(
            z.object({
                name: z.string(),
                description: z.string().optional(),
            }),
        ).min(1),
        requirements: z.array(z.string()).min(1),
        rules: z.array(z.string()).min(1),
        cover: z.string().startsWith("/"),
        coverAlt: z.string(),
        featured: z.boolean().default(false),
        publishedAt: z.coerce.date(),
    }),
});

export const collections = { clanWars };
