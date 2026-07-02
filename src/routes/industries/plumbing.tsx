import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/industries/plumbing")({
  component: PlumbingIndustryPage,
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

function PlumbingIndustryPage() {
  useEffect(() => {
    document.title = "AdSynth | AI Ad Creatives for Plumbers";
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Plumbing AI Ad Creative Service",
    "description": "24/7 emergency and installation ad creatives for plumbing businesses.",
    "provider": {
      "@type": "Organization",
      "name": "AdSynth"
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 text-sm text-white">
              A
            </span>
            <span>AdSynth</span>
          </Link>
          <a href="/#pricing" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Get Started
          </a>
        </div>
      </nav>

      <header className="py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full" />
          <div className="bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Breadcrumbs items={[{ label: "Industries", to: "/industries" }, { label: "Plumbing" }]} />
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
                Plumbing Marketing Solutions
              </span>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Get More Calls for <span className="text-blue-600">Emergency Plumbing</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
                Don't wait for the phone to ring. Our AI generates high-converting ads for emergency repairs, drain cleaning, and water heater installs.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link to="/#pricing" className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/20 transition-all text-center">
                  Start Getting Leads
                </Link>
                <a href="#examples" className="w-full sm:w-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-all text-center">
                  View Examples
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-auto bg-gray-200 dark:bg-gray-800 aspect-square md:aspect-video lg:aspect-square flex items-center justify-center text-4xl">
                   🚰
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">24/7 Response Ads</h3>
              <p className="text-gray-600 dark:text-gray-400">Creatives that emphasize speed and reliability for homeowners in a crisis.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950 text-indigo-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Trust-Based Content</h3>
              <p className="text-gray-600 dark:text-gray-400">Showcase your licensed status and positive reviews with AI-templated layouts.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950 text-teal-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Service Promotions</h3>
              <p className="text-gray-600 dark:text-gray-400">Seasonal specials for water heater flushes, winterization, and more.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AdSynth. All rights reserved.</p>
      </footer>
    </div>
  );
}
