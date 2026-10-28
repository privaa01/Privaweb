# Tasks: Documentos informativos y recuperación 404

**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/public-documents.md), [quickstart.md](quickstart.md).
**Fecha**: 2026-10-20. **Rama real**: `main`; selección010. **Estado**: 35/44 tareas verificadas localmente; 9 parciales/bloqueadas. Detalle en `evidence.md`; sin cierre productivo.

## Formato y reglas de ejecución

`- [ ] TNNN [P?] [USn?] Acción con ruta`. `[P]` significa archivos distintos y dependencias previas completas, no autorización para ignorar el orden. Rutas relativas a raíz del repositorio. Todas las tareas desarrollan X03/FR-001, sin nuevos IDs originales ni HU/CA/TSK históricos.

Las pruebas están justificadas por los escenarios/criterios verificables del spec y los contratos HTTP/publicación. Escribir primero los casos afectados, observar fallo por comportamiento ausente y luego implementar; un fallo de entorno no acredita prueba negativa. Evidencia compartida se escribe secuencialmente. No modificar checklists por existir código ni contar fixture como calificación real. No commit/push/despliegue implícitos.

## Phase 1 — Setup

**Propósito**: preparar alcance, banco de pruebas y registro de dependencias sin cambiar stack o servicios009.

- [x] T001 Registrar línea base, versiones fijadas, selección010, estado de trabajo y gates actuales en `specs/010-documentos-recuperacion/evidence.md`; preservar commit009 y documentos010, sin reinstalar dependencias si ya están disponibles.
- [x] T002 [P] Crear inventario de revisión P02/P03 y cobertura R-02–05 en `specs/010-documentos-recuperacion/content-review.md`, con estado pendiente, responsable/canal/proveedores/ubicación/copias/políticas de otras categorías/vigencia/permisos por verificar; no rellenar valores oficiales ficticios.
- [x] T003 Crear raíz Astro sintética `tests/fixtures/documents/astro.config.mjs` y `tests/fixtures/documents/tsconfig.json`, salida/cache bajo `.test-output/documents*`, sin recursos oficiales simulados ni salida mezclada con `dist`.
- [x] T004 Configurar comandos previstos de `quickstart.md` en `package.json` y modos local/integrado en `playwright.documents.config.ts`: Chrome/Firefox/WebKit, puerto loopback libre y artefactos aislados. Para US1/US2 configurar en `webServer` el build de fixture y `python3 -m http.server` con ese puerto, `--bind 127.0.0.1 --directory .test-output/documents`, cierre de proceso y `reuseExistingServer:false`; seleccionar solo suites de lectura/aviso disponibles, sin suites de recuperación hasta T027. Integración exige baseURL real y nunca inicia fixture.

## Phase 2 — Foundational

**Bloquea** el inicio de las historias; contratos comunes antes de los incrementos.

- [x] T005 Definir `DocumentBundle`, `EditorialReview` y `RecoveryDestination` en `src/content/documents.ts`: `revision` identificable, `testOnly`, idioma `es`, IDs estables `terms`/`manifesto`, título/ruta fija/secciones ID-título-párrafos-enlaces, aviso/datos públicos y vigencia aplicable; «Nunca incluir secretos, consultas, correos de visitantes o código de eliminación».
- [x] T006 Añadir configuración pendiente en `src/config/documents.ts` y bundle sintético completo en `tests/fixtures/documents/content.ts`; conservar «Ausente es pendiente, no una cadena ficticia aceptable»; fixture `testOnly:true`, entrega `testOnly:false`, sin conceder revisión oficial a C32.
- [x] T007 Implementar serialización canónica/huella SHA-256 y definición de revisión en `src/lib/documents-review.ts`: `status` pendiente/revisado, revisor autorizado, fecha válida no futura, referencia resoluble, huella de texto+datos y del conjunto; «excluye el propio registro de aprobación». Cambiar contenido invalida revisión afectada/conjunto; ninguna dependencia del gate009.
- [x] T008 Adaptar contexto auxiliar en `src/layouts/PublicLayout.astro` y `src/components/SiteHeader.astro`, preservando `src/config/navigation.ts`: cuatro enlaces/menú/logo existentes, ningún activo principal falso ni CTA prestado, sin ampliar `pages[]`; permitir metadatos de privacidad de404.
- [x] T009 Crear fábrica aislada de páginas de fixture y ayudantes en `tests/fixtures/documents/pages.ts` y `tests/helpers/documents-fixtures.ts`, con cuatro entradas públicas sintéticas, destinos fijos de anclas, referencias temporales y HTML compartido con producción; no reimplementar la UI en la fixture.

