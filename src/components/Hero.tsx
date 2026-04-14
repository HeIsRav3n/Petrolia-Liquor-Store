'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  { id: 1, image: '/images/hero/hero-new-first.png', title: 'Craft Beer Selections' },
  { id: 2, image: '/images/hero/hero-5.png', title: 'Bar Collection' },
  { id: 3, image: '/images/hero/hero-4.png', title: 'Champagne Pour' },
  { id: 4, image: '/images/hero/hero-3.png', title: 'Liquor Store Selection' },
  { id: 5, image: '/images/hero/hero-2.png', title: 'Tequila & Vodka' },
  { id: 6, image: '/images/hero/hero-1.png', title: 'Fine Wine' },
];

export default function Hero() {
  return (
    <div className="bg-[#f5f5f5] py-4 md:py-8">
      <div className="max-w-[1200px] mx-auto px-4 md:px-0">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={700}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            el: '.custom-swiper-pagination',
          }}
          loop={true}
          className="rounded-sm overflow-hidden shadow-sm"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              {/* h-[50vw] keeps it proportional; clamp between 200px and 520px */}
              <div className="h-[220px] sm:h-[320px] md:h-[420px] lg:h-[500px] w-full relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover brightness-95 contrast-105"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding={index === 0 ? 'sync' : 'async'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                />
                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination — CSS is in globals.css */}
        <div className="flex justify-center mt-4">
          <div className="custom-swiper-pagination flex gap-3 !static !w-auto" />
        </div>
      </div>
    </div>
  );
}
