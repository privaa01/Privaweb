export interface FirebaseStoryOption {
  id: string;
  label: string;
  explanation: string;
}

export interface FirebaseStoryInput {
  schemaVersion: 1;
  slug: string;
  title: string;
  personName: string;
  category: string;
  description: string;
  transcript: string;
  question: string;
  options: FirebaseStoryOption[];
  image: { url: string; alt: string; width: number; height: number };
  podcast: {
    provider: "spotify";
    episodeId: string;
    publicUrl: string;
    embedUrl: string;
    durationSeconds: number;
  };
  status: "draft" | "published";
  active: boolean;
  order: number;
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const spotifyIdPattern = /^[A-Za-z0-9]{22}$/;

function cleanText(value: unknown, name: string, max: number, required = true) {
  if (typeof value !== "string") throw new Error(`${name}: texto inválido.`);
  const result = value.trim();
  if ((required && !result) || [...result].length > max || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(result))
    throw new Error(`${name}: valor inválido.`);
  return result;
}

export function spotifyEpisode(value: unknown) {
  const candidate = cleanText(value, "Episodio de Spotify", 300);
  let id = spotifyIdPattern.test(candidate) ? candidate : "";
  if (!id) {
    let url: URL;
    try { url = new URL(candidate); } catch { throw new Error("Enlace de Spotify inválido."); }
    if (url.protocol !== "https:" || url.hostname !== "open.spotify.com") throw new Error("Usa un enlace de open.spotify.com.");
    const match = url.pathname.match(/^\/(?:intl-[a-z]{2}\/)?episode\/([A-Za-z0-9]{22})\/?$/);
    if (!match) throw new Error("El enlace debe corresponder a un episodio de Spotify.");
    id = match[1];
  }
  return {
    provider: "spotify" as const,
    episodeId: id,
    publicUrl: `https://open.spotify.com/episode/${id}`,
    embedUrl: `https://open.spotify.com/embed/episode/${id}`,
  };
}

export function validatedImageUrl(value: unknown) {
  const candidate = cleanText(value, "Imagen", 1500);
  let url: URL;
  try { url = new URL(candidate); } catch { throw new Error("La imagen debe tener una URL HTTPS completa."); }
  if (url.protocol !== "https:" || url.username || url.password || url.hash) throw new Error("La imagen debe tener una URL HTTPS segura.");
  return url.href;
}

export function validateFirebaseStory(raw: FirebaseStoryInput): FirebaseStoryInput {
  const slug = cleanText(raw.slug, "Identificador", 80);
  if (!slugPattern.test(slug)) throw new Error("Identificador inválido.");
  if (!Array.isArray(raw.options) || raw.options.length !== 3) throw new Error("Se requieren tres opciones.");
  const seen = new Set<string>();
  const options = raw.options.map((option) => {
    const id = cleanText(option.id, "Opción", 80);
    if (!slugPattern.test(id) || seen.has(id)) throw new Error("Identificador de opción inválido.");
    seen.add(id);
    return { id, label: cleanText(option.label, "Opción", 500), explanation: cleanText(option.explanation, "Explicación", 3000) };
  });
  const podcast = spotifyEpisode(raw.podcast.publicUrl || raw.podcast.episodeId);
  const durationSeconds = Number(raw.podcast.durationSeconds);
  const width = Number(raw.image.width), height = Number(raw.image.height), order = Number(raw.order);
  if (!Number.isInteger(durationSeconds) || durationSeconds < 1 || durationSeconds > 7200) throw new Error("Duración inválida.");
  if (![width, height].every((n) => Number.isInteger(n) && n > 0 && n <= 5000)) throw new Error("Dimensiones de imagen inválidas.");
  if (!Number.isInteger(order) || order < 0 || order > 999) throw new Error("Orden inválido.");
  const status = raw.status === "published" ? "published" : "draft";
  return {
    schemaVersion: 1, slug,
    title: cleanText(raw.title, "Título", 160),
    personName: cleanText(raw.personName, "Nombre", 100, false),
    category: cleanText(raw.category, "Categoría", 80),
    description: cleanText(raw.description, "Descripción", 3000),
    transcript: cleanText(raw.transcript, "Transcripción", 20000),
    question: cleanText(raw.question, "Pregunta", 300), options,
    image: { url: validatedImageUrl(raw.image.url), alt: cleanText(raw.image.alt, "Alternativa de imagen", 500), width, height },
    podcast: { ...podcast, durationSeconds },
    status, active: status === "published" && raw.active === true, order,
  };
}