**Checkpoint**: contenido/tipos, revisión, layout y fixture utilizables; gates productivos siguen cerrados. El servidor especial404 pertenece a US3: US1/US2 usan el servidor estático temporal conectado en T004, con rutas válidas disponibles tras crear sus páginas; su error genérico no cuenta como aceptación010. T016/T022 no dependen de T026/T027.

## Phase 3 — US1: Consultar información del servicio (P1, MVP local)

**Objetivo**: consultar documentos sin cuenta y detectar revisión inválida.
**Prueba independiente**: dos accesos directos y ocho desde footer, salidaInicio; contenido revisable y rechazo de faltantes. No requiere envío de Contacto ni servidor privado.

### Tests

- [x] T010 [P] [US1] Crear casos V01/V02/V03 en `tests/documents-publication.test.ts`: datos/secciones vacíos, marcadores, protocolos distintos de `https:`/`mailto:` o rutas fijas, fechas futuras, referencias ausentes, cambios tras revisión, huella alterada, `testOnly` y discrepancia009; positivo sintético únicamente para el mecanismo de revisión.
- [x] T011 [P] [US1] Crear recorrido V04 en `tests/e2e/documents.spec.ts`: diez accesos,200/h1/título/salida, header auxiliar sin `aria-current` falso, navegación por teclado y menú; contenido C32 esperado y ausencia de datos privados.

### Implementación

- [x] T012 [US1] Implementar validación editorial pura en `src/lib/documents-publication.ts`: campos/secciones R-02–05, rutas fijas, enlaces seguros, revisiones/huellas vigentes, concordancia de compromisos y rechazo de fixture en entrega; estados pendiente/discrepante/revisado editorialmente, sin equiparar este último con elegibilidad productiva.
- [x] T013 [US1] Desarrollar textos base estructurados C32 en `src/content/documents.ts` y revisión de contenido en `specs/010-documentos-recuperacion/content-review.md`: finalidad educativa sin garantías, prototipo/descargas, contacto privado sin SLA, sin registro público, externos, ejercicios locales/cookies comprobadas, políticas distintas y retención009; faltantes oficiales permanecen bloqueantes.
- [x] T014 [P] [US1] Construir lectura semántica escapada en `src/components/documents/InformativeDocument.astro` y `src/styles/documents.css`: título/h1/secciones/enlaces/Inicio, sin HTML arbitrario, API nueva o scripts necesarios para leer, jerarquía/foco/texto adaptable.
- [x] T015 [US1] Crear `src/pages/terminos.astro` y `src/pages/manifiesto-datos.astro` con contenido/layout compartidos y sus entradas de `tests/fixtures/documents/src/pages/`; no publicar pendientes como definitivos ni modificar las cuatro páginas del menú.
- [x] T016 [US1] Ejecutar V01–V04 y regresión de header/layout001; registrar resultados locales/sintéticos, casos pendientes y comandos realmente disponibles en `specs/010-documentos-recuperacion/evidence.md`; no aprobar P02/P03 o SC productivos por pasar fixture.

**Checkpoint**: MVP local verificable de US1. Publicación y textos finales siguen condicionados al cierre externo.

## Phase 4 — US2: Entender el formulario antes de enviar (P1)

**Objetivo**: aviso previo, coherente y accesible sin nuevos requisitos para visitantes.
**Prueba independiente**: abrir Contacto sintético, leer aviso, seguir Manifiesto y regresar sin enviar datos; no requiere correo/backend real.

### Tests

- [x] T017 [P] [US2] Crear casos V05 de adaptación/coherencia en `tests/documents-notice.test.ts`: igualdad con fuente canónica, datos/precauciones/plazo, cambios invalidan snapshot005, sin90d para otras categorías ni24h como garantía de respuesta.
- [x] T018 [P] [US2] Crear recorrido V06 en `tests/e2e/documents-notice.spec.ts`: aviso antes de enviar, tres datos obligatorios/alias admitido, no publicación, enlace/regreso por teclado, sin cuenta/checkbox nuevo ni storage/URL de borrador.

