import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useGuestManagement } from '../hooks/useGuestManagement';
import AdminPanel from '../components/AdminPanel';
import '../styles/adminPage.css';

const ADMIN_AUTH_KEY = 'admin_authenticated';



const AdminPage = () => {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { guests, fetchGuests, sendReminderToAll, clearAllGuests } = useGuestManagement();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true');
  }, []);

  useEffect(() => {
    if (isAuthenticated && typeof fetchGuests === 'function')  {
      fetchGuests();
    }
  }, [isAuthenticated, fetchGuests]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const correctPassword = process.env.REACT_APP_ADMIN_PASSWORD;
    if (!correctPassword) {
      setError(
        'Admin non configuré : ajoutez REACT_APP_ADMIN_PASSWORD dans le fichier .env'
      );
      return;
    }
    if (password === correctPassword) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      setIsAuthenticated(true);
    } else {
      setError('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleSendReminder = async () => {
    const result = await sendReminderToAll();
    const n = result?.count ?? guests.length;
    alert(`Rappel traité pour ${n} invité(s).`);
  };

  const handleClearAll = async () => {
    if (
      window.confirm(
        'Êtes-vous sûr de vouloir supprimer tous les invités ? Cette action est irréversible.'
      )
    ) {
      await clearAllGuests();
      alert('Tous les invités ont été supprimés.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-login" style={{
          maxWidth: 400,
          margin: '100px auto',
          padding: 40,
          background: 'white',
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: '0 0 24px 0', fontSize: 24, color: '#1a1a1a', textAlign: 'center' }}>
            Administration
          </h1>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoFocus
              style={{
                width: '100%',
                padding: 14,
                marginBottom: 12,
                border: '2px solid #ddd',
                borderRadius: 8,
                fontSize: 16,
                boxSizing: 'border-box'
              }}
            />
            {error && (
              <p style={{ color: '#c53030', margin: '0 0 12px 0', fontSize: 14 }}>{error}</p>
            )}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: 14,
                background: '#D4AF37',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 16
              }}
            >
              Accéder
            </button>
          </form>
          <button
            type="button"
            onClick={() => setLocation('/')}
            style={{ display: 'block', textAlign: 'center', marginTop: 20, color: '#666', textDecoration: 'none', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ← Retour au site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Panneau d'Administration</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              color: '#1a1a1a',
              border: '2px solid #1a1a1a',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            Déconnexion
          </button>
          <button
            type="button"
            onClick={() => setLocation('/')}
            className="back-link"
            style={{ cursor: 'pointer' }}
          >
            ← Retour au site
          </button>
        </div>
      </div>
      <AdminPanel guests={guests} onSendReminder={handleSendReminder} onClearAll={handleClearAll} />
    </div>
  );
};

export default AdminPage;