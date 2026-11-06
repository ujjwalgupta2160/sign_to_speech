import './index.css';
import { classifyHands, ALPHABET_A_TO_Z, NUMBERS_0_TO_10, FULL_SIGN_VOCABULARY, distance } from './utils/signClassifier.js';
import { uniSignStreamProcessor } from './utils/uniSignEngine.js';
import { uniSignSpeechConverter } from './utils/uniSignSpeechConverter.js';
import {
  CAMERA_STATES,
  getCameraConstraints,
  getFriendlyCameraError,
  hasCameraApi,
  stopMediaStream,
  waitForVideoReady
} from './utils/cameraLifecycle.js';
import confetti from 'canvas-confetti';

// ==========================================================================
// Application State (Clean Native JS)
// ==========================================================================
const state = {
  inputMode: 'phrases', // 'phrases' | 'alphabet' | 'numbers'
  signLanguage: 'ISL',
  isSessionActive: false,
  sessionSeconds: 0,
  autoSpeak: true,
  mirrorMode: false,
  targetSecondPerson: false,
  sensitivity: 70,
  cameraState: CAMERA_STATES.IDLE,
  signsDetectedCount: 0,
  spokenMessagesCount: 0,
  history: [
    { signName: 'Namaste', phrase: 'Namaste, greetings!', time: '10:42 AM' },
    { signName: 'Swagatam', phrase: 'Aapka swagatam hai, welcome!', time: '10:43 AM' }
  ]
};

// ==========================================================================
// DOM Elements Query
// ==========================================================================
const video = document.getElementById('webcam-video');
const canvas = document.getElementById('skeleton-canvas');
const viewportFrame = document.getElementById('viewport-frame');
const cameraOffState = document.getElementById('camera-off-state');
const startCameraBtn = document.getElementById('start-camera-btn');
const stopCameraBtn = document.getElementById('stop-camera-btn');
const translateManualBtn = document.getElementById('translate-manual-btn');
const secondPersonBtn = document.getElementById('second-person-btn');
const cameraErrorBox = document.getElementById('camera-error-box');

// HUD Elements
const hudCameraDot = document.getElementById('hud-camera-dot');
const hudCameraLabel = document.getElementById('hud-camera-label');
const hudBufferText = document.getElementById('hud-buffer-text');
const hudBufferCells = document.getElementById('hud-buffer-cells');
const hudBodyTag = document.getElementById('hud-body-tag');
const hudHandsTag = document.getElementById('hud-hands-tag');
const hudAnchorTag = document.getElementById('hud-anchor-tag');
const hudMotionBadge = document.getElementById('hud-motion-badge');

// Recognition Overlay
const recognitionOverlay = document.getElementById('recognition-overlay');
const recognitionAnalyzingMsg = document.getElementById('recognition-analyzing-msg');
const recognitionContent = document.getElementById('recognition-content');
const recognitionSignName = document.getElementById('recognition-sign-name');
const recognitionSignPhrase = document.getElementById('recognition-sign-phrase');
const recognitionPercentBadge = document.getElementById('recognition-percent-badge');
const holdProgressTrack = document.getElementById('hold-progress-track');
const holdProgressFill = document.getElementById('hold-progress-fill');
const recognitionStatusText = document.getElementById('recognition-status-text');

// Text & Output
const detectedTextarea = document.getElementById('detected-text-textarea');
const detectedTextEmptyPrompt = document.getElementById('detected-text-empty-prompt');
const wordCountBadge = document.getElementById('word-count-badge');
const recentSignsRow = document.getElementById('recent-signs-row');
const textStatusBadge = document.getElementById('text-status-badge');
const textStatusDot = document.getElementById('text-status-dot');
const clearTextBtn = document.getElementById('clear-text-btn');
const copyTextBtn = document.getElementById('copy-text-btn');
const textMoreBtn = document.getElementById('text-more-btn');
const textMenuDropdown = document.getElementById('text-menu-dropdown');
const uppercaseBtn = document.getElementById('uppercase-btn');
const resetTextBtn = document.getElementById('reset-text-btn');

// Speech
const speechVoiceSelect = document.getElementById('speech-voice-select');
const speechSpeedSelect = document.getElementById('speech-speed-select');
const speechVolumeSlider = document.getElementById('speech-volume-slider');
const autoSpeakSwitch = document.getElementById('auto-speak-switch');
const speakBtn = document.getElementById('speak-btn');
const stopSpeechBtn = document.getElementById('stop-speech-btn');
const speechStatusText = document.getElementById('speech-status-text');
const speechStatusPill = document.getElementById('speech-status-pill');
const soundwaveBars = document.querySelectorAll('.soundwave-bar');

// Header & Session
const sessionTimerPill = document.getElementById('session-timer-pill');
const sessionTimerText = document.getElementById('session-timer-text');
const sessionStateLabel = document.getElementById('session-state-label');
const startSessionBtn = document.getElementById('start-session-btn');
const stopSessionBtn = document.getElementById('stop-session-btn');
const resetSessionBtn = document.getElementById('reset-session-btn');
const footerSessionStatus = document.getElementById('footer-session-status');

// Metrics Counters
const signsDetectedNumber = document.getElementById('signs-detected-number');
const spokenMessagesNumber = document.getElementById('spoken-messages-number');

