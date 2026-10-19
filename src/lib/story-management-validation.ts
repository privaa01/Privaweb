import {
  emptyDraft,
  StoryError,
  uuidPattern,
  type StoryDraft,
} from "./story-management-contract.ts";
export const limits = {
  title: 160,
  category: 80,
  description: 3000,
  imageAlt: 500,
  transcript: 20000,
  question: 300,
} as const;
export function validateDraft(raw: unknown, publish = false): StoryDraft {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    throw new StoryError(422, "invalid", { form: "Contenido inválido." });
  const input = raw as Record<string, unknown>,
    d = emptyDraft(),
    errors: Record<string, string> = {};
  if (Object.keys(input).some((k) => !Object.hasOwn(d, k)))
    throw new StoryError(422, "invalid", { form: "Campos no admitidos." });
  const text = (v: unknown, key: string, max: number, multiline = false) => {
    if (v === undefined) v = "";
    if (typeof v !== "string") {
      errors[key] = "Debe ser texto.";
      return "";
    }
    const value = v.trim();
    if (
      [...value].length > max ||
      (multiline ? /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/ : /[\x00-\x1f\x7f]/).test(
        value,
      )
    )
      errors[key] = `Máximo ${max} caracteres, sin controles inválidos.`;
    if (publish && !value) errors[key] = "Completa este campo para publicar.";
    return value;
  };
  for (const [k, max] of Object.entries(limits))
    d[k as keyof typeof limits] = text(
      input[k],
      k,
      max,
      ["description", "transcript"].includes(k),
    );
  for (const k of ["imageResourceId", "audioResourceId"] as const) {
    const v = input[k] ?? null;
    if (v !== null && (typeof v !== "string" || !uuidPattern.test(v)))
      errors[k] = "Recurso inválido.";
    else d[k] = v as string | null;
    if (publish && !v) errors[k] = "Selecciona un recurso válido.";
  }
  const opts = input.options === undefined ? d.options : input.options;
  if (!Array.isArray(opts) || opts.length !== 3)
    errors.options = "Se requieren tres opciones.";
  else {
    const ids = new Set<string>();
    d.options = opts.map((o, i) => {
      if (
        !o ||
        typeof o !== "object" ||
        Array.isArray(o) ||
        Object.keys(o).some((k) => !["id", "label", "explanation"].includes(k))
      ) {
        errors.options = "Opción inválida.";
        return d.options[i];
      }
      const id = o.id;
      if (
        typeof id !== "string" ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) ||
        id.length > 80 ||
        ids.has(id)
      )
        errors.options = "Identificadores de opción inválidos.";
      ids.add(id);
      return {
        id,
        label: text(o.label, `options.${i}.label`, 500),
        explanation: text(
          o.explanation,
          `options.${i}.explanation`,
          3000,
          true,
        ),
      };
    });
  }
  if (Object.keys(errors).length) throw new StoryError(422, "invalid", errors);
  return d;
}
export function exactBody(value: unknown, keys: string[]) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).length !== keys.length ||
    keys.some((k) => !Object.hasOwn(value, k))
  )
    throw new StoryError(422, "invalid");
  return value as Record<string, unknown>;
}
