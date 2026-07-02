/**
 * Admin Subscriptions Page
 */

import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getSubscriptionSummary, getDashboardMetrics, getAllUsers } from "~/db";
import { CreditCard, Users, DollarSign, TrendingDown } from "lucide-react";

const getData = createServerFn({ method: "GET" }).handler(async () => {
  const [summary, metrics, users] = await Promise.all([
    getSubscriptionSummary(),
    getDashboardMetrics(),
    getAllUsers(),
  ]);
  return { summary, metrics, users };
});

export const Route = createFileRoute("/admin/subscriptions")({
  loader: () => getData(),
  component: AdminSubscriptions,
});

const TIER_INFO: Record<string, { name: string; price: number; color: string }> = {
  free: { name: "Free", price: 0, color: "text-gray-600 dark:text-gray-400" },
  starter: {
    name: "Starter",
    price: 19900,
    color: "text-blue-600 dark:text-blue-400",
  },
  growth: {
    name: "Growth",
    price: 49900,
    color: "text-purple-600 dark:text-purple-400",
  },
  agency: {
    name: "Agency",
    price: 99900,
    color: "text-amber-600 dark:text-amber-400",
  },
};

function AdminSubscriptions() {
  const { summary, metrics, users } = Route.useLoaderData();

  const tierCounts: Record<string, number> = {};
  summary.forEach((s) => {
    tierCounts[s.tier] = s.count;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Subscriptions
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Overview of your subscription tiers and revenue
        </p>
      </div>

      {/* MRR Overview Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Monthly Recurring Revenue
            </p>
            <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
              ${(metrics.mrr / 100).toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              From {metrics.activeSubscribers} active subscriber
              {metrics.activeSubscribers !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="rounded-full bg-green-50 p-4 dark:bg-green-950">
            <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* Tier Breakdown */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(TIER_INFO).map(([key, info]) => {
          const count = tierCounts[key] ?? 0;
          const revenue = count * info.price;
          return (
            <div
              key={key}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                  {key === "free" ? (
                    <Users className={`h-5 w-5 ${info.color}`} />
                  ) : (
                    <CreditCard className={`h-5 w-5 ${info.color}`} />
                  )}
                </span>
                <span className="text-xs text-gray-400">
                  {key === "free" ? "No charge" : `$${info.price / 100}/mo`}
                </span>
              </div>
              <p className={`mt-4 text-sm font-medium ${info.color}`}>
                {info.name}
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                {count}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {key === "free" ? "users" : `$${((revenue / 100).toLocaleString())}/mo`}
              </p>
            </div>
          );
        })}
      </div>

      {/* Churn metrics placeholder */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Churn Metrics
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Churn tracking will be available once subscription data is populated
          through Stripe webhooks.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center dark:border-gray-700">
            <TrendingDown className="mx-auto h-5 w-5 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Monthly Churn Rate</p>
            <p className="text-lg font-semibold text-gray-400">—</p>
          </div>
          <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center dark:border-gray-700">
            <Users className="mx-auto h-5 w-5 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Customer LTV</p>
            <p className="text-lg font-semibold text-gray-400">—</p>
          </div>
          <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center dark:border-gray-700">
            <DollarSign className="mx-auto h-5 w-5 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Avg. Revenue / User</p>
            <p className="text-lg font-semibold text-gray-400">
              {metrics.activeSubscribers > 0
                ? `$${(metrics.mrr / metrics.activeSubscribers / 100).toFixed(0)}`
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Customer breakdown */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            All Customers by Plan
          </h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Plan</th>
              <th className="px-6 py-3">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {users.map((user) => {
              const tierInfo = TIER_INFO[user.subscription_tier] ?? TIER_INFO.free;
              return (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {user.name || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        user.subscription_tier === "free"
                          ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          : user.subscription_tier === "starter"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : user.subscription_tier === "growth"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                      }`}
                    >
                      {user.subscription_tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    ${tierInfo.price / 100}/mo
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}