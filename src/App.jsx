import { Fragment, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Code,
  Copy,
  DownloadSimple,
  GithubLogo,
  LinkedinLogo,
  Phone,
} from '@phosphor-icons/react'
import { certifications, education, experience, featured, honors, moreWork, profile, proof, stack } from './content'

gsap.registerPlugin(ScrollTrigger)

const wrap = 'mx-auto w-full max-w-7xl px-4 md:px-8'
const pill =
  'inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-sm font-medium btn-fill transition-[color,border-color] duration-500 active:scale-[0.98]'
const primary = `${pill} bg-accent text-ink`
const ghost = `${pill} border border-line text-fg hover:border-fg hover:text-ink`
const eyebrow = 'font-mono text-xs uppercase tracking-[0.18em] text-muted'
const h2 = 'text-4xl font-semibold tracking-tighter leading-[1.05] md:text-5xl'

// Headline words rise out of a mask as the heading scrolls in.
function H2({ children, className = '' }) {
  return (
    <h2 className={`${h2} split ${className}`}>
      {children.split(' ').map((w, i) => (
        <Fragment key={i}>
          <span className="word">
            <span>{w}</span>
          </span>{' '}
        </Fragment>
      ))}
    </h2>
  )
}

function ExtLink({ href, children, className }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  )
}

function ResumeButton({ className = ghost }) {
  return (
    <a href={profile.resume} download className={className}>
      <DownloadSimple size={16} weight="bold" />
      Download resume
    </a>
  )
}

function Nav() {
  const links = [
    ['Work', '#work'],
    ['Experience', '#experience'],
    ['Stack', '#stack'],
    ['Contact', '#contact'],
  ]
  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-line bg-ink/70 backdrop-blur-md">
      <nav className={`${wrap} flex h-16 items-center justify-between gap-6`}>
        <a href="#top" className="text-sm font-semibold tracking-tight">
          Sudhanshu Patil
        </a>
        <div className="flex items-center gap-8">
          <ul className="hidden items-center gap-8 text-sm text-muted md:flex">
            {links.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="transition-colors hover:text-fg">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <ResumeButton className={`${ghost} !py-2`} />
        </div>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section id="top" data-shape="0" className="relative flex min-h-[100dvh] items-end pb-16 pt-24 md:items-center md:pb-0">
      <div className={`${wrap} grid lg:grid-cols-12`}>
        <div className="lg:col-span-8">
          <p className={`${eyebrow} rise flex items-center gap-2`} style={{ '--i': 0 }}>
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            AI Engineer, open to full-time roles
          </p>
          <h1
            className="rise mt-6 text-5xl font-semibold leading-[1.02] tracking-tighter md:text-6xl lg:text-[4.25rem]"
            style={{ '--i': 1 }}
          >
            AI systems that <span className="text-accent">hold up</span> in production.
          </h1>
          <p className="rise mt-6 max-w-[46ch] text-lg leading-relaxed text-muted" style={{ '--i': 2 }}>
            I'm Sudhanshu. I design agentic RAG, MCP tooling and guardrails, then ship them for banks and enterprise teams.
          </p>
          <div className="rise mt-10 flex flex-wrap gap-3" style={{ '--i': 3 }}>
            <a href="#work" className={primary}>
              View work
              <ArrowRight size={16} weight="bold" />
            </a>
            <ResumeButton />
          </div>
        </div>
      </div>
    </section>
  )
}

