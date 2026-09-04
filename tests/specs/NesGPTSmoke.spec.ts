import { test, expect } from '@playwright/test';
import { validateBaseResponse } from '../utils/smokeFunctions/SmokeTestValidations';
import { saveParsedResultsAsTxt } from '../utils/smokeFunctions/nesgptReport';
import { sendPromptAndParse } from '../utils/smokeFunctions/sendPromptAndParse';

test.describe('NesGPT API Smoke Tests', () => {
  test('API health check returns 200', async ({ request }) => {
    const response = await request.get('https://nesgpt-np.genai.nestle.com/api/conversations');
    const responseBody = await response.text();
    console.log('API Response:', responseBody);
    expect(response.status()).toBe(200);
  });

  test('Send multiple prompts to NesGPT and validate responses', async () => {
    test.setTimeout(10 * 60 * 1000);
    const results: Array<any> = [];

    const prompts = [
      { text: "Tell me about Nestlé's vehicle rental policy. Also, show me 3 webs, with links, that help me improve my cooking skills"},
      { text: "List Paul Saunders direct reports and their roles."},
      { text: "What does the My Inbox tool do? Also, what are Nestlé's policies on maternity leave?"},
      { text: "What is Nestlé's connected core? Also, explain to me what is the Strategic Performance Dashboard"},
      { text: "How did the Maggi brand adapt to air fryer cooking?"},
      { text: "What does Nestlé think about racism? Also, summarize the document 'Unlocking the Language of Food Processing for Our Brands Guideline'"},
      { text: "Give me some prompting tips specific for NesGPT"},
      { text: "Is NesGPT compliant? Also, tell me why was the latest CEO of Nestlé appointed?"},
      { text: "List me the corporate tools that I can access. Also, tell me who is my manager's manager"},
      { text: "List me 3 documents that talk about Nestlé's compromise with sustainability"},
      { text: "Who is the latest Nespresso ambassador?"}
    ];

    for (const { text } of prompts) {
      const parsed = await sendPromptAndParse(text, null);
      console.log('Parsed response:', parsed);

      validateBaseResponse(parsed);

      results.push({ prompt: text, parsed });
    }

    saveParsedResultsAsTxt(results);
  });
});
