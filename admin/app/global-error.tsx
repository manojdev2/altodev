"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#101828] text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-[#00C950]">Unexpected error</p>
            <h1 className="text-2xl font-bold mt-2">Something went wrong</h1>
            <p className="text-gray-300 mt-1">We couldn&apos;t render this page. Try again or return to the dashboard.</p>
          </div>
          {error?.digest && (
            <p className="text-xs text-gray-500">Error digest: {error.digest}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded-lg bg-[#00C950] text-sm font-semibold text-[#0B1E13] hover:bg-[#00b347] transition-colors"
            >
              Try again
            </button>
            <a
              href="/dashboard"
              className="px-4 py-2 rounded-lg border border-white/20 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Go to dashboard
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}