# Evidencia de implementación — 005

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
