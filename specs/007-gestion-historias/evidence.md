# Evidencia de implementación local — 007

Fecha: 2026-10-19 (America/Bogota). Rama Git real: `main`. Implementación local; no entrega ni
operación productiva calificadas. No commit/push/despliegue ni envío de correo a terceros.

## Resultado

- 56/60 tareas cerradas localmente; T056–T059 abiertas por navegadores adicionales, materiales,
  revisión manual y operación/build de entrega. El checklist documental sigue16/16; no acredita ejecución.
- 37 casos Node únicos aprobados con SQLite/archivos reales y launcher de medios activo.
- 25 casos Chromium únicos aprobados: ejecución completa de23 y ejecución específica de2 nuevos
  casos (respuesta tardía y carga/error/vacío). No sumar repeticiones como casos adicionales.
- 182 regresiones únicas aprobadas: 39Node006 + 40Node003 + 66Node005 + 8Chromium006 + 29Chromium003.
  Los siete casos HTTP006 repetidos tras añadir el plazo de lectura están incluidos en esos39.
- TypeScript de servicios006/007, Astro check de007/003, build de contrato007 y vistas privadas
  compilados. Revisión de enlaces, IDs y `git diff --check` sin errores.

No todas las pruebas usaron el mismo entorno de aislamiento exterior. Dentro del sandbox de la
sesión, bwrap no puede configurar el mapaUID y la suite completa produjo28/30 aprobados y dos
fallos ambientales de aceptación de medios. No se registró esa ejecución como aprobada.
Tras aprobar ejecución fuera de esa capa, manteniendo bwrap/prlimit, la suite final de37 pasó
completa. Un fallo temporal de cuota de revisión automática interrumpió una ejecución; la revisión
posterior aprobó la reanudación. Nunca se quitó el aislamiento para aceptar un archivo.

## Entorno y artefactos

Linux x64, Node24.19.0, TypeScript5.9.3, Astro7.4.0, Playwright1.64.1 y Chromium del sistema.
CPU reportada: AMD EPYC9V74, cinco CPUs lógicas visibles. No es una medición de hosting productivo.
FFmpeg/ffprobe7.1.5, bwrap y prlimit. Firefox y WebKit: ejecutables no instalados; no ejecutados.

Los bancos crean cuentas y archivos sintéticos en directorios0700 temporales fuera del checkout.
Contraseñas del banco no son credenciales productivas. Vistas privadas en `.private-build/admin`,
no en public/dist. La raíz de medios rechaza ubicaciones dentro del checkout/roots públicos.
Los fixtures de publicación no acreditan revisión editorial ni aceptación por el decoder: esa
aceptación se comprueba por separado mediante uploads HTTP y el recorrido de navegador real.

Artefactos locales ignorados por Git:

- `.test-output/story-management-node-qualified.txt`: ejecución final37/37 y benchmark.
- `.test-output/story-management-node-final.txt`: ejecución restringida fallida28/30, conservada como diagnóstico.
- `.test-output/story-management-service-23-results.json`:23/23 Chromium, sin skips/flaky.
- `.test-output/story-management-service-results.json`:2/2 Chromium adicionales, sin skips/flaky.
- `.test-output/admin-service-results.json`:8/8 Chromium006.

Las ejecuciones anteriores de20,23 con fallo de selector y matrices con fallos corregidos no se
suman al resultado. La prueba de unicidad usa `data-story`, que es el identificador del contrato003;
el artículo no tiene un atributo HTMLid propio. La corrección no cambió el catálogo para pasarla.
Traces, vídeos y capturas automáticas están desactivados para no persistir datos de acceso.

## Comandos ejecutados y resultados

| Comando | Resultado y límite |
|---|---|
| `npm run check:story-management:service` | TypeScript estricto aprobado |
| `npm run check:admin:service` | Regresión de tipos006 aprobada |
| `npm run check:story-management:contract` | Sin errores, warnings ni hints en verificación final |
| `npm run build:story-management:contract` | Fixture estática compilada; no build de entrega |
| `npm run build:admin:views:local` | Seis vistas privadas compiladas fuera de dist |
| `npm run check:stories:contract` | Consumidor003 sin errores/warnings/hints |
| `npm run test:story-management` | 37/37 en entorno que permite el launcher; se necesita esa capacidad |
| `PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:story-management:service -- --project=chromium` | 23/23 antes de añadir dos casos finales; ejecución con decoder activo |
| Mismo comando con `--grep 'late response\|list load'` | 2/2 casos adicionales, contexto aislado |
| `npm run test:admin` | 39/39; banco real de sesiones/recuperación con doble de correo, sin proveedor/buzón reales |
| `node --experimental-strip-types --test tests/stories-*.test.ts` | 40/40 |
| `npm run test:contact` | 66/66 |
| `PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:admin:service -- --project=chromium` | 8/8; SQLite/cookies/reinicio, doble local de correo |
| `PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:stories:contract -- --project=chromium` | 29/29; incluye radios/nueve opciones, no transmisión/storage y accesibilidad |
| `node scripts/require-story-management-publication.mjs` | Rechazo esperado: nueve referencias de operación/revisión pendientes |
| `npm run build` | Bloqueado en gate002 por recursos/revisión pendientes; no se omiten guards |

