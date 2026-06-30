import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/industries/restaurant")({
  component: RestaurantIndustryPage,
});

function RestaurantIndustryPage() {
  useEffect(() => {
    document.title = "AdSynth | AI Ad Creatives for Restaurants";
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
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full" />
          <div className="bottom-0 right-1/4 w-96 h-96 bg-red-500/10 blur-[100px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-6">
                Restaurant Marketing Solutions
              </span>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Drive More Foot Traffic with <span className="text-orange-500">Crave-Worthy Ads</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
                Make them hungry. From "Weekly Specials" to happy hour promotions, AdSynth generates high-impact visual ads that turn scrolls into reservations and orders.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <a href="/#pricing" className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/20 transition-all text-center">
                  Get More Customers
                </a>
                <a href="#examples" className="w-full sm:w-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-all text-center">
                  View Food Ads
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/images/restaurant-hero.png" 
                  alt="Delicious Restaurant Food" 
                  className="w-full h-auto object-cover aspect-square md:aspect-video lg:aspect-square"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1L12 11V8m0 8c-1.11 0-2.08-.407-2.67-1L12 13v3" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Revenue Lift</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">+25% More Orders</p>
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
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950 text-orange-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Daily & Weekly Specials</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Quickly update your ads for Taco Tuesday, Sunday Brunch, or a new seasonal menu launch.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-950 text-red-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Delivery & Takeout Boost</h3>
              <p className="text-gray-600 dark:text-gray-400">
                High-converting copy designed to drive direct orders and reduce your reliance on expensive delivery apps.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-950 text-yellow-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.99 7.99 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14l.879 2.121z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Event Promotion</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Beautiful creatives for live music, trivia nights, holiday parties, and catering services.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="examples" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Restaurant Ad Examples</h2>
            <p className="text-gray-600 dark:text-gray-400">Proven creatives for Instagram and Facebook.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {["Special Offer", "New Menu", "Event Promo"].map((name, i) => (
              <div key={i} className="aspect-[4/5] bg-gray-100 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 group hover:border-orange-500 transition-colors overflow-hidden">
                <div className="text-center p-6 w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 group-hover:bg-orange-50/10 transition-colors">
                  <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-orange-500">🍔</span>
                  </div>
                  <p className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{name} Ad</p>
                  <p className="text-sm text-gray-500 mb-4">Optimized for Instagram Feed</p>
                  <div className="space-y-2 text-left bg-orange-50 dark:bg-gray-800 p-4 rounded-lg text-xs w-full max-w-[200px]">
                    <div className="h-2 w-3/4 bg-orange-200 dark:bg-orange-700 rounded" />
                    <div className="h-2 w-full bg-orange-200 dark:bg-orange-700 rounded" />
                    <div className="h-2 w-1/2 bg-orange-200 dark:bg-orange-700 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-orange-500 text-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">Ready to pack your tables?</h2>
          <p className="text-xl mb-10 opacity-90 text-white">Join 100+ restaurants that use AdSynth to automate their visual marketing.</p>
          <a href="/#pricing" className="inline-block bg-white text-orange-600 px-10 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 transition-colors shadow-xl">
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
