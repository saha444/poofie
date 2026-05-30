import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Search, 
  Wallet, 
  Settings, 
  User, 
  LogOut, 
  Layers, 
  CheckCircle, 
  Award, 
  AlertTriangle,
  Trash2,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { 
    wallet, 
    userProfile, 
    notifications, 
    handleConnectWallet, 
    handleDisconnect, 
    navigate,
    handleClearDatabase
  } = useApp();
  
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotifClick = (notif) => {
    setShowNotifDropdown(false);
    if (notif.actionView) {
      navigate(notif.actionView, notif.actionParams || {});
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} style={{ color: '#10b981' }} />;
      case 'warning':
        return <AlertTriangle size={16} style={{ color: '#ef4444' }} />;
      case 'milestone':
        return <Award size={16} style={{ color: '#f59e0b' }} />;
      case 'xp':
        return <Layers size={16} style={{ color: '#00f2fe' }} />;
      default:
        return <Bell size={16} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  return (
    <nav className="glass-panel" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'between',
      padding: '16px 24px',
      borderRadius: '0px 0px 16px 16px',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      gap: '20px'
    }}>
      {/* Logo */}
      <div 
        onClick={() => navigate(wallet.connected && userProfile ? 'feed' : 'landing')} 
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#000', fontSize: '1.25rem' }}>P</span>
        </div>
        <div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>POOFIE</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '-4px' }}>AI Developer DNA</span>
        </div>
      </div>

      {/* Global Search box */}
      <div style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
        <input 
          type="text" 
          placeholder="Search by DNA, specializations, skills..."
          onClick={() => navigate('explore')}
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-light)',
            borderRadius: '24px',
            padding: '10px 16px 10px 40px',
            color: 'var(--text-main)',
            fontSize: '0.85rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        />
        <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
      </div>

      {/* Action Buttons / User Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {wallet.connected && userProfile ? (
          <>
            {/* Notifications Hub */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  color: 'var(--text-main)',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifDropdown && (
                <div className="glass-panel" style={{
                  position: 'absolute',
                  right: 0,
                  top: '52px',
                  width: '320px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  zIndex: 200,
                  padding: '12px',
                  borderRadius: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Notifications</span>
                  </div>

                  {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                      No notifications yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {notifications.slice(0, 5).map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => handleNotifClick(notif)}
                          style={{
                            display: 'flex',
                            gap: '10px',
                            padding: '10px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'var(--transition-smooth)',
                            borderLeft: notif.type === 'warning' ? '2px solid #ef4444' : notif.type === 'success' ? '2px solid #10b981' : 'none'
                          }}
                        >
                          <div style={{ marginTop: '2px' }}>{getNotifIcon(notif.type)}</div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.8rem', lineHeight: '1.3', color: 'var(--text-main)' }}>{notif.message}</p>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                              {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Connection status display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 242, 254, 0.05)',
              border: '1px solid var(--border-glow)',
              borderRadius: '24px',
              padding: '6px 14px',
              gap: '8px',
              fontSize: '0.75rem',
              color: 'var(--accent-cyan)'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)', boxShadow: '0 0 6px var(--accent-cyan)' }}></span>
              <span>Identity Network Live</span>
            </div>

            {/* Profile Avatar */}
            {userProfile && (
              <div 
                onClick={() => navigate('profile', { username: userProfile.username })}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '2px solid var(--border-light)',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
            )}

            {/* Reset Sandbox */}
            <button 
              onClick={handleClearDatabase}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                padding: '4px',
                marginLeft: '4px'
              }}
              title="Reset Sandbox Database (Wipe Local Storage)"
            >
              <Trash2 size={18} />
            </button>

            {/* Logout */}
            <button 
              onClick={handleDisconnect}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                padding: '4px'
              }}
              title="Disconnect Wallet"
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <button 
            onClick={handleConnectWallet}
            className="btn-primary"
            style={{
              padding: '10px 18px',
              fontSize: '0.85rem'
            }}
          >
            <Wallet size={16} />
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}
