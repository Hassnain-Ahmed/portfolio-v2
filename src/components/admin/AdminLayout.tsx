import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Briefcase, Settings, User, LogOut, MessageSquare, Mail, Menu, X, Languages, Quote } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

const NAV = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/projects", icon: Briefcase, label: "Projects", end: false },
  { to: "/admin/process", icon: Settings, label: "Process", end: false },
  { to: "/admin/about", icon: User, label: "About", end: false },
  { to: "/admin/languages", icon: Languages, label: "Languages", end: false },
  { to: "/admin/testimonials", icon: Quote, label: "Testimonials", end: false },
  { to: "/admin/messages", icon: Mail, label: "Messages", end: false },
  { to: "/admin/contact", icon: MessageSquare, label: "Contact", end: false },
];

export default function AdminLayout() {
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebar = (
    <>
      <div className="px-5 py-5">
        <h1 className="text-lg font-semibold text-white">Admin Panel</h1>
        <p className="text-xs text-gray-500">Portfolio CMS</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-purple-500/15 text-purple-400 font-medium"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-800 p-3">
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-gray-800 bg-gray-900">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gray-900 transition-transform duration-200 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-3 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
        >
          <X size={20} />
        </button>
        {sidebar}
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex items-center border-b border-gray-800 bg-gray-900 px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          >
            <Menu size={20} />
          </button>
          <span className="ml-3 text-sm font-semibold text-white">Admin Panel</span>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
