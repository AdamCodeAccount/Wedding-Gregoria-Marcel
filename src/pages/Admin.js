import React, { useState } from 'react';
import { useGuestManagement } from '../hooks/useGuestManagement';
import AdminPanel from '../components/AdminPanel';
import '../styles/adminPage.css';

const AdminPage = () => {
  const { guests, sendReminderToAll } = useGuestManagement();

  const handleSendReminder = async () => {
    await sendReminderToAll();
    alert(`Rappel envoyé à ${guests.length} invité(s) !`);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Panneau d'Administration</h1>
        <a href="/" className="back-link">← Retour au site</a>
      </div>
      <AdminPanel guests={guests} onSendReminder={handleSendReminder} />
    </div>
  );
};

export default AdminPage;