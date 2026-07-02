import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";
import { useEffect, useState, useCallback, type ReactNode } from "react";

// ─── Server function for business name ──────────────────────────────────────
const getBusinessName = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const cfg = JSON.parse(await readFile("site.json", "utf8")) as {
      businessName?: string;
    };
    return cfg.businessName?.trim() ?? "AdSynth";
  } catch {
    return "AdSynth";
  }
});

export const Route = createFileRoute("/")({
  loader: () => getBusinessName(),
  component: Home,
});

// ─── Scroll reveal hook ─────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    const elements = document.querySelectorAll(".fade-in, .fade-in-left, .fade-in-right, .fade-in-scale");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

// ─── Dark mode hook ─────────────────────────────────────────────────────────
function useDarkMode() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("adsynth-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem("adsynth-theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  return { dark, toggle };
}

// ─── Smooth scroll helper ───────────────────────────────────────────────────
function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Home() {
  const businessName = Route.useLoaderData();
  useScrollReveal();
  const { dark, toggle } = useDarkMode();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": businessName,
    "url": "https://adsynth.ctonew.app/",
    "description": "AI-powered ad creative agency for local businesses. Fast, affordable, and optimized for conversion.",
    "brand": {
      "@type": "Brand",
      "name": "AdSynth"
    }
  };

  return (
    <div className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <Navbar dark={dark} onToggleDark={toggle} onNav={scrollTo} />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <Hero businessName={businessName} onCta={() => scrollTo("pricing")} />

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <HowItWorks />

      {/* ── Ad Examples ────────────────────────────────────────────────────── */}
      <AdExamples />

      {/* ── Features Grid ──────────────────────────────────────────────────── */}
      <FeaturesGrid />

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      <Testimonials />

      {/* ── Pricing ────────────────────────────────────────────────────────── */}
      <Pricing onCta={async () => {
        try {
          const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tier: "growth" }),
          });
          const data = await res.json();
          if (data.url) window.location.href = data.url;
        } catch {
          scrollTo("contact");
        }
      }} />

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <Faq />

      {/* ── Contact ────────────────────────────────────────────────────────── */}
      <Contact />

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar({
  dark,
  onToggleDark,
  onNav,
}: {
  dark: boolean;
  onToggleDark: () => void;
  onNav: (id: string) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "How It Works", target: "how-it-works" },
    { label: "Features", target: "features" },
    { label: "Pricing", target: "pricing" },
    { label: "FAQ", target: "faq" },
  ];

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gray-200/50 bg-white/80 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-950/80"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 text-sm text-white">
            A
          </span>
          <span className="hidden sm:inline">AdSynth</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <button
              key={l.target}
              onClick={() => onNav(l.target)}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => onNav("contact")}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/25"
          >
            Get Started
          </button>
          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {dark ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onToggleDark}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {dark ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-b border-gray-200 bg-white px-4 pb-4 dark:border-gray-800 dark:bg-gray-950 md:hidden">
          {links.map((l) => (
            <button
              key={l.target}
              onClick={() => {
                onNav(l.target);
                setMobileOpen(false);
              }}
              className="block w-full px-3 py-2 text-left text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => {
              onNav("contact");
              setMobileOpen(false);
            }}
            className="mt-2 w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero({ businessName, onCta }: { businessName: string; onCta: () => void }) {
  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 pt-20">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute -right-40 -bottom-40 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/5 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        {/* Badge */}
        <div className="fade-in mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300">
          <span className="flex h-2 w-2 rounded-full bg-brand-500" />
          AI-Powered Creative Agency — No Subscription Fees
        </div>

        {/* Headline */}
        <h1 className="fade-in mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          AI-Powered Ad Creatives{" "}
          <span className="gradient-text">That Convert.</span>
          <br />
          On Autopilot.
        </h1>

        {/* Subheadline */}
        <p className="fade-in mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400 sm:text-xl">
          Get premium, conversion-optimized ad creatives for Facebook, Instagram,
          and Google Display — delivered monthly. No agency, no in-house designer,
          no hassle.
        </p>

        {/* CTA Buttons */}
        <div className="fade-in mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={onCta}
            className="group inline-flex items-center gap-2 rounded-xl bg-brand-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/30"
          >
            Get Started
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            See How It Works
          </button>
        </div>

        {/* Hero illustration - mockup cards */}
        <div className="fade-in-scale mx-auto mt-16 max-w-5xl">
          <div className="animate-float relative rounded-2xl border border-gray-200 bg-white/50 p-4 shadow-2xl backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Mockup cards representing ad creatives */}
              {[
                { label: "Facebook Ad", color: "from-blue-500 to-blue-600", icon: "f" },
                { label: "Instagram Story", color: "from-pink-500 to-purple-500", icon: "ig" },
                { label: "Google Display", color: "from-green-500 to-emerald-500", icon: "gd" },
              ].map((card, i) => (
                <div
                  key={i}
                  className={`rounded-xl bg-gradient-to-br ${card.color} p-5 text-white shadow-lg`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider opacity-80">
                      {card.label}
                    </span>
                    <svg className="h-4 w-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="mb-2 h-16 rounded-lg bg-white/20" />
                  <div className="flex gap-1">
                    <div className="h-2 flex-1 rounded-full bg-white/20" />
                    <div className="h-2 w-12 rounded-full bg-white/20" />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-white/30" />
                    <div className="h-2 w-20 rounded-full bg-white/20" />
                  </div>
                </div>
              ))}
            </div>

            {/* Shimmer overlay */}
            <div className="shimmer pointer-events-none absolute inset-0 rounded-2xl" />
          </div>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "10K+", label: "Creatives Generated" },
              { value: "500+", label: "Happy Businesses" },
              { value: "4.9★", label: "Average Rating" },
              { value: "2.5x", label: "Avg. Conversion Lift" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Describe Your Business",
      description:
        "Tell us about your business, target audience, and goals. Our AI learns your brand voice and marketing needs.",
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      step: "02",
      title: "AI Generates Creatives",
      description:
        "Our engine creates stunning, conversion-optimized ads across formats — static, video scripts, headlines, and more.",
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ),
    },
    {
      step: "03",
      title: "Download & Launch",
      description:
        "Review, download, and launch your ads across Facebook, Instagram, and Google. Your first batch is ready in 24 hours.",
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="fade-in mb-16 text-center">
          <span className="inline-block rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            From Brief to Campaign in 3 Simple Steps
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            No back-and-forth, no endless revisions. Just describe your business
            and let AI do the heavy lifting.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={i} className="fade-in group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:shadow-brand-500/5 dark:border-gray-800 dark:bg-gray-900">
              {/* Step number */}
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 text-white shadow-lg shadow-brand-500/20">
                {s.icon}
              </div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-500">
                Step {s.step}
              </span>
              <h3 className="mb-3 text-xl font-bold">{s.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{s.description}</p>

              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 md:block">
                  <svg className="h-8 w-8 text-gray-300 dark:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Ad Examples ─────────────────────────────────────────────────────────────
function AdExamples() {
  const industries = [
    { name: "HVAC", color: "from-cyan-500 to-blue-600", slug: "hvac" },
    { name: "Dental", color: "from-teal-500 to-emerald-600", slug: "dental" },
    { name: "Landscaping", color: "from-green-500 to-lime-600", slug: "landscaping" },
    { name: "Plumbing", color: "from-blue-500 to-indigo-600", slug: "plumbing" },
    { name: "Roofing", color: "from-orange-500 to-yellow-600", slug: "roofing" },
    { name: "Med Spa", color: "from-pink-500 to-rose-600", slug: "med-spa" },
    { name: "Real Estate", color: "from-violet-500 to-purple-600", slug: "real-estate" },
    { name: "Restaurant", color: "from-orange-500 to-red-600", slug: "restaurant" },
    { name: "Auto Detailing", color: "from-blue-600 to-cyan-500", slug: "auto-detailing" },
  ];

  return (
    <section id="examples" className="relative px-4 py-24 sm:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="fade-in mb-16 text-center">
          <span className="inline-block rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300">
            Portfolio
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Ad Creatives That Work Across Industries
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            From HVAC to med spas — our AI generates premium, platform-optimized
            creatives for any local business.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, i) => (
            <Link
              key={i}
              to={ind.slug ? ("/industries/" + ind.slug) : undefined}
              className={`fade-in-scale group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl hover:shadow-brand-500/10 dark:border-gray-800 dark:bg-gray-900 ${!ind.slug ? "pointer-events-none" : ""}`}
            >
              {/* Card preview */}
              <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${ind.color}`}>
                <div className="rounded-xl bg-white/20 px-6 py-3 text-center backdrop-blur-sm">
                  <p className="text-lg font-bold text-white">{ind.name}</p>
                  <p className="text-xs text-white/70">Facebook • Instagram • Google</p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {ind.name} Campaign
                  </h3>
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    3 creatives
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Conversion-optimized ads with seasonal promotions and targeted copy.
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            to="/industries" 
            className="inline-flex items-center gap-2 text-brand-500 font-bold hover:text-brand-600 transition-colors"
          >
            View All Industries Served
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Features Grid ──────────────────────────────────────────────────────────
const FEATURES = [
  {
    title: "Facebook Ads",
    description: "Eye-catching static and video ads optimized for Facebook's algorithm.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    title: "Instagram Ads",
    description: "Story, feed, and Reel creatives designed for engagement.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.16a15.53 15.53 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
      </svg>
    ),
  },
  {
    title: "Google Display Ads",
    description: "Responsive display ads that look great on every device and network.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    ),
  },
  {
    title: "Video Scripts",
    description: "Professional video scripts tailored to your business and platform.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: "Headlines & Copy",
    description: "High-converting ad copy with multiple A/B variants for testing.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    title: "Seasonal Promotions",
    description: "Timely, seasonal ad creatives that capitalize on holidays and events.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    title: "Marketing Angles",
    description: "AI-suggested marketing angles and positioning tailored to your audience.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Unlimited Revisions",
    description: "Not happy? We'll tweak until it's perfect — included in every plan.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
      </svg>
    ),
  },
];

function FeaturesGrid() {
  return (
    <section id="features" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="fade-in mb-16 text-center">
          <span className="inline-block rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300">
            Features
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Win at Ads
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            From static images to video scripts — one subscription covers your
            entire ad creative pipeline.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="fade-in-scale glass group rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-brand-500/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                {f.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Mike Thompson",
    business: "Thompson HVAC Services",
    location: "Austin, TX",
    quote:
      "AdSynth has completely changed how we advertise. We went from spending $2,000/month on an agency to getting better results for a fraction of the cost. The AI-generated creatives actually convert better than what our agency was producing.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    business: "Bright Smile Dental",
    location: "Portland, OR",
    quote:
      "I was skeptical at first, but the quality of the creatives blew me away. The seasonal promotion suggestions alone have increased our appointment bookings by 40%. Every local dentist needs this.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    business: "Rodriguez Landscaping",
    location: "Miami, FL",
    quote:
      "The variety of formats — Facebook, Instagram, Google — all in one subscription saves us so much time. Our before/after landscaping ads have never looked better. Highly recommend.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    business: "Radiant Med Spa",
    location: "Denver, CO",
    quote:
      "As a med spa owner, aesthetic is everything. AdSynth's creatives are gorgeous and always on-brand. The unlimited revisions mean I can tweak until it's perfect. Game changer for our marketing.",
    rating: 5,
  },
];

function Testimonials() {
  return (
    <section id="testimonials" className="relative px-4 py-24 sm:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-brand-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="fade-in mb-16 text-center">
          <span className="inline-block rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300">
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by Local Business Owners
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            See why hundreds of businesses trust AdSynth for their ad creative needs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="fade-in glass group rounded-2xl p-8 transition-all hover:shadow-lg"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg
                    key={j}
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="mb-6 text-gray-700 dark:text-gray-300">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-purple-500 text-sm font-bold text-white">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {t.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t.business}
                  </div>
                </div>
                <span className="ml-auto text-xs text-gray-400 dark:text-gray-600">
                  {t.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ────────────────────────────────────────────────────────────────
const TIERS = [
  {
    name: "Starter",
    price: "$199",
    period: "/month",
    description: "Perfect for small businesses getting started with ads.",
    creatives: "8 creatives/month",
    features: [
      "Facebook & Instagram ads",
      "Google Display ads",
      "Video scripts",
      "Headlines & copy",
      "AI marketing angles",
      "Email support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$499",
    period: "/month",
    description: "For growing businesses ready to scale their advertising.",
    creatives: "25 creatives/month",
    features: [
      "Everything in Starter",
      "Seasonal promotions",
      "Priority support",
      "A/B variants included",
      "Dedicated account manager",
      "Custom brand voice setup",
    ],
    cta: "Most Popular",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$999",
    period: "/month",
    description: "Unlimited creatives for agencies and high-volume advertisers.",
    creatives: "Unlimited (fair use)",
    features: [
      "Everything in Growth",
      "Unlimited creatives",
      "White-label options",
      "API access",
      "Multi-brand support",
      "Same-day turnaround",
    ],
    cta: "Contact Us",
    highlighted: false,
  },
];

function Pricing({ onCta }: { onCta: () => void }) {
  return (
    <section id="pricing" className="relative px-4 py-24 sm:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/5 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="fade-in mb-16 text-center">
          <span className="inline-block rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300">
            Pricing
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            No hidden fees, no long-term contracts. Cancel anytime.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {TIERS.map((tier, i) => (
            <div
              key={i}
              className={`fade-in-scale relative rounded-3xl border bg-white p-8 shadow-sm transition-all hover:shadow-xl ${
                tier.highlighted
                  ? "scale-[1.02] border-brand-500 shadow-lg shadow-brand-500/10"
                  : "border-gray-200 dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {tier.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {tier.description}
                </p>
              </div>

              <div className="mb-4">
                <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {tier.price}
                </span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">
                  {tier.period}
                </span>
              </div>

              <div className="mb-6 rounded-xl bg-brand-50 px-4 py-2 text-center text-sm font-medium text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                {tier.creatives}
              </div>

              <ul className="mb-8 space-y-3">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={tier.highlighted ? onCta : () => scrollTo("contact")}
                className={`w-full rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                  tier.highlighted
                    ? "bg-gradient-to-r from-brand-500 to-purple-500 text-white shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "How does AdSynth work?",
    a: "Simply describe your business, target audience, and goals. Our AI generates conversion-optimized ad creatives across Facebook, Instagram, and Google Display formats. You can review, request revisions, and download your ads.",
  },
  {
    q: "What types of creatives do you produce?",
    a: "We produce Facebook and Instagram ads (static and story), Google Display responsive ads, video scripts, ad headlines, copy variants, and marketing angle suggestions. Every creative is optimized for its platform.",
  },
  {
    q: "How fast can I get my first creatives?",
    a: "Your first batch of creatives is typically ready within 24 hours of subscribing. Once you're set up, you can request new creatives anytime through your dashboard.",
  },
  {
    q: "Can I request revisions?",
    a: "Absolutely! Unlimited revisions are included in every plan. Not happy with a creative? Tell us what to change and we'll regenerate it until it's perfect.",
  },
  {
    q: "Do you offer seasonal or promotional creatives?",
    a: "Yes! Growth and Agency plans include seasonal promotions tailored to your business. Our AI suggests timely marketing angles for holidays, seasons, and local events.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, there are no long-term contracts. You can cancel your subscription at any time from your dashboard. No cancellation fees, no hidden charges.",
  },
];

function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="fade-in mb-16 text-center">
          <span className="inline-block rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="fade-in overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all dark:border-gray-800 dark:bg-gray-900"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <span className="pr-4 font-semibold text-gray-900 dark:text-gray-100">
                  {faq.q}
                </span>
                <svg
                  className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <div
                className={`transition-all duration-300 ${
                  openIndex === i ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="border-t border-gray-100 px-6 py-4 text-gray-600 dark:border-gray-800 dark:text-gray-400">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ────────────────────────────────────────────────────────────────
function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          business_name: formData.business,
          message: formData.message,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
      setFormData({ name: "", email: "", business: "", message: "" });
    } catch {
      alert("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative px-4 py-24 sm:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-xl">
        <div className="fade-in mb-12 text-center">
          <span className="inline-block rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300">
            Contact
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-gray-600 dark:text-gray-400">
            Tell us about your business and we'll show you what AdSynth can do.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="fade-in space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                placeholder="John Smith"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="business" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Business Name
            </label>
            <input
              type="text"
              id="business"
              name="business"
              value={formData.business}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              placeholder="Your Business LLC"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              placeholder="Tell us about your advertising needs..."
            />
          </div>
          {submitted ? (
            <div className="rounded-xl bg-green-50 px-6 py-4 text-center text-green-700 dark:bg-green-950 dark:text-green-300">
              <svg className="mx-auto mb-2 h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <p className="font-semibold">Thanks! We'll be in touch soon.</p>
            </div>
          ) : (
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-purple-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30 disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send Message"}
          </button>
          )}
        </form>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  const links = {
    Product: ["How It Works", "Features", "Pricing", "FAQ"],
    Company: ["About", "Blog", "Careers", "Press"],
    Support: ["Help Center", "Contact", "Privacy", "Terms"],
  };

  return (
    <footer className="border-t border-gray-200 bg-gray-50 px-4 dark:border-gray-800 dark:bg-gray-900/50">
      <div className="mx-auto max-w-6xl py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="mb-4 flex items-center gap-2 text-xl font-bold tracking-tight">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 text-sm text-white">
                A
              </span>
              AdSynth
            </a>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Premium AI-generated ad creatives for local businesses. Fast,
              affordable, and optimized for conversion.
            </p>
            {/* Social placeholders */}
            <div className="mt-6 flex gap-3">
              {["X", "in", "IG", "FB"].map((s, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500 transition-colors hover:bg-brand-100 hover:text-brand-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-brand-950 dark:hover:text-brand-400"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">
                {category}
              </h4>
              <ul className="space-y-3">
                {items.map((item, j) => (
                  <li key={j}>
                    <button className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 py-6 text-center dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-500">
          &copy; {new Date().getFullYear()} AdSynth. All rights reserved. Built with{" "}
          <a
            href="https://cto.new"
            className="font-medium text-brand-500 hover:text-brand-600"
          >
            cto.new
          </a>
        </p>
      </div>
    </footer>
  );
}