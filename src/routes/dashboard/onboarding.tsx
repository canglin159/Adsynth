import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getCurrentUserId, getOnboardingStatus, saveBrandSettings, createNewProject, getMyBrandSettings, listProjects } from "~/lib/api";

export const Route = createFileRoute("/dashboard/onboarding")({
  loader: async () => {
    const user = await getCurrentUserId();
    if (!user) throw new Error("Not authenticated");
    const status = await getOnboardingStatus({ data: user.id });
    const brandSettings = await getMyBrandSettings({ data: user.id });
    return { user, status, brandSettings };
  },
  component: OnboardingWizard,
});

const TONES = [
  { value: "professional", label: "Professional", desc: "Clean, authoritative, and trustworthy" },
  { value: "friendly", label: "Friendly", desc: "Warm, approachable, and conversational" },
  { value: "luxury", label: "Luxury", desc: "Premium, sophisticated, and exclusive" },
  { value: "playful", label: "Playful", desc: "Fun, energetic, and creative" },
  { value: "urgent", label: "Urgent", desc: "Action-oriented, time-sensitive" },
];

const COLOR_PRESETS = [
  { label: "Blue", colors: ["#3B82F6", "#1D4ED8", "#DBEAFE"] },
  { label: "Green", colors: ["#10B981", "#047857", "#D1FAE5"] },
  { label: "Purple", colors: ["#8B5CF6", "#6D28D9", "#EDE9FE"] },
  { label: "Orange", colors: ["#F97316", "#C2410C", "#FFEDD5"] },
  { label: "Red", colors: ["#EF4444", "#B91C1C", "#FEE2E2"] },
  { label: "Teal", colors: ["#14B8A6", "#0F766E", "#CCFBF1"] },
];

const INDUSTRIES = [
  "HVAC", "Roofing", "Plumbing", "Landscaping", "Dental",
  "Med Spa", "Restaurant", "Auto Detailing", "Real Estate", "Other",
];

