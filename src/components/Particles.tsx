import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

type P = { x: number; y: number; r: number; vy: number; vx: number; a: number; tw: number }

/** Lightweight canvas particle field. Color lerps smoothly when `color` changes. */
export function Particles({ color }: { color: [number, number, number] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const target = useRef(color)
  const current = useRef<[number, number, number]>([...color])
  const reduce = useReducedMotion()

  useEffect(() => {
    target.current = color
  }, [color])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    let w = 0
    let h = 0
    let parts: P[] = []
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(70, Math.round((w * h) / 16000))
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        vy: -(Math.random() * 0.35 + 0.08),
        vx: (Math.random() - 0.5) * 0.15,
        a: Math.random() * 0.6 + 0.2,
        tw: Math.random() * Math.PI * 2,
      }))
    }

    const draw = (animate: boolean) => {
      const c = current.current
      const tg = target.current
      for (let i = 0; i < 3; i++) c[i] = animate ? c[i] + (tg[i] - c[i]) * 0.05 : tg[i]
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        if (animate) {
          p.y += p.vy
          p.x += p.vx
          p.tw += 0.03
          if (p.y < -5) {
            p.y = h + 5
            p.x = Math.random() * w
          }
        }
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${alpha})`
        ctx.shadowBlur = 8
        ctx.shadowColor = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},0.8)`
        ctx.fill()
      }
    }

    const loop = () => {
      if (!document.hidden) draw(true)
      raf = requestAnimationFrame(loop)
    }

    const onResize = () => {
      resize()
      if (reduce) draw(false)
    }
    onResize()
    window.addEventListener('resize', onResize)
    if (!reduce) raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [reduce])

  // Reduced motion: redraw statically on color change
  useEffect(() => {
    if (reduce) window.dispatchEvent(new Event('resize'))
  }, [color, reduce])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />
}
