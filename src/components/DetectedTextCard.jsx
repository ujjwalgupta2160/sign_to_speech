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
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      boxShadow: 'var(--shadow-card)',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Terminal size={18} color="var(--text-secondary)" />
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Detected text
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleCopy}
            disabled={!detectedText}
            title={copied ? "Copied to clipboard!" : "Copy detected text"}
            style={{
              background: 'none',
              border: 'none',
              color: copied ? 'var(--accent-green)' : 'var(--text-secondary)',
              cursor: detectedText ? 'pointer' : 'not-allowed',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: detectedText ? 1 : 0.4,
              transition: 'all 0.2s ease'
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>

          <button
            onClick={() => setShowMenu(!showMenu)}
            title="More options"
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
              transition: 'color 0.2s'
            }}
          >
            <MoreHorizontal size={18} />
          </button>

          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '56px',
              right: '24px',
              backgroundColor: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              zIndex: 30,
              minWidth: '150px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
            }}>
              <button
                onClick={() => {
                  setDetectedText(detectedText.toUpperCase());
                  setShowMenu(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Uppercase Text
              </button>
              <button
                onClick={() => {
                  onClearText();
                  setShowMenu(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: '#f87171',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Reset & Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: isDetecting ? 'var(--accent-cyan)' : (detectedText ? 'var(--accent-green)' : 'var(--text-muted)')
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: isDetecting ? 'var(--accent-cyan)' : (detectedText ? 'var(--accent-green)' : 'var(--text-muted)')
          }} className={isDetecting ? 'animate-pulse' : ''} />
          <span>
            {isDetecting
              ? `TRANSLATED: "${activeTypingSign || 'SIGN'}"`
              : (detectedText ? 'TRANSLATION READY' : 'AWAITING YOUR FIRST SIGN')}
          </span>
        </div>

        {isDetecting && (
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-cyan)',
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            padding: '2px 8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span className="animate-pulse">●</span> Detected Live
          </span>
        )}
      </div>

      {/* Main Text Display / Editable Area */}
      <div style={{ minHeight: '140px', display: 'flex', flexDirection: 'column' }}>
        {!detectedText ? (
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 400,
              color: 'var(--text-primary)',
              lineHeight: 1.3,
              marginBottom: '10px'
            }}>
              Your words will appear here.
            </h2>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5
            }}>
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
              onFocus={e => e.currentTarget.style.borderColor = 'var(--border-focus)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            />

            {/* Gesture Tags Trail */}
            {recentSigns && recentSigns.length > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '10px',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Detected signs:</span>
                {recentSigns.map((sign, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(6, 182, 212, 0.1)',
                      border: '1px solid rgba(6, 182, 212, 0.25)',
                      color: 'var(--accent-cyan)'
                    }}
                  >
                    {sign}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer info & Clear button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>{wordCount}</span>
          <span>{wordCount === 1 ? 'WORD' : 'WORDS'}</span>
        </div>

        <button
          onClick={onClearText}
          disabled={!detectedText}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '13px',
            color: detectedText ? 'var(--text-secondary)' : 'var(--text-muted)',
            cursor: detectedText ? 'pointer' : 'default',
            padding: '2px 6px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={e => {
            if (detectedText) e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={e => {
            if (detectedText) e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          Clear text
        </button>
      </div>
    </div>
  );
}
