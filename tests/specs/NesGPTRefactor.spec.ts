import test, { expect } from '../test-fixtures/pomTest';
import type { Locator } from '@playwright/test';

// Helper that guarantees visibility and stability when clicking an element
async function safeClick(locator: Locator) {
  await expect(locator).toBeVisible();
  await locator.click();
}

/* -------------------------------------------------------------------------- */
/*                             ✅ TEST 1 — Settings                             */
/* -------------------------------------------------------------------------- */
test('Settings only appears for NesGPT', async ({ page, home, sidebar }) => {
  await home.open();

  const settings = page.locator('#sidebar-section-settings');
  await expect(settings).toBeVisible();

  // Switch to Operations Knowledge
  const assistantOKA = page.locator('#assistant-icon-1-3fa85f64-5717-4562-b3fc-2c963f66afa6');
  await safeClick(assistantOKA);

  // Settings should not appear now
  await expect(settings).not.toBeVisible();
});

/* -------------------------------------------------------------------------- */
/*                   ✅ TEST 2 — Pinning Assistants                           */
/* -------------------------------------------------------------------------- */
test('Unpin-Pin OKA assistant', async ({ page, home, sidebar }) => {
  await home.open();

  await sidebar.accessAssistants();

  // Unpins the OKA assistant
  const unpin = page.getByTestId('unpin-button');
  await safeClick(unpin);

  await page.waitForTimeout(2000);

  // Pins the OKA assistant again by clicking the pin button of the first assistant in the list
  const pinnedFlag = page.getByText('PINNED', { exact: true });

  if (await pinnedFlag.isHidden()) {
    await sidebar.clickFirstElementVisible('data-testid=pin-button');
    await expect(unpin).toBeVisible();
  }
});

/* -------------------------------------------------------------------------- */
/*                  ✅ TEST 3 — Pin / Rename / Delete chats                   */
/* -------------------------------------------------------------------------- */
test('Pin-rename-delete chats', async ({ page, home, sidebar, chat }) => {
  await home.open();
  await chat.createChat();

  await safeClick(page.getByText('New chat'));
  await sidebar.accessHistory();
  // Clicks the "Pinned" section to hide pinned chats
  await safeClick(page.getByText('Pinned', { exact: true }));

  // Clicks the 3 dots of the first chat in the "ALL" column and selects "Rename"
  await sidebar.clickFirstElementVisible('data-testid=action-menu');
  await safeClick(page.getByText('Rename'));

  // Renames the chat and accepts
  const renameInput = page.getByTestId('rename-chat-modal-form').getByRole('textbox');
  await renameInput.fill('TEST RENAMED');
  await safeClick(page.getByTestId('accept-button'));

  // Pins the chat
  await sidebar.clickFirstElementVisible('data-testid=action-menu');
  await safeClick(page.getByText('Pin chat'));

  // Clicks the "Pinned" section again to show the hidden chats
  await safeClick(page.getByText('Pinned', { exact: true }));

  // Unpins the chat
  await sidebar.clickFirstElementVisible('data-testid=action-menu');
  await safeClick(page.getByText('Unpin chat'));

  // Hides again the pinned chats to delete the first chat from the "ALL" column
  await safeClick(page.getByText('Pinned', { exact: true }));

  // Delete the first chat from the "ALL" column
  await sidebar.clickFirstElementVisible('data-testid=action-menu');
  await safeClick(page.getByText('Delete'));
  await safeClick(page.getByTestId('accept-button'));
});

/* -------------------------------------------------------------------------- */
/*                        ✅ TEST 4 — Discover NesGPT                          */
/* -------------------------------------------------------------------------- */
test('Check Discover NesGPT sections', async ({ page, home, sidebar }) => {
  await home.open();
  await sidebar.accessDiscoverNesGPT();

  const sections = [
    { button: 'What is NesGPT', text: 'Digital Working Hub Sharepoint' },
    { button: 'Essential Knowledge', text: 'NesGPT draws from key internal sources' },
    { button: 'NesGPT AI Assistants', text: 'How can I request a custom AI Assistant?' },
    { button: 'Prompting', text: 'Prompting Tips' },
    { button: 'NesGPT in Copilot', text: 'What is the NesGPT Microsoft 365 Copilot Agent?' },
    { button: 'FAQ (Frequently Asked Questions)', text: 'Who can use NesGPT?' },
    { button: 'Changelog', text: 'v6.0.0' },
    { button: 'Security and Compliance', text: 'Is it safe and compliant to use NesGPT?' },
    { button: 'Support and Incident Reporting', text: 'Report an Inaccurate Response' },
  ];

  //  Using the array from above, clicks every section from Discover NesGPT and checks that the expected text appears
  for (const s of sections) {
    await safeClick(page.getByRole('button', { name: s.button }));
    await expect(page.getByText(s.text)).toBeVisible();
  }
});

