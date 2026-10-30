# Alcance de cierre aprobado para la demo

Fecha: 2026-10-30, America/Bogota. La responsable indicó: «Apruebo terminar la 001 con el alcance de la demo publicada; el panel administrativo y los requisitos de producción quedan pendientes». Reiteró: «apruebo 001».

Esta decisión modifica el alcance de aceptación de 001 para la demo actualmente publicada en https://priva-785cb.web.app. No acredita pruebas todavía no ejecutadas ni una sesión de lector de pantalla.

## Alcance vigente

- Cuatro páginas: Inicio, Historias, Priva App y Contacto de prueba.
- Header compartido: logo, cuatro enlaces en orden, página activa, menú compacto/Escape/foco/resize y CTA a Casos/Descarga.
- Footer de demo compartido: identidad «Priva · Demostración educativa», enlaces «Términos de la demo», «Privacidad de la demo» y «Contacto», con sus páginas reales. Doce recorridos complementarios entre cuatro páginas y tres enlaces.
- Build de aceptación: npm run build:demo, siete páginas en .demo-dist y la versión publicada del mismo contenido. Se mantiene el build completo y sus guards sin alterarlos.
- Matriz de navegación de siete anchos y texto100/200% sobre el build real de la demo; recorridos publicados en Chromium/Firefox/WebKit. Sin API simulada ni páginas de relleno; no se envían formularios.

## Requisitos diferidos de producción

G04 original: footer con logo, lema «Defendiendo la soberanía digital individual.» y copyright «© 2026 Priva. Todos los derechos reservados. Navega con dignidad.». G05 original: enlace panel administrador a /admin/login y autorización006 real, con401/403 para documentos/APIprivados. G06 original: documentos finales y Contacto real de005/009/010. SC-003 original:16destinos complementarios. Se conservan en el contrato de producción y en SiteFooter/navigation.ts; no se certifican con el footer de demo o respuestas404.

Los requisitos operativos de administración, privacidad y build de producción siguen pendientes en006/009/010y en las features correspondientes. Se retoman antes de habilitar la versión completa; quedan fuera del cierre demo aprobado.

## Revisión humana

La revisión previa de Mac/VoiceOver en Inicio permanece en evidence/manual-navigation-review.md con su alcance original. Esta aprobación de alcance y la frase «apruebo 001» no describen una nueva ejecución de lector sobre las cuatro páginas actuales. La comprobación manual final exigida porT026 se documentará como realizada o pendiente con exactitud.
