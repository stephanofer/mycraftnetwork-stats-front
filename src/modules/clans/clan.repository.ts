import { eq, or, sql } from "drizzle-orm";
import { rpgDb } from "@/db/clients";
import {
  clanAllies,
  clanPlayers,
  clans,
  deluxeCombatPlayers,
  luckPermsPlayers,
} from "@/db/schema/rpg";
import type { ClanRankingEntry, RawClanProfile } from "./clan.types";

const MAX_CLAN_RANKING_ENTRIES = 40;

export async function findClanRanking(requestedLimit = MAX_CLAN_RANKING_ENTRIES): Promise<ClanRankingEntry[]> {
  const limit = Math.min(Math.max(Math.trunc(requestedLimit), 1), MAX_CLAN_RANKING_ENTRIES);
  const result = await rpgDb.execute(sql`
      WITH ranked AS (
        SELECT id, name, prefix, kills, deaths, level,
               total_members AS members, slots,
               DENSE_RANK() OVER (ORDER BY kills DESC) AS position
        FROM clans
        WHERE name IS NOT NULL
      )
      SELECT r.*,
             (SELECT MIN(c.kills) FROM clans c WHERE c.kills > r.kills) - r.kills AS distanceToHigher
      FROM ranked r
      ORDER BY r.kills DESC, r.name ASC
      LIMIT ${limit}
    `);
  return (result[0] as unknown as ClanRankingEntry[]).map(normalizeRanking);
}

export async function findClanProfile(id: number): Promise<RawClanProfile | null> {
  const clanRows = await rpgDb
      .select({
        id: clans.id,
        name: clans.name,
        prefix: clans.prefix,
        leader: clans.leader,
        privacy: clans.privacy,
        kills: clans.kills,
        deaths: clans.deaths,
        level: clans.level,
        members: clans.totalMembers,
        slots: clans.slots,
      })
      .from(clans)
      .where(eq(clans.id, id))
      .limit(1);
    const clan = clanRows[0];
    if (!clan?.name || !clan.leader) return null;

    const members = await rpgDb
        .select({
          uuid: clanPlayers.uuid,
          deluxeName: deluxeCombatPlayers.name,
          luckPermsName: luckPermsPlayers.username,
          role: clanPlayers.role,
          kills: clanPlayers.kills,
          deaths: clanPlayers.deaths,
        })
        .from(clanPlayers)
        .leftJoin(deluxeCombatPlayers, eq(deluxeCombatPlayers.uuid, clanPlayers.uuid))
        .leftJoin(
          luckPermsPlayers,
          sql`${luckPermsPlayers.uuid} = ${clanPlayers.uuid} AND LOWER(${luckPermsPlayers.username}) <> 'null'`,
        )
        .where(eq(clanPlayers.clanId, id));
    const allyRows = await rpgDb
      .select({
        clanId: clanAllies.clanId,
        allyId: clanAllies.allyId,
      })
      .from(clanAllies)
      .where(or(eq(clanAllies.clanId, id), eq(clanAllies.allyId, id)));
    const allyIds = [...new Set(allyRows.map((row) => row.clanId === id ? row.allyId : row.clanId))];
    const allies = allyIds.length === 0
      ? []
      : await rpgDb
          .select({ id: clans.id, name: clans.name })
          .from(clans)
          .where(sql`${clans.id} IN (${sql.join(allyIds.map((allyId) => sql`${allyId}`), sql`, `)})`);

  return {
      clan: {
        id: clan.id,
        name: clan.name,
        prefix: clan.prefix,
        leader: clan.leader,
        privacy: clan.privacy ?? "CLOSED",
        kills: clan.kills,
        deaths: clan.deaths,
        level: clan.level,
        members: clan.members,
        slots: clan.slots,
      },
      members: members
        .filter((member): member is typeof member & { uuid: string } =>
          member.uuid !== null && (member.deluxeName !== null || member.luckPermsName !== null),
        )
        .map((member) => ({
          uuid: member.uuid,
          nickname: member.deluxeName ?? (member.luckPermsName as string),
          role: member.role,
          kills: member.kills,
          deaths: member.deaths,
        })),
      allies: allies
        .filter((ally): ally is typeof ally & { name: string } => ally.name !== null),
  };
}

export async function findClanPosition(id: number): Promise<{
  position: number;
  distanceToHigher: number | null;
  tiedAtPosition: boolean;
  higherClan: { id: number; name: string; kills: number } | null;
}> {
  const result = await rpgDb.execute(sql`
      WITH current_clan AS (
        SELECT kills FROM clans WHERE id = ${id} LIMIT 1
      ), higher_value AS (
        SELECT MIN(clans.kills) AS kills
        FROM clans, current_clan
        WHERE clans.kills > current_clan.kills
      )
      SELECT
        (SELECT COUNT(DISTINCT clans.kills) + 1
           FROM clans, current_clan
          WHERE clans.kills > current_clan.kills) AS position,
        (SELECT COUNT(*)
           FROM clans, current_clan
          WHERE clans.kills = current_clan.kills) AS tieCount,
        higher.id AS higherId,
        higher.name AS higherName,
        higher.kills AS higherKills,
        higher.kills - current_clan.kills AS distanceToHigher
      FROM current_clan
      LEFT JOIN higher_value ON TRUE
      LEFT JOIN clans higher ON higher.id = (
        SELECT MIN(candidate.id) FROM clans candidate
        WHERE candidate.kills = higher_value.kills
      )
    `);
    const row = (result[0] as unknown as Array<{
      position: number | string;
      tieCount: number | string;
      higherId: number | string | null;
      higherName: string | null;
      higherKills: number | string | null;
      distanceToHigher: number | string | null;
    }>)[0];
    const higherClan = row?.higherId !== null && row?.higherName && row.higherKills !== null
      ? { id: Number(row.higherId), name: row.higherName, kills: Number(row.higherKills) }
      : null;
  return {
      position: Number(row?.position ?? 1),
      distanceToHigher: row?.distanceToHigher === null ? null : Number(row?.distanceToHigher),
      tiedAtPosition: Number(row?.tieCount ?? 0) > 1,
      higherClan,
  };
}

function normalizeRanking(row: ClanRankingEntry): ClanRankingEntry {
  return {
    ...row,
    id: Number(row.id),
    kills: Number(row.kills),
    deaths: Number(row.deaths),
    level: Number(row.level),
    members: Number(row.members),
    slots: Number(row.slots),
    position: Number(row.position),
    distanceToHigher: row.distanceToHigher === null ? null : Number(row.distanceToHigher),
  };
}
