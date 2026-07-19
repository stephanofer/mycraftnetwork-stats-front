import type { PlayerRankIdentity } from "@/modules/ranks/rank.types";
import type { ResolvedSkin } from "@/modules/skins/skin.types";
import type { RankingPosition } from "@/modules/rankings/ranking.types";

export interface PlayerIdentity {
  uuid: string;
  nickname: string;
}

export interface CombatStats {
  kills: number;
  deaths: number;
  combatLogs: number;
  streak: number;
  maxStreak: number;
}

export type PlayerRankingPosition = RankingPosition;

export interface KothProfile {
  totalWins: number;
  maps: Array<{ name: string; wins: number }>;
  recordedActivityAt: Date | null;
}

export interface DuelModeStats {
  mode: string;
  matches: number;
  wins: number;
  losses: number;
  kills: number;
  deaths: number;
  lastPlayedAt: Date | null;
}

export interface RawDuelModeStats extends Omit<DuelModeStats, "lastPlayedAt"> {
  lastPlayedEpochMs: number | string | null;
}

export interface DuelProfile {
  matches: number;
  wins: number;
  losses: number;
  kills: number;
  deaths: number;
  winRate: number;
  modes: DuelModeStats[];
  streaks: Record<string, number>;
  lastPlayedAt: Date | null;
}

export interface PlayerClanSummary {
  id: number;
  name: string;
  role: "leader" | "elevated" | "member";
  kills: number;
  deaths: number;
  contributionPercent: number;
}

export type PlayerDataSection = "combat" | "rankings" | "koth" | "duels" | "clan";
export type PlayerPartialFailure = PlayerDataSection | "ranks" | "skins";

export interface PlayerProfile {
  identity: PlayerIdentity;
  rank: PlayerRankIdentity | null;
  skin: ResolvedSkin;
  combat: CombatStats | null;
  rankings: PlayerRankingPosition[] | null;
  koth: KothProfile | null;
  duels: DuelProfile | null;
  clan: PlayerClanSummary | null;
  recognitions: string[] | null;
  unavailableSections: PlayerDataSection[];
  partialFailures: PlayerPartialFailure[];
}

export interface RawDuelProfile {
  modes: RawDuelModeStats[];
  otherStats: string | null;
  lastTimePlayed: string | null;
}
