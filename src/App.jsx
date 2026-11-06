import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeaderWorkspace from './components/HeaderWorkspace';
import SignInputCard from './components/SignInputCard';
import DetectedTextCard from './components/DetectedTextCard';
import NaturalSpeechCard from './components/NaturalSpeechCard';
import BottomMetrics from './components/BottomMetrics';
import Footer from './components/Footer';
import SessionHistoryModal from './components/SessionHistoryModal';
import HowToSignModal from './components/HowToSignModal';
import SettingsModal from './components/SettingsModal';
import { uniSignSpeechConverter } from './utils/uniSignSpeechConverter';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState('translator');
  const [signLanguage, setSignLanguage] = useState('ISL');
  const [inputMode, setInputMode] = useState('phrases'); // 'phrases', 'alphabet', 'numbers'
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  // Translation & Speech States
  const [detectedText, setDetectedText] = useState('');
  const [recentSigns, setRecentSigns] = useState([]);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);

  // Metrics
  const [signsDetectedCount, setSignsDetectedCount] = useState(0);
  const [spokenMessagesCount, setSpokenMessagesCount] = useState(0);

  // Modals & Settings
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHowToSignOpen, setIsHowToSignOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mirrorMode, setMirrorMode] = useState(false);
  const [sensitivity, setSensitivity] = useState(70);

  // History log
  const [history, setHistory] = useState([
    {
      signName: 'Namaste',
      phrase: 'Namaste, greetings!',
      timestamp: '10:42 AM'
    },
    {
      signName: 'Swagatam',
      phrase: 'Aapka swagatam hai, welcome!',
      timestamp: '10:43 AM'
    }
  ]);

  // Session timer ticker
  useEffect(() => {
    let timer = null;
    if (isSessionActive) {
      timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSessionActive]);

  // Active detection state for Detected Text
  const [activeTypingSign, setActiveTypingSign] = useState(null);

  // Handler when a sign gesture is recognized
  const handleGestureDetected = useCallback((sign) => {
    setIsDetecting(true);
    setActiveTypingSign(sign.name);

    setTimeout(() => {
      setIsDetecting(false);
      setActiveTypingSign(null);
    }, 1200);

    setSignsDetectedCount(prev => {
      const nextCount = prev + 1;
      if (nextCount % 5 === 0) {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.7 },
          colors: ['#06b6d4', '#10b981', '#ffffff']
        });
      }
      return nextCount;
    });

    setRecentSigns(prev => [sign.name, ...prev.filter(s => s !== sign.name)].slice(0, 7));

    if (sign.isLetter || sign.type === 'letter') {
      const char = (sign.letter || sign.text || sign.phrase || '').toUpperCase();
      setDetectedText(prev => prev + char);
    } else if (sign.isNumber || sign.type === 'number') {
      const num = sign.digit || sign.text || sign.phrase;
      setDetectedText(prev => {
        const clean = prev.trim();
        return clean ? `${clean} ${num}` : num;
      });
    } else {
      const word = sign.text || sign.phrase || sign.name;
      setDetectedText(prev => {
        const clean = prev.trim();
        if (!clean) return word;
        if (clean.endsWith(word)) return clean;
        return `${clean} ${word}`;
      });

      if (autoSpeak) {
        uniSignSpeechConverter.speak(word, {
          rate: 1.0,
          volume: 1.0,
          onEnd: () => {
            setSpokenMessagesCount(c => c + 1);
          }
        });
      }
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setHistory(prev => [
      {
        signName: sign.name,
        phrase: sign.phrase,
        timestamp: timeStr
      },
      ...prev
    ]);
  }, [autoSpeak]);

  const handleFingerspellLetter = useCallback((char) => {
    setDetectedText(prev => prev + char);
    setSignsDetectedCount(c => c + 1);
  }, []);

  const handleFingerspellSpace = useCallback(() => {
    setDetectedText(prev => prev + ' ');
  }, []);

  const handleFingerspellBackspace = useCallback(() => {
    setDetectedText(prev => prev.slice(0, -1));
  }, []);

  const handleStartSession = useCallback(() => {
    setIsSessionActive(true);
  }, []);

  const handleStopSession = useCallback(() => {
    setIsSessionActive(false);
  }, []);

  const handleResetSession = useCallback(() => {
    setIsSessionActive(false);
    setSessionTime(0);
    setDetectedText('');
    setRecentSigns([]);
    setSignsDetectedCount(0);
    setSpokenMessagesCount(0);
    uniSignSpeechConverter.stop();
  }, []);

  const handleClearText = useCallback(() => {
    setDetectedText('');
    setRecentSigns([]);
    uniSignSpeechConverter.stop();
  }, []);

  return (
    <div className="app-shell">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenHowToSign={() => setIsHowToSignOpen(true)}
      />

      {/* Main Workspace Area */}
      <main className="app-main-workspace">
        <HeaderWorkspace
          isSessionActive={isSessionActive}
          sessionTime={sessionTime}
        />

        {/* 2-Column Responsive Workspace Grid */}
        <div className="workspace-grid">
          {/* Left Column: Sign input / Camera feed */}
          <section className="workspace-col-left" aria-label="Sign Input Column">
            <SignInputCard
              signLanguage={signLanguage}
              setSignLanguage={setSignLanguage}
              isSessionActive={isSessionActive}
              onStartSession={handleStartSession}
              onStopSession={handleStopSession}
              onResetSession={handleResetSession}
              onGestureDetected={handleGestureDetected}
              mirrorMode={mirrorMode}
              setMirrorMode={setMirrorMode}
              inputMode={inputMode}
              setInputMode={setInputMode}
              onFingerspellLetter={handleFingerspellLetter}
              onFingerspellSpace={handleFingerspellSpace}
              onFingerspellBackspace={handleFingerspellBackspace}
              sensitivity={sensitivity}
            />
          </section>

          {/* Right Column: Detected Text & Natural Speech */}
          <section className="workspace-col-right" aria-label="Output and Speech Column">
            <DetectedTextCard
              detectedText={detectedText}
              setDetectedText={setDetectedText}
              recentSigns={recentSigns}
              isDetecting={isDetecting}
              activeTypingSign={activeTypingSign}
              onClearText={handleClearText}
            />

            <NaturalSpeechCard
              detectedText={detectedText}
              autoSpeak={autoSpeak}
              setAutoSpeak={setAutoSpeak}
              onSpeechCompleted={() => setSpokenMessagesCount(c => c + 1)}
            />
          </section>
        </div>

        {/* Bottom Metrics & Tips */}
        <BottomMetrics
          signsDetectedCount={signsDetectedCount}
          spokenMessagesCount={spokenMessagesCount}
        />

        {/* Footer */}
        <Footer onOpenHowToSign={() => setIsHowToSignOpen(true)} />
      </main>

      {/* Modals */}
      <SessionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => {
          setIsHistoryOpen(false);
          setActiveTab('translator');
        }}
        history={history}
        onClearHistory={() => setHistory([])}
      />

      <HowToSignModal
        isOpen={isHowToSignOpen}
        onClose={() => {
          setIsHowToSignOpen(false);
          setActiveTab('translator');
        }}
        onSelectSign={handleGestureDetected}
        initialLanguage={signLanguage}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        mirrorMode={mirrorMode}
        setMirrorMode={setMirrorMode}
        sensitivity={sensitivity}
        setSensitivity={setSensitivity}
      />
    </div>
  );
}
