import { useEffect, useState } from "react";
import type { ContributionDay, Language } from "./aboutData";

const USERNAME = "Hassnain-Ahmed";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3572A5",
  CSS: "#563D7C",
  HTML: "#E34C26",
  PHP: "#4F5D95",
  Shell: "#89E051",
  Dockerfile: "#384D54",
  SCSS: "#C6538C",
};

export interface GitHubData {
  avatar: string;
  name: string;
  handle: string;
  bio: string;
  location: string;
  repoCount: number;
  totalCommits: number;
  languages: Language[];
  contributions: ContributionDay[][];
  totalContributions: number;
}

// Module-level cache to prevent duplicate fetches (StrictMode, re-mounts)
let cached: GitHubData | null = null;
let fetchPromise: Promise<GitHubData | null> | null = null;

async function fetchGitHubData(): Promise<GitHubData | null> {
  const [profileRes, reposRes, contribRes] = await Promise.all([
    fetch(`https://api.github.com/users/${USERNAME}`),
    fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`),
    fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`).catch(() => null),
  ]);

  if (!profileRes.ok || !reposRes.ok) throw new Error("GitHub API error");

  const profile = await profileRes.json();
  const repos: { fork: boolean; language: string | null; size: number }[] = await reposRes.json();

  // Derive languages from repo primary language + size (avoids 20+ extra API calls)
  const langBytes: Record<string, number> = {};
  for (const repo of repos) {
    if (!repo.fork && repo.language && repo.size > 0) {
      langBytes[repo.language] = (langBytes[repo.language] || 0) + repo.size;
    }
  }

  const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0);
  const sortedLangs = Object.entries(langBytes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const languages: Language[] = sortedLangs.map(([name, bytes]) => ({
    name,
    percentage: Math.round((bytes / totalBytes) * 100),
    color: LANG_COLORS[name] || "#9CA3AF",
  }));

  // Ensure percentages sum to 100
  const sum = languages.reduce((s, l) => s + l.percentage, 0);
  if (languages.length > 0 && sum !== 100) {
    languages[0].percentage += 100 - sum;
  }

  // Contributions
  let contributions: ContributionDay[][] = [];
  let totalContributions = 0;

  if (contribRes?.ok) {
    const contribData = await contribRes.json();
    totalContributions = contribData.total?.lastYear ?? 0;

    const allDays: { date: string; count: number }[] = contribData.contributions ?? [];
    const currentYear = new Date().getFullYear();
    const days = allDays.filter((d) => new Date(d.date).getFullYear() >= currentYear);
    const weeks: ContributionDay[][] = [];
    let week: ContributionDay[] = [];
    for (const day of days) {
      week.push({ date: day.date, count: day.count });
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) weeks.push(week);
    contributions = weeks;
  }

  const totalCommits = totalContributions || profile.public_repos * 15;

  return {
    avatar: profile.avatar_url,
    name: profile.name || USERNAME,
    handle: `@${profile.login}`,
    bio: profile.bio || "",
    location: profile.location || "",
    repoCount: profile.public_repos,
    totalCommits,
    languages,
    contributions,
    totalContributions,
  };
}

export function useGitHubData() {
  const [data, setData] = useState<GitHubData | null>(cached);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) return;

    if (!fetchPromise) {
      fetchPromise = fetchGitHubData().catch(() => null);
    }

    let cancelled = false;
    fetchPromise.then((result) => {
      if (result) cached = result;
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, []);

  return { data, loading };
}