// Modals
const settingsDialog = document.getElementById('settings-dialog');
const historyDialog = document.getElementById('history-dialog');
const encyclopediaDialog = document.getElementById('encyclopedia-dialog');
const openSettingsBtn = document.getElementById('open-settings-btn');
const openHistoryBtn = document.getElementById('open-history-btn');
const openEncyclopediaBtn = document.getElementById('open-encyclopedia-btn');
const footerHowToSignBtn = document.getElementById('footer-how-to-sign-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const closeSettingsDoneBtn = document.getElementById('close-settings-done-btn');
const closeHistoryBtn = document.getElementById('close-history-btn');
const closeEncyclopediaBtn = document.getElementById('close-encyclopedia-btn');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const mirrorModeSwitch = document.getElementById('mirror-mode-switch');
const sensitivitySlider = document.getElementById('sensitivity-slider');
const sensitivityValue = document.getElementById('sensitivity-value');
const encyclopediaSearch = document.getElementById('encyclopedia-search');
const encyclopediaGrid = document.getElementById('encyclopedia-grid');

// ==========================================================================
// MediaPipe & Computer Vision State
// ==========================================================================
let handsModel = null;
let poseModel = null;
let poseLandmarks = null;
let cameraActive = false;
let frameLoopId = null;
let isSendingFrame = false;
let sessionInterval = null;
let confirmedTimeout = null;
let pauseTriggerTimeout = null;
let startRequestId = 0;
let lastProcessedTime = 0;
let lastEmittedSign = null;
let lastEmittedTime = 0;
let lastMotionTime = 0;
let isMoving = false;
let isAnalyzing = false;
let prevLandmarks = null;
let currentGesture = null;

const CLIP_LENGTH = 16;
let clipBuffer = [];
let lastBufferTime = 0;

const candidate = {
  name: null,
  sign: null,
  startTime: 0,
  lastSeenTime: 0,
  consecutiveFrames: 0,
  jitterFrames: 0
};

// ==========================================================================
// DOM Telemetry Update Functions (Pure Native DOM - Sub-Millisecond)
// ==========================================================================
function updateRecognitionHUD({
  cand,
  holdPercent,
  isConfirmed,
  analyzing,
  motion,
  bufferCount,
  poseLocked,
  handsCount,
  anchor
}) {
  if (analyzing) {
    recognitionOverlay.className = 'recognition-overlay-hud analyzing';
    recognitionAnalyzingMsg.style.display = 'flex';
    recognitionContent.style.display = 'none';
  } else if (isConfirmed) {
    recognitionOverlay.className = 'recognition-overlay-hud confirmed';
    recognitionAnalyzingMsg.style.display = 'none';
    recognitionContent.style.display = 'flex';
    recognitionSignName.textContent = `✓ ${cand?.name || ''}`;
    recognitionSignPhrase.textContent = '';
    recognitionPercentBadge.textContent = 'CONFIRMED';
    recognitionStatusText.textContent = 'Confirmed & added to detected text';
    holdProgressTrack.style.display = 'none';
  } else if (cand) {
    recognitionOverlay.className = 'recognition-overlay-hud holding';
    recognitionAnalyzingMsg.style.display = 'none';
    recognitionContent.style.display = 'flex';
    recognitionSignName.textContent = cand.name;
    recognitionSignPhrase.textContent = cand.phrase ? `"${cand.phrase}"` : '';
    recognitionPercentBadge.textContent = `${holdPercent}%`;
    recognitionStatusText.textContent = `Hold steady to recognize sign (${holdPercent}%)`;
    holdProgressTrack.style.display = 'block';
    holdProgressFill.style.width = `${holdPercent}%`;
    if (holdPercent > 75) holdProgressFill.classList.add('high');
    else holdProgressFill.classList.remove('high');
  } else {
    recognitionOverlay.className = 'recognition-overlay-hud hidden';
  }

  // Buffer track
  if (bufferCount !== undefined && hudBufferCells) {
    const cells = hudBufferCells.children;
    for (let i = 0; i < cells.length; i++) {
      if (i < bufferCount) cells[i].classList.add('filled');
      else cells[i].classList.remove('filled');
    }
    if (hudBufferText) hudBufferText.textContent = `UNI-SIGN ST-GCN BUFFER: ${bufferCount}/16`;
  }

  // Pose tag
  if (hudBodyTag && poseLocked !== undefined) {
    if (poseLocked) {
      hudBodyTag.className = 'hud-tag body-locked';
      hudBodyTag.textContent = 'UNI-SIGN BODY: LOCKED';
    } else {
      hudBodyTag.className = 'hud-tag';
      hudBodyTag.textContent = 'UNI-SIGN BODY: SCAN';
    }
  }

  // Hands tag
  if (hudHandsTag && handsCount !== undefined) {
    if (handsCount > 0) {
      hudHandsTag.className = 'hud-tag hands-locked';
      hudHandsTag.textContent = `HANDS: ${handsCount}`;
    } else {
      hudHandsTag.className = 'hud-tag';
      hudHandsTag.textContent = 'HANDS: 0';
    }
  }

  // Anchor
  if (hudAnchorTag) {
    if (anchor) {
      hudAnchorTag.style.display = 'inline-block';
      hudAnchorTag.textContent = `ANCHOR: ${anchor.toUpperCase()}`;
    } else {
      hudAnchorTag.style.display = 'none';
    }
  }

  // Motion badge
  if (hudMotionBadge && motion) {
    if (motion === 'moving') {
      hudMotionBadge.className = 'motion-hud-badge moving';
      hudMotionBadge.innerHTML = '<span class="animate-pulse-slow">●</span><span>TRACKING MOVEMENTS...</span>';
    } else if (motion === 'paused') {
      hudMotionBadge.className = 'motion-hud-badge paused';
      hudMotionBadge.innerHTML = '<span>MOVEMENT PAUSED — FINALIZING...</span>';
    } else if (motion === 'analyzing') {
      hudMotionBadge.className = 'motion-hud-badge analyzing';
      hudMotionBadge.innerHTML = '<span class="animate-pulse-slow">✨</span><span>UNI-SIGN TRANSLATION...</span>';
    } else if (motion === 'idle') {
      hudMotionBadge.className = 'motion-hud-badge';
      hudMotionBadge.innerHTML = '';
    }
  }
}

function updateCameraStatusUI(status, message = null) {
  state.cameraState = status;
  if (status === CAMERA_STATES.ACTIVE) {
    hudCameraDot.style.backgroundColor = 'var(--accent-green)';
    hudCameraDot.style.boxShadow = '0 0 8px var(--accent-green)';
    hudCameraLabel.textContent = 'LIVE';
    viewportFrame.classList.add('camera-active');
    video.classList.add('active');
    canvas.classList.add('active');
    cameraOffState.style.display = 'none';
    if (stopCameraBtn) stopCameraBtn.style.display = 'inline-flex';
    document.querySelectorAll('.corner-bracket').forEach(el => el.classList.add('active'));
    footerSessionStatus.textContent = 'Turn-Taking Motion Engine Active';
  } else if (status === CAMERA_STATES.ERROR) {
    hudCameraDot.style.backgroundColor = '#f87171';
    hudCameraDot.style.boxShadow = '0 0 8px #f87171';
    hudCameraLabel.textContent = 'ERROR';
    viewportFrame.classList.remove('camera-active');
    video.classList.remove('active');
    canvas.classList.remove('active');
    cameraOffState.style.display = 'flex';
    if (stopCameraBtn) stopCameraBtn.style.display = 'none';
    if (cameraErrorBox) {
      cameraErrorBox.textContent = message || 'Camera error encountered.';
      cameraErrorBox.style.display = 'block';
    }
    footerSessionStatus.textContent = 'Camera access error';
  } else {
    hudCameraDot.style.backgroundColor = 'var(--text-muted)';
    hudCameraDot.style.boxShadow = 'none';
    hudCameraLabel.textContent = 'CAMERA OFF';
    viewportFrame.classList.remove('camera-active');
    video.classList.remove('active');
    canvas.classList.remove('active');
    cameraOffState.style.display = 'flex';
    if (stopCameraBtn) stopCameraBtn.style.display = 'none';
    document.querySelectorAll('.corner-bracket').forEach(el => el.classList.remove('active'));
    footerSessionStatus.textContent = 'Camera access not enabled';
  }
}

// ==========================================================================
// Hand Skeleton Drawing (Canvas 2D)
// ==========================================================================
function drawCustomHandSkeleton(ctx, landmarks, strokeColor, fillColor) {
  const HAND_PAIRS = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [0, 9], [9, 10], [10, 11], [11, 12],
    [0, 13], [13, 14], [14, 15], [15, 16],
    [0, 17], [17, 18], [18, 19], [19, 20],
    [5, 9], [9, 13], [13, 17]
  ];

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 3;
  HAND_PAIRS.forEach(([i, j]) => {
    const p1 = landmarks[i];
    const p2 = landmarks[j];
    if (p1 && p2) {
      ctx.beginPath();
      ctx.moveTo(p1.x * ctx.canvas.width, p1.y * ctx.canvas.height);
      ctx.lineTo(p2.x * ctx.canvas.width, p2.y * ctx.canvas.height);
      ctx.stroke();
    }
  });

  landmarks.forEach((p, idx) => {
    const isTip = [4, 8, 12, 16, 20].includes(idx);
    ctx.beginPath();
    ctx.arc(p.x * ctx.canvas.width, p.y * ctx.canvas.height, isTip ? 5 : 3.5, 0, 2 * Math.PI);
    ctx.fillStyle = isTip ? '#ffffff' : fillColor;
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}

// ==========================================================================
// Recognition & Detection Pipeline
// ==========================================================================
function handleGestureDetected(sign) {
  state.signsDetectedCount++;
  signsDetectedNumber.textContent = String(state.signsDetectedCount).padStart(2, '0');

  if (state.signsDetectedCount % 5 === 0) {
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#06b6d4', '#10b981', '#ffffff']
    });
  }

  // Append text
  let currentVal = detectedTextarea.value.trim();
  if (sign.isLetter || sign.type === 'letter') {
    const char = (sign.letter || sign.text || sign.phrase || '').toUpperCase();
    detectedTextarea.value = detectedTextarea.value + char;
  } else if (sign.isNumber || sign.type === 'number') {
    const num = sign.digit || sign.text || sign.phrase;
    detectedTextarea.value = currentVal ? `${currentVal} ${num}` : num;
  } else {
    const word = sign.text || sign.phrase || sign.name;
    if (!currentVal) {
      detectedTextarea.value = word;
    } else if (!currentVal.endsWith(word)) {
      detectedTextarea.value = `${currentVal} ${word}`;
    }

    if (state.autoSpeak) {
      uniSignSpeechConverter.speak(word, {
        rate: parseFloat(speechSpeedSelect.value) || 1.0,
        volume: parseFloat(speechVolumeSlider.value) || 1.0,
        onStart: setSpeakingUI,
        onEnd: setIdleUI
      });
    }
  }

  // Update text visibility
  detectedTextEmptyPrompt.style.display = 'none';
  detectedTextarea.style.display = 'block';

  // Word count
  const words = detectedTextarea.value.trim().split(/\s+/).filter(Boolean).length;
  wordCountBadge.textContent = `${words} ${words === 1 ? 'WORD' : 'WORDS'}`;

  // Recent sign chip
  const chip = document.createElement('span');
  chip.className = 'recent-sign-chip';
  chip.textContent = sign.name;
  recentSignsRow.prepend(chip);
  if (recentSignsRow.children.length > 7) {
    recentSignsRow.lastElementChild.remove();
  }

  // Status badge
  textStatusBadge.textContent = `TRANSLATED: "${sign.name}"`;
  textStatusDot.style.backgroundColor = 'var(--accent-green)';

  // History entry
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  state.history.unshift({
    signName: sign.name,
    phrase: sign.phrase,
    time: timeStr
  });
  renderHistoryList();
}

