export type PrivacyEvent = {
  event: "privacy_maintenance";
  code: "ok" | "failed" | "overdue";
  duration: number;
};
export function health(
  lastSuccessAt: number,
  oldestDueAt: number | null,
  now: number,
) {
  return {
    healthy:
      now - lastSuccessAt <= 120000 &&
      (oldestDueAt === null || oldestDueAt >= now),
    lastSuccessAt,
    oldestDueAt,
    checkedAt: now,
  };
}
export function safeEvent(
  code: PrivacyEvent["code"],
  duration: number,
): PrivacyEvent {
  return {
    event: "privacy_maintenance",
    code,
    duration: Math.max(0, duration),
  };
}
