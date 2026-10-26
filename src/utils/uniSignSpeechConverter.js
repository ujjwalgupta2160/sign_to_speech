// Uni-Sign Neural Sign-to-Speech Converter
// Seamless real-time speech generation from translated sign sequences
// Inspired by Uni-Sign (ICLR 2025) Sign-to-Text & Speech pipeline

class UniSignSpeechConverter {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.isSpeaking = false;
    this.activeVoice = null;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.volume = 1.0;
    this.lastSpokenText = '';
    this.speechQueue = [];
    this.init();
  }

  init() {
    if (!this.synth) return;

    const loadVoices = () => {
      this.voices = this.synth.getVoices();
      if (this.voices.length > 0 && !this.activeVoice) {
        // Find natural expressive voices (e.g., Natural, Neural, Google, Samantha, Aria)
        const naturalVoice = this.voices.find(v => 
          (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google') || v.name.includes('Aria') || v.name.includes('Samantha')) &&
          (v.lang.startsWith('en') || v.lang.startsWith('hi'))
        ) || this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
        
        this.activeVoice = naturalVoice;
      }
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  getVoices() {
    if (!this.synth) return [];
    if (this.voices.length === 0) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  setVoice(voiceURI) {
    if (!voiceURI) return;
    const v = this.voices.find(item => item.voiceURI === voiceURI);
    if (v) this.activeVoice = v;
  }

  setRate(r) {
    this.rate = Math.max(0.5, Math.min(2.0, r));
  }

  setPitch(p) {
    this.pitch = Math.max(0.5, Math.min(1.5, p));
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1.0, vol));
  }

  /**
   * Converts translated sign text to speech
   */
  speak(text, options = {}) {
    if (!this.synth || !text) return;
    const cleanText = text.trim();
    if (!cleanText) return;

    // Prevent immediate repetitive stutter if speaking exact same sign within short window
    if (this.isSpeaking && this.lastSpokenText === cleanText && !options.force) {
      return;
    }

    // Cancel current utterance if needed for real-time responsiveness
    if (options.interrupt !== false) {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options.rate || this.rate;
    utterance.pitch = options.pitch || this.pitch;
    utterance.volume = options.volume !== undefined ? options.volume : this.volume;

    const voiceToUse = options.voice || (options.voiceURI ? this.voices.find(v => v.voiceURI === options.voiceURI) : this.activeVoice);
    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.lastSpokenText = cleanText;
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      if (options.onError) options.onError(e);
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }
}

export const uniSignSpeechConverter = new UniSignSpeechConverter();
// Keep speechController alias so any legacy consumers smoothly reference the Uni-Sign converter
export const speechController = uniSignSpeechConverter;
