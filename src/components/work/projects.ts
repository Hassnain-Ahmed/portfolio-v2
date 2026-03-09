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

export function getProjectsByFolder(projects: Project[]): Map<string, Project[]> {
  const map = new Map<string, Project[]>();
  for (const folder of FOLDERS_ORDER) {
    map.set(
      folder,
      projects.filter((p) => p.folder === folder)
    );
  }
  return map;
}
