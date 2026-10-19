export async function api(path: string, data?: unknown, csrfToken?: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch("/api/admin/" + path, {
      method: data === undefined ? "GET" : "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        "X-Priva-Request": "1",
        ...(data === undefined
          ? {}
          : {
              "Content-Type": "application/json",
              "X-CSRF-Token": csrfToken ?? "",
            }),
      },
      body: data === undefined ? undefined : JSON.stringify(data),
      signal: controller.signal,
    });
    const value = await response.json();
    return { ok: response.ok, status: response.status, value };
  } finally {
    clearTimeout(timeout);
  }
}
export function channel() {
  return typeof BroadcastChannel === "undefined"
    ? null
    : new BroadcastChannel("priva-admin-invalidation");
}
export function enableToggle(root: HTMLElement) {
  root.querySelectorAll<HTMLButtonElement>("[data-toggle]").forEach((button) =>
    button.addEventListener("click", () => {
      const input = button.parentElement?.querySelector("input");
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.textContent = show ? "Ocultar" : "Mostrar";
      button.setAttribute(
        "aria-label",
        show ? "Ocultar contraseña" : "Mostrar contraseña",
      );
      button.setAttribute("aria-pressed", String(show));
    }),
  );
}
export function fieldError(form: HTMLFormElement, name: string, error: string) {
  const input = form.elements.namedItem(name) as HTMLInputElement | null;
  input?.setAttribute("aria-invalid", error ? "true" : "false");
  const el = form.querySelector<HTMLElement>('[data-error="' + name + '"]');
  if (el) el.textContent = error;
}
