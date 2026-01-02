export type Modes = "rpg" | "survival";
export type TypesLeaderBoardRPG =
  | "kills"
  | "kd"
  | "maxstreak"
  | "elo"
  | "level"
  | "koth";
export type TypesLeaderBoardSurvival =
  | "kills"
  | "kd"
  | "maxstreak"
  | "elo"
  | "koth";
export type TypesLeaderBoardGlobal =
  | TypesLeaderBoardRPG
  | TypesLeaderBoardSurvival;

interface UserProfile {
  lastNickname: string;
  skinUUID: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  userProfile: UserProfile;
  value: number;
  dailyDelta: number;
  dailyLastTotal: number;
  dailyTimestamp: number;
}

export interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardEntry[];
  count: number;
  timestamp: string;
}

export interface LeaderBoardParams {
  mode: Modes;
  type: TypesLeaderBoardGlobal;
  limit?: number;
  offset?: number;
}

export const typeLabels = {
  kills: "Kills",
  kd: "K/D",
  maxstreak: "Mayor Racha",
  elo: "ELO",
  level: "Nivel",
  koth: "KOTHs",
};

export interface PlayerRank {
  rank: string;
}

export interface PlayerSkin {
  hasSkin: boolean;
  skinIdentifier: string | null;
  skinVariant: "slim" | "classic" | null;
  skinType: "url" | "custom" | null;
}

export interface PlayerCombat {
  kills: number;
  deaths: number;
  kd: number;
  combatLogs: number;
  streak: number;
  maxStreak: number;
  points: number;
}

export interface KothMapStats {
  kothName: string;
  wins: number;
}

export interface PlayerKoth {
  totalWins: number;
  maps: KothMapStats[];
}

export interface DuelRanking {
  mode: string;
  score: number;
}

export interface PlayerDuels {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  kills: number;
  deaths: number;
  kd: number;
  lastPlayed: string | null;
  rankings: DuelRanking[];
}

export interface PlayerProfileData {
  uuid: string;
  username: string;
  lastSeen: string | null;
  rank: PlayerRank;
  skin: PlayerSkin;
  combat: PlayerCombat;
  koth: PlayerKoth;
  duels: PlayerDuels;
}

export interface PlayerProfileResponse {
  success: boolean;
  data: PlayerProfileData;
  timestamp: string;
}

export interface PlayerProfileError {
  statusCode: number;
  error: string;
  message: string;
  details?: string;
}

export type SkinRenderType = "full" | "bust" | "head";
export type SkinRenderer = "crafty" | "custom";

export interface SkinRendererConfig {
  renderer: SkinRenderer;
  baseUrl: string;
}

export const skinRendererConfig: SkinRendererConfig = {
  renderer: "crafty",
  baseUrl: "https://render.crafty.gg",
};


export function getSkinUrl(uuid: string, type: SkinRenderType = "full"): string {
  const { renderer, baseUrl } = skinRendererConfig;
  
  if (renderer === "crafty") {
    switch (type) {
      case "full":
        return `${baseUrl}/3d/full/${uuid}`;
      case "bust":
        return `${baseUrl}/3d/bust/${uuid}`;
      case "head":
        return `${baseUrl}/2d/head/${uuid}`;
      default:
        return `${baseUrl}/3d/full/${uuid}`;
    }
  }
  
  // Placeholder for future custom renderer
  return `${baseUrl}/${type}/${uuid}`;
}

export function getHeadUrl(uuid: string): string {
  return getSkinUrl(uuid, "head");
}

export function getFullSkinUrl(uuid: string): string {
  return getSkinUrl(uuid, "full");
}

export interface RankConfig {
  name: string;
  displayName: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
}

export const rankConfigs: Record<string, RankConfig> = {
  default: {
    name: "default",
    displayName: "Jugador",
    color: "#AAAAAA",
    backgroundColor: "rgba(170, 170, 170, 0.1)",
    borderColor: "rgba(170, 170, 170, 0.3)",
  },
  vip: {
    name: "vip",
    displayName: "VIP",
    color: "#55FF55",
    backgroundColor: "rgba(85, 255, 85, 0.1)",
    borderColor: "rgba(85, 255, 85, 0.3)",
  },
  mvp: {
    name: "mvp",
    displayName: "MVP",
    color: "#55FFFF",
    backgroundColor: "rgba(85, 255, 255, 0.1)",
    borderColor: "rgba(85, 255, 255, 0.3)",
  },
  elite: {
    name: "elite",
    displayName: "Elite",
    color: "#FFAA00",
    backgroundColor: "rgba(255, 170, 0, 0.1)",
    borderColor: "rgba(255, 170, 0, 0.3)",
  },
  legend: {
    name: "legend",
    displayName: "Legend",
    color: "#FF55FF",
    backgroundColor: "rgba(255, 85, 255, 0.1)",
    borderColor: "rgba(255, 85, 255, 0.3)",
  },
  admin: {
    name: "admin",
    displayName: "Admin",
    color: "#FF5555",
    backgroundColor: "rgba(255, 85, 85, 0.1)",
    borderColor: "rgba(255, 85, 85, 0.3)",
  },
  owner: {
    name: "owner",
    displayName: "Owner",
    color: "#AA0000",
    backgroundColor: "rgba(170, 0, 0, 0.15)",
    borderColor: "rgba(170, 0, 0, 0.4)",
  },
};

export function getRankConfig(rankName: string): RankConfig {
  return rankConfigs[rankName.toLowerCase()] || rankConfigs.default;
}

export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "Desconocido";
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffSecs < 60) return "Hace un momento";
  if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`;
  if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
  if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`;
  if (diffWeeks < 4) return `Hace ${diffWeeks} ${diffWeeks === 1 ? "semana" : "semanas"}`;
  if (diffMonths < 12) return `Hace ${diffMonths} ${diffMonths === 1 ? "mes" : "meses"}`;
  
  return date.toLocaleDateString("es-ES", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });
}

//  * Formats a number with thousand separators
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-ES").format(num);
}

/**
 * Formats K/D ratio with 2 decimal places
 */
export function formatKD(kd: number): string {
  return kd.toFixed(2);
}

/**
 * Validates if a string is a valid Minecraft username
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
  return usernameRegex.test(username);
}

/**
 * Validates if a string is a valid UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Checks if an identifier is valid (username or UUID)
 */
export function isValidPlayerIdentifier(identifier: string): boolean {
  return isValidUsername(identifier) || isValidUUID(identifier);
}