### Implementación

- [x] T019 [US2] Adaptar `src/content/contact.ts` y `src/config/contact.ts` para consumir aviso del bundle canónico conservando `ContactContent.notice`/snapshots005; incluir «No incluyas contraseñas, códigos de acceso, datos bancarios, documentos ni información sensible o de otras personas»; sin copias editables independientes.
- [x] T020 [US2] Integrar aviso en `src/components/contact/ContactNotice.astro`, conservando orden/accesibilidad005 y canal únicamente verificado; añadir regreso a `/contacto.html#escribir` desde Manifiesto en `src/components/documents/InformativeDocument.astro`, sin persistir formulario ni prometer restaurarlo tras recarga.
- [x] T021 [US2] Vincular `src/lib/contact-publication.ts` a validación editorial pura010 y adaptar fixture Contacto en `tests/fixtures/documents/src/pages/contacto.astro`; mantener checks de recursos/canal/operación005 y gates009, sin ciclo contenido→gate→evidencia.
- [x] T022 [US2] Ejecutar V05/V06 y regresión proporcional005 de contenido/validación/teclado, registrar alcance y resultados en `specs/010-documentos-recuperacion/evidence.md`; comprobar que origen/canal ficticios no se usen para recopilar datos reales.

## Phase 5 — US3: Recuperarse de una ruta pública inexistente (P2)

**Objetivo**: error reconocible404 con salida válida, anclas y fronteras privadas preservadas.
**Prueba independiente**: fixture010 compilada y servidor local representativo; desconocida simple/anidada→404+cuerpo propio, teclado→Inicio; no requiere documentos aprobados productivos.

### Tests

- [x] T023 [P] [US3] Crear V07/V08 en `tests/documents-http.test.ts`: GET/HEAD desconocidas simples/anidadas/con extensión/query, recarga, cuerpo propio/status404/HEAD vacío, nunca redirect/fallback200; MIME de recurso conocido, ausente404, sin listado/traversal/symlink fuera de raíz y prefijos privados excluidos del fallback.
- [x] T024 [P] [US3] Crear V09/V10 en `tests/e2e/documents-recovery.spec.ts`: página404/h1/salidaInicio sin bucle, URL con sentinelas no reflejada, referrer sin ruta sensible, cuatro anclas/encabezados visibles/foco/teclado y ausencia de `#maria`; `/404.html` directo solo valida presentación.

### Implementación

- [x] T025 [US3] Crear `src/components/documents/NotFound.astro` y `src/pages/404.astro`, entrada de fixture en `tests/fixtures/documents/src/pages/404.astro`: mensaje fijo español, Inicio/recursos de raíz, sin pathname/query/hash/referer en cuerpo ni reporte externo; metadato temprano no-referrer.
- [x] T026 [US3] Implementar servidor de prueba `scripts/serve-documents.mjs` con loopback/raíz explícita, MIME y GET/HEAD,404 preservado con cuerpo010, no-referrer, rutas confinadas y sin logs sensibles; excluir `/api/`/`/admin/` y prefijos reservados, rechazar traversal/symlink fuera de raíz y evitar listado. No presentarlo como hosting productivo.
- [x] T027 [US3] Sustituir el servidor temporal de T004 por `scripts/serve-documents.mjs` en el modo local de `playwright.documents.config.ts`, habilitar suites de recuperación y cerrar procesos correctamente; mantener integración sin fixture ni servidor automático y pruebas V07 con puertos libres/directorios temporales.
- [X] T028 [US3] Verificar cuatro destinos reales003/004/005 según R-07 y condiciónQR, documentando mapa y estado en `specs/010-documentos-recuperacion/delivery-review.md`; corregir solo enlaces afectados de `src/config/navigation.ts` o encabezados responsables si incumplen, sin añadir `#maria`, destinos inventados o QR nuevo.
- [x] T029 [US3] Ejecutar V07–V10 en navegadores disponibles y registrar resultados en `specs/010-documentos-recuperacion/evidence.md`; diferenciar sintético local de pruebas contra sitio real y preservar errores/autorización006/008/009 sin afirmar cobertura privada por excluir prefijos en fixture.

## Phase 6 — Controles y cierre transversal

**Propósito**: conectar protección de entrega, revisar calidad y completar evidencia real. Los controles técnicos pueden avanzar antes de completar P02/P03; ninguna tarea externa se cierra con dobles.

