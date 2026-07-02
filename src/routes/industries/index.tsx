import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/industries/")({
  component: IndustriesHubPage,
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

const INDUSTRIES = [
  { 
    name: "HVAC", 
    slug: "hvac", 
    description: "Emergency repair and seasonal maintenance leads.",
    icon: "❄️",
    color: "from-blue-500 to-cyan-400"
  },
  { 
    name: "Dental", 
    slug: "dental", 
    description: "New patient bookings and aesthetic dentistry.",
    icon: "🦷",
    color: "from-teal-500 to-emerald-400"
  },
  { 
    name: "Landscaping", 
    slug: "landscaping", 
    description: "Design-build projects and maintenance contracts.",
    icon: "🌳",
    color: "from-green-600 to-lime-500"
  },
  { 
    name: "Plumbing", 
    slug: "plumbing", 
    description: "24/7 emergency service and installation leads.",
    icon: "🚰",
    color: "from-blue-600 to-indigo-500"
  },
  { 
    name: "Roofing", 
    slug: "roofing", 
    description: "Storm damage and full replacement campaigns.",
    icon: "🏠",
    color: "from-orange-500 to-yellow-500"
  },
  { 
    name: "Med Spa", 
    slug: "med-spa", 
    description: "High-ticket aesthetic and wellness services.",
    icon: "✨",
    color: "from-pink-500 to-rose-400"
  },
  { 
    name: "Real Estate", 
    slug: "real-estate", 
    description: "Listing promotions and seller lead generation.",
    icon: "🏘️",
    color: "from-violet-600 to-purple-500"
  },
  { 
    name: "Restaurant", 
    slug: "restaurant", 
    description: "Foot traffic and online ordering promotions.",
    icon: "🍔",
    color: "from-orange-600 to-red-500"
  },
  { 
    name: "Auto Detailing", 
    slug: "auto-detailing", 
    description: "Ceramic coating and premium detailing packages.",
    icon: "🏎️",
    color: "from-blue-700 to-cyan-600"
  },
];

function IndustriesHubPage() {
  useEffect(() => {
    document.title = "AdSynth | Industries We Serve - AI Ad Creatives";
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Industries Served by AdSynth",
    "itemListElement": INDUSTRIES.map((ind, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": "https://adsynth.ctonew.app/industries/" + ind.slug,
      "name": ind.name
    }))
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
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
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium hover:text-brand-500 transition-colors">Home</Link>
            <a href="/#pricing" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      <header className="py-20 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={[{ label: "Industries" }]} />
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Marketing Solutions for <span className="text-brand-500">Every Industry</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              AdSynth specialized AI engines understand the unique pain points, seasonal trends, and high-converting angles for your specific niche.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INDUSTRIES.map((ind) => (
            <Link 
              key={ind.slug} 
              to={"/industries/" + ind.slug}
              className="group bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-500/5 transition-all flex flex-col"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 dark:from-brand-500/10 dark:to-purple-500/10 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                {ind.icon}
              </div>
              <h2 className="text-2xl font-bold mb-3 group-hover:text-brand-500 transition-colors">{ind.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 flex-grow">
                {ind.description}
              </p>
              <div className="flex items-center text-brand-500 font-bold group-hover:gap-2 transition-all">
                View Solutions
                <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <section className="bg-brand-600 py-24 text-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Don't see your industry?</h2>
          <p className="text-xl mb-10 opacity-90">Our AI is highly adaptable. We work with 50+ different local service categories. Reach out and we'll show you what we can do.</p>
          <a href="/#contact" className="inline-block bg-white text-brand-600 px-10 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 transition-colors">
            Contact Sales
          </a>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AdSynth. All rights reserved.</p>
      </footer>
    </div>
  );
}
