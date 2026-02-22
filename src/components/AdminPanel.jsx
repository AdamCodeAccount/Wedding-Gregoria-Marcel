import React from 'react';

const AdminPanel = ({ guests, onSendReminder }) => {
  return (
    <div className="admin-panel" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{
        padding: 24,
        background: 'white',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: 24
      }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: 20, color: '#1a1a1a' }}>
          Invités confirmés ({guests.length})
        </h2>
        {guests.length === 0 ? (
          <p style={{ color: '#666', margin: 0 }}>
            Aucun invité pour le moment. Les invités apparaîtront ici après avoir confirmé leur présence sur le site.
          </p>
        ) : (
          <>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
              {guests.map((g) => (
                <li
                  key={g.id}
                  style={{
                    padding: '12px 0',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16
                  }}
                >
                  <div>
                    <strong style={{ color: '#1a1a1a' }}>{g.name}</strong>
                    <span style={{ color: '#666', marginLeft: 8 }}>{g.email}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#888' }}>
                    {g.emailSent && <span style={{ marginRight: 8 }}>✓ Invitation envoyée</span>}
                    {g.reminderSent && <span>✓ Rappel envoyé</span>}
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onSendReminder}
              style={{
                padding: '12px 24px',
                background: '#D4AF37',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              Envoyer un rappel à tous
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
