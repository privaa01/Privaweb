# Validación010

**Estado**: implementación local verificada, 2026-10-20 (America/Bogota). Los comandos010 existen; destinos reales y matriz contractual al200% validados en Chromium/Firefox/WebKit.35/44tareas; integración productiva pendiente. [Evidencia actual](local-review-2026-10-28.md).

## Prerrequisitos

Node>=22.22.0, dependencias de lockfile y navegadores Playwright disponibles; repositorio con selección010. Instalar dependencias con `npm ci` solo si faltan. Recursos oficiales y evidencia P02/P03/009 son necesarios para integración productiva, no para fixture sintética. No copiar datos privados a fixtures o evidencias.

## Contrato local previsto

Desde raíz del repo:

```bash
npm run check:documents:contract
npm run build:documents:contract
npm run test:documents
npm run test:e2e:documents:contract
```

Comandos implementados: Astro check/build con raíz `tests/fixtures/documents`, salida `.test-output/documents`; Node `--experimental-strip-types --test tests/documents-*.test.ts`; Playwright config `playwright.documents.config.ts` con servidor `scripts/serve-documents.mjs` y salida local aislada. Configurar Chrome/Firefox/WebKit, registrar cada navegador no disponible como bloqueado y no desactivar validaciones para fingir éxito. No escribir paquetes o suite completa en este documento.

Durante el primer incremento US1/US2, T004 conectó un servidor temporal `python3 -m http.server` limitado a loopback y `.test-output/documents`, con puerto libre y cierre gestionado por Playwright; solo se ejecutan las suites de lectura/aviso ya creadas. T027 lo sustituyó por `scripts/serve-documents.mjs` y habilita recuperación. El error genérico del servidor temporal no valida404010. Los comandos anteriores usan ahora el servidor404 del banco completo. Ejecutar invocaciones de navegador010 en secuencia: comparten el directorio de build, aunque sus reportes/artefactos se aíslan por puerto.

Resultados esperados:

1. Documentos por dos direcciones directas y ocho enlaces de footer: leer contenido, salir a Inicio, sin activo falso; fixture rotulada, sin considerarla oficial.
2. Contacto: aviso antes de enviar, datos/precauciones/plazo y privacidad, enlace a Manifiesto y regreso sin cuenta/checkbox; no enviar datos reales.
3. Validadores: rechazo de faltantes/cambios de texto tras revisión, bundle sintético, huellas/referencias inválidas y contradicciones; positivo sintético solo prueba mecanismo. Evidencia `notices` no debe aceptar otro bundle.
4. Desconocida simple/anidada, con extensión/query, acceso directo y recarga:404+cuerpo010+salida funcional; HEAD sin cuerpo; nunca fallback200/redirect. Sentinelas sintéticos no aparecen en DOM ni referrer; comprobar recursos y confinamiento del servidor.
5. Cuatro anclas reales y encabezados visibles; QR solo con material/destino aprobado y lectura comprobada. Sin material aplicable, registrar motivo; con material pendiente, bloqueo.
6. Siete anchos360/390/430/768/1024/1280/1440 y texto200%: lectura/teclado/foco. Complementar axe con lector de pantalla e inspección manual.

## Entorno local verificado

```bash
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npm run test:e2e:documents:contract -- --project=chromium
PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npm run test:e2e:documents:contract -- --project=firefox
```

Firefox requiere en este entorno autorización del ejecutor para salir del sandbox exterior, manteniendo sus protecciones. WebKit no arranca por dependencias del host: no desactivar validación ni contarlo como aprobado. Los puertos libres se comparten con workers mediante `PRIVA_DOCUMENTS_PORT`; no reutilizar un servidor ajeno.

## Integración prevista

Una vez que exista entrega real calificada, sin elegirla ni desplegarla aquí:

```bash
PRIVA_TEST_MODE=integration PRIVA_INTEGRATION_BASE_URL=https://DOMINIO-REAL-VERIFICADO npm run test:e2e:documents:integration
npm run build
```

El dominio de ejemplo es marcador de guía, nunca configuración funcional. El modo integrado no inicia fixture ni tolera material sintético: valida las páginas reales y contrato [recovery-delivery.md](contracts/recovery-delivery.md). Confirmar rutas privadas con pruebas autorizadas006/008/009, sin volcar sesiones/contenido. Revisar configuración CDN/proxy, status/cuerpo y política de referrer/logs. El build normal debe seguir bloqueado mientras falten recursos o gates de otras features; registrar el primer bloqueo y revisar los demás por separado, sin saltarlos.

Regresión proporcional: navegación001 al tocar header/layout; Contacto005 al compartir aviso; validación009 al vincular scope notices; resto solo si cambia contrato o aparece fallo. Comandos existentes útiles `npm run check:contract`, `npm run test:contact`, `npm run test:privacy`; seleccionar casos afectados en la implementación y no repetir toda suite sin motivo.

## Evidencia y cierre

Registrar fecha, revisión de código+huella de contenido, entorno/navegador, US/criterio, esperado/observado, pass/fail/blocked y ruta de evidencia saneada. Separar contrato sintético, integración y calificación editorial/operativa. Cierre requiere SC-001–007, revisión humana fechada, datos oficiales completos, evidencia009 y comportamiento404 real. Fallo, copia pendiente o deadline incumplido nunca es éxito ni certificación legal.
