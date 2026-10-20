export const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export type ReplyState =
  "queued" | "dispatching" | "unknown" | "rejected" | "accepted" | "canceled";
export type ConsultationStatus = "Pendiente" | "Respondido";
export class InboxError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string) {
    super(code);
    this.status = status;
    this.code = code;
  }
}
export interface ReplyInput {
  operationId: string;
  expectedRevision: number;
  reviewedRevision: number;
  text: string;
  retryOf: string | null;
}
export interface Consultation {
  id: string;
  nameOrAlias: string;
  email: string;
  message: string;
  receivedAt: string;
  lastActivityAt: string;
  status: ConsultationStatus;
  revision: number;
  lifecycle: "active" | "deleting";
}
export interface ReplyOperation {
  operationId: string;
  consultationId: string;
  actorAccountId: string;
  sessionDigest: string;
  expectedRevision: number;
  reviewedRevision: number;
  retryOf: string | null;
  payloadHash: string;
  deliveryId: string;
  envelope: string | null;
  state: ReplyState;
  createdAt: number;
  updatedAt: number;
  leaseOwner: string | null;
  leaseGeneration: number;
  leaseUntil: number | null;
  nextLookupAt: number;
  dispatchStartedAt: number | null;
  providerKeyExpiry: number | null;
  acceptedAt: number | null;
  proof: string | null;
  rejectionCode: string | null;
  lookupAttempts: number;
}
