import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/google-display-ads-for-plumbers")({
  head: () => ({
    meta: [
      { title: "Google Display Ads for Plumbers: A Step-by-Step Guide | AdSynth" },
      { name: "description", content: "Master Google Display advertising for your plumbing business. Learn how to win more emergency repair and maintenance jobs with AI-optimized banners." },
      { name: "og:title", content: "Google Display Ads for Plumbers: A Step-by-Step Guide" },
      { name: "og:description", content: "Grow your plumbing business with high-converting Google Display ads. See our expert AI guide." },
      { name: "canonical", content: "https://adsynth.ctonew.app/blog/google-display-ads-for-plumbers" }
    ]
  }),
  component: BlogPostPlumbers,
});

function BlogPostPlumbers() {
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
                  <span className="ml-1 md:ml-2 text-gray-400 dark:text-gray-500 truncate max-w-[150px]">Google Display Ads for Plu...</span>
                </div>
              </li>
            </ol>
          </nav>
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6 text-sm text-gray-500 uppercase tracking-widest font-semibold">
              <span>July 2, 2026</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>Plumbing Marketing</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-8">
              Google Display Ads for Plumbers: A Step-by-Step Guide
            </h1>
            <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl flex items-center justify-center text-6xl mb-12 shadow-inner">
              🔧💧
            </div>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            When a pipe bursts or a drain clogs, a plumber is needed *now*. While Google Search is great for capturing that immediate intent, Google Display Ads are essential for building the brand awareness that ensures your plumbing company is the first one they call. In 2026, Display ads powered by AI are more effective than ever.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Why Display Ads Matter for Plumbers</h2>
          <p className="mb-6">
            Google Display Ads allow you to show visual banners across millions of websites and apps. For plumbers, this is about **Top of Mind Awareness**. When a homeowner sees your professional, trustworthy banner while reading the local news, they remember you when their water heater finally gives out.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Step 1: Focus on Trust-Building Imagery</h2>
          <p className="mb-6">
            In the service industry, trust is everything. Your Display banners should feature:
          </p>
          <ul className="list-disc pl-6 space-y-4 mb-8">
            <li><strong>Professional Branding:</strong> Clear logos and a consistent color palette.</li>
            <li><strong>Friendly Faces:</strong> AI-generated images of professional, approachable plumbers.</li>
            <li><strong>Badges of Honor:</strong> Mention "Licensed & Insured" or "24/7 Emergency Service" clearly on the banner.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4">Step 2: Use Responsive Display Ads (RDAs)</h2>
          <p className="mb-6">
            Don't waste time designing 20 different banner sizes. Use Google's RDAs. You provide the assets (headlines, images, and logos) and let Google's AI optimize the layout for every possible placement. AdSynth provides these assets in the exact formats you need for peak performance.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Step 3: Precise Local Targeting</h2>
          <p className="mb-6">
            Target your specific service area by zip code or a radius around your shop. In 2026, you can also target by "In-Market" segments—people who are actively researching home improvement and repair services.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">How AdSynth Drives Plumbing Success</h2>
          <p className="mb-6">
            Plumbing marketing is about being there when it matters. AdSynth provides plumbers with monthly batches of premium, AI-optimized Display and Social creatives. We help you build a professional brand that wins the trust of your local community and keeps your phone ringing.
          </p>

          <div className="bg-brand-50 dark:bg-brand-950 p-8 rounded-2xl border border-brand-100 dark:border-brand-900 mt-12">
            <h3 className="text-xl font-bold mb-4">Ready to win more jobs?</h3>
            <p className="mb-6">Stop letting your leads go to the big national franchises. Get high-converting plumbing ad creatives delivered every month with AdSynth.</p>
            <Link to="/industries/plumbing" className="inline-block bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-bold transition-all">
              See Plumbing Ad Solutions
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
