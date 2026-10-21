# Integración —001

**Actualización**:2026-10-20 (America/Bogota). Contrato recibido; aceptación de entorno real pendiente.

- Páginas `src/pages/index.astro`, `historias.astro`, `app.astro`, `contacto.astro` existen y usan PublicLayout/pageId correcto. Los destinos de casos/descarga/escribir existen en sus componentes responsables. Leer código no acredita dist o rutas en un alojamiento.
-006 C1/C2/C3 ya aporta documentos/login y estado de sesión. Inventario consumidor versionado en `tests/helpers/navigation-private-contract.ts`; no quedan endpoints privados indefinidos para el alcance de entradaG05.
- `npm run test:navigation:service`: dos casos pasan con handler006/SQLite reales y templates sintéticos: doce combinaciones GET/HEAD por tres rutas y cookie ausente/inválida→401JSON/HEADvacío, más lecturas de sesión401/403. No se enviaron correos, crearon cuentas o trataron datos reales. No acredita login visual oficial ni producción.
- `tests/e2e/navigation-integration.spec.ts` preparado para destinos públicos reales, documentos sin borradores/fixtures,16recorridos de footer, navegación/CTA y rechazos privados401/403. `--list` valida definición, no ejecución; el dominioexample.invalid solo se usó en listado sin solicitudes.
- `npm run test:e2e:integration`: exit1 explícito al faltar `PRIVA_INTEGRATION_BASE_URL`; cero casos integrados ejecutados.
- `npm run build`: exit1 por gate010/009 sin calificar. También siguen pendientes recursos/editorial de002–005; no se eliminan gates ni se compilan fixtures como dist.

T021 completa como preparación y verificación local de contrato. T023/T025–T028 mantienen cierre parcial/bloqueado; no se apruebaG05/G06 integrado ni se cuenta404 como autorización. Logs de reanudación en archivos resume-* de este directorio.

T024 completada tras aporte oficial de logo/fuente/paleta por la usuaria; no implica aprobar imágenes/textos de002–005 ni baseURL/operación009/010.
