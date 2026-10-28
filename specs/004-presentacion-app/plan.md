# Implementation Plan: Presentación y disponibilidad de Priva App

**Branch real**: `main` | **Date**: 2026-10-17 | **Spec**: [spec.md](spec.md)
**Feature activa**: `004-presentacion-app`; el BRANCH del script es selección SDD, no rama creada.
**Estado**: 30/32 tareas. Recursos y copy aprobados; página real habilitada.53/53Node,9/9integración real y20/20adaptación/render. Revisión manual/fidelidad y build/calificaciónintegrada pendientes.
**Input**: A01–A07, PDF 3, decisiones C13/C14/C17/C23/C31 y constitución 1.0.0.

## Summary

Construir /app.html como presentación estática del prototipo, reutilizando Astro y PublicLayout
con pageId=app/contentLayout=full. Conservar composición PDF 3, tres beneficios, cuatro pasos,
tres funciones previstas y dos secciones de destino. No crear chat, diagnóstico, formulario,
app móvil ni servicio de distribución. Conversar permanece dentro de la imagen informativa.

Contenido, recursos y revisión editorial separados de disponibilidad por plataforma. Resolver
Android/iPhone de forma independiente; solo emitir enlace si URL y evidencia de verificación
coinciden. Ausencia de enlace es pendiente válido, no fallo de publicación de toda la página.
El gate sí impide publicar recursos/copy sin revisión o una declaración verificado inconsistente.
Probar componentes reales con banco aislado y distinguirlo de aceptación con materiales finales.

## Technical Context

**Language/Version**: TypeScript 5.9.3 estricto, HTML/CSS; Node24.19.0/npm11.9.0 del entorno existente.
**Primary Dependencies**: Astro7.4.0, @astrojs/check0.9.10, Playwright1.64.1, axe4.14.0,
@types/node24.19.2, reutilizando lock actual. Sin nuevas dependencias previstas.
**Storage**: contenido/configuración/referencias versionados; sin DB, cookies, sesiones,
respuestas o almacenamiento del visitante. Recursos oficiales locales en public.
**Testing**: node:test para resolución de plataformas y gate; Astro check/build del banco;
Playwright/axe para recorridos, matriz de cuatro estados y 14 combinaciones de ancho/texto;
regresión001–003 según componentes afectados; revisión manual y destinos reales separados.
**Target Platform**: frontend web estático Linux/escritorio/móvil; HTML y enlaces disponibles
sin JS. Solo script compartido001 para menú y foco de anclas; sin hidratación propia de 004.
**Project Type**: página editorial pública multipágina dentro del proyecto Astro existente.
**Performance Goals**: contenido y disponibilidad renderizados en HTML sin fetch ni SDK;
imágenes con dimensiones reservadas, hero sin lazy y resto lazy. No medición remota ni nuevos SLA.
**Constraints**: siete anchos360/390/430/768/1024/1280/1440×texto100/200%, foco y contraste
4.5:1 normal/3:1 grande/componentes; controles objetivo44px; prototipo visible y cero promesas
no verificadas. No escoger tiendas, proveedor, fecha, precio ni versiones mínimas.
**Scale/Scope**: una página, cinco grupos de contenido, tres beneficios, cuatro pasos, tres
funciones, dos plataformas y cuatro combinaciones; hero/explicación/descarga con recursos visuales.

## Constitution Check

| Principios | Antes de investigación | Tras diseño |
|---|---|---|
| CONST-01–03 | A01–A07 y diferencias aprobadas limitan alcance | Presentación estática; sin chat/diagnóstico/registro/lista de espera |
| CONST-04 | IDs y escenarios locales conservados | Modelo/contrato/guía trazables; sin HU/CA históricos inventados |
| CONST-05–06 | Sin captura ni operaciones privadas | Sin red propia, cookies, secretos o almacenamiento; enlaces no confirman instalación |
| CONST-07 | Administración de historias es ajena | No tocar catálogo, backend ni estados007 |
| CONST-08 | Orden, anclas, alternativas y materiales obligatorios | Layout/navegación001 reutilizados; matriz y revisión visual/lector exigidas |
| CONST-09 | Prototipo/funciones previstas y descargas honestas | Resolver por plataforma; pendiente no tiene acción; revisión vinculada a URL/copy/mockup |
| CONST-10–12 | Plan y fixture no acreditan entrega | Gates, evidencia futura y bloqueos por material/integración explícitos |

Revisión previa y posterior: pasa para diseño independiente, sin excepciones constitucionales.
Recursos oficialesP01/P04 recibidos/revisados; P03 resuelto para los textos públicos deApp aprobados el2026-10-28. No se inventan aprobaciones para cerrar diseño. Ninguna
incógnita técnica propia queda sin tratamiento; las URLs pueden permanecer pendientes válidamente.

