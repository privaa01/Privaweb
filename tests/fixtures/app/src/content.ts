import { appContent } from '../../../../src/content/app.ts';
import type { DownloadConfig } from '../../../../src/lib/app-downloads.ts';
export const fixtureApp=structuredClone(appContent);
fixtureApp.testOnly=true;
for(const img of [fixtureApp.hero.image,fixtureApp.overview.image,fixtureApp.downloads.image,fixtureApp.brand]){
 img.src=`/images/app/test-${{hero:'hero',overview:'phone',download:'download',brand:'brand'}[img.block]}.svg`;img.width=640;img.height=480;img.alt=img.block==='overview'?'Representación de prueba del prototipo; Conversar es parte de la imagen, sin acción web.':'Recurso sintético de prueba del prototipo';img.compatibleStates=['00','10','01','11'];
}
export function fixtureDownloads(mask:string):DownloadConfig[]{return(['android','iphone'] as const).map((platform,i)=>{
 const url=`https://downloads.priva.test/${platform}`;
 return{platform,status:mask[i]==='1'?'verificado':'pendiente',candidateURL:url,verification:mask[i]==='1'?{reviewedURL:url,platform,decisionReference:'TEST ONLY verification, not official',checkedAt:'2026-10-16',appIdentity:'Priva App',accessibleAtReview:true}:null};
});}
