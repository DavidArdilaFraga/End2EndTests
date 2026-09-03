import { Page, expect } from '@playwright/test';

export class PromptLibraryPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    // Assumes the sidebar already navigated to Prompt Library
    await expect(this.page.getByRole('link', { name: 'Playwright', exact: true })).toBeDefined();
  }

  async createNewPrompt(name: string, body: string, assistant = 'NesGPT', model = 'Basic (GPT-4.1 mini)') {
    await this.page.getByRole('button', { name: 'New prompt' }).click();
    await this.page.getByPlaceholder('Give a descriptive name for this prompt').fill(name);

    if (assistant !== 'NesGPT') {
      await this.page.getByText('NesGPT').click();
      await this.page.getByText(assistant).click();
    }

    if (model !== 'Basic (GPT-4.1 mini)') {
      await this.page.getByText('Basic (GPT-4.1 mini)').click();
      await this.page.getByText(model).click();
    }

    // Category and body
    await this.page.locator('#prompt-modal-form > div > div:nth-child(3) > div > div > div > div.css-1wy0on6 > div').click();
    await this.page.getByText('Playwright').nth(2).click();
    await this.page.locator('#prompt-library-markdown-editor > div > div._rootContentEditableWrapper_uazmk_1097.mdxeditor-root-contenteditable > div:nth-child(1) > div').fill(body);

    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async editPrompt(newTitle: string) {
    await this.page.title();
    // Minimal: assume already opened prompt edit modal
    await this.page.getByPlaceholder('Give a descriptive name for this prompt').fill(newTitle);
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async openCategory(name: string) {
    await this.page.getByRole('link', { name, exact: true }).click();
  }

  async editFirstPrompt(options: { newTitle?: string; assistant?: string; model?: string; category?: string; body?: string } = {}) {
    const { newTitle, assistant, model, category, body } = options;
    // Click the modify button of the first prompt card and choose Edit
    await this.page.getByTitle('Modify this prompt').first().click();
    await this.page.getByText('Edit', { exact: true }).click();

    if (newTitle) {
      await this.page.waitForTimeout(1000);
      await this.page.getByPlaceholder('Give a descriptive name for this prompt').fill(newTitle);
    }

    if (assistant && assistant !== 'NesGPT') {
      await this.page.locator('#prompt-modal-form > div > div:nth-child(2) > div:nth-child(1) > div > div > div.css-1wy0on6 > div').click();
      await this.page.getByText(assistant).click();
    }

    if (model && assistant === 'NesGPT') {
      await this.page.locator('#prompt-modal-form > div > div:nth-child(2) > div:nth-child(2) > div > div > div.css-1wy0on6 > div').click();
      await this.page.getByText(model).click();
    }

    if (category) {
      await this.page.locator('#prompt-modal-form > div > div:nth-child(3) > div > div > div > div.css-1wy0on6 > div').click();
      await this.page.getByText(category, { exact: true }).nth(1).click();
    }

    if (body) {
      await this.page.locator('#prompt-library-markdown-editor > div > div._rootContentEditableWrapper_uazmk_1097.mdxeditor-root-contenteditable > div:nth-child(1) > div').fill(body);
    }

    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async pinFirstPrompt() {
    await this.page.getByTitle('Modify this prompt').first().click();
    await this.page.getByText('Pin prompt').click();
  }

  async unpinFirstPrompt() {
    await this.page.getByTitle('Modify this prompt').first().click();
    await this.page.getByText('Unpin prompt').click();
  }

  async deleteFirstPrompt() {
    await this.page.getByTitle('Modify this prompt').first().click();
    await this.page.getByText('Delete').click();
    await this.page.getByTestId('accept-button').click();
  }
}
