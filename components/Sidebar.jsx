"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/comparison", label: "Comparison" },
  { href: "/student-search", label: "Student Search" }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-slate-200 bg-white px-4 py-4 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Diploma Result Analytics</p>
        <h1 className="text-xl font-bold text-brand">Platform</h1>
      </div>

      <nav className="grid gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
