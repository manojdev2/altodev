/* eslint-disable @next/next/no-img-element */
export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center mb-6">
            <div className="p-4 w-5 h-5 bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] rounded-full flex items-center justify-center">
              <span className="text-black text-[16px] font-bold">H</span>
            </div>
            <span className="text-[16px] font-bold text-black">ow it works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Get Charge In{" "}
            <span className="bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] bg-clip-text text-transparent">
              3 Easy Steps
            </span>
          </h2>
          <p className="mt-4 text-gray-400 text-sm sm:text-base">
            From Finding a station to completing your charge, we&apos;ve made it effortless
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col">
            <div className="w-14 h-14 bg-[#EBFBF2] rounded-xl flex items-center justify-center">
              <img src="/image/Frame (2).png" alt="Locate Stations icon" />
            </div>
            <p className="text-sm font-semibold text-[#3BD37E] mb-1.5 mt-3">Find nearby charging points</p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Locate Stations</h3>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
              Real-time map view shows all available stations with live availability status.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col">
            <div className="w-14 h-14 bg-[#EBFBF2] rounded-xl flex items-center justify-center">
              <img src="/image/Frame (1).png" alt="Book Instantly icon" />
            </div>
            <p className="text-sm font-semibold text-[#3BD37E] mb-5 mt-3">Reserve your spot</p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Book Instantly</h3>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
              Navigate to your chosen station or reserve a charging spot with one tap
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col">
            <div className="w-14 h-14 bg-[#EBFBF2] rounded-xl flex items-center justify-center">
              <img src="/image/Frame.png" alt="Track & Charge icon" />
            </div>
            <p className="text-sm font-semibold text-[#3BD37E] mb-1.5 mt-3">Monitor in real-time</p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Track &amp; Charge</h3>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
              Track charging progress, time remaining, and manage payments seamlessly
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
