# Requirements: v0.0.15 - Technical SEO Redirection Governance & Root Route Normalization

## Milestone Goal

Eliminate Google double-indexing issues and GSC redirect warnings by enforcing canonical 301 redirects from the root route `/` to the default language prefix `/en/` while guarding against redirection loops for system/build-level subrequests.

## Evidence Base

- Research Summary: [`.planning/research/SUMMARY.md`](/Users/kaka/Dev/u2tool/.planning/research/SUMMARY.md)
- Stack Reference: [`.planning/research/STACK.md`](/Users/kaka/Dev/u2tool/.planning/research/STACK.md)
- Architecture Reference: [`.planning/research/ARCHITECTURE.md`](/Users/kaka/Dev/u2tool/.planning/research/ARCHITECTURE.md)
- Pitfalls Reference: [`.planning/research/PITFALLS.md`](/Users/kaka/Dev/u2tool/.planning/research/PITFALLS.md)

## Requirements

### Active

- [ ] **RED-01** - Implement a canonical 301 redirect from the root path `/` to the default language prefixed path `/en/` inside edge middleware.
- [ ] **RED-02** - Preserve all URL query parameters (e.g., UTM tracking codes) during the root path redirection.
- [ ] **RED-03** - Implement a loopback safety guard using specific headers (`cf-worker`, `x-worker-loopback`, User-Agent) to bypass redirection for system-level requests.
- [ ] **RED-04** - Update `public/_routes.json` to explicitly include `"/"` to ensure the edge middleware intercepts root requests in Cloudflare Pages.
- [ ] **RED-05** - Extend technical SEO validation and E2E smoke test scripts to verify the redirection status code (301) and loopback bypass behavior.

## Future Requirements (Deferred)

- **RED-06** - Implement automatic client-side Accept-Language negotiation for geo-specific redirects (deferred to preserve strict crawler predictability).

## Out of Scope

- Implementing redirects based on persistent cookies (anti-feature; interferes with search bot crawling across regions).
- Modifying static resource paths (anything passing `isFileLikePath`) which could cause broken media asset links.
- Net-new tool creation or unrelated feature additions during this redirection governance cycle.

## Traceability

| Requirement ID | Description | Assigned Phase | Status | Plan/Summary Evidence |
|---|---|---|---|---|
| RED-01 | Root route 301 redirect | | | |
| RED-02 | UTM parameters preservation | | | |
| RED-03 | Loopback safety guard | | | |
| RED-04 | _routes.json integration | | | |
| RED-05 | Test suites and E2E validation | | | |
