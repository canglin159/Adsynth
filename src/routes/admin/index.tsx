/**
 * Admin Overview Dashboard
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  getAllCreativeRequests,
  getDashboardMetrics,
} from "~/db";
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Clock,
} from "lucide-react";

const getData = createServerFn({ method: "GET" }).handler(async () => {
  const metrics = await getDashboardMetrics();
  const allRequests = await getAllCreativeRequests();
  const recentRequests = allRequests.slice(0, 10);
  return { metrics, recentRequests };
});

export const Route = createFileRoute("/admin/")({
  loader: () => getData(),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { metrics, recentRequests } = Route.useLoaderData();

  const statCards = [
    {
      label: "Monthly Recurring Revenue",
      value: `$${(metrics.mrr / 100).toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950",
    },
    {
      label: "Active Subscribers",
      value: metrics.activeSubscribers,
      icon: Users,
      color: "text-brand-600 dark:text-brand-400",
      bg: "bg-brand-50 dark:bg-brand-950",
    },
    {
      label: "Total Creatives",
      value: metrics.totalCreatives,
      icon: FileText,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950",
    },
    {
      label: "Completed",
      value: metrics.completedCreatives,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      label: "New Signups (This Month)",
      value: metrics.thisMonthSignups,
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Creatives This Month",
      value: metrics.thisMonthCreatives,
      icon: Sparkles,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your AdSynth business at a glance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg ${card.bg} p-3`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
                {typeof card.value === "number"
                  ? card.value.toLocaleString()
                  : card.value}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Creative Requests
          </h2>
          <Link
            to="/admin/requests"
            className="text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {recentRequests.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-gray-500">
              No creative requests yet. They'll appear here when customers start creating.
            </p>
          ) : (
            recentRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {req.business_name || "Untitled"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {req.business_type} &middot; {req.ad_platform} &middot;{" "}
                    {new Date(req.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`ml-4 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    req.status === "completed"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : req.status === "ai_draft"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : req.status === "editing"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                      : req.status === "cancelled"
                      ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {req.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}