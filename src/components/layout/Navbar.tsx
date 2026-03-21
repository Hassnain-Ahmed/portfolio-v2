import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = "",
  style = {},
}) => {
  const glassStyle = {
    boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    ...style,
  };

  return (
    <div
      className={`relative flex font-semibold overflow-hidden cursor-pointer transition-all duration-700 ${className}`}
      style={glassStyle}
    >
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-inherit rounded-2xl"
        style={{
          backdropFilter: "blur(3px)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      <div
        className="absolute inset-0 z-10 rounded-inherit"
        style={{ background: "rgba(255, 255, 255, 0.08)" }}
      />
      <div
        className="absolute inset-0 z-20 rounded-inherit rounded-2xl overflow-hidden"
        style={{
          boxShadow:
            "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.4), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.4)",
        }}
      />
      <div className="relative z-30">{children}</div>
    </div>
  );
};

const GlassFilter: React.FC = () => (
  <svg style={{ display: "none" }}>
    <filter
      id="glass-distortion"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.001 0.005"
        numOctaves="1"
        seed="17"
        result="turbulence"
      />
      <feComponentTransfer in="turbulence" result="mapped">
        <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
        <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
        <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
      </feComponentTransfer>
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feSpecularLighting
        in="softMap"
        surfaceScale="5"
        specularConstant="1"
        specularExponent="100"
        lightingColor="white"
        result="specLight"
      >
        <fePointLight x="-200" y="-200" z="300" />
      </feSpecularLighting>
      <feComposite
        in="specLight"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        result="litImage"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="softMap"
        scale="200"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);

const ICON_BASE = "https://img.icons8.com/3d-fluency/94";

const NAV_ITEMS = [
  { icon: `${ICON_BASE}/home.png`, label: "Home", href: "/", bg: "linear-gradient(135deg, #60A5FA, #3B82F6)" },
  { icon: `${ICON_BASE}/briefcase.png`, label: "Work", href: "/work", bg: "linear-gradient(135deg, #FB923C, #EA580C)" },
  { icon: `${ICON_BASE}/person-male.png`, label: "About", href: "/about", bg: "linear-gradient(135deg, #34D399, #059669)" },
  { icon: `${ICON_BASE}/gear.png`, label: "Process", href: "/process", bg: "linear-gradient(135deg, #9CA3AF, #4B5563)" },
  { icon: `${ICON_BASE}/mail.png`, label: "Contact", href: "/contact", bg: "linear-gradient(135deg, #60A5FA, #2563EB)" },
  { icon: `${ICON_BASE}/quote-left.png`, label: "Testimonials", href: "/testimonials", bg: "linear-gradient(135deg, #F472B6, #DB2777)" },
  { icon: `${ICON_BASE}/github.png`, label: "GitHub", href: "https://github.com/Hassnain-Ahmed", bg: "linear-gradient(135deg, #374151, #111827)" },
  { icon: `${ICON_BASE}/linkedin.png`, label: "LinkedIn", href: "https://www.linkedin.com/in/hasnain-ahmed-869741291", bg: "linear-gradient(135deg, #38BDF8, #0A66C2)" },
];

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // On non-home pages there is no spline-viewer — show immediately
    if (location.pathname !== "/") {
      setVisible(true);
      return;
    }

    const show = () => setVisible(true);
    const viewer = document.querySelector("spline-viewer");

    if (viewer) {
      viewer.addEventListener("load", show);
    }

    // Reduced fallback: 3s instead of 15s
    const timeout = setTimeout(show, 3000);

    return () => {
      viewer?.removeEventListener("load", show);
      clearTimeout(timeout);
    };
  }, [location.pathname]);

  return (
    <>
      <GlassFilter />
      <motion.nav
        className="fixed top-4 left-1/2 z-50"
        initial={{ y: 60, opacity: 0, x: "-50%", width: 0 }}
        animate={
          visible
            ? { y: 0, opacity: 1, x: "-50%", width: "auto" }
            : { y: 60, opacity: 0, x: "-50%", width: 0 }
        }
        transition={{
          duration: 0.8,
          ease: [0.175, 0.885, 0.32, 1.1],
          width: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
        }}
      >
        <GlassEffect className="rounded-2xl px-4 py-2 hover:px-5 hover:py-3 hover:rounded-3xl">
          <div className="flex items-center justify-center gap-2 whitespace-nowrap">
            {NAV_ITEMS.map((item, index) => {
              const isExternal = item.href.startsWith("http");
              const isFirstExternal =
                isExternal &&
                (index === 0 || !NAV_ITEMS[index - 1].href.startsWith("http"));
              const isActive = !isExternal && location.pathname === item.href;
              return (
                <React.Fragment key={item.label}>
                  {isFirstExternal && (
                    <div className="mx-1 h-6 w-px bg-gray-500/40 rounded-full" />
                  )}
                  <a
                    href={item.href}
                    title={item.label}
                    {...(isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    onClick={
                      !isExternal
                        ? (e) => {
                          e.preventDefault();
                          navigate(item.href);
                        }
                        : undefined
                    }
                    className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-700 hover:scale-110 ${isActive ? "scale-110" : ""
                      }`}
                    style={{
                      transitionTimingFunction:
                        "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute -bottom-1 h-1 w-5 rounded-full bg-purple-500"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span
                      className="flex h-9 w-9 items-center justify-center shadow-md"
                      style={{
                        background: item.bg,
                        borderRadius: "22.37%",
                      }}
                    >
                      <img src={item.icon} alt={item.label} className="h-5 w-5 object-contain drop-shadow-sm" />
                    </span>
                  </a>
                </React.Fragment>
              );
            })}
          </div>
        </GlassEffect>
      </motion.nav>
    </>
  );
}
