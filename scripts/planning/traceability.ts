import fs from 'node:fs';
import path from 'node:path';

export interface RequirementEntry {
  area: string;
  id: string;
  status: 'complete' | 'pending';
  title: string;
}

export interface PhasePlanEntry {
  checked: boolean;
  id: string;
  title: string;
}

export interface PhaseEntry {
  goal: string;
  name: string;
  number: string;
  requirementIds: string[];
  summaries: string[];
  plans: PhasePlanEntry[];
}

export interface RequirementTraceabilityEntry extends RequirementEntry {
  evidenceFiles: string[];
  mappedPhases: string[];
  missingEvidence: boolean;
  roadmapStatus: 'complete' | 'missing' | 'partial' | 'planned';
}

export interface TraceabilitySummary {
  completeRequirements: number;
  missingEvidenceRequirements: number;
  totalRequirements: number;
  unmappedRequirements: number;
}

export interface TraceabilityReportData {
  generatedAt: string;
  milestone: string;
  phaseEntries: PhaseEntry[];
  requirementEntries: RequirementTraceabilityEntry[];
  rootDir: string;
  summary: TraceabilitySummary;
}

interface RequirementTableEntry {
  mappedPhases: string[];
  status: RequirementEntry['status'];
  title: string;
}

const PHASE_EVIDENCE_SUFFIXES = [
  '-SUMMARY.md',
  '-VALIDATION.md',
  '-VERIFICATION.md',
  '-BASELINE.md',
];

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function normalizePhaseNumber(value: string): string {
  if (value.includes('.')) {
    return value.replace(/^0+(?=\d)/, '');
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? String(parsed) : value.trim();
}

function normalizePhaseLabel(value: string): string {
  const match = value.match(/Phase\s+([0-9.]+)/i);
  if (match) {
    return `Phase ${normalizePhaseNumber(match[1])}`;
  }

  return value.trim();
}

function normalizeRequirementStatus(value: string, fallback: RequirementEntry['status'] = 'pending'): RequirementEntry['status'] {
  const normalized = value.trim().toLowerCase();

  if (['complete', 'completed', 'done', 'pass', 'passed'].includes(normalized)) {
    return 'complete';
  }

  if (['pending', 'planned', 'todo', 'open', 'in progress', 'in-progress'].includes(normalized)) {
    return 'pending';
  }

  return fallback;
}

function dedupe<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function extractActiveMilestoneSection(roadmapContent: string): { block: string; milestone: string } | null {
  const match = roadmapContent.match(/^## Active Milestone:\s+(.+)$/m);
  if (!match || match.index === undefined) {
    return null;
  }

  const sectionStart = match.index;
  const sectionBodyStart = sectionStart + match[0].length;
  const remainder = roadmapContent.slice(sectionBodyStart);
  const nextHeadingOffset = remainder.search(/^##\s+/m);
  const sectionEnd = nextHeadingOffset === -1 ? roadmapContent.length : sectionBodyStart + nextHeadingOffset;

  return {
    block: roadmapContent.slice(sectionStart, sectionEnd),
    milestone: match[1].trim(),
  };
}

function parseMilestone(roadmapContent: string, requirementsContent: string): string {
  const activeMilestone = extractActiveMilestoneSection(roadmapContent);
  if (activeMilestone) {
    return activeMilestone.milestone;
  }

  const legacyRoadmapMatch = roadmapContent.match(/\*\*Milestone:\*\*\s+(.+)/);
  if (legacyRoadmapMatch) {
    return legacyRoadmapMatch[1].trim();
  }

  const requirementsMatch = requirementsContent.match(/^# Requirements:\s+(v[0-9.]+)\s+-\s+(.+)$/m);
  if (requirementsMatch) {
    return `${requirementsMatch[1]} ${requirementsMatch[2]}`.trim();
  }

  return 'Unknown milestone';
}

function parseRequirements(requirementsContent: string): RequirementEntry[] {
  const entries: RequirementEntry[] = [];
  let currentArea = 'General';

  for (const line of requirementsContent.split('\n')) {
    const headingMatch = line.match(/^###\s+(.+)$/);
    if (headingMatch) {
      currentArea = headingMatch[1].trim();
      continue;
    }

    const currentFormatMatch = line.match(/^- \[(x| )\]\s+\*\*([A-Z]+-\d+)\*\*\s+-\s+\*\*(.+?)\*\*:\s+(.+)$/);
    if (currentFormatMatch) {
      entries.push({
        area: currentArea,
        id: currentFormatMatch[2],
        status: currentFormatMatch[1] === 'x' ? 'complete' : 'pending',
        title: currentFormatMatch[3].trim(),
      });
      continue;
    }

    const currentFallbackMatch = line.match(/^- \[(x| )\]\s+\*\*([A-Z]+-\d+)\*\*\s+-\s+(.+)$/);
    if (currentFallbackMatch) {
      entries.push({
        area: currentArea,
        id: currentFallbackMatch[2],
        status: currentFallbackMatch[1] === 'x' ? 'complete' : 'pending',
        title: currentFallbackMatch[3].trim(),
      });
      continue;
    }

    const legacyMatch = line.match(/^- \[(x| )\]\s+([A-Z]+-\d+):\s+(.+)$/);
    if (legacyMatch) {
      entries.push({
        area: currentArea,
        id: legacyMatch[2],
        status: legacyMatch[1] === 'x' ? 'complete' : 'pending',
        title: legacyMatch[3].trim(),
      });
    }
  }

  return entries;
}

function parseRequirementTraceabilityTable(requirementsContent: string): Map<string, RequirementTableEntry> {
  const entries = new Map<string, RequirementTableEntry>();

  for (const rawLine of requirementsContent.split('\n')) {
    const line = rawLine.trim();
    const currentFormatMatch = line.match(/^\|\s+\*\*([A-Z]+-\d+)\*\*\s+\|\s+(.+?)\s+\|\s+(.+?)\s+\|\s+(.+?)\s+\|$/);
    const legacyFormatMatch = line.match(/^\|\s*([A-Z]+-\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/);
    const match = currentFormatMatch ?? legacyFormatMatch;

    if (!match || match[1] === 'Requirement ID') {
      continue;
    }

    const mappedPhases = dedupe(
      match[3]
        .split(/<br\s*\/?>|,/i)
        .map((value) => value.trim())
        .filter(Boolean)
        .map(normalizePhaseLabel)
    );

    entries.set(match[1], {
      mappedPhases,
      status: normalizeRequirementStatus(match[4]),
      title: match[2].trim(),
    });
  }

  return entries;
}

function parsePhasePlans(block: string): PhasePlanEntry[] {
  return block
    .split('\n')
    .map((line) => line.match(/^- \[(x| )\]\s+([0-9-]+):\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => ({
      checked: match[1] === 'x',
      id: match[2],
      title: match[3].trim(),
    }));
}

function collectPhaseEvidenceFiles(phaseNumber: string, planningDir: string): string[] {
  const phaseDir = path.join(planningDir, 'phases');
  if (!fs.existsSync(phaseDir)) {
    return [];
  }

  const paddedNumber = normalizePhaseNumber(phaseNumber).padStart(2, '0');

  return fs
    .readdirSync(phaseDir)
    .filter((dirName) => dirName.startsWith(`${paddedNumber}-`))
    .flatMap((dirName) => {
      const fullDir = path.join(phaseDir, dirName);
      return fs
        .readdirSync(fullDir)
        .filter((fileName) => PHASE_EVIDENCE_SUFFIXES.some((suffix) => fileName.endsWith(suffix)))
        .map((fileName) => path.join('.planning', 'phases', dirName, fileName));
    })
    .sort();
}

function parseLegacyPhases(roadmapContent: string, planningDir: string): PhaseEntry[] {
  const phaseMatches = [...roadmapContent.matchAll(/^### Phase ([0-9.]+): (.+)$/gm)];
  const phases: PhaseEntry[] = [];

  for (let index = 0; index < phaseMatches.length; index += 1) {
    const match = phaseMatches[index];
    const start = match.index ?? 0;
    const end = phaseMatches[index + 1]?.index ?? roadmapContent.length;
    const block = roadmapContent.slice(start, end);
    const number = normalizePhaseNumber(match[1]);
    const requirementIds = (block.match(/\*\*Requirements\*\*:\s+(.+)/)?.[1] || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    const goal = block.match(/\*\*Goal\*\*:\s+(.+)/)?.[1]?.trim() || '';

    phases.push({
      goal,
      name: match[2].trim(),
      number,
      requirementIds,
      summaries: collectPhaseEvidenceFiles(number, planningDir),
      plans: parsePhasePlans(block),
    });
  }

  return phases;
}

function parsePhases(roadmapContent: string, planningDir: string): PhaseEntry[] {
  const activeMilestone = extractActiveMilestoneSection(roadmapContent);
  if (!activeMilestone) {
    return parseLegacyPhases(roadmapContent, planningDir);
  }

  const goal = activeMilestone.block.match(/\*\*Goal:\*\*\s+(.+)/)?.[1]?.trim() || '';
  const phaseMatches = [...activeMilestone.block.matchAll(/^- \[(x| )\]\s+\*\*Phase\s+([0-9.]+)\*\*\s+-\s+(.+)$/gm)];

  return phaseMatches.map((match) => {
    const number = normalizePhaseNumber(match[2]);
    return {
      goal,
      name: match[3].trim(),
      number,
      requirementIds: [],
      summaries: collectPhaseEvidenceFiles(number, planningDir),
      plans: [
        {
          checked: match[1] === 'x',
          id: number,
          title: match[3].trim(),
        },
      ],
    };
  });
}

function roadmapStatusForRequirement(mappedPhaseLabels: string[], phases: PhaseEntry[]): RequirementTraceabilityEntry['roadmapStatus'] {
  if (mappedPhaseLabels.length === 0) {
    return 'missing';
  }

  const phaseByLabel = new Map(phases.map((phase) => [normalizePhaseLabel(`Phase ${phase.number}`), phase]));
  const mappedPhases = mappedPhaseLabels
    .map((label) => phaseByLabel.get(normalizePhaseLabel(label)))
    .filter((phase): phase is PhaseEntry => Boolean(phase));

  if (mappedPhases.length !== mappedPhaseLabels.length || mappedPhases.length === 0) {
    return 'missing';
  }

  const allComplete = mappedPhases.every(
    (phase) => phase.plans.length > 0 && phase.plans.every((plan) => plan.checked)
  );
  if (allComplete) {
    return 'complete';
  }

  const anyComplete = mappedPhases.some((phase) => phase.plans.some((plan) => plan.checked));
  return anyComplete ? 'partial' : 'planned';
}

function findMilestoneEvidenceFiles(planningDir: string, milestone: string): string[] {
  const match = milestone.match(/v[0-9.]+/i);
  if (!match) {
    return [];
  }

  const candidates = [
    path.join(planningDir, 'milestones', `${match[0]}-MILESTONE-AUDIT.md`),
    path.join(planningDir, `${match[0]}-MILESTONE-AUDIT.md`),
  ];

  return candidates
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => path.join('.planning', path.relative(planningDir, filePath)))
    .sort();
}

export function collectTraceabilityReportData(rootDir = process.cwd()): TraceabilityReportData {
  const planningDir = path.join(rootDir, '.planning');
  const roadmapContent = readFile(path.join(planningDir, 'ROADMAP.md'));
  const requirementsContent = readFile(path.join(planningDir, 'REQUIREMENTS.md'));
  const requirements = parseRequirements(requirementsContent);
  const requirementTable = parseRequirementTraceabilityTable(requirementsContent);
  const phases = parsePhases(roadmapContent, planningDir);
  const milestone = parseMilestone(roadmapContent, requirementsContent);
  const milestoneEvidenceFiles = findMilestoneEvidenceFiles(planningDir, milestone);
  const requirementsById = new Map(requirements.map((requirement) => [requirement.id, requirement]));
  const requirementIds = dedupe([...requirements.map((entry) => entry.id), ...[...requirementTable.keys()]]);

  for (const phase of phases) {
    if (phase.requirementIds.length > 0) {
      continue;
    }

    phase.requirementIds = requirementIds.filter((requirementId) =>
      (requirementTable.get(requirementId)?.mappedPhases ?? []).includes(normalizePhaseLabel(`Phase ${phase.number}`))
    );
  }

  const requirementEntries: RequirementTraceabilityEntry[] = requirementIds.map((requirementId) => {
    const requirement = requirementsById.get(requirementId);
    const tableEntry = requirementTable.get(requirementId);
    const mappedPhases = tableEntry?.mappedPhases ?? phases
      .filter((phase) => phase.requirementIds.includes(requirementId))
      .map((phase) => normalizePhaseLabel(`Phase ${phase.number}`));
    const evidenceFiles = dedupe([
      ...mappedPhases.flatMap((phaseLabel) => {
        const phase = phases.find((candidate) => normalizePhaseLabel(`Phase ${candidate.number}`) === normalizePhaseLabel(phaseLabel));
        return phase?.summaries ?? [];
      }),
      ...milestoneEvidenceFiles,
    ]);
    const status = tableEntry?.status ?? requirement?.status ?? 'pending';

    return {
      area: requirement?.area ?? 'General',
      id: requirementId,
      status,
      title: tableEntry?.title ?? requirement?.title ?? requirementId,
      mappedPhases,
      evidenceFiles,
      missingEvidence: status === 'complete' && evidenceFiles.length === 0,
      roadmapStatus: roadmapStatusForRequirement(mappedPhases, phases),
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    milestone,
    phaseEntries: phases,
    requirementEntries,
    rootDir,
    summary: {
      completeRequirements: requirementEntries.filter((entry) => entry.status === 'complete').length,
      missingEvidenceRequirements: requirementEntries.filter((entry) => entry.missingEvidence).length,
      totalRequirements: requirementEntries.length,
      unmappedRequirements: requirementEntries.filter((entry) => entry.roadmapStatus === 'missing').length,
    },
  };
}

export function getTraceabilityIntegrityIssues(report: TraceabilityReportData): string[] {
  const issues: string[] = [];

  if (report.milestone === 'Unknown milestone') {
    issues.push('Could not identify the active milestone.');
  }
  if (report.requirementEntries.length === 0) {
    issues.push('No requirements were parsed from REQUIREMENTS.md.');
  }
  if (report.phaseEntries.length === 0) {
    issues.push('No phase plan entries were parsed from ROADMAP.md.');
  }
  if (
    report.requirementEntries.length > 0 &&
    report.requirementEntries.every((entry) => entry.roadmapStatus === 'missing')
  ) {
    issues.push('No requirement-to-phase mappings were resolved.');
  }

  return issues;
}

function formatLink(rootDir: string, filePath: string): string {
  return `[${path.basename(filePath)}](${path.join(rootDir, filePath.replace(/^\.\//, ''))})`;
}

export function renderTraceabilityReport(report: TraceabilityReportData): string {
  const lines: string[] = [];

  lines.push(`# Milestone Traceability Report`);
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Milestone: ${report.milestone}`);
  lines.push('');
  lines.push(`## Summary`);
  lines.push('');
  lines.push(`- Total requirements: ${report.summary.totalRequirements}`);
  lines.push(`- Completed requirements: ${report.summary.completeRequirements}`);
  lines.push(`- Unmapped requirements: ${report.summary.unmappedRequirements}`);
  lines.push(`- Completed requirements missing evidence: ${report.summary.missingEvidenceRequirements}`);
  lines.push('');
  lines.push(`## Requirement Coverage`);
  lines.push('');
  lines.push(`| Requirement | Area | Status | Roadmap | Mapped Phases | Evidence |`);
  lines.push(`| --- | --- | --- | --- | --- | --- |`);

  for (const entry of report.requirementEntries) {
    const evidence = entry.evidenceFiles.length > 0
      ? entry.evidenceFiles.map((filePath) => formatLink(report.rootDir, filePath)).join('<br>')
      : 'None';
    lines.push(
      `| ${entry.id} | ${entry.area} | ${entry.status} | ${entry.roadmapStatus} | ${entry.mappedPhases.join(', ') || 'None'} | ${evidence} |`
    );
  }

  lines.push('');
  lines.push(`## Phase Coverage`);
  lines.push('');
  lines.push(`| Phase | Requirements | Plans | Summaries |`);
  lines.push(`| --- | --- | --- | --- |`);
  for (const phase of report.phaseEntries) {
    const plans = phase.plans.length > 0
      ? phase.plans.map((plan) => `${plan.checked ? 'x' : ' '} ${plan.id}`).join('<br>')
      : 'None';
    const summaries = phase.summaries.length > 0
      ? phase.summaries.map((filePath) => formatLink(report.rootDir, filePath)).join('<br>')
      : 'None';
    lines.push(
      `| Phase ${phase.number} ${phase.name} | ${phase.requirementIds.join(', ') || 'None'} | ${plans} | ${summaries} |`
    );
  }

  const gaps: string[] = [];
  for (const entry of report.requirementEntries) {
    if (entry.mappedPhases.length === 0) {
      gaps.push(`- Missing roadmap mapping for ${entry.id}.`);
      continue;
    }
    if (entry.roadmapStatus === 'missing') {
      gaps.push(`- ${entry.id} references roadmap phases that were not found: ${entry.mappedPhases.join(', ')}.`);
      continue;
    }
    if (entry.roadmapStatus === 'planned') {
      gaps.push(`- ${entry.id} is mapped to planned phase coverage only.`);
    }
    if (entry.roadmapStatus === 'partial') {
      gaps.push(`- ${entry.id} has partial phase coverage; at least one mapped phase is still incomplete.`);
    }
    if (entry.missingEvidence) {
      gaps.push(`- ${entry.id} is marked complete but has no evidence files.`);
    }
  }

  lines.push('');
  lines.push(`## Gaps`);
  lines.push('');
  if (gaps.length === 0) {
    lines.push(`- No traceability gaps detected.`);
  } else {
    lines.push(...gaps);
  }

  return lines.join('\n');
}
