/**
 * Interface sound, synthesized live with the Web Audio API. No audio files.
 *
 * Every sound is data: a few short layers of filtered noise ("paper") and
 * sine/triangle tones ("ink"). Peaks stay far below content audio, playback
 * waits for a user gesture, and the visitor's mute choice is remembered.
 */

type Envelope = { offset?: number; attack: number; decay: number; peak: number };

type Tone = Envelope & {
  kind: "tone";
  waveform: OscillatorType;
  frequency: number;
  detune?: number;
  glideTo?: number;
};

type Noise = Envelope & {
  kind: "noise";
  filterType: BiquadFilterType;
  filterFrequency: number;
  filterQ?: number;
  sweepTo?: number;
};

type Shimmer = {
  delay: number;
  feedback: number;
  wet: number;
  lowpass: number;
};

type Preset = {
  masterGain: number;
  layers: (Tone | Noise)[];
  shimmer?: Shimmer;
};

export const presets = {
  /** Hover: a dry pen-tip tick. */
  tick: {
    masterGain: 0.4,
    layers: [
      {
        kind: "noise",
        filterType: "bandpass",
        filterFrequency: 4800,
        filterQ: 2,
        attack: 0.001,
        decay: 0.015,
        peak: 0.12,
      },
      {
        kind: "tone",
        waveform: "sine",
        frequency: 2200,
        attack: 0.001,
        decay: 0.011,
        peak: 0.016,
      },
    ],
  },
  /** Click: a soft press into paper. */
  tap: {
    masterGain: 0.42,
    layers: [
      {
        kind: "noise",
        filterType: "bandpass",
        filterFrequency: 1900,
        filterQ: 1.4,
        attack: 0.001,
        decay: 0.02,
        peak: 0.13,
      },
      {
        kind: "tone",
        waveform: "sine",
        frequency: 310,
        glideTo: 170,
        attack: 0.001,
        decay: 0.035,
        peak: 0.05,
      },
    ],
  },
  /** Switches: a two-step click. */
  toggle: {
    masterGain: 0.4,
    layers: [
      {
        kind: "noise",
        filterType: "bandpass",
        filterFrequency: 2300,
        filterQ: 1.6,
        attack: 0.001,
        decay: 0.016,
        peak: 0.12,
      },
      {
        kind: "noise",
        filterType: "bandpass",
        filterFrequency: 3900,
        filterQ: 1.6,
        offset: 0.026,
        attack: 0.001,
        decay: 0.02,
        peak: 0.1,
      },
    ],
  },
  /** Scene change: a sheet of paper sliding over another. */
  page: {
    masterGain: 0.4,
    layers: [
      {
        kind: "noise",
        filterType: "bandpass",
        filterFrequency: 1500,
        sweepTo: 5200,
        filterQ: 0.7,
        attack: 0.035,
        decay: 0.12,
        peak: 0.05,
      },
      {
        kind: "noise",
        filterType: "highpass",
        filterFrequency: 6500,
        offset: 0.05,
        attack: 0.02,
        decay: 0.07,
        peak: 0.012,
      },
    ],
  },
  /** The monogram turning a quarter. */
  turn: {
    masterGain: 0.42,
    layers: [
      {
        kind: "noise",
        filterType: "bandpass",
        filterFrequency: 2600,
        filterQ: 1.8,
        attack: 0.001,
        decay: 0.014,
        peak: 0.1,
      },
      {
        kind: "tone",
        waveform: "sine",
        frequency: 392,
        glideTo: 587.33,
        offset: 0.01,
        attack: 0.008,
        decay: 0.16,
        peak: 0.045,
      },
    ],
    shimmer: { delay: 0.09, feedback: 0.18, wet: 0.12, lowpass: 3600 },
  },
  /** Theme change: a drop of ink. */
  ink: {
    masterGain: 0.45,
    layers: [
      {
        kind: "tone",
        waveform: "sine",
        frequency: 720,
        glideTo: 210,
        attack: 0.003,
        decay: 0.13,
        peak: 0.06,
      },
      {
        kind: "noise",
        filterType: "lowpass",
        filterFrequency: 900,
        sweepTo: 2600,
        offset: 0.02,
        attack: 0.04,
        decay: 0.16,
        peak: 0.03,
      },
    ],
    shimmer: { delay: 0.11, feedback: 0.2, wet: 0.1, lowpass: 2400 },
  },
  /** Sound switched on: an open fifth. */
  hello: {
    masterGain: 0.45,
    layers: [
      {
        kind: "tone",
        waveform: "sine",
        frequency: 659.25,
        attack: 0.004,
        decay: 0.12,
        peak: 0.05,
      },
      {
        kind: "tone",
        waveform: "sine",
        frequency: 987.77,
        offset: 0.07,
        attack: 0.004,
        decay: 0.2,
        peak: 0.05,
      },
    ],
    shimmer: { delay: 0.1, feedback: 0.24, wet: 0.16, lowpass: 4200 },
  },
  /** Completed action, such as copying the email address. */
  success: {
    masterGain: 0.48,
    layers: [
      {
        kind: "tone",
        waveform: "sine",
        frequency: 659.25,
        attack: 0.004,
        decay: 0.09,
        peak: 0.055,
      },
      {
        kind: "tone",
        waveform: "sine",
        frequency: 987.77,
        offset: 0.06,
        attack: 0.004,
        decay: 0.1,
        peak: 0.055,
      },
      {
        kind: "tone",
        waveform: "sine",
        frequency: 1318.51,
        offset: 0.12,
        attack: 0.004,
        decay: 0.2,
        peak: 0.065,
      },
    ],
    shimmer: { delay: 0.1, feedback: 0.22, wet: 0.16, lowpass: 4500 },
  },
  /** Something did not work. Always paired with a visible message. */
  error: {
    masterGain: 0.42,
    layers: [
      {
        kind: "noise",
        filterType: "bandpass",
        filterFrequency: 850,
        filterQ: 1.1,
        attack: 0.001,
        decay: 0.035,
        peak: 0.13,
      },
      {
        kind: "tone",
        waveform: "triangle",
        frequency: 392,
        offset: 0.025,
        attack: 0.004,
        decay: 0.09,
        peak: 0.045,
      },
      {
        kind: "tone",
        waveform: "triangle",
        frequency: 311.13,
        offset: 0.1,
        attack: 0.004,
        decay: 0.14,
        peak: 0.04,
      },
    ],
  },
} satisfies Record<string, Preset>;

