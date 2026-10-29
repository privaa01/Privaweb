# Estado vigente de regresión e integración — 2026-10-28

32/35tareas: T028/T030 completas.30/30pruebas principalesFirefox/WebKit y9/9integración real007, con transiciones aisladas y recursos oficiales. Pendientes cotejo/coherencia de materiales, revisión manual y calificación/build. [Evidencia](transitions-review-2026-10-28.md). Registros siguientes históricos.

# Resumen de implementación — 003

Actualización: 2026-10-26 (America/Bogota). Estado: componentes y banco contractual implementados;
publicación y aceptación integrada pendientes. Rama main; sin commit ni push en esta fase.

## Implementado

- Hero, catálogo completo en la misma página, método, recordatorios institucionales y cierreC16.
- DTO público estricto, URLs autorizadas y lectura same-origin sin credenciales/caché persistente;
  carga/error/vacío/reintento, cancelación de solicitudes antiguas y revalidación al regresar.
- Audio nativo real, metadatos, errores y transcripción independiente. Retirada pausa/libera medios.
- Tres radios por caso, feedback inmediato accesible, independencia y reset; cero envío/storage.
- Gate de recursos/editorial/Instagram/marca/contrato en prebuild y entrada real. Sin bypass público.
- Configuración social única para003/futura005, actualmente pendiente. Sin proveedor/dependencia nueva.

## Verificado

| Validación | Resultado | Evidencia |
|---|---|---|
| Unitarias contrato y publicación |40/40 aprobadas | contract.md, publication.md, unit-results.json |
| Interfaz en Chromium |29/29 aprobadas; incluye14 combinaciones ancho/texto | contract-results.json |
| Regresión navegación001 |44/44 aprobadas | verification.json |
| Regresión Inicio002 |23/23 aprobadas | verification.json |
| Astro check raíz y banco003 |0 errores/advertencias/hints | verification.json |
| Build banco003 | Aprobado por servidor de Playwright | contract-results.json |
| Prebuild003 y entrada real | Bloquean por recursos/revisión pendientes | publication.md |
| Build completo | Bloqueado por páginasapp/contacto, sin omitir guards | publication.md |

Total136 pruebas aprobadas (40 unitarias +29UI de 003 +67 regresión). Son pruebas contractuales;
no acreditan materiales oficiales, servicio007, hosting, revisión editorial ni publicación.
Capturas desktop-fixture.png/mobile-fixture.png inspeccionadas para estructura, no fidelidad final.

## Tareas

30/35 completas: T001–T027, T029, T034 y T035. Abiertas:

- T028 parcial: suite de integración escrita; falta harness real de transiciones007/recursos privados.
- T030 parcial: intentosFirefox/WebKit fallaron al arrancar por perfil/bibliotecas; sin cobertura aprobada.
- T031 parcial: seis imágenes y recursos compartidos recibidos; faltan audios, transcripciones, nueve explicaciones y respaldo editorial. Instagram resuelto con @priva_inc.
- T032 bloqueada: lector de pantalla, teclado manual nativo y comparación visual con recursos finales.
- T033 bloqueada: catálogo007 real, páginas/destinos/materiales y entorno de integración.

La documentación sincronizada permite retomar cada pendiente sin afirmar cierre integrado.

## Correcciones y límites

La primera matriz modificaba fuente después de visitar fragmento y produjo4 fallos de viewport.
Se aplicó fuente antes de load y se repitió suite completa, manteniendo la aserción de visibilidad.
Se aislaron namespaces de IDs de encabezado/opción/estado para evitar colisiones al combinar IDs.
La revisión de textos incluye copy compartido de catálogo/pasos para detectar cambios posteriores.

Sin cambios en componentes compartidos001/002, sin instalación ni incremento de dependencias.
El contrato007 es consumidor/propuesta documentada, no backend creado. No se guardan respuestas.
Un intento simultáneo de navegadores fue rechazado por puerto ocupado; repetido secuencialmente.
Firefox/WebKit fallidos y servicio ausente no se convierten en resultados aprobados.

## Reanudación003 — 2026-10-26

