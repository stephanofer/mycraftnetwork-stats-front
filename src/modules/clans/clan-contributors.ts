export function selectTopContributor<T extends { kills: number }>(members: T[]): T | null {
  const top = members.reduce<T | null>(
    (current, member) => current === null || member.kills > current.kills ? member : current,
    null,
  );
  return top && top.kills > 0 ? top : null;
}
