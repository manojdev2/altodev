'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 1000 * 60 * 5, retry: 1, refetchOnWindowFocus: false },
    },
  }));
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
    <QueryClientProvider client={client}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#F0F0F0',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
            backdropFilter: 'blur(16px)',
          },
          success: { iconTheme: { primary: '#39FF14', secondary: '#0a0a0a' } },
          error: { iconTheme: { primary: '#FF4444', secondary: '#0a0a0a' } },
        }}
      />
    </QueryClientProvider>
    </APIProvider>
  );
}
