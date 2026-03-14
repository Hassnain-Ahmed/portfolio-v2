export interface ProfileInfo {
  name: string;
  handle: string;
  title: string;
  bio: string;
  avatar: string;
  location: string;
  email: string;
  status: { emoji: string; text: string };
  highlights: string[];
}

export interface Language {
  name: string;
  percentage: number;
  color: string;
  icon_url?: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  icon: string;
}

export interface ContributionDay {
  date: string;
  count: number;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

// --- Fallback languages ---
export const defaultLanguages: Language[] = [
  { name: "TypeScript", percentage: 42, color: "#3178C6" },
  { name: "JavaScript", percentage: 22, color: "#F7DF1E" },
  { name: "Python", percentage: 14, color: "#3572A5" },
  { name: "CSS", percentage: 12, color: "#563D7C" },
  { name: "Other", percentage: 10, color: "#9CA3AF" },
];

// --- Fallback stats ---
export const defaultStats = {
  commits: 5,
  repos: 9,
};

// --- Fallback contributions ---
export function generateFallbackContributions(): ContributionDay[][] {
  const weeks: ContributionDay[][] = [];
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 52 * 7 - start.getDay());

  for (let w = 0; w < 52; w++) {
    const week: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(date.getDate() + w * 7 + d);
      const isWeekend = d === 0 || d === 6;
      const seed = w * 7 + d;
      const rand = Math.abs(Math.sin(seed * 9301 + 49297) % 1);
      let count = 0;
      if (rand > 0.3) {
        const max = isWeekend ? 5 : 12;
        count = Math.floor(rand * max);
      }
      week.push({ date: date.toISOString().split("T")[0], count });
    }
    weeks.push(week);
  }
  return weeks;
}
