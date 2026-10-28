# Regresión y transiciones003–007 — 2026-10-28

Continuación solicitada después de commit/push41a0908. Checklist documental00316/16intacto. Trabajo sobre T030 y T028; no se publican historias nuevas en la base que usa la responsable.

## T030 cerrada

30/30recorridos principales contractuales aprobados:15Firefox y15WebKit. Casos de expansión sin duplicar/selección conservada, treso menos, error/vacío/reintento y respuestas inválidas, mediosplay/pause/seek/transcripción, nueve opciones independientes/teclado/sin persistencia, bfcache/refresco, contenido seguro y destinos/método. Excluidas explícitamente pruebas `px text`; no se declara matriz completa de estos motores.

Comando: `PRIVA_CHROMIUM_EXECUTABLE="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node node_modules/@playwright/test/cli.js test --config .test-output/stories-review.config.ts --project firefox --project webkit --grep-invert 'px text' --workers 1`. Config temporal deriva de playwright.stories.config.ts; solo cambia cwd/testDir y arranque npm por NodeAstro build del banco existente más Pythonserve.py4324. Log .test-output/stories-principal-review.log.

## T028 cerrada en integración local

9/9pruebas finales aprobadas,3por Chromium/Firefox/WebKit:

- Dos casos por motor contra el sitio local4321: catálogo público007 real/no-store, tresIDs iniciales, expansión a cuatro, recursos audioRange206; enlaces institucionales a encabezados reales deInicio y URLInstagram compartida conContacto. Se corrigió la expectativa antigua de foco en sección para comprobar el h2 de destino conforme al contrato actual. No se visita Instagram ni se afirma accesibilidad remota nueva.
- Un caso por motor contra servidor007/SQLite/medios reales aislados: importa recursos oficiales de tresiniciales y autoriza cuentas exclusivamente sintéticas del banco privado; crea la cuarta ficha con audio/portada oficiales, más un borrador y una publicación inactiva. El catálogo excluye borrador/inactiva y su recurso público devuelve404. El router privado rechaza petición anónima. UI real deHistorias obtiene3 y expande4 con foco.
- Desactivar la cuarta retira su entrada y audio público; recarga obtiene3. Reactivar reincorpora una sola entrada y audioRange206. Guardar cambios conserva la publicación anterior; Publicar cambia el contenido completo manteniendo elID. Nueva lectura/recarga muestra la descripción actualizada y no duplica entradas. DTOsinworking/createdBy/correos/etiquetas privadas.

`tests/helpers/stories-integration-harness.ts` aloja router real007 conDB y archivos temporales separados; la UI/activos son los de la aplicación Astro aprobada, reenviados desde4321. No usa page.route/fulfill, JSONsimulado ni verificador de medios falso. Las escrituras pasan por HTTPautorizado real con sesión/CSRF del banco; importacióninicial usa el importador restringido y el inspector nativo. No se altera la base local publicada de la responsable. Al finalizar se cierran conexiones y se elimina únicamente el directorio temporal creado para la prueba.

Trazas/video/capturas desactivadas en el archivo de integración porque maneja credenciales sintéticas privadas; no se imprimen tokens/cookies ni cuerpos privados. Recursos, cuentas y transiciones del banco no califican producción ni un entorno de administración desplegado.

La campaña inicial tuvo6aprobadas/3fallidas por reloj fijo del banco: nuevos registros quedaban cronológicamente entre los iniciales y la expectativa de foco apuntaba a otra tarjeta. Se avanzó el reloj sintético1000ms después de la importacióninicial; sin cambios al orden de producción ni al código del producto. Un intento previo de configuración de privacidad dentro de describe fue rechazado por Playwright antes de ejecutar casos; se movió a nivel de archivo. Campaña final9/9, sin omitidas; no se suman intentos/repeticiones.

Comando: `TMPDIR=/private/tmp PRIVA_TEST_MODE=integration PRIVA_INTEGRATION_BASE_URL=http://127.0.0.1:4321 PRIVA_CHROMIUM_EXECUTABLE="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node node_modules/@playwright/test/cli.js test --config playwright.stories.config.ts --workers 1`. Log .test-output/stories-integrated-final.log.

## Comprobaciones y límites

TypeScriptestricto del archivo de integración/harness:sin errores (se añadieron extensiones.ts explícitas). Astrocheck95archivos:0errores/advertencias,1hint previo. Node24.22.1/macOSARM64, Playwright1.64.1 y FFmpeg9.0. `git diff --check`conforme. Logs stories-transitions-types.log y stories-transition-check.log.

32/35tareas003 completas. T031 conserva verificación de coherencia/cotejo de materiales pendientes, sin volver a pedir recursos ya recibidos ni exigir respaldo de testimonios reales: son recreaciones y su publicación fue autorizada. T032revisión final/lector y T033calificación/build completo siguen abiertos. La aceptación visual general ya reportada no acredita lector de pantalla. No se elimina el guard009/010 ni se ejecuta despliegue. Se sincronizan los personajes/categorías/opciones del spec con las fichas aportadas y autorizadas para publicar, conservando IDs H/FR y la fuenteR35 como histórica.
