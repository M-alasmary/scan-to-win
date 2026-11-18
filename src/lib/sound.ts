// Optional, fully synthesized sound effects (Web Audio API).
// No audio files, no network requests, OFF by default.

export type Sfx = 'tap' | 'tick' | 'charge' | 'burst' | 'alarm' | 'correct' | 'wrong' | 'whoosh'

let ctx: AudioContext | null = null
let master: GainNode | null = null
let enabled = false

function ensure() {
  if (ctx) return ctx
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.35
  master.connect(ctx.destination)
  return ctx
}

function tone(freq: number, dur: number, opts: { type?: OscillatorType; gain?: number; at?: number; to?: number } = {}) {
  if (!ctx || !master) return
  const t0 = ctx.currentTime + (opts.at ?? 0)
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = opts.type ?? 'sine'
  osc.frequency.setValueAtTime(freq, t0)
  if (opts.to) osc.frequency.exponentialRampToValueAtTime(opts.to, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(opts.gain ?? 0.3, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(master)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

function noise(dur: number, gain = 0.25, at = 0, highpass = 800) {
  if (!ctx || !master) return
  const t0 = ctx.currentTime + at
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
  const src = ctx.createBufferSource()
  src.buffer = buf
  const f = ctx.createBiquadFilter()
  f.type = 'highpass'
  f.frequency.value = highpass
  const g = ctx.createGain()
  g.gain.value = gain
  src.connect(f).connect(g).connect(master)
  src.start(t0)
}

export const sound = {
  get enabled() {
    return enabled
  },
  setEnabled(v: boolean) {
    enabled = v
    if (v) {
      ensure()
      void ctx?.resume()
      this.play('tap')
    }
  },
  play(name: Sfx) {
    if (!enabled || !ensure()) return
    switch (name) {
      case 'tap':
        tone(660, 0.07, { type: 'triangle', gain: 0.18 })
        break
      case 'tick':
        tone(1200, 0.03, { type: 'square', gain: 0.05 })
        break
      case 'charge':
        tone(180, 1.3, { type: 'sawtooth', gain: 0.08, to: 900 })
        tone(360, 1.3, { type: 'sine', gain: 0.1, to: 1800 })
        break
      case 'burst':
        noise(0.5, 0.25, 0, 1500)
        ;[784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.6, { type: 'triangle', gain: 0.16, at: i * 0.05 }))
        break
      case 'alarm':
        noise(0.18, 0.35, 0, 300)
        for (let i = 0; i < 3; i++) {
          tone(880, 0.16, { type: 'square', gain: 0.09, at: 0.15 + i * 0.36 })
          tone(587, 0.16, { type: 'square', gain: 0.09, at: 0.33 + i * 0.36 })
        }
        break
      case 'correct':
        tone(659, 0.14, { type: 'triangle', gain: 0.2 })
        tone(988, 0.25, { type: 'triangle', gain: 0.2, at: 0.1 })
        break
      case 'wrong':
        tone(220, 0.3, { type: 'sawtooth', gain: 0.1, to: 140 })
        break
      case 'whoosh':
        noise(0.35, 0.12, 0, 2500)
        break
    }
  },
}
