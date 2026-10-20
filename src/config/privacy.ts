export const privacyScopes = [
  "policy",
  "channel",
  "confirmationMail",
  "operationalErasure",
  "replica",
  "backups",
  "restore",
  "providers",
  "tracking",
  "notices",
] as const;
export type PrivacyScope = (typeof privacyScopes)[number];
export type EvidenceReference = {
  path: string;
  sha256: string;
  verifiedAt: string;
  expiresAt: string;
  kind: "production";
  scope: PrivacyScope;
  revision: string;
};
export const privacyReadiness: Record<PrivacyScope, EvidenceReference | null> =
  Object.fromEntries(privacyScopes.map((k) => [k, null])) as Record<
    PrivacyScope,
    EvidenceReference | null
  >;
export function privacyIssues(
  refs: Record<string, unknown> = privacyReadiness,
  now = Date.now(),
) {
  return privacyScopes
    .filter((scope) => {
      const r = refs[scope] as EvidenceReference | null;
      return (
        !r ||
        typeof r !== "object" ||
        r.kind !== "production" ||
        r.scope !== scope ||
        typeof r.path !== "string" ||
        !r.path ||
        !/^([a-f0-9]{64})$/.test(r.sha256 ?? "") ||
        !r.revision ||
        !Number.isFinite(Date.parse(r.verifiedAt)) ||
        Date.parse(r.verifiedAt) > now ||
        !Number.isFinite(Date.parse(r.expiresAt)) ||
        Date.parse(r.expiresAt) <= now
      );
    })
    .map((k) => "privacy:" + k);
}
