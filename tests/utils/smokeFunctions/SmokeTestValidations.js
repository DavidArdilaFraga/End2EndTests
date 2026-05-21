
import { expect } from '@playwright/test';

// Basic checks for validating the structure of NesGPT responses
export function validateBaseResponse(parsed) {
  expect(parsed).toBeDefined();

  // Not empty content
  expect(parsed.content, 'Response content should not be empty')
    .toBeTruthy();
  expect(parsed.content.trim().length)
    .toBeGreaterThan(0);

  // Valid conversationId
  expect(parsed.conversationId, 'conversationId should exist')
    .toBeTruthy();
  expect(parsed.conversationId)
    .not.toBe('00000000-0000-0000-0000-000000000000');

  // Valid createdAt
  expect(parsed.createdAt, 'createdAt should be present')
    .toBeTruthy();

  // Valid model
  expect(parsed.model, 'model should be present')
    .toBeTruthy();
}


// Validates that the response uses certain tools
export function validateUsedTools(parsed, expectedTools = []) {
  for (const tool of expectedTools) {
    expect(
      parsed.tools,
      `Expected tool "${tool}" to be used`
    ).toContain(tool);
  }
}

// Validates that the response uses at least one of the specified tools
export function validateUsesAnyOfTools(parsed, tools) {
  const used = tools.some(tool => parsed.tools.includes(tool));

  expect(
    used,
    `Expected at least one of these tools to be used: ${tools.join(', ')}`
  ).toBe(true);
}

