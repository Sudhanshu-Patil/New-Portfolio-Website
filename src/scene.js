import * as THREE from 'three'

// One particle field that morphs between "chapters" as the page scrolls:
// 0 latent cloud, 1 signal waves, 2 neural net, 3 knowledge graph, 4 knot, 5 ring.

const g = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5
const lerp = (a, b, t) => a + (b - a) * t

function onSphere(r) {
  const u = Math.random() * 2 - 1
  const th = Math.random() * Math.PI * 2
  const s = Math.sqrt(1 - u * u)
  return [r * s * Math.cos(th), r * u, r * s * Math.sin(th)]
}

function cloud(n) {
  const p = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const r = Math.random() < 0.8 ? 2.3 + g() * 0.22 : 2.3 * Math.cbrt(Math.random())
    p.set(onSphere(r), i * 3)
  }
  return p
}

function signal(n) {
  const p = new Float32Array(n * 3)
  const rows = 14
  for (let i = 0; i < n; i++) {
    const row = i % rows
    const x = Math.random() * 11 - 5.5
    const env = Math.exp(-(x * x) / 14)
    const y = Math.sin(x * (0.9 + row * 0.11) + row * 0.6) * 0.75 * env
    p.set([x, y + g() * 0.02, (row / (rows - 1)) * 4 - 2], i * 3)
  }
  return p
}

function edgesFill(p, n, start, nodes, edges, jitter) {
  for (let i = start; i < n; i++) {
    const [a, b] = edges[(Math.random() * edges.length) | 0]
    const t = Math.random()
    const A = nodes[a], B = nodes[b]
    p.set([lerp(A[0], B[0], t) + g() * jitter, lerp(A[1], B[1], t) + g() * jitter, lerp(A[2], B[2], t) + g() * jitter], i * 3)
  }
}

function network(n) {
  const layers = [4, 7, 9, 7, 3]
  const nodes = [], layerIdx = []
  layers.forEach((count, l) => {
    layerIdx.push([])
    for (let k = 0; k < count; k++) {
      layerIdx[l].push(nodes.length)
      nodes.push([(l - 2) * 1.85, (k - (count - 1) / 2) * 0.58, g() * 0.15])
    }
  })
  const edges = []
  for (let l = 0; l < layers.length - 1; l++)
    for (const a of layerIdx[l]) for (const b of layerIdx[l + 1]) edges.push([a, b])
  const p = new Float32Array(n * 3)
  const onNodes = (n * 0.35) | 0
  for (let i = 0; i < onNodes; i++) {
    const c = nodes[i % nodes.length]
    p.set([c[0] + g() * 0.07, c[1] + g() * 0.07, c[2] + g() * 0.07], i * 3)
  }
  edgesFill(p, n, onNodes, nodes, edges, 0.008)
  return p
}

function graph(n) {
  const nodes = Array.from({ length: 30 }, () => [g() * 3.6, g() * 2.4, g() * 2.4])
  const edges = []
  nodes.forEach((a, i) => {
    const near = nodes
      .map((b, j) => [j, (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2])
      .filter(([j]) => j !== i)
      .sort((x, y) => x[1] - y[1])
    for (let k = 0; k < 3; k++) edges.push([i, near[k][0]])
  })
  const p = new Float32Array(n * 3)
  const onNodes = (n * 0.3) | 0
  for (let i = 0; i < onNodes; i++) {
    const c = nodes[i % nodes.length]
    const r = 0.06 + (i % 5) * 0.025
    p.set([c[0] + g() * r, c[1] + g() * r, c[2] + g() * r], i * 3)
  }
  edgesFill(p, n, onNodes, nodes, edges, 0.012)
  return p
}

function knot(n) {
  const p = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const t = Math.random() * Math.PI * 2
    const R = 1.7 + 0.7 * Math.cos(3 * t)
    p.set([R * Math.cos(2 * t) + g() * 0.16, R * Math.sin(2 * t) + g() * 0.16, 0.7 * Math.sin(3 * t) + g() * 0.16], i * 3)
  }
  return p
}

function ring(n) {
  const p = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const th = Math.random() * Math.PI * 2
    const r = Math.random() < 0.88 ? 2.7 + g() * 0.1 : Math.sqrt(Math.random()) * 2.4
    p.set([r * Math.cos(th), r * Math.sin(th), g() * 0.08], i * 3)
  }
  return p
}

