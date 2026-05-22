"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <section id="contact" className="py-20 bg-[#f3f4f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center mb-6">
            <div className="p-4 w-5 h-5 bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] rounded-full flex items-center justify-center">
              <span className="text-black text-[16px] font-bold">C</span>
            </div>
            <span className="text-[16px] font-bold text-black">
              ontact Us
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Get In{" "}
            <span className="bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] bg-clip-text text-transparent">
              Touch With Us
            </span>
          </h2>
          <p className="mt-5 text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            Have questions about our EV charging network? We&apos;d love to hear
            from you. Send us a message and we&apos;ll respond as soon as
            possible.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left: Info Cards */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Email Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-r from-[#00D492] to-[#00D3F2] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-base sm:text-lg">
                    Email Us
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">
                    We&apos;ll respond within 24 hours
                  </p>
                  <a
                    href="mailto:hello.naasmind@gmail.com"
                    className="text-sm font-medium bg-linear-to-r from-[#00D492] to-[#51A2FF] bg-clip-text text-transparent mt-2 inline-block hover:opacity-80 transition"
                  >
                    hello.naasmind@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-r from-[#00D3F2] to-[#51A2FF] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-base sm:text-lg">
                    Call Us
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">
                    Mon–Fri from 9am to 6pm
                  </p>
                  <a
                    href="tel:01772337656"
                    className="text-sm font-medium bg-linear-to-r from-[#00D3F2] to-[#51A2FF] bg-clip-text text-transparent mt-2 inline-block hover:opacity-80 transition"
                  >
                    01772–337656
                  </a>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-base sm:text-lg">
                    Visit Us
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">
                    Come say hello at our office
                  </p>
                  <p className="text-sm font-medium bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] bg-clip-text text-transparent mt-2">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm">
              <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-4">
                Follow Us
              </h4>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/"
                  className="w-11 h-11 rounded-xl bg-[#f3f4f6] flex items-center justify-center hover:bg-linear-to-r hover:from-[#00D492] hover:to-[#00D3F2] hover:text-white text-gray-500 transition-all group"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/"
                  className="w-11 h-11 rounded-xl bg-[#f3f4f6] flex items-center justify-center hover:bg-linear-to-r hover:from-[#00D3F2] hover:to-[#51A2FF] hover:text-white text-gray-500 transition-all group"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/?hl=en"
                  className="w-11 h-11 rounded-xl bg-[#f3f4f6] flex items-center justify-center hover:bg-linear-to-r hover:from-[#00D492] hover:via-[#00D3F2] hover:to-[#51A2FF] hover:text-white text-gray-500 transition-all group"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/"
                  className="w-11 h-11 rounded-xl bg-[#f3f4f6] flex items-center justify-center hover:bg-linear-to-r hover:from-[#00D3F2] hover:to-[#51A2FF] hover:text-white text-gray-500 transition-all group"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-sm h-full"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Send Us a Message
              </h3>
              <p className="text-gray-400 text-sm mb-8">
                Fill out the form below and our team will get back to you
                shortly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#f3f4f6] border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D3F2]/40 focus:border-[#00D3F2] transition"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#f3f4f6] border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D3F2]/40 focus:border-[#00D3F2] transition"
                    required
                  />
                </div>
              </div>

              {/* Message */}
              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-3.5 rounded-xl bg-[#f3f4f6] border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#00D3F2]/40 focus:border-[#00D3F2] transition resize-none"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-8 w-full py-4 rounded-xl font-semibold text-white bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] hover:opacity-90 transition-all shadow-lg shadow-[#00D3F2]/20 text-sm sm:text-base cursor-pointer"
              >
                Send Message
              </button>

              <p className="text-center text-gray-400 text-xs mt-4">
                We respect your privacy. No spam, ever.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
