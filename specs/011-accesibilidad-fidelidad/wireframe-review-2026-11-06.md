# Cotejo del wireframe recibido — 2026-11-06

## Fuente y método

Fuente original aportada por la responsable: `/Users/samanthabolivar/Downloads/wireframes web (3).pdf`, 6 páginas, exportación Figma. SHA256: `74e568b6c3b798cee0933c9fe12db2f3e5a2cbb4f275e69bb0e15ae20247a5dd`.

Se renderizaron e inspeccionaron las seis páginas completas. Referencias: 1 Inicio (1280 × 2562), 2 Historias (1280 × 3414), 3 Priva App (1280 × 3249), 4 Contacto (1284 × 1797), 5 panel (1280 × 1516), 6 acceso (904 × 1023.99). Las páginas públicas del PDF muestran copyright 2026: no es necesario modificar el año. No se ha alterado el PDF original.

Se capturaron las cuatro páginas publicadas de https://priva-785cb.web.app/ a 1280px, cargando y decodificando todas las imágenes, incluidas las diferidas. Acceso: captura del servicio local HTTPS. Panel: comparación de la referencia con componentes/estilos y evidencia funcional previa; **no se abrió una sesión de la responsable ni se capturó una nueva pantalla privada autenticada**. Su fidelidad visual actual no se da por verificada mediante una imagen sintética.

Evidencia local (ignorada por Git): `.test-output/wireframe-current-index.png`, `wireframe-current-historias.png`, `wireframe-current-app.png`, `wireframe-current-contacto.png`, `wireframe-current-login.png`; renders temporales `/private/tmp/priva-wireframes-{1..6}.png`. No se calcula un porcentaje de similitud ni igualdad píxel a píxel. No hay wireframes móviles en este archivo; accesibilidad y adaptación se sustentan en pruebas previas, no en estas referencias de escritorio.

## Resultado por pantalla

| Página PDF | Coincidencias verificadas | Diferencias pendientes de fidelidad |
|---|---|---|
| 1 Inicio | Hero texto/imagen; identidad imagen/texto; cuatro tarjetas en cuadrícula; cierre oscuro con imagen; fuente y marca aportadas | Márgenes, proporciones de columnas y saltos de título difieren. Falta el énfasis/subrayado del título y el punto de la insignia. Footer simplificado frente al diseño. Las tarjetas ya tienen iconos: no se consideran ausentes |
| 2 Historias | Hero, catálogo de tres tarjetas iniciales, metodología, identidad en dos columnas y cierre en el orden previsto; cuatro episodios disponibles mediante expansión | Faltan los contenedores, fondos e iconos de Escucha/Reflexiona/Aplica y los paneles de identidad. Tarjetas del catálogo no replican fondo, cápsula de categoría ni caja interior del ejercicio. Botones más rectangulares y diferencias de espaciado. El control de expansión está debajo del catálogo en lugar de junto al encabezado. Imágenes institucionales sin el marco doble del PDF |
| 3 Priva App | Hero; teléfono/explicación; cuatro pasos; tres funciones; sección de descarga | Teléfonos mucho más grandes: a igual ancho la página actual mide aproximadamente 4350px frente a 3249 del PDF. Faltan tarjetas/iconos en beneficios y pasos y los iconos de funciones. Faltan alternancia de fondos y tratamiento degradado del hero. El cierre actual es claro, mientras el diseño lo muestra oscuro; botones y composición difieren |
| 4 Contacto | Hero; Instagram a la izquierda/formulario a la derecha; cierre oscuro con tres insignias y checks; orden de secciones | Faltan iconos de Instagram, correo y enlace externo; insignia superior y marco de imagen difieren. Temas abreviados y sin los iconos del PDF. Forma de campos/botones, separaciones y proporciones no son idénticas. Footer simplificado |
| 5 Panel | Referencia completa recibida; código conserva barra lateral, consola, gestión de historias, resumen, búsqueda/tabla y enlace a la web | Cotejo autenticado posterior realizado: ver visual-implementation-2026-11-06.md. No se restauran comentarios públicos, cuentas/cifras de ejemplo ni contadores 128/42/56/30. Filtros/tabla deben cotejarse contra la implementación y requisitos actuales, no introducir datos de muestra para igualar la captura |
| 6 Acceso | Logo vectorial, bienvenida, introducción, correo/contraseña, mostrar contraseña y Entrar; captura local revisada | Diferencias de fondo, proporción/escala y espaciado frente a referencia. Usuario→Correo y enlace de recuperación son diferencias funcionales conservadas; diseño previamente aceptado por la responsable |

