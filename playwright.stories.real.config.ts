import config from './playwright.stories.config.ts';
export default {...config,testMatch:'**/stories-real-accessibility.spec.ts',webServer:undefined,
 outputDir:'.test-output/stories-real-artifacts',
 reporter:[['list'],['json',{outputFile:'.test-output/stories-real-results.json'}]] as typeof config.reporter,
 use:{...config.use,baseURL:process.env.PRIVA_INTEGRATION_BASE_URL??'http://127.0.0.1:4321'},
};
