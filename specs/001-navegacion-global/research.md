# Investigación — 001 Navegación global

**Fecha**: 2026-10-16. Basada en repositorio, constitución, revisión independiente de
alternativas y consultas a fuentes oficiales. No es evidencia de aplicación ejecutada.

## 1. Renderizado y componentes compartidos

**Decisión**: Astro 7.4.0, salida estática, TypeScript 5.9.3, CSS propio y componentes
compilados Header/Footer/Layout. JS limitado al menú; enlaces nativos, sin router cliente.
**Motivo**: cuatro páginas editoriales necesitan contenido común sin duplicación ni
framework interactivo completo. HTML se ofrece antes de JavaScript y conserva URLs normales.
**Alternativas**: Vite vanilla multipágina exige resolver plantillas compartidas por separado;
Next añade convenciones y runtime innecesarios para 001. No se decide todavía la arquitectura
servidor de Contacto, administración o publicación dinámica.

## 2. URLs y build

**Decisión**: `output: 'static'`, `build.format: 'file'`, `trailingSlash: 'never'`.
`src/pages/historias.astro` debe producir `dist/historias.html`; index produce index.html.
**Motivo**: respetar las referencias de R35 sin aliases inventados. Servir y probar `dist`
además del desarrollo; no asumir que dev comprueba las rutas de producción.
**Alternativas**: formato directory requeriría rewrites para los contratos `.html`;
no usar nombres `historias.html.astro` sin necesidad.
**Fuente**: documentación oficial de configuración Astro, sección build.format:
https://github.com/withastro/docs/blob/main/src/content/docs/en/reference/configuration-reference.mdx
Consultada por HTTPS desde raw.githubusercontent.com; documenta file → about.html.
El hosting debe servir archivos `.html` y delegar `/admin/*` al servicio de 006;
ningún fallback estático de 001 debe hacerse pasar por login protegido.

## 3. Versiones y compatibilidad

**Decisión**: Node 24.19.0/npm 11.9.0 presentes; Astro 7.4.0; @astrojs/check 0.9.10;
TypeScript 5.9.3; Playwright 1.64.1; axe-core/playwright 4.14.0.
**Evidencia**: consultas `npm view` al registro oficial el 2026-10-16. Astro exige
Node >=22.22.0 y npm >=9.6.5; Playwright exige Node >=20. @astrojs/check admite
TypeScript ^5 o ^6: se descarta TypeScript latest 7.0.2 por esa incompatibilidad declarada.
**Límite**: metadatos compatibles no equivalen a instalación/build verificados.
El primer acceso npm falló por caché no escribible en HOME; se corrigió usando
`npm_config_cache=/tmp/priva-npm-cache`, conservando TLS/verificación.
**Alternativa**: rangos latest sin lockfile pueden cambiar el entorno; fijar versiones y
crear package-lock durante implementación, usar npm ci después.

## 4. Menú accesible

**Decisión**: disclosure no modal con botón nativo, aria-expanded/aria-controls y enlaces
normales; aria-current="page" en uno solo. No roles menu/menuitem de aplicación.
Sin JS, las opciones siguen visibles/operables; ocultarlas solo tras activar la mejora.
**Motivo**: navegación de sitio no necesita semántica de aplicación ni focus trap.
Escape cierra y devuelve foco; en cambio de ancho no debe quedar foco en contenido oculto.
**Alternativas**: modal con bloqueo de foco o dependencia UI aumenta complejidad innecesaria.
**Anclas**: scroll-margin-top si el encabezado es fijo; foco de destino en navegación
interna mejorada a título con tabindex=-1, sin interceptar clic modificado ni enlaces externos.
Respetar prefers-reduced-motion; no imponer desplazamiento animado.

## 5. Pruebas y límites

**Decisión**: Playwright sobre build servido; axe complementario, no certificación completa.
Matriz principal en Chromium; recorridos principales adicionales en Firefox y WebKit.
Verificación manual de texto 200%, foco, contraste y lectores de pantalla.
**Motivo**: las regresiones de rutas y foco son fallos observables reales; evitar tests
que solo comparen la configuración consigo misma.
**Alternativas**: unit tests exclusivos o capturas sin interacción no prueban recorridos.
Los fixtures permiten probar contrato, nunca probar privacidad de un backend inexistente.
Recursos originales, contenido aprobado y autenticación se mantienen como bloqueos de
aceptación integrada; no son incógnitas técnicas de 001.
