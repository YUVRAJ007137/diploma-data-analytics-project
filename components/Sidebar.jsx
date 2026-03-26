"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/backlog", label: "Backlog" },
  { href: "/student-categories", label: "Student Categories" },
  { href: "/comparison", label: "Comparison" },
  { href: "/student-search", label: "Student Search" }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full px-4 py-6 lg:h-screen lg:w-64 sidebar-rail">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide muted">Diploma Result Analytics</p>
        <h1 className="text-xl font-bold text-slate-900">Platform</h1>
      </div>

      <nav className="grid gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-shadow flex items-center justify-start gap-3 ${
                isActive ? "grad-indigo shadow-md" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-white/80' : 'bg-slate-300'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
