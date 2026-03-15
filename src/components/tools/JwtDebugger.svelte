<script lang="ts">
  import JwtDecoder from './JwtDecoder.svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Reuse the existing JWT tool UI while remapping debugger-specific messages
  // into the translation slot expected by JwtDecoder.
  let normalizedTranslations = $derived.by(() => {
    const root = translations as Record<string, unknown>;
    const tools = (root.tools as Record<string, unknown>) ?? {};
    const debuggerTranslations = tools['jwt-debugger'];

    if (!debuggerTranslations) {
      return translations;
    }

    return {
      ...root,
      tools: {
        ...tools,
        'jwt-decoder': debuggerTranslations,
      },
    };
  });
</script>

<JwtDecoder {locale} translations={normalizedTranslations} />
