// Generate print-ready QR files for a URL and VERIFY them by decoding the PNG.
//   npm run qr -- https://your-deployed-site.example/
// Output: poster/qr-code.svg, poster/qr-code.png (2048 px)
import QRCode from 'qrcode'
import jsQR from 'jsqr'
import { PNG } from 'pngjs'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const url = process.argv[2]
if (!url || !/^https:\/\//.test(url)) {
  console.error('Usage: npm run qr -- https://your-site.example/   (HTTPS URL required)')
  process.exit(1)
}

const opts = { errorCorrectionLevel: 'Q', margin: 2, color: { dark: '#080B12', light: '#F5F7FA' } }
mkdirSync('poster', { recursive: true })
writeFileSync('poster/qr-code.svg', await QRCode.toString(url, { ...opts, type: 'svg' }))
await QRCode.toFile('poster/qr-code.png', url, { ...opts, width: 2048 })

const png = PNG.sync.read(readFileSync('poster/qr-code.png'))
const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height)
if (decoded?.data !== url) {
  console.error('✗ Verification FAILED. Decoded:', decoded?.data)
  process.exit(1)
}
console.log(`✓ QR verified — decodes to: ${decoded.data}`)
console.log('  poster/qr-code.svg  poster/qr-code.png')
