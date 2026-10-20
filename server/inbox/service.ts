import { InboxRepository } from "./sqlite-repository.ts";
import { replyInput, exact } from "./validation.ts";
import { InboxError, uuid } from "../../src/lib/inbox-contract.ts";
export class InboxService {
  repository: InboxRepository;
  constructor(repository: InboxRepository) {
    this.repository = repository;
  }
  authorize(token: string | undefined) {
    return this.repository.admin.withAuthorizedTransaction(
      token,
      () => true,
      false,
    );
  }
  private id(id: string) {
    if (!uuid.test(id)) throw new InboxError(404, "not_found");
  }
  list(token: string | undefined, v: unknown) {
    exact(v, ["status", "cursor", "limit"]);
    return this.repository.authorized(token, () =>
      this.repository.list(v.status, v.cursor, v.limit),
    );
  }
  summary(token: string | undefined) {
    return this.repository.authorized(
      token,
      () => ({ result: "summary", summary: this.repository.summary() }),
      false,
    );
  }
  detail(token: string | undefined, id: string) {
    this.id(id);
    return this.repository.authorized(token, () => this.repository.detail(id));
  }
  history(token: string | undefined, id: string, v: unknown) {
    this.id(id);
    exact(v, ["cursor", "limit"]);
    if (v.limit !== 25) throw new InboxError(422, "validation");
    return this.repository.authorized(token, () =>
      this.repository.history(id, v.cursor),
    );
  }
  operation(token: string | undefined, id: string) {
    this.id(id);
    return this.repository.authorized(
      token,
      () => this.repository.operation(id),
      false,
    );
  }
  send(token: string | undefined, id: string, v: unknown) {
    this.id(id);
    const input = replyInput(v);
    return this.repository.authorized(token, (account) =>
      this.repository.enqueue(token!, id, input, account),
    );
  }
}
