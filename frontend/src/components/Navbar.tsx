import React from 'react';
import {
  Database,
  RefreshCw,
  Plus,
  LogOut,
  LayoutGrid,
  List,
  Sparkles,
  Search,
  Filter,
  ShieldCheck,
} from 'lucide-react';
import { AdminUser } from '../types/note';

interface NavbarProps {
  user: AdminUser;
  onLogout: () => void;
  onRefresh: () => void;
  onOpenCreate: () => void;
  onSeed: () => void;
  viewMode: 'table' | 'grid';
  setViewMode: (mode: 'table' | 'grid') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onRefresh,
  onOpenCreate,
  onSeed,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  isLoading,
}) => {
  return (
    <header style={{
      backgroundColor: '#1e293b',
      borderBottom: '1px solid #334155',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        {/* Top Header Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          {/* Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}>
              <Database size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                  Simple Notes
                </h1>
                <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
                  Admin Portal
                </span>
              </div>
              <p className="text-sm" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Database Maintenance & Operational Management
              </p>
            </div>
          </div>

          {/* Admin User Info & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#0f172a',
              padding: '0.375rem 0.875rem',
              borderRadius: '9999px',
              border: '1px solid #334155',
            }}>
              <ShieldCheck size={16} color="#34d399" />
              <div style={{ fontSize: '0.8125rem' }}>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>{user.username}</span>
                <span style={{ color: '#64748b', marginLeft: '0.375rem' }}>({user.role})</span>
              </div>
            </div>

            <button
              onClick={onSeed}
              className="btn btn-secondary"
              title="Seed sample notes into database"
              style={{ fontSize: '0.8125rem', padding: '0.5rem 0.875rem' }}
            >
              <Sparkles size={15} color="#fbbf24" />
              Seed DB
            </button>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="btn btn-secondary"
              title="Refresh data from PostgreSQL"
              style={{ padding: '0.5rem 0.75rem' }}
            >
              <RefreshCw size={15} className={isLoading ? 'spin-icon' : ''} />
            </button>

            <button
              onClick={onOpenCreate}
              className="btn btn-primary"
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              <Plus size={18} />
              New Entry
            </button>

            <button
              onClick={onLogout}
              className="btn-icon"
              title="Logout"
              style={{ color: '#f87171' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          paddingTop: '0.5rem',
          borderTop: '1px solid #334155',
        }}>
          {/* Search Box */}
          <div style={{
            position: 'relative',
            flex: '1',
            minWidth: '240px',
            maxWidth: '480px',
          }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
              }}
            />
            <input
              type="text"
              placeholder="Search database by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{
                width: '100%',
                paddingLeft: '2.5rem',
                backgroundColor: '#0f172a',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {/* Category Filter & View Mode */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={15} color="#94a3b8" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select"
                style={{ backgroundColor: '#0f172a', fontSize: '0.875rem', minWidth: '130px' }}
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div style={{
              display: 'flex',
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '2px',
              border: '1px solid #334155',
            }}>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  padding: '0.4rem 0.6rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: viewMode === 'table' ? '#334155' : 'transparent',
                  color: viewMode === 'table' ? '#ffffff' : '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.8125rem',
                }}
              >
                <List size={16} /> Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '0.4rem 0.6rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: viewMode === 'grid' ? '#334155' : 'transparent',
                  color: viewMode === 'grid' ? '#ffffff' : '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.8125rem',
                }}
              >
                <LayoutGrid size={16} /> Cards
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
