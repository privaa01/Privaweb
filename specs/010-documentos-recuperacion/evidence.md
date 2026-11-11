# Estado vigente — 2026-11-03

36/44: T034 completada para la demo publicada tras confirmación expresa de teclado/VoiceOver en Términos, Privacidad y404. Evidencia declarada por la responsable; no aprobación legal/editorial ni cierre productivo. Ver accessibility-review.md. Ocho tareas continúan abiertas. Los apartados siguientes son históricos.

# Estado vigente — 2026-10-28

35/44tareas: T028destinos reales y T033accesibilidad completas.9/9pruebas locales reales,3/3pruebas de matriz(84celdas) y27/27Node aprobadas. Documentos sin aprobación editorial/calificación productiva. Lector manual, HTTPno-referrer/admin y configuración de entrega continúan pendientes. [Detalle y comandos](local-review-2026-10-28.md). Los registros siguientes son históricos.

# Evidencia010 — Documentos informativos y recuperación404

**Fecha**: 2026-10-20 (America/Bogota; algunos logs UTC son del21). Base `659498f`, rama `main`, selección010. **Estado**:33/44 tareas verificadas localmente;11 parciales/bloqueadas. X03/FR-001 sin cierre productivo. Sin commit/push/despliegue, correo a terceros o recepción de datos reales en esta fase.

## Implementación

- Dos páginas informativas,404 y contexto auxiliar sin activoInicio falso/CTA prestado; header/footer001 preservados. HTML escapado, lectura y salida sin API nueva; navegación progresiva compartida.
- Bundle único para Términos, Manifiesto y aviso005. Compromisos009 vigentes, datos operativos rotulados y canales accesibles cuando estén verificados; configuración real sigue pendiente, sin identidad/canal/vigencia inventados.
- Revisión humana por texto vinculada a huellas SHA-256 de contenido/datos y conjunto; serialización canónica, referencia resoluble y fecha válida. Control editorial puro evita ciclo con evidencia009. No certifica legalidad ni autoría de un revisor por sí solo.
- Evidencia009 scope `notices` ligada a huella exacta del bundle y revisión de entrega; mantiene hashes/fechas/scopes anteriores. Gate010 antes de Astro y controles005–009 conservados; ausencia de datos/evidencias falla cerrada.
- Servidor local de prueba con GET/HEAD,404 con cuerpo propio, no-referrer, MIME, confinamiento de rutas, rechazo de traversal/symlink fuera de raíz y sin listado/logs sensibles. ReservasAPI/admin no se convierten en recuperación pública; no acredita enrutamiento del alojamiento real.

## Entorno y resultados

Linux, Node24.19.0, Astro7.4.0, TypeScript5.9.3 y Playwright1.64.1 fijados; sin dependencias nuevas. Fixtures aisladas, recursos y correos explícitamente sintéticos, directorios temporales/loopback. Puertos libres heredados por workers; reportes por puerto. No servicios externos reales.

| Comprobación | Resultado | Evidencia |
| --- | --- | --- |
| `npm run test:documents` |27/27,0fallos/omitidas | [node-tests.txt](evidence/node-tests.txt) |
| Contrato navegador010 |6Chromium+6Firefox aprobadas; lectura/aviso/error/anclas/7anchos/texto200%/axe/privacidad local | [chromium.txt](evidence/chromium.txt), [firefox.txt](evidence/firefox.txt) |
| Astro fixture y raíz |0errores/0warnings;1hint preexistente returnValue en inbox | [astro-check.txt](evidence/astro-check.txt) |
| TypeScript servicio009 |Aprobado; sin emisión | [service-check.txt](evidence/service-check.txt) |
| RegresiónNode005/009 |66Contacto+43privacidad aprobadas,109casos únicos | [contact-regression.txt](evidence/contact-regression.txt), [privacy-regression.txt](evidence/privacy-regression.txt) |
| Regresión navegador001/005 |45navegación+39Contacto aprobadas en Chromium,84casos | [navigation-regression.txt](evidence/navigation-regression.txt), [contact-browser-regression.txt](evidence/contact-browser-regression.txt) |
| WebKit |No inicia por dependencias host, incluida libGLESv2.so.2;0casos aprobados | [webkit-blocked.txt](evidence/webkit-blocked.txt) |
| Build de entrega |Bloqueado por datos/revisiones010 y10scopes009 no calificados; no se relajan gates | [build-blocked.txt](evidence/build-blocked.txt) |

