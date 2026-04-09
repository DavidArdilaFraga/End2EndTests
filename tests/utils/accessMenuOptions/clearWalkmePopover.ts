import { expect, Page } from "@playwright/test";
//import { StatementSync } from "node:sqlite";

export const clearWalkmePopover = async (page: Page) => {
    //  Checks if the 'x' button of the Walkme popover is visible, if it is, clicks it to close the popover
    const walkmePopover='#walkme-balloon-1000953047 > div > div.walkme-custom-balloon-inner-div > div.walkme-custom-balloon-top-div > div > div.walkme-click-and-hover.walkme-custom-balloon-close-button.walkme-action-close.walkme-inspect-ignore'
    if (await page.locator(walkmePopover).isVisible()){
        await page.locator(walkmePopover).click();
    }
}