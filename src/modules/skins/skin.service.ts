import type { DataResult } from "@/modules/shared/data-result";
import { observeParseFailure } from "@/modules/shared/observability";
import { findPlayerTextures, findSkinSelections, findUrlTextures } from "./skin.repository";
import { resolveSkinRenderId } from "./skin-resolver";
import type { ResolvedSkin } from "./skin.types";
import { parseTextureId } from "./texture-parser";

export async function getSkinsForPlayers(
  uuids: string[],
): Promise<DataResult<Map<string, ResolvedSkin>>> {
  try {
    const uniqueUuids = [...new Set(uuids)].slice(0, 100);
    const selections = await findSkinSelections(uniqueUuids);
    const playerIds = selections
      .filter((item) => item.type === "PLAYER" && item.identifier)
      .map((item) => item.identifier as string);
    const urls = selections
      .filter((item) => item.type === "URL" && item.identifier)
      .map((item) => item.identifier as string);
    const players = await findPlayerTextures([...new Set(playerIds)]);
    const urlValues = await findUrlTextures([...new Set(urls)]);
    const values = new Map([...players, ...urlValues].map((item) => [item.key, item.value]));
    const selectionByUuid = new Map(selections.map((item) => [item.uuid, item]));
    const result = new Map<string, ResolvedSkin>();

    for (const uuid of uniqueUuids) {
      const selection = selectionByUuid.get(uuid);
      const value = selection?.identifier ? values.get(selection.identifier) : undefined;
      const textureId = value ? parseTextureId(value) : null;
      if (value && !textureId) observeParseFailure("skins.texture", "skins");
      const renderId = resolveSkinRenderId(selection, textureId);
      result.set(uuid, {
        renderId,
        variant: selection?.variant?.toLowerCase() === "slim" ? "slim" : "classic",
        fallback: renderId === null,
      });
    }

    return { status: "ok", data: result };
  } catch {
    return { status: "unavailable", reason: "skin-source-unavailable" };
  }
}
