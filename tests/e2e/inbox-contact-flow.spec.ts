import { test, expect } from "@playwright/test";
import { loginInbox, newContact, openContact, labelFor } from "./inbox-helpers";
test("public persistence to real private inbox does not disclose internal ID or promise mail delivery", async ({
  page,
}) => {
  const token = await page.request.post("/api/contacto/intentos", {
    headers: { Origin: "http://localhost:4333" },
    data: {},
  });
  const t = await token.json();
  const body = {
    attemptId: t.attemptId,
    token: t.token,
    nameOrAlias: labelFor("CT01 sintético"),
    email: "synthetic-visitor@example.com",
    message: "Flujo con consulta real de prueba",
  };
  const saved = await page.request.post("/api/contacto/consultas", {
    headers: { Origin: "http://localhost:4333" },
    data: body,
  });
  expect((await saved.json()).result).toBe("stored");
  expect(Object.keys(await saved.json()).sort()).toEqual([
    "attemptId",
    "result",
  ]);
  const replay = await page.request.post("/api/contacto/consultas", {
    headers: { Origin: "http://localhost:4333" },
    data: body,
  });
  expect(replay.status()).toBe(200);
  await loginInbox(page);
  await openContact(page, "CT01 sintético");
  await expect(page.locator("[data-detail-data]")).toContainText(
    "Flujo con consulta real de prueba",
  );
});
