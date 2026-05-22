/* eslint-disable @next/next/no-img-element */

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-[#f5f6f8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Badge */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center mb-6">
            <div className="p-4 w-5 h-5 bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] rounded-full flex items-center justify-center">
              <span className="text-black text-[16px] font-bold">T</span>
            </div>
            <span className="text-[16px] font-bold text-black">estimonials</span>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center leading-tight">
          Loved by{" "}
          <span className="bg-linear-to-r from-[#00D3F2] to-[#51A2FF] bg-clip-text text-transparent">
            50000+ Users
          </span>
        </h2>
        <p className="mt-3 text-gray-400 text-sm sm:text-base text-center">
          See what our community has to say about their experience
        </p>

        <div className="group mt-10 sm:mt-14 relative">
          <input type="radio" name="testimonial" id="slide1" className="hidden" defaultChecked />
          <input type="radio" name="testimonial" id="slide2" className="hidden" />
          <input type="radio" name="testimonial" id="slide3" className="hidden" />
          <input type="radio" name="testimonial" id="slide4" className="hidden" />
          <input type="radio" name="testimonial" id="slide5" className="hidden" />

          <div>
            <div className="overflow-hidden rounded-2xl">
              <div className="flex transition-transform duration-500 ease-in-out group-has-[#slide1:checked]:translate-x-0 group-has-[#slide2:checked]:-translate-x-full group-has-[#slide3:checked]:translate-x-[-200%] group-has-[#slide4:checked]:translate-x-[-300%] group-has-[#slide5:checked]:translate-x-[-400%]">
                {/* Slide 1 - Jacob Jones */}
                <div className="min-w-full flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-sm">
                  <div className="relative w-full sm:w-[42%] min-h-70 sm:min-h-105 bg-gray-300 shrink-0">
                    <img
                      src="/image/man.jpg"
                      alt="Jacob Jones"
                      className="w-full h-full object-cover object-center absolute inset-0"
                    />
                    <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-4">
                      <div className="flex-1 bg-white/30 backdrop-blur-md border border-white/60 rounded-xl px-4 py-3">
                        <p className="text-[10px] text-black">Trips Completed</p>
                        <p className="text-xl font-bold text-black">127</p>
                      </div>
                      <div className="flex-1 bg-white/30 backdrop-blur-md border border-white/60 rounded-xl px-4 py-3">
                        <p className="text-[10px] text-black">Total Saved</p>
                        <p className="text-xl font-bold text-black">$340</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex-1 bg-[#C8EDD8] p-6 sm:p-10 flex flex-col justify-center">
                    <div className="absolute top-6 right-6 text-[80px] sm:text-[100px] font-serif leading-none text-[#a3d4b4] select-none">
                      &ldquo;
                    </div>
                    <div className="flex gap-1 mb-4 relative z-10">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-800 text-base sm:text-lg leading-relaxed relative z-10">
                      &quot;This app completely transformed my EV experience. I used to constantly worry about finding charging stations on long trips. Now, the intelligent route planner does all the thinking for me. The real-time availability feature is a game-changer!&quot;
                    </p>
                    <div className="mt-5 flex items-center gap-2 relative z-10">
                      <span className="font-bold text-gray-900">Jacob Jones</span>
                      <span className="bg-white inline-flex items-center gap-1 border border-green-400 rounded-full px-2.5 py-0.5 text-xs text-gray-600">
                        <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verified
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 relative z-10">Tesla Model 3 Owner</p>
                    <p className="text-sm text-gray-400 relative z-10">San Francisco, CA</p>
                    <label
                      htmlFor="slide2"
                      className="absolute bottom-6 right-6 w-10 h-10 bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] rounded-full flex items-center justify-center text-white shadow-md hover:opacity-90 transition-opacity z-10 cursor-pointer"
                    >
                      <img src="/image/play.png" alt="" />
                    </label>
                  </div>
                </div>

                {/* Slide 2 - Sarah Miller */}
                <div className="min-w-full flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-sm">
                  <div className="relative w-full sm:w-[42%] min-h-70 sm:min-h-105 bg-gray-400 shrink-0">
                    <img
                      src="/image/women1.avif"
                      alt="Sarah Miller"
                      className="w-full h-full object-cover object-center absolute inset-0"
                    />
                    <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-4">
                      <div className="flex-1 bg-white/30 backdrop-blur-md border border-white/60 rounded-xl px-4 py-3">
                        <p className="text-[10px] text-gray-200">Trips Completed</p>
                        <p className="text-xl font-bold text-white">84</p>
                      </div>
                      <div className="flex-1 bg-white/30 backdrop-blur-md border border-white/60 rounded-xl px-4 py-3">
                        <p className="text-[10px] text-gray-200">Total Saved</p>
                        <p className="text-xl font-bold text-white">$210</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex-1 bg-[#C8EDD8] p-6 sm:p-10 flex flex-col justify-center">
                    <div className="absolute top-6 right-6 text-[80px] sm:text-[100px] font-serif leading-none text-[#a3d4b4] select-none">
                      &ldquo;
                    </div>
                    <div className="flex gap-1 mb-4 relative z-10">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-800 text-base sm:text-lg leading-relaxed relative z-10">
                      &quot;Finding a charging station has never been easier. The app&apos;s map is incredibly accurate and the booking system is seamless. I saved so much time on my last road trip. Highly recommend to every EV owner!&quot;
                    </p>
                    <div className="mt-5 flex items-center gap-2 relative z-10">
                      <span className="font-bold text-gray-900">Sarah Miller</span>
                      <span className="bg-white inline-flex items-center gap-1 border border-green-400 rounded-full px-2.5 py-0.5 text-xs text-gray-600">
                        <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verified
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 relative z-10">BMW iX Owner</p>
                    <p className="text-sm text-gray-400 relative z-10">Austin, TX</p>
                    <label
                      htmlFor="slide3"
                      className="absolute bottom-6 right-6 w-10 h-10 bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] rounded-full flex items-center justify-center text-white shadow-md hover:opacity-90 transition-opacity z-10 cursor-pointer"
                    >
                      <img src="/image/play.png" alt="" />
                    </label>
                  </div>
                </div>

                {/* Slide 3 - David Chen */}
                <div className="min-w-full flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-sm">
                  <div className="relative w-full sm:w-[42%] min-h-70 sm:min-h-105 bg-gray-500 shrink-0">
                    <img
                      src="/image/man1.jpg"
                      alt="David Chen"
                      className="w-full h-full object-cover object-center absolute inset-0"
                    />
                    <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-4">
                      <div className="flex-1 bg-white/30 backdrop-blur-md border border-white/60 rounded-xl px-4 py-3">
                        <p className="text-[10px] text-gray-200">Trips Completed</p>
                        <p className="text-xl font-bold text-white">203</p>
                      </div>
                      <div className="flex-1 bg-white/30 backdrop-blur-md border border-white/60 rounded-xl px-4 py-3">
                        <p className="text-[10px] text-gray-200">Total Saved</p>
                        <p className="text-xl font-bold text-white">$512</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex-1 bg-[#C8EDD8] p-6 sm:p-10 flex flex-col justify-center">
                    <div className="absolute top-6 right-6 text-[80px] sm:text-[100px] font-serif leading-none text-[#a3d4b4] select-none">
                      &ldquo;
                    </div>
                    <div className="flex gap-1 mb-4 relative z-10">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-800 text-base sm:text-lg leading-relaxed relative z-10">
                      &quot;As someone who drives over 500 miles a week, this app is essential. The low-battery alerts and smart routing have completely eliminated my range anxiety. Best investment I&apos;ve made for my EV lifestyle!&quot;
                    </p>
                    <div className="mt-5 flex items-center gap-2 relative z-10">
                      <span className="font-bold text-gray-900">David Chen</span>
                      <span className="bg-white inline-flex items-center gap-1 border border-green-400 rounded-full px-2.5 py-0.5 text-xs text-gray-600">
                        <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verified
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 relative z-10">Rivian R1T Owner</p>
                    <p className="text-sm text-gray-400 relative z-10">Seattle, WA</p>
                    <label
                      htmlFor="slide4"
                      className="absolute bottom-6 right-6 w-10 h-10 bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] rounded-full flex items-center justify-center text-white shadow-md hover:opacity-90 transition-opacity z-10 cursor-pointer"
                    >
                      <img src="/image/play.png" alt="" />
                    </label>
                  </div>
                </div>

                {/* Slide 4 - Emma Wilson */}
                <div className="min-w-full flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-sm">
                  <div className="relative w-full sm:w-[42%] min-h-70 sm:min-h-105 bg-gray-600 shrink-0">
                    <img
                      src="/image/women2.jpg"
                      alt="Emma Wilson"
                      className="w-full h-full object-cover object-center absolute inset-0"
                    />
                    <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-4">
                      <div className="flex-1 bg-white/30 backdrop-blur-md border border-white/60 rounded-xl px-4 py-3">
                        <p className="text-[10px] text-gray-200">Trips Completed</p>
                        <p className="text-xl font-bold text-white">56</p>
                      </div>
                      <div className="flex-1 bg-white/30 backdrop-blur-md border border-white/60 rounded-xl px-4 py-3">
                        <p className="text-[10px] text-gray-200">Total Saved</p>
                        <p className="text-xl font-bold text-white">$145</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex-1 bg-[#C8EDD8] p-6 sm:p-10 flex flex-col justify-center">
                    <div className="absolute top-6 right-6 text-[80px] sm:text-[100px] font-serif leading-none text-[#a3d4b4] select-none">
                      &ldquo;
                    </div>
                    <div className="flex gap-1 mb-4 relative z-10">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-800 text-base sm:text-lg leading-relaxed relative z-10">
                      &quot;The digital payment system is so convenient. I no longer need to worry about carrying cards or cash at charging stations. The app handles everything seamlessly. A must-have for every EV driver!&quot;
                    </p>
                    <div className="mt-5 flex items-center gap-2 relative z-10">
                      <span className="font-bold text-gray-900">Emma Wilson</span>
                      <span className="bg-white inline-flex items-center gap-1 border border-green-400 rounded-full px-2.5 py-0.5 text-xs text-gray-600">
                        <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verified
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 relative z-10">Chevy Bolt Owner</p>
                    <p className="text-sm text-gray-400 relative z-10">Chicago, IL</p>
                    <label
                      htmlFor="slide5"
                      className="absolute bottom-6 right-6 w-10 h-10 bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] rounded-full flex items-center justify-center text-white shadow-md hover:opacity-90 transition-opacity z-10 cursor-pointer"
                    >
                      <img src="/image/play.png" alt="" />
                    </label>
                  </div>
                </div>

                {/* Slide 5 - Michael Brown */}
                <div className="min-w-full flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-sm">
                  <div className="relative w-full sm:w-[42%] min-h-70 sm:min-h-105 bg-gray-700 shrink-0">
                    <img
                      src="/image/man2.jpg"
                      alt="Michael Brown"
                      className="w-full h-full object-cover object-center absolute inset-0"
                    />
                    <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-4">
                      <div className="flex-1 bg-white/30 backdrop-blur-md border border-white/60 rounded-xl px-4 py-3">
                        <p className="text-[10px] text-gray-200">Trips Completed</p>
                        <p className="text-xl font-bold text-white">341</p>
                      </div>
                      <div className="flex-1 bg-white/30 backdrop-blur-md border border-white/60 rounded-xl px-4 py-3">
                        <p className="text-[10px] text-gray-200">Total Saved</p>
                        <p className="text-xl font-bold text-white">$780</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex-1 bg-[#C8EDD8] p-6 sm:p-10 flex flex-col justify-center">
                    <div className="absolute top-6 right-6 text-[80px] sm:text-[100px] font-serif leading-none text-[#a3d4b4] select-none">
                      &ldquo;
                    </div>
                    <div className="flex gap-1 mb-4 relative z-10">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-800 text-base sm:text-lg leading-relaxed relative z-10">
                      &quot;I&apos;ve been using this app for over a year and it just keeps getting better. The station notifications are spot-on and the session tracking helps me plan my budget perfectly. Simply the best EV app out there!&quot;
                    </p>
                    <div className="mt-5 flex items-center gap-2 relative z-10">
                      <span className="font-bold text-gray-900">Michael Brown</span>
                      <span className="bg-white inline-flex items-center gap-1 border border-green-400 rounded-full px-2.5 py-0.5 text-xs text-gray-600">
                        <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verified
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 relative z-10">Ford Mustang Mach-E Owner</p>
                    <p className="text-sm text-gray-400 relative z-10">New York, NY</p>
                    <label
                      htmlFor="slide1"
                      className="absolute bottom-6 right-6 w-10 h-10 bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] rounded-full flex items-center justify-center text-white shadow-md hover:opacity-90 transition-opacity z-10 cursor-pointer"
                    >
                      <img src="/image/play.png" alt="" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
              {/* Left Arrow */}
              <div className="relative w-10 h-10">
                <label
                  htmlFor="slide5"
                  className="hidden group-has-[#slide1:checked]:flex absolute inset-0 w-10 h-10 rounded-full border border-gray-300 bg-white items-center justify-center hover:border-gray-400 transition-colors shadow-sm cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </label>
                <label
                  htmlFor="slide1"
                  className="hidden group-has-[#slide2:checked]:flex absolute inset-0 w-10 h-10 rounded-full border border-gray-300 bg-white items-center justify-center hover:border-gray-400 transition-colors shadow-sm cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </label>
                <label
                  htmlFor="slide2"
                  className="hidden group-has-[#slide3:checked]:flex absolute inset-0 w-10 h-10 rounded-full border border-gray-300 bg-white items-center justify-center hover:border-gray-400 transition-colors shadow-sm cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </label>
                <label
                  htmlFor="slide3"
                  className="hidden group-has-[#slide4:checked]:flex absolute inset-0 w-10 h-10 rounded-full border border-gray-300 bg-white items-center justify-center hover:border-gray-400 transition-colors shadow-sm cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </label>
                <label
                  htmlFor="slide4"
                  className="hidden group-has-[#slide5:checked]:flex absolute inset-0 w-10 h-10 rounded-full border border-gray-300 bg-white items-center justify-center hover:border-gray-400 transition-colors shadow-sm cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </label>
              </div>

              {/* Dot Indicators */}
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="slide1"
                  className="w-2.5 h-2.5 rounded-full bg-gray-300 transition-all duration-300 cursor-pointer group-has-[#slide1:checked]:w-6 group-has-[#slide1:checked]:bg-[#00D3F2]"
                ></label>
                <label
                  htmlFor="slide2"
                  className="w-2.5 h-2.5 rounded-full bg-gray-300 transition-all duration-300 cursor-pointer group-has-[#slide2:checked]:w-6 group-has-[#slide2:checked]:bg-[#00D3F2]"
                ></label>
                <label
                  htmlFor="slide3"
                  className="w-2.5 h-2.5 rounded-full bg-gray-300 transition-all duration-300 cursor-pointer group-has-[#slide3:checked]:w-6 group-has-[#slide3:checked]:bg-[#00D3F2]"
                ></label>
                <label
                  htmlFor="slide4"
                  className="w-2.5 h-2.5 rounded-full bg-gray-300 transition-all duration-300 cursor-pointer group-has-[#slide4:checked]:w-6 group-has-[#slide4:checked]:bg-[#00D3F2]"
                ></label>
                <label
                  htmlFor="slide5"
                  className="w-2.5 h-2.5 rounded-full bg-gray-300 transition-all duration-300 cursor-pointer group-has-[#slide5:checked]:w-6 group-has-[#slide5:checked]:bg-[#00D3F2]"
                ></label>
              </div>

              {/* Right Arrow */}
              <div className="relative w-10 h-10">
                <label
                  htmlFor="slide2"
                  className="hidden group-has-[#slide1:checked]:flex absolute inset-0 w-10 h-10 rounded-full border border-gray-300 bg-white items-center justify-center hover:border-gray-400 transition-colors shadow-sm cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </label>
                <label
                  htmlFor="slide3"
                  className="hidden group-has-[#slide2:checked]:flex absolute inset-0 w-10 h-10 rounded-full border border-gray-300 bg-white items-center justify-center hover:border-gray-400 transition-colors shadow-sm cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </label>
                <label
                  htmlFor="slide4"
                  className="hidden group-has-[#slide3:checked]:flex absolute inset-0 w-10 h-10 rounded-full border border-gray-300 bg-white items-center justify-center hover:border-gray-400 transition-colors shadow-sm cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </label>
                <label
                  htmlFor="slide5"
                  className="hidden group-has-[#slide4:checked]:flex absolute inset-0 w-10 h-10 rounded-full border border-gray-300 bg-white items-center justify-center hover:border-gray-400 transition-colors shadow-sm cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </label>
                <label
                  htmlFor="slide1"
                  className="hidden group-has-[#slide5:checked]:flex absolute inset-0 w-10 h-10 rounded-full border border-gray-300 bg-white items-center justify-center hover:border-gray-400 transition-colors shadow-sm cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
