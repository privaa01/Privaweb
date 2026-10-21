# Accesibilidad010

**Fecha**: 2026-10-20 (America/Bogota). Alcance local sintético.

Chromium y Firefox: siete anchos360/390/430/768/1024/1280/1440, raíz de texto200% con medición de fuente de cuerpo≥32px, sin desbordamiento que impida lectura. Teclado/foco/menú/Escape, aviso y enlaces/regreso verificados. Axe sin violaciones en documentos,404 y Contacto sintético; no equivale a certificación completa. Regresión00145casos y00539casos de navegador pasan en Chromium.

Inspeccionadas capturas locales de Manifiesto a390px y404 a1440px: lectura en columna, jerarquía, retorno y footer sin corte observado. Solo recursos/tipografía compartidos existentes y fixtures explícitas, no fidelidad contra materiales oficiales ni aprobación del diseño011.

WebKit no arranca por bibliotecas del host, incluida libGLESv2.so.2. No se desactivó validación. Lector de pantalla y revisión visual de contenido/materiales finales pendientes; T033/T034 no se cierran plenamente por pruebas de Chromium/Firefox. No se cuentan casos no ejecutados como aprobados.
