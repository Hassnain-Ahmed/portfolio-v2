/**
 * Build-time script: snapshot all PUBLIC Supabase data into static JSON so the
 * public site makes zero runtime data calls. Mirrors the shapes returned by the
 * runtime hooks in src/hooks/*.ts (which stay live for the admin).
 *
 * Usage:
 *   npx tsx scripts/prefetch-supabase.ts
 *
 * Reads VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY from the environment, falling
 * back to the local .env file. Writes src/data/*.json.
 */
import { createClient } from "@supabase/supabase-js";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "src/data");

// Load .env (KEY=VALUE lines) into process.env when not already set — tsx does
// not auto-load it, and Vercel injects these vars directly.
function loadDotEnv() {
  const envPath = resolve(ROOT, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadDotEnv();

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !anonKey) {
  console.error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.");
  process.exit(1);
}

const supabase = createClient(url, anonKey);

function write(name: string, data: unknown) {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(resolve(OUT_DIR, name), JSON.stringify(data, null, 2) + "\n");
  const count = Array.isArray(data) ? `${data.length} rows` : "ok";
  console.log(`  ✓ ${name} (${count})`);
}

async function run() {
  console.log("Prefetching public Supabase data → src/data/ …");

  // profile.json — profile + experience + skills (mirrors useProfile.ts)
  {
    const [profileRes, expRes, skillsRes] = await Promise.all([
      supabase.from("profile").select("*").single(),
      supabase.from("experience").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("sort_order"),
    ]);
    if (profileRes.error) throw profileRes.error;
    const p = profileRes.data;
    write("profile.json", {
      profile: {
        name: p.name ?? "",
        handle: p.handle ?? "",
        title: p.title ?? "",
        bio: p.bio ?? "",
        avatar: p.avatar_url ?? "",
        location: p.location ?? "",
        email: p.email ?? "",
        status: { emoji: p.status_emoji ?? "", text: p.status_text ?? "" },
        highlights: p.highlights ?? [],
        resume_url: (p.resume_url as string) ?? "",
      },
      experience: (expRes.data ?? []).map((e) => ({
        role: e.role,
        company: e.company,
        period: e.period ?? "",
        description: e.description ?? "",
      })),
      skills: (skillsRes.data ?? []).map((s) => s.name as string),
    });
  }

  // projects.json (public, non-hidden) + hero-projects.json (featured, ordered).
  {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    const rows = data ?? [];
    const mapProject = (row: any) => ({
      id: row.id,
      title: row.title,
      fileName: row.file_name,
      folder: row.folder,
      description: row.description ?? "",
      image: row.image_url ?? "",
      techStack: row.tech_stack ?? [],
      url: row.url ?? "",
      year: row.year ?? "",
      hidden: row.hidden ?? false,
    });

    write(
      "projects.json",
      rows.filter((row) => !(row.hidden ?? false)).map(mapProject)
    );

    // Featured hero-slider projects (admin-selected), ordered by hero_order.
    write(
      "hero-projects.json",
      rows
        .filter((row) => row.hero_order !== null && row.hero_order !== undefined)
        .sort((a, b) => (a.hero_order ?? 0) - (b.hero_order ?? 0))
        .map(mapProject)
    );
  }

  // process-steps.json — ordered steps for the vertical timeline
  {
    const { data, error } = await supabase
      .from("process_steps")
      .select("*")
      .order("step_number", { ascending: true });
    if (error) throw error;
    write(
      "process-steps.json",
      (data ?? []).map((row) => ({
        id: row.id,
        stepNumber: row.step_number,
        label: row.label,
        icon: row.icon_name,
        image: row.image_url ?? "",
        description: row.description ?? "",
        bullets: (row.bullets ?? []).filter(Boolean),
      }))
    );
  }

  // testimonials.json — approved only, ordered (mirrors useTestimonials(true))
  {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("approved", true)
      .order("sort_order");
    if (error) throw error;
    write(
      "testimonials.json",
      (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        role: row.role,
        company: row.company,
        content: row.content,
        avatar_url: row.avatar_url ?? "",
        rating: row.rating,
        featured: row.featured,
        approved: row.approved,
        sort_order: row.sort_order,
      }))
    );
  }

  // contact-info.json — single row (mirrors useContactInfo.ts)
  {
    const { data, error } = await supabase
      .from("contact_info")
      .select("*")
      .single();
    if (error) throw error;
    write("contact-info.json", {
      location: data.location ?? "",
      email: data.email ?? "",
      availability: data.availability ?? "",
      socials: data.socials ?? [],
    });
  }

  // languages.json — ordered (mirrors useLanguages.ts)
  {
    const { data, error } = await supabase
      .from("languages")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    write(
      "languages.json",
      (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        percentage: row.percentage,
        color: row.color,
        icon_url: row.icon_url ?? "",
        sort_order: row.sort_order,
      }))
    );
  }

  console.log("Done.");
}

run().catch((err) => {
  console.error("prefetch-supabase failed:", err);
  process.exit(1);
});
