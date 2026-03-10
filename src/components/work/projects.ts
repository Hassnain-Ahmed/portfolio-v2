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

/**
 * Groups projects by folder, preserving the order folders first appear
 * in the input array (which should be sorted by sort_order from the DB).
 */
export function getProjectsByFolder(projects: Project[]): Map<string, Project[]> {
  const map = new Map<string, Project[]>();
  for (const p of projects) {
    const list = map.get(p.folder);
    if (list) {
      list.push(p);
    } else {
      map.set(p.folder, [p]);
    }
  }
  return map;
}
