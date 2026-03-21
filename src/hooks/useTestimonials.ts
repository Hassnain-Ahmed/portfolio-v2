import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar_url: string;
  rating: number;
  featured: boolean;
  approved: boolean;
  sort_order: number;
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async (): Promise<Testimonial[]> => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("sort_order");

      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id as string,
        name: row.name as string,
        role: row.role as string,
        company: row.company as string,
        content: row.content as string,
        avatar_url: (row.avatar_url as string) ?? "",
        rating: row.rating as number,
        featured: row.featured as boolean,
        approved: row.approved as boolean,
        sort_order: row.sort_order as number,
      }));
    },
  });
}
