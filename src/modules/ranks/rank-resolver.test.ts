import { describe, expect, it } from "vitest";
import { resolveRank } from "./rank-resolver";

describe("resolveRank", () => {
  it("resolves complete inheritance and selects the greatest weight", () => {
    const result = resolveRank("default", ["deluxe"], [
      { group: "deluxe", permission: "group.elite" },
      { group: "elite", permission: "group.mvp+" },
      { group: "deluxe", permission: "weight.20" },
      { group: "elite", permission: "weight.30" },
    ]);

    expect(result.dominant.id).toBe("deluxe");
    expect(result.secondaryRanks.map((rank) => rank.id)).toEqual(["ultra"]);
  });

  it("stops inheritance cycles and prefers the primary group on equal weight", () => {
    const result = resolveRank("vip", ["mvp"], [
      { group: "vip", permission: "group.mvp" },
      { group: "mvp", permission: "group.vip" },
      { group: "vip", permission: "weight.10" },
      { group: "mvp", permission: "weight.10" },
    ]);

    expect(result.dominant.id).toBe("vip");
    expect(result.secondaryRanks.map((rank) => rank.id)).toEqual(["mvp"]);
  });

  it("never lets an internal group win or leak through secondary ranks", () => {
    const result = resolveRank("default", ["antihacks"], [
      { group: "antihacks", permission: "weight.999" },
      { group: "default", permission: "weight.1" },
    ]);

    expect(result.dominant.id).toBe("default");
    expect(result.secondaryRanks).toEqual([]);
  });
});
