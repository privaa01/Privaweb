export interface StoryManagementReadiness {
  testOnly: boolean;
  references: {
    storage: string | null;
    mediaIsolation: string | null;
    publicProxy: string | null;
    initialMaterials: string | null;
    editorialReview: string | null;
    privacyRetention: string | null;
    contactIntegration: string | null;
    manualAccessibility: string | null;
    deliveryEvidence: string | null;
  };
}
export const storyManagementReadiness: StoryManagementReadiness = {
  testOnly: false,
  references: {
    storage: null,
    mediaIsolation: null,
    publicProxy: null,
    initialMaterials: null,
    editorialReview: null,
    privacyRetention: null,
    contactIntegration: null,
    manualAccessibility: null,
    deliveryEvidence: null,
  },
};
export function storyManagementIssues(v: StoryManagementReadiness) {
  const issues = Object.entries(v.references)
    .filter(([, value]) => !value?.trim())
    .map(([key]) => key + ": calificación pendiente");
  if (v.testOnly) issues.push("fixture no publicable");
  return issues;
}
