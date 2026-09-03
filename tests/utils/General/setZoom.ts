import { expect, Page } from "@playwright/test";

    export const setZoom = async (page: Page) => {
        // Sets page zoom to 67%
        await page.evaluate(() => {
            document.body.style.zoom=0.67.toString();
        });
    };