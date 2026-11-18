# THE TRAP — SCAN TO WIN

**امسح واكتشف جائزتك! · YOUR NEXT SCAN COULD WIN!**

**Live:** https://m-alasmary.github.io/scan-to-win/ · **Poster:** https://m-alasmary.github.io/scan-to-win/poster.html

An immersive, bilingual (Arabic‑first RTL / English LTR) cybersecurity awareness experience for a conference booth. Visitors scan a "prize" QR poster, open a premium mystery box, and fall into a *safe* trap that teaches how QR phishing and social engineering exploit excitement.

Flow (≈ 60–90 s): **Excitement → Suspense → Surprise → Awareness**

| Stage | What happens |
|---|---|
| 1. The Bait | Gold mystery box, light rays, fake countdown and fake visitor counter, "REVEAL MY PRIZE" |
| 2. The Trap | Box blasts open → glitch cut to red warning: "لقد وقعت في الفخ!" + clear "you are safe" message, skip‑animation button |
| 3. How it works | Animated attack chain (Prize → QR → Unknown site → Social engineering → Data theft), then fictional, non‑functional mocks of what an attacker would ask for next, and the tricks used on the visitor |
| 4. Cyber challenge | 3 random scenarios from a pool of 12 (distinct topics), instant feedback and a tip |
| 5. Result | Animated score ring, correct/risky decisions, personalised tips, closing message, restart |

The A3 poster lives at `/poster.html` on the same deployment.

## Privacy & safety guarantees

- No backend, no forms, no `<input>` elements, no cookies, no storage, no analytics, no third‑party requests (fonts are self‑hosted).
- Attacker "requests" are static decorations marked *FICTIONAL · NON‑FUNCTIONAL* — nothing can be typed or submitted.
- No device permissions are requested. Sound is synthesised locally and **off by default**; vibration is a no‑op where unsupported.
- Production HTML ships a strict Content‑Security‑Policy (`script-src 'self'`, `form-action 'none'`, no external origins). `public/_headers` / `vercel.json` add HSTS, `X-Frame-Options`, `Permissions-Policy`, etc. on hosts that support them.
- Respects `prefers-reduced-motion` (animations shortened/disabled, glitch layers removed).

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output: `dist/` (static, relative paths — works at a domain root or in a sub‑folder).

## Deploy (HTTPS)

Any static HTTPS host works. Pick one:

**GitHub Pages** (workflow included in `.github/workflows/deploy.yml`)
1. Push this folder to a GitHub repo on branch `main`.
2. Repo → Settings → Pages → Source: **GitHub Actions**.
3. Optional: Settings → Variables → `SITE_URL` = your final URL (pins the poster's QR target).

**Netlify / Cloudflare Pages** — build command `npm run build`, output directory `dist`. `_headers` is applied automatically.

**Vercel** — framework preset *Vite*; `vercel.json` adds the security headers.

## The QR code — generate and verify

The poster encodes `VITE_SITE_URL` if set at build time, otherwise the folder it is served from — so `/poster.html` on the deployed site always points to that same deployed site.

To produce standalone print files and **verify** them (the script decodes the PNG and checks it matches exactly):

```bash
npm run qr -- https://your-deployed-site.example/
```

Writes `poster/qr-code.svg` and `poster/qr-code.png` (2048 px). It refuses non‑HTTPS URLs.

## Print the poster (A3 or A5)

A5 version: open `poster.html?size=a5` (or use the A3/A5 switch in the toolbar). It is the same artwork at 50% on an A5 sheet; the QR is ~76 mm wide. Ready-made files: `poster/THE-TRAP-A3.pdf`, `poster/THE-TRAP-A5.pdf`.


1. Open `https://your-deployed-site.example/poster.html`.
2. Check the toolbar shows the right URL after "QR →".
3. Click **Print / Save PDF (A3)** → paper size A3, margins *None*, *Background graphics* on.

Or headless (Windows, Edge):

```bash
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="poster/THE-TRAP-A3.pdf" "https://your-deployed-site.example/poster.html"
```

Always test‑scan the printed poster with both an iPhone camera and an Android camera before the event.

## Booth tips

- Place the poster at eye level with good, even light; avoid glossy lamination glare on the QR.
- Keep a tablet on a stand running the site for visitors without phones.
- Let visitors finish on the result screen — the closing line is the takeaway.

## Project structure

```
src/
  App.tsx              stage machine, theme transitions (gold → red → cyan)
  stages/              Bait, Trap, Attack, Quiz, Result
  components/          MysteryBox, Particles (canvas), GlitchOverlay, Header
  data/quiz.ts         12 bilingual fictional scenarios + tips
  lib/i18n.tsx         Arabic/English context, RTL/LTR switching
  lib/sound.ts         optional Web Audio sound effects
  poster/              A3 poster (poster.html)
scripts/qr.mjs         QR generator + decoder verification
```
