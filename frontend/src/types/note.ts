export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  isCompleted: boolean;
  colorHex: string;
  timestamp: number;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  isCompleted: boolean;
  colorHex: string;
}

export interface UpdateNoteDto {
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  isCompleted: boolean;
  colorHex: string;
}

export interface UpdatePinDto {
  isPinned: boolean;
}

export interface UpdateCompletedDto {
  isCompleted: boolean;
}

export interface AdminUser {
  username: string;
  role: 'System Administrator' | 'Data Auditor';
  lastLogin: string;
}
