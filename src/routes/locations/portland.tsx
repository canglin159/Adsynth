import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/locations/portland")({
  component: PortlandLocationPage,
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

function PortlandLocationPage() {
  useEffect(() => {
    document.title = "AdSynth | Dental Practice Advertising in Portland, OR | AI Ad Creatives";
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Portland Dental Ad Creative Service",
    "provider": {
      "@type": "Organization",
      "name": "AdSynth"
    },
    "areaServed": {
      "@type": "City",
      "name": "Portland"
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
        <header className="py-24 px-4 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-950">
          <div className="max-w-4xl mx-auto text-center">
            <Breadcrumbs items={[{ label: "Locations" }, { label: "Portland, OR" }]} />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-8">
              🌲 Local Service: Portland, OR
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Fill Your Portland Dental Practice with <span className="text-blue-600">New Patients</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              AI-powered ad creatives that build trust and drive bookings in the Pacific Northwest. Reach Portland residents with clean, professional, and inviting ads.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/#pricing" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all">
                Grow Your Portland Practice
              </Link>
              <Link to="/industries/dental" className="w-full sm:w-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-all">
                See Dental Solutions
              </Link>
            </div>
          </div>
        </header>

        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <div>
               <h2 className="text-3xl font-bold mb-6">Built for Portland's Local Community</h2>
               <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                 Portland residents value local expertise and patient-centered care. Our AI helps your dental practice communicate those values through clean, professional, and inviting ad creatives. Whether you're focusing on family dentistry or cosmetic procedures, AdSynth delivers.
               </p>
               <div className="p-6 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900">
                 <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Did you know?</h4>
                 <p className="text-sm text-blue-700 dark:text-blue-400">Portland homeowners are 30% more likely to click on ads that emphasize local ownership and community involvement.</p>
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🦷", label: "General Care" },
                  { icon: "✨", label: "Cosmetic" },
                  { icon: "📅", label: "Bookings" },
                  { icon: "🤝", label: "Trust" }
                ].map((item, i) => (
                  <div key={i} className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center border border-gray-100 dark:border-gray-800">
                    <span className="text-4xl mb-2">{item.icon}</span>
                    <span className="font-bold text-sm">{item.label}</span>
                  </div>
                ))}
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
