import { Page } from "@playwright/test";
import { Sidebar } from '../../pageObjects/Sidebar';

// Backwards-compatible wrappers that delegate to the new Sidebar Page Object
export const accessAssistants = async (page: Page) => {
    const sidebar = new Sidebar(page);
    await sidebar.accessAssistants();
};

export const accessHistory = async (page: Page) => {
    const sidebar = new Sidebar(page);
    await sidebar.accessHistory();
};

export const accessDiscoverNesGPT = async (page: Page) => {
    const sidebar = new Sidebar(page);
    await sidebar.accessDiscoverNesGPT();
};

export const accessSettings = async (page: Page) => {
    const sidebar = new Sidebar(page);
    await sidebar.accessSettings();
};

export const accessPromptLibrary = async (page: Page) => {
    const sidebar = new Sidebar(page);
    await sidebar.accessPromptLibrary();
};