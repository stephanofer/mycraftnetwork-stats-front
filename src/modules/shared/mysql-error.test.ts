import { describe, expect, it } from "vitest";
import { mysqlErrorCode } from "./mysql-error";

describe("mysqlErrorCode", () => {
  it("extracts only bounded MySQL symbolic codes", () => {
    expect(mysqlErrorCode({ code: "ER_LOCK_WAIT_TIMEOUT", sql: "sensitive" })).toBe("ER_LOCK_WAIT_TIMEOUT");
    expect(mysqlErrorCode({ code: "attacker controlled value" })).toBeUndefined();
    expect(mysqlErrorCode(new Error("ER_ACCESS_DENIED_ERROR"))).toBeUndefined();
  });
});
