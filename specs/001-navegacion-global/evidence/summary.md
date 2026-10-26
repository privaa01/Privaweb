# Resultado de implementación —001 Navegación global

**Actualización**:2026-10-26 (America/Bogota). **Estado**:23/28 tareas completas, cinco parciales/bloqueadas. Componentes y contrato local verificados; sin cierre de publicación/fidelidad/integración.

## Implementado

Header/Footer/Layout reutilizables, menú con activo correcto, disclosure compacto con Escape/resize/foco, enlaces nativos sinJS, cuatroCTA y footer común2026. Sin captura de datos, nuevas cookies o servicios de navegación.

La001 ya está conectada en las páginas002–005. La010 añadió contexto auxiliar sin activo falso; las cuatro páginas principales conservan sus IDs/CTA. La usuaria aportó logo y referencia de fuente/paleta oficiales; T024 completa. Faltan imágenes/textos y calificación de otras features para compilar/publicar el conjunto.

## Reanudación y corrección

006 ya aportó contratoC1/C2/C3 y servicio local: se retiró la excepción de prueba que siempre declaraba inventario ausente. T021 completa como preparación de casos: rutasGET/HEAD protegidas401JSON, estado de sesión401 con header requerido/403sin él, nunca404 como prueba de seguridad. Banco de Node usa handler006/SQLite reales y templates sintéticos; no acredita login visual productivo, proveedor/correo o alojamiento.

La primera regresiónFirefox tuvo30pases y un fallo al reactivar el mismo fragmento. El foco podía volver albody después delclick/keyupEnter. Se difiere la mejora de foco tras la activación nativa y se completa después dekeyup; no hay preventDefault ni cambio deURL/historial/clic modificado. El caso existente falló antes y pasa después con puntero/Enter. Sin ampliación de alcance.

## Evidencia actual

| Verificación | Resultado | Registro |
| --- | --- | --- |
| Chromium contractual completo |46aprobadas,0fallos/omitidas, incluido logo/fuente/paleta oficiales | [log](official-chromium.txt) |
| Firefox recorridos principales |32aprobadas,0fallos/omitidas, incluidos recursos oficiales; matriz exhaustiva excluida por diseño | [log](official-firefox.txt) |
| Guard006 real, Node |2aprobadas;12combinaciones de documento más sesión401/403 | [log](resume-2026-10-20-service.txt) |
| Astrocheck contractual |0errores/0warnings;1hint preexistente returnValue de inbox | [log](official-check.txt) |
| Build contractual |Completado por webServer antes de suites; siete páginas/artefactos de prueba fuera de dist | Logs de navegador |
| WebKit |32aprobadas en ejecución final;0fallos/omitidas, caché privada y namespace rootless | [verificación](webkit-runtime.md), [log](webkit-2026-10-26.txt) |
| Integración |39casos definidos/listados en tres motores, ninguno ejecutado sin baseURL real | [listado](resume-2026-10-20-integration-list.txt), [bloqueo](resume-2026-10-20-integration-blocked.txt) |
| Build de entrega |Exit1 por010/009 pendientes; siguen gates y requisitos de otras features | [bloqueo](resume-2026-10-20-build-blocked.txt) |

La matrizChromium contiene14celdas: siete anchos360/390/430/768/1024/1280/1440×texto100%/200%. Cada celda recorre menú/logos/CTA/footer con teclado/puntero:80recorridos,1120en total; axe/overflow/storage/red incluidos. Texto ampliado mediante fuente real32px, no escalado de captura. Son fixtures explícitas, no auditoría de recursos/proveedores reales ni aprobación de documentos010.

Los46casos actuales incluyen32casos de recorridos/recursos y14celdas; no sumar1120como pruebas adicionales. La repetición específica de foco está incluida en32Firefox, y los30pases iniciales tampoco se suman. Históricos:44Chromium el16 y45tras corrección004; quedan en sus archivos/versiones, no se atribuyen a esta ejecución. [Resumen estructurado](resume-2026-10-20-validation.json).

## Pendientes

