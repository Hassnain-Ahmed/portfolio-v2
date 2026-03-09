export interface ProcessNodeData {
  label: string;
  stepNumber: number;
  icon: string;
  image: string;
  description: string;
  bullets: [string, string, string];
}

export interface ProcessNodeDef {
  id: string;
  position: { x: number; y: number };
  data: ProcessNodeData;
}

export interface EdgeDef {
  id: string;
  source: string;
  target: string;
}

// Node dimensions (for setCenter calculations)
export const NODE_WIDTH = 220;
export const NODE_HEIGHT = 200;
