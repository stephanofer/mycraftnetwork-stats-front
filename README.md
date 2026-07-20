# Mycraft Network Stats

Competitive statistics hub for Mycraft Network. RPG Season III is the active
game mode; Survival 26.2 (`smp`) is published as an upcoming, independent mode.

## Architecture

- Astro server output deployed with the Vercel adapter.
- Full SSR for rankings, player profiles, and clan pages.
- Vercel ISR with a 15-minute expiration.
- Direct, server-only MariaDB access through Drizzle and `mysql2`.
- Separate connection pools for RPG and SkinRestorer data.
- Repository, service, and presentation boundaries under `src/modules`.

The application does not expose a public API. Database schemas mirror only the
plugin tables used by the product, and the application contains no migration or
write commands. Production credentials must belong to MariaDB users restricted
to `SELECT` permissions.

## Environment

Create the local environment from `.env.example` and provide:

- `RPG_DATABASE_URL`
- `SKINS_DATABASE_URL`

Database URLs are server-only secrets. Never prefix them with `PUBLIC_` or pass
them to client scripts.

## Commands

```sh
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm build
```

## Routes

- `/ranking/rpg/kills`
- `/ranking/rpg/maxstreak`
- `/ranking/rpg/koth`
- `/player/[identifier]`
- `/rpg/clans`
- `/rpg/clans/[id]/[slug]`
- `/rpg/clan-wars`
- `/rpg/clan-wars/[slug]`

Retired RPG metrics and legacy Survival routes redirect permanently to valid
RPG rankings.
