import { eq, or, sql } from "drizzle-orm";
import { rpgDb } from "@/db/clients";
import {
  clanAllies,
  clanPlayers,
  clans,
  deluxeCombatPlayers,
  luckPermsPlayers,
} from "@/db/schema/rpg";
import { observeQuery } from "@/modules/shared/observability";
import type { ClanRankingEntry, RawClanProfile } from "./clan.types";

export async function findClanRanking(requestedLimit = 30): Promise<ClanRankingEntry[]> {
  const limit = Math.min(Math.max(Math.trunc(requestedLimit), 1), 100);
  return observeQuery("clans.ranking", "rpg", async () => {
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
  });
}

export async function findClanProfile(id: number): Promise<RawClanProfile | null> {
  return observeQuery("clans.profile", "rpg", async () => {
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

    const [members, allyRows] = await Promise.all([
      rpgDb
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
        .where(eq(clanPlayers.clanId, id)),
      rpgDb
        .select({
          clanId: clanAllies.clanId,
          allyId: clanAllies.allyId,
        })
        .from(clanAllies)
        .where(or(eq(clanAllies.clanId, id), eq(clanAllies.allyId, id))),
    ]);
    const allyIds = allyRows.map((row) => row.clanId === id ? row.allyId : row.clanId);
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
  });
}

export async function findClanPosition(kills: number): Promise<{
  position: number;
  distanceToHigher: number | null;
  higherClan: { id: number; name: string; kills: number } | null;
}> {
  return observeQuery("clans.position", "rpg", async () => {
    const [positionResult, higherRows] = await Promise.all([
      rpgDb.execute(sql`SELECT COUNT(DISTINCT kills) + 1 AS position FROM clans WHERE kills > ${kills}`),
      rpgDb
        .select({ id: clans.id, name: clans.name, kills: clans.kills })
        .from(clans)
        .where(sql`${clans.kills} = (SELECT MIN(kills) FROM clans WHERE kills > ${kills})`)
        .orderBy(clans.id)
        .limit(1),
    ]);
    const positionRow = (positionResult[0] as unknown as Array<{ position: number }>)[0];
    const higher = higherRows[0];
    return {
      position: Number(positionRow.position),
      distanceToHigher: higher ? higher.kills - kills : null,
      higherClan: higher?.name ? higher as { id: number; name: string; kills: number } : null,
    };
  });
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
