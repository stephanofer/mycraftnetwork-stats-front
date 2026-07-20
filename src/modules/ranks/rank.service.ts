import type { DataResult } from "@/modules/shared/data-result";
import { findActiveGroupNodes, findPlayerPermissionSeeds } from "./rank.repository";
import { resolveRank } from "./rank-resolver";
import type { PlayerRankIdentity } from "./rank.types";

const GROUP_NODES_TTL_MS = 60_000;
let groupNodesCache: {
  expiresAt: number;
  value: Awaited<ReturnType<typeof findActiveGroupNodes>>;
} | null = null;
let pendingGroupNodes: ReturnType<typeof findActiveGroupNodes> | null = null;

export { resolveRank } from "./rank-resolver";

export async function getRanksForPlayers(
  uuids: string[],
): Promise<DataResult<Map<string, PlayerRankIdentity>>> {
  try {
    const players = await findPlayerPermissionSeeds(uuids);
    const nodes = await getGroupNodes();
    return {
      status: "ok",
      data: new Map(
        players.map((player) => [
          player.uuid,
          resolveRank(player.primaryGroup, player.assignedGroups, nodes),
        ]),
      ),
    };
  } catch {
    return { status: "unavailable", reason: "rank-source-unavailable" };
  }
}

async function getGroupNodes() {
  if (groupNodesCache && groupNodesCache.expiresAt > Date.now()) {
    return groupNodesCache.value;
  }
  pendingGroupNodes ??= findActiveGroupNodes();
  try {
    const value = await pendingGroupNodes;
    groupNodesCache = { value, expiresAt: Date.now() + GROUP_NODES_TTL_MS };
    return value;
  } finally {
    pendingGroupNodes = null;
  }
}
