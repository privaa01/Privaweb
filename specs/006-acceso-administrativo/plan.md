# Implementation Plan: Acceso individual y sesiones administrativas

**Rama real**: `main` | **Fecha**: 2026-10-19 | **Spec**: [spec.md](spec.md)
**Feature activa**: `006-acceso-administrativo`; la selección SDD no crea una rama Git.
**Estado**: diseño de fases 0/1; sin código ni pruebas de aplicación de 006.
**Input**: AD01/AD02, C26, capturas administrativas y constitución 1.0.0.
Clarificación previa: no se encontraron preguntas funcionales críticas; políticas técnicas para este plan.

## Summary

Construir acceso por correo/contraseña, panel privado con permisos iguales, cierre y recuperación
verificada. Astro sigue estático. Compilar componentes de administración con un root independiente,
fuera de public/dist, y servir HTML privado solo después de autorización Node. El HTML de panel no
incluye identidad ni consultas; estas se obtienen por peticiones autorizadas. No convertir un
placeholder de navegación 001 en prueba de autenticación ni construir editores/bandeja 007/008.

Añadir servicio Node para `/admin/*` y `/api/admin/*`, tras proxy del mismo origen HTTPS que el sitio.
Reutilizar patrones de 005 (runtime privado, transacciones, errores mínimos), conservando su receptor
público independiente. No publicar una ruta de lectura de Contacto para probar autenticación.
SQLite real sirve como referencia local; no selecciona proveedor de identidad, datos o correo productivo.

Decisiones de seguridad: contraseñas 15–128 puntos de código, scrypt asíncrono; sesiones opacas
revocables con 30 minutos de inactividad/8 horas absolutas; recuperación de 15 minutos, consumo
atómico y revocación de sesiones. Provisión solo por proceso restringido del operador, sin alta web,
rol adicional ni contraseña de demostración. Valores técnicos derivados, no nuevos requisitos de producto.

## Technical Context

**Language/Version**: TypeScript 5.9.3 estricto; Node 24.19.0/nativos crypto/http/sqlite/fs; Astro 7.4.0.
Node 24 es prerrequisito del servicio; conservar el requisito existente del frontend.
**Primary Dependencies**: dependencias actuales del lock: Astro, @astrojs/check 0.9.10,
Playwright 1.64.1, axe 4.14.0, @types/node 24.19.2. No paquetes nuevos previstos ni SDK de proveedor elegido.
**Storage**: SQLite de archivo real, WAL/FK/synchronous=FULL/busy_timeout=5000 verificados por conexión,
transacciones BEGIN IMMEDIATE y SQL parametrizado; directorio 0700, archivos/clave/WAL/SHM 0600,
fuera de todos los roots estáticos, Git y artefactos. node:sqlite es experimental; referencia, no calificación P02.
**Testing**: node:test con archivos/procesos reales y reloj inyectable; UI mock explícita, browser+servicio
real local y adaptación a proveedor/buzón reales por separado. Leer DB solo desde proceso privado de prueba.
**Target Platform**: frontend público estático + servicio de administración Node tras proxy HTTPS same-origin.
UI sintética 4328; servicio real de prueba 4329. No usar puertos/cachés/bases de 001–005.
**Project Type**: módulo de acceso administrativo y autorización compartida, sin roles ni pantallas de gestión de cuentas.
**Performance Goals**: scrypt máximo 2 trabajos concurrentes y 8 en espera; solicitudes JSON <=8 KiB,
timeout de cliente 10 s y petición servidor 30 s. Medir coste/capacidad y temporización antes de producción;
no inventar TPS/SLA ni rebajar coste de hash en silencio. Detalles verificables en contratos.
**Constraints**: no éxito optimista, secretos fuera del cliente, no almacenamiento web de credenciales;
CSRF/origen/cookies/no-store y autorización transaccional; 7 anchos × texto 100/200%, controles ~44 px,
contraste 4.5:1/3:1. No correo enviado a terceros durante planificación.
**Scale/Scope**: dos requisitos originales, cuatro historias/23 escenarios, dos cuentas sintéticas para
comparar permisos. Volumen real, disponibilidad de hosting y políticas de cuentas no se presumen.

## Constitution Check

| Reglas | Antes de investigación | Después del diseño |
|---|---|---|
| CONST-01–03 | AD01/AD02/C26 y capturas gobiernan alcance | Un permiso, correo/contraseña, sin registro, MFA, roles o editor/bandeja añadidos |
| CONST-04 | IDs originales preservados; catálogo histórico ausente | Escenarios/SC se enlazan a contratos y validaciones; tareas vendrán después |
| CONST-05 | Datos de administración no heredan 90 días de Contacto | Contadores efímeros acotados; claves/comprobantes protegidos; políticas productivas 009/P02 pendientes |
| CONST-06 | Sesión/autorización real por operación y correo verificado | Guards antes de HTML, transacción de autorización/cambio, hash seguro, reset atómico, no lecturas públicas |
| CONST-07 | Panel no inventa registros ni contadores | Identidad real autorizada; módulos 007/008 pendientes identificados, sin filas de demo |
| CONST-08–09 | Capturas/recursos y mensajes deben revisarse | Adaptar Usuario→Correo y Contacto privado; fixtures aislados, recuperación sin promesas de entrega |
| CONST-10–12 | Diseño no acredita implementación ni operación | Tres capas de evidencia; P02/009/010/011 y navegadores como bloqueos explícitos |

