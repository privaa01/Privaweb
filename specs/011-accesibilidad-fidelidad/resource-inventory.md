# Inventario para011 — 2026-11-04

| Bloque | Fuente disponible | Resultado/límite |
|---|---|---|
| Identidad | public/brand/priva-logo.svg, src/config/brand.ts | Logo oficial declarado y usado; no reconstruido |
| Tipografía y colores | disenovisual/referencias.txt, src/styles/global.css y fuentesTTF locales | FuentePlusJakartaSans y paleta aportadas. La indicación original de que estaban pendientes queda superada por estos archivos. Sin necesidad de cargarGoogleFonts externo |
| Inicio | Evidencias002 de publicación, capturas1440/390, aprobación visual/editorial | Alcance educativo aprobado; cotejo realizado el 2026-11-06; diferencias en wireframe-review-2026-11-06.md |
| Historias | initialStoryImages, content/stories/audio/manifest.json, TRANSCRIPCIONES.pdf y aprobaciones003 | Cuatro audios aprobados, portadas reales; cuatro portadas propias autorizadas el 2026-11-06. VoiceOver/teclado y equivalencia de las cuatro transcripciones confirmadas por la responsable |
| PrivaApp | Aprobaciones004 y recursos públicos existentes | Prototipo, funciones previstas y Próximamente aprobados; sin inventar enlaces de descarga |
| Contacto | Corrección/aceptación005 y textos exactos aportados | Instagram antes del formulario; demo ficticiaFirestore. Aprobación visual/teclado/VoiceOver registrada. No certificación operativa de promesas absolutas de la captura |
| Acceso/panel | Capturas006/references/inicio-de-sesion.jpeg y panel-administrativo.jpeg, manifestSHA256 | Referencias recibidas. Usuario→Correo, Comentarios→Contacto privado, sin cifras/cuentas ficticias. Diseño del acceso y funcionalidad local aprobados por la responsable |
| Documentos/404 | Demo publicada y revisión010 | Teclado/VoiceOver confirmados por la responsable. Aviso nuevo rechazado; propuesta guardada fuera de páginas publicables y aviso anterior conservado |
| PDF visual | wireframes web (3).pdf aportado el 2026-11-06, seis páginas | Cotejo completo inicial registrado; ya muestra 2026. No se afirma igualdad píxel a píxel ni edición. Ver wireframe-review-2026-11-06.md |

Las aprobaciones previas se conservan; no se vuelven a solicitar textos ni recursos ya recibidos. No se certifica ausencia de rastreo de proveedores externos, jurisdicción,100%confidencialidad ni producción por una captura o por un resultadoaxe. Mantener diferencias aprobadas y límites de009/010.

## Sustitución vectorial — 2026-11-06

La responsable proporcionó /Users/samanthabolivar/Downloads/SVG/Logo_priva_Vect.svg y autorizó usarlo en todas las pantallas. Se copió sin alterar el dibujo a public/brand/priva-logo.svg. Configuración pública y administrativa actualizadas, con proporción del viewBox 328.5 × 148.71. AdminBrand compartido cubre acceso, recuperación, restablecimiento y estructura privada. La demo comparte logo en sus siete páginas; el footer público general también consume la configuración común. No se sustituyen ilustraciones que contienen marca como parte de su composición.

Validación: compilaciones demo y vistas administrativas correctas; 24/24 pruebas de publicación de Inicio; carga y decodificación SVG en siete páginas y acceso local verificadas en Chrome; capturas Inicio y acceso inspeccionadas. No se publicó en Firebase ni se realizó commit.

## Primera imagen de Inicio — 2026-11-06

La responsable proporciona «Inicio arriba.png» (500 × 350) para sustituir la imagen hero. Se conserva el archivo original en public/images/home/hero-proteccion.png y se actualiza src/content/home.ts, sin cambiar las otras imágenes. Se conserva su carácter decorativo y alternativa vacía. Compilación demo correcta; imagen decodificada en Chrome y revisión a 1280/390px sin desbordamiento horizontal móvil. Capturas locales: .test-output/home-hero-replacement-desktop.png y home-hero-replacement-mobile.png. Sin publicación en Firebase.

## Segunda imagen de Inicio — 2026-11-06

