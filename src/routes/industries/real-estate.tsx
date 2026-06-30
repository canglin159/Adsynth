import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/industries/real-estate")({
  component: RealEstateIndustryPage,
});

function RealEstateIndustryPage() {
  useEffect(() => {
    document.title = "AdSynth | AI Ad Creatives for Real Estate Agents";
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
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

      <header className="py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full" />
          <div className="bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
                Real Estate Marketing Solutions
              </span>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Win More Listings with <span className="text-blue-600">Stunning Property Ads</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
                Elevate your real estate brand. From "Just Listed" alerts to seller valuation campaigns, AdSynth generates high-end visuals that capture attention and build trust.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <a href="/#pricing" className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/20 transition-all text-center">
                  Start Listing More
                </a>
                <a href="#examples" className="w-full sm:w-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-all text-center">
                  View Property Ads
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/images/real-estate-hero.png" 
                  alt="Luxury Real Estate Listing" 
                  className="w-full h-auto object-cover aspect-square md:aspect-video lg:aspect-square"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Market Dominance</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">Top 1% Visuals</p>
                  </div>
                </div>
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
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Listing Notifications</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Instantly generate "Just Listed" and "Under Contract" creatives that build momentum and authority.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950 text-indigo-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Seller Valuation Leads</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Conversion-optimized copy designed to drive homeowners to your valuation tools and book listing appointments.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950 text-purple-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Personal Branding</h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI-suggested marketing angles that highlight your local expertise, sales record, and client testimonials.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="examples" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Real Estate Ad Examples</h2>
            <p className="text-gray-600 dark:text-gray-400">Winning creatives for Facebook and Instagram.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {["Just Listed", "Home Valuation", "Client Success"].map((name, i) => (
              <div key={i} className="aspect-[4/5] bg-gray-100 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 group hover:border-blue-500 transition-colors overflow-hidden">
                <div className="text-center p-6 w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 group-hover:bg-blue-50/10 transition-colors">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-blue-500">🏠</span>
                  </div>
                  <p className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{name} Ad</p>
                  <p className="text-sm text-gray-500 mb-4">Optimized for Facebook Feed</p>
                  <div className="space-y-2 text-left bg-blue-50 dark:bg-gray-800 p-4 rounded-lg text-xs w-full max-w-[200px]">
                    <div className="h-2 w-3/4 bg-blue-100 dark:bg-blue-700 rounded" />
                    <div className="h-2 w-full bg-blue-100 dark:bg-blue-700 rounded" />
                    <div className="h-2 w-1/2 bg-blue-100 dark:bg-blue-700 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600 text-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">Ready to dominate your local market?</h2>
          <p className="text-xl mb-10 opacity-90 text-white">Join 150+ real estate professionals who use AdSynth to automate their marketing creative.</p>
          <a href="/#pricing" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 transition-colors shadow-xl">
            Get Started Now
          </a>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AdSynth. All rights reserved.</p>
      </footer>
    </div>
  );
}