- [x] T030 Crear V11 en `tests/documents-readiness.test.ts` y ampliar `tests/privacy-readiness.test.ts`: evidencia de otro bundle/revisión, caducada/futura/sintética, archivo alterado, `notices` válido con otros scopes ausentes; observar fallos específicos por la vinculación ausente antes de T031, no fallos de entorno; debe rechazar publicación. Positivos unitarios solo validan mecanismo, sin habilitar configuración real.
- [x] T031 Implementar correspondencia evidencia009 scope `notices`↔huella exacta del bundle/revisión de entrega en `server/privacy/readiness.ts` y `src/config/documents.ts`, mediante entrada explícita o adaptador acíclico sin imports de contenido público hacia servicios; preservar otros scopes/fechas/hashes, sin fabricar evidencia productiva; ejecutar después los casos de T030 y comprobar que pasan.
- [x] T032 Conectar `scripts/require-documents-publication.mjs`, auxiliares en `scripts/require-pages.mjs` y gate en `package.json` antes de Astro; conservar gates005–009 y sin bypass productivo; comprobar exit no cero con datos actuales y regresión de controles relacionados.
- [X] T033 [P] Crear/ejecutar V12 en `tests/e2e/documents-accessibility.spec.ts`: auxiliares y aviso a360/390/430/768/1024/1280/1440px, texto200% real, teclado/foco/skip-link/menú/enlaces, contraste/tamaño de controles y axe; sin cortes que impidan leer/recuperarse y sin confundir captura ampliada con texto ampliado.
- [ ] T034 Registrar revisión manual visual/lector de pantalla, recursos y límites de diseño011 en `specs/010-documentos-recuperacion/accessibility-review.md`; si falta material, navegador o tecnología de asistencia, mantener pendiente, sin certificar fidelidad.
- [ ] T035 Auditar tráfico/storage/referrer/logs en documentos, aviso y404 y su integración con recorridos009 en `specs/010-documentos-recuperacion/delivery-review.md`; sin cookies/rastreo nuevos ni datos privados y claims solo tras evidencia real; auditoría local no cierra la productiva.
- [x] T036 Ejecutar regresión afectada001/005/009 y checks Astro/TypeScript, revisar aislamiento de fixtures y escapes; registrar comandos/resultados únicos y fallos en `specs/010-documentos-recuperacion/evidence.md`, sin repetir suites no afectadas ni contar reintentos como casos nuevos.
- [ ] T037 Completar datos reales P02, políticas propias de categorías, responsable/canal/proveedores/ubicación/buzones/copias y referencias verificadas en `specs/010-documentos-recuperacion/content-review.md` y `src/config/documents.ts`; bloqueada hasta información oficial, sin elegirla por inferencia ni publicar secretos.
- [ ] T038 Completar revisión humana P03 de los tres textos, vigencia/titularidad/permisos/condiciones y coherencia con operación009 en `specs/010-documentos-recuperacion/content-review.md`; actualizar contenido y tres revisiones/huella en `src/config/documents.ts` solo tras revisión documentada, sin atribuir aprobación legal a pruebas automáticas.
- [ ] T039 Calificar evidencia integrada009 de conservación/canal/confirmación/copia/proveedor/rastreo y scope `notices` del conjunto revisado; registrar referencias reales en `specs/010-documentos-recuperacion/content-review.md` y `src/config/privacy.ts`, sin marcar scopes productivos por aceptar resultados locales009.
- [ ] T040 Documentar configuración del alojamiento/CDN real y comprobar contrato404/no-referrer/recursos/caché y fronteras privadas006/008/009 en `specs/010-documentos-recuperacion/delivery-review.md`; dependiente de entorno existente autorizado/calificado, sin seleccionar proveedor ni desplegar por esta tarea.
- [ ] T041 Crear/ejecutar integración V01–V12 aplicable en `tests/e2e/documents-integration.spec.ts` contra baseURL real: diez accesos, contenido oficial/aviso/secciones,404+HEAD/recarga, privacidad/rutas privadas y anclas; fixtures o bloqueos no satisfacen SC. Registrar QR no aplicable con motivo solo si no existe material aprobado; si existe, exigir aprobación+lectura.
- [ ] T042 Ejecutar `npm run build` y comprobación de artefactos/auxiliares en `specs/010-documentos-recuperacion/evidence.md`; recursos/gates de otras features siguen bloqueando entrega si faltan, sin saltarlos. Confirmar fixture y borradores ausentes de artefactos publicables.
- [ ] T043 Ejecutar guía real de `specs/010-documentos-recuperacion/quickstart.md`, ajustar comandos a implementación y registrar separación contrato/integración/calificación con SC-001–007 en `specs/010-documentos-recuperacion/evidence.md`; mantener incumplimientos y dependencias abiertas explícitos.
- [x] T044 Sincronizar estado de X03 y evidencia en `specs/TRACEABILITY.md`, `specs/010-documentos-recuperacion/spec.md`, `specs/010-documentos-recuperacion/plan.md` y `specs/010-documentos-recuperacion/tasks.md`; marcar únicamente tareas verificadas, informar entrega parcial si persisten bloqueos, sin declarar publicación o cumplimiento legal.

