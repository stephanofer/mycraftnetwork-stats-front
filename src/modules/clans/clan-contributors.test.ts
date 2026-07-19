import { describe, expect, it } from "vitest";
import { selectTopContributor } from "./clan-contributors";

describe("selectTopContributor", () => {
  it("returns null when the maximum contribution is zero", () => {
    expect(selectTopContributor([{ name: "A", kills: 0 }, { name: "B", kills: 0 }])).toBeNull();
  });

  it("returns the member with the greatest positive contribution", () => {
    expect(selectTopContributor([{ name: "A", kills: 2 }, { name: "B", kills: 5 }])?.name).toBe("B");
  });
});
