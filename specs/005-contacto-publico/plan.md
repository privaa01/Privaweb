# Implementation Plan: Contacto y recepción privada de consultas

**Branch real**: `main` | **Date**: 2026-10-17 | **Spec**: [spec.md](spec.md)
**Feature activa**: `005-contacto-publico`; el BRANCH de scripts es selección SDD, no rama creada.
**Estado**: 53/53 tareas de la demo; diseño corregido aceptado por la responsable el2026-10-30 («esta perfecto»); producción diferida. Véase [demo-review-2026-10-30.md](demo-review-2026-10-30.md).
**Input**: C01–C07, PDF4/R35, constitución 1.0.0 y aclaración 005 opción A.

## Alcance activo de demo

[Decisión y límites](demo-scope-2026-10-30.md). La demo usa DemoLayout y formulario ficticio directo a Firestore. La arquitectura Node/SQLite y el formulario completo descritos después corresponden al producto completo, no al despliegue demo.

## Summary

Construir /contacto.html con componentes Astro, PublicLayout y recursos/copy revisables. Instagram
reutiliza src/config/social.ts. Añadir formulario accesible, módulo de validación compartido y
máquina de estados con snapshot inmutable durante envío/resultado desconocido. Otra consulta
requiere acción explícita y advertencia; nunca supone cancelar la anterior.

Astro continúa estático: receptor HTTP Node separado, dos POST same-origin bajo /api/contacto,
y repositorio transaccional. Implementar adaptador SQLite real para pruebas locales y reutilizar
la misma lógica de servicio en el contrato de producción; no elegir un proveedor/despliegue
como si estuviera configurado. El receptor de producción necesitará origen HTTPS/proxy,
persistencia durable, secretos y controles operativos P02 verificados antes de abrir recepción real.

Confirmar solo después de COMMIT; reintentos con mismo intento/datos devuelven acuse mínimo,
no una consulta nueva. Comprobantes terminales impiden resurrección tras rechazo/eliminación.
No exponer lectura HTTP pública ni construir bandeja 008 o autenticación 006 dentro de 005.

## Technical Context

**Language/Version**: TypeScript 5.9.3 estricto y HTML/CSS; Node 24.19.0 para receptor/SQLite,
npm 11.9.0 actual. Frontend conserva compatibilidad vigente; scripts del servicio documentan
Node 24 como prerrequisito sin asumir soporte idéntico deSQLite en otras versiones.
**Primary Dependencies**: Astro 7.4.0, @astrojs/check0.9.10, Playwright 1.64.1, axe 4.14.0,
@types/node24.19.2 existentes; node:http/crypto/fs/sqlite nativos. Sin paquete nuevo previsto.
node:sqlite es experimental en este entorno; referencia local, no certificación de operación productiva.
**Storage**: SQLite real de referencia con WAL y synchronous=FULL verificados, transacciones y archivos fuera de public/dist/staticroot;
adaptador de producción pendiente P02 sujeto al mismo contrato. Ningún borrador/token en
localStorage/sessionStorage/cookies/URL. Snapshots del formulario solo en memoria de página.
**Testing**: node:test para validación/servicio/repositorio real y fallos; Playwright/axe en banco de UI,
servicio SQLite compuesto y entorno real, claramente separados. Lectura autorizada por proceso
de pruebas al archivo privado, nunca endpoint de lectura de demostración.
**Target Platform**: frontend estático; Node API tras proxy same-origin con HTTPS externo verificado.
Banco de UI localhost4326; servicio compuesto de prueba localhost4327. Sin nuevo adaptadorSSR ni SDK.
**Project Type**: página pública + servicio de recepción privado en sus datos; sin UI administrativa.
**Performance Goals**: contenido/anclas enHTML, feedback local inmediato, sin SDK/formulario externo;
una solicitud activa por formulario. Límites técnicos32KiB cuerpo y10s espera de cliente, parametrizados
y probados, son protección/recuperación, no SLA de respuesta ni promesa de guardado.
**Constraints**: alias1–60/mensaje1–1500 puntos de código después de trim, formato de correo
compartido, cero éxito antes de persistencia;7anchos×texto100/200%, contraste4.5:1/3:1, control44px.
**Scale/Scope**: tres campos, dos POST técnicos, cuatro recorridos y siete requisitos; instancia
SQLite local de pruebas. Volumen/arquitectura/proveedores productivos y observabilidad de datos
personales no se presumen; el adaptador real deberá demostrar atomicidad y privacidad equivalentes.

## Constitution Check

