# Implementation Plan: Documentos informativos y recuperación 404

**Branch real**: `main` | **Selección Spec Kit**: `010-documentos-recuperacion` | **Date**: 2026-10-20 | **Spec**: [spec.md](spec.md)
**Input**: `specs/010-documentos-recuperacion/spec.md`, X03/FR-001, tres historias y 16 escenarios.
**Estado**: implementación local33/44 tareas verificadas; publicación bloqueada por P02/P03 y calificación integrada. Evidencia y límites en `evidence.md`.

## Summary

Añadir las páginas estáticas Términos, Manifiesto y 404 a la arquitectura Astro existente; compartir con Contacto un contenido informativo versionado en el repositorio. Mantener navegación001, datos privados y mecanismos009 sin nuevos servicios de datos o pantallas. Verificar la recuperación con un servidor local representativo y después con el alojamiento real: el artefacto404 no prueba por sí mismo el estado HTTP de una ruta desconocida.

La revisión editorial se vincula a la huella de los tres textos y sus datos públicos; una modificación invalida la aprobación. Los controles de publicación comprueban revisión y evidencias operativas009 sin depender circularmente unos de otros. Las fixtures sintéticas están aisladas del build de entrega y no satisfacen calificación productiva.

## Technical Context

**Language/Version**: TypeScript5.9.3, Astro7.4.0, Node>=22.22.0; continuar versiones fijadas en package.json/package-lock.json.
**Primary Dependencies**: Astro estático, componentes/layout/estilos existentes; Playwright1.64.1 y axe4.14.0 para validación. Sin dependencia nueva necesaria.
**Storage**: archivos de contenido/configuración/revisión en repositorio y evidencias verificables; sin migración SQLite ni almacenamiento visitante nuevo.
**Testing**: pruebas Node de validación editorial y publicación; Astro check/build en fixture010; Playwright para recorridos, HTTP, teclado y adaptación; revisión humana de textos y lector de pantalla. Integración contra URL real por separado.
**Target Platform**: sitio estático en navegador y alojamiento HTTP(S) aún no calificado; Chrome/Firefox/WebKit conforme a capacidades disponibles, registrando bloqueos reales.
**Project Type**: aplicación web pública estática con servicios privados existentes que esta feature no sustituye.
**Performance Goals**: documentos y recuperación renderizados en HTML, sin petición a API ni JavaScript adicional para leer o volver a Inicio; sin introducir SLA de latencia/volumen no aprobado. Usar recursos compartidos locales, sin fuentes o scripts externos nuevos.
**Constraints**: R-01–09; rutas `.html` y enlaces absolutos desde raíz; respuesta404 real; no reflejar URL; revisión antes de publicar; privacidad009; siete anchos y texto200%; no elegir identidad, proveedor, permisos o políticas desconocidos.
**Scale/Scope**: dos documentos, un aviso existente, una página404, cuatro anclas y diez accesos a documentos; tres historias/16 escenarios/siete resultados medibles. QR únicamente si aparece material aprobado.

## Constitution Check

| Gate | Antes de investigación | Después del diseño |
| --- | --- | --- |
| CONST-01/02/04: X03 literal, fuentes y aclaración | Conforme: spec y sesión disponibles | Conforme: matriz de contratos a escenarios; no IDs históricos inventados |
| CONST-03: alcance acotado | Conforme: sin cuentas o flujos nuevos | Conforme: sin CMS, checkbox obligatorio o autoservicio de eliminación |
| CONST-05/06: privacidad y autorización | Conforme para diseño; operación externa pendiente | Conforme: sin datos privados nuevos, no reflejo de URL, servicios privados preservados |
| CONST-07/09: información honesta | Conforme: C32 no final | Conforme: huellas, revisión y evidencia; fixtures no califican producción |
| CONST-08: accesibilidad/recursos | Conforme: criterios explícitos | Conforme para diseño; mediciones y revisión manual pendientes |
| CONST-10–12: cierre y dependencias | Conforme: P02/P03 separados de decisiones técnicas | Conforme: no se declaran pruebas, publicación o cumplimiento legal |

No excepciones constitucionales. Todos los gates de diseño pasan; los gates de publicación permanecen cerrados. La falta de datos oficiales no se convierte en aclaración técnica resuelta ficticiamente.

## Project Structure

### Documentation (this feature)

```text
specs/010-documentos-recuperacion/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/requirements.md
└── contracts/
    ├── public-documents.md
    ├── publication-review.md
    └── recovery-delivery.md
```

`tasks.md` generado con `$speckit-tasks 010`; ejecución pendiente.

### Source Code (repository root)

Rutas siguientes propuestas para implementación; los componentes y archivos existentes se amplían sin reemplazar cambios009.

