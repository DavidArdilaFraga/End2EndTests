import { Page } from "@playwright/test";

/**
 * Deprecated: setZoom is now handled by HomePage.open().
 * Kept for backward compatibility and delegates to the HomePage behavior.
 */
export const setZoom = async (page: Page) => {
  console.warn('setZoom is deprecated — HomePage.open() applies a stable zoom');
  try {
    await page.evaluate(() => { (document.body as any).style.zoom = 0.67; });
  } catch (e) {
    // ignore
  }
};