async function processCompletedSigning() {
  if (!video || isAnalyzing) return;
  const now = Date.now();
  if (now - lastProcessedTime < 1600) return;

  isAnalyzing = true;
  updateRecognitionHUD({ analyzing: true, motion: 'analyzing' });

  try {
    const result = uniSignStreamProcessor.translateSequence(clipBuffer, currentGesture, {
      language: state.signLanguage,
      mode: state.inputMode
    });

    if (result && result.detected && (result.text || result.signName)) {
      lastProcessedTime = Date.now();
      const cleanText = (result.text || result.signName || '').trim();
      const isLetter = result.type === 'letter' || (cleanText.length === 1 && /^[A-Z]$/i.test(cleanText));
      const isNumber = result.type === 'number' || (cleanText.length === 1 && /^[0-9]$/.test(cleanText));
      const isWord = !isLetter && !isNumber;

      const signObj = {
        id: (result.signName || cleanText).toLowerCase().replace(/\s+/g, '_'),
        name: result.signName || (isLetter ? `Letter ${cleanText.toUpperCase()}` : cleanText),
        type: isLetter ? 'letter' : (isNumber ? 'number' : 'word'),
        text: isLetter ? cleanText.toUpperCase() : cleanText,
        phrase: isLetter ? cleanText.toUpperCase() : cleanText,
        isLetter: isLetter,
        isNumber: isNumber,
        isWord: isWord,
        confidence: result.confidence || 0.98
      };

      currentGesture = signObj;
      updateRecognitionHUD({
        cand: signObj,
        holdPercent: 100,
        isConfirmed: true,
        analyzing: false,
        motion: 'idle'
      });

      handleGestureDetected(signObj);

      if (confirmedTimeout) clearTimeout(confirmedTimeout);
      confirmedTimeout = setTimeout(() => {
        updateRecognitionHUD({ cand: null, holdPercent: 0, isConfirmed: false });
      }, 1500);
    } else if (currentGesture) {
      lastProcessedTime = Date.now();
      updateRecognitionHUD({
        cand: currentGesture,
        holdPercent: 100,
        isConfirmed: true,
        analyzing: false,
        motion: 'idle'
      });

      handleGestureDetected(currentGesture);

      if (confirmedTimeout) clearTimeout(confirmedTimeout);
      confirmedTimeout = setTimeout(() => {
        updateRecognitionHUD({ cand: null, holdPercent: 0, isConfirmed: false });
      }, 1500);
    }
  } catch (err) {
    console.error('Sequence translation error:', err);
  } finally {
    setTimeout(() => {
      isAnalyzing = false;
      updateRecognitionHUD({ analyzing: false, motion: 'idle' });
    }, 350);
  }
}

