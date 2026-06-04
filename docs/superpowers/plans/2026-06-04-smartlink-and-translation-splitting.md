# Performance Optimization & High-Performance Architecture Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement zero-loopback preloaded translation splitting, network-aware global prefetch event delegation, and unified iCalendar (RFC 5545) compliant helper service in Astro + Svelte 5 + Cloudflare Workers stack.

**Architecture:** 
1. Build a unified, RFC 5545 compliant helper `src/lib/ics-helper.ts` with octet-based safe line folding, escape orders, and two-step localToUtc time calculations.
2. Refactor translation loaders `src/lib/translations.ts` utilizing Vite's `import.meta.glob` to import tools translation JSON modules statically from memory instead of HTTP Loopbacks.
3. Establish a single event delegation script `src/lib/prefetch-delegation.ts` bound once in the Layout shell to perform Safari-compatible, saveData-guarded lazy prefetches for links.

**Tech Stack:** Astro 6, Svelte 5, TypeScript, Vitest, Cloudflare Workers Runtime

---

## Chunk 1: Core Performance and iCalendar Hardening

### Task 1: Unified iCalendar helper service

**Files:**
- Create: `src/lib/ics-helper.ts`
- Create: `src/lib/ics-helper.test.ts`

- [ ] **Step 1: Write the failing tests**
  Create `src/lib/ics-helper.test.ts` and write tests verifying line folding byte-limits, escape replacement sequences, and DST transition local-to-UTC calculations. Include midnight boundaries.
  
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { foldLine, escapeText, localToUtc } from './ics-helper';

  describe('ics-helper tests', () => {
    it('should correctly escape text without double-escaping slashes', () => {
      const text = 'Hello \\ World, this is a description; with newlines\nand commas,';
      // Expected escape order should yield:
      // Hello \\\\ World\, this is a description\; with newlines\nand commas\,
      expect(escapeText(text)).toBe('Hello \\\\ World\\, this is a description\\; with newlines\\nand commas\\,');
    });

    it('should fold lines under 75 bytes without truncating multi-byte UTF-8 sequences', () => {
      const longChineseText = '这是一段非常非常非常非常非常非常非常非常非常非常非常非常非常长中文描述，用来验证多字节字符在75字节边界时的安全切割和折行。';
      const folded = foldLine(`DESCRIPTION:${longChineseText}`);
      const lines = folded.split('\r\n').filter(Boolean);
      
      const encoder = new TextEncoder();
      lines.forEach((line, index) => {
        const byteLen = encoder.encode(line).length;
        // The first line has a limit of 75, subsequent lines have a 1-byte space, total limit 75.
        expect(byteLen).toBeLessThanOrEqual(75);
        if (index > 0) {
          expect(line.startsWith(' ')).toBe(true);
        }
      });
      // The content joined back (without CRLF + leading spaces) should equal initial input
      const joined = lines.map((l, i) => i === 0 ? l : l.slice(1)).join('');
      expect(joined).toBe(`DESCRIPTION:${longChineseText}`);
    });

    it('should correctly convert local venue times to UTC across DST transitions', () => {
      // New York local Spring Forward: 2026-03-08T03:30:00 local is UTC-4 (07:30:00Z)
      const localTime = '2026-03-08T03:30:00';
      const tz = 'America/New_York';
      const utcDate = localToUtc(localTime, tz);
      expect(utcDate.toISOString()).toBe('2026-03-08T07:30:00.000Z');
    });

    it('should correctly handle midnight transitions without overflow', () => {
      // Test midnight boundary: 2026-06-11T00:00:00 in Mexico City (UTC-6 -> UTC 06:00:00Z)
      const localTime = '2026-06-11T00:00:00';
      const tz = 'America/Mexico_City';
      const utcDate = localToUtc(localTime, tz);
      expect(utcDate.toISOString()).toBe('2026-06-11T06:00:00.000Z');
    });
  });
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run src/lib/ics-helper.test.ts`
  Expected: FAIL (Cannot find module or compilation error)

- [ ] **Step 3: Implement the unified ics-helper service**
  Create `src/lib/ics-helper.ts` with static TextEncoder/Decoder, correct escape rules, safe octet foldLine and two-step localToUtc iterations.

  ```typescript
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  export function escapeText(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;')
      .replace(/\r?\n/g, '\\n');
  }

  export function foldLine(input: string): string {
    const bytes = encoder.encode(input);
    let result = '';
    let start = 0;
    
    while (start < bytes.length) {
      const limit = start === 0 ? 75 : 74;
      if (bytes.length - start <= limit) {
        result += decoder.decode(bytes.subarray(start)) + '\r\n';
        break;
      }
      
      let end = start + limit;
      while (end > start && (bytes[end] & 0xC0) === 0x80) {
        end--;
      }
      
      if (end === start) {
        end = start + limit;
      }
      
      result += decoder.decode(bytes.subarray(start, end)) + '\r\n ';
      start = end;
    }
    
    return result;
  }

  export function localToUtc(localDateStr: string, timeZone: string): Date {
    const parts = localDateStr.split(/[-T:]/);
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const hour = parseInt(parts[3], 10);
    const minute = parseInt(parts[4], 10);
    const second = parts[5] ? parseInt(parts[5], 10) : 0;

    const utcDate = new Date(Date.UTC(year, month, day, hour, minute, second));
    
    const getLocalFields = (date: Date): number => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
        hourCycle: 'h23'
      });
      
      const p = formatter.formatToParts(date);
      const map: Record<string, number> = {};
      p.forEach(part => {
        if (part.type !== 'literal') map[part.type] = parseInt(part.value, 10);
      });
      
      return Date.UTC(
        map.year, 
        map.month - 1, 
        map.day, 
        map.hour === 24 ? 0 : map.hour, 
        map.minute, 
        map.second
      );
    };

    const formattedLocalTime1 = getLocalFields(utcDate);
    const diff1 = utcDate.getTime() - formattedLocalTime1;
    const candidate1 = new Date(utcDate.getTime() + diff1);

    const formattedLocalTime2 = getLocalFields(candidate1);
    if (formattedLocalTime2 === utcDate.getTime()) {
      return candidate1;
    }
    
    const offset2 = candidate1.getTime() - formattedLocalTime2;
    return new Date(utcDate.getTime() + offset2);
  }
  ```

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run src/lib/ics-helper.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  Run:
  ```bash
  git add src/lib/ics-helper.ts src/lib/ics-helper.test.ts
  git commit -m "feat: add unified iCalendar helper with safe foldLine and DST calculations"
  ```

---

### Task 2: iCalendar endpoint and calendar localization

**Files:**
- Modify: `src/pages/api/world-cup-calendar.ics.ts`
- Modify: `src/pages/api/world-cup-calendar.ics.test.ts`

- [ ] **Step 1: Refactor the endpoint to use unified helpers and placeholders**
  Modify `src/pages/api/world-cup-calendar.ics.ts` to consume `foldLine`, `escapeText`, and `localToUtc` from `src/lib/ics-helper`.
  Parse the `?locale=[locale]` query parameter and read placeholder strings (like `"1A": "A组第一"`) and teams names from the locale calculator translations mapping under `src/messages/[locale]/tools/world-cup-group-calculator.json`. If no translations are found or locale is invalid, fallback safely to default English codes. Ensure all rows are generated with UTC format `Z` time tags and lines end with `\r\n`.
- [ ] **Step 2: Update the API tests to point to the new helper**
  Modify `src/pages/api/world-cup-calendar.ics.test.ts` to adjust import paths. If the tests previously imported `foldLine` or `escapeText` locally, redirect the imports to `src/lib/ics-helper.ts` to ensure compilation matches the refactored code.
- [ ] **Step 3: Run verification**
  Run: `npx vitest run src/pages/api/world-cup-calendar.ics.test.ts`
  Expected: PASS
- [ ] **Step 4: Commit**
  Run:
  ```bash
  git add src/pages/api/world-cup-calendar.ics.ts src/pages/api/world-cup-calendar.ics.test.ts
  git commit -m "refactor: integrate compliant ics-helper and dynamic localized teams in iCal feed"
  ```

---

### Task 3: Split translation loading optimization

**Files:**
- Modify: `src/lib/translations.ts`
- Modify: `src/lib/translations.test.ts`

- [ ] **Step 1: Write a failing test for lightweight dynamic loads**
  Add a test to `src/lib/translations.test.ts` to assert that `loadDetailedToolMessages` fetches the detailed key successfully without triggering any loopback asset fetches.
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run src/lib/translations.test.ts`
  Expected: FAIL
