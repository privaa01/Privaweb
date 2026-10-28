# Investigación técnica — 007

Fecha: 2026-10-19. Inspección del checkout y revisión delegada requerida por speckit-plan.
Registro inicial de diseño. La verificación local posterior está en [evidence.md](evidence.md); no hay calificación productiva.

## R1 — Catálogo dinámico sobre sitio estático

**Decisión**: implementar GET `/api/public/historias` en el servicio Node compuesto con006.
**Evidencia**: `src/content/stories.ts` ya configura esa URL; `src/scripts/stories-catalog.ts`
consulta sin cookies/no-store y renderiza hasta tres casos y Ver todas; `src/lib/stories-contract.ts`
valida DTO exacto. `specs/003-historias-educativas/contracts/historias.md` reserva productor007.
**Motivo**: cada lectura observa una publicación confirmada sin reconstruir Astro ni segundo catálogo.
**Alternativas**: JSON estático/rebuild introduce retrasos y fallos de despliegue; SSR global cambia
arquitectura innecesariamente. No adoptarlas. Mantener schemaVersion1, campos exactos y orden estable.
Compatibilidad necesaria: parser003 hoy fija la pregunta literal; aceptar cualquier pregunta no vacía
validada por007 permite el campo editorial aprobado, conservando literal inicial y tres opciones.
Actualizar test/contrato/modelo003 en implementación; no cambiar textos iniciales ni añadir puntuación.

## R2 — Autorización y transacciones

**Decisión**: stories_* comparte DatabaseSync privado de006; toda lectura/escritura privada usa
`withAuthorizedTransaction` y SQL parametrizado. Operaciones sin await dentro de la transacción.
**Evidencia**: `server/admin/sqlite-repository.ts` expone este guard y rechaza callbacks async;
`server/admin/runtime.ts` protege directorios/clave y conexión. `server/admin/http.ts` mantiene
rutas exactas, origen/CSRF y JSON8KiB; componer router007 sin relajar acceso006.
**Motivo**: autorización y modificación comparten frontera atómica frente a revocación/concurrencia.
**Alternativas**: sesión solo en UI o comprobación previa en otra conexión deja una carrera; rechazadas.
Inspeccionar/subir fuera de transacción y reautorizar al registrar/finalizar. Publicación no hace I/O lento.

## R3 — Trabajo privado y publicación vigente

**Decisión**: una identidad, workingJSON, publishedJSON nullable, pendingChanges y active independientes;
revision creciente por cambio, orden estable de creación. Publicar copia snapshot completo en transacción.
**Motivo**: implementa Q1 y evita mezcla parcial. Activas cuenta publicada+activa; borradores solo sin
publicación. Un trabajo pendiente sobre publicada no crea historia/fila/borrador adicional.
**Alternativas**: editar fila pública directamente contradiceQ1; historial navegable/roles excede alcance.

## R4 — Reintentos y conflictos

**Decisión**: operationId UUID generado antes de envío, recibo durable ligado a cuenta, intención,
historia, hashpayload y revisión esperada; CAS por revision. Guardado repetido devuelve recibo original
sin reejecutar; payload distinto con misma clave es409. Resultado perdido se consulta con autorización.
**Motivo**: protege creación, publicación y activación ante doble envío o respuesta fuera de orden.
**Alternativas**: botón deshabilitado no cubre red/dos pestañas; last-write-wins pierde trabajo.
La UI descarta respuestas de otro registro/generación y no repite automáticamente tras login.

## R5 — Medios y validación

**Decisión**: archivos binarios separados delJSON, IDs opacos, sin URLs remotas ni nombres de ruta del
usuario. Admitir PNG/JPEG/WebP estáticos<=8MiB, <=20 megapíxeles y dimensión<=8192; audio MP3 o WAV
PCM<=50MiB y <=30min. Cero bytes, firmas/MIME inconsistentes, vídeo, SVG, animación, pistas extra,
archivos truncados o recursos no decodificables se rechazan. No conversiones silenciosas.
Inspección con ffprobe y decodificación con ffmpeg en proceso sin shell, protocolo local limitado,
usuario sin privilegios, sin red y límite de recursos/tiempo. Extraer dimensiones/duración reales.

**Aislamiento de referencia Linux**: invocar `bwrap` mediante spawn con argumentos, nunca shell,
con namespaces de usuario/red/PID/IPC/UTS, capacidades eliminadas, no-new-privileges y
`--die-with-parent`. Montar solo binarios/bibliotecas confiables y referencias del linker (`/etc/ld.so.cache`,
`/etc/alternatives`) en lectura, el archivo de entrada
como `/input` en lectura y dispositivos mínimos necesarios; sin home, checkout, base de datos,
claves, sockets del host ni directorios escribibles del servicio. Entorno limpio y rutas de binarios
absolutas; protocolo permitido `file`, una sola entrada `/input`, sin playlists ni referencias externas.
Aplicar `prlimit` antes del decodificador: RLIMIT_AS=536870912 bytes (512MiB) por proceso,
RLIMIT_CPU soft=20/hard=21 segundos, RLIMIT_NOFILE=32 y RLIMIT_CORE=0. Ejecución secuencial
ffprobe→ffmpeg, threads=1; plazo total de pared30s para ambas etapas desde inicio de inspección,
salida combinada stdout/stderr<=1MiB. Decodificación a salida nula, sin ficheros de salida.
Con semáforo2 el presupuesto de espacio virtual de decodificadores es<=1GiB, aparte del servidor;
no se presenta RLIMIT_AS como medida de RSS ni como límite global de todos los procesos.

