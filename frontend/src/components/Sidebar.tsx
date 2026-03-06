"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/lib/role-context";
import { useAuth } from "@/lib/auth-context";
import type { Role } from "@/lib/api";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/finance", label: "Finance" },
  { href: "/production", label: "Produzione" },
  { href: "/procurement", label: "Acquisti" },
  { href: "/warehouse", label: "Magazzino" },
  { href: "/logistics", label: "Logistica" },
  { href: "/hr", label: "HR" },
  { href: "/legal", label: "Legal" },
  { href: "/investments", label: "Investimenti" },
  { href: "/ai", label: "AI Fatture" },
  { href: "/reports", label: "Report" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role, setRole, roles } = useRole();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <aside className="flex w-56 flex-col border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="sticky top-0 flex flex-col gap-4 p-4">
        <div className="px-2 py-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            ERP Suite
          </h2>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-zinc-200 pt-4 dark:border-zinc-800">
          {isAuthenticated ? (
            <div>
              <p className="truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {user?.fullName} ({user?.role})
              </p>
              <button
                onClick={logout}
                className="mt-1 w-full text-left text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-400"
              >
                Esci
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="mb-2 block rounded-lg bg-zinc-900 px-3 py-2 text-center text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                Accedi
              </Link>
              <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Ruolo simulato (senza login)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
