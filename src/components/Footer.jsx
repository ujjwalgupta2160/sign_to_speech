import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Footer({ onOpenHowToSign }) {
  return (
    <footer className="app-footer">
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>SignVoice</span>
        <span>/</span>
        <span>From gestures to words.</span>
      </div>

      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        Translation can make mistakes. Review your words before speaking.
      </div>

      <div>
        <button
          type="button"
          className="footer-link-btn"
          onClick={onOpenHowToSign}
        >
          <span>Need a hand?</span>
          <ArrowUpRight size={13} />
        </button>
      </div>
    </footer>
  );
}
