import { Page } from "@playwright/test";
import { Sidebar } from '../../pageObjects/Sidebar';

/**
 * Deprecated wrapper: use Sidebar.clickFirstElementVisible(selector) instead.
 * This function remains for backward compatibility and delegates to the Sidebar POM.
 */
export async function clickFirstElementVisible(page: Page, element: string){
    console.warn('clickFirstElementVisible is deprecated — use Sidebar.clickFirstElementVisible(selector)');
    const sidebar = new Sidebar(page);
    await sidebar.clickFirstElementVisible(element);
}
