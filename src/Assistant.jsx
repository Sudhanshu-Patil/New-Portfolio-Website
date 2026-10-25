import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { PaperPlaneRight, X } from '@phosphor-icons/react'
import { profile } from './content'

const SUGGESTIONS = ['What did he build at SimpleWorks?', 'Tell me about MediClaim', 'Where is he open to work?']
// Fallback follow-ups when the model skips its FOLLOWUPS line.
const POOL = [...SUGGESTIONS, 'What did he do at Novartis?', 'What is his AI stack?', 'Which certifications does he hold?', 'How can I contact him?']

// The model ends each answer with "FOLLOWUPS: q1 | q2". Hide that line (even mid-stream) and return the questions.
function splitAnswer(text) {
  const i = text.search(/\n?\s*FOLLOW/)
  if (i < 0) return [text, []]
  const tail = text.slice(i).replace(/^\s*FOLLOWUPS?:?/, '')
  return [text.slice(0, i).trimEnd(), tail.split('|').map((q) => q.trim()).filter((q) => q.length > 3).slice(0, 2)]
}

// Eye shapes per mood. Border radius always uses the 8-value form so GSAP can morph between them.
const R = (a) => `${a[0]}% ${a[1]}% ${a[2]}% ${a[3]}% / ${a[4]}% ${a[5]}% ${a[6]}% ${a[7]}%`
const ROUND = R([50, 50, 50, 50, 50, 50, 50, 50])
const MOODS = {
  idle: { height: '100%', yPercent: 0, borderRadius: ROUND },
  happy: { height: '50%', yPercent: -30, borderRadius: R([50, 50, 15, 15, 100, 100, 25, 25]) },
  thinking: { height: '60%', yPercent: -15, borderRadius: ROUND },
  sleepy: { height: '20%', yPercent: 40, borderRadius: ROUND },
  sad: { height: '60%', yPercent: 20, borderRadius: R([15, 15, 50, 50, 25, 25, 100, 100]) },
  surprised: { height: '120%', yPercent: 0, borderRadius: ROUND },
}

// Dark robot head with two glowing eyes. gaze = follows cursor, lid = blinks, eye = mood shape.
function Robot({ small = false }) {
  return (
    <span
      className={`r-head relative flex items-center justify-center border border-white/10 bg-[linear-gradient(145deg,#1f2228,#0b0c0e)] ${
        small
          ? 'size-9 rounded-[11px]'
          : 'size-16 rounded-[20px] shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_0_32px_rgb(191_227_107/0.22),0_14px_32px_rgb(0_0_0/0.55)]'
      }`}
    >
      <span className={`r-gaze flex items-center ${small ? 'gap-[7px]' : 'gap-[13px]'}`}>
        {[0, 1].map((i) => (
          <span key={i} className={`r-lid flex items-center justify-center ${small ? 'h-[12px] w-[8px]' : 'h-[21px] w-[14px]'}`}>
            <span className="r-eye relative block h-full w-full overflow-hidden rounded-[50%] bg-[radial-gradient(ellipse_at_50%_38%,#f1ffcc,#bfe36b_58%,#86ab3a)] shadow-[0_0_8px_rgb(191_227_107/0.9),0_0_20px_rgb(191_227_107/0.45)]">
              <span className="absolute left-[20%] top-[12%] size-[34%] rounded-full bg-white/85" />
            </span>
          </span>
        ))}
      </span>
    </span>
  )
}

