<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  interface Template {
    id: string;
    name: string;
    content: string;
  }

  let { locale, translations }: Props = $props();

  function t(key: string): string {
    const scope = translations['tools']?.['gitignore'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const currentKey of keys) {
      value = (value as Record<string, unknown>)?.[currentKey];
    }
    return typeof value === 'string' ? value : `MISSING: tools.gitignore.${key}`;
  }

  const templates: Template[] = [
    {
      id: 'node',
      name: 'Node.js',
      content: ['node_modules/', 'dist/', 'build/', '.env', '.env.local', 'npm-debug.log*', 'yarn-debug.log*'].join('\n'),
    },
    {
      id: 'python',
      name: 'Python',
      content: ['__pycache__/', '*.py[cod]', '.venv/', 'venv/', 'dist/', 'build/', '*.egg-info/', '.env'].join('\n'),
    },
    {
      id: 'java',
      name: 'Java',
      content: ['target/', '*.class', '*.jar', '.gradle/', 'build/', '.idea/', '*.iml'].join('\n'),
    },
    {
      id: 'go',
      name: 'Go',
      content: ['bin/', '*.test', 'coverage.out', 'vendor/'].join('\n'),
    },
    {
      id: 'rust',
      name: 'Rust',
      content: ['target/', 'Cargo.lock'].join('\n'),
    },
    {
      id: 'react',
      name: 'React',
      content: ['node_modules/', 'dist/', 'build/', '.env.local', '.vite/', 'coverage/'].join('\n'),
    },
    {
      id: 'vue',
      name: 'Vue',
      content: ['node_modules/', 'dist/', '.env.local', '.nuxt/', '.output/', 'coverage/'].join('\n'),
    },
    {
      id: 'macos',
      name: 'macOS',
      content: ['.DS_Store', '.AppleDouble', '.LSOverride'].join('\n'),
    },
    {
      id: 'windows',
      name: 'Windows',
      content: ['Thumbs.db', 'ehthumbs.db', 'Desktop.ini', '$RECYCLE.BIN/'].join('\n'),
    },
    {
      id: 'linux',
      name: 'Linux',
      content: ['*~', '.fuse_hidden*', '.directory', '.Trash-*'].join('\n'),
    },
  ];

  const categories = [
    { name: t('languages'), ids: ['node', 'python', 'java', 'go', 'rust'] },
    { name: t('frameworks'), ids: ['react', 'vue'] },
    { name: t('os'), ids: ['macos', 'windows', 'linux'] },
  ];

  let selectedTemplates = $state<string[]>([]);
  let customContent = $state('');
  let output = $state('');
  let copied = $state(false);

  function getTemplate(id: string): Template | undefined {
    return templates.find((template) => template.id === id);
  }

  function toggleTemplate(id: string) {
    selectedTemplates = selectedTemplates.includes(id)
      ? selectedTemplates.filter((templateId) => templateId !== id)
      : [...selectedTemplates, id];
  }

  function generate() {
    const parts: string[] = [];

    for (const id of selectedTemplates) {
      const template = getTemplate(id);
      if (template) {
        parts.push(`# ${template.name}\n${template.content}`);
      }
    }

    if (customContent.trim()) {
      parts.push(`# Custom\n${customContent.trim()}`);
    }

    output = parts.join('\n\n');
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);
  }

  function downloadOutput() {
    if (!output) return;
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
    copied = false;
  }
</script>

<div class="space-y-6">
  <div class="grid gap-5 md:grid-cols-3">
    {#each categories as category (category.name)}
      <section class="rounded-2xl border border-slate-200/70 bg-white/60 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/40">
        <h3 class="mb-3 text-sm font-bold text-slate-900 dark:text-white">{category.name}</h3>
        <div class="flex flex-wrap gap-2">
          {#each category.ids as id (id)}
            {@const template = getTemplate(id)}
            {#if template}
              <button
                type="button"
                onclick={() => toggleTemplate(id)}
                class={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                  selectedTemplates.includes(id)
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {template.name}
              </button>
            {/if}
          {/each}
        </div>
      </section>
    {/each}
  </div>

  <div>
    <label for="gitignore-custom" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
      {t('custom')}
    </label>
    <textarea
      id="gitignore-custom"
      bind:value={customContent}
      rows="6"
      class="tool-textarea"
      placeholder={t('customPlaceholder')}
    ></textarea>
  </div>

  <div class="flex flex-wrap gap-3">
    <button type="button" onclick={generate} class="btn-primary">
      {t('generate')}
    </button>
    <button type="button" onclick={clearAll} class="btn-secondary">
      {t('clear')}
    </button>
    {#if output}
      <button type="button" onclick={copyOutput} class="btn-secondary">
        {copied ? t('copied') : t('copy')}
      </button>
      <button type="button" onclick={downloadOutput} class="btn-secondary">
        {t('download')}
      </button>
    {/if}
  </div>

  {#if output}
    <pre class="max-h-96 overflow-auto rounded-2xl border border-slate-200 bg-slate-950 p-5 text-sm text-slate-100 shadow-inner"><code>{output}</code></pre>
  {/if}
</div>
