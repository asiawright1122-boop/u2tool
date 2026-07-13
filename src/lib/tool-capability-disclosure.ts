import type { ToolCapabilityProfile } from '@/config/tool-capabilities';
import type { Locale } from '@/lib/i18n';

interface OptionalServerDisclosure {
  heading: string;
  modes: string[];
  features: string[];
  privacy: string;
}

export interface ToolCapabilityDisclosureViewModel {
  title: string;
  runsLocally: string;
  acceptedInputsLabel: string;
  producedOutputsLabel: string;
  supportedLanguageLabel: string;
  limitsLabel: string;
  localModes: string[];
  acceptedInputs: string[];
  producedOutputs: string[];
  browserFeatures: string[];
  supportedLanguages: string[];
  limits: string[];
  privacyLocal: string;
  optionalServer?: OptionalServerDisclosure;
}

export function buildToolCapabilityDisclosure(
  profile: ToolCapabilityProfile,
  locale: Locale,
  messages: Record<string, unknown>,
): ToolCapabilityDisclosureViewModel {
  const resolve = (labelKey: string): string =>
    resolveVisibleLabel(messages, labelKey, profile, locale);

  const supportedLanguages =
    profile.supportedLocales.engine.kind === 'language-neutral'
      ? [resolve('tools.capabilityDisclosure.languageNeutral')]
      : profile.supportedLocales.engine.local.map((language) =>
          resolve(`tools.capabilityDisclosure.languages.${language}`),
        );

  const optionalServer =
    profile.optionalServerFeatures.length > 0
      ? {
          heading: resolve('tools.capabilityDisclosure.optionalServer'),
          modes: profile.modes
            .filter(({ runtime }) => runtime === 'optional-server')
            .map(({ labelKey }) => resolve(labelKey)),
          features: profile.optionalServerFeatures.map(({ labelKey }) =>
            resolve(labelKey),
          ),
          privacy: resolve('tools.capabilityDisclosure.privacyServer'),
        }
      : undefined;

  return {
    title: resolve('tools.capabilityDisclosure.title'),
    runsLocally: resolve('tools.capabilityDisclosure.runsLocally'),
    acceptedInputsLabel: resolve(
      'tools.capabilityDisclosure.acceptedInputs',
    ),
    producedOutputsLabel: resolve(
      'tools.capabilityDisclosure.producedOutputs',
    ),
    supportedLanguageLabel: resolve(
      'tools.capabilityDisclosure.supportedLanguage',
    ),
    limitsLabel: resolve('tools.capabilityDisclosure.limits'),
    localModes: profile.modes
      .filter(({ runtime }) => runtime === 'browser')
      .map(({ labelKey }) => resolve(labelKey)),
    acceptedInputs: profile.acceptedInputs.map(({ labelKey }) =>
      resolve(labelKey),
    ),
    producedOutputs: profile.producedOutputs.map(({ labelKey }) =>
      resolve(labelKey),
    ),
    browserFeatures: profile.browserOnlyFeatures.map(({ labelKey }) =>
      resolve(labelKey),
    ),
    supportedLanguages,
    limits: profile.limits.map(({ labelKey }) => resolve(labelKey)),
    privacyLocal: resolve('tools.capabilityDisclosure.privacyLocal'),
    optionalServer,
  };
}

function resolveVisibleLabel(
  messages: Record<string, unknown>,
  labelKey: string,
  profile: ToolCapabilityProfile,
  locale: Locale,
): string {
  const value = labelKey.split('.').reduce<unknown>((current, segment) => {
    if (
      typeof current !== 'object' ||
      current === null ||
      Array.isArray(current)
    ) {
      return undefined;
    }
    return (current as Record<string, unknown>)[segment];
  }, messages);

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(
      `[ToolCapabilityDisclosure] Unresolved label ${JSON.stringify(labelKey)} for ${profile.slug}@${profile.version} (${locale})`,
    );
  }

  return value.trim();
}
