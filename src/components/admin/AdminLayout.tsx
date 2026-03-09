import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Briefcase, Settings, User, LogOut, MessageSquare } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const NAV = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/projects", icon: Briefcase, label: "Projects", end: false },
  { to: "/admin/process", icon: Settings, label: "Process", end: false },
  { to: "/admin/about", icon: User, label: "About", end: false },
  { to: "/admin/contact", icon: MessageSquare, label: "Contact", end: false },
];

export default function AdminLayout() {
  const { signOut } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="flex w-56 flex-col border-r border-gray-200 bg-white">
        <div className="px-5 py-5">
          <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
          <p className="text-xs text-gray-500">Portfolio CMS</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-purple-50 text-purple-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