const BUILDERS = [cloud, signal, network, graph, knot, ring]
// Where each chapter sits on wide screens (x, y) and how bright it is behind the copy.
const LAYOUT = [
  { x: 2.7, y: 0, o: 1 },
  { x: 0, y: -1.6, o: 0.55 },
  { x: -3.4, y: 0, o: 0.6 },
  { x: 0, y: 0, o: 0.45 },
  { x: 3.2, y: 0, o: 0.85 },
  { x: 0, y: 0, o: 0.9 },
]

function sprite() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')
  const grd = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.35, 'rgba(255,255,255,0.55)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

export function createScene(canvas, { reduced }) {
  const small = window.innerWidth < 768
  const N = small ? 3200 : 7000
  const targets = BUILDERS.map((b) => b(N))

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
  camera.position.z = 8

  const positions = targets[0].slice()
  const colors = new Float32Array(N * 3)
  const delay = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    const accent = Math.random() < 0.09
    const b = 0.35 + Math.random() * 0.65
    colors.set(accent ? [0.75, 0.89, 0.42] : [0.86 * b, 0.87 * b, 0.9 * b], i * 3)
    delay[i] = Math.random() * 0.35
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const tex = sprite()
  const mat = new THREE.PointsMaterial({
    size: small ? 0.06 : 0.05,
    map: tex,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 0,
  })
  const group = new THREE.Group()
  group.add(new THREE.Points(geo, mat))
  scene.add(group)

  let shape = 0
  let from = positions.slice()
  let morphT = Infinity
  const DUR = 1.7
  const mouse = { x: 0, y: 0 }
  const clock = new THREE.Clock()

  const layoutFor = (i) => {
    const wide = window.innerWidth / window.innerHeight > 1
    const l = LAYOUT[i]
    return wide ? { x: l.x, y: l.y, o: l.o, s: 1 } : { x: 0, y: i === 0 ? 2.3 : 0, o: l.o * (i === 0 || i === 5 ? 0.8 : 0.5), s: 0.62 }
  }

  function resize() {
    const w = window.innerWidth, h = window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    if (reduced) place(true)
  }

  function place(snap) {
    const l = layoutFor(shape)
    const k = snap ? 1 : 0.04
    group.position.x = lerp(group.position.x, l.x, k)
    group.position.y = lerp(group.position.y, l.y, k)
    group.scale.setScalar(lerp(group.scale.x, l.s, k))
    mat.opacity = lerp(mat.opacity, l.o, snap ? 1 : 0.035)
    if (snap) renderer.render(scene, camera)
  }

  function tick() {
    const t = clock.getElapsedTime()
    if (morphT !== Infinity) {
      const e = (t - morphT) / DUR
      const to = targets[shape]
      for (let i = 0; i < N; i++) {
        let k = Math.min(Math.max((e - delay[i]) / 0.65, 0), 1)
        k = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2
        const j = i * 3
        positions[j] = from[j] + (to[j] - from[j]) * k
        positions[j + 1] = from[j + 1] + (to[j + 1] - from[j + 1]) * k
        positions[j + 2] = from[j + 2] + (to[j + 2] - from[j + 2]) * k
      }
      geo.attributes.position.needsUpdate = true
      if (e >= 1) morphT = Infinity
    }
    group.rotation.y = lerp(group.rotation.y, Math.sin(t * 0.15) * 0.35 + mouse.x * 0.25, 0.05)
    group.rotation.x = lerp(group.rotation.x, Math.sin(t * 0.11) * 0.08 - mouse.y * 0.15, 0.05)
    place(false)
    renderer.render(scene, camera)
  }

  function setShape(i) {
    if (i === shape) return
    shape = i
    if (reduced) {
      positions.set(targets[i])
      geo.attributes.position.needsUpdate = true
      place(true)
      return
    }
    from = positions.slice()
    morphT = clock.getElapsedTime()
  }

  const onMove = (e) => {
    mouse.x = e.clientX / window.innerWidth - 0.5
    mouse.y = e.clientY / window.innerHeight - 0.5
  }

  resize()
  window.addEventListener('resize', resize)
  if (reduced) place(true)
  else {
    window.addEventListener('pointermove', onMove, { passive: true })
    renderer.setAnimationLoop(tick)
  }

  return {
    setShape,
    dispose() {
      renderer.setAnimationLoop(null)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      geo.dispose()
      mat.dispose()
      tex.dispose()
      renderer.dispose()
    },
  }
}
