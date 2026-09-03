import { expect, Page } from "@playwright/test";
import { ChatPage } from '../../pageObjects/ChatPage';

export const createChatNesGPT = async (page: Page) => {
    const chat = new ChatPage(page);
    await chat.createChat();
};