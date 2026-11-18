import type { L } from '../lib/i18n'

// Every scenario, sender, domain and brand below is FICTIONAL.
// Links are displayed as plain text only and are never clickable.

export type Topic =
  | 'prize'
  | 'qr'
  | 'phishing'
  | 'delivery'
  | 'verification'
  | 'download'
  | 'social'
  | 'impersonation'

export type Channel = 'sms' | 'whatsapp' | 'email' | 'qr' | 'web' | 'call' | 'social' | 'app'

export interface Option {
  text: L
  correct?: boolean
}

export interface Question {
  id: string
  topic: Topic
  channel: Channel
  title: L
  sender: L
  message: L
  link?: string
  question: L
  options: Option[]
  explain: L
  tip: L
}

export const QUESTIONS: Question[] = [
  {
    id: 'prize-sms',
    topic: 'prize',
    channel: 'sms',
    title: { ar: 'رسالة فوز مفاجئة', en: 'Surprise win message' },
    sender: { ar: 'NovaMart', en: 'NovaMart' },
    message: {
      ar: 'مبروك! رقمك فاز بهاتف ذكي حديث في سحب الذكرى السنوية. استلم جائزتك خلال 24 ساعة قبل إلغائها:',
      en: 'Congratulations! Your number won a new smartphone in our anniversary draw. Claim within 24 hours or it will be cancelled:',
    },
    link: 'novamart-prize.win/claim',
    question: { ar: 'ما التصرّف الأصح؟', en: 'What is the safest move?' },
    options: [
      { text: { ar: 'أفتح الرابط بسرعة قبل انتهاء المهلة', en: 'Open the link quickly before time runs out' } },
      { text: { ar: 'أتجاهلها، وأتحقق من التطبيق أو الموقع الرسمي للمتجر بنفسي', en: "Ignore it and check the store's official app or website myself" }, correct: true },
      { text: { ar: 'أرد برسالة فيها اسمي لتأكيد الاستلام', en: 'Reply with my name to confirm the prize' } },
    ],
    explain: {
      ar: 'لم تشارك في أي سحب أصلًا. المهلة القصيرة والنطاق الغريب علامتان واضحتان على الاحتيال.',
      en: "You never entered a draw. The short deadline and the odd domain are classic scam signs.",
    },
    tip: { ar: 'لا يمكنك الفوز بمسابقة لم تشارك فيها.', en: "You can't win a contest you never entered." },
  },
  {
    id: 'qr-parking',
    topic: 'qr',
    channel: 'qr',
    title: { ar: 'ملصق QR على عدّاد مواقف', en: 'QR sticker on a parking meter' },
    sender: { ar: 'ملصق على العدّاد', en: 'Sticker on the meter' },
    message: {
      ar: 'ادفع رسوم الموقف بسرعة! امسح الرمز وادفع بالبطاقة خلال ثوانٍ. (الملصق يغطي جزءًا من الرمز الأصلي)',
      en: 'Pay for parking fast! Scan and pay by card in seconds. (The sticker partly covers the original code)',
    },
    question: { ar: 'ماذا تفعل؟', en: 'What do you do?' },
    options: [
      { text: { ar: 'أمسحه وأدفع، فهو على العدّاد الرسمي', en: "Scan and pay — it's on the official meter" } },
      { text: { ar: 'أمسحه، وأدخل بطاقتي فقط إذا بدا الموقع احترافيًا', en: 'Scan it, but only enter my card if the site looks professional' } },
      { text: { ar: 'ألاحظ أنه ملصق فوق رمز آخر، وأدفع عبر التطبيق الرسمي أو الجهاز نفسه', en: "Notice it's stuck over another code and pay via the official app or machine" }, correct: true },
    ],
    explain: {
      ar: 'هذا ما يُسمّى «التصيّد عبر QR». يلصق المحتالون رموزهم فوق الرموز الأصلية في الأماكن العامة.',
      en: 'This is "quishing": scammers stick their own codes over real ones in public places.',
    },
    tip: { ar: 'افحص الرمز قبل المسح، وراجع الرابط الظاهر قبل فتحه.', en: 'Inspect the code before scanning and preview the link before opening it.' },
  },
  {
    id: 'phish-domain',
    topic: 'phishing',
    channel: 'web',
    title: { ar: 'صفحة تسجيل دخول لاستلام جائزة', en: 'Login page to claim a prize' },
    sender: { ar: 'متصفح الجوال', en: 'Mobile browser' },
    message: {
      ar: 'سجّل الدخول ببريدك وكلمة المرور لاستلام جائزتك. الصفحة عليها قفل HTTPS وشعار مألوف.',
      en: 'Sign in with your email and password to claim your prize. The page shows an HTTPS padlock and a familiar logo.',
    },
    link: 'accounts-novamail.verify-prize.co',
    question: { ar: 'ما علامة الخطر الأهم هنا؟', en: 'What is the biggest red flag?' },
    options: [
      { text: { ar: 'لا توجد، فالقفل يعني أن الموقع آمن', en: 'None — the padlock means the site is safe' } },
      { text: { ar: 'النطاق ليس الرسمي، ويطلب كلمة مرورك مقابل جائزة', en: "The domain isn't the official one, and it wants your password for a prize" }, correct: true },
      { text: { ar: 'تصميم الصفحة جميل جدًا', en: 'The page design is too pretty' } },
    ],
    explain: {
      ar: 'القفل يعني فقط أن الاتصال مشفّر، لا أن الموقع موثوق. النطاق الحقيقي هنا هو verify-prize.co.',
      en: 'A padlock only means the connection is encrypted, not that the site is trustworthy. The real domain here is verify-prize.co.',
    },
    tip: { ar: 'انظر إلى الجزء الذي يسبق أول «/» مباشرة، فهو ما يحدد مالك الموقع.', en: 'Read the domain right before the first “/” — that part decides who owns the site.' },
  },
  {
    id: 'delivery-fee',
    topic: 'delivery',
    channel: 'sms',
    title: { ar: 'رسوم توصيل معلّقة', en: 'Pending delivery fee' },
    sender: { ar: 'Parcel-Info', en: 'Parcel-Info' },
    message: {
      ar: 'شحنتك متوقفة بسبب عنوان غير مكتمل. ادفع 4.75 ر.س لإعادة الجدولة وإلا ستُعاد للمرسل:',
      en: 'Your parcel is on hold due to an incomplete address. Pay SAR 4.75 to reschedule or it will be returned:',
    },
    link: 'parcel-track-sa.info/pay',
    question: { ar: 'المبلغ بسيط… ماذا تفعل؟', en: "It's a tiny amount… what do you do?" },
    options: [
      { text: { ar: 'أدفع، المبلغ صغير ولا يستاهل', en: "Pay it — it's too small to worry about" } },
      { text: { ar: 'أتتبع الشحنة من تطبيق شركة الشحن أو المتجر الذي طلبت منه', en: 'Track it in the carrier or store app I actually ordered from' }, correct: true },
      { text: { ar: 'أرسل الرابط لأصدقائي لأسألهم', en: 'Forward the link to friends and ask them' } },
    ],
    explain: {
      ar: 'المبلغ الصغير طُعم. الهدف الحقيقي هو بيانات بطاقتك كاملة لاستخدامها لاحقًا في عمليات أكبر.',
      en: 'The small fee is bait. The real goal is your full card details for larger charges later.',
    },
    tip: { ar: 'تتبّع شحناتك من التطبيق الرسمي فقط، لا من روابط الرسائل.', en: 'Track parcels only in the official app — never through message links.' },
  },
  {
    id: 'otp-friend',
    topic: 'verification',
    channel: 'whatsapp',
    title: { ar: 'صديق يطلب رمز التحقق', en: 'A friend asks for your code' },
    sender: { ar: 'سارة (صديقة)', en: 'Sara (friend)' },
    message: {
      ar: 'هلا! أرسلت لك رمز من 6 أرقام بالغلط، ممكن ترسله لي بسرعة؟ ضروري 🙏',
      en: 'Hey! I sent you a 6-digit code by mistake, can you forward it to me quickly? It’s urgent 🙏',
    },
    question: { ar: 'كيف ترد؟', en: 'How do you respond?' },
    options: [
      { text: { ar: 'أرسله، هي صديقتي', en: "Send it — she's my friend" } },
      { text: { ar: 'أرسل أول 3 أرقام فقط', en: 'Send only the first 3 digits' } },
      { text: { ar: 'لا أشاركه أبدًا، وأتصل بها على رقمها المعروف للتأكد', en: 'Never share it, and call her on her known number to check' }, correct: true },
    ],
    explain: {
      ar: 'رمز التحقق يفتح حسابك أنت. غالبًا حساب صديقتك مخترق ويُستخدم لسرقة حسابك أيضًا.',
      en: "That code unlocks YOUR account. Your friend's account is likely hijacked and being used to take yours too.",
    },
    tip: { ar: 'لا تشارك رمز التحقق مع أي أحد، مهما كان قريبًا منك.', en: 'Never share a verification code with anyone, however close they are.' },
  },
  {
    id: 'verify-bank',
    topic: 'verification',
    channel: 'email',
    title: { ar: 'تحقق عاجل من الهوية', en: 'Urgent identity check' },
    sender: { ar: 'security@novabank-alerts.net', en: 'security@novabank-alerts.net' },
    message: {
      ar: 'سيتم إيقاف حسابك خلال ساعتين ما لم تؤكد هويتك. اضغط «تحقق الآن» وأدخل رمز التحقق المرسل لجوالك.',
      en: 'Your account will be suspended in 2 hours unless you verify your identity. Tap “Verify now” and enter the code sent to your phone.',
    },
    question: { ar: 'ما الخطوة الصحيحة؟', en: 'What is the right step?' },
    options: [
      { text: { ar: 'أضغط «تحقق الآن» قبل إيقاف الحساب', en: 'Tap “Verify now” before the account is suspended' } },
      { text: { ar: 'أرد على البريد وأسأل إن كان حقيقيًا', en: 'Reply to the email to ask if it’s real' } },
      { text: { ar: 'أفتح تطبيق البنك بنفسي أو أتصل برقمه الرسمي', en: "Open my bank's app myself or call its official number" }, correct: true },
    ],
    explain: {
      ar: 'التهديد بالإيقاف والمهلة القصيرة ضغط نفسي. والرد على البريد يوصلك للمحتال نفسه.',
      en: 'Threats and tight deadlines are pressure tactics — and replying just reaches the scammer.',
    },
    tip: { ar: 'تواصل مع الجهة عبر قناة تعرفها أنت، لا عبر الرسالة نفسها.', en: 'Contact the organisation through a channel you know, not the message itself.' },
  },
  {
    id: 'apk-prize',
    topic: 'download',
    channel: 'whatsapp',
    title: { ar: 'تطبيق لاستلام الجائزة', en: 'An app to claim your prize' },
    sender: { ar: '+966 5• ••• ••12', en: '+966 5• ••• ••12' },
    message: {
      ar: 'لاستلام جائزتك حمّل التطبيق الرسمي للجوائز وفعّل «السماح بالتثبيت من مصادر غير معروفة»:',
      en: 'To receive your gift, download the official prize app and enable “Install from unknown sources”:',
    },
    link: 'Prize_Claim.apk · 4.2 MB',
    question: { ar: 'هل تثبّت التطبيق؟', en: 'Do you install it?' },
    options: [
      { text: { ar: 'أثبّته ثم أحذفه بعد الاستلام', en: 'Install it, then delete it after claiming' } },
      { text: { ar: 'لا. أثبّت التطبيقات من المتاجر الرسمية فقط', en: 'No. I only install apps from official stores' }, correct: true },
      { text: { ar: 'أثبّته إذا كان حجمه صغيرًا', en: "Install it if it's a small file" } },
    ],
    explain: {
      ar: 'ملفات APK خارج المتاجر قد تقرأ رسائلك ورموز التحقق وتتحكم بجهازك. حذفها لاحقًا قد يكون متأخرًا.',
      en: 'Side-loaded APKs can read your messages and codes and control your phone. Deleting later may be too late.',
    },
    tip: { ar: 'لا تعطّل حماية جهازك من أجل أي جائزة.', en: "Never switch off your phone's protections for a prize." },
  },
  {
    id: 'support-call',
    topic: 'social',
    channel: 'call',
    title: { ar: 'اتصال «دعم فني»', en: '“Tech support” call' },
    sender: { ar: 'رقم غير معروف', en: 'Unknown number' },
    message: {
      ar: '«معك فريق الدعم الفني. جهازك مصاب بفيروس خطير، ثبّت تطبيق التحكم عن بعد الآن حتى نصلحه لك فورًا.»',
      en: '“This is technical support. Your device has a dangerous virus — install this remote-access app now so we can fix it right away.”',
    },
    question: { ar: 'ماذا تفعل؟', en: 'What do you do?' },
    options: [
      { text: { ar: 'أغلق الخط، وأتواصل مع الدعم عبر القنوات الرسمية إن احتجت', en: 'Hang up, and contact support through official channels if needed' }, correct: true },
      { text: { ar: 'أتبع التعليمات، فهم مختصون', en: "Follow the instructions — they're experts" } },
      { text: { ar: 'أعطيهم معلومات بسيطة فقط', en: 'Give them only basic information' } },
    ],
    explain: {
      ar: 'الشركات لا تتصل بك فجأة لتخبرك بإصابة جهازك. تطبيق التحكم عن بعد يسلّمهم جهازك بالكامل.',
      en: "Companies don't cold-call you about infections. A remote-access app hands them your whole device.",
    },
    tip: { ar: 'الخوف والاستعجال أدوات المحتال. توقّف وتحقق.', en: "Fear and urgency are the scammer's tools. Pause and verify." },
  },
  {
    id: 'influencer-giveaway',
    topic: 'impersonation',
    channel: 'social',
    title: { ar: 'رسالة من حساب مشهور', en: 'DM from a “famous” account' },
    sender: { ar: '@tech.reviews_official_', en: '@tech.reviews_official_' },
    message: {
      ar: 'مبروك! فزت في سحب اللابتوب 💻 فقط حوّل 50 ر.س رسوم شحن وسنرسله لك اليوم.',
      en: 'Congrats! You won my laptop giveaway 💻 Just transfer SAR 50 for shipping and we’ll send it today.',
    },
    question: { ar: 'ما الذي يكشف الاحتيال؟', en: 'What gives the scam away?' },
    options: [
      { text: { ar: 'لا شيء، المبلغ صغير مقارنة باللابتوب', en: 'Nothing — SAR 50 is small next to a laptop' } },
      { text: { ar: 'اسم الحساب مقلّد، والسحوبات الحقيقية لا تطلب منك دفع شيء', en: 'The handle is a copycat, and real giveaways never ask you to pay' }, correct: true },
      { text: { ar: 'استخدام الرموز التعبيرية', en: 'The use of emojis' } },
    ],
    explain: {
      ar: 'لاحظ الشرطة السفلية الزائدة في اسم الحساب. الحسابات المقلّدة تنتحل المشاهير لطلب «رسوم».',
      en: 'Note the extra underscore in the handle. Copycat accounts impersonate public figures to collect “fees”.',
    },
    tip: { ar: 'تحقق من الحساب الرسمي ومنشوراته العامة قبل التصديق.', en: 'Check the official account and its public posts before believing it.' },
  },
  {
    id: 'ceo-giftcards',
    topic: 'impersonation',
    channel: 'whatsapp',
    title: { ar: 'طلب عاجل من «المدير»', en: 'Urgent request from “the boss”' },
    sender: { ar: 'رقم جديد · «المدير التنفيذي»', en: 'New number · “CEO”' },
    message: {
      ar: 'أنا في اجتماع ولا أستطيع الاتصال. اشترِ 5 بطاقات هدايا فورًا وأرسل لي الأكواد، وسأعوّضك لاحقًا. لا تخبر أحدًا.',
      en: "I'm in a meeting and can't call. Buy 5 gift cards right now and send me the codes — I'll pay you back. Keep it between us.",
    },
    question: { ar: 'ماذا تفعل؟', en: 'What do you do?' },
    options: [
      { text: { ar: 'أشتريها بسرعة، إنه المدير', en: "Buy them quickly — it's the boss" } },
      { text: { ar: 'أتحقق منه عبر رقمه المعروف أو بريد العمل الرسمي', en: 'Verify via his known number or official work email' }, correct: true },
      { text: { ar: 'أرسل نصف الأكواد حتى يتأكد', en: 'Send half the codes until he confirms' } },
    ],
    explain: {
      ar: 'رقم جديد + سرية + استعجال + بطاقات هدايا = احتيال انتحال شخصية كلاسيكي.',
      en: 'New number + secrecy + urgency + gift cards = a classic impersonation scam.',
    },
    tip: { ar: 'أي طلب مالي غير معتاد يحتاج تأكيدًا من قناة ثانية.', en: 'Any unusual money request needs confirmation through a second channel.' },
  },
  {
    id: 'qr-wifi',
    topic: 'qr',
    channel: 'qr',
    title: { ar: 'واي فاي مجاني في المؤتمر', en: 'Free Wi-Fi at a conference' },
    sender: { ar: 'منشور على طاولة', en: 'Flyer on a table' },
    message: {
      ar: 'إنترنت مجاني فائق السرعة! امسح الرمز، ثبّت «ملف تعريف الشبكة» واسمح بكل الصلاحيات.',
      en: 'Free ultra-fast internet! Scan, install the “network profile” and allow all permissions.',
    },
    question: { ar: 'ما القرار الآمن؟', en: 'What is the safe decision?' },
    options: [
      { text: { ar: 'أسأل المنظّمين عن الشبكة الرسمية ولا أثبّت أي ملف تعريف', en: 'Ask the organisers for the official network and install no profile' }, correct: true },
      { text: { ar: 'أثبّته، الجميع يستخدمه', en: 'Install it — everyone is using it' } },
      { text: { ar: 'أثبّته ثم أحذفه بعد المؤتمر', en: 'Install it and remove it after the event' } },
    ],
    explain: {
      ar: 'ملفات التعريف قد تسمح بمراقبة اتصالك. شبكة الواي فاي لا تحتاج تثبيت أي شيء.',
      en: 'Profiles can let someone monitor your traffic. Joining Wi-Fi never requires installing anything.',
    },
    tip: { ar: 'اعرف مصدر أي رمز QR قبل مسحه.', en: 'Know who placed a QR code before you scan it.' },
  },
  {
    id: 'permissions-app',
    topic: 'download',
    channel: 'app',
    title: { ar: 'تطبيق يطلب كل شيء', en: 'An app that wants everything' },
    sender: { ar: 'تطبيق «عجلة الحظ»', en: '“Lucky Wheel” app' },
    message: {
      ar: 'لتدوير العجلة والفوز، اسمح للتطبيق بالوصول إلى: الرسائل، جهات الاتصال، الموقع، وخدمات تسهيل الاستخدام.',
      en: 'To spin the wheel and win, allow access to: SMS, contacts, location and accessibility services.',
    },
    question: { ar: 'كيف تتعامل مع الطلب؟', en: 'How do you handle this?' },
    options: [
      { text: { ar: 'أوافق على الكل، فقط للعبة', en: "Allow everything — it's just a game" } },
      { text: { ar: 'أوافق على الرسائل فقط', en: 'Allow only SMS access' } },
      { text: { ar: 'أرفض الصلاحيات غير الضرورية وأحذف التطبيق', en: 'Deny unnecessary permissions and uninstall the app' }, correct: true },
    ],
    explain: {
      ar: 'لعبة لا تحتاج رسائلك. صلاحية الرسائل وتسهيل الاستخدام تكفي لسرقة رموز التحقق والتحكم بالجهاز.',
      en: "A game doesn't need your SMS. SMS + accessibility access is enough to steal codes and control the phone.",
    },
    tip: { ar: 'اسأل دائمًا: لماذا يحتاج هذا التطبيق هذه الصلاحية؟', en: 'Always ask: why would this app need this permission?' },
  },
]

