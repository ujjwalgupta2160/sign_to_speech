import React from 'react';
import { Hand, ShieldCheck, Sliders } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenSettings, onOpenHistory, onOpenHowToSign }) {

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      height: '64px',
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-main)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #06b6d4, #10b981)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(6, 182, 212, 0.35)'
        }}>
          <Hand size={18} strokeWidth={2.5} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: 'var(--text-primary)'
          }}>
            UNI-SIGN
          </span>
          <span style={{
            fontSize: '9px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '1px 5px',
            borderRadius: '4px'
          }}>
            ICLR 2025
          </span>
        </div>
      </div>

      {/* Center Nav Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', height: '100%' }}>
        {[
          { id: 'translator', label: 'Translator' },
          { id: 'history', label: 'Session history' },
          { id: 'how-to-sign', label: 'How to sign' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'history') onOpenHistory();
                if (tab.id === 'how-to-sign') onOpenHowToSign();
              }}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                height: '100%',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: isActive ? 500 : 400,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '0 4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s ease'
              }}
            >
              {tab.label}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: '#ffffff',
                  borderRadius: '2px 2px 0 0'
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Uni-Sign Framework ST-GCN Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#10b981',
            fontSize: '12px',
            fontWeight: 600,
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.15)'
          }}
          title="Uni-Sign (ICLR 2025) 4-Component ST-GCN Engine running locally and offline"
        >
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 8px #10b981',
            display: 'inline-block'
          }} />
          <span>Uni-Sign ST-GCN Active</span>
        </div>

        {/* Private session badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '999px',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          <ShieldCheck size={14} color="var(--accent-green)" />
          <span>Private session</span>
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          title="Session & Camera Settings"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s, background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <Sliders size={18} />
        </button>

        {/* User Avatar */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--text-primary)'
        }}>
          G
        </div>
      </div>
    </nav>
  );
}
