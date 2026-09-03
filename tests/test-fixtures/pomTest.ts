import base, { expect } from '@playwright/test';
import { HomePage } from '../pageObjects/HomePage';
import { Sidebar } from '../pageObjects/Sidebar';
import { ChatPage } from '../pageObjects/ChatPage';
import { PromptLibraryPage } from '../pageObjects/PromptLibraryPage';
import { SettingsPage } from '../pageObjects/SettingsPage';

type Fixtures = {
  home: HomePage;
  sidebar: Sidebar;
  chat: ChatPage;
  promptLib: PromptLibraryPage;
  settings: SettingsPage;
};

export const test = base.extend<Fixtures>({
  home: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  sidebar: async ({ page }, use) => {
    await use(new Sidebar(page));
  },
  chat: async ({ page }, use) => {
    await use(new ChatPage(page));
  },
  promptLib: async ({ page }, use) => {
    await use(new PromptLibraryPage(page));
  },
  settings: async ({ page }, use) => {
    await use(new SettingsPage(page));
  }
});

export { expect };
export default test;
