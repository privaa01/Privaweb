# Contratos públicos y de interfaz — 003

Fecha: 2026-10-16. Contrato de diseño para consumidor003 y futuro productor007; no API desplegada.

## C1 — Lectura de catálogo (H02–H09 / US1–3)

- `GET /api/public/historias`, same-origin, lectura anónima; fetch con credentials=omit y cache=no-store.
- 200 application/json: `{ "schemaVersion": 1, "stories": [...] }`, PublicStory según
  [modelo](../data-model.md); array completo ordenado, incluso vacío. No paginación implícita.
- 007 aplica publicada AND activa antes de serializar; retorna únicamente campos de proyección.
  Endpoint/hosting no puede servir JSON privado y confiar en filtrado de003.
- Respuesta y capa intermedia: Cache-Control: no-store; sin service worker ni fallback persistente.
  Error de red/no2xx/tipo/esquema: mensaje de error y reintento explícito, no estado vacío.
- Respuesta inválida falla cerrada sin render parcial ni HTML arbitrario; mensajes no muestran
  stack, credenciales, respuesta cruda o registros privados. Abort/identificador de solicitud evita
  que una respuesta antigua reemplace otra reciente.
- Cargar al entrar, pageshow restaurado y regreso a visible; reintento vuelve a leer sin enviar
  selección. Durante revalidación retirar tarjetas anteriores. No promesa de actualización en
  segundo plano instantánea; la siguiente lectura debe observar estado persistido confirmado.
- 007 debe demostrar publicación, desactivación, reactivación, edición conservando IDs y recursos
  públicos vigentes, sin caché obsoleta. URLs de borradores nunca deben incluirse ni ser públicas;
  comprobar tratamiento de recursos de desactivadas y cachés en integración antes del cierre.
- La API aún no existe. 003 implementa consumidor/validador y fixtures de respuestas; no instala
  backend ni fija proveedor. Cambios de ruta/esquema requieren sincronizar este contrato y007.

## C2 — Documento y catálogo (H01–H05)

/historias.html; PublicLayout pageId=historias, un h1; orden hero→#casos→metodología→identidad→cierre.
Explorar episodios y CTA de001 usan #casos; encabezado con scroll-margin/foco según001,
también en visita directa/recarga. Shell tiene HTML accesible antes de fetch y estado de carga
anunciado sin simular datos. Sin JS: mensaje legible que explica que listado/actividad requieren
JS, manteniendo contenidos y enlaces estáticos; no afirmar recorrido educativo completado.

Hasta tres tarjetas inicialmente; Ver todas revela el conjunto completo en el mismo contenedor,
una instancia por ID. Con <=3 no duplica; mantiene contexto/foco. Estado vacío confirmado sin
tarjetas ficticias; error distinto de vacío; ambos mantienen resto de página.
No enlaces a catálogo separado ni sección#maria. Nuevos casos usan el mismo componente/actividad.

## C3 — Audio/transcripción (H03–H06)

`audio controls preload=metadata`, sin autoplay; nombre accesible específico del caso.
Estado de carga visible, estado error asociado y transcripción completa en details/summary
independiente del medio. Texto de tiempos solo de metadatos/tiempo real; no04:15/06:40/05:20 fijos.
Probar play/pause/seeking y HTTPRange del origen real; error HTTP y formato inválido no dan éxito.
No bloquear transcript/ejercicio cuando falla imagen/audio. Retirar tarjeta pausa reproducción.

## C4 — Reflexión (H07–H09)

Fieldset/legend, tres radios label asociados, name único por historia; ninguna preselección.
change muestra explicación específica inmediatamente en region role=status aria-live=polite
aria-atomic=true, sin cambiar foco ni botón adicional. Flechas/Tab/Space nativos.
Cambio reemplaza feedback, no acumula resultado. Casos independientes. Recarga/restauración
reinicia radios/feedback aunque el navegador restaure formularios. Sin selección en query/hash,
requests, eventos analíticos, cookies o almacenamiento persistente; no formulario enviado.

## C5 — Método, destinos y recursos (H10–H12)

Pasos Escucha→Reflexiona→Aplica; Saber más a /index.html#somos-priva y #que-hacemos.
Cierre exacto “Aprende a reconocer riesgos y toma decisiones más informadas sobre tus datos personales.”
Instagram oficial verificado desde configuración única compartida con005; no href vacío/#.
Imágenes con dimensiones/alternativas correctas; fallo de imagen conserva contenido útil.
Las nueve explicaciones y afirmación de historias reales requieren evidencia editorial real.

## C6 — Gate y evidencia

Gate prebuild y entrada real rechazan fixtures, shell/marca/recursos/revisión pendientes,
URL social no verificada o configuración incompleta. La entrega inicial requiere los tres casos previstos con materiales aprobados; el estado vacío
no permite omitirlos. El catálogo remoto se valida al recibir;
007 impide publicar historias incompletas. Ninguno de esos controles prueba por sí solo
correspondencia con archivos, testimonio o vigencia operativa: comprobar en integración.

| Criterio | Verificación futura |
|---|---|
| SC-001 | 3 iniciales+1 nueva+draft+inactiva; servidor excluye2 y UI expande4 sin duplicar; cambios reales007 |
| SC-002 | 3 audios oficiales con play/pause/seek/tiempos, errores y transcript equivalente |
| SC-003 | 9 selecciones/cambios con teclado/puntero y anuncio, revisión de cada explicación |
| SC-004 | Independencia/recarga/bfcache; vigilar red, cookies, storage y ausencia de estadísticas |
| SC-005 | #casos, expansión, dos anclasInicio, método y CTA oficial compartido005 |
| SC-006 | 7anchos×100/200%, axe+contraste+teclado+lector de pantalla; navegadores reales |
| SC-007 | Inventario de recursos/revisiones reales, fidelidad PDF2 y cero URLs/medios ficticios |

En fixture se pueden probar rechazo de DTO privados/inválidos y comportamiento, pero solo
servidor007 real acredita que no entrega borradores o archivos privados. No confundir resultados.
