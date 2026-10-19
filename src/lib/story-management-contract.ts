export interface StoryOption {
  id: string;
  label: string;
  explanation: string;
}
export interface StoryDraft {
  title: string;
  category: string;
  description: string;
  imageResourceId: string | null;
  imageAlt: string;
  audioResourceId: string | null;
  transcript: string;
  question: string;
  options: StoryOption[];
}
export interface ManagedStory {
  id: string;
  revision: number;
  working: StoryDraft;
  published: StoryDraft | null;
  active: boolean;
  pendingChanges: boolean;
  createdAt: number;
  updatedAt: number;
  publishedAt: number | null;
}
export interface StoryReceipt {
  operationId: string;
  storyId: string;
  revision: number;
  result: "confirmed";
  publicationState: "Borrador" | "Publicada";
  active: boolean;
  pendingChanges: boolean;
}
export interface StoryResource {
  id: string;
  storyId: string;
  kind: "image" | "audio";
  storageKey: string;
  sha256: string;
  bytes: number;
  mime: string;
  width: number | null;
  height: number | null;
  durationSeconds: number | null;
  state: "staging" | "ready" | "rejected";
  createdAt: number;
  uploadedBy: string;
}
export class StoryError extends Error {
  status: number;
  result: string;
  errors: Record<string, string>;
  constructor(
    status: number,
    result: string,
    errors: Record<string, string> = {},
  ) {
    super(result);
    this.status = status;
    this.result = result;
    this.errors = errors;
  }
}
export const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export function emptyDraft(): StoryDraft {
  return {
    title: "",
    category: "",
    description: "",
    imageResourceId: null,
    imageAlt: "",
    audioResourceId: null,
    transcript: "",
    question: "",
    options: [1, 2, 3].map((n) => ({
      id: `opcion-${n}`,
      label: "",
      explanation: "",
    })),
  };
}
