# Implementación visual de 011 — 2026-11-06

Estado: ajustes públicos implementados y verificados localmente; cotejo autenticado del panel (T014) completado; aceptación visual final (T015) registrada. X04 cerrado para el alcance demo/local con las diferencias expresas siguientes; sin publicación.

## Cambios

- T010: footer de la demo con identidad y lema a la izquierda, navegación a la derecha y copyright 2026 separado por línea. Mantiene títulos/destinos de documentos aprobados y acceso administrativo solo en loopback. El logo SVG original conserva su color sobre placa clara para legibilidad, sin redibujarlo.
- T011: Historias recupera marcos, botones redondeados, cápsulas de categoría, fondo de tarjetas y caja interior del ejercicio, tarjetas/iconos de metodología y paneles de identidad. Se conservan los reproductores nativos accesibles y transcripciones, las cuatro portadas, contenido aprobado y «Ver más historias» debajo del catálogo (posición ya utilizada y aprobada; no se añade un catálogo separado).
- T012: App recupera escala de teléfonos, beneficios y pasos con tarjetas/iconos, iconos de funciones, alternancia de fondos, degradado del hero y cierre oscuro. Altura a 1280px: aproximadamente3358px frente a4350px antes; PDF3249px. No se impone altura fija: textos de demo y avisos añadidos explican diferencias y deben poder crecer al200%.
- T013: Inicio recupera punto de insignia, énfasis decorativo del título y proporciones hero/cierre. Contacto incorpora iconos de Instagram/correo/enlace externo/temas, insignia, marco y controles redondeados. Conserva Formulario, Nombre sin alias, las etiquetas de temas vigentes, el texto aprobado y las tres insignias. No se reponen plazos/servicios no habilitados.
- Iconos decorativos compartidos en src/components/ui/PublicIcon.astro, aria-hidden y sin controles nuevos.

## Pruebas

- Build demo:7páginas generado correctamente.
- Astro check --root demo:99archivos,0errores,0warnings,1hint previo de returnValue obsoleto en admin-inbox.ts (sin cambios).
- Playwright/Chrome local:7/7casos,98combinaciones de ancho(360/390/430/768/1024/1280/1440) y texto100/200%, sin desbordamiento horizontal y sin infracciones axe detectadas. Verificación de menú/foco, alternativas, tres episodios iniciales/cuarto expandido, transcripciones y feedback de ejercicios. Registro .test-output/011-visual-accessibility.log.
- Tras añadir iconos de temas, se repite solo Contacto:1/1caso,14combinaciones, aprobado. Registro .test-output/011-visual-contact-recheck.log. El JSON compartido del recheck contiene solo esta última repetición; la campaña completa consta en el registro anterior, no se presenta como un mismo reporte final.
- Capturas de las cuatro páginas, tras cargar todas las imágenes, inspeccionadas: .test-output/011-after-index.png, 011-after-historias.png, 011-after-app.png y 011-after-contacto.png. Comparación visual con las referencias de seis páginas registradas en wireframe-review-2026-11-06.md; sin porcentaje de igualdad ni garantía píxel a píxel.
- git diff --check:sin errores.

## Límites y siguiente acción

La responsable inició sesión personalmente y confirmó el acceso. Se observó la pantalla autenticada de Historias a1280px (ancho de la referencia), la composición de barra lateral/consola/resumen/tabla/CTA y sus cuatro filas reales; se abrió y cerró el editor de Enlace falso sin editar campos ni guardar. Se recorrió Contacto privado, donde constan0consultas y el estado vacío, con correo desactivado. Se regresó a Historias y se restauró el viewport normal. La revisión fue mediante la pestaña IAB autenticada, sin extraer cookies ni credenciales y sin sustituirla por una UI sintética.

Diferencias administrativas conservadas y registradas: filtro de estado mediante select nativo en lugar de cápsulas; acciones Editar/Desactivar con texto en lugar de iconos/interruptor; columna Publicación y cifras reales en vez de respuestas ficticias; sin avatar/cuenta inventados ni comentarios públicos. La composición general coincide, no se afirma reproducción exacta. El editor privado sigue mostrando el recurso importado anteriormente; los cambios públicos de portadas no migran automáticamente esos registros privados independientes. No se modifican en esta revisión.

La confirmación manual VoiceOver anterior sigue como evidencia de su recorrido previo. Los cambios actuales se verifican automáticamente; no se inventa nueva aceptación visual ni lectura manual posterior. La responsable revisó y aprobó el resultado concreto de T015 en la respuesta registrada al final. No se modifica el PDF original, cuyo año ya es2026; no se cambia el aviso de privacidad rechazado ni el texto vigente del artículo público. No se hacen commit/push/deploy en esta ejecución.

## Aceptación final — 2026-11-06

La responsable respondió «Sí, apruebo el resultado visual de la 011» a la pregunta sobre Inicio, Historias, Priva App, Contacto y panel local, conservando imágenes/textos aprobados y las diferencias del panel (filtros/acciones con texto, datos reales y Contacto privado). La pregunta aclaró que la aprobación no publica el sitio. Se completa T015 y se cierra la 011 para el alcance demo/local. No es una declaración de igualdad píxel a píxel ni de preparación productiva; no se reabren los requisitos diferidos de 006–010. El PDF ya contiene2026 y no requirió edición. Commit/push/publicación no ejecutados por esta aceptación.

## Ajuste posterior: preguntas dentro de su panel

Por observación de la responsable, se baja la pregunta del borde superior al interior del fieldset: padding1.25rem, legend flotante con separación inferior y opciones con clear. Se conserva semántica legend/fieldset y el texto; no se modifica contenido editorial. Se oculta el feedback vacío. Build correcto; cuatro episodios comprobados a1440/390px: título al menos18px dentro del panel, opciones/feedback funcionales, axe sin infracciones y sin desbordamiento. La primera llamada al bancoaxe utilizó contexto implícito y se repitió correctamente con newContext. Capturas .test-output/story-question-spacing-1440.png y story-question-spacing-390.png. Ajuste local pendiente de commit y publicación.