La responsable aporta «inicio medio.png» (500 × 350) para Somos Priva. Copia original: public/images/home/identidad-comunidad.png; referencia actualizada en src/content/home.ts. Se mantiene proporción y alternativa decorativa vacía. Compilación demo correcta; carga de la imagen comprobada y capturas a 1280/390px, sin desbordamiento móvil. Capturas: .test-output/home-identity-replacement-desktop.png y home-identity-replacement-mobile.png. Sin publicación en Firebase.

## Última imagen de Inicio — 2026-11-06

La responsable aporta «inicio final.png» (500 × 350) para el cierre de Inicio. Copia original: public/images/home/cierre-seguridad.png; referencia actualizada en src/content/home.ts. Se mantiene proporción y alternativa decorativa vacía. Compilación demo correcta; carga y capturas verificadas a 1280/390px, sin desbordamiento horizontal móvil. Capturas: .test-output/home-closing-replacement-desktop.png y home-closing-replacement-mobile.png. Sin publicación en Firebase. Las tres imágenes de Inicio quedan sustituidas por los archivos aportados el 2026-11-06.

## Primera imagen de Historias — 2026-11-06

La responsable aporta «historias arriba.png» (500 × 350) para el hero de Historias. Copia sin alteraciones: public/images/stories/hero-lectura.png; referencia actualizada en src/content/stories.ts. Se conserva proporción y alternativa decorativa vacía. Las portadas de los episodios permanecen independientes. Compilación demo correcta; carga de la imagen y revisión a 1280/390px sin desbordamiento móvil. Capturas: .test-output/stories-hero-replacement-desktop.png y stories-hero-replacement-mobile.png. Sin publicación en Firebase.

## Imagen del medio de Historias — 2026-11-06

La responsable aporta «Historias medio.png» para la sección «Identifica el error y aprende». Copia sin alteraciones: public/images/stories/metodo-aprendizaje.png; referencia actualizada en src/content/stories.ts. Se mantiene alternativa decorativa vacía y proporción 500 × 350. Compilación demo correcta; imagen decodificada y capturas revisadas a 1280/390px, sin desbordamiento horizontal móvil. Evidencia: .test-output/stories-method-replacement-desktop.png y stories-method-replacement-mobile.png. Sin publicación en Firebase.

## Última imagen de Historias — 2026-11-06

La responsable aporta «historias abajo.png» (500 × 350) para el cierre «Sigue explorando, aprende y mantente seguro». Copia original: public/images/stories/cierre-explorar.png; referencia actualizada en src/content/stories.ts. Se conserva alternativa decorativa vacía y proporción. Compilación demo correcta; carga y capturas comprobadas a 1280/390px sin desbordamiento horizontal móvil. Evidencia: .test-output/stories-closing-replacement-desktop.png y stories-closing-replacement-mobile.png. Las tres imágenes institucionales de Historias están sustituidas; las portadas de episodios siguen independientes. Sin publicación en Firebase.

## Primera imagen de Priva App — 2026-11-06

La responsable aporta «mejorar app arriba.png» (502 × 768) para el hero de Priva App. Copia original: public/images/app/hero-asistente.png; referencia y dimensiones actualizadas en src/content/app.ts antes de generar su snapshot de revisión autorizado. Se conserva la alternativa informativa sobre el prototipo Asistente Zyro y los avisos de prototipo. Las otras imágenes permanecen independientes. Compilación demo correcta; imagen decodificada y capturas a 1280/390px, sin recortar el teléfono ni desbordamiento horizontal móvil. Evidencia: .test-output/app-hero-replacement-desktop.png y app-hero-replacement-mobile.png. Sin publicación en Firebase.

## Imagen central de Priva App — 2026-11-06

La responsable aporta «mejorar app medio.png» (502 × 768) para «¿Qué es Priva App?». Copia original: public/images/app/overview-bienvenida.png; recurso y snapshot de revisión actualizados en src/content/app.ts con la autorización del mensaje. Alternativa informativa actualizada para describir la bienvenida, mascota y botón Conversar, sin afirmar que la imagen es interactiva. Se conservan avisos de prototipo. Compilación demo correcta; dimensiones naturales y carga verificadas en Chrome a 1280/390px sin desbordamiento horizontal móvil. Capturas: .test-output/app-overview-replacement-desktop.png y app-overview-replacement-mobile.png. Sin publicación en Firebase.

## Última imagen de Priva App — 2026-11-06

