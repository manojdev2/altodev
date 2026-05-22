/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

export default function HeroSection() {
  const [showVideo, setShowVideo] = useState(false);
  return (
    <>
      {/* Navbar */}
      <div className="sticky top-0 z-50 px-4 sm:px-5 pt-4 sm:pt-5">
        <nav className="rounded-[2.5rem] shadow-sm bg-white/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <input type="checkbox" id="menu-toggle" className="hidden peer" />
            <div className="flex items-center justify-between h-16 lg:h-20">
              <a href="#" className="flex items-center shrink-0">
                <img src="/image/Frame 2131331405.png" alt="EV ChargeFinder" className="h-8 sm:h-9" />
              </a>
              <div className="hidden lg:flex items-center gap-8">
                <a href="#home" className="text-sm font-medium text-gray-700 hover:text-green-500 transition-colors">Home</a>
                <a href="#features" className="text-sm font-medium text-gray-700 hover:text-green-500 transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-green-500 transition-colors">How It Works</a>
                <a href="#app-preview" className="text-sm font-medium text-gray-700 hover:text-green-500 transition-colors">App Preview</a>
                <a href="#testimonials" className="text-sm font-medium text-gray-700 hover:text-green-500 transition-colors">Testimonials</a>
              </div>
              <a href="#contact" className="hidden lg:inline-flex items-center px-6 py-2.5 bg-[#3BD37E] hover:opacity-90 rounded-lg text-white text-sm font-semibold transition-all">
                Contact
              </a>
              <label htmlFor="menu-toggle" className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </label>
            </div>
            {/* Mobile menu */}
            <div className="lg:hidden max-h-0 overflow-hidden transition-all duration-300 ease-in-out peer-checked:max-h-125">
              <div className="flex flex-col gap-3 pt-2 pb-4">
                <a href="#home" className="text-sm font-medium text-gray-700 hover:text-green-500 py-2 transition-colors">Home</a>
                <a href="#features" className="text-sm font-medium text-gray-700 hover:text-green-500 py-2 transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-green-500 py-2 transition-colors">How It Works</a>
                <a href="#app-preview" className="text-sm font-medium text-gray-700 hover:text-green-500 py-2 transition-colors">App Preview</a>
                <a href="#testimonials" className="text-sm font-medium text-gray-700 hover:text-green-500 py-2 transition-colors">Testimonials</a>
                <a href="#contact" className="inline-flex items-center justify-center px-6 py-2.5 bg-[#3BD37E] hover:opacity-90 rounded-lg text-white text-sm font-semibold transition-all mt-2">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 pt-8 md:pt-10 lg:pt-14">
            {/* Left: Text content */}
            <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left">
              <h1 className="mb-3 leading-snug text-[1.75rem] sm:text-[2.25rem] md:text-[2.5rem] lg:text-[3.2rem] xl:text-[3.8rem] font-bold">
                Charge Your EV<br />
                <span className="bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] bg-clip-text text-transparent font-bold">
                  Anywhere, Anytime
                </span>
              </h1>
              <p className="mb-3 mt-3 text-gray-500 text-[15px] sm:text-[16px] md:text-[15px] lg:text-[18px] xl:text-[20px] leading-relaxed max-w-md mx-auto md:mx-0">
                Discover nearby charging stations, book instantly,
                and power your journey with real-time availability
                and smart navigation.
              </p>
              <div className="flex flex-wrap md:flex-nowrap lg:flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 lg:gap-3 mt-5 md:mt-7">
                <a href="#" className="inline-flex items-center gap-2 px-6 p-4 bg-[#3BD37E] hover:opacity-90 text-white font-semibold rounded-lg transition-all shadow-lg shadow-green-300/30 sm:text-[16px]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Download Now
                </a>
                <button
                  onClick={() => setShowVideo(true)}
                  className="inline-flex items-center gap-2 px-6 py-4 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Mobile image */}
            <div className="relative md:hidden mt-4 min-h-85 sm:min-h-80 -mb-12 min-[418px]:-mb-4 sm:-mb-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] min-[418px]:w-[40%] sm:w-[34%] z-0 pointer-events-none">
                <img src="/image/greenbg.png" alt="" className="w-full rounded-3xl" />
              </div>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[34%] min-[418px]:w-[26%] sm:w-[22%] z-10">
                <img src="/image/Home 1.png" alt="App Preview" className="w-full rounded-xl shadow-2xl" />
              </div>
              {/* Download card */}
              <div className="absolute left-2 sm:left-4 top-[22%] sm:top-[24%] z-20 animate-float bg-white rounded-2xl shadow-lg px-2.5 py-2.5 w-[28%] sm:w-[25%] text-center">
                <div className="w-7 h-7 bg-blue-50 rounded-xl mx-auto mb-1.5 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="1.5" />
                    <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-[9px] font-bold text-gray-900 leading-tight">Download Free</p>
                <p className="text-[7px] text-gray-400 mt-0.5">iOS &amp; Android</p>
                <div className="flex items-center justify-center gap-px mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-2 h-2 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[7px] text-orange-500 font-bold mt-0.5">4.8 Rating</p>
              </div>
              {/* Top-rated badge */}
              <div className="absolute top-2 right-1 sm:right-3 z-20 animate-float-slow">
                <div className="bg-[#3BD37E] text-white px-2.5 py-1 rounded-full text-[8px] font-semibold flex items-center gap-1 shadow-lg">
                  <svg className="w-2.5 h-2.5 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Top-rated app
                </div>
              </div>
              {/* Network coverage card */}
              <div className="absolute right-1 sm:right-3 top-[42%] sm:top-[45%] z-20 animate-float-slow bg-white rounded-2xl shadow-lg px-2 py-2 flex items-center gap-1.5">
                <div className="w-6 h-6 bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[7px] text-gray-500 font-medium leading-tight">Network Coverage</p>
                  <p className="text-[10px] font-bold text-gray-900 leading-tight">10,000+</p>
                  <p className="text-[7px] text-gray-400 leading-tight">Charging Points</p>
                </div>
              </div>
            </div>

            {/* Desktop image */}
            <div className="relative md:justify-end mt-4 md:mt-0 hidden md:flex">
              <div className="relative flex justify-center items-start w-64 md:w-56 lg:w-64 xl:w-72 min-h-65 md:min-h-70 lg:min-h-80 xl:min-h-90">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[115%] z-0 pointer-events-none">
                  <img src="/image/greenbg.png" alt="" className="w-full rounded-xl" />
                </div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[50%] md:w-[52%] lg:w-[55%] xl:w-[58%] z-10">
                  <img src="/image/Home 1.png" alt="App Preview" className="w-full rounded-2xl shadow-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom area with floating cards and car image */}
        <div className="relative mt-0 sm:mt-4 md:mt-10 lg:mt-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Network coverage card (desktop) */}
            <div className="absolute top-0 md:top-4 left-[38%] md:left-[38%] lg:left-[42%] z-20 animate-float-slow hidden md:flex">
              <div className="bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">Network Coverage</p>
                  <p className="text-lg font-bold text-gray-900 leading-tight">10,000+</p>
                  <p className="text-[10px] text-gray-400">Charging Points</p>
                </div>
              </div>
            </div>

            {/* Top-rated badge (desktop) */}
            <div className="absolute top-0 md:top-4 right-4 md:right-8 lg:right-28 z-20 animate-float hidden md:block">
              <div className="bg-[#3BD37E] text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                <svg className="w-3.5 h-3.5 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Top-rated app
              </div>
            </div>

            {/* Download card (desktop) */}
            <div className="absolute bottom-6 sm:bottom-12 md:bottom-20 left-2 sm:left-4 md:left-6 lg:left-10 z-20 animate-float w-36 sm:w-40 md:w-auto hidden sm:block">
              <div className="bg-white rounded-2xl shadow-xl px-3 sm:px-5 py-3 sm:py-4 text-center">
                <div className="w-10 h-10 bg-[#3BD37E] rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="2" />
                    <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-gray-900">Download Free</p>
                <p className="text-[10px] text-gray-400 mt-0.5">iOS &amp; Android</p>
                <div className="flex items-center justify-center gap-0.5 mt-1.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[10px] text-orange-500 font-semibold mt-1">4.8 Rating</p>
              </div>
            </div>

            {/* Car image */}
            <div className="relative flex items-end justify-center lg:pb-6">
              <div className="w-full relative">
                <img
                  src="/image/white-tesla-model-s-charging-charging-station_866987-14 1.png"
                  alt="EV Car Charging"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-10 right-0 sm:top-3 sm:right-3 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/yT5uXXfiRmM?autoplay=1&rel=0"
              title="EV Charging Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
