# Implementation Plan: Inicio e identidad de Priva

**Branch real**: `main` | **Date**: 2026-10-16 | **Spec**: [spec.md](spec.md)
**Feature Directory**: `specs/002-inicio-institucional`
**Input**: I01–I04, constitución 1.0.0 y componentes existentes de 001.
**Estado**: componentes y banco contractual implementados; publicación y aceptación integrada pendientes.
El BRANCH de los scripts SDD representa la feature activa, no una rama Git creada.

## Summary

Implementar los cuatro bloques institucionales de Inicio con componentes Astro y CSS local,
reutilizando PublicLayout y la navegación de 001. Separar contenido, recursos y revisión de
publicación. Probar componentes reales en un banco aislado de Inicio, sin depender del build
de las cuatro páginas ni sustituir documentos o servicios de otras features.
No publicar recursos o promesas pendientes; conservar I01–I04 y contratos de anclas.

## Technical Context

**Language/Version**: TypeScript 5.9.3 estricto, HTML semántico/CSS; Node 24.19.0/npm 11.9.0
verificados en la implementación de 001.
**Primary Dependencies**: reutilizar package-lock actual: Astro 7.4.0, @astrojs/check 0.9.10,
@playwright/test 1.64.1 y @axe-core/playwright 4.14.0. Sin nuevo runtime ni framework UI. @types/node 24.19.2 añadido como desarrollo al implementar validación de archivos.
**Storage**: contenido e inventario de recursos versionados; sin base de datos, cookies,
formularios, estado persistente de visitante ni proveedor nuevo.
**Testing**: Astro check/build del banco home, Playwright y axe; regresión de navegación 001.
Chromium cubre matriz completa; Firefox/WebKit cubren recorridos principales cuando existan sus
binarios. Revisión manual de lector de pantalla y fidelidad con recursos finales.
**Target Platform**: frontend web estático en escritorio/móvil; build Linux, Python 3 para
servir archivos del banco, como en 001.
**Project Type**: página editorial multipágina integrada en proyecto Astro existente.
**Performance Goals**: contenido y enlaces disponibles en HTML sin esperar JS o fetch de datos;
solo reutilizar JS existente para navegación/anclas. Imágenes con dimensiones reservadas;
lazy loading solo fuera del primer bloque, no imagen hero. No se inventa objetivo de latencia.
**Constraints**: orden PDF 1; siete anchos y texto 100%/200%; contraste 4.5:1 texto normal,
3:1 grande/componentes; controles aproximadamente 44 px. Recursos/copy final pendientes.
**Scale/Scope**: una página /index.html, cuatro bloques, cuatro tarjetas informativas,
tres ubicaciones de imagen institucional (hero, identidad, cierre), dos controles de contenido
y dos anclas públicas. Header/footer y sus activos de marca pertenecen a 001.

## Constitution Check

| Principios | Antes de investigación | Tras diseño |
|---|---|---|
| CONST-01–03 | I01–I04 y diferencias C07/C16 limitan alcance | No formularios, servicios, acciones de tarjetas o historia adicional |
| CONST-04 | IDs y escenarios locales conservados | Contrato/modelo/guía trazables; no inventar HU/CA históricos |
| CONST-05–06 | Inicio no captura datos ni requiere credenciales | Sin proveedor externo, secretos, almacenamiento o rastreo añadido |
| CONST-07–09 | Capacidades y recursos pendientes reconocidos | Entrega bloqueada si faltan recursos/copy revisado, sin ocultar bloques |
| CONST-08 | Accesibilidad y orden obligatorios | Matriz completa, fallos de imagen y revisión visual exigidos |
| CONST-10–12 | Separar plan, código y evidencia | Pruebas futuras y bloqueos explícitos, sin resultados ficticios |

Revisión previa y posterior de diseño: pasa sin excepciones. No acredita implementación.
P01/P03/P04 son dependencias de entrega, no decisiones técnicas que puedan inventarse.
La estructura puede implementarse independientemente; la publicación no se cierra con fixtures.

## Project Structure

### Documentation (this feature)

```text
specs/002-inicio-institucional/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── contracts/home.md
├── quickstart.md
└── checklists/requirements.md
```

[tasks.md](tasks.md) generado posteriormente con `$speckit-tasks 002`; evidencias y ejecución siguen pendientes.

### Source Code (previsto, no creado por este comando)

