// Zero-dependency Web Audio API polyphonic-ready subtractive synth engine
export class KineticSynthEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.analyser = null;
    this.filter = null;
    this.delay = null;
    this.delayFeedback = null;
    this.delayWet = null;
  }

  ensureContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.value = 2400;
      this.filter.Q.value = 4.2;

      this.delay = this.ctx.createDelay(1.0);
      this.delay.delayTime.value = 0.24;
      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.value = 0.28;
      this.delayWet = this.ctx.createGain();
      this.delayWet.gain.value = 0.22;

      this.master = this.ctx.createGain();
      this.master.gain.value = 0.42;

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 1024;
      this.analyser.smoothingTimeConstant = 0.78;

      this.filter.connect(this.master);
      this.filter.connect(this.delay);
      this.delay.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delay);
      this.delay.connect(this.delayWet);
      this.delayWet.connect(this.master);

      this.master.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  updateParams({ cutoff, resonance, delayMix, volume }) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.filter.frequency.setTargetAtTime(cutoff, now, 0.015);
    this.filter.Q.setTargetAtTime(resonance, now, 0.015);
    this.delayWet.gain.setTargetAtTime(delayMix, now, 0.02);
    this.master.gain.setTargetAtTime(volume, now, 0.015);
  }

  triggerNote(freq, params, durationSec = 0.34) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    this.updateParams(params);

    const now = ctx.currentTime;
    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    const env = ctx.createGain();

    oscA.type = params.waveform;
    oscB.type = params.waveform === 'sine' ? 'triangle' : params.waveform;
    oscA.frequency.setValueAtTime(freq, now);
    oscB.frequency.setValueAtTime(freq, now);
    oscB.detune.setValueAtTime(params.detune, now);

    const attack = Math.max(0.005, params.attack);
    const release = Math.max(0.04, params.release);

    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.55, now + attack);
    env.gain.exponentialRampToValueAtTime(0.22, now + attack + durationSec * 0.6);
    env.gain.exponentialRampToValueAtTime(0.0001, now + attack + durationSec + release);

    oscA.connect(env);
    oscB.connect(env);
    env.connect(this.filter);

    oscA.start(now);
    oscB.start(now);
    const stopAt = now + attack + durationSec + release + 0.03;
    oscA.stop(stopAt);
    oscB.stop(stopAt);
  }

  getWaveformData(targetArray) {
    if (!this.analyser) return false;
    this.analyser.getByteTimeDomainData(targetArray);
    return true;
  }
}
