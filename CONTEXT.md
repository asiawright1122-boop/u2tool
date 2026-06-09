# U2Tool Context

## Core Domain

U2Tool is a multilingual utility-tool site. Its public pages must render useful
tool results, localized support content, SEO metadata, and discovery surfaces
without leaking implementation details that are only meant for maintainers,
agents, or model runtimes.

## Product Principles

### No Internal Reasoning Trace In Frontend

User-facing pages, tool widgets, API responses intended for browser display, and
localized message files must never expose internal reasoning traces.

An internal reasoning trace includes hidden deliberation, chain-of-thought text,
agent scratchpads, system or developer instructions, reviewer handoffs, raw
planning notes, or any model/runtime-private process transcript.

Allowed user-facing content includes concise explanations, formula steps,
calculation breakdowns, validation evidence, source summaries, and result
reasoning that was intentionally authored for the user. These must be written as
final product copy, not as a transcript of hidden thinking.

## Glossary

- **Internal reasoning trace**: Private model, agent, or maintainer process text
  that explains hidden deliberation rather than serving the user's task.
- **User-facing explanation**: A concise, intentionally authored explanation of a
  result, formula, warning, or recommendation that helps the user act.
- **Support content**: Localized tool-page copy such as descriptions, usage
  steps, examples, FAQs, and SEO metadata.
- **Discovery surface**: A route or export that helps users, crawlers, or AI
  systems find tools, including sitemaps, `llms.txt`, category pages, comparison
  pages, and AI Discovery.
