import type { DownloadConfig } from '../lib/app-downloads.ts';
const androidApk='https://drive.google.com/file/d/1Crd6L7wD8kOm8En6LLmdcwGRaJRk1V3V/view?usp=drive_link';
export const appDownloadConfig:DownloadConfig[]=[
 {platform:'android',status:'verificado',candidateURL:androidApk,verification:{reviewedURL:androidApk,platform:'android',decisionReference:'APK de Priva aprobado por la responsable el 2026-11-10',checkedAt:'2026-11-10',appIdentity:'Priva App',accessibleAtReview:true}},
 // iPhone is retained only as a non-public compatibility state for the resolver.
 // The product is currently distributed exclusively for Android.
 {platform:'iphone',status:'pendiente',candidateURL:null,verification:null},
];
