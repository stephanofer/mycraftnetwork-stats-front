import type { DataResult } from "@/modules/shared/data-result";
import { getRanksForPlayers } from "@/modules/ranks/rank.service";
import { getSkinsForPlayers } from "@/modules/skins/skin.service";
import { findPlayerRankingPositions } from "@/modules/rankings/ranking.repository";
import {
  findCombatStats,
  findDuelProfile,
  findKothProfile,
  findPlayerClan,
  findPlayerIdentity,
} from "./player.repository";
import type {
  DuelProfile,
  PlayerDataSection,
  PlayerPartialFailure,
  PlayerProfile,
  RawDuelProfile,
} from "./player.types";
import { dateFromEpoch, normalizeEpochMs } from "./player-normalizers";
import { sectionValue } from "./profile-availability";
import {
  isPlayerUsername,
  isPlayerUuid,
  normalizePlayerIdentifier,
} from "./player-identifier";

export { normalizePlayerIdentifier } from "./player-identifier";

export async function getPlayerProfile(identifier: string): Promise<DataResult<PlayerProfile>> {
  const normalized = normalizePlayerIdentifier(identifier);
  if (!normalized) return { status: "not-found" };

  try {
    const identity = await findPlayerIdentity(normalized);
    if (!identity || !isPlayerUuid(identity.uuid) || !isPlayerUsername(identity.nickname)) {
      return { status: "not-found" };
    }

    const [combatResult, rankingsResult] = await Promise.allSettled([
      findCombatStats(identity.uuid),
      findPlayerRankingPositions(identity.uuid),
    ]);
    const [kothResult, duelsResult] = await Promise.allSettled([
      findKothProfile(identity.uuid),
      findDuelProfile(identity.uuid),
    ]);
    const [clanResult] = await Promise.allSettled([
      findPlayerClan(identity.uuid),
    ]);
    const [ranksResult, skinsResult] = await Promise.allSettled([
      getRanksForPlayers([identity.uuid]),
      getSkinsForPlayers([identity.uuid]),
    ]);
    const unavailableSections: PlayerDataSection[] = [];
    const failures: PlayerPartialFailure[] = [];
    const combat = sectionValue(combatResult, "combat", unavailableSections, failures);
    const rankings = sectionValue(rankingsResult, "rankings", unavailableSections, failures);
    const koth = sectionValue(kothResult, "koth", unavailableSections, failures);
    const rawDuels = sectionValue(duelsResult, "duels", unavailableSections, failures);
    const clan = sectionValue(clanResult, "clan", unavailableSections, failures);
    const ranks = degradedValue(ranksResult, "ranks", failures);
    const skins = degradedValue(skinsResult, "skins", failures);

    return {
      status: "ok",
      data: {
        identity,
        combat,
        rankings,
        koth,
        duels: rawDuels ? assembleDuels(rawDuels) : null,
        clan,
        rank: ranks?.status === "ok" ? ranks.data.get(identity.uuid) ?? null : null,
        skin: skins?.status === "ok"
          ? skins.data.get(identity.uuid) ?? fallbackSkin()
          : fallbackSkin(),
        recognitions: rankings?.filter((ranking) => ranking.position <= 10)
          .map((ranking) => `top-10-${ranking.metric}`) ?? null,
        unavailableSections,
        partialFailures: failures,
      },
    };
  } catch {
    return { status: "unavailable", reason: "player-source-unavailable" };
  }
}

function degradedValue<T>(
  result: PromiseSettledResult<DataResult<T>>,
  section: "ranks" | "skins",
  failures: PlayerPartialFailure[],
): DataResult<T> | null {
  if (result.status === "rejected") {
    failures.push(section);
    return null;
  }
  if (result.value.status === "unavailable") failures.push(section);
  return result.value;
}

export function assembleDuels(raw: RawDuelProfile): DuelProfile {
  const matches = raw.modes.reduce((total, mode) => total + mode.matches, 0);
  const wins = raw.modes.reduce((total, mode) => total + mode.wins, 0);
  const losses = raw.modes.reduce((total, mode) => total + mode.losses, 0);
  const modes = raw.modes.map(({ lastPlayedEpochMs, ...mode }) => ({
    ...mode,
    lastPlayedAt: dateFromEpoch(lastPlayedEpochMs),
  }));
  const timestamps = [
    ...modes.map((mode) => mode.lastPlayedAt?.getTime() ?? 0),
    ...Object.values(parseNumberMap(raw.lastTimePlayed)).map(normalizeEpochMs),
  ];
  const latest = Math.max(0, ...timestamps);
  return {
    matches,
    wins,
    losses,
    kills: raw.modes.reduce((total, mode) => total + mode.kills, 0),
    deaths: raw.modes.reduce((total, mode) => total + mode.deaths, 0),
    winRate: matches > 0 ? (wins / matches) * 100 : 0,
    modes,
    streaks: parseNumberMap(raw.otherStats),
    lastPlayedAt: latest > 0 ? new Date(latest) : null,
  };
}

function parseNumberMap(value: string | null): Record<string, number> {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, number] =>
        typeof entry[1] === "number" && Number.isFinite(entry[1]),
      ),
    );
  } catch {
    return {};
  }
}

function fallbackSkin() {
  return { renderId: null, variant: "classic" as const, fallback: true };
}
