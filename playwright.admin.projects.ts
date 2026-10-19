import { devices } from "@playwright/test";
// Shared browser definitions without loading another feature's environment/config gates.
export const projects = [
  {
    name: "chromium",
    use: {
      ...devices["Desktop Chrome"],
      launchOptions: process.env.PRIVA_CHROMIUM_EXECUTABLE
        ? { executablePath: process.env.PRIVA_CHROMIUM_EXECUTABLE }
        : undefined,
    },
  },
  { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  { name: "webkit", use: { ...devices["Desktop Safari"] } },
];
