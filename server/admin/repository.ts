import type { PasswordRecord } from "./password.ts";
export interface AdminAccount {
  id: string;
  email: string;
  emailKey: string;
  authorized: boolean;
  passwordRecord: PasswordRecord | null;
  credentialVersion: number;
  mailboxVerifiedAt: number | null;
  createdAt: number;
  updatedAt: number;
  permission: "administrador";
}
export interface AdminSession {
  tokenDigest: string;
  accountId: string;
  credentialVersion: number;
  createdAt: number;
  absoluteExpiresAt: number;
  lastActivityAt: number;
  idleExpiresAt: number;
  revokedAt: number | null;
}
export interface ResetProof {
  tokenDigest: string;
  accountId: string;
  credentialVersion: number;
  issuedAt: number;
  expiresAt: number;
  consumedAt: number | null;
  invalidatedAt: number | null;
}
export interface RecoveryJob {
  id: string;
  accountId: string | null;
  credentialVersion: number | null;
  kind: "real" | "noop";
  createdAt: number;
  expiresAt: number;
  leaseUntil: number | null;
  attempts: number;
  state: "queued" | "leased" | "accepted" | "failed" | "expired";
  deliveryId: string | null;
  envelope: string | null;
  nextAttemptAt: number;
}
export interface MailAdapter {
  idempotent: boolean;
  send(
    input: {
      deliveryId: string;
      to: string;
      resetURL: string;
    },
    signal: AbortSignal,
  ): Promise<"accepted" | "rejected" | "unknown">;
}
export type Clock = () => number;
