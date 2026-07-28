import React from 'react';
import { Note } from '../types/note';
import { Pin, CheckCircle, Circle, Edit2, Trash2, Clock } from 'lucide-react';

interface NotesGridProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onTogglePin: (id: number, currentPinned: boolean) => void;
  onToggleComplete: (id: number, currentCompleted: boolean) => void;
}

export const NotesGrid: React.FC<NotesGridProps> = ({
  notes,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleComplete,
}) => {
  const getCategoryBadgeClass = (category: string) => {
    const cat = category.toLowerCase();
    if (cat === 'personal') return 'badge-personal';
    if (cat === 'work') return 'badge-work';
    if (cat === 'ideas') return 'badge-ideas';
    if (cat === 'tasks') return 'badge-tasks';
    return 'badge-default';
  };

  const formatDate = (ts: number) => {
    if (!ts) return 'N/A';
    return new Date(ts).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.25rem',
    }}>
      {notes.map((note) => (
        <div
          key={note.id}
          className="card-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: `4px solid ${note.colorHex || '#6366f1'}`,
            position: 'relative',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          <div>
            {/* Top Bar inside Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
            }}>
              <span className={`badge ${getCategoryBadgeClass(note.category)}`}>
                {note.category}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>#{note.id}</span>
                <button
                  onClick={() => onTogglePin(note.id, note.isPinned)}
                  className="btn-icon"
                  style={{ color: note.isPinned ? '#fbbf24' : '#64748b', padding: '2px' }}
                  title={note.isPinned ? 'Unpin note' : 'Pin note'}
                >
                  <Pin size={16} fill={note.isPinned ? '#fbbf24' : 'none'} />
                </button>
              </div>
            </div>

            {/* Note Title */}
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#f8fafc',
              marginBottom: '0.5rem',
              textDecoration: note.isCompleted ? 'line-through' : 'none',
              opacity: note.isCompleted ? 0.6 : 1,
            }}>
              {note.title}
            </h3>

            {/* Note Content */}
            <p style={{
              fontSize: '0.875rem',
              color: '#94a3b8',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              marginBottom: '1.25rem',
              maxHeight: '140px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {note.content}
            </p>
          </div>

          {/* Footer Actions & Timestamp */}
          <div style={{
            paddingTop: '0.75rem',
            borderTop: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#64748b', fontSize: '0.75rem' }}>
              <Clock size={12} />
              {formatDate(note.timestamp)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <button
                onClick={() => onToggleComplete(note.id, note.isCompleted)}
                className="btn-icon"
                style={{ color: note.isCompleted ? '#34d399' : '#64748b' }}
                title={note.isCompleted ? 'Mark incomplete' : 'Mark complete'}
              >
                {note.isCompleted ? <CheckCircle size={16} /> : <Circle size={16} />}
              </button>
              <button
                onClick={() => onEdit(note)}
                className="btn-icon"
                style={{ color: '#818cf8' }}
                title="Edit entry"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="btn-icon"
                style={{ color: '#f87171' }}
                title="Delete entry"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
