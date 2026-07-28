import React, { useState } from 'react';
import { Note } from '../types/note';
import {
  Pin,
  CheckCircle,
  Circle,
  Edit2,
  Trash2,
  ArrowUpDown,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';

interface NotesTableProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onTogglePin: (id: number, currentPinned: boolean) => void;
  onToggleComplete: (id: number, currentCompleted: boolean) => void;
  onSeed: () => void;
}

type SortField = 'id' | 'title' | 'category' | 'timestamp' | 'isPinned' | 'isCompleted';

export const NotesTable: React.FC<NotesTableProps> = ({
  notes,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleComplete,
  onSeed,
}) => {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedNotes = [...notes].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      aVal = (aVal as string).toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

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

  if (notes.length === 0) {
    return (
      <div className="card-panel" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
        <div style={{ color: '#64748b', marginBottom: '1rem' }}>
          <Tag size={48} />
        </div>
        <h3 className="title-md" style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>
          No records match your filters
        </h3>
        <p className="text-sm" style={{ marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
          No notes were found in the database for the current query or category. You can create a new entry or seed sample data.
        </p>
        <button onClick={onSeed} className="btn btn-primary">
          <Sparkles size={16} /> Seed Default Database Notes
        </button>
      </div>
    );
  }

  return (
    <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.875rem',
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#0f172a',
              borderBottom: '1px solid #334155',
              color: '#94a3b8',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              <th
                onClick={() => handleSort('id')}
                style={{ padding: '0.875rem 1.25rem', cursor: 'pointer', width: '70px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  ID <ArrowUpDown size={12} />
                </div>
              </th>
              <th
                onClick={() => handleSort('title')}
                style={{ padding: '0.875rem 1.25rem', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  Title & Content Preview <ArrowUpDown size={12} />
                </div>
              </th>
              <th
                onClick={() => handleSort('category')}
                style={{ padding: '0.875rem 1.25rem', cursor: 'pointer', width: '130px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  Category <ArrowUpDown size={12} />
                </div>
              </th>
              <th style={{ padding: '0.875rem 1.25rem', width: '100px', textAlign: 'center' }}>
                Status
              </th>
              <th
                onClick={() => handleSort('timestamp')}
                style={{ padding: '0.875rem 1.25rem', cursor: 'pointer', width: '150px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  Timestamp <ArrowUpDown size={12} />
                </div>
              </th>
              <th style={{ padding: '0.875rem 1.25rem', width: '130px', textAlign: 'right' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedNotes.map((note) => (
              <tr
                key={note.id}
                style={{
                  borderBottom: '1px solid #1e293b',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2d3748')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {/* ID */}
                <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#64748b' }}>
                  #{note.id}
                </td>

                {/* Title & Preview */}
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: note.colorHex || '#FFF8E1',
                        border: '1px solid rgba(255,255,255,0.2)',
                        flexShrink: 0,
                      }}
                      title={`Color: ${note.colorHex}`}
                    />
                    <span style={{
                      fontWeight: 600,
                      color: '#f8fafc',
                      textDecoration: note.isCompleted ? 'line-through' : 'none',
                      opacity: note.isCompleted ? 0.6 : 1,
                    }}>
                      {note.title}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '0.8125rem',
                    color: '#94a3b8',
                    marginTop: '0.25rem',
                    maxWidth: '450px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {note.content}
                  </p>
                </td>

                {/* Category */}
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span className={`badge ${getCategoryBadgeClass(note.category)}`}>
                    {note.category}
                  </span>
                </td>

                {/* Status Flags (Pin / Complete) */}
                <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => onTogglePin(note.id, note.isPinned)}
                      className="btn-icon"
                      style={{
                        color: note.isPinned ? '#fbbf24' : '#475569',
                      }}
                      title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
                    >
                      <Pin size={16} fill={note.isPinned ? '#fbbf24' : 'none'} />
                    </button>

                    <button
                      onClick={() => onToggleComplete(note.id, note.isCompleted)}
                      className="btn-icon"
                      style={{
                        color: note.isCompleted ? '#34d399' : '#475569',
                      }}
                      title={note.isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      {note.isCompleted ? <CheckCircle size={16} /> : <Circle size={16} />}
                    </button>
                  </div>
                </td>

                {/* Timestamp */}
                <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Clock size={13} color="#64748b" />
                    {formatDate(note.timestamp)}
                  </div>
                </td>

                {/* Actions */}
                <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.375rem' }}>
                    <button
                      onClick={() => onEdit(note)}
                      className="btn-icon"
                      style={{ color: '#818cf8' }}
                      title="Edit note entry"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(note.id)}
                      className="btn-icon"
                      style={{ color: '#f87171' }}
                      title="Delete record from database"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
