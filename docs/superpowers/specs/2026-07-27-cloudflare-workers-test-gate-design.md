# Cloudflare Workers Test Gate Design

## Goal

Restore the repository-wide Vitest gate by making the AI Discovery events API
tests provide the Cloudflare virtual module that the production route imports.
The fix must not change production runtime behavior or the Grammar Checker
release branch.

## Root Cause

`src/pages/api/ai-discovery/events.ts` imports `env` from
`cloudflare:workers`. That module is supplied by the Workers runtime, but the
repository's Vitest configuration runs tests in Node and does not provide it.
As a result, all six tests in
`src/lib/ai-discovery/events-api.test.ts` fail while importing the route, before
any API behavior is exercised.

The repository already establishes the intended module-resolution pattern in
`src/middleware.test.ts`: a file-local Vitest mock supplies the virtual module.
Unlike the middleware, the events route consults test-provided runtime locals
only when imported `env` property access throws. Its test mock must therefore
model an unavailable Workers environment rather than return an empty object.

## Design

Add a hoisted, file-local `vi.mock('cloudflare:workers', ...)` declaration to
`src/lib/ai-discovery/events-api.test.ts`. The mock exposes `env` through a
`Proxy` whose property reads throw, activating the route's existing fallback
to `locals.runtime.env` without changing production code.

Keep the change local to the failing test file:

- do not add a global Vitest alias;
- do not change `vitest.config.ts`;
- do not alter the production route or Worker bindings;
- do not change AI Discovery request, persistence, export, or authorization
  behavior.

## Test Flow

The existing six-test file is the regression test and already provides the RED
state. After adding the mock:

1. Run `npx vitest run src/lib/ai-discovery/events-api.test.ts` and require
   `6/6` passing.
2. Run `npx vitest run` and require the previously observed suite to pass with
   no failures.
3. Run `npm run check` to verify Astro and TypeScript integration.
4. Run `npm run build` to verify that the test-only mock has no production
   build effect.

## Failure Handling

If the local mock does not resolve the import, stop and reassess module loading
rather than adding a global alias or changing production code. If the targeted
tests pass but another suite fails, classify that failure independently before
expanding scope.

## Non-Goals

- No Grammar Checker changes.
- No Cloudflare deployment or configuration changes.
- No dependency upgrades or vulnerability remediation.
- No refactor of the AI Discovery runtime boundary.