## Project Structure

### Documentation (this feature)

```text
specs/004-presentacion-app/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── contracts/app.md
├── quickstart.md
├── checklists/requirements.md
├── tasks.md
└── evidence/
```

[tasks.md](tasks.md) generado e implementado parcialmente; resultados y bloqueos en [evidence/summary.md](evidence/summary.md).

### Source Code (implementado; integración y recursos pendientes)

```text
src/pages/app.astro
src/components/app/
├── AppContent.astro
├── AppHero.astro
├── AppOverview.astro
├── AppSteps.astro
├── AppFeatures.astro
└── AppDownloads.astro
src/content/app.ts
src/config/app-downloads.ts
src/lib/app-downloads.ts
src/lib/app-publication.ts
src/styles/app.css
scripts/require-app-publication.mjs
public/images/app/
playwright.app.config.ts
tests/app-downloads.test.ts
tests/app-publication.test.ts
tests/fixtures/app/
├── astro.config.mjs
├── tsconfig.json
├── public/
└── src/
    ├── content.ts
    └── pages/
        ├── app.astro
        ├── app-android.astro
        ├── app-iphone.astro
        ├── app-both.astro
        └── contacto.astro
tests/e2e/{app,app-accessibility,app-integration}.spec.ts
```

**Structure Decision**: no nuevo layout ni modificación necesaria de 001. Componentes reciben
contenido explícito y estado efectivo de descargas, no la configuración cruda ni evidencia
privada de revisión. AppOverview agrupa teléfono y beneficios; AppSteps ofrece#como-funciona;
AppDownloads ofrece#descarga. CSS propio sin márgenes negativos ni cambios globales.

Resolver de plataformas en librería pura, usable en node:test y renderAstro; config local no
se hidrata ni se expone en JSON/script público. URLs candidatas/rechazadas nunca aparecen
en hrefs, atributosdata, comentarios o estado serializado. HTML pendiente usa texto con nombre
Android/iPhone y Próximamente, sin enlace, handler, tabindex ni rol de botón.

## Phase 0 — Investigación

[research.md](research.md) registra hallazgos de reutilización, resolución de enlaces,
revisión editorial, compatibilidad del mockup, pruebas y alternativas. Se investigaron en
paralelo disponibilidad/gates y composición/accesibilidad según el skill, solo lectura.

## Phase 1 — Diseño

[data-model.md](data-model.md) define estados/entidades y vinculación de revisión;
[contracts/app.md](contracts/app.md) fija interfaz visible, URLs y publicación;
[quickstart.md](quickstart.md) especifica validación futura y dependencias. Sin API externa
nueva que diseñar; el contrato es de página, configuración local y navegación saliente.

## Estrategia de ejecución posterior

1. Crear banco y scripts propios; pruebas negativas del resolver y gate antes de implementación.
2. Modelar contenido/revisión pendiente, prototipo visible y descargas independientes.
3. Construir cinco grupos de contenido y CSS; enlaces nativos/anclas y mockups no interactivos.
4. Integrar resolver y gate en entrada real y prebuild, conservando guards de páginas/Inicio/Historias.
   No crear Contacto ficticio en src ni quitar bloqueos del sitio para compilar004.
5. Validar cuatro estados, retiro de verificación, HTML sinJS, matriz y regresión afectada.
6. Incorporar activos/copy revisados; verificar destinos reales habilitados y flujo desde Contacto;
   revisión manual/fidelidad y evidencia por A01–A07/SC-001–006 antes del cierre correspondiente.

Cambios de disponibilidad requieren actualizar configuración/evidencia, compilar y publicar
el artefacto coherente; comprobar la página publicada después del cambio. No prometer retirada
instantánea de documentos ya abiertos, polling o sincronización con tiendas no implementada.
Ambas pendientes son aceptables para004; los casos habilitados siguen sujetos a URLs reales.

## Complexity Tracking

Sin infracciones ni excepciones. Resolver puro y gate separados evitan equiparar pendiente
válido con configuración contradictoria; banco propio conserva evidencias001–003.

## Registro

2026-10-17 — `$speckit-plan 004`: diseño de fases 0/1, sin implementación, nuevas dependencias,
pruebas ejecutadas, commit o publicación. Recursos/revisión siguen pendientes.

2026-10-17 — Implementación: componentes estáticos, resolver puro, gate y banco004;
reutilización001 y corrección de foco para fragmento repetido tras fallo reproducible.
Sin dependencias nuevas. Evidencia contractual y bloqueos en evidence/summary.md.
