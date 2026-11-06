import React from 'react';
import { X, Play, Clock, MessageSquare, Trash2 } from 'lucide-react';
import { uniSignSpeechConverter } from '../utils/uniSignSpeechConverter';

export default function SessionHistoryModal({ isOpen, onClose, history, onClearHistory }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog modal-md" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Session History
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Record of your translated signs and spoken messages
            </p>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content List */}
        <div className="modal-scroll-body">
          {history.length === 0 ? (
            <div className="history-empty-state">
              <MessageSquare size={36} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No translations recorded yet</p>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>Signs recognized during your session will appear here.</p>
            </div>
          ) : (
            history.map((item, index) => (
              <div key={index} className="history-card-item">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="hud-tag" style={{ color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.1)', borderColor: 'rgba(6, 182, 212, 0.25)' }}>
                      {item.signName}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} />
                      {item.timestamp}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {item.phrase}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => uniSignSpeechConverter.speak(item.phrase)}
                  title="Replay speech"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '8px',
                    color: 'var(--text-primary)'
                  }}
                >
                  <Play size={14} fill="currentColor" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="modal-footer">
            <button
              type="button"
              className="btn-icon"
              onClick={onClearHistory}
              style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Trash2 size={14} />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
