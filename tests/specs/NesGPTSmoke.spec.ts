import { test, expect } from '@playwright/test';
import { validateBaseResponse, validateUsedTools, validateUsesAnyOfTools } from '../utils/smokeFunctions/SmokeTestValidations';
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
      { text: "Tell me about Nestlé's vehicle rental policy. Also, show me 3 webs, with links, that help me improve my cooking skills", expectations: { mustUseTools: ['bing_search_results', 'nestle_documents_from_sharepoint'] } },
      { text: "List Paul Saunders direct reports and their roles.", expectations: { mustUseTools: ['user_information'] } },
      { text: "What does the My Inbox tool do? Also, what are Nestlé's policies on maternity leave?", expectations: { mustUseTools: ['tools_market', 'nestle_documents_from_sharepoint'] } },
      { text: "What is Nestlé's connected core? Also, explain to me what is the Strategic Performance Dashboard", expectations: { mustUseTools: ['nestle_documents_from_sharepoint'] } },
      { text: "How did the Maggi brand adapt to air fryer cooking?", expectations: { mustUseAnyOfTools: ['nestle_documents_from_sharepoint', 'bing_search_results'] } },
      { text: "What does Nestlé think about racism? Also, summarize the document 'Unlocking the Language of Food Processing for Our Brands Guideline'", expectations: { mustUseTools: ['nestle_documents_from_sharepoint'] } },
      { text: "Give me some prompting tips specific for NesGPT", expectations: { mustUseTools: ['nesgpt_help_center'] } },
      { text: "Is NesGPT compliant? Also, tell me why was the latest CEO of Nestlé appointed?", expectations: { mustUseAnyOfTools: ['nestle_documents_from_sharepoint', 'bing_search_results', 'nesgpt_help_center'] } },
      { text: "List me the corporate tools that I can access. Also, tell me who is my manager's manager", expectations: { mustUseTools: ['tools_market', 'user_information'] } },
      { text: "List me 3 documents that talk about Nestlé's compromise with sustainability", expectations: { mustUseTools: ['nestle_documents_from_sharepoint'] } },
      { text: "Who is the latest Nespresso ambassador?", expectations: { mustUseTools: ['nestle_documents_from_sharepoint'] } }
    ];

    for (const { text, expectations } of prompts) {
      const parsed = await sendPromptAndParse(text, null);
      console.log('Parsed response:', parsed);

      validateBaseResponse(parsed);

      if (expectations?.mustUseTools) {
        validateUsedTools(parsed, expectations.mustUseTools);
      }

      if (expectations?.mustUseAnyOfTools) {
        validateUsesAnyOfTools(parsed, expectations.mustUseAnyOfTools);
      }

      results.push({ prompt: text, parsed });
    }

    saveParsedResultsAsTxt(results);
  });
});
