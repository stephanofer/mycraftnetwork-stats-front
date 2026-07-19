export function normalizeEpochMs(value: unknown): number {
  const epoch = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
  return typeof epoch === "number" && Number.isFinite(epoch) && epoch > 0 && epoch <= 8_640_000_000_000_000
    ? Math.trunc(epoch)
    : 0;
}

export function dateFromEpoch(value: unknown): Date | null {
  const epoch = normalizeEpochMs(value);
  return epoch > 0 ? new Date(epoch) : null;
}
