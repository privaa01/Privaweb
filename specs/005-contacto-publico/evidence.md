# Estado vigente — demo2026-10-30

53/53 tareas de la demo; diseño corregido aceptado por la responsable el2026-10-30 («esta perfecto»); producción diferida. Véase [demo-review-2026-10-30.md](demo-review-2026-10-30.md). Revisión específica teclado/VoiceOver confirmada;45/45 matriz publicada,15 restricciones de reglas y3 recorridos reales con lectura privada/limpieza propia. Los registros anteriores de SQLite/MVP se conservan como históricos y no describen el despliegue Firebase actual.

# Evidencia de implementación — 005

**Revisión vigente: 2026-10-27, America/Bogota.** Ejecución solicitada de spec005 después de confirmar Firebase futuro, correo sin proveedor y uso exclusivo de datos ficticios. **MVP local integrado y verificado; 49/53 tareas completas.** T045–T048 conservan condiciones productivas abiertas. El bloque histórico al final describe la primera ejecución, no los bloqueos actuales del Mac.

## Resultado observable

`http://127.0.0.1:4321/contacto.html` responde200 en modo de desarrollo explícito y muestra componentes, imagen oficial, marca, fuente local e Instagram configurado. Aviso: «Modo de prueba del MVP», datos ficticios y correo example.test. El servicio real de005 recibe los POST en el mismo origen y guarda en SQLite privado fuera del checkout/public/dist. Confirmación solo después de COMMIT/replay: «Tu consulta quedó guardada en la base local de pruebas. No se enviaron correos.» Se comprobó también manualmente en el navegador: errores de vacíos/foco y envío sintético confirmado.

El banco anterior de4327 sigue siendo un fixture de servicio; no se presenta como la página integrada nueva. La integración nueva usa el documento de `src/pages/contacto.astro`, componentes/recursos reales y los handlers/repositorio005, sin intercepción de su API. Solo la prueba UI histórica usa mocks y se contabiliza aparte.

## Verificación final de esta ejecución

Entorno: macOS ARM64, Node24.22.1, Astro7.4.0, TypeScript5.9.3, Playwright1.64.1; Chrome instalado, Firefox157 y WebKit27.2 oficiales. No se modificaron preferencias del sistema ni se desactivaron protecciones.

| Capa | Resultado | Evidencia local ignorada |
|---|---|---|
| Validación/HTTP/SQLite/publicación/desarrollo | **70/70 Node**; 0 fallidos/omitidos | `.test-output/contact-mvp-node-final.log` |
| UI contractual005 y matriz | **117/117**:39 por Chrome/Firefox/WebKit | `.test-output/contact-mvp-contract.log` |
| Banco compuesto005 con SQLite real y fallos antes/después de commit | **12/12**:4 por motor; sin API interceptada | `.test-output/contact-mvp-service.log` |
| Documento real005 + API integrada + DB privada | **26/26**:4 recorridos por cada motor y14 celdas de matriz Chromium; 0 fallidos/omitidos | `.test-output/contact-mvp-browser-final.log` y `contact-development-results.json` |
| Check Astro raíz |95archivos;0errores/advertencias;1hint previo de returnValue en administración | Salida de la sesión |
| Typecheck receptor005 | Aprobado tras acotar el servidor Vite al tipo HTTP requerido | `node node_modules/typescript/bin/tsc -p server/contact/tsconfig.json` |
| Build contractual005 | Aprobado en los bancos; no genera entrega productiva | CLI Astro del banco |
| Gate005 incluso con opción sintética | Rechaza revisiones/documentos/operación faltantes | Prueba Node nueva y salida `require-contact-publication.mjs` |
| Script de build de entrega, opción sintética presente | Bloqueado por010/009; no se omiten gates | `.test-output/contact-mvp-build-guard.log` |
| Checklist de requisitos |16/16, sin modificar marcadores | `checklists/requirements.md` |
| Hooks | `.specify/extensions.yml` ausente antes y después; no hay hooks por ejecutar | Inspección del checkout |

