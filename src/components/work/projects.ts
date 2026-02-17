export interface Project {
  id: string;
  title: string;
  fileName: string;
  folder: string;
  description: string;
  image: string;
  techStack: string[];
  url: string;
  year: string;
}

export const FOLDERS_ORDER = ["Websites","Open Source", "Experiments"];

export const projects: Project[] = [
  {
    id: "cli-tool1",
    title: "DevFlow CLI",
    fileName: "devflow.ts",
    folder: "Websites",
    description:
      "A command-line tool that automates dev workflows — scaffolding, linting configs, and CI/CD pipelines.",
    image: "/projects/devflow.png",
    techStack: ["Node.js", "TypeScript", "Commander"],
    url: "https://github.com",
    year: "2023",
  },
  {
    id: "ui-lib2",
    title: "Glass UI",
    fileName: "glass-ui.tsx",
    folder: "Websites",
    description:
      "A React component library featuring glassmorphism design tokens, animated primitives, and accessible patterns.",
    image: "/projects/glass-ui.png",
    techStack: ["React", "Storybook", "Radix", "Tailwind"],
    url: "https://github.com",
    year: "2023",
  },
  {
    id: "cli-tool",
    title: "DevFlow CLI",
    fileName: "devflow.ts",
    folder: "Open Source",
    description:
      "A command-line tool that automates dev workflows — scaffolding, linting configs, and CI/CD pipelines.",
    image: "/projects/devflow.png",
    techStack: ["Node.js", "TypeScript", "Commander"],
    url: "https://github.com",
    year: "2023",
  },
  {
    id: "ui-lib",
    title: "Glass UI",
    fileName: "glass-ui.tsx",
    folder: "Open Source",
    description:
      "A React component library featuring glassmorphism design tokens, animated primitives, and accessible patterns.",
    image: "/projects/glass-ui.png",
    techStack: ["React", "Storybook", "Radix", "Tailwind"],
    url: "https://github.com",
    year: "2023",
  },
  {
    id: "particles",
    title: "Particle Flow",
    fileName: "particles.tsx",
    folder: "Experiments",
    description:
      "A WebGL particle system that reacts to music input, built as a creative coding experiment with Three.js.",
    image: "/projects/particles.png",
    techStack: ["Three.js", "WebGL", "Web Audio API"],
    url: "https://github.com",
    year: "2024",
  },
  {
    id: "shader-art",
    title: "Shader Playground",
    fileName: "shaders.glsl",
    folder: "Experiments",
    description:
      "Interactive GLSL shader experiments exploring noise, fractals, and procedural generation in the browser.",
    image: "/projects/shaders.png",
    techStack: ["GLSL", "WebGL", "React"],
    url: "https://github.com",
    year: "2023",
  },
];

export function getProjectsByFolder(): Map<string, Project[]> {
  const map = new Map<string, Project[]>();
  for (const folder of FOLDERS_ORDER) {
    map.set(
      folder,
      projects.filter((p) => p.folder === folder)
    );
  }
  return map;
}
