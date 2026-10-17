# Contratos de interfaz y publicación — 004

Fecha2026-10-17. Contratos de página/configuración, no API ni instalador nuevo.

## C1 — Composición y contenido (A01–A05)

/app.html, PublicLayout pageId=app/contentLayout=full, lang=es, un h1. Ordenhero→overview con
teléfono/beneficios→#como-funciona con cuatro pasos→funciones→#descarga con plataformas/mockup.
Header/footer de 001 conservan orden, CTA y pie2026. Títulos/introducciones hacen visible prototipo
y funciones previstas; no convertir sus frases de referencia en afirmaciones de servicio actual.

Conversar es exclusivamente parte de imagen: sin button/a/input, overlay, onclick, tabindex,
role=button ni apertura de chat. Funciones/beneficios/pasos no activan servicios web ni formularios.
Textos de aprobación quedan sujetos aP03; nota A07 exacta, sin Gratis/versiones mínimas/100%.

## C2 — Anclas (A01/A04/A06)

Descargar app hero y CTA header App→#descarga; Ver cómo funciona→#como-funciona.
Header Contacto→/app.html#descarga. Navegación nativa; reutilizar foco en heading/load/hashchange
que ya implementa001. Encabezados identificados/tabindex=-1 si corresponde y scroll-margin
suficiente; título visible en visita directa, click y recarga. No script de fragmentos duplicado.
CTA hero no abre tienda ni deja de funcionar con plataformas pendientes. Sin JS, anclas y contenido
siguen disponibles (mejora de foco se comprueba aparte cuandoJS está activo).

## C3 — Resolución y controles (A06/A07)

| Estado Android | Estado iPhone | Salida |
|---|---|---|
| pendiente | pendiente | Dos textos Próximamente, cero enlaces por plataforma |
| verificado | pendiente | Enlace Android exacto; iPhone Próximamente sin acción |
| pendiente | verificado | Android Próximamente; enlace iPhone exacto |
| verificado | verificado | Dos enlaces independientes a sus destinos exactos |

Resolver de src/lib/app-downloads.ts consume config local y devuelve solo uniónEffectiveDownload
del modelo. No candidata ni revisión en HTML/atributos/script. Pendiente se muestra con nombre
plataforma y texto Próximamente, sin href/handler/tabindex/rol de botón ni acciónEnter/Space.
Disponible se muestra como enlace nativo con nombre explícito por plataforma, misma pestaña,
sin download/prefetch/confirmación de instalación. No SDK, fetch a tienda ni formulario alternativo.

URL HTTPS válida es condición necesaria, no evidencia de oficialidad. Exigir verificación ligada
exactamente aURL y plataforma, identidadPriva App, referencia y fecha/accesibilidad comprobadas.
Ausente/inválida/cambiada/no verificada→pending efectivo. Declaraciónconfig verificado inconsistente
no pasa gate; corregir a pendiente permite entregar sin enlace cuando todo lo demás esté revisado.

No fijar dominios de tiendas ni strips de query, fecha de lanzamiento, precio o versiones mínimas.
Si destino externo falla después del click, no mostrar éxito de descarga/instalación en la web.
No endpoint, caché de disponibilidad ni monitorización remota definidos por004.

## C4 — Publicación y mockups (A01–A07)

Guard prebuild y assert en entrada real, sin bypass público; preservar guards actuales de
páginas/Inicio/Historias. Rechazar testOnly, material/revisión pendientes o archivo vacío/fuera
de public, texto A07 alterado y declaración verificado sin evidencia consistente. No consultar red.
Permitir ambas plataformas pendientes; nunca exigir recibir dos URLs para aceptar ese estado.
La ausencia de Contacto real bloquea integración desde Contacto, no el banco independiente.

Revisión exacta de copy y compatibilidad de imagen con máscara00/10/01/11. Prohibir imagen
que anuncie disponibilidad inexistente; recurso oficial neutral revisado o variante coherente.
El guard valida metadatos y archivo, no inventa aprobación visual ni oficialidad de un destino.
Prueba manual confirma bytes visibles, alternativa y correspondencia con estado de cada plataforma.

## C5 — Aceptación y evidencia

| Criterio | Verificación requerida |
|---|---|
| SC-001 | Cinco grupos;3beneficios/4pasos/3funciones; prototipo visible; cero operación simulada |
| SC-002 | DosCTA hero, dos orígenes de header y ambas anclas directas/recarga, título/foco visible |
| SC-003 | Cuatro estados, URL ausente/inválida/sin revisión, cambio/retirada de evidencia independiente |
| SC-004 | Nota A07 exacta y sin promesas retiradas; Conversar no accionable; mockup coherente |
| SC-005 | Matriz14, cuatro estados a360/1440text200, axe/contraste/teclado/alternativas; lector manual |
| SC-006 | Recursos/revisión oficiales, enlaces habilitados realmente comprobados, comparaciónPDF3 |

Banco usa componentes reales y recursos/URLs sintéticos rotulados (HTTPS.test interceptados sin petición real a tiendas); no pasa gate de entrega.
No transmitir datos, emitir analítica ni guardar estado del visitante. Verificar red/storage,
además de no añadir integración externa en código; cargas locales de imagen no son rastreo.
Registrar fecha/navegador/entorno/criterio/resultado/evidencia; bloqueado/fallido nunca es aprobado.
