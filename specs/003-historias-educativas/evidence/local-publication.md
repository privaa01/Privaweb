# Publicación local de las cuatro historias — 2026-10-28

Mandato explícito: «publica las historias». La responsable también aprobó reutilizar la ilustración oficial del teléfono para Número desconocido: «Sí, reutilizar la ilustración del teléfono». La autorización se aplica a las fichas preparadas, sus ejercicios y materiales vinculados; no se inventa una revisión individual de cada explicación. Textos generales ya aprobados y audios declarados recreaciones educativas.

## Resultado confirmado

Publicadas y activas en SQLite real del servidor http://127.0.0.1:4321:

1. Enlace falso — enlace-falso.
2. La llamada sospechosa — llamada-sospechosa.
3. La contraseña compartida — contrasena-compartida.
4. Número desconocido — historia-a238ed0c-6d20-48a8-83be-7c27bc9a05a4.

El catálogo muestra los tres iniciales y añade el cuarto mediante Ver todas las historias. Portadas oficiales, audios originales aprobados, transcripciones aportadas y doce opciones con explicaciones. El cuarto conserva la portada oficial reutilizada con autorización. Registro de hashes de las fichas exactas autorizadas en local-publication-authorization.json y recibo del ID generado en local-fourth-receipt.json. No se sobrescribieron fichas previamente gestionadas ni se desactivaron validadores.

## Ejecución privada

`scripts/publish-local-stories.ts` exige modo local y archivo de mandato con hashes, comprueba origen loopback e inspecciona recursos mediante el servicio007. Los tres iniciales usan importInitialStory; cuarto usa Create/upload/save/publish/activate con control de revisión. La creación/activación no se realiza por SQL directo.

El proceso de operador local exige almacenamiento0700 propiedad del UID actual; su autoridad es el comando privado ejecutado por el dueño del almacenamiento. Actor persistente exclusivamente para auditoría, deshabilitado, sin contraseña, verificación de buzón ni sesión web. Contexto transaccional exclusivo del comando y token efímero en memoria; no se importa en el servidorHTTP ni modifica la autenticación del runtime compartido. Prueba dedicada confirma rechazo de otro token y rechazo del token de operador en la autenticación web normal; no se otorgó acceso al panel ni se enviaron correos.

Comando ejecutado: `PRIVA_STORIES_MODE=local node scripts/publish-local-stories.ts specs/003-historias-educativas/evidence/local-publication-authorization.json`. Sin TMPDIR personalizado para usar el mismo almacenamiento canónico que el servidor local. Binarios inspeccionados con el aislador nativo, sin copiar los audios privados a public.

## Verificación

- Tres recorridos completos aprobados, uno por Chromium/Firefox/WebKit, con catálogo007 real sin mocks. API200 y cuatro títulos en orden; tres tarjetas iniciales y expansión a cuatro; las cuatro imágenes cargan; cuatro audios reproducen/pausan/avanzan a10s por motor; transcripciones completas; doce explicaciones cambian correctamente por motor. Medios respondenRange206/no-store/100bytes. No hay POST de ejercicios ni almacenamiento persistente; recarga reinicia selección y muestra los tres iniciales.
- Prueba Node de autoridad privada local aprobada; sin relajar autorización web.
- TypeScript007 y comprobación estricta del script de publicación sin errores. Astro check95archivos:0errores/advertencias,1hint previo.
- Logs .test-output/stories-publication.log, local-publication-result.json, stories-published-browser.log, stories-published-results.json, stories-publication-script-types.log y stories-publication-check.log. Capturas stories-published.png (interacciones) y stories-published-overview.png (vista legible).

## Alcance

Publicación en el catálogo local visible en este chat; no despliegue de Firebase ni publicación en un dominio externo. Persistencia en directorio local privado configurado del MVP; temporales pueden ser limpiados por el sistema. No cierra respaldo/restauración, revisión manual final ni build productivo010/009. La publicación inicial local está resuelta; no seguir presentando estos cuatro como borradores sin publicar.

## Botón de acceso a la cuarta historia — 2026-10-28

A petición de la responsable, el control se llama «Ver más historias» y aparece centrado debajo de las tres tarjetas iniciales, en vez de junto al encabezado. Al activarlo con teclado/puntero se añade Número desconocido sin duplicar ni reconstruir los casos previos, se lleva el foco/vista al nuevo título y se oculta el botón ya consumido. Se mantienen aria-controls/aria-expanded, recarga y estados de error/vacío. Con tres o menos se conserva no añadir tarjetas. Corrección de H02/T009–T010/T017; no cambia la publicación ni las fichas.

Verificación real:3/3 recorridos completos Chromium/Firefox/WebKit, incluidos botón por debajo del catálogo, Enter, foco visible en cuarta, reproducción/transcripciones/doce explicaciones;2comprobaciones adicionales con puntero a1440px/100% y390px/200%, sin overflow. Log .test-output/stories-more-browser.log y captura .test-output/stories-more-button.png. Pruebas/contratos actualizados al nombre vigente.

## Aceptación de la responsable

2026-10-28: después del ajuste del botón la responsable indicó «todo esta perfecto, ahora sigamos con la suguiente tarea». Se registra aceptación general de la interfaz mostrada de Historias; no se atribuyen anuncios de lector de pantalla, contraste medido ni despliegue productivo a esta respuesta. Se continúa con004.
