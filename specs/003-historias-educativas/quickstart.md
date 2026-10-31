# Guía de validación — 003

Actualización:2026-10-30. Demo cerrada:35/35tareas;51/51 pruebas publicadas y revisión humana confirmada. [Cierre y reproducción](evidence/demo-closure-2026-10-30.md). Producción diferida. Registros iniciales de planificación se conservan como históricos.

## Prerrequisitos

Desde raíz del repo: Node>=22.22 (actual24.19.0), npm y Python3; npm ci usa lock actual.
Chromium del sistema disponible; Playwright Firefox/WebKit requieren resolver sus fallos de
perfil/bibliotecas documentados en002 antes de declarar cobertura. No desactivar protecciones.
Para contrato, datos/imagenes/audio reproducibles de prueba explícitos; nunca materiales finales.
Para integración, catálogo007 real, URL oficial compartida, recursos y revisiones aprobadas,
páginas reales de destinos y hosting que soporte medios/seeking y estados vigentes.

## Comandos actuales

```bash
cd /workspace/Privaweb
npm ci
npm run check:contract
npm run check:home:contract
```

Los bancos001/002 no prueban003. El build de entrega actual sigue bloqueado por páginas
faltantes y gate editorialInicio; no eliminar esas comprobaciones para ejecutar003.

## Comandos previstos tras implementación

Estos scripts/archivos todavía no existen; crearlos en tasks/implement, no ejecutar ahora como evidencia.

```bash
node --experimental-strip-types --test tests/stories-contract.test.ts tests/stories-publication.test.ts
npm run check:stories:contract
npm run build:stories:contract
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:stories:contract -- --project=chromium
npm run test:e2e:stories:contract -- --project=firefox --project=webkit
```

Configurar Playwright stories: puerto4324, salida `.test-output/stories`, cache `.test-output/stories-cache`, artefactos `.test-output/stories-artifacts`,
reporte `.test-output/stories-results.json`. El servidor del banco debe soportar archivos de
medios y Range para probar avance real; usar respuesta/intercepción de catálogo controlada
sin duplicar componentes. No tocar puertos/salidas de los otros bancos.

## Escenarios contractuales

1. Catálogo de prueba: tres iniciales+una nueva elegible. Ver todas revela4 sin duplicar;
   validar vacío, fallo de red, esquema/IDs inválidos, respuesta tardía y reintento.
   Probar rechazo de registro privado, sin confundirlo con filtrado servidor real.
2. Tres archivos reproducibles de prueba: play, pause, seek y duración real; acceso fallido,
   decodificación fallida y transcripción legible; ausencia de autoplay y números fijos.
3. Cada una de9 opciones: riesgo/prevención correctos para fixture, cambio inmediato y anuncio;
   independencia, recarga y restauración bfcache sin selección/feedback persistido.
4. Observar requests/storage/cookies antes/después: catálogo/medios permitidos, ninguna petición
   ni almacenamiento de selección. Foco permanece en control; no puntuación ni comentarios.
5. Matriz14 casos de viewport/texto, teclados, axe/contraste, imágenes fallidas y enlaces.
   Con JS deshabilitado hay mensaje honesto, contenidos estáticos y enlaces utilizables.
6. Gate: recurso/URL/revisión ausentes, URL peligrosa, IDs duplicados y testOnly rechazan;
   configuración de prueba no pasa guard de producción. Sin fallback estático.
7. Regresión001/002 tras cambios compartidos; guard de build/entrada mantiene bloqueos reales.

## Aceptación integrada (solo tras resolver dependencias)

```bash
PRIVA_INTEGRATION_BASE_URL=https://entorno-real-verificado.example npm run test:e2e:stories:integration
npm run build
```

La URL anterior ilustra una variable y debe reemplazarse por entorno real; no es destino del producto.
Suite sin variable debe fallar con bloqueo explícito, no pasar por omisión. Ejecutar publicación,
desactivación, reactivación y edición en007 con datos de prueba autorizados: nueva lectura excluye
borrador/inactiva, preservaIDs, no revela datos privados; verificar recursos/origen/cachés.
Comprobar archivos finales, transcripciones equivalentes y las9 explicaciones con respaldo.
Saber más llega a Inicio real; Instagram coincide con005. Revisión visual PDF2 con activos finales,
lector de pantalla y navegadores disponibles son evidencias separadas de fixtures.

Registrar por criterio fecha local, navegador, entorno, resultado y ruta de evidencia.
Recursos, backend, navegador o destino faltantes se registran bloqueados, nunca aprobados.
No emitir aceptación integral por pasar banco o por existir contrato/documentación.