## Diferencias que NO se deben revertir automáticamente

- Imágenes y cuatro portadas nuevas, logo SVG y nombres Carolina/Juliana/Luisa/Salomé: aportados y autorizados por la responsable el 2026-11-06. Sustituyen los placeholders del PDF.
- Historias son recreaciones educativas, no «casos reales». Se conservan transcripciones y reproductores nativos accesibles, preguntas aprobadas y duraciones reales. Las duraciones/personas del wireframe son ejemplos, no valores a copiar.
- Inicio e Historias mantienen el alcance educativo aprobado: no reponer auditorías, miles de personas usuarias ni promesas de servicio no verificadas.
- Priva App es prototipo; no reponer chat operativo, respuesta en tiempo real, descargas funcionales ni compatibilidad/precio/garantías no verificadas. Mantener Próximamente y avisos de prototipo.
- Contacto continúa en demo ficticia; conservar «Formulario» y «Nombre (puedes usar un seudónimo)», según corrección expresa posterior al PDF. No reponer alias ni plazo de respuesta 24h/canales operativos sin soporte.
- Panel local: Contacto privado sustituye Comentarios; correo en acceso, números reales y bandeja vacía; no publicar el backend ni inventar comentarios.
- Enlace administrativo visible solo local, según alcance actual. El PDF lo muestra público, pero no existe panel de producción publicado al que dirigirlo.
- Conservar aviso de demo, títulos/documentos vigentes y aviso de privacidad público existente; la propuesta de privacidad rechazada sigue fuera del sitio. Se puede recuperar la composición del footer sin cambiar destinos/textos aprobados ni prometer producción.

## Conclusión y siguientes tareas

Archivo recibido y cotejo visual inicial completado: se supera el bloqueo por ausencia de PDF. **La fidelidad visual de la 011 todavía no está cerrada.** Hay diferencias concretas de presentación, además de excepciones de producto previamente aprobadas. La aprobación previa de accesibilidad no constituye aprobación de igualdad visual con este PDF.

Siguiente trabajo propuesto en tasks.md: composición del footer común, tarjetas y marcos de Historias, escala/tarjetas/fondos de App, detalles de Contacto e Inicio y cotejo autenticado del panel. Después verificar solo recorridos afectados en escritorio/móvil, teclado, contraste y texto200%. Durante el cotejo inicial no hubo modificación de producto, commit, despliegue ni edición de PDF. La implementación posterior de T010–T013 y sus pruebas se registra en visual-implementation-2026-11-06.md; las diferencias de la tabla representan el diagnóstico previo, no fallos que sigan todos abiertos. T014 y aceptación visual final pendientes.

Actualización posterior: T014 completada con sesión real iniciada por la responsable; se conservan las diferencias administrativas indicadas y T015 fue aceptada expresamente el 2026-11-06.

Cierre 2026-11-06: la responsable aprobó expresamente el resultado visual de la 011, incluidas sus diferencias de alcance demo/local. T001–T015 completadas; evidencia vigente en visual-implementation-2026-11-06.md. Las referencias anteriores a aceptación pendiente son históricas y quedan superadas. Sin commit, push ni despliegue por esta confirmación.
