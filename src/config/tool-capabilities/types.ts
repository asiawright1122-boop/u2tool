import type { Locale } from "@/lib/i18n";

export type ToolRuntime = "browser" | "optional-server";
export type ToolCapabilityEnforcement = "inventory" | "release-blocking";

export interface CapabilityEvidenceReference {
  file: string;
  testName: string;
}

export interface CapabilityMode {
  id: string;
  labelKey: string;
  runtime: ToolRuntime;
  evidence?: CapabilityEvidenceReference;
}

export interface CapabilityValue {
  id: string;
  labelKey: string;
  evidence?: CapabilityEvidenceReference;
}

export interface CapabilityFeature {
  id: string;
  labelKey: string;
  evidence?: CapabilityEvidenceReference;
}

export interface ForbiddenCapabilityClaim {
  code: string;
  pattern: RegExp;
  reason: string;
}

export interface ToolCapabilityProfile {
  slug: string;
  version: string;
  enforcement: ToolCapabilityEnforcement;
  modes: readonly CapabilityMode[];
  acceptedInputs: readonly CapabilityValue[];
  producedOutputs: readonly CapabilityValue[];
  supportedLocales: {
    ui: readonly Locale[];
    engine:
      | {
          kind: "language-neutral";
          evidence?: CapabilityEvidenceReference;
        }
      | {
          kind: "engine-limited";
          local: readonly Locale[];
          optionalServer: readonly Locale[];
          evidence?: CapabilityEvidenceReference;
        };
  };
  browserOnlyFeatures: readonly CapabilityFeature[];
  optionalServerFeatures: readonly CapabilityFeature[];
  limits: readonly CapabilityValue[];
  forbiddenClaims: readonly ForbiddenCapabilityClaim[];
  targetSearchIntents: readonly string[];
  evidenceTests: readonly CapabilityEvidenceReference[];
}