```text
src/
├── pages/index.astro
├── components/home/
│   ├── HomeContent.astro
│   ├── HomeHero.astro
│   ├── HomeIdentity.astro
│   ├── HomeAreas.astro
│   └── HomeClosing.astro
├── content/home.ts
├── lib/home-publication.ts
└── styles/home.css
public/images/home/
scripts/require-home-publication.mjs
playwright.home.config.ts
tests/
├── fixtures/home/
│   ├── astro.config.mjs
│   ├── tsconfig.json
│   ├── public/
│   └── src/pages/
│       ├── index.astro
│       └── historias.astro
└── e2e/
    ├── home.spec.ts
    ├── home-accessibility.spec.ts
    └── home-integration.spec.ts
```

**Structure Decision**: PublicLayout recibe pageId='inicio' y conserva header/footer sin
copiarlos. HomeContent reúne cuatro secciones; componentes reciben contenido explícito.
CSS específico evita afectar navegación global. El main actual de PublicLayout tiene ancho
máximo y padding globales: añadir una opción de layout de contenido full-width para Inicio,
con valor por defecto contenido idéntico a 001. No usar márgenes negativos que causen overflow;
probar que el cierre oscuro ocupa el ancho previsto y que la navegación 001 no cambia. El archivo index real verifica antes de render
los requisitos editoriales y de recursos mediante home-publication; los fixtures importan
HomeContent y layout directamente con datos de prueba identificados. No hay bandera pública
para saltar verificación, query param ni variable cliente que permita publicar borradores.

## Phase 0 — Investigación

[research.md](research.md) registra reutilización, alternativas descartadas, aislamiento
ante el guard existente y verificación de publicación. Sin incógnitas técnicas bloqueantes
propias de 002. No se eligen proveedores ni se inventa aprobación editorial.

## Phase 1 — Diseño

[data-model.md](data-model.md) define contenido/estados; [contracts/home.md](contracts/home.md)
define anclas, composición y controles; [quickstart.md](quickstart.md) distingue comandos
existentes de scripts futuros y validación contractual de integrada.

## Estrategia de ejecución posterior

1. Añadir scripts/check/build/suite home aislados sin alterar suites ni salidas de 001.
2. Escribir pruebas significativas por historia antes del comportamiento correspondiente.
3. Construir identidad/hero, áreas y cierre en ese orden con contenido explícito e imágenes
   recibidas; cualquier activo o texto ficticio permanece exclusivamente en fixtures.
4. Añadir scripts/require-home-publication.mjs al build de entrega después del guard de
   páginas y antes de astro build: todo faltante editorial/de recursos produce exit distinto
   de cero antes de generar archivos. La entrada real también valida su contenido antes de render.
   Crear entrada real /index.html protegida por esa comprobación. Si faltan
   imágenes/copy aprobado, el render/build de entrega informa bloqueo, sin omitir bloques.
5. Probar matriz, errores de imagen, contraste, teclado y regresión de navegación compartida.
6. Integrar con Historias real y recursos aprobados, verificar build completo solo al existir
   las otras páginas; registrar evidencia por I01–I04/SC-001–SC-005.

El guard scripts/require-pages.mjs conserva la exigencia de las cuatro páginas reales;
crear Inicio no autoriza crear relleno para 003–005 ni quitar ese guard. Solo una vez
resueltas las dependencias se puede certificar el sitio integrado.

## Complexity Tracking

Sin infracciones ni excepciones. Se justifica la separación home/navigation de los bancos
por aislamiento de salidas y conservación de la regresión existente; no se duplica código de UI.

## Registro

2026-10-16 — `$speckit-plan 002`: planificación sobre componentes/tooling ya verificados en
001; sin instalación, cambios de dependencias, contenido publicado o pruebas ejecutadas de 002.

2026-10-16 — Implementación: modelo de contenido pendiente, componentes, gate de publicación
y banco contractual creados. Corrección de desarrollo @types/node registrada; sin nuevo
alcance. Resultados en evidence/summary.md; recursos/revisión y validación integrada abiertos.

## Reanudación 2026-10-21

Marca, fuente y paleta recibidas desde disenovisual; cinco textos educativos aprobados explícitamente y aplicados con evidencia en [editorial-review.md](evidence/editorial-review.md). Las imágenes oficiales siguen pendientes; el enlace provisional placehold.co/448x332 devuelve HTTP 403 al descargar. Firefox ya permite verificar recorridos principales; WebKit sigue bloqueado por bibliotecas del host. Páginas 003–005 existen en código; falta URL real para aceptación integrada. No se acredita publicación ni fidelidad final. Estado actual y resultados en [evidence/summary.md](evidence/summary.md); las notas anteriores son históricas.
