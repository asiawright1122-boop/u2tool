<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  interface Tag {
    name: string;
    type: 'lightweight' | 'annotated';
    message?: string;
    commit?: string;
  }

  interface SemverParts {
    major: number;
    minor: number;
    patch: number;
    prerelease?: string;
  }

  let { locale, translations }: Props = $props();

  function t(key: string): string {
    const scope = (translations['tools']['git-tag-manager'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) value = (value as Record<string, unknown>)?.[k];
    return typeof value === 'string' ? value : `MISSING: tools.git-tag-manager.${key}`;
  }

  function tCommon(key: string): string {
    const scope = (translations['tools'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) value = (value as Record<string, unknown>)?.[k];
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  function parseSemver(version = ''): SemverParts | null {
    const match = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(version.trim());
    if (!match) return null;
    return {
      major: Number(match[1]),
      minor: Number(match[2]),
      patch: Number(match[3]),
      prerelease: match[4],
    };
  }

  function bumpVersion(version: string, type: 'major' | 'minor' | 'patch' | 'prerelease'): string {
    const parsed = parseSemver(version) ?? { major: 1, minor: 0, patch: 0 };
    if (type === 'major') return `v${parsed.major + 1}.0.0`;
    if (type === 'minor') return `v${parsed.major}.${parsed.minor + 1}.0`;
    if (type === 'patch') return `v${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
    const base = `v${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
    return `${base}-rc.1`;
  }

  function generateCommands(tagData: Tag): string[] {
    const target = tagData.commit?.trim() ? ` ${tagData.commit.trim()}` : '';
    if (tagData.type === 'annotated') {
      const message = (tagData.message?.trim() || `Release ${tagData.name}`).replace(/"/g, '\\"');
      return [
        `git tag -a ${tagData.name}${target} -m "${message}"`,
        `git push origin ${tagData.name}`,
      ];
    }

    return [
      `git tag ${tagData.name}${target}`,
      `git push origin ${tagData.name}`,
    ];
  }

  let currentVersion = $state('v1.0.0');
  let tag = $state<Tag>({
    name: 'v1.0.1',
    type: 'annotated',
    message: 'Release v1.0.1',
    commit: '',
  });
  let copied = $state<string | null>(null);

  function updateTag<K extends keyof Tag>(key: K, value: Tag[K]) {
    tag = { ...tag, [key]: value };
  }

  function handleBump(type: 'major' | 'minor' | 'patch' | 'prerelease') {
    const nextVersion = bumpVersion(currentVersion, type);
    currentVersion = nextVersion;
    tag = {
      ...tag,
      name: nextVersion,
      message: `Release ${nextVersion}`,
    };
  }

  let commands = $derived.by(() => generateCommands(tag));
  let allCommands = $derived.by(() => commands.join('\n'));
  let semverParts = $derived.by(() => parseSemver(tag.name));
  let isValidSemver = $derived.by(() => semverParts !== null);

  function handleCopy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    copied = key;
    setTimeout(() => {
      copied = null;
    }, 2000);
  }
</script>


    <div class="space-y-6">
      <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <label class="tool-label">
          Current Version
        </label>
        <div class="flex gap-2 items-center">
          <input
            type="text"
            bind:value={currentVersion}
            class="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
          />
          <span class="text-gray-500">→</span>
          <div class="flex gap-1">
            <button onclick={() => handleBump('major')} class="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200">
              Major
            </button>
            <button onclick={() => handleBump('minor')} class="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded hover:bg-yellow-200">
              Minor
            </button>
            <button onclick={() => handleBump('patch')} class="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200">
              Patch
            </button>
            <button onclick={() => handleBump('prerelease')} class="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200">
              Pre
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="tool-label">
            Tag Name *
          </label>
          <input
            type="text"
            value={tag.name}
            onchange={(e) => updateTag('name', e.target.value)}
            placeholder={t("versionPlaceholder")}
            class={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono ${
              isValidSemver ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {#if isValidSemver}
            <p class="text-xs text-green-600 mt-1">
              Valid semver: {semverParts.major}.{semverParts.minor}.{semverParts.patch}
              {#if semverParts.prerelease}
                -{semverParts.prerelease}
              {/if}
            </p>
          {/if}
        </div>

        <div>
          <label class="tool-label">
            Tag Type
          </label>
          <select
            value={tag.type}
            onchange={(e) => updateTag('type', e.target.value as Tag['type'])}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="annotated">{t('annotated')}</option>
            <option value="lightweight">{t('lightweight')}</option>
          </select>
        </div>
      </div>

      {#if tag.type === 'annotated'}
<div>
          <label class="tool-label">
            Tag Message
          </label>
          <textarea
            value={tag.message}
            onchange={(e) => updateTag('message', e.target.value)}
            placeholder={t("notesPlaceholder")}
            rows={3}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          ></textarea>
        </div>
{/if}

      <div>
        <label class="tool-label">
          Commit Hash (optional)
        </label>
        <input
          type="text"
          value={tag.commit}
          onchange={(e) => updateTag('commit', e.target.value)}
          placeholder={t("commitPlaceholder")}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
        />
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="tool-label">
            Git Commands
          </label>
          <button
            onclick={() => handleCopy(allCommands, 'all')}
            class="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            {copied === 'all' ? tCommon('copied') : 'Copy All'}
          </button>
        </div>
        <div class="space-y-2">
          {#each commands as cmd, idx (idx)}
<div  class="flex items-center gap-2">
              <code class="flex-1 p-2 bg-gray-50 dark:bg-gray-900 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
                {cmd}
              </code>
              <button
                onclick={() => handleCopy(cmd, `cmd-${idx}`)}
                class="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400"
              >
                {copied === `cmd-${idx}` ? '✓' : tCommon('copy')}
              </button>
            </div>
{/each}
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <h3 class="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">{t('usefulCommands')}</h3>
          <div class="space-y-1 text-xs font-mono text-amber-700 dark:text-amber-300">
            <p>git tag -l &quot;v*&quot; # List tags</p>
            <p>git show {tag.name} # Show tag info</p>
            <p>git tag -d {tag.name} # Delete local</p>
            <p>git push origin :{tag.name} # Delete remote</p>
          </div>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('semverGuide')}</h3>
          <div class="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <p><strong>Major:</strong> {t('breakingChanges')}</p>
            <p><strong>Minor:</strong> New features (backward compatible)</p>
            <p><strong>Patch:</strong> {t('bugFixes')}</p>
            <p><strong>Pre:</strong> alpha, beta, rc versions</p>
          </div>
        </div>
      </div>
    </div>
  
