# Guía de validación — 007

Estado: implementación local; comandos007 disponibles, con evidencia y bloqueos en [evidence.md](evidence.md). No ejecutar infraestructura productiva,
provisión/correo ni publicar fixtures para validar documentación. Ver [plan](plan.md) y [contrato](contracts/story-management.md).

## Prerrequisitos

Node24.19.0 (node:sqlite), dependencias del lock y navegadorPlaywright; FFmpeg/ffprobe7.1.5 con
launcher bwrap+prlimit conforme a [R5](research.md) para inspección/decodificación. Directorio temporal privado fuera del checkout y
roots estáticos, dos cuentas sintéticas autorizadas006, base/puertos aislados. Nunca credenciales
en Git, comandos de evidencia o logs. Puertos propuestos UI4330 y servicio4331; no reutilizar
bases/puertos de005/006. Guardar archivos sintéticos solo en fixtures no publicables.

## Comandos disponibles hoy

Desde raíz del repositorio, comprobaciones existentes de regresión (no acreditan007):

```bash
npm run check:admin:service
npm run test:admin
npm run check:stories:contract
npm run test:e2e:stories:contract
```

Instalación reproducible si hace falta: `npm ci`, respetando lock. Las suites de aplicación locales se ejecutaron; no sustituyen calificación productiva. Build de entrega `npm run build` mantiene bloqueos
reales de materiales/provisión/integraciones; no modificar aprobaciones para obtener verde.

## Comandos de implementación local

Comandos incorporados; usar el runtime requerido y revisar sus condiciones:

```bash
npm run check:story-management:service
npm run test:story-management
npm run check:story-management:contract
npm run build:story-management:contract
npm run test:e2e:story-management:contract
npm run test:e2e:story-management:service
npm run test:e2e:story-management:integration
```

FixtureUI usa mocks explícitos; servicio real compone router007+006 conSQLite/archivos privados,
shell003 sintético y catálogo real sin fixtureJSON. Runner prepara cuentas y arranca servicios
solo en entorno aislado y los detiene al terminar; no bypass de auth en HTTP. Integration requiere
recursos/revisión y configuración reales independientes. Registrar exitcode y pruebas ejecutadas,
fallos/skips/bloqueos y evidencia por capa; cero pruebas no valida nada.

## Recorridos y trazabilidad

| Requisito / criterios | Escenarios | Validación necesaria |
|---|---|---|
| AD06 / SC001 | US1.1–6 | Crear incompleto, guardar/reabrir tras reinicio; misma identidad; fallo y doblePOST; ninguna exposición pública; acceso inválido denegado |
| AD06/AD05/AD10 / SC002 | US2.1–7 | Omitir cada campo/recurso, 2/4opciones; bloquear publicación; publicar completa y activar explícitamente; catálogo/archivos reales sin datos privados |
| AD05 / SC003 | US3.1–5 | Desactivar/reactivar con pending y conservar publicación vigente; borrador nunca elegible; conflicto/error no finge cambio |
| AD04/AD06 / SC004 | US4.1–6 | Guardar nueva versión incompleta de publicada activa mantiene textos/audio antiguos; Publicar completo cambia todos juntos; inactiva no se reactiva; dos cuentas conflictoCAS |
| AD03/AD04/AD10 / SC005 | US5.1–7 | Tabla real/búsqueda/filtros/globales; publicada con pending no sumaBorradores; Contacto real sin filtrar correos; cargar/error/vacío distintos; enlace003 |
| Todos / SC006 | US1.6, US3.5, US4.5–6 | Todas las entradas privadas sin sesión/expirada/revocada y CSRF/origen adverso; ninguna lectura/efecto; no replay tras login |
| Todos / SC007 | US5.7 y controles del editor | 360/390/430/768/1024/1280/1440×100/200%, teclado, contraste4.5/3, tamaños~44, axe, lector y revisión renderizada |
| Todos / SC008 | Los31 escenarios | Evidencia por criterio, recursos/revisión/políticas/integración; ningún mock acredita entrega final |

## Fallos críticos de integración

1. Inyectar fallo antes y después de commit, respuesta perdida, dobleclick y solicitudes fuera de
   orden. Consultar recibo; repetir misma clave no duplica ni revierte. Otro payload/clave409.
2. Revocar sesión durante upload/inspección y entre preparación/commit: no registrar ni devolver
   recurso privado. Intentar GET/HEAD/range directo de staging y archivo de borrador sin sesión.
