import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  DatabaseZap,
  Download,
  Gift,
  Globe,
  Info,
  KeyRound,
  MapPin,
  MessageSquare,
  QrCode,
  ShieldQuestion,
  Users,
  VenetianMask,
  type LucideIcon,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { useLang, type L } from '../lib/i18n'
import { sound } from '../lib/sound'

type Node = { icon: LucideIcon; title: L; desc: L; danger: number }

const NODES: Node[] = [
  { icon: Gift, danger: 0, title: { ar: 'جائزة مغرية', en: 'Attractive prize' }, desc: { ar: 'وعد بمكافأة يثير الحماس ويُضعف الحذر.', en: 'A promised reward sparks excitement and lowers your guard.' } },
  { icon: QrCode, danger: 1, title: { ar: 'رمز QR', en: 'QR code' }, desc: { ar: 'يخفي الرابط الحقيقي، فلا ترى وجهتك قبل المسح.', en: "Hides the real link — you can't see where it leads before scanning." } },
  { icon: Globe, danger: 2, title: { ar: 'موقع مجهول', en: 'Unknown website' }, desc: { ar: 'صفحة تبدو احترافية لكن مصدرها غير موثوق.', en: 'A polished page from an unverified source.' } },
  { icon: VenetianMask, danger: 3, title: { ar: 'هندسة اجتماعية', en: 'Social engineering' }, desc: { ar: 'تهنئة واستعجال وضغط نفسي لدفعك لقرار سريع.', en: 'Flattery, urgency and pressure push you to act fast.' } },
  { icon: DatabaseZap, danger: 4, title: { ar: 'سرقة بيانات محتملة', en: 'Potential data theft' }, desc: { ar: 'إن أدخلت بياناتك أو ثبّتّ تطبيقًا، قد تُسرق معلوماتك أو أموالك.', en: 'If you enter details or install an app, your data or money may be stolen.' } },
]

const nodeColor = (danger: number) => ['#D4AF37', '#e8a03a', '#f27a3d', '#f2533f', '#EF3340'][danger]

export function Attack({ onNext }: { onNext: () => void }) {
  const { t, lang } = useLang()
  const [step, setStep] = useState<0 | 1>(0)
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight

  return (
    <section className="pt-4" aria-labelledby="attack-title">
      <p className="text-center font-en text-[11px] font-bold tracking-[0.35em] rtl:tracking-normal text-electric">{t('المرحلة 2 من 4', 'STEP 2 OF 4')}</p>
      <h1 id="attack-title" className="mt-2 text-center text-[clamp(1.6rem,6vw,2.6rem)] font-black leading-tight">
        {step === 0 ? t('كيف يعمل الهجوم؟', 'How the attack works') : t('ماذا سيطلب المهاجم بعد ذلك؟', 'What would a real attacker ask next?')}
      </h1>

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div key="flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: lang === 'ar' ? 30 : -30 }}>
            <Flow />
            <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-2xl border border-electric/30 bg-electric/[0.06] p-4">
              <Info className="mt-0.5 size-5 shrink-0 text-electric" aria-hidden />
              <p className="text-[15px] leading-relaxed text-soft/90">
                <strong className="text-electric">{t('معلومة مهمة: ', 'Good to know: ')}</strong>
                {t(
                  'فتح الموقع وحده لا يعني بالضرورة أنه تم اختراقك. الخطر الحقيقي يبدأ عندما يطلب منك الموقع خطوة تالية… وتنفّذها.',
                  "Opening a website does not automatically mean you've been compromised. The real danger begins when the site asks for a next step — and you take it.",
                )}
              </p>
            </div>
            <NextButton
              onClick={() => {
                sound.play('whoosh')
                setStep(1)
                window.scrollTo({ top: 0 })
              }}
            >
              {t('ماذا سيطلب المهاجم؟', 'What would they ask for?')} <Arrow className="size-5" aria-hidden />
            </NextButton>
          </motion.div>
        ) : (
          <motion.div key="asks" initial={{ opacity: 0, x: lang === 'ar' ? -30 : 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <Asks />
            <Tactics />
            <NextButton
              onClick={() => {
                sound.play('whoosh')
                onNext()
              }}
            >
              {t('اختبر وعيك الآن', 'Test your awareness')} <Arrow className="size-5" aria-hidden />
            </NextButton>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function NextButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <div className="mt-8 flex justify-center">
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.97 }}
        className="inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-electric px-6 py-4 text-lg font-bold text-obsidian shadow-[0_10px_40px_rgb(0_217_255/0.35)] hover:brightness-110"
      >
        {children}
      </motion.button>
    </div>
  )
}

/* ---------------- Attack-chain diagram ---------------- */