export const TOPIC_TIPS: Record<Topic, L> = {
  prize: {
    ar: 'لا يمكنك الفوز بمسابقة لم تشارك فيها. تجاهل رسائل الفوز المفاجئة وتحقق من المصدر الرسمي.',
    en: "You can't win a contest you never entered. Ignore surprise wins and check the official source.",
  },
  qr: {
    ar: 'قبل مسح أي رمز QR، تأكد أنه ليس ملصقًا فوق رمز آخر، وراجع الرابط الظاهر قبل فتحه.',
    en: "Before scanning a QR code, check it isn't a sticker over another, and preview the link before opening.",
  },
  phishing: {
    ar: 'تحقق من اسم النطاق حرفًا بحرف. القفل (HTTPS) يعني تشفيرًا فقط، لا موثوقية.',
    en: 'Check the domain letter by letter. HTTPS means encrypted — not trustworthy.',
  },
  delivery: {
    ar: 'تتبّع شحناتك من التطبيق الرسمي فقط، ولا تدفع «رسومًا» عبر روابط الرسائل.',
    en: 'Track parcels only in the official app and never pay “fees” via message links.',
  },
  verification: {
    ar: 'رمز التحقق مفتاح حسابك. لا تشاركه مع أحد — لا البنك ولا الأصدقاء.',
    en: 'A verification code is the key to your account. Share it with no one — not banks, not friends.',
  },
  download: {
    ar: 'ثبّت التطبيقات من المتاجر الرسمية فقط، وارفض أي صلاحية لا يحتاجها التطبيق فعلًا.',
    en: "Install apps only from official stores and deny any permission an app doesn't truly need.",
  },
  social: {
    ar: 'الاستعجال والخوف علامات خطر. خذ نفسًا وتحقق عبر قناة رسمية تعرفها.',
    en: 'Urgency and fear are red flags. Take a breath and verify through an official channel you know.',
  },
  impersonation: {
    ar: 'تحقق من هوية المرسل عبر رقم أو حساب تعرفه مسبقًا، لا عبر الرسالة نفسها.',
    en: 'Verify who is messaging you through a number or account you already know — not the message itself.',
  },
}

export const PRO_TIPS: L[] = [
  { ar: 'فعّل التحقق بخطوتين على حساباتك المهمة.', en: 'Turn on two-step verification for your important accounts.' },
  { ar: 'استخدم كلمة مرور مختلفة لكل حساب، ويفضّل مدير كلمات مرور.', en: 'Use a unique password for every account — ideally with a password manager.' },
  { ar: 'إذا وقعت في فخ: غيّر كلمة المرور فورًا وتواصل مع البنك عبر رقمه الرسمي.', en: 'If you get caught: change passwords immediately and call your bank on its official number.' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Pick `n` random questions with distinct topics; shuffle their options. */
export function pickQuestions(n = 3): Question[] {
  const picked: Question[] = []
  const topics = new Set<Topic>()
  for (const q of shuffle(QUESTIONS)) {
    if (topics.has(q.topic)) continue
    topics.add(q.topic)
    picked.push({ ...q, options: shuffle(q.options) })
    if (picked.length === n) break
  }
  return picked
}

export interface Answer {
  question: Question
  choice: number
  correct: boolean
}
