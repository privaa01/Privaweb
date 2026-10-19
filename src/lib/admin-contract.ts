export type LoginState =
  "editing" | "invalid" | "submitting" | "confirmed" | "rejected" | "unknown";
export type PrivateState = "hidden" | "checking" | "authorized";
export type LogoutState = "hidden" | "pending" | "confirmed" | "unknown";
export type RecoveryState =
  "editing" | "submitting" | "generic-accepted" | "global-error";
export interface AdminContent {
  testOnly: boolean;
  brand: string;
  welcome: string;
  introduction: string;
  recoveryNotice: string;
  passwordPolicy: string;
  revision: string;
}
export interface AdminReadiness {
  testOnly: boolean;
  reviewedContent: AdminContent | null;
  officialBrand: string | null;
  references: Record<string, string | null>;
}
export interface AccountIdentity {
  id: string;
  email: string;
}
export const recoveryNotice =
  "Si corresponde a una cuenta autorizada y el servicio está disponible, recibirás instrucciones. Esta respuesta no confirma envío ni entrega";
export class AdminError extends Error {
  status: number;
  result: string;
  constructor(status: number, result: string) {
    super(result);
    this.status = status;
    this.result = result;
  }
}
