# WebKit disponible para navegación001

Fecha: 2026-10-26 (America/Bogota). Base de código:9e85e15. Nuevo comando local: `npm run test:e2e:contract:webkit`.

## Solución del entorno

El bloqueo anterior no era una biblioteca inexistente: las dependencias Debian ya verificadas por009 estaban en `/workspace/.tools/webkit-libs/usr/lib/x86_64-linux-gnu`, pero libGLESv2 no figuraba en la caché del enlazador del host usada por la comprobación de Playwright. Sin sudo no se modificó la caché global.

`scripts/with-webkit-libraries.sh` genera una caché privada mediante `ldconfig -X` en un directorio temporal de `.test-output`. Ejecuta el comando recibido dentro de un namespace rootless de bwrap con raíz de solo lectura y vista privada de esa caché en `/etc/ld.so.cache`. Solo el repositorio y `/tmp` quedan escribibles para pruebas. La caché temporal se elimina al terminar. El archivo del host no se modifica; comprobado fuera del namespace, sigue sin registrar libGLESv2.

No se editaron ejecutables ni registros de Playwright, ni se omitió la verificación de dependencias. No se añadieron flags para desactivar sandbox o TLS. Las dependencias deben existir realmente: si faltan, el script falla con explicación. El entorno exterior restringe namespaces; se necesitó ejecución autorizada fuera de esa capa, manteniendo bwrap y las opciones del navegador.

## Verificación

- Lanzamiento real de WebKit: versión27.2.
- Primera ejecución con la configuración aislada:32casos aprobados.
- Ejecución final mediante el script reutilizable: **32aprobados,0fallidos/omitidos,14.3s**. Este es el resultado contabilizado; la prueba preliminar no se suma como otros32casos.
- Casos: marca/fuente/paleta oficiales, menú/activo, logo, CTA/anclas, footer, Contacto Seguro sin fragmento, teclado/foco/resize, navegación sin JS y fragmento repetido.
- Las14celdas exhaustivas de anchos/texto se excluyen por diseño de WebKit y permanecen acreditadas en Chromium. No se cuenta el motor nuevo como repetición de toda esa matriz.
- La build contractual se ejecutó como parte del webServer. `bash -n scripts/with-webkit-libraries.sh` pasa.

Comando y resultado en [webkit-2026-10-26.txt](webkit-2026-10-26.txt).

## Reproducción

En este entorno Linux, con las bibliotecas ya disponibles y permiso para namespaces:

```bash
npm run test:e2e:contract:webkit
```

El wrapper admite `PRIVA_WEBKIT_LIB_DIR` y `PLAYWRIGHT_BROWSERS_PATH`, y puede recibir otro comando de prueba:

```bash
bash scripts/with-webkit-libraries.sh npm run test:e2e:stories:contract -- --project=webkit
```

Ese ejemplo de Historias no se ejecutó aquí ni acredita otras specs. En Mac usar Playwright nativo con sus navegadores instalados; el wrapper está destinado a este entorno Linux.

## Estado de tareas

Queda resuelta la parte WebKit de T025/T026. No se marcan completas: sus criterios originales requieren aceptación final de cuatro páginas y dependen de T023. T023 todavía espera build de entrega aprobado y anclas finales; T027 necesita documentos/servicios reales y URL integrada; T028 depende de ese cierre. **23/28 tareas completas; las cinco restantes conservan dependencias externas, sin bloqueo de WebKit.**

La revisión manual de controles de Inicio ya fue confirmada por la usuaria y no se vuelve a solicitar. Se conservan aparte la revisión de las cuatro páginas finales y los recorridos integrados. El guard010/009 sigue con salida1 por operación/revisiones pendientes; ver dependencies-2026-10-26.txt. No se cambiaron contenido de otras features ni evidencia productiva para superar ese guard.

Sin commit, push ni despliegue en esta fase.
