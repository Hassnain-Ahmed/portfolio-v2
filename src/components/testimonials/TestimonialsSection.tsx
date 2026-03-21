import { useTestimonials } from "@/hooks/useTestimonials";
import type { Testimonial } from "@/hooks/useTestimonials";
import { supabase } from "@/lib/supabase";
import { Star, Terminal } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";

const COLORS = [
  "text-green-400",
  "text-cyan-400",
  "text-yellow-400",
  "text-pink-400",
  "text-purple-400",
  "text-orange-400",
];

function TerminalLine({
  testimonial,
  index,
  isInView,
}: {
  testimonial: Testimonial;
  index: number;
  isInView: boolean;
}) {
  const nameColor = COLORS[index % COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        delay: 0.3 + 0.12 * index,
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1],
      }}
      className="group"
    >
      {/* Comment line — the testimonial content */}
      <div className="flex gap-2 py-1">
        <span className="shrink-0 select-none font-mono text-xs text-neutral-600 md:text-sm">
          {String(index * 3 + 1).padStart(2, "0")}
        </span>
        <span className="font-mono text-xs text-neutral-500 md:text-sm">
          <span className="text-neutral-600">{"//"}</span>{" "}
          <span className="italic text-neutral-400 transition-colors group-hover:text-neutral-300">
            &ldquo;{testimonial.content}&rdquo;
          </span>
        </span>
      </div>

      {/* console.log line — the author */}
      <div className="flex gap-2 py-1">
        <span className="shrink-0 select-none font-mono text-xs text-neutral-600 md:text-sm">
          {String(index * 3 + 2).padStart(2, "0")}
        </span>
        <span className="font-mono text-xs md:text-sm">
          <span className="text-purple-400">console</span>
          <span className="text-neutral-500">.</span>
          <span className="text-blue-400">log</span>
          <span className="text-neutral-500">(</span>
          <span className="text-orange-300">&quot;</span>
          <span className={nameColor}>{testimonial.name}</span>
          {(testimonial.role || testimonial.company) && (
            <span className="text-neutral-500">
              {" — "}
              {testimonial.role}
              {testimonial.role && testimonial.company && ", "}
              {testimonial.company}
            </span>
          )}
          <span className="text-orange-300">&quot;</span>
          <span className="text-neutral-500">)</span>
          <span className="text-neutral-600">;</span>
          {/* Stars inline */}
          <span className="ml-3 inline-flex gap-0.5 align-middle">
            {Array.from({ length: 5 }, (_, s) => (
              <Star
                key={s}
                size={12}
                className={
                  s < testimonial.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-none text-neutral-700"
                }
              />
            ))}
          </span>
        </span>
      </div>

      {/* Empty line separator */}
      <div className="flex gap-2 py-1">
        <span className="shrink-0 select-none font-mono text-xs text-neutral-600 md:text-sm">
          {String(index * 3 + 3).padStart(2, "0")}
        </span>
      </div>
    </motion.div>
  );
}

/* ── Terminal-styled submission form ── */

interface SubmitForm {
  name: string;
  role: string;
  company: string;
  rating: number;
  content: string;
}

const emptyForm: SubmitForm = {
  name: "",
  role: "",
  company: "",
  rating: 5,
  content: "",
};

function TerminalInput({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <span className="shrink-0 font-mono text-xs text-cyan-400 md:text-sm">
        {label}:
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="flex-1 border-b border-neutral-700 bg-transparent font-mono text-xs text-green-300 outline-none placeholder:text-neutral-700 focus:border-green-500 md:text-sm"
        placeholder={`"${label.toLowerCase()}"`}
      />
    </div>
  );
}