Las pruebas de aislamiento se ejecutaron por el flujo de aprobación de la plataforma cuando fue
necesario. No ejecutar el servicio como root ni desactivar controles en hosting para imitarlas.
El script de integración productiva falla explícitamente mientras no exista entorno calificado;
no recurre al fixture como sustituto de producción.

## Fronteras verificadas

### Persistencia, autorización y publicación

`tests/story-management-repository.test.ts`, `tests/story-management-http.test.ts` y
`tests/story-management-security.test.ts` ejercen SQL real, cierre/reapertura, guard006 compartido,
recibos en el mismo commit, fallo antes/después del commit, conflicto de dos cuentas y deduplicación.
Se prueban las diez combinaciones de ruta/método privadas sin sesión, token alterado, cuenta
revocada, sesión cerrada y sesión expirada. Se rechaza antes de datos/efecto; CSRF/origen, JSON
inválido/tamaño y métodos/rutas no permitidos tienen comprobaciones independientes.

Los snapshotsworking/publicado están separados. Guardar cambios incompletos mantiene la publicación
vigente y sus archivos; Publicar completo cambia el conjunto conservando identidad/activación.
Activar no publica un borrador ni cambios pendientes; desactivar conserva contenido y bloquea
nuevas lecturas de medios exclusivos. No se promete recuperar bytes descargados/lecturas ya autorizadas.
La proyección pública solo contiene campos del DTO003: sin working/revision/correos/storageKey.

### Medios reales y límites

`tests/story-management-media.test.ts` inspecciona/decodifica PNG/JPEG/WebP estáticos, WAVPCM y MP3,
rechaza formatos cruzados, archivo truncado, dimensiones excesivas y codecMP3 en contenedorMatroska.
El launcher monta binarios/bibliotecas y referencias del linker solo en lectura, entrada `/input`,
namespace de red aislado, capacidades eliminadas y NoNewPrivs activo. No monta claves ni base de datos.

El test de política reutiliza los argumentos del launcher con un proceso Python sintético para
comprobar RLIMIT_AS512MiB, CPU20/21s, NOFILE32 y CORE0, memoria denegada, centinela externo ilegible,
escritura de entrada denegada y namespace/red separados. El agotamiento real de CPU termina por
SIGXCPU; no se acepta un fallo genérico de arranque como prueba del límite. La salida excesiva de
ffprobe real y el plazo de pared también terminan el worker. La sustitución por Python pertenece
solo al harness de prueba; la aplicación permite únicamente ffprobe/ffmpeg.

HTTP verifica imágenes/audio aceptados y persistidos en privado, publicación/activación explícitas,
GET/HEAD/Range206/416, límites de tamaño y vacíos, revocación después de comenzar una carga con
staging real y limpieza sin registrarready. Dos streams concurrentes ocupan el semáforo; el tercero
recibe429/Retry-After. Las pruebas de plazos JSON30s/upload120s usan temporizadores simulados con
sockets HTTP reales y verifican cierre sin escritura confirmada; no representan dos minutos de espera.
La inspección real y sus límites se prueban por separado con reloj real.

El navegador carga archivos generados por FFmpeg, conserva su borrador, publica inactivo, activa
expresamente y reproduce/desplaza audio real servido por007. Son materiales sintéticos; no los
relatos, transcripciones ni explicaciones oficiales.

### Interfaz, contadores y accesibilidad

25 casos Chromium entre draft/editing/upload/accessibility. Se conserva texto tras rechazo y
conflicto, respuesta perdida se recupera por recibo sin duplicar y una respuesta de otra historia
no sustituye el editor actual. Pérdida de sesión elimina formulario/referencias; no hay replay tras login.
Si una carga queda desconocida puede abandonarse su asociación para elegir otro archivo conservando
texto; no se afirma rollback del servidor ni se publica un recurso sinconfirmación.

