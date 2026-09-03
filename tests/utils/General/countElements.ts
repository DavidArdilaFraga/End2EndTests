import { Page } from "@playwright/test";

export async function clickFirstElementVisible(page: Page, element: string){

    // Get all elements matching the selector
    let elements = page.locator(element);

    // Count how many are visible and click the first visible one
    const count = await elements.count();
    for (let i = 0; i < count; i++) {
        if (await elements.nth(i).isVisible()) {
            await elements.nth(i).click();
            break; // Stop after clicking the first visible element
        }
    }
}
