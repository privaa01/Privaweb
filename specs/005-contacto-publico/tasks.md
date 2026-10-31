# Tasks: Contacto y recepción privada de consultas

**Feature**: `005-contacto-publico` | **Rama real**: `main` | **Fecha**: 2026-10-17
**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md),
[data-model.md](data-model.md), [contrato](contracts/contact.md), [quickstart.md](quickstart.md)
y [constitución](../../.specify/memory/constitution.md).
**Estado**: 53/53 tareas de la demo; diseño corregido aceptado por la responsable el2026-10-30 («esta perfecto»); producción diferida. Véase [demo-review-2026-10-30.md](demo-review-2026-10-30.md).
**Evidencia**: [evidence.md](evidence.md). No se ha habilitado recepción productiva.
**Tests**: solicitados por los escenarios y SC-001–SC-007 de la especificación. Escribir las
pruebas de comportamiento antes de su implementación y observar un fallo pertinente; no confundir
fallos de infraestructura/importación con prueba de la regla de negocio.

## Formato y alcance

`- [ ] Tnnn [P opcional] [USn cuando corresponde] Acción y archivo`.
Los IDs T001–T049 son locales a esta feature y no sustituyen los IDs históricos ausentes.
`[P]` permite trabajo sobre archivos distintos después de sus prerrequisitos; no autoriza
concurrencia sobre el mismo banco, archivo o base de datos. Las casillas reflejan los resultados y bloqueos registrados en evidence.md.
Las rutas son relativas a la raíz del repositorio. Los archivos futuros citados son entregables,
no evidencia de que existan. No añadir dependencias, cuentas, panel, correo automático ni proveedor
por defecto; frontend Astro estático, recepción Node separada y contrato de repositorio privado.

## Fase 1 — Preparación compartida

**Objetivo**: bancos reproducibles y documentación de dependencias, conservando las features 001–004.

- [X] T001 Registrar inventario inicial de imagen/identidad, textos, Instagram compartido, Manifiesto, responsable/canal de eliminación y dependencias P01/P02/P03/P04/009/010 en `specs/005-contacto-publico/evidence.md`; distinguir recibido, pendiente y revisado, sin inventar aprobaciones ni introducir datos personales reales.
- [X] T002 Crear banco Astro de Contacto en `tests/fixtures/contact/astro.config.mjs`, `tests/fixtures/contact/tsconfig.json`, `tests/fixtures/contact/src/content.ts` y `tests/fixtures/contact/src/pages/contacto.astro`, reutilizando componentes reales y contenido sintético explícito; salida `.test-output/contact`, caché `contact-cache`, nunca fixtures en entrega.
- [X] T003 Configurar `playwright.contact.config.ts`, `playwright.contact.service.config.ts` y scripts `check:contact:contract`, `build:contact:contract`, `test:e2e:contact:contract`, `test:e2e:contact:service`, `test:e2e:contact:integration` en `package.json`; banco UI Python 4326 con mocks explícitos, banco compuesto 4327 sin intercepción de API, integración con `PRIVA_INTEGRATION_BASE_URL` obligatoria sin fallback; reportes/artefactos separados según quickstart, sin cambiar scripts ni guards previos.
- [X] T004 Añadir chequeo estricto noEmit del receptor en `server/contact/tsconfig.json` y script `check:contact:service` en `package.json`, compatible con imports .ts/Node strip-types; documentar Node 24.19.0 y carácter experimental de node:sqlite en `specs/005-contacto-publico/quickstart.md`; asegurar en `.gitignore` exclusión de DB/key/WAL/SHM y salidas sintéticas, sin elevar silenciosamente el requisito del frontend ni agregar paquetes.

## Fase 2 — Fundamentos comunes

**Objetivo**: tipos compartidos y reglas de entrada antes de conectar UI y receptor.
**Prerrequisito**: T001–T004. Completar esta fase antes de implementar las historias.

