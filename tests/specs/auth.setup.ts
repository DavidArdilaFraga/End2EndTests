import { test, chromium } from '@playwright/test';
import { loginNesGPT } from '../utils/General/login';
import dotenv from 'dotenv';
import path from 'path';

// Cargar .env desde la raíz
dotenv.config({ path: path.resolve(__dirname, '../.env') });

test('Auth setup - login and save session', async () => {
  const browser = await chromium.launch({ headless: false }); // MFA manual
  const page = await browser.newPage();

  await loginNesGPT(page);

  // Guardar sesión para reutilizarla
  await page.context().storageState({
    path: 'playwright/.auth/user.json',
  });

  await browser.close();
});