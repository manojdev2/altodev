'use client';
/* eslint-disable @next/next/no-img-element */
import { useRef } from 'react';

const slides = [
  { src: '/image/Home.png', alt: 'Onboarding' },
  { src: '/image/Login.png', alt: 'Login' },
  { src: '/image/Home.png', alt: 'Home' },
  { src: '/image/View Details.png', alt: 'Details' },
  { src: '/image/Login.png', alt: 'Booking' },
];

export default function AppExperienceSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = sliderRef.current;
    if (!slider) return;
    isDown.current = true;
    slider.style.scrollBehavior = 'auto';
    startX.current = e.pageX - slider.offsetLeft;
    scrollLeftRef.current = slider.scrollLeft;
  };

  const handleMouseLeave = () => { isDown.current = false; };

  const handleMouseUp = () => {
    isDown.current = false;
    if (sliderRef.current) sliderRef.current.style.scrollBehavior = 'smooth';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown.current) return;
    e.preventDefault();
    const slider = sliderRef.current;
    if (!slider) return;
    const x = e.pageX - slider.offsetLeft;
    slider.scrollLeft = scrollLeftRef.current - (x - startX.current) * 2;
  };

  return (
    <section id="app-preview">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-20 py-12 sm:py-20">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center mb-4 sm:mb-6">
            <div className="p-4 w-5 h-5 bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] rounded-full flex items-center justify-center">
              <span className="text-black text-[14px] sm:text-[16px] font-bold">A</span>
            </div>
            <span className="text-[14px] sm:text-[16px] font-bold text-black">pp Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Beautiful Design.{' '}
            <span className="bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] bg-clip-text text-transparent">
              Intuitive Interface.
            </span>
          </h2>
          <p className="mt-4 text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
            Every detail crafted for the best user experience, with speed, clarity, and elegance
          </p>
        </div>

        {/* Draggable slider */}
        <div
          ref={sliderRef}
          className="overflow-x-auto [&::-webkit-scrollbar]:hidden py-4 flex gap-5 cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {slides.map((slide, i) => (
            <div key={i} className="flex-shrink-0 w-[260px] h-[540px] overflow-hidden bg-transparent">
              <img
                src={slide.src}
                alt={slide.alt}
                draggable={false}
                className="w-full h-full object-contain block select-none pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