| Principios | Antes de investigación | Tras diseño |
|---|---|---|
| CONST-01–03 | C01–C07 y opción A delimitan trabajo | Sin registro, respuesta automática, comentarios públicos, CAPTCHA externo o bandeja nueva |
| CONST-04 | IDs/escenarios conservados | Contratos de UI/HTTP/repositorio y guía trazables; no inventar HU/CA históricos |
| CONST-05 | Solo datos aprobados y recuperación necesaria | Tokens opacos por intento, sin rastreo/borradores persistentes; borrado coordinado con 009 |
| CONST-06 | Éxito exige guardado y privacidad real | Commit y ledger atómicos, validación servidor, SQL parametrizado, secretos solo servidor |
| CONST-07 | Consulta nace Pendiente | No marcar Respondido ni simular correo; lectura administrativa pertenece006/008 |
| CONST-08–09 | Recursos, avisos y afirmaciones necesitan evidencia | Gate editorial/operativo; reclamos de rastreo solo verificados; anclas y errores accesibles |
| CONST-10–12 | Diseño/fixtures no equivalen a cierre | MocksUI separados deSQLite real y producción; bloqueos por P01/P02/P03/P04/009/010 explícitos |

Revisión previa y posterior: pasa para diseño y trabajo independiente, sin excepciones.
Un acuseSQLite local no verifica proveedor productivo, correo, retención/canal ni promesas de
privacidad. No habilitar recepción pública final con aviso/proveedor/operación no verificados.
La especificación exige alias/mensaje en caracteres; puntos de código son convención técnica
explícita consistente, no bytes ni maxlength UTF16. La ventana24h limita intentos nuevos,
no la retención de consultas ni el replay de un registro aún existente.

## Project Structure

### Documentation (this feature)

```text
specs/005-contacto-publico/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── contracts/contact.md
├── quickstart.md
└── checklists/requirements.md
```

[tasks.md](tasks.md) contiene el desglose de ejecución; evidencia solo al implementar/verificar.

### Source Code (previsto; no creado por este comando)

```text
src/pages/contacto.astro
src/components/contact/{ContactContent,ContactHero,ContactInstagram,ContactForm,ContactNotice,ContactClosing}.astro
src/content/contact.ts
src/config/contact.ts
src/config/social.ts                       # existente; Instagram único003/005
src/lib/{contact-validation,contact-contract,contact-publication}.ts
src/scripts/contact-form.ts
src/styles/contact.css
server/contact/
├── tsconfig.json
├── start.ts
├── http.ts
├── service.ts
├── attempt-token.ts
├── repository.ts
└── sqlite-repository.ts
scripts/require-contact-publication.mjs
public/images/contact/
playwright.contact.config.ts
playwright.contact.service.config.ts
tests/{contact-validation,contact-publication,contact-service,contact-sqlite}.test.ts
tests/fixtures/contact/{astro.config.mjs,tsconfig.json,public/,src/content.ts,src/pages/}
tests/fixtures/contact-service/serve.ts
tests/e2e/{contact,contact-accessibility,contact-service,contact-integration}.spec.ts
```

**Structure Decision**: PublicLayout pageId=contacto/contentLayout=full. ContactContent preserva
hero→Instagram/formulario→cierre; ContactNotice visible antes de enviar. ContactForm ofrece
#escribir y script específico, sin duplicar menú/foco001. CSS acotado. Módulos puros compartidos
no importan fs/sqlite/secretos al cliente. server/contact mantiene firma/repositorio fuera del bundle.

UIbank: Astrobuild→Python4326 con mocks explícitos deAPI. Banco compuesto: mismos componentes
compilados, servidor de fixture4327 que sirve solo ese staticroot y delega /api/contacto a los
handlers/repo reales; datos/HMAC bajo .test-output/contact-service-data, fuera de ese staticroot.
Servicio de despliegue sirve soloAPI; proxy/hosting de producción se configuran en P02, sin cambios
silenciosos de Astro a SSR ni base de datos dentro depublic. Sin API privada de lectura provisional.

## Phase 0 — Investigación

[research.md](research.md): reutilización, validaciónUnicode/correo, opción A, persistencia,
concurrencia, ciclo de tokens/borrado y separación de pruebas. Investigación delegada según
skill, solo lectura. Se comprobó disponibilidad de node:sqlite/SQLite3.53.3 en memoria, no aplicación.

## Phase 1 — Diseño

[data-model.md](data-model.md) define datos/ledger/estados;
[contracts/contact.md](contracts/contact.md) fijaUI/HTTP/repositorio y códigos de resultado;
[quickstart.md](quickstart.md) separa comandos futuros, datos sintéticos, persistencia local e integración.
Sin incertidumbre técnica propia sin tratamiento. P02/009/010 son dependencias operativas que
bloquean cierre productivo, no excusa para entregar éxito ficticio o evitar probar atomicidad local.

## Estrategia de ejecución posterior