**225 casos aprobados en la campaña final**, sumando solo las cuatro capas de pruebas anteriores. No son225 criterios distintos del spec. Las repeticiones para corregir pruebas/capturar evidencia no se suman otra vez.

## Criterios y alcance aceptado localmente

| Criterio | Verificación de etapa MVP | Condición final aún pendiente |
|---|---|---|
| SC-001 / C01–C03 | Orden y recursos reales;4temas;Instagram oficial configurado;ancla directa/recarga;footer abre Contacto desde inicio. CTAApp conserva href aprobado | PáginaApp/destinos finales y comparación editorial/manual de entrega |
| SC-002 / C04/C05 | Fronteras, trim, Unicode y correo equivalentes en cliente/servidor;sin consultas inválidas. En MVP se restringe además a example.test | Repetir en receptor productivo cuando exista; la restricción de pruebas no modifica C05 productivo |
| SC-003 / C06 | UI→SQLite real y lectura privada autorizada;un registroPendiente con datos correctos;replay/reinicio;sin lectura HTTP de consultas/clave/DB | Configuración del receptor, acceso y persistencia productivos |
| SC-004 / C05/C06 | Doble envío,incertidumbre,readonly,advertencia de otra consulta,concurrencia y fallos antes/después del commit,reintento exacto sin duplicados | Mismo contrato en operación final; no se atribuye durabilidad física del proveedor |
| SC-005 / C02/C07 | Aviso previo explícito de prueba, sin correos ni consultas reales, sin claims de rastreo;documentos en revisión no se presentan aprobados | Aviso/canal/retención/copias y revisión009/010 antes de datos reales |
| SC-006 | Matriz7anchos×texto100/200;orden móvil,foco,labels,errores,controles≥44,overflow y axe;recorridos principales tres motores;sinJS no envía | Revisión manual/lector de pantalla y fidelidad final de entrega011 |
| SC-007 | Evidencia separada UI simulada/servicio real/página real;imágenes eInstagram recibidos,guards conservados | Revisión editorial exacta y calificación de operación/despliegue |

## Aislamiento y límites del modo de prueba

- Activación: `PRIVA_CONTACT_TEST_MODE=synthetic`, solo AstroDEV. `npm run dev:contact:test -- --force` fija127.0.0.1:4321. Sin opción o fuera de DEV, Contacto mantiene assert de publicación.
- Origen HTTP loopback exacto, Host/peer loopback y Origin coincidentes;sin CORS amplio. Se mantienen métodos/JSON/32KiB y límites de tiempo. Los correos fuera de example.test se rechazan con terminal durable, no con éxito visual. Alias/mensaje reales no se detectan automáticamente: su uso está expresamente fuera del alcance autorizado.
- Copia de contenido local marcada testOnly, sin aprobar reviews. Aviso de prueba y confirmación sin correo;se elimina el enlace de eliminación ficticio en este perfil. Autocompletado de alias/correo desactivado en la prueba para reducir introducción accidental de datos reales.
- DB/clave/sidecars0700/0600 fuera del checkout y de todos los staticroots, ruta temporal canónica derivada de la raíz. Se denegó acceso por Vite/@fs y rutas de archivo/API de lectura. No hay ruta pública de verificación, lectura, fallos o panel añadida. Lectura de pruebas solo por proceso local autorizado al archivo.
- No SDKFirebase,envío de correos,registro público,analítica o almacenamiento del formulario en browser. No se conectó el banco sintético al arranque productivo ni se calificó retención009,confirmación por correo oCT01.
- No se suprimió ninguna reglaaxe del documento. En el devserver solo se excluye `astro-dev-toolbar`,instrumentación de Astro que no se entrega al usuario final.

## Correcciones y reproducción

La nueva prueba de desarrollo se escribió antes del módulo e inicialmente falló por implementación ausente; no se registra ese error de importación como fallo funcional del servicio previo. Después pasó persistencia/reinicio,rechazo terminal y aislamiento. Se corrigió el tipo del HTTP server de Vite para comprobar límites de tiempo sin asumir soporteHTTP2;typecheck y navegador final aprobados.

