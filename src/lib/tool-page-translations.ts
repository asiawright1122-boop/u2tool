type MessagesRecord = Record<string, unknown>;

export function buildGenericToolTranslationKeys(
  toolsCommon: MessagesRecord,
  toolSlugs: Iterable<string>
): MessagesRecord {
  const toolSlugSet = new Set(toolSlugs);
  const genericToolKeys: MessagesRecord = {};

  for (const [key, value] of Object.entries(toolsCommon)) {
    if (typeof value === 'string') {
      genericToolKeys[key] = value;
    }
  }

  for (const [key, value] of Object.entries(toolsCommon)) {
    if (toolSlugSet.has(key)) {
      continue;
    }

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      genericToolKeys[key] = value;
    }
  }

  return genericToolKeys;
}

export function buildToolWrapperTranslations({
  currentSlug,
  currentToolMessages,
  toolSlugs,
  toolsCommon,
}: {
  currentSlug: string;
  currentToolMessages: MessagesRecord;
  toolSlugs: Iterable<string>;
  toolsCommon: MessagesRecord;
}): { tools: MessagesRecord } {
  return {
    tools: {
      ...buildGenericToolTranslationKeys(toolsCommon, toolSlugs),
      [currentSlug]: currentToolMessages,
    },
  };
}