function onHandsResults(results) {
  if (!canvas || !video) return;
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;

  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (state.mirrorMode && !state.targetSecondPerson) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }

  // Draw Pose Skeleton
  if (poseLandmarks && poseLandmarks.length > 0) {
    if (window.drawConnectors && window.POSE_CONNECTIONS) {
      window.drawConnectors(ctx, poseLandmarks, window.POSE_CONNECTIONS, {
        color: '#10b981',
        lineWidth: 2.5
      });
      if (window.drawLandmarks) {
        window.drawLandmarks(ctx, poseLandmarks.slice(0, 23), {
          color: '#ffffff',
          fillColor: '#059669',
          radius: 3,
          lineWidth: 1
        });
      }
    }
  }

  // Draw Hands
  const handCount = results.multiHandLandmarks ? results.multiHandLandmarks.length : 0;
  updateRecognitionHUD({ handsCount: handCount });

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    results.multiHandLandmarks.forEach((landmarks, idx) => {
      const isSecondHand = idx === 1;
      const strokeColor = isSecondHand ? '#c084fc' : '#06b6d4';
      const fillColor = isSecondHand ? '#9333ea' : '#0284c7';

      if (window.drawConnectors && window.HAND_CONNECTIONS) {
        window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {
          color: strokeColor,
          lineWidth: 3
        });
        if (window.drawLandmarks) {
          window.drawLandmarks(ctx, landmarks, {
            color: '#ffffff',
            fillColor: fillColor,
            radius: 3.5,
            lineWidth: 1
          });
        }
      } else {
        drawCustomHandSkeleton(ctx, landmarks, strokeColor, fillColor);
      }
    });

    const now = Date.now();
    if (now - lastBufferTime >= 80) {
      lastBufferTime = now;
      clipBuffer.push({
        handsLandmarks: results.multiHandLandmarks,
        poseLandmarks: poseLandmarks,
        timestamp: now
      });
      if (clipBuffer.length > CLIP_LENGTH) clipBuffer.shift();
      updateRecognitionHUD({ bufferCount: clipBuffer.length });
    }

    // Motion tracking
    const h0 = results.multiHandLandmarks[0];
    let maxDisplacement = 0;
    let avgDisplacement = 0;

    if (prevLandmarks && prevLandmarks.length >= 21) {
      const prevH0 = prevLandmarks;
      const keyPoints = [0, 4, 8, 12, 16, 20];
      let totalD = 0;
      keyPoints.forEach(pt => {
        const d = distance(h0[pt], prevH0[pt]);
        if (d > maxDisplacement) maxDisplacement = d;
        totalD += d;
      });
      avgDisplacement = totalD / keyPoints.length;
    }
    prevLandmarks = h0;

    const movingNow = maxDisplacement > 0.012 || avgDisplacement > 0.006;
    if (movingNow) {
      isMoving = true;
      lastMotionTime = now;
      updateRecognitionHUD({ motion: 'moving' });
      if (pauseTriggerTimeout) {
        clearTimeout(pauseTriggerTimeout);
        pauseTriggerTimeout = null;
      }
    } else {
      if (isMoving && now - lastMotionTime > 550) {
        updateRecognitionHUD({ motion: 'paused' });
        if (!pauseTriggerTimeout && !isAnalyzing) {
          pauseTriggerTimeout = setTimeout(() => {
            isMoving = false;
            pauseTriggerTimeout = null;
            processCompletedSigning();
          }, 300);
        }
      } else if (state.inputMode === 'phrases' && !isMoving && !isAnalyzing) {
        if (now - lastMotionTime > 850 && now - lastProcessedTime > 2200) {
          if (!pauseTriggerTimeout && clipBuffer.length >= 3) {
            updateRecognitionHUD({ motion: 'paused' });
            pauseTriggerTimeout = setTimeout(() => {
              pauseTriggerTimeout = null;
              processCompletedSigning();
            }, 250);
          }
        }
      }
    }

    // Local classifier
    const detected = classifyHands(results.multiHandLandmarks, poseLandmarks, state.signLanguage, state.inputMode);
    const nowMs = Date.now();
    const baseHoldDuration = state.inputMode === 'alphabet' ? 850 : (state.inputMode === 'numbers' ? 900 : 1100);
    const holdDuration = Math.round(baseHoldDuration * (1.4 - (state.sensitivity / 100) * 0.6));

    if (detected) {
      currentGesture = detected;
      if (candidate.name === detected.name) {
        candidate.lastSeenTime = nowMs;
        candidate.consecutiveFrames += 1;
        candidate.jitterFrames = 0;
        candidate.sign = detected;

        const elapsed = nowMs - candidate.startTime;
        const progress = Math.min(100, Math.round((elapsed / holdDuration) * 100));

        updateRecognitionHUD({
          cand: detected,
          holdPercent: progress,
          isConfirmed: false,
          anchor: detected.anchor
        });

        if (progress >= 100 && candidate.consecutiveFrames >= 4) {
          const timeSinceLastEmit = nowMs - lastEmittedTime;
          const isSameAsLast = lastEmittedSign === detected.name;

          if (!isSameAsLast || timeSinceLastEmit > 1600) {
            lastEmittedSign = detected.name;
            lastEmittedTime = nowMs;

            updateRecognitionHUD({
              cand: detected,
              holdPercent: 100,
              isConfirmed: true,
              anchor: detected.anchor
            });

            handleGestureDetected(detected);

            candidate.name = null;
            candidate.sign = null;
            candidate.startTime = 0;
            candidate.consecutiveFrames = 0;

            if (confirmedTimeout) clearTimeout(confirmedTimeout);
            confirmedTimeout = setTimeout(() => {
              updateRecognitionHUD({ cand: null, holdPercent: 0, isConfirmed: false });
            }, 750);
          }
        }
      } else {
        if (candidate.name && nowMs - candidate.lastSeenTime < 180 && candidate.consecutiveFrames >= 3) {
          candidate.jitterFrames = (candidate.jitterFrames || 0) + 1;
          if (candidate.jitterFrames <= 2) {
            ctx.restore();
            return;
          }
        }

        candidate.name = detected.name;
        candidate.sign = detected;
        candidate.startTime = nowMs;
        candidate.lastSeenTime = nowMs;
        candidate.consecutiveFrames = 1;
        candidate.jitterFrames = 0;

        updateRecognitionHUD({
          cand: detected,
          holdPercent: 10,
          isConfirmed: false,
          anchor: detected.anchor
        });
      }
    } else {
      if (candidate.name && nowMs - candidate.lastSeenTime > 320) {
        candidate.name = null;
        candidate.sign = null;
        candidate.startTime = 0;
        candidate.consecutiveFrames = 0;
        updateRecognitionHUD({ cand: null, holdPercent: 0, isConfirmed: false, anchor: null });
      }
    }
  } else {
    prevLandmarks = null;
    candidate.name = null;
    candidate.sign = null;
    candidate.startTime = 0;
    candidate.consecutiveFrames = 0;
    updateRecognitionHUD({ cand: null, holdPercent: 0, isConfirmed: false, anchor: null, motion: 'idle' });

    if (isMoving) {
      isMoving = false;
      if (!isAnalyzing) processCompletedSigning();
    }
  }

  ctx.restore();
}

