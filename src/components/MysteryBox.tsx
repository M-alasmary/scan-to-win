import { Gift } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useMemo } from 'react'

export type BoxState = 'idle' | 'charging' | 'open'

/** Futuristic mystery box: floating idle, shaking while charging, lid blast + light burst on open. */
export function MysteryBox({ state, onActivate, label }: { state: BoxState; onActivate: () => void; label: string }) {
  const reduce = useReducedMotion()
  const sparks = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2 + Math.random() * 0.3
        const d = 110 + Math.random() * 90
        return { x: Math.cos(a) * d, y: Math.sin(a) * d - 40, s: Math.random() * 5 + 3 }
      }),
    [],
  )

  const bodyAnim =
    state === 'charging' && !reduce
      ? { rotate: [0, -3, 3, -5, 5, -7, 7, -4, 4, 0], scale: [1, 1.02, 1.03, 1.05, 1.06], y: 0 }
      : state === 'open'
        ? { scale: 1.04, y: 6, rotate: 0 }
        : reduce
          ? {}
          : { y: [0, -10, 0], rotate: 0, scale: 1 }

  const bodyTransition =
    state === 'charging'
      ? { duration: 1.2, ease: 'easeInOut' as const }
      : state === 'open'
        ? { duration: 0.3 }
        : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' as const }

  return (
    <div className="relative mx-auto grid aspect-square w-[min(78vw,340px)] place-items-center">
      {/* rotating light rays */}
      <motion.div
        aria-hidden
        className="rays absolute -inset-[30%] rounded-full"
        animate={{ opacity: state === 'charging' ? 1 : state === 'open' ? 1 : 0.65, scale: state === 'open' ? 1.4 : 1 }}
        transition={{ duration: 0.6 }}
      />
      {/* halo */}
      <motion.div
        aria-hidden
        className="absolute inset-[12%] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgb(212 175 55 / 0.55), transparent 70%)' }}
        animate={reduce ? {} : { opacity: state === 'idle' ? [0.55, 0.9, 0.55] : 1, scale: state === 'charging' ? 1.25 : 1 }}
        transition={state === 'idle' ? { duration: 3, repeat: Infinity } : { duration: 0.6 }}
      />

      <motion.button
        type="button"
        onClick={onActivate}
        disabled={state !== 'idle'}
        aria-label={label}
        className="relative h-[62%] w-[62%] cursor-pointer outline-none disabled:cursor-default"
        animate={bodyAnim}
        transition={bodyTransition}
        whileHover={state === 'idle' && !reduce ? { scale: 1.04 } : undefined}
        whileTap={state === 'idle' ? { scale: 0.97 } : undefined}
      >
        {/* floor shadow */}
        <span aria-hidden className="absolute -bottom-[14%] left-1/2 h-[10%] w-[90%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-md" />

        {/* body */}
        <span
          aria-hidden
          className="circuit absolute inset-x-[4%] bottom-0 top-[30%] overflow-hidden rounded-b-2xl rounded-t-md border border-gold/60"
          style={{
            background: 'linear-gradient(160deg, #222a3d 0%, #151B28 45%, #0b0f18 100%)',
            boxShadow: 'inset 0 0 40px rgb(212 175 55 / 0.25), 0 20px 50px rgb(0 0 0 / 0.6), 0 0 40px rgb(212 175 55 / 0.25)',
          }}
        >
          {/* vertical ribbon */}
          <span className="absolute inset-y-0 left-1/2 w-[16%] -translate-x-1/2 bg-gradient-to-b from-[#f6dc7e] via-gold to-[#8a6d12] opacity-90" />
          {/* glowing emblem */}
          <span className="absolute left-1/2 top-1/2 grid size-[42%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-gold/70 bg-obsidian/85 shadow-[0_0_30px_rgb(212_175_55/0.6)]">
            <motion.span
              className="grid place-items-center"
              animate={reduce ? {} : { scale: [1, 1.12, 1], filter: ['drop-shadow(0 0 4px #D4AF37)', 'drop-shadow(0 0 14px #D4AF37)', 'drop-shadow(0 0 4px #D4AF37)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Gift className="size-[70%] min-h-8 min-w-8 text-gold" strokeWidth={1.6} />
            </motion.span>
          </span>
          {/* edge light */}
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#fff3c4] to-transparent" />
        </span>

        {/* lid */}
        <motion.span
          aria-hidden
          className="absolute inset-x-0 top-[16%] h-[18%] rounded-lg border border-gold/70"
          style={{
            background: 'linear-gradient(180deg, #2a3248 0%, #151B28 100%)',
            boxShadow: '0 8px 24px rgb(0 0 0 / 0.5), 0 0 24px rgb(212 175 55 / 0.35)',
          }}
          animate={state === 'open' ? { y: -200, x: 40, rotate: 28, opacity: 0 } : { y: 0, x: 0, rotate: 0, opacity: 1 }}
          transition={state === 'open' ? { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } : { duration: 0.3 }}
        >
          <span className="absolute inset-y-0 left-1/2 w-[16%] -translate-x-1/2 bg-gradient-to-b from-[#f6dc7e] to-gold" />
          {/* bow */}
          <svg viewBox="0 0 100 40" className="absolute -top-[85%] left-1/2 w-[46%] -translate-x-1/2" fill="none">
            <path d="M50 38 C 30 0, 2 8, 18 30 C 26 40, 44 38, 50 38Z" fill="#D4AF37" stroke="#fff3c4" strokeWidth="1.5" />
            <path d="M50 38 C 70 0, 98 8, 82 30 C 74 40, 56 38, 50 38Z" fill="#b8961f" stroke="#fff3c4" strokeWidth="1.5" />
            <circle cx="50" cy="36" r="5" fill="#fff3c4" />
          </svg>
        </motion.span>

        {/* inner light when open */}
        <motion.span
          aria-hidden
          className="absolute inset-x-[8%] top-[18%] h-[30%] rounded-full blur-xl"
          style={{ background: 'radial-gradient(ellipse at bottom, #fff7d6, rgb(212 175 55 / 0.6) 40%, transparent 70%)' }}
          initial={{ opacity: 0, scaleY: 0.4 }}
          animate={state === 'open' ? { opacity: 1, scaleY: 2.4, y: -40 } : { opacity: 0, scaleY: 0.4, y: 0 }}
          transition={{ duration: 0.5 }}
        />
      </motion.button>

      {/* sparks */}
      {state === 'open' &&
        !reduce &&
        sparks.map((s, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute left-1/2 top-1/2 rounded-full bg-[#fff3c4]"
            style={{ width: s.s, height: s.s, boxShadow: '0 0 10px #D4AF37' }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: s.x, y: s.y, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ))}
    </div>
  )
}
