export const inboxReadiness: Record<string, string | null> = {
  adapter: null,
  delivery: null,
  migration: null,
  privacy: null,
  notices: null,
  visual: null,
  operations: null,
};
export function inboxIssues(
  readiness: Record<string, string | null> = inboxReadiness,
) {
  return Object.entries(readiness)
    .filter(([, v]) => typeof v !== "string" || !v.trim())
    .map(([k]) => "inbox:" + k);
}
