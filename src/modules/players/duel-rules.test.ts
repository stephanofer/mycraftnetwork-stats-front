import { describe, expect, it } from "vitest";
import { COMPETITIVE_DUEL_STATUSES, isCompetitiveDuelStatus } from "./duel-rules";

describe("competitive duel statuses", () => {
  it("accepts only wins and losses", () => {
    expect(COMPETITIVE_DUEL_STATUSES).toEqual([1, -1]);
    expect(isCompetitiveDuelStatus(1)).toBe(true);
    expect(isCompetitiveDuelStatus(-1)).toBe(true);
    expect(isCompetitiveDuelStatus(0)).toBe(false);
    expect(isCompetitiveDuelStatus(null)).toBe(false);
  });
});
