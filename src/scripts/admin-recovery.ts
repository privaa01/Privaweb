import { api, fieldError } from "./admin-client";
import { validateEmail } from "../lib/admin-validation";
import { recoveryNotice } from "../lib/admin-contract";
const form = document.querySelector<HTMLFormElement>("[data-admin-recovery]");
if (form) {
  const button = form.querySelector<HTMLButtonElement>("[type=submit]")!,
    feedback = form.querySelector<HTMLElement>("[data-feedback]")!;
  let pending = false,
    generation = 0;
  button.disabled = false;
  window.addEventListener("pagehide", () => {
    generation++;
    pending = false;
    button.disabled = false;
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (pending) return;
    const input = form.elements.namedItem("email") as HTMLInputElement;
    const email = validateEmail(input.value);
    fieldError(form, "email", email ? "" : "Escribe un correo válido.");
    if (!email) {
      input.focus();
      return;
    }
    pending = true;
    button.disabled = true;
    const g = ++generation;
    feedback.textContent = "Procesando solicitud…";
    try {
      const ctx = await api("contexto");
      if (g !== generation) return;
      if (!ctx.ok) throw Error();
      const result = await api(
        "recuperacion",
        { email: email.email },
        ctx.value.csrfToken,
      );
      if (g !== generation) return;
      feedback.textContent = result.ok
        ? recoveryNotice
        : result.status === 429
          ? "Demasiadas solicitudes. Espera antes de intentarlo."
          : "El servicio no está disponible. Inténtalo más tarde.";
    } catch {
      if (g === generation)
        feedback.textContent =
          "No pudimos confirmar la solicitud. Puedes volver a solicitarla; esto no confirma envío ni entrega.";
    } finally {
      if (g === generation) {
        pending = false;
        button.disabled = false;
      }
    }
  });
}
