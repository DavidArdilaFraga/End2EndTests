const { test, expect } = require('@playwright/test');
import { parseNesGPTResponse } from '../utils/smokeFunctions/parseNesGPTResponse';
import { buildNesGPTPayload } from '../utils/smokeFunctions/PayloadNesGPT';
import { validateBaseResponse, validateUsedTools, validateUsesAnyOfTools } from '../utils/smokeFunctions/SmokeTestValidations';

test.describe('NesGPT API Smoke Tests', () => {

  test('API health check returns 200', async ({ request }) => {
    const response = await request.get('https://nesgpt-np.genai.nestle.com/api/conversations');
    //const responseBody = await response.json();
    const responseBody = await response.text();
    console.log('API Response:', responseBody);
    expect(response.status()).toBe(200);
  });

  /*
  test('Send prompt to NesGPT and receive a response', async ({ request }) => {
        const payload = await request.post('https://nesgpt-np.genai.nestle.com/api/conversations', {
            headers: {
                Authorization: `Bearer ${process.env.NES_TOKEN}`
            },
            data: {
                "message":{"content":"Tell me about Nestlé's vehicle rental policy. Also, show me 3 webs, with links, that help me improve my cooking skills","files":[]},"model":"basic","temperature":"balanced","assistant":{"id":"nesgpt","providerId":"nesgpt","name":"NesGPT"},"kind":"standard","userCustomPreferences":{"role":"Dentist","nesGptCustomBehaviorPrompt":"Start and end ALL your responses with TEST. Each TEST should be the only word in its line, so, after the first TEST, there is a line jump, and before the last TEST there is another line jump","newChatsEnabled":false}
            }
        })
        const responseBody = await payload.text();
        const parsedResponse = parseNesGPTResponse(responseBody);
        console.log(parsedResponse);
    })
    */
    
    test('Send multiple prompts to NesGPT and validate responses', async ({ request }) => {

        test.setTimeout(300000); // Test timeout set to 5 minutes to allow for multiple API calls and responses

        const prompts = [
            //Tools list: bing_search_results, nestle_documents_from_sharepoint, user_information, tools_market
            {
                text: "Tell me about Nestlé's vehicle rental policy. Also, show me 3 webs, with links, that help me improve my cooking skills",
                    expectations: {
                        mustUseTools: ['bing_search_results', 'nestle_documents_from_sharepoint']
                    }
            },
            {
                text: "List Paul Saunders direct reports and their roles.",
                expectations: {
                    mustUseTools: ['user_information']
                }
            },
            {
                text: "What does the My Inbox tool do? Also, what are Nestlé's policies on maternity leave?",
                expectations: {
                    mustUseTools: ['tools_market', 'nestle_documents_from_sharepoint']
                }
            },
            {
                text: "What is Nestlé's connected core? Also, explain to me what is the Strategic Performance Dashboard",
                expectations: {
                    mustUseTools: ['nestle_documents_from_sharepoint']
                }
            },
            {
                text: "How did the Maggi brand adapt to air fryer cooking?",
                expectations: {
                    mustUseAnyOfTools: ['nestle_documents_from_sharepoint', 'bing_search_results'] // This question is borderline, it might be answered with just the knowledge of the model, but ideally it should use at least one of these tools to provide a more up-to-date and accurate answer
                }
            }
        ];

        for (const { text, expectations} of prompts) {
            const payload = buildNesGPTPayload({
            prompt: text,
            customPreferences: {
                role: 'Dentist',
                nesGptCustomBehaviorPrompt:
                'Start and end ALL your responses with TEST. Each TEST should be the only word in its line, so, after the first TEST, there is a line jump, and before the last TEST there is another line jump',
                newChatsEnabled: false
            }
            });

            const response = await request.post(
            'https://nesgpt-np.genai.nestle.com/api/conversations',
            {
                headers: {
                Authorization: `Bearer ${process.env.NES_TOKEN}`
                },
                data: payload
            }
            );

            const responseText = await response.text();
            //console.log(responseText);
            /*
            // ✅ 1. Status code
            if (!response.ok()) {
                throw new Error(
                    `❌ API ERROR\n` +
                    `Status: ${response.status()}\n` +
                    `Body:\n${responseText}`
                );
            }

            console.log('⬇️ RAW RESPONSE START ⬇️');
            console.log(responseText);
            console.log('⬆️ RAW RESPONSE END ⬆️');
            */

            const parsed = parseNesGPTResponse(responseText);

            console.log('Parsed response:', parsed);
 
            // ✅ Base validations
            validateBaseResponse(parsed);

            // ✅ Conditional checks per prompt
            if (expectations?.mustUseTools) {
                validateUsedTools(parsed, expectations.mustUseTools);
            }

            if (expectations?.mustUseAnyOfTools) {
                validateUsesAnyOfTools(parsed, expectations.mustUseAnyOfTools);
            }

        }
    });
    
});