La usuaria aportó previsualizaciones de seis PNG. Se identificaron tres portadas de casos y tres ilustraciones de bloques; los archivos binarios aún no están disponibles en el entorno ni GitHub. Carpeta `public/images/stories/` preparada y subida en6e7f07e para recibirlos, sin publicar imágenes ficticias. Mapa de nombres y destinos en materials.md.

Se incorporaron a storiesContent el logo oficial compartido y referencias de Plus Jakarta Sans/paleta ya recibidas; CSS usa tokens aprobados y foco claro en cierre oscuro. El banco conserva imágenes institucionales/catálogo sintéticos, pero reutiliza la marca real.40pruebas unitarias y29Chromium aprobadas tras el cambio; check contractual sin errores/advertencias/hints. Los bloqueos de marca y referencias visuales desaparecen; siguen imágenes propias, revisión editorial, Instagram y materiales/catálogo final.30/35 tareas sin cambios.

2026-10-26 — Recorridos principales Firefox disponibles:15aprobados,0fallos/omitidos;14casos de matriz excluidos por diseño con `--grep-invert="stories [0-9]+px text"`. Ver resume-2026-10-26-firefox.txt. Esto supera el bloqueo histórico de arranque Firefox para003. WebKit no se reejecutó en esta reanudación: conserva dependencia host pendiente según última evidencia de001; T030 sigue parcial.

2026-10-26 — Perfil oficial aportado por la responsable: https://www.instagram.com/priva_inc/. Configuración compartida003/005 actualizada; validadores dejan de indicar Instagram pendiente.106pruebas Node aprobadas (40Historias+66Contacto), sin cerrar otros bloqueos. Comprobación remota impedida por rechazo CONNECT403 del proxy, sin respuesta del perfil; no se presenta como verificación de disponibilidad. Ver social-reference.md.

## Imágenes conectadas —2026-10-26

Hero/metodología/cierre usan imágenes500×350 verificadas; los tres casos iniciales usan portadas660×195 como valores por defecto de la importación restringida007. Sin forzar imágenes ni estados del catálogo público y sin publicación automática.41unitarias003,38Node007 y29Chromium003 aprobadas; tipo/ASTRO conformes. Vista de imágenes rotulada con audios sintéticos, proporciones sin recorte a1440/390. El guard003 solo indica cinco revisiones editoriales pendientes. Audios originales pueden subirse a content/stories/audio/, ya preparada en GitHub. Ver connected-images.md;30/35 tareas.

## Recepción de audios —2026-10-26

GitHub325fc49 sincronizado: cuatro MP3 aportados y aprobados por la usuaria, validados por el inspector aislado real. Duraciones109.954667/118.993042/142.999542/138.7155s, sin modificar bytes. Se registró manifiesto con hashes y aprobación; falta identificar cada caso y el uso del cuarto audio antes de asociar los reproductores. Ver audio-approval.md. Transcripciones, explicaciones y editorial siguen pendientes.30/35 tareas sin cierre por recepción de archivos.

## Audios asociados —2026-10-26

La responsable confirmó la correspondencia1Contraseña/2Llamada/3Enlace y4Número desconocido para el contenido ampliado. Los tres IDs iniciales ya seleccionan sus archivos MP3 aprobados en el importador007 cuando audioPath se omite, con SHA-256 e inspección real. El cuarto se identifica en el manifiesto, pendiente de ficha completa y creación/publicación/activación normal. No se inventan transcripciones ni ejercicios. Ver audio-assignment.md;30/35 tareas sin cierre de materiales/editorial/integración por aprobar archivos.

## Revisión final local — 2026-10-28

Corrección del desbordamiento interno de Leer transcripción al200%; matriz posterior42/42 en3motores con cuatro historias oficiales, tipado conforme. La responsable acepta visualmente el resultado. Auditoría real de entrega de cuatro audios íntegros/rangos/caché y catálogo completo conforme; build completo mantiene bloqueo operacional009/010. T031/T032/T033 parciales,32/35. Detalles:accessibility-final-materials-2026-10-28.md y delivery-review-2026-10-28.md.
