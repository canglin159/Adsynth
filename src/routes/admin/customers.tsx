/**
 * Admin Customers Page
 */

import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getAllUsers } from "~/db";
import { Search, Users } from "lucide-react";
import { useState } from "react";

const getData = createServerFn({ method: "GET" }).handler(async () => {
  return await getAllUsers();
});

export const Route = createFileRoute("/admin/customers")({
  loader: () => getData(),
  component: AdminCustomers,
});

function AdminCustomers() {
  const customers = Route.useLoaderData();
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const tierColors: Record<string, string> = {
    free: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    starter:
      "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    growth:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    agency:
      "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Customers
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {customers.length} total customer{customers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-900">
          <Users className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="mt-4 text-sm text-gray-500">
            {search ? "No customers match your search." : "No customers yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3">Stripe ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filtered.map((user) => (
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
                        tierColors[user.subscription_tier] ?? tierColors.free
                      }`}
                    >
                      {user.subscription_tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400 dark:text-gray-500">
                    {user.stripe_customer_id
                      ? user.stripe_customer_id.slice(0, 12) + "..."
                      : "—"}
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