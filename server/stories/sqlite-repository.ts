import { createHash, randomUUID } from "node:crypto";
import type { SqliteAdminRepository } from "../admin/sqlite-repository.ts";
import {
  StoryError,
  type ManagedStory,
  type StoryResource,
  type StoryReceipt,
} from "../../src/lib/story-management-contract.ts";
export class StoriesRepository {
  admin: SqliteAdminRepository;
  failure?: (stage: "beforeCommit" | "afterCommit") => void;
  constructor(admin: SqliteAdminRepository) {
    this.admin = admin;
    admin.db
      .exec(`CREATE TABLE IF NOT EXISTS stories_records(id TEXT PRIMARY KEY,revision INTEGER NOT NULL CHECK(revision>=1),workingJSON TEXT NOT NULL,publishedJSON TEXT,pendingChanges INTEGER NOT NULL CHECK(pendingChanges IN(0,1)),active INTEGER NOT NULL CHECK(active IN(0,1)),createdAt INTEGER NOT NULL,updatedAt INTEGER NOT NULL,publishedAt INTEGER,createdBy TEXT NOT NULL REFERENCES admin_accounts(id),updatedBy TEXT NOT NULL REFERENCES admin_accounts(id));
 CREATE TABLE IF NOT EXISTS stories_resources(id TEXT PRIMARY KEY,storyId TEXT NOT NULL REFERENCES stories_records(id),kind TEXT NOT NULL CHECK(kind IN('image','audio')),storageKey TEXT NOT NULL UNIQUE,sha256 TEXT NOT NULL,bytes INTEGER NOT NULL CHECK(bytes>0),mime TEXT NOT NULL,width INTEGER,height INTEGER,durationSeconds REAL,state TEXT NOT NULL CHECK(state IN('staging','ready','rejected')),createdAt INTEGER NOT NULL,uploadedBy TEXT NOT NULL REFERENCES admin_accounts(id));
 CREATE TABLE IF NOT EXISTS stories_operations(operationId TEXT PRIMARY KEY,accountId TEXT NOT NULL REFERENCES admin_accounts(id),storyId TEXT NOT NULL REFERENCES stories_records(id),kind TEXT NOT NULL,requestHash TEXT NOT NULL,expectedRevision INTEGER,resultRevision INTEGER NOT NULL,resultSummary TEXT NOT NULL,committedAt INTEGER NOT NULL);
 CREATE INDEX IF NOT EXISTS stories_resource_story ON stories_resources(storyId);`);
  }
  get(id: string): ManagedStory {
    const r = this.admin.db
      .prepare("SELECT * FROM stories_records WHERE id=?")
      .get(id);
    if (!r) throw new StoryError(404, "not_found");
    return {
      id: r.id as string,
      revision: r.revision as number,
      working: JSON.parse(r.workingJSON as string),
      published: r.publishedJSON ? JSON.parse(r.publishedJSON as string) : null,
      active: !!r.active,
      pendingChanges: !!r.pendingChanges,
      createdAt: r.createdAt as number,
      updatedAt: r.updatedAt as number,
      publishedAt: r.publishedAt as number | null,
    };
  }
  all() {
    return this.admin.db
      .prepare("SELECT id FROM stories_records ORDER BY createdAt,id")
      .all()
      .map((r) => this.get(r.id as string));
  }
  resource(id: string) {
    const r = this.admin.db
      .prepare("SELECT * FROM stories_resources WHERE id=?")
      .get(id);
    if (!r) throw new StoryError(404, "not_found");
    return r as unknown as StoryResource;
  }
  publicResource(id: string) {
    const r = this.resource(id);
    if (
      r.state !== "ready" ||
      !this.all().some(
        (s) =>
          s.published &&
          s.active &&
          (s.published.imageResourceId === id ||
            s.published.audioResourceId === id),
      )
    )
      throw new StoryError(404, "not_found");
    return r;
  }
  receipt(token: string | undefined, id: string) {
    return this.admin.withAuthorizedTransaction(token, (_db, a) => {
      const r = this.admin.db
        .prepare(
          "SELECT resultSummary FROM stories_operations WHERE operationId=? AND accountId=?",
        )
        .get(id, a.id);
      if (!r) throw new StoryError(404, "unknown");
      return JSON.parse(r.resultSummary as string) as StoryReceipt;
    });
  }
  mutate(
    token: string | undefined,
    op: string,
    kind: string,
    id: string | null,
    revision: unknown,
    payload: unknown,
    fn: (story: ManagedStory | null, accountId: string) => ManagedStory,
  ) {
    const hash = createHash("sha256")
      .update(JSON.stringify({ kind, id, revision: revision ?? null, payload }))
      .digest("hex");
    const result = this.admin.withAuthorizedTransaction(token, (_db, a) => {
      const old = this.admin.db
        .prepare("SELECT * FROM stories_operations WHERE operationId=?")
        .get(op);
      if (old) {
        if (
          old.accountId !== a.id ||
          old.kind !== kind ||
          old.requestHash !== hash
        )
          throw new StoryError(409, "conflict");
        return JSON.parse(old.resultSummary as string) as StoryReceipt;
      }
      const story = id ? this.get(id) : null;
      if (
        story &&
        (!Number.isSafeInteger(revision) || revision !== story.revision)
      )
        throw new StoryError(409, "conflict");
      const updated = fn(story, a.id),
        now = this.admin.clock();
      this.admin.db
        .prepare(
          `INSERT INTO stories_records VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET revision=excluded.revision,workingJSON=excluded.workingJSON,publishedJSON=excluded.publishedJSON,pendingChanges=excluded.pendingChanges,active=excluded.active,updatedAt=excluded.updatedAt,publishedAt=excluded.publishedAt,updatedBy=excluded.updatedBy`,
        )
        .run(
          updated.id,
          updated.revision,
          JSON.stringify(updated.working),
          updated.published ? JSON.stringify(updated.published) : null,
          +updated.pendingChanges,
          +updated.active,
          updated.createdAt,
          now,
          updated.publishedAt,
          a.id,
          a.id,
        );
      const receipt: StoryReceipt = {
        operationId: op,
        storyId: updated.id,
        revision: updated.revision,
        result: "confirmed",
        publicationState: updated.published ? "Publicada" : "Borrador",
        active: updated.active,
        pendingChanges: updated.pendingChanges,
      };
      this.admin.db
        .prepare("INSERT INTO stories_operations VALUES(?,?,?,?,?,?,?,?,?)")
        .run(
          op,
          a.id,
          updated.id,
          kind,
          hash,
          typeof revision === "number" ? revision : null,
          updated.revision,
          JSON.stringify(receipt),
          now,
        );
      this.failure?.("beforeCommit");
      return receipt;
    });
    this.failure?.("afterCommit");
    return result;
  }
  newId() {
    return "historia-" + randomUUID();
  }
}
