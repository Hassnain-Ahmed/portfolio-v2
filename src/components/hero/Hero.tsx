import { Highlighter } from "@/components/ui/highlighter";
import HeroCanvas from "@/components/hero/HeroCanvas";
import HeroProjectCards from "@/components/hero/HeroProjectCards";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

const NAME_LINES = ["Hassnain", "Ahmed"];
const EASE = [0.16, 1, 0.3, 1] as const;

const stage: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE },
  },
};

// The name gets its own per-character cascade nested inside the stage.
const nameStage: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const charRise: Variants = {
  hidden: { opacity: 0, y: "0.5em", rotateX: -60 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();
  // Content is visible by default: in reduced motion we start already "shown",
  // so nothing depends on an animation firing to become visible.
  const initial = reduceMotion ? "show" : "hidden";

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] w-full items-center overflow-hidden"
      style={{ backgroundColor: "#a8432b" }}
    >
      <HeroCanvas />

      {/* Warm glow on the right balances the composition and adds depth. */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(58% 75% at 76% 42%, rgba(255,176,112,0.28), transparent 68%)",
        }}
      />

      {/* Legibility scrim — darkens the left where the copy sits. */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(100deg, rgba(52,13,4,0.72) 0%, rgba(52,13,4,0.40) 40%, rgba(52,13,4,0) 72%)",
        }}
      />

      {/* Edge vignette for cinematic depth. */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 45%, transparent 52%, rgba(38,8,2,0.5) 100%)",
        }}
      />

      <div className="relative z-[2] mx-auto flex w-full max-w-[1400px] flex-col px-6 sm:px-10 lg:px-20">
        <motion.div
          className="flex flex-col items-start lg:max-w-[48%]"
          variants={stage}
          initial={initial}
          animate="show"
        >
        <motion.span
          variants={rise}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-[#FFF1E6] backdrop-blur-sm"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FFD9A0] opacity-70 motion-reduce:hidden" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FFD9A0]" />
          </span>
          Full-Stack Developer · AI &amp; SaaS
        </motion.span>

        <motion.h1
          variants={nameStage}
          className="font-sans text-[clamp(3rem,11vw,6.75rem)] font-bold leading-[0.88] tracking-[-0.035em] text-[#FFF6EF]"
          style={{ textShadow: "0 4px 40px rgba(45,10,2,0.4)", perspective: 700 }}
        >
          {NAME_LINES.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              {line.split("").map((char, i) => (
                <motion.span
                  key={`${line}-${i}`}
                  variants={charRise}
                  className="inline-block will-change-transform"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h1>

        <motion.p
          variants={rise}
          className="mt-7 max-w-[34rem] text-lg font-medium leading-relaxed text-[#FFF1E6]/90 sm:text-xl"
        >
          I design and ship full-stack{" "}
          <Highlighter
            color="rgba(255,210,140,0.95)"
            action="underline"
            animationDuration={700}
            strokeWidth={2.5}
          >
            AI &amp; SaaS products
          </Highlighter>
          , end to end. Based in Islamabad, building worldwide.
        </motion.p>

        <motion.div variants={rise} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#work"
            className="group inline-flex items-center gap-3 rounded-full bg-[#FFF6EF] py-2.5 pl-6 pr-2.5 text-sm font-semibold text-[#8A2E17] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(45,10,2,0.35)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF6EF]"
          >
            View Work
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8A2E17]/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
            </span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-white/20 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Get in Touch
          </a>
        </motion.div>
        </motion.div>
      </div>

      {/* Project cards: full right half of the hero (100dvh × 50dvw). */}
      <div className="pointer-events-none absolute right-0 top-0 z-[2] hidden h-[100dvh] w-[50dvw] lg:block">
        <HeroProjectCards />
      </div>
    </section>
  );
}
