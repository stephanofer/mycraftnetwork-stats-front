const MYSQL_CODE_PATTERN = /^(?:ER|WARN)_[A-Z0-9_]{1,60}$/;

export function mysqlErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" && MYSQL_CODE_PATTERN.test(code) ? code : undefined;
}
