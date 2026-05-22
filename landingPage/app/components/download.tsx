export default function Download() {
  return (
    <section id="download" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-3xl px-6 sm:px-12 lg:px-16 py-20 text-center overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: "url('/image/download.png')",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "rgba(78, 223, 124, 0.8)",
            }}
          ></div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Download the EV Station Finder App
            </h2>
            <p className="mt-4 sm:mt-5 text-white/80 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Join thousands of EV drivers who charge smarter with our app, saving time, money, and energy every day
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8 sm:mt-10">
              {/* Google Play */}
              <a
                href="#"
                className="inline-flex items-center gap-3 bg-gray-900 text-white rounded-xl px-5 py-3 hover:bg-black transition-colors"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3.18 2.04C3.06 2.16 3 2.35 3 2.59v18.82c0 .24.06.43.18.55l.03.03L13.4 12.4v-.08L3.21 2.01l-.03.03z"
                    fill="#4285F4"
                  />
                  <path
                    d="M16.81 15.81l-3.41-3.41v-.08l3.41-3.41.08.04 4.04 2.29c1.15.65 1.15 1.72 0 2.38l-4.04 2.29-.08.04v-.14z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M16.89 15.67L13.4 12.18 3.18 22.41c.38.4 1.01.45 1.73.05l11.98-6.79z"
                    fill="#EA4335"
                  />
                  <path
                    d="M16.89 8.65L4.91 1.86C4.19 1.46 3.56 1.51 3.18 1.91l10.22 10.27 3.49-3.53z"
                    fill="#34A853"
                  />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wide opacity-80">Get it on</div>
                  <div className="text-base font-semibold leading-tight">Google Play</div>
                </div>
              </a>

              {/* App Store */}
              <a
                href="#"
                className="inline-flex items-center gap-3 bg-gray-900 text-white rounded-xl px-5 py-3 hover:bg-black transition-colors"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wide opacity-80">Download on the</div>
                  <div className="text-base font-semibold leading-tight">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
