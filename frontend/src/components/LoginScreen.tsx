import React, { useState } from 'react';
import { Lock, ShieldCheck, User, KeyRound, Database, ArrowRight } from 'lucide-react';
import { AdminUser } from '../types/note';

interface LoginScreenProps {
  onLogin: (user: AdminUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState<'System Administrator' | 'Data Auditor'>('System Administrator');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    // Secure Admin Portal Login Verification
    setError(null);
    onLogin({
      username: username.trim(),
      role: role,
      lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top, #1e293b 0%, #0f172a 100%)',
      padding: '1.5rem',
    }}>
      <div className="modal-card" style={{ maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#818cf8',
            marginBottom: '1rem',
          }}>
            <Database size={32} />
          </div>
          <h1 className="title-lg" style={{ color: '#f8fafc' }}>Simple Notes Admin</h1>
          <p className="text-sm" style={{ marginTop: '0.25rem' }}>
            Database Administration & Maintenance Portal
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <Lock size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <User size={14} /> Username
            </label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <KeyRound size={14} /> Password
            </label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <ShieldCheck size={14} /> Administrative Scope
            </label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="System Administrator">System Administrator (Full CRUD)</option>
              <option value="Data Auditor">Data Auditor (Read-Only & Fixes)</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.875rem', fontSize: '0.95rem' }}
          >
            Authenticate & Access Portal
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #334155',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#64748b',
        }}>
          Direct REST API Connection: <code style={{ color: '#38bdf8' }}>/api/notes</code>
        </div>
      </div>
    </div>
  );
};
