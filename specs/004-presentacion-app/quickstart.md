# Guía de validación — 004

Actualización2026-10-28.30/32 tareas; recursos/copy aprobados, guardApp pasa.53/53Node,9/9integración real y20/20render/adaptación. Revisión manual y build completo pendientes. [Evidencia vigente](evidence/review-2026-10-28.md).

## Prerrequisitos y comandos actuales

Desde /workspace/Privaweb, Node>=22.22 (actual24.19.0), npm yPython3; dependencias del lock actual.
No paquete/proveedor nuevo previsto. Chromium sistema disponible;Firefox/WebKit requieren
resolver o registrar problemas de arranque confirmados en evidencia003.

```bash
cd /workspace/Privaweb
npm ci
npm run check
```

El build completo continúa bloqueado por documentos/calificación009/010 y otros guards; Contacto, Inicio e Historias ya existen y tienen pruebas locales. No remover guards ni crear relleno.

## Comandos disponibles

Scripts/config implementados; ejecutar en el entorno configurado y conservar resultados por capa.

```bash
node --experimental-strip-types --test tests/app-downloads.test.ts tests/app-publication.test.ts
npm run check:app:contract
npm run build:app:contract
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:app:contract -- --project=chromium
npm run test:e2e:app:contract -- --project=firefox --project=webkit
```

Banco tests/fixtures/app, puerto 4325, salida.test-output/app, cache.test-output/app-cache,
artefactos.test-output/app-artifacts, reporte.test-output/app-results.json; reporte de integración
app-integration-results.json. Servir Pythonhttp.server como bancos editoriales, sin API/mediosRange.
No ejecutar dos procesos app simultáneos ni colisionar con bancos0014322/0024323/0034324.

## Escenarios independientes

1. Resolver/gate: negativos antes de implementación. URLs vacías/relativas/javascript/data/HTTP,
   credenciales, evidencia de otra URL/plataforma, retiro/cambio, revisión sin referencia/fecha o
   fecha futura nunca habilitan. Revisar diferencia entre pendiente válido y declarado verificado
   contradictorio. URL de forma válida no prueba oficialidad.
2. /app.html pendiente; /app-android.html solo Android; /app-iphone.html solo iPhone;
   /app-both.html ambas. Destinos `https://downloads.priva.test/android` y `https://downloads.priva.test/iphone`
   interceptados por Playwright con páginas rotuladas de prueba, sin navegación externa real
   ni excepciones del resolver para aceptar URL relativa/HTTP. Cada enlace llega al suyo, sin confirmación de instalación.
   URLs candidatas/rechazadas no aparecen en HTML y controlespendientes no reciben foco/acción.
3. Revisar3beneficios/4pasos/3funciones, prototipo visible y nota A07; mockupConversar sin roles/
   foco/clic. Imagen fallida mantiene texto/enlaces. Cero chat, diagnóstico, registro o lista de espera.
4. Hero#descarga/#como-funciona, header App y header Contacto del banco; directo/recarga con
   foco/título visible. Contacto fixture se identifica, no acredita005 real.
5. Matriz14 (escala aplicada antes de load/visita al fragmento) para caso pendiente y las cuatro combinaciones a360/1440text200%; axe, medidas de
   contraste/controles, teclado y sin overflow. Sin JS permanecen contenido, estados/enlaces y anclas; interceptar destinos HTTPS también
   en ese contexto para comprobar navegación sin depender de DNS o de una tienda real.
6. Gate rechaza fixture, recurso ausente/vacío/traversal/symlink fuera de public, copy cambiado
   tras revisión, nota alterada y mockup incompatible. Metadatos sintéticos positivos no aprueban
   material real. Ambas pendientes pasan cuando copy/activos/marca/revisión sí cumplen.
7. Vigilar requests/cookies/storage; nada de consultas a tienda o analítica. Regresión001 y
   suites002/003 si cambios compartidos/riesgo lo justifican. Confirmar guards de build/entrada.

## Integración y revisión final

Solo con entorno real, materiales y copy revisados; las plataformas pueden seguir pendientes.

```bash
PRIVA_INTEGRATION_BASE_URL=https://entorno-real-verificado.example npm run test:e2e:app:integration
npm run build
```

Reemplazar URL ilustrativa por entorno real; nunca usarla como destino del producto. Suite sin
variable falla como bloqueo explícito, no omisión aprobada. Comprobar rutaApp real, anclas y
CTA desde Contacto real (005); si falta005, registrar bloqueo del recorrido correspondiente.

Cuando exista enlace oficial, documentar URL exacta/plataforma/identidad/fecha/referencia de
comprobación y visitar destino, incluidos redireccionamientos. Probar publicación del cambio
sinhabilitar la otra plataforma; retiro vuelve a pendiente en HTML publicado. SinURLs no inventar
casos habilitados oficiales: pruebas mecánicas se hacen en banco y estado pendiente se acepta
si todo lo demás está comprobado. No probar instalación como función de esta web.

Revisión manual con lector de pantalla, teclado de controles, imágenes/alternativas y fidelidad
PDF3; sustituir promesas segúnC13/C14/C17/C23/C31. Fixtures y metadatos no aprueban copy o material.
Registrar cada criterio con fecha/navegador/entorno/resultado/evidencia; recursos/navegadores/
destinos ausentes se reportan bloqueados, sin afirmar lanzamiento, publicación o cobertura total.

## Validación de página real con copy aprobado

`PRIVA_CHROMIUM_EXECUTABLE="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node node_modules/@playwright/test/cli.js test --config playwright.app.real.config.ts --workers 1`: servidor local ya iniciado,14celdasChromium+6recorridosimagenfallida/sinJS en tres motores. [Aprobación y resultados](evidence/approval-2026-10-28.md).
