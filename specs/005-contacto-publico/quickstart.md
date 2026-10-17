# Guía de validación — 005

Fecha 2026-10-17. Guía de reproducción de la implementación local. Resultados y bloqueos vigentes en [evidence.md](evidence.md); no hay despliegue productivo.

## Prerrequisitos

Repo /workspace/Privaweb, Node 24.19.0 con node:sqlite, npm/Python3 y lock actual. Capacidad SQLite
comprobada en investigación no acredita recepción. Runtime nativo puede emitir aviso experimental;
no presentarlo como infraestructura productiva certificada. Chromium sistema disponible;
Firefox/WebKit tienen fallos de arranque documentados en004, revalidar/registrar según entorno.

Comando existente: `npm ci`. No crear proveedor, claves productivas o cuenta externa en este paso.
DB/key locales de prueba bajo .test-output/contact-service-data, ignorados y fuera del directorio
servido; solo datos sintéticos. Nunca usar PII de usuarios en trazas/evidencias/repositorio.

## Comandos implementados

Los scripts y bancos existen. Reutilizar Node 24.19.0 y las dependencias del lockfile; no enviar datos reales a los bancos.

```bash
npm run test:contact
npm run check:contact:service
npm run check:contact:contract
npm run build:contact:contract
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:contact:contract -- --project=chromium
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:contact:service -- --project=chromium
npm run test:e2e:contact:contract -- --project=firefox --project=webkit
```

Configurar check del servicio con server/contact/tsconfig.json estricto, noEmit  e imports .ts compatibles
con Node strip-types; no depender de que Astro check incluya server/ o tests/ por accidente.

Banco de UI:4326, .test-output/contact, cachécontact-cache, artefactoscontact-artifacts y reporte
contact-results.json. Python sirve estáticos;API solo interceptada en pruebas de UI, no guardado real.
Banco compuesto:4327, mismoHTML/componentes y handlers Node+SQLite real, staticroot restringido,
artefactoscontact-service-artifacts/reportecontact-service-results.json. API/Data/key nunca dentro
del staticroot. No correr dos builds decontact ni dosinstancias del mismo banco simultáneamente.
Producción: Node API tras proxy same-origin, certificado/secretos/persistencia calificadosP02.

## Validación de UI (mocks explícitos)

1. Labels/required/aviso previos; Instagramantes enmóvil,4temas/4reemplazos; URLshared verificable,
   #escribir/ContactoSeguro/directo/recarga y CTAApp; sin imagen se conserva contenido.
2. Fronterasalias0/1/60/61 y mensaje0/1/1500/1501, trim/espacios internos, tildes/emoji/combinantes,
   correo compartido, errores asociados/foco y ningún éxito por saltarse validación de cliente.
3. preparing/submitting/dobleclick/Enter; acuse correlacionado, not_stored terminal, errorgenérico,
   timeout/cuerpoinválido. unknownconserva snapshot/tokenreadonly; Reintentar envía lo mismo.
4. Otra consultaadvierte posibleguardado y necesita acciónexplícita; respuesta/finally antiguo no
   altera nuevoformulario. Abort no se anuncia como cancelación. Rechazo confirmado admite
   corrección con tokennuevo. Valores no se borran antes de confirmar ni se guardan en storage/URL.
5. Matriz7anchos×texto100/200% antes deload/fragmento, axe/contraste/control44/foco/teclado,
   estadosdeerror y sinoverflow. Sin JS muestra dependenciahonesta para envío y mantiene contenido;
   no fallbackGET con datos. Reader/fidelidad manual se documentan aparte.

## Servicio/repositorio reales de prueba

- Comprobar WAL/synchronous=FULL/FK/busy_timeout efectivos por conexión y permisos de DB/key/
  WAL/SHM; rechazar inicio inseguro. Reinicio no equivale a prueba de corte eléctrico o durabilidad
  del proveedor.
- DB dearchivo real, consulta relecturable por procesoautorizado; reiniciar servidor y verificar
  durabilidad/acuse replay sin nuevo registro. Nada deendpoint delectura pública para las pruebas.
- Dosrequests/procesos concurrentes mismo token/contenido:unaconsulta; mismo token/otros datos:409;
  dosintentos deliberados iguales:dosconsultas. Reintento/lectura no modifica lastActivityAt.
