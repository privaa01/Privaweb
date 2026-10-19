import type { AdminReadiness } from "../lib/admin-contract.ts";
export const adminReadiness: AdminReadiness = {
  testOnly: false,
  reviewedContent: null,
  officialBrand: null,
  references: {
    provision: null,
    mailAdapter: null,
    senderMailbox: null,
    httpsProxy: null,
    storage: null,
    hashCapacity: null,
    abuseTiming: null,
    cookiesCsrf: null,
    privacyRetention: null,
    notices: null,
    manualAccessibility: null,
  },
};