Los siete casos de publicación/readiness reejecutados están incluidos en66+43: no sumarlos de nuevo. Los reintentos de navegador tampoco son casos adicionales. [Resumen estructurado](evidence/local-validation.json).

## Casos y criterios

| Casos | Evidencia local | Límites de aceptación |
| --- | --- | --- |
| V01/V02 |Secciones/datos, política009 compartida, borradores rechazados | SC-002/007 productivos requieren P02/P03 y revisión humana |
| V03/V11 |Revisión caducada/futura/cambiada, referencia/huella errónea, fixture y evidencia de otro bundle rechazados; gate exit1 | Aprobación positiva sintética prueba mecanismo, no operación real |
| V04 |Diez recorridos públicos,200/título/h1/Inicio, header sin activo falso, menú/Escape/foco | SC-001 local; destinos reales y recursos finales pendientes |
| V05/V06 |Aviso canónico previo al envío, datos obligatorios/alias/precauciones, privado/90d/canal y Manifiesto/regreso, sin checkbox/registro/storage nuevo | SC-002/003 locales; canal y texto final pendientes |
| V07/V08/V09 |Rutas desconocidas simples/anidadas/query→404+cuerpo propio,HEAD vacío,Inicio200; no reflejo/referrer,confinamiento/teclado | SC-004 local; proxy/CDN y autorización integrada pendientes |
| V10 |Cuatro anclas de fixture y mapa de código de las features responsables | SC-005 integrado/QR pendientes; no se creó QR |
| V12 |7anchos,fuente cuerpo200%≥32px,sin desbordamiento bloqueante,teclado/foco/axe; captura local inspeccionada390/1440 | SC-006 parcial:WebKit/lector/material final pendientes |

Tráfico/storage: ningún origen externo, cookies o almacenamiento nuevo en documentos/error del banco; aviso consultable sin enviar. No equivale a auditoría completa de los cinco recorridos009 ni de proveedores reales. El host recibe la URL; no se promete ausencia total de logs u observación.

## Incidencias resueltas

- Primera ejecución de pruebas editoriales sin módulo fue un fallo de preparación; no se contó como negativa válida. Se usó después implementación neutra y se observaron fallos de aserción por no rechazar condiciones inválidas; logs `red-*.txt` registran las negativas de publicación/aviso/HTTP/readiness antes de sus cambios.
- La configuración inicial elegía otro puerto al cargarse en workers: corregida con `PRIVA_DOCUMENTS_PORT` heredado.
- La comprobación de ancla medía la secciónContactoy podía verla parcialmente fuera de pantalla aunque su encabezado estuviera visible: se corrigió para medir el encabezado exigido por R-07.
- Ejecuciones simultáneasFirefox/WebKit colisionaron en artefactos; los casos afectados fallaron al cerrar trazas. Artefactos/reportes ahora aislados por puerto y ejecuciones010 en secuencia por build compartido. Se repitió Firefox y pasó; los fallos iniciales no cuentan como aprobación.
- Firefox requirió autorización del ejecutor fuera del sandbox exterior; no se desactivaron protecciones del navegador. WebKit sigue bloqueado y no se omite su validación.

## Pendientes

T028:destinos renderizados reales y decisión/lecturaQR según material final. T033/T034:WebKit,lector de pantalla,revisión manual y materiales finales. T035:auditoría integrada009/productiva. T037/T038:datos oficiales y textos/revisión humana. T039:calificación009 real y notices finales. T040:alojamiento/CDN y fronteras privadas reales. T041:integración real; suite preparada, no ejecutada. T042:build de entrega bloqueado. T043:guía integrada/concordancia real pendiente; guía local actualizada y ejecutada.