function Proof() {
  return (
    <section data-shape="0" className="relative py-16 md:py-24">
      <dl className={`${wrap} grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-12 lg:grid-cols-4`}>
        {proof.map((p) => (
          <div key={p.label} className="reveal">
            <dt className="sr-only">{p.label}</dt>
            <dd className="text-4xl font-semibold tracking-tighter md:text-5xl">{p.value}</dd>
            <dd className="mt-3 max-w-[24ch] text-sm leading-relaxed text-muted">{p.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function About() {
  return (
    <section id="about" data-shape="1" className="relative py-24 md:py-36">
      <div className={`${wrap} grid items-center gap-12 lg:grid-cols-12`}>
        <div className="reveal lg:col-span-5">
          <H2>Trained on signals. Now I build with models.</H2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted md:text-lg">
            <p>
              I studied Electronics and Communication at BITS Pilani and added a minor in Computing and Intelligence. That
              is where I built the foundations: machine learning, AI, and data structures and algorithms.
            </p>
            <p>
              The rest I learned in production. As the sole AI engineer at SimpleWorks, I took agentic systems from design
              to deployment for banking clients, including air-gapped ones.
            </p>
          </div>
        </div>
        <div className="reveal lg:col-span-5 lg:col-start-8">
          <img
            src="/sudhanshu.webp"
            alt="Portrait of Sudhanshu Patil"
            width="680"
            height="850"
            loading="lazy"
            className="aspect-[4/5] w-full rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section id="experience" data-shape="2" className="relative py-24 md:py-36">
      <div className={`${wrap} grid gap-12 lg:grid-cols-12`}>
        <div className="lg:col-span-4">
          <div className="reveal lg:sticky lg:top-28">
            <H2>Production, as a team of one.</H2>
            <p className="mt-6 max-w-[40ch] leading-relaxed text-muted">
              Architecture to deployment, for clients where a wrong answer reaches a bank customer.
            </p>
          </div>
        </div>
        <ol className="space-y-20 lg:col-span-7 lg:col-start-6">
          {experience.map((job) => (
            <li key={job.role} className="reveal">
              <p className="font-mono text-sm text-muted">{job.period}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                {job.role} {job.company && <span className="text-muted">at {job.company}</span>}
              </h3>
              <p className="mt-2 text-accent">{job.note}</p>
              <ul className="mt-8 space-y-5">
                {job.points.map((pt) => (
                  <li key={pt} className="grid grid-cols-[1.25rem_1fr] leading-relaxed text-fg/85">
                    <span className="mt-[0.7rem] h-px w-3 bg-accent" aria-hidden />
                    {pt}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Panel({ p }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-surface/80 p-6 backdrop-blur-md md:p-8">
      <h3 className="text-3xl font-semibold tracking-tighter md:text-4xl">{p.name}</h3>
      <p className="mt-2 text-muted">{p.tagline}</p>
      <p className="mt-6 max-w-[38ch] text-xl leading-snug">{p.problem}</p>
      <ol className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-3" aria-label="Pipeline">
        {p.pipeline.map((step, i) => (
          <li key={step} className="flex items-center gap-2">
            <span className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-fg/90">{step}</span>
            {i < p.pipeline.length - 1 && <ArrowRight size={12} className="text-accent" aria-hidden />}
          </li>
        ))}
      </ol>
      <ul className="mt-6 grid gap-x-8 gap-y-2 text-sm leading-relaxed text-muted md:grid-cols-2">
        {p.facts.map((f) => (
          <li key={f} className="flex gap-3">
            <Check size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap gap-3 pt-8">
        {p.links.map((l, i) => (
          <ExtLink key={l.href} href={l.href} className={i === 0 ? primary : ghost}>
            {l.label}
            <ArrowUpRight size={16} weight="bold" />
          </ExtLink>
        ))}
      </div>
    </article>
  )
}

function Work() {
  return (
    <section id="work" data-shape="3" className="work-pin relative flex min-h-[100dvh] flex-col justify-center overflow-hidden py-24 lg:pb-0 lg:pt-16">
      <div className={`${wrap} reveal`}>
        <p className={eyebrow}>Selected work</p>
        <H2 className="mt-4">Systems I built end to end.</H2>
      </div>
      <div className="work-track mt-10 flex flex-col gap-6 px-4 md:px-8 lg:mt-8 lg:w-max lg:flex-row lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-[10vw]">
        {featured.map((p) => (
          <div key={p.name} className="reveal lg:w-[min(72vw,900px)] lg:shrink-0">
            <Panel p={p} />
          </div>
        ))}
      </div>
    </section>
  )
}

function MoreWork() {
  return (
    <section data-shape="3" className="relative py-24 md:py-32">
      <div className={wrap}>
        <H2>More builds.</H2>
        <ul className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {moreWork.map((w) => (
            <li key={w.name} className="reveal border-t border-line pt-6">
              <h3 className="text-lg font-semibold tracking-tight">{w.name}</h3>
              <p className="mt-3 leading-relaxed text-muted">{w.desc}</p>
              <div className="mt-5 flex gap-5 text-sm">
                {w.links.map((l) => (
                  <ExtLink key={l.href} href={l.href} className="inline-flex items-center gap-1 text-fg underline-offset-4 hover:text-accent hover:underline">
                    {l.label}
                    <ArrowUpRight size={14} aria-hidden />
                  </ExtLink>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Stack() {
  return (
    <section id="stack" data-shape="4" className="relative py-24 md:py-36">
      <div className={`${wrap} grid lg:grid-cols-12`}>
        <div className="lg:col-span-7">
          <H2>Tools I reach for.</H2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            {stack.map((s) => (
              <div key={s.group} className="reveal">
                <h3 className="text-sm font-medium text-fg">{s.group}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {s.items.map((it) => (
                    <li key={it} className="rounded-full border border-line bg-ink/60 px-3 py-1 text-sm text-muted">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Credentials() {
  return (
    <section data-shape="4" className="relative py-24 md:py-32">
      <div className={`${wrap} grid gap-14 lg:grid-cols-12`}>
        <div className="reveal lg:col-span-5">
          <p className="font-mono text-sm text-muted">{education.period}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tighter md:text-4xl">{education.school}</h2>
          <p className="mt-4 leading-relaxed text-muted">{education.degree}</p>
          <ul className="mt-8 space-y-3">
            {honors.map((h) => (
              <li key={h} className="flex gap-3 leading-relaxed">
                <Check size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                {h}
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal lg:col-span-6 lg:col-start-7">
          <h3 className="text-sm font-medium">Certifications</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {certifications.map((c) => (
              <li key={c} className="rounded-full border border-line bg-ink/60 px-4 py-2 text-sm text-muted">
                {c}
              </li>
            ))}
          </ul>
          <ExtLink
            href={profile.credly}
            className="mt-6 inline-flex items-center gap-1 text-sm underline-offset-4 hover:text-accent hover:underline"
          >
            Google Cloud skill badges on Credly
            <ArrowUpRight size={14} aria-hidden />
          </ExtLink>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }
  return (
    <section id="contact" data-shape="5" className="relative flex min-h-[100dvh] flex-col justify-between pt-24">
      <div className={`${wrap} reveal my-auto text-center`}>
        <p className={eyebrow}>{profile.availability}</p>
        <H2 className="mx-auto mt-6 max-w-[16ch] !text-5xl md:!text-7xl">Let's build something that holds up.</H2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="text-lg font-medium underline decoration-accent decoration-2 underline-offset-8 transition-colors hover:text-accent md:text-2xl"
          >
            {profile.email}
          </a>
          <button
            type="button"
            onClick={copy}
            aria-label="Copy email address"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line transition-[transform,border-color] hover:border-fg/40 active:scale-[0.96]"
          >
            {copied ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? 'Email copied' : ''}
          </span>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ExtLink href={profile.linkedin} className={ghost}>
            <LinkedinLogo size={16} weight="bold" /> LinkedIn
          </ExtLink>
          <ExtLink href={profile.github} className={ghost}>
            <GithubLogo size={16} weight="bold" /> GitHub
          </ExtLink>
          <ExtLink href={profile.leetcode} className={ghost}>
            <Code size={16} weight="bold" /> LeetCode
          </ExtLink>
          <a href={profile.phoneHref} className={ghost}>
            <Phone size={16} weight="bold" /> {profile.phone}
          </a>
          <ResumeButton />
        </div>
      </div>
      <footer className={`${wrap} flex flex-col gap-2 border-t border-line py-8 text-sm text-muted md:flex-row md:justify-between`}>
        <p>{profile.address}</p>
        <p>© 2026 Sudhanshu Patil</p>
      </footer>
    </section>
  )
}

export default function App() {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const shapeRef = useRef(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cancelled = false
    // Three.js loads after first paint so the copy is never blocked on WebGL.
    import('./scene.js')
      .then(({ createScene }) => {
        if (cancelled) return
        sceneRef.current = createScene(canvasRef.current, { reduced })
        sceneRef.current.setShape(shapeRef.current)
        canvasRef.current.style.opacity = '1'
      })
      .catch(() => {}) // no WebGL: the page still reads fine without the backdrop

    document.documentElement.classList.add('motion')

    // Inertia scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis share one frame loop.
    const lenis = reduced ? null : new Lenis({ lerp: 0.09, anchors: true })
    const raf = (t) => lenis.raf(t * 1000)
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)
    }

    // Magnetic buttons: a slight pull toward the cursor, elastic release. Mouse/trackpad only.
    const off = []
    if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      document.querySelectorAll('.btn-fill').forEach((el) => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
        const move = (e) => {
          const r = el.getBoundingClientRect()
          xTo((e.clientX - r.left - r.width / 2) * 0.25)
          yTo((e.clientY - r.top - r.height / 2) * 0.35)
        }
        const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' })
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        off.push(() => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        })
      })
    }
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      // Desktop: vertical scroll pans the project track sideways while the section is pinned.
      // Created first so later triggers account for the pin's extra scroll length.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const track = document.querySelector('.work-track')
        const distance = () => track.scrollWidth - window.innerWidth
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.work-pin',
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
      })
      gsap.utils.toArray('[data-shape]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (!self.isActive) return
            shapeRef.current = +el.dataset.shape
            sceneRef.current?.setShape(shapeRef.current)
          },
        })
      })

      if (!reduced) {
        ScrollTrigger.batch('.reveal', {
          start: 'top 88%',
          once: true,
          onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out' }),
        })
        gsap.set('.word > span', { yPercent: 110 })
        ScrollTrigger.batch('.split', {
          start: 'top 90%',
          once: true,
          onEnter: (els) =>
            els.forEach((el) =>
              gsap.to(el.querySelectorAll('.word > span'), { yPercent: 0, duration: 1.1, stagger: 0.05, ease: 'expo.out' }),
            ),
        })
      }

    })

    return () => {
      cancelled = true
      ctx.revert()
      mm.revert()
      off.forEach((f) => f())
      if (lenis) {
        gsap.ticker.remove(raf)
        lenis.destroy()
      }
      sceneRef.current?.dispose()
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-0 transition-opacity duration-[1500ms]"
      />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Proof />
        <About />
        <Experience />
        <Work />
        <MoreWork />
        <Stack />
        <Credentials />
        <Contact />
      </main>
    </>
  )
}
