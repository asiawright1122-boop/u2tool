import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  collectTraceabilityReportData,
  getTraceabilityIntegrityIssues,
  renderTraceabilityReport,
} from './traceability.ts';

const tempDirs: string[] = [];

function makeTempRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'traceability-'));
  tempDirs.push(root);
  return root;
}

function writeFile(root: string, relativePath: string, content: string): void {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

afterEach(() => {
  for (const tempDir of tempDirs.splice(0)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

describe('traceability generator', () => {
  it('parses the current active milestone, requirements, and phase evidence format', () => {
    const root = makeTempRoot();

    writeFile(
      root,
      '.planning/ROADMAP.md',
      `# Roadmap: U2Tool

## Archived Milestones

- [x] v0.0.27 Production QA Closure

## Active Milestone: v0.0.28 Traceability Contract Restoration

**Goal:** Restore planning traceability.

**Requirements:** [.planning/REQUIREMENTS.md](/abs/path/.planning/REQUIREMENTS.md)

**Phase plan:**

- [ ] **Phase 88** - Traceability Contract Restoration
`
    );

    writeFile(
      root,
      '.planning/REQUIREMENTS.md',
      `# Requirements: v0.0.28 - Traceability Contract Restoration

## Requirements

### Traceability Contract Restoration (TCR)

- [ ] **TCR-01** - **Current-format parser support**: Parse the current planning shape.
- [ ] **TCR-02** - **Non-empty coverage report**: Generate non-empty coverage.

## Traceability

| Requirement ID | Description | Assigned Phase | Status |
| :--- | :--- | :--- | :--- |
| **TCR-01** | Current-format parser support | Phase 88 | Planned |
| **TCR-02** | Non-empty coverage report | Phase 88 | Planned |
`
    );

    writeFile(
      root,
      '.planning/phases/88-traceability-contract-restoration/88-SUMMARY.md',
      '# Phase 88 Summary\n'
    );
    writeFile(
      root,
      '.planning/phases/88-traceability-contract-restoration/88-VALIDATION.md',
      '# Phase 88 Validation\n'
    );

    const report = collectTraceabilityReportData(root);

    expect(report.milestone).toBe('v0.0.28 Traceability Contract Restoration');
    expect(report.summary.totalRequirements).toBe(2);
    expect(report.summary.unmappedRequirements).toBe(0);
    expect(report.phaseEntries).toHaveLength(1);
    expect(report.phaseEntries[0].number).toBe('88');
    expect(report.phaseEntries[0].summaries).toEqual([
      '.planning/phases/88-traceability-contract-restoration/88-SUMMARY.md',
      '.planning/phases/88-traceability-contract-restoration/88-VALIDATION.md',
    ]);
    expect(report.requirementEntries.map((entry) => entry.id)).toEqual(['TCR-01', 'TCR-02']);
    expect(report.requirementEntries.every((entry) => entry.roadmapStatus === 'planned')).toBe(true);
    expect(getTraceabilityIntegrityIssues(report)).toEqual([]);
  });

  it('parses hyphenated requirement prefixes used by TDK warning milestones', () => {
    const root = makeTempRoot();

    writeFile(
      root,
      '.planning/ROADMAP.md',
      `# Roadmap: U2Tool

## Active Milestone: v0.0.31 TDK Compliance Warning Signal Reduction

**Goal:** Make TDK warning evidence reviewable.

**Phase plan:**

- [x] **Phase 91** - TDK Compliance Warning Signal Reduction
`
    );

    writeFile(
      root,
      '.planning/REQUIREMENTS.md',
      `# Requirements: v0.0.31 - TDK Compliance Warning Signal Reduction

## Requirements

### TDK Compliance Warning Signal Reduction (TDK-W)

- [x] **TDK-W-01** - **Fresh warning baseline capture**: Record the TDK warning baseline.
- [x] **TDK-W-02** - **Validator CLI ergonomics**: Add report and summary options.

## Traceability

| Requirement ID | Description | Assigned Phase | Status |
| :--- | :--- | :--- | :--- |
| **TDK-W-01** | Fresh warning baseline capture | Phase 91 | Complete |
| **TDK-W-02** | Validator CLI ergonomics | Phase 91 | Complete |
`
    );

    writeFile(
      root,
      '.planning/phases/91-tdk-compliance-warning-signal-reduction/91-BASELINE.md',
      '# Phase 91 Baseline\n'
    );
    writeFile(
      root,
      '.planning/milestones/v0.0.31-MILESTONE-AUDIT.md',
      '# Milestone Audit: v0.0.31\n'
    );

    const report = collectTraceabilityReportData(root);

    expect(report.milestone).toBe('v0.0.31 TDK Compliance Warning Signal Reduction');
    expect(report.summary.totalRequirements).toBe(2);
    expect(report.summary.unmappedRequirements).toBe(0);
    expect(report.requirementEntries.map((entry) => entry.id)).toEqual(['TDK-W-01', 'TDK-W-02']);
    expect(report.requirementEntries.every((entry) => entry.roadmapStatus === 'complete')).toBe(true);
    expect(getTraceabilityIntegrityIssues(report)).toEqual([]);
  });

  it('renders meaningful gaps for missing evidence and missing phase mappings', () => {
    const root = makeTempRoot();

    writeFile(
      root,
      '.planning/ROADMAP.md',
      `# Roadmap: U2Tool

## Active Milestone: v0.0.28 Traceability Contract Restoration

**Goal:** Restore planning traceability.

**Phase plan:**

- [x] **Phase 88** - Traceability Contract Restoration
`
    );

    writeFile(
      root,
      '.planning/REQUIREMENTS.md',
      `# Requirements: v0.0.28 - Traceability Contract Restoration

## Requirements

### Traceability Contract Restoration (TCR)

- [ ] **TCR-01** - **Current-format parser support**: Parse the current planning shape.
- [ ] **TCR-02** - **Non-empty coverage report**: Generate non-empty coverage.

## Traceability

| Requirement ID | Description | Assigned Phase | Status |
| :--- | :--- | :--- | :--- |
| **TCR-01** | Current-format parser support | Phase 88 | Complete |
| **TCR-02** | Non-empty coverage report | Phase 99 | Complete |
`
    );

    const report = collectTraceabilityReportData(root);
    const output = renderTraceabilityReport(report);

    const requirementOne = report.requirementEntries.find((entry) => entry.id === 'TCR-01');
    const requirementTwo = report.requirementEntries.find((entry) => entry.id === 'TCR-02');

    expect(requirementOne?.missingEvidence).toBe(true);
    expect(requirementOne?.roadmapStatus).toBe('complete');
    expect(requirementTwo?.roadmapStatus).toBe('missing');
    expect(output).toContain('TCR-01 is marked complete but has no evidence files.');
    expect(output).toContain('TCR-02 references roadmap phases that were not found: Phase 99.');
    expect(output).not.toContain('No traceability gaps detected.');
  });

  it('reports integrity issues when parsing yields an empty false-green result', () => {
    const root = makeTempRoot();

    writeFile(root, '.planning/ROADMAP.md', '# Roadmap: Empty\n');
    writeFile(root, '.planning/REQUIREMENTS.md', '# Requirements: Empty\n');

    const report = collectTraceabilityReportData(root);
    const issues = getTraceabilityIntegrityIssues(report);

    expect(report.milestone).toBe('Unknown milestone');
    expect(report.summary.totalRequirements).toBe(0);
    expect(issues).toContain('Could not identify the active milestone.');
    expect(issues).toContain('No requirements were parsed from REQUIREMENTS.md.');
    expect(issues).toContain('No phase plan entries were parsed from ROADMAP.md.');
  });
});
