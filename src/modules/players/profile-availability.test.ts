import { describe, expect, it } from "vitest";
import { sectionValue } from "./profile-availability";
import type { PlayerDataSection, PlayerPartialFailure } from "./player.types";

describe("profile section availability", () => {
  it("preserves a legitimate empty result without marking the section unavailable", () => {
    const unavailable: PlayerDataSection[] = [];
    const failures: PlayerPartialFailure[] = [];

    expect(sectionValue({ status: "fulfilled", value: [] }, "rankings", unavailable, failures)).toEqual([]);
    expect(sectionValue({ status: "fulfilled", value: null }, "combat", unavailable, failures)).toBeNull();
    expect(unavailable).toEqual([]);
    expect(failures).toEqual([]);
  });

  it("returns null and records a rejected section", () => {
    const unavailable: PlayerDataSection[] = [];
    const failures: PlayerPartialFailure[] = [];

    expect(sectionValue({ status: "rejected", reason: new Error("down") }, "duels", unavailable, failures)).toBeNull();
    expect(unavailable).toEqual(["duels"]);
    expect(failures).toEqual(["duels"]);
  });
});
