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

// Horizontal zigzag layout — nodes alternate above/below center, spaced 450px apart
export const NODE_DATA: ProcessNodeDef[] = [
  {
    id: "idea",
    position: { x: 0, y: -120 },
    data: {
      label: "Idea",
      stepNumber: 1,
      icon: "IconBulb",
      image: "/process/Pencil.webp",
      description: "A concept or problem worth solving.",
      bullets: [
        "Identify a real user pain point or opportunity",
        "Define the core value proposition in one sentence",
        "Validate feasibility and rough scope",
      ],
    },
  },
  {
    id: "research",
    position: { x: 450, y: 120 },
    data: {
      label: "Research",
      stepNumber: 2,
      icon: "IconSearch",
      image: "/process/Research.webp",
      description: "Understanding users, competitors, and context.",
      bullets: [
        "Map the competitive landscape and identify gaps",
        "Interview or survey target users for pain points",
        "Document findings into actionable requirements",
      ],
    },
  },
  {
    id: "architecture",
    position: { x: 900, y: -120 },
    data: {
      label: "Architecture",
      stepNumber: 3,
      icon: "IconLayersIntersect",
      image: "/process/Architecture.webp",
      description: "Planning system structure and technical approach.",
      bullets: [
        "Choose the tech stack based on constraints and scale",
        "Design data models, APIs, and component boundaries",
        "Establish folder structure, naming, and conventions",
      ],
    },
  },
  {
    id: "design",
    position: { x: 1350, y: 120 },
    data: {
      label: "Design",
      stepNumber: 4,
      icon: "IconPalette",
      image: "/process/Design.webp",
      description: "Creating intuitive and visually compelling interfaces.",
      bullets: [
        "Build wireframes and low-fidelity user flows",
        "Define design system tokens: colors, type, spacing",
        "Prototype high-fidelity screens for key interactions",
      ],
    },
  },
  {
    id: "development",
    position: { x: 1800, y: -120 },
    data: {
      label: "Development",
      stepNumber: 5,
      icon: "IconCode",
      image: "/process/Development.webp",
      description: "Building the application with scalable code.",
      bullets: [
        "Implement features in vertical slices (UI + logic + data)",
        "Write reusable components and shared utilities",
        "Integrate third-party APIs, auth, and storage layers",
      ],
    },
  },
  {
    id: "testing",
    position: { x: 2250, y: 120 },
    data: {
      label: "Testing",
      stepNumber: 6,
      icon: "IconTestPipe",
      image: "/process/Testing.webp",
      description: "Refining functionality and eliminating issues.",
      bullets: [
        "Write unit tests for critical business logic paths",
        "Run end-to-end tests simulating real user journeys",
        "Conduct performance audits and accessibility checks",
      ],
    },
  },
  {
    id: "launch",
    position: { x: 2700, y: 0 },
    data: {
      label: "Launch",
      stepNumber: 7,
      icon: "IconRocket",
      image: "/process/Launch.webp",
      description: "Delivering the finished product to users.",
      bullets: [
        "Deploy to production with CI/CD and monitoring",
        "Announce through relevant channels and communities",
        "Collect early feedback and plan the next iteration",
      ],
    },
  },
];

export const EDGE_DEFINITIONS: EdgeDef[] = [
  { id: "e0-1", source: "idea",         target: "research" },
  { id: "e1-2", source: "research",     target: "architecture" },
  { id: "e2-3", source: "architecture", target: "design" },
  { id: "e3-4", source: "design",       target: "development" },
  { id: "e4-5", source: "development",  target: "testing" },
  { id: "e5-6", source: "testing",      target: "launch" },
];

// Node dimensions (for setCenter calculations)
export const NODE_WIDTH = 220;
export const NODE_HEIGHT = 200;
