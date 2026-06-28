import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "AdSynth — AI-Powered Ad Creatives That Convert. On Autopilot.",
      },
      {
        name: "description",
        content:
          "Get premium AI-generated ad creatives for Facebook, Instagram, and Google Display. Fast, affordable, and optimized for conversion. No agency needed.",
      },
      { name: "og:title", content: "AdSynth — AI-Powered Ad Creatives" },
      {
        name: "og:description",
        content:
          "Premium AI-generated ad creatives for local businesses. Subscribe and get conversion-optimized ads delivered monthly.",
      },
      { name: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AdSynth — AI-Powered Ad Creatives" },
      {
        name: "twitter:description",
        content:
          "Get premium AI-generated ad creatives for Facebook, Instagram, and Google Display. Subscribe and get conversion-optimized ads delivered monthly.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
      },
      { rel: "icon", href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✨</text></svg>" },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-500">404</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Page not found
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
        >
          Go home
        </a>
      </div>
    </div>
  ),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh">
        {children}
        <Scripts />
      </body>
    </html>
  );
}