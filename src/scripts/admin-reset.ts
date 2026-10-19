import { api, enableToggle, fieldError, channel } from "./admin-client";
import { validateNewPassword } from "../lib/admin-validation";
// Capture and remove the fragment before context/API requests. Nothing is persisted.
let proof = new URLSearchParams(location.hash.slice(1)).get("token") ?? "";
history.replaceState(null, "", location.pathname);
const form = document.querySelector<HTMLFormElement>("[data-admin-reset]");
if (form) {
  const button = form.querySelector<HTMLButtonElement>("[type=submit]")!,
    feedback = form.querySelector<HTMLElement>("[data-feedback]")!;
  let pending = false,
    generation = 0;
  window.addEventListener("hashchange", () => {
    generation++;
    pending = false;
    proof = new URLSearchParams(location.hash.slice(1)).get("token") ?? "";
    history.replaceState(null, "", location.pathname);
    button.disabled = !proof;
    (form.elements.namedItem("password") as HTMLInputElement).value = "";
    feedback.textContent = proof
      ? ""
      : "Solicita un nuevo enlace de recuperación.";
  });
  button.disabled = !proof;
  enableToggle(form);
  if (!proof)
    feedback.textContent = "Solicita un nuevo enlace de recuperación.";
  window.addEventListener("pagehide", () => {
    generation++;
    proof = "";
    pending = false;
    button.disabled = true;
    (form.elements.namedItem("password") as HTMLInputElement).value = "";
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (pending || !proof) return;
    const input = form.elements.namedItem("password") as HTMLInputElement;
    const valid = validateNewPassword(input.value);
    fieldError(
      form,
      "password",
      valid
        ? ""
        : "Usa entre 15 y 128 caracteres válidos y evita contraseñas comunes.",
    );
    if (!valid) {
      input.focus();
      return;
    }
    pending = true;
    button.disabled = true;
    const g = ++generation;
    feedback.textContent = "Comprobando y cambiando contraseña…";
    try {
      const ctx = await api("contexto");
      if (g !== generation) return;
      if (!ctx.ok) throw Error();
      const result = await api(
        "restablecer",
        { token: proof, password: input.value },
        ctx.value.csrfToken,
      );
      if (g !== generation) return;
      if (result.ok && result.value.result === "reset") {
        proof = "";
        input.value = "";
        feedback.textContent =
          "Contraseña cambiada. Vuelve al acceso para iniciar sesión.";
        const bc = channel();
        bc?.postMessage("changed");
        bc?.close();
      } else if (result.status === 400) {
        proof = "";
        input.value = "";
        feedback.textContent =
          "El enlace no es válido o ya no está vigente. Solicita un nuevo enlace.";
      } else if (result.status === 422) {
        fieldError(
          form,
          "password",
          "La contraseña no cumple la política o es demasiado común.",
        );
        input.focus();
        feedback.textContent = "Elige otra contraseña.";
      } else throw Error();
    } catch {
      if (g === generation) {
        proof = "";
        input.value = "";
        feedback.textContent =
          "No pudimos confirmar el cambio. Intenta iniciar sesión o solicita un nuevo enlace; no reenviaremos tu contraseña automáticamente.";
      }
    } finally {
      if (g === generation) {
        pending = false;
        button.disabled = !proof;
      }
    }
  });
}