La responsable aporta «mejorar app abajo.png» (426 × 680) para la sección de descarga. Copia original: public/images/app/descarga-prototipo.png; recurso, dimensiones, alternativa informativa y snapshot autorizados actualizados en src/content/app.ts. Se mantienen los avisos de prototipo y disponibilidad Próximamente; el texto integrado en la ilustración no habilita descargas. Compilación demo correcta; carga y dimensiones comprobadas en Chrome a 1280/390px sin desbordamiento móvil. Capturas: .test-output/app-download-replacement-desktop.png y app-download-replacement-mobile.png. Las tres imágenes de Priva App quedan sustituidas. Sin publicación en Firebase.

## Imagen principal de Contacto — 2026-11-06

La responsable identifica «contactenos arriba.png» (500 × 350) como reemplazo principal de Contacto, tras aclarar que el AI anterior contenía los teléfonos de App. Copia original: public/images/contact/contacto-atencion.png; src/content/contact.ts actualiza recurso, dimensiones, referencia y alternativa informativa sobre auriculares/burbuja. Compilación demo correcta; carga y revisión a 1280/390px sin desbordamiento horizontal móvil. Capturas: .test-output/contact-hero-replacement-desktop.png y contact-hero-replacement-mobile.png. Sin publicación en Firebase.

## Portada Enlace falso / Carolina — 2026-11-06

La responsable aporta «Mesa de trabajo 5.png» (420 × 129) para Enlace falso, caso de Carolina. Copia original: public/images/stories/enlace-carolina.png; mapa compartido actualizado con alternativa «Primero verifica, luego confía. El caso de Carolina.». Se actualiza únicamente el hash autorizado del episodio por su nuevo imageAlt en local-publication-authorization.json; audio, título, transcripción y ejercicio conservados. Compilación demo correcta; portada cargada, metadatos de audio, transcripción y opciones presentes; capturas a 1440/390px. Evidencia: .test-output/carolina-cover-desktop.png y carolina-cover-mobile.png. No se modifica la base privada ya importada ni se publica Firebase.

## Portada La llamada sospechosa / Juliana — 2026-11-06

La responsable aporta «Mesa de trabajo 7.png» (420 × 129) para Juliana. Copia original: public/images/stories/llamada-juliana.png; mapa y alternativa actualizados. Se actualiza únicamente el hash autorizado del episodio por imageAlt, sin modificar audio/transcripción/pregunta. Número desconocido conserva explícitamente su antigua portada del teléfono, evitando heredar la nueva portada de Juliana; generador demo e importador local usan su clave independiente. Compilación demo correcta y Chrome verifica portada nueva, audio con metadatos, transcripción, opciones y cuarta portada conservada; capturas escritorio/móvil .test-output/juliana-cover-desktop.png y juliana-cover-mobile.png. Sin modificar registros privados existentes ni publicar Firebase.

## Portada La contraseña compartida / Luisa — 2026-11-06

La responsable aporta «Mesa de trabajo 6.png» (421 × 129) para Luisa. Copia original: public/images/stories/contrasena-luisa.png; mapa y alternativa «Si te presionan, desconfía. El caso de Luisa.» actualizados. Se actualiza únicamente el hash autorizado del episodio por imageAlt. Audio, transcripción, título y pregunta conservados. Compilación demo correcta; Chrome verifica imagen, metadatos de audio, transcripción y opciones; capturas .test-output/luisa-cover-desktop.png y luisa-cover-mobile.png. Sin modificar la base privada ni publicar Firebase.

## Portada Número desconocido / Salomé — 2026-11-06

La responsable aporta «Mesa de trabajo 8.png» (421 × 129) para Salomé, cuarta historia. Copia original: public/images/stories/numero-salome.png; mapa y alternativa «No todo lo que ves es real. El caso de Salomé.» actualizados. Se actualiza solo el hash autorizado del episodio por imageAlt; audio, título, transcripción y pregunta conservados. Compilación demo correcta; Chrome verifica tres historias iniciales, cuarta al expandir, portada nueva, metadatos de audio, transcripción y opciones; capturas .test-output/salome-cover-desktop.png y salome-cover-mobile.png. Las cuatro portadas quedan reemplazadas según las instrucciones de la responsable. Sin modificar registros privados existentes ni publicar Firebase.

## Wireframe original recibido — 2026-11-06

Fuente, SHA256, páginas y resultados en wireframe-review-2026-11-06.md. Quedan superadas las menciones históricas a ausencia del PDF visual. No es un documento de criterios ni modifica decisiones previas de producto.
