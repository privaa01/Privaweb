export function validateEmail(raw: unknown): {
  email: string;
  emailKey: string;
} | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim();
  if (
    !email ||
    Array.from(email).length > 254 ||
    /[\ud800-\udfff]/u.test(email) ||
    !/^[^\s@<>]+@[^\s@<>.]+(?:\.[^\s@<>.]+)+$/u.test(email) ||
    /[\u0000-\u001f\u007f]/u.test(email)
  )
    return null;
  return { email, emailKey: email.toLowerCase() };
}
export function validateLoginPassword(raw: unknown): raw is string {
  return (
    typeof raw === "string" &&
    !/[\ud800-\udfff]/u.test(raw) &&
    Array.from(raw).length >= 1 &&
    Array.from(raw).length <= 128 &&
    !/[\u0000-\u001f\u007f]/u.test(raw)
  );
}
export function validateNewPassword(
  raw: unknown,
  denied: (p: string) => boolean = () => false,
): raw is string {
  return (
    validateLoginPassword(raw) && Array.from(raw).length >= 15 && !denied(raw)
  );
}
