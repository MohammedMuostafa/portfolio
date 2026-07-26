# MOHMOS Portfolio

The source for [Mohamed Mostafa's portfolio](https://mohammedmuostafa.github.io/portfolio/). It presents MOHMOS as a Computer Science student, Web3 builder, full-stack developer, content creator, and Co-Founder and Protocol Lead at Lit Clinic.
<img width="1911" height="1115" alt="image" src="https://github.com/user-attachments/assets/c0191ab4-48c7-498a-8571-9b6bdbfade35" />




The visual identity combines a pure black background, crimson accents, game-inspired cards, subtle ambient particles, and bilingual English and Arabic content. The site is progressively enhanced: all content remains readable without JavaScript, while supported browsers receive section reveals, active navigation, language persistence, and clipboard feedback.

## Development

Requirements:

- Node.js 20 or newer
- npm 11

Install and validate:

```bash
npm install
npm run lint
npm run type-check
npm run build
npm test
```

Run the production build locally:

```bash
npm run dev
```

The development server serves `dist/`. Source styles live in `css/`; PostCSS compiles Tailwind and the local design system into `styles.css`. The build also creates compressed WebP assets and copies only production files into `dist/`.

## Structure

```text
portfolio/
|-- .github/workflows/deploy.yml  # Validation and GitHub Pages deployment
|-- assets/                       # Source and generated optimized images
|-- css/                          # Design tokens, layout, components, animations
|-- js/                           # Navigation, language, scroll, and canvas modules
|-- scripts/                      # Deterministic image and site build scripts
|-- tests/                        # Metadata, security, and asset smoke tests
|-- index.html                    # Semantic single-page portfolio
|-- robots.txt                    # Search crawler policy
|-- sitemap.xml                   # Canonical site URL
`-- site.webmanifest              # Install and theme metadata
```

## Deployment

Pushes to `main` trigger the GitHub Pages workflow. The workflow installs locked dependencies, runs linting and type checks, builds the production artifact, runs tests, and deploys `dist/` only after every check succeeds.

## Profiles

- Discord: `mohmos`
- Lit Clinic: [litclinic.xyz](https://litclinic.xyz)
- Linktree: [moh.mos](https://linktr.ee/moh.mos)
- GitHub: [MohammedMuostafa](https://github.com/MohammedMuostafa)
- X: [@mohmos](https://x.com/mohmos)
- YouTube: [@MOH-MOS](https://www.youtube.com/@MOH-MOS)
- Kick: [moh-mos](https://kick.com/moh-mos)

## Copyright

Copyright 2026 Mohamed Mostafa (MOHMOS). All rights reserved. The source is publicly visible but is not licensed for reuse.
