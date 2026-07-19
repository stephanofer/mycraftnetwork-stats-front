import type { PlayerDataSection, PlayerPartialFailure } from "./player.types";

export function sectionValue<T>(
  result: PromiseSettledResult<T>,
  section: PlayerDataSection,
  unavailableSections: PlayerDataSection[],
  failures: PlayerPartialFailure[],
): T | null {
  if (result.status === "fulfilled") return result.value;
  unavailableSections.push(section);
  failures.push(section);
  return null;
}
