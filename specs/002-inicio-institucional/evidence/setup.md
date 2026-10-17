# Setup — 002

Se reutilizan Astro 7.4.0/TypeScript 5.9.3/Playwright 1.64.1/axe 4.14.0.
Corrección técnica al plan: @types/node 24.19.2 y su dependencia de tipos transitiva se
fijan como desarrollo, porque Node fs/path no estaban tipados en 001. Sin nuevo runtime,
framework o proveedor. npm ci fue ejecutado antes de esa corrección; la instalación de
tipos y check posterior pasaron; npm ci final con lockfile actualizado y check posterior también pasaron.
Banco home: .test-output/home, caché propia, servidor Python 4323, config Playwright independiente.
Las trazas usan .test-output/home-artifacts para no colisionar con test-results de 001.
Se corrigió esa colisión y se repitió la suite completa; el reporte final tiene 23 pases.
La opción full-width de PublicLayout preserva default anterior; no duplica main/header/footer.
