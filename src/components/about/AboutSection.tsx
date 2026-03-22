import { WarpBackground } from "@/components/ui/warp-background";
import { useProfile } from "@/hooks/useProfile";
import { motion, useInView } from "motion/react";
import { useMemo, useRef } from "react";
import ContributionGraph from "./ContributionGraph";
import ExperienceCard from "./ExperienceCard";
import { GitHubContext } from "./GitHubContext";
import LanguageBar from "./LanguageBar";
import ProfileCard from "./ProfileCard";
import ResumeModal from "./ResumeModal";
import StatsBadges from "./StatsCard";
import { defaultStats } from "./aboutData";
import type { Stat } from "./aboutData";
import { useGitHubData } from "./useGitHubData";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const github = useGitHubData();
  const { data: profileData, isLoading: profileLoading } = useProfile();

  const stats: Stat[] = useMemo(() => [
    {
      label: "Commits",
      value: github.data?.totalCommits ?? defaultStats.commits,
      icon: "git-commit-horizontal",
    },
    {
      label: "Projects",
      value: github.data?.repoCount ?? defaultStats.repos,
      icon: "folder-git-2",
    },
    { label: "Years Coding", value: 3, suffix: "+", icon: "calendar" },
    { label: "Clients Served", value: 5, suffix: "+", icon: "users" },
  ], [github.data]);

  return (
    <GitHubContext.Provider value={github}>
      <section
        id="about"
        ref={sectionRef}
        className="relative min-h-screen"
      >
        <WarpBackground
          className="min-h-screen bg-neutral-50 !rounded-none !border-0 !p-0"
          perspective={250}
          beamsPerSide={2}
          beamSize={6}
          beamDelayMax={5}
          beamDelayMin={0}
          beamDuration={6}
          gridColor="rgba(0, 0, 0, 0.1)"
        >
          <div className="mx-auto w-full max-w-6xl px-4 pt-20 pb-10 md:px-6 md:pt-16 md:pb-16">
            {github.loading || profileLoading ? (
              <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-purple-500" />
              </div>
            ) : (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            >
              <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end md:justify-between md:gap-4">
                <div>
                  <h2 className="font-sans text-3xl font-semibold text-neutral-900 md:text-5xl">
                    About
                  </h2>
                  <p className="mt-1.5 max-w-lg text-xs font-sans leading-relaxed text-neutral-600 md:mt-2 md:text-sm">
                    A snapshot of my coding journey, experience, and contributions.
                  </p>
                </div>
                {/* Stats badges */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.15, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                >
                  <StatsBadges stats={stats} />
                </motion.div>
              </div>

              {/* Two-column layout */}
              <div className="mt-6 grid gap-4 md:mt-8 md:gap-5 md:grid-cols-[260px_1fr]">
                {/* Sidebar */}
                <motion.div
                  className="flex flex-col gap-4 md:gap-5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                >
                  <ProfileCard
                    profile={profileData?.profile}
                    skills={profileData?.skills}
                  />
                  <ResumeModal resumeUrl={profileData?.profile.resume_url} />
                </motion.div>

                {/* Main — bento grid */}
                <motion.div
                  className="grid gap-4 md:gap-5 md:grid-cols-[1fr_auto]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                >
                  <div className="min-w-0">
                    <ContributionGraph />
                  </div>
                  <div className="md:row-span-2 md:h-full">
                    <LanguageBar />
                  </div>
                  <div className="min-w-0">
                    <ExperienceCard experience={profileData?.experience} />
                  </div>
                </motion.div>
              </div>
            </motion.div>
            )}
          </div>
        </WarpBackground>
      </section>
    </GitHubContext.Provider>
  );
}
