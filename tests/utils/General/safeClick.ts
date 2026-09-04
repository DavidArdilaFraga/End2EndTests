import { expect, type Locator } from '@playwright/test';

export async function safeClick(locator: Locator): Promise<void> {
  await expect(locator).toBeVisible();
  await locator.click();
}
