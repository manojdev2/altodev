/* eslint-disable @next/next/no-img-element */

export default function WhyChooseUs() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center mb-6">
            <div className="p-4 w-5 h-5 bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] rounded-full flex items-center justify-center">
              <span className="text-black text-[16px] font-bold">W</span>
            </div>
            <span className="text-[16px] font-bold text-black">hy Choose Us</span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center leading-tight">
          The Smartest Way to{" "}
          <span className="bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] bg-clip-text text-transparent">
            Charge Your EV
          </span>
        </h2>
        <p className="mt-4 text-gray-400 text-sm sm:text-base text-center max-w-lg mx-auto">
          Join 50,000+ drivers who&apos;ve made the switch to smarter charging
        </p>

        {/* 3 Cards */}
        <div className="flex flex-col md:flex-row justify-between gap-5 mt-12 lg:mt-16">
          {/* Card 1 */}
          <div className="relative w-full md:w-102.5 h-102.5 rounded-2xl border border-gray-200 overflow-hidden group">
            <img
              src="/image/img1.jpg"
              alt="Reduce Range Anxiety"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white border-t border-white/60 pt-2">
                Reduce Range Anxiety
              </h3>
              <p className="mt-2 text-white/80 text-xs sm:text-sm leading-relaxed">
                Never worry about running out of charge again. Find nearby EV charging stations instantly, plan smarter routes, and stay powered wherever the road takes you.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative w-full md:w-102.5 h-102.5 rounded-2xl border border-gray-200 overflow-hidden group">
            <img
              src="/image/img2.jpg"
              alt="Charge Smarter, Not Harder"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white border-t border-white/60 pt-2">
                Charge Smarter, Not Harder
              </h3>
              <p className="mt-2 text-white/80 text-xs sm:text-sm leading-relaxed">
                Intelligent routing and station recommendations in real time, optimized for your vehicle, battery level, and driving conditions for safer, smoother, longer EV journeys.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative w-full md:w-102.5 h-102.5 rounded-2xl border border-gray-200 overflow-hidden group">
            <img
              src="/image/img3.jpg"
              alt="Built for Modern EV Drivers"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white border-t border-white/60 pt-2">
                Built for Modern EV Drivers
              </h3>
              <p className="mt-2 text-white/80 text-xs sm:text-sm leading-relaxed">
                Designed with your needs in mind, every step of the journey, from planning to charging for a truly seamless EV experience worldwide, anytime, anywhere, without range anxiety.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-12 lg:mt-16 rounded-2xl bg-linear-to-r from-[#E8FBF2] via-[#E8F8FB] to-[#EEF4FF] py-10 px-6 sm:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] bg-clip-text text-transparent">
                50K+
              </p>
              <p className="mt-1 text-gray-500 text-sm">Active Users</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] bg-clip-text text-transparent">
                10K+
              </p>
              <p className="mt-1 text-gray-500 text-sm">Charging Stations</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] bg-clip-text text-transparent">
                100K+
              </p>
              <p className="mt-1 text-gray-500 text-sm">Charging Sessions</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] bg-clip-text text-transparent">
                4.8★
              </p>
              <p className="mt-1 text-gray-500 text-sm">App Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
