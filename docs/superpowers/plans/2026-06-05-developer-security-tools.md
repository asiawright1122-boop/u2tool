# Developer & Security Tools Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert 4 high-traffic `PopularUtilityTool` placeholder tools in the Developer and Security categories into complete, fully functional, and localized Svelte 5 components with rigorous test coverage.

**Architecture:** 
Decompose the 4 tools by separating core computation/parsing algorithms into clean library modules (`src/lib/...`) with complete Vitest coverage, ensuring YAGNI and TDD discipline. Render the UIs using responsive Svelte 5 component wrappers in `src/components/tools/` styled in the dark Obsidian Gold theme.

**Tech Stack:**
- Svelte 5 (Runes: `$state`, `$derived`, `$effect`)
- Lucide-svelte (Icons)
- js-yaml (YAML serialization for Docker Compose)
- Vitest (Unit testing)

---

## Proposed Changes

### Component Registry & Routing

#### [MODIFY] [development.ts](file:///Users/kaka/Dev/u2tool/src/config/tools/development.ts:87-89)
- Modify `docker-run-to-docker-compose-converter` registration: component name `DockerRunToCompose`.
- Modify `llms-txt-generator` registration: component name `LlmsTxtGenerator`.

#### [MODIFY] [security.ts](file:///Users/kaka/Dev/u2tool/src/config/tools/security.ts:22-23)
- Modify `security-headers-checker` registration: component name `SecurityHeadersChecker`.
- Modify `csp-header-generator` registration: component name `CspHeaderGenerator`.

---

## Chunk 1: Docker Run to Compose Converter

### Task 1: Parser Core Logic (TDD)

**Files:**
- Create: `src/lib/docker-run-parser.ts`
- Test: `src/lib/docker-run-parser.test.ts`

