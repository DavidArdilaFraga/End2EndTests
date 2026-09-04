import { buildNesGPTPayload } from './PayloadNesGPT';
import { parseNesGPTResponse } from './parseNesGPTResponse';

const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export async function sendPromptAndParse(
  prompt: string,
  conversationId: string | null
) {
  await delay(2000);

  const payload = buildNesGPTPayload({
    prompt,
    conversationId,
    customPreferences: {
      role: 'Dentist',
      nesGptCustomBehaviorPrompt: 'Start and end ALL your responses with TEST...',
      newChatsEnabled: false
    }
  });

  const response = await fetch('https://nesgpt-np.genai.nestle.com/api/conversations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NES_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  if (!response.body) {
    throw new Error('NesGPT response did not include a body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let raw = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      raw += decoder.decode(value, { stream: true });
      if (raw.includes('[DONE]')) break;
    }
  } finally {
    await reader.cancel();
  }

  return parseNesGPTResponse(raw);
}
