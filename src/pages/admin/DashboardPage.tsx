import { useProjects } from "@/hooks/useProjects";
import { useProcessSteps } from "@/hooks/useProcessSteps";
import { useProfile } from "@/hooks/useProfile";
import { Briefcase, Settings, User, Wrench } from "lucide-react";

export default function DashboardPage() {
  const { data: projects } = useProjects();
  const { data: process } = useProcessSteps();
  const { data: profile } = useProfile();

  const cards = [
    { icon: Briefcase, label: "Projects", value: projects?.length ?? 0 },
    { icon: Settings, label: "Process Steps", value: process?.nodes.length ?? 0 },
    { icon: User, label: "Experience", value: profile?.experience.length ?? 0 },
    { icon: Wrench, label: "Skills", value: profile?.skills.length ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Overview of your portfolio data</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-50 p-2">
                <Icon size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
