# Alternativa nativa para inspección de medios en macOS

2026-10-28 (America/Bogota). Solicitud: buscar otro método que no requiera entorno Linux/contenedor. Investigación técnica; no habilita un inspector nuevo ni modifica controles vigentes.

## Hallazgos verificados

Host Apple Silicon ARM64, herramientas clang/Swift disponibles. FFmpeg/ffprobe no encontrados en PATH ni en ubicaciones Homebrew habituales. `/usr/bin/sandbox-exec` existe. Prueba inocua con perfil deny-default y ejecución de `/usr/bin/true`: salida0 al ejecutar fuera del sandbox de herramientas; dentro del sandbox anidado falló con Operation not permitted. Esto demuestra únicamente disponibilidad del lanzador nativo, no confinamiento completo de FFmpeg. No se instaló software ni procesaron archivos de la usuaria.

La implementación vigente fija ejecutables Linux `/usr/bin/ffmpeg`, `/usr/bin/ffprobe`, `/usr/bin/prlimit` y `/usr/bin/bwrap`. Dos pruebasHTTP fallan antes de inspeccionar por ffmpeg ausente. Sustituir solo la ruta no basta.

## Método alternativo propuesto

FFmpeg/ffprobe para macOS ARM64, instalados como herramientas de desarrollo, con un adaptador específico de plataforma. Conservar ejecutor Linux actual. macOS debe denegar red y escrituras, limitar lectura al archivo recibido y dependencias necesarias, ejecutar con entorno mínimo y aplicar/verificar CPU, memoria, procesos, salida, cancelación y tiempo total. No equiparar límites RSS y espacio virtual sin prueba en Darwin.

Antes de habilitar: verificar origen/versión de ejecutables; probar archivo válido, corrupto y truncado, resolución/duración extremas, límites efectivos, ausencia de lectura de otros archivos/escritura/red y cancelación durante subida. Si no se pueden acreditar las restricciones del contrato, fallar cerrado y mantener pendientes las pruebas, sin convertir la alternativa local en certificación productiva. `sandbox-exec` requiere revisar también su condición de API obsoleta y disponibilidad futura; su mera presencia no basta para seleccionarlo productivamente.

No se selecciona ffmpeg.wasm como reemplazo inmediato: necesita evaluación separada de runtime, acceso al sistema y límites; una prevalidación en navegador no sustituye la validación autorizada en servidor.

Fuentes primarias consultadas: página oficial FFmpeg de descargas https://ffmpeg.org/download.html (resultado de búsqueda indica binarios macOS); código de Apple https://github.com/apple/darwin-xnu/blob/main/bsd/sys/resource.h (RLIMIT_RSS alias RLIMIT_AS); documentación Apple setrlimit https://developer.apple.com/library/archive/documentation/System/Conceptual/ManPages_iPhoneOS/man2/setrlimit.2.html. Algunas aperturas web directas agotaron tiempo; no se descargaron ni ejecutaron binarios externos.

## Estado

Alternativa identificada y disponibilidad del aislador comprobada. Adaptador, binarios, límites y campaña real aún no implementados/verificados. El catálogo007 conectado no depende de este cambio; los episodios siguen sujetos a revisión/publicación editorial independiente.

## Instalación autorizada completada — 2026-10-28

Autorización explícita: «instala yo te doy mi autorizacion». Descargados FFmpeg9.0 y ffprobe9.0 ARM64 desde https://www.osxexperts.net/ffmpeg9arm.zip y https://www.osxexperts.net/ffprobe9arm.zip. Se verificaron las huellas del binario publicado por el distribuidor, antes de ejecutarlos:

- ffmpeg SHA256: `591260c945d0eef150e3bf82b0ef988bd36a9cecc18ff05d6679617159f0a95e`.
- ffprobe SHA256: `e11c17e8200b3ee4c4c186d245e2b4053f01d56957336c1817fca0b997469106`.

`file` confirma Mach-O64bit arm64. `codesign --verify --verbose` pasa para ambos (firma válida en disco; no implica afirmar notarización ni identidad verificada del distribuidor). No se eliminaron atributos de cuarentena, se firmaron de nuevo ni se desactivó Gatekeeper. Instalación en `.tools/ffmpeg/9.0/bin`, excluida de Git; manifiesto local installation.json. Sin sudo, modificaciones en /usr/bin, perfiles de shell ni dependencias npm. Wrapper `scripts/with-local-ffmpeg.sh` añade ese directorio al PATH únicamente para el comando invocado.

Validación real: ambos `-version` informan9.0; FFmpeg genera WAV sintético de1s; ffprobe identifica pcm_s16le/audio y duración1.000000; FFmpeg decodifica completamente con `-xerror -f null -`, salida0. Logs .test-output/ffmpeg-installed-version.log y ffprobe-installed-version.log; muestra ffmpeg-install-smoke.wav.

Instalación completa. Continúa pendiente adaptar/verificar el ejecutor aislado macOS del servicio007 y sustituir rutas Linux fijas en las pruebas: no se declara resuelto el flujo de subida ni se habilita un bypass por tener los binarios instalados.

## Estado vigente del inspector macOS

2026-10-28: adaptación implementada;42/42 pruebas007 aprobadas, incluidas subidas/importación y aislamiento nativo. Las limitaciones anteriores de FFmpeg ausente son históricas. `npm run build:media:macos` construye el supervisor y `npm run test:story-management:macos` verifica la suite. Memoria física supervisada cada5ms en Mac, sin afirmar equivalencia al límite virtual duro Linux. [Evidencia final y límites](macos-media-validation.md). No se publicaron fichas pendientes ni se cerró operación productiva.