Carga/error/vacío y error503 de upload se simulan explícitamente en dos testsUI para aislar sus
estados; no acreditan fallos reales de un proveedor. Persistencia, catálogo, archivos y recibos de
los otros recorridos usan el servicio local. Cuatro publicaciones persistidas se expanden en la
misma página003 con identidad única; no hay segundo catálogo.

`tests/story-management-summary.test.ts` conecta persistencia005 real (intentos firmados,
deduplicación/baja) con el agregado HTTP autorizado007. Se entrega solo total o unavailable, sin
alias/correo/mensaje. El contrato de conteo es independiente de estados de respuesta; no se
implementó ni calificó bandeja/correo008.

Las14 combinaciones360/390/430/768/1024/1280/1440×texto100/200% pasan teclado, foco, labels,
axe, lectura sin desbordamiento impeditivo y controlprincipal>=44px. Se miden ratios de texto,
borde y foco sobre colores computados (4.5:1/3:1). El desbordamiento1024/200% se corrigió en
etiquetas flexibles/resumen, sin esconder contenido. No equivale a prueba de lector manual o
fidelidad con recursos oficiales ni a cobertura Firefox/WebKit.

### Rendimiento local

1000 historias sintéticas,30 lecturas calientes: listado p95=27.68ms y publicación preparada
p95=1.48ms en la ejecución final. No incluye transferencia, revisión editorial ni decodificación;
usa recursos sintéticos pequeños ya preparados. Cumple el objetivo local<1s del plan, sin prometer
SLA, almacenamiento/capacidad productivos, backup o alta disponibilidad.

## Matriz de los31escenarios

Cada fila enlaza el recorrido con la evidencia técnica local y separa lo que impide cierre real.

| Escenario | Evidencia local principal | Límite de aceptación |
|---|---|---|
| US1.1 | Editor con campos aprobados, Guardar/Publicar separados; draftChromium | Recursos/fidelidad oficiales pendientes |
| US1.2 | Validadores + creación incompletaSQL, sin título inventado | No limitación local pendiente |
| US1.3 | Cierre/reapertura real deDB + recarga/editor; catálogo excluye borrador | Calificación de almacenamiento productivo |
| US1.4 | Fallo transaccional/estadoUI, texto conservado; elegir otro archivo | Fallos de proveedor productivo sin calificar |
| US1.5 | Idempotencia/recibo + respuesta perdida en navegador | No limitación local pendiente |
| US1.6 | Matriz de diez entradas×cinco estados de acceso; limpiezaUI | Hosting/cuentas productivos006 pendientes |
| US2.1 | Validadores/errores asociados + Publicar incompleto rechazado | Revisión semántica/editorial manual |
| US2.2 | UploadHTTP/navegador, publicación/activación y catálogo real | Materiales/entorno productivos |
| US2.3 | Primera publicación inactiva; activación explícita; republish no activa | No limitación local pendiente |
| US2.4 | Cinco formatos, metadata y audio con play/seek reales sintéticos | Derechos, transcripciones/nueve explicaciones oficiales |
| US2.5 | Fallos pre/postcommit, desconocido/recibo, sin versión parcial | Propagación/proxy productivos |
| US2.6 | Recibos/revisiones y respuesta antigua descartada | No limitación local pendiente |
| US2.7 | Recursos de borrador/staging no públicos, límites/guard y namespace | Proveedor de archivos productivo |
| US3.1 | Desactivar retira catálogo y nuevas lecturas; datos conservados | Proxy/cachés productivos |
| US3.2 | Reactivar conserva ID y snapshot previo con pending | No limitación local pendiente |
| US3.3 | Activación de borrador rechazada y filtro público persistido | No limitación local pendiente |
| US3.4 | Recibos/CAS, error no confirma toggle; control explícito | Fallos operativos productivos |
| US3.5 | Guard atómico, dos cuentas y revocación durante carga | Provisión productiva006 |
| US4.1 | Reabrir/guardar misma identidad y links | No limitación local pendiente |
| US4.2 | GuardarQ1 no cambia catálogo/archivos; pending/reapertura | No limitación local pendiente |
| US4.3 | B incompleta no sustituyeA; Publicar reemplaza entero; recibos | Editorial/proxy reales |
| US4.4 | Cambio de título/recursos con ID estable en mismo003 | No limitación local pendiente |
| US4.5 | Conflicto dos cuentas y conflictoUI preservando texto local | No limitación local pendiente |
| US4.6 | Respuesta tardía de otra historia, salida y limpieza; regresión006 de pestañas | Navegadores adicionales |
| US5.1 | Tabla derivada de registros, sin borrar/filas ficticias de entrega | Fidelidad con recursos oficiales |
| US5.2 | Búsqueda/filtros/nada coincidente; contador global estable | No limitación local pendiente |
| US5.3 | Activas/drafts SQL; publicada con pending no añade historia | No limitación local pendiente |
| US5.4 | 005real→agregadoHTTP007; dedup/baja, unavailable separado | Correo/bandeja008 productiva pendiente |
| US5.5 | Loading/error/empty separados en bancoUI explícito; vacíoSQL real | No limitación local pendiente |
| US5.6 | Cuatro elegibles expandidas + publicación nueva mediante mismo003 | Materiales y entrega productivos |
| US5.7 | Matriz14/teclado/contrastes y permiso único | Lector manual/fidelidad/Firefox/WebKit |

