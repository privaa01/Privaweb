# Investigación — 003

Fecha: 2026-10-16. Fuentes: spec003, constitución 1.0.0, astro.config.mjs, package.json,
PublicLayout, scripts de navegación, bancos/evidencias001/002 y spec007.
Se investigaron en paralelo catálogo/integración y audio/interacción/pruebas; sin editar código.

## R1 — Reutilización

**Decisión**: Astro/TS existentes, layout full y navegación compartida; CSS específico.
**Motivo**: 001 ya resuelve menú, foco de anclas y pie; 002 añadió layout full sin cambiar default.
**Alternativas**: SPA/framework o copia de navegación introducen dependencias y divergencia innecesarias.

## R2 — Catálogo público vigente

**Decisión**: shell estático y lectura JSON same-origin `GET /api/public/historias` mediante fetch.
La ruta es contrato propuesto, todavía no implementado; 007 proporcionará origen/proyección pública.
Solicitar al cargar, en pageshow al regresar de bfcache y al volver la pestaña a visible;
reemplazar catálogo tras éxito validado. Sin polling, caché persistente ni fallback de registros
embebidos en build. Revalidación falla: retirar tarjetas anteriores y comunicar error.
En carga inicial y revalidación retirar contenido obsoleto, pausar medios y reiniciar selección;
las selecciones no se transmiten ni se reconstruyen desde URL/historial.
**Motivo**: output=static actual no conoce desactivaciones posteriores; filtrado cliente de todos
los registros expondría borradores. La proyección se filtra en servidor antes de llegar al navegador.
**Alternativas**: snapshot de build depende de republicación/invalidation que aún no existe;
SSR exige adaptador/hosting no elegido; enviar registros privados y ocultarlos es inaceptable.
**Límite**: no prometer retirada instantánea de datos ya leídos por un navegador ni SLA.
007 debe probar lectura posterior al cambio y evitar caches obsoletas (respuesta no-store).
La retirada/restricción de archivos de borradores y desactivadas necesita política de origen/CDN
007; retirar tarjeta no revoca una URL. Esa prueba es requisito de cierre, no simulación local.

## R3 — Lista completa en la misma página

**Decisión**: orden estable del servidor, mostrar hasta tres elegibles inicialmente, botón
Ver todas revela restantes sin duplicar ni pedir otra página. Con <=3 conserva conjunto;
no forzar foco ni resetear ejercicios existentes al expandir. Sin paginación/truncado silencioso.
**Motivo**: H02 exige nuevas historias elegibles y recorrido local.
**Alternativas**: catálogo separado o listado fijo de tres contradicen C11.

## R4 — Audio y texto equivalente

**Decisión**: audio controls sin autoplay, preload=metadata y transcripción independiente en details.
Duración de loadedmetadata/durationchange; mostrar tiempo desconocido hasta dato finito válido.
Estados loading/canplay/waiting/stalled/playing/pause/ended/error; stalled no equivale a fallo
terminal. Listeners por instancia y limpieza al retirar; no anunciar cada timeupdate.
Audio y metadatos del fixture son archivos reproducibles rotulados como prueba, nunca oficiales.
**Motivo**: controles nativos evitan construir reproductor complejo y soportan teclado y seeking.
**Alternativas**: widget externo/rastreo o barra falsa añaden riesgos; tiempos del PDF no prueban duración.
**Límite**: verificar soporte real del formato y Range/seeking en hosting final; 007 define formatos
permitidos. Fallo no elimina transcripción ni permite fingir reproducción.

## R5 — Reflexión privada y accesible

**Decisión**: fieldset/legend y tres radios nativos por ID estable de historia; change reemplaza
texto del contenedor role=status aria-live=polite aria-atomic=true. Sin mover foco.
reset en inicialización y pageshow (incluida restauración del navegador); sin atributos checked
ni estado en URL, storage, cookies, telemetría o fetch. JavaScript ausente: explicar dependencia
para catálogo/actividad, no presentar éxito o botones que aparenten funcionar.
**Motivo**: selección única, flechas de teclado y anuncio sin semántica de examen.
**Alternativas**: botones con aria-pressed necesitan reimplementar exclusión; forms/envíos son ajenos al alcance.

## R6 — Gate y contenido pendiente

**Decisión**: entrada real y prebuild validan recursos de shell/marca, copy/revisión (incluido
historias reales), URL social verificada compartida y configuración de contrato; 007 valida cada
historia antes de publicar, 003 valida DTO y falla cerrado ante esquema inválido.
Inventario distingue pendiente/recibido/revisado con referencia; no inferir aprobación de existencia.
El guard local no consulta red ni prueba endpoint; integración remota se verifica separadamente.
**Motivo**: gate no debe aceptar fixtures ni bloquear desarrollo independiente por falta de servicio.
**Alternativas**: modo demo público, href=#, explicación inventada o silencio sobre faltantes incumplen constitución.

## R7 — Verificación y límites actuales

**Decisión**: banco .test-output/stories, caché stories-cache, artefactos stories-artifacts y
puerto4324, sin colisionar con 001/002. Chromium matriz14; Firefox/WebKit recorridos principales
cuando arranquen. Medios reales de prueba, fallos HTTP/decodificación y navegación teclado;
no confundir mock de eventos con reproducción y seeking demostrados.
**Motivo**: 002 detectó colisión de trazas y la corrigió. Su evidencia registra fallo de perfil
Firefox y bibliotecas ausentes WebKit, no cobertura aprobada de esos navegadores.
**Alternativas**: cambiar suites anteriores o reportar navegadores no ejecutados falsea evidencia.

Sin NEEDS CLARIFICATION técnicos propios sin resolver. Materiales, validaciones editoriales,
Instagram y backend/infraestructura007 son dependencias explícitas de entrega.
