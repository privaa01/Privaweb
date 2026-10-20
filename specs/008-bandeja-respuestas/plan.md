# Implementation Plan: Bandeja privada y respuestas por correo

**Branch**: `main` (rama real) | **Date**: 2026-10-19 | **Spec**: [spec.md](spec.md)
**Feature Directory**: `specs/008-bandeja-respuestas` (selector 008, independiente de la rama).
**Input**: `/speckit-plan 008`, spec vigente y Q1=A: permitir respuesta adicional deliberada tras
revisar historial y resolver intentos inciertos. Estado: implementación y verificación local; evidencias en [evidence.md](evidence.md),
con calificación externa y entrega final pendientes.

## Summary

Completar bandeja privada `/admin/contacto` sobre shell 006, con filtros/contadores reales,
consulta/historial y respuesta al correo guardado 005. Usar un repositorio 008 en contact.sqlite:
consulta, intención, aceptación, estado y actividad se confirman juntos. Guard 006 exterior y orden
de locks admin → contacto mantienen autorización hasta commit sin transacción distribuida.
Worker/adaptador de correo 008 separados de recuperación 006 con identidad durable y lookup:
unknown conserva bloqueo, nunca se trata como fallo seguro. Q1 añade respuesta al mismo historial;
no chat, aprobación pública, destinatario editable, adjuntos ni mensajes por historia.

## Technical Context

**Language/Version**: Node 24.19.0 (mínimo 24 para administración), TypeScript 5.9.3 y Astro 7.4.0.
**Primary Dependencies**: node:sqlite, node:crypto y node:http, shell/sesiones 006, receptor 005 y contador 007;
Playwright 1.64.1, axe 4.14.0 y herramientas del lock. Sin dependencia de correo nueva hasta calificar P02.
**Storage**: contact.sqlite de 005 único dominio 008, WAL/FULL/FK/busy_timeout5000; admin.sqlite de 006
se mantiene independiente. Cifrado AES-256-GCM para payloads de respuesta, claves separadas versionadas,
archivos 0600/directorios 0700 fuera del checkout y roots estáticos; migración offline versionada.
**Testing**: Node test, SQLite de archivo y procesos/conexiones concurrentes, Playwright UI/servicio,
axe y revisión manual; doble local identificado y validación separada de proveedor/buzón real.
**Target Platform**: Linux/Node 24, servicio admin loopback detrás de HTTPS/proxy calificado;
público Astro estático y servicios 005/006 existentes. Siete anchos 360–1440px y texto 100/200%.
**Project Type**: Web con frontend estático y API privada Node; no SSR de datos privados en dist.
**Performance Goals**: SC-005: p95 ≤ 2 s para listado/filtro/detalle sobre 1000 consultas; 30 muestras
por operación tras calentamiento, entorno y tamaños anotados. UI de espera inmediata; cliente 10 s,
HTTP body 30 s, correo 10 s por llamada. No comprometer entrega por cumplir tiempo local.
**Constraints**: Texto 1–5000 puntos Unicode, JSON de 32 KiB, 25 registros/página (máximo 50), historial 25;
no async/red dentro de locks; una intención sin resolver por consulta; sin garantía de entrega/lectura.
**Scale/Scope**: Cinco IDs originales, cuatro US, 26 escenarios, ocho SC; único permiso 006,
fixture de 1000 consultas con 10 respuestas cada una para lectura/historial; sin objetivo multi-región/SLA inventado.
**External dependencies**: P02: proveedor/remitente/dedup/buzón y operación 009/010/011 no calificados.
Contrato/adaptador local definido, envío productivo deshabilitado hasta evidencia. No hay decisiones
materiales de comportamiento sin resolver; faltantes externos son gates de cierre, no tecnologías asumidas.

## Constitution Check

Gate previo a investigación: conforme para diseño y trabajo local; Q1 registrada. Gate posterior:
conforme con contrato detallado, sin excepciones constitucionales ni aprobación productiva.

