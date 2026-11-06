# Verificación integrada 011 — 2026-11-04

Estado: campaña automática y documentación terminadas; revisión manual del menú, editor y bandeja vacía del panel confirmada por la responsable; cotejo/entrega del PDF original pendientes. No se declara cierre completo de la 011 ni de producción.

## Sitio publicado

URL: https://priva-785cb.web.app/. Chrome instalado en macOS. Siete páginas: Inicio, Historias, App, Contacto, Términos, aviso de privacidad existente y ruta inexistente real (404). Siete anchos: 360,390,430,768,1024,1280,1440; texto a 100 y 200%: 98 combinaciones.

La primera ejecución pasó Inicio e Historias (28 combinaciones) y falló en cinco páginas por dos errores del banco: detección del menú antes de estabilizar el breakpoint y suposición de apilado de Contacto a 768px, cuando CSS lo define hasta 767px. Se corrigieron esas comprobaciones, sin cambiar código del sitio. La repetición de las cinco páginas afectadas pasó 5/5 (70 combinaciones). No es una única campaña final 7/7.

Comprobaciones: axe sin infracciones detectadas en las combinaciones ejecutadas, ausencia de desbordamiento horizontal, menú con Enter/Escape y retorno del foco, imágenes con atributo alt, vínculos no vacíos, tres historias iniciales y cuarta al expandir, controles de audio y apertura de transcripciones, selección de ejercicio con teclado y feedback; Instagram antes del formulario al apilar. Estas comprobaciones no sustituyen la escucha humana de transcripciones ni VoiceOver.

Evidencia reproducible: playwright.release-accessibility.config.ts y tests/e2e/release-accessibility.spec.ts. Resultados locales ignorados por Git: .test-output/release-accessibility-results.json y .test-output/release-accessibility-recheck-results.json; registros release-accessibility-2026-11-04.log y release-accessibility-recheck-2026-11-04.log.

## Panel privado

Regresión UI aislada: 17/17 Chromium, incluyendo 14 combinaciones de ancho/texto para acceso, recuperación, restablecimiento y estructura privada, guardia sin JavaScript, paquete sin secretos y contraste de componentes. Registro: .test-output/release-admin-accessibility-2026-11-04.log. Utiliza API sintética; no es acceso a la sesión real de la propietaria ni prueba de despliegue administrativo.

Se conserva evidencia funcional previa: 006 HTTPS 24/24 y UI 90/90; 007 SQLite/editor 14/14 y panel 89/90 más repetición focalizada 1/1; 008 20/20 Chromium. No se vuelven a ejecutar recorridos sin cambios. No se afirma una campaña actual en Firefox/WebKit.

## Revisión visual y límites

Se inspeccionaron capturas Inicio1440/100%, App390/200% y Contacto1440/100%, además de la referencia original del panel. Se observan logo, paleta y fuente disponibles; Contacto conserva el texto aprobado, las dos tarjetas y las tres insignias. Las diferencias administrativas aprobadas (bandeja privada y cifras reales) permanecen documentadas. No se observaron recortes en estas capturas.

Las capturas son evidencia de la presentación actual, no cotejo exacto con los PDF visuales originales ausentes. El PDF de transcripciones no sustituye esos wireframes. No se ha editado ni entregado un PDF con cambio de año. Tampoco se certifican jurídicamente las afirmaciones públicas aprobadas por la propietaria.

## Cierre y restricciones

Ver manual-review.md: las aprobaciones públicas previas siguen vigentes; la responsable confirmó el 2026-11-04 la comprobación específica del menú Historias/Contacto privado, apertura del editor y bandeja vacía con teclado y VoiceOver, sin guardar cambios ni compartir credenciales. No atribuirla al banco automático.

No hubo cambios de producto ni publicación durante esta campaña. Se preserva el aviso público anterior; la propuesta de privacidad rechazada permanece fuera de las páginas publicables. Los requisitos productivos diferidos de 006–010 y las decisiones de 009 (ejecución desde el computador, sin copias y sin correo) siguen vigentes. Terminar la última spec numerada no equivale a habilitar producción.

## Acceso local desde el footer

A petición de la responsable se añade «Entrar al panel administrativo» al footer compartido. Se muestra en localhost/127.0.0.1/IPv6 loopback y dirige a https://localhost:4354/admin/login. Se comprobó visibilidad en las siete páginas locales (Inicio, Historias, App, Contacto, Términos, Privacidad existente y 404). El revelado es inline para evitar dependencia de un archivo JavaScript externo cacheado; el servidor de revisión usa no-store. El panel continúa local, sin despliegue administrativo. Captura: .test-output/footer-admin-all-pages.png.

## Corrección de la vista local de Historias — 2026-11-06

La responsable detecta catálogo ausente en puerto 4355. Causa: scripts/serve-documents.mjs carecía de MIME application/json; el cliente rechaza respuestas octet-stream y conserva nosniff. Se añaden tipos JSON y audio/mpeg, sin relajar la validación del catálogo. Reiniciado únicamente el servidor estático local. Pruebas HTTP 3/3, incluida regresión MIME GET/HEAD. En Chrome se verifican tres tarjetas iniciales y cuarta al expandir; los cuatro audios cargan metadatos y avanzan su reproducción, las cuatro transcripciones abren con contenido y las preguntas muestran feedback al seleccionar respuesta. Captura: .test-output/stories-catalog-restored.png. No se borraron ni regeneraron contenidos; no se desplegó Firebase.

## Actualización 2026-11-06: PDF recibido

La ausencia del wireframe deja de ser un bloqueo. Ver wireframe-review-2026-11-06.md: seis páginas inspeccionadas, cotejo de cuatro páginas publicadas y acceso local, panel contrastado con código/evidencia previa sin nueva captura autenticada. Se registran diferencias visuales pendientes T010–T015. El año público ya es 2026; no se altera el original ni se declara cierre de fidelidad.

## Implementación posterior al cotejo — 2026-11-06

T010–T013 implementadas localmente,7/7casos públicos(98combinaciones) y repetición final Contacto1/1(14combinaciones) aprobados; Astrocheck0errores. Evidencia y límites en visual-implementation-2026-11-06.md. T014 requiere sesión autenticada y T015 aceptación visual final; no se cierra X04.

T014 completada posteriormente: revisión real con sesión iniciada por la responsable, composición1280px, cuatro historias, apertura/cierre de editor y bandeja vacía, sin guardar cambios. Evidencia descriptiva y diferencias en visual-implementation-2026-11-06.md. Aceptación visual final T015 registrada el 2026-11-06.

Cierre 2026-11-06: la responsable aprobó expresamente el resultado visual de la 011, incluidas sus diferencias de alcance demo/local. T001–T015 completadas; evidencia vigente en visual-implementation-2026-11-06.md. Las referencias anteriores a aceptación pendiente son históricas y quedan superadas. Sin commit, push ni despliegue por esta confirmación.
