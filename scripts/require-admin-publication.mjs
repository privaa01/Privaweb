import './require-privacy-publication.mjs';
import { adminContent } from "../src/content/admin.ts";
import { adminReadiness } from "../src/config/admin.ts";
import { adminPublicationIssues } from "../src/lib/admin-publication.ts";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
const issues = adminPublicationIssues(adminContent, adminReadiness);
if (
  adminReadiness.officialBrand &&
  !existsSync(resolve("public", "." + adminReadiness.officialBrand))
)
  issues.push("Recurso oficial ausente");
for (const p of [
  "src/pages/admin/panel.astro",
  "src/pages/admin/historias.astro",
  "src/pages/admin/contacto.astro",
])
  if (existsSync(p))
    issues.push("HTML privado no puede compilarse al sitio público");
if (issues.length) {
  console.error("BLOQUEADO 006: " + issues.join("; "));
  process.exitCode = 1;
}
