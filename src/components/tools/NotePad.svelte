<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale: _locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  interface Note {
    id: string;
    title: string;
    content: string;
    color: string;
    createdAt: number;
    updatedAt: number;
  }

  interface NoteColor {
    id: string;
    name: string;
    swatchClass: string;
    cardClass: string;
  }

  const COLOR_OPTIONS: NoteColor[] = [
    { id: 'blue', name: 'Blue', swatchClass: 'bg-amber-500', cardClass: 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30' },
    { id: 'green', name: 'Green', swatchClass: 'bg-green-500', cardClass: 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/30' },
    { id: 'amber', name: 'Amber', swatchClass: 'bg-amber-500', cardClass: 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30' },
    { id: 'purple', name: 'Purple', swatchClass: 'bg-slate-500', cardClass: 'border-slate-300 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/30' },
    { id: 'rose', name: 'Rose', swatchClass: 'bg-rose-500', cardClass: 'border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30' },
    { id: 'teal', name: 'Teal', swatchClass: 'bg-teal-500', cardClass: 'border-teal-300 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30' },
  ];

  const NOTE_STORAGE_KEY = 'notepad-notes';
  const COLOR_CLASS_SET = new Set(COLOR_OPTIONS.map((color) => color.cardClass));

  let notes = $state<Note[]>([]);
  let editingNote = $state<Note | null>(null);
  let searchQuery = $state('');
  let selectedColor = $state(COLOR_OPTIONS[0].cardClass);
  let hasHydrated = $state(false);

  function createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function normalizeColorClass(value: string): string {
    return COLOR_CLASS_SET.has(value) ? value : COLOR_OPTIONS[0].cardClass;
  }

  function normalizeNote(raw: Partial<Note>): Note {
    const now = Date.now();
    return {
      id: raw.id || createId(),
      title: raw.title || '',
      content: raw.content || '',
      color: normalizeColorClass(raw.color || selectedColor),
      createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : now,
      updatedAt: typeof raw.updatedAt === 'number' ? raw.updatedAt : now,
    };
  }

  $effect(() => {
    if (hasHydrated) return;
    hasHydrated = true;

    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(NOTE_STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        notes = parsed.map((item) => normalizeNote(item));
      }
    } catch {
      notes = [];
    }
  });

  $effect(() => {
    if (!hasHydrated || typeof window === 'undefined') return;

    if (notes.length === 0) {
      localStorage.removeItem(NOTE_STORAGE_KEY);
      return;
    }

    localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(notes));
  });

  function createNote() {
    const newNote: Note = {
      id: createId(),
      title: '',
      content: '',
      color: selectedColor,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    notes = [newNote, ...notes];
    editingNote = newNote;
  }

  function updateNote(id: string, updates: Partial<Note>) {
    notes = notes.map((note) =>
      note.id === id
        ? { ...note, ...updates, updatedAt: Date.now(), color: normalizeColorClass(updates.color || note.color) }
        : note
    );
    if (editingNote?.id === id) {
      editingNote = {
        ...editingNote,
        ...updates,
        updatedAt: Date.now(),
        color: normalizeColorClass(updates.color || editingNote.color),
      };
    }
  }

  function deleteNote(id: string) {
    notes = notes.filter((note) => note.id !== id);
    if (editingNote?.id === id) {
      editingNote = null;
    }
  }

  function exportNotes() {
    const data = JSON.stringify(notes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const filteredNotes = $derived.by(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return notes;

    return notes.filter((note) =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });
</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 items-center justify-between">
        <div class="flex gap-2">
          <button
            onclick={createNote}
            class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
          >
            <span>+</span> {t('notePad.newNote')}
          </button>
          <button
            onclick={exportNotes}
            disabled={notes.length === 0}
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            {t('notePad.export')}
          </button>
        </div>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder={t('notePad.search')}
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 w-64"
        />
      </div>

      <div class="flex gap-2 items-center">
        <span class="text-sm text-gray-600 dark:text-gray-400">{t('notePad.color')}:</span>
        {#each COLOR_OPTIONS as color (color.id)}
<button
            onclick={() => selectedColor = color.cardClass}
            class={`w-6 h-6 rounded-full border-2 ${color.swatchClass} ${selectedColor === color.cardClass ? 'ring-2 ring-amber-500' : ''}`}
            title={color.name}
            aria-label={color.name}
          ></button>
{/each}
      </div>

      {#if editingNote}
<div class={`p-4 rounded-lg border-2 ${editingNote.color}`}>
          <div class="flex justify-between items-start mb-2">
            <input
              type="text"
              value={editingNote.title}
              onchange={(e) => updateNote(editingNote.id, { title: e.target.value })}
              placeholder={t('notePad.titlePlaceholder')}
              class="text-lg font-semibold bg-transparent border-none outline-none w-full"
            />
            <button
              onclick={() => editingNote = null}
              class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          <textarea
            value={editingNote.content}
            onchange={(e) => updateNote(editingNote.id, { content: e.target.value })}
            placeholder={t('notePad.contentPlaceholder')}
            class="w-full h-40 bg-transparent border-none outline-none resize-none"
          ></textarea>
          <div class="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>{t('notePad.updated')}: {formatDate(editingNote.updatedAt)}</span>
            <div class="flex gap-2">
              {#each COLOR_OPTIONS as color (color.id)}
<button
                  onclick={() => updateNote(editingNote.id, { color: color.cardClass })}
                  class={`w-4 h-4 rounded-full border ${color.swatchClass}`}
                  title={color.name}
                  aria-label={color.name}
                ></button>
{/each}
            </div>
          </div>
        </div>
{/if}

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each filteredNotes as note (note.id)}
<div role="button" tabindex="0" onkeydown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}
            class={`p-4 rounded-lg border-2 cursor-pointer hover:shadow-md transition-shadow ${note.color}`}
            onclick={() => editingNote = note}
          >
            <div class="flex justify-between items-start">
              <h3 class="font-semibold text-gray-800 dark:text-gray-200 truncate">
                {note.title || t('notePad.untitled')}
              </h3>
              <button
                onclick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                class="text-gray-400 hover:text-red-500 ml-2"
                aria-label="Delete note"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
              {note.content || t('notePad.noContent')}
            </p>
            <p class="text-xs text-gray-400 mt-2">
              {formatDate(note.updatedAt)}
            </p>
          </div>
{/each}
      </div>

      {#if filteredNotes.length === 0}
<div class="text-center py-12 text-gray-500 dark:text-gray-400">
          {notes.length === 0 ? t('notePad.noNotes') : t('notePad.noResults')}
        </div>
{/if}

      <div class="text-sm text-gray-500 dark:text-gray-400 text-center">
        {t('notePad.totalNotes')}: {notes.length}
      </div>
    </div>

