# Contrato de interfaz pública — Inicio 002

Origen: [spec](../spec.md), I01–I04. No API de datos ni recopilación.

## Ruta y controles

| Entrada/control | Destino | Resultado exigido |
|---|---|---|
| Inicio | /index.html | Página institucional con activo Inicio de 001 |
| Conocer más | #somos-priva | Identidad en la misma página, título visible y foco utilizable |
| Acceso directo identidad | /index.html#somos-priva | Mismo destino tras visita/recarga |
| Acceso directo áreas | /index.html#que-hacemos | Qué hacemos visible, sin navegación previa |
| Explora nuestras historias | /historias.html | Página real de 003 en aceptación integrada |

Enlaces nativos; no impedir clic modificado/apertura nueva pestaña. El JS compartido de 001
puede mejorar foco de títulos; contenido y enlaces siguen utilizables sin JS. Si el título
ya fue alcanzado, volver a activar el ancla no produce un recorrido diferente.

## Composición e integración

PublicLayout: pageId='inicio', title descriptivo de Inicio, BrandAsset oficial cuando exista.
Añadir opción técnica de contenido full-width solo para Inicio; el default conserva ancho/padding
existentes en 001 y se comprueba mediante regresión. El cierre oscuro no debe requerir
márgenes negativos ni causar scroll horizontal.
El layout conserva header/footer/skip link; 002 no crea otro main ni nav ni copia componentes.
HomeContent compone hero, identidad, áreas y cierre, con un h1 y orden de lectura semántico.
Anclas somos-priva y que-hacemos únicas, estables para consumidores 003.
Tarjetas informativas en orden Educación Digital, Historias educativas, Herramientas Seguras,
Acompañamiento; sin botones/enlaces nuevos ni formulario.

I04 conserva etiqueta/título/imagen de referencia y párrafo exacto:
“Aprende a reconocer riesgos y toma decisiones más informadas sobre tus datos personales.”
No insertar párrafo anterior de miles de personas ni historia adicional #maria.

## Componentes y contratos internos previstos

HomeContent recibe HomeContent tipado y referencias de recursos; no busca datos por red.
Hero/Identity/Areas/Closing reciben el bloque correspondiente. home-publication valida
requisitos de entrega antes de render de src/pages/index.astro. No afecta render del banco,
que importa componentes reales con datos inequívocos de prueba y salida aislada.
La página real no admite query/flag cliente para saltarse recursos o revisión editorial.

## Publicación y dependencias

P01/P03/P04 bloquean entrega mientras falten imágenes oficiales, marca/fuente/colores para
fidelidad o revisión del contenido de capacidades. El build ejecuta primero el guard existente de cuatro páginas, luego
scripts/require-home-publication.mjs, y solo después astro build. El validador de publicación
sale con error antes de generar archivos si faltan recursos/revisión. Si faltan, se informa bloqueo en build o
render de entrada real; no se omiten secciones ni se inventan alternativas aprobadas.
El guard de cuatro páginas de la aplicación permanece; crear index no desbloquea por sí solo
el build completo. La aceptación del CTA requiere 003 real y no el destino de prueba.
Las pruebas contractuales e integradas producen evidencias separadas.

## Calidad y regresión

A cada uno de los siete anchos definidos y texto 100%/200%, verificar bloques, orden de
cuatro tarjetas, anclas (clic/directa/recarga) y CTA final con teclado/puntero. Comprobar
encabezados visibles, foco, ausencia de overflow, contenido ante imagen fallida y alternativas.
Respetar movimiento reducido; texto nunca incrustado únicamente en imágenes.
Cambiar anclas/ruta o componentes compartidos exige actualizar consumidores/documentos y
regresión 001, sin dar por probados sus destinos privados o legales aún ausentes.

Decisión vigente 2026-10-28: audios identificados por la responsable como recreaciones educativas. Ajustar títulos, descripciones y metodología para expresarlo; retirar auditorías y recursos continuos no acreditados, usando el alcance educativo aprobado en Inicio. No aprueba ejercicios ni publicación del catálogo.
