import { excelViewerCapabilityProfile } from "./profiles/excel-viewer";
import { ganttChartGeneratorCapabilityProfile } from "./profiles/gantt-chart-generator";
import { grammarCheckerCapabilityProfile } from "./profiles/grammar-checker";
import { hexEditorCapabilityProfile } from "./profiles/hex-editor";
import { sqlQueryOptimizerCapabilityProfile } from "./profiles/sql-query-optimizer";
import { typingSpeedTestCapabilityProfile } from "./profiles/typing-speed-test";
import type { ToolCapabilityProfile } from "./types";

export const PILOT_TOOL_SLUGS = [
  "grammar-checker",
  "hex-editor",
  "sql-query-optimizer",
  "excel-viewer",
  "typing-speed-test",
  "gantt-chart-generator",
] as const;

const PILOT_TOOL_CAPABILITY_PROFILES: readonly ToolCapabilityProfile[] =
  Object.freeze([
    grammarCheckerCapabilityProfile,
    hexEditorCapabilityProfile,
    sqlQueryOptimizerCapabilityProfile,
    excelViewerCapabilityProfile,
    typingSpeedTestCapabilityProfile,
    ganttChartGeneratorCapabilityProfile,
  ]);

const TOOL_CAPABILITY_PROFILE_BY_SLUG: ReadonlyMap<
  string,
  ToolCapabilityProfile
> = new Map(
  PILOT_TOOL_CAPABILITY_PROFILES.map((profile) => [profile.slug, profile]),
);

export function getToolCapabilityProfile(
  slug: string,
): ToolCapabilityProfile | undefined {
  return TOOL_CAPABILITY_PROFILE_BY_SLUG.get(slug);
}

export function getPilotToolCapabilityProfiles(): readonly ToolCapabilityProfile[] {
  return PILOT_TOOL_CAPABILITY_PROFILES;
}

export type {
  CapabilityFeature,
  CapabilityMode,
  CapabilityValue,
  ForbiddenCapabilityClaim,
  ToolCapabilityEnforcement,
  ToolCapabilityProfile,
  ToolRuntime,
} from "./types";
