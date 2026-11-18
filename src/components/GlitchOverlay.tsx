import { AnimatePresence, motion } from 'motion/react'
import { useMemo } from 'react'

/** Full-screen flash + horizontal glitch bars used for the bait → trap cut. */
export function GlitchOverlay({ active }: { active: boolean }) {
  const bars = useMemo(
    () =>
      Array.from({ length: 10 }, () => ({
        top: Math.random() * 100,
        h: Math.random() * 7 + 1.5,
        x: (Math.random() - 0.5) * 60,
        d: Math.random() * 0.25,
        c: Math.random() > 0.65 ? '#00D9FF' : '#EF3340',
      })),
    [active],
  )

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="glitch"
          className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
          aria-hidden
        >
          <motion.div
            className="absolute inset-0"
            initial={{ background: '#fff7d6', opacity: 1 }}
            animate={{ background: ['#fff7d6', '#EF3340', '#080B12'], opacity: [1, 0.9, 0.0] }}
            transition={{ duration: 0.75, times: [0, 0.35, 1] }}
          />
          {bars.map((b, i) => (
            <motion.div
              key={i}
              className="absolute inset-x-0"
              style={{ top: `${b.top}%`, height: `${b.h}%`, background: b.c, mixBlendMode: 'screen' }}
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: [0, b.x, -b.x / 2, 0], opacity: [0, 0.9, 0.6, 0] }}
              transition={{ duration: 0.5, delay: b.d }}
            />
          ))}
          <div className="scanlines absolute inset-0 opacity-60" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
