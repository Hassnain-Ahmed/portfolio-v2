import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed right-0 top-0 z-50 h-full w-[2px] origin-top bg-accent-primary"
      style={{ scaleY }}
    />
  );
}