- [X] T005 Definir DTOs, códigos de error conocidos y discriminantes de resultado en `src/lib/contact-contract.ts`, sin imports de secretos/fs/sqlite: ContactInput, NormalizedContact v1, SignedAttempt y FormState; estados `editing / invalid / preparing / submitting / confirmed / rejected / unknown` y tratamiento explícito de retired/conflict; acuses solo con result/attemptId, nunca datos o estado privado.
- [X] T006 Escribir pruebas de reglas compartidas en `tests/contact-validation.test.ts`: campos faltantes/no string/blancos, alias 0/1/60/61, mensaje 0/1/1500/1501, trim, espacios internos, tildes/emoji/combinantes y correo; verificar que un combinante cuenta otro punto de código y no se normaliza ni trunca contenido.
- [X] T007 Implementar normalización y validación puras en `src/lib/contact-validation.ts` usando Array.from(value).length: nameOrAlias «string requerido; trim extremos,1–60puntos de código; no nombre legal», email «string requerido; trim,1–254puntos de código, regla sintáctica de researchR2», message «string requerido; trim,1–1500puntos de código»; preservar espacios internos/caso y aplicar regex/controles de R2 sin DNS, prueba de identidad ni maxlength UTF16 contradictorio; pasar T006.
- [X] T008 [P] Definir contenido/configuración tipados en `src/content/contact.ts` y `src/config/contact.ts`: recurso con src/dimensiones/alt/referencia/estado, copy revisado ligado al texto exacto, `testOnly`, Notice con responsable/canal/Manifiesto/usos/90d, Claim con evidencia y ámbito vigente, ServiceReadiness con referencias operativas reales; reutilizar `src/config/social.ts`, mantener valores desconocidos pendientes y no incluir claves o ruta de DB en datos del cliente.

**Checkpoint**: tipos/reglas/config disponibles; el servicio y la recepción final todavía no existen.

## Fase 3 — US1: Encontrar el contacto y entender el uso de datos (P1; MVP de presentación)

**Objetivo**: composición PDF 4 y aviso comprensible antes de enviar, sin promesas no verificadas.
**Prueba independiente**: fixture de presentación, sin enviar datos; comprobar orden, temas, textos,
Instagram compartido, #escribir y aviso previo. Pasar fixture no acredita recursos finales ni operación.

### Pruebas primero

- [X] T009 [P] [US1] Escribir en `tests/e2e/contact.spec.ts` recorridos US1.1–US1.6: hero, cuatro temas Instagram, dos indicadores y dos reemplazos de cierre aprobados, advertencia/aviso antes de enviar, tres labels requeridos, imagen fallida sin perder contenido, CTA App y destinos oficiales; probar #escribir directo/recarga/footer/mismo fragmento reutilizando navegación 001, sin crear otro script de foco.
- [X] T010 [P] [US1] Escribir en `tests/contact-publication.test.ts` casos de configuración incompleta, fixtures/testOnly, recursos/textos pendientes, URL Instagram discrepante/no verificada, aviso/Manifiesto/canal/operación faltantes; exigir rechazo de entrega y omisión de claims sin evidencia vigente, manteniendo indicadores aprobados sin promesas sustitutas.

### Implementación

- [X] T011 [P] [US1] Crear `src/components/contact/ContactHero.astro` y `src/components/contact/ContactInstagram.astro`: etiqueta/título/invitación/imagen, indicadores aprobados y cuatro temas anti-phishing/contraseñas/móviles/brechas; enlace oficial desde `src/config/social.ts`, sin # de relleno, URL inventada ni afirmar privacidad del servicio externo.
- [X] T012 [P] [US1] Crear `src/components/contact/ContactNotice.astro` y `src/components/contact/ContactClosing.astro` con almacenamiento, respuesta privada, 90 días desde última actividad, canal real de eliminación y advertencia de datos sensibles; seudónimo no implica anonimato del correo; usar Respondemos al correo que indiques/Puedes usar un alias y claims solo tras evidencia vigente; completar placeholders únicamente en fixtures.
- [X] T013 [US1] Crear estructura semántica de `src/components/contact/ContactForm.astro` con sección #escribir, encabezado, labels/required y `novalidate`, región de errores/estado y aviso previo; sin JS informar dependencia del envío y conservar contenido/anclas, sin GET con PII ni éxito simulado; mantener envío inactivo hasta conectar el comportamiento real de US2.
- [X] T014 [US1] Componer `src/components/contact/ContactContent.astro` y `src/styles/contact.css` en PublicLayout pageId=contacto/contentLayout=full: hero→Instagram/formulario→cierre→footer, Instagram antes en móvil, un h1/lang=es, foco/contraste/controles y estilos acotados; integrar en `tests/fixtures/contact/src/pages/contacto.astro` y pasar T009 sin modificar navegación compartida salvo defecto demostrado.
- [X] T015 [US1] Implementar validación de publicación en `src/lib/contact-publication.ts` y guard `scripts/require-contact-publication.mjs`, pasando T010: rechazar contenido/operación final incompletos y fixtures, validar referencias sin llamadas de red, no confundir booleanos sintéticos con calificación remota; ausencia de evidencia de rastreo omite claims y no bloquea por sí sola los bloques independientes.
- [X] T016 [US1] Ejecutar pruebas de US1/check/build de fixture y registrar composición, destinos, aviso y gates en `specs/005-contacto-publico/evidence.md` con fecha/entorno/criterio/resultado; identificar materiales pendientes como bloqueos de aceptación final, sin marcar fidelidad por una captura sintética.

