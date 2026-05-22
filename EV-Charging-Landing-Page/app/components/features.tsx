/* eslint-disable @next/next/no-img-element */
export default function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center mb-6">
            <div className="p-4 w-5 h-5 bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] rounded-full flex items-center justify-center">
              <span className="text-black text-[16px] font-bold">F</span>
            </div>
            <span className="text-[16px] font-bold text-black">eatures</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.8rem] font-bold text-gray-900 leading-tight">
            Everything You need
          </h2>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-[2.8rem] font-bold bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] bg-clip-text text-transparent leading-tight">
            All in One place
          </h2>
          <p className="mt-4 text-gray-400 text-sm sm:text-base max-w-md mx-auto">
            Advanced features designed to make EV charging effortless and efficient
          </p>
        </div>

        {/* Bento grid */}
        <div className="flex flex-col gap-4 md:grid md:[grid-template-columns:5fr_3fr_3fr] md:[grid-template-rows:auto_auto_auto] md:gap-4 lg:gap-6">

          {/* 1 — Real-Time Availability (tall left card) */}
          <div className="relative rounded-[24px] overflow-hidden p-6 sm:p-8 min-h-[340px] sm:min-h-[400px] md:min-h-0 md:h-[460px] lg:h-[580px] bg-[#F0ECFB] md:[grid-column:1/2] md:[grid-row:1/3]">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Real-Time Availability</h3>
              <p className="text-sm text-gray-500 mt-1.5 max-w-[220px]">Live updates on station availability and wait times</p>
            </div>
            <img
              src="/image/Group (1).png"
              alt="Real-Time Availability"
              className="absolute object-contain bottom-2 left-[5%] w-[42%] h-auto md:bottom-auto md:top-[150px] md:left-[20px] md:w-[150px] md:h-[230px] lg:top-[163px] lg:w-[258px] lg:h-[303px]"
            />
            <img
              src="/image/hand.png"
              alt="Hand with phone"
              className="absolute object-contain bottom-0 right-0 w-[44%] h-auto md:bottom-auto md:top-[150px] md:w-[100px] md:h-[310px] lg:top-[169px] lg:left-[220px] lg:w-[250px] lg:h-[413px]"
            />
          </div>

          {/* 2 — Smart Navigation */}
          <div className="relative rounded-[24px] overflow-hidden p-6 sm:p-8 min-h-[200px] sm:min-h-[240px] md:min-h-0 md:h-[220px] lg:h-[278px] bg-[#FCDFE9] md:[grid-column:2/4] md:[grid-row:1/2]">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Smart Navigation</h3>
              <p className="text-sm text-gray-500 mt-1.5 max-w-[220px]">AI-powered routes optimized for your battery level</p>
            </div>
            <img
              src="/image/Group 2.png"
              alt="Smart Navigation"
              className="absolute object-contain bottom-0 right-0 w-[55%] max-h-[150px] sm:w-[65%] sm:max-h-[190px] md:w-[190px] md:h-[180px] md:max-h-none lg:w-[340px] lg:h-[240px]"
            />
          </div>

          {/* 3 — Session Tracking */}
          <div className="relative rounded-[24px] overflow-hidden p-6 sm:p-8 min-h-[200px] sm:min-h-[240px] md:min-h-0 md:h-[220px] lg:h-[278px] bg-[#FEF7DB] md:[grid-column:2/3] md:[grid-row:2/3]">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Session Tracking</h3>
              <p className="text-sm text-gray-500 mt-1.5 max-w-[200px]">Real-time monitoring of charging progress and stats</p>
            </div>
            <img
              src="/image/g3.png"
              alt="Session Tracking"
              className="absolute object-contain bottom-0 left-1/2 -translate-x-1/2 w-[50%] max-h-[120px] sm:w-[55%] sm:max-h-[160px] md:w-[100px] md:h-[150px] lg:w-[180px] lg:h-[160px]"
            />
          </div>

          {/* 4 — Digital Payments */}
          <div className="relative rounded-[24px] overflow-hidden p-6 sm:p-8 min-h-[200px] sm:min-h-[240px] md:min-h-0 md:h-[220px] lg:h-[278px] bg-[#FDE9DD] md:[grid-column:3/4] md:[grid-row:2/3]">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Digital Payments</h3>
              <p className="text-sm text-gray-500 mt-1.5 max-w-[180px]">Secure booking and contactless payments in-app</p>
            </div>
            <img
              src="/image/g4.png"
              alt="Digital Payments"
              className="absolute object-contain bottom-0 right-0 w-[55%] max-h-[120px] sm:w-[60%] sm:max-h-[160px] md:w-[140px] md:h-[125px] md:max-h-none lg:w-[200px] lg:h-[160px]"
            />
          </div>

          {/* 5 — Low Battery Alerts */}
          <div className="relative rounded-[24px] overflow-hidden p-6 sm:p-8 min-h-[200px] sm:min-h-[240px] md:min-h-0 md:h-[220px] lg:h-[278px] bg-[#FDE9DD] md:[grid-column:1/2] md:[grid-row:3/4]">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Low Battery Alerts</h3>
              <p className="text-sm text-gray-500 mt-1.5 max-w-[200px]">Smart notifications before you need to charge</p>
            </div>
            <img
              src="/image/g5.png"
              alt="Low Battery Alerts"
              className="absolute object-contain bottom-0 right-4 w-[52%] max-h-[160px] sm:w-[58%] sm:max-h-[210px] md:w-[140px] md:h-[160px] md:max-h-none md:right-5 lg:w-[240px] lg:h-[220px] lg:right-8"
            />
          </div>

          {/* 6 — Station Notifications */}
          <div className="relative rounded-[24px] overflow-hidden p-6 sm:p-8 min-h-[200px] sm:min-h-[240px] md:min-h-0 md:h-[220px] lg:h-[278px] bg-[#EEF2F5] md:[grid-column:2/4] md:[grid-row:3/4]">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Station Notifications</h3>
              <p className="text-sm text-gray-500 mt-1.5 max-w-[220px]">Instant alerts on station status and pricing changes</p>
            </div>
            <img
              src="/image/g7.png"
              alt="Station Notifications"
              className="absolute object-contain bottom-0 right-0 w-[55%] max-h-[160px] sm:w-[62%] sm:max-h-[210px] md:w-[190px] md:h-[150px] md:max-h-none lg:w-[280px] lg:h-[220px]"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
