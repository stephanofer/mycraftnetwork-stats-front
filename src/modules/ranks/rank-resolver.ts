import { isPublicRank, rankFromCatalog, WEB_RANKS } from "./rank-catalog";
import type { GroupPermissionNode, PlayerRankIdentity } from "./rank.types";

export function resolveRank(
  primaryGroup: string,
  assignedGroups: string[],
  nodes: GroupPermissionNode[],
): PlayerRankIdentity {
  const inheritance = new Map<string, string[]>();
  const weights = new Map<string, number>();

  for (const node of nodes) {
    const group = node.group.toLowerCase();
    if (node.permission.startsWith("group.")) {
      inheritance.set(group, [
        ...(inheritance.get(group) ?? []),
        node.permission.slice("group.".length).toLowerCase(),
      ]);
    } else if (/^weight\.\d+$/.test(node.permission)) {
      weights.set(group, Math.max(weights.get(group) ?? 0, Number(node.permission.slice(7))));
    }
  }

  const inherited = new Set<string>();
  const visiting = new Set<string>();
  const visit = (group: string): void => {
    if (inherited.has(group) || visiting.has(group)) return;
    visiting.add(group);
    inherited.add(group);
    for (const parent of inheritance.get(group) ?? []) visit(parent);
    visiting.delete(group);
  };

  const normalizedPrimary = primaryGroup.toLowerCase();
  visit(normalizedPrimary);
  for (const group of assignedGroups) visit(group.toLowerCase());

  const catalogOrder = Object.keys(WEB_RANKS);
  const candidates = [...inherited].filter(isPublicRank).sort((left, right) => {
    const weightDifference = (weights.get(right) ?? 0) - (weights.get(left) ?? 0);
    if (weightDifference !== 0) return weightDifference;
    if (left === normalizedPrimary) return -1;
    if (right === normalizedPrimary) return 1;
    const leftOrder = catalogOrder.indexOf(left);
    const rightOrder = catalogOrder.indexOf(right);
    return (leftOrder < 0 ? Number.MAX_SAFE_INTEGER : leftOrder) -
      (rightOrder < 0 ? Number.MAX_SAFE_INTEGER : rightOrder) || left.localeCompare(right);
  });
  const dominantGroup = candidates[0] ?? "default";
  const dominant = rankFromCatalog(dominantGroup);
  const secondaryRanks = candidates
    .map(rankFromCatalog)
    .filter((candidate, index, all) =>
      candidate.id !== dominant.id &&
      candidate.id !== "default" &&
      all.findIndex((rank) => rank.id === candidate.id) === index,
    );

  return {
    dominant,
    secondaryRanks,
    weight: weights.get(dominantGroup) ?? 0,
  };
}
