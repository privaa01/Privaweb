# Modelo de navegación — 001

Modelo de configuración y estado efímero; sin tablas persistentes, API de datos ni PII.

## PageDefinition

- `id`: unión cerrada inicio/historias/app/contacto; único.
- `label`: Inicio/Historias/Priva App/Contáctanos, respectivamente.
- `href`: /index.html, /historias.html, /app.html, /contacto.html.
- `order`: posiciones 1–4, sin duplicados.
- `headerCta`: referencia a CtaDefinition correspondiente.

Cada página declara explícitamente su id al layout. Exactamente un enlace de la
navegación principal lleva aria-current="page"; no inferirlo de una sesión anterior,
localStorage o coincidencia parcial de cadenas. Entrada directa y recarga usan el mismo id.

## CtaDefinition

- `label`: PROTÉGETE HOY o DESCARGAR APP.
- `href`: depende de la página de origen, según contrato.
- `targetSection`: casos o descarga; debe existir en la página de destino integrada.

Inicio/Historias → casos; App/Contacto → descarga. No contiene URLs de tiendas.

## DemoFooterDefinition vigente

Por aprobación del2026-10-30, DemoLayout define la identidad educativa y tres enlaces compartidos: Términos de la demo, Privacidad de la demo y Contacto. No depende de sesión ni ofrece administración. El foco usa color de la paleta con contraste mínimo3:1 sobre el fondo. El modelo productivo siguiente se conserva diferido.

## FooterDefinition de producción diferido

Logo oficial enlazado a Inicio; lema fijo; copyright fijo 2026; enlaces panel administrador,
Términos de Servicio, Manifiesto de Datos y Contacto Seguro con destinos del contrato.
Origen único para evitar divergencias entre páginas. El enlace al admin no otorga permisos.

## NavigationDisclosureState

- `mode`: compact o expanded según espacio disponible, no preferencia persistente.
- `open`: booleano efímero solo relevante en compact.
- `trigger`: botón que recibe foco al cerrar con Escape.

| Estado/evento | Resultado |
|---|---|
| Sin JavaScript | Navegación visible y enlaces utilizables |
| Inicialización en compact | Cerrado; aria-expanded=false; enlaces ocultos fuera de tabulación |
| Activar botón | Alterna visibilidad y aria-expanded coherentemente |
| Escape en navegación abierta | Cierra y devuelve foco al botón |
| Activar enlace | Navegación nativa; no impedir destino ni combinaciones del navegador |
| Pasar a expanded | Enlaces visibles sin estado cerrado residual |
| Pasar a compact con foco en enlace que se ocultará | Devolver foco al botón antes de ocultar |
| Recarga o nueva página | Estado inicial independiente; sin persistencia |

No se exige cerrar por clic exterior; no se agrega comportamiento modal. El breakpoint
se decide por ajuste de contenido y se valida en los siete anchos, no se atribuye al PDF.

## Validación del contrato

IDs únicos, cuatro entradas y orden exacto; hrefs no vacíos ni `#` aislado; anclas reales;
ningún enlace/atributo incluye datos privados. Un destino que falta en otra feature queda
bloqueado para aceptación integrada, no se reemplaza por datos o páginas ficticias.
