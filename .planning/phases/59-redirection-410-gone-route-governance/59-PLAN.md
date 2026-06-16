---
wave: 1
depends_on: []
files_modified:
  - src/lib/legacy-build-assets.ts
  - src/lib/legacy-redirects.ts
  - src/middleware.ts
  - public/_routes.json
  - src/middleware.test.ts
requirements:
  - RED-07
  - RED-08
  - RED-09
  - RED-10
autonomous: true
---

# Redirection & 410 Gone Route Governance Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement technical SEO redirection normalizations and route decommissioning gates inside the edge middleware, ensuring trailing slash canonicalization, legacy blog fallbacks, 410 Gone responses for obsolete compare/category pages, and stale Next.js static asset intercepting.

**Architecture:** Edge middleware handles route interception and canonical redirects before page generation. Obsolete chunks and compare/category paths are intercepted early and returned as 410 Gone with noindex and s-maxage headers. Unmapped blog paths are permanently redirected (301) to the tools root of the matching locale.

**Tech Stack:** Astro, TypeScript, Cloudflare Pages, Vitest

---

## Wave 1: Configurations and Helper Setup

### Task 1: Update Stale Asset Gone Headers
<read_first>
- src/lib/legacy-build-assets.ts
</read_first>
<acceptance_criteria>
- `src/lib/legacy-build-assets.ts` contains `cache-control` header value exactly set to `'public, max-age=86400, s-maxage=86400'`
</acceptance_criteria>
<action>
Modify `src/lib/legacy-build-assets.ts`:
Update the `LEGACY_BUILD_ASSET_GONE_HEADERS` constant to add `s-maxage=86400` to the `cache-control` header:
```typescript
const LEGACY_BUILD_ASSET_GONE_HEADERS = {
  'cache-control': 'public, max-age=86400, s-maxage=86400',
  'content-security-policy': "frame-ancestors 'none'",
  'content-type': 'text/plain; charset=utf-8',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'x-robots-tag': 'noindex, nofollow',
  'x-xss-protection': '1; mode=block',
} as const;
```
</action>

- [ ] **Step 1: Edit headers configuration**
Update the file `src/lib/legacy-build-assets.ts` as described.

- [ ] **Step 2: Commit changes**
```bash
git add src/lib/legacy-build-assets.ts
git commit -m "chore: add s-maxage to legacy build asset 410 gone headers"
```

---

### Task 2: Define Decommissioned Routes Helper
<read_first>
- src/lib/legacy-redirects.ts
- src/lib/i18n.ts
</read_first>
<acceptance_criteria>
- `src/lib/legacy-redirects.ts` exports `isDecommissionedLegacyRoute` function
- `isDecommissionedLegacyRoute` returns true for `/tools/compare/...`, `/tools/categories/...`, `/[locale]/tools/compare/...`, and `/[locale]/tools/categories/...` paths
</acceptance_criteria>
<action>
Modify `src/lib/legacy-redirects.ts`:
Add and export a helper function `isDecommissionedLegacyRoute(pathname: string): boolean`:
```typescript
export function isDecommissionedLegacyRoute(pathname: string): boolean {
  const segments = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  if (segments.length === 0) return false;

  const [first, second, third] = segments;

  // Case 1: unlocalized /tools/compare/... or /tools/categories/...
  if (first === 'tools' && (second === 'compare' || second === 'categories')) {
    return true;
  }

  // Case 2: localized /[locale]/tools/compare/... or /[locale]/tools/categories/...
  if (isValidLocale(first) && second === 'tools' && (third === 'compare' || third === 'categories')) {
    return true;
  }

  return false;
}
```
Ensure `isValidLocale` is imported if not already.
</action>

- [ ] **Step 1: Implement the helper function**
Add the `isDecommissionedLegacyRoute` helper to `src/lib/legacy-redirects.ts`.

- [ ] **Step 2: Commit changes**
```bash
git add src/lib/legacy-redirects.ts
git commit -m "feat: add isDecommissionedLegacyRoute helper for legacy compare/category paths"
```

---