**Checkpoint**: MVP demostrable de presentación con recursos de prueba; no habilitar recepción pública real.

## Fase 4 — US2: Enviar y guardar en privado (P1)

**Objetivo**: escritura real, estado Pendiente y acuse posterior al commit; recepción anónima sin lectura pública.
**Prueba independiente**: HTTP y navegador con SQLite de archivo real; proceso autorizado relee
alias/correo/mensaje/receivedAt/Pendiente después del envío y tras reinicio. No requiere UI 008 ni correo enviado.

### Pruebas primero

- [X] T017 [P] [US2] Escribir en `tests/contact-sqlite.test.ts` aceptación/relectura de archivo, restricciones del modelo, persistencia tras reinicio, dos escritores con mismo token, conflicto por contenido distinto y dos tokens legítimos de contenido igual; verificar un registro por intento, atomicidad consulta+ledger, PRAGMA efectivos por conexión y permisos DB/key/WAL/SHM, sin afirmar prueba de corte de energía.
- [X] T018 [P] [US2] Escribir en `tests/contact-service.test.ts` contratos de los dos POST: emisión sin PII ni fila, 201 posterior al commit/200 replay, rechazo de Origin/método/formato/UTF8/cuerpo >32KiB, acuse mínimo/no-store/no cookies/CORS amplio y denegación de GET/listado/DB/key; comprobar que errores/logs no incluyen payload/token/IP ni detalles internos.

### Implementación

- [X] T019 [US2] Definir `server/contact/repository.ts` y esquema privado en `server/contact/sqlite-repository.ts`: consulta con id aleatorio estable, nameOrAlias/email/message normalizados, receivedAt UTC servidor, `status='Pendiente'`, `lastActivityAt inicial=receivedAt`; ledger con tokenDigest «SHA256 del token completo; único, nunca bearercrudo o huella del mensaje», attemptId «IDopaco del token aceptado; correspondencia con petición», expiresAt «Copia de expiración firmada, sin renovación», state «COMMITTED / REJECTED / REVOKED, con transiciones terminales indicadas», consultationId «SoloCOMMITTED; FK a consulta existente; eliminar asociación al revocar»; no campos de visitante adicionales ni huella global de contenido.
- [X] T020 [P] [US2] Implementar `server/contact/attempt-token.ts`: versión/base64url, attemptId aleatorio 256 bits, issuedAt UTC y expiresAt=issuedAt+24h, HMAC-SHA256 solo servidor y reloj inyectable; clave persistida una vez fuera del staticroot con permisos privados; validar firma/id/fechas para intentos desconocidos, sin renovar vigencia ni crear identidad/ledger al emitir.
- [X] T021 [US2] Implementar submit atómico en `server/contact/sqlite-repository.ts`: BEGIN IMMEDIATE, UNIQUE(tokenDigest), FK, SQL parametrizado, WAL, synchronous=FULL y busy_timeout=5000 ms efectivos en cada conexión; consulta+COMMITTED en una transacción, ack tras COMMIT; replay compara tupla normalizada con consulta existente y token completo exacto por digest incluso tras 24h/rotación, nunca por ID aislado; conflicto no expone contenido y reintento/lectura no cambia lastActivityAt; pasar casos aplicables de T017.
- [X] T022 [US2] Implementar `server/contact/service.ts` y `server/contact/http.ts` con DTOs/validación compartidos, POST /api/contacto/intentos y /api/contacto/consultas del contrato C2, Origin exacto configurado, JSON UTF8 máximo 32KiB y no-store; no exponer lectura/admin/debug/inyección de fallos HTTP, no inferir not_stored de error ambiguo; pasar T018 y tratar contenido parecido a código como datos.
- [X] T023 [US2] Crear `server/contact/start.ts` para API separada: validar configuración y rutas privadas fuera de public/dist/staticroot, directorio 0700/archivos 0600/umask restrictiva incluidos WAL/SHM, conservar clave al reiniciar y fallar ante configuración insegura; no cambiar Astro a SSR ni asumir proveedor; documentar arranque local sintético y proxy/HTTPS requerido en `specs/005-contacto-publico/quickstart.md`.
- [X] T024 [US2] Conectar `src/scripts/contact-form.ts` a `src/components/contact/ContactForm.astro`: validar antes de preparar intento, capturar snapshot normalizado en memoria, preparar sin PII, bloquear doble click/Enter y anunciar Enviando; aceptar solo acuse correlacionado con generación/petición vigentes tras guardado, sin decir correo enviado ni borrar valores prematuramente; errores genéricos preservan datos sin éxito, y corrección/recuperación detalladas se completan en US3/US4.
- [X] T025 [US2] Crear `tests/fixtures/contact-service/serve.ts` usando los mismos handlers/repositorio reales y HTML compilado del fixture: servir solo staticroot permitido, datos sintéticos/HMAC en `.test-output/contact-service-data` fuera de ese directorio, puerto 4327 y puertos efímeros en node:test; lifecycle y fallos solo por inyección interna de pruebas, sin endpoint ni header público especial.
- [X] T026 [US2] Escribir y ejecutar `tests/e2e/contact-service.spec.ts` con formulario real sin intercepción de API: envío válido con alias, Pendiente/receivedAt/valores privados contrastados mediante lectura de DB por proceso autorizado, doble click/Enter sin duplicar, reinicio y replay; comprobar que no hay lecturas públicas ni éxito antes del commit, y que el éxito aparece después del commit confirmado; registrar resultados en `specs/005-contacto-publico/evidence.md` separados de mocks UI.
- [X] T027 [US2] Ejecutar `check:contact:service`, pruebas Node de US2 y banco compuesto desde `specs/005-contacto-publico/quickstart.md`; documentar versiones, PRAGMA, permisos, counts/resultados y evidencia en `specs/005-contacto-publico/evidence.md`, sin claves/payloads reales ni equiparar SQLite local a P02 productivo.

