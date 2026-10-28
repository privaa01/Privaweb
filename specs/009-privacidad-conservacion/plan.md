# Implementation Plan: Privacidad y ciclo de vida de datos

**Branch**: `main` (rama real) | **Date**: 2026-10-20 | **Spec**: [spec.md](spec.md)
**Feature Directory**: `specs/009-privacidad-conservacion` (selector 009 independiente de rama).
**Input**: `$speckit-plan 009`; X02/FR-001 y Q1–Q4 confirmadas por la usuaria.
**Estado**: diseño ejecutado y verificado localmente; [evidence.md](evidence.md) distingue implementación, pruebas y calificación productiva pendiente.

## Summary

Extender el dominio Contacto existente con conservación verificable, eliminación anticipada
confirmada por código, coordinación de correo y recuperación sin reaparición. Q1 calcula actividad
por recepción o aceptación original de nueva respuesta; Q2 exige revisión al menos horaria y
borrado operativo ≤1 h después de vencer; Q3 comprueba control del correo guardado mediante
comprobante de un uso; Q4 exige borrado ≤24 h desde confirmación, respetando un límite anterior.

Reutilizar contact.sqlite y autorización006. Separar el mantenimiento de privacidad del correo008,
centralizar todas las eliminaciones y añadir un diario mínimo de supresiones, respaldado fuera de
la copia restaurada. Un código se comunica por correo y vuelve por el canal oficial al operador;
no añadir pantalla pública de autoservicio. La eliminación física comprobable abarca filas,
freelist, WAL y temporales controlados; la eliminación de soportes, snapshots y proveedores
se califica aparte. Nunca declarar borrado total por ejecutar DELETE.

## Technical Context

**Language/Version**: Node 24.19.0, TypeScript 5.9.3, Astro 7.4.0; mantener lock existente.
**Primary Dependencies**: node:sqlite/crypto/http/fs, servicios005/006/007/008; Playwright1.64.1
para integración y observación de tráfico. Sin nuevo proveedor ni paquete npm productivo; util-linux/flock y supervisor local para barrera de mantenimiento.
**Storage**: contact.sqlite como autoridad de conversaciones, solicitudes, confirmaciones y planes
de borrado; admin.sqlite conserva cuentas/sesiones. Migración offline version8→9 propuesta,
validada con backup coherente. Diario de supresión autenticado con réplica independiente y
manifiestos de copias; claves fuera de checkout/roots públicos, directorios0700/archivos0600.
**Testing**: Node test, SQLite de archivo, procesos concurrentes, reloj inyectado, inyección de
fallos, inspección de bytes SQLite/WAL, Playwright contra servicios reales con dobles locales;
calificación separada de correo, soporte, respaldos y sitio desplegado.
**Target Platform**: Linux, Node24, servicios loopback tras proxy HTTPS calificado. Astro público
estático; vistas privadas y datos nunca en dist. Sin nueva interfaz pública de eliminación.
**Project Type**: web estática y servicios privados, CLI de operador y worker de mantenimiento.
**Performance Goals**: barrido inicial y cada60s, lotes100 ordenados por deadline; p95≤5s por lote
sobre fixture1000 consultas/10 respuestas, 30 muestras tras calentamiento. Presupuesto local de
borrado físico≤15min desde el vencimiento de conservación o la confirmación válida de solicitud, según el motivo, con reintento5s/30s/60s y vigilancia cada60s;
siempre verificar el límite aprobado de1h/24h, sin presentar estos objetivos internos como SLA.
**Constraints**: no red/await bajo transacciones; orden admin→contacto en operaciones privadas;
DELETE lógico no acredita limpieza física; réplica de supresión durable antes de destruir datos;
no tokens, alias, email, texto o IP en logs. El instante de una interrupción no reinicia plazos.
**Scale/Scope**: X02 único ID original; cuatro US,25 escenarios,ochoSC, permiso006 único. Diseño
para el servicio de referencia de un sitio, sin multi-región ni SLA de disponibilidad inventado.
**External dependencies**: P02 para canal/responsable, proveedor de confirmación y borrado,
almacenamiento/réplica, manifiestos y ciclos de copias/buzones;010 para avisos,011 para verificación
integrada. Son gates explícitos: contratos y pruebas sintéticas pueden avanzar; producción no.

## Constitution Check

Gate previo: conforme para investigación/diseño; spec y cuatro decisiones disponibles.
Gate posterior: conforme para diseño local con bloqueos externos explícitos. Sin excepción.

| Reglas | Comprobación previa y posterior |
| --- | --- |
| CONST-01/02 | Q1–Q4 gobiernan; conservar FR-001 literal; plan antes de código, sin reemplazar política por comportamiento existente |
| CONST-03/07 | Sin roles, cuenta visitante, pantalla pública nueva, publicación de consultas o borrado de historias; contador007 coherente |
| CONST-04 | X02→US/escenario→SC→diseño→validación futura; no crear HU/CA históricos ni tareas fuera de fase |
| CONST-05 | Minimización, códigos efímeros, supresión sin contenido, ciclos acotados; no aplicar90d a otros dominios |
| CONST-06 | Guard006, CSRF/origen, confirmación de control de correo y protección contra enumeración; ningún envío o borrado ficticio |
| CONST-08/09 | Flujo por canal oficial accesible; avisos010 verificables; cookies necesarias documentadas, terceros incluidos |
| CONST-10 | Distinguir fila ausente, limpieza de archivo, proveedor y soporte; evidencias sintéticas no califican producción |
| CONST-11/12 | P02 no inventado; conservar decisiones y documentar límites, tareas solo después de este plan |

