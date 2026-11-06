import React from 'react';
import { Sun, Maximize2, Hand } from 'lucide-react';

export default function BottomMetrics({ signsDetectedCount, spokenMessagesCount }) {
  const padZero = (num) => String(num).padStart(2, '0');

  return (
    <section className="bottom-metrics-grid" aria-label="Session Metrics & Tips">
      {/* Session Metrics Card */}
      <div className="metrics-card-session">
        <div className="metrics-header-label">
          THIS SESSION
        </div>

        <div className="metrics-numbers-row">
          <div>
            <div className="metric-number">
              {padZero(signsDetectedCount)}
            </div>
            <div className="metric-label">
              Signs detected
            </div>
          </div>

          <div>
            <div className="metric-number">
              {padZero(spokenMessagesCount)}
            </div>
            <div className="metric-label">
              Spoken messages
            </div>
          </div>
        </div>
      </div>

      {/* Tips Card */}
      <div className="metrics-card-tips">
        <div className="metrics-header-label">
          A CLEARER CONVERSATION STARTS HERE
        </div>

        <div className="tips-grid">
          <div className="tip-item">
            <div className="tip-icon-box">
              <Sun size={16} />
            </div>
            <div>
              <div className="tip-title">Light your hands well</div>
              <div className="tip-desc">Face your light source so gestures are crisp and shadows don't obscure finger shapes.</div>
            </div>
          </div>

          <div className="tip-item">
            <div className="tip-icon-box">
              <Maximize2 size={16} />
            </div>
            <div>
              <div className="tip-title">Stay in frame</div>
              <div className="tip-desc">Position yourself so both hands and your face remain in the viewport reticle.</div>
            </div>
          </div>

          <div className="tip-item">
            <div className="tip-icon-box">
              <Hand size={16} />
            </div>
            <div>
              <div className="tip-title">Sign naturally</div>
              <div className="tip-desc">Hold each sign steady for a split second or pause between phrases for fluent continuous translation.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
