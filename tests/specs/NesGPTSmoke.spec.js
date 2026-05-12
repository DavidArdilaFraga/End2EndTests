const { test, expect } = require('@playwright/test');
import { parseNesGPTResponse } from '../utils/smokeFunctions/parseNesGPTResponse';
import { buildNesGPTPayload } from '../utils/smokeFunctions/PayloadNesGPT';

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
                Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ilh0LW83aERicHVwQXotWlBtNkh4Q0ZXUzNjSSJ9.eyJhdWQiOiI1ZTUyYmRiMi1jOWQ2LTRmOTEtYTI0MS0yNTM4YjhmYTZiYzgiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vMTJhM2FmMjMtYTc2OS00NjU0LTg0N2YtOTU4ZjNkNDc5ZjRhL3YyLjAiLCJpYXQiOjE3Nzg0OTIxMTEsIm5iZiI6MTc3ODQ5MjExMSwiZXhwIjoxNzc4NDk2NzcwLCJhaW8iOiJBWlFBYS84Y0FBQUFLT3BMLzRoTng3NW1Hb2x0MUVXWStFQy9uUGhQazN5Qm16OEdyNGg1NUxaSDFPcVN5MUcydGRTcytPVTFPbk9Rd0N6cjhKalI1MmxHNGxhbzVLWkIvdFhSYWI3anIrOWlmTlRWd2F2aUFvdUluOVE2d2l2VVpvNjJxMm54VTFyUUc5SHBlRlZvUGRJalpSUkp5R3ZLSFNFWVFVSDdzMlBoYXNZdDZmSDJrVFdHVzF4YWUrcUJrWVNIUVhtYjA4TmIiLCJhenAiOiI1ZTUyYmRiMi1jOWQ2LTRmOTEtYTI0MS0yNTM4YjhmYTZiYzgiLCJhenBhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJBcmRpbGEiLCJnaXZlbl9uYW1lIjoiRGF2aWQiLCJsb2dpbl9oaW50IjoiTy5DaVF4TmpjM05EUTBaUzFqWTJNM0xUUXpabVF0T0dRMVppMW1aamswWkdJNFlqaGpZekFTSkRFeVlUTmhaakl6TFdFM05qa3RORFkxTkMwNE5EZG1MVGsxT0dZelpEUTNPV1kwWVJvWFJHRjJhV1F1UVhKa2FXeGhRRzVsYzNSc1pTNWpiMjBncWdFPSIsIm5hbWUiOiJBcmRpbGEsRGF2aWQsQ0gtTmVhcnNob3JlIiwib2lkIjoiMTY3NzQ0NGUtY2NjNy00M2ZkLThkNWYtZmY5NGRiOGI4Y2MwIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiRGF2aWQuQXJkaWxhQG5lc3RsZS5jb20iLCJyaCI6IjEuQVF3QUk2LWpFbW1uVkVhRWY1V1BQVWVmU3JLOVVsN1d5WkZQb2tFbE9MajZhOGdNQU5VTUFBLiIsInNjcCI6InVzZXJfYWNjZXNzIiwic2lkIjoiMDA0MTU2YWEtZDJlZi04NGFhLTA4OGYtYjE1MjVlZDUzYWVmIiwic3ViIjoiSU9HcVlYOU9nVjI3X2RVNnBobHlCTTZyRzhVeWhwSEdULTlERVpjS3dPWSIsInRpZCI6IjEyYTNhZjIzLWE3NjktNDY1NC04NDdmLTk1OGYzZDQ3OWY0YSIsInV0aSI6Ii1OUW9FMHJ4V0VxbW80bTdadW9rQUEiLCJ2ZXIiOiIyLjAiLCJ4bXNfZnRkIjoiLV9fNFZFQVpQVUNhRDU3dVdhQVJfRDlnYlY3Ml9VNjhILTNBVTVyQlNvY0JabkpoYm1ObFl5MWtjMjF6In0.f79TqspVJQt-KmnWDC69hAajT_DJ-ttVLSCE1-G3e-Sfvav8ibcKPQ6JYOd4XOu6uHedDDvkffshfLSyBbx0M58G-C09KinN27XXPb_AgKeitWFVJlf8xejV6dgTLbuf1KfKO4XJGJy4y2H60Y_ZTQeW0gjNLKA3xaKYGDh70uBWG0Vx6mJhd6VdQsxjb4FlQJcGnZg5WO7saZbSCKYP_oN4tSS_ns-txc5Dyqh-fh_t6CAFJQw8m-QFsiBEqw3dNExjAXoppRbGP087p8awRUpiVk8rWF5_zv_ezW2dFFYE8UeGDjm6KODksnClS-F9a0UVL0Yl1PajcRDsMzOqug'
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
            "Tell me about Nestlé's vehicle rental policy. Also, show me 3 webs, with links, that help me improve my cooking skills",
            "List Paul Saunders direct reports and their roles.",
            "What does the My Inbox tool do? Also, what are Nestlé's policies on maternity leave?",
            "What is Nestlé's connected core? Also, explain to me what is the Strategic Performance Dashboard",
            "How did the Maggi brand adapt to air fryer cooking?"
        ];

        for (const prompt of prompts) {
            const payload = buildNesGPTPayload({
            prompt,
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
        }
    });
    
});