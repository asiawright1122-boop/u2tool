import { describe, expect, it } from 'vitest';

import { getToolCapabilityProfile } from '@/config/tool-capabilities';
import { buildToolCapabilityDisclosure } from '@/lib/tool-capability-disclosure';
import { buildToolWrapperTranslations } from '@/lib/tool-page-translations';
import { loadBaseUiMessages, loadToolPageMessages } from '@/lib/translations';

describe('buildToolCapabilityDisclosure', () => {
  it('builds an engine-limited disclosure entirely from localized messages', async () => {
    const profile = getToolCapabilityProfile('grammar-checker');
    expect(profile).toBeDefined();

    const baseMessages = await loadBaseUiMessages('zh');
    const toolMessages = await loadToolPageMessages('zh', 'grammar-checker');
    const messages = buildToolWrapperTranslations({
      currentSlug: 'grammar-checker',
      currentToolMessages: toolMessages,
      toolSlugs: ['grammar-checker'],
      toolsCommon: baseMessages.tools as Record<string, unknown>,
    });

    const disclosure = buildToolCapabilityDisclosure(
      profile!,
      'zh',
      messages,
    );

    expect(disclosure).toMatchObject({
      title: '此工具的功能',
      runsLocally: '在浏览器中本地运行',
      localModes: ['本地英语语法规则'],
      acceptedInputs: ['英语纯文本'],
      producedOutputs: ['高亮显示的语法问题', '修正后的文本'],
      supportedLanguages: ['英语'],
      limits: ['仅检查英语文本', '不使用人工智能', '不进行服务器处理'],
      privacyLocal: '在本地模式下，您的输入仅保留在此浏览器中。',
      optionalServer: undefined,
    });
  });

  it('fails closed instead of rendering an unresolved visible label', async () => {
    const profile = getToolCapabilityProfile('grammar-checker');
    expect(profile).toBeDefined();

    const baseMessages = await loadBaseUiMessages('en');
    const toolMessages = await loadToolPageMessages('en', 'grammar-checker');
    const messages = structuredClone(
      buildToolWrapperTranslations({
        currentSlug: 'grammar-checker',
        currentToolMessages: toolMessages,
        toolSlugs: ['grammar-checker'],
        toolsCommon: baseMessages.tools as Record<string, unknown>,
      }),
    );
    const grammarMessages = messages.tools['grammar-checker'] as Record<
      string,
      unknown
    >;
    const capabilities = grammarMessages.capabilities as Record<string, unknown>;
    const features = capabilities.features as Record<string, unknown>;
    delete features.issueHighlights;

    expect(() =>
      buildToolCapabilityDisclosure(profile!, 'en', messages),
    ).toThrow(
      '[ToolCapabilityDisclosure] Unresolved label "tools.grammar-checker.capabilities.features.issueHighlights" for grammar-checker@1.1.0 (en)',
    );
  });

  it('uses the localized language-neutral label instead of inventing engine locales', async () => {
    const profile = getToolCapabilityProfile('hex-editor');
    expect(profile).toBeDefined();

    const baseMessages = await loadBaseUiMessages('de');
    const toolMessages = await loadToolPageMessages('de', 'hex-editor');
    const messages = buildToolWrapperTranslations({
      currentSlug: 'hex-editor',
      currentToolMessages: toolMessages,
      toolSlugs: ['hex-editor'],
      toolsCommon: baseMessages.tools as Record<string, unknown>,
    });

    expect(
      buildToolCapabilityDisclosure(profile!, 'de', messages)
        .supportedLanguages,
    ).toEqual(['Sprachneutral']);
  });

  it('adds server modes, features, and privacy only when a server feature exists', async () => {
    const inventoryProfile = getToolCapabilityProfile('grammar-checker');
    expect(inventoryProfile).toBeDefined();
    const profile = {
      ...inventoryProfile!,
      modes: [
        ...inventoryProfile!.modes,
        {
          id: 'optional-server-check',
          labelKey:
            'tools.grammar-checker.capabilities.modes.localEnglishRules',
          runtime: 'optional-server' as const,
        },
      ],
      optionalServerFeatures: [inventoryProfile!.browserOnlyFeatures[0]],
    };

    const baseMessages = await loadBaseUiMessages('en');
    const toolMessages = await loadToolPageMessages('en', 'grammar-checker');
    const messages = buildToolWrapperTranslations({
      currentSlug: 'grammar-checker',
      currentToolMessages: toolMessages,
      toolSlugs: ['grammar-checker'],
      toolsCommon: baseMessages.tools as Record<string, unknown>,
    });

    expect(
      buildToolCapabilityDisclosure(profile, 'en', messages).optionalServer,
    ).toEqual({
      heading: 'Optional server processing',
      modes: ['Local English grammar rules'],
      features: ['Local English grammar checks'],
      privacy:
        'Server processing only starts after you explicitly request it.',
    });
  });
});
