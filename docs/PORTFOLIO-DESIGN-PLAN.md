# Portfolio Website — Complete Design & Build Plan
### Hassnain Ahmed | Creative Developer Portfolio

---

## Vision
A portfolio that IS the proof of craft. Not a resume in React — a cinematic, interactive experience where every scroll, hover, and transition whispers: "this person cares about every pixel." A potential client with taste should land here and feel compelled to reach out.

---

## Design DNA

| Decision | Choice |
|----------|--------|
| Color Mood | Dark & Moody — deep blacks (#0a0a0a), charcoal grays (#1a1a1a, #2a2a2a) |
| Accent Color | Muted Purple / Violet (#8b5cf6 range, used sparingly for glows, highlights, active states) |
| 3D Elements | Floating Code/Tech Scene in hero + Subtle WebGL shader touches on images throughout |
| Scroll Feel | Hybrid — key sections pin (hero, projects, scroll video), rest flows with Lenis smooth scroll |
| Cursor/Hover | Magnetic + Sticky — elements pull toward cursor, buttons attract, text scrambles on hover |
| Typography | Elegant Serif (display) + Clean Sans (body). E.g., Cormorant Garamond + General Sans |
| Navigation | Always-visible minimal top bar |
| Project UX | Full cinematic page transitions (image scales to fill viewport, content loads beneath) |
| Bold Elements | Text scramble effects on hover + Scroll progress indicator (thin violet line) |
| Priority | Consistent craft throughout — no single gimmick, sustained quality across every section |
| Preloader | Counter (0 -> 100%) + horizontal curtain wipe reveal |

---

## Inspiration References

| Site | What to Study |
|------|---------------|
| **Dennis Snellenberg** | Dark moody aesthetic, magnetic interactions, serif typography, project showcases |
| **Lusion.co** | WebGL meets design, atmospheric 3D, premium feel |
| **Bruno Simon** | 3D scene as portfolio — pushing boundaries of what a portfolio can be |
| **Locomotive.ca** | Scroll-driven storytelling, buttery smooth scroll, section pacing |
| **OHZI Interactive** | Awwwards SOTD — cursor-driven WebGL distortions, developer craft |
| **Jordan Breton** | Floating 3D scene portfolio, FWA Site of the Day |
| **Brittany Chiang** | Clean, developer-focused, tasteful restraint |
| **Ayush013/folio** | Next.js + GSAP + Tailwind reference implementation |

---

## Sections — Detailed Breakdown

---

### Section 1: Preloader

**Purpose**: Set the tone. Own the first 2.5 seconds.

- Black screen, percentage counter in monospace font (0 -> 100%)
- Your name "Hassnain Ahmed" centered in elegant serif — fades in at ~60%
- At 100%: horizontal curtain wipe (splits from center outward) reveals the hero
- Duration tied to real asset loading (Three.js scene, fonts, critical images)
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
- Far right: "Let's Talk" CTA button with subtle purple border

**Interactions**:
- All nav links have text scramble effect on hover (chars randomize, then resolve)
- "Let's Talk" button has magnetic pull (moves toward cursor within ~50px radius) + purple glow on hover
- On scroll past hero: bar gains a darker background + 1px bottom border in violet at low opacity
- Active section highlighted with a subtle underline or color shift

---

### Section 3: Hero — "The Statement"

**Purpose**: The first real impression. Name + craft + atmosphere.

**Layout**: Full viewport height (100vh), content on the left, 3D scene fills the background/right side.

**Left side (content)**:
- Your name in large serif display type, split across two lines:
  - Line 1: "Hassnain"
  - Line 2: "Ahmed"
  - Font size: ~8-12vw (massive, commanding)
- Below name: one-line descriptor in sans-serif, smaller
  - "Design Engineer & Creative Developer"
- Below that: a subtle scroll indicator (thin animated line drawing downward, or a small arrow pulsing)

**Right side / Background (3D scene via React Three Fiber)**:
- Floating elements in 3D space:
  - Code block fragments (semi-transparent planes with code text textures)
  - Wireframe UI components (rectangles, cards, buttons in wireframe)
  - Abstract geometric shapes (icosahedrons, torus knots) with glass/metallic materials
- Soft purple volumetric/point lighting casting subtle glows
- Fine particle dust drifting through the scene
- All elements gently rotate and drift
- **Mouse interaction**: Scene responds to cursor position — subtle parallax (elements shift based on mouse X/Y)

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
- Each line reveals on scroll using GSAP SplitText + ScrollTrigger
- Lines go from opacity 0 + slight Y offset -> fully visible, staggered
- A subtle purple gradient glow traces behind the text as it reveals (CSS gradient or canvas)

**Optional element**:
- Small circular photo, slightly offset to the side
- Grain/noise overlay on the photo
- Photo has slight parallax (moves at different scroll speed than text)

---

### Section 5: Selected Work — "The Proof"

**Purpose**: This is where you win or lose the client. The core of the portfolio.

**Structure**: PINNED SECTION — the viewport stays fixed while projects transition within it.

#### 3 Featured Projects (full-screen treatment each)

Each project occupies the full pinned viewport:

- **Image/Video** (60% of viewport width):
  - High-quality project screenshot or video loop
  - WebGL displacement shader on hover (ripple/distortion effect)
  - Image has slight scale animation on entry

- **Text content** (40% side):
  - Project title in large serif
  - Role tag in small sans caps (e.g., "DESIGN & DEVELOPMENT")
  - One-line description
  - "View Project" text link with magnetic hover + arrow icon that slides out on hover

- **Transitions between projects**:
  - Current image clip-paths out (or slides + scales)
  - Next image clip-paths in from opposite direction
  - Text cross-fades with stagger
  - Triggered by scroll within the pinned section

- **Clicking "View Project"**:
  - Full-page cinematic transition
  - The project image scales up to fill the entire viewport
  - Background fades to project's color theme
  - Page content slides in from bottom
  - Dedicated project page with: full case study, more screenshots, tech stack, challenges, results, live/code links

#### Secondary Projects (after pinned section unpins)

- 2-column minimal grid
- Each card: project name (serif), tech tags (monospace, small), thumbnail
- Thumbnail has WebGL distortion on hover
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
- Each label: large serif text, fades in + slight Y translate, holds, fades out
- Optional: brief one-line description beneath each phase label

**Visual treatment**:
- Subtle scan-line overlay (CSS repeating gradient) for film texture
- Fine film grain (CSS noise or canvas)
- Thin progress bar at section bottom showing video progress (fills with purple)

**End behavior**: When video reaches 100%, section unpins, next section scrolls in

---

### Section 7: Expertise — "What I Bring"

**Purpose**: Communicate capabilities without the cringe of skill bars.

**Layout**: Full-width stacked horizontal bands, separated by thin lines

**Each band contains**:
- Left: Discipline title in large serif
- Right: One-line description in sans-serif
- Separated by a horizontal line that draws itself on scroll (width: 0 -> 100%, GSAP)

**The four bands**:

| Title | Description |
|-------|-------------|
| Frontend Engineering | "React, Next.js, TypeScript — pixel-perfect and performant" |
| Creative Development | "Three.js, GSAP, WebGL — the things that make a site unforgettable" |
| Backend & Systems | "APIs, databases, real-time — the invisible architecture" |
| Design Thinking | "I don't just code designs. I challenge and elevate them." |

**Interactions**:
- Hover on a band: slight vertical expansion, purple glow on the divider line
- Title text scrambles on hover (chars randomize -> resolve)
- Bands stagger in on scroll entry

**Rules**: No skill bars. No logo grids. No percentages. No "85% JavaScript." Just confident, clear statements.

---

### Section 8: About — "The Human"

**Purpose**: Make them want to work with YOU as a person, not just your output.

**Layout**: Asymmetric two-column
- Left (larger): Editorial photo of you — not corporate, slightly candid
- Right: Text block

**Photo treatment**:
- Slight parallax on scroll (moves slower than text)
- Film grain overlay (CSS or canvas)
- Subtle RGB split or displacement shader on scroll (WebGL)

**Text content**:
- First person, conversational, human voice
- What drives you beyond code
- Where you're based
- Available for work / collaboration
- Keep it to 4-5 lines max

**Optional — Tech Marquee Strip**:
- Below the about section
- Infinite horizontal scroll (auto, CSS animation or GSAP)
- Monospace text: "Next.js / React / Three.js / TypeScript / Node.js / GSAP / Figma / Firebase / ..."
- Low opacity, subtle — it's ambient information, not a feature

---

### Section 9: Contact — "Let's Talk"

**Purpose**: The call to action. Make reaching out feel inviting, not transactional.

**Background**: Subtle shift — slightly lighter dark or a purple-tinted gradient to signal "we're at the end"

**Layout**: Centered

**Headline**: Large serif — "Got a project in mind?" or "Let's build something worth remembering"
- Text-reveal animation on scroll entry (split text, chars stagger in)

**Two CTAs**:
- **Email**: Displayed as a large magnetic text link (e.g., hello@hassnain.dev)
  - Magnetic hover (text follows cursor within radius)
  - Purple underline that expands on hover
- **Book a Call**: Clean button, magnetic hover, arrow slides out
  - Links to Calendly or similar

**Social links**: Small row beneath — GitHub, LinkedIn, Twitter/X
- Icon-only, with magnetic pull effect on each

---

### Section 10: Footer — "The Sign-Off"

**Purpose**: Clean close. Like signing a letter.

- Single line, full width, minimal padding
- Left: "Hassnain Ahmed" in serif
- Right: "Designed & Built by hand" + current year
- The scroll progress indicator (violet line) completes its journey here — reaching 100%
- Optional easter egg in tiny text: "Built with caffeine, Three.js, and unreasonable attention to detail"

---

## Global Elements

### Scroll Progress Indicator
- Thin line (2-3px) on the right edge of the viewport (vertical) OR top edge (horizontal)
- Fills with muted purple as user scrolls
- Starts at 0% (top), reaches 100% at footer
- Always visible, never obtrusive

### Magnetic Cursor Behavior
- Native cursor (no custom shape)
- Interactive elements (buttons, links, CTAs) have a magnetic pull radius (~50px)
- When cursor enters the radius, the element shifts toward the cursor
- On hover over project images: a subtle blend-mode circle (mix-blend-mode: difference) appears
- Implementation: GSAP with mousemove listener, lerped positioning

### Text Scramble Effect
- Triggered on hover (nav links, project titles, expertise headings)
- Characters randomize through random chars for ~300ms, then resolve to actual text
- Implementation: Custom function cycling through chars with requestAnimationFrame, or GSAP TextPlugin

### WebGL Image Hover Distortion
- Applied to: project images, about photo
- On hover: subtle displacement/ripple effect (vertex displacement or UV distortion shader)
- Implementation: R3F mesh with custom shader material, or a dedicated ImageDistortion component

### Smooth Scroll
- Lenis smooth scroll wrapping the entire page
- GSAP ScrollTrigger synced with Lenis (using lenis.on('scroll', ScrollTrigger.update))
- Smooth, buttery, consistent across all browsers

---

## Typography System

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display / Headings | Cormorant Garamond (serif) | 600-700 | Hero name, section titles, project titles |
| Body / UI | General Sans or Satoshi (sans) | 400-500 | Descriptions, nav links, body text |
| Code / Labels | JetBrains Mono (monospace) | 400 | Preloader counter, tech tags, marquee strip |

**Scale** (approximate):
- Hero name: 8-12vw
- Section titles: 4-6rem
- Project titles: 3-4rem
- Body text: 1-1.25rem
- Labels/tags: 0.75-0.875rem (uppercase, letter-spaced)

---

## Color System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | #0a0a0a | Main background |
| `--bg-secondary` | #141414 | Cards, nav background on scroll |
| `--bg-elevated` | #1a1a1a | Hover states, elevated surfaces |
| `--text-primary` | #fafafa | Main text |
| `--text-secondary` | #a0a0a0 | Descriptions, secondary info |
| `--text-muted` | #666666 | Labels, timestamps |
| `--accent` | #8b5cf6 | Primary accent (purple) |
| `--accent-glow` | #8b5cf620 | Glow effects (low opacity purple) |
| `--accent-hover` | #a78bfa | Lighter purple for hover states |
| `--border` | #ffffff10 | Subtle dividers |

---

## Tech Stack

| Layer | Tool | Why |
|-------|------|-----|
| Framework | Next.js 15 (App Router) | SSR, file-based routing, optimized builds |
| 3D Engine | React Three Fiber + Drei | Declarative Three.js in React, helper components |
| Animation | GSAP + ScrollTrigger + SplitText | Industry standard for scroll animations, text splitting |
| Smooth Scroll | Lenis | Buttery smooth, lightweight, GSAP-compatible |
| Styling | Tailwind CSS v4 | Rapid styling, design token support |
| Fonts | Self-hosted or Google Fonts | Cormorant Garamond + General Sans |
| Deployment | Vercel | Zero-config Next.js hosting |
| CMS / Data | Firebase (existing) or MDX files | Project data, contact form submissions |
| Analytics | Vercel Analytics (existing) | Lightweight, privacy-focused |

---

## Build Order (Implementation Phases)

### Phase 1 — Foundation
- Next.js project setup (clean, remove existing generic components)
- Install & configure: Lenis, GSAP (ScrollTrigger, SplitText), React Three Fiber, Drei
- Global styles: CSS variables (color tokens), font imports, Tailwind config
- Lenis + ScrollTrigger integration
- Base layout component

### Phase 2 — Navigation + Preloader
- Sticky navigation bar with glass-morphism
- Magnetic button component (reusable)
- Text scramble utility function
- Preloader with counter + curtain reveal animation

### Phase 3 — Hero Section
- Layout: name typography + descriptor + scroll indicator
- GSAP text reveal animations (SplitText char stagger)
- R3F 3D scene: floating code blocks, wireframes, geometric shapes
- Mouse-reactive parallax in 3D scene
- Purple volumetric lighting + particle dust
- Pin behavior with ScrollTrigger

### Phase 4 — Introduction
- Centered text layout
- Scroll-triggered line-by-line text reveal
- Optional photo with parallax + grain

### Phase 5 — Selected Work (Core)
- Pinned section with ScrollTrigger
- Project data structure (Firebase or local)
- Individual project slides with image + text
- WebGL image distortion component (hover shader)
- Slide transitions (clip-path / GSAP FLIP)
- Full-page transition to project detail page
- Project detail page template
- Secondary projects grid

### Phase 6 — Scroll Video
- Video element with scroll-controlled playback
- Pinned section + ScrollTrigger scrubbing video.currentTime
- Phase label overlays with scroll-synced fade in/out
- Progress bar
- Film grain / scan-line overlay

### Phase 7 — Expertise + About
- Expertise: stacked bands, line-draw animation, hover interactions
- About: asymmetric layout, photo with shader effect, text
- Tech marquee strip (infinite scroll)

### Phase 8 — Contact + Footer
- Contact section with CTAs, magnetic elements
- Footer with sign-off
- Scroll progress indicator (global)

### Phase 9 — Polish
- Page transition animations (project list <-> detail)
- `prefers-reduced-motion` fallbacks for all animations
- Responsive design (mobile: simplify 3D, adapt interactions to touch)
- Performance optimization (lazy-load 3D, compress assets, code-split)
- Cross-browser testing (Chrome, Firefox, Safari)
- Lighthouse audit (target: 85+ performance)
- SEO metadata, Open Graph tags
- Final visual QA

---

## Verification Checklist

- [ ] Preloader plays smoothly, transitions into hero without jank
- [ ] 3D hero scene renders at 60fps, responds to mouse
- [ ] Lenis smooth scroll feels buttery across all sections
- [ ] Pinned sections (hero, projects, video) pin and unpin correctly
- [ ] Text scramble works on all hover targets
- [ ] Magnetic buttons pull smoothly within radius
- [ ] WebGL image distortion activates on project image hover
- [ ] Project page transition is cinematic (image scales to fill viewport)
- [ ] Scroll video scrubs correctly (forward and backward)
- [ ] Phase labels sync with video progress
- [ ] Scroll progress indicator fills accurately
- [ ] All animations respect `prefers-reduced-motion: reduce`
- [ ] Mobile: 3D simplified/removed, touch interactions work
- [ ] Performance: Lighthouse > 85, no layout shifts
- [ ] Cross-browser: Chrome, Firefox, Safari all work
- [ ] SEO: proper meta tags, OG images, sitemap