function SubmitSection({ lineStart }: { lineStart: number }) {
  const [form, setForm] = useState<SubmitForm>({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from("testimonials").insert({
      name: form.name.trim(),
      role: form.role.trim(),
      company: form.company.trim(),
      rating: form.rating,
      content: form.content.trim(),
    });
    setSubmitting(false);

    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      setForm({ ...emptyForm });
    }
    setTimeout(() => setStatus("idle"), 4000);
  };

  const ln = (offset: number) =>
    String(lineStart + offset).padStart(2, "0");

  return (
    <form onSubmit={handleSubmit} className="mt-2 border-t border-neutral-800 pt-4">
      {/* Section header */}
      <div className="mb-3">
        <div className="flex gap-2 py-0.5">
          <span className="shrink-0 select-none font-mono text-xs text-neutral-600 md:text-sm">
            {ln(0)}
          </span>
          <span className="font-mono text-xs text-neutral-600 md:text-sm">
            <span className="text-green-600">{"/**"}</span>
          </span>
        </div>
        <div className="flex gap-2 py-0.5">
          <span className="shrink-0 select-none font-mono text-xs text-neutral-600 md:text-sm">
            {ln(1)}
          </span>
          <span className="font-mono text-xs text-green-600 md:text-sm">
            {" * "}
            <span className="text-green-500">
              Leave your own testimonial
            </span>
          </span>
        </div>
        <div className="flex gap-2 py-0.5">
          <span className="shrink-0 select-none font-mono text-xs text-neutral-600 md:text-sm">
            {ln(2)}
          </span>
          <span className="font-mono text-xs text-green-600 md:text-sm">
            {" */"}
          </span>
        </div>
      </div>

      {/* Function signature */}
      <div className="flex gap-2 py-0.5">
        <span className="shrink-0 select-none font-mono text-xs text-neutral-600 md:text-sm">
          {ln(3)}
        </span>
        <span className="font-mono text-xs md:text-sm">
          <span className="text-purple-400">testimonial</span>
          <span className="text-neutral-500">.</span>
          <span className="text-blue-400">submit</span>
          <span className="text-neutral-500">{"({"}</span>
        </span>
      </div>

      {/* Form fields */}
      <div className="ml-8 space-y-1 py-1 md:ml-12">
        <TerminalInput
          label="name"
          value={form.name}
          onChange={(v) => setForm((p) => ({ ...p, name: v }))}
          required
        />
        <TerminalInput
          label="role"
          value={form.role}
          onChange={(v) => setForm((p) => ({ ...p, role: v }))}
        />
        <TerminalInput
          label="company"
          value={form.company}
          onChange={(v) => setForm((p) => ({ ...p, company: v }))}
        />

        {/* Rating */}
        <div className="flex items-center gap-2 py-0.5">
          <span className="shrink-0 font-mono text-xs text-cyan-400 md:text-sm">
            rating:
          </span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm((p) => ({ ...p, rating: s + 1 }))}
                className="cursor-pointer transition-colors"
              >
                <Star
                  size={16}
                  className={
                    s < form.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-none text-neutral-700 hover:text-yellow-400"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="py-0.5">
          <span className="font-mono text-xs text-cyan-400 md:text-sm">
            message:
          </span>
          <textarea
            value={form.content}
            onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            required
            rows={3}
            className="mt-1 w-full resize-none border-b border-neutral-700 bg-transparent font-mono text-xs text-green-300 outline-none placeholder:text-neutral-700 focus:border-green-500 md:text-sm"
            placeholder='"your testimonial..."'
          />
        </div>
      </div>

      {/* Closing brace */}
      <div className="flex gap-2 py-0.5">
        <span className="shrink-0 select-none font-mono text-xs text-neutral-600 md:text-sm">
          {ln(4)}
        </span>
        <span className="font-mono text-xs text-neutral-500 md:text-sm">
          {"})"}
          <span className="text-neutral-600">;</span>
        </span>
      </div>

      {/* Submit button */}
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting || !form.name.trim() || !form.content.trim()}
          className="flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/10 px-4 py-1.5 font-mono text-xs text-green-400 transition-colors hover:bg-green-500/20 disabled:opacity-40 disabled:cursor-not-allowed md:text-sm"
        >
          <span className="text-neutral-600">$</span>
          {submitting ? "submitting..." : "submit --save"}
        </button>

        {status === "success" && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-mono text-xs text-green-400 md:text-sm"
          >
            // Submitted! Awaiting approval.
          </motion.span>
        )}
        {status === "error" && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-mono text-xs text-red-400 md:text-sm"
          >
            // Error. Please try again.
          </motion.span>
        )}
      </div>
    </form>
  );
}

