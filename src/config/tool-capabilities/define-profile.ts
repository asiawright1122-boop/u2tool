import type { ToolCapabilityProfile } from "./types";

const SEMVER = /^\d+\.\d+\.\d+$/;

export function defineToolCapabilityProfile(
  profile: ToolCapabilityProfile,
): ToolCapabilityProfile {
  if (!profile.slug || !SEMVER.test(profile.version)) {
    throw new Error(
      `Invalid capability profile identity: ${profile.slug}@${profile.version}`,
    );
  }
  if (
    profile.enforcement === "release-blocking" &&
    profile.evidenceTests.length === 0
  ) {
    throw new Error(
      `${profile.slug}: release-blocking profiles require behavior evidence`,
    );
  }
  if (profile.forbiddenClaims.length === 0) {
    throw new Error(
      `${profile.slug}: at least one forbidden claim is required`,
    );
  }
  return Object.freeze(profile);
}
