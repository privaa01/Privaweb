# Implementation Plan: Navegación y estructura común

**Branch real**: `main` | **Date**: 2026-10-16 | **Spec**: [spec.md](spec.md)
**Feature**: `001-navegacion-global`
**Input**: G01–G06; constitución 1.0.0. El valor BRANCH devuelto por Spec Kit identifica
la feature seleccionada; no acredita una rama Git creada.
**Estado**: componentes y banco contractual implementados y validados en Chromium; aplicación e integración final pendientes.

## Summary

Construir navegación pública multipágina con Astro estático, TypeScript y CSS propio.
Header/Footer compartidos se renderizan al construir, con enlaces nativos y estado activo
explícito por página. Solo el disclosure móvil necesita JavaScript. Mantener archivos `.html`
y anclas del spec. No crear backend, autenticación ni textos legales dentro de 001.

## Technical Context

**Language/Version**: TypeScript 5.9.3 estricto, HTML semántico y CSS; Node.js 24.19.0,
npm 11.9.0 disponibles en el entorno.
**Primary Dependencies**: Astro 7.4.0 y @astrojs/check 0.9.10; sin React, librería visual,
router cliente, fuentes remotas ni analítica. Versiones consultadas en npm; instalar y
fijar lockfile durante implementación, no en esta fase.
**Storage**: configuración de navegación versionada; estado del menú en memoria;
sin base de datos, cookies, localStorage ni captura de datos para esta feature.
**Testing**: @playwright/test 1.64.1; @axe-core/playwright 4.14.0 como apoyo a accesibilidad;
Astro check y build. Revisión manual de teclado, texto 200%, contraste y fidelidad.
**Target Platform**: web en navegadores de escritorio/móvil; build en Linux.
Chromium para matriz de tamaños y Firefox/WebKit para regresión de recorridos principales.
**Project Type**: frontend público multipágina con salida estática; servicios futuros independientes.
**Performance Goals**: enlaces renderizados sin esperar carga de JavaScript ni solicitar datos
para construir el menú; ningún framework de UI hidratado ni llamada externa de navegación.
Sin presupuesto numérico de latencia no respaldado por requisitos.
**Constraints**: 360/390/430/768/1024/1280/1440 px; texto 200%; contraste 4.5:1 normal y
3:1 grande/componentes; controles aproximadamente 44 px. Logo/tipografía/colores oficiales pendientes.
**Scale/Scope**: cuatro páginas públicas, cuatro entradas del menú, dos CTA según origen,
footer común con cuatro enlaces. G01–G06 no implican contenido completo de otras features.

## Constitution Check

Evaluación previa a investigación y posterior al diseño: sin infracciones de diseño.
No significa que la aplicación cumpla todavía; no hay aplicación implementada.

| Reglas | Gate antes de investigar | Gate tras diseño |
|---|---|---|
| CONST-01–03: alcance y fuente | G01–G06 como límite | Sin nuevas funciones, roles o promesas |
| CONST-04: trazabilidad | IDs existentes conservados | Contrato y guía enlazan requisitos/escenarios |
| CONST-05–06: privacidad y seguridad | 001 no captura datos | Sin secretos ni datos privados en HTML; autorización delegada a 006 |
| CONST-07: integridad | No sustituir estados reales | Fixtures solo de prueba, sin falsos documentos/login |
| CONST-08–09: fidelidad y honestidad | Recursos faltantes reconocidos | Disclosure accesible, sin logo inventado ni contenido final ficticio |
| CONST-10–12: evidencia y gobierno | Separar plan de ejecución | Guía futura y bloqueos explícitos; sin resultados ficticios |

El cierre integrado de G05/G06 depende de 005/006/010. Construir un enlace no cierra
la protección administrativa ni la aprobación de textos. La falta de recursos impide cerrar
fidelidad pero permite trabajo de estructura. No se necesitan excepciones constitucionales.

## Project Structure

### Documentation (this feature)

```text
specs/001-navegacion-global/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/navigation.md
└── checklists/requirements.md
```

