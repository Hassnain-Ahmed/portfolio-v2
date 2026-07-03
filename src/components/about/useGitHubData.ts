import githubJson from "./githubData.json";
import type { ContributionDay, Language } from "./aboutData";

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

// GitHub data is snapshotted at build time by scripts/fetch-github.ts into
// githubData.json — no runtime API calls. Refreshes on the next rebuild.
const raw = githubJson as unknown as {
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

const repoCount = raw.repoCount ?? raw.profile.publicRepos;

const data: GitHubData = {
  avatar: raw.profile.avatar,
  name: raw.profile.name,
  handle: raw.profile.handle,
  bio: raw.profile.bio,
  location: raw.profile.location,
  repoCount,
  // Match the previous live hook: surface the year's contributions as the
  // headline "commits" number (raw.totalCommits is a much smaller raw count).
  totalCommits: raw.totalContributions || raw.totalCommits || repoCount * 15,
  languages: raw.languages,
  contributions: raw.contributions,
  totalContributions: raw.totalContributions,
};

export function useGitHubData() {
  return { data, loading: false };
}
