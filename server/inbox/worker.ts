import { InboxRepository } from "./sqlite-repository.ts";
import {
  assertReplyAdapter,
  type ReplyMailAdapter,
  type MailResult,
} from "./mail-adapter.ts";
export class ReplyWorker {
  private busy = false;
  repository: InboxRepository;
  adapter: ReplyMailAdapter;
  timeout: number;
  constructor(
    repository: InboxRepository,
    adapter: ReplyMailAdapter,
    timeout = 10000,
  ) {
    this.repository = repository;
    this.adapter = adapter;
    this.timeout = timeout;
    assertReplyAdapter(adapter);
  }
  async tick() {
    if (this.busy) return false;
    this.busy = true;
    try {
      const job = this.repository.claim(
        this.adapter.capabilities.idempotencyWindowMs,
      );
      if (!job) return false;
      const { operation: o, kind } = job;
      let result: MailResult = { state: "unknown" };
      const abort = new AbortController();
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        const request =
          kind === "send"
            ? this.adapter.send(
                {
                  ...this.repository.payload(o),
                  deliveryId: o.deliveryId,
                  payloadDigest: o.payloadHash,
                },
                abort.signal,
              )
            : this.adapter.lookup({ deliveryId: o.deliveryId }, abort.signal);
        result = await Promise.race([
          request,
          new Promise<MailResult>((resolve) => {
            timer = setTimeout(() => {
              abort.abort();
              resolve({ state: "unknown" });
            }, this.timeout);
          }),
        ]);
        if (
          !result ||
          !["accepted", "rejected", "unknown"].includes(result.state)
        )
          result = { state: "unknown" };
        if (result.state !== "unknown") {
          const size = JSON.stringify(result).length;
          if (
            size > 16384 ||
            !this.adapter.verify(result, {
              deliveryId: o.deliveryId,
              payloadDigest: o.payloadHash,
            }) ||
            (result.state === "accepted" &&
              (!Number.isSafeInteger(result.acceptedAt) ||
                result.acceptedAt < o.createdAt ||
                result.acceptedAt > this.repository.now() + 300000 ||
                typeof result.providerReference !== "string" ||
                !result.providerReference)) ||
            (result.state === "rejected" &&
              (result.terminal !== true || result.noFutureAcceptance !== true))
          )
            result = { state: "unknown" };
        }
      } catch {
        result = { state: "unknown" };
      } finally {
        clearTimeout(timer);
      }
      this.repository.settle(o, result);
      return true;
    } finally {
      this.busy = false;
    }
  }
}
