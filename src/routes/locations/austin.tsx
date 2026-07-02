import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/locations/austin")({
  component: AustinLocationPage,
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

function AustinLocationPage() {
  useEffect(() => {
    document.title = "AdSynth | HVAC Advertising in Austin, TX | AI Ad Creatives";
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Austin HVAC Ad Creative Service",
    "provider": {
      "@type": "Organization",
      "name": "AdSynth"
    },
    "areaServed": {
      "@type": "City",
      "name": "Austin"
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
        <header className="py-24 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto text-center">
            <Breadcrumbs items={[{ label: "Locations" }, { label: "Austin, TX" }]} />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-8">
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></span>
              Local Service: Austin, TX
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Dominate the Austin HVAC Market with <span className="text-brand-500">AI-Powered Ads</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Reach Austin homeowners exactly when they need a repair or upgrade. AdSynth provides Austin contractors with conversion-optimized creatives designed for local results.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/#pricing" className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/20 transition-all">
                Grow Your Austin Business
              </Link>
              <Link to="/industries/hvac" className="w-full sm:w-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-all">
                See HVAC Solutions
              </Link>
            </div>
          </div>
        </header>

        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Austin HVAC Businesses Choose AdSynth</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                    🔥
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Beat the Heat</h3>
                    <p className="text-gray-600 dark:text-gray-400">High-converting ads for emergency repairs exactly when Austin heat peaks.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                    📍
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Local Credibility</h3>
                    <p className="text-gray-600 dark:text-gray-400">Content that builds trust with Austin neighborhoods and homeowners.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-950 text-green-500 rounded-xl flex items-center justify-center shrink-0">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Seasonal Speed</h3>
                    <p className="text-gray-600 dark:text-gray-400">Get your summer or winter campaigns live in 24 hours, not weeks.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand-500/10 to-purple-500/10 p-1 rounded-3xl">
              <div className="bg-white dark:bg-gray-950 p-8 rounded-[1.4rem] shadow-sm">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic mb-6">
                  "Austin's extreme summer heat means HVAC services are always in demand. But with hundreds of contractors competing for the same customers, your ads need to stand out. AdSynth provides Austin HVAC companies with creatives that speak directly to local needs—from AC emergencies in July to heating tune-ups in December."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-500 rounded-full"></div>
                  <div>
                    <p className="font-bold text-sm">AdSynth Local Insights</p>
                    <p className="text-xs text-gray-500">Market Analysis: Austin, TX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AdSynth. All rights reserved.</p>
      </footer>
    </div>
  );
}
