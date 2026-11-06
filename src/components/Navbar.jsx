import React from 'react';
import { Hand, ShieldCheck, Sliders } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenSettings, onOpenHistory, onOpenHowToSign }) {
  const tabs = [
    { id: 'translator', label: 'Translator' },
    { id: 'history', label: 'Session history' },
    { id: 'how-to-sign', label: 'How to sign' }
  ];

  return (
    <nav className="navbar">
      {/* Brand Logo */}
      <div className="navbar-brand">
        <div className="brand-icon-box">
          <Hand size={18} strokeWidth={2.5} />
        </div>
        <div className="brand-title-wrap">
          <span className="brand-title">UNI-SIGN</span>
          <span className="brand-badge">ICLR 2025</span>
        </div>
      </div>

      {/* Center Nav Tabs */}
      <div className="nav-center-tabs">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'history') onOpenHistory();
                if (tab.id === 'how-to-sign') onOpenHowToSign();
              }}
            >
              {tab.label}
              {isActive && <div className="nav-tab-indicator" />}
            </button>
          );
        })}
      </div>

      {/* Right Controls */}
      <div className="nav-right-controls">
        <div
          className="nav-pill-badge active-status"
          title="Uni-Sign (ICLR 2025) ST-GCN Engine running locally and offline"
        >
          <span className="nav-pill-dot" />
          <span>Uni-Sign ST-GCN Active</span>
        </div>

        <div className="nav-pill-badge subtle">
          <ShieldCheck size={14} color="var(--accent-green)" />
          <span>Private session</span>
        </div>

        <button
          type="button"
          className="btn-icon"
          onClick={onOpenSettings}
          title="Session & Camera Settings"
        >
          <Sliders size={18} />
        </button>

        <div className="nav-user-avatar">
          G
        </div>
      </div>
    </nav>
  );
}
