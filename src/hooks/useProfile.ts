import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ProfileInfo, Experience } from "@/components/about/aboutData";

interface ProfileData {
  profile: ProfileInfo;
  experience: Experience[];
  skills: string[];
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<ProfileData> => {
      const [profileRes, expRes, skillsRes] = await Promise.all([
        supabase.from("profile").select("*").single(),
        supabase.from("experience").select("*").order("sort_order"),
        supabase.from("skills").select("*").order("sort_order"),
      ]);

      if (profileRes.error) throw profileRes.error;

      const p = profileRes.data;
      const profile: ProfileInfo = {
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
      };

      const experience: Experience[] = (expRes.data ?? []).map((e) => ({
        role: e.role,
        company: e.company,
        period: e.period ?? "",
        description: e.description ?? "",
      }));

      const skills = (skillsRes.data ?? []).map((s) => s.name as string);

      return { profile, experience, skills };
    },
  });
}
