import config from './playwright.app.config';
const baseURL=process.env.PRIVA_INTEGRATION_BASE_URL;
if(!baseURL)throw Error('Falta PRIVA_INTEGRATION_BASE_URL real; no usar fixtures.');
export default {...config,testMatch:'**/app-real.spec.ts',webServer:undefined,
 outputDir:'.test-output/app-real-artifacts',
 reporter:[['list'],['json',{outputFile:'.test-output/app-real-results.json'}]] as typeof config.reporter,
 use:{...config.use,baseURL},
 projects:config.projects,
};
