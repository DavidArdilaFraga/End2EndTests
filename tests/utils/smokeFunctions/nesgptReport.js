//Save results in a TXT file
import fs from 'fs';
import path from 'path';

export function saveParsedResultsAsTxt(results) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  const filePath = path.resolve(
    process.cwd(),
    `test-results/nesgpt-report-${timestamp}.txt`
  );

  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  let content = '';

  for (const r of results) {
    content += `\n====================================\n`;
    content += `PROMPT:\n${r.prompt}\n\n`;

    content += `RESPONSE:\n${r.parsed.content}\n\n`;

    content += `MODEL: ${r.parsed.model}\n`;
    content += `TOOLS: ${r.parsed.tools.join(', ')}\n`;

    content += `REFERENCES:\n`;
    r.parsed.references.forEach(ref => {
      content += ` - ${ref.name}: ${ref.url}\n`;
    });

    content += `\nINTERNAL DOCS:\n`;
    r.parsed.internalDocs.forEach(doc => {
      content += ` - ${doc.name} (${doc.url})\n`;
    });

    content += `\nCONVERSATION ID: ${r.parsed.conversationId}\n`;
    content += `CREATED AT: ${r.parsed.createdAt}\n`;
  }

  fs.writeFileSync(filePath, content);

  console.log(`📄 TXT report saved at: ${filePath}`);
}

