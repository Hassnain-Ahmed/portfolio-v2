import { createContext, useContext } from "react";
import type { GitHubData } from "./useGitHubData";

export const GitHubContext = createContext<{
  data: GitHubData | null;
  loading: boolean;
}>({ data: null, loading: true });

export function useGitHub() {
  return useContext(GitHubContext);
}
