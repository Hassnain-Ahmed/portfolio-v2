import { Highlighter } from "@/components/ui/highlighter";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  const headingRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [splineLoaded, setSplineLoaded] = useState(false);

  useEffect(() => {
    const viewer = document.querySelector("spline-viewer");

    const markLoaded = () => setSplineLoaded(true);

    if (!viewer) {
      // No viewer in DOM yet — still trigger text animation
      markLoaded();
      return;
    }

    // Check if spline already loaded (cached / re-mount)
    const shadow = viewer.shadowRoot;
    const alreadyLoaded = shadow?.querySelector("canvas");
    if (alreadyLoaded) {
      markLoaded();
    } else {
      viewer.addEventListener("load", markLoaded);
    }

    // Fallback — only fires if Spline truly fails to load
    const timeout = setTimeout(markLoaded, 15000);

    // Prevent Spline's canvas from capturing wheel events
    const blockWheel = (e: WheelEvent) => {
      const path = e.composedPath();
      if (path.some((el) => (el as HTMLElement).tagName === "SPLINE-VIEWER")) {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", blockWheel, { capture: true, passive: false });

    return () => {
      viewer.removeEventListener("load", markLoaded);
      document.removeEventListener("wheel", blockWheel, true);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!splineLoaded) return;

    const ctx = gsap.context(() => {
      const chars = headingRef.current?.querySelectorAll(".char");
      if (chars) {
        gsap.fromTo(
          chars,
          { opacity: 0, y: 80, rotateX: -90 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.04,
            delay: 0.3,
          }
        );
      }

      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 1.2 }
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 1.6 }
        );
      }
    });

    return () => ctx.revert();
  }, [splineLoaded]);

  const splitText = (text: string) =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className="char inline-block opacity-0"
        style={{ perspective: "1000px" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <section
      id="hero"
      className="relative flex h-screen w-full items-center overflow-hidden"
      style={{ backgroundColor: "#D9978A" }}
    >
      {/* Spline 3D scene */}
      <div className="absolute inset-0 z-0">
        {/* @ts-expect-error - spline-viewer is a web component loaded via script tag */}
        <spline-viewer
          url="https://prod.spline.design/xrA-kmfANS9du9Rg/scene.splinecode"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Text content */}
      <div className="pointer-events-none relative z-10 flex flex-col justify-center pl-12 md:pl-16 lg:pl-24">
        <div ref={headingRef} className="overflow-hidden">
          <h1 className="font-sans text-[clamp(3rem,8vw,8rem)] font-semibold leading-[0.9] tracking-tight text-white">
            <span className="block">{splitText("Hassnain")}</span>
            <span className="block">{splitText("Ahmed")}</span>
          </h1>
        </div>

        <p
          ref={subtitleRef}
          className="mt-6 max-w-md text-base font-medium leading-relaxed tracking-wide text-white/70 opacity-0 md:text-lg"
        >
          I craft{" "}
          <Highlighter color="rgba(26, 26, 26, 0.2)" action="highlight" animationDuration={800} padding={4}>
            digital experiences
          </Highlighter>{" "}
          at the intersection of{" "}
          <Highlighter color="rgba(139,92,246,0.45)" action="underline" animationDuration={600} strokeWidth={2}>
            design
          </Highlighter>{" "}
          and{" "}
          <Highlighter color="rgba(139,92,246,0.45)" action="underline" animationDuration={600} strokeWidth={2}>
            engineering
          </Highlighter>
          .
        </p>

        <div ref={ctaRef} className="mt-10 flex gap-4 opacity-0">
          <Link
            to="/work"
            className="pointer-events-auto rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            My Work
          </Link>
          <Link
            to="/contact"
            className="pointer-events-auto rounded-full border border-white/50 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/20"
          >
            Get in Touch
          </Link>
        </div>
      </div>

      {/* <ScrollIndicator /> */}
    </section>
  );
}
