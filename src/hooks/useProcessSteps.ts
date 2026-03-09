import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ProcessNodeDef, EdgeDef } from "@/components/process/processData";

interface ProcessStepsResult {
  nodes: ProcessNodeDef[];
  edges: EdgeDef[];
}

function derivePosition(stepNumber: number): { x: number; y: number } {
  const x = (stepNumber - 1) * 450;
  const y = stepNumber === 7 ? 0 : stepNumber % 2 === 1 ? -120 : 120;
  return { x, y };
}

export function useProcessSteps() {
  return useQuery({
    queryKey: ["processSteps"],
    queryFn: async (): Promise<ProcessStepsResult> => {
      const { data, error } = await supabase
        .from("process_steps")
        .select("*")
        .order("step_number", { ascending: true });

      if (error) throw error;

      const rows = data ?? [];

      const nodes: ProcessNodeDef[] = rows.map((row) => ({
        id: row.label.toLowerCase(),
        position: derivePosition(row.step_number),
        data: {
          label: row.label,
          stepNumber: row.step_number,
          icon: row.icon_name,
          image: row.image_url ?? "",
          description: row.description ?? "",
          bullets: (row.bullets ?? ["", "", ""]) as [string, string, string],
        },
      }));

      const edges: EdgeDef[] = nodes.slice(0, -1).map((node, i) => ({
        id: `e${i}-${i + 1}`,
        source: node.id,
        target: nodes[i + 1].id,
      }));

      return { nodes, edges };
    },
  });
}