export type SoundName = keyof typeof presets;
export const isSoundName = (value: unknown): value is SoundName =>
  typeof value === "string" && Object.hasOwn(presets, value);

const STORAGE_KEY = "niv-sound";
const listeners = new Set<() => void>();
let context: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let muted: boolean | null = null;
let lastPlay = 0;

export function isMuted() {
  if (muted === null) {
    try {
      muted = localStorage.getItem(STORAGE_KEY) === "off";
    } catch {
      muted = false;
    }
  }
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  try {
    localStorage.setItem(STORAGE_KEY, value ? "off" : "on");
  } catch {
    /* The preference still applies to this visit. */
  }
  listeners.forEach((listener) => listener());
}

export function subscribeMuted(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function audioContext() {
  if (context) return context;
  if (typeof window === "undefined") return null;
  const Constructor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Constructor) return null;
  try {
    context = new Constructor();
  } catch {
    return null;
  }
  return context;
}

/** One reusable second of white noise; each play starts at a random point. */
function noiseBuffer(ctx: AudioContext) {
  if (noise && noise.sampleRate === ctx.sampleRate) return noise;
  const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return (noise = buffer);
}

function render(ctx: AudioContext, preset: Preset) {
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = preset.masterGain;
  master.connect(ctx.destination);
  const extra: AudioNode[] = [];

  if (preset.shimmer) {
    const { delay, feedback, wet, lowpass } = preset.shimmer;
    const line = ctx.createDelay(1);
    line.delayTime.value = delay;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = lowpass;
    const loop = ctx.createGain();
    loop.gain.value = feedback;
    const out = ctx.createGain();
    out.gain.value = wet;
    master.connect(line);
    line.connect(filter);
    filter.connect(loop);
    loop.connect(line);
    filter.connect(out);
    out.connect(ctx.destination);
    extra.push(line, filter, loop, out);
  }

  let longest = 0;
  for (const layer of preset.layers) {
    const start = now + (layer.offset ?? 0);
    const length = layer.attack + layer.decay;
    const end = start + length + 0.05;
    longest = Math.max(longest, (layer.offset ?? 0) + length + 0.05);
    // Exponential ramps sound natural but cannot reach zero.
    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(
      layer.peak,
      start + layer.attack,
    );
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + length);
    envelope.connect(master);
    if (layer.kind === "tone") {
      const oscillator = ctx.createOscillator();
      oscillator.type = layer.waveform;
      oscillator.frequency.setValueAtTime(layer.frequency, start);
      if (layer.detune) oscillator.detune.value = layer.detune;
      if (layer.glideTo)
        oscillator.frequency.exponentialRampToValueAtTime(
          layer.glideTo,
          start + length,
        );
      oscillator.connect(envelope);
      oscillator.start(start);
      oscillator.stop(end);
    } else {
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer(ctx);
      const filter = ctx.createBiquadFilter();
      filter.type = layer.filterType;
      filter.frequency.setValueAtTime(layer.filterFrequency, start);
      if (layer.sweepTo)
        filter.frequency.exponentialRampToValueAtTime(
          layer.sweepTo,
          start + length,
        );
      if (layer.filterQ !== undefined) filter.Q.value = layer.filterQ;
      source.connect(filter);
      filter.connect(envelope);
      source.start(start, Math.random() * 0.5);
      source.stop(end);
    }
  }

  const shimmer = preset.shimmer;
  const tail = shimmer
    ? shimmer.delay *
      (1 + Math.ceil(Math.log(0.001) / Math.log(shimmer.feedback)))
    : 0;
  setTimeout(
    () => {
      master.disconnect();
      extra.forEach((node) => node.disconnect());
    },
    (longest + tail + 0.05) * 1000,
  );
}

/**
 * Plays a preset. Silent when muted, before the first user gesture, or when a
 * previous sound started less than `throttleMs` ago (fast hover sweeps).
 */
export function play(name: SoundName, { throttleMs = 28 } = {}) {
  if (typeof window === "undefined" || isMuted()) return;
  if (navigator.userActivation?.hasBeenActive === false) return;
  const time = performance.now();
  if (time - lastPlay < throttleMs) return;
  const ctx = audioContext();
  if (!ctx) return;
  lastPlay = time;
  const preset = presets[name];
  if (ctx.state === "running") render(ctx, preset);
  else
    ctx
      .resume()
      .then(() => {
        if (ctx.state === "running") render(ctx, preset);
      })
      .catch(() => {});
}

/** A short vibration where supported (Android); ignored elsewhere. */
export function haptic(duration = 8) {
  if (isMuted()) return;
  try {
    navigator.vibrate?.(duration);
  } catch {
    /* Some embedded browsers reject vibration. */
  }
}