## Dependencias y orden

T001→T002/T003→T004. Fundamentos: T004→T005→T006→T007→T008→T009. Tras T009 pueden prepararse tests de cada historia sin interferir. Implementación recomendada US1→US2→US3; US3 no necesita backend o publicaciónUS1, y US2 puede probar aviso con destino sintético antes de la integración con documentosUS1.

| Grupo | Orden y dependencias concretas |
| --- | --- |
| US1 | T009→T010/T011; T010→T012; T012→T013/T014; T013+T014→T015; T011+T015→T016 |
| US2 | T009→T017/T018; T017+T013→T019; T018+T019+T014→T020; T012+T019+T020→T021; T015+T021→T022 |
| US3 | T009→T023/T024; T024→T025; T023+T025→T026; T004+T026→T027; T027→T028; T023/T024+T027+T028→T029 |
| Gates | T007+T012+T021→T030(pruebas negativas)→T031(implementación y verificación)→T032 |
| Calidad local | T022+T029+T032→T033/T035; T033→T034; T031+T033+T035→T036 |
| Calificación externa | T002→T037; T013+T020+T037→T038; T031+T038+operación009 real→T039; T029+host autorizado→T040; T034+T035+T036+T039+T040→T041 |
| Cierre | T032+T041+gates de otras features→T042→T043→T044 |

T044 admite actualización parcial aunque T037–T043 sigan bloqueadas, sin marcarlas completadas. El checkpoint parcial no elimina las dependencias del cierre completo. T035 necesita segunda comprobación integrada tras T039/T040; T041 incluye esa comprobación, sin duplicar una suite.

## Trazabilidad X03 → escenarios → tareas → pruebas → evidencia

Todos los casos V son locales010, no IDs históricos. Evidencia de ejecución se añadirá a `evidence.md`; revisión editorial a `content-review.md`; entrega a `delivery-review.md`.

| Caso | Escenarios y reglas | Tareas principales | Resultado |
| --- | --- | --- | --- |
| V01 secciones/datos completos | US1.2/3, R-02/03 | T002/T005/T010/T012/T013/T037/T038 | SC-002/007 |
| V02 conservación y copias | US1.4, R-04/05 | T010/T013/T037/T038/T039 | SC-002/007 |
| V03 revisión inválida | US1.6, R-08 | T007/T010/T012/T030/T031/T032 | SC-002/007 |
| V04 lectura/navegación | US1.1/5, R-01/03/09 | T008/T011/T014/T015/T016/T041 | SC-001/002/006 |
| V05 coherencia aviso | US2.1/2/3/5, R-03–05/08 | T017/T019/T021/T022/T038 | SC-002/007 |
| V06 antes de enviar/regreso | US2.4, R-01/09 | T018/T020/T022/T041 | SC-003/006 |
| V07 HTTP404 y recuperación | US3.1/2, R-06 | T023/T025/T026/T027/T029/T040/T041 | SC-004 |
| V08 privacidad/fronteras | US3.4/5, R-06 | T023/T025/T026/T029/T035/T040/T041 | SC-004/007 |
| V09 teclado404 | US3.2, R-06/09 | T024/T025/T029/T033/T034 | SC-004/006 |
| V10 anclas/QR | US3.3, R-07 | T024/T028/T029/T041 | SC-005/006 |
| V11 evidencia/entrega | US1.6/US2.5, R-08 | T030/T031/T032/T039/T042/T043 | SC-007 |
| V12 adaptación/accesibilidad | US1–3, R-09 | T033/T034/T041 | SC-006 |

