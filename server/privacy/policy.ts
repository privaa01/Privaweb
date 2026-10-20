export const RETENTION = 90 * 86400000,
  HOUR = 3600000,
  DAY = 86400000,
  CHALLENGE_TTL = 30 * 60000;
export const TICK = 60000,
  BATCH = 100,
  INTERNAL_TARGET = 15 * 60000;
export function instant(value: string | number): number {
  const n = typeof value === "number" ? value : Date.parse(value);
  if (!Number.isSafeInteger(n) || n < 0) throw Error("Invalid privacy instant");
  return n;
}
export function expiresAt(activity: string | number) {
  return instant(activity) + RETENTION;
}
export function dueAt(activity: string | number, confirmedAt?: number) {
  return Math.min(
    expiresAt(activity) + HOUR,
    confirmedAt === undefined ? Infinity : instant(confirmedAt) + DAY,
  );
}
export function activity(received: string, previous: string, accepted: number) {
  return new Date(
    Math.max(instant(received), instant(previous), instant(accepted)),
  ).toISOString();
}
export function visible(
  c: { lifecycle: string; lastActivityAt: string },
  now: number,
) {
  try {
    return (
      c.lifecycle === "active" &&
      instant(c.lastActivityAt) <= now &&
      expiresAt(c.lastActivityAt) > now
    );
  } catch {
    return false;
  }
}
export class PrivacyError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string) {
    super(code);
    this.status = status;
    this.code = code;
  }
}
