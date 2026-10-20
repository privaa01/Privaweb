import type {
  ReplyMailAdapter,
  ReplyPayload,
  MailResult,
} from "../../../server/inbox/mail-adapter.ts";
export class ControlledMail implements ReplyMailAdapter {
  capabilities = {
    version: 1 as const,
    identityScope: "synthetic-local",
    idempotencyWindowMs: 86400000,
    lookupRetentionMs: 90 * 86400000,
    definitiveRejectionSemantics: true as const,
  };
  sent = new Map<string, MailResult>();
  calls = 0;
  lookups = 0;
  mode: "accepted" | "rejected" | "unknown" | "lost" = "accepted";
  payloads: ReplyPayload[] = [];
  now: () => number;
  constructor(now: () => number) {
    this.now = now;
  }
  verify(
    r: Exclude<MailResult, { state: "unknown" }>,
    binding: { deliveryId: string; payloadDigest: string },
  ) {
    return r.evidence === binding.deliveryId + ":" + binding.payloadDigest;
  }
  async send(
    input: ReplyPayload & { deliveryId: string; payloadDigest: string },
    _signal: AbortSignal,
  ): Promise<MailResult> {
    this.calls++;
    if (this.sent.has(input.deliveryId))
      return this.sent.get(input.deliveryId)!;
    this.payloads.push(input);
    const evidence = input.deliveryId + ":" + input.payloadDigest;
    let result: MailResult =
      this.mode === "rejected"
        ? {
            state: "rejected",
            terminal: true,
            noFutureAcceptance: true,
            code: "synthetic_rejection",
            evidence,
          }
        : this.mode === "unknown"
          ? { state: "unknown" }
          : {
              state: "accepted",
              acceptedAt: this.now(),
              providerReference: "synthetic:" + input.deliveryId,
              evidence,
            };
    this.sent.set(input.deliveryId, result);
    return this.mode === "lost" ? { state: "unknown" } : result;
  }
  async lookup(input: { deliveryId: string }, _signal: AbortSignal) {
    this.lookups++;
    return this.sent.get(input.deliveryId) ?? { state: "unknown" as const };
  }
}
