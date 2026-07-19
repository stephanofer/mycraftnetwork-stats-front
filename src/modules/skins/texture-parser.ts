const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const TEXTURE_ID_PATTERN = /^[a-f0-9]{63,64}$/;

export function parseTextureId(value: string): string | null {
  if (value.length === 0 || value.length > 32_768 || !BASE64_PATTERN.test(value)) return null;

  try {
    const decoded = Buffer.from(value, "base64");
    if (decoded.toString("base64") !== value) return null;
    const payload: unknown = JSON.parse(decoded.toString("utf8"));
    const textureUrl = getTextureUrl(payload);
    if (!textureUrl) return null;
    const url = new URL(textureUrl);
    if (
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      url.hostname !== "textures.minecraft.net" ||
      url.username ||
      url.password ||
      url.port
    ) return null;
    const match = url.pathname.match(/^\/texture\/([a-f0-9]{63,64})$/);
    if (!match || url.search || url.hash || !TEXTURE_ID_PATTERN.test(match[1])) return null;
    return match[1];
  } catch {
    return null;
  }
}

function getTextureUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const textures = (payload as Record<string, unknown>).textures;
  if (!textures || typeof textures !== "object") return null;
  const skin = (textures as Record<string, unknown>).SKIN;
  if (!skin || typeof skin !== "object") return null;
  const url = (skin as Record<string, unknown>).url;
  return typeof url === "string" ? url : null;
}
