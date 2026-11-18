import { Check, Lightbulb, RotateCcw, ShieldCheck, ShieldHalf, ShieldAlert, X } from 'lucide-react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { PRO_TIPS, TOPIC_TIPS, type Answer } from '../data/quiz'
import { useLang, type L } from '../lib/i18n'
import { sound } from '../lib/sound'

export function Result({ answers, onRestart }: { answers: Answer[]; onRestart: () => void }) {
  const { t, lang } = useLang()
  const reduce = useReducedMotion()
  const total = answers.length || 3
  const correct = answers.filter((a) => a.correct).length
  const score = Math.round((correct / total) * 100)

  const mv = useMotionValue(0)
  const shown = useTransform(mv, (v) => Math.round(v))
  useEffect(() => {
    const c = animate(mv, score, { duration: reduce ? 0 : 1.4, ease: 'easeOut' })
    if (score === 100) window.setTimeout(() => sound.play('burst'), 900)
    return () => c.stop()
  }, [score, mv, reduce])

  const R = 54
  const C = 2 * Math.PI * R
  const color = score === 100 ? '#00D9FF' : score >= 66 ? '#D4AF37' : '#EF3340'

  const rank: { icon: typeof ShieldCheck; title: L; body: L } =
    score === 100
      ? {
          icon: ShieldCheck,
          title: { ar: 'حارس رقمي', en: 'Cyber Guardian' },
          body: { ar: 'قراراتك ممتازة. لكن تذكّر: الحماس قد يخدع حتى الحذرين — كما حدث قبل قليل.', en: 'Excellent decisions. But remember: excitement can fool even careful people — as it did a moment ago.' },
        }
      : score >= 66
        ? {
            icon: ShieldHalf,
            title: { ar: 'يقِظ… تقريبًا', en: 'Almost Alert' },
            body: { ar: 'وعي جيد، مع نقطة واحدة تستحق الانتباه. المحتال يحتاج خطأً واحدًا فقط.', en: 'Good awareness, with one blind spot. A scammer only needs one mistake.' },
          }
        : {
            icon: ShieldAlert,
            title: { ar: 'هدف سهل للمحتالين', en: 'Easy Target' },
            body: { ar: 'لا بأس — لهذا نحن هنا. راجع النصائح أدناه، فهي تحميك من أشهر الحيل.', en: "That's okay — that's why we're here. Review the tips below; they protect against the most common tricks." },
          }

  const wrongTopics = [...new Set(answers.filter((a) => !a.correct).map((a) => a.question.topic))]
  const tips: L[] = wrongTopics.length ? [...wrongTopics.map((tp) => TOPIC_TIPS[tp]), PRO_TIPS[2]] : PRO_TIPS
  const RankIcon = rank.icon

  return (
    <section className="mx-auto max-w-2xl pt-4 text-center" aria-labelledby="result-title">
      <p className="font-en text-[11px] font-bold tracking-[0.35em] rtl:tracking-normal text-electric">{t('المرحلة 4 من 4', 'STEP 4 OF 4')}</p>
      <h1 id="result-title" className="mt-2 text-[clamp(1.6rem,6vw,2.4rem)] font-black">
        {t('نتيجة وعيك السيبراني', 'Your Cyber Awareness Score')}
      </h1>

      <div className="relative mx-auto mt-6 size-48">
        <svg viewBox="0 0 128 128" className="size-full -rotate-90" aria-hidden>
          <circle cx="64" cy="64" r={R} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="10" />
          <motion.circle
            cx="64"
            cy="64"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: C * (1 - score / 100) }}
            transition={{ duration: reduce ? 0 : 1.4, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 grid place-content-center">
          <p className="font-en text-5xl font-bold tabular-nums" style={{ color }} aria-label={`${score}%`}>
            <motion.span>{shown}</motion.span>
            <span className="text-2xl">%</span>
          </p>
        </div>
      </div>

      <div className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5" style={{ borderColor: `${color}66`, background: `${color}14` }}>
        <RankIcon className="size-5" style={{ color }} aria-hidden />
        <span className="font-bold" style={{ color }}>
          {t(rank.title)}
        </span>
      </div>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-soft/80">{t(rank.body)}</p>

      <div className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-3">
        <div className="rounded-2xl border border-electric/30 bg-electric/[0.06] p-3">
          <p className="font-en text-3xl font-bold text-electric">{correct}</p>
          <p className="text-sm text-soft/70">{t('قرارات صحيحة', 'Correct decisions')}</p>
        </div>
        <div className="rounded-2xl border border-threat/30 bg-threat/[0.06] p-3">
          <p className="font-en text-3xl font-bold text-threat">{total - correct}</p>
          <p className="text-sm text-soft/70">{t('قرارات خاطئة', 'Risky decisions')}</p>
        </div>
      </div>

      <ul className="mx-auto mt-4 max-w-xl space-y-2 text-start">
        {answers.map((a, i) => (
          <motion.li
            key={a.question.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="glass flex items-center gap-3 rounded-xl px-3.5 py-2.5"
          >
            <span className={`grid size-7 shrink-0 place-items-center rounded-full ${a.correct ? 'bg-electric/15 text-electric' : 'bg-threat/15 text-threat'}`}>
              {a.correct ? <Check className="size-4" aria-hidden /> : <X className="size-4" aria-hidden />}
            </span>
            <span className="text-[15px]">{t(a.question.title)}</span>
            <span className={`ms-auto text-xs font-bold ${a.correct ? 'text-electric' : 'text-threat'}`}>{a.correct ? t('آمن', 'Safe') : t('خطر', 'Risky')}</span>
          </motion.li>
        ))}
      </ul>

      <div className="mx-auto mt-8 max-w-xl text-start">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Lightbulb className="size-5 text-gold" aria-hidden />
          {wrongTopics.length ? t('نصائح مخصّصة لك', 'Tips picked for you') : t('نصائح للمستوى المتقدّم', 'Pro-level tips')}
        </h2>
        <ul className="mt-3 space-y-2">
          {tips.map((tip, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: lang === 'ar' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="flex gap-3 rounded-xl border border-gold/20 bg-gold/[0.04] p-3 text-[15px] leading-relaxed text-soft/90"
            >
              <span className="font-en font-bold text-gold">{String(i + 1).padStart(2, '0')}</span>
              {t(tip)}
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.blockquote
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: reduce ? 0 : 1.1, duration: 0.6 }}
        className="relative mx-auto mt-10 max-w-xl overflow-hidden rounded-3xl border border-threat/30 p-6"
        style={{ background: 'linear-gradient(160deg, rgb(239 51 64 / 0.14), rgb(0 217 255 / 0.06))' }}
      >
        <p lang="en" className="font-en text-[clamp(1.05rem,4.4vw,1.45rem)] font-bold leading-snug tracking-wide text-soft" dir="ltr">
          IF A PRIZE LOOKS TOO GOOD TO BE TRUE, <span className="text-threat">THINK BEFORE YOU SCAN.</span>
        </p>
        <p lang="ar" dir="rtl" className="mt-3 font-ar text-[clamp(1.1rem,4.8vw,1.5rem)] font-black leading-relaxed text-gold">
          «مو كل جائزة تستاهل تخاطر ببياناتك عشانها.»
        </p>
      </motion.blockquote>

      <motion.button
        type="button"
        onClick={() => {
          sound.play('tap')
          onRestart()
        }}
        whileTap={{ scale: 0.97 }}
        className="mx-auto mt-8 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-4 text-lg font-bold hover:bg-white/10"
      >
        <RotateCcw className="size-5" aria-hidden />
        {t('أعد التجربة', 'Restart experience')}
      </motion.button>
      <p className="mt-4 text-xs text-soft/45">{t('تجربة توعوية — بلا جوائز، بلا حسابات، بلا تسجيل، وبلا جمع لأي بيانات.', 'Awareness experience — no prizes, no accounts, no registration, no data collected.')}</p>
    </section>
  )
}