/* ── Main section ── */

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { data: testimonials, isLoading } = useTestimonials();

  const lineCount = (testimonials?.length ?? 0) * 3;

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative min-h-screen bg-neutral-50"
    >
      <div className="mx-auto w-full max-w-6xl px-4 pt-20 pb-16 md:px-6 md:pt-16 md:pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="mb-10 md:mb-14"
        >
          <h2 className="font-sans text-3xl font-semibold text-neutral-900 md:text-5xl">
            Testimonials
          </h2>
          <p className="mt-1.5 max-w-lg text-xs font-sans leading-relaxed text-neutral-600 md:mt-2 md:text-sm">
            Kind words from clients and collaborators I&apos;ve had the pleasure
            of working with.
          </p>
        </motion.div>

        {/* Terminal shell */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            delay: 0.15,
            duration: 0.6,
            ease: [0.25, 1, 0.5, 1],
          }}
          className="overflow-hidden rounded-xl border border-white/30 bg-[#0d1117] shadow-xl shadow-black/10"
        >
          {/* Title bar */}
          <div className="flex h-10 items-center border-b border-white/10 bg-[#161b22] px-4">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: "#FF5F57" }}
              />
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: "#FEBC2E" }}
              />
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: "#28C840" }}
              />
            </div>
            <span className="flex-1 text-center font-mono text-xs text-neutral-500">
              <Terminal
                size={12}
                className="mr-1.5 inline-block align-middle"
              />
              ~/testimonials.ts
            </span>
            <div className="w-14" />
          </div>

          {/* Terminal body */}
          <div className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-700 border-t-purple-500" />
              </div>
            ) : (
              <div>
                {testimonials && testimonials.length > 0 && (
                  <>
                    {/* File header comment */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="mb-4 border-b border-neutral-800 pb-4"
                    >
                      <div className="font-mono text-xs text-neutral-600 md:text-sm">
                        <span className="text-green-600">{"/**"}</span>
                      </div>
                      <div className="font-mono text-xs text-green-600 md:text-sm">
                        {" * "}
                        <span className="text-green-500">
                          What people say about working with me
                        </span>
                      </div>
                      <div className="font-mono text-xs text-green-600 md:text-sm">
                        {" * "}
                        <span className="text-neutral-600">
                          @total {testimonials.length} reviews | @avg{" "}
                          {(
                            testimonials.reduce((a, t) => a + t.rating, 0) /
                            testimonials.length
                          ).toFixed(1)}{" "}
                          stars
                        </span>
                      </div>
                      <div className="font-mono text-xs text-green-600 md:text-sm">
                        <span>{" */"}</span>
                      </div>
                    </motion.div>

                    {/* Testimonial lines */}
                    {testimonials.map((t, i) => (
                      <TerminalLine
                        key={t.id}
                        testimonial={t}
                        index={i}
                        isInView={isInView}
                      />
                    ))}
                  </>
                )}

                {/* Submission form */}
                <SubmitSection lineStart={lineCount + 1} />

                {/* Blinking cursor */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{
                    delay: 0.3 + 0.12 * (testimonials?.length ?? 0),
                    duration: 0.3,
                  }}
                  className="mt-4 flex items-center gap-2"
                >
                  <span className="font-mono text-xs text-green-400 md:text-sm">
                    $
                  </span>
                  <span className="h-4 w-2 animate-pulse bg-green-400/70" />
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
