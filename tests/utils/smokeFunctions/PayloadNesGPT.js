/**
 * Crea el payload para enviar uno o varios prompts a NesGPT
 */
export function buildNesGPTPayload({
  prompt,
  model = 'basic',
  temperature = 'balanced',
  customPreferences,
  assistant = {
    id: 'nesgpt',
    providerId: 'nesgpt',
    name: 'NesGPT'
  }
}) {
  return {
    message: {
      content: prompt,
      files: []
    },
    model,
    temperature,
    assistant,
    kind: 'standard',
    userCustomPreferences: customPreferences
  };
}
