# Contrato de interfaz pública — Navegación 001

**Origen**: [spec](../spec.md), G01–G06. No es contrato de API de datos.

## Rutas y encabezado

| pageId | Etiqueta de menú | Ruta pública/build | CTA de encabezado | href de CTA |
|---|---|---|---|---|
| inicio | Inicio | /index.html | PROTÉGETE HOY | /historias.html#casos |
| historias | Historias | /historias.html | PROTÉGETE HOY | #casos |
| app | Priva App | /app.html | DESCARGAR APP | #descarga |
| contacto | Contáctanos | /contacto.html | DESCARGAR APP | /app.html#descarga |

G01: logo → /index.html; las cuatro entradas en ese orden; solo una actual. La raíz `/`
puede servir index.html, manteniendo Inicio como actual, sin cambiar enlaces canónicos.
No se impone presentación de este menú a rutas privadas o auxiliares.

## Footer

G04: logo; lema “Defendiendo la soberanía digital individual.”; texto exacto
“© 2026 Priva. Todos los derechos reservados. Navega con dignidad.”.

| Texto | href | Propietario |
|---|---|---|
| panel administrador | /admin/login | 006 |
| Términos de Servicio | /terminos.html | 010 |
| Manifiesto de Datos | /manifiesto-datos.html | 010 |
| Contacto Seguro | /contacto.html#escribir | 005 |

En Contacto se admite #escribir. No destino vacío ni # aislado.

## Componentes previstos

- PublicLayout recibe `pageId` válido y título; reúne header, main y footer semánticos.
- SiteHeader recibe `pageId`, obtiene menú/CTA del origen común y genera activo explícito.
- SiteFooter usa definición común, sin consultar usuario ni datos privados.
- `navigation.ts` inicializa disclosure accesible; id de panel único, aria-controls válido,
  aria-expanded sincronizado, enlaces ocultos no enfocables, Escape devuelve foco.
- Foco visible en enlaces/botón; no roles menu/menuitem; navegación funcional sin JS.

## Anclas y propiedad de destinos

003 ofrece `casos`; 004 ofrece `descarga`; 005 ofrece `escribir` junto al formulario.
Título visible tras llegada; scroll-margin-top si procede. Para mejora de foco usar el
encabezado de sección, no introducir un control visible adicional. No eliminar semántica
nativa ni interferir con apertura en pestaña nueva.

## Límites de integración

001 no responde consultas, autentica, publica historias ni habilita tiendas. 006 debe
proteger cada lectura/modificación; una página estática con botón Entrar no prueba G05.
010 aporta contenido revisado, no un borrador que 001 pueda publicar por su cuenta.
Las pruebas contractuales pueden usar fixtures inequívocos fuera de build de entrega.
Las pruebas integradas no sustituyen destinos reales por mocks. Si falta un destino,
registrar el recorrido bloqueado; no declarar la feature completa.

## Criterios de compatibilidad

Cualquier cambio de href público, etiqueta, orden, ancla o prop de integración debe revisar
spec, matriz, consumidores y pruebas en la misma revisión. No introducir redirects o
fallback SPA para ocultar enlaces rotos. La URL /admin/login requiere el servicio/ruteo
real de 006 en el entorno integrado; el servidor estático de 001 no lo proporciona.

## Contrato de integración administrativa pendiente — propietario 006

El único destino definido hoy para acceso es `/admin/login`. Antes de completar los
casos privados de T021, 006 debe aportar un inventario versionado de rutas privadas:
URL y método de cada operación real, tipo página/API, resultado esperado sin sesión
(código y redirección si aplica) y comprobación de que no expone datos privados.
Para cada página protegida, el contrato debe precisar la llegada al acceso; para API,
el rechazo de autorización y cuerpo sin datos. Los códigos concretos y endpoints se
fijan en 006, no se deducen ni inventan desde 001.

Los tests consumirán ese inventario y un entorno de prueba real. Un 404, una página
vacía o un formulario estático no acreditan autorización. Si falta inventario o servicio,
los casos privados y aceptación integrada G05 quedan bloqueados explícitamente; el
footer y sus pruebas contractuales continúan. T021 no se marca completa hasta definir
sus casos privados; T022 depende solo de su parte independiente.
