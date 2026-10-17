# Modelo de datos — 004

Diseño2026-10-17. Datos editoriales/configuración versionados; no base de visitantes ni backend nuevo.

## AppPageContent

Campos: testOnly; hero (eyebrow/título/descripción/indicaciónPrototipo/imagen/revisión);
overview (título/descripción/indicaciónFuncionesPrevistas/teléfono/benefits[3]); steps
(id=como-funciona, introducción yitems[4]); features (título/introducción/items[3]); downloads
(id=descarga, título/descripción/nota A07/mockup); brand; visual (fuente/paleta y referencias).

- Beneficios en orden: Guía paso a paso, Privacidad digital, Ayuda clara y rápida.
- Pasos1–4: Escribe tu duda, Recibe instrucciones, Aplica los cambios, Mantente seguro.
- Funciones: Tips, Asistente IA, Diagnóstico de Seguridad; descripción exclusivamente prevista.
- Nota A07 exacta: Orientación para cuidar tus datos personales.
- Indicaciones de prototipo y funciones previstas no vacías/visibles en presentación;
  no usar solo metadatos o footer para cumplirlas. Copy completo sigue pendiente de P03.
- Ningún bloque de contenido define acción Conversar, cuestionario, campo de duda o diagnóstico.
- Revisiones asociadas a snapshot exacto del texto visible, incluyendo títulos/notas/pasos/claims;
  cambiar texto invalida revisión. No introducir frases operativas delPDF como texto aprobado.

## DownloadConfig (uno por plataforma)

| Campo | Validación |
|---|---|
| platform | android o iphone; exactamente una entrada de cada una |
| status | pendiente o verificado |
| candidateURL | string o null; pendiente puede no tener URL y no emite candidata al cliente |
| verification | null o evidencia vinculada a URL exacta y plataforma |

Verification: reviewedURL, platform, decisionReference, checkedAt (fecha válida de revisión,
no futura), appIdentity y accessibleAtReview=true. Referencia acredita comprobación de
oficialidad, correspondencia y acceso en esa fecha; no prueba disponibilidad futura.
Sin intervalo arbitrario de caducidad. Declaraciónverificado sin evidencia válida es inconsistente.

ValidaciónURL: absolutaHTTPS, host válido, sin espacios/controles/credenciales, no# como destino
vacío. Parsear sin normalizar/cambiar silenciosamente el valor revisado; query/fragment legítimos
pueden formar parte de URL exacta revisada. No escoger tienda ni transformarURL en instalación.

## EffectiveDownload (solo lo que recibe UI)

Unión discriminada:

- `{ platform, state: 'pending', label: 'Próximamente' }`, sin URL/href/evidencia/candidata.
- `{ platform, state: 'available', label, href }`, href igual aURL verificada; etiqueta distingueAndroid/iPhone.

Resolver puro produce pending para cualquier registro que no cumpla todas las condiciones de
habilitación. El guard detecta estado verificado contradictorio y bloquea hasta corregirlo;
pendiente explícito con URL ausente/candidata no es error de publicación.
No estado global de disponibilidad. Android/iPhone se resuelven por separado.

Transiciones: pendiente→verificado tras revisión; cambiar URL, retirar verificación o detectar
invalidez→pendiente efectivo. Confirmar declaración consistente antes de generar artefacto.
Actualizar una plataforma no modifica otra. Cambiar fuente requiere rebuild/publicación y
verificar HTML publicado; no hay actualización remota ni promesa de sincronización instantánea.

## OfficialImage / MockupReview

Tres ubicaciones: hero, teléfono de explicación y mockup de descarga; además marca compartida.
Campos: block, src local autorizada, width/height positivos, purpose/alt, estado pendiente/verificado,
sourceReference y revisión de representación/copy. Propósito informativo exige alternativa que
comunique prototipo y no acción web; decorativo exige alt vacío con motivo editorial válido.

Archivos bajo public/images/app o public/brand; path sin traversal, extensión de imagen admitida,
archivo no vacío y realpath dentro de public. No aceptar fixture como recurso final.
Revisión del mockup identifica recurso exacto y combinación(es)compatible(s):00/10/01/11,
donde bit1 Android y bit2 iPhone son disponibilidad efectiva. Una versión neutral revisada puede
cubrir las cuatro; una variante con texto de disponibilidad debe coincidir con el estado real.
Cambiar src/alt/declaración de compatibilidad invalida revisión asociada. Revisar los bytes
renderizados y texto incrustado manualmente; un path existente no demuestra aprobación/fidelidad.

## Secciones y estado de prueba

/app.html#como-funciona y /app.html#descarga son destinos de navegación001.
Datosfixture testOnly=true, revisiones y URLs HTTPS de dominio.test inequívocas de prueba, interceptadas en navegador; cuatro combinaciones
sin alterar configuración final. Rechazo en gate de entrega aun si un fixture contiene metadatos
con forma válida. Pruebas de enlaces no prueban instalación ni publicación de una app móvil.