function onPoseResults(results) {
  if (results && results.poseLandmarks && results.poseLandmarks.length > 0) {
    poseLandmarks = results.poseLandmarks;
    updateRecognitionHUD({ poseLocked: true });
  } else {
    poseLandmarks = null;
    updateRecognitionHUD({ poseLocked: false });
  }
}

// ==========================================================================
// Camera Controller
// ==========================================================================
async function startCamera() {
  const reqId = ++startRequestId;
  if (!hasCameraApi()) {
    updateCameraStatusUI(CAMERA_STATES.ERROR, 'This browser does not support webcam access.');
    return;
  }

  updateCameraStatusUI(CAMERA_STATES.INITIALIZING);
  if (cameraErrorBox) cameraErrorBox.style.display = 'none';

  try {
    // MediaPipe initialization
    if (!handsModel && window.Hands) {
      handsModel = new window.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });
      handsModel.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      handsModel.onResults(onHandsResults);
    }

    if (!poseModel && window.Pose) {
      poseModel = new window.Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
      });
      poseModel.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      poseModel.onResults(onPoseResults);
    }

    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(getCameraConstraints(!state.targetSecondPerson));
    } catch {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }

    if (reqId !== startRequestId) {
      stopMediaStream(stream);
      return;
    }

    video.srcObject = stream;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;

    try {
      await waitForVideoReady(video, 2500);
    } catch (e) {
      console.warn('waitForVideoReady:', e);
    }

    try {
      await video.play();
    } catch (e) {
      console.warn('play error:', e);
    }

    if (reqId !== startRequestId) {
      stopMediaStream(stream);
      return;
    }

    cameraActive = true;
    updateCameraStatusUI(CAMERA_STATES.ACTIVE);
    startSession();

    const runLoop = async () => {
      if (!cameraActive || reqId !== startRequestId) return;
      if (video && video.readyState >= 2 && !isSendingFrame) {
        isSendingFrame = true;
        try {
          if (handsModel) await handsModel.send({ image: video });
        } catch {
          // Frame drop
        }
        try {
          if (poseModel) await poseModel.send({ image: video });
        } catch {
          // Pose auxiliary
        } finally {
          isSendingFrame = false;
        }
      }

      if (cameraActive && reqId === startRequestId) {
        frameLoopId = requestAnimationFrame(runLoop);
      }
    };

    if (frameLoopId) cancelAnimationFrame(frameLoopId);
    frameLoopId = requestAnimationFrame(runLoop);
  } catch (err) {
    const msg = getFriendlyCameraError(err, 'Could not access webcam. Please allow camera permissions.');
    if (video) {
      stopMediaStream(video.srcObject);
      video.srcObject = null;
    }
    updateCameraStatusUI(CAMERA_STATES.ERROR, msg);
    cameraActive = false;
  }
}

