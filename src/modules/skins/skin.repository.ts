import { inArray } from "drizzle-orm";
import { skinsDb } from "@/db/clients";
import { playerSkins, skinPlayers, urlSkins } from "@/db/schema/skins";
import { observeQuery } from "@/modules/shared/observability";
import type { SkinSelection, StoredTexture } from "./skin.types";

export async function findSkinSelections(uuids: string[]): Promise<SkinSelection[]> {
  if (uuids.length === 0) return [];
  return observeQuery("skins.selections", "skins", () =>
    skinsDb
      .select({
        uuid: skinPlayers.uuid,
        identifier: skinPlayers.identifier,
        variant: skinPlayers.variant,
        type: skinPlayers.type,
      })
      .from(skinPlayers)
      .where(inArray(skinPlayers.uuid, uuids)),
  );
}

export async function findPlayerTextures(ids: string[]): Promise<StoredTexture[]> {
  if (ids.length === 0) return [];
  return observeQuery("skins.player-textures", "skins", async () => {
    const rows = await skinsDb
      .select({ key: playerSkins.uuid, value: playerSkins.value })
      .from(playerSkins)
      .where(inArray(playerSkins.uuid, ids));
    return rows;
  });
}

export async function findUrlTextures(urls: string[]): Promise<StoredTexture[]> {
  if (urls.length === 0) return [];
  return observeQuery("skins.url-textures", "skins", async () => {
    const rows = await skinsDb
      .select({ key: urlSkins.url, value: urlSkins.value })
      .from(urlSkins)
      .where(inArray(urlSkins.url, urls));
    return rows;
  });
}