## Oportunidades paralelas

9 tareas `[P]`, siempre tras dependencias: T002 puede documentar faltantes mientras T003 prepara fixture; T010/T011 escriben pruebas diferentes; T013/T014 contenido y renderizador usan archivos distintos; T017/T018 pruebasUS2; T023/T024 pruebasUS3; T033 y T035 calidad/tráfico usan archivos distintos. T014 y T033 solo se habilitan cuando cumplen sus dependencias; no tienen prioridad sobre ellas.

Ejemplos por historia:

- US1: después de T009, T010 (`tests/documents-publication.test.ts`) y T011 (`tests/e2e/documents.spec.ts`). Después de T012, T013 y T014 pueden avanzar en archivos distintos.
- US2: después de T009, T017 (`tests/documents-notice.test.ts`) y T018 (`tests/e2e/documents-notice.spec.ts`); integrar T019–T021 en secuencia por archivos compartidos.
- US3: después de T009, T023 (`tests/documents-http.test.ts`) y T024 (`tests/e2e/documents-recovery.spec.ts`); T025–T027 son secuenciales.

No paralelizar modificaciones de `package.json`, `src/content/documents.ts`, `src/config/documents.ts`, `InformativeDocument.astro` o expedientes de evidencia; coordinar fases/gates antes de compartir archivos.

## Estrategia de implementación

1. Completar preparación/fundamentos T001–T009.
2. MVP local US1 T010–T016: documentos y revisión negativa con fixture, sin declarar términos oficiales o entrega completa.
3. Añadir US2 T017–T022 y US3 T023–T029 como incrementos verificables.
4. Conectar controles y calidad local T030–T036. Verificar negativas y preservar estado pendiente real.
5. T037–T043 requieren información/revisión/entorno/evidencia reales; avanzar únicamente las partes habilitadas, sin reemplazar con datos sintéticos. T044 informa tanto cierre íntegro como parcial verificable.

**Balance**: preparación4, fundamentos5, US1=7, US2=6, US3=7, transversal15; total44:33 verificadas localmente y11 pendientes/parciales. Revisión constitucional: alcance X03, privacidad009, accesibilidad011 y evidencia honesta conservados; ninguna excepción nueva.

## Estado de implementación local

T028: mapa y fixture conformes; destinos reales/QR final pendientes. T033/T034: Chromium/Firefox y axe conformes, WebKit/lector/material final pendientes. T035: auditoría local conforme, integración009/productiva pendiente. T037–T043: datos/textos/evidencias/alojamiento/build/guía integrada bloqueados. T044 sincroniza entrega parcial; no sustituye estos cierres. Véase `evidence.md`.

## Avance P02 — 2026-10-23

T037 parcial: responsable Priva y correo público de contacto/solicitudes `Priva202611@gmail.com` aportados por la usuaria e incorporados a src/config/documents.ts; Términos, Manifiesto y aviso sincronizados sin aprobación final. Pendientes alojamiento, proveedores/envío de correo, ubicación/ciclos/categorías/cookies/permisos y evidencia operativa. T038/T039 sin cierre. 33/44 tareas completas; 27 pruebas de documentos y check raíz aprobados. Ver content-review.md y evidence/official-contact-*.txt.

## Progreso del MVP — 2026-10-27

T037 parcial: Firebase seleccionado para la web y registrado en el borrador; correo solo de prueba sin proveedor. T038 parcial: marco colombiano/derechos preparados como borrador, sin aprobación humana del texto exacto ni vigencia. T039 sin calificación009 y T040 sin despliegue; no se cierran estas tareas. La etapa MVP no define acceso/copias ni autoriza eludir gates. Ver [decisiones, pruebas y pendientes](mvp-decisions-2026-10-27.md).

## Destinos y accesibilidad completados — 2026-10-28

T028/T033 completas:35/44tareas.9/9pruebas locales reales (6destinos+3tráfico/storage), matriz contractual84celdas/3motores aprobada,27/27Node y Astrocheckconforme. T035avanza solo en auditoría local: no cierra cabecera404,administración ni entrega productiva. Textos continúan en revisión, Contacto solo ficticio. [Evidencia y límites](local-review-2026-10-28.md).
