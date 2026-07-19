import { describe, expect, it } from "vitest";
import { dateFromEpoch, normalizeEpochMs } from "./player-normalizers";

describe("duel epoch normalization", () => {
  it("normalizes numeric MariaDB strings before constructing dates", () => {
    expect(normalizeEpochMs("1784435139961")).toBe(1_784_435_139_961);
    expect(dateFromEpoch("1784435139961")?.getTime()).toBe(1_784_435_139_961);
  });

  it("rejects invalid, negative, and out-of-range epochs", () => {
    expect(normalizeEpochMs("not-a-number")).toBe(0);
    expect(normalizeEpochMs(-1)).toBe(0);
    expect(normalizeEpochMs(Number.POSITIVE_INFINITY)).toBe(0);
    expect(dateFromEpoch(null)).toBeNull();
  });
});