| Reglas | Comprobación previa y posterior |
| --- | --- |
| CONST-01/02 | R35 y Q1 gobiernan; cinco FR conservados; especificación antes de implementación; detalles P04 identificados como derivados |
| CONST-03 | Solo Contacto privado; sin Aprobar, casos, nuevos roles, destinatario editable, adjuntos o chat |
| CONST-04 | Matriz original→US/escenario→SC→artefacto/prueba futura; tareas locales generadas en su fase y evidencia local registrada con bloqueos externos, sin IDs históricos inventados |
| CONST-05 | Una fuente 005; 90 días y solicitud anticipada 009; borrado coordinado, cifrado y sin rastreo; límites de buzones/copias explícitos |
| CONST-06 | Guard por operación, CSRF/origen, worker revalida; unknown bloqueante; aceptación/recepción/lectura separadas |
| CONST-07 | Respondido tras aceptación+persistencia; contadores reales; fallo de respuesta adicional conserva estado previo |
| CONST-08/09 | Shell 006 y diferencia C28, diseño P04, matriz accesible; sin cifras/brand/copys inventados ni promesas de plazo |
| CONST-10 | Pruebas futuras por capa y gates externos; diseñar no significa implementar ni acreditar CT01 |
| CONST-11/12 | Q1 sincronizada y arquitectura documentada; sin cambio silencioso de política 009 o requisitos 005/006/007 |

Proveedor, recepción, retención/copias y calificación externa siguen abiertos; no se ejecuta envío
real ni se habilita producción por tener el plan. No hay violaciones que justificar en Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/008-bandeja-respuestas/
├── spec.md
├── checklists/requirements.md
├── plan.md
├── research.md
├── data-model.md
├── contracts/inbox.md
└── quickstart.md
```

Las [tareas](tasks.md) se generaron posteriormente con `$speckit-tasks 008`: 66 tareas con estado actualizado en su archivo; no confundir tareas locales con cierre productivo.
[evidence.md](evidence.md) registra la implementación y la verificación local; este plan conserva las decisiones de diseño.

### Source Code (repository root)

Rutas propuestas nuevas marcadas (nuevo); los archivos existentes se modifican solo al implementar.

```text
server/inbox/                         (nuevo)
  composition.ts, repository.ts, sqlite-repository.ts, service.ts
  http.ts, worker.ts, mail-adapter.ts, crypto.ts, validation.ts, tsconfig.json
server/contact/
  sqlite-repository.ts                INSERT y revoke compatibles
  schema.ts                          (nuevo) esquema/migración compartidos005/008
server/admin/
  http.ts, start.ts                   composición008 y ciclo de worker
  sqlite-repository.ts               guard interno por sessionDigest para dispatch
  views/src/pages/contacto.astro      UI real, sin datos embebidos
server/stories/contact-summary.ts     conteoactive, misma fuente 005
src/components/admin/InboxManager.astro (nuevo)
src/components/admin/AdminShell.astro navegación/shell conservados
src/scripts/admin-inbox.ts            (nuevo) cliente y eventos006
src/lib/inbox-contract.ts             (nuevo) DTO/errores/version
src/lib/inbox-validation.ts           (nuevo) normalización/límites
src/config/inbox.ts                  (nuevo) preparación pendiente
src/styles/admin.css                 estilos existentes extendidos
scripts/migrate-contact-inbox.ts      (nuevo) operaciónoffline explícita
scripts/require-inbox-publication.mjs (nuevo) gate008
playwright.inbox.config.ts            (nuevo) fixtureUI
playwright.inbox.service.config.ts    (nuevo) servicio real
 tests/fixtures/inbox/                (nuevo) fixtureUI y datos sintéticos
 tests/fixtures/inbox-service/        (nuevo)005+006+008 y proveedor controlado
 tests/inbox-*.test.ts                (nuevo) dominio/HTTP/correo/migración/seguridad
 tests/e2e/inbox-*.spec.ts             (nuevo) recorridos/teclado/concurrencia
