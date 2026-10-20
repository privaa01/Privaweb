import { InboxError, uuid, type ReplyInput } from "./inbox-contract.ts";
export function replyText(v: unknown): string {
  if (
    typeof v !== "string" ||
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(
      v,
    )
  )
    throw new InboxError(422, "validation");
  const s = v.replace(/\r\n/g, "\n").trim();
  if (
    [...s].length < 1 ||
    [...s].length > 5000 ||
    /[\u0000-\u0008\u000B-\u001F\u007F]/u.test(s)
  )
    throw new InboxError(422, "validation");
  return s;
}
export function exact(
  v: unknown,
  keys: string[],
): asserts v is Record<string, unknown> {
  if (
    !v ||
    typeof v !== "object" ||
    Array.isArray(v) ||
    Object.keys(v).length !== keys.length ||
    keys.some((k) => !Object.hasOwn(v, k))
  )
    throw new InboxError(422, "validation");
}
export function replyInput(v: unknown): ReplyInput {
  exact(v, [
    "operationId",
    "expectedRevision",
    "reviewedRevision",
    "text",
    "retryOf",
  ]);
  if (
    typeof v.operationId !== "string" ||
    !uuid.test(v.operationId) ||
    !Number.isSafeInteger(v.expectedRevision) ||
    Number(v.expectedRevision) < 1 ||
    v.reviewedRevision !== v.expectedRevision ||
    (v.retryOf !== null &&
      (typeof v.retryOf !== "string" || !uuid.test(v.retryOf)))
  )
    throw new InboxError(422, "validation");
  return { ...v, text: replyText(v.text) } as unknown as ReplyInput;
}
