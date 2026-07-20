import { describe, expect, it } from "vitest";
import { normalizePlayerIdentifier } from "./player-identifier";

describe("normalizePlayerIdentifier", () => {
  it("accepts valid usernames without changing their canonical lookup value", () => {
    expect(normalizePlayerIdentifier("  Player_01 ")).toBe("Player_01");
  });

  it("normalizes compact and uppercase UUIDs", () => {
    expect(normalizePlayerIdentifier("A0B1C2D3E4F546789ABCDEF012345678")).toBe(
      "a0b1c2d3-e4f5-4678-9abc-def012345678",
    );
  });

  it.each(["ab", "player-name", "a".repeat(17), "../../admin", "z".repeat(32)])(
    "rejects invalid identifiers: %s",
    (identifier) => {
      expect(normalizePlayerIdentifier(identifier)).toBeNull();
    },
  );
});
