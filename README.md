# Sudhanshu Patil | AI Engineer portfolio

A scroll-driven portfolio. One Three.js particle field morphs through the story as you scroll: latent cloud, signal waves, neural net, knowledge graph, knot, ring.

Stack: Vite, React, Three.js, GSAP ScrollTrigger, Lenis, Tailwind v4.

## Edit content

All copy, links and projects live in [`src/content.js`](src/content.js). The resume served on the site is `public/Sudhanshu_Patil_AI_Engineer.pdf`; replace that file to update it.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
```

## Deploy (Vercel)

Import the GitHub repo at vercel.com/new. Vercel detects Vite automatically (build `npm run build`, output `dist`). Every push to `main` redeploys.