**Checkpoint**: recepción real local con datos sintéticos, semántica mínima segura ante errores.
No afirmar terminado C05/C06 hasta completar US3 y US4.

## Fase 5 — US3: Corregir antes de enviar (P2)

**Objetivo**: errores accesibles y reglas equivalentes aunque se omita validación del navegador.
**Prueba independiente**: fronteras inválidas no crean consulta; errores asociados conservan valores,
la corrección usa datos actuales y un rechazo terminal requiere intento nuevo.

### Pruebas primero

- [X] T028 [P] [US3] Ampliar `tests/e2e/contact.spec.ts` con US3.1–US3.6: tres campos obligatorios, fronteras/Unicode/trim/correo de T006, labels y errores con teclado/foco/aria, conservación de valores y limpieza de errores obsoletos al corregir; usar mocks explícitos para rechazos de campo y verificar que ninguna respuesta corresponde a datos anteriores.
- [X] T029 [P] [US3] Ampliar `tests/contact-service.test.ts` con POST directo que omite cliente: faltantes/no string/campos inesperados/blancos/límites/correo/inyección como texto; cero consultas inválidas y 422 solo con REJECTED durable, serializado frente a COMMITTED concurrente; contención/error de DB no autoriza not_stored.

### Implementación

- [X] T030 [US3] Implementar errores de campo/resumen y gestión de foco en `src/scripts/contact-form.ts` y `src/components/contact/ContactForm.astro`: aria-invalid/aria-describedby, texto visible y primer inválido localizable, no solo color/placeholder; validar valores actuales, no usar maxlength UTF16 contradictorio y no perder datos; pasar T028.
- [X] T031 [US3] Completar terminalReject/validación de servidor en `server/contact/service.ts` y `server/contact/sqlite-repository.ts`: validar misma normalización v1, REJECTED sin consulta ni PII y terminal que nunca puede crear consulta después; ante COMMITTED existente devolver replay/conflict, no rechazo falso; errores de campo solo códigos conocidos, sin payload ni inferir ausencia de un rollback; pasar T029.
- [X] T032 [US3] Integrar rechazo confirmado en `src/scripts/contact-form.ts`: liberar edición conservando valores, descartar intento REJECTED y pedir token nuevo al reenviar; limpieza de errores/acuse de datos anteriores y fallo durante preparación no envían PII ni bloquean corrección; comprobar corrección→envío válido en `tests/e2e/contact-service.spec.ts` sin mocks.
- [X] T033 [US3] Ejecutar T006/T028/T029 y corrección del banco compuesto; registrar validación cliente/servidor, ausencia de consulta inválida y observaciones de accesibilidad en `specs/005-contacto-publico/evidence.md`, sin atribuir validación sintáctica a identidad o entrega de correo.

## Fase 6 — US4: Errores y resultado desconocido (P2)

