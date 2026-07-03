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

/**
 * Fetch testimonials.
 * @param approvedOnly When true (public site), returns only approved
 * testimonials. Defaults to false so the admin sees all rows.
 */
export function useTestimonials(approvedOnly = false) {
  return useQuery({
    queryKey: ["testimonials", { approvedOnly }],
    queryFn: async (): Promise<Testimonial[]> => {
      let query = supabase
        .from("testimonials")
        .select("*")
        .order("sort_order");

      if (approvedOnly) {
        query = query.eq("approved", true);
      }

      const { data, error } = await query;

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
