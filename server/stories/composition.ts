import { join } from "node:path";
import type { SqliteAdminRepository } from "../admin/sqlite-repository.ts";
import { StoriesRepository } from "./sqlite-repository.ts";
import { StoryMedia } from "./media.ts";
import { StoriesService } from "./service.ts";
import { createStoriesHandler } from "./http.ts";
import { contactSummary } from "./contact-summary.ts";
export function composeStories(o: {
  repository: SqliteAdminRepository;
  directory: string;
  origin: string;
  csrfKey: Buffer;
  contactDatabase?: string;
}) {
  const repository = new StoriesRepository(o.repository),
    media = new StoryMedia(repository, join(o.directory, "stories-media")),
    service = new StoriesService(repository, media.verify, () =>
      contactSummary(o.contactDatabase),
    );
  return {
    repository,
    media,
    service,
    handler: createStoriesHandler({
      service,
      media,
      origin: o.origin,
      csrfKey: o.csrfKey,
      log: (v) =>
        console.info(JSON.stringify({ event: "story_operation", ...v })),
    }),
  };
}
