# Task 2 Report: Real Browser Hex File Editor

## Status

DONE

Implementation commit: `9e032c811bd5915b07431703cd6e6b3a2116ef0d`

## Delivered

- Added a pure `Uint8Array` byte model with 16-byte rows, printable ASCII previews, immutable edits, strict hex parsing, overlapping hex/ASCII search, UTF-8 conversion, a 2 MiB boundary helper, and `formatHexOffset()` for uppercase zero-padded display offsets.
- Replaced the text-only component with hydrated `File Editor` and `Text Converter` modes.
- Added local file selection with no network request, a paged editable byte/ASCII grid, full-file hex and ASCII search with previous/next navigation, modified-byte count, reset, and Blob download using `.modified` before the original extension.
- Enforced the inclusive 2 MiB pilot limit. The grid renders 256 bytes per page so a valid 2 MiB file does not create millions of DOM inputs.
- Promoted the Hex capability profile to `2.0.0` and `release-blocking`, with exact structured evidence for every mode, input, output, browser feature, limit, and the language-neutral engine.
- Removed the obsolete file-grid, byte-edit, encoding, and export prohibitions after browser evidence passed. Added localized claim protection for disassembly, remote URL/cloud workflows, executable or malware analysis, and professional reverse-engineering workflows.
- Updated all 10 aggregate, 10 base, and 10 split Hex catalogs. Added root/base parity and truthful local-browser/2 MiB assertions.
- Added the English Hex route to the render matrix with capability version, local-processing, tab, and limit sentinels.
- Preserved Grammar Checker `1.1.0` release-ready gates.

## RED / GREEN Record

### Pure byte model

Initial RED command:

```text
npx vitest run src/lib/hex-editor.test.ts
```

Initial result: failed before collection because `src/lib/hex-editor.ts` did not exist.

Incremental tracer bullets then produced observable RED failures before each minimal implementation:

- row/offset tracer: missing module, then 1/1 GREEN;
- immutable byte edit tracer: 2 tests, 1 failed, then 2/2 GREEN;
- overlapping search tracer: 3 tests, 1 failed, then 3/3 GREEN;
- UTF-8 conversion tracer: 4 tests, 1 failed, then 4/4 GREEN;
- 2 MiB boundary tracer: 5 tests, 1 failed, then 5/5 GREEN.

Covered edge cases: empty files and searches, printable `0x20` through `0x7E`, non-printable `.`, invalid offset `RangeError`, invalid/incomplete hex `TypeError`, immutable edits, overlapping matches, Unicode UTF-8, and exact 2 MiB versus 2 MiB + 1.

### Hydrated browser component

First browser RED command:

```text
npx vitest run src/components/tools/HexEditor.test.ts
```

Result: 1/1 failed while waiting for the absent local-file input.

After implementation: 1/1 GREEN for the local file, tabs, zero-network, 16-byte row, padded offset, and ASCII-preview tracer.

The paging regression was also demonstrated RED then GREEN:

```text
npx vitest run src/components/tools/HexEditor.test.ts -t "pages the byte grid"
```

RED: expected 16 rendered rows, received 17. GREEN: 1/1 passed with a 256-byte first page and absolute next-page offset `00000100`.

Final hydrated browser coverage is 6/6:

- visible File Editor and Text Converter tabs;
- actual local file selection with zero post-selection requests;
- zero-padded offsets, 16-byte rows, editable hex bytes and printable ASCII;
- hex and ASCII search with next/previous match navigation;
- modified count and reset-to-original;
- captured Blob bytes and `firmware.modified.bin` download name;
- visible rejection for a 2 MiB + 1 file;
- UTF-8 text-to-hex, hex-to-text, and incomplete-hex error behavior;
- bounded grid paging with absolute offsets.

## Verification

Final combined targeted command:

```text
npx vitest run src/lib/hex-editor.test.ts src/components/tools/HexEditor.test.ts src/config/tool-capabilities/index.test.ts src/lib/tool-capability-claims.test.ts src/lib/support-content-fallback.test.ts src/messages/hex-editor-catalog.test.ts scripts/validation/tool-page-render-contract.test.ts
```

Result: 7 files passed, 540 tests passed, 0 failed. This includes the brief's required 509 model/registry/claim/support tests plus 31 hydrated browser, catalog-parity, and render-contract tests.

Capability claims:

```text
npm run validate:tool-capability-claims
```

Result: passed, `profiles=6 localePages=60 issues=0`.

Release-ready execution:

```text
npm run validate:tool-capability-claims -- --require-release-ready hex-editor
```

Result: passed, `profiles=6 localePages=60 issues=0`; every structured evidence reference was run by exact test name.

Type and framework diagnostics:

```text
npm run check
```

Result: exit 0, 0 errors, 13 pre-existing repository hints outside the Hex implementation.

Production build:

```text
npm run build
```

Result: exit 0; Cloudflare server build completed successfully in 55.88 seconds.

Live SSR route contract:

```text
npm run validate:tool-page-render-contract -- --base-url http://127.0.0.1:4321 --filter hex-editor --timeout-ms 60000
```

Result: 1 route passed, 0 failed for `en/hex-editor`.

The first 15-second probe timed out during the dev server's cold whole-app Vite compilation. The warmed route returned immediately and passed the complete contract; no rendered drift was reported.

Whitespace check:

```text
git diff --check
```

Result: exit 0.

## Self-review

- Evidence names are direct static `it(...)` declarations with the exact required `[capability:hex-editor:<category>:<item-id>]` markers.
- Evidence tests assert public byte-model behavior or real rendered/hydrated behavior; none are source-string or file-existence tests.
- `HexRow.offset` remains numeric. Presentation padding is isolated in the tested `formatHexOffset()` helper.
- File processing uses `File.arrayBuffer`, `Uint8Array`, `Blob`, and an object URL only. File selection and editing do not issue network requests.
- The UI has no disassembly, encoding selector, remote URL, executable analysis, malware analysis, or format-interpretation workflow.
- Copy and capability text avoid unlimited-file, application-validity preservation, and professional reverse-engineering claims.
- Root/base parity passes in every locale, and all split capability labels resolve for release-blocking disclosure.
- The tracked Astro/Puppeteer fixture is cleaned after tests and contains no generated build output.

## Concerns

- No release-blocking concern remains.
- The local dev server's first full-project compilation exceeded the render validator's default 15-second timeout in this worktree. The production build passed, and the warm live SSR route passed with the explicit 60-second timeout.
- Arbitrary byte edits can invalidate format-specific files; localized copy explicitly warns users to keep the original and validate the modified copy in the owning application.