La prueba antigua del footer esperaba enfocar#escribir tras ContactoSeguro y falló. Se actualizó a la decisión de la responsable de2026-10-23: `/contacto.html` desde inicio. No se cambió ese comportamiento del producto. El recorrido de enlaces en WebKit/macOS usaOption+Tab;no se interpreta la preferencia nativa como defecto del formulario. Tras estas correcciones,117casos del banco pasan.

En el Mac no había npm enPATH;se ejecutaron los CLI locales mediante Node incluido enCodex. Los configs temporales de `.test-output/` conservan suites y proyectos originales y reemplazan solo el comando npm del webServer por CLI Astro+Python/Node directos. Se ejecutaron los bancos que comparten build deContacto de forma secuencial;la suiteMVP usa otra DB/directorio. Conexiones localhost requirieron permisos fuera del sandbox. TMPDIR=/private/tmp evita el alias no canónico deMac en validaciones privadas.

El primer intento de `pnpm build` se detuvo por una comprobación automática de dependencias que intentaba reinstalar módulos sinTTY;no se autorizó purga ni reinstalación. Después se ejecutó exactamente el script `build` leído de package.json mediante `/bin/sh`, con Node disponible: su primer guard falla en010/009, incluso con PRIVA_CONTACT_TEST_MODE=synthetic. No hay build de entrega aprobado.

Captura de confirmación: `.test-output/contact-development-artifacts/confirmed.png`. Guía y comandos estables en quickstart.md. Los logs de ejecución son locales ignorados;este informe conserva resultados/límites sin depender de sus archivos.

## Tareas restantes

**T044 completa. T050–T053 completas. T045–T048 parciales**: faltan revisión editorial/manual/lector final,calificación productiva009/010,integración con destinos y servicios finales y build de entrega. Firebase está elegido para la web, pero no hay despliegue ni backend Firebase definido/verificado. No se inventan datos de política,aprobaciones ni proveedor de correo para cerrar. Sin commit,push,despliegue o cambios alPDF.

---

## Histórico: ejecución inicial de2026-10-17

Los estados,dependencias y conteos siguientes corresponden a esa fecha. Para decisiones/estado actual prevalece la revisión anterior.

### Evidencia inicial — 005

Fecha: 2026-10-17. Solo datos sintéticos; ninguna recepción productiva habilitada.

## Inventario y dependencias

| Elemento | Estado | Efecto |
|---|---|---|
| Imagen, marca, tipografía/paleta oficiales P01/P04 | Pendiente | Fidelidad y publicación final bloqueadas |
| Copy/aviso responsable/canal/Manifiesto P03/010 | Pendiente | No recoger datos reales |
| Instagram compartido 003/P01 | Pendiente en configuración existente | No inventar destino oficial |
| Hosting/adaptador durable, TLS/proxy/secretos P02 | Pendiente | SQLite local no acredita producción |
| Actividad, eliminación/canal/copias/restauración 009 | Pendiente | No certificar política integral |
| UI/autorización administrativa/respuesta 006/008 | Fuera de 005 | Lectura de prueba solo por proceso privado |

## Ejecución

Preparación iniciada; resultados se incorporan después de ejecutar las comprobaciones.

## Resultado verificado (2026-10-17, UTC)

Node 24.19.0, npm 11.9.0, SQLite nativo experimental, TypeScript 5.9.3, Astro 7.4.0,
Playwright 1.64.1 y Chromium del sistema `/usr/bin/chromium`. Solo datos sintéticos locales.
**44/49 tareas completadas**; tareas abiertas T044–T048. No hay despliegue ni recogida de datos reales.

