import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { signIn } from "~/lib/auth";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function useDarkMode() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem("adsynth-theme");
    const isDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = useCallback(() => {
    setDark((p) => { const n = !p; localStorage.setItem("adsynth-theme", n ? "dark" : "light"); document.documentElement.classList.toggle("dark", n); return n; });
  }, []);
  return { dark, toggle };
}

function LoginPage() {
  const navigate = useNavigate();
  const { dark, toggle } = useDarkMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn(email, password);
      if (result.ok) {
        navigate({ to: "/dashboard" as const });
      } else {
        setError(result.error ?? "Login failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh">
      {/* Left panel - form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-2 text-xl font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 text-sm text-white">A</span>
            AdSynth
          </Link>

          <h2 className="mt-8 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-purple-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/auth/register" className="font-medium text-brand-500 hover:text-brand-600">
              Create one
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
            <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-300">
              &larr; Back to home
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-brand-500 lg:to-purple-600 lg:p-12">
        <div className="max-w-md text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white">
            <span className="flex h-2 w-2 rounded-full bg-white" />
            AI-Powered Ad Creatives
          </div>
          <h3 className="text-3xl font-bold text-white">
            Create stunning ads in minutes
          </h3>
          <p className="mt-4 text-lg text-white/80">
            Get premium, conversion-optimized ad creatives for Facebook, Instagram, and Google Display — delivered automatically.
          </p>
          <div className="mt-8 flex items-center justify-center gap-8">
            {["Facebook", "Instagram", "Google"].map((p) => (
              <span key={p} className="rounded-xl bg-white/10 px-3 py-1.5 text-sm font-medium text-white">{p}</span>
            ))}
          </div>
        </div>
        <button onClick={toggle} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/80 backdrop-blur-sm hover:bg-white/20">
          {dark ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  );
}