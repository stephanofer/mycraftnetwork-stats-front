import { describe, expect, it } from "vitest";
import { parseTextureId } from "./texture-parser";

const textureId = "a".repeat(64);

function encode(url: string): string {
  return Buffer.from(JSON.stringify({ textures: { SKIN: { url } } })).toString("base64");
}

describe("parseTextureId", () => {
  it("accepts an exact Minecraft texture host and a 64-character id", () => {
    expect(parseTextureId(encode(`https://textures.minecraft.net/texture/${textureId}`))).toBe(textureId);
  });

  it("rejects lookalike hosts, malformed base64, and short ids", () => {
    expect(parseTextureId(encode(`https://textures.minecraft.net.evil.test/texture/${textureId}`))).toBeNull();
    expect(parseTextureId(encode(`ftp://textures.minecraft.net/texture/${textureId}`))).toBeNull();
    expect(parseTextureId("not base64")).toBeNull();
    expect(parseTextureId(encode("https://textures.minecraft.net/texture/abcd"))).toBeNull();
  });
});
