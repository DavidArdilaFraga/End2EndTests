import { test, expect } from '@playwright/test';
import { setZoom } from '../utils/General/setZoom';
import { createChatNesGPT } from '../utils/General/createTestChat';
import { clickFirstElementVisible } from '../utils/General/countElements';
import { accessAssistants, accessHistory, accessDiscoverNesGPT, accessSettings, accessPromptLibrary } from '../utils/accessMenuOptions/accessMenuOptions';
import { clearWalkmePopover } from '../utils/accessMenuOptions/clearWalkmePopover';


// Helper that guarantees visibility and stability when clicking an element
async function safeClick(locator) {
    await expect(locator).toBeVisible();
    await locator.click();
}

// Helper to navigate and wait for stability
async function openHome(page) {
    await page.goto('https://nesgpt-np.genai.nestle.com/');
    await page.locator('id=sidebar-section-settings').isVisible();
    await setZoom(page);
    await page.waitForTimeout(5000);
    await clearWalkmePopover(page);
}


/* -------------------------------------------------------------------------- */
/*                             ✅ TEST 1 — Settings                             */
/* -------------------------------------------------------------------------- */
test('Settings only appears for NesGPT', async ({ page }) => {

    await openHome(page);

    const settings = page.locator('#sidebar-section-settings');
    await expect(settings).toBeVisible();

    // Switch to L&C
    const assistantLC = page.locator('#assistant-icon-1-db4d3fc9-7dbc-4992-98aa-7bfc410f7769');
    await safeClick(assistantLC);

    // Settings should not appear now
    await expect(settings).not.toBeVisible();
});


/* -------------------------------------------------------------------------- */
/*                   ✅ TEST 2 — Pinning Assistants                           */
/* -------------------------------------------------------------------------- */
test('Unpin-Pin L&C assistant', async ({ page }) => {

    await openHome(page);

    await accessAssistants(page);

    // Unpins the L&C assistant
    const unpin = page.getByTestId('unpin-button');
    await safeClick(unpin);

    await page.waitForTimeout(2000);

    // Pins the L&C assistant again by clicking the pin button of the first assistant in the list
    const pinnedFlag = page.getByText('PINNED', { exact: true });

    if (await pinnedFlag.isHidden()) {
        await clickFirstElementVisible(page, 'data-testid=pin-button');
        await expect(unpin).toBeVisible();
    }
});


/* -------------------------------------------------------------------------- */
/*                  ✅ TEST 3 — Pin / Rename / Delete chats                   */
/* -------------------------------------------------------------------------- */
test('Pin-rename-delete chats', async ({ page }) => {

    await openHome(page);
    await createChatNesGPT(page);

    await safeClick(page.getByText('New chat'));
    await accessHistory(page);
    // Clicks the "Pinned" section to hide pinned chats
    await safeClick(page.getByText('Pinned', { exact: true }));

    // Clicks the 3 dots of the first chat in the "ALL" column and selects "Rename"
    await clickFirstElementVisible(page, 'data-testid=action-menu');
    await safeClick(page.getByText('Rename'));

    // Renames the chat and accepts
    const renameInput = page.getByTestId('rename-chat-modal-form').getByRole('textbox')
    await renameInput.fill('TEST RENAMED');
    await safeClick(page.getByTestId('accept-button'));

    // Pins the chat
    await clickFirstElementVisible(page, 'data-testid=action-menu');
    await safeClick(page.getByText('Pin chat'));

    // Clicks the "Pinned" section again to show the hidden chats
    await safeClick(page.getByText('Pinned', { exact: true }));

    // Unpins the chat
    await clickFirstElementVisible(page, 'data-testid=action-menu');
    await safeClick(page.getByText('Unpin chat'));

    // Hides again the pinned chats to delete the first chat from the "ALL" column
    await safeClick(page.getByText('Pinned', { exact: true }));

    // Delete the first chat from the "ALL" column
    await clickFirstElementVisible(page, 'data-testid=action-menu');
    await safeClick(page.getByText('Delete'));
    await safeClick(page.getByTestId('accept-button'));
});


