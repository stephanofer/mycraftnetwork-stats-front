import type { DataResult } from "@/modules/shared/data-result";
import { getRanksForPlayers } from "@/modules/ranks/rank.service";
import type { PlayerRankIdentity, RankSummary } from "@/modules/ranks/rank.types";
import { getSkinsForPlayers } from "@/modules/skins/skin.service";
import { findClanPosition, findClanProfile, findClanRanking } from "./clan.repository";
import type { ClanProfile, ClanRankingEntry } from "./clan.types";
import { selectTopContributor } from "./clan-contributors";

export async function getClanRanking(limit = 40): Promise<DataResult<ClanRankingEntry[]>> {
  try {
    return { status: "ok", data: await findClanRanking(limit) };
  } catch {
    return { status: "unavailable", reason: "clan-source-unavailable" };
  }
}

export async function getClanProfile(id: number): Promise<DataResult<ClanProfile>> {
  if (!Number.isSafeInteger(id) || id <= 0) return { status: "not-found" };
  try {
    const raw = await findClanProfile(id);
    if (!raw) return { status: "not-found" };
    const uuids = raw.members.map((member) => member.uuid);
    const position = await findClanPosition(raw.clan.id);
    const ranks = await getRanksForPlayers(uuids);
    const skins = await getSkinsForPlayers(uuids);
    const partialFailures: ClanProfile["partialFailures"] = [];
    if (ranks.status === "unavailable") partialFailures.push("ranks");
    if (skins.status === "unavailable") partialFailures.push("skins");
    const memberList = raw.members
      .map((member) => ({
        uuid: member.uuid,
        nickname: member.nickname,
        role: member.role === 2 ? "leader" as const : member.role === 1 ? "elevated" as const : "member" as const,
        kills: member.kills,
        deaths: member.deaths,
        contributionPercent: raw.clan.kills > 0 ? (member.kills / raw.clan.kills) * 100 : 0,
        rank: ranks.status === "ok" ? toRankSummary(ranks.data.get(member.uuid)) : null,
        skin: skins.status === "ok"
          ? skins.data.get(member.uuid) ?? fallbackSkin()
          : fallbackSkin(),
      }))
      .sort((left, right) => right.kills - left.kills || left.nickname.localeCompare(right.nickname));

    return {
      status: "ok",
      data: {
        ...raw.clan,
        position: position.position,
        distanceToHigher: position.distanceToHigher,
        tiedAtPosition: position.tiedAtPosition,
        higherClan: position.higherClan,
        memberList,
        allies: raw.allies,
        topContributor: selectTopContributor(memberList),
        partialFailures,
      },
    };
  } catch {
    return { status: "unavailable", reason: "clan-source-unavailable" };
  }
}

function fallbackSkin() {
  return { renderId: null, variant: "classic" as const, fallback: true };
}

function toRankSummary(rank: PlayerRankIdentity | undefined): RankSummary | null {
  if (!rank) return null;
  return { dominant: rank.dominant, weight: rank.weight };
}
