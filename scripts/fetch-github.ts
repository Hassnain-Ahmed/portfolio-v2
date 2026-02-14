/**
 * Build-time script to fetch GitHub data for the About section.
 *
 * Usage:
 *   GITHUB_TOKEN=ghp_xxx npx tsx scripts/fetch-github.ts
 *
 * Writes: src/components/about/githubData.json
 */

const USERNAME = "Hassnain-Ahmed";
const TOKEN = process.env.GITHUB_TOKEN || "";

if (!TOKEN) {
  console.error("Missing GITHUB_TOKEN env var. Create a fine-grained PAT with read-only public repo access.");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

interface GitHubProfile {
  name: string;
  login: string;
  bio: string | null;
  avatar_url: string;
  location: string | null;
  public_repos: number;
  followers: number;
  html_url: string;
}

interface GitHubRepo {
  name: string;
  fork: boolean;
  languages_url: string;
  stargazers_count: number;
}

interface ContributionWeek {
  contributionDays: {
    date: string;
    contributionCount: number;
  }[];
}

interface GraphQLResponse {
  data: {
    user: {
      contributionsCollection: {
        totalCommitContributions: number;
        contributionCalendar: {
          totalContributions: number;
          weeks: ContributionWeek[];
        };
      };
    };
  };
}

async function fetchProfile(): Promise<GitHubProfile> {
  const res = await fetch(`https://api.github.com/users/${USERNAME}`, { headers });
  if (!res.ok) throw new Error(`Profile fetch failed: ${res.status}`);
  return res.json();
}

async function fetchRepos(): Promise<GitHubRepo[]> {
  const all: GitHubRepo[] = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100&page=${page}&type=owner`,
      { headers }
    );
    if (!res.ok) throw new Error(`Repos fetch failed: ${res.status}`);
    const batch: GitHubRepo[] = await res.json();
    if (batch.length === 0) break;
    all.push(...batch);
    page++;
  }
  return all.filter((r) => !r.fork);
}

async function fetchLanguages(repos: GitHubRepo[]): Promise<Record<string, number>> {
  const totals: Record<string, number> = {};
  for (const repo of repos) {
    const res = await fetch(repo.languages_url, { headers });
    if (!res.ok) continue;
    const langs: Record<string, number> = await res.json();
    for (const [lang, bytes] of Object.entries(langs)) {
      totals[lang] = (totals[lang] ?? 0) + bytes;
    }
  }
  return totals;
}

async function fetchContributions(): Promise<GraphQLResponse> {
  const query = `
    query {
      user(login: "${USERNAME}") {
        contributionsCollection {
          totalCommitContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`GraphQL fetch failed: ${res.status}`);
  return res.json();
}

async function main() {
  console.log(`Fetching GitHub data for ${USERNAME}...`);

  const [profile, repos, contribData] = await Promise.all([
    fetchProfile(),
    fetchRepos(),
    fetchContributions(),
  ]);

  // Languages
  console.log(`Fetching languages for ${repos.length} repos...`);
  const langBytes = await fetchLanguages(repos);
  const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0);

  const LANG_COLORS: Record<string, string> = {
    TypeScript: "#3178C6",
    JavaScript: "#F7DF1E",
    Python: "#3572A5",
    CSS: "#563D7C",
    HTML: "#E34C26",
    Rust: "#DEA584",
    Go: "#00ADD8",
    Java: "#B07219",
    Shell: "#89E051",
    SCSS: "#C6538C",
    Vue: "#41B883",
    Dart: "#00B4AB",
    C: "#555555",
    "C++": "#F34B7D",
    "C#": "#178600",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
  };

  const sortedLangs = Object.entries(langBytes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const topBytes = sortedLangs.reduce((s, [, b]) => s + b, 0);
  const otherBytes = totalBytes - topBytes;

  const languages = sortedLangs.map(([name, bytes]) => ({
    name,
    percentage: Math.round((bytes / totalBytes) * 100),
    color: LANG_COLORS[name] ?? "#9CA3AF",
  }));

  if (otherBytes > 0) {
    languages.push({
      name: "Other",
      percentage: Math.round((otherBytes / totalBytes) * 100),
      color: "#9CA3AF",
    });
  }

  // Ensure percentages sum to 100
  const sum = languages.reduce((s, l) => s + l.percentage, 0);
  if (sum !== 100 && languages.length > 0) {
    languages[0].percentage += 100 - sum;
  }

  // Contributions
  const calendar = contribData.data.user.contributionsCollection.contributionCalendar;
  const contributions = calendar.weeks.map((w) =>
    w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))
  );

  const totalContributions = calendar.totalContributions;
  const totalCommits = contribData.data.user.contributionsCollection.totalCommitContributions;

  // Output
  const output = {
    fetchedAt: new Date().toISOString(),
    profile: {
      name: profile.name || USERNAME,
      handle: `@${profile.login}`,
      bio: profile.bio ?? "",
      avatar: profile.avatar_url,
      location: profile.location ?? "",
      publicRepos: profile.public_repos,
      followers: profile.followers,
      url: profile.html_url,
    },
    languages,
    contributions,
    totalContributions,
    totalCommits,
    repoCount: repos.length,
  };

  const outPath = new URL("../src/components/about/githubData.json", import.meta.url);
  const fs = await import("fs");
  fs.writeFileSync(new URL(outPath), JSON.stringify(output, null, 2));
  console.log(`Wrote ${outPath.pathname}`);
  console.log(`  Profile: ${output.profile.name}`);
  console.log(`  Repos: ${output.repoCount}`);
  console.log(`  Languages: ${languages.map((l) => `${l.name} ${l.percentage}%`).join(", ")}`);
  console.log(`  Contributions: ${totalContributions}`);
  console.log(`  Commits: ${totalCommits}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