No se habilita producción ni se aprueban copias externas con este documento.

## Project Structure

### Documentation (this feature)

```text
specs/009-privacidad-conservacion/
  spec.md
  checklists/requirements.md
  plan.md
  research.md
  data-model.md
  contracts/privacy.md
  quickstart.md
```

[tasks.md](tasks.md) generado posteriormente con `$speckit-tasks 009`:67 tareas con dependencias y verificación por historia; estado actual57/67 verificadas localmente. El plan conserva su alcance de diseño; generar tareas no acredita implementación.

### Source Code (repository root)

Rutas de la implementación local; la estructura inicial propuesta se concretó con módulos auxiliares cleanup/storage/readiness/maintenance/runtime/operator-cli y scripts de supervisión/watchdog/retirada.

```text
server/privacy/                         propuesto
  policy.ts, repository.ts, service.ts, worker.ts
  confirmation.ts, mail-adapter.ts, erasure.ts
  deletion-journal.ts, restore.ts, http.ts, tsconfig.json
server/contact/schema.ts                esquema9 y primitiva de supresión común
server/contact/sqlite-repository.ts     políticas de conexión y recibos005
server/contact/runtime.ts               barrera de recuperación/esquema9
server/inbox/{sqlite-repository,composition}.ts
server/admin/start.ts                   workerprivacidad independiente
server/stories/contact-summary.ts       exclusión de deleting/solicitud confirmada
scripts/migrate-contact-privacy.ts       propuesto
scripts/privacy-operator.ts             propuesto: control local con sesión006
scripts/privacy-restore.ts              propuesto
scripts/require-privacy-publication.mjs  propuesto
src/config/privacy.ts                   propuesto: evidencias, no flags ficticios
src/config/{contact,admin,inbox}.ts      referencias de calificación coordinadas
src/pages/                              avisos solo coordinados con010
tests/privacy-*.test.ts                 propuesto
tests/privacy-service.spec.ts          propuesto
playwright.privacy.service.config.ts    propuesto
```

**Structure Decision**: un módulo009 sobre fuente005, sin duplicar datos privados ni acoplar
conservación al adaptador de correo. La CLI usa credenciales por entrada segura y operaciones
privadas; los comandos no aceptan secretos por argumentos ni omiten el guard006.

## Phase 0 — Investigación

[research.md](research.md) registra decisiones, alternativas y límites: scheduler dedicado,
protocolo de eliminación/limpieza, diario y restauración, código por canal, outbox independiente,
auditoría de rastreo y gates. No quedan decisiones técnicas sin resolver para trabajo local;
no se interpreta un proveedor ausente como una elección tácita.

## Phase 1 — Diseño y contratos

[data-model.md](data-model.md): esquema9, estados, deadlines, datos mínimos y caducidades.
[contracts/privacy.md](contracts/privacy.md): límites de operación privada, correo, borrado físico,
copias y recuperación. [quickstart.md](quickstart.md): validación reproducible futura por criterio.

Orden futuro: migración/guard/política común → US1 mantenimiento y limpieza → US2 confirmación
con código y eliminación → US3 diario/réplica/restore → US4 auditoría integrada y avisos. El diario, la creación/validación básica de manifiestos y la captura durable mínima de identificadores
para borrado externo, junto con la barrera de recuperación, son fundamento de todo borrado definitivo, aunque su prueba de
restauración se agrupe en US3; no desplegar US1/US2 sin esa protección. No cerrar003/005/006/008/010/011
ni CT01 productivo con evidencias parciales009.

## Trazabilidad del diseño

| Original / reglas | Historias | Diseño | Validación futura |
| --- | --- | --- | --- |
| X02/FR-001 R-01/02/03 | US1.1–6 | Política/deadlines, scheduler, borrado físico C1/C4 | SC-001/002, V01–V04 |
| X02/FR-001 R-04/05 | US2.1–6 | Solicitud/código/outbox y guard C2/C3 | SC-003/008, V05–V08 |
| X02/FR-001 R-05/06 | US3.1–6 | Diario, réplica y restauración C4/C5 | SC-004/005, V09–V11 |
| X02/FR-001 R-01/07/08/09 | US4.1–7 | Autorización, inventario y gates C2/C6 | SC-006/007/008, V12–V15 |

## Complexity Tracking

Sin violaciones constitucionales. Diario externo y limpieza física son necesarios para impedir
reaparición y acreditar el borrado; reutilizar solo DELETE o recibos005 de24h no cumple US3.

## Actualización de arquitectura — 2026-10-27

Firebase seleccionado para alojamiento web; backend Node/SQLite, Linux/flock, medios y persistencia requieren diseño compatible explícito antes de despliegue. No se seleccionan Firestore, Functions, Cloud Run, región o plan por inferencia. Correo restringido a pruebas sin proveedor en esta etapa; no habilitar códigos o despachos reales mediante dobles productivos. Acceso y copias siguen pendientes de política concreta; MVP no es una excepción a seguridad. Ver [decisiones del MVP y marco normativo](../010-documentos-recuperacion/mvp-decisions-2026-10-27.md).
