import { and, eq, gt, inArray, like, or } from "drizzle-orm";
import { rpgDb } from "@/db/clients";
import {
  luckPermsGroupPermissions,
  luckPermsPlayers,
  luckPermsUserPermissions,
} from "@/db/schema/rpg";
import type { GroupPermissionNode, PlayerPermissionSeed } from "./rank.types";

const validServers = ["global", "kitpvp"];

export async function findPlayerPermissionSeeds(
  uuids: string[],
  nowSeconds = Math.floor(Date.now() / 1_000),
): Promise<PlayerPermissionSeed[]> {
  const uniqueUuids = [...new Set(uuids)].slice(0, 100);
  if (uniqueUuids.length === 0) return [];

  const players = await rpgDb
        .select({ uuid: luckPermsPlayers.uuid, primaryGroup: luckPermsPlayers.primaryGroup })
        .from(luckPermsPlayers)
        .where(inArray(luckPermsPlayers.uuid, uniqueUuids));
  const assignments = await rpgDb
      .select({ uuid: luckPermsUserPermissions.uuid, permission: luckPermsUserPermissions.permission })
      .from(luckPermsUserPermissions)
      .where(
        and(
          inArray(luckPermsUserPermissions.uuid, uniqueUuids),
          eq(luckPermsUserPermissions.value, 1),
          inArray(luckPermsUserPermissions.server, validServers),
          eq(luckPermsUserPermissions.world, "global"),
          eq(luckPermsUserPermissions.contexts, "{}"),
          or(
            eq(luckPermsUserPermissions.expiry, 0),
            gt(luckPermsUserPermissions.expiry, nowSeconds),
          ),
          like(luckPermsUserPermissions.permission, "group.%"),
        ),
      );

  const byPlayer = new Map<string, string[]>();
  for (const row of assignments) {
    const group = row.permission.slice("group.".length).toLowerCase();
    byPlayer.set(row.uuid, [...(byPlayer.get(row.uuid) ?? []), group]);
  }

  return players.map((player) => ({
    uuid: player.uuid,
    primaryGroup: player.primaryGroup.toLowerCase(),
    assignedGroups: byPlayer.get(player.uuid) ?? [],
  }));
}

export async function findActiveGroupNodes(
  nowSeconds = Math.floor(Date.now() / 1_000),
): Promise<GroupPermissionNode[]> {
  return rpgDb
    .select({
      group: luckPermsGroupPermissions.name,
      permission: luckPermsGroupPermissions.permission,
    })
    .from(luckPermsGroupPermissions)
    .where(
      and(
        eq(luckPermsGroupPermissions.value, 1),
        inArray(luckPermsGroupPermissions.server, validServers),
        eq(luckPermsGroupPermissions.world, "global"),
        eq(luckPermsGroupPermissions.contexts, "{}"),
        or(
          eq(luckPermsGroupPermissions.expiry, 0),
          gt(luckPermsGroupPermissions.expiry, nowSeconds),
        ),
        or(
          like(luckPermsGroupPermissions.permission, "group.%"),
          like(luckPermsGroupPermissions.permission, "weight.%"),
        ),
      ),
    );
}
