import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/blog/why-local-businesses-switching-to-ai")({
  component: BlogPost3,
});

function BlogPost3() {
  useEffect(() => {
    document.title = "Why Local Businesses Are Switching to AI-Generated Creatives | AdSynth Blog";
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 text-sm text-white font-bold">
              A
            </span>
            <span>AdSynth</span>
          </Link>
          <Link to="/blog" className="text-gray-500 hover:text-brand-500 font-medium">Back to Blog</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-20">
        <div className="mb-10">
          <nav className="flex mb-8 text-sm font-medium text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="hover:text-brand-500 transition-colors">Home</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                  <Link to="/blog" className="ml-1 hover:text-brand-500 transition-colors md:ml-2">Blog</Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                  <span className="ml-1 md:ml-2 text-gray-400 dark:text-gray-500 truncate max-w-[150px]">Why Local Businesses...</span>
                </div>
              </li>
            </ol>
          </nav>
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6 text-sm text-gray-500 uppercase tracking-widest font-semibold">
              <span>June 25, 2026</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>Growth</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-8">
              Why Local Businesses Are Switching to AI-Generated Creatives
            </h1>
            <div className="aspect-video bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl flex items-center justify-center text-6xl mb-12 shadow-inner">
              📈
            </div>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            The era of "set it and forget it" advertising is over. To win in 2026, local businesses need to be fast, relevant, and visually stunning.
          </p>

          <p className="mb-6">
            We've seen a massive shift recently: local service providers—from dentists to roofers—are moving away from expensive agency retainers and moving toward AI-powered solutions. Here's why.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">1. Lowering the Barrier to Entry</h2>
          <p className="mb-6">
            In the past, having high-quality video or static ads meant hiring a production team. AI has lowered that cost by 90%, allowing a single-truck plumber to have the same quality of marketing as a national franchise.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">2. Hyper-Local Personalization</h2>
          <p className="mb-6">
            AI can easily generate hundreds of variations of an ad, each tailored to a specific neighborhood or local landmark. This level of personalization drives significantly higher engagement than a generic city-wide ad.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">3. Constant Freshness</h2>
          <p className="mb-6">
            Ad fatigue is real. When your local community sees the same ad for three months, they stop seeing it entirely. AI allows businesses to refresh their creatives every week, keeping their brand top-of-mind and their click-through rates high.
          </p>

          <p className="mb-12 leading-relaxed">
            Switching to AI isn't just about saving money—it's about staying competitive in a digital landscape that moves faster every day.
          </p>

          <div className="bg-green-50 dark:bg-green-950 p-8 rounded-2xl border border-green-100 dark:border-green-900">
            <h3 className="text-xl font-bold mb-4">Don't get left behind.</h3>
            <p className="mb-6">Start your AI advertising journey today with AdSynth and see the difference in your lead quality.</p>
            <Link to="/#pricing" className="inline-block bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-bold transition-all">
              Choose Your Plan
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-20 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AdSynth. All rights reserved.</p>
      </footer>
    </div>
  );
}
