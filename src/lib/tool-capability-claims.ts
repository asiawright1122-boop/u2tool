import { getToolCapabilityProfile } from "../config/tool-capabilities";

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
    claim.pattern.lastIndex = 0;
    const matches = claim.pattern.test(input.text);
    claim.pattern.lastIndex = 0;

    return matches
      ? [{ code: claim.code, message: claim.reason }]
      : [];
  });

  return { governed: true, issues };
}
