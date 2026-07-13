import { getToolCapabilityProfile } from "../config/tool-capabilities";
import { matchesLocalizedCapabilityClaim } from "./tool-capability-claim-taxonomy";

export interface ToolCapabilityClaimInput {
  slug: string;
  locale: string;
  text: string;
}

export interface ToolCapabilityClaimIssue {
  code: string;
  message: string;
}

export interface ToolCapabilityClaimReport {
  governed: boolean;
  issues: ToolCapabilityClaimIssue[];
}

export function assessToolCapabilityClaims(
  input: ToolCapabilityClaimInput,
): ToolCapabilityClaimReport {
  const profile = getToolCapabilityProfile(input.slug);
  if (!profile) {
    return { governed: false, issues: [] };
  }

  const issues = profile.forbiddenClaims.flatMap((claim) => {
    const matches = matchesLocalizedCapabilityClaim(
      claim.code,
      input.locale,
      input.text,
      claim.pattern,
    );

    return matches
      ? [{ code: claim.code, message: claim.reason }]
      : [];
  });

  return { governed: true, issues };
}
