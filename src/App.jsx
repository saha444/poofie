import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingAndAuth from './components/LandingAndAuth';
import Onboarding from './components/Onboarding';
import Feed from './components/Feed';
import CreatePost from './components/CreatePost';
import Profile from './components/Profile';
import Verification from './components/Verification';
import ReputationRate from './components/ReputationRate';
import XPProgress from './components/XPProgress';
import Settings from './components/Settings';
import Notifications from './components/Notifications';

function MainAppContent() {
  const { activeView, wallet, txLoading, ipfsLoading, txStep } = useApp();

  // Dynamic View Renderer based on router state
  const renderActiveView = () => {
    switch (activeView) {
      case 'landing':
      case 'auth':
        return <LandingAndAuth />;
      case 'onboarding':
        return <Onboarding />;
      case 'feed':
        return <Feed />;
      case 'create':
        return <CreatePost />;
      case 'profile':
        return <Profile />;
      case 'verify-professional':
        return <Verification />;
      case 'rate-reputation':
        return <ReputationRate />;
      case 'xp':
        return <XPProgress />;
      case 'settings':
        return <Settings />;
      case 'notifications':
        return <Notifications />;
      default:
        return <LandingAndAuth />;
    }
  };

  // Immersive layouts vs standard sidebar grids
  // Landing and authentication are shown in simple full-width view styles
  const isImmersiveView = !wallet.connected || activeView === 'landing' || activeView === 'auth' || activeView === 'onboarding';

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar />

      {/* Main viewport grid */}
      <main className={isImmersiveView ? 'immersive-container' : 'main-layout'} style={{
        padding: isImmersiveView ? '40px 24px' : '24px',
        maxWidth: isImmersiveView ? '1200px' : '1400px',
        margin: '0 auto',
        width: '100%',
        flex: 1
      }}>
        {!isImmersiveView && <Sidebar />}
        <div style={{ minWidth: 0 }}>
          {renderActiveView()}
        </div>
      </main>

      {/* Footer (only visible on guest or landing) */}
      {isImmersiveView && activeView === 'landing' && (
        <footer style={{
          textAlign: 'center',
          padding: '40px 24px',
          borderTop: '1px solid var(--border-light)',
          fontSize: '0.8rem',
          color: 'var(--text-dim)',
          marginTop: '60px'
        }}>
          <div>&copy; 2026 Poofie Protocol. Built on Ethereum & IPFS. All reputation metrics are portable and on-chain.</div>
        </footer>
      )}

      {/* Ethereum & IPFS transaction loader overlay */}
      {(txLoading || ipfsLoading) && (
        <div className="tx-loader-overlay">
          <div className="loader-glow-ring"></div>
          <span className="pulse-text">{txStep || 'Processing on-chain transaction...'}</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '8px', letterSpacing: '0.05em' }}>
            {txLoading ? 'Confirming MetaMask Gas Blocks...' : 'Encrypting assets onto IPFS...'}
          </span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
