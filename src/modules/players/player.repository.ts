import { and, eq, gt, inArray, sql } from "drizzle-orm";
import { rpgDb } from "@/db/clients";
import {
  ajlbKothWins,
  clanPlayers,
  clans,
  deluxeCombatPlayers,
  deluxeCombatStats,
  duelHistory,
  duelPlayers,
  kothPlayers,
  kothStats,
  luckPermsPlayers,
} from "@/db/schema/rpg";
import type {
  CombatStats,
  KothProfile,
  PlayerClanSummary,
  PlayerIdentity,
  RawDuelProfile,
} from "./player.types";
import { normalizeKothProfile } from "./koth-normalizers";
import { COMPETITIVE_DUEL_STATUSES } from "./duel-rules";

export async function findPlayerIdentity(identifier: string): Promise<PlayerIdentity | null> {
  const normalized = identifier.toLowerCase();
    const isUuid = normalized.includes("-");
    const deluxe = await rpgDb
      .select({ uuid: deluxeCombatPlayers.uuid, nickname: deluxeCombatPlayers.name })
      .from(deluxeCombatPlayers)
      .where(isUuid
        ? eq(deluxeCombatPlayers.uuid, normalized)
        : eq(deluxeCombatPlayers.name, normalized))
      .limit(1);
    if (deluxe[0]?.uuid && deluxe[0].nickname) {
      return { uuid: deluxe[0].uuid.toLowerCase(), nickname: deluxe[0].nickname };
    }

    const luckPerms = await rpgDb
      .select({ uuid: luckPermsPlayers.uuid, nickname: luckPermsPlayers.username })
      .from(luckPermsPlayers)
      .where(
        and(
          isUuid
            ? eq(luckPermsPlayers.uuid, normalized)
            : eq(luckPermsPlayers.username, normalized),
          sql`LOWER(${luckPermsPlayers.username}) <> 'null'`,
        ),
      )
      .limit(1);
  return luckPerms[0] ?? null;
}

export async function findCombatStats(uuid: string): Promise<CombatStats | null> {
  const rows = await rpgDb
      .select({
        kills: deluxeCombatStats.kills,
        deaths: deluxeCombatStats.deaths,
        combatLogs: deluxeCombatStats.combatLogs,
        streak: deluxeCombatStats.streak,
        maxStreak: deluxeCombatStats.maxStreak,
      })
      .from(deluxeCombatPlayers)
      .innerJoin(deluxeCombatStats, eq(deluxeCombatStats.id, deluxeCombatPlayers.id))
      .where(eq(deluxeCombatPlayers.uuid, uuid))
      .limit(1);
    const row = rows[0];
  return row
      ? {
          kills: row.kills ?? 0,
          deaths: row.deaths ?? 0,
          combatLogs: row.combatLogs ?? 0,
          streak: row.streak ?? 0,
          maxStreak: row.maxStreak ?? 0,
        }
    : null;
}

export async function findKothProfile(uuid: string): Promise<KothProfile> {
  const totalRows = await rpgDb
      .select({ wins: ajlbKothWins.value })
      .from(ajlbKothWins)
      .where(and(eq(ajlbKothWins.id, uuid), gt(ajlbKothWins.value, 0)))
      .limit(1);
    const mapRows = await rpgDb
      .select({ name: kothStats.kothName, wins: kothStats.wins })
      .from(kothStats)
      .where(eq(kothStats.playerUuid, uuid));
    const activityRows = await rpgDb
      .select({ lastSeen: kothPlayers.lastSeen })
      .from(kothPlayers)
      .where(eq(kothPlayers.uuid, uuid))
      .limit(1);
  return normalizeKothProfile(
      totalRows[0]?.wins,
      mapRows,
      activityRows[0]?.lastSeen ?? null,
  );
}

export async function findDuelProfile(uuid: string): Promise<RawDuelProfile> {
  const modes = await rpgDb
        .select({
          mode: duelHistory.modeId,
          matches: sql<number>`COUNT(*)`,
          wins: sql<number>`SUM(CASE WHEN ${duelHistory.status} = 1 THEN 1 ELSE 0 END)`,
          losses: sql<number>`SUM(CASE WHEN ${duelHistory.status} = -1 THEN 1 ELSE 0 END)`,
          kills: sql<number>`COALESCE(SUM(${duelHistory.kills}), 0)`,
          deaths: sql<number>`COALESCE(SUM(${duelHistory.deaths}), 0)`,
          lastPlayedEpochMs: sql<number | string | null>`MAX(${duelHistory.createdAt})`,
        })
        .from(duelHistory)
        .where(
          and(
            eq(duelHistory.uniqueId, uuid),
            inArray(duelHistory.status, [...COMPETITIVE_DUEL_STATUSES]),
          ),
        )
        .groupBy(duelHistory.modeId);
    const player = await rpgDb
      .select({ otherStats: duelPlayers.otherStats, lastTimePlayed: duelPlayers.lastTimePlayed })
      .from(duelPlayers)
      .where(eq(duelPlayers.uniqueId, uuid))
      .limit(1);
  return {
      modes: modes.filter((row) => row.mode !== null).map((row) => ({
        mode: row.mode as string,
        matches: Number(row.matches),
        wins: Number(row.wins),
        losses: Number(row.losses),
        kills: Number(row.kills),
        deaths: Number(row.deaths),
        lastPlayedEpochMs: row.lastPlayedEpochMs,
      })),
      otherStats: player[0]?.otherStats ?? null,
      lastTimePlayed: player[0]?.lastTimePlayed ?? null,
  };
}

export async function findPlayerClan(uuid: string): Promise<PlayerClanSummary | null> {
  const rows = await rpgDb
      .select({
        id: clans.id,
        name: clans.name,
        role: clanPlayers.role,
        kills: clanPlayers.kills,
        deaths: clanPlayers.deaths,
        clanKills: clans.kills,
      })
      .from(clanPlayers)
      .innerJoin(clans, eq(clans.id, clanPlayers.clanId))
      .where(eq(clanPlayers.uuid, uuid))
      .limit(1);
  const row = rows[0];
  if (!row || !row.name) return null;
  return {
      id: row.id,
      name: row.name,
      role: row.role === 2 ? "leader" : row.role === 1 ? "elevated" : "member",
      kills: row.kills,
      deaths: row.deaths,
      contributionPercent: row.clanKills > 0 ? (row.kills / row.clanKills) * 100 : 0,
  };
}
