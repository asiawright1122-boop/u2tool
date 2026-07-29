import type {
  EngineLocaleDataEvidence,
  EngineLocaleEvidenceContract,
  ToolCapabilityProfile,
} from "./types";

const SEMVER = /^\d+\.\d+\.\d+$/;
const URI_SCHEME = /^[A-Za-z][A-Za-z\d+.-]*:/;

function isRelativeRepositoryPath(path: string): boolean {
  return (
    path.trim().length > 0 &&
    !path.startsWith("/") &&
    !path.startsWith("\\") &&
    !/^[A-Za-z]:[\\/]/.test(path) &&
    !URI_SCHEME.test(path) &&
    !path.split(/[\\/]/).includes("..")
  );
}

function validateEvidenceData(
  profile: ToolCapabilityProfile,
  contract: EngineLocaleEvidenceContract,
): void {
  const data: EngineLocaleDataEvidence = contract.data;
  const errorPrefix = `${profile.slug}: engine locale ${contract.locale}`;

  if (data.kind === "behavior-test") return;

  const file = data.kind === "fixture-object" ? data.file : data.fileTemplate;
  if (!isRelativeRepositoryPath(file)) {
    throw new Error(
      `${errorPrefix} data path must be a relative repository path`,
    );
  }

  const minimum =
    data.kind === "fixture-object"
      ? data.minimumNonEmptyValues
      : data.minimumNonEmptyEntries;
  if (!Number.isInteger(minimum) || minimum <= 0) {
    throw new Error(
      `${errorPrefix} evidence minimum must be a positive integer`,
    );
  }

  if (data.kind === "fixture-object") {
    if (!data.exportName.trim()) {
      throw new Error(`${errorPrefix} fixture export name is required`);
    }
    return;
  }

  if (
    data.messagePath.length === 0 ||
    data.messagePath.some((segment) => !segment.trim())
  ) {
    throw new Error(`${errorPrefix} message path segments are required`);
  }
  if ((data.fileTemplate.match(/\{locale\}/g) ?? []).length !== 1) {
    throw new Error(
      `${errorPrefix} prompt template requires exactly one {locale} token`,
    );
  }
}

function validateEngineLocaleEvidence(profile: ToolCapabilityProfile): void {
  const engine = profile.supportedLocales.engine;
  if (engine.kind === "language-neutral") {
    if ("localeEvidence" in engine || "disclosure" in engine) {
      throw new Error(
        `${profile.slug}: language-neutral engines cannot declare locale evidence or disclosure`,
      );
    }
    return;
  }

  if (!("localeEvidence" in engine)) {
    throw new Error(`${profile.slug}: engine locale evidence is required`);
  }
  if (!("disclosure" in engine)) {
    throw new Error(`${profile.slug}: engine language disclosure is required`);
  }

  const declared = [
    ...engine.local.map((locale) => ({ locale, runtime: "local" as const })),
    ...engine.optionalServer.map((locale) => ({
      locale,
      runtime: "optional-server" as const,
    })),
  ];

  for (const expected of declared) {
    const matches = engine.localeEvidence.filter(
      ({ locale }) => locale === expected.locale,
    );
    if (matches.length !== 1) {
      throw new Error(
        `${profile.slug}: engine locale ${expected.locale} requires exactly one locale evidence contract`,
      );
    }
    if (matches[0].runtime !== expected.runtime) {
      throw new Error(
        `${profile.slug}: engine locale ${expected.locale} has an invalid runtime`,
      );
    }
  }

  const declaredLocales = new Set(declared.map(({ locale }) => locale));
  const extra = engine.localeEvidence.find(
    ({ locale }) => !declaredLocales.has(locale),
  );
  if (extra) {
    throw new Error(
      `${profile.slug}: locale evidence declares unsupported locale ${extra.locale}`,
    );
  }

  if (!engine.disclosure.labelKey.trim()) {
    throw new Error(
      `${profile.slug}: engine language disclosure label is required`,
    );
  }
  if (!engine.disclosure.labelKey.startsWith(`tools.${profile.slug}.`)) {
    throw new Error(
      `${profile.slug}: engine language disclosure label must use tools.${profile.slug}.*`,
    );
  }

  const forbiddenClaimCodes = new Set(
    profile.forbiddenClaims.map(({ code }) => code),
  );
  const disclosureClaimCodes = new Set<string>();
  for (const claimCode of engine.disclosure.unsupportedLocaleClaimCodes) {
    if (!claimCode.trim()) {
      throw new Error(
        `${profile.slug}: engine language disclosure claim code is required`,
      );
    }
    if (disclosureClaimCodes.has(claimCode)) {
      throw new Error(
        `${profile.slug}: engine language disclosure claim code ${claimCode} must be unique`,
      );
    }
    if (!forbiddenClaimCodes.has(claimCode)) {
      throw new Error(
        `${profile.slug}: engine language disclosure claim code ${claimCode} is not forbidden`,
      );
    }
    disclosureClaimCodes.add(claimCode);
  }

  for (const contract of engine.localeEvidence) {
    validateEvidenceData(profile, contract);
  }
}

function normalizeEngineLocaleEvidence(
  profile: ToolCapabilityProfile,
): ToolCapabilityProfile {
  const engine = profile.supportedLocales.engine;
  if (engine.kind !== "engine-limited") {
    return Object.freeze(profile);
  }

  const localeEvidence = Object.freeze(
    engine.localeEvidence.map((contract) =>
      Object.freeze({
        ...contract,
        evidence: Object.freeze({ ...contract.evidence }),
        data: Object.freeze({
          ...contract.data,
          ...(contract.data.kind === "message-prompt-bank"
            ? { messagePath: Object.freeze([...contract.data.messagePath]) }
            : {}),
        }) as EngineLocaleDataEvidence,
      }),
    ),
  );
  const disclosure = Object.freeze({
    ...engine.disclosure,
    unsupportedLocaleClaimCodes: Object.freeze([
      ...engine.disclosure.unsupportedLocaleClaimCodes,
    ]),
  });

  return Object.freeze({
    ...profile,
    supportedLocales: {
      ...profile.supportedLocales,
      engine: Object.freeze({ ...engine, localeEvidence, disclosure }),
    },
  });
}

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
  validateEngineLocaleEvidence(profile);
  return normalizeEngineLocaleEvidence(profile);
}
