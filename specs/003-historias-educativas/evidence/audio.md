# Audio — evidencia contractual

2026-10-17, Chromium sistema, H03–H06/SC-002. Tres WAV sintéticos de4/5/6 segundos,
mono16kHz, guardados exclusivamente en tests/fixtures/stories/public/media/public.
Play() real tras gesto, tiempo avanza, pause y seek2s comprobados para los tres; sin autoplay.
Duración de metadatos0:04/0:05/0:06, nunca los números del PDF. Servidor fixture devolvió206
para Range bytes0–99 y cuerpo100bytes. Error404 y archivo corrupto producen estado de error
sin retirar transcripción/actividad. Son sonidos sintéticos, no relatos oficiales.

Transcripción de fixture describe el tono; equivalencia de los tres relatos reales pendiente.
Controles nativos de teclado/lector de pantalla y reproducción en hosting final se revisan en
T032/T033. Fallos de arranqueFirefox/WebKit en accessibility.md, no se cuentan como aprobados.
