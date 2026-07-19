export type DataResult<T> =
  | { status: "ok"; data: T }
  | { status: "not-found" }
  | { status: "unavailable"; reason: string };
