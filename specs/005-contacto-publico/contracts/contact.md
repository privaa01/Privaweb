# Contratos de interfaz, recepción y persistencia — 005

Fecha 2026-10-17. Diseño previo a implementación; no endpoint desplegado ni proveedor configurado.

## C1 — Documento y formulario

/contacto.html, PublicLayout pageId=contacto/contentLayout=full, lang=es/unh1. OrdenPDF4:
hero→Instagram/formulario→cierre→footer; Instagram primero enmóvil. ContactForm sección#escribir
con encabezado y labels visibles; nombre/alias, correo y mensaje requeridos. Reutilizar anclas001,
visita directa/recarga/ContactoSeguro y CTAApp deheader; no duplicar navegación.

Form novalidate y módulo compartido, errores textuales con aria-invalid/aria-describedby,
resumen/primer campo inválido localizable, estados role=status/aria-live sin exponer errorcrudo.
Advertencia/aviso completos antes de Enviar mensaje; sin confirmaciónpor simulación o formulario
externo. Sin JS se informa que envío requiere JS, se conservan contenido/anclas/avisos, sinaparentar
función completa. No envíoGET con PII como fallback. No nuevos campos de consentimiento/registro.

unknown mantiene originales readonly y Reintentar. Otra consulta: advertencia de posible guardado
previo y acción explícitaContinuar; nueva generación descarta respuestas anteriores. submitting
bloquea doble envíoclick/Enter. rejected permite corregir con intento nuevo; confirmed no repite
envío ni dice que correo ya fue enviado. API indisponible no confirma ni descarta datos en silencio.

## C2 — HTTP público (same-origin)

Solo POST application/json con Origin exactamente igual a PUBLIC_ORIGIN configurado; sin CORS
amplio ni credenciales/cookies. Request/responseCache-Control:no-store; bodymáximo32KiB,
UTF8/JSON válidos. OrigenHTTPS en producción, HTTPloopback permitido únicamente para banco.
Rechazos de método/origen/formato/longitud nunca devuelven PII ni detalle interno.

### POST /api/contacto/intentos

Cuerpo `{}` sin PII. Emitir id aleatorio256bits+token firmado+expiresAt24h. Respuesta201:
`{ result:'attempt', attemptId, token, expiresAt }`.
Sin consulta ni ledger decontacto hasta solicitud con datos; sin secreto enrespuesta.
Fallo de preparación antes de enviar payload permite editar/reintentar conservando valores.
Mecanismo no crea cuenta ni identidad persistente de visitante.

### POST /api/contacto/consultas

Cuerpo exacto `{attemptId, token, nameOrAlias, email, message}`. Normalizaciónv1 y validación
compartidas en receptor; SQL parametrizado/validación independiente del browser. No URLpayload,
HTML de datos enviados ni respuesta automática. El id deintento debe coincidir con token/digest.

| HTTP / resultado | Garantía / tratamientoUI |
|---|---|
|201 / `{result:'stored',attemptId}` | Consulta+ledger confirmados conCOMMIT; puede mostrar éxito correlacionado |
|200 / mismoacuse | ReplayCOMMITTED, datos coinciden y consulta existe; sin nueva escritura/actividad |
|422 / `{result:'not_stored',attemptId,errors}` | REJECTED terminal durable; no existe ni puede crear consulta ese intento; edición con intento nuevo |
|409 / `{result:'conflict',attemptId}` | Datos no corresponden al intento conocido; no exponeroriginal ni afirmar ausencia de guardado |
|410 / `{result:'retired',attemptId}` | Revocado/rechazado ya cerrado o desconocidoexpirado; no insertar ni confirmar consulta borrada |
|503/500 / respuesta genérica, timeout, desconexión, cuerpo inválido | Resultado desconocido salvo contrato terminal comprobado; preservar snapshot/token |

errors es mapa de códigos de campo conocidos (required/length/format), sin valores originales.
not_stored solo tras transacción de terminal REJECTED y exclusión de COMMITTED concurrente;
no inferir ausencia por recibir4xx, rollback aislado, error genérico o respuesta delproxy.
Si persistencia no permite confirmar terminal, no emitirnot_stored. Acuse público no incluye
consultationId, alias/correo/mensaje, estado de bandeja, respuesta o contenido deotros registros.

Cliente espera10s (configurable/probado) y pasa aunknown al no confirmar; retry puede compartir
solicitud aún activa en servidor y no duplica. Cuerpo/resultado/attemptId deben corresponder a
petición y generación activas; finalmente de una petición antigua no altera formulario nuevo.
No renovar token/expiración ni reinterpretar datos editados como el mismo intento.

