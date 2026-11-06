import React, { useState } from 'react';
import { Terminal, Copy, Check, MoreHorizontal } from 'lucide-react';

export default function DetectedTextCard({
  detectedText,
  setDetectedText,
  recentSigns,
  isDetecting,
  activeTypingSign,
  onClearText
}) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const wordCount = detectedText.trim() ? detectedText.trim().split(/\s+/).length : 0;

  const handleCopy = () => {
    if (!detectedText) return;
    navigator.clipboard.writeText(detectedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="detected-text-card">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Terminal size={18} color="var(--text-secondary)" />
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Detected text
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          <button
            type="button"
            className="btn-icon"
            onClick={handleCopy}
            disabled={!detectedText}
            title={copied ? 'Copied to clipboard!' : 'Copy detected text'}
            style={{ color: copied ? 'var(--accent-green)' : undefined }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>

          <button
            type="button"
            className="btn-icon"
            onClick={() => setShowMenu(!showMenu)}
            title="More options"
          >
            <MoreHorizontal size={18} />
          </button>

          {showMenu && (
            <div className="detected-text-menu-dropdown">
              <button
                type="button"
                className="menu-dropdown-item"
                onClick={() => {
                  setDetectedText(detectedText.toUpperCase());
                  setShowMenu(false);
                }}
              >
                Uppercase Text
              </button>
              <button
                type="button"
                className="menu-dropdown-item danger"
                onClick={() => {
                  onClearText();
                  setShowMenu(false);
                }}
              >
                Reset & Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: isDetecting ? 'var(--accent-cyan)' : (detectedText ? 'var(--accent-green)' : 'var(--text-muted)')
        }}>
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isDetecting ? 'var(--accent-cyan)' : (detectedText ? 'var(--accent-green)' : 'var(--text-muted)')
            }}
            className={isDetecting ? 'animate-pulse' : ''}
          />
          <span>
            {isDetecting
              ? `TRANSLATED: "${activeTypingSign || 'SIGN'}"`
              : (detectedText ? 'TRANSLATION READY' : 'AWAITING YOUR FIRST SIGN')}
          </span>
        </div>

        {isDetecting && (
          <span className="hud-tag" style={{ color: 'var(--accent-cyan)', borderColor: 'rgba(6, 182, 212, 0.3)', background: 'rgba(6, 182, 212, 0.15)' }}>
            ● Detected Live
          </span>
        )}
      </div>

      {/* Main Text Display / Editable Area */}
      <div style={{ minHeight: '140px', display: 'flex', flexDirection: 'column' }}>
        {!detectedText ? (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '10px' }}>
              Your words will appear here.
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Signs become text in real time. Review or edit your message before you speak it aloud.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
            <textarea
              value={detectedText}
              onChange={(e) => setDetectedText(e.target.value)}
              placeholder="Your translated words..."
              rows={4}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                color: 'var(--text-primary)',
                fontSize: '18px',
                lineHeight: 1.4,
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />

            {recentSigns && recentSigns.length > 0 && (
              <div className="recent-signs-row">
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Detected signs:</span>
                {recentSigns.map((sign, idx) => (
                  <span key={idx} className="recent-sign-chip">
                    {sign}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info & Clear */}
      <div className="detected-text-counter-row" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'flex', gap: '6px' }}>
          <span>{wordCount}</span>
          <span>{wordCount === 1 ? 'WORD' : 'WORDS'}</span>
        </div>

        <button
          type="button"
          className="btn-icon"
          onClick={onClearText}
          disabled={!detectedText}
          style={{ fontSize: '13px' }}
        >
          Clear text
        </button>
      </div>
    </article>
  );
}
