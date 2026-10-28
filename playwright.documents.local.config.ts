import config from './playwright.app.config';
export default {...config,testMatch:'**/documents-local.spec.ts',webServer:undefined,
 outputDir:'.test-output/documents-local-artifacts',
 reporter:[['list'],['json',{outputFile:'.test-output/documents-local-results.json'}]] as typeof config.reporter,
 use:{...config.use,baseURL:process.env.PRIVA_INTEGRATION_BASE_URL??'http://127.0.0.1:4321'},
};
