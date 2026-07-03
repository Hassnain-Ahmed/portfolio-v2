import { useEffect, useState } from "react";
import githubJson from "./githubData.json";
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

// Build-time snapshot (scripts/fetch-github.ts) → shown instantly so the section
// never renders blank, then refreshed with a live fetch for current data.
const rawSnapshot = githubJson as unknown as {
  profile: {
    name: string;
    handle: string;
    bio: string;
    avatar: string;
    location: string;
    publicRepos: number;
  };
  languages: Language[];
  contributions: ContributionDay[][];
  totalContributions: number;
  totalCommits: number;
  repoCount: number;
};

const snapshot: GitHubData = {
  avatar: rawSnapshot.profile.avatar,
  name: rawSnapshot.profile.name,
  handle: rawSnapshot.profile.handle,
  bio: rawSnapshot.profile.bio,
  location: rawSnapshot.profile.location,
  repoCount: rawSnapshot.repoCount ?? rawSnapshot.profile.publicRepos,
  totalCommits:
    rawSnapshot.totalContributions ||
    rawSnapshot.totalCommits ||
    (rawSnapshot.repoCount ?? rawSnapshot.profile.publicRepos) * 15,
  languages: rawSnapshot.languages,
  contributions: rawSnapshot.contributions,
  totalContributions: rawSnapshot.totalContributions,
};

// Module-level cache: start from the snapshot, upgrade to live once fetched.
let cached: GitHubData = snapshot;
let fetchPromise: Promise<GitHubData | null> | null = null;

async function fetchGitHubData(): Promise<GitHubData | null> {
  const [profileRes, reposRes, contribRes] = await Promise.all([
    fetch(`https://api.github.com/users/${USERNAME}`),
    fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`),
    fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`).catch(
      () => null
    ),
  ]);

  if (!profileRes.ok || !reposRes.ok) throw new Error("GitHub API error");

  const profile = await profileRes.json();
  const repos: { fork: boolean; language: string | null; size: number }[] =
    await reposRes.json();

  // Derive languages from repo primary language + size (avoids extra API calls).
  const langBytes: Record<string, number> = {};
  for (const repo of repos) {
    if (!repo.fork && repo.language && repo.size > 0) {
      langBytes[repo.language] = (langBytes[repo.language] || 0) + repo.size;
    }
  }
  const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0);
  const languages: Language[] = Object.entries(langBytes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, bytes]) => ({
      name,
      percentage: totalBytes ? Math.round((bytes / totalBytes) * 100) : 0,
      color: LANG_COLORS[name] || "#9CA3AF",
    }));
  const sum = languages.reduce((s, l) => s + l.percentage, 0);
  if (languages.length > 0 && sum !== 100) languages[0].percentage += 100 - sum;

  // Contributions (last 12 months, grouped into weeks of 7).
  let contributions: ContributionDay[][] = [];
  let totalContributions = 0;
  if (contribRes?.ok) {
    const contribData = await contribRes.json();
    totalContributions = contribData.total?.lastYear ?? 0;
    const allDays: { date: string; count: number }[] = contribData.contributions ?? [];
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 1);
    const days = allDays.filter((d) => new Date(d.date) >= cutoff);
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

  // Fall back to the snapshot's languages/contributions if a source came back empty.
  const totalCommits = totalContributions || profile.public_repos * 15;
  return {
    avatar: profile.avatar_url || snapshot.avatar,
    name: profile.name || USERNAME,
    handle: `@${profile.login}`,
    bio: profile.bio || snapshot.bio,
    location: profile.location || snapshot.location,
    repoCount: profile.public_repos,
    totalCommits,
    languages: languages.length ? languages : snapshot.languages,
    contributions: contributions.length ? contributions : snapshot.contributions,
    totalContributions: totalContributions || snapshot.totalContributions,
  };
}

export function useGitHubData() {
  // Seeded with the snapshot → never blank on first paint.
  const [data, setData] = useState<GitHubData>(cached);

  useEffect(() => {
    if (!fetchPromise) fetchPromise = fetchGitHubData().catch(() => null);
    let cancelled = false;
    fetchPromise.then((result) => {
      if (result) {
        cached = result;
        if (!cancelled) setData(result);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading: false };
}
