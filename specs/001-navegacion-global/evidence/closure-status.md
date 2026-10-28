# Revisión de cierre — Navegación 001

**Revisión vigente 2026-10-27:** [corrección de foco, pruebas en Mac y destinos integrados](review-2026-10-27.md). El informe siguiente conserva el corte histórico de 2026-10-23. La pérdida de foco compacto → expandido sí requirió corrección en la revisión nueva; localhost ya es accesible desde el runner y las imágenes de Historias/App están recibidas. Persisten revisiones editoriales, operación y destinos integrados pendientes; 23/28 tareas.

Fecha: 2026-10-23 (America/Bogota); logs del entorno en UTC. Solicitud: terminar las tareas abiertas de 001. Base de código al inicio: b17f4be. Se preservó el informe general local pendiente de commit.

**Resultado:** todos los recorridos contractuales revalidados en Chromium/Firefox y controles compartidos comprobados sobre Inicio real. **23/28 tareas completas; las cinco restantes siguen parciales por criterios de integración y revisión final de las cuatro páginas no satisfechos; WebKit se resolvió el2026-10-26.** No se cerraron casillas por pruebas de fixtures ni se eludieron los guards de las features de destino. No se detectó fallo funcional de navegación que requiera cambiar código de producto en esta revisión.

## Verificación realizada

| Comando / comprobación | Resultado | Evidencia |
|---|---|---|
| npm run check | 93 archivos, 0 errores/advertencias, 1 hint previo returnValue | closure-check.txt |
| npm run check:contract | 101 archivos, 0 errores/advertencias, mismo hint previo | closure-contract-check.txt |
| PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npm run test:e2e:contract -- --project=chromium | 46 aprobadas, 0 fallidas/omitidas, 2.3min | closure-chromium.txt |
| PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npm run test:e2e:contract -- --project=firefox --grep-invert='Matriz:' | 32 aprobadas, 0 fallidas/omitidas, 14.3s; 14 celdas excluidas por diseño | closure-firefox.txt |
| npm run test:navigation:service | 2 aprobadas: guard real006/SQLite y estado de sesión401/403 | closure-service.txt |
| Controles compartidos en Inicio real | 4 comprobaciones aprobadas: 390/1440px × texto100/200, menú/Enter/Tab/Escape/foco, activo, footer, controles≥44px, axe y overflow | closure-real-home.json |
| Build aislado de Inicio real | Aprobado con su guard; no sustituye dist del sitio completo | closure-home-build.txt |
| WebKit: test official104x40 con LD_LIBRARY_PATH local y caché Playwright | 1 intento fallido antes del navegador; falta libGLESv2.so.2 en detección del host | closure-webkit.txt |
| npm run build | Salida1 por documentos/operación010/009; no se generó entrega completa | closure-build.txt |
| npm run test:e2e:integration | Salida1: falta PRIVA_INTEGRATION_BASE_URL real; ninguna prueba integrada ejecutada | closure-integration.txt |

La matriz Chromium repite menú (16 pares), logo (4), CTA (4) y enlaces de footer (16), por puntero/teclado, en siete anchos y texto100/200. Incluye axe, overflow, foco, estado, navegación sin JS, recursos comunes y ausencia de almacenamiento/tráfico externo del banco. Es evidencia contractual, no contenido ni operación oficiales de cada destino. No se suman repeticiones o recorridos internos como casos adicionales.

Las comprobaciones adicionales de Inicio importan la entrada real protegida en el root aislado documentado en002 y verifican los controles sin activar destinos aún bloqueados. Capturas closure-home-390.png y closure-home-1440.png; no equivalen a revisión final de las cuatro páginas.

## Estado exacto de las cinco tareas abiertas

