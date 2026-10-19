import { api, channel, enableToggle, fieldError } from "./admin-client";
import { validateEmail, validateLoginPassword } from "../lib/admin-validation";
const form = document.querySelector<HTMLFormElement>("[data-admin-login]");
if (form) {
  const submit = form.querySelector<HTMLButtonElement>("[type=submit]")!,
    feedback = form.querySelector<HTMLElement>("[data-feedback]")!;
  let generation = 0,
    pending = false;
  submit.disabled = false;
  enableToggle(form);
  const bc = channel();
  const invalidate = () => {
    generation++;
    pending = false;
    submit.disabled = false;
  };
  window.addEventListener("pagehide", invalidate);
  window.addEventListener("pageshow", invalidate);
  const confirmed = () => {
    bc?.postMessage("changed");
    window.location.assign("/admin");
  };
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (pending) return;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement,
      password = form.elements.namedItem("password") as HTMLInputElement;
    const email = validateEmail(emailInput.value),
      validPassword = validateLoginPassword(password.value);
    fieldError(form, "email", email ? "" : "Escribe un correo válido.");
    fieldError(
      form,
      "password",
      validPassword ? "" : "Escribe tu contraseña (máximo 128 caracteres).",
    );
    if (!email || !validPassword) {
      (!email ? emailInput : password).focus();
      return;
    }
    pending = true;
    submit.disabled = true;
    feedback.textContent = "Comprobando acceso…";
    const g = ++generation;
    try {
      const ctx = await api("contexto");
      if (g !== generation) return;
      if (!ctx.ok) throw Error();
      const result = await api(
        "acceso",
        { email: email.email, password: password.value },
        ctx.value.csrfToken,
      );
      if (g !== generation) return;
      if (result.ok && result.value.result === "authenticated") {
        password.value = "";
        confirmed();
        return;
      }
      feedback.textContent =
        result.status === 401
          ? "No pudimos iniciar sesión con esos datos."
          : result.status === 429
            ? "Demasiados intentos. Espera antes de volver a intentarlo."
            : "No pudimos iniciar sesión. Inténtalo más tarde.";
    } catch {
      if (g !== generation) return;
      try {
        const current = await api("sesion");
        if (g !== generation) return;
        if (
          current.ok &&
          validateEmail(current.value.account?.email)?.emailKey ===
            email.emailKey
        ) {
          password.value = "";
          confirmed();
          return;
        }
      } catch {}
      if (g === generation)
        feedback.textContent =
          "No pudimos confirmar el acceso. Puedes comprobarlo iniciando un nuevo intento.";
    } finally {
      if (g === generation) {
        pending = false;
        submit.disabled = false;
      }
    }
  });
}
