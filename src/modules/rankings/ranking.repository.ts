import { sql, type SQL } from "drizzle-orm";
import { rpgDb } from "@/db/clients";
import { observeQuery } from "@/modules/shared/observability";
import type { RankingMetric, RankingPosition, RankingRow } from "./ranking.types";

const combatValueColumns: Record<Exclude<RankingMetric, "koth">, SQL> = {
  kills: sql.raw("s.KILLS"),
  maxstreak: sql.raw("s.MAX_STREAK"),
};

const MAX_LIMIT = 40;
const MAX_OFFSET = 1_000;

export async function findRanking(
  metric: RankingMetric,
  requestedLimit = MAX_LIMIT,
  requestedOffset = 0,
): Promise<RankingRow[]> {
  const limit = Math.min(Math.max(Math.trunc(requestedLimit), 1), MAX_LIMIT);
  const offset = Math.min(Math.max(Math.trunc(requestedOffset), 0), MAX_OFFSET);
  const statement = rankingStatement(metric, limit, offset);

  return observeQuery(`rankings.${metric}`, "rpg", async () => {
    const result = await rpgDb.execute(statement);
    return (result[0] as unknown as RankingRow[]).map(normalizeRankingRow);
  });
}

export async function findPlayerRankingPositions(uuid: string): Promise<RankingPosition[]> {
  return observeQuery("players.ranking-positions", "rpg", async () => {
    const result = await rpgDb.execute(sql`
      WITH kills_base AS (${rankingUniverse("kills")}),
           maxstreak_base AS (${rankingUniverse("maxstreak")}),
           koth_base AS (${rankingUniverse("koth")}),
           metrics AS (
             SELECT 'kills' AS metric, uuid, value FROM kills_base
             UNION ALL SELECT 'maxstreak', uuid, value FROM maxstreak_base
             UNION ALL SELECT 'koth', uuid, value FROM koth_base
            ), current_values AS (
              SELECT metric, value
              FROM metrics
              WHERE uuid = ${uuid}
            )
      SELECT current.metric, current.value,
             (SELECT COUNT(DISTINCT higher.value) + 1
                FROM metrics higher
               WHERE higher.metric = current.metric AND higher.value > current.value) AS position,
             (SELECT MIN(higher.value)
                FROM metrics higher
               WHERE higher.metric = current.metric AND higher.value > current.value) - current.value AS distanceToHigher
      FROM current_values current
    `);
    return (result[0] as unknown as RankingPosition[]).map(normalizeRankingPosition);
  });
}

function rankingStatement(metric: RankingMetric, limit: number, offset: number): SQL {
  return sql`
    WITH base AS (${rankingUniverse(metric)}), value_steps AS (
      SELECT value, LAG(value) OVER (ORDER BY value DESC) AS higher_value
      FROM (SELECT DISTINCT value FROM base) distinct_values
    ), ranked AS (
      SELECT current.uuid, current.nickname, current.value,
             current.dailyDelta, current.weeklyDelta,
             DENSE_RANK() OVER (ORDER BY current.value DESC) AS position,
             value_steps.higher_value
      FROM base current
      INNER JOIN value_steps ON value_steps.value = current.value
    )
    SELECT uuid, nickname, value, dailyDelta, weeklyDelta,
           position, higher_value - value AS distanceToHigher
    FROM ranked
    ORDER BY value DESC, nickname ASC
    LIMIT ${limit} OFFSET ${offset}
  `;
}

function rankingUniverse(metric: RankingMetric): SQL {
  if (metric === "koth") {
    return sql`
      SELECT a.id AS uuid,
             COALESCE(dc.NAME, CASE WHEN LOWER(lp.username) <> 'null' THEN lp.username END) AS nickname,
             COALESCE(a.value, 0) AS value,
             COALESCE(a.daily_delta, 0) AS dailyDelta,
             COALESCE(a.weekly_delta, 0) AS weeklyDelta
      FROM ajlb_zkothdata_total_wins a
      LEFT JOIN DELUXECOMBAT_PLAYERLIST dc ON dc.UUID = a.id
      LEFT JOIN luckperms_players lp ON lp.uuid = a.id
      WHERE COALESCE(dc.NAME, CASE WHEN LOWER(lp.username) <> 'null' THEN lp.username END) IS NOT NULL
        AND COALESCE(a.value, 0) > 0
    `;
  }

  return sql`
    SELECT p.UUID AS uuid,
           COALESCE(p.NAME, lp.username) AS nickname,
           COALESCE(${combatValueColumns[metric]}, 0) AS value,
           0 AS dailyDelta,
           0 AS weeklyDelta
    FROM DELUXECOMBAT_PLAYERLIST p
    INNER JOIN DELUXECOMBAT_STATS s ON s.ID = p.ID
    LEFT JOIN luckperms_players lp
      ON lp.uuid = p.UUID AND LOWER(lp.username) <> 'null'
    WHERE p.UUID IS NOT NULL
      AND COALESCE(p.NAME, lp.username) IS NOT NULL
  `;
}

function normalizeRankingRow(row: RankingRow): RankingRow {
  return {
    ...row,
    value: Number(row.value),
    dailyDelta: Number(row.dailyDelta),
    weeklyDelta: Number(row.weeklyDelta),
    position: Number(row.position),
    distanceToHigher: row.distanceToHigher === null ? null : Number(row.distanceToHigher),
  };
}

function normalizeRankingPosition(row: RankingPosition): RankingPosition {
  return {
    ...row,
    value: Number(row.value),
    position: Number(row.position),
    distanceToHigher: row.distanceToHigher === null ? null : Number(row.distanceToHigher),
  };
}