### Task 3: Update Cloudflare Routing Config
<read_first>
- public/_routes.json
</read_first>
<acceptance_criteria>
- `public/_routes.json` contains `"/tools/compare/*"` and `"/tools/categories/*"` inside the `"include"` array
</acceptance_criteria>
<action>
Modify `public/_routes.json`:
Add `"/tools/compare/*"` and `"/tools/categories/*"` to the `"include"` array to make sure Cloudflare forwards requests targeting unlocalized legacy comparison/category pages to the Edge Worker.
```json
  "include": [
    "/",
    "/api/ai-discovery/*",
    "/robots.txt",
    "/sitemap.xml",
    "/sitemap-pages.xml",
    "/sitemap-tools.xml",
    "/llms.txt",
    "/_next/*",
    "/_next/static/*",
    "/_next/static/chunks/*",
    "/dist/*",
    "/tools/category/*",
    "/tools/ranking/*",
    "/tools/compare/*",
    "/tools/categories/*",
    "/en/privacy/*",
    ...
```
</action>

- [ ] **Step 1: Edit the routing file**
Add the new paths to `public/_routes.json`.

- [ ] **Step 2: Commit changes**
```bash
git add public/_routes.json
git commit -m "config: include legacy unlocalized compare and category routes in _routes.json"
```

---

## Wave 2: Middleware Logic and Testing

### Task 4: Refactor Edge Middleware Routing
<read_first>
- src/middleware.ts
- src/lib/legacy-redirects.ts
</read_first>
<acceptance_criteria>
- `src/middleware.ts` excludes `/messages` and `/messages/*` from trailing-slash redirection
- `src/middleware.ts` returns 410 Gone for decommissioned legacy compare and category paths using `isDecommissionedLegacyRoute`
- `src/middleware.ts` redirects unmapped `/blog/*` and `/[locale]/blog/*` to `/en/tools/` and `/[locale]/tools/` respectively
</acceptance_criteria>
<action>
Modify `src/middleware.ts`:
1. In the imports, import `isDecommissionedLegacyRoute` from `./lib/legacy-redirects`.
2. In `resolveCanonicalRedirect`, exclude static translation bundles:
   Add at the top of the function or next to the `/api` check:
   ```typescript
   if (url.pathname === '/messages' || url.pathname.startsWith('/messages/')) {
     return null;
   }
   ```
3. Update the `/blog` redirect check to fallback to tools:
   ```typescript
   if (first === 'blog') {
     return (second && resolveLegacyUnlocalizedBlogRedirect(second)) || resolveLegacyUnlocalizedBlogFallback();
   }
   ```
4. Update the localized `/blog` redirect check inside `if (isValidLocale(first))` block:
   ```typescript
   if (second === 'blog') {
     return (third && resolveLegacyBlogRedirect(first, third)) || resolveLegacyBlogFallback(first);
   }
   ```
5. In `onRequest`, intercept decommissioned legacy routes:
   Add the following check right before or after the `isLegacyBuildAssetRequest` check:
   ```typescript
   if (isDecommissionedLegacyRoute(new URL(context.request.url).pathname)) {
     return withSecurityHeaders(createLegacyBuildAssetGoneResponse(context.request.method));
   }
   ```
</action>

- [ ] **Step 1: Apply updates to middleware**
Modify `src/middleware.ts` as specified.

- [ ] **Step 2: Commit changes**
```bash
git add src/middleware.ts
git commit -m "feat: enforce static translation exclusions, blog fallbacks, and 410 decommissioned routes in middleware"
```

---

### Task 5: Update and Add Vitest Tests
<read_first>
- src/middleware.test.ts
</read_first>
<acceptance_criteria>
- `npm run test` or `npx vitest run src/middleware.test.ts` passes successfully
- `src/middleware.test.ts` contains test case verifying `/messages/*` is excluded from trailing slash redirects
- `src/middleware.test.ts` contains test case verifying unmapped legacy blog posts redirect to localized tools root
- `src/middleware.test.ts` contains test case verifying decommissioned compare and category routes return 410 Gone with correct robots and cache-control headers
- `src/middleware.test.ts` contains test verifying stale next.js asset returns `cache-control` header containing `s-maxage=86400`
</acceptance_criteria>
<action>
Modify `src/middleware.test.ts`:
1. Update the stale assets cache-control test:
   Change:
   ```typescript
   expect(response.headers.get('cache-control')).toContain('max-age=86400');
   ```
   to:
   ```typescript
   expect(response.headers.get('cache-control')).toBe('public, max-age=86400, s-maxage=86400');
   ```
