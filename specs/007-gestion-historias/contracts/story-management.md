# Contrato HTTP y UI — 007

Rutas implementadas y verificadas localmente; no desplegadas ni calificadas para producción. Conserva contratos de [006](../../006-acceso-administrativo/contracts/admin-access.md)
y [003](../../003-historias-educativas/contracts/historias.md).

## C1 — Autorización y transporte privado

Todas las rutas `/api/admin/historias*` requieren sesión006 y permiso único; guard transaccional
antes de devolver datos/metadatos/recibos/bytes o modificar estado. API no redirige a login:401;
UI retira datos privados y permite recuperar acceso sin replay. CSRF006 y origen exacto en cambios;
X-Priva-Request:1, rechazo cross-site y credenciales same-origin. Nunca tokens en URL/log/storage.
Errores mínimos sin stack/payload SQL. Cache-Control:no-store; nosniff; HTML privado tras guard006.

| Método y ruta | Entrada | Resultado confirmado |
|---|---|---|
| GET /api/admin/historias | Sin query; filtrado local | Historias y resumen global autorizados |
| GET /api/admin/historias/<id> | ID canónico | working, estado público, pending, revision y metadatos privados |
| POST /api/admin/historias | operationId, working | 201 una identidad de borrador y recibo |
| PUT /api/admin/historias/<id> | operationId, expectedRevision, working | 200 guardado privado |
| POST /api/admin/historias/<id>/publicar | operationId, expectedRevision | 200 publicación íntegra; activación intacta |
| POST /api/admin/historias/<id>/activacion | operationId, expectedRevision, active boolean | 200 activación comprobada |
| GET /api/admin/historias/operaciones/<UUID> | Sin query | Recibo de cuenta autora o404desconocido |
| PUT /api/admin/historias/<id>/recursos/<UUID> | Binario, X-Resource-Kind:image/audio | 201 recurso ready tras inspección |
| GET/HEAD /api/admin/historias/recursos/<UUID> | Sin query | Bytes privados de historia, tras guard |

Resolver rutas fijas antes de IDs genéricos; códigos404 para IDs malformados o inexistentes sin datos
sensibles. Métodos no permitidos405. No DELETE, endpoint de puntuación ni lectura pública de consultas.
No query/paginación implícita; listado completo referencia1000, escala productiva requiere medición.
Reutilizar gestor de sesión de `src/scripts/admin-session.ts`: refactorizar interfaz compartida
para CSRF y eventos de pérdida de autorización, sin segundo gestor ni token global. Registrar
editor/listado en limpieza `[data-private-data]` y cancelar generaciones al perder acceso.

JSON objeto exacto <=256KiB UTF8 válido, aplicación/json; límites de modelo. Upload solo cuerpo binario,
Content-Type compatible con tipo validado, máximo50MiB global/8MiBimagen; UUID funciona como clave
idempotente de upload ligada a historia/cuenta/hash. Misma clave con bytes distintos409; si en curso
409 con indicación verificable; GET de recurso por ID comprueba si ready,404 no certifica rollback.
Crear borrador antes de upload; no se admite upload huérfano sin historia autorizada. Ninguna operación
acepta paths/URLs del cliente, ni devuelve storageKey. Semáforo2, límite60mutaciones/min/cuenta y
10uploads/min/cuenta;429+Retry-After. Validar autorización antes de recibir archivo y al finalizar;
revocación durante transferencia descarta registro y no devuelve recurso privado.

La inspección usa launcher Linux bwrap+prlimit conforme a [R5](../research.md): namespaces
sin red ni acceso a secretos/DB, entrada/bibliotecas de solo lectura, capacidades eliminadas y
no-new-privileges. Por proceso AS512MiB, CPU20s soft/21s hard, NOFILE32, CORE0, threads1;
ffprobe y ffmpeg secuenciales con plazo total30s y salida combinada<=1MiB. Un fallo de aislamiento,
decodificación o límite mata/recolecta el grupo y nunca registra ready; no fallback sin sandbox.
Comprobar estos controles con pruebas adversas, no solo presencia de herramientas.

## C2 — Resultados, concurrencia y fallos

Mutaciones JSON llevan operationId UUID y expectedRevision entero en existentes. Canonicalizar
payload validado antes de hash. Misma cuenta+ID+intención+hash devuelve mismo recibo/revisión; clave
reutilizada con distinta intención/payload409. No actualizar UI con recibo de revisión inferior.
409CAS exige recuperar estado confirmado y conservar copia en memoria del texto local mientras esté
autorizado; no resolver con sobrescritura automática. Fallos422 incluyen errors por campo;413límite,
415tipo,429ocupado,503dependencia/disco temporal;401/403acceso. No convertir error en vacío o cero.

Respuesta JSON de mutación: `{operationId,storyId,revision,result:"confirmed",publicationState,
active,pendingChanges}`. No usar resultpublicada como promesa de estar activa. Catálogo real y recursos
se verifican para afirmar Disponible en la web. Timeout/abort/5xx sin recibo => resultado desconocido;
UI ofrece comprobar recibo e historia. Tras comprobación, reintento explícito con misma clave/payload,
no otro POST de creación. Autenticarse nunca reenvía solicitudes. Fallo antes de commit no publica;
fallo después puede haber confirmado: no hacer rollback ficticio ni negar un cambio ya durable.

## C3 — Catálogo público y medios

