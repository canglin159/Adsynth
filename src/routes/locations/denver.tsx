import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/locations/denver")({
  component: DenverLocationPage,
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

function DenverLocationPage() {
  useEffect(() => {
    document.title = "AdSynth | Med Spa Advertising in Denver, CO | AI Ad Creatives";
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Denver Med Spa Ad Creative Service",
    "provider": {
      "@type": "Organization",
      "name": "AdSynth"
    },
    "areaServed": {
      "@type": "City",
      "name": "Denver"
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
        <header className="py-24 px-4 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-950">
          <div className="max-w-4xl mx-auto text-center">
            <Breadcrumbs items={[{ label: "Locations" }, { label: "Denver, CO" }]} />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-8">
              🏔️ Local Service: Denver, CO
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Elevated Med Spa Marketing for the <span className="text-brand-500">Denver Market</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Attract more clients to your Denver clinic with gorgeous, AI-generated creatives. AdSynth delivers sophisticated ads tailored to the discerning Denver clientele.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/#pricing" className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/20 transition-all">
                Grow Your Denver Clinic
              </Link>
              <Link to="/" className="w-full sm:w-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-all">
                Explore Services
              </Link>
            </div>
          </div>
        </header>

        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <div className="bg-gray-100 dark:bg-gray-800 aspect-video rounded-3xl flex items-center justify-center text-6xl shadow-inner">
               ✨
             </div>
             <div>
               <h2 className="text-3xl font-bold mb-6">Why Denver Med Spas Choose AdSynth</h2>
               <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                 The Denver aesthetics market is booming, and your med spa needs a brand that reflects the premium nature of your services. AdSynth creates sophisticated ad creatives for Botox, fillers, laser treatments, and more—all tailored to your specific Denver location.
               </p>
               <ul className="space-y-4">
                 {[
                   "Sophisticated Design Aesthetic",
                   "High-End Patient Targeting",
                   "Rapid 24-Hour Turnaround",
                   "Unlimited Design Revisions"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3">
                     <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                     <span className="font-medium">{item}</span>
                   </li>
                 ))}
               </ul>
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
