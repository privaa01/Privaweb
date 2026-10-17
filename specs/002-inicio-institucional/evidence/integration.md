# Integración y navegadores — 002

Sin PRIVA_INTEGRATION_BASE_URL real: la suite integrada termina con error explícito y
ninguna prueba integrada ejecutada, sin fallback a fixtures. Faltan 003 real y recursos/copy
revisado. Build de aplicación y publicación siguen bloqueados, no aprobados.

La descarga oficial de Firefox y WebKit pudo completarse en esta sesión, con reintentos
sobre mirrors oficiales y TLS. Firefox no inicia: “Could not find profile folder”; repetir con
TMPDIR escribible bajo workspace no lo resuelve. WebKit requiere libgtk-4, libgraphene,
libharfbuzz-icu, libmanette, libhyphen y libGLESv2 ausentes. apt-cache no pudo leer la configuración
administrada del sistema. No se desactivaron verificaciones o sandbox para forzar arranque.
Regresión de Firefox/WebKit: no ejecutada; no se contabiliza como pase por probar Chromium.
