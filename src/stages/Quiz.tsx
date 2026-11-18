import {
  ArrowLeft,
  ArrowRight,
  AppWindow,
  Check,
  Globe,
  Lightbulb,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  QrCode,
  AtSign,
  X,
  type LucideIcon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { Answer, Channel, Question } from '../data/quiz'
import { useLang, type L } from '../lib/i18n'
import { sound } from '../lib/sound'

const CHANNEL: Record<Channel, { icon: LucideIcon; label: L; tint: string }> = {
  sms: { icon: MessageSquare, label: { ar: 'رسالة نصية', en: 'SMS' }, tint: '#00D9FF' },
  whatsapp: { icon: MessageCircle, label: { ar: 'رسالة دردشة', en: 'Chat message' }, tint: '#3ddc84' },
  email: { icon: Mail, label: { ar: 'بريد إلكتروني', en: 'Email' }, tint: '#9aa8ff' },
  qr: { icon: QrCode, label: { ar: 'رمز QR', en: 'QR code' }, tint: '#D4AF37' },
  web: { icon: Globe, label: { ar: 'موقع إلكتروني', en: 'Website' }, tint: '#00D9FF' },
  call: { icon: Phone, label: { ar: 'مكالمة هاتفية', en: 'Phone call' }, tint: '#ff9f43' },
  social: { icon: AtSign, label: { ar: 'تواصل اجتماعي', en: 'Social media' }, tint: '#ff6bcb' },
  app: { icon: AppWindow, label: { ar: 'تطبيق', en: 'App' }, tint: '#c38bff' },
}

export function Quiz({ questions, onDone }: { questions: Question[]; onDone: (a: Answer[]) => void }) {
  const { t, lang } = useLang()
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const feedbackRef = useRef<HTMLDivElement>(null)

  const q = questions[index]
  const ch = CHANNEL[q.channel]
  const ChIcon = ch.icon
  const answered = choice !== null
  const isCorrect = answered && !!q.options[choice].correct
  const last = index === questions.length - 1
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight

  useEffect(() => {
    if (answered) feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [answered])

  const pick = (i: number) => {
    if (answered) return
    const correct = !!q.options[i].correct
    setChoice(i)
    setAnswers((a) => [...a, { question: q, choice: i, correct }])
    sound.play(correct ? 'correct' : 'wrong')
    navigator.vibrate?.(correct ? 20 : [40, 30, 40])
  }

  const next = () => {
    sound.play('whoosh')
    if (last) return onDone(answers)
    setIndex(index + 1)
    setChoice(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="mx-auto max-w-2xl pt-4" aria-labelledby="quiz-title">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-en text-[11px] font-bold tracking-[0.35em] rtl:tracking-normal text-electric">{t('المرحلة 3 من 4', 'STEP 3 OF 4')}</p>
          <h1 id="quiz-title" className="mt-1 text-2xl font-black">
            {t('تحدّي الوعي السيبراني', 'Cyber Awareness Challenge')}
          </h1>
        </div>
        <div className="flex items-center gap-1.5" aria-label={t(`السؤال ${index + 1} من ${questions.length}`, `Question ${index + 1} of ${questions.length}`)}>
          {questions.map((_, i) => {
            const a = answers[i]
            return (
              <span
                key={i}
                className={`grid size-8 place-items-center rounded-full border font-en text-xs font-bold ${
                  a ? (a.correct ? 'border-electric bg-electric/15 text-electric' : 'border-threat bg-threat/15 text-threat') : i === index ? 'border-soft/60 text-soft' : 'border-white/10 text-soft/40'
                }`}
              >
                {a ? a.correct ? <Check className="size-4" /> : <X className="size-4" /> : i + 1}
              </span>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: lang === 'ar' ? -40 : 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: lang === 'ar' ? 40 : -40 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-5"
        >
          {/* scenario card */}
          <div className="glass overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2.5 border-b border-white/[0.07] px-4 py-3">
              <span className="grid size-9 place-items-center rounded-full" style={{ background: `${ch.tint}22` }}>
                <ChIcon className="size-[18px]" style={{ color: ch.tint }} aria-hidden />
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-bold" dir="auto">
                  {t(q.sender)}
                </p>
                <p className="text-[11px] text-soft/50">
                  {t(ch.label)} · {t(q.title)}
                </p>
              </div>
              <span className="ms-auto shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-soft/50">{t('سيناريو خيالي', 'Fictional')}</span>
            </div>
            <div className="p-4">
              <div className="rounded-2xl rounded-ss-sm bg-white/[0.06] p-3.5 text-[15px] leading-relaxed text-soft/90">
                {t(q.message)}
                {q.link && (
                  <span dir="ltr" className="mt-1.5 block break-all font-mono text-[13px] text-electric underline decoration-threat decoration-wavy underline-offset-4" aria-label={t('رابط مشبوه غير قابل للنقر', 'Suspicious, non-clickable link')}>
                    {q.link}
                  </span>
                )}
              </div>
            </div>
          </div>

          <h2 className="mt-5 text-lg font-bold">{t(q.question)}</h2>
          <ul className="mt-3 space-y-2.5">
            {q.options.map((o, i) => {
              const chosen = choice === i
              const reveal = answered && (o.correct || chosen)
              const good = !!o.correct
              return (
                <li key={i}>
                  <motion.button
                    type="button"
                    onClick={() => pick(i)}
                    disabled={answered}
                    whileTap={!answered ? { scale: 0.98 } : undefined}
                    animate={chosen && !good ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-start text-[15px] leading-snug transition-colors ${
                      reveal
                        ? good
                          ? 'border-electric bg-electric/10'
                          : 'border-threat bg-threat/10'
                        : answered
                          ? 'border-white/5 bg-white/[0.02] opacity-50'
                          : 'border-white/10 bg-white/[0.04] hover:border-electric/50 hover:bg-electric/5'
                    }`}
                  >
                    <span
                      className={`grid size-7 shrink-0 place-items-center rounded-lg font-en text-xs font-bold ${
                        reveal ? (good ? 'bg-electric text-obsidian' : 'bg-threat text-white') : 'bg-white/10 text-soft/70'
                      }`}
                    >
                      {reveal ? good ? <Check className="size-4" /> : <X className="size-4" /> : String.fromCharCode(65 + i)}
                    </span>
                    <span>{t(o.text)}</span>
                  </motion.button>
                </li>
              )
            })}
          </ul>

          <AnimatePresence>
            {answered && (
              <motion.div
                ref={feedbackRef}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 rounded-2xl border p-4 ${isCorrect ? 'border-electric/40 bg-electric/[0.07]' : 'border-threat/40 bg-threat/[0.07]'}`}
                role="status"
              >
                <p className={`text-base font-black ${isCorrect ? 'text-electric' : 'text-threat'}`}>
                  {isCorrect ? t('قرار ذكي! ✓', 'Smart call! ✓') : t('كاد أن يكون فخًا آخر!', 'That would be another trap!')}
                </p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-soft/90">{t(q.explain)}</p>
                <p className="mt-3 flex items-start gap-2 rounded-xl bg-black/25 p-3 text-sm leading-relaxed text-soft/90">
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                  {t(q.tip)}
                </p>
                <motion.button
                  type="button"
                  onClick={next}
                  whileTap={{ scale: 0.97 }}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-electric px-5 py-3.5 font-bold text-obsidian hover:brightness-110"
                >
                  {last ? t('اعرض نتيجتي', 'See my result') : t('السؤال التالي', 'Next question')}
                  <Arrow className="size-5" aria-hidden />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
