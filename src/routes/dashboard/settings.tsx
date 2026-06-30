import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, User, CreditCard, Bell, Shield } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

const SECTIONS = [
  { icon: User, label: "Profile", desc: "Update your name, email, and avatar" },
  { icon: CreditCard, label: "Billing", desc: "Manage your subscription and payment method" },
  { icon: Bell, label: "Notifications", desc: "Configure email and push notifications" },
  { icon: Shield, label: "Security", desc: "Password and authentication settings" },
];

function SettingsPage() {
  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account and preferences</p>
        </div>
      </header>

      <div className="grid gap-4 p-6 sm:grid-cols-2">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.label} className="flex cursor-pointer items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{section.label}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{section.desc}</p>
              </div>
              <svg className="h-5 w-5 flex-shrink-0 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </div>
          );
        })}
      </div>

      <div className="px-6 pb-6">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
          <h3 className="font-semibold text-red-700 dark:text-red-400">Danger Zone</h3>
          <p className="mt-1 text-sm text-red-600 dark:text-red-300">Permanently delete your account and all associated data.</p>
          <button className="mt-4 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">Delete Account</button>
        </div>
      </div>
    </div>
  );
}