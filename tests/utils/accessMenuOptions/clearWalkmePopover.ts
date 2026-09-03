import { Page } from "@playwright/test";

/**
 * Deprecated: HomePage.open() now closes the WalkMe popover automatically.
 * This helper remains for backward compatibility but will be removed in a future refactor.
 */
export const clearWalkmePopover = async (page: Page) => {
  console.warn('clearWalkmePopover is deprecated—use HomePage.open() which already clears the popover');
  const walkmePopover = '#walkme-balloon-1000953047 > div > div.walkme-custom-balloon-inner-div > div.walkme-custom-balloon-top-div > div > div.walkme-click-and-hover.walkme-custom-balloon-close-button.walkme-action-close.walkme-inspect-ignore';
  const pop = page.locator(walkmePopover);
  try {
    if (await pop.isVisible()) {
      await pop.click();
    }
  } catch (e) {
    // ignore transient errors
  }
};