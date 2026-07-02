import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/locations/dallas")({
  head: () => ({
    meta: [
      { title: "AdSynth | AI Ad Creatives for Local Businesses in Dallas, TX" },
      { name: "description", content: "Grow your Dallas business with AI-powered ad creatives. Specialized Facebook, Instagram, and Google ads for Dallas HVAC, roofing, and dental practices." },
      { name: "og:title", content: "AI Ad Creatives for Dallas Local Businesses | AdSynth" },
      { name: "og:description", content: "Get high-converting AI-generated ads for your Dallas business. Fast delivery, local expertise." },
      { name: "canonical", content: "https://adsynth.ctonew.app/locations/dallas" }
    ]
  }),
  component: DallasLocationPage,
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

function DallasLocationPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Dallas Local Ad Creative Service",
    "provider": {
      "@type": "Organization",
      "name": "AdSynth"
    },
    "areaServed": {
      "@type": "City",
      "name": "Dallas"
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
            <Breadcrumbs items={[{ label: "Locations" }, { label: "Dallas, TX" }]} />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-8">
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></span>
              Local Service: Dallas, TX
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Dominate the Dallas Market with <span className="text-brand-500">AI-Powered Ads</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              From Deep Ellum to North Dallas, reach DFW homeowners exactly when they're looking for your services. AdSynth delivers conversion-optimized ads tailored for North Texas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/#pricing" className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/20 transition-all">
                Grow Your Dallas Business
              </Link>
              <Link to="/industries" className="w-full sm:w-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-all">
                Explore Industries
              </Link>
            </div>
          </div>
        </header>

        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why DFW Service Businesses Choose AdSynth</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-50 dark:bg-red-950 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                    ☀️
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Texas Sized Results</h3>
                    <p className="text-gray-600 dark:text-gray-400">High-impact ads designed to cut through the noise of the booming DFW market.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                    🤠
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Local Trust Factors</h3>
                    <p className="text-gray-600 dark:text-gray-400">Creatives that emphasize Texas reliability and community roots.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-950 text-green-500 rounded-xl flex items-center justify-center shrink-0">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Rapid Deployment</h3>
                    <p className="text-gray-600 dark:text-gray-400">Launch your new campaigns in 24 hours. Beat your competitors to the lead.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand-500/10 to-purple-500/10 p-1 rounded-3xl">
              <div className="bg-white dark:bg-gray-950 p-8 rounded-[1.4rem] shadow-sm">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic mb-6">
                  "Dallas is one of the most competitive markets in the country for home services. Whether you're in HVAC, plumbing, or roofing, you need ads that don't just look good—they need to convert. AdSynth uses AI trained on millions of data points to give Dallas businesses a true competitive edge."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-500 rounded-full"></div>
                  <div>
                    <p className="font-bold text-sm">AdSynth Local Insights</p>
                    <p className="text-xs text-gray-500">Market Analysis: Dallas, TX</p>
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
