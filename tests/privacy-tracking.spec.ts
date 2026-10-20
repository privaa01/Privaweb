import { test, expect } from "@playwright/test";
import { privacyHarness } from "./helpers/privacy-service-harness.ts";
test("local private-service fixture adds no tracking requests or persistent visitor data", async ({
  page,
  context,
}) => {
  const f = await privacyHarness(),
    origins = new Set<string>();
  page.on("request", (r) => origins.add(new URL(r.url()).origin));
  try {
    await page.goto(f.origin);
    await page.evaluate(async () => {
      await fetch("/api/admin/privacidad/solicitudes", {
        method: "POST",
        headers: { "x-priva-request": "1", "content-type": "application/json" },
        body: "{}",
      });
    });
    await page.reload();
    expect([...origins]).toEqual([f.origin]);
    expect(
      await page.evaluate(() => ({
        local: localStorage.length,
        session: sessionStorage.length,
      })),
    ).toEqual({ local: 0, session: 0 });
    expect(await context.cookies()).toEqual([]);
  } finally {
    await f.stop();
  }
});
