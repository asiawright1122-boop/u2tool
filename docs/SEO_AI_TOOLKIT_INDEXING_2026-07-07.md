# AI Toolkit Indexing Follow-Up - 2026-07-07

## Scope

The AI toolkit launch now has priority discovery coverage for:

- Localized AI toolkit hubs: `/{locale}/ai/`
- AI cost and token planning tools
- Prompt generation and prompt template tools
- JSON-to-prompt and RAG planning tools
- AI crawler guidance and `llms.txt` tools
- Image prompt generators

IndexNow URL file:

- `exports/seo/indexnow-ai-toolkit-2026-07-07.txt`
- 130 URLs: 10 locales x 1 AI hub + 10 locales x 12 AI tool URLs

## GSC Manual Inspection Queue

Use URL Inspection for these first. Run live test, then request indexing only when Google does not already report the canonical URL as indexed.

| Priority | URL | Reason |
| --- | --- | --- |
| 1 | `https://www.u2tool.com/en/ai/` | English AI toolkit hub and internal linking surface. |
| 2 | `https://www.u2tool.com/zh/ai/` | Chinese AI toolkit hub and internal linking surface. |
| 3 | `https://www.u2tool.com/en/tools/ai-prompt-template-generator/` | New AI prompt template tool. |
| 4 | `https://www.u2tool.com/zh/tools/ai-prompt-template-generator/` | New localized AI prompt template tool. |
| 5 | `https://www.u2tool.com/en/tools/rag-chunk-size-calculator/` | New RAG planning tool. |
| 6 | `https://www.u2tool.com/zh/tools/rag-chunk-size-calculator/` | New localized RAG planning tool. |
| 7 | `https://www.u2tool.com/en/tools/ai-token-calculator/` | Core AI cost planning entry. |
| 8 | `https://www.u2tool.com/zh/tools/ai-token-calculator/` | Core localized AI cost planning entry. |
| 9 | `https://www.u2tool.com/en/tools/ai-robots-txt-generator/` | AI crawler guidance entry. |
| 10 | `https://www.u2tool.com/zh/tools/ai-robots-txt-generator/` | Localized AI crawler guidance entry. |

## Verification Evidence

- `npx vitest run src/lib/seo.test.ts src/lib/ai-tools-directory.test.ts`
- `npm run build`
- `node scripts/validate-sitemap-fix.js`
- `npm run validate:sitemap-urls`

## Notes

- Do not request indexing broadly in GSC. Use the priority queue above and avoid repeat requests when URL Inspection already reports the canonical as indexed.
- Watch sitemap processing after deployment for `sitemap-priority.xml`, because the AI tool URLs now appear in the priority sitemap as well as the full tools sitemap.
