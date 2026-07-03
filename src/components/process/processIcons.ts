import {
  IconBulb,
  IconSearch,
  IconLayersIntersect,
  IconPalette,
  IconCode,
  IconTestPipe,
  IconRocket,
  IconBrain,
  IconDatabase,
  IconServer,
  IconDevices,
  IconBug,
  IconGitBranch,
  IconTerminal,
  IconCloudComputing,
  IconApi,
  IconLock,
  IconChartBar,
  IconRefresh,
  IconSettings,
  type IconProps,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

/** Shape of a process step (static, from src/data/process-steps.json). */
export interface ProcessStep {
  id: string;
  stepNumber: number;
  label: string;
  icon: string;
  image: string;
  description: string;
  bullets: string[];
}

/** icon_name (from the DB) → Tabler icon component. */
export const PROCESS_ICONS: Record<string, ComponentType<IconProps>> = {
  IconBulb,
  IconSearch,
  IconLayersIntersect,
  IconPalette,
  IconCode,
  IconTestPipe,
  IconRocket,
  IconBrain,
  IconDatabase,
  IconServer,
  IconDevices,
  IconBug,
  IconGitBranch,
  IconTerminal,
  IconCloudComputing,
  IconApi,
  IconLock,
  IconChartBar,
  IconRefresh,
  IconSettings,
};

export function getProcessIcon(name: string): ComponentType<IconProps> {
  return PROCESS_ICONS[name] ?? IconBulb;
}
