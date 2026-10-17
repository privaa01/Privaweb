import type { BrowserContext,Page } from '@playwright/test';
export async function interceptAppDownloads(target:BrowserContext|Page){
 await target.route('https://downloads.priva.test/**',route=>route.fulfill({contentType:'text/html',body:`<!doctype html><html lang="es"><title>Destino de prueba</title><h1>Destino de prueba ${new URL(route.request().url()).pathname}</h1><p>No es una descarga oficial ni una instalación.</p></html>`}));
}
