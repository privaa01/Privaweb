import { api, channel } from "./admin-client";
const root = document.querySelector<HTMLElement>("[data-private]");
if (root) {
  const accessTitle = document.querySelector<HTMLElement>(
    "[data-access-title]",
  )!;
  const feedback = document.querySelector<HTMLElement>(
      "[data-session-feedback]",
    )!,
    identity = root.querySelector<HTMLElement>("[data-identity]")!,
    retry = document.querySelector<HTMLButtonElement>("[data-logout-retry]")!;
  const bc = channel();
  let generation = 0,
    blocked = false,
    csrf = "",
    timer: ReturnType<typeof setTimeout> | undefined,
    closing = false;
  function hide() {
    generation++;
    root!.hidden = true;
    accessTitle.hidden = false;
    identity.textContent = "";
    csrf = "";
    clearTimeout(timer);
    root!
      .querySelectorAll("[data-private-data]")
      .forEach((n) => n.replaceChildren());
  }
  async function check() {
    if (blocked) return;
    hide();
    const g = generation;
    feedback.textContent = "Comprobando acceso…";
    try {
      const r = await api("sesion");
      if (g !== generation || blocked) return;
      if (!r.ok || r.value.result !== "authenticated") {
        feedback.textContent = "Inicia sesión para continuar.";
        return;
      }
      identity.textContent = r.value.account.email;
      csrf = r.value.csrfToken;
      root!.hidden = false;
      accessTitle.hidden = true;
      feedback.textContent = "Sesión verificada.";
      const remaining =
        Math.min(r.value.idleExpiresAt, r.value.absoluteExpiresAt) - Date.now();
      timer = setTimeout(
        () => {
          hide();
          feedback.textContent =
            "La sesión requiere nueva verificación. Inicia sesión para continuar.";
        },
        Math.max(0, Math.min(remaining, 2147483647)),
      );
    } catch {
      if (g === generation)
        feedback.textContent =
          "No pudimos verificar la sesión. Inicia sesión o vuelve a comprobar el acceso.";
    }
  }
  async function logout() {
    if (closing) return;
    closing = true;
    blocked = true;
    const prior = csrf;
    hide();
    const g = generation;
    bc?.postMessage("closing");
    feedback.textContent = "Cerrando este acceso…";
    retry.hidden = true;
    try {
      let token = prior;
      if (!token) {
        const ctx = await api("contexto");
        if (g !== generation) return;
        if (ctx.ok) token = ctx.value.csrfToken;
      }
      const r = await api("salir", {}, token);
      if (g !== generation) return;
      if (!r.ok || r.value.result !== "signed_out") throw Error();
      feedback.textContent = "Este acceso se ha cerrado.";
      retry.hidden = true;
      bc?.postMessage("closed");
    } catch {
      if (g === generation) {
        feedback.textContent =
          "No pudimos confirmar el cierre. El contenido permanece oculto; reintenta para verificar y cerrar.";
        retry.hidden = false;
      }
    } finally {
      closing = false;
    }
  }
  root
    .querySelector("[data-logout]")
    ?.addEventListener("click", () => void logout());
  retry.addEventListener("click", () => void logout());
  window.addEventListener("pagehide", hide);
  window.addEventListener("pageshow", () => {
    if (blocked) {
      feedback.textContent =
        "El contenido permanece oculto. Verifica o reintenta el cierre de este acceso.";
      retry.hidden = false;
    } else void check();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hide();
    else if (blocked) {
      feedback.textContent =
        "El contenido permanece oculto. Verifica o reintenta el cierre de este acceso.";
      retry.hidden = false;
    } else void check();
  });
  if (bc)
    bc.onmessage = (e) => {
      hide();
      if (e.data === "closing" || e.data === "closed") {
        blocked = true;
        feedback.textContent =
          "Este acceso requiere comprobar o completar el cierre.";
        retry.hidden = false;
      } else if (e.data === "changed") {
        blocked = false;
        void check();
      }
    };
  void check();
}
