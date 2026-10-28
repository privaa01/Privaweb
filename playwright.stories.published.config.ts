import config from './playwright.stories.local.config';
export default {...config,testMatch:'**/stories-published.spec.ts',outputDir:'.test-output/stories-published-artifacts',
 reporter:[['list'],['json',{outputFile:'.test-output/stories-published-results.json'}]] as typeof config.reporter};
