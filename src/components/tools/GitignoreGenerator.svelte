<script lang="ts">
  import { TEMPLATES } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['gitignore'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.gitignore.${key}`;
  }

  // Types
  interface Template {
  id: string;
  name: string;
  content: string;
}

  let selectedTemplates = $state([]);

  let customContent = $state('');

  let output = $state('');

  // Functions
  function toggleTemplate(id: string) {
    selectedTemplates = selectedTemplates.includes(id) ? selectedTemplates.filter((t) => t !== id) : [...selectedTemplates, id]
    ;
  }
  function generate() {
    const parts: string[] = [];

    for (const id of selectedTemplates) {
      const template = TEMPLATES.find((t) => t.id === id);
      if (template) {
        parts.push(`# ${template.name}\n${template.content}`);
      }
    }

    if (customContent.trim()) {
      parts.push(`# Custom\n${customContent.trim()}`);
    }

    output = parts.join('\n\n');
  }
  function copyOutput() {
    navigator.clipboard.writeText(output);
  }
  function downloadOutput() {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '.gitignore';
    link.click();
    URL.revokeObjectURL(url);
  }
  function clearAll() {
    selectedTemplates = [];
    customContent = '';
    output = '';
  }
  const categories = [
    { name: t('languages'), ids: ['node', 'python', 'java', 'go', 'rust'] },
    { name: t('frameworks'), ids: ['react', 'vue'] },
    { name: t('os'), ids: ['macos', 'windows', 'linux'] },
  ];

</script>


                  <button
                    onclick={() => toggleTemplate(id)}
                    class={`px-3 py-1.5 rounded text-sm ${
                      selectedTemplates.includes(id)
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {template.name}
                  </button>
                
