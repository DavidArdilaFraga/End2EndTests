
// login.ts
import { Page } from "@playwright/test";

// Path to the session state file
const authFile = 'playwright/.auth/user.json';

export const loginNesGPT = async (page: Page) => {
  await page.goto('https://nesgpt-np.genai.nestle.com/');

  // Login
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox').fill(process.env.NES_EMAIL!);
  await page.getByRole('button', { name: 'Siguiente' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill(process.env.NES_PASSWORD!);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  // MFA (manual for now)
  await page.getByRole('button', { name: 'Sí' }).click();

  // Wait for confirmation
  await page.waitForSelector('#chatBox > div > div.chat-box__prompting-guide-container > div.suggested-prompts', {
    state: 'visible'
  });

  // Save the session state so other tests reuse the login
  await page.context().storageState({ path: authFile });
};


    