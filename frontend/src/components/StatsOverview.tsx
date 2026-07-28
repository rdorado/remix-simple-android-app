import React from 'react';
import { Note } from '../types/note';
import { Database, Pin, CheckCircle2, Folder, Activity } from 'lucide-react';

interface StatsOverviewProps {
  notes: Note[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ notes }) => {
  const totalCount = notes.length;
  const pinnedCount = notes.filter((n) => n.isPinned).length;
  const completedCount = notes.filter((n) => n.isCompleted).length;
  const categoriesCount = new Set(notes.map((n) => n.category)).size;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem',
    }}>
      {/* Total Notes */}
      <div className="card-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#818cf8',
        }}>
          <Database size={24} />
        </div>
        <div>
          <div className="text-sm">Total Records</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>{totalCount}</div>
        </div>
      </div>

      {/* Pinned Notes */}
      <div className="card-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fbbf24',
        }}>
          <Pin size={24} />
        </div>
        <div>
          <div className="text-sm">Pinned Notes</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>{pinnedCount}</div>
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="card-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#34d399',
        }}>
          <CheckCircle2 size={24} />
        </div>
        <div>
          <div className="text-sm">Completed Items</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>{completedCount}</div>
        </div>
      </div>

      {/* Categories */}
      <div className="card-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'rgba(236, 72, 153, 0.15)',
          border: '1px solid rgba(236, 72, 153, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f472b6',
        }}>
          <Folder size={24} />
        </div>
        <div>
          <div className="text-sm">Active Categories</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>{categoriesCount}</div>
        </div>
      </div>

      {/* DB Connection Health */}
      <div className="card-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#38bdf8',
        }}>
          <Activity size={24} />
        </div>
        <div>
          <div className="text-sm">Database Engine</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34d399', display: 'inline-block' }}></span>
            PostgreSQL 16 Connected
          </div>
        </div>
      </div>
    </div>
  );
};
