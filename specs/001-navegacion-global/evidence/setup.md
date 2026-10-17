# Setup — 001

Fecha: 2026-10-16 (America/Bogota). Node 24.19.0, npm 11.9.0, Python 3.12.14.
`npm install` creó lockfile; `npm ci --no-audit --no-fund` terminó correctamente.
Astro 7.4.0, check 0.9.10, TypeScript 5.9.3, Playwright 1.64.1, axe 4.14.0.
`npm run check:contract`: 0 errores, 0 advertencias; el proyecto incluye componentes reales.
`npm run build:contract`: genera archivos .html reales en .test-output/navigation.
Cuatro páginas principales de prueba y tres destinos explícitamente ficticios; sin dist de entrega.

Astro inicialmente intentaba escribir configuración de telemetría fuera del workspace;
se corrigió con ASTRO_TELEMETRY_DISABLED=1 en scripts. La instalación mantuvo TLS.
Astro preview no pudo iniciar; el servidor contractual Python sirve la salida estática
y no interpreta componentes ni simula autenticación. Playwright inicia/detiene ese servidor.
La descarga de navegadores se bloqueó con 403 Domain forbidden en cdn.playwright.dev.
Se usó Chromium del sistema con PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium.
No se ejecutaron pruebas inexistentes durante el setup: los casos se añadieron desde T008.
