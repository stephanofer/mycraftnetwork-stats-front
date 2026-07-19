import type { WebRank } from "./rank-catalog";

export interface RankSummary {
  dominant: WebRank;
  weight: number;
}

export type RankIdentity = RankSummary;

export interface PlayerRankIdentity extends RankSummary {
  secondaryRanks: WebRank[];
}

export interface PlayerPermissionSeed {
  uuid: string;
  primaryGroup: string;
  assignedGroups: string[];
}

export interface GroupPermissionNode {
  group: string;
  permission: string;
}
