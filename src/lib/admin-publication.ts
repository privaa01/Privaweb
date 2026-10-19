import type { AdminContent, AdminReadiness } from "./admin-contract.ts";
export function adminPublicationIssues(
  content: AdminContent,
  ready: AdminReadiness,
) {
  const issues: string[] = [];
  if (content.testOnly || ready.testOnly)
    issues.push("Fixtures no autorizan publicación");
  if (
    !ready.reviewedContent ||
    JSON.stringify(ready.reviewedContent) !== JSON.stringify(content)
  )
    issues.push("Falta revisión ligada al contenido exacto");
  if (
    !ready.officialBrand?.startsWith("/brand/") ||
    ready.officialBrand.includes("..")
  )
    issues.push("Faltan recursos oficiales revisados");
  const required = [
    "provision",
    "mailAdapter",
    "senderMailbox",
    "httpsProxy",
    "storage",
    "hashCapacity",
    "abuseTiming",
    "cookiesCsrf",
    "privacyRetention",
    "notices",
    "manualAccessibility",
  ];
  for (const key of required)
    if (!ready.references[key]?.trim())
      issues.push("Falta calificación: " + key);
  return issues;
}