2. Add new test cases to the test suite:
   ```typescript
   it('excludes static translation bundles (/messages/*) from trailing slash redirection', async () => {
     const next = vi.fn(async () => new Response('{"welcome":"Welcome"}', {
       headers: { 'content-type': 'application/json' }
     }));

     const { response } = await runMiddleware(
       new Request('https://www.u2tool.com/messages/en.json'),
       next
     );

     expect(response.status).toBe(200);
     expect(response.headers.get('location')).toBeNull();
     expect(next).toHaveBeenCalled();
   });

   it('redirects unmapped legacy blog posts to tools root page', async () => {
     const next = vi.fn(async () => new Response('should not run'));

     const unlocalized = await runMiddleware(
       new Request('https://www.u2tool.com/blog/unmapped-post'),
       next
     );
     const localized = await runMiddleware(
       new Request('https://www.u2tool.com/zh/blog/unmapped-post'),
       next
     );

     expect(unlocalized.response.status).toBe(301);
     expect(unlocalized.response.headers.get('location')).toBe('/en/tools/');

     expect(localized.response.status).toBe(301);
     expect(localized.response.headers.get('location')).toBe('/zh/tools/');
     expect(next).not.toHaveBeenCalled();
   });

   it('returns gone (410) with noindex for decommissioned compare and category routes', async () => {
     const next = vi.fn(async () => new Response('should not run'));

     const compareUnloc = await runMiddleware(
       new Request('https://www.u2tool.com/tools/compare/url-parser/dns-lookup'),
       next
     );
     const compareLoc = await runMiddleware(
       new Request('https://www.u2tool.com/en/tools/compare/url-parser/dns-lookup'),
       next
     );
     const categoryUnloc = await runMiddleware(
       new Request('https://www.u2tool.com/tools/categories/encoding'),
       next
     );
     const categoryLoc = await runMiddleware(
       new Request('https://www.u2tool.com/en/tools/categories/encoding'),
       next
     );

     for (const res of [compareUnloc, compareLoc, categoryUnloc, categoryLoc]) {
       expect(res.response.status).toBe(410);
       expect(res.response.headers.get('x-robots-tag')).toBe('noindex, nofollow');
       expect(res.response.headers.get('cache-control')).toBe('public, max-age=86400, s-maxage=86400');
       expect(res.next).not.toHaveBeenCalled();
     }
   });
   ```
</action>

- [ ] **Step 1: Add new test cases to the suite**
Edit `src/middleware.test.ts` as specified.

- [ ] **Step 2: Run tests locally**
Run the tests:
```bash
npx vitest run src/middleware.test.ts
```
Ensure all tests pass.

- [ ] **Step 3: Commit changes**
```bash
git add src/middleware.test.ts
git commit -m "test: add test coverage for static translation exclusions, unmapped blog fallbacks, and decommissioned routes"
```

---

## Verification Criteria

To verify the changes:
1. Run `npx vitest run src/middleware.test.ts` to make sure all 410 and 301 rules work as expected in unit testing.
2. Build the project using `npm run build` or `astro build` to ensure there are no compilation/TypeScript errors.

## must_haves

- Trailing-slash redirection permanently redirects requests missing a trailing slash on localized HTML paths (301) while preserving query parameters.
- Exclude trailing-slash redirection for file-like paths, framework assets (`_`), API routes (`/api/*`), and static translation bundles (`/messages/*`).
- Redirect unmapped `/blog/*` and `/[locale]/blog/*` to `/en/tools/` and `/[locale]/tools/` respectively.
- Return `410 Gone` with `x-robots-tag: noindex, nofollow` and `cache-control: public, max-age=86400, s-maxage=86400` headers for `/tools/compare/...`, `/tools/categories/...`, `/[locale]/tools/compare/...`, `/[locale]/tools/categories/...`, and `/_next/static/chunks/*`.
