const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,16}$/;

export function normalizePlayerIdentifier(identifier: string): string | null {
  const value = identifier.trim();
  if (USERNAME_PATTERN.test(value)) return value;
  const compact = value.replaceAll("-", "");
  if (!/^[0-9a-f]{32}$/i.test(compact)) return null;
  const dashed = `${compact.slice(0, 8)}-${compact.slice(8, 12)}-${compact.slice(12, 16)}-${compact.slice(16, 20)}-${compact.slice(20)}`;
  return UUID_PATTERN.test(dashed) ? dashed.toLowerCase() : null;
}

export function isPlayerUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export function isPlayerUsername(value: string): boolean {
  return USERNAME_PATTERN.test(value);
}
