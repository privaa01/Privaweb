export interface ReplyPayload {
  to: string;
  from: string;
  subject: string;
  text: string;
}
export type MailResult =
  | {
      state: "accepted";
      acceptedAt: number;
      providerReference: string;
      evidence: string;
    }
  | {
      state: "rejected";
      terminal: true;
      noFutureAcceptance: true;
      code: string;
      evidence: string;
    }
  | { state: "unknown" };
export interface ReplyMailAdapter {
  capabilities: {
    version: 1;
    identityScope: string;
    idempotencyWindowMs: number;
    lookupRetentionMs: number;
    definitiveRejectionSemantics: true;
  };
  send(
    input: ReplyPayload & { deliveryId: string; payloadDigest: string },
    signal: AbortSignal,
  ): Promise<MailResult>;
  lookup(
    input: { deliveryId: string },
    signal: AbortSignal,
  ): Promise<MailResult>;
  /** Operator implementation validates authenticity and deliveryId+payload binding, not merely presence. */
  verify(
    result: Exclude<MailResult, { state: "unknown" }>,
    binding: { deliveryId: string; payloadDigest: string },
  ): boolean;
}
export function assertReplyAdapter(a: ReplyMailAdapter) {
  if (
    a?.capabilities?.version !== 1 ||
    !a.capabilities.identityScope ||
    !Number.isSafeInteger(a.capabilities.idempotencyWindowMs) ||
    a.capabilities.idempotencyWindowMs < 10000 ||
    !Number.isSafeInteger(a.capabilities.lookupRetentionMs) ||
    a.capabilities.lookupRetentionMs < a.capabilities.idempotencyWindowMs ||
    a.capabilities.definitiveRejectionSemantics !== true ||
    typeof a.send !== "function" ||
    typeof a.lookup !== "function" ||
    typeof a.verify !== "function"
  )
    throw Error("Unqualified reply adapter capabilities");
}
