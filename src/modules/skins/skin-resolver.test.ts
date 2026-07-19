import { describe, expect, it } from "vitest";
import { resolveSkinRenderId } from "./skin-resolver";
import type { SkinSelection } from "./skin.types";

const playerSelection: SkinSelection = {
  uuid: "c7e99bac-c3c1-439b-bf64-3ae9d8b97dea",
  identifier: "C2553EF5-2979-4DA0-BC98-FE2708FDAAEC",
  variant: null,
  type: "PLAYER",
};

describe("resolveSkinRenderId", () => {
  it("prefers a stored texture id", () => {
    const textureId = "a".repeat(64);
    expect(resolveSkinRenderId(playerSelection, textureId)).toBe(textureId);
  });

  it("uses the selected PLAYER uuid when its stored property is absent", () => {
    expect(resolveSkinRenderId(playerSelection, null)).toBe(
      "c2553ef5-2979-4da0-bc98-fe2708fdaaec",
    );
  });

  it("does not expose URL or invalid identifiers as render ids", () => {
    expect(resolveSkinRenderId({ ...playerSelection, type: "URL" }, null)).toBeNull();
    expect(resolveSkinRenderId({ ...playerSelection, identifier: "not-a-uuid" }, null)).toBeNull();
  });
});
