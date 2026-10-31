import config from './playwright.stories.real.config.ts';
const baseURL=process.env.PRIVA_INTEGRATION_BASE_URL;
if(!baseURL)throw Error('Falta URL real de la demo de Historias; no se usarán fixtures.');
export default {...config,testMatch:'**/stories-demo.spec.ts',timeout:90000,workers:2,
 outputDir:'.test-output/stories-demo-artifacts',
 reporter:[['list'],['json',{outputFile:'.test-output/stories-demo-results.json'}]] as typeof config.reporter,
 use:{...config.use,baseURL,trace:'off',video:'off',screenshot:'off'},
};
