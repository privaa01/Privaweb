# Investigación — 005

Fecha 2026-10-17. Fuentes: spec005/constitución/R35, componentes001–004, configsocial,
Astroestático, package.json y specs006/008/009/010. Investigación delegada de servicio/persistencia
y formulario/privacidad, con revisión adicional de tokens/borrado. Sin edición de código.

## R1 — Reutilización y receptor separado

**Decisión**: Astro/TS y layout existentes; Node HTTP separado detrás de rutas same-origin.
**Motivo**: guardar no cabe en un build estático. No hay backend/proveedor declarado que pueda
asumirse; un adaptador SQLite nativo permite verificar lógica/durabilidad local sin inventarlo.
node:sqlite DatabaseSync disponible enNode 24.19.0; SQLite3.53.3 observado en base en memoria.
**Alternativas**: formularioSaaS/proveedor elegido sin datos, servidor simulado o convertir todo
Astro a SSR introduce dependencias/operación no aprobadas o no guarda realmente.
**Límite**: SQLite es referencia local experimental; producciónP02 necesita calificación de
persistencia, acceso, transporte, copias y concurrencia. No afirmar que ya existe hosting.

## R2 — Validación compartida

**Decisión**: trim() de extremos y contar puntos de código con Array.from, sin normalización
Unicode ni truncamiento; conservar espacios internos. Mismo módulo en browser/servidor.
Correo: trim,1–254puntos de código como cota sintáctica convencional, un@, partes no vacías,
dominio con al menos un punto; regex Unicode `^[^\s@<>]+@[^\s@<>.]+(?:\.[^\s@<>.]+)+$`,
sin controlesU+0000–001F/U+007F. Regla pragmática de formato, no certificaciónRFC o del buzón;
no DNS, verificación de identidad, lowercasing ni transformación de dirección.
**Motivo**: maxlength nativo mideUTF16 y puede discrepar con servidor paraemoji. novalidate
permite feedback propio coherente, conservando labels/required/type=email como semántica.
**Alternativas**: bytes/UTF16/graphemes distintos entre capas, filtros de nombre legal o
librería de validación externa añaden incoherencia o requisitos innecesarios.
**Pruebas**:0/1/60/61 y0/1/1500/1501, tildes/emoji/combinantes, blancos/formato/correos habituales.
Un combinante separado cuenta otro punto; no afirmar que todos los grafemas visibles cuentan uno.

## R3 — OpciónA y certeza

**Decisión**: snapshot+intento inmutables en submitting/unknown; botónReintentar reutiliza ambos.
Otra consulta muestra advertencia explícita antes de crear generación nueva; no la llama cancelar.
Generación/contador local descarta toda respuesta antigua. Abort/timeout no cancela servidor.
**Motivo**: es la opción A elegida; evita aplicar un acuse a datos editados o perder consulta ya guardada.
**Alternativas**: editar el mismo intento, limpiar antes de confirmación o considerar todoHTTP200
éxito contradice aclaración yC06. Solo rechazo terminal comprobado permite editar/reintentar con
un intento nuevo conservando valores; incertidumbre no se convierte en fallo confirmado.

## R4 — Persistencia atómica

**Decisión**: ContactRepository con transacción serializable; referenciaSQLite usa BEGIN IMMEDIATE,
UNIQUEtokenDigest, FK, SQL parametrizado, WAL, synchronous=FULL y busy_timeout=5000 ms. Consulta+comprobante se
confirman juntos. Acuse únicamente trasCOMMIT. Contención/error ambiguo devuelveunknown.
Comparar valores normalizados contra consulta privada dentro de transacción, sin huella de
correo/mensaje adicional. Mismo token/contenido: replay; contenido distinto:409 sin detalles.
**Motivo**: dobleclick/concurrencia no se resuelve solo deshabilitando botón. Dos tokens distintos
permiten dos consultas deliberadas de igual contenido. Reintento/lectura no amplía última actividad.
**Alternativas**: memoria, JSONappend, deduplicación por correo/texto o dos escrituras sin transacción
no garantizan durabilidad/atomicidad o descartan consultas legítimas. WAL con synchronous=NORMAL
puede perder commits ante un corte de energía; exigir FULL y comprobar la configuración efectiva,
sin atribuir a una prueba de reinicio garantías físicas del disco o del proveedor.