El launcher verifica disponibilidad y aplicación de namespaces/límites, falla cerrado si no puede
establecerlos y termina/recolecta todo el grupo al exceder plazo/salida o recibir cancelación.
La autorización se revalida al registrar el recurso: una revocación impide el commit; no se promete
interrumpir de inmediato una lectura/inspección ya autorizada antes de detectar esa revocación.
Probar red denegada, lectura de archivo centinela externo denegada, escritura denegada y límites
CPU/memoria/salida/plazo con procesos de prueba bajo el mismo launcher; ningún fallo produce ready.
La presencia de bwrap/prlimit no acredita que el kernel permita namespaces ni que estas pruebas pasen.
Si faltan capacidades, bloquear aceptación de medios; US1 textual puede verificarse por separado.
Estos valores son decisiones técnicas locales; ajustarlos exige medición y sincronizar contratos/tareas,
sin retirar el aislamiento para aceptar archivos.
**Evidencia**: Node24.19.0 y ffprobe7.1.5 presentes; presencia no prueba seguridad/decodificación ni
capacidad. Verificar binarios/runtime y sandbox en implementación y en hosting antes de aceptar.
**Motivo**: límites técnicos explícitos acotan uso y evitan presentar metadatos inventados.
**Alternativas**: base64JSON consume memoria; URLs arbitrarias permiten SSRF/exposición; SVG requiere
superficie de sanitización adicional. Formatos adicionales necesitan revisión de compatibilidad.

Blobs en raíz privada0700, archivos0600; subir streaming con límite antes de confiar Content-Length,
hash y fsync, renombrar a nombre opaco inmutable y sincronizar directorio antes de commit de metadata.
Si cae tras escritura y antes de commit queda huérfano privado, nunca publicable. Registro ready solo
tras inspección completa y autorización renovada. No borrar contenido referenciado automáticamente.
Uploads incompletos sin referencias: limpieza local tras24h con exclusión de operaciones en curso;
esto no determina retención productiva de historias/copias/recibos (009/P02).

## R6 — Servir recursos

**Decisión**: `/media/public/<id>` solo si recurso pertenece al snapshot vigente de alguna historia
publicada activa; `/api/admin/historias/recursos/<id>` exige guard antes de bytes. Catálogo y medios
no-store, nosniff; HEAD/GET y un único HTTPRange válido, 206/416 para audio. Revocar elegibilidad no
recupera bytes ya descargados. No usar hosting estático para nuevos uploads ni revelar staging.
**Motivo**: cambiar guardado no sustituye el audio público; desactivar retira nuevas lecturas elegibles.
**Alternativas**: URLs difíciles de adivinar no son autorización; copiar a public impide controlar estado.
Los casos iniciales pueden conservar rutas oficiales003 ya públicas: no prometer volverlas secretas.

## R7 — Contador de Contacto

**Decisión**: interfaz privada que solo devuelve conteo total de consultations conservadas. Referencia
local puede abrir conexión privada de solo lectura al archivo005 configurado y comprobar esquema;
si comparte archivo, consulta con la conexión autorizada. Sin fuente/tabla/error: unavailable, nunca0.
**Evidencia**: `server/contact/sqlite-repository.ts` usa consultations y hoy status soloPendiente;
008 no se implementa para resolver este contador. No ejecutar migraciones005 desde lectura007.
**Motivo**: AD03 exige cifras reales sin divulgar mensajes/correos; responder no incrementa total.
**Alternativas**: fixtures128, contar ejercicios o implementar bandeja/correo excede alcance.

## R8 — Seguridad, límites y operación

**Decisión**: límites de campos y transporte en modelo/contrato, semáforo de inspección y rate limit
por cuenta (60 mutaciones/min y10uploads/min; 429+Retry-After). No registrar textos, nombres de
archivos, cookies o payloads. Log mínimo: operationId, tipo, duración, resultado y código de error,
con acceso restringido; IDs no enviados al cliente público como trazas internas.
**Motivo**: diagnóstico de fallos sin copiar contenido privado. No limitar lecturas educativas por
cuenta ni introducir seguimiento. Política de logs, capacidad pública y protección del proxy requierenP02/009.
**Alternativas**: logs completos filtran borradores; cola ilimitada agota recursos; proveedor elegido
sin evidencia incumple constitución. No hay decisiones funcionales pendientes; solo calificación externa.

## Verificación posterior

Los cinco formatos aprobados y el rechazo de contenedor no aprobado se probaron con archivos
sintéticos. Se comprobaron namespaces/red, centinela externo, escritura, memoria/CPU/salida/plazo,
revocación durante una carga y recuperación del editor tras resultado desconocido. El sandbox
restringido de la sesión no permite crear user namespaces; las pruebas del decoder se ejecutaron
por el flujo de aprobación fuera de esa capa, manteniendo bwrap/prlimit activos y sin red.
No se habilita un fallback sin aislamiento. Ver resultados completos y límites en evidence.md.

## Adaptación macOS autorizada — 2026-10-28

La responsable solicita adaptar los ejecutores tras instalar FFmpeg9ARM64. Conservar Linux bwrap/prlimit. macOS local usa Seatbelt deny-default, lectura exacta de entrada/binario y bibliotecas del sistema, sin red/escrituras/fork. Helper nativo impone CPU20/21s, NOFILE32, CORE0 y supervisa huella física del proceso con libproc cada5ms, terminando a partir de512MiB. Darwin rechaza setrlimitAS/DATA512MiB (EINVAL comprobado); no se declara equivalencia de límite duro de espacio virtual ni calificación productiva del adaptador local. FFmpeg limita además cada asignación a128MiB. Tiempo total30s/salida1MiB/cancelación se mantienen. Construcción explícita del helper desde fuente versionada; fallar cerrado si falta. Pruebas deben comprobar denegaciones y terminación real, no solo presencia de flags.
