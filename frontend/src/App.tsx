import React, { useState, useEffect, useCallback } from 'react';
import { Note, CreateNoteDto, AdminUser } from './types/note';
import { api } from './services/api';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { NotesTable } from './components/NotesTable';
import { NotesGrid } from './components/NotesGrid';
import { NoteModal } from './components/NoteModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { Toast, ToastMessage } from './components/Toast';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('simple_notes_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters & View Mode
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals
  const [isNoteModalOpen, setIsNoteModalOpen] = useState<boolean>(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Notes from API
  const fetchNotes = useCallback(async () => {
    if (!adminUser) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getNotes(searchQuery, selectedCategory);
      setNotes(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect to backend REST API.');
    } finally {
      setIsLoading(false);
    }
  }, [adminUser, searchQuery, selectedCategory]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Auth
  const handleLogin = (user: AdminUser) => {
    setAdminUser(user);
    localStorage.setItem('simple_notes_admin_user', JSON.stringify(user));
    addToast('success', `Welcome back, ${user.username}! Admin portal session initialized.`);
  };

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('simple_notes_admin_user');
  };

  // Extract all categories
  const categories = Array.from(
    new Set(notes.map((n) => n.category).filter(Boolean))
  );

  // Save Note (Create / Edit)
  const handleSaveNote = async (dto: CreateNoteDto) => {
    try {
      if (editingNote) {
        const updated = await api.updateNote(editingNote.id, dto);
        setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        addToast('success', `Note #${updated.id} successfully updated.`);
      } else {
        const created = await api.createNote(dto);
        setNotes((prev) => [created, ...prev]);
        addToast('success', `New note #${created.id} successfully created.`);
      }
      setIsNoteModalOpen(false);
      setEditingNote(null);
    } catch (err: any) {
      addToast('error', err.message || 'Error saving note.');
    }
  };

  // Pin Toggle
  const handleTogglePin = async (id: number, currentPinned: boolean) => {
    try {
      const updated = await api.togglePin(id, !currentPinned);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      addToast('info', `Note #${id} ${!currentPinned ? 'pinned to top' : 'unpinned'}.`);
    } catch (err: any) {
      addToast('error', err.message || 'Failed to update pin state.');
    }
  };

  // Complete Toggle
  const handleToggleComplete = async (id: number, currentCompleted: boolean) => {
    try {
      const updated = await api.toggleComplete(id, !currentCompleted);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      addToast('info', `Note #${id} marked as ${!currentCompleted ? 'completed' : 'incomplete'}.`);
    } catch (err: any) {
      addToast('error', err.message || 'Failed to update completion state.');
    }
  };

  // Confirm Delete Note
  const handleConfirmDelete = async () => {
    if (!deletingNote) return;
    try {
      await api.deleteNote(deletingNote.id);
      setNotes((prev) => prev.filter((n) => n.id !== deletingNote.id));
      addToast('success', `Note #${deletingNote.id} deleted from database.`);
      setDeletingNote(null);
    } catch (err: any) {
      addToast('error', err.message || 'Failed to delete note.');
    }
  };

  // Seed DB
  const handleSeed = async () => {
    try {
      setIsLoading(true);
      const seeded = await api.seedNotes();
      setNotes(seeded);
      addToast('success', 'Default sample data seeded into database.');
    } catch (err: any) {
      addToast('error', err.message || 'Failed to seed database.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!adminUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* Navbar Header */}
      <Navbar
        user={adminUser}
        onLogout={handleLogout}
        onRefresh={fetchNotes}
        onOpenCreate={() => {
          setEditingNote(null);
          setIsNoteModalOpen(true);
        }}
        onSeed={handleSeed}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        isLoading={isLoading}
      />

      {/* Main Admin Dashboard */}
      <main className="main-content">
        {/* KPI Stats Bar */}
        <StatsOverview notes={notes} />

        {/* Error Banner */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={20} />
              <div>
                <strong>Backend API Error:</strong> {error}
              </div>
            </div>
            <button onClick={fetchNotes} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
              <RefreshCw size={14} /> Retry Connection
            </button>
          </div>
        )}

        {/* Content Views */}
        {viewMode === 'table' ? (
          <NotesTable
            notes={notes}
            onEdit={(note) => {
              setEditingNote(note);
              setIsNoteModalOpen(true);
            }}
            onDelete={(id) => {
              const target = notes.find((n) => n.id === id);
              if (target) setDeletingNote(target);
            }}
            onTogglePin={handleTogglePin}
            onToggleComplete={handleToggleComplete}
            onSeed={handleSeed}
          />
        ) : (
          <NotesGrid
            notes={notes}
            onEdit={(note) => {
              setEditingNote(note);
              setIsNoteModalOpen(true);
            }}
            onDelete={(id) => {
              const target = notes.find((n) => n.id === id);
              if (target) setDeletingNote(target);
            }}
            onTogglePin={handleTogglePin}
            onToggleComplete={handleToggleComplete}
          />
        )}
      </main>

      {/* Create / Edit Note Modal */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={handleSaveNote}
        initialNote={editingNote}
        categories={categories}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingNote}
        onClose={() => setDeletingNote(null)}
        onConfirm={handleConfirmDelete}
        noteTitle={deletingNote?.title || ''}
        noteId={deletingNote?.id || 0}
      />

      {/* Toast Feedback */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