/* -------------------------------------------------------------------------- */
/*                        ✅ TEST 4 — Discover NesGPT                          */
/* -------------------------------------------------------------------------- */
test('Check Discover NesGPT sections', async ({ page }) => {

    await openHome(page);
    await accessDiscoverNesGPT(page);

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
test('Use custom settings', async ({ page }) => {

    await openHome(page);

    // Wait a bit for the page to load properly and access the Settings option and then, the preferences
    await page.waitForTimeout(4000);
    await accessSettings(page);
    await safeClick(page.getByRole('button', { name: 'Preferences' }));

    const toggle = page.getByRole('switch');
    const isActivated = await toggle.getAttribute('aria-checked') === 'true';

    // Checks if the toggle is activated. If it's not, activates it
    if (!isActivated) {
        await safeClick(toggle);
        await safeClick(page.getByText('Submit'));
        await expect(page.getByText('Preferences saved successfully')).toBeVisible();
    } else {
        await safeClick(page.getByText('Cancel'));
    }

    // Sends a prompt in a new chat
    await createChatNesGPT(page);

    // Checks if the expected text appears in the first and last words of the response
    const messageParagraphs = page.locator('#chatBox div.message-content__message.p-4 p');

    const first = await messageParagraphs.first().innerText();
    const last = await messageParagraphs.last().innerText();

    expect(first.startsWith('TEST')).toBe(true);
    expect(last.endsWith('TEST')).toBe(true);

    // restore settings
    await accessSettings(page);
    await safeClick(page.getByRole('button', { name: 'Preferences' }));

    if (await toggle.getAttribute('aria-checked') === 'true') {
        await safeClick(toggle);
        await safeClick(page.getByText('Submit'));
        await expect(page.getByText('Preferences saved successfully')).toBeVisible();
    } else {
        await safeClick(page.getByText('Cancel'));
    }
});

/* -------------------------------------------------------------------------- */
/*       ✅ TEST 6 — Create New Prompt from Prompt Library                     */
/* -------------------------------------------------------------------------- */
test.describe.serial('Prompt Library flow', () => {
    test('Create new prompt from Prompt Library', async ({ page }) => {
        await openHome(page);
        await accessPromptLibrary(page);

        // Possible Assistants = NesGPT, Legal & Compliance, IBS Knowledge, Digital Application Warehouse, ADI OPS Agent, WikiWiz
        const Assistant = 'NesGPT';
        // Possible Models = Basic (GPT-4.1 mini), Advanced (GPT-4o), Experimental (GPT-5 mini), Experimental (GPT-5.1)
        const Model = 'Basic (GPT-4.1 mini)'

        await page.waitForTimeout(4000);

        //  Clicks the "New Prompt" button
        await safeClick(page.getByRole('button', { name: 'New prompt' }));

        //  Fills the prompt name
        await page.getByPlaceholder('Give a descriptive name for this prompt').fill('Test Playwright');

        //  If we want to select a different assistant than NesGPT, we do it here
        if (Assistant !== 'NesGPT') { 
            await safeClick(page.getByText('NesGPT'));
            await safeClick(page.getByText(Assistant));
        }

        //  If we want to select a different model than Basic, we do it here
        if (Model !== 'Basic (GPT-4.1 mini)') {
            await safeClick(page.getByText('Basic (GPT-4.1 mini)'));
            await safeClick(page.getByText(Model));
        }

        //  Changes the category from "General" to "Playwright"
        await page.locator('#prompt-modal-form > div > div:nth-child(3) > div > div > div > div.css-1wy0on6 > div').click();

        await page.getByText('Playwright').nth(2).click();

        //  Fills the prompt's body
        await page.locator('#prompt-library-markdown-editor > div > div._rootContentEditableWrapper_uazmk_1097.mdxeditor-root-contenteditable > div:nth-child(1) > div').fill('This is a test prompt created by Playwright automation');

        //  Saves the prompt
        await safeClick(page.getByRole('button', { name: 'Save' }));

    });
/* -------------------------------------------------------------------------- */
/*       ✅ TEST 7 — Edit Prompt from Prompt Library                           */
/* -------------------------------------------------------------------------- */
    test('Edit prompt from Prompt Library', async ({ page }) => {

        await openHome(page);
        await accessPromptLibrary(page);
        // Possible Assistants = NesGPT, Legal & Compliance, IBS Knowledge, Digital Application Warehouse, ADI OPS Agent, WikiWiz
        const Assistant = 'IBS Knowledge';
        // Possible Models = Basic (GPT-4.1 mini), Advanced (GPT-4o), Experimental (GPT-5 mini), Experimental (GPT-5.1)
        const Model = 'Experimental (GPT-5.1)';

        // Accesses the "Playwright" category
        await safeClick(page.getByRole('link', { name: 'Playwright' , exact: true}));

        // Clicks the 3 dots at the right side of the prompt card and selects "Edit"
        await safeClick(page.getByTitle('Modify this prompt'));
        await safeClick(page.getByText('Edit'));

        // Changes the prompt's title
        await page.waitForTimeout(2000);
        await page.getByPlaceholder('Give a descriptive name for this prompt').fill('EDITED Test Playwright');

        // Changes the prompt's assistant
        await page.locator('#prompt-modal-form > div > div:nth-child(2) > div:nth-child(1) > div > div > div.css-1wy0on6 > div').click();
        await safeClick(page.getByText(Assistant));

        // Changes the prompt's model, but only if the assistant is NesGPT, because for the other assistants there is only one model available
        if (Assistant == 'NesGPT') {
            await safeClick(page.locator('#prompt-modal-form > div > div:nth-child(2) > div:nth-child(2) > div > div > div.css-1wy0on6 > div'));
            await safeClick(page.getByText(Model));
        }

        // Changes the prompt's category
        await page.locator('#prompt-modal-form > div > div:nth-child(3) > div > div > div > div.css-1wy0on6 > div').click();
        await page.getByText('Playwright Deletion', { exact: true }).nth(1).click();

        // Changes the prompt's body
        await page.locator('#prompt-library-markdown-editor > div > div._rootContentEditableWrapper_uazmk_1097.mdxeditor-root-contenteditable > div:nth-child(1) > div').fill('EDITED PROMPT');

        // Saves the changes
        await safeClick(page.getByRole('button', { name: 'Save' }));

        // Accesses the "Playwright Deletion" category to check that the prompt has been moved there
        await safeClick(page.getByRole('link', { name: 'Playwright Deletion' , exact: true }));
        await expect(page.getByText('EDITED Test Playwright')).toBeVisible();

        // Edits the prompt again to change the assistant back to NesGPT and the model to Experimental (GPT-5.1), to make sure that the prompt is in the correct state for the next test
        await safeClick(page.getByTitle('Modify this prompt'));
        await safeClick(page.getByText('Edit' , {exact: true}));
        await page.locator('#prompt-modal-form > div > div:nth-child(2) > div:nth-child(1) > div > div > div.css-1wy0on6 > div').click();
        await safeClick(page.getByText('NesGPT' , {exact: true}));
        await page.locator('#prompt-modal-form > div > div:nth-child(2) > div:nth-child(2) > div > div > div.css-1wy0on6 > div').click();
        await safeClick(page.getByText('Experimental (GPT-5.1)'));
        await safeClick(page.getByRole('button', { name: 'Save' }));
    });
/* -------------------------------------------------------------------------- */
/*       ✅ TEST 8 — Pin and Unpin prompt from Prompt Library                 */
/* -------------------------------------------------------------------------- */
    test('Pin and Unpin prompt from Prompt Library', async ({ page }) => {

        await openHome(page);
        await accessPromptLibrary(page);

        // Accesses the "Playwright Deletion" category
        await safeClick(page.getByRole('link', { name: 'Playwright Deletion' , exact: true }));

        // Pins the prompt by clicking the pin icon at the right side of the prompt card
        await safeClick(page.getByTitle('Modify this prompt'));
        await safeClick(page.getByText('Pin prompt'));

        // Goes to the home page to see if the prompt appears
        await safeClick(page.getByRole('button', { name: 'New NesGPT chat' , exact: true }));
        await expect(page.getByText('Pinned Prompts')).toBeVisible();

        // Accesses the Pinned Prompts section and checks that the prompt is there, then unpins it
        await accessPromptLibrary(page);
        await safeClick(page.getByText('Pinned Prompts' , {exact: true}));
        await expect(page.getByText('EDITED Test Playwright')).toBeVisible();
        await safeClick(page.getByTitle('Modify this prompt'));
        await safeClick(page.getByText('Unpin prompt'));

        // Goes to the home page to check that the prompt has been removed from there
        await safeClick(page.getByRole('button', { name: 'New NesGPT chat' , exact: true }));
        await expect(page.getByText('Pinned Prompts')).not.toBeVisible();

        // Goes to the prompt library to check that the prompt is in the correct category
        await accessPromptLibrary(page);
        await safeClick(page.getByRole('link', { name: 'Playwright Deletion' , exact: true }));
        await expect(page.getByText('EDITED Test Playwright')).toBeVisible();

    });
/* -------------------------------------------------------------------------- */
/*       ✅ TEST 9 — Delete prompt from Prompt Library                 */
/* -------------------------------------------------------------------------- */
    test('Delete prompt from Prompt Library', async ({ page }) => {

        await openHome(page);
        await accessPromptLibrary(page);

        // Accesses the "Playwright Deletion" category
        await safeClick(page.getByRole('link', { name: 'Playwright Deletion' , exact: true }));

        // Deletes the prompt by clicking the 3 dots at the right side of the prompt card and selecting "Delete"
        await safeClick(page.getByTitle('Modify this prompt'));
        await safeClick(page.getByText('Delete'));
        await safeClick(page.getByText('Delete' , { exact: true }));
    });
});