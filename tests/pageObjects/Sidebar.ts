import { Page, expect } from '@playwright/test';

export class Sidebar {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private async openSidebarSection(label: string) {
    const button = this.page.getByRole('button', { name: label, exact: true });
    await expect(button).toBeVisible();
    await button.click();

    // Sidebar panel: stable selector
    const sidebarPanel = this.page.locator('aside').locator('div:visible');
    await expect(sidebarPanel.first()).toBeVisible();
  }

  async accessAssistants() {
    await this.openSidebarSection('Assistants');
  }

  async accessHistory() {
    await this.openSidebarSection('Chat History');
  }

  async accessDiscoverNesGPT() {
    await this.openSidebarSection('Discover NesGPT');
  }

  async accessSettings() {
    await this.openSidebarSection('Settings');
  }

  async accessPromptLibrary() {
    await this.openSidebarSection('Prompt Library');
  }

  async clickFirstElementVisible(selector: string) {
    const elements = this.page.locator(selector);
    const count = await elements.count();
    for (let i = 0; i < count; i++) {
      if (await elements.nth(i).isVisible()) {
        await elements.nth(i).click();
        break;
      }
    }
  }
}
