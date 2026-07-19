export const GAME_MODES = {
  rpg: {
    id: "rpg",
    label: "RPG",
    season: "Season III",
    status: "active",
    capabilities: ["rankings", "players", "clans"] as const,
  },
  smp: {
    id: "smp",
    label: "Survival 26.2",
    season: null,
    status: "coming-soon",
    capabilities: [] as const,
  },
} as const;

export type GameModeId = keyof typeof GAME_MODES;
