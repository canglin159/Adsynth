import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/locations/miami")({
  component: MiamiLocationPage,
});

function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="flex mb-8 text-sm font-medium text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/" className="hover:text-brand-500 transition-colors">Home</Link>
        </li>
        {items.map((item, i) => (
          <li key={i}>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
              {item.to ? (
                <Link to={item.to} className="ml-1 hover:text-brand-500 transition-colors md:ml-2">{item.label}</Link>
              ) : (
                <span className="ml-1 md:ml-2 text-gray-400 dark:text-gray-500">{item.label}</span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function MiamiLocationPage() {
  useEffect(() => {
    document.title = "AdSynth | Landscaping Marketing in Miami, FL | AI Ad Creatives";
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Miami Landscaping Ad Creative Service",
    "provider": {
      "@type": "Organization",
      "name": "AdSynth"
    },
    "areaServed": {
      "@type": "City",
      "name": "Miami"
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
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

      <main>
        <header className="py-24 px-4 bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-gray-950">
          <div className="max-w-4xl mx-auto text-center">
            <Breadcrumbs items={[{ label: "Locations" }, { label: "Miami, FL" }]} />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-wider mb-8">
              🌴 Local Service: Miami, FL
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Grow Your Miami Landscaping Business with <span className="text-green-600">Premium AI Ads</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Captivate South Florida homeowners with stunning, platform-ready creatives. AdSynth generates tropical-optimized ad creatives that showcase your lush designs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/#pricing" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-600/20 transition-all">
                Grow Your Miami Business
              </Link>
              <Link to="/industries/landscaping" className="w-full sm:w-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-all">
                See Landscaping Solutions
              </Link>
            </div>
          </div>
        </header>

        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
               <div className="text-3xl mb-4">📸</div>
               <h3 className="text-xl font-bold mb-3">Visual Excellence</h3>
               <p className="text-gray-600 dark:text-gray-400">AI-enhanced before & after showcases that look amazing on Instagram and Facebook.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
               <div className="text-3xl mb-4">📅</div>
               <h3 className="text-xl font-bold mb-3">Year-Round Leads</h3>
               <p className="text-gray-600 dark:text-gray-400">Marketing angles for every Florida season, ensuring a steady stream of projects.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
               <div className="text-3xl mb-4">📱</div>
               <h3 className="text-xl font-bold mb-3">Multi-Platform Reach</h3>
               <p className="text-gray-600 dark:text-gray-400">Reach Miami homeowners wherever they are—Facebook, Instagram, and Google Display.</p>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Serving the South Florida Community</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              In Miami, curb appeal is everything. To win high-end residential and commercial contracts, your marketing must look as good as the landscapes you create. AdSynth provides the visual power you need to stand out.
            </p>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AdSynth. All rights reserved.</p>
      </footer>
    </div>
  );
}