**Objetivo**: cumplir opción A y recuperar acuse sin duplicar ni resucitar datos eliminados.
**Prueba independiente**: fallos antes de commit y pérdida de respuesta después de commit, dos
solicitudes concurrentes, reintento de mismo snapshot y otra consulta explícita; DB y UI coherentes.

### Pruebas primero

- [X] T034 [P] [US4] Ampliar `tests/contact-sqlite.test.ts` con pérdida de respuesta tras commit, fallo previo/rollback incierto/DB ocupada, carrera REJECTED frente a escritor tardío, replay tras expiración/rotación, revoke/purga/expiración y ausencia de resurrección; fallos/reloj solo por inyección del proceso, sin API de prueba pública, sin actualizar lastActivityAt ni conservar huellas de contenido.
- [X] T035 [P] [US4] Ampliar `tests/e2e/contact.spec.ts` con US4.1–US4.6: rechazo terminal vs 500/503/cuerpo inválido/acuse no correlacionado/timeout/servicio ausente; snapshot+token inmutables readonly en unknown, Reintentar exacto, doble Enter, advertencia y acción Continuar para otra consulta, y respuesta/finally antiguos incapaces de modificar la nueva generación; abort no equivale a cancelación.

### Implementación

- [X] T036 [US4] Completar clasificación de fallos en `server/contact/service.ts` y `server/contact/http.ts`: not_stored solo tras terminal durable y exclusión de commit concurrente, fallos ambiguos→unknown genérico, retired/conflict sin falso éxito ni garantía de ausencia; permitir fallo de respuesta por composición interna de pruebas sin publicar controles; pasar casos correspondientes de T034.
- [X] T037 [US4] Implementar revoke/sweepOpaqueReceipts en `server/contact/sqlite-repository.ts`: borrar consulta/PII/asociación y pasar a REVOKED en la misma transacción, solo metadatos opacos hasta expiresAt; después purgar y rechazar token desconocido expirado, REJECTED/REVOKED nunca vuelven a COMMITTED; replay conocido con consulta aún existente sigue permitido tras 24h/rotación por digest exacto; pasar T034 y documentar integración futura 009, sin scheduler ni promesa de borrado físico de copias.
- [X] T038 [US4] Completar estados/reintentos en `src/scripts/contact-form.ts`: espera de cliente 10s configurable/probada, timeout/desconexión/acuse inválido→unknown, conservar snapshot+token readonly, Reintentar idéntico sin renovar token, retired/conflict sin confirmación falsa; no almacenamiento persistente de campos/token en navegador/URL, no borrar valores por abort ni fallo; pasar casos correspondientes de T035.
- [X] T039 [US4] Implementar Otra consulta con advertencia y acción explícita de continuar en `src/components/contact/ContactForm.astro` y `src/scripts/contact-form.ts`; generación y secuencia aíslan respuestas/finally viejos, preparar consulta nueva no cancela ni niega guardado anterior; rechazo confirmado conserva edición y token nuevo; pasar el resto de T035.
- [X] T040 [US4] Ampliar y ejecutar `tests/e2e/contact-service.spec.ts` con fallo antes de commit y respuesta perdida después de commit en servicio real: reintento confirma exactamente una consulta, dos intentos deliberados pueden guardar contenido igual y generaciones viejas no contaminan la nueva; contrastar DB mediante proceso autorizado, sin interceptar API ni confiar solo en HTTP 200.
- [X] T041 [US4] Ejecutar pruebas de recuperación UI/servicio/repositorio y registrar en `specs/005-contacto-publico/evidence.md` distinción fallo confirmado/desconocido, datos conservados, correlación, conteos y borrado/replay; no declarar cerrada política 009 por probar el contrato de revocación.

## Fase 7 — Integración, accesibilidad y cierre transversal

**Prerrequisito**: historias aplicables verificadas; ejecutar las tareas independientes de dependencias
externas sin esperar recursos/proveedor. Una tarea parcialmente bloqueada permanece abierta.

