import { createFileRoute, Link } from "@tanstack/react-router";
import { listRequests } from "~/lib/api";
import { Palette, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/creatives")({
  loader: async () => {
    return listRequests({ data: "test-user-id" });
  },
  component: CreativesPage,
});

function CreativesPage() {
  const requests = Route.useLoaderData();

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400",
    ai_draft: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400",
    editing: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400",
    completed: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400",
    cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  };
  const statusLabels: Record<string, string> = { pending: "Pending", ai_draft: "AI Draft", editing: "Editing", completed: "Completed", cancelled: "Cancelled" };

  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex items-center justify-between px-6 py-4">
          <div><h1 className="text-xl font-bold text-gray-900 dark:text-white">Creatives</h1><p className="text-sm text-gray-500 dark:text-gray-400">Your ad creative requests</p></div>
          <Link to="/dashboard/requests/new" className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600">
            <Plus className="h-4 w-4" /> New Request
          </Link>
        </div>
      </header>

      <div className="p-6">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Palette className="h-12 w-12 text-gray-300 dark:text-gray-600" />
            <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No creatives yet</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Submit your first creative request to generate AI-powered ads.</p>
            <Link to="/dashboard/requests/new" className="mt-6 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">Create First Request</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-sm font-bold uppercase text-brand-600 dark:text-brand-400">
                  {r.ad_platform === "facebook" ? "FB" : r.ad_platform === "instagram" ? "IG" : "GD"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold text-gray-900 dark:text-white">{r.business_name || r.business_type || "Untitled"}</h3>
                    <span className={`inline-flex flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[r.status] ?? ""}`}>{statusLabels[r.status] ?? r.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {r.ad_platform} &middot; {r.ad_type}
                    {r.description && <span> &middot; &ldquo;{r.description.slice(0, 60)}{r.description.length > 60 ? "..." : ""}&rdquo;</span>}
                  </p>
                </div>
                <svg className="h-5 w-5 flex-shrink-0 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}