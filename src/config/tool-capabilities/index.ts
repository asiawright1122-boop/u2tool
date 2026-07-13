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

type PilotToolSlug = (typeof PILOT_TOOL_SLUGS)[number];

const PILOT_TOOL_CAPABILITY_PROFILES: Readonly<
  Record<PilotToolSlug, ToolCapabilityProfile>
> = {
  "grammar-checker": grammarCheckerCapabilityProfile,
  "hex-editor": hexEditorCapabilityProfile,
  "sql-query-optimizer": sqlQueryOptimizerCapabilityProfile,
  "excel-viewer": excelViewerCapabilityProfile,
  "typing-speed-test": typingSpeedTestCapabilityProfile,
  "gantt-chart-generator": ganttChartGeneratorCapabilityProfile,
};

export function getToolCapabilityProfile(
  slug: string,
): ToolCapabilityProfile | undefined {
  return PILOT_TOOL_CAPABILITY_PROFILES[slug as PilotToolSlug];
}

export function getPilotToolCapabilityProfiles(): readonly ToolCapabilityProfile[] {
  return PILOT_TOOL_SLUGS.map((slug) => PILOT_TOOL_CAPABILITY_PROFILES[slug]);
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
