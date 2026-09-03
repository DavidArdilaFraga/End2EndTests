import { Page } from '@playwright/test';

export class SettingsPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openPreferences() {
    await this.page.getByRole('button', { name: 'Preferences' }).click();
  }

  async isPreferenceActivated() {
    const toggle = this.page.getByRole('switch');
    return (await toggle.getAttribute('aria-checked')) === 'true';
  }

  async togglePreferenceIfNeeded(activate: boolean) {
    const toggle = this.page.getByRole('switch');
    const isActivated = await this.isPreferenceActivated();

    if (activate && !isActivated) {
      await toggle.click();
      await this.page.getByText('Submit').click();
      await this.page.getByText('Preferences saved successfully').waitFor({ state: 'visible' });
    } else if (!activate && isActivated) {
      await toggle.click();
      await this.page.getByText('Submit').click();
      await this.page.getByText('Preferences saved successfully').waitFor({ state: 'visible' });
    } else {
      await this.page.getByText('Cancel').click();
    }
  }
}