- [ ] **Step 3: Implement Vite Glob Dynamic imports**
  Modify `src/lib/translations.ts` to declare `bundledToolMessageModules = import.meta.glob<MessagesRecord>('../messages/*/tools/*.json', { import: 'default' })`.
  Rewrite `loadDetailedToolMessages` to look up the module dynamic path from this dictionary first, preventing Loopback HTTP asset requests on Cloudflare Workers.
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run src/lib/translations.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run:
  ```bash
  git add src/lib/translations.ts src/lib/translations.test.ts
  git commit -m "perf: eliminate loopback requests via memory dynamic imports for tool translations"
  ```

---

### Task 4: Global prefetch event delegation

**Files:**
- Create: `src/lib/prefetch-delegation.ts`
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create global prefetch event delegation script**
  Create `src/lib/prefetch-delegation.ts` to listen for mouseover, mouseout, and touchstart events globally, check for `data-prefetch` anchor attributes, defer 250ms with safe connection check protection (`navigator.connection` checking for Safari support), and dynamically append `<link rel="prefetch">` to head.
- [ ] **Step 2: Integrate in BaseLayout**
  Modify `src/layouts/BaseLayout.astro` to load and initialize `prefetch-delegation.ts` on client mount.
- [ ] **Step 3: Verify TypeScript compilation**
  Run: `npm run check`
  Expected: PASS with 0 errors
- [ ] **Step 4: Commit**
  Run:
  ```bash
  git add src/lib/prefetch-delegation.ts src/layouts/BaseLayout.astro
  git commit -m "feat: implement global prefetch event delegation with connection guards"
  ```

---

### Task 5: Core pages translation lightweight tuning

**Files:**
- Modify: `src/pages/[locale]/tools.astro`
- Modify: `src/pages/[locale]/index.astro`

- [ ] **Step 1: Replace loadBaseMessages with loadBaseUiMessages**
  Update the main Astro pages `src/pages/[locale]/tools.astro` and `src/pages/[locale]/index.astro` to call `loadBaseUiMessages(locale)` instead of the giant `loadBaseMessages(locale)`, trimming down the server-side memory footprint and TTFB. Add the `data-prefetch` attribute to core navigation and category links.
- [ ] **Step 2: Run all release check gates**
  Run: `npm run verify:production`
  Expected: PASS
- [ ] **Step 3: Commit**
  Run:
  ```bash
  git add src/pages/[locale]/tools.astro src/pages/[locale]/index.astro
  git commit -m "perf: use loadBaseUiMessages on main entry hubs and attach prefetch attributes"
  ```
