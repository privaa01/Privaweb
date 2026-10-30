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

## Footer de demo vigente — 2026-10-30

Por aprobación de la responsable, el cierre demo usa identidad «Priva · Demostración educativa» y tres enlaces: Términos de la demo→/terminos.html, Privacidad de la demo→/manifiesto-datos.html, Contacto→/contacto.html. Doce recorridos desde las cuatro páginas. No hay enlace administrativo; su contrato original se conserva diferido. Build de aceptación: build:demo/.demo-dist. [Decisión](../demo-scope-approval-2026-10-30.md).

## Footer de producción diferido

G04: logo; lema “Defendiendo la soberanía digital individual.”; texto exacto
“© 2026 Priva. Todos los derechos reservados. Navega con dignidad.”.

| Texto | href | Propietario |
|---|---|---|
| panel administrador | /admin/login | 006 |
| Términos de Servicio | /terminos.html | 010 |
| Manifiesto de Datos | /manifiesto-datos.html | 010 |
| Contacto Seguro | /contacto.html | 005 |

Decisión explícita de la usuaria, 2026-10-23: Contacto Seguro abre la página desde el inicio, también desde Contacto. No añade #escribir, no abre una pestaña nueva ni omite el contenido inicial. El ancla del formulario sigue disponible para otros consumidores.

## Componentes previstos

- PublicLayout recibe `pageId` válido y título; reúne header, main y footer semánticos.
- SiteHeader recibe `pageId`, obtiene menú/CTA del origen común y genera activo explícito.
- SiteFooter usa definición común, sin consultar usuario ni datos privados.
- `navigation.ts` inicializa disclosure accesible; id de panel único, aria-controls válido,
  aria-expanded sincronizado, enlaces ocultos no enfocables, Escape devuelve foco.
- Foco visible en enlaces/botón; no roles menu/menuitem; navegación funcional sin JS.

Corrección 2026-10-27 (G01/SC-004/SC-005): cuando el cambio a modo expandido oculta el botón que tiene foco, mostrar primero la navegación y enfocar su enlace de página actual; en auxiliares sin página actual, el primer enlace. El cambio a compacto conserva el retorno al botón si se ocultaría un enlace enfocado. No mover foco situado fuera de esos controles. Sin cambios de rutas o alcance.

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

## Contrato de integración administrativa — propietario006

Actualizado2026-10-20: el contrato006 C1/C2/C3 está disponible en
[admin-access.md](../../006-acceso-administrativo/contracts/admin-access.md), revisión2026-10-19.
El inventario consumidor para G05 está versionado en `tests/helpers/navigation-private-contract.ts`.
No sustituye las operaciones de007/008 ni decide códigos desde001; se contrasta con el handler006.

| Método/ruta | Sin sesión | Verificación |
| --- | --- | --- |
| GET `/admin/login` |200 HTML público | Formulario de correo/contraseña; no contenido privado |
| GET/HEAD `/admin`, `/admin/historias`, `/admin/contacto` |401 JSON, `result:unauthenticated` | Sin redirección/HTML privado; HEAD sin cuerpo; no-store |
| GET `/api/admin/sesion`, header `X-Priva-Request:1` |401 JSON, `result:unauthenticated` | No identidad/datos privados; no-store |
| GET `/api/admin/sesion`, sin header requerido |403 JSON, `result:forbidden` | No es404 ni fallback estático |

006 rechaza documentos protegidos con401 JSON: no se inventa una redirección al login.
El enlace público del footer sí abre `/admin/login`. En producción el origenHTTPS y el
ruteo del servicio deben calificarse; un documento/login estático no satisface estos casos.

`tests/navigation-service.test.ts` comprueba el handler real con SQLite aislado, GET/HEAD,
sin cookie y cookie inválida; su banco tiene templates sintéticos y solo acredita el guard,
no el login visual real, el correo o el alojamiento. Los casos integrados usan un origen
real suministrado, sin mocks, y comprueban401/403 exactos;404 nunca acredita protección.
Faltan entorno integrado, documentos010 aprobados y recursos oficiales para cerrar G05/G06.

## Validación del cierre demo — 2026-10-30

G01–G03 y G04/G06 demo comprobados; G05 producción diferido. Foco mínimo3:1, medición publicada11,12:1. Navegación sin JS y menús/foco/resize en tres motores conformes; revisión humana reportada. [Evidencia](../evidence/demo-closure-2026-10-30.md).
