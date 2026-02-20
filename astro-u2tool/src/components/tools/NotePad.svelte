<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

  let notes = $state([]);

  let editingNote = $state(null);

  let searchQuery = $state('');

  let selectedColor = $state(COLORS[0].value);

  $effect(() => {
    const saved = localStorage.getItem('notepad-notes');
    if (saved) {
      try {
        notes = JSON.parse(saved);
      } catch {
        notes = [];
      }
    }
  });

  $effect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notepad-notes', JSON.stringify(notes));
    }
  });

  // Functions
  function createNote() {
    const newNote: Note = {
      id: Date.now().toString(),
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
    notes = notes.map(note => 
      note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
    );
    if (editingNote?.id === id) {
      editingNote = { ...editingNote, ...updates, updatedAt: Date.now() };
    }
  }
  function deleteNote(id: string) {
    notes = notes.filter(note => note.id !== id);
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
  function formatDate(timestamp: number) {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 items-center justify-between">
        <div class="flex gap-2">
          <button
            onclick={createNote}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
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
        {#each COLORS as color (color.name)}
<button 
            onclick={() => selectedColor = color.value}
            class={`w-6 h-6 rounded-full border-2 ${color.value} ${selectedColor === color.value ? 'ring-2 ring-blue-500' : ''}`}
            title={color.name}
          />
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
          />
          <div class="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>{t('notePad.updated')}: {formatDate(editingNote.updatedAt)}</span>
            <div class="flex gap-2">
              {#each COLORS as color (color.name)}
<button 
                  onclick={() => updateNote(editingNote.id, { color: color.value })}
                  class={`w-4 h-4 rounded-full border ${color.value}`}
                />
{/each}
            </div>
          </div>
        </div>
{/if}

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each filteredNotes as note (note.id)}
<div 
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
              >
                🗑️
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
  
