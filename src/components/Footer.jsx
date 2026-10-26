import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Footer({ onOpenHowToSign }) {
  return (
    <footer style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 0',
      borderTop: '1px solid var(--border-subtle)',
      fontSize: '12px',
      color: 'var(--text-muted)',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>SignVoice</span>
        <span>/</span>
        <span>From gestures to words.</span>
      </div>

      {/* Center */}
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        Translation can make mistakes. Review your words before speaking.
      </div>

      {/* Right */}
      <div>
        <button
          onClick={onOpenHowToSign}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <span>Need a hand?</span>
          <ArrowUpRight size={13} />
        </button>
      </div>
    </footer>
  );
}
