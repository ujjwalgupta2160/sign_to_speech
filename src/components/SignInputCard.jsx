import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Camera, CameraOff, Scan, RotateCcw, Play, Square, Users, Sparkles, Type, Hash, MessageSquare, Space, Delete } from 'lucide-react';
import { classifyHands, ALPHABET_A_TO_Z, NUMBERS_0_TO_10, FULL_SIGN_VOCABULARY, distance } from '../utils/signClassifier';
import { uniSignStreamProcessor } from '../utils/uniSignEngine';
import {
  CAMERA_STATES,
  getCameraConstraints,
  getFriendlyCameraError,
  getMediaPipeStatus,
  hasCameraApi,
  stopMediaStream,
  waitForVideoReady
} from '../utils/cameraLifecycle';

export default function SignInputCard({
  signLanguage,
  setSignLanguage,
  isSessionActive,
  onStartSession,
  onStopSession,
  onResetSession,
  onGestureDetected,
  mirrorMode,
  setMirrorMode,
  inputMode,
  setInputMode,
  onFingerspellLetter,
  onFingerspellSpace,
  onFingerspellBackspace,
  sensitivity = 70
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Direct DOM Telemetry Refs (Vanilla JavaScript direct DOM updates - zero React render lag)
  const recognitionOverlayRef = useRef(null);
  const recognitionAnalyzingLabelRef = useRef(null);
  const recognitionNormalContentRef = useRef(null);
  const recognitionSignNameRef = useRef(null);
  const recognitionSignPhraseRef = useRef(null);
  const recognitionPercentBadgeRef = useRef(null);
  const recognitionStatusTextRef = useRef(null);
  const holdProgressTrackRef = useRef(null);
  const holdProgressFillRef = useRef(null);
  const bufferBarRef = useRef(null);
  const bufferCountTextRef = useRef(null);
  const poseTagRef = useRef(null);
  const handsTagRef = useRef(null);
  const anchorTagRef = useRef(null);
  const motionHudRef = useRef(null);

  // Coarse-grained React states (React only updates on user-level events)
  const [cameraState, setCameraState] = useState(CAMERA_STATES.IDLE);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [recognitionState, setRecognitionState] = useState('checking');
  const [targetSecondPerson, setTargetSecondPerson] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Motion Tracking, Timing, and Recognition Pipeline State in Vanilla JS Refs
  const prevLandmarksRef = useRef(null);
  const lastMotionTimeRef = useRef(0);
  const isMovingRef = useRef(false);
  const pauseTriggerTimeoutRef = useRef(null);
  const handsModelRef = useRef(null);
  const poseModelRef = useRef(null);
  const poseLandmarksRef = useRef(null);
  const isAnalyzingRef = useRef(false);
  const lastProcessedTimeRef = useRef(0);
  const lastEmittedSignRef = useRef(null);
  const lastEmittedTimeRef = useRef(0);
  const isMountedRef = useRef(true);
  const startRequestIdRef = useRef(0);

  // Candidate hold tracker ref (requires steady holding before emitting)
  const candidateRef = useRef({
    name: null,
    sign: null,
    startTime: 0,
    lastSeenTime: 0,
    consecutiveFrames: 0,
    jitterFrames: 0
  });
  const confirmedTimeoutRef = useRef(null);

  // signBridge 16-frame temporal buffer (~12.5 FPS / 80ms per frame)
  const CLIP_LENGTH = 16;
  const clipBufferRef = useRef([]);
  const lastBufferTimeRef = useRef(0);
  const isSendingFrameRef = useRef(false);
  const frameLoopIdRef = useRef(null);
  const cameraActiveRef = useRef(false);
  const currentGestureRef = useRef(null);

  // Direct DOM Telemetry Updater (Native Vanilla JS DOM mutation)
  const updateHUD = useCallback(({
    candidate,
    holdPercent,
    isConfirmed,
    isAnalyzing,
    motion,
    bufferCount,
    poseLocked,
    handsCount,
    anchor
  }) => {
    // 1. Central Recognition Overlay
    if (recognitionOverlayRef.current) {
      if (isAnalyzing) {
        recognitionOverlayRef.current.className = 'recognition-overlay-hud analyzing';
        if (recognitionAnalyzingLabelRef.current) recognitionAnalyzingLabelRef.current.style.display = 'flex';
        if (recognitionNormalContentRef.current) recognitionNormalContentRef.current.style.display = 'none';
      } else if (isConfirmed) {
        recognitionOverlayRef.current.className = 'recognition-overlay-hud confirmed';
        if (recognitionAnalyzingLabelRef.current) recognitionAnalyzingLabelRef.current.style.display = 'none';
        if (recognitionNormalContentRef.current) recognitionNormalContentRef.current.style.display = 'flex';
        if (recognitionSignNameRef.current) recognitionSignNameRef.current.textContent = `✓ ${candidate?.name || ''}`;
        if (recognitionSignPhraseRef.current) recognitionSignPhraseRef.current.textContent = '';
        if (recognitionPercentBadgeRef.current) recognitionPercentBadgeRef.current.textContent = 'CONFIRMED';
        if (recognitionStatusTextRef.current) recognitionStatusTextRef.current.textContent = 'Confirmed & added to detected text';
        if (holdProgressTrackRef.current) holdProgressTrackRef.current.style.display = 'none';
      } else if (candidate) {
        recognitionOverlayRef.current.className = 'recognition-overlay-hud holding';
        if (recognitionAnalyzingLabelRef.current) recognitionAnalyzingLabelRef.current.style.display = 'none';
        if (recognitionNormalContentRef.current) recognitionNormalContentRef.current.style.display = 'flex';
        if (recognitionSignNameRef.current) recognitionSignNameRef.current.textContent = candidate.name;
        if (recognitionSignPhraseRef.current) recognitionSignPhraseRef.current.textContent = candidate.phrase ? `"${candidate.phrase}"` : '';
        if (recognitionPercentBadgeRef.current) recognitionPercentBadgeRef.current.textContent = `${holdPercent}%`;
        if (recognitionStatusTextRef.current) recognitionStatusTextRef.current.textContent = `Hold steady to recognize sign (${holdPercent}%)`;
        if (holdProgressTrackRef.current) holdProgressTrackRef.current.style.display = 'block';
        if (holdProgressFillRef.current) {
          holdProgressFillRef.current.style.width = `${holdPercent}%`;
          if (holdPercent > 75) holdProgressFillRef.current.classList.add('high');
          else holdProgressFillRef.current.classList.remove('high');
        }
      } else {
        recognitionOverlayRef.current.className = 'recognition-overlay-hud hidden';
      }
    }

    // 2. Buffer Progress Indicators
    if (bufferCount !== undefined && bufferBarRef.current) {
      const cells = bufferBarRef.current.children;
      for (let i = 0; i < cells.length; i++) {
        if (i < bufferCount) cells[i].classList.add('filled');
        else cells[i].classList.remove('filled');
      }
      if (bufferCountTextRef.current) {
        bufferCountTextRef.current.textContent = `UNI-SIGN ST-GCN BUFFER: ${bufferCount}/16`;
      }
    }

    // 3. Pose Tag
    if (poseTagRef.current && poseLocked !== undefined) {
      if (poseLocked) {
        poseTagRef.current.className = 'hud-tag body-locked';
        poseTagRef.current.textContent = 'UNI-SIGN BODY: LOCKED';
      } else {
        poseTagRef.current.className = 'hud-tag';
        poseTagRef.current.textContent = 'UNI-SIGN BODY: SCAN';
      }
    }

    // 4. Hands Tag
    if (handsTagRef.current && handsCount !== undefined) {
      if (handsCount > 0) {
        handsTagRef.current.className = 'hud-tag hands-locked';
        handsTagRef.current.textContent = `HANDS: ${handsCount}`;
      } else {
        handsTagRef.current.className = 'hud-tag';
        handsTagRef.current.textContent = 'HANDS: 0';
      }
    }

    // 5. Anchor Tag
    if (anchorTagRef.current) {
      if (anchor) {
        anchorTagRef.current.style.display = 'inline-block';
        anchorTagRef.current.textContent = `ANCHOR: ${anchor.toUpperCase()}`;
      } else {
        anchorTagRef.current.style.display = 'none';
      }
    }

    // 6. Motion State HUD
    if (motionHudRef.current && motion) {
      if (motion === 'moving') {
        motionHudRef.current.className = 'motion-hud-badge moving';
        motionHudRef.current.innerHTML = '<span class="animate-pulse-slow">●</span><span>TRACKING MOVEMENTS...</span>';
      } else if (motion === 'paused') {
        motionHudRef.current.className = 'motion-hud-badge paused';
        motionHudRef.current.innerHTML = '<span>MOVEMENT PAUSED — FINALIZING...</span>';
      } else if (motion === 'analyzing') {
        motionHudRef.current.className = 'motion-hud-badge analyzing';
        motionHudRef.current.innerHTML = '<span class="animate-pulse-slow">✨</span><span>UNI-SIGN TRANSLATION...</span>';
      } else if (motion === 'idle') {
        motionHudRef.current.className = 'motion-hud-badge';
        motionHudRef.current.innerHTML = '';
      }
    }
  }, []);

  // Keep latest callbacks in mutable refs
  const onStartSessionRef = useRef(onStartSession);
  const onStopSessionRef = useRef(onStopSession);
  const onResetSessionRef = useRef(onResetSession);
  const onGestureDetectedRef = useRef(onGestureDetected);

  useEffect(() => {
    onStartSessionRef.current = onStartSession;
    onStopSessionRef.current = onStopSession;
    onResetSessionRef.current = onResetSession;
    onGestureDetectedRef.current = onGestureDetected;
  });

  const onHandsResultsRef = useRef(null);
  const onPoseResultsRef = useRef(null);

  const loadScript = useCallback((src) => new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Document is not available.'));
      return;
    }

    if (src.includes('hands.js') && window.Hands) return resolve();
    if (src.includes('pose.js') && window.Pose) return resolve();
    if (src.includes('drawing_utils.js') && window.drawConnectors && window.drawLandmarks) return resolve();

    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') return resolve();
      existingScript.addEventListener('load', () => {
        existingScript.dataset.loaded = 'true';
        resolve();
      }, { once: true });
      existingScript.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  }), []);

  const ensureModelsLoaded = useCallback(async () => {
    if (typeof window === 'undefined') return false;
    const status = getMediaPipeStatus(window);
    if (status.ready && handsModelRef.current && poseModelRef.current) {
      setRecognitionState('ready');
      return true;
    }

    setRecognitionState('loading');
    try {
      const scriptMap = [
        'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js',
        'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js',
        'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js'
      ];
      await Promise.all(scriptMap.map(src => loadScript(src)));
    } catch (error) {
      console.warn('MediaPipe loading warning:', error);
      setRecognitionState('unavailable');
      return false;
    }

    if (!handsModelRef.current && window.Hands) {
      try {
        const hands = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });
        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        hands.onResults((results) => onHandsResultsRef.current?.(results));
        handsModelRef.current = hands;
      } catch (err) {
        console.error('Hands init error:', err);
        setRecognitionState('unavailable');
        return false;
      }
    }

    if (!poseModelRef.current && window.Pose) {
      try {
        const pose = new window.Pose({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });
        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        pose.onResults((results) => onPoseResultsRef.current?.(results));
        poseModelRef.current = pose;
      } catch (err) {
        console.warn('Pose init warning:', err);
      }
    }

    const finalStatus = getMediaPipeStatus(window);
    setRecognitionState(finalStatus.ready ? 'ready' : 'unavailable');
    return finalStatus.ready;
  }, [loadScript]);

  const stopCamera = useCallback(() => {
    cameraActiveRef.current = false;
    if (frameLoopIdRef.current) {
      cancelAnimationFrame(frameLoopIdRef.current);
      frameLoopIdRef.current = null;
    }
    if (videoRef.current) {
      if (videoRef.current.srcObject) stopMediaStream(videoRef.current.srcObject);
      videoRef.current.srcObject = null;
      videoRef.current.pause?.();
    }
    if (pauseTriggerTimeoutRef.current) {
      clearTimeout(pauseTriggerTimeoutRef.current);
      pauseTriggerTimeoutRef.current = null;
    }
    if (confirmedTimeoutRef.current) {
      clearTimeout(confirmedTimeoutRef.current);
      confirmedTimeoutRef.current = null;
    }
    candidateRef.current = {
      name: null,
      sign: null,
      startTime: 0,
      lastSeenTime: 0,
      consecutiveFrames: 0,
      jitterFrames: 0
    };
    clipBufferRef.current = [];
    currentGestureRef.current = null;

    updateHUD({
      candidate: null,
      holdPercent: 0,
      isConfirmed: false,
      isAnalyzing: false,
      motion: 'idle',
      bufferCount: 0,
      poseLocked: false,
      handsCount: 0,
      anchor: null
    });

    setCameraState(CAMERA_STATES.IDLE);
    setCameraActive(false);
    onStopSessionRef.current?.();
  }, [updateHUD]);

  const stopCameraRef = useRef(stopCamera);
  useEffect(() => {
    stopCameraRef.current = stopCamera;
  }, [stopCamera]);

  useEffect(() => {
    isMountedRef.current = true;
    void ensureModelsLoaded().catch(() => {
      if (isMountedRef.current) {
        setCameraError('MediaPipe model assets could not be loaded. Please refresh the page.');
      }
    });

    return () => {
      isMountedRef.current = false;
      stopCameraRef.current?.();
    };
  }, [ensureModelsLoaded]);

  const onPoseResults = useCallback((results) => {
    if (results && results.poseLandmarks && results.poseLandmarks.length > 0) {
      poseLandmarksRef.current = results.poseLandmarks;
      updateHUD({ poseLocked: true });
    } else {
      poseLandmarksRef.current = null;
      updateHUD({ poseLocked: false });
    }
  }, [updateHUD]);

  useEffect(() => {
    onPoseResultsRef.current = onPoseResults;
  }, [onPoseResults]);

  /**
   * Finalize the signed thought using pure Uni-Sign (ICLR 2025) ST-GCN multi-frame sequence translation
   */
  const processCompletedSigning = useCallback(async () => {
    if (!videoRef.current || isAnalyzingRef.current) return;
    const now = Date.now();
    if (now - lastProcessedTimeRef.current < 1600) return;

    isAnalyzingRef.current = true;
    updateHUD({ isAnalyzing: true, motion: 'analyzing' });

    try {
      const result = uniSignStreamProcessor.translateSequence(clipBufferRef.current, currentGestureRef.current, {
        language: signLanguage,
        mode: inputMode
      });

      if (result && result.detected && (result.text || result.signName)) {
        lastProcessedTimeRef.current = Date.now();
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
          letter: isLetter ? cleanText.toUpperCase() : undefined,
          isNumber: isNumber,
          digit: isNumber ? cleanText : undefined,
          isWord: isWord,
          hindiPhrase: result.hindi || '',
          confidence: result.confidence || 0.98,
          source: 'Uni-Sign ST-GCN Buffer'
        };

        currentGestureRef.current = signObj;
        updateHUD({
          candidate: signObj,
          holdPercent: 100,
          isConfirmed: true,
          isAnalyzing: false,
          motion: 'idle'
        });

        onGestureDetectedRef.current?.(signObj);

        if (confirmedTimeoutRef.current) clearTimeout(confirmedTimeoutRef.current);
        confirmedTimeoutRef.current = setTimeout(() => {
          updateHUD({ candidate: null, holdPercent: 0, isConfirmed: false });
        }, 1500);
      } else if (currentGestureRef.current) {
        lastProcessedTimeRef.current = Date.now();
        const gesture = currentGestureRef.current;
        updateHUD({
          candidate: gesture,
          holdPercent: 100,
          isConfirmed: true,
          isAnalyzing: false,
          motion: 'idle'
        });

        onGestureDetectedRef.current?.(gesture);

        if (confirmedTimeoutRef.current) clearTimeout(confirmedTimeoutRef.current);
        confirmedTimeoutRef.current = setTimeout(() => {
          updateHUD({ candidate: null, holdPercent: 0, isConfirmed: false });
        }, 1500);
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setTimeout(() => {
        isAnalyzingRef.current = false;
        updateHUD({ isAnalyzing: false, motion: 'idle' });
      }, 350);
    }
  }, [signLanguage, inputMode, updateHUD]);

  const drawCustomHandSkeleton = (ctx, landmarks, strokeColor, fillColor) => {
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
  };

  /**
   * High-Frequency Landmark Listener (runs at 30-60 FPS purely in native JS and Canvas)
   */
  const onHandsResults = useCallback((results) => {
    const canvas = canvasRef.current;
    if (!canvas || !videoRef.current) return;

    const ctx = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mirrorMode && !targetSecondPerson) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    // 1. Draw MediaPipe Pose Skeleton
    const poseLms = poseLandmarksRef.current;
    if (poseLms && poseLms.length > 0) {
      if (window.drawConnectors && window.POSE_CONNECTIONS) {
        window.drawConnectors(ctx, poseLms, window.POSE_CONNECTIONS, {
          color: '#10b981',
          lineWidth: 2.5
        });
        if (window.drawLandmarks) {
          window.drawLandmarks(ctx, poseLms.slice(0, 23), {
            color: '#ffffff',
            fillColor: '#059669',
            radius: 3,
            lineWidth: 1
          });
        }
      }
    }

    // 2. Draw Hands
    const handCount = results.multiHandLandmarks ? results.multiHandLandmarks.length : 0;
    updateHUD({ handsCount: handCount });

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

      // Maintain Uni-Sign 16-frame sliding temporal clip buffer
      const now = Date.now();
      if (now - lastBufferTimeRef.current >= 80) {
        lastBufferTimeRef.current = now;
        clipBufferRef.current.push({
          handsLandmarks: results.multiHandLandmarks,
          poseLandmarks: poseLandmarksRef.current,
          timestamp: now
        });
        if (clipBufferRef.current.length > CLIP_LENGTH) {
          clipBufferRef.current.shift();
        }
        updateHUD({ bufferCount: clipBufferRef.current.length });
      }

      // Multi-point motion velocity tracking across wrist and fingertips
      const h0 = results.multiHandLandmarks[0];
      let maxDisplacement = 0;
      let avgDisplacement = 0;

      if (prevLandmarksRef.current && prevLandmarksRef.current.length >= 21) {
        const prevH0 = prevLandmarksRef.current;
        const keyPoints = [0, 4, 8, 12, 16, 20];
        let totalD = 0;
        keyPoints.forEach(pt => {
          const d = distance(h0[pt], prevH0[pt]);
          if (d > maxDisplacement) maxDisplacement = d;
          totalD += d;
        });
        avgDisplacement = totalD / keyPoints.length;
      }
      prevLandmarksRef.current = h0;

      const isMoving = maxDisplacement > 0.012 || avgDisplacement > 0.006;

      if (isMoving) {
        isMovingRef.current = true;
        lastMotionTimeRef.current = now;
        updateHUD({ motion: 'moving' });

        if (pauseTriggerTimeoutRef.current) {
          clearTimeout(pauseTriggerTimeoutRef.current);
          pauseTriggerTimeoutRef.current = null;
        }
      } else {
        if (isMovingRef.current && now - lastMotionTimeRef.current > 550) {
          updateHUD({ motion: 'paused' });
          if (!pauseTriggerTimeoutRef.current && !isAnalyzingRef.current) {
            pauseTriggerTimeoutRef.current = setTimeout(() => {
              isMovingRef.current = false;
              pauseTriggerTimeoutRef.current = null;
              processCompletedSigning();
            }, 300);
          }
        } else if (inputMode === 'phrases' && !isMoving && !isAnalyzingRef.current) {
          if (now - lastMotionTimeRef.current > 850 && now - lastProcessedTimeRef.current > 2200) {
            if (!pauseTriggerTimeoutRef.current && clipBufferRef.current.length >= 3) {
              updateHUD({ motion: 'paused' });
              pauseTriggerTimeoutRef.current = setTimeout(() => {
                pauseTriggerTimeoutRef.current = null;
                processCompletedSigning();
              }, 250);
            }
          }
        }
      }

      // Local Rule Classifier
      const detected = classifyHands(results.multiHandLandmarks, poseLandmarksRef.current, signLanguage, inputMode);
      const nowMs = Date.now();
      const baseHoldDuration = inputMode === 'alphabet' ? 850 : (inputMode === 'numbers' ? 900 : 1100);
      const holdDuration = Math.round(baseHoldDuration * (1.4 - (sensitivity / 100) * 0.6));

      if (detected) {
        currentGestureRef.current = detected;
        const cand = candidateRef.current;
        if (cand.name === detected.name) {
          cand.lastSeenTime = nowMs;
          cand.consecutiveFrames += 1;
          cand.jitterFrames = 0;
          cand.sign = detected;

          const elapsed = nowMs - cand.startTime;
          const progress = Math.min(100, Math.round((elapsed / holdDuration) * 100));

          updateHUD({
            candidate: detected,
            holdPercent: progress,
            isConfirmed: false,
            anchor: detected.anchor
          });

          if (progress >= 100 && cand.consecutiveFrames >= 4) {
            const timeSinceLastEmit = nowMs - lastEmittedTimeRef.current;
            const isSameAsLast = lastEmittedSignRef.current === detected.name;

            if (!isSameAsLast || timeSinceLastEmit > 1600) {
              lastEmittedSignRef.current = detected.name;
              lastEmittedTimeRef.current = nowMs;

              updateHUD({
                candidate: detected,
                holdPercent: 100,
                isConfirmed: true,
                anchor: detected.anchor
              });

              onGestureDetectedRef.current?.(detected);

              candidateRef.current = {
                name: null,
                sign: null,
                startTime: 0,
                lastSeenTime: 0,
                consecutiveFrames: 0,
                jitterFrames: 0
              };

              if (confirmedTimeoutRef.current) clearTimeout(confirmedTimeoutRef.current);
              confirmedTimeoutRef.current = setTimeout(() => {
                updateHUD({ candidate: null, holdPercent: 0, isConfirmed: false });
              }, 750);
            }
          }
        } else {
          if (cand.name && nowMs - cand.lastSeenTime < 180 && cand.consecutiveFrames >= 3) {
            cand.jitterFrames = (cand.jitterFrames || 0) + 1;
            if (cand.jitterFrames <= 2) {
              ctx.restore();
              return;
            }
          }

          candidateRef.current = {
            name: detected.name,
            sign: detected,
            startTime: nowMs,
            lastSeenTime: nowMs,
            consecutiveFrames: 1,
            jitterFrames: 0
          };

          updateHUD({
            candidate: detected,
            holdPercent: 10,
            isConfirmed: false,
            anchor: detected.anchor
          });
        }
      } else {
        const cand = candidateRef.current;
        if (cand.name && nowMs - cand.lastSeenTime > 320) {
          candidateRef.current = {
            name: null,
            sign: null,
            startTime: 0,
            lastSeenTime: 0,
            consecutiveFrames: 0,
            jitterFrames: 0
          };
          updateHUD({ candidate: null, holdPercent: 0, isConfirmed: false, anchor: null });
        }
      }
    } else {
      prevLandmarksRef.current = null;
      candidateRef.current = {
        name: null,
        sign: null,
        startTime: 0,
        lastSeenTime: 0,
        consecutiveFrames: 0,
        jitterFrames: 0
      };
      updateHUD({ candidate: null, holdPercent: 0, isConfirmed: false, anchor: null, motion: 'idle' });

      if (isMovingRef.current) {
        isMovingRef.current = false;
        if (!isAnalyzingRef.current) {
          processCompletedSigning();
        }
      }
    }

    ctx.restore();
  }, [mirrorMode, targetSecondPerson, signLanguage, inputMode, sensitivity, processCompletedSigning, updateHUD]);

  useEffect(() => {
    onHandsResultsRef.current = onHandsResults;
  }, [onHandsResults]);

  const startCamera = useCallback(async (customTargetSecondPerson) => {
    const isSecondPerson = customTargetSecondPerson !== undefined ? customTargetSecondPerson : targetSecondPerson;
    const requestId = ++startRequestIdRef.current;

    if (!isMountedRef.current) return;
    if (!hasCameraApi()) {
      setCameraState(CAMERA_STATES.ERROR);
      setCameraError('This browser does not support webcam access.');
      return;
    }

    if (cameraState === CAMERA_STATES.REQUESTING_PERMISSION || cameraState === CAMERA_STATES.INITIALIZING) {
      return;
    }

    setCameraError(null);
    setCameraState(CAMERA_STATES.REQUESTING_PERMISSION);

    try {
      ensureModelsLoaded().catch(err => console.warn('Model preloading warning:', err));
      setCameraState(CAMERA_STATES.INITIALIZING);

      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia(getCameraConstraints(!isSecondPerson));
      } catch (firstError) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      if (requestId !== startRequestIdRef.current) {
        stopMediaStream(stream);
        return;
      }

      if (!videoRef.current) {
        stopMediaStream(stream);
        throw new Error('Video element not available.');
      }

      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.autoplay = true;
      videoRef.current.playsInline = true;

      try {
        await waitForVideoReady(videoRef.current, 2500);
      } catch (videoError) {
        console.warn('waitForVideoReady warning:', videoError);
      }

      try {
        await videoRef.current.play();
      } catch (playError) {
        console.warn('Video playback warning:', playError);
      }

      if (requestId !== startRequestIdRef.current) {
        stopMediaStream(stream);
        return;
      }

      cameraActiveRef.current = true;
      setCameraState(CAMERA_STATES.ACTIVE);
      setCameraActive(true);
      onStartSessionRef.current?.();

      const runFrameLoop = async () => {
        if (!cameraActiveRef.current || requestId !== startRequestIdRef.current) return;
        const video = videoRef.current;
        if (video && video.readyState >= 2 && !isSendingFrameRef.current) {
          isSendingFrameRef.current = true;
          try {
            if (handsModelRef.current) {
              await handsModelRef.current.send({ image: video });
            }
          } catch (err) {
            // Non-blocking frame drop
          }

          try {
            if (poseModelRef.current) {
              await poseModelRef.current.send({ image: video });
            }
          } catch (err) {
            // Pose is auxiliary
          } finally {
            isSendingFrameRef.current = false;
          }
        }

        if (cameraActiveRef.current && requestId === startRequestIdRef.current) {
          frameLoopIdRef.current = requestAnimationFrame(runFrameLoop);
        }
      };

      if (frameLoopIdRef.current) cancelAnimationFrame(frameLoopIdRef.current);
      frameLoopIdRef.current = requestAnimationFrame(runFrameLoop);
    } catch (err) {
      const message = getFriendlyCameraError(err, 'Could not access the camera. Please allow webcam permissions in your browser.');
      if (videoRef.current) {
        stopMediaStream(videoRef.current.srcObject);
        videoRef.current.srcObject = null;
        videoRef.current.pause?.();
      }
      setCameraError(message);
      setCameraState(CAMERA_STATES.ERROR);
      cameraActiveRef.current = false;
      setCameraActive(false);
    }
  }, [cameraState, ensureModelsLoaded, targetSecondPerson]);

  const handleSimulateGesture = useCallback((item) => {
    const signObj = {
      id: item.id,
      name: item.name || `Letter ${item.letter}`,
      phrase: item.phrase || item.letter || item.digit,
      hindiPhrase: item.hindiPhrase,
      confidence: 0.99,
      handsUsed: item.tags && item.tags.includes('Two Hands') ? 2 : 1,
      isLetter: item.isLetter,
      isNumber: item.isNumber
    };

    updateHUD({
      candidate: signObj,
      holdPercent: 100,
      isConfirmed: true,
      motion: 'idle'
    });

    onGestureDetectedRef.current?.(signObj);

    if (confirmedTimeoutRef.current) clearTimeout(confirmedTimeoutRef.current);
    confirmedTimeoutRef.current = setTimeout(() => {
      updateHUD({ candidate: null, holdPercent: 0, isConfirmed: false });
    }, 750);
  }, [updateHUD]);

  const categories = useMemo(() => [
    'All', 'Greetings', 'Family', 'Responses', 'Questions', 'Emergency', 'Daily Needs', 'Emotions', 'Actions', 'Time'
  ], []);

  const filteredVocabulary = useMemo(() => {
    return selectedCategory === 'All'
      ? FULL_SIGN_VOCABULARY
      : FULL_SIGN_VOCABULARY.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  const cameraStatusLabel = cameraState === CAMERA_STATES.REQUESTING_PERMISSION
    ? 'REQUESTING'
    : cameraState === CAMERA_STATES.INITIALIZING
      ? 'INITIALIZING'
      : cameraState === CAMERA_STATES.ERROR
        ? 'ERROR'
        : cameraActive
          ? 'LIVE'
          : 'CAMERA OFF';

  return (
    <article className="ui-card">
      {/* Card Header with Semantic Tabs and Controls */}
      <header className="card-header">
        <div className="card-title-group">
          <Scan size={18} color="var(--text-secondary)" />
          <span className="card-title">Sign input</span>

          {/* Mode Switcher Tabs */}
          <nav className="pill-switcher" aria-label="Input Modes">
            <button
              type="button"
              className={`pill-tab-btn ${inputMode === 'phrases' ? 'active' : ''}`}
              onClick={() => setInputMode('phrases')}
            >
              <MessageSquare size={12} />
              <span>Phrases & Sentences</span>
            </button>

            <button
              type="button"
              className={`pill-tab-btn ${inputMode === 'alphabet' ? 'active' : ''}`}
              onClick={() => setInputMode('alphabet')}
            >
              <Type size={12} />
              <span>A–Z Alphabet</span>
            </button>

            <button
              type="button"
              className={`pill-tab-btn ${inputMode === 'numbers' ? 'active' : ''}`}
              onClick={() => setInputMode('numbers')}
            >
              <Hash size={12} />
              <span>Numbers (0–10)</span>
            </button>
          </nav>
        </div>

        {/* Engine Status & Language Select */}
        <div className="card-title-group">
          <div className="nav-pill-badge active-status">
            <span className="nav-pill-dot" />
            <span>Uni-Sign ST-GCN Online</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label htmlFor="sign-lang-select" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Language:
            </label>
            <select
              id="sign-lang-select"
              className="ui-select"
              value={signLanguage}
              onChange={(e) => setSignLanguage(e.target.value)}
            >
              <option value="ISL">Indian Sign Language (ISL)</option>
              <option value="ASL">American Sign Language (ASL)</option>
              <option value="BSL">British Sign Language (BSL)</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Viewport Container */}
      <div
        className={`viewport-frame ${cameraActive ? 'camera-active' : ''}`}
        onClick={() => {
          if (!cameraActive) startCamera();
        }}
      >
        {/* Reticle Brackets */}
        <div className={`corner-bracket corner-tl ${cameraActive ? 'active' : ''}`} />
        <div className={`corner-bracket corner-tr ${cameraActive ? 'active' : ''}`} />
        <div className={`corner-bracket corner-bl ${cameraActive ? 'active' : ''}`} />
        <div className={`corner-bracket corner-br ${cameraActive ? 'active' : ''}`} />

        {/* Top-Left Status HUD */}
        <div className={`camera-hud-top-left ${cameraActive ? 'active' : ''} ${cameraState === CAMERA_STATES.ERROR ? 'error' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div className="hud-status-dot" />
            <span>{cameraStatusLabel}</span>
          </div>

          <span style={{ color: 'var(--border-strong)', margin: '0 2px' }}>|</span>

          {/* Buffer Progress (Updated via Vanilla JS) */}
          <div className="hud-buffer-pill">
            <span ref={bufferCountTextRef}>UNI-SIGN ST-GCN BUFFER: 0/16</span>
            <div ref={bufferBarRef} className="buffer-bar-track">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="buffer-bar-cell" />
              ))}
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>~12.5 FPS</span>
          </div>

          {/* Pose & Hands Telemetry Tags */}
          <span ref={poseTagRef} className="hud-tag">UNI-SIGN BODY: SCAN</span>
          <span ref={handsTagRef} className="hud-tag">HANDS: 0</span>
          <span ref={anchorTagRef} className="hud-tag anchor" style={{ display: 'none' }}>ANCHOR</span>
        </div>

        {/* Top-Right Motion State HUD (Native JS Toggled) */}
        <div className="camera-hud-top-right">
          <div ref={motionHudRef} className="motion-hud-badge" />
        </div>

        {/* Video Element */}
        <video
          ref={videoRef}
          className={`viewport-video ${cameraActive ? 'active' : ''} ${(mirrorMode && !targetSecondPerson) ? 'mirrored' : ''}`}
          autoPlay
          playsInline
          muted
        />

        {/* High-speed Landmark Skeleton Canvas */}
        <canvas
          ref={canvasRef}
          className={`viewport-canvas ${cameraActive ? 'active' : ''}`}
        />

        {/* Camera Off Placeholder */}
        {!cameraActive && (
          <div className="camera-off-state">
            <div className="camera-off-icon-box">
              <Camera size={26} color="var(--accent-cyan)" />
            </div>

            <h3 className="camera-off-title">Ready when you are.</h3>
            <p className="camera-off-desc">
              Detects every sign movement precisely, waits for you to finish your sentence, and synthesizes speech as soon as you stop.
            </p>

            <button
              type="button"
              className={`btn-action-primary ${cameraState === CAMERA_STATES.ERROR ? 'error-state' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (cameraState === CAMERA_STATES.REQUESTING_PERMISSION || cameraState === CAMERA_STATES.INITIALIZING) return;
                startCamera();
              }}
              disabled={cameraState === CAMERA_STATES.REQUESTING_PERMISSION || cameraState === CAMERA_STATES.INITIALIZING}
            >
              <Camera size={18} />
              <span>
                {cameraState === CAMERA_STATES.ERROR
                  ? 'Retry Camera'
                  : cameraState === CAMERA_STATES.REQUESTING_PERMISSION
                    ? 'Requesting camera access...'
                    : cameraState === CAMERA_STATES.INITIALIZING
                      ? 'Starting camera...'
                      : 'Enable camera & Start Translating'}
              </span>
            </button>

            <div className="camera-off-lock-note">
              <span>🔒</span>
              <span>Your browser will ask for camera access</span>
            </div>

            {cameraError && (
              <div className="camera-error-badge">{cameraError}</div>
            )}

            {recognitionState !== 'ready' && (
              <div className="camera-recognition-badge">
                Recognition status: {recognitionState === 'loading' ? 'Loading' : recognitionState === 'unavailable' ? 'Unavailable' : 'Checking'}
              </div>
            )}
          </div>
        )}

        {/* Central Recognition & Hold-to-Confirm Visual HUD (Pure Vanilla JS Direct Updates) */}
        <div ref={recognitionOverlayRef} className="recognition-overlay-hud hidden">
          <div ref={recognitionAnalyzingLabelRef} style={{ display: 'none', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
            <Sparkles size={18} color="#ffffff" className="animate-spin" />
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>
              Uni-Sign AI: Accurately Recognizing Sign...
            </span>
          </div>

          <div ref={recognitionNormalContentRef} style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '8px' }}>
            <div className="recognition-header-row">
              <div className="recognition-title-group">
                <span ref={recognitionSignNameRef} className="recognition-sign-name" />
                <span ref={recognitionSignPhraseRef} className="recognition-sign-phrase" />
              </div>
              <span ref={recognitionPercentBadgeRef} className="recognition-percent-badge">0%</span>
            </div>

            <div ref={holdProgressTrackRef} className="hold-progress-track">
              <div ref={holdProgressFillRef} className="hold-progress-fill" />
            </div>

            <div ref={recognitionStatusTextRef} className="recognition-status-text" />
          </div>
        </div>

        {/* Reticle Guide Text */}
        <div className="viewport-reticle-guide">
          FACE + BOTH HANDS IN FRAME (PAUSE WHEN FINISHED SIGNING)
        </div>

        {/* Manual Instant Trigger & Second Person Controls */}
        <div className="viewport-bottom-right-controls">
          {cameraActive && (
            <>
              <button
                type="button"
                className="btn-translate-manual"
                onClick={processCompletedSigning}
                title="Translate Sign (Uni-Sign AI)"
              >
                <Sparkles size={14} color="#ffffff" />
                <span>Translate Sign (Uni-Sign AI)</span>
              </button>

              <button
                type="button"
                className="btn-camera-stop"
                onClick={stopCamera}
                title="Stop camera video feed"
              >
                <CameraOff size={12} />
                <span>Stop Camera</span>
              </button>
            </>
          )}

          <button
            type="button"
            className="btn-second-person-toggle"
            onClick={() => {
              const nextVal = !targetSecondPerson;
              setTargetSecondPerson(nextVal);
              if (cameraActiveRef.current) {
                stopCamera();
                setTimeout(() => startCamera(nextVal), 150);
              }
            }}
            title="Toggle between scanning a second person facing you vs yourself"
          >
            <Users size={12} color="var(--accent-cyan)" />
            <span>{targetSecondPerson ? 'Scanning 2nd Person' : 'Self Mode'}</span>
          </button>
        </div>
      </div>

      {/* Vocabulary Quick Toolbar */}
      {inputMode === 'alphabet' ? (
        <section className="vocab-toolbar" aria-label="Alphabet Toolbar">
          <div className="vocab-toolbar-header">
            <span className="vocab-title-label">COMPLETE A–Z FINGERSPELLING:</span>
            <div className="vocab-actions-group">
              <button type="button" className="vocab-action-btn" onClick={onFingerspellSpace}>
                <Space size={12} />
                <span>Space</span>
              </button>
              <button type="button" className="vocab-action-btn" onClick={onFingerspellBackspace}>
                <Delete size={12} />
                <span>Backspace</span>
              </button>
            </div>
          </div>

          <div className="vocab-scroll-row">
            {ALPHABET_A_TO_Z.map(item => (
              <button
                key={item.id}
                type="button"
                className="vocab-char-btn"
                onClick={() => handleSimulateGesture(item)}
                title={item.description}
              >
                {item.letter}
              </button>
            ))}
          </div>
        </section>
      ) : inputMode === 'numbers' ? (
        <section className="vocab-toolbar" aria-label="Numbers Toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
            <span className="vocab-title-label">NUMBERS (0–10):</span>
            {NUMBERS_0_TO_10.map(num => (
              <button
                key={num.id}
                type="button"
                className="vocab-num-btn"
                onClick={() => handleSimulateGesture(num)}
                title={num.description}
              >
                {num.digit}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="vocab-toolbar" aria-label="Phrases Toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '4px' }}>
            {filteredVocabulary.map(sign => (
              <button
                key={sign.id}
                type="button"
                className="word-sign-chip"
                onClick={() => handleSimulateGesture(sign)}
                title={sign.description}
              >
                <span>{sign.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Card Footer with Session Controls */}
      <footer className="card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: cameraActive ? 'var(--accent-green)' : 'var(--text-muted)'
          }}>
            {cameraActive ? <Camera size={18} /> : <CameraOff size={18} />}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
              {cameraActive ? 'Turn-Taking Motion Engine Active' : 'Camera access not enabled'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {cameraActive
                ? (isSessionActive ? 'Sign freely. When you stop moving, Uni-Sign translates your sign directly into spoken audio.' : 'Camera ready. Click Start session to begin.')
                : 'Enable your camera, then start a session to translate.'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="btn-action-secondary"
            onClick={() => {
              stopCamera();
              onResetSession();
            }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          {!isSessionActive ? (
            <button
              type="button"
              className="btn-action-start"
              onClick={() => {
                if (!cameraActive) startCamera();
                onStartSession();
              }}
            >
              <Play size={14} fill="currentColor" />
              <span>Start session</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-action-stop"
              onClick={() => {
                stopCamera();
                onStopSession();
              }}
            >
              <Square size={14} fill="currentColor" />
              <span>Stop session</span>
            </button>
          )}
        </div>
      </footer>
    </article>
  );
}