| Comprobación | Resultado | Evidencia local |
|---|---|---|
| `npm run test:contact` | 66 pasan, cero fallos/omitidas | `.test-output/contact-evidence/contact-node-final-proof.txt` |
| `check:contact:service` | TSC estricto, cero errores; incluye runtime y wrappers | `contact-evidence/contact-server-final-all.txt` |
| `check:contact:contract` | Astro: 61 archivos, cero errores/avisos | `contact-evidence/contact-astro-final.txt` |
| `npm run check` | Astro raíz: 55 archivos, cero errores/avisos | `contact-evidence/contact-root-check.txt` |
| `test:e2e:contact:contract -- --project=chromium` | 39 pasan, cero omitidas/flaky | `.test-output/contact-results.json` |
| `test:e2e:contact:service -- --project=chromium` | 4 pasan, sin API interceptada | `.test-output/contact-service-results.json` |
| Regresión Node App/Inicio/Historias | 115 pasan | `contact-evidence/contact-reg-unit.txt` |
| Regresión Chromium navegación / Inicio / Historias / App | 45 / 23 / 29 / 31 pasan | `.test-output/{contract,home,stories,app}-results.json` |
| Firefox y WebKit, smoke con binarios existentes | 2 fallos de arranque, sin verificar comportamiento | `.test-output/contact-browser-smoke-results.json` |
| Guard específico de publicación 005 | Rechaza correctamente pendientes reales | `contact-evidence/contact-gate-block.txt` |
| `npm run build` de entrega | Bloqueado por guard 002; guards 003/004/005 se conservan | `contact-evidence/contact-production-build.txt` |
| Integración de Contacto | Bloqueada: falta URL real; no se ejecutó ninguna prueba | `contact-evidence/contact-integration-block.txt` |

Las rutas abreviadas `contact-evidence/...` están bajo `.test-output/`. Logs/reportes/trazas se
conservan ignorados en este workspace, no son artefactos de entrega ni datos para publicar.
Totales de los últimos recorridos completados: **109 pruebas de 005** (66 Node + 39 UI + 4
navegador/SQLite) y **243 de regresión** (115 Node + 128 navegador): **352 aprobadas**.
Los fallos de arranque y comprobaciones bloqueadas se contabilizan aparte, sin presentarlos como éxitos.

## Cobertura y límites de aceptación

| Criterio / tareas | Comprobado localmente | Pendiente de entrega |
|---|---|---|
| SC-001, C01–C03, T009–T016 | Composición/orden, cuatro temas, indicadores/reemplazos, URL compartida de fixture, ancla directa/recarga/footer repetido y CTA App | Recursos/URL/copy finales verificados; T045/T047 |
| SC-002, C04/C05, T006/T028–T033 | 0/1/60/61 y 0/1/1500/1501; trim, texto interno, Unicode, reglas de correo; validación servidor independiente | Revalidación en receptor productivo T046/T047 |
| SC-003, C06, T017–T027 | Escritura real con fecha UTC/Pendiente; DB relecturable por proceso privado; clave/consulta persisten tras reinicio; 201 nuevo/200 replay; sin GET/listado/DB/key públicos | Adaptador/TLS/proxy/acceso privado productivos T046/T047 |
| SC-004, C05/C06, T034–T041 | Dos escritores independientes y carrera rechazo/guardado, token/datos distintos, pérdida HTTP tras commit, rollback/DB ocupada, acuse ilegible y retry exacto; opción A/readonly/advertencia/continuar/callback viejo | Mismo contrato sobre operación productiva |
| SC-005, C02/C07 | Aviso/advertencia antes del botón, seudónimo, uso privado/registro de respuesta/90d y canal sintético identificado; claims ausentes sin prueba específica | Responsable/canal/actividad/copias/aviso/Manifiesto reales, T045/T046; no se aprueba política 009 |
| SC-006, T043–T045 | 14 combinaciones: 7 anchos × texto 100/200% antes de carga/fragmento, foco, teclado, axe (incluido contraste de texto), controles >=44 px y sin desbordamiento; sin JS no hay envío, contenido permanece | Firefox/WebKit y lector de pantalla/fidelidad final; T044/T045 |
| SC-007, T010/T015/T042/T045–T049 | Fixtures aislados de entrega, guards negativos y contrato separado de SQLite real | Evidencia editorial/operativa e integración real; build final |