function OnboardingWizard() {
  const { user, status, brandSettings } = Route.useLoaderData();
  const navigate = useNavigate();
  const [step, setStep] = useState(status.currentStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Brand settings form
  const [brandForm, setBrandForm] = useState({
    brand_tone: brandSettings?.brand_tone ?? "professional",
    brand_colors: brandSettings?.brand_colors ?? JSON.stringify(COLOR_PRESETS[0].colors),
    style_preferences: brandSettings?.style_preferences ?? "",
    logo_url: brandSettings?.logo_url ?? "",
  });

  // Project form
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    industry: "",
  });

  const [generatedCreatives, setGeneratedCreatives] = useState<any[]>([]);

  // If already completed, redirect to dashboard
  useEffect(() => {
    if (status.completed) {
      navigate({ to: "/dashboard" });
    }
  }, [status.completed, navigate]);

  const handleSaveBrand = async () => {
    setLoading(true);
    setError("");
    try {
      await saveBrandSettings({
        data: {
          user_id: user.id,
          brand_tone: brandForm.brand_tone,
          brand_colors: brandForm.brand_colors,
          style_preferences: brandForm.style_preferences,
          logo_url: brandForm.logo_url,
        },
      });
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save brand settings");
    }
    setLoading(false);
  };

  const handleCreateProject = async () => {
    setLoading(true);
    setError("");
    try {
      await createNewProject({
        data: {
          user_id: user.id,
          name: projectForm.name,
          description: projectForm.description,
        },
      });
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    }
    setLoading(false);
  };

  const handleGenerateFirstCreative = async () => {
    setLoading(true);
    setError("");
    try {
      const { createRequest } = await import("~/lib/api");
      const result = await createRequest({
        data: {
          user_id: user.id,
          business_type: projectForm.industry || "other",
          business_name: projectForm.name,
          ad_platform: "facebook",
          ad_type: "image",
          description: projectForm.description || `Ad for ${projectForm.name}`,
        },
      });

      // Generate AI creative
      const { generateAdCreative } = await import("~/lib/api");
      const creative = await generateAdCreative({ data: result.id });
      setGeneratedCreatives([creative]);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate creative");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Steps indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {["Brand Voice", "First Project", "Generate", "Review"].map((label, i) => {
              const stepNum = i + 1;
              const isActive = step === stepNum;
              const isDone = step > stepNum;
              return (
                <div key={label} className="flex flex-col items-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                    isActive ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30" :
                    isDone ? "bg-green-500 text-white" :
                    "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                  }`}>
                    {isDone ? "✓" : stepNum}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${isActive ? "text-brand-600 dark:text-brand-400" : isDone ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="relative mt-2">
            <div className="h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="h-1 rounded-full bg-gradient-to-r from-brand-500 to-green-500 transition-all" style={{ width: `${((step - 1) / 3) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Step 1: Brand Voice */}
        {step === 1 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Set Up Your Brand Voice</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Help us understand your brand so we can create ads that match your style.</p>

            <div className="mt-8 space-y-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">Brand Tone</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {TONES.map((tone) => (
                    <button key={tone.value} type="button" onClick={() => setBrandForm((f) => ({ ...f, brand_tone: tone.value }))}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        brandForm.brand_tone === tone.value
                          ? "border-brand-500 bg-brand-50 dark:border-brand-700 dark:bg-brand-950/50"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                      }`}>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{tone.label}</div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{tone.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">Brand Colors</label>
                <div className="flex flex-wrap gap-3">
                  {COLOR_PRESETS.map((preset) => {
                    const isSelected = brandForm.brand_colors === JSON.stringify(preset.colors);
                    return (
                      <button key={preset.label} type="button" onClick={() => setBrandForm((f) => ({ ...f, brand_colors: JSON.stringify(preset.colors) }))}
                        className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
                          isSelected ? "border-brand-500 bg-brand-50 dark:border-brand-700 dark:bg-brand-950/50" : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                        }`}>
                        <div className="flex gap-1">
                          {preset.colors.map((c) => (
                            <div key={c} className="h-6 w-6 rounded-lg" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Style Preferences (optional)</label>
                <textarea value={brandForm.style_preferences} onChange={(e) => setBrandForm((f) => ({ ...f, style_preferences: e.target.value }))}
                  rows={3} placeholder="e.g., Minimalist, modern, bold typography, nature-inspired imagery..."
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500" />
              </div>

              {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>}

              <button onClick={handleSaveBrand} disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl disabled:opacity-50">
                {loading ? "Saving..." : "Continue →"}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Create First Project */}
        {step === 2 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Your First Project</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Set up a project to organize your ad creatives.</p>

            <div className="mt-8 space-y-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                <input type="text" value={projectForm.name} onChange={(e) => setProjectForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g., Summer Campaign 2026" required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Industry</label>
                <select value={projectForm.industry} onChange={(e) => setProjectForm((f) => ({ ...f, industry: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                  <option value="">Select industry...</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i.toLowerCase()}>{i}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Description (optional)</label>
                <textarea value={projectForm.description} onChange={(e) => setProjectForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3} placeholder="What is this campaign about?"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" />
              </div>

              {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">Back</button>
                <button onClick={handleCreateProject} disabled={loading || !projectForm.name}
                  className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl disabled:opacity-50">
                  {loading ? "Creating..." : "Create Project →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Generate First Creative */}
        {step === 3 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generate Your First Creative</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Let AI create your first ad creative based on your brand settings.</p>

            <div className="mt-8 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-950 dark:to-purple-950">
                <svg className="h-12 w-12 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">We'll generate a Facebook ad image creative for your first project.</p>
            </div>

            {error && <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>}

            <div className="mt-8 flex gap-3">
              <button onClick={() => setStep(2)} className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">Back</button>
              <button onClick={handleGenerateFirstCreative} disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl disabled:opacity-50">
                {loading ? "✨ Generating..." : "✨ Generate My First Creative"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review Results */}
        {step === 4 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">You're All Set!</h2>
                <p className="text-gray-500 dark:text-gray-400">Your first creative has been generated.</p>
              </div>
            </div>

            {/* Generated Creative Preview */}
            {generatedCreatives.length > 0 && (
              <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Your Generated Ad</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Headline</span>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{generatedCreatives[0].headline}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Ad Copy</span>
                    <p className="text-gray-700 dark:text-gray-300">{generatedCreatives[0].adCopy}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">CTA</span>
                      <p className="font-semibold text-brand-600 dark:text-brand-400">{generatedCreatives[0].cta}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Marketing Angle</span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{generatedCreatives[0].marketingAngle}</p>
                    </div>
                  </div>
                  {generatedCreatives[0].visualDescription && (
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Visual Direction</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{generatedCreatives[0].visualDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/dashboard/creatives"
                className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-purple-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl">
                View All Creatives
              </Link>
              <Link to="/dashboard/requests/new"
                className="flex-1 rounded-xl border border-gray-200 px-6 py-3 text-center text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
                Request Another
              </Link>
            </div>
            <Link to="/dashboard" className="mt-3 block text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Skip to Dashboard →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}