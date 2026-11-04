# Revisión manual confirmada — 2026-11-03

La responsable respondió «Sí, lo comprobé con teclado y VoiceOver» a la pregunta específica sobre títulos, enlaces y vuelta a Inicio/Contacto en Términos de la demo, Privacidad de la demo y página404 publicadas. Se registra como declaración de prueba de la responsable, sin atribuir escucha automática al agente. Antes de esta confirmación hubo dificultad de foco en el navegador integrado; se abrió el documento público en Safari y se situó el foco en contenidoHTML. No se presupone cuál navegador utilizó para cada página.

T034 completa para los documentos de la demo actual, en conjunto con las revisiones visuales y matrices adaptables ya registradas. Recursos: tipografía/identidad/layout compartidos existentes, sin nuevos archivos oficiales requeridos para estas páginas auxiliares. No se recibió wireframe específico de documentos ni se certifica equivalencia a uno. Esta confirmación no aprueba contenido legal, vigencia o condiciones productivas; T038/T039 y demás gates permanecen separados. Estado36/44, ocho tareas abiertas.

Los apartados siguientes conservan resultados históricos.

# Estado vigente — 2026-10-28

35/44tareas: T028destinos reales y T033accesibilidad completas.9/9pruebas locales reales,3/3pruebas de matriz(84celdas) y27/27Node aprobadas. Documentos sin aprobación editorial/calificación productiva. Lector manual, HTTPno-referrer/admin y configuración de entrega continúan pendientes. [Detalle y comandos](local-review-2026-10-28.md). Los registros siguientes son históricos.

# Accesibilidad010

**Fecha**: 2026-10-20 (America/Bogota). Alcance local sintético.

Chromium y Firefox: siete anchos360/390/430/768/1024/1280/1440, raíz de texto200% con medición de fuente de cuerpo≥32px, sin desbordamiento que impida lectura. Teclado/foco/menú/Escape, aviso y enlaces/regreso verificados. Axe sin violaciones en documentos,404 y Contacto sintético; no equivale a certificación completa. Regresión00145casos y00539casos de navegador pasan en Chromium.

Inspeccionadas capturas locales de Manifiesto a390px y404 a1440px: lectura en columna, jerarquía, retorno y footer sin corte observado. Solo recursos/tipografía compartidos existentes y fixtures explícitas, no fidelidad contra materiales oficiales ni aprobación del diseño011.

WebKit no arranca por bibliotecas del host, incluida libGLESv2.so.2. No se desactivó validación. Lector de pantalla y revisión visual de contenido/materiales finales pendientes; T033/T034 no se cierran plenamente por pruebas de Chromium/Firefox. No se cuentan casos no ejecutados como aprobados.
