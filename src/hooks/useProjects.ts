import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/components/work/projects";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        fileName: row.file_name,
        folder: row.folder,
        description: row.description ?? "",
        image: row.image_url ?? "",
        techStack: row.tech_stack ?? [],
        url: row.url ?? "",
        year: row.year ?? "",
      }));
    },
  });
}