function stopCamera() {
  cameraActive = false;
  if (frameLoopId) {
    cancelAnimationFrame(frameLoopId);
    frameLoopId = null;
  }
  if (video && video.srcObject) {
    stopMediaStream(video.srcObject);
    video.srcObject = null;
    video.pause();
  }
  if (pauseTriggerTimeout) {
    clearTimeout(pauseTriggerTimeout);
    pauseTriggerTimeout = null;
  }
  if (confirmedTimeout) {
    clearTimeout(confirmedTimeout);
    confirmedTimeout = null;
  }
  clipBuffer = [];
  currentGesture = null;

  updateRecognitionHUD({
    cand: null,
    holdPercent: 0,
    isConfirmed: false,
    analyzing: false,
    motion: 'idle',
    bufferCount: 0,
    poseLocked: false,
    handsCount: 0,
    anchor: null
  });

  updateCameraStatusUI(CAMERA_STATES.IDLE);
}

// ==========================================================================
// Session Controller
// ==========================================================================
function startSession() {
  state.isSessionActive = true;
  sessionTimerPill.classList.add('active');
  sessionStateLabel.textContent = 'Session Active';
  startSessionBtn.style.display = 'none';
  stopSessionBtn.style.display = 'inline-flex';

  if (!sessionInterval) {
    sessionInterval = setInterval(() => {
      state.sessionSeconds++;
      const mins = String(Math.floor(state.sessionSeconds / 60)).padStart(2, '0');
      const secs = String(state.sessionSeconds % 60).padStart(2, '0');
      sessionTimerText.textContent = `${mins}:${secs}`;
    }, 1000);
  }
}

function stopSession() {
  state.isSessionActive = false;
  sessionTimerPill.classList.remove('active');
  sessionStateLabel.textContent = 'Not started';
  startSessionBtn.style.display = 'inline-flex';
  stopSessionBtn.style.display = 'none';

  if (sessionInterval) {
    clearInterval(sessionInterval);
    sessionInterval = null;
  }
  stopCamera();
}

function resetSession() {
  stopSession();
  state.sessionSeconds = 0;
  state.signsDetectedCount = 0;
  state.spokenMessagesCount = 0;
  sessionTimerText.textContent = '00:00';
  signsDetectedNumber.textContent = '00';
  spokenMessagesNumber.textContent = '00';
  detectedTextarea.value = '';
  detectedTextEmptyPrompt.style.display = 'block';
  wordCountBadge.textContent = '0 WORDS';
  recentSignsRow.innerHTML = '';
  textStatusBadge.textContent = 'AWAITING YOUR FIRST SIGN';
  textStatusDot.style.backgroundColor = 'var(--text-muted)';
  uniSignSpeechConverter.stop();
  setIdleUI();
}

// ==========================================================================
// Speech UI Helpers
// ==========================================================================
function setSpeakingUI() {
  speechStatusPill.classList.add('speaking');
  speechStatusPill.querySelector('span:last-child').textContent = 'SPEAKING...';
  speechStatusText.textContent = 'Synthesizing voice playback...';
  soundwaveBars.forEach(b => b.classList.remove('style-idle'));
}

function setIdleUI() {
  speechStatusPill.classList.remove('speaking');
  speechStatusPill.querySelector('span:last-child').textContent = 'IDLE';
  speechStatusText.textContent = 'Speech is ready when your first message is.';
  soundwaveBars.forEach(b => b.classList.add('style-idle'));
}

// ==========================================================================
// History List Renderer
// ==========================================================================
function renderHistoryList() {
  if (!historyList) return;
  historyList.innerHTML = '';
  state.history.forEach(item => {
    const row = document.createElement('div');
    row.className = 'history-card-item';
    row.innerHTML = `
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <span class="hud-tag" style="color:var(--accent-cyan);background:rgba(6,182,212,0.1);border-color:rgba(6,182,212,0.25)">
            ${item.signName}
          </span>
          <span style="font-size:11px;color:var(--text-muted)">${item.time}</span>
        </div>
        <div style="font-size:14px;color:var(--text-primary);line-height:1.4">${item.phrase}</div>
      </div>
      <button type="button" class="btn-icon replay-btn" style="background:rgba(255,255,255,0.08);border-radius:8px;padding:8px" title="Replay Speech">
        ▶
      </button>
    `;
    row.querySelector('.replay-btn').addEventListener('click', () => {
      uniSignSpeechConverter.speak(item.phrase);
    });
    historyList.appendChild(row);
  });
}

