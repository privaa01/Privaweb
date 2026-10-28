# Adaptación de medios a macOS ARM64 — 2026-10-28

Solicitud explícita: «adaptalos», tras instalación autorizada de FFmpeg/ffprobe9.0. Adaptación local implementada; sin publicar fichas ni habilitar endpoints administrativos.

## Cambios

`server/stories/macos-media.ts` resuelve binarios instalados en .tools/ffmpeg/9.0/bin y genera un perfil Seatbelt deny-default. Permite leer exclusivamente el archivo de entrada y binario, dependencias del sistema y dispositivos de lectura necesarios; no autoriza red, escrituras ni fork. `/input` se traduce a la ruta canónica real porque macOS no usa el bind-mountLinux. Cada asignación FFmpeg se limita además a128MiB.

`server/stories/macos-supervisor.c`, construido desde fuente versionada por `scripts/build-macos-media.sh`, limita CPU20/21s, NOFILE32 y CORE0; supervisa huella física cada5ms y termina el proceso al superar512MiB. También tiene plazo independiente de30s y finaliza el hijo por interrupción o pérdida del padre. Se conserva en Node el plazo global30s de inspección, salida máxima1MiB, cancelación y terminación del grupo de procesos. No hay fallback sin aislamiento si falta el helper/binario.

Darwin rechazó setrlimitAS/DATA/RSS a512MiB con EINVAL en pruebas locales. La supervisión de huella física puede tener sobrepaso transitorio entre muestras; **no es equivalente a RLIMIT_AS duro** ni califica producción. Linux conserva bwrap/prlimit y sus namespaces/cotas originales. No se seleccionaron servicios de nube ni cambiaron las condiciones de cierreT058/T059.

Pruebas de generación de medios usan `mediaBinary` en vez de /usr/bin/ffmpeg fijo. La prueba específica de namespacesLinux se registra solo en Linux; macOS registra su prueba nativa de denegaciones reales. No se declara que Mac haya ejecutado el sandboxLinux ni se cuentan como omitidas pruebas de otros sistemas.

## Perfil acotado y revisión automática

El cargador dyld abortaba porque requería leer el nodo directorio raíz. Una propuesta de lectura sobre / fue rechazada por revisión automática por riesgo de acceso amplio; no se ejecutó ese cambio. Se probó una variante más restringida y se incorporó únicamente `file-read-data` bajo `require-all` de `literal "/"` y `vnode-type DIRECTORY`: no es subpath ni permite leer archivos bajo /. La prueba nativa confirma lectura de la entrada autorizada y denegación de un archivo centinela adyacente, escritura sobre entrada, creación de archivo, conexión de red y fork. No hay impedimento de aprobación pendiente para la solución acotada.

## Verificación final

`TMPDIR=/private/tmp node --test --test-concurrency=2 tests/story-management-*.test.ts`: **42/42 aprobadas**,0fallidas/omitidas,24.7s. Incluye2pruebas de conexión local anteriores, subidas reales válidas/corruptas, límites, revocación durante subida, persistencia/publicación/mediosRange con datos sintéticos, importación de recursos oficiales manteniendo revisiones/publicación independientes, catálogos, autorización y política macOS real.

La prueba nativa verifica getrlimitCPU/NOFILE/CORE, retorno137 por exceso de memoria física, retorno152 por límiteCPU y rechazo por salida/tiempo. No se sustituyó una terminación por timeout genérico para declarar CPU o memoria aprobadas. Primera campaña específica7/7 y HTTP/import13/13; son subconjuntos/repeticiones, no se suman al total42.

TypeScript007 sin errores. Astro check95archivos,0errores/advertencias,1hint previo de returnValue. `git diff --check` conforme. Ningún despliegue, importación de fichas pendientes ni publicación se realizó para estas pruebas.

Logs ignorados: .test-output/macos-media-final.log, macos-media-policy.log, macos-media-http-import.log, macos-media-tsc.log y macos-media-check.log. Versiones: macOS ARM64, Node24.22.1, FFmpeg/ffprobe9.0. Pruebas de lanzamiento Seatbelt ejecutadas fuera del sandbox anidado de herramientas por el mecanismo de aprobación del entorno; el perfil del decoder permaneció activo.

## Uso

- `npm run build:media:macos`: compilar supervisor con clang de Xcode Command Line Tools.
- `npm run test:story-management:macos`: construir y ejecutar la suite007 en este Mac.
- `npm run dev:local`: catálogo007 y Contacto sintético existentes; selección macOS del inspector automática. No habilita subidas anónimas ni monta administración.

La adaptación resuelve las pruebas de subida bloqueadas por plataforma. Los episodios públicos siguen requiriendo revisión de ejercicios/importación/publicación y el build productivo sigue sujeto a otros guards.
