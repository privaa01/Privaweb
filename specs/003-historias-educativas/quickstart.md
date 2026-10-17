# Guía de validación — 003

Fecha: 2026-10-16. Documento de ejecución futura, no resultados de pruebas.

## Prerrequisitos

Desde raíz del repo: Node>=22.22 (actual24.19.0), npm y Python3; npm ci usa lock actual.
Chromium del sistema disponible; Playwright Firefox/WebKit requieren resolver sus fallos de
perfil/bibliotecas documentados en002 antes de declarar cobertura. No desactivar protecciones.
Para contrato, datos/imagenes/audio reproducibles de prueba explícitos; nunca materiales finales.
Para integración, catálogo007 real, URL oficial compartida, recursos y revisiones aprobadas,
páginas reales de destinos y hosting que soporte medios/seeking y estados vigentes.

## Comandos actuales

```bash
cd /workspace/Privaweb
npm ci
npm run check:contract
npm run check:home:contract
```

Los bancos001/002 no prueban003. El build de entrega actual sigue bloqueado por páginas
faltantes y gate editorialInicio; no eliminar esas comprobaciones para ejecutar003.

## Comandos previstos tras implementación

Estos scripts/archivos todavía no existen; crearlos en tasks/implement, no ejecutar ahora como evidencia.

```bash
node --experimental-strip-types --test tests/stories-contract.test.ts tests/stories-publication.test.ts
npm run check:stories:contract
npm run build:stories:contract
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:stories:contract -- --project=chromium
npm run test:e2e:stories:contract -- --project=firefox --project=webkit
```

Configurar Playwright stories: puerto4324, salida `.test-output/stories`, cache `.test-output/stories-cache`, artefactos `.test-output/stories-artifacts`,
reporte `.test-output/stories-results.json`. El servidor del banco debe soportar archivos de
medios y Range para probar avance real; usar respuesta/intercepción de catálogo controlada
sin duplicar componentes. No tocar puertos/salidas de los otros bancos.

## Escenarios contractuales

1. Catálogo de prueba: tres iniciales+una nueva elegible. Ver todas revela4 sin duplicar;
   validar vacío, fallo de red, esquema/IDs inválidos, respuesta tardía y reintento.
   Probar rechazo de registro privado, sin confundirlo con filtrado servidor real.
2. Tres archivos reproducibles de prueba: play, pause, seek y duración real; acceso fallido,
   decodificación fallida y transcripción legible; ausencia de autoplay y números fijos.
3. Cada una de9 opciones: riesgo/prevención correctos para fixture, cambio inmediato y anuncio;
   independencia, recarga y restauración bfcache sin selección/feedback persistido.
4. Observar requests/storage/cookies antes/después: catálogo/medios permitidos, ninguna petición
   ni almacenamiento de selección. Foco permanece en control; no puntuación ni comentarios.
5. Matriz14 casos de viewport/texto, teclados, axe/contraste, imágenes fallidas y enlaces.
   Con JS deshabilitado hay mensaje honesto, contenidos estáticos y enlaces utilizables.
6. Gate: recurso/URL/revisión ausentes, URL peligrosa, IDs duplicados y testOnly rechazan;
   configuración de prueba no pasa guard de producción. Sin fallback estático.
7. Regresión001/002 tras cambios compartidos; guard de build/entrada mantiene bloqueos reales.

## Aceptación integrada (solo tras resolver dependencias)

```bash
PRIVA_INTEGRATION_BASE_URL=https://entorno-real-verificado.example npm run test:e2e:stories:integration
npm run build
```

La URL anterior ilustra una variable y debe reemplazarse por entorno real; no es destino del producto.
Suite sin variable debe fallar con bloqueo explícito, no pasar por omisión. Ejecutar publicación,
desactivación, reactivación y edición en007 con datos de prueba autorizados: nueva lectura excluye
borrador/inactiva, preservaIDs, no revela datos privados; verificar recursos/origen/cachés.
Comprobar archivos finales, transcripciones equivalentes y las9 explicaciones con respaldo.
Saber más llega a Inicio real; Instagram coincide con005. Revisión visual PDF2 con activos finales,
lector de pantalla y navegadores disponibles son evidencias separadas de fixtures.

Registrar por criterio fecha local, navegador, entorno, resultado y ruta de evidencia.
Recursos, backend, navegador o destino faltantes se registran bloqueados, nunca aprobados.
No emitir aceptación integral por pasar banco o por existir contrato/documentación.
