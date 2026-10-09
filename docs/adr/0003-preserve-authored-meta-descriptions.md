# 0003. Preserve authored meta descriptions at render time

**Status:** Accepted (local implementation; deployment pending)
**Date:** 2026-10-09

## Context

The shared SEO formatter previously expanded descriptions shorter than 150
characters with generic localized claims, then truncated them at 180 characters.
This affected HTML metadata, social metadata and some structured data. A replay
of the 564-tool, 10-locale corpus found 3,729 short descriptions and 15 overlong
descriptions changed by that formatter. These counts describe local source
records, not indexed pages or measured ranking impact.

Character count is not a language-independent measure of useful description
content. Appending claims about browser-only processing can misrepresent a
network-backed tool; truncation can remove a qualification or limitation.

## Decision

- `resolveMetaDescription` only normalizes whitespace and falls back to the
  supplied title (or a neutral site label) when no description exists.
- It does not pad descriptions or truncate authored text. Page-level and layout
  formatting must be idempotent.
- Missing metadata, required intent terms, prohibited claims and repeated
  characters remain validation failures in the GSC recovery metadata gate.
  Its old fixed-length gate is replaced with authored-text preservation.
- Short, long or weak descriptions require editorial review of the source
  copy, not synthetic text added by a renderer. Other source-copy validators
  retain their existing editorial bounds.
- The current title formatter, localization merge rules, robots policy and
  approved indexability set are unchanged by this decision.

## Alternatives considered

Keeping padding preserves arbitrary length checks but perpetuates generic or
unsupported claims. Locale-specific padding still invents content. Truncating at
sentence boundaries is better than splitting words but can still remove a
capability limitation. All were rejected for the shared rendering layer.

## Verification and consequences

Behavioral tests preserve the complete 5,640-record tool description corpus
through both page and layout formatting. Local SSR checks independently compare
authored text with meta, Open Graph and Twitter descriptions for the recovery
cohort. A source description can now be shorter or longer than the previous
limits; this is visible editorial debt rather than something the renderer hides.

Google describes no fixed meta-description length limit and recommends accurate,
page-specific copy. It may choose a different snippet from page content and
truncate the displayed snippet. This change is not a ranking guarantee.
[Google snippet documentation](https://developers.google.com/search/docs/appearance/snippet)
