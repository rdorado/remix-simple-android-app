import React, { useState, useEffect } from 'react';
import { Note, CreateNoteDto } from '../types/note';
import { X, Save, Edit3, PlusCircle } from 'lucide-react';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: CreateNoteDto) => void;
  initialNote?: Note | null;
  categories: string[];
}

const COLOR_OPTIONS = [
  { hex: '#FEF3C7', label: 'Amber Warm' },
  { hex: '#E0E7FF', label: 'Indigo Soft' },
  { hex: '#D1FAE5', label: 'Emerald Light' },
  { hex: '#FCE7F3', label: 'Pink Soft' },
  { hex: '#F3E8FF', label: 'Purple Mist' },
  { hex: '#E0F2FE', label: 'Sky Blue' },
];

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialNote,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Personal');
  const [customCategory, setCustomCategory] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [colorHex, setColorHex] = useState('#FEF3C7');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || '');
      setContent(initialNote.content || '');
      setCategory(initialNote.category || 'Personal');
      setIsPinned(initialNote.isPinned || false);
      setIsCompleted(initialNote.isCompleted || false);
      setColorHex(initialNote.colorHex || '#FEF3C7');
    } else {
      setTitle('');
      setContent('');
      setCategory('Personal');
      setCustomCategory('');
      setIsPinned(false);
      setIsCompleted(false);
      setColorHex('#FEF3C7');
    }
    setError('');
  }, [initialNote, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title cannot be empty.');
      return;
    }

    const finalCategory = category === 'NEW_CUSTOM' ? (customCategory.trim() || 'General') : category;

    onSave({
      title: title.trim(),
      content: content.trim(),
      category: finalCategory,
      isPinned,
      isCompleted,
      colorHex,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {initialNote ? (
              <Edit3 size={20} color="#818cf8" />
            ) : (
              <PlusCircle size={20} color="#34d399" />
            )}
            <h2 className="title-md" style={{ color: '#f8fafc' }}>
              {initialNote ? `Edit Note #${initialNote.id}` : 'Create New Note Entry'}
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '0.625rem',
              borderRadius: '6px',
              fontSize: '0.8125rem',
              marginBottom: '1rem',
            }}>
              {error}
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Note Title *</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Server Maintenance Checklist"
              autoFocus
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Ideas">Ideas</option>
              <option value="Tasks">Tasks</option>
              {categories
                .filter((c) => !['Personal', 'Work', 'Ideas', 'Tasks'].includes(c))
                .map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              <option value="NEW_CUSTOM">+ Add Custom Category...</option>
            </select>
            {category === 'NEW_CUSTOM' && (
              <input
                type="text"
                className="form-input"
                style={{ marginTop: '0.5rem' }}
                placeholder="Enter custom category name..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            )}
          </div>

          {/* Content */}
          <div className="form-group">
            <label className="form-label">Content Body</label>
            <textarea
              className="form-textarea"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write note details or action points..."
            />
          </div>

          {/* Color Palette */}
          <div className="form-group">
            <label className="form-label">Card Accent Color</label>
            <div className="color-picker">
              {COLOR_OPTIONS.map((c) => (
                <div
                  key={c.hex}
                  className={`color-option ${colorHex === c.hex ? 'selected' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setColorHex(c.hex)}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Flags */}
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            margin: '1.25rem 0 1.5rem 0',
            padding: '0.875rem',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            border: '1px solid #334155',
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#fbbf24' }}
              />
              <span style={{ color: '#f8fafc' }}>Pin to Top</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={(e) => setIsCompleted(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#34d399' }}
              />
              <span style={{ color: '#f8fafc' }}>Mark Completed</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