- T023: páginas existen y usanlayout, pero dist/anclas sobre entrega real bloqueados por contenido/recursos y operación pendientes.
- T024 completada: logo y referencias recibidos de la usuaria; copia intacta, dimensiones104×40/proporción2.6, fuente localOFL y variablesCSS verificadas. Revisión visual final T026 sigue separada.
- T025: Chromium/Firefox/WebKit conformes contractualmente; aceptación con las cuatro páginas finales pendiente.
- T026: fuente200%/teclado/contraste provisional local; lector de pantalla y fidelidad con materiales finales pendientes.
- T027: baseURL real, acceso006 alojado, documentos010 aprobados, Contacto005 calificado y build de entrega pendientes.39casos listados no son39pruebas aprobadas.
- T028: progreso sincronizado; cierre integral depende de los anteriores, no se marca completo por documentación.

[Integración](integration.md), [recursos](resources.md) y [accesibilidad](accessibility.md) detallan alcance. Checklist requisitos16/16 leído sin cambios, no evidencia de implementación. No commit/push/despliegue, edición delPDF, cuentas productivas o envío de correo en esta fase. Gate constitucional de trabajo local conforme; aceptación final deG01–G06 pendiente.

## Incorporación de recursos oficiales

Origen recibido en `disenovisual/` desde GitHub a commitcde01b0, preservando trabajo local.
Header/footer usan el PNG original104×40; fuentePlusJakartaSans normal/italic200–800 alojada
localmente conOFL, paleta exacta de referencias.txt y soporte blanco para el wordmark oscuro
en footer sin modificar sus bytes. Manifest con hashes en [official-assets.json](official-assets.json).
Capturas [390px](official-navigation-390.png) y [1440px](official-navigation-1440.png) inspeccionadas:
marca/controles legibles, sin corte observado; contenido central sigue siendo fixture explícita.

Nueva regresión de documentos010:6Chromium aprobadas, incluida carga real de la fuente y
texto200% con recursos compartidos;2Node de entregaHTTP pasan tras añadir MIMEfont/ttf
al servidor local010. [Navegador](official-documents-regression.txt), [HTTP](official-http-regression.txt).
Los bancos públicos copian solo brand/fonts compartidos preservando sus recursos sintéticos.
No hay peticiones aGoogleFonts en runtime. No se aprueban recursos/editorial específicos
faltantes de002–005 ni la configuración productiva009/010.

## Revisión vigente de cierre — 2026-10-23

46Chromium+32Firefox+2Node aprobados nuevamente;4 comprobaciones adicionales del menú/footer de Inicio real conformes. Las14celdas de navegación100/200 siguen pasando. WebKit bloqueado por libGLESv2; build completo por010/009; integración sin URL real. La prueba manual específica de controles en Inicio fue confirmada posteriormente; ver manual-navigation-review.md.23/28 tareas, cinco parciales; [estado exacto por tarea](closure-status.md). Los bloqueos históricos por ausencia de imágenes de Inicio ya están resueltos; otros destinos siguen pendientes.

## Confirmación manual y cambio de Contacto Seguro — 2026-10-23

La usuaria confirmó menú, activo, Escape/foco y nombres del footer con VoiceOver en su Mac. Solicitó que Contacto Seguro abra `/contacto.html` sin #escribir. Configuración, pruebas y contratos001/005 actualizados; se conserva el ancla del formulario para otros consumidores. Ver manual-navigation-review.md y contact-footer-change.md. No se cierra la aceptación de destinos todavía bloqueados ni la revisión final de las cuatro páginas;23/28 tareas.

## WebKit resuelto — 2026-10-26

WebKit27.2 pasa32casos mediante `npm run test:e2e:contract:webkit`, sin omitir comprobaciones ni modificar caché del host. La revisión manual de controles de Inicio ya fue confirmada por la usuaria.23/28 tareas: faltan aceptación final de cuatro páginas, build completo y recorrido integrado, condicionados a contenidos/operación de otras features. [Entorno y evidencia](webkit-runtime.md). Los bloqueos WebKit descritos en registros anteriores son históricos.
