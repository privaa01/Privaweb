import config from './playwright.app.config';
export default {...config,testMatch:'**/app-real.spec.ts',webServer:undefined,
 outputDir:'.test-output/app-real-artifacts',
 reporter:[['list'],['json',{outputFile:'.test-output/app-real-results.json'}]] as typeof config.reporter,
 use:{...config.use,baseURL:process.env.PRIVA_INTEGRATION_BASE_URL??'http://127.0.0.1:4321'},
 projects:config.projects!.map(project=>({...project,...(project.name==='chromium'?{}:{grepInvert:/real matrix/})})),
};
