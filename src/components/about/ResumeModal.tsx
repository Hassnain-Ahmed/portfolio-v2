import { Download, Eye, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const RESUME_URL = "/resume.pdf";

export default function ResumeModal() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      {/* Two buttons side by side */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-400/40 bg-white/15 p-3 font-mono text-xs font-medium text-neutral-700 shadow-lg shadow-black/5 backdrop-blur-md transition-all hover:bg-white/25 hover:text-neutral-900 active:scale-[0.97]"
        >
          <Eye size={14} className="text-purple-500" />
          View
        </button>
        <a
          href={RESUME_URL}
          download
          className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 p-3 font-mono text-xs font-medium text-white shadow-lg shadow-purple-500/25 transition-all hover:bg-purple-700 hover:shadow-purple-500/35 active:scale-[0.97]"
        >
          <Download size={14} />
          Resume
        </a>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Content */}
            <motion.div
              className="relative flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
                <span className="font-mono text-sm font-medium text-neutral-700">
                  Resume
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={RESUME_URL}
                    download
                    className="rounded-lg bg-purple-600 px-3 py-1.5 font-mono text-xs font-medium text-white transition-colors hover:bg-purple-700"
                  >
                    <Download size={12} className="inline mr-1" />
                    Download
                  </a>
                  <button
                    onClick={close}
                    className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* PDF embed */}
              <div className="flex-1 bg-neutral-100">
                <iframe
                  src={RESUME_URL}
                  title="Resume"
                  className="h-full w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
