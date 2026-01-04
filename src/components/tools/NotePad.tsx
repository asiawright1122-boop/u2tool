'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

const COLORS = [
  { name: 'Yellow', value: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300' },
  { name: 'Green', value: 'bg-green-100 dark:bg-green-900/30 border-green-300' },
  { name: 'Blue', value: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300' },
  { name: 'Pink', value: 'bg-pink-100 dark:bg-pink-900/30 border-pink-300' },
  { name: 'Purple', value: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300' },
  { name: 'Orange', value: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300' },
];

export default function NotePad() {
  const t = useTranslations('tools');
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);

  useEffect(() => {
    const saved = localStorage.getItem('notepad-notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch {
        setNotes([]);
      }
    }
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notepad-notes', JSON.stringify(notes));
    }
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      color: selectedColor,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setEditingNote(newNote);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
    ));
    if (editingNote?.id === id) {
      setEditingNote({ ...editingNote, ...updates, updatedAt: Date.now() });
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (editingNote?.id === id) {
      setEditingNote(null);
    }
  };

  const exportNotes = () => {
    const data = JSON.stringify(notes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={createNote}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <span>+</span> {t('notePad.newNote')}
          </button>
          <button
            onClick={exportNotes}
            disabled={notes.length === 0}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            {t('notePad.export')}
          </button>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('notePad.search')}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 w-64"
        />
      </div>

      <div className="flex gap-2 items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">{t('notePad.color')}:</span>
        {COLORS.map(color => (
          <button
            key={color.name}
            onClick={() => setSelectedColor(color.value)}
            className={`w-6 h-6 rounded-full border-2 ${color.value} ${selectedColor === color.value ? 'ring-2 ring-blue-500' : ''}`}
            title={color.name}
          />
        ))}
      </div>

      {editingNote && (
        <div className={`p-4 rounded-lg border-2 ${editingNote.color}`}>
          <div className="flex justify-between items-start mb-2">
            <input
              type="text"
              value={editingNote.title}
              onChange={(e) => updateNote(editingNote.id, { title: e.target.value })}
              placeholder={t('notePad.titlePlaceholder')}
              className="text-lg font-semibold bg-transparent border-none outline-none w-full"
            />
            <button
              onClick={() => setEditingNote(null)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          <textarea
            value={editingNote.content}
            onChange={(e) => updateNote(editingNote.id, { content: e.target.value })}
            placeholder={t('notePad.contentPlaceholder')}
            className="w-full h-40 bg-transparent border-none outline-none resize-none"
          />
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>{t('notePad.updated')}: {formatDate(editingNote.updatedAt)}</span>
            <div className="flex gap-2">
              {COLORS.map(color => (
                <button
                  key={color.name}
                  onClick={() => updateNote(editingNote.id, { color: color.value })}
                  className={`w-4 h-4 rounded-full border ${color.value}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map(note => (
          <div
            key={note.id}
            className={`p-4 rounded-lg border-2 cursor-pointer hover:shadow-md transition-shadow ${note.color}`}
            onClick={() => setEditingNote(note)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                {note.title || t('notePad.untitled')}
              </h3>
              <button
                onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                className="text-gray-400 hover:text-red-500 ml-2"
              >
                🗑️
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
              {note.content || t('notePad.noContent')}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {formatDate(note.updatedAt)}
            </p>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {notes.length === 0 ? t('notePad.noNotes') : t('notePad.noResults')}
        </div>
      )}

      <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {t('notePad.totalNotes')}: {notes.length}
      </div>
    </div>
  );
}