Revisión previa y posterior: conforme para diseñar y ejecutar trabajo independiente, sin excepciones.
No se autoriza producción por escribir referencias de aprobación, crear cuentas sintéticas o entregar
un correo al adaptador local. P02 y aviso/recursos siguen bloqueando su aceptación final.

## Project Structure

### Documentación

```text
specs/006-acceso-administrativo/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── contracts/admin-access.md
├── quickstart.md
└── checklists/requirements.md
```

No generar tasks.md ni código mediante este comando.

### Código previsto, no creado

```text
src/components/admin/{AdminLogin,AdminRecovery,AdminReset,AdminShell,AdminNavigation}.astro
src/content/admin.ts
src/config/admin.ts
src/lib/{admin-contract,admin-validation,admin-publication}.ts
src/scripts/{admin-login,admin-session,admin-recovery,admin-reset}.ts
src/styles/admin.css
server/admin/
├── tsconfig.json
├── start.ts
├── http.ts
├── runtime.ts
├── service.ts
├── password.ts
├── password-denylist.txt
├── sessions.ts
├── recovery.ts
├── mail-worker.ts
├── repository.ts
├── sqlite-repository.ts
├── provision.ts
└── views/
    ├── astro.config.mjs
    ├── tsconfig.json
    └── src/pages/{login,recuperar,restablecer,panel,historias,contacto}.astro
scripts/require-admin-publication.mjs
playwright.admin.config.ts
playwright.admin.service.config.ts
tests/admin-{validation,password,publication,session,recovery,repository,http}.test.ts
tests/fixtures/admin/{astro.config.mjs,tsconfig.json,src/content.ts,src/pages/,public/}
tests/fixtures/admin-service/{serve,writer,mail-double}.ts
tests/e2e/admin-{access,session,recovery,accessibility,service,integration}.spec.ts
```

**Structure Decision**: root Astro independiente `server/admin/views` con base `/admin/` y salida
`.private-build/admin` ignorada. No crear src/pages/admin/panel.astro ni datos privados en dist.
Node resuelve una tabla exacta de rutas a plantillas: público login/recuperar/restablecer; privado
panel/historias/contacto. Solo assets compilados permitidos se sirven sin autenticación. Denegar
alias .html privados, traversal y acceso directo a .private-build. En público, `/admin/login`
conserva el contrato de 001 aunque el fichero interno sea login.html.

Entrada separada `server/admin/start.ts`, origen configurado y proxy reservado `/admin`/`/api/admin`;
no introducir fallback que atienda estas rutas desde hosting estático. `server/contact/start.ts` y su
contrato siguen independientes. En integración SQLite las tablas admin_* pueden compartir archivo
privado con 005; futuras operaciones 007/008 deben recibir el mismo contexto transaccional autorizado,
no verificar sesión en una conexión y escribir en otra sin coordinación equivalente demostrada.

## Phase 0 — Investigación

[research.md](research.md) consolida investigación delegada de sesiones/hash y recuperación/correo,
lectura de 005, spec/constitución y patrones de fixtures. No se ejecutó benchmark ni prueba de 006.
La disponibilidad del runtime se conoce del entorno y 005, no certifica criptografía o rendimiento de 006.

## Phase 1 — Diseño

[data-model.md](data-model.md) fija entidades, límites y transiciones.
[contracts/admin-access.md](contracts/admin-access.md) define rutas, seguridad, políticas y transacciones.
[quickstart.md](quickstart.md) distingue comandos futuros y pruebas de UI, SQLite local y operación real.
Las decisiones técnicas propias quedan definidas. Proveedor/remitente/responsable y políticas P02/009
siguen siendo requisitos operativos externos, no incertidumbres ocultas ni autorización para inventarlos.

## Estrategia posterior

1. Fixture/tipos/config y pruebas negativas; validación y hash sin dependencias nuevas.
2. Runtime/repo privados, provisión restringida de cuentas sintéticas, cookies/CSRF y guard transaccional.
3. Login/panel/cierre, historial/varias pestañas, invalidación de identidad y respuestas viejas.
4. Recuperación con job cifrado, worker y doble de correo identificado; carreras y fallos antes/después de commit.
5. Browser compuesto con persistencia real y acceso privado de prueba; regresión de 001/005 afectada.
6. Gates de root build/servicio, recursos/matriz, calificación P02 y correo recibido en buzón controlado.

Mantener gates 001–005. Añadir guard de administración al build de entrega y compilar las vistas
privadas como segundo objetivo; bancos sintéticos usan scripts distintos sin aprobar publicación.
Los guards locales verifican configuración/referencias, no prueban el proveedor remoto. Identidad,
autorización, entrega y políticas se califican con evidencia real antes de abrir administración productiva.

## Complexity Tracking

Sin infracciones constitucionales. Root de vistas separado evita exponer HTML privado en dist;
sesiones persistidas permiten revocación; outbox cifrado separa temporización pública y proveedor.
Son mecanismos para los flujos aprobados, no nuevas funciones de panel o un sistema de marketing.

## Registro

2026-10-19 — `$speckit-plan 006`: fases 0/1 documentadas; AD01/AD02 intactos. Sin implementación,
pruebas de aplicación, benchmark, correos, creación de cuentas ni despliegue.