3. Rechazar firmas/MIME falsos, truncados, SVG/animación, audio inválido, límites/cero bytes y path
   traversal/symlink. Timeout/sandbox/proceso terminado no puede producir ready. Probar2inspecciones
   y429, stream sin Content-Length y desconexión. Verificar no archivos privados en dist/public.
   Con el mismo launcher probar namespace sin red, centinela externo ilegible y escritura denegada;
   comprobar AS512MiB, CPU20/21s, NOFILE32, CORE0, threads1, salida1MiB y plazo conjunto30s.
   Forzar exceso de CPU/memoria/salida/plazo y verificar terminación del grupo y ausencia de ready.
   Sin capacidad de aislamiento: medios bloqueados, nunca ejecutar decodificador sin protección.
4. Tras Guardar publicación activa conserva payload completo anterior; tras Publicar muestra nuevo
   conjunto íntegro y conserva ID/links. GET público no contiene working/recibos/correos/revision.
5. Play/pause/seek reales y HTTPRange206/416/HEAD. Desactivar retira catálogo/nuevas lecturas de
   recursos exclusivos; no prometer retirar descargas/cachés ajenas. Reactivar no publica pending.
6. Usar tresIDs iniciales más historia nueva, borrador e inactiva; Ver todas revela elegibles sin
   duplicados. Pregunta editable no vacía funciona sin romper literal inicial/schema1. Recarga/bfcache
   y cambio de opción mantienen actividad local; vigilar red/storage para impedir envío educativo.
7. Cuenta005 en fuente configurada, consulta nueva y baja009 cambian total; respuesta008 no lo
   incrementa. Fuente ausente/error se presenta unavailable. No implementar008 ni enviar correo.
8. Medir objetivos locales con1000metadatos,30lecturas calientes y publicación preparada, anotando
   máquina/p95 y tamaño. Capacidad/disco/backups/proxy/sandbox reales requieren calificación aparte.

## Cierre y bloqueos

Regresión afectada003/005/006 y navegación001, tres motores si disponibles; documentar navegadores
no ejecutados. RecursosP01/P03, políticas009, infraestructuraP02, avisos010, revisión011 y buzón de006
siguen abiertos cuando falte evidencia. No marcar tareas cerradas por crear código o pasar fixture.
Pruebas oficiales de audios/transcripción/derechos/nueve explicaciones requieren materiales reales.
Guardar evidencia con fecha, entorno/navegador, criterio, resultado y ruta, sin datos privados.

## Condiciones reales del entorno y resultados

`test:story-management` requiere poder crear user namespaces y los binarios/bibliotecas Linux
incluidos en R5. Dentro del sandbox restringido de esta sesión, los tests que aceptan medios fallan
cerrados con503; no son pruebas aprobadas ni motivo para desactivar el aislamiento. Ejecutar en
un entorno que permita el launcher mediante el flujo de aprobación de la plataforma. No elevar
el servicio productivo ni quitar bwrap/prlimit para conseguir resultados positivos.

Para Chromium local, el banco detecta el ejecutable mediante `PRIVA_CHROMIUM_EXECUTABLE`:

```bash
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:story-management:service -- --project=chromium
```

El banco de navegador compone006/007 y shell003; el contador005 se verifica en un bancoHTTP separado.
Los datos se identifican como sintéticos; cuentas y medios se crean
solo en un directorio privado temporal y se destruyen al terminar. No usar sus credenciales fuera
del banco. Prueba de integración productiva falla explícitamente mientras no haya entorno real
calificado; no redirige a fixtures. Firefox/WebKit no están instalados en este entorno.

Resultados detallados, criterios31 y tareas56/60 en evidence.md. La entrada productiva exige también
los gates006/007, vistas privadas y variables `PRIVA_ADMIN_DATA_DIR`, `PRIVA_ADMIN_PUBLIC_ORIGIN`,
`PRIVA_ADMIN_MAIL_ADAPTER` y `PRIVA_CONTACT_DATABASE` según corresponda, sin valores secretos enGit.
La raíz privada de medios se rechaza si está dentro del checkout. No se ejecutó esa entrada con
configuración productiva ni se modificaron aprobaciones para desbloquear el build.

## Conexión local003–007 vigente

`npm run dev:local`: catálogo real en el mismo origen local, sin cuentas nuevas ni publicación automática.6/6 pruebas de navegador y2/2 pruebas Node nuevas;17regresiones aprobadas/2bloqueadas por ffmpegLinux ausente. Catálogo vacío confirmado. [Configuración, comandos y límites](local-connection.md).

## Estado vigente del inspector macOS

2026-10-28: adaptación implementada;42/42 pruebas007 aprobadas, incluidas subidas/importación y aislamiento nativo. Las limitaciones anteriores de FFmpeg ausente son históricas. `npm run build:media:macos` construye el supervisor y `npm run test:story-management:macos` verifica la suite. Memoria física supervisada cada5ms en Mac, sin afirmar equivalencia al límite virtual duro Linux. [Evidencia final y límites](macos-media-validation.md). No se publicaron fichas pendientes ni se cerró operación productiva.
