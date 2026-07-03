import { motion, useReducedMotion } from "motion/react";

// +92 310 3582990 (WhatsApp click-to-chat) with a friendly pre-filled message
// so visitors can just hit send.
const WA_MESSAGE =
  "Hi Hassnain! 👋 I came across your portfolio and I'd love to chat about a project.";
const WA_URL = `https://wa.me/923103582990?text=${encodeURIComponent(WA_MESSAGE)}`;

export default function WhatsAppButton() {
  const reduce = useReducedMotion();

  return (
    <motion.a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      initial={reduce ? false : { opacity: 0, scale: 0.6, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.4 }}
      className="group fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.6)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
      style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
    >
      {/* Pulse ring */}
      <span
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 motion-reduce:hidden"
        style={{ animation: "wa-ping 2.4s cubic-bezier(0,0,0.2,1) infinite" }}
        aria-hidden="true"
      />
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="relative h-6 w-6 sm:h-7 sm:w-7"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    </motion.a>
  );
}
