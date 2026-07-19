import type { DataResult } from "@/modules/shared/data-result";
import { getRanksForPlayers } from "@/modules/ranks/rank.service";
import type { PlayerRankIdentity, RankSummary } from "@/modules/ranks/rank.types";
import { getSkinsForPlayers } from "@/modules/skins/skin.service";
import { findRanking } from "./ranking.repository";
import type { RankingMetric, RankingPage } from "./ranking.types";

export const RANKING_METRICS = {
  kills: { label: "Kills" },
  maxstreak: { label: "Best streak" },
  koth: { label: "KOTH wins" },
} as const satisfies Record<RankingMetric, { label: string }>;

export function isRankingMetric(value: string): value is RankingMetric {
  return Object.hasOwn(RANKING_METRICS, value);
}

export async function getRanking(
  metric: RankingMetric,
  limit = 30,
  offset = 0,
): Promise<DataResult<RankingPage>> {
  try {
    const rows = await findRanking(metric, limit, offset);
    const uuids = rows.map((row) => row.uuid);
    const [ranks, skins] = await Promise.all([
      getRanksForPlayers(uuids),
      getSkinsForPlayers(uuids),
    ]);
    const partialFailures: RankingPage["partialFailures"] = [];
    if (ranks.status === "unavailable") partialFailures.push("ranks");
    if (skins.status === "unavailable") partialFailures.push("skins");

    return {
      status: "ok",
      data: {
        metric,
        limit: Math.min(Math.max(Math.trunc(limit), 1), 100),
        offset: Math.max(Math.trunc(offset), 0),
        partialFailures,
        entries: rows.map((row) => ({
          ...row,
          rank: ranks.status === "ok" ? toRankSummary(ranks.data.get(row.uuid)) : null,
          skin: skins.status === "ok"
            ? skins.data.get(row.uuid) ?? fallbackSkin()
            : fallbackSkin(),
        })),
      },
    };
  } catch {
    return { status: "unavailable", reason: "ranking-source-unavailable" };
  }
}

function fallbackSkin() {
  return { renderId: null, variant: "classic" as const, fallback: true };
}

function toRankSummary(rank: PlayerRankIdentity | undefined): RankSummary | null {
  if (!rank) return null;
  return { dominant: rank.dominant, weight: rank.weight };
}
