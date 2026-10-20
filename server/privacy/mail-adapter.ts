// Separate instance and delivery namespace for confirmation009; no reuse of reply/recovery workers.
export { assertReplyAdapter as assertConfirmationAdapter } from "../inbox/mail-adapter.ts";
export type {
  ReplyMailAdapter as ConfirmationMailAdapter,
  ReplyPayload as ConfirmationPayload,
  MailResult,
} from "../inbox/mail-adapter.ts";
