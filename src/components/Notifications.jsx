import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Award, 
  Layers, 
  Trash2,
  Clock
} from 'lucide-react';

export default function Notifications() {
  const { notifications, navigate } = useApp();

  const getNotifIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} style={{ color: '#10b981' }} />;
      case 'warning':
        return <AlertTriangle size={20} style={{ color: '#ef4444' }} />;
      case 'milestone':
        return <Award size={20} style={{ color: '#f59e0b' }} />;
      case 'xp':
        return <Layers size={20} style={{ color: 'var(--accent-cyan)' }} />;
      default:
        return <Bell size={20} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  const handleNotifClick = (notif) => {
    if (notif.actionView) {
      navigate(notif.actionView, notif.actionParams || {});
    }
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bell size={24} style={{ color: 'var(--accent-cyan)' }} />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)' }}>Identity Notifications</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cryptographic alerts from the Ethereum and IPFS reputation network</span>
            </div>
          </div>
        </div>

        {/* List of alerts */}
        {notifications.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-dim)' }}>
            No notifications logged yet. Your on-chain history is clear!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => handleNotifClick(notif)}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '10px',
                  cursor: notif.actionView ? 'pointer' : 'default',
                  transition: 'var(--transition-smooth)',
                  alignItems: 'start'
                }}
                className={notif.actionView ? 'hover-card-bg' : ''}
              >
                <div style={{ shrink: 0, marginTop: '2px' }}>{getNotifIcon(notif.type)}</div>
                
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.85rem', lineHeight: '1.4', color: 'var(--text-main)' }}>{notif.message}</p>
                  
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {new Date(notif.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {notif.actionText && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 600, cursor: 'pointer' }}>
                        {notif.actionText} →
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
