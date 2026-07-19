import type { KothProfile } from "./player.types";

type KothMapRow = { name: string; wins: number | null };

export function normalizeKothProfile(
  ajlbTotal: unknown,
  mapRows: KothMapRow[],
  recordedActivityAt: Date | null,
): KothProfile {
  const maps = mapRows
    .map((row) => ({ name: row.name, wins: positiveNumber(row.wins) }))
    .filter((row) => row.wins > 0);
  const verifiedMapTotal = maps.reduce((total, map) => total + map.wins, 0);
  const storedTotal = positiveNumber(ajlbTotal);

  return {
    totalWins: storedTotal > 0 ? storedTotal : verifiedMapTotal,
    maps,
    recordedActivityAt,
  };
}

function positiveNumber(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}
