import { chromium } from "@playwright/test";
import { loginNesGPT } from "./tests/utils/General/login";

import dotenv from "dotenv";
import path from "path";

//Gets .env variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, ".env") });


async function globalSetup() {
  //Added headless false to be able to do the MFA manually and save the session state for future tests
  const browser = await chromium.launch({headless: false});
  const page = await browser.newPage();

  // await page.pause();

  await loginNesGPT(page);

  await browser.close();
}

export default globalSetup;