MétodosGET/listados/lecturas/admin provisionales no existen;405/404 sin datos. Firmar es secreto
servidor; no endpoint defallos/test/SQL/debug ni controles públicos de inyección de fallos.

## C3 — ContactRepository (implementaciónSQLite de referencia)

Operaciones internas submit/terminalReject/revoke/sweepOpaqueReceipts, todas con clock inyectable
y atomicidad adecuada. No publicarlas comoHTTP de administración antes de006/008/009.

1. Bajo transacción, buscar digest SHA256(token completo). COMMITTED+consulta existente compara
   tupla normalizada y devuelve replay/conflict; no requiere clave antigua para bearer exacto conocido.
2. REJECTED/REVOKED nunca vuelven aCOMMITTED. REVOKED no confirmastored. Solo metadatoopaco
   hastaexpiry; tras expirar puede purgarse, sin datos/asociación/huella del mensaje.
3. Sin ledger, verificar firma/versión/id/fecha/vigencia; expirado/inválido no inserta. Esto previene
   replay de token antiguo tras eliminar consulta+comprobante. Sin firma válida no aceptar nuevoledger.
4. Datos inválidos con token válido generan REJECTED terminal, sin consulta ni PII enledger.
   Datos válidos insertan consultaPendiente+COMMITTED enmisma transacción; ack después de COMMIT.
5. Fallo controlado conocido puede terminalReject solo si se demuestra exclusión de otroCOMMIT;
   DBindisponible/contención/commitincierto→unknown. No retorno optimista antes de disco durable.
6. revoke elimina consulta/datos/asociación dentro de transacción y deja comprobanteREVOKED hasta
   expiresAt; limpieza posterior no permite recreación. Borrado operativo/retención/restauración009
   se sincronizan con esta interfaz; no basta ejecutarDELETE sobre una tabla y dejar replay abierto.

SQLite: BEGIN IMMEDIATE, unique(tokenDigest), FK, WAL, synchronous=FULL y busy_timeout=5000 ms; consultas parametrizadas.
Verificar los PRAGMA efectivos en cada conexión antes de aceptar escrituras. FULL exige
sincronizar el WAL antes del acuse; la durabilidad también depende del sistema de almacenamiento.
DB/key enarchivos0600, directorio0700 fuera de public/dist/staticroot y excluidoGit; startup valida
rutas y prohíbe exponerlos. Proteger también los archivos auxiliares -wal/-shm y aplicar
umask restrictiva antes de abrir la base; no servir ni copiar esos archivos a artefactos públicos. No logs de payload/token/correo/IP como datos nuevos del flujo.
Referencia local no garantiza proveedor/volumen/backups/operación productivos.

## C4 — Publicación/privacidad

Guard prebuild y assert deentrada rechazan fixtures, recursos/copy pendientes, URLInstagram
no verificada, aviso/canal/Manifiesto incompletos o preparación operativa no calificada. Mantener
guards de páginas/Inicio/Historias/App. Sin bypass público, servicio de demostración ni faltantes
reemplazados por href=#. Guard local valida configuración/evidencia, no hace red ni prueba despliegue.

Sin evidencia vigente009, omitir reclamos Cero rastreo publicitario / Sin cookies de rastreo;
los dos indicadoreshero y dosreemplazos de cierre aprobados siguen presentes. No publicar la
promesa absoluta delPDF por usar mismo layout. Aviso90d/canal/respaldos debe reflejar operación real.
No afirmar que005 completó009,010,006,008 o entrega/lectura de correo.

## C5 — Verificación trazable

| Criterio | Pruebas futuras |
|---|---|
| SC-001 | OrdenPDF4,4temas/4reemplazos, destinosInstagram/App/#escribir/footer |
| SC-002 | Fronteras/Unicode/trim/correo, envío directo inválido y cero consulta persistida |
| SC-003 | Browser+SQLite real, relectura privada/reinicio, acuse después de COMMIT, acceso público denegado |
| SC-004 | Dobleclick/Enter/concurrencia, respuesta perdida, rechazo/unknown, opción A, nueva consulta advertida, callbacks viejos |
| SC-005 | Aviso/advertencia previos,90d/canal real, claims solo con evidencia, no éxito de correo |
| SC-006 | Matriz14, teclado/errores/estados/foco, contraste/controles, lector manual |
| SC-007 | Recursos/operación/verificación real; separaciónUI mock,SQLite local y producción |

Pruebas del servicio incluyen borrado/replay/purga y reintento sin extender actividad; no cierran
la política deretención integral009. Calificar adaptador productivo con mismo contrato antes de
aceptar servicio final. Sin mediosreales/evidencia, registrar bloqueo, nunca éxito de maqueta.
