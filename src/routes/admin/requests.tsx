/**
 * Admin Creative Requests Page
 */

import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getAllCreativeRequests } from "~/db";
import { useState } from "react";
import { FileText, Filter } from "lucide-react";

const getData = createServerFn({ method: "GET" }).handler(async () => {
  return await getAllCreativeRequests();
});

export const Route = createFileRoute("/admin/requests")({
  loader: () => getData(),
  component: AdminRequests,
});

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  ai_draft: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  editing: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

function AdminRequests() {
  const allRequests = Route.useLoaderData();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered =
    statusFilter === "all"
      ? allRequests
      : allRequests.filter((r) => r.status === statusFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Creative Requests
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {allRequests.length} total request{allRequests.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        {["all", "pending", "ai_draft", "editing", "completed", "cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === status
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {status === "all"
                ? "All"
                : status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          )
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-900">
          <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="mt-4 text-sm text-gray-500">
            {statusFilter !== "all"
              ? `No requests with status "${statusFilter}".`
              : "No creative requests yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="px-6 py-3">Business</th>
                <th className="px-6 py-3">Platform</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filtered.map((req) => (
                <tr
                  key={req.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {req.business_name || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {req.ad_platform}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {req.ad_type}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[req.status] ?? STATUS_COLORS.pending
                      }`}
                    >
                      {req.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                  <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {req.description || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}