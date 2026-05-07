# Architecture Decision Records

This directory holds architecture decision records (ADRs) for u2tool —
short, dated documents that capture *why* a non-obvious technical choice
was made, what alternatives were rejected, and what the consequences are.

## When to write an ADR

Write one whenever a decision is:

- **Hard to reverse** — touching the message namespace, the deployment
  platform, the canonical release gate, or anything 100+ files would
  inherit.
- **Crosses module boundaries** — affects more than one of
  `src/lib/`, `src/messages/`, `src/components/tools/`, `scripts/`,
  or `.github/workflows/`.
- **Has live alternatives** — multiple reasonable options were on the
  table and the pick is not self-evident from the code.

A decision that is local, easily reversible, or follows an established
pattern does **not** need an ADR. Keep this directory for the things a
new contributor would want context on.

## File naming

```
NNNN-kebab-case-title.md
```

`NNNN` is a four-digit sequence number, zero-padded, monotonically
increasing. The first ADR is `0001-…`, the next is `0002-…`, etc.

## Structure

Each ADR follows this template:

```markdown
# NNNN. Title

**Status:** Proposed | Accepted | Superseded by NNNN | Rejected
**Date:** YYYY-MM-DD
**Owner:** (name or role)

## Context

What is the problem? What facts force the decision?

## Decision

The chosen option, stated in one paragraph.

## Alternatives Considered

Each alternative + why it was not picked.

## Consequences

Positive, negative, and neutral effects.

## Migration Plan

Concrete steps if the decision lands. May reference Phases or
plans in `.planning/`.
```

## Index

| # | Title | Status | Date |
|---|---|---|---|
| [0001](0001-v2-message-namespace-retirement.md) | v2 message namespace retirement | Proposed | 2026-05-07 |
