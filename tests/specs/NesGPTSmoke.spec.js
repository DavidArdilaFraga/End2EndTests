// This JS spec was migrated to TypeScript at tests/specs/NesGPTSmoke.spec.ts
// Kept as a placeholder to avoid duplicate test discovery. See the .ts file for the canonical tests.

/*
async function sendPromptAndParse(request, prompt, conversationId) {
  const payload = buildNesGPTPayload({
    prompt,
    conversationId,
    customPreferences: {
      role: 'Dentist',
      nesGptCustomBehaviorPrompt:
        'Start and end ALL your responses with TEST...',
      newChatsEnabled: false
    }
  });

  const response = await request.post(
    'https://nesgpt-np.genai.nestle.com/api/conversations',
    {
      headers: {
        Authorization: `Bearer ${process.env.NES_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      data:{
        ...payload,
        stream: false
      } 
    }
  );

  // ✅ Control HTTP
  if (!response.ok()) {
    throw new Error(
      `❌ HTTP ${response.status()}\n${await response.text()}`
    );
  }

  const raw = await response.text();

  // ✅ Control SSE completo
  if (!raw.includes('[DONE]')) {
    throw new Error(`❌ Incomplete SSE response\n${raw}`);
  }

  const parsed = parseNesGPTResponse(raw);

  return parsed;
}
*/
console.log('Token value: Bearer ', process.env.NES_TOKEN);
const delay = ms => new Promise(res => setTimeout(res, ms));

async function sendPromptAndParse(request, prompt, conversationId) {
  await delay(2000); // small delay to avoid hitting rate limits
  const payload = buildNesGPTPayload({
    prompt,
    conversationId,
    customPreferences: {
      role: 'Dentist',
      nesGptCustomBehaviorPrompt:
        'Start and end ALL your responses with TEST...',
      newChatsEnabled: false
    }
  });

  const response = await fetch(
    'https://nesgpt-np.genai.nestle.com/api/conversations',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NES_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    throw new Error(`❌ HTTP ${response.status}`);
  }

  // ✅ Leer STREAM real (SSE)
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  let raw = '';

  try{
    while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    raw += decoder.decode(value, { stream: true });

    // ✅ Salir cuando llega el final del SSE
    if (raw.includes('[DONE]')) break;
    }
  } catch (err) {
    console.warn('Stream interrupted, using partial data');
  }

  // opcional: cerrar stream
  reader.cancel();

  // ✅ Parsear como antes
  const parsed = parseNesGPTResponse(raw);

  return parsed;
}

test.describe('NesGPT API Smoke Tests', () => {

  test('API health check returns 200', async ({ request }) => {
    const response = await request.get('https://nesgpt-np.genai.nestle.com/api/conversations');
    //const responseBody = await response.json();
    const responseBody = await response.text();
    console.log('API Response:', responseBody);
    expect(response.status()).toBe(200);
  });
    
    test('Send multiple prompts to NesGPT and validate responses', async ({ request }) => {

        test.setTimeout(10 * 60 * 1000); // Test timeout set to 10 minutes to allow for multiple API calls and responses
        const results = []; // Array to store results of each prompt for reporting at the end

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
            },
            {
                text: "What does Nestlé think about racism? Also, summarize the document 'Unlocking the Language of Food Processing for Our Brands Guideline'",
                expectations: {
                    mustUseTools: ['nestle_documents_from_sharepoint']
                }
            },
            {
                text: "Give me some prompting tips specific for NesGPT",
                expectations: {
                    mustUseTools: ['nesgpt_help_center'] // This question is borderline, it might be answered with just the knowledge of the model, but ideally it should use at least one of these tools to provide a more up-to-date and accurate answer
                }
            },
            {
                text: "Is NesGPT compliant? Also, tell me why was the latest CEO of Nestlé appointed?",
                expectations: {
                    mustUseAnyOfTools: ['nestle_documents_from_sharepoint', 'bing_search_results', 'nesgpt_help_center'] // The first question should be answered with the nesgpt_help_center tool, but for the second question, it's borderline that the model might know the answer without using a tool, so we allow any of these three tools to be used
                }
            },
            {
                text: "List me the corporate tools that I can access. Also, tell me who is my manager's manager",
                expectations: {
                    mustUseTools: ['tools_market', 'user_information']
                }
            },
            {
                text: "List me 3 documents that talk about Nestlé's compromise with sustainability",
                expectations: {
                    mustUseTools: ['nestle_documents_from_sharepoint']
                }
            },
            {
                text: "Who is the latest Nespresso ambassador?",
                expectations: {
                    mustUseTools: ['nestle_documents_from_sharepoint']
                }
            }
        ];

        for (const { text, expectations} of prompts) {
            const parsed = await sendPromptAndParse(request, text, null);

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

            results.push({
                prompt: text,
                parsed
            });
        }

        saveParsedResultsAsTxt(results);
    });
    
    //It is not working as today because NesGPT is treating each prompt as a new conversation
    /*test('Multi-turn conversation with NesGPT', async ({ request }) => {

        test.setTimeout(3 * 60 * 1000);

        const prompts = [
            "Tell me who Lionel Messi is",
            "How many Ballon d'Or does he have?",
            "Now summarize all that in 2 lines"
        ];

        let conversationId = undefined;

        for (let i = 0; i < prompts.length; i++) {
            const prompt = prompts[i];

            console.log(`\n🧠 TURN ${i + 1}`);
            console.log(`Prompt: ${prompt}`);

            const parsed = await sendPromptAndParse(
                request,
                prompt,
                conversationId
            );

            console.log('✅ Response received');

            // ✅ 1. Guardar conversationId si es el primero
            if (!conversationId) {
                conversationId = parsed.conversationId;

                expect(conversationId).toBeTruthy();
                expect(conversationId).not.toBe('00000000-0000-0000-0000-000000000000');
            }

            // ✅ 2. Validar que sigue la misma conversación
            expect(parsed.conversationId)
            .toBe(conversationId);

            // ✅ 3. Validar contenido
            expect(parsed.content.length).toBeGreaterThan(0);

            // ✅ 4. Log útil
            console.log({
            conversationId,
            tools: parsed.tools,
            model: parsed.model
            });
        }

        console.log('\n✅ MULTI-TURN TEST COMPLETED SUCCESSFULLY');
    });*/

});