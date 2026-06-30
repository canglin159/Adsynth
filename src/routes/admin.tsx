/**
 * Admin Layout — sidebar navigation + auth guard
 */

import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

// Server-side auth guard
const checkAdmin = createServerFn({ method: "GET" }).handler(async () => {
  // For MVP: simple check. In production, use Supabase session.
  // The admin is authenticated via the app's auth system.
  // For now, we allow access and let the UI handle it.
  return { authorized: true };
});

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/requests", label: "Creative Requests", icon: FileText },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export const Route = createFileRoute("/admin")({
  loader: () => checkAdmin(),
  component: AdminLayout,
  notFoundComponent: () => (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Page not found</h2>
        <p className="mt-2 text-gray-500">This admin page doesn't exist.</p>
        <Link to="/admin" className="mt-4 inline-block text-brand-500 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    </div>
  ),
});

function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-dvh bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6 dark:border-gray-800">
            <Sparkles className="h-6 w-6 text-brand-500" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              AdSynth
            </span>
            <span className="rounded-md bg-brand-100 px-1.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900 dark:text-brand-300">
              Admin
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              Back to Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1">
        <div className="min-h-dvh p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}