import {
  StoryError,
  uuidPattern,
  type StoryDraft,
  type ManagedStory,
  type StoryResource,
} from "../../src/lib/story-management-contract.ts";
import { validateDraft, exactBody } from "./validation.ts";
import { StoriesRepository } from "./sqlite-repository.ts";
import type { PublicCatalog } from "../../src/lib/stories-contract.ts";
export class StoriesService {
  repository: StoriesRepository;
  verifyResource: (r: StoryResource) => void;
  contactCount: () =>
    { state: "available"; total: number } | { state: "unavailable" };
  constructor(
    repository: StoriesRepository,
    verifyResource: (r: StoryResource) => void = () => {
      throw new StoryError(503, "media_unavailable");
    },
    contactCount: StoriesService["contactCount"] = () => ({
      state: "unavailable",
    }),
  ) {
    this.repository = repository;
    this.verifyResource = verifyResource;
    this.contactCount = contactCount;
  }
  authorize(token: string | undefined) {
    return this.repository.admin.withAuthorizedTransaction(
      token,
      (_db, a) => a.id,
    );
  }
  list(token: string | undefined) {
    return this.repository.admin.withAuthorizedTransaction(token, () => {
      const all = this.repository.all();
      return {
        stories: all.map(({ published, working, ...s }) => ({
          ...s,
          title: working.title,
          category: working.category,
          publicationState: published ? "Publicada" : "Borrador",
          durationSeconds: working.audioResourceId
            ? this.repository.resource(working.audioResourceId).durationSeconds
            : null,
        })),
        summary: {
          active: all.filter((s) => s.published && s.active).length,
          drafts: all.filter((s) => !s.published).length,
          contact: this.contactCount(),
        },
      };
    });
  }
  get(token: string | undefined, id: string) {
    return this.repository.admin.withAuthorizedTransaction(token, () =>
      this.repository.get(id),
    );
  }
  references(d: StoryDraft, id: string, publish: boolean) {
    for (const [key, kind] of [
      ["imageResourceId", "image"],
      ["audioResourceId", "audio"],
    ] as const) {
      const ref = d[key];
      if (!ref) continue;
      let r;
      try {
        r = this.repository.resource(ref);
      } catch {
        throw new StoryError(422, "invalid", {
          [key]: "Recurso no disponible.",
        });
      }
      if (r.storyId !== id || r.kind !== kind || r.state !== "ready")
        throw new StoryError(422, "invalid", {
          [key]: "Recurso no válido para esta historia.",
        });
      if (publish) this.verifyResource(r);
    }
  }
  change(
    token: string | undefined,
    kind: "create" | "save" | "publish" | "activate",
    id: string | null,
    raw: unknown,
  ) {
    this.authorize(token);
    const keys =
      kind === "create"
        ? ["operationId", "working"]
        : kind === "save"
          ? ["operationId", "expectedRevision", "working"]
          : kind === "activate"
            ? ["operationId", "expectedRevision", "active"]
            : ["operationId", "expectedRevision"];
    const b = exactBody(raw, keys);
    if (typeof b.operationId !== "string" || !uuidPattern.test(b.operationId))
      throw new StoryError(422, "invalid");
    if (kind === "activate" && typeof b.active !== "boolean")
      throw new StoryError(422, "invalid");
    const draft =
      kind === "create" || kind === "save" ? validateDraft(b.working) : null;
    return this.repository.mutate(
      token,
      b.operationId,
      kind,
      id,
      b.expectedRevision,
      draft ?? (kind === "activate" ? b.active : null),
      (prior) => {
        const now = this.repository.admin.clock();
        const s: ManagedStory = prior ?? {
          id: this.repository.newId(),
          revision: 0,
          working: draft!,
          published: null,
          active: false,
          pendingChanges: false,
          createdAt: now,
          updatedAt: now,
          publishedAt: null,
        };
        if (draft) {
          if (
            prior &&
            draft.options.some((o, i) => o.id !== prior.working.options[i]?.id)
          )
            throw new StoryError(422, "invalid", {
              options: "Conserva los identificadores de opción.",
            });
          this.references(draft, s.id, false);
          const changed = JSON.stringify(s.working) !== JSON.stringify(draft);
          s.working = draft;
          s.pendingChanges =
            !!s.published &&
            JSON.stringify(s.published) !== JSON.stringify(draft);
          if (prior && !changed) return s;
        }
        if (kind === "publish") {
          const d = validateDraft(s.working, true);
          this.references(d, s.id, true);
          s.published = structuredClone(d);
          s.pendingChanges = false;
          s.publishedAt = now;
        }
        if (kind === "activate") {
          if (b.active) {
            if (!s.published) throw new StoryError(422, "not_published");
            this.references(validateDraft(s.published, true), s.id, true);
          }
          s.active = b.active as boolean;
        }
        s.revision++;
        s.updatedAt = now;
        return s;
      },
    );
  }
  catalog(): PublicCatalog {
    return this.repository.admin.transaction(() => ({
      schemaVersion: 1,
      stories: this.repository
        .all()
        .filter((s) => s.published && s.active)
        .map((s) => {
          const d = s.published!,
            img = this.repository.resource(d.imageResourceId!),
            audio = this.repository.resource(d.audioResourceId!);
          if (img.state !== "ready" || audio.state !== "ready")
            throw new StoryError(503, "media_unavailable");
          return {
            id: s.id,
            title: d.title,
            category: d.category,
            description: d.description,
            image: {
              src: "/media/public/" + img.id,
              alt: d.imageAlt,
              width: img.width!,
              height: img.height!,
            },
            audio: { src: "/media/public/" + audio.id, type: audio.mime },
            transcript: d.transcript,
            question: d.question,
            options: d.options,
          };
        }),
    }));
  }
}
