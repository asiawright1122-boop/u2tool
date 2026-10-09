# 0005. One owned preview for production verification

**Status:** Accepted; local verification pending
**Date:** 2026-10-09
**Owner:** production verification

## Context

The production gate used separate preview lifetimes for postbuild checks, smoke
tests and sitemap HTTP checks. Smoke reused any server at port 4321; sitemap
could launch an IPv6 localhost listener while fetching IPv4. The SEO report then
defaulted to production after the local preview stopped. A green step did not
necessarily describe the build just produced by the current checkout.

## Decision

Build first, then own one IPv4 loopback preview for all postbuild, browser smoke,
sitemap HTTP and SEO-report steps. `verify:production:preview` runs the checks
under `run-with-preview.mjs`; non-HTTP reporting runs afterward. The wrapper
sets all fetch-origin environment variables to the same local origin while
keeping canonical URLs on the configured public origin.

The wrapper refuses occupied ports rather than reusing their owners. Readiness
requires a random temporary file served from the current `dist/client`, not just
any server returning HTTP 200. The marker is removed after success or failure.
Preview and validation process trees belong to the wrapper; success, failure,
startup errors, unexpected preview exit and SIGINT/SIGTERM trigger cleanup.
Signal exits remain nonzero. On POSIX, only owned process groups are signalled;
no port-based process killing is used. An EPERM during group reaping is accepted
only when the process table independently confirms no live group member.

Smoke no longer launches or discovers a server. Local sitemap HTTP checks also
require the managed preview. Explicit public-site sitemap checks via
`PROD_BASE_URL` remain available separately and are not part of local release
verification. `qa:smoke` is the standalone owned-preview entrypoint;
`qa:smoke:checks` is for an already managed preview. Nested wrappers fail.

## Alternatives considered

- Only replace `localhost` with `127.0.0.1`: fixes one connection error but leaves
  arbitrary-server reuse and split preview ownership intact.
- Reuse a development server when available: cannot establish current-build
  provenance and may interfere with unrelated development.
- Stop all listeners on a chosen port: unacceptable ownership boundary.

## Consequences and verification

- A prior build is required for standalone smoke. Missing builds and occupied
  ports fail explicitly; choose a free `PRODUCTION_PREVIEW_PORT` if needed.
- Readiness markers modify only ignored build output and are removed afterward.
- `preview-lifecycle.test.ts` uses real local child processes for lifecycle and
  failure tests, including descendants and unchanged foreign port owners.
- The production contract traces the entire npm graph, including the new tests.
- macOS/Node 22 verification is local; Linux CI and Windows behavior must not be
  inferred from a local pass. No remote workflow or deployment is triggered.

## Migration plan

Keep existing `qa:production` behavior for callers that only need postbuild
checks. Route `verify:production` through the shared preview tail, retain every
existing checker, and archive the local SEO alignment report with other CI
artifacts. Verify the exact one-command entrypoint from a fresh local clone.
