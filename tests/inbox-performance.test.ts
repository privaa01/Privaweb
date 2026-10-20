import test from "node:test";
import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { randomUUID } from "node:crypto";
import { inboxFixture } from "./fixtures/inbox-service/helpers.ts";
test("1000 consultations with10 responses: list, filter and detail p95 below2s", async () => {
  const f = await inboxFixture();
  try {
    let first = "";
    f.repo.tx(() => {
      const c = f.repo.db.prepare(
        "INSERT INTO consultations(id,nameOrAlias,email,message,receivedAt,lastActivityAt,status) VALUES(?,?,?,?,?,?,'Respondido')",
      );
      const op = f.repo.db.prepare(
        "INSERT INTO reply_operations(operationId,consultationId,actorAccountId,sessionDigest,expectedRevision,reviewedRevision,payloadHash,deliveryId,state,createdAt,updatedAt,acceptedAt) VALUES(?,?,?,'synthetic',1,1,'synthetic',?,'accepted',?,?,?)",
      );
      const response = f.repo.db.prepare(
        "INSERT INTO reply_responses VALUES(?,?,?,?,?,?)",
      );
      for (let i = 0; i < 1000; i++) {
        const id = randomUUID();
        if (!first) first = id;
        const date = new Date(f.time()).toISOString();
        c.run(
          id,
          "Alias " + i,
          "synthetic@example.com",
          "Consulta benchmark",
          date,
          date,
        );
        for (let j = 0; j < 10; j++) {
          const operationId = randomUUID(),
            deliveryId = randomUUID(),
            o = {
              operationId,
              consultationId: id,
              actorAccountId: f.one.account.id,
              deliveryId,
            };
          op.run(
            operationId,
            id,
            f.one.account.id,
            deliveryId,
            f.time(),
            f.time(),
            f.time(),
          );
          response.run(
            randomUUID(),
            id,
            operationId,
            f.one.account.id,
            f.time(),
            f.crypto.seal(f.repo.aad(o), {
              to: "synthetic@example.com",
              from: "synthetic@example.com",
              subject: "Synthetic",
              text: "Respuesta de prueba",
            }),
          );
        }
      }
    });
    for (const kind of ["list", "filter", "detail"]) {
      const run = () =>
        kind === "detail"
          ? f.service.detail(f.token, first)
          : f.service.list(f.token, {
              status: kind === "filter" ? "Pendiente" : "Respondido",
              cursor: null,
              limit: 25,
            });
      run();
      const times = [];
      for (let n = 0; n < 30; n++) {
        const start = performance.now();
        run();
        times.push(performance.now() - start);
      }
      times.sort((a, b) => a - b);
      const p95 = times[Math.ceil(times.length * 0.95) - 1];
      console.info("inbox_benchmark", kind, "p95_ms=" + p95.toFixed(2));
      assert.ok(p95 < 2000);
    }
  } finally {
    f.cleanup();
  }
});
