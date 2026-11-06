import React from 'react';
import { X, Sliders, Shield } from 'lucide-react';

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
        className="modal-dialog"
        style={{ maxWidth: '500px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Session & Camera Settings
            </h2>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {/* Mirror mode toggle */}
          <div className="settings-toggle-row">
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                Mirror Video Feed
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Mirror camera for self-signing (recommended off when scanning 2nd person)
              </div>
            </div>
            <div
              role="switch"
              aria-checked={mirrorMode}
              tabIndex={0}
              className={`toggle-switch ${mirrorMode ? 'active' : ''}`}
              onClick={() => setMirrorMode(!mirrorMode)}
              onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setMirrorMode(!mirrorMode); }}
            >
              <div className="toggle-knob" />
            </div>
          </div>

          {/* Sensitivity */}
          <div style={{ padding: '14px 16px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
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
              aria-label="Detection Sensitivity"
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-card)' }}>
          <button
            type="button"
            className="pill-tab-btn active"
            onClick={onClose}
            style={{ padding: '8px 20px', fontSize: '13px' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
