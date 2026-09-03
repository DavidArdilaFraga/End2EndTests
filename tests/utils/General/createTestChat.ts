import { expect, Page } from "@playwright/test";
import { StatementSync } from "node:sqlite";
    export const createChatNesGPT = async (page: Page) => {

        //Variable for the prompt text
        const chatText = 'TEST_THIS';
        //Fills text box and sends the prompt
        await page.locator('#question-box-text-area > div:nth-child(1) > div > div > div > div > div._rootContentEditableWrapper_uazmk_1097.mdxeditor-root-contenteditable > div:nth-child(1) > div').fill(chatText);
        await page.locator('data-testid=send-button').click();

        //Waits for the 3 dots to dissappear to know that the answer is delivered
        await page.waitForSelector('#chatBox > div > div.undefined.flex.w-full.flex-col.justify-end.m-auto.messages-container > div.body-chat-default.message-box.message-box-assistant > div > div.message-content > div.message-content__message.p-4 > div > p > div' , { state: 'hidden' });

    };