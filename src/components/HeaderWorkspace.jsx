import React from 'react';

export default function HeaderWorkspace({ isSessionActive, sessionTime }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '28px',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          lineHeight: 1.2,
          marginBottom: '6px'
        }}>
          Uni-Sign Workspace
        </h1>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          fontWeight: 400
        }}>
          Continuous Multimodal Sign Language Understanding & Neural Speech (ICLR 2025)
        </p>
      </div>

      {/* Status Pill */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '999px',
        backgroundColor: isSessionActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.04)',
        border: `1px solid ${isSessionActive ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)'}`,
        fontSize: '13px',
        fontFamily: 'var(--font-mono)',
        color: isSessionActive ? '#34d399' : 'var(--text-secondary)'
      }}>
        <div style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: isSessionActive ? 'var(--accent-green)' : 'var(--text-muted)',
          boxShadow: isSessionActive ? '0 0 8px var(--accent-green)' : 'none'
        }} />
        <span>{isSessionActive ? 'Session Active' : 'Not started'}</span>
        <span style={{ color: 'var(--border-strong)', margin: '0 2px' }}>|</span>
        <span>{formatTime(sessionTime)}</span>
      </div>
    </div>
  );
}
