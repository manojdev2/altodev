/* eslint-disable @next/next/no-img-element */

export default function Footer() {
  return (
    <footer className="mx-auto px-6 lg:px-20 pt-20 pb-10 text-white bg-[#0F172B]">
      <div className="grid lg:grid-cols-3 gap-16">
        {/* Column 1: Logo & Contact */}
        <div>
          <div className="flex items-center gap-3">
            <img src="/image/footer logo.png" alt="EV ChargeFinder" />
          </div>
          <p className="mt-6 text-gray-300 text-sm sm:text-lg leading-relaxed max-w-md">
            The modern solution for EV drivers. Find, book,
            and charge at thousands of stations worldwide.
          </p>
          <div className="mt-8 space-y-4 text-gray-300 text-sm sm:text-lg">
            <div className="flex items-center gap-3">
              <span>✉</span>
              <span>hello.naasmind@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <span>📞</span>
              <span>01772–337656</span>
            </div>
          </div>
       
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-sm sm:text-xl font-semibold mb-6">Quick Links</h3>
          <ul className="flex flex-wrap gap-5 text-gray-300 text-sm sm:text-base lg:text-lg lg:flex-col lg:gap-0 lg:space-y-5">
            <li className="hover:text-white transition cursor-pointer">Home</li>
            <li className="hover:text-white transition cursor-pointer">Features</li>
            <li className="hover:text-white transition cursor-pointer">How It Works</li>
            <li className="hover:text-white transition cursor-pointer">App Preview</li>
            <li className="hover:text-white transition cursor-pointer">Testimonials</li>
          </ul>
        </div>

        {/* Column 3: Newsletter */}
        <div>
          <h3 className="text-sm sm:text-xl font-semibold mb-6">Stay Updated</h3>
          <p className="text-gray-300 text-sm sm:text-lg max-w-sm leading-relaxed">
            Get the latest updates on new features
            and charging stations.
          </p>
          <div className="mt-6 flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 sm:px-5 sm:py-4 bg-[#1B2745] text-white rounded-xl border border-white/10 focus:outline-none placeholder-gray-400"
            />
            <button className="px-4 py-2 sm:px-8 sm:py-4 rounded-xl font-semibold text-white bg-linear-to-r from-[#2BD4B4] to-[#4DA3FF]">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white/10 mt-16 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6 text-gray-400 text-sm sm:text-lg">
        <p>© 2026 Naas Ev Charge. All rights reserved.</p>

        <div className="flex flex-wrap justify-center lg:justify-end gap-10">
          <span className="hover:text-white transition cursor-pointer">
            Privacy Policy
          </span>
          <span className="hover:text-white transition cursor-pointer">
            Terms of Service
          </span>
          <span className="hover:text-white transition cursor-pointer">
            Cookie Policy
          </span>
        </div>
      </div>
    </footer>
  );
}
