import type { DataResult } from "@/modules/shared/data-result";
import { findActiveGroupNodes, findPlayerPermissionSeeds } from "./rank.repository";
import { resolveRank } from "./rank-resolver";
import type { PlayerRankIdentity } from "./rank.types";

export { resolveRank } from "./rank-resolver";

export async function getRanksForPlayers(
  uuids: string[],
): Promise<DataResult<Map<string, PlayerRankIdentity>>> {
  try {
    const [players, nodes] = await Promise.all([
      findPlayerPermissionSeeds(uuids),
      findActiveGroupNodes(),
    ]);
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
