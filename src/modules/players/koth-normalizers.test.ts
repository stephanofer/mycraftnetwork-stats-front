import { describe, expect, it } from "vitest";
import { normalizeKothProfile } from "./koth-normalizers";

describe("normalizeKothProfile", () => {
  it("keeps positive map wins and uses their verified sum when AJLB has no total", () => {
    const profile = normalizeKothProfile(0, [
      { name: "castle", wins: 2 },
      { name: "desert", wins: 3 },
      { name: "invalid", wins: 0 },
    ], null);

    expect(profile.totalWins).toBe(5);
    expect(profile.maps).toEqual([
      { name: "castle", wins: 2 },
      { name: "desert", wins: 3 },
    ]);
  });

  it("uses a positive AJLB total without adding map wins again", () => {
    const profile = normalizeKothProfile(8, [
      { name: "castle", wins: 2 },
      { name: "desert", wins: 3 },
    ], null);

    expect(profile.totalWins).toBe(8);
  });
});
