#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
  collectTraceabilityReportData,
  getTraceabilityIntegrityIssues,
  renderTraceabilityReport,
} from './traceability.ts';

const outputPath = path.join(process.cwd(), '.planning', 'TRACEABILITY.md');

const data = collectTraceabilityReportData();
const report = renderTraceabilityReport(data);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, report, 'utf8');
console.log(`Traceability report written to ${outputPath}`);

const issues = getTraceabilityIntegrityIssues(data);
if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`Traceability integrity issue: ${issue}`);
  }
  process.exitCode = 1;
}
