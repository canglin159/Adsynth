import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/industries/landscaping")({
  component: LandscapingIndustryPage,
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

function LandscapingIndustryPage() {
  useEffect(() => {
    document.title = "AdSynth | AI Ad Creatives for Landscaping Businesses";
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Landscaping Ad Creative Service",
    "provider": {
      "@type": "Organization",
      "name": "AdSynth"
    },
    "description": "AI-powered ad creatives specifically for landscaping and lawn care businesses.",
    "areaServed": "US"
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Navbar Placeholder */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 text-sm text-white">
              A
            </span>
            <span>AdSynth</span>
          </a>
          <a href="/#pricing" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 blur-[100px] rounded-full" />
          <div className="bottom-0 right-1/4 w-96 h-96 bg-lime-500/10 blur-[100px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Breadcrumbs items={[{ label: "Industries" }, { label: "Landscaping" }]} />
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-wider mb-6">
                Landscaping Marketing Solutions
              </span>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Turn Browsers into <span className="text-green-600">High-Ticket Design Projects</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
                From hardscaping to weekly maintenance. AdSynth generates stunning visual ad creatives that showcase your work and fill your crew's schedule.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <a href="/#pricing" className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/20 transition-all text-center">
                  Start Your 24h Delivery
                </a>
                <a href="#examples" className="w-full sm:w-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-all text-center">
                  View Landscaping Examples
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/images/landscaping-hero.png" 
                  alt="Beautiful Backyard Landscaping" 
                  className="w-full h-auto object-cover aspect-square md:aspect-video lg:aspect-square"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Local Impact</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">Top Rated Crew</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Benefits Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-950 text-green-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Before & After Visuals</h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI-enhanced layouts that perfectly highlight the transformation of your best outdoor projects.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-lime-50 dark:bg-lime-950 text-lime-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Urgency & Seasonality</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ads designed to book up your spring clean-ups, summer mowing, and winter snow removal in advance.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950 text-orange-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Local Targeting</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Copy that speaks directly to your neighborhood, highlighting local expertise and reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Landscaping Ad Examples</h2>
            <p className="text-gray-600 dark:text-gray-400">Stunning creatives for Facebook, Instagram, and Google.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {["Hardscaping", "Lawn Care", "Seasonal Cleanup"].map((name, i) => (
              <div key={i} className="aspect-[4/5] bg-gray-100 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 group hover:border-green-500 transition-colors overflow-hidden">
                <div className="text-center p-6 w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 group-hover:bg-green-50/10 transition-colors">
                  <div className="w-16 h-16 bg-green-50 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-green-500">🌳</span>
                  </div>
                  <p className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{name} Campaign</p>
                  <p className="text-sm text-gray-500 mb-4">Optimized for Google Display</p>
                  <div className="space-y-2 text-left bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-xs w-full max-w-[200px]">
                    <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-2 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 bg-green-600 text-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">Ready for more high-ticket projects?</h2>
          <p className="text-xl mb-10 opacity-90 text-white">Join 150+ landscaping companies that use AdSynth to grow their business.</p>
          <a href="/#pricing" className="inline-block bg-white text-green-600 px-10 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 transition-colors shadow-xl">
            Get Started Now
          </a>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AdSynth. All rights reserved.</p>
      </footer>
    </div>
  );
}
