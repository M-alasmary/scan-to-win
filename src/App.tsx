import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GlitchOverlay } from './components/GlitchOverlay'
import { Header } from './components/Header'
import { Particles } from './components/Particles'
import { pickQuestions, type Answer } from './data/quiz'
import { sound } from './lib/sound'
import { Attack } from './stages/Attack'
import { Bait } from './stages/Bait'
import { Quiz } from './stages/Quiz'
import { Result } from './stages/Result'
import { Trap } from './stages/Trap'

export type Stage = 'bait' | 'trap' | 'attack' | 'quiz' | 'result'

const THEME: Record<Stage, { hex: string; rgb: [number, number, number] }> = {
  bait: { hex: '#D4AF37', rgb: [212, 175, 55] },
  trap: { hex: '#EF3340', rgb: [239, 51, 64] },
  attack: { hex: '#00D9FF', rgb: [0, 217, 255] },
  quiz: { hex: '#00D9FF', rgb: [0, 217, 255] },
  result: { hex: '#00D9FF', rgb: [0, 217, 255] },
}

export default function App() {
  const [stage, setStage] = useState<Stage>('bait')
  const [glitch, setGlitch] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [questions, setQuestions] = useState(() => pickQuestions(3))
  const [answers, setAnswers] = useState<Answer[]>([])
  const timers = useRef<number[]>([])

  const theme = THEME[stage]

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--accent', theme.hex)
    root.style.setProperty('--accent-rgb', theme.rgb.join(' '))
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', stage === 'trap' ? '#2a070b' : '#080B12')
  }, [theme, stage])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const go = useCallback((s: Stage) => {
    setStage(s)
    window.scrollTo({ top: 0 })
  }, [])

  const springTrap = useCallback(() => {
    setGlitch(true)
    sound.play('alarm')
    navigator.vibrate?.([60, 40, 120])
    timers.current.push(window.setTimeout(() => go('trap'), 260))
    timers.current.push(window.setTimeout(() => setGlitch(false), 900))
  }, [go])

  const restart = useCallback(() => {
    setAnswers([])
    setQuestions(pickQuestions(3))
    go('bait')
  }, [go])

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-dvh overflow-x-clip">
        {/* ambient background */}
        <div aria-hidden className="fixed inset-0 -z-20 bg-obsidian" />
        <motion.div
          aria-hidden
          className="fixed inset-0 -z-20"
          animate={{
            background: `radial-gradient(120% 70% at 50% 0%, ${theme.hex}2e 0%, transparent 60%), radial-gradient(80% 50% at 50% 110%, ${theme.hex}22 0%, transparent 70%)`,
          }}
          transition={{ duration: 0.8 }}
        />
        <div aria-hidden className="grid-floor fixed inset-x-[-50%] bottom-0 -z-20 h-[45vh] opacity-50" />
        {stage === 'trap' && <div aria-hidden className="scanlines fixed inset-0 z-0" />}
        <Particles color={theme.rgb} />

        <Header
          stage={stage}
          soundOn={soundOn}
          onSound={() => {
            sound.setEnabled(!soundOn)
            setSoundOn(!soundOn)
          }}
        />

        <main className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(6px)', transition: { duration: 0.25 } }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {stage === 'bait' && <Bait onTrap={springTrap} />}
              {stage === 'trap' && <Trap onNext={() => go('attack')} />}
              {stage === 'attack' && <Attack onNext={() => go('quiz')} />}
              {stage === 'quiz' && (
                <Quiz
                  questions={questions}
                  onDone={(a) => {
                    setAnswers(a)
                    go('result')
                  }}
                />
              )}
              {stage === 'result' && <Result answers={answers} onRestart={restart} />}
            </motion.div>
          </AnimatePresence>
        </main>

        <GlitchOverlay active={glitch} />
      </div>
    </MotionConfig>
  )
}
