# Phase 63: Hreflang & TDK Loop & Translation Integrity - Research

## Objective
Answer the question: "What do I need to know to PLAN this phase well?"
The objective is to implement HTDK-01 and HTDK-02 requirements by creating validation scripts that audit the generated HTML output in `dist/client/`. 

## 1. Hreflang Symmetrical Validation (`validate-hreflang-scc.ts`)
Requirement **HTDK-01**: Validate that 10-locale alternate pages form a strongly connected component (SCC).

### Graph Modeling & Symmetrical Checking (D-01 & D-02)
- **Scope:** Scan **all** `.html` files in `dist/client/` using `glob('**/*.html', { cwd: distDir })`.
- **Node definition**: Each physical HTML file parsed is considered a node.
- **Edges definition**: Extracted `<link rel="alternate" hreflang="..." href="...">` URLs are the outgoing edges.
- **Validation Rules**:
  1. **Physical Reachability**: The target `href` must map to a physically existing file path in the `dist/client/` directory (e.g., `fs.existsSync(targetPath)`).
  2. **Bidirectional Symmetry (SCC Loop)**: If page A points to page B as an alternate, then page B must exist and point back to page A as an alternate. In a fully interconnected cluster (like 10 locales), all 10 nodes must contain the exact same set of 10 alternate URLs (and optionally 11 if `x-default` is used).
  3. **Strictness**: Break the build (`process.exit(1)`) immediately if ANY asymmetrical loop, broken link, or missing self-referential tag is detected.

### Implementation Details
- Rely on `cheerio` to parse the HTML (`$('link[rel="alternate"]')`).
- Convert absolute URLs in the `href` attribute back to local paths using `process.env.CANONICAL_BASE_URL` (similarly to how it's handled in `validate-canonical-slash.ts`).

## 2. TDK Translation Integrity Validation (`validate-tdk-translations.ts`)
Requirement **HTDK-02**: Audit all-locale Title and Description tags against English fallbacks.

### Translation Logic & Detection (D-03)
- **Scope**: Glob all `**/*.html` files and filter for non-English pages (e.g. `zh/`, `es/`, `ja/`).
- **Parsing**: Use `cheerio` to extract the `<title>` text and `<meta name="description" content="...">` value.
- **Load Reference Context**: Read the English JSON reference values from `src/messages/en.json` (and `src/messages/en/base.json`). Using the path signature (e.g., `/zh/tools/base64/index.html`), identify the tool slug (`base64`) and look up `tools.base64.seo_title` and `tools.base64.seo_description` from the English translations.
- **Validation Rules**:
  1. If the locale is NOT `en` and the extracted localized TDK value is exactly equal to the English JSON value, flag it as a missing translation / fallback error.
  2. Verify there are no raw template variables/placeholders such as `TODO`, `PLACEHOLDER`, `MISSING`, or `${BASE_URL}`. (We can borrow logic from `validate-tdk-integrity.ts`).

## Validation Architecture
*(Mandatory for Nyquist verification framework compliance)*

### Testing Strategy
1. **Script Registration**: 
   - Both validation scripts must be executable via `node --import tsx/esm scripts/validation/validate-hreflang-scc.ts` and `node --import tsx/esm scripts/validation/validate-tdk-translations.ts`.
   - They must be integrated into `package.json` under the `qa:production` pipeline to run sequentially before or alongside other post-build checks.
2. **Execution Context**:
   - The tests operate on the physical build output directory `dist/client/`. 
   - The validation framework relies entirely on static analysis of the HTML build artifacts; no network requests are made.
3. **Mock Expectations**:
   - For TDK translation detection, if a mock or dummy tool is introduced in the build, the test should detect the exact English match in the non-English pages and fail.
   - For Hreflang loops, the test must simulate a "missing link" scenario in a mock HTML to guarantee the script correctly throws a non-zero exit code.
4. **Automated Validation Checks**:
   - The script must fail if `dist/client/` is not present.
   - The script must log the exact file paths (`dist/client/zh/tools/base64/index.html`) and the exact validation failure (e.g. `[HTDK-01] Missing reciprocal hreflang link to /es/tools/base64/`).
   - Exit with `process.exit(1)` on any detection of asymmetric graph or translation fallback to fail the CI/CD pipeline immediately.
