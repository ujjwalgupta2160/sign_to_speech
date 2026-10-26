import React from 'react';
import { X, Sliders, Eye, Zap, Volume2, Shield } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  mirrorMode,
  setMirrorMode,
  sensitivity,
  setSensitivity
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-strong)',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Session & Camera Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Mirror mode toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            backgroundColor: 'var(--bg-card-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                Mirror Video Feed
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Mirror camera for self-signing (recommended off when scanning 2nd person)
              </div>
            </div>
            <div
              onClick={() => setMirrorMode(!mirrorMode)}
              style={{
                width: '40px',
                height: '24px',
                borderRadius: '999px',
                backgroundColor: mirrorMode ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: mirrorMode ? '#000000' : '#8e93a0',
                position: 'absolute',
                top: '3px',
                left: mirrorMode ? '19px' : '3px',
                transition: 'left 0.2s'
              }} />
            </div>
          </div>

          {/* Sensitivity */}
          <div style={{
            padding: '14px 16px',
            backgroundColor: 'var(--bg-card-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                Detection Sensitivity
              </div>
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                {sensitivity}%
              </div>
            </div>
            <input
              type="range"
              min="40"
              max="95"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#ffffff', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>Relaxed</span>
              <span>Strict</span>
            </div>
          </div>

          {/* Privacy Notice */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            fontSize: '12px',
            color: '#a7f3d0'
          }}>
            <Shield size={16} color="var(--accent-green)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <strong>100% On-Device Processing</strong>: All computer vision calculations and speech generation happen locally inside your browser. No video frames are ever recorded, uploaded, or transmitted to any server.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-card)'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
