import type { RankSummary } from "@/modules/ranks/rank.types";
import type { ResolvedSkin } from "@/modules/skins/skin.types";

export type RankingMetric = "kills" | "maxstreak" | "koth";

export interface RankingRow {
  uuid: string;
  nickname: string;
  value: number;
  dailyDelta: number;
  weeklyDelta: number;
  position: number;
  distanceToHigher: number | null;
}

export type RankingPosition = Pick<
  RankingRow,
  "value" | "position" | "distanceToHigher"
> & { metric: RankingMetric };

export interface RankingEntry extends RankingRow {
  rank: RankSummary | null;
  skin: ResolvedSkin;
}

export interface RankingPage {
  metric: RankingMetric;
  entries: RankingEntry[];
  limit: number;
  offset: number;
  partialFailures: Array<"ranks" | "skins">;
}
