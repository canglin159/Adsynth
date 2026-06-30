import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/industries/dental")({
  component: DentalIndustryPage,
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

function DentalIndustryPage() {
  useEffect(() => {
    document.title = "AdSynth | AI Ad Creatives for Dental Practices";
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Dental Ad Creative Service",
    "provider": {
      "@type": "Organization",
      "name": "AdSynth"
    },
    "description": "AI-powered ad creatives specifically for dental practices and dentists.",
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
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full" />
          <div className="bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Breadcrumbs items={[{ label: "Industries" }, { label: "Dental" }]} />
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left order-2 lg:order-1">
              <span className="inline-block px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-6">
                Dental Marketing Solutions
              </span>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Get More <span className="text-teal-600">New Patient Bookings</span> Every Month
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
                From Invisalign offers to new patient cleaning specials. AdSynth generates premium dental ad creatives that build trust and drive appointments.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <a href="/#pricing" className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/20 transition-all text-center">
                  Start Your 24h Delivery
                </a>
                <a href="#examples" className="w-full sm:w-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-all text-center">
                  View Dental Examples
                </a>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 transform lg:-rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/images/dental-hero.png" 
                  alt="Modern Dental Office" 
                  className="w-full h-auto object-cover aspect-square md:aspect-video lg:aspect-square"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Patient Trust</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">5.0 Star Rating</p>
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
              <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950 text-teal-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Smile-First Aesthetics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                High-end visuals that emphasize clean, bright results and friendly, professional care.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950 text-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Appointment Driven</h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI copy optimized to reduce booking friction and highlight easy scheduling and insurance.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Trust & Authority</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ads that showcase your credentials, years in practice, and glowing 5-star patient reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Dental Ad Examples</h2>
            <p className="text-gray-600 dark:text-gray-400">Proven creatives for Facebook, Instagram, and Google.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {["Invisalign", "Teeth Whitening", "New Patient Special"].map((name, i) => (
              <div key={i} className="aspect-[4/5] bg-gray-100 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 group hover:border-teal-500 transition-colors overflow-hidden">
                <div className="text-center p-6 w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 group-hover:bg-teal-50/10 transition-colors">
                  <div className="w-16 h-16 bg-teal-50 dark:bg-teal-950 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-teal-500">🦷</span>
                  </div>
                  <p className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{name} Ad</p>
                  <p className="text-sm text-gray-500 mb-4">Optimized for Instagram Stories</p>
                  <div className="space-y-2 text-left bg-teal-50 dark:bg-gray-800 p-4 rounded-lg text-xs w-full max-w-[200px]">
                    <div className="h-2 w-3/4 bg-teal-200 dark:bg-teal-700 rounded" />
                    <div className="h-2 w-full bg-teal-200 dark:bg-teal-700 rounded" />
                    <div className="h-2 w-1/2 bg-teal-200 dark:bg-teal-700 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 bg-teal-600 text-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">Ready for more new patients?</h2>
          <p className="text-xl mb-10 opacity-90 text-white">Join 200+ dental practices that use AdSynth to automate their creative workflow.</p>
          <a href="/#pricing" className="inline-block bg-white text-teal-600 px-10 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 transition-colors shadow-xl">
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
