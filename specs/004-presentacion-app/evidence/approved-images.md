# Imágenes recibidas y aprobadas

La responsable indicó: «ya subi las imagenes, todas estan aprobadas enlazalas a donde corresponden». Se sincronizaron los archivos originales desde GitHub y se inspeccionaron visualmente y mediante sus cabeceras PNG.

- Archivo: `public/images/app/asistente-zyro.png`
- Dimensiones: 1024 × 1536 px
- SHA-256: `e408675e13081afeea83cc5b53e4c39e9e9817d3599bacde165b3867c54df60a`

El mockup de Zyro se conecta al hero «MANEJA TU PRIVACIDAD», la vista general del prototipo y el bloque de descarga. Se reutiliza el mismo original porque se recibió un solo recurso de App. El texto alternativo identifica expresamente un prototipo. La imagen no contiene enlaces a tiendas ni indica disponibilidad de descarga: es compatible con los cuatro estados de plataformas. El CSS existente conserva su proporción mediante altura automática y object-fit:contain.

Se reutilizan el logo oficial de 104 × 40 px y las referencias de fuente y paleta ya recibidas en `disenovisual/referencias.txt`. La aprobación registrada aquí corresponde a los recursos visuales; la revisión editorial y la calificación operativa conservan sus controles. No se publican páginas mediante fixtures ni se omiten los guards.

## Verificación

- `node --experimental-strip-types --test tests/app-publication.test.ts tests/contact-publication.test.ts`: 30 aprobadas, 0 fallidas/omitidas.
- `npm run check`: 94 archivos, 0 errores, 0 advertencias; 1 hint previo sobre returnValue en admin-inbox.
- Validadores sobre configuración real: 004 conserva solo revisión editorial pendiente; 005 conserva documentos/aviso, revisión editorial y operación productiva pendientes. Sin pendientes de imágenes, dimensiones, rutas ni referencias visuales en estas dos configuraciones.
- No se afirma build completo, revisión visual final de página ni despliegue público.
