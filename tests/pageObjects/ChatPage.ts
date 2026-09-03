import { Page } from '@playwright/test';

export class ChatPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createChat(chatText = 'TEST_THIS') {
    // Fill the chat input and send
    await this.page.locator('#question-box-text-area > div:nth-child(1) > div > div > div > div > div._rootContentEditableWrapper_uazmk_1097.mdxeditor-root-contenteditable > div:nth-child(1) > div').fill(chatText);
    await this.page.locator('data-testid=send-button').click();

    // Wait for the typing indicator to disappear (original utility awaited a specific selector to become hidden)
    await this.page.waitForSelector('#chatBox > div > div.undefined.flex.w-full.flex-col.justify-end.m-auto.messages-container > div.body-chat-default.message-box.message-box-assistant > div > div.message-content > div.message-content__message.p-4 > div > p > div' , { state: 'hidden' });
  }

  async getMessageParagraphs() {
    return this.page.locator('#chatBox div.message-content__message.p-4 p');
  }
}
