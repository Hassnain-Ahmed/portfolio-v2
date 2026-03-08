# Portfolio Website — Complete Design & Build Plan
### Hassnain Ahmed | Creative Developer Portfolio

---

## Vision
A portfolio that IS the proof of craft. Not a resume in React — a cinematic, interactive experience where every scroll, hover, and transition whispers: "this person cares about every pixel." A potential client with taste should land here and feel compelled to reach out.

---

## Design DNA

| Decision | Choice |
|----------|--------|
| Color Mood | Dark & Moody — deep blacks (#07070A), charcoal grays (#15151A, #1F1F26) |
| Accent Color | Muted Purple / Violet (#8b5cf6 range, used sparingly for glows, highlights, active states) |
| 3D Elements | Spline 3D scene in hero section — interactive, mouse-reactive |
| Visual Effects | Aceternity UI + 21st.dev + shadcn/ui component effects (no WebGL/Three.js) |
| Scroll Feel | Hybrid — key sections pin (hero, projects, scroll video), rest flows with Lenis smooth scroll |
| Cursor/Hover | Magnetic + Sticky — elements pull toward cursor, buttons attract, text scrambles on hover |
| Typography | Elegant Serif (display) + Clean Sans (body). Cormorant Garamond + General Sans |
| Navigation | Always-visible minimal top bar |
| Project UX | Separate project detail pages via react-router-dom with Framer Motion page transitions |
| Bold Elements | Text scramble effects on hover + Scroll progress indicator (thin violet line) |
| Priority | Consistent craft throughout — no single gimmick, sustained quality across every section |
| Preloader | Counter (0 -> 100%) + horizontal curtain wipe reveal |

---

## Inspiration References

| Site | What to Study |
|------|---------------|
| **Dennis Snellenberg** | Dark moody aesthetic, magnetic interactions, serif typography, project showcases |
| **Lusion.co** | Atmospheric 3D, premium feel |
| **Bruno Simon** | 3D scene as portfolio — pushing boundaries of what a portfolio can be |
| **Locomotive.ca** | Scroll-driven storytelling, buttery smooth scroll, section pacing |
| **Brittany Chiang** | Clean, developer-focused, tasteful restraint |
| **Ayush013/folio** | GSAP + Tailwind reference implementation |

---

## Sections — Detailed Breakdown

---

### Section 1: Preloader

**Purpose**: Set the tone. Own the first 2.5 seconds.

- Black screen, percentage counter in monospace font (0 -> 100%)
- Your name "Hassnain Ahmed" centered in elegant serif — fades in at ~60%
- At 100%: horizontal curtain wipe (splits from center outward) reveals the hero
- Duration tied to real asset loading (Spline scene, fonts, critical images)
- If assets load fast, minimum 1.5s for the experience to land

**Animation details**:
- Counter: GSAP tween, eased (slow start, accelerates)
- Name: opacity 0 -> 1 with slight Y translate
- Curtain: two divs, clip-path or translateX animation, ease: power4.inOut

---

### Section 2: Navigation (Always Visible)

**Purpose**: Orientation without distraction.

**Layout**:
- Thin fixed bar at top (height: ~60px)
- Glass-morphism: `backdrop-filter: blur(12px)` with very low opacity background
- Left: "HA" initials in serif font (acts as home link)
- Center/Right: Section links in small sans-serif uppercase — WORK / ABOUT / PROCESS / CONTACT
- Far right: "Let's Talk" CTA button with subtle purple border (MagneticButton component)

**Interactions**:
- All nav links have text scramble effect on hover (useTextScramble hook)
- "Let's Talk" button has magnetic pull (useMagnetic hook) + purple glow on hover
- On scroll past hero: bar gains a darker background + 1px bottom border in violet at low opacity
- Active section highlighted with a subtle underline or color shift

---

### Section 3: Hero — "The Statement"

**Purpose**: The first real impression. Name + craft + atmosphere.

**Layout**: Full viewport height (100vh), content on the left, Spline 3D scene fills the background/right side.

**Left side (content)**:
- Your name in large serif display type, split across two lines:
  - Line 1: "Hassnain"
  - Line 2: "Ahmed"
  - Font size: ~8-12vw (massive, commanding)
- Below name: one-line descriptor in sans-serif, smaller
  - "Design Engineer & Creative Developer"
- Below that: a subtle scroll indicator (thin animated line drawing downward, or a small arrow pulsing)

**Right side / Background (Spline 3D Scene)**:
- Embedded via `@splinetool/react-spline`
- Scene URL: `https://prod.spline.design/tUu-0sPnjWyPcE9k/scene.splinecode`
- Mouse interaction handled by Spline's built-in event system
- Lazy-loaded with `React.lazy` + `Suspense` for performance
- Spline's `onLoad` callback coordinates with preloader

**Animations**:
- Text enters char-by-char (staggered, GSAP SplitText) on load after preloader
- 3D scene fades in simultaneously
- Section stays pinned briefly while intro text fades in, then releases on scroll

---

### Section 4: Introduction — "Who I Am"

**Purpose**: A human moment. Make them care about you, not just your skills.

**Layout**: Centered text block with generous whitespace (padding: ~15vh top/bottom)

**Content** (in larger serif font, ~2.5-3rem):
- "I'm a developer who believes the web should feel alive."
- "I craft interfaces where design and engineering are inseparable —"
- "where every interaction has intention."

**Animations**:
- Aceternity **Text Generate Effect** for scroll-triggered text reveal
- Aceternity **Background Beams** for subtle purple glow behind text

**Optional element**:
- Small circular photo, slightly offset to the side
- Grain/noise overlay on the photo (CSS pseudo-element)
- Photo has slight parallax (Framer Motion `useScroll` + `useTransform`)

---

### Section 5: Selected Work — "The Proof"

**Purpose**: This is where you win or lose the client. The core of the portfolio.

**Structure**: PINNED SECTION — the viewport stays fixed while projects transition within it.

#### 3 Featured Projects (full-screen treatment each)

Each project occupies the full pinned viewport:

- **Image/Video** (60% of viewport width):
  - High-quality project screenshot or video loop
  - Aceternity **3D Card Effect** on hover (perspective tilt, premium feel)
  - Image has slight scale animation on entry

- **Text content** (40% side):
  - Project title in large serif
  - Role tag in small sans caps (e.g., "DESIGN & DEVELOPMENT") — shadcn `Badge`
  - One-line description
  - "View Project" text link with magnetic hover + arrow icon that slides out on hover

- **Transitions between projects**:
  - Current image clip-paths out (or slides + scales)
  - Next image clip-paths in from opposite direction
  - Text cross-fades with stagger
  - Triggered by scroll within the pinned section (GSAP ScrollTrigger)

- **Clicking "View Project"**:
  - Framer Motion `AnimatePresence` page transition
  - Navigates to `/projects/:slug` via react-router-dom
  - Dedicated project page with: full case study, screenshots, tech stack, challenges, results, live/code links

#### Secondary Projects (after pinned section unpins)

- 2-column grid using Aceternity **Bento Grid** or shadcn Card components
- Each card: project name (serif), tech tags (shadcn Badge, monospace), thumbnail
- Aceternity **Card Spotlight** effect on hover
- Links to live site + GitHub

---

### Section 6: Scroll Video — "The Process"

**Purpose**: Your unique differentiator. Show how you work, not just what you've built.

**Structure**: PINNED SECTION — video scrubs with scroll position.

- Full-width, full-viewport video element
- Video playback is tied to scroll (scrolling forward = playing, scrolling back = reversing)
- Implementation: GSAP ScrollTrigger controlling video.currentTime

**Overlay elements**:
- Phase labels that appear at key timestamps:
  - "Discovery" (0-20%)
  - "Architecture" (20-40%)
  - "Design" (40-60%)
  - "Development" (60-80%)
  - "Launch" (80-100%)
- Each label: large serif text, Framer Motion `AnimatePresence` fade in/out
- Optional: brief one-line description beneath each phase label

**Visual treatment**:
- Subtle scan-line overlay (CSS repeating gradient) for film texture
- Fine film grain (CSS noise SVG background)
- Thin progress bar at section bottom showing video progress (fills with purple)

**End behavior**: When video reaches 100%, section unpins, next section scrolls in

---

### Section 7: Expertise — "What I Bring"

**Purpose**: Communicate capabilities without the cringe of skill bars.

**Implementation**: Aceternity **Sticky Scroll Reveal** or custom stacked horizontal bands with Framer Motion.

**Layout**: Full-width stacked horizontal bands, separated by thin lines

**Each band contains**:
- Left: Discipline title in large serif
- Right: One-line description in sans-serif
- Separated by a horizontal line that draws itself on scroll (Framer Motion)

**The four bands**:

| Title | Description |
|-------|-------------|
| Frontend Engineering | "React, Next.js, TypeScript — pixel-perfect and performant" |
| Creative Development | "GSAP, Framer Motion, Spline — the things that make a site unforgettable" |
| Backend & Systems | "APIs, databases, real-time — the invisible architecture" |
| Design Thinking | "I don't just code designs. I challenge and elevate them." |

**Interactions**:
- Hover on a band: slight vertical expansion, purple glow on the divider line
- Title text scrambles on hover (useTextScramble hook)
- Bands stagger in on scroll entry

**Rules**: No skill bars. No logo grids. No percentages. No "85% JavaScript." Just confident, clear statements.

---

### Section 8: About — "The Human"

**Purpose**: Make them want to work with YOU as a person, not just your output.

**Layout**: Asymmetric two-column
- Left (larger): Editorial photo of you — not corporate, slightly candid
- Right: Text block

**Photo treatment**:
- Slight parallax on scroll (Framer Motion `useScroll` + `useTransform`)
- Film grain overlay (CSS pseudo-element with noise texture)
- CSS filter transitions on hover (grayscale to color, subtle scale)

**Text content**:
- First person, conversational, human voice
- What drives you beyond code
- Where you're based
- Available for work / collaboration
- Keep it to 4-5 lines max

**Tech Marquee Strip**:
- Below the about section
- Aceternity **Infinite Moving Cards** component (horizontal auto-scroll)
- Monospace text: "Next.js / React / TypeScript / Node.js / GSAP / Figma / Firebase / ..."
- Low opacity, subtle — it's ambient information, not a feature

---

### Section 9: Contact — "Let's Talk"

**Purpose**: The call to action. Make reaching out feel inviting, not transactional.

**Background**: Aceternity **Spotlight** effect pointing at CTA area

**Layout**: Centered

**Headline**: Large serif — "Got a project in mind?" or "Let's build something worth remembering"
- Aceternity **Text Generate Effect** for scroll-reveal animation

**Two CTAs**:
- **Email**: Displayed as a large magnetic text link (e.g., hello@hassnain.dev)
  - Magnetic hover (useMagnetic hook)
  - Purple underline that expands on hover
- **Book a Call**: shadcn Button with magnetic hover, arrow slides out
  - Links to Calendly or similar

**Social links**: Small row beneath — GitHub, LinkedIn, Twitter/X
- Lucide icons with magnetic pull effect on each

---

### Section 10: Footer — "The Sign-Off"

**Purpose**: Clean close. Like signing a letter.

- Single line, full width, minimal padding
- Left: "Hassnain Ahmed" in serif
- Right: "Designed & Built by hand" + current year
- The scroll progress indicator (violet line) completes its journey here — reaching 100%
- Optional easter egg in tiny text: "Built with caffeine, Spline, and unreasonable attention to detail"

---

## Global Elements

### Scroll Progress Indicator
- Thin line (2-3px) on the right edge of the viewport (vertical)
- Fills with muted purple as user scrolls
- Implementation: Framer Motion `useScroll` + `motion.div` with `scaleY`
- Always visible, never obtrusive

### Magnetic Cursor Behavior
- Native cursor (no custom shape)
- Interactive elements (buttons, links, CTAs) have a magnetic pull radius
- When cursor enters the radius, the element shifts toward the cursor
- Implementation: Custom `useMagnetic` hook using Framer Motion `useMotionValue` + `useSpring`

### Text Scramble Effect
- Triggered on hover (nav links, project titles, expertise headings)
- Characters randomize through random chars for ~300ms, then resolve to actual text
- Implementation: Custom `useTextScramble` hook using requestAnimationFrame

### Image Hover Effects
- Applied to: project images, about photo
- Aceternity **3D Card Effect** (perspective tilt) for project cards
- CSS filter transitions for about photo
- No WebGL/Three.js needed

### Smooth Scroll
- Lenis smooth scroll wrapping the entire page
- GSAP ScrollTrigger synced with Lenis (lenis.on('scroll', ScrollTrigger.update))
- Smooth, buttery, consistent across all browsers

---

## Typography System

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display / Headings | Cormorant Garamond (serif) | 600-700 | Hero name, section titles, project titles |
| Body / UI | General Sans (sans) | 400-500 | Descriptions, nav links, body text |
| Code / Labels | JetBrains Mono (monospace) | 400 | Preloader counter, tech tags, marquee strip |

**Scale** (approximate):
- Hero name: 8-12vw
- Section titles: 4-6rem
- Project titles: 3-4rem
- Body text: 1-1.25rem
- Labels/tags: 0.75-0.875rem (uppercase, letter-spaced)

---

## Color System

See `Portfolio Color language.md` for the full psychological color system.

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-void` | #07070A | Main background |
| `--bg-primary` | #0E0E11 | Calm dark foundation |
| `--bg-secondary` | #15151A | Cards, nav background on scroll |
| `--bg-tertiary` | #1F1F26 | Hover states, elevated surfaces |
| `--text-primary` | #F4F4F6 | Main text |
| `--text-secondary` | #B6B6C3 | Descriptions, secondary info |
| `--text-muted` | #7A7A89 | Labels, timestamps |
| `--accent-primary` | #8B5CF6 | Primary accent (purple) |
| `--accent-soft` | #A78BFA | Lighter purple for hover states |
| `--accent-faint` | rgba(139,92,246,0.18) | Glow effects (low opacity purple) |
| `--border-subtle` | rgba(255,255,255,0.08) | Subtle dividers |

---

## Tech Stack

| Layer | Tool | Why |
|-------|------|-----|
| Framework | Vite + React 19 + TypeScript | Fast dev server, lightweight SPA |
| 3D Scene | Spline (`@splinetool/react-spline`) | Interactive 3D hero scene, no Three.js needed |
| Animation | GSAP + ScrollTrigger + SplitText | Industry standard for scroll animations, text splitting |
| Component Animation | Framer Motion | Component enter/exit, hover states, Aceternity dependency |
| UI Components | shadcn/ui + Aceternity UI + 21st.dev | Premium effects, accessible base components |
| Smooth Scroll | Lenis | Buttery smooth, lightweight, GSAP-compatible |
| Routing | react-router-dom | Client-side routing for project detail pages |
| Styling | Tailwind CSS v4 | Rapid styling, design token support |
| Fonts | Google Fonts + Fontshare | Cormorant Garamond + General Sans + JetBrains Mono |
| Deployment | Vercel | Static hosting with great performance |
| CMS / Data | Firebase or local TypeScript data files | Project data, contact form submissions |

---

## Build Order (Implementation Phases)

### Phase 1 — Foundation
- Vite + React + TypeScript project setup
- Install & configure: Tailwind v4, shadcn/ui, Lenis, GSAP, Framer Motion, react-router-dom
- Global styles: CSS variables (color tokens), font imports
- Lenis + ScrollTrigger integration
- Base Layout component with SmoothScroll provider

### Phase 2 — Reusable Utilities
- `useMagnetic` hook (Framer Motion)
- `useTextScramble` hook (requestAnimationFrame)
- `MagneticButton` component
- Scroll progress indicator (Framer Motion `useScroll`)

### Phase 3 — Navigation + Preloader
- Sticky navigation bar with glass-morphism
- Text scramble on nav links, magnetic CTA
- Preloader with GSAP counter + curtain reveal animation
- Preloader-to-hero handoff

### Phase 4 — Hero Section
- Spline 3D scene integration (lazy-loaded)
- Layout: name typography + descriptor + scroll indicator
- GSAP text reveal animations (SplitText char stagger)
- ScrollTrigger pin behavior

### Phase 5 — Introduction
- Aceternity Text Generate Effect / 21st.dev component
- Background Beams
- Optional photo with Framer Motion parallax

### Phase 6 — Selected Work (Core)
- Project data structure + TypeScript interfaces
- Pinned section with GSAP ScrollTrigger
- Aceternity 3D Card Effect for project images
- Clip-path transitions between project slides
- Project detail page + react-router-dom route (`/projects/:slug`)
- Framer Motion AnimatePresence page transitions
- Secondary projects grid

### Phase 7 — Scroll Video
- Video element with GSAP scroll-controlled playback
- Pinned section + ScrollTrigger scrubbing video.currentTime
- Phase label overlays with Framer Motion
- Film grain / scan-line overlay + progress bar

### Phase 8 — Expertise + About
- Expertise: Aceternity Sticky Scroll Reveal or custom bands with Framer Motion
- About: asymmetric layout, photo with CSS effects, Framer Motion parallax
- Tech marquee: Aceternity Infinite Moving Cards

### Phase 9 — Contact + Footer
- Contact: Aceternity Spotlight + Text Generate Effect, magnetic CTAs
- Footer with sign-off
- Global scroll progress indicator

### Phase 10 — Polish
- `prefers-reduced-motion` fallbacks for all animations
- Responsive design (mobile: static Spline fallback, touch-friendly interactions)
- Performance optimization (lazy-load Spline, compress assets, code-split)
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Lighthouse audit (target: 85+ performance)
- SEO metadata, Open Graph tags
- Final visual QA

---

## Verification Checklist

- [ ] Preloader plays smoothly, transitions into hero without jank
- [ ] Spline 3D hero scene loads, renders smoothly, responds to mouse
- [ ] Lenis smooth scroll feels buttery across all sections
- [ ] Pinned sections (hero, projects, video) pin and unpin correctly
- [ ] Text scramble works on all hover targets
- [ ] Magnetic buttons pull smoothly within radius
- [ ] Aceternity card effects work on project image hover
- [ ] Project detail pages load via router with transition animation
- [ ] Scroll video scrubs correctly (forward and backward)
- [ ] Phase labels sync with video progress
- [ ] Scroll progress indicator fills accurately
- [ ] Tech marquee scrolls infinitely
- [ ] All animations respect `prefers-reduced-motion: reduce`
- [ ] Mobile: Spline replaced with static fallback, touch interactions work
- [ ] Performance: Lighthouse > 85, no layout shifts
- [ ] Cross-browser: Chrome, Firefox, Safari, Edge all work
- [ ] SEO: proper meta tags, OG images
