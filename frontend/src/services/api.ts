import { Note, CreateNoteDto, UpdateNoteDto } from '../types/note';

const getBaseUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.endsWith('/') ? `${envUrl}api/notes` : `${envUrl}/api/notes`;
  }
  // Default to relative /api/notes or localhost:5000 in dev
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api/notes';
  }
  return '/api/notes';
};

const BASE_URL = getBaseUrl();

export const api = {
  async getNotes(query?: string, category?: string): Promise<Note[]> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category && category !== 'All') params.append('category', category);

    const url = params.toString() ? `${BASE_URL}?${params.toString()}` : BASE_URL;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch notes: ${res.statusText}`);
    }
    return res.json();
  },

  async getNoteById(id: number): Promise<Note> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch note #${id}: ${res.statusText}`);
    }
    return res.json();
  },

  async createNote(dto: CreateNoteDto): Promise<Note> {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      throw new Error(`Failed to create note: ${res.statusText}`);
    }
    return res.json();
  },

  async updateNote(id: number, dto: UpdateNoteDto): Promise<Note> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      throw new Error(`Failed to update note #${id}: ${res.statusText}`);
    }
    return res.json();
  },

  async togglePin(id: number, isPinned: boolean): Promise<Note> {
    const res = await fetch(`${BASE_URL}/${id}/pin`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPinned }),
    });
    if (!res.ok) {
      throw new Error(`Failed to update pin status for #${id}`);
    }
    return res.json();
  },

  async toggleComplete(id: number, isCompleted: boolean): Promise<Note> {
    const res = await fetch(`${BASE_URL}/${id}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted }),
    });
    if (!res.ok) {
      throw new Error(`Failed to update completion status for #${id}`);
    }
    return res.json();
  },

  async deleteNote(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok && res.status !== 204) {
      throw new Error(`Failed to delete note #${id}`);
    }
  },

  async seedNotes(): Promise<Note[]> {
    const res = await fetch(`${BASE_URL}/seed`, {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error('Failed to trigger database seeding');
    }
    return res.json();
  },
};
