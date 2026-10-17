# Investigación — 004

Fecha:2026-10-17. Fuentes: spec004, constitución1.0.0, PDF3/R35, PublicLayout,
navigation.ts/config, guards002/003, package.json y evidencia003.
Investigación delegada de disponibilidad/gates y composición/pruebas, sin ediciones de código.

## R1 — Página estática y reutilización

**Decisión**: Astro/TS actuales, PublicLayout pageId=app/contentLayout=full y CSS de 004.
**Motivo**: página informativa sin datos dinámicos/operaciones;001 ya ofrece CTA#descarga,
menú, hashchange/load y foco del encabezado de destino.002 incorporó layout full.
**Alternativas**: SPA, nuevo layout o script propio de fragmentos duplican comportamiento sin necesidad.

## R2 — Disponibilidad independiente

**Decisión**: config local de dos plataformas y resolver puro. Solo verificado+URL HTTPS
válida+evidencia ligada a URL/plataforma produce enlace. Todo otro caso produce Próximamente.
Una candidata pendiente puede conservarse en config interna, pero nunca se serializa al HTML.
**Motivo**: A06 exige cuatro combinaciones; un booleano global activaría plataformas indebidas.
**Alternativas**: URL desde variable de entorno sin evidencia, CMS/API, inferencia por mockup o
consulta automática a tiendas añaden riesgo/proveedor sin requisito. No fijar dominios de tiendas.

## R3 — Verificar sin prometer vigilancia

**Decisión**: comprobar formato con parser URL y verificación humana documentada de oficialidad,
correspondencia con Priva App/plataforma y accesibilidad del destino. HTTPS absoluta sin
credenciales; permitir componentes legítimos de URL (p.ej.query de identificación) solo como
parte exacta del destino revisado. No aceptar javascript/data, rutas relativas ni#.
Cambiar URL o retirar evidencia revoca enlace efectivo. No fijar vencimiento automático arbitrario.
**Motivo**: sintaxis válida no prueba titularidad ni disponibilidad. No se conoce proveedor/tienda.
**Alternativas**: permitir cualquierURL válida como oficial, hardcodear dominios supuestos,
strip de query o monitorización continua contradicen evidencia/alcance o podrían romper destinos.

## R4 — Pendiente válido frente a declaración contradictoria

**Decisión**: render defensivo siempre degrada URL inválida/no verificada a pendiente; gate permite
pendiente explícito con URL ausente/candidata no usada. Si config afirma verificado pero falla
sintaxis o vinculación de revisión, guard rechaza esa declaración inconsistente antes de publicar;
corregir config a pendiente permite entregar sin inventarURL. La prueba del resolver verifica
fallback incluso ante datos inválidos; la del gate verifica autoría consistente.
**Motivo**: no heredar de 003 la regla que bloquea página por falta deInstagram obligatorio.
En004 Próximamente es comportamiento final válido; aprobación editorial y activos siguen exigidos.
**Alternativas**: bloquear cualquierURL ausente, habilitar la declaración sin comprobarla o
ocultar todo el bloque eliminan estados aprobados o introducen disponibilidad falsa.

## R5 — Copy y mockups

**Decisión**: contenido separado con revisión ligada a texto exacto; inventario de hero,
teléfono Conversar, mockup de descarga y marca con alternativas/dimensiones/referencia.
La revisión del mockup declara combinaciones efectivas compatibles; preferir recurso oficial
neutral compatible con las cuatro. Si variante no coincide, bloquear publicación del bloque/página
hasta recurso y revisión coherentes, conservando composición. No inventar imágenes finales.
**Motivo**: una imagen con Listo para descargar puede contradecir controles pendientes.
Conversar no tiene control superpuesto ni envoltorio clicable; alternativa explica representación.
**Alternativas**: mantener promesa literal delPDF, esconder imagen, activar un chat de demostración
o reinterpretar revisión de copy como aprobación de imagen incumplen fuentes/constitución.

## R6 — Publicación y privacidad

**Decisión**: gateNode previo al build y assert en app.astro, patrón002/003 adaptado a004.
Rechazar testOnly, recursos no oficiales/inexistentes/fuera de public (incluido symlink), revisiones
pendientes/desactualizadas, texto A07 alterado o mockup incompatible. Sin red en guard/render.
Enlaces externos nativos en la misma pestaña, sin atributo download, prefetch, SDK o analítica.
**Motivo**: enlace a destino no acredita instalación; no introducir requests o datos de visitante.
**Alternativas**: demo público/bypass, descarga ficticia, píxel o éxito de instalación carecen de alcance.

## R7 — Banco y evidencia

**Decisión**: namespace app, puerto 4325, .test-output/app, app-cache, app-artifacts y reportes por
modo. Rutas solo de fixture para cuatro combinaciones y Contacto; destinosHTTPS de dominio.test
interceptados por Playwright, sin salida real a tiendas. Ningún relleno en src.
Pruebas unitarias significativas, Playwright/axe, matriz14 para pendiente y comprobación de las
cuatro combinaciones también a360/1440 con texto200%; sinJS confirma enlaces/estados estáticos.
**Motivo**:0014322/0024323/0034324 ya ocupan bancos separados;003 mostró conflictos al ejecutar
dos suites propias simultáneas. No ejecutar procesos del bancoapp simultáneamente en mismo puerto.
**Alternativas**: compartir outputs o duplicarUI de fixture hace evidencia ambigua.
**Límites**:003 confirmó Firefox no arranca (Could not find profile folder) y WebKit carece
bibliotecas. Reintentar cuando proceda y registrar fallo/bloqueo, sin afirmar cobertura por descarga.

Sin NEEDS CLARIFICATION técnico propio sin tratamiento. P01/P03/P04 y Contacto real siguen
pendientes de aceptación afectada; ninguna URL debe inventarse para completar investigación.
