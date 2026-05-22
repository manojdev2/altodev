"use client";
import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  label?: string;
  fullscreen?: boolean;
}

export function PageLoader({ label = "Loading...", fullscreen = false }: PageLoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-center ${
        fullscreen ? "min-h-screen w-full" : "py-16 min-h-[50vh] w-full"
      }`}
    >
      <Loader2 className="h-10 w-10 animate-spin text-[#00C950]" />
      <p className="text-sm text-gray-500 dark:text-gray-300">{label}</p>
    </div>
  );
}