- [X] T042 Integrar página real `src/pages/contacto.astro` con PublicLayout y assert de publicación de T015; añadir guard de Contacto a `package.json` antes de Astro build sin retirar guards 001–004 ni crear páginas de relleno; verificar rechazo con configuración incompleta y que no se importe fs/sqlite/HMAC al bundle público, sin bypass de entrega.
- [X] T043 Escribir y ejecutar matriz accesible en `tests/e2e/contact-accessibility.spec.ts`: 360/390/430/768/1024/1280/1440 px × texto 100%/200%, navegación/anclas al cargar, Instagram antes en móvil, sin recorte/desbordamiento impeditivo, teclado/foco/errores/estados anunciados, axe y contraste 4.5:1/3:1/control 44px; probar sin JS sin GET de PII, ausencia de storage/cookies de este flujo y conservar contenido cuando falla imagen; registrar evidencia en `specs/005-contacto-publico/evidence.md`.
- [X] T044 Revalidar Chromium/Firefox/WebKit con `playwright.contact.config.ts` y `playwright.contact.service.config.ts`, ejecutando los bancos según `specs/005-contacto-publico/quickstart.md`; diagnosticar arranques fallidos sin desactivar protecciones, registrar navegador/fecha/resultado y los fallos conocidos de Firefox/WebKit como bloqueos si persisten, no como pruebas pasadas.
- [X] T045 Validar la composición restaurada de Contacto según wireframe, avisos/destinos y revisión visual final; conservar el teclado/VoiceOver específico reportado para los controles previos sin atribuirlo a una nueva aceptación visual; conservar recursos oficiales del producto completo y cotejo PDF4 diferido. Registrar evidencia en demo-review-2026-10-30.md, sin inferir revisión de001/003/004.
- [X] T046 Calificar únicamente operación demo Firestore: valores ficticios, reglas create-only, acceso público denegado y avisos coherentes. Retención90d, copias/restauración, eliminación productiva, identidad/canal completos, ledger/replay y recogida real009/010 siguen pendientes según demo-scope-2026-10-30.md; no certificarlos con esta demo.
- [X] T047 Ejecutar tests/demo-contact-live.mjs contra Firebase publicado y Firestore real, sin API interceptada: guardado ficticio, lectura privada autorizada, denegaciones públicas, doble envío y limpieza exclusiva de documentos de prueba. No crear endpoint público de lectura ni afirmar entrega de correo.
- [X] T048 Verificar build:demo, despliegue correctivo, matriz de Contacto publicada y tipado/check apropiados. Separar pruebas Firebase reales de UI y SQLite históricos. Conservar guards y build productivo009/010 pendientes; documentar fallos iniciales y correcciones sin contarlos como aprobados.
- [X] T049 Sincronizar `specs/005-contacto-publico/tasks.md`, `specs/005-contacto-publico/spec.md`, `specs/005-contacto-publico/quickstart.md`, `specs/005-contacto-publico/evidence.md` y `specs/TRACEABILITY.md` con tareas realmente completadas, escenarios/SC cubiertos, evidencia y bloqueos; cerrar C01–C07 solo con criterios aplicables probados, sin inventar HU/CA/TSK históricos, marcar implementación por diseño ni hacer commit/push sin petición.

## Dependencias y orden de ejecución

```text
T001 → T002 → T003 → T004
                    ↓
             T005 → T006 → T007
                 ↘ T008
                    ↓
         US1 (T009–T016): presentación
                    ↓
         US2 (T017–T027): recepción real local
                    ↓
         US3 (T028–T033): corrección completa
                    ↓
         US4 (T034–T041): recuperación completa
                    ↓
         T042–T044 → T045/T046 → T047 → T048 → T049
```

- T008 depende de T005; puede avanzar mientras T006/T007 trabajan en otros archivos.
- US1 empieza tras fundamentos. T009/T010 preceden las implementaciones que verifican;
  T011/T012 se pueden desarrollar juntos tras esos contratos; T013→T014, T010→T015,
  T014/T015→T016. Presentación no depende del servicio ni de un proveedor para su banco.
- US2 usa el formulario US1. T017/T018 preceden backend; T019 define repositorio antes de T021;
  T020 puede avanzar tras T019, separado de la implementación SQLite, y ambos preceden T022.
  T023/T024→T025→T026→T027. Reintento básico del repositorio es parte de integridad US2;
  pruebas y tratamiento completo de fallos pertenecen a US4, sin duplicar implementación.
- US3 y US4 reutilizan los mismos archivos de servicio, repositorio, script y pruebas; ejecutar
  por fases, sin asignarlas como ramas paralelas incompatibles. Pruebas independientes de UI y
  repositorio sí pueden escribirse simultáneamente una vez estables los contratos previos.
- T028/T029 preceden T030/T031; T030/T031→T032→T033. T034/T035 preceden T036–T039;
  T036/T037 y T038/T039 afectan archivos comunes dentro de cada par, por lo que son secuenciales;
  toda la implementación de recuperación precede T040/T041.
- T042/T043 pueden verificarse con configuración sintética solo en bancos explícitos; no equivalen
  a entrega aprobada. T045 y T046 son puertas externas independientes; T047 exige ambas y un
  entorno operativo real. Fallos conocidos no detienen tareas independientes ni se ocultan.