function Flow() {
  const { t, lang } = useLang()
  const reduce = useReducedMotion()
  const [active, setActive] = useState(reduce ? NODES.length - 1 : 0)
  const [auto, setAuto] = useState(!reduce)

  useEffect(() => {
    if (!auto) return
    if (active >= NODES.length - 1) {
      setAuto(false)
      return
    }
    const id = window.setTimeout(() => {
      setActive((a) => a + 1)
      sound.play('tick')
    }, 900)
    return () => clearTimeout(id)
  }, [active, auto])

  const current = NODES[active]
  const frac = active / (NODES.length - 1)

  return (
    <div className="mx-auto mt-6 max-w-4xl">
      <ol className="relative grid grid-cols-1 gap-3 md:grid-cols-5 md:gap-2" aria-label={t('سلسلة الهجوم', 'Attack chain')}>
        {/* connector line (vertical on mobile, horizontal on desktop) */}
        <span aria-hidden className="absolute start-[31px] top-8 bottom-8 w-0.5 bg-white/10 md:hidden" />
        <span aria-hidden className="absolute start-[10%] end-[10%] top-[31px] hidden h-0.5 bg-white/10 md:block" />
        <motion.span
          aria-hidden
          className="absolute start-[31px] top-8 bottom-8 w-0.5 md:hidden"
          style={{ background: 'linear-gradient(#D4AF37, #EF3340)', originY: 0 }}
          animate={{ scaleY: frac }}
          transition={{ duration: 0.6 }}
        />
        <motion.span
          aria-hidden
          className="absolute start-[10%] end-[10%] top-[31px] hidden h-0.5 md:block"
          style={{ background: `linear-gradient(${lang === 'ar' ? 270 : 90}deg, #D4AF37, #EF3340)`, originX: lang === 'ar' ? 1 : 0 }}
          animate={{ scaleX: frac }}
          transition={{ duration: 0.6 }}
        />

        {NODES.map((n, i) => {
          const on = i <= active
          const c = nodeColor(n.danger)
          const Icon = n.icon
          return (
            <li key={i} className="relative">
              <button
                type="button"
                onClick={() => {
                  setAuto(false)
                  setActive(i)
                  sound.play('tap')
                }}
                aria-pressed={i === active}
                className="flex w-full items-center gap-3 rounded-2xl p-1 text-start md:flex-col md:text-center"
              >
                <motion.span
                  className="relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl border-2 bg-obsidian"
                  animate={{
                    borderColor: on ? c : 'rgba(255,255,255,0.12)',
                    boxShadow: i === active ? `0 0 0 6px ${c}22, 0 0 30px ${c}88` : '0 0 0 0 transparent',
                    scale: i === active ? 1.08 : 1,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <Icon className="size-6" style={{ color: on ? c : 'rgba(245,247,250,0.35)' }} aria-hidden />
                  <span className="absolute -top-2 -end-2 grid size-5 place-items-center rounded-full bg-graphite font-en text-[10px] font-bold text-soft/70 ring-1 ring-white/10">
                    {i + 1}
                  </span>
                </motion.span>
                <span className={`text-[15px] font-bold transition-colors md:text-sm ${on ? 'text-soft' : 'text-soft/40'}`}>{t(n.title)}</span>
              </button>
            </li>
          )
        })}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="glass mx-auto mt-5 max-w-2xl rounded-2xl p-4"
          style={{ borderColor: `${nodeColor(current.danger)}55` }}
          aria-live="polite"
        >
          <p className="text-sm font-bold" style={{ color: nodeColor(current.danger) }}>
            {active + 1}. {t(current.title)}
          </p>
          <p className="mt-1 text-[15px] leading-relaxed text-soft/85">{t(current.desc)}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ---------------- Fictional attacker requests ---------------- */

function MockFrame({ children }: { children: ReactNode }) {
  // Pure decoration: no inputs, no forms, not focusable, not selectable.
  return (
    <div aria-hidden className="pointer-events-none relative select-none overflow-hidden rounded-xl border border-white/10 bg-[#0d1220] p-3" dir="ltr">
      <div className="mock-stripe absolute inset-x-0 top-0 py-0.5 text-center font-en text-[9px] font-bold tracking-[0.25em] text-threat">
        FICTIONAL · NON-FUNCTIONAL
      </div>
      <div className="pt-4">{children}</div>
    </div>
  )
}

const bar = 'h-7 rounded-md bg-white/[0.06] border border-white/10 px-2 font-en text-[11px] leading-7 text-soft/50'

function Asks() {
  const { t } = useLang()
  const items: { icon: LucideIcon; title: L; flag: L; mock: ReactNode }[] = [
    {
      icon: KeyRound,
      title: { ar: 'كلمة مرور حسابك', en: 'Your account password' },
      flag: { ar: 'لا تحتاج أي جائزة حقيقية إلى كلمة مرورك.', en: 'No real prize ever needs your password.' },
      mock: (
        <div className="space-y-1.5">
          <p className="font-en text-[11px] font-bold text-soft/80">Sign in to claim your prize</p>
          <div className={bar}>name@example.com</div>
          <div className={bar}>••••••••••</div>
        </div>
      ),
    },
    {
      icon: CreditCard,
      title: { ar: 'بيانات بطاقتك البنكية', en: 'Your bank card details' },
      flag: { ar: 'الرسوم البسيطة طُعم لسرقة بطاقتك بالكامل.', en: 'A tiny “fee” is bait to steal your whole card.' },
      mock: (
        <div className="space-y-1.5">
          <p className="font-en text-[11px] font-bold text-soft/80">Shipping fee: SAR 9.99</p>
          <div className={bar}>•••• •••• •••• ••••</div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className={bar}>MM/YY</div>
            <div className={bar}>CVV</div>
          </div>
        </div>
      ),
    },
    {
      icon: ShieldQuestion,
      title: { ar: 'رمز التحقق (OTP)', en: 'Verification code (OTP)' },
      flag: { ar: 'رمز التحقق مفتاح حسابك. لا تشاركه مع أي جهة.', en: 'An OTP is the key to your account. Never share it.' },
      mock: (
        <div>
          <p className="font-en text-[11px] font-bold text-soft/80">Enter the 6-digit code we sent</p>
          <div className="mt-2 grid grid-cols-6 gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid h-8 place-items-center rounded-md border border-white/10 bg-white/[0.06] font-en text-soft/40">
                –
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: Download,
      title: { ar: 'تحميل تطبيق ضار', en: 'A malicious app download' },
      flag: { ar: 'التطبيقات من خارج المتاجر الرسمية قد تتجسس على جهازك.', en: 'Apps from outside official stores can spy on your device.' },
      mock: (
        <div className="flex items-center gap-2">
          <div className="grid size-10 place-items-center rounded-lg bg-gold/15">
            <Gift className="size-5 text-gold" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-en text-[12px] font-bold text-soft/85">Prize_Claim.apk</p>
            <p className="font-en text-[10px] text-soft/45">4.2 MB · Unknown source</p>
          </div>
          <div className="rounded-md bg-electric/20 px-2 py-1 font-en text-[10px] font-bold text-electric">GET</div>
        </div>
      ),
    },
    {
      icon: MapPin,
      title: { ar: 'صلاحيات غير ضرورية', en: 'Unnecessary permissions' },
      flag: { ar: 'لماذا يحتاج تطبيق جوائز إلى رسائلك وجهات اتصالك؟', en: 'Why would a prize app need your SMS and contacts?' },
      mock: (
        <div>
          <p className="font-en text-[11px] font-bold text-soft/80">Allow “Prize Center” to access:</p>
          <div className="mt-1.5 flex flex-wrap gap-1 font-en text-[10px] text-soft/70">
            {[
              [MessageSquare, 'SMS'],
              [Users, 'Contacts'],
              [MapPin, 'Location'],
            ].map(([I, l]) => {
              const Ic = I as LucideIcon
              return (
                <span key={l as string} className="inline-flex items-center gap-1 rounded bg-white/[0.06] px-1.5 py-1">
                  <Ic className="size-3" /> {l as string}
                </span>
              )
            })}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5 font-en text-[10px] font-bold">
            <div className="rounded-md border border-white/10 py-1 text-center text-soft/50">Deny</div>
            <div className="rounded-md bg-electric/20 py-1 text-center text-electric">Allow</div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="mx-auto mt-3 max-w-4xl">
      <p className="text-center text-sm text-soft/60">
        {t('أمثلة خيالية وغير فعّالة لأغراض التوعية فقط. لا نطلب أو نخزّن أي بيانات.', 'Fictional, non-functional examples for awareness only. We never request or store any data.')}
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => {
          const Icon = it.icon
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="glass rounded-2xl p-3"
            >
              <div className="mb-2.5 flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-threat/15">
                  <Icon className="size-4 text-threat" aria-hidden />
                </span>
                <h2 className="text-[15px] font-bold">{t(it.title)}</h2>
              </div>
              <MockFrame>{it.mock}</MockFrame>
              <p className="mt-2.5 flex gap-1.5 text-[13px] leading-relaxed text-soft/85">
                <span className="text-threat" aria-hidden>
                  ⚑
                </span>
                {t(it.flag)}
              </p>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}

function Tactics() {
  const { t } = useLang()
  const tactics: L[] = [
    { ar: 'كلمة «مبروك» لإثارة الحماس', en: '“Congratulations” to spark excitement' },
    { ar: 'عدّاد تنازلي يدفعك للاستعجال', en: 'A countdown that rushes you' },
    { ar: 'عدد زوّار وهمي يوحي بالثقة', en: 'A fake visitor counter as “proof”' },
    { ar: 'تصميم ذهبي فاخر يبدو رسميًا', en: 'Premium gold design that looks official' },
    { ar: 'رمز QR يخفي الرابط الحقيقي', en: 'A QR code that hides the real link' },
  ]
  return (
    <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-gold/25 bg-gold/[0.05] p-4">
      <h2 className="text-center text-base font-bold text-gold">{t('حيل استخدمناها عليك قبل قليل', 'Tricks we used on you a moment ago')}</h2>
      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {tactics.map((x, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.07 }}
            className="rounded-full border border-gold/30 bg-obsidian/60 px-3 py-1.5 text-[13px] text-soft/85"
          >
            {t(x)}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
