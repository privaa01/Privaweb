# Recursos oficiales —001

**Actualizado**:2026-10-20 (America/Bogota). La usuaria identificó el logo y la referencia aprobados. Los archivos se recibieron desde GitHub en fast-forward a `cde01b0`, preservando trabajo local. T024 completada; no certifica fidelidad final o publicación del conjunto.

| Recurso | Fuente | Integración y verificación |
| --- | --- | --- |
| Logo oficial | `disenovisual/Link-PrivaHome.png` | PNG104×40RGBA copiado byte a byte a `public/brand/priva-logo.png`; hash idéntico. Header/footer mantienen proporción2.6, sin redibujar ni filtrar colores |
| Paleta | `disenovisual/referencias.txt` | VariablesCSS exactas de la referencia en global.css; verdes/neutrales aplicados a la estructura común |
| Tipografía | PlusJakartaSans, referencia de la usuaria | Variablesnormal/italic200–800 del repositorio oficialgoogle/fonts, alojadas en `public/fonts/`; licenciaOFL1.1 conservada; sin peticiones del visitante aGoogleFonts |

El logo oscuro tiene fondo blanco de soporte en el footer para conservar contraste sin alterar el PNG ni inventar una versión de marca. Dimensiones originales y dibujo intactos. BrandAsset admite ancho/alto opcionales para no deformar el wordmark y mantiene compatibilidad con recursos explícitos de pruebas.

GoogleFontsCSS devolvió403 en este entorno. Se obtuvieron los TTF originales yOFL porHTTPS desde google/fonts en raw.githubusercontent.com, con nombre de familia/variación verificados. No se desactivóTLS ni se añadieronSDKs. La conversión opcionalWOFF2 no estaba disponible; se sirven TTF originales sin modificar, no se añade dependencia para convertirlos. [Procedencia y hashes](official-assets.json).

Los proyectos de fixture públicos comparten únicamente brand/fonts oficiales mediante un hook de build; conservan sus propios materiales sintéticos y siguen fuera de dist de entrega. La prueba dedicada verifica carga real de fuente local, imagen104×40 y ausencia de tráfico externo. Esto no aprueba los textos o imágeneshero/identidad/cierre de002 ni los materiales de otras features.

Capturas oficiales390/1440 inspeccionadas: logo legible y proporcionado en header/footer, menú/CTA y texto sin corte observado. Falta revisión final contra wireframes y lector de pantalla (T026), además de integración/alojamiento. No se declara cierreG01/G04 productivo por incorporar los recursos.
