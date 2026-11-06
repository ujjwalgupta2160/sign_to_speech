import React from 'react';

export default function HeaderWorkspace({ isSessionActive, sessionTime }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <header className="workspace-header">
      <div>
        <h1 className="workspace-title">
          Uni-Sign Workspace
        </h1>
        <p className="workspace-subtitle">
          Continuous Multimodal Sign Language Understanding & Neural Speech (ICLR 2025)
        </p>
      </div>

      {/* Live Session Timer Pill */}
      <div className={`session-timer-pill ${isSessionActive ? 'active' : ''}`}>
        <div className="timer-dot" />
        <span>{isSessionActive ? 'Session Active' : 'Not started'}</span>
        <span className="timer-divider">|</span>
        <time>{formatTime(sessionTime)}</time>
      </div>
    </header>
  );
}