export default function Assistant() {
  const [open, setOpen] = useState(false)
  const [hint, setHint] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const root = useRef(null)
  const panel = useRef(null)
  const list = useRef(null)
  const field = useRef(null)
  const button = useRef(null)
  // No-ops until the animation effect runs (and forever under reduced motion).
  const face = useRef({ setBase() {}, flash() {}, current: 'idle' })

  // The robot's behaviour: float, blink, track the cursor, wander when idle, doze off, and emote.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const q = gsap.utils.selector(root)
    let current = 'idle'
    let base = 'idle'
    let back
    let scan
    let lastMove = Date.now()

    const mood = (name) => {
      current = name
      gsap.to(q('.r-eye'), {
        ...MOODS[name],
        duration: name === 'surprised' ? 0.2 : name === 'sleepy' ? 1.2 : 0.4,
        ease: name === 'surprised' ? 'back.out(3)' : 'power3.out',
        overwrite: 'auto',
      })
      scan?.kill()
      if (name === 'thinking') {
        scan = gsap
          .timeline({ repeat: -1 })
          .to(q('.r-lid'), { x: -3, duration: 0.45, ease: 'sine.inOut' })
          .to(q('.r-lid'), { x: 3, duration: 0.45, ease: 'sine.inOut' })
      } else gsap.to(q('.r-lid'), { x: 0, duration: 0.3 })
    }
    // Show a mood for a moment, then return to the base mood (thinking while busy, otherwise idle).
    const flash = (name, ms, then) => {
      clearTimeout(back)
      mood(name)
      back = setTimeout(() => (then ? then() : mood(base)), ms)
    }
    face.current = {
      setBase: (name) => {
        base = name
        clearTimeout(back)
        mood(name)
      },
      flash,
      get current() {
        return current
      },
    }

    const ctx = gsap.context(() => {
      gsap.to('.avatar', { y: -7, duration: 1.9, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      const blink = () => {
        const double = Math.random() < 0.25
        const tl = gsap.timeline({ delay: gsap.utils.random(2.2, 5.5), onComplete: blink })
        if (current === 'sleepy') return tl
        tl.to('.r-lid', { scaleY: 0.08, duration: 0.07, ease: 'power2.in' }).to('.r-lid', { scaleY: 1, duration: 0.12, ease: 'power2.out' })
        if (double) tl.to('.r-lid', { scaleY: 0.08, duration: 0.07, delay: 0.08 }).to('.r-lid', { scaleY: 1, duration: 0.12 })
        return tl
      }
      blink()
    }, root)

    const gaze = q('.r-gaze')[0]
    const gx = gsap.quickTo(gaze, 'x', { duration: 0.35, ease: 'power3.out' })
    const gy = gsap.quickTo(gaze, 'y', { duration: 0.35, ease: 'power3.out' })
    const tilt = gsap.quickTo(button.current, 'rotation', { duration: 0.6, ease: 'power3.out' })
    const lookAt = (x, y) => {
      const r = button.current.getBoundingClientRect()
      const dx = x - (r.left + r.width / 2)
      const dy = y - (r.top + r.height / 2)
      const d = Math.hypot(dx, dy) || 1
      const reach = Math.min(d / 160, 1)
      gx((dx / d) * reach * 6)
      gy((dy / d) * reach * 5)
      tilt(gsap.utils.clamp(-8, 8, dx / 50))
    }
    const onMove = (e) => {
      lastMove = Date.now()
      if (current === 'sleepy') flash('surprised', 450)
      lookAt(e.clientX, e.clientY)
    }

    // Idle life: glance around after a few still seconds, doze off after half a minute.
    const life = setInterval(() => {
      const still = Date.now() - lastMove
      if (current !== 'idle') return
      if (still > 30000 && !panel.current) return mood('sleepy')
      if (still > 3000 && Math.random() < 0.55) {
        gx(gsap.utils.random(-6, 6))
        gy(gsap.utils.random(-4, 4))
      }
    }, 1600)

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      clearInterval(life)
      clearTimeout(back)
      scan?.kill()
      ctx.revert()
    }
  }, [])

  // One gentle nudge per session, a few seconds in.
  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem('assistant-hint') === '1'
    } catch {}
    if (seen) return
    const t = setTimeout(() => {
      setHint(true)
      face.current.flash('happy', 1400)
    }, 5000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!open) return
    setHint(false)
    try {
      sessionStorage.setItem('assistant-hint', '1')
    } catch {}
    face.current.flash('surprised', 300, () => face.current.flash('happy', 1000))
    gsap.fromTo(panel.current, { opacity: 0, y: 16, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'expo.out' })
    field.current?.focus()
    const esc = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight })
  }, [messages, busy])

  const last = messages.at(-1)
  const asked = new Set(messages.filter((m) => m.role === 'user').map((m) => m.content))
  const followUps =
    last?.role === 'assistant' && last.content
      ? (() => {
          const fromModel = splitAnswer(last.content)[1].filter((q) => !asked.has(q))
          return fromModel.length ? fromModel : POOL.filter((q) => !asked.has(q)).slice(0, 2)
        })()
      : []

  function close() {
    setOpen(false)
    button.current?.focus()
  }

  async function send(text) {
    const q = text.trim().slice(0, 600)
    if (!q || busy) return
    const history = [...messages, { role: 'user', content: q }]
    setMessages([...history, { role: 'assistant', content: '' }])
    setInput('')
    setBusy(true)
    face.current.setBase('thinking')
    const write = (content) => setMessages([...history, { role: 'assistant', content }])
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'failed')
      }
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let out = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        if (!out) face.current.setBase('idle')
        out += dec.decode(value, { stream: true })
        write(out)
      }
      if (!out) throw new Error('empty')
      face.current.flash('happy', 1500)
    } catch (e) {
      face.current.setBase('idle')
      face.current.flash('sad', 2200)
      write(
        e.message === 'offline'
          ? `I'm offline right now. You can reach Sudhanshu at ${profile.email}.`
          : e.message === 'rate_limited'
            ? 'Too many questions in a short time. Give it a minute and try again.'
            : `Something went wrong on my side. Try again, or email ${profile.email}.`,
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div ref={root} className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      {open && (
        <section
          ref={panel}
          role="dialog"
          aria-label="Ask about Sudhanshu"
          className="flex h-[min(520px,72dvh)] w-[min(380px,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_80px_rgb(0_0_0/0.5)]"
        >
          <header className="flex items-center gap-3 border-b border-line px-4 py-3">
            <Robot small />
            <div className="flex-1">
              <p className="text-sm font-semibold">Ask about Sudhanshu</p>
              <p className="text-xs text-muted">Answers from this portfolio. Can make mistakes.</p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close chat"
              className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-fg"
            >
              <X size={18} />
            </button>
          </header>

          <div ref={list} data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-color:rgb(255_255_255/0.15)_transparent] [scrollbar-width:thin]" aria-live="polite">
            {messages.length === 0 && (
              <div>
                <p className="text-sm leading-relaxed text-muted">
                  Hi, I can answer questions about Sudhanshu's experience, projects and stack.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-line px-3 py-1.5 text-left text-xs text-fg transition-colors hover:border-accent hover:text-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <p
                key={i}
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === 'user' ? 'ml-auto bg-accent text-ink' : 'bg-ink/70 text-fg'
                }`}
              >
                {(m.role === 'assistant' ? splitAnswer(m.content)[0] : m.content) || (
                  <span className="animate-pulse text-muted">Thinking</span>
                )}
              </p>
            ))}
            {!busy && followUps.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {followUps.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-line px-3 py-1.5 text-left text-xs text-fg transition-colors hover:border-accent hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex items-center gap-2 border-t border-line p-3"
          >
            <label htmlFor="assistant-q" className="sr-only">
              Your question
            </label>
            <input
              id="assistant-q"
              ref={field}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={600}
              autoComplete="off"
              placeholder="Ask a question"
              className="min-w-0 flex-1 rounded-full border border-line bg-ink px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-ink transition-[opacity,transform] active:scale-95 disabled:opacity-40"
            >
              <PaperPlaneRight size={16} weight="fill" />
            </button>
          </form>
        </section>
      )}

      <div className="flex items-end gap-3">
        {hint && !open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mb-3 rounded-2xl rounded-br-sm border border-line bg-surface px-3.5 py-2 text-sm text-fg shadow-lg"
          >
            Questions about Sudhanshu's work? Ask me.
          </button>
        )}
        <button
          ref={button}
          type="button"
          onClick={() => (open ? close() : setOpen(true))}
          onPointerEnter={() => face.current.current === 'idle' && face.current.flash('happy', 1200)}
          aria-label={open ? 'Close chat' : 'Ask about Sudhanshu'}
          aria-expanded={open}
          className="avatar rounded-[20px] active:scale-95"
        >
          <Robot />
        </button>
      </div>
    </div>
  )
}
