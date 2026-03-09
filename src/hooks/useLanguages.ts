import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Language } from "@/components/about/aboutData";

export function useLanguages() {
  return useQuery({
    queryKey: ["languages"],
    queryFn: async (): Promise<Language[]> => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("sort_order");

      if (error) throw error;

      return (data ?? []).map((row) => ({
        name: row.name as string,
        percentage: row.percentage as number,
        color: row.color as string,
      }));
    },
  });
}