```text
src/content/documents.ts                 # nuevo: contenido estructurado y términos compartidos
src/config/documents.ts                  # nuevo: contenido productivo y revisión pendiente
src/lib/documents-publication.ts         # nuevo: validación editorial pura
src/components/documents/                # nuevos: documento y recuperación
src/styles/documents.css                # nuevo: lectura adaptable
src/pages/terminos.astro                 # nuevo
src/pages/manifiesto-datos.astro         # nuevo
src/pages/404.astro                      # nuevo
src/components/contact/ContactNotice.astro # existente: consumir aviso compartido
src/content/contact.ts                  # existente: adaptación sin romper contrato005
src/layouts/PublicLayout.astro          # existente: admitir página auxiliar
src/components/SiteHeader.astro         # existente: auxiliar sin activo/CTA de otra página
src/config/navigation.ts                # existente: mantener cuatro PageId de navegación
scripts/require-documents-publication.mjs # nuevo: control de entrega
scripts/serve-documents.mjs              # nuevo: servidor local de validación, no alojamiento productivo
scripts/require-pages.mjs                # existente: exigir auxiliares en entrega
package.json                            # existente: comandos010 y gate de build
playwright.documents.config.ts          # nuevo: modos local/integrado
tests/fixtures/documents/               # nuevo: sitio sintético aislado
tests/documents-*.test.ts               # nuevo: publicación/contenido/HTTP
tests/e2e/documents*.spec.ts             # nuevo: recorridos y accesibilidad
```

**Structure Decision**: reutilizar Astro estático y header/footer; ampliar props para un contexto auxiliar explícito, sin añadir páginas a `pages` ni fingir activo Inicio. En páginas auxiliares se conservan logo, cuatro enlaces y menú; no se inventa CTA contextual. Pruebas de navegación001 verifican regresión. No nuevo backend ni editor.

## Phase 0 — Research

Decisiones y alternativas en [research.md](research.md). Investigación del repositorio resuelve selección de layout, contenido, revisión, pruebas y entrega local404. El proveedor concreto no es necesario para definir el contrato de alojamiento: su configuración y evidencia quedan como condición de calificación externa.

## Phase 1 — Design

Modelo y estados en [data-model.md](data-model.md). Contratos de [lectura](contracts/public-documents.md), [publicación](contracts/publication-review.md) y [entrega404](contracts/recovery-delivery.md). Guía ejecutable prevista en [quickstart.md](quickstart.md).

Secuencia corregida tras análisis: T004 conecta servidor estático temporal de lectura/aviso para permitir T016/T022 sin depender de US3; T027 lo sustituye por servidor404 y habilita las suites de recuperación. Para la vinculación de evidencia, T030 define y ejecuta casos negativos antes de T031, que implementa y verifica el cambio; T032 conecta el gate.

Orden para futuras tareas: definir contenido y validadores; aislar fixture; construir documentos/contexto auxiliar; integrar aviso005; añadir404 y servidor de prueba; conectar controles de entrega; verificar escenarios locales; completar datos/revisión/evidencia externa; validar entrega integrada. No iniciar publicación dependiente de P02/P03 ausentes.

### Verificación trazable

| X03 / reglas | Escenarios | Validación prevista | Resultado |
| --- | --- | --- | --- |
| R-01/02/03/09 | US1.1–3/5 | diez accesos; secciones; navegación; revisión C32; lectores/anchos | SC-001/002/006 |
| R-04/05/08 | US1.4/6 | concordancia009; aprobación inválida ante cambios/faltantes; revisión humana | SC-002/007 |
| R-01/03/08/09 | US2.1–5 | aviso previo al envío, enlace/regreso, sin alta/checkbox, mismo contenido revisado | SC-002/003/006/007 |
| R-06 | US3.1/2/4/5 | rutas inexistentes raíz/anidadas, recarga, status y cuerpo, sin reflejo ni fuga; regresión privada | SC-004 |
| R-07/09 | US3.3 | cuatro anclas, encabezado/foco/teclado; QR condicional | SC-005/006 |

Los siete anchos se verifican en las páginas auxiliares y Contacto; texto200% es ampliación de texto comprobada, no solo escala de captura. Axe es apoyo, no sustituto de lector de pantalla o inspección visual. Los resultados se registrarán con fecha/entorno/criterio/resultado/evidencia. Bloqueo de navegador o build no se cuenta como aprobado.

### Dependencias y publicación

- P02/P03: datos oficiales, políticas de categorías, vigencia/permisos y textos revisados, sin marcadores públicos.
- 009: evidencia real de política, borrado, canal, proveedor/buzón/copias, recuperación y rastreo. El manifiesto de evidencia `notices` se produce tras revisión de los textos; los validadores editoriales no importan el gate global009 para evitar un ciclo de aprobación.
- 001/003/004/005: footer y secciones reales; 006/008: cookies/operación privada; 011: revisión transversal.
- Alojamiento: configurar fallback que preserve404 y exclusiones privadas; comprobar base real por URL. No desplegar ni elegir proveedor en esta fase.
- El build normal exige auxiliares, revisión010 y gates existentes. Fixtures con datos sintéticos tienen comandos/salidas separados; no hay flag para saltar controles en una entrega.

## Complexity Tracking

Sin violaciones ni infraestructura nueva. La complejidad adicional se limita a validación editorial y servidor local necesario para comprobar el contrato HTTP de un sitio estático.
