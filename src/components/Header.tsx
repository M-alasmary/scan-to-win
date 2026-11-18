import { Gift, ShieldAlert, Volume2, VolumeX } from 'lucide-react'
import { motion } from 'motion/react'
import { useLang } from '../lib/i18n'
import type { Stage } from '../App'

const STEPS: Stage[] = ['trap', 'attack', 'quiz', 'result']

export function Header({ stage, soundOn, onSound }: { stage: Stage; soundOn: boolean; onSound: () => void }) {
  const { t, toggle, lang } = useLang()
  const bait = stage === 'bait'
  const stepIndex = STEPS.indexOf(stage)

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-obsidian/70 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="grid size-9 shrink-0 place-items-center rounded-xl border"
            style={{ borderColor: 'rgb(var(--accent-rgb) / 0.45)', background: 'rgb(var(--accent-rgb) / 0.1)' }}
          >
            {bait ? <Gift className="size-5 text-gold" aria-hidden /> : <ShieldAlert className="size-5" style={{ color: 'var(--accent)' }} aria-hidden />}
          </span>
          <div className="min-w-0 leading-tight">
            <div className="font-en text-[13px] font-bold tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
              {bait ? 'SCAN TO WIN' : 'THE TRAP'}
            </div>
            <div className="truncate text-[11px] text-soft/55">{bait ? t('حملة الجوائز التقنية', 'Tech Prize Campaign') : t('تجربة توعوية آمنة', 'Safe awareness experience')}</div>
          </div>
        </div>

        {!bait && (
          <ol className="mx-auto hidden items-center gap-1.5 sm:flex" aria-label={t('مراحل التجربة', 'Experience steps')}>
            {STEPS.map((s, i) => (
              <li key={s}>
                <motion.span
                  layout
                  className="block h-1.5 rounded-full"
                  style={{ width: i === stepIndex ? 28 : 10, background: i <= stepIndex ? 'var(--accent)' : 'rgb(255 255 255 / 0.15)' }}
                  aria-current={i === stepIndex ? 'step' : undefined}
                />
              </li>
            ))}
          </ol>
        )}

        <div className="ms-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? t('إيقاف المؤثرات الصوتية', 'Turn sound effects off') : t('تشغيل المؤثرات الصوتية', 'Turn sound effects on')}
            className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-soft/80 transition hover:bg-white/10 active:scale-95"
          >
            {soundOn ? <Volume2 className="size-[18px]" aria-hidden /> : <VolumeX className="size-[18px]" aria-hidden />}
          </button>
          <button
            type="button"
            onClick={toggle}
            lang={lang === 'ar' ? 'en' : 'ar'}
            aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            className="h-10 min-w-12 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-bold text-soft transition hover:bg-white/10 active:scale-95"
          >
            {lang === 'ar' ? <span className="font-en">EN</span> : <span className="font-ar">عربي</span>}
          </button>
        </div>
      </div>
      {!bait && (
        <div className="h-0.5 w-full bg-white/5 sm:hidden" aria-hidden>
          <motion.div
            className="h-full"
            style={{ background: 'var(--accent)', originX: lang === 'ar' ? 1 : 0 }}
            animate={{ scaleX: (stepIndex + 1) / STEPS.length }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      )}
    </header>
  )
}
