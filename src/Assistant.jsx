import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { PaperPlaneRight, X } from '@phosphor-icons/react'
import { profile } from './content'

const SUGGESTIONS = ['What did he build at SimpleWorks?', 'Tell me about MediClaim', 'Where is he open to work?']

// Lime face with two eyes. Pupils are targeted by GSAP to follow the cursor.
function Face({ size = 'size-14', eyes = 'h-[30%] w-[22%]' }) {
  return (
    <span className={`face relative flex ${size} items-center justify-center gap-[14%] rounded-full bg-accent shadow-[0_10px_30px_rgb(191_227_107/0.25)]`}>
      {[0, 1].map((i) => (
        <span key={i} className={`eye relative flex ${eyes} items-center justify-center overflow-hidden rounded-full bg-fg`}>
          <span className="pupil block size-[55%] rounded-full bg-ink" />
        </span>
      ))}
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

  // Float, blink, and eyes that track the cursor.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.to('.avatar', { y: -7, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      const blink = () =>
        gsap
          .timeline({ delay: gsap.utils.random(2, 5), onComplete: blink })
          .to('.eye', { scaleY: 0.1, duration: 0.07, ease: 'power2.in' })
          .to('.eye', { scaleY: 1, duration: 0.12, ease: 'power2.out' })
      blink()
    }, root)

    const pupils = gsap.utils.toArray('.pupil', root.current)
    const xs = pupils.map((p) => gsap.quickTo(p, 'x', { duration: 0.35, ease: 'power3.out' }))
    const ys = pupils.map((p) => gsap.quickTo(p, 'y', { duration: 0.35, ease: 'power3.out' }))
    const tilt = gsap.quickTo(button.current, 'rotation', { duration: 0.6, ease: 'power3.out' })
    const look = (e) => {
      const r = button.current.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const d = Math.hypot(dx, dy) || 1
      const reach = Math.min(d / 120, 1) * 3.5
      xs.forEach((f) => f((dx / d) * reach))
      ys.forEach((f) => f((dy / d) * reach))
      tilt(gsap.utils.clamp(-10, 10, dx / 40))
    }
    window.addEventListener('pointermove', look, { passive: true })
    return () => {
      window.removeEventListener('pointermove', look)
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
    const t = setTimeout(() => setHint(true), 5000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!open) return
    setHint(false)
    try {
      sessionStorage.setItem('assistant-hint', '1')
    } catch {}
    gsap.fromTo(panel.current, { opacity: 0, y: 16, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'expo.out' })
    field.current?.focus()
    const esc = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight })
  }, [messages])

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
        out += dec.decode(value, { stream: true })
        write(out)
      }
      if (!out) throw new Error('empty')
    } catch (e) {
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
          <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <div>
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

          <div ref={list} data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4" aria-live="polite">
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
                {m.content || <span className="animate-pulse text-muted">Thinking</span>}
              </p>
            ))}
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
            className="mb-2 rounded-2xl rounded-br-sm border border-line bg-surface px-3.5 py-2 text-sm text-fg shadow-lg"
          >
            Questions about Sudhanshu's work? Ask me.
          </button>
        )}
        <button
          ref={button}
          type="button"
          onClick={() => (open ? close() : setOpen(true))}
          aria-label={open ? 'Close chat' : 'Ask about Sudhanshu'}
          aria-expanded={open}
          className="avatar rounded-full active:scale-95"
        >
          <Face />
        </button>
      </div>
    </div>
  )
}
