import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/lib/ThemeContext";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EV Charging — Admin Panel",
  description: "Admin dashboard for EV Charging app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <body suppressHydrationWarning className={`${geistSans.variable} antialiased`}>
        <Script id="theme-pref-loader" strategy="beforeInteractive">
          {`
            try {
              var t = localStorage.getItem('admin_theme');
              if (t === 'light' || t === 'dark') {
                document.documentElement.setAttribute('data-theme', t);
                document.documentElement.classList.add(t);
                document.documentElement.style.colorScheme = t;
              } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.documentElement.classList.add('dark');
              }
            } catch (e) {
              document.documentElement.setAttribute('data-theme', 'dark');
              document.documentElement.classList.add('dark');
            }
          `}
        </Script>
        <ThemeProvider>
          <Toaster position="top-right" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