| Tarea | Parte realizada | Qué impide cerrarla |
|---|---|---|
| T023 | index/historias/app/contacto existen, usan PublicLayout y configuran su pageId correcto; guards intactos | No hay build completo aprobado ni verificación de los cuatro dist/*.html con sus contenidos/anclas finales |
| T025 | Matriz100% Chromium completa, regresiónFirefox y recursos comunes conformes; controles reales de Inicio conformes | WebKit aprobado; falta aceptación final dependiente de T023, con las cuatro páginas reales |
| T026 | Matriz200% Chromium completa, contraste/foco/controles y comprobación real de Inicio | Controles compartidos de Inicio confirmados manualmente; revisión final de las cuatro páginas depende de sus materiales y T025 |
| T027 | Checks, builds contractuales, guard006 real y suites locales aprobados; suite integrada preparada | Sin URL integrada, documentos010 aprobados, Contacto005/servicio006 calificados ni build completo |
| T028 | Progreso, guía y trazabilidad actualizados con esta evidencia | Su cierre integral depende explícitamente de T027; no se marca completa solo por editar documentación |

La aceptación guiada anterior con VoiceOver de002 corresponde a encabezados/Conocer más y revisión de Inicio. No se reutiliza como pase de menú/footer, cuatro páginas o enlaces legales/privados de001. La usuaria confirmó posteriormente los controles compartidos de Inicio en su Mac; registro exacto en manual-navigation-review.md. No acredita destinos integrados ni revisión de las cuatro páginas finales.

## Dependencias de los destinos: diagnóstico actual

- **002 Inicio:** validador pasa. Imágenes, textos y recursos recibidos.
- **003 Historias:** revisión editorial y cuatro recursos específicos pendientes; Instagram y referencias visuales no verificados en su propia configuración. No se recrean contenidos de003 dentro de001.
- **004 App:** revisión y recursos específicos, mockup y metadatos visuales pendientes. Las descargas pueden conservar Próximamente, conforme al alcance; no se inventan URLs de tienda.
- **005 Contacto:** aviso/revisión, materiales/Instagram y operación009 pendientes. No puede habilitar recogida real sin calificación.
- **006 acceso:** revisión y calificación de provisión/correo/origenHTTPS/almacenamiento/privacidad pendientes. El guard de servidor local sí está probado.
- **010 documentos:** responsable Priva y correo público ya recibidos, pero faltan proveedores/ubicación/ciclos/políticas/vigencias/permisos, revisión final y evidencia009. No se interpreta aceptar Inicio como aprobar los documentos.

Detalle completo, con salidas reales de los validadores: closure-dependencies.json. Mapa de conexión de páginas: closure-pages.json. Algunos recursos comunes ya recibidos pueden seguir pendientes de sincronización en configuraciones propias de otras features; no se deben pedir otra vez como si no existieran.

## Cómo terminar el cierre

1. Finalizar y revisar los contenidos/materiales/configuración de003/004/005 y documentos010, con las verificaciones009/006 aplicables. Mantener la navegación001 ya implementada; no sustituir destinos por fixtures.
2. Disponer de un entorno real integrado autorizado, accesible para el runner. localhost:4321 del Mac no es accesible desde esta máquina ni acredita por sí solo los servicios privados y el build completo.
3. WebKit disponible desde2026-10-26 con `npm run test:e2e:contract:webkit`;32casos aprobados. Reutilizar el wrapper para futuras regresiones, sin modificar validaciones.
4. Completar la revisión manual de menú/footer y las cuatro páginas finales; registrar entorno, método y respuesta real.
5. Ejecutar build y suite integrada001 con su URL, comprobar dist/anclas/autorización y actualizar solo entonces las tareas dependientes.

Checklist de requisitos 16/16, sin alterar marcadores. Selección activa del entorno:001. No se cambió código de producto, no se publicaron fixtures, no hubo commit/push/despliegue.

Actualización2026-10-26: el bloqueo WebKit queda resuelto. Ver webkit-runtime.md y webkit-2026-10-26.txt. La revisión manual específica de controles ya está confirmada en manual-navigation-review.md. Persisten los criterios de aceptación final/integración de T023/T025/T026/T027/T028; no se cierra una tarea dependiente por sustituir el entorno de prueba.