- Validación servidor directa, origen/método/JSON/32KiB, SQLinjection como texto, noCORS/PII/logs,
  accesoHTTP a consultas/DB/key negado. Intento inválido/vencido no inserta.
- Fallo antes decommit, pérdida/destrucción de respuesta despuésdecommit, contención, rollback
  incierto: clasificación exacta; REJECTED terminal impide escritor concurrente tardío. Hooks de
  fallos solo por inyección del proceso depruebas, nunca header/query/endpoint del receptor real.
- Borrado→REVOKED sin PII/asociación, replay410 sin resurrección, purga trasexpiry y nuevo replay
  expirado rechazado; registroexistente puede dar replaytras24h por digestdelbearer exacto aun con
  rotación declave. No aprobar retención/backups/restauración009 a partir deestos tests.
- Browser enbanco compuesto envía datos sintéticos y se contrasta con SQLite por proceso de
  prueba; comprobar que UIyregistro coinciden sin intercepciónAPI ni prueba basada solo enHTTP200.

## Publicación e integración real

```bash
PRIVA_INTEGRATION_BASE_URL=https://entorno-real-verificado.example npm run test:e2e:contact:integration
npm run build
```

URL ilustrativa debe reemplazarse por entorno real. Su ausencia falla como bloqueo, sinpasar a
fixtures. Guardprebuild/entrada deben rechazar copy/recurso/Instagram/aviso/Manifiesto/canal/
configoperativa pendientes; no quitar guards existentes para generar dist. Claims de rastreo sin
verificación no se muestran. Una referencia deaprobación sintética no certifica configuración real.

Con P02/009/010 preparados: verificarTLS/proxy/origen/secreto/storage/acceso autorizado, aviso
completo con responsable/canal/90d/respaldos y destinosreales. Aceptar005 no requiere correo enviado
ni UIbandeja completa, pero sí guardado y protección real, además de evidencia de tratamiento
para no recoger datos con promesas ficticias. CT01/correo/retenciónintegral se cierran en008/009.

Registrar fecha/navegador/entorno/criterio/resultado/evidencia y cada dependencia. Proveedor,
recursos, navegador, reader o destino ausente es bloqueo/fallo, no aprobación por existir código.

## Arranque y límites de operación

El banco compuesto se inicia con `npm run test:e2e:contact:service` o, después del build del
fixture, `node --experimental-strip-types tests/fixtures/contact-service/serve.ts` en la raíz.
Sirve solamente `.test-output/contact`; DB/HMAC/fault de pruebas quedan fuera en
`.test-output/contact-service-data` con permisos privados. Su inyección de fallos por archivo
solo existe en ese wrapper, nunca en rutas/headers/query del receptor de producción.

Entrada de producción: `node --experimental-strip-types server/contact/start.ts`.
Falla cerrada hasta completar recursos/avisos y calificación de `src/config/contact.ts`.
Requiere `PUBLIC_ORIGIN` coincidente con el origen HTTPS calificado y `PRIVA_CONTACT_DATA_DIR`
privado, fuera de public/dist. `PRIVA_CONTACT_PORT` elige el puerto interno (4327 por defecto),
escucha loopback y necesita el proxy HTTPS configurado por P02. No constituye despliegue.
La clave se crea una vez y se conserva; no poner DB/clave/copias en Git, staticroot ni artefactos.

Para Firefox/WebKit instalados en este entorno usar
`PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright`; la ruta predeterminada de Playwright
no contiene esos binarios. El smoke reproducible usa `PRIVA_CONTACT_REPORT_TAG=browser-smoke`
para separar reporte/artefactos de los resultados de Chromium. Persisten fallos de arranque,
detallados en evidencia; no deshabilitar protecciones para convertirlos en aprobaciones.

La integración real requiere además `PRIVA_CONTACT_VERIFY_EXECUTABLE`: ejecutable local del
operador que usa su acceso privado autorizado, recibe como único argumento un marcador sintético
y devuelve JSON `{ "count": 1, "status": "Pendiente" }` comprobado desde la persistencia real.
No crearlo como endpoint público ni simular su resultado; credenciales quedan en su configuración
segura externa, nunca en argumentos, Git o trazas. Ausencia del verificador o de la URL bloquea
la integración. Esto define el contrato de prueba, no aporta un proveedor ni prueba autenticación 006.
