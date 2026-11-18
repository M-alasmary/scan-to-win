import { ArrowLeft, ArrowRight, FastForward, ShieldCheck, TriangleAlert } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useLang } from '../lib/i18n'
import { sound } from '../lib/sound'

const TOTAL_MS = 2900

export function Trap({ onNext }: { onNext: () => void }) {
  const { t, lang } = useLang()
  const reduce = useReducedMotion()
  const [instant, setInstant] = useState(!!reduce)
  const [done, setDone] = useState(!!reduce)

  useEffect(() => {
    if (instant) return
    const id = window.setTimeout(() => setDone(true), TOTAL_MS)
    return () => clearTimeout(id)
  }, [instant])

  const d = (s: number) => (instant ? 0 : s)
  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 14, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { delay: d(delay), duration: instant ? 0.15 : 0.6, ease: [0.2, 0.8, 0.2, 1] as const },
  })

  const primary = lang === 'ar' ? 'لقد وقعت في الفخ!' : "YOU'VE FALLEN INTO THE TRAP!"
  const secondary = lang === 'ar' ? "YOU'VE FALLEN INTO THE TRAP!" : 'لقد وقعت في الفخ!'
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight

  return (
    <section className="relative flex min-h-[calc(100dvh-5rem)] flex-col items-center pt-4 text-center" aria-labelledby="trap-title" role="alert">
      <AnimatePresence>
        {!done && (
          <motion.button
            type="button"
            onClick={() => {
              setInstant(true)
              setDone(true)
            }}
            exit={{ opacity: 0 }}
            className="absolute end-0 top-0 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-soft/85 backdrop-blur hover:bg-black/60"
          >
            <FastForward className="size-4 rtl:-scale-x-100" aria-hidden />
            {t('تخطي الحركة', 'Skip animation')}
          </motion.button>
        )}
      </AnimatePresence>

      {/* re-mounts on skip so every element jumps straight to its final state */}
      <div key={instant ? 'instant' : 'animated'} className="flex w-full flex-col items-center">
      <motion.div
        initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14, delay: d(0.05) }}
        className="alarm-pulse mt-10 grid size-24 place-items-center rounded-full border-2 border-threat bg-threat/15"
      >
        <TriangleAlert className="size-12 text-threat" strokeWidth={2.2} aria-hidden />
      </motion.div>

      <motion.p {...reveal(0.2)} className="mt-5 font-en text-[11px] font-bold tracking-[0.35em] rtl:tracking-normal text-threat">
        {t('تنبيه توعوي', 'AWARENESS ALERT')} · SECURITY CHECK
      </motion.p>

      <motion.h1
        id="trap-title"
        initial={{ opacity: 0, scale: 1.25, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ delay: d(0.3), duration: instant ? 0.15 : 0.5, ease: 'easeOut' }}
        className="mt-3 text-[clamp(2rem,9.5vw,4rem)] font-black leading-[1.1] text-threat drop-shadow-[0_0_24px_rgb(239_51_64/0.6)]"
      >
        <span className="glitch" data-text={primary}>
          {primary}
        </span>
      </motion.h1>
      <motion.p {...reveal(0.7)} lang={lang === 'ar' ? 'en' : 'ar'} dir={lang === 'ar' ? 'ltr' : 'rtl'} className={`mt-2 text-lg font-bold text-soft/60 ${lang === 'ar' ? 'font-en' : 'font-ar'}`}>
        {secondary}
      </motion.p>

      <motion.p {...reveal(1.1)} className="mt-6 max-w-xl text-[17px] leading-loose text-soft/90">
        {t(
          'انجذبت إلى فرصة الفوز بجائزة، وفتحت رابطًا دون التحقق من مصدره. هذه إحدى الطرق التي يستغل بها المحتالون الفضول والحماس لتنفيذ هجمات التصيّد الإلكتروني.',
          'You were drawn in by the chance to win a prize and opened a link without verifying its source. This is one of the ways scammers exploit curiosity and excitement to carry out phishing attacks.',
        )}
      </motion.p>

      <motion.div
        {...reveal(1.9)}
        className="mt-7 flex w-full max-w-xl items-start gap-3 rounded-2xl border border-electric/35 bg-electric/[0.07] p-4 text-start"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-electric/15">
          <ShieldCheck className="size-6 text-electric" aria-hidden />
        </span>
        <div>
          <p className="font-bold text-electric">{t('اطمئن، أنت بأمان', 'Relax — you are safe')}</p>
          <p className="mt-1 text-[15px] leading-relaxed text-soft/85">
            {t(
              'هذه تجربة توعوية آمنة. لم يتم اختراق جهازك أو الوصول إلى بياناتك، ولا توجد جائزة فعلية.',
              'This is a safe awareness experience. Your device was not hacked, your data was not accessed, and there is no actual prize.',
            )}
          </p>
        </div>
      </motion.div>

      <motion.button
        {...reveal(2.5)}
        type="button"
        onClick={() => {
          sound.play('whoosh')
          onNext()
        }}
        whileTap={{ scale: 0.97 }}
        className="mt-8 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-threat px-6 py-4 text-lg font-bold text-white shadow-[0_10px_40px_rgb(239_51_64/0.45)] hover:brightness-110"
      >
        {t('كيف يعمل هذا الهجوم؟', 'How does this attack work?')}
        <Arrow className="size-5" aria-hidden />
      </motion.button>
      </div>
    </section>
  )
}