[Revisión de contenido](content-review.md), [entrega](delivery-review.md) y [accesibilidad](accessibility-review.md) mantienen esas condiciones. T044 sincroniza entrega parcial; ninguna tarea pendiente se aprueba por documentación. Checklist requisitos16/16 intacto, significa calidad documental. Revisión constitucional de implementación local conforme; no certifica operación, fidelidad oficial ni cumplimiento legal.

## Responsable y correo aportados — 2026-10-23

Priva y `mailto:Priva202611@gmail.com` incorporados a la configuración documental como responsable, contacto y canal públicos declarados por la usuaria. Bundle/aviso sincronizados mediante applyOperation. No se asignaron aprobaciones, vigencia, identidad fiscal o evidencia operativa por inferencia. 27 pruebas Node aprobadas y Astro check raíz sin errores/advertencias; guard010 continúa bloqueado por datos/revisiones/scopes pendientes. Logs `evidence/official-contact-{tests,check,gate}.txt`. T037 parcial; 33/44 tareas sin cambios. Detalles y siguiente dato solicitado en content-review.md. Sin envío de correo ni commit/push.

## Guía aportada por la responsable — 2026-10-28

Recibida y revisada guía Word de protección/conservación de contactos en Colombia, cinco páginas. Copia de referencia no pública y correspondencia con pendientes009/010 en [revisión de la guía](../009-privacidad-conservacion/received-guide-review-2026-10-28.md). Aporta base de redacción y normativa; sus ejemplos no constituyen política final de Priva ni evidencia de controles implantados. No se vuelven a solicitar guía/hosting/correo ya recibidos, ni se cierran revisiones/calificación por recepción documental.

## Revisión de la demo publicada — 2026-11-03

Borrador actualizado a Firebase publicado/Firestore nam5/panel local separado, sin aprobar documentos finales ni habilitar correo. 27/27Node, dos casos únicos de navegadorChrome conformes (navegación/404 y21celdas de lectura200%), Astrocheck97archivos0errores/0warnings/1hint. La matriz tuvo un timeout inicial; retest del caso afectado conforme. Gate010 continúa bloqueado y total35/44sin cambios. [Alcance, pruebas y revisión pendiente](demo-review-2026-11-03.md).

2026-11-04 — Aviso actualizado preparado y mostrado según decisiones explícitas009(sin copias/correo, plan gratuito y ejecución desde computador). Builddemo7páginas,27Node de documentos incluidos en29pruebas finales, prueba de lectura adaptada1/1conforme(21celdas). La conservación está activa; Hosting espera aprobación del texto solicitada porT038. No se marca completa revisión del conjunto productivo.

2026-11-04 — Decisión posterior: la responsable no quiere publicar el aviso actualizado. Se conserva en specs/010-documentos-recuperacion/privacy-notice-proposal.md y se retira de la fuente publicable de la demo, que mantiene su aviso anterior. No se despliegaHosting ni se infiere autorización para retirar el aviso público existente.

## Revisión manual del MVP publicado — 2026-11-10

Se abrieron Inicio, Historias, Priva App y Contacto en 360, 390, 430, 768, 1024, 1280 y 1440 px: 28 recorridos con encabezado H1 presente y cero desbordamientos horizontales (`scrollWidth === viewport`). Términos, Privacidad y una ruta inexistente mostraron títulos identificables y salidas a Inicio/Contacto; la ruta inexistente presentó “Página no encontrada”. Priva App mostró únicamente Android, enlace exacto de Google Drive, cero iPhone y cero “Próximamente”; el CTA llegó a `#descarga`. El menú móvil se expandió y permitió navegar de Inicio a Historias. No se ejecutó envío del formulario ni se transmitieron datos. Se detectó un bloqueo editorial en Contacto: permanecen las afirmaciones “100% Confidencial” y “Servidores en jurisdicción estricta”, que requieren decisión explícita o corrección antes de declarar conformidad integral con CONST-09.

El bloqueo editorial quedó resuelto y publicado el mismo día: ambas afirmaciones fueron retiradas y reemplazadas por descripciones comprobables del alcance MVP. La verificación HTTP posterior confirmó los textos nuevos y la ausencia de los anteriores.
