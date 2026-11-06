import React, { useState, useEffect } from 'react';
import { Volume2, Play, Square } from 'lucide-react';
import { uniSignSpeechConverter } from '../utils/uniSignSpeechConverter';

export default function NaturalSpeechCard({
  detectedText,
  autoSpeak,
  setAutoSpeak,
  onSpeechCompleted
}) {
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const updateVoices = () => {
      const avail = uniSignSpeechConverter.getVoices();
      setVoices(avail);
      if (avail.length > 0 && !selectedVoiceURI) {
        const preferred = avail.find(v => v.name.includes('Aria') || v.name.includes('Jenny') || v.name.includes('Natural') || v.lang.startsWith('en')) || avail[0];
        setSelectedVoiceURI(preferred.voiceURI);
        uniSignSpeechConverter.setVoice(preferred.voiceURI);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [selectedVoiceURI]);

  const handleSpeak = () => {
    if (!detectedText) return;

    uniSignSpeechConverter.speak(detectedText, {
      voiceURI: selectedVoiceURI,
      rate: speed,
      volume: volume,
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        if (onSpeechCompleted) onSpeechCompleted(detectedText);
      },
      onError: () => setIsSpeaking(false)
    });
  };

  const handleStop = () => {
    uniSignSpeechConverter.stop();
    setIsSpeaking(false);
  };

  return (
    <article className="natural-speech-card">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="soundwave-container">
            <div className={`soundwave-bar ${isSpeaking ? '' : 'style-idle'}`} style={{ height: isSpeaking ? undefined : '10px' }} />
            <div className={`soundwave-bar ${isSpeaking ? '' : 'style-idle'}`} style={{ height: isSpeaking ? undefined : '16px' }} />
            <div className={`soundwave-bar ${isSpeaking ? '' : 'style-idle'}`} style={{ height: isSpeaking ? undefined : '8px' }} />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Uni-Sign Speech Converter
          </span>
        </div>

        <div className={`speech-status-pill ${isSpeaking ? 'speaking' : ''}`}>
          {isSpeaking && <span className="nav-pill-dot" />}
          <span>{isSpeaking ? 'SPEAKING...' : 'IDLE'}</span>
        </div>
      </div>

      {/* Voice & Speed Controls Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: '12px', marginBottom: '18px' }}>
        <div>
          <label htmlFor="voice-select" style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Voice
          </label>
          <select
            id="voice-select"
            className="ui-select"
            style={{ width: '100%', padding: '9px 12px', fontSize: '13px' }}
            value={selectedVoiceURI}
            onChange={(e) => {
              const uri = e.target.value;
              setSelectedVoiceURI(uri);
              uniSignSpeechConverter.setVoice(uri);
            }}
          >
            {voices.length > 0 ? (
              voices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))
            ) : (
              <option value="">Aria · English (US) [Default]</option>
            )}
          </select>
        </div>

        <div>
          <label htmlFor="speed-select" style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Speed
          </label>
          <select
            id="speed-select"
            className="ui-select"
            style={{ width: '100%', padding: '9px 12px', fontSize: '13px' }}
            value={speed}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setSpeed(val);
              uniSignSpeechConverter.setRate(val);
            }}
          >
            <option value="0.75">0.75×</option>
            <option value="1.0">1.0×</option>
            <option value="1.25">1.25×</option>
            <option value="1.5">1.5×</option>
          </select>
        </div>
      </div>

      {/* Auto-speak Toggle & Volume Slider */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div
          role="switch"
          aria-checked={autoSpeak}
          tabIndex={0}
          onClick={() => setAutoSpeak(!autoSpeak)}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setAutoSpeak(!autoSpeak); }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}
        >
          <div className={`toggle-switch ${autoSpeak ? 'active' : ''}`}>
            <div className="toggle-knob" />
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Auto-speak
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Volume2 size={16} color="var(--text-secondary)" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setVolume(val);
              uniSignSpeechConverter.setVolume(val);
            }}
            aria-label="Volume slider"
            className="speech-range-input"
            style={{ width: '90px' }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', marginBottom: '14px' }}>
        <button
          type="button"
          className="btn-action-start"
          onClick={handleSpeak}
          disabled={!detectedText || isSpeaking}
          style={{ justifyContent: 'center' }}
        >
          <Play size={14} fill="currentColor" />
          <span>Speak text</span>
        </button>

        <button
          type="button"
          className="btn-action-stop"
          onClick={handleStop}
          disabled={!isSpeaking}
          style={{ padding: '8px 16px' }}
        >
          <Square size={14} fill="currentColor" />
          <span>Stop</span>
        </button>
      </div>

      {/* Status helper text */}
      <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
        {isSpeaking
          ? 'Synthesizing voice playback...'
          : 'Speech is ready when your first message is.'}
      </div>
    </article>
  );
}
