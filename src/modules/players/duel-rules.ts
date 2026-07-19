export const COMPETITIVE_DUEL_STATUSES = [1, -1] as const;

export function isCompetitiveDuelStatus(status: unknown): status is 1 | -1 {
  return status === 1 || status === -1;
}
