import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/blog/")({
  component: BlogIndexPage,
});

const ARTICLES = [
  {
    id: "how-ai-changing-advertising",
    title: "How AI is Changing Advertising for Local Businesses",
    summary: "Discover how local businesses are using AI to create premium ad creatives that outperform traditional agencies.",
    date: "June 30, 2026",
    category: "Technology",
  },
  {
    id: "top-5-ad-strategies-hvac",
    title: "Top 5 Ad Strategies for HVAC Companies in 2026",
    summary: "Learn the 5 types of ad creatives every HVAC business needs to keep their schedule full year-round.",
    date: "June 28, 2026",
    category: "Industry Strategy",
  },
  {
    id: "why-local-businesses-switching-to-ai",
    title: "Why Local Businesses Are Switching to AI-Generated Creatives",
    summary: "The shift is happening. Learn why AI is becoming the secret weapon for small business marketing teams.",
    date: "June 25, 2026",
    category: "Growth",
  },
];

function BlogIndexPage() {
  useEffect(() => {
    document.title = "AdSynth Blog | AI Advertising Insights for Local Businesses";
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Navbar Placeholder */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 text-sm text-white font-bold">
              A
            </span>
            <span>AdSynth</span>
          </Link>
          <Link to="/#pricing" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      <header className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-start mb-8">
             <nav className="flex text-sm font-medium text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <Link to="/" className="hover:text-brand-500 transition-colors">Home</Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                      <span className="ml-1 md:ml-2 text-gray-400 dark:text-gray-500">Blog</span>
                    </div>
                  </li>
                </ol>
             </nav>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">AdSynth Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Insights, strategies, and news about AI advertising for local businesses.</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid gap-12">
          {ARTICLES.map((article) => (
            <article key={article.id} className="group relative grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1 aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                 {article.id === "top-5-ad-strategies-hvac" ? "❄️" : "✨"}
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                  <span>{article.date}</span>
                  <span className="px-2 py-0.5 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-full font-medium">{article.category}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-brand-500 transition-colors">
                  <Link to={`/blog/${article.id}`}>
                    {article.title}
                  </Link>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">{article.summary}</p>
                <Link to={`/blog/${article.id}`} className="text-brand-500 font-bold inline-flex items-center gap-2 hover:underline">
                  Read Full Article
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="py-20 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AdSynth. All rights reserved.</p>
      </footer>
    </div>
  );
}
