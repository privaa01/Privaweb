import { observeAdminAccess, inboxRequest } from "./admin-session";
import { replyText } from "../lib/inbox-validation";
const root = document.querySelector<HTMLElement>("[data-inbox]");
if (root) {
  const find = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const list = find("[data-inbox-list]"),
    detail = find("[data-inbox-detail]"),
    data = find("[data-detail-data]"),
    history = find("[data-history]"),
    summary = find("[data-inbox-summary]"),
    feedback = find("[data-inbox-feedback]"),
    error = find("[data-reply-error]"),
    title = find("[data-detail-title]"),
    text = find<HTMLTextAreaElement>("textarea"),
    reviewed = find<HTMLInputElement>("[data-reviewed]"),
    send = find<HTMLButtonElement>("[data-send]"),
    check = find<HTMLButtonElement>("[data-check]"),
    more = find<HTMLButtonElement>("[data-more]"),
    historyMore = find<HTMLButtonElement>("[data-history-more]");
  let access = false,
    generation = 0,
    status = "Pendiente",
    selected = "",
    revision = 0,
    cursor: string | null = null,
    historyCursor: string | null = null,
    operation: any = null,
    timer: ReturnType<typeof setTimeout> | undefined,
    posting = false,
    preserveDraft = false,
    retryOf: string | null = null,
    unknownStarted = 0;
  const say = (s: string) => {
    feedback.textContent = s;
  };
  const element = (tag: string, value: string) => {
    const n = document.createElement(tag);
    n.textContent = value;
    return n;
  };
  function controls() {
    find("[data-reply-count]").textContent =
      `${[...text.value].length} / 5000 caracteres`;
    send.disabled = !access || posting || !!operation || !reviewed.checked;
    text.readOnly = posting || !!operation;
    check.hidden = !operation;
  }
  function dirty() {
    return !!text.value.trim() && !operation;
  }
  function discard() {
    return (
      !dirty() ||
      window.confirm("Hay una respuesta sin enviar. ¿Quieres descartarla?")
    );
  }
  function clear() {
    generation++;
    clearTimeout(timer);
    selected = "";
    operation = null;
    preserveDraft = false;
    retryOf = null;
    posting = false;
    revision = 0;
    text.value = "";
    error.textContent = "";
    reviewed.checked = false;
    list.replaceChildren();
    history.replaceChildren();
    data.replaceChildren();
    detail.hidden = true;
    more.hidden = true;
    historyMore.hidden = true;
    summary.textContent = "Acceso no disponible.";
    say("");
    controls();
  }
  async function request(path: string, method = "GET", body?: unknown) {
    const r = await inboxRequest(path, method, body);
    if (!r.ok) {
      const e = new Error(r.value.code ?? "unavailable") as Error & {
        status: number;
      };
      e.status = r.status;
      throw e;
    }
    return r.value;
  }
  function count(s: any) {
    summary.textContent = `Consultas: ${s.total} · Pendiente: ${s.pending} · Respondido: ${s.responded}`;
  }
  async function load(append = false) {
    const g = ++generation;
    clearTimeout(timer);
    if (!append) {
      list.replaceChildren();
      cursor = null;
    }
    say("Cargando consultas…");
    try {
      const v = await request("/listado", "POST", {
        status,
        cursor,
        limit: 25,
      });
      if (!access || g !== generation) return;
      count(v.summary);
      for (const c of v.items) {
        const article = element("article", "");
        article.dataset.consultation = c.id;
        const button = element(
          "button",
          `${c.nameOrAlias} · ${c.email} · ${c.status}`,
        ) as HTMLButtonElement;
        button.type = "button";
        button.onclick = () => {
          if (discard()) void open(c.id);
        };
        article.append(button, element("p", c.messagePreview));
        list.append(article);
      }
      cursor = v.nextCursor;
      more.hidden = !cursor;
      say(
        list.childElementCount
          ? "Consultas actualizadas."
          : "No hay consultas en este filtro.",
      );
    } catch {
      if (access && g === generation) {
        summary.textContent = "Resumen no disponible.";
        say(
          "No pudimos cargar las consultas. Usa Actualizar bandeja para reintentar.",
        );
      }
    }
  }
  function addReplies(replies: any[]) {
    for (const r of replies) {
      const a = element("article", "");
      a.append(
        element("p", new Date(r.acceptedAt).toLocaleString("es")),
        element("p", r.text),
      );
      history.append(a);
    }
  }
  function renderOperation(o: any) {
    operation = o;
    reviewed.checked = false;
    if (o?.text && !preserveDraft) text.value = o.text;
    controls();
  }
  async function open(id: string, preserve = false) {
    const g = ++generation;
    clearTimeout(timer);
    selected = id;
    posting = false;
    detail.hidden = true;
    reviewed.checked = false;
    preserveDraft = preserve && Boolean(text.value.trim());
    if (!preserve) {
      text.value = "";
      retryOf = null;
    }
    error.textContent = "";
    say("Cargando consulta…");
    try {
      const v = await request("/consultas/" + id);
      if (!access || g !== generation || selected !== id) return;
      revision = v.consultation.revision;
      title.textContent = "Consulta de " + v.consultation.nameOrAlias;
      data.replaceChildren(
        element("p", "Destinatario: " + v.consultation.email),
        element("p", v.consultation.message),
        element("p", "Estado: " + v.consultation.status),
      );
      history.replaceChildren();
      addReplies(v.replies);
      if (!v.replies.length)
        history.append(element("p", "Sin respuestas aceptadas."));
      historyCursor = v.nextRepliesCursor;
      historyMore.hidden = !historyCursor;
      detail.hidden = false;
      renderOperation(v.currentOperation);
      say(
        v.currentOperation
          ? "Hay un envío pendiente de confirmar."
          : "Consulta actualizada.",
      );
      title.focus();
      if (operation) {
        unknownStarted = Date.now();
        schedule();
      }
    } catch {
      if (access && g === generation) {
        say(
          "No pudimos abrir la consulta. Actualiza la bandeja y vuelve a intentarlo.",
        );
        detail.hidden = true;
      }
    }
  }
  function schedule() {
    clearTimeout(timer);
    if (
      access &&
      operation &&
      !document.hidden &&
      Date.now() - unknownStarted < 30000
    )
      timer = setTimeout(() => void poll(), 2000);
  }
  async function poll(retryMissing = false) {
    if (!operation || !selected) return;
    const g = generation,
      id = operation.operationId;
    try {
      const v = await request("/operaciones/" + id);
      if (!access || g !== generation || operation?.operationId !== id) return;
      revision = v.revision;
      if (v.state === "accepted") {
        operation = null;
        const keepDraft = preserveDraft;
        if (!keepDraft) text.value = "";
        if (status === "Pendiente")
          for (const row of list.querySelectorAll<HTMLElement>(
            "[data-consultation]",
          ))
            if (row.dataset.consultation === selected) row.remove();
        check.hidden = true;
        await open(selected, keepDraft);
        if (access) {
          say(
            keepDraft
              ? "La respuesta pendiente se confirmó. Tu borrador sigue sin enviar; revisa el historial."
              : "Respuesta aceptada por el servicio y guardada. La entrega y lectura no están confirmadas.",
          );
          try {
            const g2 = generation,
              s = await request("/resumen");
            if (access && g2 === generation) count(s.summary);
          } catch {
            summary.textContent = "Resumen no disponible.";
          }
        }
        return;
      }
      if (v.state === "rejected" || v.state === "canceled") {
        retryOf = v.state === "rejected" ? id : null;
        operation = null;
        if (!preserveDraft) text.value = v.text ?? text.value;
        reviewed.checked = false;
        controls();
        say(
          v.state === "rejected"
            ? "El servicio rechazó el envío. El texto se conserva; revisa el historial antes de reintentar."
            : "El envío no se inició. Revisa el historial antes de volver a enviar.",
        );
        return;
      }
      operation = { ...operation, ...v };
      say(
        Date.now() - unknownStarted >= 30000
          ? "Resultado todavía desconocido. Usa Comprobar resultado; no vuelvas a enviar."
          : "Envío en curso o pendiente de confirmación…",
      );
      schedule();
    } catch (error) {
      if (access && g === generation) {
        if (
          retryMissing &&
          (error as Error & { status: number }).status === 404 &&
          operation?.intent
        ) {
          // Replay the same durable registration, never a new mail intention or delivery key.
          try {
            const v = await request(
              "/consultas/" + selected + "/respuestas",
              "POST",
              operation.intent,
            );
            if (!access || g !== generation) return;
            revision = v.revision;
            unknownStarted = Date.now();
            say("Comprobando la misma respuesta registrada…");
            schedule();
            return;
          } catch {
            if (!access || g !== generation) return;
          }
        }
        say(
          "No pudimos comprobar el envío. El resultado es desconocido; no vuelvas a enviar.",
        );
        controls();
        schedule();
      }
    }
  }
  find<HTMLFormElement>("[data-reply-form]").onsubmit = async (e) => {
    e.preventDefault();
    if (!access || posting || operation) return;
    if (!reviewed.checked) {
      error.textContent =
        "Revisa la consulta y su historial actual antes de enviar.";
      reviewed.focus();
      return;
    }
    let value: string;
    try {
      value = replyText(text.value);
    } catch {
      error.textContent = "Escribe entre 1 y 5000 caracteres válidos.";
      text.setAttribute("aria-invalid", "true");
      text.focus();
      return;
    }
    text.removeAttribute("aria-invalid");
    error.textContent = "";
    const g = generation,
      id = selected;
    preserveDraft = false;
    const intent = {
      operationId: crypto.randomUUID(),
      expectedRevision: revision,
      reviewedRevision: revision,
      text: value,
      retryOf,
    };
    operation = { operationId: intent.operationId, text: value, intent };
    posting = true;
    controls();
    say("Registrando respuesta…");
    try {
      const v = await request(
        "/consultas/" + id + "/respuestas",
        "POST",
        intent,
      );
      if (!access || g !== generation) return;
      revision = v.revision;
      unknownStarted = Date.now();
      say("Respuesta registrada. Esperando confirmación del servicio…");
      schedule();
    } catch (e) {
      if (!access || g !== generation) return;
      const code = (e as Error).message;
      if (["revision_conflict", "unresolved_operation"].includes(code)) {
        operation = null;
        await open(id, true);
        say(
          "La consulta cambió. Revisa el historial actualizado antes de enviar.",
        );
      } else if (
        ["validation", "rate", "invalid", "operation_conflict"].includes(code)
      ) {
        operation = null;
        say(
          "No se registró esta respuesta. Revisa el texto y vuelve a intentarlo cuando corresponda.",
        );
      } else {
        unknownStarted = Date.now();
        say(
          "No pudimos confirmar el registro. Usa Comprobar resultado; no vuelvas a enviar.",
        );
        schedule();
      }
    } finally {
      if (g === generation && access) {
        posting = false;
        controls();
      }
    }
  };
  text.oninput = controls;
  reviewed.onchange = controls;
  check.onclick = () => {
    unknownStarted = Date.now();
    void poll(true);
  };
  more.onclick = () => {
    if (discard()) void load(true);
  };
  historyMore.onclick = async () => {
    const g = generation,
      id = selected;
    try {
      const v = await request("/consultas/" + id + "/historial", "POST", {
        cursor: historyCursor,
        limit: 25,
      });
      if (!access || g !== generation) return;
      addReplies(v.replies);
      historyCursor = v.nextCursor;
      historyMore.hidden = !historyCursor;
    } catch {
      if (access && g === generation) {
        reviewed.checked = false;
        controls();
        say(
          "El historial cambió o no está disponible. Vuelve a abrir la consulta.",
        );
      }
    }
  };
  root.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach(
    (b) =>
      (b.onclick = () => {
        if (!discard()) return;
        status = b.dataset.filter!;
        selected = "";
        operation = null;
        text.value = "";
        detail.hidden = true;
        root
          .querySelectorAll("[data-filter]")
          .forEach((n) => n.setAttribute("aria-pressed", String(n === b)));
        void load();
      }),
  );
  find("[data-refresh]").onclick = () => {
    if (discard()) {
      selected = "";
      operation = null;
      text.value = "";
      detail.hidden = true;
      void load();
    }
  };
  window.addEventListener("beforeunload", (e) => {
    if (dirty()) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
  observeAdminAccess((a) => {
    access = a;
    if (!a) clear();
    else void load();
  });
}