Se verificaron PRAGMA WAL/synchronous=FULL/FK/busy_timeout=5000 en conexiones reales y permisos
privados de DB/key/WAL/SHM (0600; directorio 0700). Rutas bajo staticroot, symlinks y permisos
amplios se rechazan. Se inspeccionaron los JS compilados: sin `node:fs`, `node:sqlite`, createHmac
ni contact.key. Payloads parecidos a SQL/HTML quedan como texto; el servicio no registra contenido,
tokens ni IP. La prueba de reinicio no certifica corte eléctrico, hardware, backups o volumen productivo.

Revocar elimina consulta/asociación y conserva comprobante opaco hasta expiración; purgar y
reintentar no resucita. Replay conocido tras 24h/rotación exige token completo exacto y consulta
existente; no amplía última actividad. No se guarda huella adicional de email/mensaje.
El borrado lógico probado no acredita eliminación física de páginas SQLite, WAL, backups o buzones:
retención, restauración y ciclos de copias siguen siendo dependencia de 009/P02.

## Hallazgos resueltos durante implementación

- Validación y publicación tuvieron fallos funcionales observados antes de completar sus módulos;
  pruebas rojas preservadas. La primera ejecución del receptor también reveló incompatibilidad de
  parameter properties de TypeScript con strip-types; se corrigió sin añadir compilador/runtime.
  No se atribuye un fallo de importación a una prueba de negocio ni un ciclo rojo/verde a toda la suite.
- La prueba nueva de firma no canónica reprodujo aceptación indebida; la comparación HMAC ahora
  exige representación exacta. Variantes con padding/junk no crean otro intento/digest aceptado.
- Chromium puede repetir automáticamente una petición ante desconexión temprana; se comprobó
  deduplicación. Para la UI unknown tras guardado, el wrapper genera JSON ilegible después del
  commit de forma determinista; un test HTTP independiente sí destruye la conexión tras commit.
- El aviso sin JS usa contenido inicial que solo se oculta al inicializar el script; así también
  informa cuando el bundle no carga. Formulario declara POST explícito y botón inicial desactivado.
- Comparación visual con PDF 4 y render local: invitación original, tarjeta blanca de Instagram,
  panel verde/formulario con alias/correo en escritorio y cierre oscuro; textos retirados del PDF
  no reaparecen. Marca/imagen son sintéticas de fixture, sin certificación de identidad ni fidelidad.

## Bloqueos precisos y trabajo restante

- **T044:** ruta predeterminada de Playwright sin Firefox/WebKit; se localizaron y probaron binarios
  en `/workspace/.cache/ms-playwright`. Firefox falla con “Could not find profile folder”. WebKit
  informa falta de libgtk-4, libgraphene, libharfbuzz-icu, libmanette, libhyphen y libGLESv2. El smoke
  termina con dos fallos, no dos aprobaciones. Chromium funciona; no se desactivaron protecciones.
- **T045:** faltan recursos/identidad oficiales, cuenta Instagram y revisión de copy/aviso/destinos.
  Se inspeccionó render/PDF para estructura; lector de pantalla y fidelidad final no certificados.
- **T046:** proveedor y calificación de producción, responsable/canal, actividad, tratamiento de
  copias y aviso/Manifiesto revisados pendientes. El guard del receptor de producción falla cerrado.
  No se crearon secretos productivos ni se escogió proveedor ficticio para aparentar cierre.
- **T047:** suite real implementada, falta entorno y mecanismo privado autorizado. Requiere URL real
  y verificador local especificado en quickstart, sin endpoint de lectura de pruebas público.
- **T048:** regresiones/checks pasan, pero el build de entrega se detiene en pendientes editoriales
  existentes de 002; 005 también falla su guard propio por sus pendientes. No se retiró ningún guard.

C01–C07 conservan aceptación final pendiente. Bandeja/auth/correo de 006/008, CT01 y política
integral 009/010 no se cierran con estos resultados. T049 sincroniza el estado parcial y no obliga
a marcar dependencias externas completadas. Checklists se conservaron; sin hooks configurados.
No hubo commit, push ni despliegue.