- Cada servicio/banco tiene su puerto y carpeta; no correr simultáneamente dos builds de Contacto
  ni tests que compartan la misma base. Node tests deben aislar archivos/conexiones/puertos.

## Oportunidades de paralelo por historia

| Historia | Ejemplo con prerrequisitos cumplidos | Restricción |
|---|---|---|
| US1 | T009 en tests/e2e/contact.spec.ts + T010 en tests/contact-publication.test.ts; luego T011 + T012 | T014 compone después; no editar contenido/config compartidos desde ambos trabajos |
| US2 | T017 en tests/contact-sqlite.test.ts + T018 en tests/contact-service.test.ts; tras T019, T020 puede avanzar mientras T021 implementa SQLite | T022 necesita token/repositorio listos; no correr escritores de pruebas sobre DB compartida |
| US3 | T028 en tests/e2e/contact.spec.ts + T029 en tests/contact-service.test.ts | Implementaciones T030/T031 después; T032 integra una vez ambas estén listas |
| US4 | T034 en tests/contact-sqlite.test.ts + T035 en tests/e2e/contact.spec.ts | T040 requiere ambas ramas de implementación; callbacks y clasificación no se implementan dos veces |

Estos ejemplos describen posibilidades de ejecución, no solicitan crear subagentes automáticamente.

## Trazabilidad de requisitos a tareas y verificación

| Fuente / requisito | Historia | Tareas principales | Prueba / aceptación |
|---|---|---|---|
| C01 / FR-001 | US1.1 | T008–T009, T011, T014, T045 | T016/T043/T045/T047; SC-001/006/007 |
| C02 / FR-002 | US1.1/6 | T008, T010–T011, T015, T046 | T016/T045–T047; SC-001/005/007 |
| C03 / FR-003 | US1.2 | T008–T009, T011, T014 | T016/T043/T045/T047; SC-001/006/007 |
| C04 / FR-004 | US1/US2/US3 | T005–T007, T013, T019, T024, T028–T033 | T006/T026/T033/T043/T047; SC-002/003/006 |
| C05 / FR-005 | US2/US3/US4 | T006–T007, T017–T024, T028–T041 | T027/T033/T041/T043/T047; SC-002/004/006 |
| C06 / FR-006 + opción A | US2/US3/US4 | T017–T027, T029–T041, T046–T047 | DB autorizada + replay/reinicio/fallos/borrado; SC-003/004/007 |
| C07 / FR-007 | US1.4–6; US2.4 | T008–T010, T012–T016, T024, T045–T047 | Aviso previo/claims/operación; SC-005/007 |

SC-001→T009/T016/T047; SC-002→T006/T028/T029/T033; SC-003→T017/T018/T026/T027/T047;
SC-004→T017/T034/T035/T040/T041; SC-005→T010/T012/T016/T045/T046;
SC-006→T043–T045; SC-007→T010/T015/T045–T049. La matriz es cobertura prevista,
no pruebas ejecutadas ni aceptación anticipada. Archivo de evidencia se crea en T001.

## Estrategia de implementación y cierre

1. Completar preparación/fundamentos y US1 como MVP de presentación. Validar de forma
   independiente en fixture; no desplegar recepción ni publicar recursos/avisos ficticios.
2. US2 agrega persistencia real local. US3 y US4 completan corrección y recuperación;
   P2 no significa opcional: recepción final requiere las cuatro historias y sus SC aplicables.
3. Completar seguridad/accesibilidad/regresión y calificar materiales/operación reales.
   Si P02 o materiales faltan, entregar trabajo independiente con estado parcial explícito;
   no marcar T045–T047 por pasar mocks o SQLite de referencia.
4. Ante bloqueos, anotar causa/criterio/evidencia/acción pendiente en evidence.md y mantener
   casilla abierta. No ampliar alcance para fabricar proveedor, política o identidad.
5. La revocación probada aquí prepara integración 009: no acredita scheduler, copias o borrado
   físico. Estado inicial Pendiente no cierra UI 008, envío/lectura de correo o CT01.
6. Revisar con `$speckit-analyze 005` antes de `$speckit-implement 005`.

## Resumen de generación

49 tareas: preparación 4, fundamentos 4, US1 8, US2 11, US3 6, US4 8, cierre 8.
12 tareas marcadas [P] en la generación. Implementación posterior: 44 completadas;
cinco abiertas por navegadores, materiales/revisión manual, operación e integración real.
Las pruebas locales y regresiones constan en evidence.md; no equivalen al cierre productivo.
Sin hooks before_tasks/after_tasks configurados al generar (extensions.yml ausente).

