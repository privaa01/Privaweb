import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
test("real sandbox upload through editor, publish inactive, explicitly activate and play public synthetic audio", async ({
  page,
}) => {
  const dir = mkdtempSync(join(tmpdir(), "priva-browser-upload-"));
  try {
    const image = join(dir, "image.png"),
      audio = join(dir, "audio.wav");
    execFileSync("/usr/bin/ffmpeg", [
      "-v",
      "error",
      "-f",
      "lavfi",
      "-i",
      "color=c=green:s=16x16",
      "-frames:v",
      "1",
      "-threads",
      "1",
      image,
    ]);
    execFileSync("/usr/bin/ffmpeg", [
      "-v",
      "error",
      "-f",
      "lavfi",
      "-i",
      "sine=frequency=440:duration=3",
      "-threads",
      "1",
      audio,
    ]);
    await page.goto("/admin/login");
    await page.getByLabel("Correo", { exact: true }).fill("one@example.com");
    await page
      .getByLabel("Contraseña", { exact: true })
      .fill("synthetic private phrase 2026");
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await page.waitForURL("**/admin");
    await page.goto("/admin/historias");
    await expect(page.locator("[data-management-status]")).toContainText(
      "Historias comprobadas",
    );
    await page
      .getByRole("button", { name: "Agregar historia", exact: true })
      .click();
    const title = "Audio sintético real " + Date.now();
    await page.getByLabel("Título", { exact: true }).fill(title);
    await page
      .getByRole("button", { name: "Guardar borrador", exact: true })
      .click();
    await expect(page.locator("[data-management-status]")).toContainText(
      "Borrador guardado",
    );
    await page.locator("[data-upload=image]").setInputFiles(image);
    await expect(page.locator("[data-file-status=image]")).toContainText(
      "Archivo disponible",
    );
    await page.locator("[data-upload=audio]").setInputFiles(audio);
    await expect(page.locator("[data-file-status=audio]")).toContainText(
      "Archivo disponible",
    );
    for (const [label, value] of [
      ["Categoría", "Prueba de carga"],
      ["Descripción", "Relato sintético de prueba"],
      ["Alternativa de imagen", "Cuadro verde"],
      ["Transcripción", "Señal de prueba"],
      ["Pregunta", "¿Qué riesgo identificas?"],
    ])
      await page.getByLabel(label, { exact: true }).fill(value);
    for (let i = 0; i < 3; i++) {
      await page
        .getByLabel("Texto de opción", { exact: true })
        .nth(i)
        .fill("Opción " + (i + 1));
      await page
        .getByLabel("Explicación del riesgo y prevención", { exact: true })
        .nth(i)
        .fill("Riesgo y prevención " + (i + 1));
    }
    await page
      .getByRole("button", { name: "Guardar borrador", exact: true })
      .click();
    await expect(page.locator("[data-management-status]")).toContainText(
      "Borrador guardado",
    );
    await page.getByRole("button", { name: "Publicar", exact: true }).click();
    await expect(page.locator("[data-management-status]")).toContainText(
      "Inactiva",
    );
    expect(
      (
        await (await page.request.get("/api/public/historias")).json()
      ).stories.some((s: any) => s.title === title),
    ).toBe(false);
    await page
      .getByRole("button", { name: "Activar " + title, exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Desactivar " + title, exact: true }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Ver historias en la web" }).click();
    await page.getByRole('button',{name:'Ver todas las historias',exact:true}).click();
    await expect(page.locator("[data-catalog]")).toContainText(title);
    const player = page
      .locator("[data-story]")
      .filter({ hasText: title })
      .locator("audio");
    await player.evaluate((audio: HTMLAudioElement) => audio.play());
    await expect
      .poll(() =>
        player.evaluate((audio: HTMLAudioElement) => audio.currentTime),
      )
      .toBeGreaterThan(0);
    expect(
      await player.evaluate((audio: HTMLAudioElement) => audio.duration),
    ).toBeGreaterThan(2.9);
    await player.evaluate((audio: HTMLAudioElement) => {
      audio.pause();
      audio.currentTime = 1;
    });
    await expect
      .poll(() =>
        player.evaluate((audio: HTMLAudioElement) => audio.currentTime),
      )
      .toBeGreaterThanOrEqual(0.9);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("unknown upload can be abandoned without losing authorized editor text (explicit HTTP error simulation)", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel("Correo", { exact: true }).fill("two@example.com");
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("synthetic private phrase 2026");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.waitForURL("**/admin");
  await page.goto("/admin/historias");
  await expect(page.locator("[data-management-status]")).toContainText(
    "Historias comprobadas",
  );
  await page
    .getByRole("button", { name: "Agregar historia", exact: true })
    .click();
  await page.getByLabel("Título", { exact: true }).fill("Texto guardado");
  await page
    .getByRole("button", { name: "Guardar borrador", exact: true })
    .click();
  await expect(page.locator("[data-management-status]")).toContainText(
    "Borrador guardado",
  );
  await page
    .getByLabel("Descripción", { exact: true })
    .fill("Texto local que debe conservarse");
  await page.route("**/api/admin/historias/*/recursos/*", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ result: "unavailable" }),
    }),
  );
  await page
    .locator("[data-upload=image]")
    .setInputFiles({
      name: "synthetic.png",
      mimeType: "image/png",
      buffer: Buffer.from("synthetic unvalidated bytes"),
    });
  await expect(page.locator("[data-management-status]")).toContainText(
    "No se pudo confirmar",
  );
  await page
    .getByRole("button", { name: "Conservar texto y elegir otro archivo" })
    .click();
  await expect(page.getByLabel("Descripción", { exact: true })).toHaveValue(
    "Texto local que debe conservarse",
  );
  await expect(
    page.getByRole("button", { name: "Guardar borrador", exact: true }),
  ).toBeEnabled();
  await expect(page.locator("[data-preview]")).toHaveCount(0);
});
