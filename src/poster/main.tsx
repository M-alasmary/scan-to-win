import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import QRCode from 'qrcode'
import { Gamepad2, Headphones, Laptop, Printer, ScanLine, Smartphone, Sparkles, Tablet, Watch } from 'lucide-react'
import '@fontsource-variable/cairo'
import '@fontsource-variable/space-grotesk'
import './poster.css'

/**
 * Target URL encoded in the QR code:
 *  1. VITE_SITE_URL at build time (recommended for production), else
 *  2. the folder this poster is served from (the deployed site itself).
 */
const TARGET = (import.meta.env.VITE_SITE_URL as string | undefined) || new URL('./', window.location.href).href

function seeded(n: number) {
  let s = 7
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  return Array.from({ length: n }, () => ({ x: r() * 100, y: r() * 100, s: r() * 0.9 + 0.2, o: r() * 0.7 + 0.2 }))
}
const STARS = seeded(90)

function Poster() {
  const [svg, setSvg] = useState('')
  const [fit, setFit] = useState(1)

  useEffect(() => {
    const A3_PX = (297 / 25.4) * 96
    const onResize = () => setFit(Math.min(1, (window.innerWidth - 32) / A3_PX))
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    QRCode.toString(TARGET, {
      type: 'svg',
      errorCorrectionLevel: 'Q',
      margin: 2,
      color: { dark: '#080B12', light: '#F5F7FA' },
    }).then(setSvg)
  }, [])

  const orbit = [
    { I: Headphones, x: '5%', y: '34%', r: -8 },
    { I: Smartphone, x: '2.5%', y: '48.5%', r: 8 },
    { I: Gamepad2, x: '6%', y: '63%', r: -12 },
    { I: Watch, x: '85%', y: '34%', r: 10 },
    { I: Tablet, x: '87.5%', y: '48.5%', r: -6 },
    { I: Laptop, x: '84%', y: '63%', r: 6 },
  ]

  return (
    <>
      <div className="toolbar">
        <span>
          QR → <code dir="ltr">{TARGET}</code>
        </span>
        <button type="button" onClick={() => window.print()}>
          <Printer size={16} /> Print / Save PDF (A3)
        </button>
      </div>

      <div className="stage">
        <article className="poster" dir="rtl" lang="ar" style={{ ['--fit' as string]: fit }}>
          <div className="bg-glow" />
          <div className="beams" />
          <div className="floor" />
          <svg className="stars" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {STARS.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.s * 0.18} fill="#F5D77A" opacity={s.o} />
            ))}
          </svg>

          {orbit.map(({ I, x, y, r }, i) => (
            <div key={i} className="orb" style={{ left: x, top: y, transform: `rotate(${r}deg)` }}>
              <I strokeWidth={1.4} />
            </div>
          ))}

          <header className="top">
            <div className="pill">
              <Sparkles size={14} /> <span className="en">SCAN TO WIN</span> · امسح لتربح
            </div>
            <h1 className="mabrook">مبروك!</h1>
            <p className="lead">فرصة الفوز بجائزة تقنية بانتظارك!</p>
          </header>

          <div className="qr-wrap">
            <span className="corner tl" />
            <span className="corner tr" />
            <span className="corner bl" />
            <span className="corner br" />
            <div className="qr" dangerouslySetInnerHTML={{ __html: svg }} />
          </div>

          <footer className="bottom">
            <p className="cta-en en" dir="ltr">
              <ScanLine size={30} strokeWidth={2.2} /> SCAN TO REVEAL YOUR PRIZE
            </p>
            <p className="cta-ar">امسح واكتشف جائزتك!</p>
            <p className="tag en" dir="ltr">
              YOUR NEXT SCAN COULD WIN!
            </p>
            <p className="fine">تجربة تفاعلية · لا يلزم أي تسجيل أو بيانات شخصية · <span className="en">Interactive experience · No registration or personal data required</span></p>
          </footer>
        </article>
      </div>
    </>
  )
}

createRoot(document.getElementById('poster-root')!).render(
  <StrictMode>
    <Poster />
  </StrictMode>,
)
