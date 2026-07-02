import { createFileRoute, Link } from "@tanstack/react-router";
import { listProjects } from "~/lib/api";
import { FolderKanban, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/projects")({
  loader: async () => {
    return listProjects({ data: "test-user-id" });
  },
  component: ProjectsPage,
});

function ProjectsPage() {
  const projects = Route.useLoaderData();

  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex items-center justify-between px-6 py-4">
          <div><h1 className="text-xl font-bold text-gray-900 dark:text-white">Projects</h1><p className="text-sm text-gray-500 dark:text-gray-400">Manage your advertising projects</p></div>
          <Link to="/dashboard/requests/new" className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600">
            <Plus className="h-4 w-4" /> New Request
          </Link>
        </div>
      </header>

      <div className="p-6">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FolderKanban className="h-12 w-12 text-gray-300 dark:text-gray-600" />
            <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No projects yet</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Create a project to organize your ad creatives.</p>
            <Link to="/dashboard/requests/new" className="mt-6 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">Create First Request</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div key={p.id} className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{p.name}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}>{p.status}</span>
                </div>
                {p.description && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{p.description}</p>}
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{p.creatives_count} creatives</span>
                  <span>&middot;</span>
                  <span>{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}