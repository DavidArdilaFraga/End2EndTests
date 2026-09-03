import { Page } from '@playwright/test';

export class HomePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('https://nesgpt-np.genai.nestle.com/');
    // ensure settings icon is present as a stability signal for the home page
    await this.page.locator('id=sidebar-section-settings').waitFor({ state: 'visible' });

    // Normalize zoom for visual stability (previously in setZoom util)
    try {
      await this.page.evaluate(() => { (document.body as any).style.zoom = 0.67; });
    } catch (e) {
      // ignore errors in non-browser contexts
    }

    await this.page.waitForTimeout(5000);

    // Close WalkMe popover if present
    const walkmePopover = '#walkme-balloon-1000953047 > div > div.walkme-custom-balloon-inner-div > div.walkme-custom-balloon-top-div > div > div.walkme-click-and-hover.walkme-custom-balloon-close-button.walkme-action-close.walkme-inspect-ignore';
    const pop = this.page.locator(walkmePopover);
    try {
      if (await pop.isVisible()) {
        await pop.click();
      }
    } catch (e) {
      // ignore any transient errors when closing the popover
    }
  }
}