## Estado de cierre — 2026-10-17

| Tarea abierta | Trabajo realizado / condición restante |
|---|---|
| T044 | Chromium probado; Firefox no encuentra perfil y WebKit requiere bibliotecas del sistema. Matriz completa entre navegadores pendiente. |
| T045 | Composición cotejada con PDF 4 usando imágenes sintéticas; recursos/copy/identidad oficiales y lector de pantalla/fidelidad final pendientes. |
| T046 | Contrato, guard y referencia SQLite operativos localmente; proveedor, calificación operativa y aviso/canal/retención/copias reales pendientes P02/009/010. |
| T047 | Suite real y verificador privado definidos; no hay URL real ni acceso privado calificado para ejecutar integración. |
| T048 | Checks, bancos y regresiones pasan; build final bloqueado por guard editorial 002 y gates finales pendientes, incluido 005. |

T049 completa la sincronización documental del estado parcial; no marca C01–C07 como cerrados.
No hubo commit, push ni despliegue. Checklists de calidad se conservaron sin modificación.

## Fase MVP local — 2026-10-27

Autorización: ejecutar005 después de confirmar Firebase futuro, correo sin proveedor y datos solo ficticios. No cambia ni cierra condiciones productivas previas.

- [X] T050 Implementar modo de desarrollo integrado explícito en `server/contact/development.ts`, `server/contact/dev-integration.ts`, `astro.config.mjs`, `src/pages/contacto.astro` y componentes/formulario: loopback, misma API/persistencia real, DB fuera del checkout, aviso sintético/dominio example.test, confirmación sin correo y guards productivos intactos.
- [X] T051 Escribir primero y ejecutar `tests/contact-development.test.ts` para dominio/rechazo terminal/replay/reinicio, aislamiento de origen/datos y denegación de arranque inseguro; no controles de fallo/lectura HTTP públicos. Revalidar pruebas005 afectadas y typecheck.
- [X] T052 Ejecutar `tests/e2e/contact-development.spec.ts` con página real en dev explícito, recursos oficiales, API no interceptada y lectura DB privada: validación, guardado, mismo intento/doble envío, acceso a archivos denegado, sin correo ni claims; navegadores y matriz. Mantener pendientes destinos ajenos, revisión manual y producción.
- [X] T053 Sincronizar spec, plan, contrato, guía, tareas, matriz e informe de005 con resultados reales del MVP y bloqueos de T045–T048; conservar pendientes por criterios, sin aprobación sintética ni commit/push/despliegue.

## Resultado de la ejecución MVP — 2026-10-27

T044 completa: 117 pruebas de UI (39 por motor) y 12 de servicio/SQLite (4 por motor), Chrome/Firefox/WebKit, sin omisiones. T050–T053 completas: modo explícito de desarrollo sobre Contacto real, aislamiento y persistencia, 70 pruebas Node, 26 pruebas del MVP (12 recorridos principales de tres motores +14 celdas Chromium) y documentación sincronizada. No se suman repeticiones de pruebas de corrección/captura como cobertura nueva.

T045 parcial: imágenes/marca/fuente/paleta e Instagram recibidos y usados; faltan revisión editorial/manual/lector final. T046 parcial: Firebase web elegido y datos solo ficticios en esta etapa; no califica origen/almacenamiento/privacidad productivos. T047 parcial: integración real de componentes+API+SQLite local verificada, no integración calificada de entrega ni dependencias003/004/006/009/010. T048 parcial: checks y regresión de Contacto aprobados, build de entrega bloqueado por010/009 y otros destinos. No se marcaron estas cuatro casillas.

2026-10-30 — T045–T048 completas para el alcance demo,53/53. Revisión manual específica confirmada;45/45 matriz,15 comprobaciones de reglas y3 navegadores con persistencia real. Reglas y tamaño de selectores WebKit corregidos y publicados. Producción conservada diferida; véase demo-review-2026-10-30.md.

2026-10-30 — Observación de la responsable: «el contactanos no es igual que el wireframe». Se restaura hero/ilustración, Instagram, columnas y cierre, conservando datos ficticios. T045 reabierta: la aceptación del formulario no acreditaba fidelidad visual.45/45 pruebas del build corregido conformes; ver wireframe-correction-2026-10-30.md.

2026-10-30 — La responsable aceptó la vista corregida: «esta perfecto, realiza commit y sube cambios». T045 cerrada para la demo;53/53 tareas. Esta aceptación no acredita cotejo técnico independiente contra PDF4 ni producción.
