---
phase: "61"
plan: "technical-seo-link-crawling-and-normalization"
type: "standard"
wave: 1
depends_on: []
files_modified:
  - package.json
  - scripts/validation/validate-canonical-slash.ts
  - scripts/validation/validate-sitemap-urls.ts
requirements:
  - TSEO-01
  - TSEO-02
autonomous: true
must_haves:
  - "All pre-rendered HTML files in dist/client have valid absolute canonical URLs with a trailing slash."
  - "All internal <a> anchor links in pre-rendered HTML point strictly to canonical trailing-slash URLs."
  - "Sitemap index and children parsed correctly, and 100% of URLs verified for physical index.html on disk."
  - "Online health sampling check successfully queries wrangler simulated routes returning HTTP 200 with 0 redirects."
---

# Phase 61: Technical SEO Link Crawling & Normalization Implementation Plan

**Goal:** Implement robust post-build validation scripts to enforce trailing-slash normalization in pre-rendered HTML files, and execute dual-stage (offline physical mapping + online concurrent sampling HTTP 200/0-redirects) verification for all 10 locales in the Sitemap structure.

<hr />

## Wave 1: Implementation Tasks

<task>
<name>Create Trailing-Slash Canonical and Internal Link Validator Script</name>
<files>
- package.json
- scripts/validation/validate-internal-link-canonicals.ts
- scripts/validation/validate-canonical-slash.ts
</files>
<action>
Create `scripts/validation/validate-canonical-slash.ts` to scan `dist/client/` post-build.
The script must perform the following:
1. Recursively find all `.html` files in `dist/client/`.
2. Load each HTML using `cheerio`.
3. Locate `<link rel="canonical" href="...">`. Assert that:
   - It exists.
   - It is an absolute URL starting with `https://www.u2tool.com`.
   - The path ends with a trailing slash `/` (unless it ends in a file extension like `.xml`, `.html`, etc.).
4. Find all internal `<a>` tags where `href` is relative (starts with `/`) or absolute (starts with `https://www.u2tool.com`).
   - Parse each link's path.
   - Ignore skip-patterns: empty string, starts with `#`, starts with `mailto:`, `tel:`, `javascript:`, or static asset paths like `/_astro/`, `/api/`, or files ending with `.png`, `.jpg`, `.svg`, `.json`, etc.
   - Verify that any remaining HTML page destination URL has a trailing slash in its path (e.g. `/zh/tools/json-formatter/` is valid, `/zh/tools/json-formatter` or `/zh/tools/json-formatter?a=1` is invalid).
5. Output all violations with specific file paths and the offending tag HTML.
6. Fail the process with `process.exit(1)` if any violation is found.
</action>
<verify>
Run the script locally:
`node --import tsx/esm scripts/validation/validate-canonical-slash.ts`
Confirm that if a link or canonical tag violates the trailing slash rule, it outputs errors and exits with non-zero code.
</verify>
<done>
- [ ] Write scripts/validation/validate-canonical-slash.ts.
- [ ] Verify it flags trailing-slash issues.
</done>
</task>

<hr />

<task>
<name>Implement Sitemap Dual-Stage Link Validator</name>
<files>
- scripts/validate-sitemap-fix.js
- scripts/validation/validate-sitemap-url-health.ts
- scripts/validation/validate-sitemap-urls.ts
</files>
<action>
Create a new comprehensive sitemap validator at `scripts/validation/validate-sitemap-urls.ts`.
The script will perform:
1. **Offline stage (100% check):**
   - Read the local `dist/client/sitemap.xml` index.
   - Load child sitemaps: `sitemap-priority.xml`, `sitemap-pages.xml`, `sitemap-tools.xml` directly from the local `dist/client/` directory.
   - Extract `<loc>` tags from all child sitemaps.
   - Validate each URL has the canonical host (`https://www.u2tool.com`) and trailing slash.
   - Map each URL to its local path in `dist/client/`. E.g. `https://www.u2tool.com/en/tools/json-formatter/` maps to `dist/client/en/tools/json-formatter/index.html`.
   - Assert that the local file exists. Throw an error if it does not.
2. **Online stage (smoke-test only, triggered by --online):**
   - Retrieve `FETCH_BASE_URL` (default to wrangler simulated local server `http://localhost:8787` or `PROD_BASE_URL`).
   - Group tools URLs by locale.
   - In Pages/Priority sitemaps, check 100% of URLs.
   - In Tools sitemaps, sample up to 50 URLs per locale.
   - Concurrently fetch the sampled URLs with `redirect: 'manual'` (handling retries).
   - Assert status is 200 (if 3xx redirect or other code, throw error).
</action>
<verify>
Run `node --import tsx/esm scripts/validation/validate-sitemap-urls.ts` and verify it runs successfully on local build outputs.
</verify>
<done>
- [ ] Create scripts/validation/validate-sitemap-urls.ts.
- [ ] Run sitemap URL offline checks.
</done>
</task>

<hr />

<task>
<name>Integrate Validators into QA Pipeline</name>
<files>
- package.json
</files>
<action>
Modify `package.json` to register the new validation tasks:
1. Under `"scripts"`, add:
   - `"validate:canonical-slash": "node --import tsx/esm scripts/validation/validate-canonical-slash.ts"`
   - `"validate:sitemap-urls": "node --import tsx/esm scripts/validation/validate-sitemap-urls.ts"`
2. Update the `"qa:production"` script:
   - Insert `&& npm run validate:canonical-slash && npm run validate:sitemap-urls` after the build and link checks step.
3. Update `"qa:smoke"` script to run sitemap validation in online mode:
   - Append `&& npm run validate:sitemap-urls -- --online`.
</action>
<verify>
Execute `npm run qa:production` locally and make sure it builds and passes all validators successfully.
</verify>
<done>
- [ ] Update scripts in package.json.
- [ ] Run qa:production to confirm all validators pass.
</done>
</task>
