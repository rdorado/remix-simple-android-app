import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  noteTitle: string;
  noteId: number;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  noteTitle,
  noteId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '440px' }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171' }}>
            <AlertTriangle size={20} />
            <h3 className="title-md" style={{ color: '#f8fafc' }}>Confirm Database Deletion</h3>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            Are you sure you want to permanently delete note <strong style={{ color: '#f8fafc' }}>#{noteId} ("{noteTitle}")</strong> from the PostgreSQL database?
          </p>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.75rem' }}>
            This action cannot be undone and will immediately remove the entry for all connected client applications.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={onConfirm} className="btn btn-danger">
              <Trash2 size={16} /> Delete Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