1. Banco de UI/config/tipos y validación compartida; pruebas negativas antes del comportamiento nuevo.
2. Presentación/avisos/shell, manejo de estados y snapshot; mockUI para casos de fallo explícitos.
3. ServicioNode, firma/ledger y adaptador SQLite; probar escritura/reinicio, concurrencia, fallos,
   replay y revocación/borrado con archivos reales y proceso autorizado de prueba.
4. Componer browser+servicio real de prueba, comprobar correspondencia UI→registro sin mocks.
5. Gate y página real conservando guards previos; revisión de recursos/avisos/claims/operación.
6. Matriz, privacidad y regresión afectada; calificar adaptador/proxy/secretos productivos y
   recepción real conP02. Integrar006/008/009/010 sin adelantar funciones de esas features.

Gate local no hace llamadas de red ni acredita operación remota: exige referencias/config
completas y evidencia vigente de calificación externa. Integración comprueba el servicio real.
Se puede aceptar recepción sin una respuesta por correo enviada; no cerrar CT01 ni política009
por pasar005. Sin Materiales/aviso/servicio verificado, render/build de entrega bloqueado.

## Complexity Tracking

Sin infracciones. Receptor separado conserva el frontend estático; SQLite nativo evita proveedor
prematuro y permite evidencia real. Ledger/firma/revocación resuelven concurrencia, incertidumbre
y replay tras borrado; no son cuenta ni seguimiento persistente de visitante. No introducir
huellas permanentes de contenido ni servicio de monitoreo/estadística.

## Registro

2026-10-17 — `$speckit-plan 005`: diseño de fases0/1; sin implementación, instalación,
pruebas de aplicación, commit o despliegue. Capacidad SQLite observada no acredita recepción.

2026-10-17 — Reejecución de `$speckit-plan 005`: se conserva el diseño y la opción A;
se precisa durabilidad SQLite con synchronous=FULL, verificación por conexión y protección
de archivos WAL/SHM. Revisión documental; no acredita implementación ni pruebas de aplicación.

2026-10-17 — Implementación local: se conserva Astro estático y receptor separado. El verificador
privado de integración es un ejecutable local configurado por el operador, nunca una ruta pública.
Se exige firma HMAC en codificación exacta para evitar variantes del mismo token. La comparación
con PDF 4 restauró estructura de tarjetas/invitación y campos en escritorio; identidad/copy finales
siguen pendientes. No se declara P02, 009/010, correo ni calificación visual completos.

## Implementación del MVP local — 2026-10-27

Decisión autorizada en spec/Session2026-10-27. Mantener Astro estático para entrega; una integración de desarrollo atiende los dos POST mediante ContactService/repositorio/HTTP reales. Solo se activa con `PRIVA_CONTACT_TEST_MODE=synthetic`, origen HTTP loopback explícito y almacenamiento privado fuera de la raíz del proyecto. La entrada de Contacto renderiza una copia identificada como prueba solo en DEV con esa opción; nunca aprueba los datos editoriales/operativos reales. Servidor y cliente restringen correo a example.test exclusivamente en ese modo. No hay proveedor de correo, SDKFirebase, cuentas o migración.

La integración exige Host y conexión loopback, no habilita CORS ni proxies, preserva controles Origin/JSON/tamaño y cierra la DB al detener el devserver. Los archivos privados quedan fuera de Vite/staticroot; prueba de acceso por /@fs debe denegarlos. La DB de desarrollo persiste reinicios bajo un directorio temporal canónico y privado, separado de los fixtures y producción. La ruta no se expone en HTML ni respuestas. No añadir inyección de fallos HTTP; las pruebas usan hooks internos existentes o pérdida de respuesta desde su propio proceso.

T050–T053 registran implementación/regresión del MVP, separadas de T045–T048 productivas. T044 puede cerrarse al ejecutar los bancos de005 en los tres motores disponibles del Mac. Pruebas nuevas antes de implementación; después checks/servicio/UI y aceptación sobre página real, sin reemplazar destinos ajenos bloqueados.

Verificación de fase MVP: server/contact/dev-integration.ts reutiliza el servidor HTTP005 como handler de Vite; configura límites de tiempo del HTTP devserver y exige Host/origen/peer loopback. server/contact/development.ts conserva el ledger durable para rechazar correos no ficticios sin crear consultas y sin romper replay/reinicio. src/lib/contact-test.ts solo produce contenido local identificado y regla de dominio; no importa módulos privados al cliente. La barra de desarrollo de Astro se excluye del análisis axe del MVP; ninguna regla de accesibilidad del documento se desactiva. Las 14 celdas de prueba pasan con recursos reales. No hay cambios de arquitectura productiva ni despliegueFirebase.
