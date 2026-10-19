import { observeAdminAccess, storyRequest } from "./admin-session";
import {
  emptyDraft,
  type StoryDraft,
  type ManagedStory,
  type StoryReceipt,
} from "../lib/story-management-contract";
import { validateDraft } from "../lib/story-management-validation";
const root = document.querySelector<HTMLElement>("[data-story-manager]");
if (root) {
  const el = <T extends HTMLElement = HTMLElement>(selector: string) =>
    root.querySelector<T>(selector)!;
  const form = el<HTMLFormElement>("[data-story-form]"),
    status = el("[data-management-status]"),
    editor = el("[data-editor]"),
    rows = el("[data-story-rows]");
  const checkButton = el<HTMLButtonElement>("[data-check-operation]"),
    retryButton = el<HTMLButtonElement>("[data-retry-operation]");
  let authorized = false,
    generation = 0,
    selected: ManagedStory | null = null,
    dirty = false,
    busy = false,
    stories: any[] = [],
    urls: string[] = [];
  type Pending = {
    path: string;
    method: string;
    body: unknown;
    id: string;
    resourceKind?: "image" | "audio";
    generation: number;
  };
  let pending: Pending | null = null;
  const field = (name: string) =>
    form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
  function message(text: string) {
    status.textContent = text;
  }
  function clearErrors() {
    root!
      .querySelectorAll<HTMLElement>("[data-story-error]")
      .forEach((n) => (n.textContent = ""));
    form
      .querySelectorAll("[aria-invalid]")
      .forEach((n) => n.removeAttribute("aria-invalid"));
  }
  function errors(value: Record<string, string>) {
    clearErrors();
    for (const [key, text] of Object.entries(value)) {
      root!.querySelectorAll<HTMLElement>("[data-story-error]").forEach((n) => {
        if (n.dataset.storyError === key) {
          n.textContent = text;
          const name = key.startsWith("options.")
            ? (key.endsWith("label") ? "option-" : "explanation-") +
              key.split(".")[1]
            : key;
          field(name)?.setAttribute("aria-invalid", "true");
        }
      });
    }
    form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
  }
  function lock() {
    form
      .querySelectorAll<
        HTMLInputElement | HTMLButtonElement | HTMLTextAreaElement
      >("input,button,textarea")
      .forEach((n) => (n.disabled = busy || !!pending));
    el<HTMLButtonElement>("[data-add-story]").disabled = busy || !!pending;
    checkButton.hidden = !pending;
    retryButton.hidden = !pending;
    const abandon = el<HTMLButtonElement>("[data-abandon-upload]");
    abandon.hidden = !pending?.resourceKind;
    abandon.disabled = busy;
  }
  function cleanup() {
    for (const u of urls) URL.revokeObjectURL(u);
    urls = [];
    root!.querySelectorAll("[data-preview]").forEach((n) => n.remove());
  }
  function show(s: ManagedStory | null) {
    selected = s;
    const d = s?.working ?? emptyDraft();
    form.reset();
    clearErrors();
    cleanup();
    for (const k of [
      "title",
      "category",
      "description",
      "imageAlt",
      "transcript",
      "question",
    ] as const)
      field(k).value = d[k];
    d.options.forEach((o, i) => {
      field("option-" + i).value = o.label;
      field("explanation-" + i).value = o.explanation;
    });
    for (const kind of ["image", "audio"] as const)
      el(`[data-file-status="${kind}"]`).textContent = d[
        kind === "image" ? "imageResourceId" : "audioResourceId"
      ]
        ? "Recurso guardado."
        : "Sin recurso seleccionado.";
    editor.hidden = false;
    el("[data-editor-state]").textContent = s
      ? `${s.published ? "Publicada" : "Borrador"} · ${s.active ? "Activa" : "Inactiva"}${s.pendingChanges ? " · Cambios sin publicar" : ""}`
      : "Borrador nuevo, todavía sin guardar";
    dirty = false;
    lock();
  }
  function read(): StoryDraft {
    const d = structuredClone(selected?.working ?? emptyDraft());
    for (const k of [
      "title",
      "category",
      "description",
      "imageAlt",
      "transcript",
      "question",
    ] as const)
      d[k] = field(k).value;
    d.options = d.options.map((o, i) => ({
      ...o,
      label: field("option-" + i).value,
      explanation: field("explanation-" + i).value,
    }));
    return validateDraft(d);
  }
  function mayLeave() {
    return (
      !pending &&
      (!dirty ||
        window.confirm(
          "Hay cambios sin guardar. ¿Quieres salir del editor y descartarlos?",
        ))
    );
  }
  function render() {
    const query = el<HTMLInputElement>("[data-story-search]")
        .value.trim()
        .normalize("NFKC")
        .toLocaleLowerCase("es"),
      filter = el<HTMLSelectElement>("[data-story-filter]").value;
    const filtered = stories.filter(
      (s) =>
        (s.title ?? "")
          .normalize("NFKC")
          .toLocaleLowerCase("es")
          .includes(query) &&
        (filter === "all" ||
          (filter === "active"
            ? s.active && s.publicationState === "Publicada"
            : !(s.active && s.publicationState === "Publicada"))),
    );
    rows.replaceChildren();
    if (!filtered.length) {
      const tr = document.createElement("tr"),
        td = document.createElement("td");
      td.colSpan = 6;
      td.textContent = stories.length
        ? "No hay historias que coincidan con la búsqueda."
        : "Todavía no hay historias guardadas. Agrega una historia.";
      tr.append(td);
      rows.append(tr);
      return;
    }
    for (const s of filtered) {
      const tr = document.createElement("tr");
      const values = [
        s.title || "Sin título guardado",
        s.category || "Sin categoría",
        s.durationSeconds
          ? `${Math.floor(s.durationSeconds / 60)}:${String(Math.floor(s.durationSeconds % 60)).padStart(2, "0")}`
          : "No disponible",
        s.publicationState +
          (s.pendingChanges ? " · Cambios sin publicar" : ""),
        s.active && s.publicationState === "Publicada" ? "Activa" : "Inactiva",
      ];
      values.forEach((value, i) => {
        const td = document.createElement("td");
        td.dataset.label = [
          "Historia",
          "Categoría",
          "Duración",
          "Publicación",
          "Estado",
        ][i];
        td.textContent = value;
        tr.append(td);
      });
      const actions = document.createElement("td");
      actions.dataset.label = "Acciones";
      const edit = document.createElement("button");
      edit.type = "button";
      edit.textContent = "Editar";
      edit.setAttribute(
        "aria-label",
        "Editar " + (s.title || "historia sin título"),
      );
      edit.addEventListener("click", () => {
        if (mayLeave()) void open(s.id);
      });
      actions.append(edit);
      if (s.publicationState === "Publicada") {
        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.textContent = s.active ? "Desactivar" : "Activar";
        toggle.setAttribute(
          "aria-label",
          toggle.textContent + " " + (s.title || "historia sin título"),
        );
        toggle.addEventListener("click", () => {
          if (pending || busy) return;
          void mutate({
            path: `/${s.id}/activacion`,
            method: "POST",
            body: {
              operationId: crypto.randomUUID(),
              expectedRevision: s.revision,
              active: !s.active,
            },
            id: s.id,
            generation,
          });
        });
        actions.append(toggle);
      }
      tr.append(actions);
      rows.append(tr);
    }
  }
  async function refresh() {
    const g = generation;
    rows.replaceChildren();
    message("Cargando historias…");
    root!
      .querySelectorAll("[data-count]")
      .forEach((n) => (n.textContent = "No disponible"));
    try {
      const r = await storyRequest("");
      if (!authorized || g !== generation) return;
      if (!r.ok) throw Error();
      stories = r.value.stories;
      const summary = r.value.summary;
      el('[data-count="active"]').textContent = String(summary.active);
      el('[data-count="drafts"]').textContent = String(summary.drafts);
      el('[data-count="contact"]').textContent =
        summary.contact.state === "available"
          ? String(summary.contact.total)
          : "No disponible";
      render();
      message("Historias comprobadas.");
    } catch {
      if (authorized && g === generation) {
        stories = [];
        message("No pudimos cargar las historias. Vuelve a actualizar.");
      }
    }
  }
  async function open(id: string) {
    const g = ++generation;
    busy = true;
    lock();
    try {
      const r = await storyRequest("/" + id);
      if (g !== generation || !authorized) return;
      if (!r.ok) throw Error();
      show(r.value);
      field("title").focus();
    } catch {
      if (g === generation && authorized)
        message("No pudimos abrir la historia.");
    } finally {
      if (g === generation) {
        busy = false;
        lock();
      }
    }
  }
  async function confirm(p: Pending, value: StoryReceipt | { id: string }) {
    pending = null;
    busy = false;
    lock();
    if (p.resourceKind) {
      if (selected?.id === p.id) {
        selected.working[
          p.resourceKind === "image" ? "imageResourceId" : "audioResourceId"
        ] = (value as { id: string }).id;
        dirty = true;
        el(`[data-file-status="${p.resourceKind}"]`).textContent =
          "Archivo disponible. Guarda el borrador para asociarlo.";
      }
      message("Archivo comprobado; todavía no publicado.");
      return;
    }
    const receipt = value as StoryReceipt;
    const preserve = dirty && selected?.id === receipt.storyId;
    if (!preserve && (!editor.hidden || !selected)) await open(receipt.storyId);
    await refresh();
    if (!authorized) return;
    message(
      p.method === "PUT" &&
        !p.resourceKind &&
        receipt.publicationState === "Publicada"
        ? "Cambios guardados en borrador. La publicación anterior sigue vigente."
        : receipt.publicationState === "Publicada"
          ? `Publicación comprobada · ${receipt.active ? "Activa" : "Inactiva"}. Usa Ver historias en la web para comprobar el catálogo.`
          : "Borrador guardado.",
    );
  }
  async function mutate(p: Pending) {
    if (busy || (pending && pending !== p)) return;
    pending = p;
    busy = true;
    lock();
    clearErrors();
    message(
      p.resourceKind
        ? "Subiendo y comprobando archivo…"
        : "Comprobando operación…",
    );
    try {
      const r = await storyRequest(p.path, p.method, p.body, p.resourceKind);
      if (!authorized || p.generation !== generation) return;
      if (r.ok) {
        if (!p.resourceKind) dirty = false;
        await confirm(p, r.value);
        return;
      }
      if (r.status >= 500) {
        message(
          "No se pudo confirmar el resultado. Comprueba la operación antes de reintentar.",
        );
        return;
      }
      if (r.status === 429) {
        message(
          "Hay demasiadas solicitudes. Espera y reintenta la misma operación.",
        );
        return;
      }
      pending = null;
      lock();
      if (r.status === 409)
        message(
          "Hay cambios más recientes o una operación en conflicto. Conservamos tu texto; abre de nuevo la historia para revisar el estado confirmado.",
        );
      else if (r.status === 422) {
        errors(r.value.errors ?? {});
        message(
          "Revisa los campos indicados. Tu contenido sigue en el editor.",
        );
      } else
        message(
          "La operación fue rechazada. Tu contenido sigue en el editor mientras conserves acceso.",
        );
    } catch {
      if (authorized && p.generation === generation)
        message(
          "Resultado desconocido. Comprueba antes de reintentar; no cierres el editor.",
        );
    } finally {
      if (authorized && p.generation === generation) {
        busy = false;
        lock();
      }
    }
  }
  form.addEventListener("input", () => {
    dirty = true;
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (busy || pending) return;
    let d;
    try {
      d = read();
    } catch (e) {
      errors((e as { errors: Record<string, string> }).errors);
      message("Revisa los campos.");
      return;
    }
    void mutate({
      path: selected ? "/" + selected.id : "",
      method: selected ? "PUT" : "POST",
      body: {
        operationId: crypto.randomUUID(),
        ...(selected ? { expectedRevision: selected.revision } : {}),
        working: d,
      },
      id: selected?.id ?? "",
      generation,
    });
  });
  el("[data-publish]").addEventListener("click", () => {
    if (!selected || dirty) {
      message("Guarda primero los cambios del borrador antes de publicar.");
      return;
    }
    void mutate({
      path: `/${selected.id}/publicar`,
      method: "POST",
      body: {
        operationId: crypto.randomUUID(),
        expectedRevision: selected.revision,
      },
      id: selected.id,
      generation,
    });
  });
  el("[data-add-story]").addEventListener("click", () => {
    if (mayLeave()) {
      generation++;
      show(null);
      field("title").focus();
    }
  });
  el("[data-close-editor]").addEventListener("click", () => {
    if (mayLeave()) {
      generation++;
      show(null);
      editor.hidden = true;
    }
  });
  el("[data-stories-retry]").addEventListener("click", () => {
    if (!busy) void refresh();
  });
  el("[data-story-search]").addEventListener("input", render);
  el("[data-story-filter]").addEventListener("change", render);
  el("[data-abandon-upload]").addEventListener("click", () => {
    if (busy || !pending?.resourceKind) return;
    const input = form.querySelector<HTMLInputElement>(
      `[data-upload="${pending.resourceKind}"]`,
    );
    if (input) input.value = "";
    pending = null;
    cleanup();
    lock();
    message(
      "Se conserva el texto. Puedes elegir otro archivo; la carga anterior no se ha asociado al borrador.",
    );
  });
  retryButton.addEventListener("click", () => {
    if (pending && !busy) void mutate(pending);
  });
  checkButton.addEventListener("click", async () => {
    if (!pending || busy) return;
    const p = pending;
    busy = true;
    lock();
    try {
      const operationId = (p.body as { operationId: string }).operationId;
      const resourceId = p.path.split("/").pop()!;
      const r = await storyRequest(
        p.resourceKind
          ? "/recursos/" + resourceId
          : "/operaciones/" + operationId,
        p.resourceKind ? "HEAD" : "GET",
      );
      if (!authorized || p.generation !== generation) return;
      if (r.ok) {
        dirty = false;
        await confirm(p, p.resourceKind ? { id: resourceId } : r.value);
      } else
        message(
          "Aún no hay confirmación. Espera o reintenta explícitamente la misma operación.",
        );
    } catch {
      if (authorized)
        message(
          "No pudimos comprobar el resultado. Conservamos el intento pendiente.",
        );
    } finally {
      if (authorized) {
        busy = false;
        lock();
      }
    }
  });
  form.querySelectorAll<HTMLInputElement>("[data-upload]").forEach((input) =>
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (!file) return;
      if (!selected) {
        message("Guarda primero el borrador para cargar archivos.");
        input.value = "";
        return;
      }
      const kind = input.dataset.upload as "image" | "audio";
      const allowed =
        kind === "image"
          ? ["image/png", "image/jpeg", "image/webp"]
          : ["audio/mpeg", "audio/wav"];
      if (
        !allowed.includes(file.type) ||
        file.size > (kind === "image" ? 8 : 50) * 1048576 ||
        !file.size
      ) {
        message(
          "Revisa el formato y tamaño del archivo. Tu texto se conserva.",
        );
        input.value = "";
        return;
      }
      cleanup();
      const url = URL.createObjectURL(file);
      urls.push(url);
      const preview = document.createElement(
        kind === "image" ? "img" : "audio",
      );
      preview.dataset.preview = "";
      preview.src = url;
      if (preview instanceof HTMLImageElement) {
        preview.alt = "Vista previa local, pendiente de validación";
        preview.width = 160;
      } else {
        preview.controls = true;
        preview.preload = "metadata";
        preview.setAttribute(
          "aria-label",
          "Vista previa local del audio, pendiente de validación",
        );
      }
      input.after(preview);
      const uuid = crypto.randomUUID();
      void mutate({
        path: `/${selected.id}/recursos/${uuid}`,
        method: "PUT",
        body: file,
        id: selected.id,
        resourceKind: kind,
        generation,
      });
    }),
  );
  window.addEventListener("beforeunload", (e) => {
    if (dirty || pending) {
      e.preventDefault();
    }
  });
  observeAdminAccess((value) => {
    authorized = value;
    if (!value) {
      generation++;
      selected = null;
      pending = null;
      dirty = false;
      busy = false;
      stories = [];
      rows.replaceChildren();
      form.reset();
      editor.hidden = true;
      cleanup();
      root!
        .querySelectorAll("[data-count]")
        .forEach((n) => (n.textContent = "No disponible"));
      root!
        .querySelectorAll("[data-story-error],[data-file-status]")
        .forEach((n) => (n.textContent = ""));
      status.textContent = "";
      lock();
    } else void refresh();
  });
}
