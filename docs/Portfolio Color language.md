# Core Psychological Palette

## 1. Environment (Atmosphere)

These create the **moody cinematic environment**.

| Token            | Color     | Psychology                  |
| ---------------- | --------- | --------------------------- |
| `--bg-void`      | `#07070A` | deep black, cinematic depth |
| `--bg-primary`   | `#0E0E11` | calm dark foundation        |
| `--bg-secondary` | `#15151A` | subtle layer separation     |
| `--bg-tertiary`  | `#1F1F26` | surfaces/cards              |

**Why this works**

Humans associate **near-black with sophistication and focus**.
It also reduces cognitive load and makes accents **feel more powerful**.

---

# 2. Surface Elevation (Depth Layers)

Used for **glassmorphism, nav bars, cards**.

| Token                | Color                    |
| -------------------- | ------------------------ |
| `--surface-glass`    | `rgba(255,255,255,0.04)` |
| `--surface-elevated` | `#1C1C22`                |
| `--surface-hover`    | `#25252E`                |
| `--border-subtle`    | `rgba(255,255,255,0.08)` |

Psychology:

Subtle surfaces help create **perceived depth**, which increases **trust and usability**.

---

# 3. Typography Colors

Text should follow **clarity hierarchy**.

| Token              | Color     |
| ------------------ | --------- |
| `--text-primary`   | `#F4F4F6` |
| `--text-secondary` | `#B6B6C3` |
| `--text-muted`     | `#7A7A89` |
| `--text-inverse`   | `#0E0E11` |

Psychology:

Light gray instead of pure white feels **premium and less harsh**.

---

# 4. Accent System (The Emotional Color)

Your accent should feel like **creative energy**, not just decoration.

### Primary Accent

| Token              | Color     |
| ------------------ | --------- |
| `--accent-primary` | `#8B5CF6` |

Psychology:

Purple represents

• creativity
• intelligence
• innovation
• luxury

Perfect for **creative developers**.

---

### Secondary Accent (Glow / Depth)

| Token            | Color                   |
| ---------------- | ----------------------- |
| `--accent-deep`  | `#6D46E8`               |
| `--accent-soft`  | `#A78BFA`               |
| `--accent-faint` | `rgba(139,92,246,0.18)` |

Use cases:

• hover glows
• progress bars
• active nav
• shader lights

---

# 5. Ambient Highlight Colors

To make the site feel **alive**, add extremely subtle secondary hues.

These should appear only in **3D lighting, particles, shaders.**

| Token              | Color     | Psychology           |
| ------------------ | --------- | -------------------- |
| `--ambient-cyan`   | `#22D3EE` | technology / digital |
| `--ambient-pink`   | `#EC4899` | creativity / art     |
| `--ambient-indigo` | `#6366F1` | intelligence         |

Use at **3–5% opacity only**.

This makes the experience feel **high-end like Apple / Lusion / Stripe**.

---

# 6. Feedback Colors

Even portfolios need these for forms and CTAs.

| Token       | Color     |
| ----------- | --------- |
| `--success` | `#22C55E` |
| `--warning` | `#F59E0B` |
| `--error`   | `#EF4444` |
| `--info`    | `#38BDF8` |

---

# Final Color Token System (Recommended)

```css
:root{

--bg-void:#07070A;
--bg-primary:#0E0E11;
--bg-secondary:#15151A;
--bg-tertiary:#1F1F26;

--surface-glass:rgba(255,255,255,0.04);
--surface-elevated:#1C1C22;
--surface-hover:#25252E;

--border-subtle:rgba(255,255,255,0.08);

--text-primary:#F4F4F6;
--text-secondary:#B6B6C3;
--text-muted:#7A7A89;

--accent-primary:#8B5CF6;
--accent-deep:#6D46E8;
--accent-soft:#A78BFA;
--accent-faint:rgba(139,92,246,0.18);

--ambient-cyan:#22D3EE;
--ambient-pink:#EC4899;
--ambient-indigo:#6366F1;

--success:#22C55E;
--warning:#F59E0B;
--error:#EF4444;
--info:#38BDF8;

}
```

---

# Psychological Color Usage Map

### Hero

background: `bg-void`

3D lighting:

* violet
* indigo
* faint cyan

---

### Navigation

glass background
border-subtle
accent underline

---

### Projects

image hover glow: `accent-faint`

---

### Scroll progress bar

`accent-primary`

---

### Magnetic button

border: `accent-primary`

hover glow: `accent-soft`

---

# Advanced Trick (Used by Award-Winning Sites)

Add **subtle gradient noise backgrounds**.

Example:

```
radial-gradient(circle at 30% 20%, #8B5CF610, transparent 60%)
```

This creates **visual richness without colorfulness**.

---

# One More Important Psychological Tip

Avoid **too much purple**.

If accent usage exceeds **8-10% of the UI**, it loses its impact.

Rule used by top designers:

```
90% neutral
8% accent
2% highlight
```

---