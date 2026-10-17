export type PageId = 'inicio' | 'historias' | 'app' | 'contacto';
export interface PageDefinition { id: PageId; label: string; href: string; order: number }
export const pages = [
  { id: 'inicio', label: 'Inicio', href: '/index.html', order: 1 },
  { id: 'historias', label: 'Historias', href: '/historias.html', order: 2 },
  { id: 'app', label: 'Priva App', href: '/app.html', order: 3 },
  { id: 'contacto', label: 'Contáctanos', href: '/contacto.html', order: 4 },
] as const satisfies readonly PageDefinition[];
export const headerCtas: Record<PageId, { label: string; href: string; targetSection: string }> = {
  inicio: { label: 'PROTÉGETE HOY', href: '/historias.html#casos', targetSection: 'casos' },
  historias: { label: 'PROTÉGETE HOY', href: '#casos', targetSection: 'casos' },
  app: { label: 'DESCARGAR APP', href: '#descarga', targetSection: 'descarga' },
  contacto: { label: 'DESCARGAR APP', href: '/app.html#descarga', targetSection: 'descarga' },
};
export const footer = {
  tagline: 'Defendiendo la soberanía digital individual.',
  copyright: '© 2026 Priva. Todos los derechos reservados. Navega con dignidad.',
  links: [
    { label: 'panel administrador', href: '/admin/login' },
    { label: 'Términos de Servicio', href: '/terminos.html' },
    { label: 'Manifiesto de Datos', href: '/manifiesto-datos.html' },
    { label: 'Contacto Seguro', href: '/contacto.html#escribir' },
  ],
} as const;
export interface BrandAsset { src: string; alt: string }
