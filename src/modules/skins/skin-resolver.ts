import type { SkinSelection } from "./skin.types";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function resolveSkinRenderId(
  selection: SkinSelection | undefined,
  textureId: string | null,
): string | null {
  if (textureId) return textureId;
  if (selection?.type?.toUpperCase() !== "PLAYER" || !selection.identifier) return null;
  return UUID_PATTERN.test(selection.identifier) ? selection.identifier.toLowerCase() : null;
}
