import type { RankSummary } from "@/modules/ranks/rank.types";
import type { ResolvedSkin } from "@/modules/skins/skin.types";

export interface ClanRankingEntry {
  id: number;
  name: string;
  prefix: string | null;
  kills: number;
  deaths: number;
  level: number;
  members: number;
  slots: number;
  position: number;
  distanceToHigher: number | null;
}

export interface ClanMember {
  uuid: string;
  nickname: string;
  role: "leader" | "elevated" | "member";
  kills: number;
  deaths: number;
  contributionPercent: number;
  rank: RankSummary | null;
  skin: ResolvedSkin;
}

export interface ClanProfile extends ClanRankingEntry {
  leader: string;
  privacy: string;
  memberList: ClanMember[];
  allies: Array<{ id: number; name: string }>;
  topContributor: ClanMember | null;
  higherClan: { id: number; name: string; kills: number } | null;
  partialFailures: Array<"ranks" | "skins">;
}

export interface RawClanMember {
  uuid: string;
  nickname: string;
  role: number;
  kills: number;
  deaths: number;
}

export interface RawClanProfile {
  clan: Omit<ClanRankingEntry, "position" | "distanceToHigher"> & {
    leader: string;
    privacy: string;
  };
  members: RawClanMember[];
  allies: Array<{ id: number; name: string }>;
}
