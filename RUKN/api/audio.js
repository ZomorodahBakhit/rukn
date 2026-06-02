/* ═══════════════════════════════════════════════════════════════════
   RUKN — ambient audio engine.

   Two-tier source:
     1. If audio/<name>.mp3 exists on disk, that file is played in a
        loop via a plain HTML <audio> element. Drop your own field
        recordings into RUKN/audio/ — see RUKN/audio/README.md.
     2. Otherwise the same name is synthesized in the browser via the
        Web Audio API (no network, no extra files).

   Exposes window.RuknAudio with:
     RuknAudio.play(name)     name: "rain" | "fireplace" | "cafe" | "forest" | "lofi"
     RuknAudio.stop()
     RuknAudio.setVolume(v)   0..1
     RuknAudio.current        currently-playing name, or null
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null;
  let master = null;
  let current = null;        // { name, nodes?, cleanups?, audioEl? }
  let storedVol = 0.4;

  // Cache of which mp3 files exist on disk so we don't HEAD-probe more than once.
  const mp3Status = {};      // name → "ok" | "missing" | "pending"

  function ensure() {
    if (ctx) return;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = storedVol;
    master.connect(ctx.destination);
  }

  function stop() {
    if (!current) return;
    if (current.audioEl) {
      try { current.audioEl.pause(); current.audioEl.src = ""; } catch (e) {}
    }
    (current.cleanups || []).forEach(c => { try { c(); } catch (e) {} });
    (current.nodes || []).forEach(n => {
      try { if (n.stop) n.stop(); } catch (e) {}
      try { n.disconnect(); } catch (e) {}
    });
    current = null;
  }

  // Returns a Promise<boolean>: true if audio/<name>.mp3 is reachable.
  function probeMp3(name) {
    if (mp3Status[name] === "ok")      return Promise.resolve(true);
    if (mp3Status[name] === "missing") return Promise.resolve(false);
    mp3Status[name] = "pending";
    return fetch("audio/" + name + ".mp3", { method: "HEAD" })
      .then(r => {
        mp3Status[name] = r.ok ? "ok" : "missing";
        return r.ok;
      })
      .catch(() => { mp3Status[name] = "missing"; return false; });
  }

  function playMp3(name) {
    const el = new Audio("audio/" + name + ".mp3");
    el.loop = true;
    el.volume = storedVol;
    el.play().catch(() => { /* browser may block — user will retry */ });
    return { name, audioEl: el };
  }

  function noiseBuffer(seconds, color) {
    const len = ctx.sampleRate * seconds;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    // White noise; color filtering happens via biquad on the consuming chain.
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    // Slightly tame the peaks for browned noise look
    if (color === "brown") {
      let last = 0;
      for (let i = 0; i < len; i++) {
        last = (last + 0.02 * d[i]) / 1.02;
        d[i] = last * 3.5;
      }
    }
    return buf;
  }

  // ── Rain ────────────────────────────────────────────────────────
  // Pink-ish noise through a low-pass band with gentle modulation, plus
  // a tiny rhythmic "patter" via a fast amplitude wobble.
  function startRain() {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(6, "white");
    src.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1800;
    lp.Q.value = 0.6;

    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 220;

    const gain = ctx.createGain();
    gain.gain.value = 0.42;

    // Amplitude modulator gives the patter a sense of motion.
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.18;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.08;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    src.connect(hp); hp.connect(lp); lp.connect(gain); gain.connect(master);
    src.start(); lfo.start();
    return { nodes: [src, lp, hp, gain, lfo, lfoGain], cleanups: [] };
  }

  // ── Fireplace ───────────────────────────────────────────────────
  // Brown noise + slow band-pass crackle layer (random clicks).
  function startFireplace() {
    const bed = ctx.createBufferSource();
    bed.buffer = noiseBuffer(8, "brown");
    bed.loop = true;
    const bedLp = ctx.createBiquadFilter();
    bedLp.type = "lowpass";
    bedLp.frequency.value = 700;
    const bedGain = ctx.createGain();
    bedGain.gain.value = 0.55;
    bed.connect(bedLp); bedLp.connect(bedGain); bedGain.connect(master);
    bed.start();

    // Random crackles
    const crackles = [];
    let stopped = false;
    function scheduleCrackle() {
      if (stopped) return;
      const when = ctx.currentTime + Math.random() * 0.6 + 0.05;
      const c = ctx.createBufferSource();
      c.buffer = noiseBuffer(0.05, "white");
      const cf = ctx.createBiquadFilter();
      cf.type = "bandpass";
      cf.frequency.value = 1200 + Math.random() * 1800;
      cf.Q.value = 1.2;
      const cg = ctx.createGain();
      cg.gain.setValueAtTime(0, when);
      cg.gain.linearRampToValueAtTime(0.35 + Math.random() * 0.3, when + 0.005);
      cg.gain.exponentialRampToValueAtTime(0.001, when + 0.06 + Math.random() * 0.05);
      c.connect(cf); cf.connect(cg); cg.connect(master);
      c.start(when);
      c.stop(when + 0.2);
      crackles.push(c, cf, cg);
      setTimeout(scheduleCrackle, (when - ctx.currentTime) * 1000 + 50);
    }
    scheduleCrackle();
    return {
      nodes: [bed, bedLp, bedGain, ...crackles],
      cleanups: [() => { stopped = true; }],
    };
  }

  // ── Café — distant murmur (low pink noise) + occasional ceramic clink
  function startCafe() {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(8, "brown");
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 500;
    const gain = ctx.createGain(); gain.gain.value = 0.45;
    src.connect(lp); lp.connect(gain); gain.connect(master);
    src.start();

    // Sparse clinks (pure sine pings)
    const pings = [];
    let stopped = false;
    function scheduleClink() {
      if (stopped) return;
      const when = ctx.currentTime + 1.4 + Math.random() * 4.5;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 1400 + Math.random() * 800;
      const og = ctx.createGain();
      og.gain.setValueAtTime(0, when);
      og.gain.linearRampToValueAtTime(0.12 + Math.random() * 0.06, when + 0.002);
      og.gain.exponentialRampToValueAtTime(0.0008, when + 0.25);
      osc.connect(og); og.connect(master);
      osc.start(when); osc.stop(when + 0.3);
      pings.push(osc, og);
      setTimeout(scheduleClink, (when - ctx.currentTime) * 1000 + 100);
    }
    scheduleClink();
    return {
      nodes: [src, lp, gain, ...pings],
      cleanups: [() => { stopped = true; }],
    };
  }

  // ── Forest — soft wind + intermittent bird chirps
  function startForest() {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(6, "white");
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 420; bp.Q.value = 0.4;
    const gain = ctx.createGain(); gain.gain.value = 0.35;
    const lfo = ctx.createOscillator();
    lfo.type = "sine"; lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.1;
    lfo.connect(lfoGain); lfoGain.connect(gain.gain);
    src.connect(bp); bp.connect(gain); gain.connect(master);
    src.start(); lfo.start();

    const birds = [];
    let stopped = false;
    function scheduleChirp() {
      if (stopped) return;
      const when = ctx.currentTime + 2 + Math.random() * 6;
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      const f1 = 1800 + Math.random() * 1400;
      osc.frequency.setValueAtTime(f1, when);
      osc.frequency.exponentialRampToValueAtTime(f1 * 1.6, when + 0.08);
      const og = ctx.createGain();
      og.gain.setValueAtTime(0, when);
      og.gain.linearRampToValueAtTime(0.10, when + 0.01);
      og.gain.exponentialRampToValueAtTime(0.001, when + 0.18);
      osc.connect(og); og.connect(master);
      osc.start(when); osc.stop(when + 0.25);
      birds.push(osc, og);
      setTimeout(scheduleChirp, (when - ctx.currentTime) * 1000 + 100);
    }
    scheduleChirp();
    return {
      nodes: [src, bp, gain, lfo, lfoGain, ...birds],
      cleanups: [() => { stopped = true; }],
    };
  }

  // ── Lofi — soft warm pad + tape hiss
  function startLofi() {
    const hiss = ctx.createBufferSource();
    hiss.buffer = noiseBuffer(8, "white");
    hiss.loop = true;
    const hLp = ctx.createBiquadFilter();
    hLp.type = "lowpass"; hLp.frequency.value = 4000;
    const hHp = ctx.createBiquadFilter();
    hHp.type = "highpass"; hHp.frequency.value = 800;
    const hGain = ctx.createGain(); hGain.gain.value = 0.05;
    hiss.connect(hHp); hHp.connect(hLp); hLp.connect(hGain); hGain.connect(master);
    hiss.start();

    // Two-note pad: a fifth wandering up and down
    const o1 = ctx.createOscillator(); o1.type = "triangle"; o1.frequency.value = 196;
    const o2 = ctx.createOscillator(); o2.type = "triangle"; o2.frequency.value = 294;
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass"; padFilter.frequency.value = 800;
    const padGain = ctx.createGain(); padGain.gain.value = 0.10;
    o1.connect(padFilter); o2.connect(padFilter); padFilter.connect(padGain); padGain.connect(master);
    o1.start(); o2.start();

    const lfo = ctx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 0.05;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 300;
    lfo.connect(lfoGain); lfoGain.connect(padFilter.frequency);
    lfo.start();
    return { nodes: [hiss, hLp, hHp, hGain, o1, o2, padFilter, padGain, lfo, lfoGain], cleanups: [] };
  }

  const STARTERS = {
    rain:      startRain,
    fireplace: startFireplace,
    cafe:      startCafe,
    forest:    startForest,
    lofi:      startLofi,
  };

  window.RuknAudio = {
    get current() { return current && current.name; },

    async play(name) {
      if (!name) { stop(); return false; }
      if (current && current.name === name) return true; // already playing

      // 1) Try MP3 first. If audio/<name>.mp3 is on disk, use it.
      const hasMp3 = await probeMp3(name);
      if (hasMp3) {
        stop();
        current = playMp3(name);
        return true;
      }

      // 2) Fall back to procedural synthesis via Web Audio.
      ensure();
      if (!ctx) return false;
      if (ctx.state === "suspended") ctx.resume();
      stop();
      const fn = STARTERS[name];
      if (!fn) return false;
      const handle = fn();
      handle.name = name;
      current = handle;
      return true;
    },

    stop,

    setVolume(v) {
      storedVol = Math.max(0, Math.min(1, +v || 0));
      // MP3 path: write directly to the <audio> element.
      if (current && current.audioEl) {
        current.audioEl.volume = storedVol;
        return;
      }
      // Synthesis path: ramp the master gain so it doesn't pop.
      if (master) {
        master.gain.setTargetAtTime(storedVol, ctx.currentTime, 0.05);
      }
    },
  };
})();