[tasks.md](tasks.md) fue generado posteriormente con `$speckit-tasks 001`; su ejecución permanece pendiente.

### Source Code (repository root)

```text
astro.config.mjs
package.json
package-lock.json
tsconfig.json
playwright.config.ts
src/
├── config/navigation.ts
├── layouts/PublicLayout.astro
├── components/SiteHeader.astro
├── components/SiteFooter.astro
├── scripts/navigation.ts
├── styles/global.css
└── pages/
    ├── index.astro
    ├── historias.astro
    ├── app.astro
    └── contacto.astro
public/brand/
tests/
├── fixtures/navigation/
└── e2e/
    ├── navigation.spec.ts
    ├── navigation-accessibility.spec.ts
    └── navigation-integration.spec.ts
```

**Structure Decision**: Un frontend en la raíz, sin monorepo ni backend especulativo.
Las páginas y secciones son puntos de integración de 002–005; esta fase solo define el
layout y contrato compartido. Los fixtures se sirven únicamente en pruebas y nunca se
copian a `public/` o `dist/`. Recursos oficiales se incorporan solo cuando existan.

## Fases y dependencias

### Phase 0 — Investigación completada

[research.md](research.md) registra alternativas, compatibilidad y formato de rutas.
No quedan decisiones técnicas bloqueantes propias de 001; los pendientes operativos
externos no se resuelven inventando proveedores o contenidos.

### Phase 1 — Diseño completado

[data-model.md](data-model.md), [contrato](contracts/navigation.md) y
[quickstart.md](quickstart.md) definen entidades, interacción y pruebas futuras.
Ningún API de datos es necesario para esta feature.

### Ejecución posterior

1. Crear tooling reproducible y layout compartido; comprobar salida `.html` real.
2. Implementar menú nativo, CTA/footer y disclosure con estados accesibles.
3. Probar componentes con fixtures de destino identificados sin declararlos integración final.
4. Integrar páginas/anclas reales de 002–005, autenticación 006 y textos aprobados 010.
5. Ejecutar validación completa y registrar resultados/evidencias por G01–G06 y SC-001–005.

## Complexity Tracking

Sin excepciones; no se agrega infraestructura sin necesidad demostrada.

## Registro

2026-10-16 — `$speckit-plan 001`: decisión técnica local Astro estático y contratos
sin cambios de producto. Investigación de registro/documentación realizada; compilación,
instalación y pruebas de aplicación no ejecutadas. Siguiente fase: `$speckit-tasks 001`.

### Precisiones posteriores al análisis

2026-10-16 — I1/U1/U2 corregidos con autorización de la usuaria. El banco de pruebas
usa `tests/fixtures/navigation/astro.config.mjs`, tsconfig propio y salida
`.test-output/navigation/`. Los scripts `check:contract`/`build:contract` validan este
banco desde T007; `check`/`build`/`preview` corresponden a aplicación y requieren las
páginas reales integradas en T023. No se copian fixtures a dist para superar esa condición.
El contrato de rutas privadas corresponde a 006 y bloquea solo los casos privados de
T021/T027; no bloquea T022 ni las demás pruebas contractuales. La guía detalla cobertura
completa de recorridos a cada ancho y a texto 100%/200%, con resultado por combinación.
No se implementa aplicación ni se ejecutan estas validaciones mediante esta corrección.

### Implementación 001 — 2026-10-16 (America/Bogota)

Tooling y componentes compartidos implementados. Las páginas de src/pages del árbol
siguen siendo puntos de integración futuros; no se crearon páginas de relleno.
Banco de pruebas incluye cuatro páginas principales y tres destinos ficticios aislados.
Astro preview no inició en este entorno; el banco sirve su build real con Python 3
(ThreadingHTTPServer) y alias de prueba /admin/login, sin servicio administrativo.
Scripts desactivan telemetría Astro y no incorporan servicios externos al navegador.
Firefox/WebKit pendientes por descarga 403; recursos oficiales e integración faltan.
Ver evidence/summary.md para evidencia y tasks.md para tareas pendientes.
