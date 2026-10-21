import {documents} from '../../src/config/documents.ts';
import {bundleHash} from '../../src/lib/documents-review.ts';
import { readFileSync, lstatSync, realpathSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  privacyIssues,
  privacyReadiness,
  privacyScopes,
  type EvidenceReference,
} from "../../src/config/privacy.ts";
export function evidenceIssues(
  refs: Record<string, unknown> = privacyReadiness,
  revision = process.env.PRIVA_RELEASE_REVISION ?? "",
  now = Date.now(),
  expectedNoticesHash = bundleHash(documents),
) {
  const issues = privacyIssues(refs, now);
  for (const scope of privacyScopes) {
    if (issues.includes("privacy:" + scope)) continue;
    try {
      const r = refs[scope] as EvidenceReference,
        st = lstatSync(r.path);
      if (
        !revision ||
        r.revision !== revision ||
        !st.isFile() ||
        st.isSymbolicLink() ||
        realpathSync(r.path) !== r.path ||
        st.size > 1048576
      )
        throw Error();
      const bytes = readFileSync(r.path);
      if (createHash("sha256").update(bytes).digest("hex") !== r.sha256)
        throw Error();
      const e = JSON.parse(bytes.toString("utf8"));
      if (
        e.kind !== "production" ||
        e.scope !== scope ||
        e.revision !== revision ||
        e.verifiedAt !== r.verifiedAt ||
        e.expiresAt !== r.expiresAt ||
        e.result !== "pass" ||
        e.synthetic !== false ||
        (scope === "notices" && (!/^[a-f0-9]{64}$/.test(expectedNoticesHash) || e.bundleHash !== expectedNoticesHash))
      )
        throw Error();
    } catch {
      issues.push("privacy:" + scope);
    }
  }
  return [...new Set(issues)];
}
export function requirePrivacy() {
  if (evidenceIssues().length) throw Error("Privacy operation not qualified");
}
