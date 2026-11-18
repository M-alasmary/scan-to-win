import { FastForward, Gamepad2, Headphones, Sparkles, Tablet, Timer, Users, Watch } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { MysteryBox, type BoxState } from '../components/MysteryBox'
import { useLang } from '../lib/i18n'
import { sound } from '../lib/sound'

export function Bait({ onTrap }: { onTrap: () => void }) {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const [state, setState] = useState<BoxState>('idle')
  const [secs, setSecs] = useState(4 * 60 + 59)
  const [claimed, setClaimed] = useState(1284)
  const timers = useRef<number[]>([])
  const fired = useRef(false)

  // Fake urgency + fake social proof — deliberate manipulation tactics, explained later.
  useEffect(() => {
    const id = window.setInterval(() => {
      setSecs((s) => (s > 0 ? s - 1 : 4 * 60 + 59))
      if (Math.random() > 0.6) setClaimed((c) => c + 1)
    }, 1000)
    return () => {
      clearInterval(id)
      timers.current.forEach(clearTimeout)
    }
  }, [])

  const finish = () => {
    if (fired.current) return
    fired.current = true
    timers.current.forEach(clearTimeout)
    onTrap()
  }

  const reveal = () => {
    if (state !== 'idle') return
    sound.play('charge')
    navigator.vibrate?.(30)
    setState('charging')
    const charge = reduce ? 250 : 1250
    const open = reduce ? 250 : 800
    timers.current.push(
      window.setTimeout(() => {
        setState('open')
        sound.play('burst')
      }, charge),
    )
    timers.current.push(window.setTimeout(finish, charge + open))
  }

  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')
  const busy = state !== 'idle'

  const prizes = [
    { icon: Headphones, l: t('سماعات لاسلكية', 'Wireless earbuds') },
    { icon: Watch, l: t('ساعة ذكية', 'Smartwatch') },
    { icon: Tablet, l: t('جهاز لوحي', 'Tablet') },
    { icon: Gamepad2, l: t('جهاز ألعاب', 'Game console') },
  ]

  return (
    <section className="flex min-h-[calc(100dvh-5rem)] flex-col items-center pt-2 text-center" aria-labelledby="bait-title">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gold"
      >
        <Sparkles className="size-3.5" aria-hidden />
        {t('مبروك! تم اختيارك', 'Congratulations! You’ve been selected')}
      </motion.div>

      <h1 id="bait-title" className="mt-4 text-[clamp(2rem,9vw,3.6rem)] font-black leading-[1.1]">
        <span className="text-gold-gradient">{t('امسح واكتشف جائزتك!', 'YOUR NEXT SCAN COULD WIN!')}</span>
      </h1>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-soft/75">
        {t('فرصة حصرية للفوز بجائزة تقنية فاخرة بانتظارك داخل الصندوق.', 'An exclusive chance to win a premium tech prize is waiting inside the box.')}
      </p>

      <div className="relative my-3 w-full">
        <MysteryBox state={state} onActivate={reveal} label={t('اكشف جائزتي', 'Reveal my prize')} />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 text-xs" aria-live="off">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-threat/40 bg-threat/10 px-3 py-1.5 font-semibold text-[#ff8a93]">
          <Timer className="size-3.5" aria-hidden />
          {t('ينتهي العرض خلال', 'Offer ends in')} <span className="font-en tabular-nums" dir="ltr">{mm}:{ss}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-soft/75">
          <Users className="size-3.5" aria-hidden />
          <span className="font-en tabular-nums">{claimed.toLocaleString('en-US')}</span> {t('زائر كشفوا جوائزهم اليوم', 'visitors revealed a prize today')}
        </span>
      </div>

      <div className="mt-6 w-full max-w-sm">
        <motion.button
          type="button"
          onClick={reveal}
          disabled={busy}
          className="shimmer relative w-full rounded-2xl px-6 py-4 text-lg font-black tracking-wide text-obsidian shadow-[0_10px_40px_rgb(212_175_55/0.45)] disabled:opacity-80"
          style={{ background: 'linear-gradient(180deg, #f6dc7e 0%, #D4AF37 55%, #a8871c 100%)' }}
          whileTap={{ scale: 0.97 }}
          animate={busy || reduce ? {} : { scale: [1, 1.03, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          {busy ? t('جارٍ فتح صندوقك…', 'Unlocking your box…') : t('اكشف جائزتي', 'REVEAL MY PRIZE')}
        </motion.button>
        <AnimatePresence>
          {busy && (
            <motion.button
              type="button"
              onClick={finish}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-soft/70 underline-offset-4 hover:text-soft hover:underline"
            >
              <FastForward className="size-4 rtl:-scale-x-100" aria-hidden />
              {t('تخطي الحركة', 'Skip animation')}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 w-full max-w-md">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold/70">{t('جوائز محتملة', 'Possible prizes')}</p>
        <ul className="grid grid-cols-4 gap-2">
          {prizes.map(({ icon: Icon, l }, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="glass flex flex-col items-center gap-1.5 rounded-xl px-1 py-3"
            >
              <Icon className="size-6 text-gold" strokeWidth={1.6} aria-hidden />
              <span className="text-[11px] leading-tight text-soft/80">{l}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
