import { expect, Page } from "@playwright/test";
//import { StatementSync } from "node:sqlite";

/**
 * Generic helper function to open a sidebar section by its label.
 *  - Waits for the button to be visible before clicking
 *  - Safe clicks the button
 *  - Waits for the sidebar panel to be visible after clicking
 */
async function openSidebarSection(page: Page, label: string) {
    const button = page.getByRole("button", { name: label, exact: true });

    // Wait for the button to appear before interacting
    await expect(button).toBeVisible();
    await button.click();

    // Sidebar panel: stable selector
    const sidebarPanel = page.locator("aside").locator("div:visible");

    // Wait for the sidebar panel to be visible
    await expect(sidebarPanel.first()).toBeVisible();

}

/* -------------------------------------------------------------------------- */
/*                    ✅ Sidebar functions — Clean and robust                 */
/* -------------------------------------------------------------------------- */

export const accessAssistants = async (page: Page) => {
    await openSidebarSection(page, "Assistants");
};

export const accessHistory = async (page: Page) => {
    await openSidebarSection(page, "Chat History");
};

export const accessDiscoverNesGPT = async (page: Page) => {
    await openSidebarSection(page, "Discover NesGPT");
};

export const accessSettings = async (page: Page) => {
    await openSidebarSection(page, "Settings");
};

export const accessPromptLibrary = async (page: Page) => {
    await openSidebarSection(page, "Prompt Library");
};