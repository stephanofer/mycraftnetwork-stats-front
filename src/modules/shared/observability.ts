import * as Sentry from "@sentry/astro";
import { mysqlErrorCode } from "./mysql-error";

type DataSource = "rpg" | "skins";

export async function observeQuery<T>(
  operation: string,
  source: DataSource,
  query: () => Promise<T>,
): Promise<T> {
  const startedAt = performance.now();
  try {
    return await query();
  } catch (error) {
    const mysqlCode = mysqlErrorCode(error);
    Sentry.captureMessage("Database operation failed", {
      level: "error",
      tags: { operation, source, errorType: errorName(error), ...(mysqlCode ? { mysqlCode } : {}) },
      extra: { durationMs: Math.round(performance.now() - startedAt) },
    });
    throw error;
  } finally {
    const durationMs = performance.now() - startedAt;
    if (durationMs >= 2_000) {
      Sentry.captureMessage("Slow database operation", {
        level: "warning",
        tags: { operation, source },
        extra: { durationMs: Math.round(durationMs) },
      });
    }
  }
}

export function observeParseFailure(operation: string, source: DataSource): void {
  Sentry.captureMessage("Invalid stored data", {
    level: "warning",
    tags: { operation, source, errorType: "parse" },
  });
}

function errorName(error: unknown): string {
  return error instanceof Error ? error.name : "UnknownError";
}
