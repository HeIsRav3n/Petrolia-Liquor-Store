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
    <div className="bg-[#f5f5f5] py-6 md:py-10">
      <div className="max-w-[1200px] mx-auto px-4 md:px-0">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={800}
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
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="h-[400px] md:h-[450px] w-full relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover brightness-95 contrast-105 grayscale-[0.2]"
                />
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-black/5"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination Container */}
        <div className="flex justify-center mt-6">
          <div className="custom-swiper-pagination flex gap-3 !static !w-auto"></div>
        </div>
      </div>

      <style jsx global>{`
        .custom-swiper-pagination .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #d1d1d1;
          opacity: 1;
          margin: 0 !important;
          transition: all 0.3s ease;
        }
        .custom-swiper-pagination .swiper-pagination-bullet-active {
          background: #840404 !important;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