/* -------------------------------------------------------------------------- */
/*                          ✅ TEST 5 — Custom Settings                        */
/* -------------------------------------------------------------------------- */
test('Use custom settings', async ({ page, home, sidebar, chat, settings }) => {
  await home.open();

  // Wait a bit for the page to load properly and access the Settings option and then, the preferences
  await page.waitForTimeout(4000);
  await sidebar.accessSettings();
  await settings.openPreferences();

  const originalState = await settings.isPreferenceActivated();

  // Ensure preference is activated for the test
  await settings.togglePreferenceIfNeeded(true);

  // Sends a prompt in a new chat
  await chat.createChat();

  // Checks if the expected text appears in the first and last words of the response
  const messageParagraphs = await chat.getMessageParagraphs();

  const first = await messageParagraphs.first().innerText();
  const last = await messageParagraphs.last().innerText();

  await expect(first.startsWith('TEST')).toBe(true);
  await expect(last.endsWith('TEST')).toBe(true);

  // restore settings
  await sidebar.accessSettings();
  await settings.openPreferences();
  await settings.togglePreferenceIfNeeded(originalState);
});

/* -------------------------------------------------------------------------- */
/*       ✅ TEST 6 — Create New Prompt from Prompt Library                     */
/* -------------------------------------------------------------------------- */
test.describe.serial('Prompt Library flow', () => {
  test('Create new prompt from Prompt Library', async ({ page, home, sidebar, promptLib }) => {
    await home.open();
    await sidebar.accessPromptLibrary();

    // Possible Assistants = NesGPT, Legal & Compliance, IBS Knowledge, Digital Application Warehouse, ADI OPS Agent, WikiWiz
    const Assistant = 'NesGPT';
    // Possible Models = Basic (GPT-4.1 mini), Advanced (GPT-4o), Experimental (GPT-5 mini), Experimental (GPT-5.1)
    const Model = 'Basic (GPT-4.1 mini)';

    await page.waitForTimeout(4000);

    await promptLib.createNewPrompt('Test Playwright', 'This is a test prompt created by Playwright automation', Assistant, Model);
  });

  test('Edit prompt from Prompt Library', async ({ page, home, sidebar, promptLib }) => {
    await home.open();
    await sidebar.accessPromptLibrary();

    const Assistant = 'IBS Knowledge';
    const Model = 'Experimental (GPT-5.1)';

    // Accesses the "Playwright" category
    await promptLib.openCategory('Playwright');

    // Edit the first prompt with multiple fields
    await promptLib.editFirstPrompt({ newTitle: 'EDITED Test Playwright', assistant: Assistant, model: Model, category: 'Playwright Deletion', body: 'EDITED PROMPT' });

    // Accesses the "Playwright Deletion" category to check that the prompt has been moved there
    await promptLib.openCategory('Playwright Deletion');
    await expect(page.getByText('EDITED Test Playwright')).toBeVisible();

    // Edits the prompt again to change the assistant back to NesGPT and the model to Experimental (GPT-5.1), to make sure that the prompt is in the correct state for the next test
    if (Assistant !== 'NesGPT') {
      await promptLib.editFirstPrompt({ assistant: 'NesGPT', model: 'Experimental (GPT-5.1)' });
    }
  });

  test('Pin and Unpin prompt from Prompt Library', async ({ page, home, sidebar, promptLib }) => {
    await home.open();
    await sidebar.accessPromptLibrary();

    // Accesses the "Playwright Deletion" category
    await promptLib.openCategory('Playwright Deletion');

    // Pins the prompt by clicking the pin icon at the right side of the prompt card
    await promptLib.pinFirstPrompt();

    // Goes to the home page to see if the prompt appears
    await safeClick(page.getByRole('button', { name: 'New NesGPT chat', exact: true }));
    await expect(page.getByText('Pinned Prompts')).toBeVisible();

    // Accesses the Pinned Prompts section and checks that the prompt is there, then unpins it
    await sidebar.accessPromptLibrary();
    await safeClick(page.getByText('Pinned Prompts', { exact: true }));
    await expect(page.getByText('EDITED Test Playwright')).toBeVisible();
    await promptLib.unpinFirstPrompt();

    // Goes to the home page to check that the prompt has been removed from there
    await safeClick(page.getByRole('button', { name: 'New NesGPT chat', exact: true }));
    await expect(page.getByText('Pinned Prompts')).not.toBeVisible();

    // Goes to the prompt library to check that the prompt is in the correct category
    await sidebar.accessPromptLibrary();
    await promptLib.openCategory('Playwright Deletion');
    await expect(page.getByText('EDITED Test Playwright')).toBeVisible();
  });

  test('Delete prompt from Prompt Library', async ({ page, home, sidebar, promptLib }) => {
    await home.open();
    await sidebar.accessPromptLibrary();

    // Accesses the "Playwright Deletion" category
    await promptLib.openCategory('Playwright Deletion');

    // Deletes the prompt by clicking the 3 dots at the right side of the prompt card and selecting "Delete"
    await promptLib.deleteFirstPrompt();
    await safeClick(page.getByText('Delete'));
    await safeClick(page.getByText('Delete', { exact: true }));
  });
});
