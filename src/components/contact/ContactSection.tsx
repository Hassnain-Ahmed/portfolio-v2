import { DottedSurface } from "@/components/ui/dotted-surface";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Github, Linkedin, Mail, MapPin, Send } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import PixelCat, { type CatHandle } from "./PixelCat";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const SOCIALS = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/Hassnain-Ahmed",
    handle: "@Hassnain-Ahmed",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/hassnain-ahmed",
    handle: "Hassnain Ahmed",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:dev.hassnain77@gmail.com",
    handle: "dev.hassnain77@gmail.com",
  },
];

function GlassCard({
  className,
  children,
  ...rest
}: {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-400/15 bg-white/5 shadow-lg shadow-black/5 backdrop-blur-[2px]",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

function ClayButton({
  children,
  type = "button",
  disabled,
  className,
  onClick,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative rounded-xl px-6 py-3 font-medium text-white transition-all duration-300",
        "bg-gradient-to-b from-purple-500 to-purple-600",
        "shadow-[0_6px_0_0_rgba(107,33,168,0.4),0_10px_20px_rgba(107,33,168,0.3)]",
        "hover:shadow-[0_4px_0_0_rgba(107,33,168,0.4),0_8px_16px_rgba(107,33,168,0.3)] hover:translate-y-[2px]",
        "active:shadow-[0_2px_0_0_rgba(107,33,168,0.4),0_4px_8px_rgba(107,33,168,0.3)] active:translate-y-[4px]",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
    >
      {children}
    </button>
  );
}

function ClayInput({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-neutral-600">{label}</label>
      <input
        {...props}
        className={cn(
          "rounded-xl border border-gray-400/20 bg-white/20 px-4 py-2.5 text-sm text-neutral-800 backdrop-blur-sm",
          "shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]",
          "outline-none transition-all duration-200",
          "placeholder:text-neutral-400",
          "focus:border-purple-300 focus:ring-2 focus:ring-purple-200/50",
        )}
      />
    </div>
  );
}

function ClayTextarea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-neutral-600">{label}</label>
      <textarea
        {...props}
        className={cn(
          "rounded-xl border border-gray-400/20 bg-white/20 px-4 py-2.5 text-sm text-neutral-800 backdrop-blur-sm",
          "shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]",
          "outline-none transition-all duration-200 resize-none",
          "placeholder:text-neutral-400",
          "focus:border-purple-300 focus:ring-2 focus:ring-purple-200/50",
        )}
      />
    </div>
  );
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const catRef = useRef<CatHandle>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Greeting fires once when section enters view (isInView stays true — safe in StrictMode)
  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      catRef.current?.say("Hey there! 👋 Got a project in mind?", 4500);
    }, 1400);
    return () => clearTimeout(timer);
  }, [isInView]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    catRef.current?.say("We'll get in touch soon! 🐾", 5000);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-neutral-50 pt-20"
    >
      <DottedSurface className="!z-0 opacity-40" />
      <PixelCat ref={catRef} />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2",
          "bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08),transparent_60%)]",
          "blur-[40px]"
        )}
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-20 pb-16 md:px-6 md:pt-16 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        >
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h2 className="font-sans text-3xl font-semibold text-neutral-900 md:text-5xl">
              Get in Touch
            </h2>
            <p className="mt-1.5 max-w-lg text-xs font-sans leading-relaxed text-neutral-600 md:mt-2 md:text-sm">
              Have a project in mind or want to collaborate? Drop me a message.
            </p>
          </div>

          {/* Content grid */}
          <div className="grid gap-6 md:grid-cols-[1fr_320px]">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                delay: 0.1,
                duration: 0.5,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              <GlassCard className="p-6 md:p-8" data-cat-node="" data-cat-xfrac="0.88">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <ClayInput
                      label="Name"
                      name="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                    <ClayInput
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <ClayInput
                    label="Subject"
                    name="subject"
                    placeholder="Project Inquiry"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                  <ClayTextarea
                    label="Message"
                    name="message"
                    placeholder="Tell me about your project..."
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />

                  <div className="mt-2 flex items-center gap-3">
                    <ClayButton type="submit" disabled={sending}>
                      <span className="flex items-center gap-2">
                        {sending ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Send Message
                          </>
                        )}
                      </span>
                    </ClayButton>

                    {sent && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium text-green-600"
                      >
                        Message sent!
                      </motion.span>
                    )}
                  </div>
                </form>
              </GlassCard>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                delay: 0.2,
                duration: 0.5,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              <GlassCard className="p-5">
                <h3 className="mb-3 text-sm font-semibold text-neutral-800">
                  Contact Info
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                      <MapPin size={14} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-700">
                        Location
                      </p>
                      <p className="text-xs text-neutral-500">
                        Islamabad, Pakistan
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                      <Mail size={14} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-700">
                        Email
                      </p>
                      <p className="text-xs text-neutral-500">
                        dev.hassnain77@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <h3 className="mb-3 text-sm font-semibold text-neutral-800">
                  Socials
                </h3>
                <div className="flex flex-col gap-2">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/20"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100/80">
                        <s.icon
                          size={14}
                          className="text-neutral-600"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-neutral-700">
                          {s.label}
                        </p>
                        <p className="truncate text-[10px] text-neutral-400">
                          {s.handle}
                        </p>
                      </div>
                      <ArrowUpRight
                        size={12}
                        className="shrink-0 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-purple-500"
                      />
                    </a>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-4">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                  </span>
                  <span className="text-xs font-medium text-neutral-700">
                    Available for freelance projects
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
