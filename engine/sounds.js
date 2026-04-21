window.PandaAdventure = window.PandaAdventure || {};
window.PandaAdventure.Sounds = {
  _ctx: null,
  _muted: false,

  init: function () {
    if (this._ctx) return;
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this._ctx = new AudioCtx();
      }
    } catch (e) {
      // Web Audio not supported — sounds disabled silently
    }
  },

  play: function (type) {
    if (this._muted) return;
    this.init();
    if (!this._ctx) return;
    try {
      var ctx = this._ctx;
      var now = ctx.currentTime;

      if (type === 'match') {
        // short pleasant ding: sine, 880Hz, 0.15s
        var matchOsc = ctx.createOscillator();
        var matchGain = ctx.createGain();
        matchOsc.connect(matchGain);
        matchGain.connect(ctx.destination);
        matchOsc.type = 'sine';
        matchOsc.frequency.setValueAtTime(880, now);
        matchGain.gain.setValueAtTime(0.4, now);
        matchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        matchOsc.start(now);
        matchOsc.stop(now + 0.15);

      } else if (type === 'catch') {
        // rising blip: sine, 600→1000Hz sweep, 0.1s
        var catchOsc = ctx.createOscillator();
        var catchGain = ctx.createGain();
        catchOsc.connect(catchGain);
        catchGain.connect(ctx.destination);
        catchOsc.type = 'sine';
        catchOsc.frequency.setValueAtTime(600, now);
        catchOsc.frequency.linearRampToValueAtTime(1000, now + 0.1);
        catchGain.gain.setValueAtTime(0.35, now);
        catchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        catchOsc.start(now);
        catchOsc.stop(now + 0.1);

      } else if (type === 'wrong') {
        // descending buzz: square, 300→150Hz, 0.2s
        var wrongOsc = ctx.createOscillator();
        var wrongGain = ctx.createGain();
        wrongOsc.connect(wrongGain);
        wrongGain.connect(ctx.destination);
        wrongOsc.type = 'square';
        wrongOsc.frequency.setValueAtTime(300, now);
        wrongOsc.frequency.linearRampToValueAtTime(150, now + 0.2);
        wrongGain.gain.setValueAtTime(0.25, now);
        wrongGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        wrongOsc.start(now);
        wrongOsc.stop(now + 0.2);

      } else if (type === 'levelUp') {
        // triumphant 3-note chord: C5-E5-G5, 0.4s
        var freqs = [523.25, 659.25, 783.99];
        for (var i = 0; i < freqs.length; i++) {
          (function (freq) {
            var lvlOsc = ctx.createOscillator();
            var lvlGain = ctx.createGain();
            lvlOsc.connect(lvlGain);
            lvlGain.connect(ctx.destination);
            lvlOsc.type = 'sine';
            lvlOsc.frequency.setValueAtTime(freq, now);
            lvlGain.gain.setValueAtTime(0.25, now);
            lvlGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            lvlOsc.start(now);
            lvlOsc.stop(now + 0.4);
          })(freqs[i]);
        }

      } else if (type === 'gameOver') {
        // descending sad notes: 500→200Hz, 0.5s
        var overOsc = ctx.createOscillator();
        var overGain = ctx.createGain();
        overOsc.connect(overGain);
        overGain.connect(ctx.destination);
        overOsc.type = 'sine';
        overOsc.frequency.setValueAtTime(500, now);
        overOsc.frequency.linearRampToValueAtTime(200, now + 0.5);
        overGain.gain.setValueAtTime(0.35, now);
        overGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        overOsc.start(now);
        overOsc.stop(now + 0.5);
      }
    } catch (e) {
      // ignore audio errors
    }
  },

  playBirthdayJingle: function () {
    if (this._muted) return;
    this.init();
    if (!this._ctx) return;
    try {
      var ctx = this._ctx;
      // "Happy Birthday" first two bars
      // C4, C4, D4, C4, F4, E4, C4, C4, D4, C4, G4, F4
      var notes = [261.6, 261.6, 293.7, 261.6, 349.2, 329.6, 261.6, 261.6, 293.7, 261.6, 392.0, 349.2];
      var durations = [0.18, 0.18, 0.36, 0.36, 0.36, 0.72, 0.18, 0.18, 0.36, 0.36, 0.36, 0.72];
      var gap = 0.04;
      var t = ctx.currentTime + 0.05;

      for (var i = 0; i < notes.length; i++) {
        (function (freq, startTime, dur) {
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.0, startTime);
          gain.gain.linearRampToValueAtTime(0.4, startTime + 0.02);
          gain.gain.setValueAtTime(0.4, startTime + dur - 0.04);
          gain.gain.linearRampToValueAtTime(0.0, startTime + dur);
          osc.start(startTime);
          osc.stop(startTime + dur + 0.01);
        })(notes[i], t, durations[i]);
        t += durations[i] + gap;
      }
    } catch (e) {
      // ignore audio errors
    }
  },

  toggleMute: function () {
    this._muted = !this._muted;
    return this._muted;
  }
};
