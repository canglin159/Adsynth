/**
 * Admin Settings Page
 */

import { createFileRoute } from "@tanstack/react-router";
import { Settings, DollarSign, Mail, Key } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const sections = [
    {
      icon: DollarSign,
      title: "Pricing Plans",
      description:
        "Manage your subscription tiers and pricing. Configure Stripe products and prices.",
      items: [
        { label: "Starter Plan", value: "$199/month — 8 creatives" },
        { label: "Growth Plan", value: "$499/month — 25 creatives" },
        { label: "Agency Plan", value: "$999/month — Unlimited" },
      ],
    },
    {
      icon: Mail,
      title: "Email Notifications",
      description:
        "Configure which email notifications are sent to customers and admins.",
      items: [
        { label: "New Signup", value: "Enabled" },
        { label: "Creative Completed", value: "Enabled" },
        { label: "Payment Received", value: "Enabled" },
      ],
    },
    {
      icon: Key,
      title: "API Keys",
      description:
        "Manage API integrations with OpenAI, Stripe, and other services.",
      items: [
        { label: "OpenAI", value: "Configured in .env" },
        { label: "Stripe", value: "Configured in .env" },
        { label: "Supabase", value: "Configured in .env" },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your AdSynth configuration
        </p>
      </div>

      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <div
            key={section.title}
            className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {section.description}
                </p>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.label}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-900/50">
        <Settings className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">
          Full settings management will be available in a future update.
        </p>
      </div>
    </div>
  );
}