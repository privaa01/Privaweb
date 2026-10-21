# Investigación010

**Fecha**: 2026-10-20. Solo lectura de repositorio y diseño; no pruebas de aplicación ejecutadas.

## D1 — Mantener Astro estático

**Decision**: reutilizar Astro7.4.0, TypeScript y salida static/file del `astro.config.mjs`; páginas auxiliares `.astro`, sin API o base de datos nuevos.
**Rationale**: contenido informativo público, rutas ya fijadas001 y dependencias instaladas.
**Alternatives considered**: SSR/CMS añadirían servicio, almacenamiento y flujos fuera de alcance. Los datos oficiales pendientes son condiciones editoriales, no motivo para elegir infraestructura nueva.

## D2 — Contexto auxiliar de navegación

**Decision**: permitir contexto auxiliar sin `PageId` principal activo y CTA opcional; conservar cuatro entradas `pages[]`.
**Rationale**: `PublicLayout.astro`/`SiteHeader.astro` hoy requieren uno de cuatro IDs y acceden a `headerCtas[pageId]`; fingir Inicio produciría activo incorrecto.
**Alternatives considered**: duplicar header/layout deriva inconsistencias; ampliar menú con documentos cambia navegación aprobada.

## D3 — Una fuente y aprobación vinculada a contenido

**Decision**: contenido estructurado para documentos+aviso, revisión humana vinculada a huellas y adaptación a `ContactContent.notice` existente.
**Rationale**: `src/content/contact.ts` contiene borrador y `ContactNotice.astro` muestra datos pendientes; `contact-publication.ts` exige revisión por snapshot y existencia del Manifiesto, pero no acredita sus secciones ni coherencia.010 completa la frontera sin eliminar controles005.
**Alternatives considered**: copiar texto en cada página favorece contradicción; rellenar canales/responsable o aprobar por palabras clave inventa evidencia. No HTML arbitrario/`set:html` con contenido no confiable.

## D4 — Revisión editorial separada de evidencia operativa

**Decision**: validador puro010 sin gate global009; revisión de textos produce expediente y evidencia `notices`; gate de entrega verifica esa evidencia y todos los scopes009.
**Rationale**: `src/config/privacy.ts` mantiene todos los scopes nulos; `server/privacy/readiness.ts` comprueba archivos/huellas/fechas/revisión. Necesita relacionar `notices` con bundle exacto, sin circularidad de aprobar documentos que requieren su propia aprobación previa.
**Alternatives considered**: archivo existente o booleano revisado no prueban operación; quitar gate009 permitiría publicación engañosa. P02/P03 permanecen pendientes, sin datos ficticios.

## D5 —404 es contrato de entrega

**Decision**: artefacto404 Astro más servidor local representativo y calificación separada de host real.
**Rationale**: servidores actuales `tests/fixtures/navigation/serve.py` y `tests/fixtures/contact-service/serve.ts` devuelven404 genérico; no prueban cuerpo010. La investigación delegada confirmó límites del layout y fixtures. El host debe conservar status404 y fronteras privadas.
**Alternatives considered**: redirect302 a `/404.html`, fallback SPA200 o captura del archivo no cumplen US3.1. No seleccionar host sin datos operativos.

## D6 — URL sensible y accesibilidad

**Decision**: error fijo, no reflejo de URL, sin logs sensibles nuevos, no-referrer, enlaces/recursos de raíz; pruebas de teclado/foco, siete anchos, texto200% y revisión manual.
**Rationale**: la ruta desconocida puede contener datos; no trasladarlos al cuerpo o al siguiente destino. Las auxiliares no deben romper001. Axe solo cubre una parte de accesibilidad.
**Alternatives considered**: mostrar dirección completa o enviar error a analítica añade exposición innecesaria; simular zoom con captura no verifica texto ampliado.

## Resolución y límites

Decisiones técnicas necesarias resueltas; no quedan marcadores NEEDS CLARIFICATION. P02/P03, políticas de otras categorías y hosting real son dependencias explícitas de publicación/calificación, no valores elegidos aquí. No hay certificación de operación009 por sus pruebas locales ni presupuesto/SLA nuevo. Revisión constitucional previa/posterior conforme al plan; ninguna excepción.