// ==========================================================================
// Encyclopedia Generator (HTML-first rendering)
// ==========================================================================
function renderEncyclopedia(filterQuery = '') {
  if (!encyclopediaGrid) return;
  encyclopediaGrid.innerHTML = '';
  const q = filterQuery.toLowerCase().trim();

  const allItems = [
    ...ALPHABET_A_TO_Z.map(a => ({ name: `Letter ${a.letter}`, phrase: a.letter, desc: a.description, badge: 'Alphabet', isLetter: true })),
    ...NUMBERS_0_TO_10.map(n => ({ name: n.name, phrase: n.digit, desc: n.description, badge: 'Number', isNumber: true })),
    ...FULL_SIGN_VOCABULARY.map(v => ({ name: v.name, phrase: v.phrase, desc: v.description, badge: v.category, hindi: v.hindiPhrase }))
  ];

  allItems
    .filter(item => !q || item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || (item.hindi && item.hindi.includes(q)))
    .forEach(item => {
      const card = document.createElement('div');
      card.className = 'enc-card';
      card.innerHTML = `
        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
            <span style="font-size:14px;font-weight:600;color:var(--text-primary)">${item.name}</span>
            <span class="hud-tag" style="color:${item.isLetter ? 'var(--accent-blue)' : item.isNumber ? 'var(--accent-green)' : 'var(--accent-cyan)'}">
              ${item.badge}
            </span>
          </div>
          <p style="font-size:12px;color:var(--text-secondary);line-height:1.4;margin-bottom:6px">${item.desc}</p>
          ${item.hindi ? `<div style="font-size:11px;color:var(--text-muted)">Meaning: <span style="color:var(--text-primary)">"${item.hindi}"</span></div>` : ''}
        </div>
        <button type="button" class="btn-action-start sim-btn" style="width:100%;justify-content:center;font-size:12px;padding:6px 12px">
          Simulate Sign
        </button>
      `;
      card.querySelector('.sim-btn').addEventListener('click', () => {
        handleGestureDetected({
          id: item.name.toLowerCase().replace(/\s+/g, '_'),
          name: item.name,
          phrase: item.phrase,
          confidence: 0.99,
          isLetter: item.isLetter,
          isNumber: item.isNumber
        });
        encyclopediaDialog.close();
      });
      encyclopediaGrid.appendChild(card);
    });
}

// ==========================================================================
// Event Listeners Binding (Native HTML5 DOM)
// ==========================================================================
startCameraBtn.addEventListener('click', startCamera);
if (stopCameraBtn) stopCameraBtn.addEventListener('click', stopCamera);
if (startSessionBtn) startSessionBtn.addEventListener('click', () => { if (!cameraActive) startCamera(); else startSession(); });
if (stopSessionBtn) stopSessionBtn.addEventListener('click', stopSession);
if (resetSessionBtn) resetSessionBtn.addEventListener('click', resetSession);
if (translateManualBtn) translateManualBtn.addEventListener('click', processCompletedSigning);

if (secondPersonBtn) {
  secondPersonBtn.addEventListener('click', () => {
    state.targetSecondPerson = !state.targetSecondPerson;
    secondPersonBtn.textContent = state.targetSecondPerson ? 'Scanning 2nd Person' : 'Self Mode';
    if (cameraActive) {
      stopCamera();
      setTimeout(startCamera, 150);
    }
  });
}

// Mode Switchers
const tabPhrases = document.getElementById('tab-mode-phrases');
const tabAlphabet = document.getElementById('tab-mode-alphabet');
const tabNumbers = document.getElementById('tab-mode-numbers');
const vocabPhrases = document.getElementById('vocab-phrases');
const vocabAlphabet = document.getElementById('vocab-alphabet');
const vocabNumbers = document.getElementById('vocab-numbers');

function setInputMode(mode) {
  state.inputMode = mode;
  [tabPhrases, tabAlphabet, tabNumbers].forEach(t => t.classList.remove('active'));
  [vocabPhrases, vocabAlphabet, vocabNumbers].forEach(v => v.style.display = 'none');

  if (mode === 'phrases') {
    tabPhrases.classList.add('active');
    vocabPhrases.style.display = 'flex';
  } else if (mode === 'alphabet') {
    tabAlphabet.classList.add('active');
    vocabAlphabet.style.display = 'flex';
  } else if (mode === 'numbers') {
    tabNumbers.classList.add('active');
    vocabNumbers.style.display = 'flex';
  }
}

tabPhrases.addEventListener('click', () => setInputMode('phrases'));
tabAlphabet.addEventListener('click', () => setInputMode('alphabet'));
tabNumbers.addEventListener('click', () => setInputMode('numbers'));

// Alphabet & Numbers Toolbar Buttons
document.querySelectorAll('.vocab-char-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const char = btn.dataset.char;
    handleGestureDetected({ id: `letter_${char.toLowerCase()}`, name: `Letter ${char}`, phrase: char, isLetter: true });
  });
});

document.querySelectorAll('.vocab-num-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const num = btn.dataset.num;
    handleGestureDetected({ id: `num_${num}`, name: `Number ${num}`, phrase: num, isNumber: true });
  });
});

document.getElementById('action-space-btn').addEventListener('click', () => {
  detectedTextarea.value += ' ';
});

