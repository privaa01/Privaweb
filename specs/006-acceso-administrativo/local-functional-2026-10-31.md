# Administración funcional local —2026-10-31

La responsable pidió que inicio de sesión y panel fueran funcionales y eligió «Primero funcional en mi computador». Autorizó confiar en Priva Local Test CA mientras esté encendido el servidor y retirarlo al detenerlo.

## Entorno

Servidor HTTPS real en https://localhost:4354. Solo escucha127.0.0.1, verifica Host/Origin, conserva cookies Secure/HttpOnly/SameSite, CSRF y autorización transaccional. No mocks de API, credenciales predeterminadas o acceso privado sin sesión. Usa los mismos servicios administrativos y de historias que las pruebas. Se ejecuta con perfil explícito local, sin modificar los guards ni el despliegueFirebase.

Base persistente en Library/Application Support/Priva/local-admin, fuera del checkout y de las raíces servidas; directorio0700 y archivos0600. Se copiaron los cuatro relatos aprobados usando el mandato original, hashes/inspección de medios y recibos privados del nuevo entorno. Solo se importan inicialmente; un marcador evita sobrescribir cambios del gestor al reiniciar. No se alteran Firebase ni los recibos del entorno anterior.

Identidad inicial: correo del operador ya autenticado en FirebaseCLI, verificado mediante Googleuserinfo (verified_email=true). Solo email y fecha/origen de esa verificación se guardan en configuración privada; no tokensGoogle en el servidor/cliente. No se inventa verificación de correo ni se envía correo.

## Primera contraseña: intervención de la responsable

La preparación inicial no creó una cuenta activada ni una contraseña predefinida. El enlace/código de configuración es aleatorio256bits, dura30min, se guarda en archivos privados y se verifica mediante digest constante. Solo puede activar la identidad verificada del operador; no admite otro email. Password15–128 con scrypt existente; cuenta y credencial se confirman transaccionalmente. Tras crearla la configuración se cierra permanentemente para esa cuenta. La contraseña la introduce la responsable en HTTPS.

El navegador integrado rechazó file:// para el archivo de apertura automática. No se eludió la política mediante otro navegador o ejecución indirecta; se retiró el redireccionador HTML. Alternativa: páginaHTTPS normal con campo de código manual y archivo de texto600 .tools/admin-local-code.txt. A petición explícita de la responsable, el código se facilitó también en el chat; no se reproduce en evidencia ni en archivos versionados. La persona completa la configuración e inicia sesión por sí misma.

## Funciones y límites

Gestor real: crear/editar borradores, subir imagen/audio con inspección/sandboxFFmpeg, publicar y activar/desactivar; catálogo público local actualizado. La página local Historias usa catálogo/medios del servidor. Ninguna de estas acciones modifica el sitio publicado de Firebase.

Correo de recuperación deshabilitado explícitamente503 mientras no exista proveedor, sin encolar entrega ficticia. Desde2026-11-03 la bandeja008 está conectada en modo de lectura a una base local inicialmente vacía, con resumen007 real0; no hay envío de respuestas ni conexión a consultasFirebase. Ver specs/008-bandeja-respuestas/local-reading-2026-11-03.md. No se declara administración productiva completa ni se cierran esas tareas.

## Verificación

2/2 pruebas nuevas,0fallos/omitidas: bootstrap restringido con capacidad/vigencia/contraseña/identidad/replay y rechazo fuera de modo local; recorrido realHTTPS en puerto/certificado efímeros independientes con configuración, login, creación/edición, reinicio y persistencia, carga real dePNG/MP3aprobados, publicación/activación/desactivación y cierre/autorización. Bases/certificados de prueba eliminados; no se usa la cuenta de la responsable para automatizar credenciales. Typecheck servidor y diff conformes. Log admin-local-final-2026-10-31.log.

Servidor del operador iniciado con autorización; importación inicial de4historias conforme. El 2026-11-03 la responsable confirmó que el inicio de sesión funciona. Se observó su sesión verificada en /admin y las cuatro historias activas con sus duraciones reales. Esta comprobación no acredita recuperación por correo ni revisión con lector de pantalla del administrador.

## Inicio y parada

Desde la raíz: PRIVA_LOCAL_TLS_TRUST=approved bash scripts/admin-local.sh iniciar. Preparación: bash scripts/admin-local.sh preparar (solo con servidor detenido). Parada: bash scripts/admin-local.sh detener. La parada verifica la identidad del proceso porHTTPS/instance antes de enviar SIGTERM; el supervisor retira confianza y certificado de ese llavero. Cerrar sesión revoca la sesión, no apaga el servidor. No se recomienda matar el supervisor abruptamente porque impediría su limpieza normal; comprobar certificado si el proceso fue interrumpido de esa manera.

La CA/clave de desarrollo se prepararon antes y no se versionan. El código de configuración y claves tampoco se versionan. Sin commit/push en esta petición. La calificación de producción006/007/009/010 continúa separada.