## Criterios y cierre

SC-001–SC-006: comportamiento técnico local verificado por las pruebas anteriores; no sustituye
calificación productiva ni revisión editorial cuando el criterio las requiere. SC-007: matrizChromium
verificada, lector/fidelidad/motores adicionales pendientes. SC-008: los cincoAD y31escenarios tienen
evidencia o bloqueos explícitos; no se declara entrega final por esa trazabilidad documental.

| Tarea abierta | Motivo concreto |
|---|---|
| T056 | Firefox/WebKit no instalados; regresión001 directa no ejecutada. Se ejecutaron las regresiones afectadas003/005/006 descritas |
| T057 | No materiales oficiales/revisión de derechos/transcripciones/nueve explicaciones, lector manual ni fidelidad cerrada |
| T058 | P02/009/010 y proveedor/proxy/retención/backups/operación reales sin calificar;006/008 no cierran por tests de007 |
| T059 | Build de entrega bloqueado en002 y gate007 con referencias pendientes; no se modifican aprobaciones para pasar |

No hay excepciones de alcance o constitucionales aprobadas ni implícitas. Se mantiene un permiso,
sin eliminación definitiva, historial navegable, moderación pública o persistencia educativa.

2026-10-26 — Importador inicial: portadas oficiales por defecto cuando imagePath se omite, manteniendo auth/revisión/inspección/borrador.38Node007 aprobados, incluye el nuevo caso con las tres imágenes/hash/dimensiones y catálogo aún vacío; tres casos del importador repetidos después del ajuste del mapa y aprobados, sin duplicarlos. Tipado007 conforme. Audio sintético solo para tests; narraciones oficiales pendientes. Ver ../003-historias-educativas/evidence/connected-images.md. No se cierran las tareas materiales/operativas pendientes por esta prueba.

2026-10-26 — Audios aprobados asociados a los tres casos iniciales por confirmación de la responsable. audioPath puede omitirse para usar el archivo exacto y su huella de aprobación; una discrepancia se rechaza sin registros/medios parciales.40Node007 aprobados (incluye asociación de audios y rechazo por huella cambiada), typecheck conforme. Los cuatro MP3 pasan códec/reproducción/pausa/búsqueda en Chromium/Firefox/WebKit mediante Blob local, sin certificar publicación o entregaHTTP. Número desconocido es el cuarto material, pendiente de ficha para creación/publicación normal y aparición en el contenido ampliado. Ver ../003-historias-educativas/evidence/audio-assignment.md.

## Conexión local003–007 vigente

`npm run dev:local`: catálogo real en el mismo origen local, sin cuentas nuevas ni publicación automática.6/6 pruebas de navegador y2/2 pruebas Node nuevas;17regresiones aprobadas/2bloqueadas por ffmpegLinux ausente. Catálogo vacío confirmado. [Configuración, comandos y límites](local-connection.md).

## Estado vigente del inspector macOS

2026-10-28: adaptación implementada;42/42 pruebas007 aprobadas, incluidas subidas/importación y aislamiento nativo. Las limitaciones anteriores de FFmpeg ausente son históricas. `npm run build:media:macos` construye el supervisor y `npm run test:story-management:macos` verifica la suite. Memoria física supervisada cada5ms en Mac, sin afirmar equivalencia al límite virtual duro Linux. [Evidencia final y límites](macos-media-validation.md). No se publicaron fichas pendientes ni se cerró operación productiva.
