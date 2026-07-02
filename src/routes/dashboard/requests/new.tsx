import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { createRequest, listProjects, getCurrentUserId } from "~/lib/api";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/requests/new")({
  loader: async () => {
    const user = await getCurrentUserId();
    const userId = user!.id;
    const projects = await listProjects({ data: userId });
    return { projects, userId };
  },
  component: NewRequestPage,
});

const BUSINESS_TYPES = [
  "HVAC", "Roofing", "Plumbing", "Landscaping", "Dental",
  "Med Spa", "Restaurant", "Auto Detailing", "Real Estate", "Other",
];

const AD_PLATFORMS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "google", label: "Google Display" },
];

const AD_TYPES = [
  { value: "image", label: "Static Image" },
  { value: "video", label: "Video" },
  { value: "carousel", label: "Carousel" },
  { value: "static", label: "Static" },
];

function NewRequestPage() {
  const { projects, userId } = Route.useLoaderData();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    business_type: "",
    business_name: "",
    ad_platform: "facebook",
    ad_type: "image",
    description: "",
    project_id: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createRequest({
        data: {
          user_id: userId,
          business_type: form.business_type,
          business_name: form.business_name,
          ad_platform: form.ad_platform as "facebook" | "instagram" | "google",
          ad_type: form.ad_type as "image" | "video" | "static" | "carousel",
          description: form.description,
          project_id: form.project_id || undefined,
        },
      });
      navigate({ to: "/dashboard" as const });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            </Link>
            <div><h1 className="text-xl font-bold text-gray-900 dark:text-white">New Creative Request</h1><p className="text-sm text-gray-500 dark:text-gray-400">Describe what you need and we'll generate it</p></div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Business Type</label>
            <select name="business_type" value={form.business_type} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
              <option value="">Select business type...</option>
              {BUSINESS_TYPES.map((t) => <option key={t} value={t.toLowerCase()}>{t}</option>)}
            </select>
          </div>

          {/* Business Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Business Name</label>
            <input type="text" name="business_name" value={form.business_name} onChange={handleChange} placeholder="e.g. Thompson HVAC Services"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500" />
          </div>

          {/* Platform & Type */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Ad Platform</label>
              <div className="grid grid-cols-3 gap-2">
                {AD_PLATFORMS.map((p) => (
                  <button key={p.value} type="button" onClick={() => setForm((f) => ({ ...f, ad_platform: p.value }))}
                    className={`rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition-all ${
                      form.ad_platform === p.value
                        ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-950 dark:text-brand-300"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600"
                    }`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Ad Type</label>
              <div className="grid grid-cols-2 gap-2">
                {AD_TYPES.map((t) => (
                  <button key={t.value} type="button" onClick={() => setForm((f) => ({ ...f, ad_type: t.value }))}
                    className={`rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition-all ${
                      form.ad_type === t.value
                        ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-950 dark:text-brand-300"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600"
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Project */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Project (optional)</label>
            <select name="project_id" value={form.project_id} onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
              <option value="">No project</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={5} placeholder="Describe what you need... e.g. A Facebook ad for our summer HVAC special, targeting homeowners in Austin."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500" />
          </div>

          {/* Error */}
          {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>}

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button type="submit" disabled={submitting}
              className="rounded-xl bg-gradient-to-r from-brand-500 to-purple-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30 disabled:opacity-50">
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
            <Link to="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}