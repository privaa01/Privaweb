# Investigación — Inicio 002

**Fecha**: 2026-10-16. Fuentes: spec 002/R35, constitución, inspección de código y lockfile
existentes, resultados registrados en 001 y revisión independiente de investigación.
No se presenta una nueva consulta de registro ni prueba de 002 como realizada.

## 1. Reutilización del stack

**Decisión**: mantener versiones exactas del lockfile y PublicLayout(pageId='inicio').
Usar componentes Astro estáticos, contenido tipado local y CSS propio; JS de anclas ya existente.
**Motivo**: 001 ya integra header/footer semánticos, foco, CTA y salida .html. Inicio no
necesita estado interactivo adicional ni llamadas a datos para leer contenido.
**Alternativas**: CMS/React/backend o actualización de versiones añade infraestructura no
requerida; duplicar layout crea divergencia de contratos y pruebas.

## 2. Build independiente sin eludir el de entrega

**Decisión**: banco `tests/fixtures/home` que importa componentes reales con root/config/check
propios, salida `.test-output/home` y caché separada. Suite/config Playwright independientes,
puerto interno 4323 y resultados separados de navegación.
**Motivo**: `scripts/require-pages.mjs` exige index/historias/app/contacto y no existen todavía
las páginas reales. Debe poder probarse 002 sin construir 003–005 artificialmente.
**Alternativas**: quitar el guard o copiar fixtures a src/pages/dist fingiría integración;
sobrescribir fixtures de navegación dificultaría la regresión de 001.
Servidor: Python http.server sobre salida estática real. Astro preview falló en 001;
no se vuelve a depender de ese proceso para validar el banco.

## 3. Recursos y revisión editorial

**Decisión**: inventario por bloque con estado explícito, origen y alternativa; comprobar
existencia de archivos y revisión de copy antes de construir y renderizar la entrada de entrega.
Un pre-build valida antes de Astro; la entrada real conserva validación defensiva.
**Motivo**: R35/CONST-08–09 impiden inventar imágenes o afirmar curaduría/asistencia sin
respaldo. Los materiales faltantes bloquean entrega, no diseño de componentes.
**Alternativas**: placeholders finales, omisión de tarjetas, copy de servicios reescrito sin
aprobación o imágenes generadas como si fueran oficiales no respetan el alcance.
Los textos de referencia pueden existir en datos de revisión; solo descripciones revisadas
se incluyen en render de entrega. Metadatos de revisión no se envían como UI del producto.

## 4. Enlaces, accesibilidad e imágenes

**Decisión**: /index.html#somos-priva, /index.html#que-hacemos y CTA /historias.html;
Conocer más usa #somos-priva. Tarjetas informativas sin enlaces ni tabindex artificial.
Reservar dimensiones, alternativas según propósito y tratamiento CSS responsive; sin
ocultar texto ante carga fallida de imagen. No inventar alt definitivo antes de recibir recurso.
**Motivo**: mantiene contratos de 001/003 y evita ampliar la interacción del dibujo.
**Alternativas**: modal, carrusel o tarjetas clicables no tienen requisito de producto.
No ampliar la validación de destinos de 003 a episodios, audio o ejercicios en este trabajo.

## 5. Pruebas proporcionadas

**Decisión**: Playwright para estructura/copy, anclas/teclado/recarga, CTA, imagen fallida,
matriz de siete anchos a 100%/200%; axe y comprobaciones manuales complementarias.
Probar que publicación rechaza recursos/copy pendientes y que fixtures nunca entran en dist.
**Motivo**: verifica errores de navegación/publicación observables, no solo estructura del código.
**Alternativas**: snapshots solos no comprueban foco ni destinos; unit tests de getters no aportan.
Chromium del sistema sirve como alternativa verificada en 001; Firefox/WebKit permanecen
no verificados hasta disponer de binarios. El dominio guardado en borrador no prueba conectividad.

## 6. Ancho del contenido compartido

**Decisión**: opción aditiva full-width del main de PublicLayout para Inicio, manteniendo
el default actual para 001; estilos de Inicio locales y regresión de ambos layouts.
**Motivo**: main aplica max-width y padding; sin este ajuste, el cierre oscuro no ocupa
el ancho de referencia o exige márgenes negativos propensos a overflow.
**Alternativas**: modificar el CSS global para todas las páginas arriesga regresión; duplicar
layout/header/footer rompería origen único. La extensión no cambia navegación ni alcance.

## Correcciones comprobadas durante implementación

Se añadió @types/node 24.19.2 (solo desarrollo): sin ello Astro check rechazaba node:fs/path.
Se asignó outputDir de trazas independiente a home tras colisión con 001 durante ejecución
concurrente; la suite se repitió completa. No son ampliaciones de producto.
