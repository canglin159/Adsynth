import { createFileRoute, Link } from "@tanstack/react-router";
import { listProjects, listRequests, adminGetSummary, getCurrentUserId } from "~/lib/api";

export const Route = createFileRoute("/dashboard/")({
  loader: async () => {
    const user = await getCurrentUserId();
    const userId = user!.id;
    const [summary, requests, projects] = await Promise.all([
      adminGetSummary(),
      listRequests({ data: userId }),
      listProjects({ data: userId }),
    ]);
    return { summary, projects, requests };
  },
  component: DashboardOverview,
});

function StatCard({ label, value, subtitle, color }: { label: string; value: string | number; subtitle?: string; color?: string }) {
  return (
    <div className="glass rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-brand-500/5">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold tracking-tight ${color ?? "text-gray-900 dark:text-white"}`}>{value}</p>
      {subtitle && <p className="mt-1 text-sm font-medium text-green-600 dark:text-green-400">{subtitle}</p>}
    </div>
  );
}

function DashboardOverview() {
  const { summary, projects, requests } = Route.useLoaderData();
  const totalUsers = summary.reduce((a, s) => a + s.count, 0);
  const completed = requests.filter((r) => r.status === "completed").length;
  const active = projects.filter((p) => p.status === "active").length;

  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex items-center justify-between px-6 py-4">
          <div><h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1><p className="text-sm text-gray-500 dark:text-gray-400">Welcome back</p></div>
          <div className="flex items-center gap-3">
            <Link to="/" className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">View Site</Link>
            <Link to="/dashboard/requests/new" className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600">New Request</Link>
          </div>
        </div>
      </header>

      <div className="space-y-8 p-6">
        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Active Projects" value={active} subtitle={active === 0 ? "Create your first" : "+2 this month"} color={active === 0 ? "text-gray-400" : undefined} />
          <StatCard label="Total Creatives" value={requests.length} subtitle={completed > 0 ? `${completed} completed` : undefined} />
          <StatCard label="This Month" value={`${completed}/25`} />
          <StatCard label="Users" value={totalUsers} />
        </div>

        {/* Two-column */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Projects</h2>
              <Link to="/dashboard/projects" className="text-sm font-medium text-brand-500 hover:text-brand-600">View all</Link>
            </div>
            {projects.length === 0 ? (
              <p className="py-8 text-center text-gray-500 dark:text-gray-400">No projects yet. Create your first project to get started.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead><tr className="border-b border-gray-100 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400"><th className="pb-3 font-medium">Name</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Creatives</th></tr></thead>
                  <tbody>
                    {projects.slice(0, 5).map((p) => (
                      <tr key={p.id} className="border-b border-gray-50 text-sm transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-900/50">
                        <td className="py-3 font-medium text-gray-900 dark:text-gray-100">{p.name}</td>
                        <td className="py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${p.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}>{p.status}</span>
                        </td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">{p.creatives_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Creatives</h2>
              <Link to="/dashboard/creatives" className="text-sm font-medium text-brand-500 hover:text-brand-600">View all</Link>
            </div>
            {requests.length === 0 ? (
              <p className="py-8 text-center text-gray-500 dark:text-gray-400">No creative requests yet.</p>
            ) : (
              <div className="space-y-3">
                {requests.slice(0, 5).map((r) => {
                  const sc: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400", ai_draft: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400", editing: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400", completed: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400", cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" };
                  const sl: Record<string, string> = { pending: "Pending", ai_draft: "AI Draft", editing: "Editing", completed: "Completed", cancelled: "Cancelled" };
                  return (
                    <div key={r.id} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-xs font-bold uppercase text-gray-500 dark:bg-gray-800">{r.ad_platform === "facebook" ? "FB" : r.ad_platform === "instagram" ? "IG" : "GD"}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{r.business_name || r.business_type || "Untitled"}</span>
                          <span className={`inline-flex flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${sc[r.status] ?? ""}`}>{sl[r.status] ?? r.status}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{r.ad_platform} &middot; {r.ad_type} &middot; {new Date(r.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Plan usage */}
        <div className="glass rounded-2xl p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-lg font-bold text-gray-900 dark:text-white">Growth Plan</h2><p className="text-sm text-gray-500 dark:text-gray-400">25 creatives/month &middot; Priority support &middot; Unlimited revisions</p></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 transition-all" style={{ width: `${Math.min((completed / 25) * 100, 100)}%` }} />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{completed}/25 used</span>
              </div>
              <button className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">Manage</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}