- [ ] **Step 1: Write the failing test**
  Create `src/lib/docker-run-parser.test.ts` to verify parsing of a comprehensive `docker run` command into structured object properties.
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { parseDockerRun } from './docker-run-parser';

  describe('Docker Run Parser', () => {
    it('should parse standard docker run options correctly', () => {
      const command = 'docker run -d --name test-nginx -p 8080:80 -v /host/path:/container/path -e MY_ENV=prod --restart always nginx:alpine';
      const result = parseDockerRun(command);
      expect(result).toEqual({
        image: 'nginx:alpine',
        container_name: 'test-nginx',
        restart: 'always',
        ports: ['8080:80'],
        volumes: ['/host/path:/container/path'],
        environment: { MY_ENV: 'prod' }
      });
    });
  });
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run src/lib/docker-run-parser.test.ts`
  Expected: FAIL (Cannot find module or function)

- [ ] **Step 3: Implement docker run parser**
  Create `src/lib/docker-run-parser.ts`. Implement token extraction, handling option flags (-p, -v, -e, --name, --restart, etc.) and separating the image and command trailing tokens.
  ```typescript
  export interface DockerComposeService {
    image: string;
    container_name?: string;
    restart?: string;
    ports?: string[];
    volumes?: string[];
    environment?: Record<string, string>;
    command?: string[];
  }

  export function parseDockerRun(commandStr: string): DockerComposeService {
    const cleanCmd = commandStr.replace(/\\\n/g, ' ').trim();
    // Simple token splitter handling spaces and quoted arguments
    const tokens: string[] = [];
    let current = '';
    let inQuote: string | null = null;
    
    for (let i = 0; i < cleanCmd.length; i++) {
      const char = cleanCmd[i];
      if ((char === '"' || char === "'") && (i === 0 || cleanCmd[i - 1] !== '\\')) {
        if (inQuote === char) {
          inQuote = null;
        } else if (!inQuote) {
          inQuote = char;
        }
      } else if (char === ' ' && !inQuote) {
        if (current) {
          tokens.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }
    if (current) tokens.push(current);

    if (tokens[0] === 'docker' && tokens[1] === 'run') {
      tokens.splice(0, 2);
    } else if (tokens[0] === 'run') {
      tokens.shift();
    }

    const service: DockerComposeService = { image: '' };
    const trailingArgs: string[] = [];
    let i = 0;

    while (i < tokens.length) {
      const token = tokens[i];
      if (token.startsWith('-')) {
        if (token === '-d' || token === '--detach') {
          i++;
        } else if (token === '--name') {
          service.container_name = tokens[i + 1];
          i += 2;
        } else if (token === '-p' || token === '--publish') {
          service.ports = service.ports || [];
          service.ports.push(tokens[i + 1]);
          i += 2;
        } else if (token === '-v' || token === '--volume') {
          service.volumes = service.volumes || [];
          service.volumes.push(tokens[i + 1]);
          i += 2;
        } else if (token === '-e' || token === '--env') {
          const envVal = tokens[i + 1];
          const eqIdx = envVal.indexOf('=');
          if (eqIdx !== -1) {
            service.environment = service.environment || {};
            const key = envVal.substring(0, eqIdx);
            const val = envVal.substring(eqIdx + 1);
            service.environment[key] = val.replace(/^["']|["']$/g, '');
          }
          i += 2;
        } else if (token === '--restart') {
          service.restart = tokens[i + 1];
          i += 2;
        } else {
          // Unknown flag, skip for simple YAGNI parsing
          i++;
        }
      } else {
        trailingArgs.push(token);
        i++;
      }
    }

    if (trailingArgs.length > 0) {
      service.image = trailingArgs[0];
      if (trailingArgs.length > 1) {
        service.command = trailingArgs.slice(1);
      }
    }

    return service;
  }
  ```

- [ ] **Step 4: Verify test passes**
  Run: `npx vitest run src/lib/docker-run-parser.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  Run: `git add src/lib/docker-run-parser.ts src/lib/docker-run-parser.test.ts`
  Run: `git commit -m "feat: implement core docker run command parser with tests"`

---

### Task 2: Docker Run to Compose UI Component

**Files:**
- Create: `src/components/tools/DockerRunToCompose.svelte`

- [ ] **Step 1: Implement Svelte component**
  Write `src/components/tools/DockerRunToCompose.svelte` with:
  - Input textarea for raw `docker run` command.
  - Svelte 5 `$derived` state that automatically calls `parseDockerRun` and serializes the result into a clean YAML file using `js-yaml`.
  - Output display pane with copy-to-clipboard, download `.yml` file, and clear options.
  - Complete 10-locale `I18N_BACKUP` mapping for UI text.
  - Styled using the stone-950 background, gold/amber accent buttons, and glassmorphic inputs.

- [ ] **Step 2: Add Component verification tests**
  Add unit tests in `src/components/tools/FinanceCalculators.test.ts` or a new test file `src/components/tools/DeveloperTools.test.ts` verifying correct component rendering and reactivity.

- [ ] **Step 3: Commit**
  Run: `git add src/components/tools/DockerRunToCompose.svelte`
  Run: `git commit -m "feat: implement DockerRunToCompose UI component"`

---

## Chunk 2: LLMs.txt Generator

### Task 3: LLMs.txt Serialization Logic (TDD)

**Files:**
- Create: `src/lib/llms-txt-generator-helper.ts`
- Test: `src/lib/llms-txt-generator-helper.test.ts`

- [ ] **Step 1: Write the failing test**
  Create `src/lib/llms-txt-generator-helper.test.ts` to verify serialization output.
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { generateLlmsTxt, type LlmsTxtData } from './llms-txt-generator-helper';

  describe('llms.txt Generator Helper', () => {
    it('should format document structures into compliant markdown', () => {
      const data: LlmsTxtData = {
        title: 'My Project',
        summary: 'A short description',
        detail: 'More detailed info.',
        sections: [
          {
            title: 'Docs',
            items: [
              { title: 'API Guide', url: 'https://example.com/api', description: 'API docs', type: 'api' }
            ]
          }
        ]
      };
      const markdown = generateLlmsTxt(data);
      expect(markdown).toContain('# My Project');
      expect(markdown).toContain('> A short description');
      expect(markdown).toContain('## Docs');
      expect(markdown).toContain('- [API Guide](https://example.com/api) [api]: API docs');
    });
  });
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run src/lib/llms-txt-generator-helper.test.ts`
  Expected: FAIL

- [ ] **Step 3: Implement serializer**
  Create `src/lib/llms-txt-generator-helper.ts`:
  ```typescript
  export interface LlmsTxtItem {
    title: string;
    url: string;
    description?: string;
    type?: string;
  }

  export interface LlmsTxtSection {
    title: string;
    items: LlmsTxtItem[];
  }

  export interface LlmsTxtData {
    title: string;
    summary: string;
    detail?: string;
    sections: LlmsTxtSection[];
  }

  export function generateLlmsTxt(data: LlmsTxtData): string {
    let output = `# ${data.title.trim()}\n\n`;
    if (data.summary) {
      output += `> ${data.summary.trim()}\n\n`;
    }
    if (data.detail) {
      output += `${data.detail.trim()}\n\n`;
    }

    for (const section of data.sections) {
      if (!section.title.trim()) continue;
      output += `## ${section.title.trim()}\n\n`;
      for (const item of section.items) {
        if (!item.title.trim() || !item.url.trim()) continue;
        const typeStr = item.type ? ` [${item.type.trim()}]` : '';
        const descStr = item.description ? `: ${item.description.trim()}` : '';
        output += `- [${item.title.trim()}](${item.url.trim()})${typeStr}${descStr}\n`;
      }
      output += '\n';
    }

    return output.trim();
  }
  ```

- [ ] **Step 4: Verify test passes**
  Run: `npx vitest run src/lib/llms-txt-generator-helper.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  Run: `git add src/lib/llms-txt-generator-helper.ts src/lib/llms-txt-generator-helper.test.ts`
  Run: `git commit -m "feat: implement llms.txt formatter and tests"`

---

### Task 4: LLMs.txt UI Generator Component

**Files:**
- Create: `src/components/tools/LlmsTxtGenerator.svelte`

- [ ] **Step 1: Implement Svelte component**
  Write Svelte 5 component with:
  - Form inputs for Project Title, Summary, Details.
  - Interactive grid to add multiple Sections.
  - For each Section, support adding items (Title, URL, Type, Description).
  - Output textarea showing generated `llms.txt` code on the fly.
  - Dark titanium UI themed with Amber highlighting.
  - Core 10-locale backup dictionary.

- [ ] **Step 2: Commit**
  Run: `git add src/components/tools/LlmsTxtGenerator.svelte`
  Run: `git commit -m "feat: implement LlmsTxtGenerator UI component"`

---

## Chunk 3: CSP Header Generator

### Task 5: CSP String Builder Logic (TDD)

**Files:**
- Create: `src/lib/csp-generator-helper.ts`
- Test: `src/lib/csp-generator-helper.test.ts`

- [ ] **Step 1: Write the failing test**
  Create `src/lib/csp-generator-helper.test.ts` to assert correct CSP header concatenations.
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { buildCspHeader } from './csp-generator-helper';

  describe('CSP Header Builder', () => {
    it('should format directive choices into correct CSP strings', () => {
      const directives = {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", 'apis.google.com'],
        'upgrade-insecure-requests': true
      };
      const header = buildCspHeader(directives);
      expect(header).toBe("default-src 'self'; script-src 'self' 'unsafe-inline' apis.google.com; upgrade-insecure-requests;");
    });
  });
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run src/lib/csp-generator-helper.test.ts`
  Expected: FAIL

- [ ] **Step 3: Implement builder**
  Create `src/lib/csp-generator-helper.ts`:
  ```typescript
  export interface CspConfig {
    [key: string]: string[] | boolean | undefined;
  }

  export function buildCspHeader(config: CspConfig): string {
    const parts: string[] = [];

    const keys = Object.keys(config);
    for (const key of keys) {
      const val = config[key];
      if (typeof val === 'boolean') {
        if (val) parts.push(key);
      } else if (Array.isArray(val) && val.length > 0) {
        // Clean values, mapping special directives if not already quoted
        const cleanVals = val.map(v => {
          const lower = v.toLowerCase();
          if (['self', 'unsafe-inline', 'unsafe-eval', 'none', 'strict-dynamic', 'unsafe-hashes'].includes(lower)) {
            return `'${lower}'`;
          }
          return v;
        });
        parts.push(`${key} ${cleanVals.join(' ')}`);
      }
    }

    return parts.join('; ') + (parts.length > 0 ? ';' : '');
  }
  ```

- [ ] **Step 4: Verify test passes**
  Run: `npx vitest run src/lib/csp-generator-helper.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  Run: `git add src/lib/csp-generator-helper.ts src/lib/csp-generator-helper.test.ts`
  Run: `git commit -m "feat: implement CSP header compiler and tests"`

---

### Task 6: CSP Generator UI Component

**Files:**
- Create: `src/components/tools/CspHeaderGenerator.svelte`

- [ ] **Step 1: Implement Svelte component**
  Create CSP generation form:
  - Presets select options: "Strict Secure", "Relaxed", "Custom".
  - Checkboxes for `'self'`, `'unsafe-inline'`, `'unsafe-eval'` under standard source scopes.
  - Multi-tag inputs to add custom host domain boundaries.
  - Interactive outputs: Raw header string, HTML meta tag string, and server snippet snippets (Nginx, Apache).
  - Dark titanium Obsidian gold UI with copy-text alerts.

- [ ] **Step 2: Commit**
  Run: `git add src/components/tools/CspHeaderGenerator.svelte`
  Run: `git commit -m "feat: implement CspHeaderGenerator UI component"`

---

## Chunk 4: Security Headers Checker

### Task 7: Headers Auditor Logic (TDD)

**Files:**
- Create: `src/lib/security-headers-audit.ts`
- Test: `src/lib/security-headers-audit.test.ts`

- [ ] **Step 1: Write the failing test**
  Create `src/lib/security-headers-audit.test.ts` to check grade calculations.
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { auditHeaders } from './security-headers-audit';

  describe('Security Headers Auditor', () => {
    it('should score and grade headers properly', () => {
      const rawHeaders = `
        Content-Security-Policy: default-src 'self'
        Strict-Transport-Security: max-age=31536000; includeSubDomains
        X-Frame-Options: SAMEORIGIN
        X-Content-Type-Options: nosniff
      `;
      const report = auditHeaders(rawHeaders);
      expect(report.score).toBeGreaterThanOrEqual(80);
      expect(['A', 'A+']).toContain(report.grade);
      expect(report.missing).toContain('Referrer-Policy');
    });
  });
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run src/lib/security-headers-audit.test.ts`
  Expected: FAIL

- [ ] **Step 3: Implement auditing engine**
  Create `src/lib/security-headers-audit.ts`:
  ```typescript
  export interface AuditReport {
    score: number;
    grade: string;
    headers: Record<string, string>;
    missing: string[];
    warnings: string[];
  }

  export function auditHeaders(rawText: string): AuditReport {
    const headers: Record<string, string> = {};
    const lines = rawText.split('\n');

    for (const line of lines) {
      const cleanLine = line.trim();
      if (!cleanLine || cleanLine.startsWith('#') || cleanLine.startsWith('//')) continue;
      const colonIdx = cleanLine.indexOf(':');
      if (colonIdx !== -1) {
        const key = cleanLine.substring(0, colonIdx).trim().toLowerCase();
        const val = cleanLine.substring(colonIdx + 1).trim();
        headers[key] = val;
      }
    }

    let score = 0;
    const missing: string[] = [];
    const warnings: string[] = [];

    // CSP: Max 30
    if (headers['content-security-policy']) {
      score += 30;
      const csp = headers['content-security-policy'].toLowerCase();
      if (csp.includes("'unsafe-inline'")) {
        score -= 10;
        warnings.push("CSP allows 'unsafe-inline' which reduces XSS protection.");
      }
      if (csp.includes('*')) {
        score -= 10;
        warnings.push("CSP directive uses wildcard '*' which is over-permissive.");
      }
    } else {
      missing.push('Content-Security-Policy');
    }

    // HSTS: Max 20
    if (headers['strict-transport-security']) {
      score += 20;
      const hsts = headers['strict-transport-security'].toLowerCase();
      if (!hsts.includes('max-age')) {
        score -= 10;
        warnings.push('HSTS is missing max-age directive.');
      } else {
        const match = hsts.match(/max-age=(\d+)/);
        if (match && parseInt(match[1]) < 15768000) {
          score -= 5;
          warnings.push('HSTS max-age is set to less than 6 months (15,768,000s).');
        }
      }
    } else {
      missing.push('Strict-Transport-Security');
    }

    // X-Frame-Options: Max 15
    if (headers['x-frame-options']) {
      score += 15;
      const xfo = headers['x-frame-options'].toUpperCase();
      if (xfo !== 'DENY' && xfo !== 'SAMEORIGIN') {
        score -= 5;
        warnings.push('X-Frame-Options should be set to DENY or SAMEORIGIN.');
      }
    } else {
      missing.push('X-Frame-Options');
    }

    // X-Content-Type-Options: Max 15
    if (headers['x-content-type-options']) {
      if (headers['x-content-type-options'].toLowerCase() === 'nosniff') {
        score += 15;
      } else {
        warnings.push('X-Content-Type-Options should be set to nosniff.');
      }
    } else {
      missing.push('X-Content-Type-Options');
    }

    // Referrer-Policy: Max 10
    if (headers['referrer-policy']) {
      score += 10;
      const ref = headers['referrer-policy'].toLowerCase();
      if (ref === 'unsafe-url' || ref === 'no-referrer-when-downgrade') {
        score -= 5;
        warnings.push('Referrer-Policy is configured to a weak security model.');
      }
    } else {
      missing.push('Referrer-Policy');
    }

    // Permissions-Policy: Max 10
    if (headers['permissions-policy']) {
      score += 10;
    } else {
      missing.push('Permissions-Policy');
    }

    // Grade Mapping
    let grade = 'F';
    if (score >= 90) grade = missing.length === 0 ? 'A+' : 'A';
    else if (score >= 75) grade = 'B';
    else if (score >= 60) grade = 'C';
    else if (score >= 40) grade = 'D';

    return { score, grade, headers, missing, warnings };
  }
  ```

- [ ] **Step 4: Verify test passes**
  Run: `npx vitest run src/lib/security-headers-audit.test.ts`
  Expected: PASS

- [ ] **Step 5: Commit**
  Run: `git add src/lib/security-headers-audit.ts src/lib/security-headers-audit.test.ts`
  Run: `git commit -m "feat: implement security headers auditor and tests"`

---

### Task 8: Security Headers Checker UI Component

**Files:**
- Create: `src/components/tools/SecurityHeadersChecker.svelte`

- [ ] **Step 1: Implement Svelte component**
  Write Svelte 5 component supporting:
  - Pasteur input box for raw response headers text.
  - Live auditor scoring visual gauge (colored depending on Grade: green A, amber B/C, red D/F).
  - Detailed audit rows listing missing items, warnings, and safe configurations.
  - Interactive "How to Fix" panels with tab code block copy templates (Nginx, Apache, Node/Helmet).
  - Custom i18n backup config.

- [ ] **Step 2: Commit**
  Run: `git add src/components/tools/SecurityHeadersChecker.svelte`
  Run: `git commit -m "feat: implement SecurityHeadersChecker UI component"`

---

## Chunk 5: Integration & Verification

### Task 9: Configuration & Dynamic Mapping

**Files:**
- Modify: `src/config/tools/development.ts`
- Modify: `src/config/tools/security.ts`
- Modify: `src/components/tools/ToolImportMap.ts`

- [ ] **Step 1: Map components inside configuration**
  Update Svelte component mappings in `src/config/tools/development.ts` and `src/config/tools/security.ts` replacing `PopularUtilityTool` with real names.

- [ ] **Step 2: Rebuild import map**
  Run: `npm run tools:generate-import-map`
  Expected: Rebuild successful, 4 new Svelte files correctly imported inside `ToolImportMap.ts`.

- [ ] **Step 3: Run full QA Pipeline**
  Verify that the code compile, lints, passes all tests and pre-renders completely.
  Run: `npm run check && npm run qa:seo-governance && npm run qa:runtime-integrity && npm run validate:runtime-placeholder-regressions && npm run build`
  Expected: All checks PASS with exit code 0.

- [ ] **Step 4: Commit**
  Run: `git add src/config/tools/development.ts src/config/tools/security.ts src/components/tools/ToolImportMap.ts`
  Run: `git commit -m "chore: register Phase 46 components and rebuild ToolImportMap"`

---

## Verification Plan

### Automated Tests
- Run `npx vitest run src/lib/docker-run-parser.test.ts`
- Run `npx vitest run src/lib/llms-txt-generator-helper.test.ts`
- Run `npx vitest run src/lib/csp-generator-helper.test.ts`
- Run `npx vitest run src/lib/security-headers-audit.test.ts`
- Run the full project validation gate: `npm run check && npm run qa:seo-governance && npm run qa:runtime-integrity && npm run validate:runtime-placeholder-regressions && npm run build`

### Manual Verification
- Deploy locally `npm run dev` and navigate to:
  - `/zh/docker-run-to-docker-compose-converter/`
  - `/zh/llms-txt-generator/`
  - `/zh/csp-header-generator/`
  - `/zh/security-headers-checker/`
- Test basic usage for each tool (e.g. pasting docker run command, pasting headers, choosing CSP parameters, checking outputs). Ensure responsive CSS and dark Obsidian theme render beautifully.
