import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { RiDoubleQuotesL } from "react-icons/ri";
import "swiper/css";
import "swiper/css/pagination";
import Testimony from "../../assets/data/Testimonials";

export default function TestimonialSection() {
  const [idx, setIdx] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current?.params) {
      swiperRef.current.params.navigation.prevEl = ".tPrev";
      swiperRef.current.params.navigation.nextEl = ".tNext";
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden border-t border-[#8700ff]/15">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
        <span className="text-[10rem] md:text-[14rem] font-extrabold text-[#8700ff]/[0.04] leading-none whitespace-nowrap">TESTIMONIALS</span>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <span className="section-tag justify-center"><span className="dot-live" />Testimonials</span>
          <h2 className="text-white">What our clients say</h2>
          <p className="mt-3 text-sm text-[#9b8cb5] max-w-xl mx-auto">Real feedback from brands and teams we&apos;ve worked with.</p>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop
          pagination={{ clickable: true }}
          onSwiper={(sw) => (swiperRef.current = sw)}
          onSlideChange={(sw) => setIdx(sw.realIndex)}
          className="w-full pb-10"
        >
          {Testimony.map((item) => (
            <SwiperSlide key={item.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="brand-card rounded-2xl p-6 md:p-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-4 flex justify-center lg:justify-start">
                    <div>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-40 h-40 md:w-52 md:h-52 object-contain rounded-xl brand-card p-2"
                      />
                      {item.previews?.length > 0 && (
                        <div className="hidden lg:flex gap-2 mt-3">
                          {item.previews.slice(0, 2).map((src, i) => (
                            <img key={i} src={src} alt="" className="w-14 h-14 object-contain rounded-lg brand-card opacity-80" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="lg:col-span-8 flex flex-col justify-center">
                    <RiDoubleQuotesL className="text-4xl md:text-5xl text-[#8700ff]/30 mb-4" aria-hidden />
                    <blockquote className="text-[#c4b3d8] text-sm md:text-base leading-relaxed">{item.text}</blockquote>
                    <footer className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <cite className="not-italic font-semibold text-white text-base">{item.name}</cite>
                        <p className="text-sm text-[#9b8cb5]">{item.role}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="tPrev w-10 h-10 rounded-full border border-[#8700ff]/30 text-white hover:bg-[#8700ff]/20 hover:border-[#8700ff] flex items-center justify-center transition-all" aria-label="Previous">
                          <FaArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm text-[#9b8cb5] tabular-nums">{idx + 1} / {Testimony.length}</span>
                        <button className="tNext w-10 h-10 rounded-full border border-[#8700ff]/30 text-white hover:bg-[#8700ff]/20 hover:border-[#8700ff] flex items-center justify-center transition-all" aria-label="Next">
                          <FaArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </footer>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
