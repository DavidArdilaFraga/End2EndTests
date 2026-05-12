/**
 * Parsea una respuesta SSE de NesGPT y extrae los campos relevantes
 */
export function parseNesGPTResponse(responseBody: string) {
  const lines = responseBody.split('\n');

  let result = {
    tools: [],
    model: undefined,
    customPreferencesUsed: undefined,
    content: '',
    references: [],
    internalDocs: [],
    createdAt: undefined,
    conversationId: undefined
  };

  for (const line of lines) {
    if (!line.startsWith('data: ')) continue;

    const payload = line.replace('data: ', '').trim();

    // Ignore start and finish markers
    if (payload === '[START]' || payload === '[DONE]') continue;

    let parsed;
    try {
      parsed = JSON.parse(payload);
    } catch {
      continue; // If it's not valid JSON, skip it
    }

    
    // 1️⃣ conversationId → Always use the last one that appears (It is not inside message object, so we check this value before that validation)
    if (parsed.conversationId) {
      result.conversationId = parsed.conversationId;
    }

    const message = parsed.message;
    if (!message) continue;

    // 2️⃣ tools → use the longest array
    if (Array.isArray(message.tools) && message.tools.length > result.tools.length) {
      result.tools = message.tools;
    }

    // 3️⃣ model → the first one that appears
    if (!result.model && message.model) {
      result.model = message.model;
    }

    // 4️⃣ customPreferencesUsed → save candidates (except the last one)
    if (
    result.customPreferencesUsed === undefined &&
    typeof message.customPreferencesUsed === 'boolean'
    ) {
    result.customPreferencesUsed = message.customPreferencesUsed;
    }

    // 5️⃣ content → use the only non-empty content that appears
    if (message.content && message.content.trim().length > 0) {
      result.content = message.content;
    }

    // 6️⃣ references → use the only non-empty array that appears
    if (Array.isArray(message.references) && message.references.length > 0) {
      result.references = message.references;
    }

    // 7️⃣ internalDocs → map only required fields
    if (Array.isArray(message.internalDocs) && message.internalDocs.length > 0) {
      result.internalDocs = message.internalDocs.map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        url: doc.url,
        source: doc.source
      }));
    }

    // 8️⃣ createdAt → always use the last one that appears
    if (message.createdAt) {
      result.createdAt = message.createdAt;
    }
  }

  return result;
}