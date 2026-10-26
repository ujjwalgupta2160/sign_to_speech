import React from 'react';
import { Sun, Maximize2, Hand } from 'lucide-react';

export default function BottomMetrics({ signsDetectedCount, spokenMessagesCount }) {
  const padZero = (num) => String(num).padStart(2, '0');

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      gap: '16px',
      marginTop: '24px',
      marginBottom: '32px'
    }}>
      {/* THIS SESSION Metrics Card */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          marginBottom: '16px'
        }}>
          THIS SESSION
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px' }}>
          <div>
            <div style={{
              fontSize: '36px',
              fontWeight: 400,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              lineHeight: 1
            }}>
              {padZero(signsDetectedCount)}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginTop: '6px'
            }}>
              Signs detected
            </div>
          </div>

          <div>
            <div style={{
              fontSize: '36px',
              fontWeight: 400,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              lineHeight: 1
            }}>
              {padZero(spokenMessagesCount)}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginTop: '6px'
            }}>
              Spoken messages
            </div>
          </div>
        </div>
      </div>

      {/* A CLEARER CONVERSATION STARTS HERE Tips Card */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          marginBottom: '18px'
        }}>
          A CLEARER CONVERSATION STARTS HERE
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '24px'
        }}>
          {/* Tip 1 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>
              <Sun size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Find your light
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Face a light source. Keep your background simple.
              </div>
            </div>
          </div>

          {/* Tip 2 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>
              <Maximize2 size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Make room for your signs
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Keep your face and both hands inside the frame.
              </div>
            </div>
          </div>

          {/* Tip 3 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>
              <Hand size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Sign at your own pace
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Use clear gestures and pause between phrases.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