## R5 — Ciclo de intentos y borrado

**Decisión**: antes del primerPOST con datos, emitir token firmadoHMAC con id aleatorio256bits,
issuedAt/expiresAt24h, sin PII ni fila de consulta. HMAC/DB fuera de public, secretos nunca al cliente.
Ledger conserva SHA256(token completo), id/expiración y resultado; no token crudo ni hash del mensaje.
Un COMMITTED conocido se verifica por digest del bearer exacto y datos privados originales;
esa prueba no depende de conservar una claveHMAC vieja para replay, incluso tras expiración.
Nueva inserción sin ledger requiere firma válida+no expirado; keyrotation no autoriza firmas inválidas.
**Motivo**: borrar consulta+ledger sin límite verificable permitiría recrearla con un intento antiguo.
**Alternativas**: UUID sin vigencia con borrado total del comprobante deja replay inseguro;
comprobantes/huellas de contenido eternos contradicen minimización; exigir24h incluso al replay
impediría recuperar confirmación mientras la consulta todavía existe.

Borrado coordinado con 009: quitar datos y asociación, pasar ledger aREVOKED solo con digest/id/
expiresAt hasta expiración; después purgar. Token viejo expirado sin ledger no inserta. Si aún
vigente pero revocado tampoco. REJECTED es terminal análogo sin PII: tras corregir, pedir otrotoken.
Para afirmar not_stored, rechazo/consulta se serializan en misma transacción; si no se puede
confirmar el terminal, responderunknown. Un rollback por sí solo no prueba que otra petición
concurrente del mismo intento no se guardó. Revocar/expirar nunca devuelveacuse de dato borrado.
**Límite**: política productiva de ese metadato opaco y restauración/conservación009 se revisaP02;
no afirmar borrado de respaldos ni completar última actividad por decisión de este plan.

## R6 — Protección de recepción

**Decisión**: soloPOSTJSON, Origin exacto configurado, sin CORS amplio/cookies, API no-store,
body32KiB y solicitudes acotadas; no URLs con campos/token. No lecturas públicas ni secretos en
HTML; path/permisos del DB y claves verificados. HTTPS externo y proxy confiable son condición
operativa; HTTP solo loopback de pruebas sintéticas. No logs depayloads ni errores internos al público.
**Motivo**: recepción anónima no autoriza acceso privado. CSRF/Origin no se presentan como
identidad ni sustituto de autorización006/008. SQLite dentro del build expondría datos.
**Alternativas**: GET con contenido, API de lectura de prueba, llave secreta enJS, captcha externo
no revisado o éxito al encolar sin demostrar consulta persistida incumplen alcance/privacidad.

## R7 — Gates y prueba por capas

**Decisión**: guard de entrega para recursos/copy/Instagram/aviso/canal/Manifiesto y calificación
operativa. ReclamosCero rastreo/Sin cookies requieren evidencia específica de configuración real;
sin evidencia no renderizar esos reclamos, sin sustituirlos por promesas nuevas. Gate no hace red.
Banco de UI4326 conAPI interceptada; SQLite/servicio reales conNodeTests y banco compuesto4327;
integraciónproductiva exige baseURL real sin fallback a ninguno. Misma lógica en todos, nunca
activar inyección de fallos con header/query pública. Datos y tokens reales de usuarios no se usan
en evidencias; solo sintéticos. Salidas/cachés/trazas separados de001–004 y por modo.
**Motivo**: mocks no acreditanCOMMIT, UI puede probarse antes deP02 y el servicio local puede
probarse sin bandeja 008. Alias/correo/mensaje en trazas de usuarios serían exposición innecesaria.
**Límites**: Firefox yWebKit fallaron al arrancar en004; lector/fidelidad/aviso/canal requieren
verificación real. No presentar descarga de binarios o colección de tests como cobertura.

Sin NEEDS CLARIFICATION técnico propio sin tratamiento; proveedor/despliegue/canal/aviso y
política009 son dependencias de entrega explícitas. La capacidadSQLite no prueba la aplicación.