## Reanudación — 2026-10-26

Marca, fuente y paleta compartidas recibidas desde001 e incorporadas a003. Las seis imágenes aportadas se identifican por nombre/destino en [evidence/materials.md](evidence/materials.md); sus archivos originales todavía no están disponibles en el entorno/GitHub. No se marcan verificadas ni se inventan dimensiones. Se conserva el bloqueo de imágenes propias/editorial/Instagram y aceptación integrada. Carpeta GitHub `public/images/stories/` preparada para recibir los PNG.

2026-10-26 — Archivos de las seis imágenes recibidos en6e7f523 y conectados con dimensiones/procedencia verificadas. Tres ilustraciones de bloques y tres portadas por ID inicial, sin alterar publicación/estados007. Los avisos anteriores de falta de archivos son históricos. Audios: carpeta fuente content/stories/audio/ preparada en GitHub; revisar transcripciones/explicaciones antes de publicar. [Evidencia](evidence/connected-images.md).

## Aprobación editorial aplicada — 2026-10-28

La responsable respondió «Sí, apruebo los textos públicos corregidos» para hero, metodología, cierre, identidad, catálogo y pasos Escucha/Reflexiona/Aplica. Se registraron cinco snapshots inmutables en src/content/stories-review.json, con referencia a evidence/public-copy-review.md; el guard sigue invalidando modificaciones materiales. No se aprobaron ejercicios ni se importaron/publicaron historias.

Verificación: 45/45 pruebas Node Inicio/Historias, guard003 salida 0 y Astro check (95 archivos, 0 errores/advertencias, 1 hint previo). Integración real002: 18/18 aprobadas, seis recorridos por motor Chromium/Firefox/WebKit. Historias HTTP200; /api/public/historias HTTP404: el catálogo007 aún no está conectado al servidor local. Captura .test-output/stories-approved.png. Build completo conserva salida1 en guard010/009.

La navegación desde Inicio ya está verificada; T027/T031 de002 mantienen el requisito residual de build completo, y T028 el cierre integral: 30/33 tareas. No se confunde renderizado de Historias con disponibilidad del catálogo, aprobación de ejercicios ni publicación productiva. Logs: .test-output/stories-approved-unit.log, stories-approved-check.log, home-approved-integration.log y home-approved-build.log.

Conexión007 vigente — 2026-10-28: /api/public/historias ya responde200 con SQLite real en el servidor local. No hay publicaciones activas; la UI muestra vacío confirmado.6/6 pruebas navegador aprobadas. [Detalles y límites](../007-gestion-historias/local-connection.md). Los registros anteriores de catálogo404 son históricos.

## Publicación local vigente — 2026-10-28

Cuatro historias autorizadas/publicadas/activas en catálogo007 real, incluido Número desconocido con portada oficial reutilizada expresamente aprobada. Tres recorridos navegador completos aprobados, audios/transcripciones/doce explicaciones y expansión verificados; no mocks. Publicación local no equivale a despliegueFirebase ni cierra revisión manual/build productivo. [Registro](evidence/local-publication.md). Los estados anteriores de catálogo vacío o fichas sin publicación son históricos.

## Botón de acceso a la cuarta historia — 2026-10-28

A petición de la responsable, el control se llama «Ver más historias» y aparece centrado debajo de las tres tarjetas iniciales, en vez de junto al encabezado. Al activarlo con teclado/puntero se añade Número desconocido sin duplicar ni reconstruir los casos previos, se lleva el foco/vista al nuevo título y se oculta el botón ya consumido. Se mantienen aria-controls/aria-expanded, recarga y estados de error/vacío. Con tres o menos se conserva no añadir tarjetas. Corrección de H02/T009–T010/T017; no cambia la publicación ni las fichas.

Verificación real:3/3 recorridos completos Chromium/Firefox/WebKit, incluidos botón por debajo del catálogo, Enter, foco visible en cuarta, reproducción/transcripciones/doce explicaciones;2comprobaciones adicionales con puntero a1440px/100% y390px/200%, sin overflow. Log .test-output/stories-more-browser.log y captura .test-output/stories-more-button.png. Pruebas/contratos actualizados al nombre vigente.

## Integración local vigente

2026-10-28:32/35tareas, T028/T030cerradas;30/30principalFirefox/WebKit y9/9integración real007 con estados/medios/edición verificados enDBaislada. T031cotejo/coherencia, T032manual y T033calificación/build siguen pendientes. [Resultados y reproducción](evidence/transitions-review-2026-10-28.md).