```

**Structure Decision**: reutilizar composición privada 006; no crear segundo sitio/servicio público,
ni meter respuestas en admin_jobs 006. Integraciones mínimas 005/007 se prueban como regresión.
`package.json` incorporará comandos 008 en implementación; lock solo cambia si dependencia justificada.

## Phase 0 — Investigación concluida

[research.md](research.md) resuelve arquitectura, locks, migración, adaptador, recuperación,
borrado, límites y gates. Se inspeccionaron rutas/código reales 005/006/007; investigación delegada
por instrucción del skill, solo lectura. No se consultó un proveedor como si ya estuviera elegido.

## Phase 1 — Diseño concluido

- [data-model.md](data-model.md): esquema, estados, identidad, CAS, payload cifrado y retención.
- [contracts/inbox.md](contracts/inbox.md): UI, HTTP, repositorios, worker y condiciones de calificación.
- [quickstart.md](quickstart.md): validación reproducible futura y separación de resultados por capa.

Revisión posterior: no red en locks, solo contacto escribe dominio 008, gate no permite producción
sin proveedor, desconocido no se recicla automáticamente y borrado no recrea registros. Detalles
claves del protocolo deben probarse antes de aceptar implementación; su diseño no acredita pruebas.

## Secuencia para generar tareas posteriormente

1. Esquema/migración offline y adaptación 005; comprobar que recibos/contact.key/IDs sobreviven.
2. Repositorio/guard de dos bases, detalle/filtros/totales y consumidor 007; pruebas de revocación.
3. Identidad de operación/CAS/validación/HTTP y payload protegido; primero guardado de intención.
4. Adaptador/worker local con aceptación/rechazo/unknown/crash/lookup y borrado coordinado.
5. UI privada completa y Q1, navegación/sesión/foco/errores; pruebas navegador con servicio real.
6. Rendimiento/regresión 005/006/007 y 003 sin entradas educativas; evidencia externa aparte.

## Matriz de validación futura

| IDs / SC | Escenarios | Prueba prevista y evidencia requerida |
| --- | --- | --- |
| AD07 / SC-001/004/005/006 | US1.1–6 | Filtros/detalle/cursor/totales/estados vacío-error, múltiples sesiones, carreras de carga y denegación directa |
| AD09 / SC-002/006 | US2.1–6 | Destinatario servidor, fronteras texto, persistencia tras reinicio, texto como datos, Q1 con historial revisado |
| AD08/AD09 / SC-003/004 | US3.1–8 | Misma intención concurrente, CAS dos cuentas, fallo antes/después de aceptación/commit, unknown y lookup sin resend |
| AD11/CT01 / SC-007 | US4.1–3 | Contacto 005 real→bandeja→aceptación→historial; recepción real por separado; cero entradas por ejercicios 003 |
| CT01 / SC-007 | US4.4–6 | Eliminación/90 días/control de reloj/replay/restore y ack tardío; operación 009/buzones/copias con evidencia propia |
| Todos / SC-008 | Los 26 escenarios | Matriz a futuras tareas/pruebas/evidencias; no completar por pruebas mock o recursos pendientes |

## Risks and publication gates

- Dos archivos: probar orden de locks y recuperación ante crash entre COMMIT de contacto/touch de admin.
  No existe atomicidad distribuida; recibo durable permite comprobar resultado.
- Correo externo no es transaccional: garantías del proveedor deben calificarse; sin lookup/prueba
  concluyente mantener unknown. No prometer retirar envíos tras su inicio autorizado.
- Migración modifica esquema 005; detener escritores y comprobar rollback antes de reabrir. No
  configurar 008 sobre copia distinta a 005/007 ni usar fallback silencioso a otra base vacía.
- P02/009/010/P05/011 pendientes impiden cierre integrado y publicación, no diseño/pruebas locales.
- La implementación y las pruebas locales se registran en evidence.md; proveedor, operación real y
  cierre integrado siguen pendientes. Sin commit/push ni despliegue por esta implementación.