document.getElementById('action-backspace-btn').addEventListener('click', () => {
  detectedTextarea.value = detectedTextarea.value.slice(0, -1);
  if (!detectedTextarea.value) detectedTextEmptyPrompt.style.display = 'block';
});

// Category & Quick Word Chips
document.querySelectorAll('.category-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const cat = chip.dataset.cat;
    document.querySelectorAll('.word-sign-chip').forEach(w => {
      if (cat === 'All' || w.dataset.category === cat) w.style.display = 'inline-flex';
      else w.style.display = 'none';
    });
  });
});

document.querySelectorAll('.word-sign-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const name = chip.dataset.sign;
    const phrase = chip.dataset.phrase || name;
    handleGestureDetected({ id: name.toLowerCase().replace(/\s+/g, '_'), name: name, phrase: phrase, isWord: true });
  });
});

// Language Select
const signLangSelect = document.getElementById('sign-lang-select');
signLangSelect.addEventListener('change', (e) => {
  state.signLanguage = e.target.value;
});

// Text Actions
clearTextBtn.addEventListener('click', () => {
  detectedTextarea.value = '';
  detectedTextEmptyPrompt.style.display = 'block';
  wordCountBadge.textContent = '0 WORDS';
  recentSignsRow.innerHTML = '';
  uniSignSpeechConverter.stop();
});

copyTextBtn.addEventListener('click', () => {
  if (!detectedTextarea.value) return;
  navigator.clipboard.writeText(detectedTextarea.value);
  copyTextBtn.textContent = '✓ Copied';
  setTimeout(() => { copyTextBtn.textContent = 'Copy'; }, 2000);
});

textMoreBtn.addEventListener('click', () => {
  textMenuDropdown.style.display = textMenuDropdown.style.display === 'block' ? 'none' : 'block';
});

uppercaseBtn.addEventListener('click', () => {
  detectedTextarea.value = detectedTextarea.value.toUpperCase();
  textMenuDropdown.style.display = 'none';
});

resetTextBtn.addEventListener('click', () => {
  clearTextBtn.click();
  textMenuDropdown.style.display = 'none';
});

detectedTextarea.addEventListener('input', () => {
  const words = detectedTextarea.value.trim().split(/\s+/).filter(Boolean).length;
  wordCountBadge.textContent = `${words} ${words === 1 ? 'WORD' : 'WORDS'}`;
  if (!detectedTextarea.value) detectedTextEmptyPrompt.style.display = 'block';
  else detectedTextEmptyPrompt.style.display = 'none';
});

// Speech Controls
speakBtn.addEventListener('click', () => {
  const text = detectedTextarea.value.trim();
  if (!text) return;
  setSpeakingUI();
  uniSignSpeechConverter.speak(text, {
    voiceURI: speechVoiceSelect.value,
    rate: parseFloat(speechSpeedSelect.value) || 1.0,
    volume: parseFloat(speechVolumeSlider.value) || 1.0,
    onStart: setSpeakingUI,
    onEnd: () => {
      setIdleUI();
      state.spokenMessagesCount++;
      spokenMessagesNumber.textContent = String(state.spokenMessagesCount).padStart(2, '0');
    },
    onError: setIdleUI
  });
});

stopSpeechBtn.addEventListener('click', () => {
  uniSignSpeechConverter.stop();
  setIdleUI();
});

speechSpeedSelect.addEventListener('change', (e) => {
  uniSignSpeechConverter.setRate(parseFloat(e.target.value));
});

speechVolumeSlider.addEventListener('input', (e) => {
  uniSignSpeechConverter.setVolume(parseFloat(e.target.value));
});

autoSpeakSwitch.addEventListener('click', () => {
  state.autoSpeak = !state.autoSpeak;
  autoSpeakSwitch.classList.toggle('active', state.autoSpeak);
});

// Voice initialization
function populateVoices() {
  const voices = uniSignSpeechConverter.getVoices();
  speechVoiceSelect.innerHTML = '';
  voices.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.voiceURI;
    opt.textContent = `${v.name} (${v.lang})`;
    speechVoiceSelect.appendChild(opt);
  });
}
populateVoices();
if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = populateVoices;

// Dialog Modals
openSettingsBtn.addEventListener('click', () => settingsDialog.showModal());
closeSettingsBtn.addEventListener('click', () => settingsDialog.close());
closeSettingsDoneBtn.addEventListener('click', () => settingsDialog.close());

openHistoryBtn.addEventListener('click', () => {
  renderHistoryList();
  historyDialog.showModal();
});
closeHistoryBtn.addEventListener('click', () => historyDialog.close());
clearHistoryBtn.addEventListener('click', () => {
  state.history = [];
  renderHistoryList();
});

openEncyclopediaBtn.addEventListener('click', () => {
  renderEncyclopedia();
  encyclopediaDialog.showModal();
});
footerHowToSignBtn.addEventListener('click', () => {
  renderEncyclopedia();
  encyclopediaDialog.showModal();
});
closeEncyclopediaBtn.addEventListener('click', () => encyclopediaDialog.close());

encyclopediaSearch.addEventListener('input', (e) => {
  renderEncyclopedia(e.target.value);
});

mirrorModeSwitch.addEventListener('click', () => {
  state.mirrorMode = !state.mirrorMode;
  mirrorModeSwitch.classList.toggle('active', state.mirrorMode);
  video.classList.toggle('mirrored', state.mirrorMode);
});

sensitivitySlider.addEventListener('input', (e) => {
  state.sensitivity = parseInt(e.target.value);
  sensitivityValue.textContent = `${state.sensitivity}%`;
});

// Initial Setup
renderHistoryList();
renderEncyclopedia();
setInputMode('phrases');
