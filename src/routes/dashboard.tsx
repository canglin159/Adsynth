import { createFileRoute, Link, Outlet, useLocation, useSearch } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { requireAuth } from "~/lib/router-guard";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  validateSearch: (search: Record<string, unknown>) => ({
    checkout: search.checkout as string | undefined,
  }),
  beforeLoad: async () => {
    return requireAuth();
  },
});

function CheckoutSuccessBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center gap-3 bg-green-600 px-6 py-3 text-white shadow-lg">
      <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="flex-1 text-sm font-medium">Subscription activated! Welcome to AdSynth.</p>
      <button onClick={onDismiss} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm hover:bg-white/30">&times;</button>
    </div>
  );
}

function useDarkMode() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem("adsynth-theme");
    const isDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = useCallback(() => {
    setDark((p) => { const n = !p; localStorage.setItem("adsynth-theme", n ? "dark" : "light"); document.documentElement.classList.toggle("dark", n); return n; });
  }, []);
  return { dark, toggle };
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" as const, exact: true, icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" },
  { label: "Projects", href: "/dashboard/projects" as const, icon: "M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" },
  { label: "Creatives", href: "/dashboard/creatives" as const, icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" },
  { label: "New Request", href: "/dashboard/requests/new" as const, icon: "M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Settings", href: "/dashboard/settings" as const, icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281zM15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-950 lg:relative lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6 dark:border-gray-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 text-sm font-bold text-white">A</div>
          <span className="text-lg font-bold">AdSynth</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact ? location.pathname === item.href : location.pathname.startsWith(item.href);
            return (
              <Link key={item.href} to={item.href} onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                }`}
              >
                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-purple-500 text-sm font-bold text-white">JD</div>
            <div className="flex-1 min-w-0"><div className="truncate text-sm font-medium">Jane Demo</div><div className="truncate text-xs text-gray-500">Growth Plan</div></div>
          </div>
        </div>
      </aside>
    </>
  );
}

function DashboardLayout() {
  const { dark, toggle } = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { checkout } = Route.useSearch();
  const [showSuccess, setShowSuccess] = useState(checkout === "success");

  useEffect(() => {
    if (showSuccess && checkout === "success") {
      const url = new URL(window.location.href);
      url.searchParams.delete("checkout");
      window.history.replaceState({}, "", url.toString());
    }
  }, [showSuccess, checkout]);

  return (
    <div className="flex min-h-dvh bg-gray-50 dark:bg-gray-950">
      {showSuccess && <CheckoutSuccessBanner onDismiss={() => setShowSuccess(false)} />}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>
          <span className="font-bold">AdSynth</span>
          <button onClick={toggle} className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">{dark ? "☀️" : "🌙"}</button>
        </div>
        {/* Page content via Outlet */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}