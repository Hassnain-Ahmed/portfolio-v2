import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Social {
  icon: string;
  label: string;
  href: string;
  handle: string;
}

export interface ContactInfo {
  location: string;
  email: string;
  availability: string;
  socials: Social[];
}

export function useContactInfo() {
  return useQuery({
    queryKey: ["contactInfo"],
    queryFn: async (): Promise<ContactInfo> => {
      const { data, error } = await supabase
        .from("contact_info")
        .select("*")
        .single();

      if (error) throw error;

      return {
        location: data.location ?? "",
        email: data.email ?? "",
        availability: data.availability ?? "",
        socials: (data.socials as Social[]) ?? [],
      };
    },
  });
}
