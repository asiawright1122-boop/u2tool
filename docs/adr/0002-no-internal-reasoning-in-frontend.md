# 0002. No internal reasoning trace in frontend

**Status:** Accepted
**Date:** 2026-06-08
**Owner:** project-wide

## Context

U2Tool now has hundreds of localized tool pages, many generator-style UI
surfaces, AI Discovery routes, and agent-authored planning artifacts. These
systems can easily mix product copy, implementation notes, prompt drafts, and
agent handoffs if the boundary is not explicit.

The frontend must be trustworthy. Users should see useful results, concise
explanations, formulas, warnings, and validation evidence. They must not see
hidden chain-of-thought, system/developer instructions, agent scratchpads,
reviewer handoffs, or raw internal deliberation.

## Decision

No user-facing frontend surface may display an internal reasoning trace.

This applies to:

- Svelte and Astro UI text
- localized message files under `src/messages/`
- browser-rendered API responses
- discovery exports that can be consumed as product-facing text

Allowed content:

- concise result explanations
- calculation steps and formulas intentionally authored for users
- validation summaries and warning reasons
- source/evidence summaries
- debug labels only when they are not rendered to public users

Disallowed content:

- chain-of-thought or hidden deliberation
- agent scratchpads or reviewer handoffs
- system/developer prompts or private instructions
- raw planning notes copied into UI copy
- text implying that a model's hidden thinking is being shown

## Consequences

- Frontend features must pass data as final user-facing copy or structured
  results, not as internal thought transcripts.
- Generator tools may show "why this result works" when authored as product
  explanation, but not the hidden process used to produce it.
- Validation should block obvious forbidden phrases from user-visible code and
  translations.
- Planning and handoff documents may discuss internal reasoning boundaries, but
  those documents are not frontend copy.

## Alternatives Considered

### Allow reasoning traces behind a debug toggle

Rejected. A toggle still creates a path from private process text to public UI,
and it can leak through screenshots, indexing, or accidental production flags.

### Rely on manual review only

Rejected. The content surface is too large for manual review alone, especially
across 10 locales and generated tool copy.
