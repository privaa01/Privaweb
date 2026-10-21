/** Consumer of006 C1/C2/C3, confirmed by server/admin/http.ts and its real SQLite guard.
 * Only entry/session reads needed by G05. Not an inventory of007/008 mutations.
 * Never replace these401/403 responses with404 or a static login fixture.
 */
export const navigationPrivateContract={
 version:'006-2026-10-19',
 source:'specs/006-acceso-administrativo/contracts/admin-access.md',
 deniedDocuments:['/admin','/admin/historias','/admin/contacto'],
 session:'/api/admin/sesion',
 unauthenticated:{status:401,result:'unauthenticated'},
 missingRequestHeader:{status:403,result:'forbidden'},
} as const;
