import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export function useContactMessages() {
  return useQuery({
    queryKey: ["contactMessages"],
    queryFn: async (): Promise<ContactMessage[]> => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}