GET `/api/public/historias`: anónimo, sin cookies requeridas ni Set-Cookie, application/json,
Cache-Control:no-store en servicio/proxy. `{schemaVersion:1,stories:[...]}` con DTO exacto003:
id,title,category,description,image{src,alt,width,height},audio{src,type},transcript,question,
options[{id,label,explanation}]. Solo publicada AND activa, snapshot de lectura consistente y orden
estable. No revision, pendingChanges, duration, correo, working, paths o información administrativa.
Vacío real200arrayvacío; fallo503, nunca arrayvacío para ocultar error. Proyección por allowlist,
no serializar entidad y eliminar algunos campos. Pregunta: permitir cadena editorial no vacía en
parseCatalog003, manteniendo schemaVersion1/forma y pregunta original de los casos iniciales.

GET/HEAD `/media/public/<UUID>`: resolver metadatos y pertenencia a snapshot vigente activo antes
de abrir archivo, sin seguir symlinks/traversal ni rutas arbitrarias. Falta/no elegible404; no-store,
nosniff, MIME validado, Content-Length real y Accept-Ranges:bytes. Único rango válido206 con
Content-Range; rango insatisfacible416; sin rango200. Rechazar rangos múltiples sin cargar todo en
memoria; HEAD no envía cuerpo. No compresión transformante de audio. Proxy debe preservar rangos,
no cachear API/medios y no permitir servir directorio privado por alias.

Comprobar recurso/estado con snapshot coherente al autorizar lectura; desactivar impide futuras
peticiones, no revoca bytes de una lectura ya autorizada ni copias descargadas. Recursos de otra
historia activa siguen públicos. Nuevos blobs no se copian a public; URLs iniciales oficiales ya
públicas003 se inventarían privadas si se prometiera retirarlas: documentar excepción preexistente.

## C4 — Interfaz administrativa

Ruta `/admin/historias` conserva AdminShell y jerarquía de captura: título/Agregar, resumen, búsqueda,
filtros, tabla/acciones, acceso a web. Editor accesible en la misma superficie, con Guardar borrador
y Publicar diferenciados. Tres posiciones de opciones/explicaciones; sin correcto/score ni borrar.
Editar recupera working; indicador de cambios sin publicar y estado activo independientes. Publicar
requiere guardar cambios locales primero, confirmar estado/revisión y validar todos los campos.
No activar implícitamente; mostrar acción explícita de activación después de primera publicación.

Carga/error/vacío/sin resultados separados; contadores globales reales. Contacto muestra Consultas
recibidas totales conservadas o No disponible; ningún dato individual, ejercicio o cifra capturada.
Texto vacío no sustituido por contenido editorial. Control teclado, labels/errores asociados, foco
visible, estado anunciado y contraste/tamaño medidos. Al salir con cambios sin guardar advertir;
error conserva texto autorizado y avisa si debe reseleccionar archivo. Nunca webstorage de borradores.
Serial/generación por historia y petición evita aplicar respuesta vieja a otra edición; cancelar
fetch no basta. Preview blob local se libera al salir/cambiar/perder acceso; CSP limitada a ese uso.
Ver historias en la web usa `/historias.html#casos` existente, sin catálogo privado o página adicional.

## C5 — Importación y operación

Importación restringida de operador, no pantalla adicional: tres IDs/orden003 con materiales y
revisión disponibles; repetir no duplica ni pisa cambios gestionados. Ausentes=>bloqueo, no seed
oficial desde fixtures. No insertar relatos/duración/explicaciones inventados ni activar incompletos.

ReferenciaSQLite: un proceso Node para admin007 y conexiones005 compatibles; read agregado de
Contacto sin migrar ni leer contenido al cliente. Configuración ausente=>unavailable, no cero.
Adaptador productivo de datos/archivos y política de historias/copias/temporales/logs/recibos deben
calificarseP02/009. Mantener gates001–006; añadir gate007 de configuración/integración y recursos,
sin convertir una cadena de referencia a aprobación en evidencia de entrega. No compartir secretos
con catálogo. Logs solo IDop/tipo/código/duración; disponibilidad, backups/restauración y operación
real requieren verificación previa al cierre, independiente de fixtures.

## Verificación de implementación

Ver [evidencia](../evidence.md). El sandbox monta únicamente referencias del linker en lectura
además de binarios/bibliotecas/entrada. Codec y contenedor deben corresponder al formato aprobado;
un codecMP3 dentro de Matroska no se acepta como MP3. Si una carga queda desconocida, la UI permite
conservar texto y elegir otro archivo sin afirmar rollback ni asociar/publicar el recurso anterior.
Importar los tres IDs iniciales en orden canónico003; reimportar no pisa cambios gestionados.

## Portadas iniciales aportadas —2026-10-26

El módulo restringido server/stories/import.ts admite imagePath opcional para los tres IDs iniciales: omitirlo selecciona el archivo oficial de src/content/story-images.ts. Una ruta explícita sigue siendo válida y se inspecciona por el mismo flujo. No cambia la API HTTP de carga, permisos, sourceReference/reviewReference requeridos, inspección FFmpeg ni separación guardar/publicar. La importación continúa creando borradores inactivos y respeta registros ya gestionados. audioPath sigue requerido; recibir archivos en content/stories/audio/ no importa ni publica por sí solo.

2026-10-26 — audioPath también puede omitirse para los tres IDs iniciales: usa el archivo confirmado por la responsable en initial-audio.ts (1Contraseña/2Llamada/3Enlace), comprueba su hash de aprobación y lo inspecciona. La ruta explícita continúa admitida. Un cambio de bytes del archivo predeterminado se rechaza con initial_audio_changed. No cambia autorización, API HTTP ni estados públicos. El cuarto archivo corresponde a Número desconocido, para crear mediante gestión normal al disponer de ficha; no amplía silenciosamente los IDs iniciales.
