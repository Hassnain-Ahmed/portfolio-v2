import { FileCode, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Project } from "./projects";

interface ProjectPreviewProps {
  project: Project;
}

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } },
};

export default function ProjectPreview({ project }: ProjectPreviewProps) {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      {/* Tab bar */}
      <div className="flex h-10 items-center border-b border-white/20 bg-white/30 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id + "-tab"}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex items-center gap-2 border-b-2 border-purple-500 px-3 py-2"
          >
            <FileCode size={14} className="text-blue-400" />
            <span className="font-mono text-xs text-neutral-800">
              {project.fileName}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
          className="flex-1 overflow-y-auto p-4 md:p-6"
        >
          {/* Project image */}
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-neutral-100">
            <motion.div
              className="h-full w-full"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </motion.div>
          </div>

          {/* Title + year */}
          <div className="mt-5 flex items-baseline justify-between gap-4">
            <h3 className="font-sans text-2xl font-semibold text-neutral-900">
              {project.title}
            </h3>
            <span className="font-mono text-xs text-neutral-400 shrink-0">
              {project.year}
            </span>
          </div>

          {/* Description */}
          <p className="mt-2 text-sm font-sans leading-relaxed text-neutral-700">
            {project.description}
          </p>

          {/* Tech stack */}
          <motion.div
            className="mt-4 flex flex-wrap gap-2"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
            }}
          >
            {project.techStack.map((tech) => (
              <motion.span
                key={tech}
                variants={badgeVariants}
                className="rounded-md bg-white/60 border border-neutral-200 px-2 py-1 font-mono text-xs text-neutral-600"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>

          {/* View project button */}
          <div className="mt-6">
            <motion.a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-5 py-2.5 text-sm font-medium text-neutral-900 shadow-sm"
              whileHover={{ borderColor: "#d8b4fe", boxShadow: "0 4px 16px 0 #f3e8ff" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              View Project
              <ExternalLink size={14} />
            </motion.a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
