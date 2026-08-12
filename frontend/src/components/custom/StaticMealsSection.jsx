import React, { useMemo, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { STATIC_CATEGORIES, STATIC_PRODUCTS } from '@/data/staticMenu'
import 'swiper/css'
import 'swiper/css/pagination'

// Plain, non-interactive rendering of the same static menu data that also
// appears inside the MenuBook flipbook - grouped from the shared source so
// the two never drift apart. Exists as a fallback so the menu still reads
// for anyone who can't use the flipbook (no JS animation, screen readers,
// very small/old devices).
//
// A category can have anywhere from 2 items (Kebabs) to 30 (Milkshakes), so
// a plain grid put wildly different card heights side by side. Each
// category is a fixed-height carousel slide instead, with its own item list
// scrolling internally - every slide reads the same regardless of how many
// items its category has.
const StaticMealsSection = () => {
  const swiperRef = useRef(null)

  const sections = useMemo(() => {
    const byCategory = new Map()
    STATIC_PRODUCTS.forEach((product) => {
      if (!byCategory.has(product.category)) byCategory.set(product.category, [])
      byCategory.get(product.category).push(product)
    })
    return STATIC_CATEGORIES
      .filter((category) => byCategory.has(category._id))
      .sort((a, b) => a.position - b.position)
      .map((category) => ({ category, items: byCategory.get(category._id) }))
  }, [])

  return (
    <section id="meal-deals" className="w-full scroll-mt-14 bg-white py-16 sm:scroll-mt-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-['Fredoka',sans-serif] text-xs font-bold uppercase tracking-[0.25em] text-primary">More To Try</p>
          <h2 className="font-['Fredoka',sans-serif] mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Meal Deals
          </h2>
          <p className="mt-2 font-['Poppins',sans-serif] text-xs text-gray-400">
            Can't see the flip-through menu above? Here's the same list.
          </p>
        </div>

        <div className="mt-10 flex items-center gap-3 sm:gap-6">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="hidden h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-white shadow-md transition-all hover:bg-stone-800 sm:flex"
            aria-label="Previous category"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <Swiper
            modules={[Navigation, Pagination]}
            onSwiper={(swiper) => { swiperRef.current = swiper }}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true, el: '.meal-deals-pagination' }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1280: { slidesPerView: 3 },
            }}
            className="w-full"
          >
            {sections.map(({ category, items }) => (
              <SwiperSlide key={category._id} className="!h-auto pb-10">
                <div className="flex h-[420px] flex-col rounded-2xl border border-orange-100 bg-orange-50/50 p-6 sm:p-8">
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <span className="text-2xl">{category.emoji}</span>
                    <h3 className="font-['Fredoka',sans-serif] text-xl font-extrabold text-stone-900">{category.name}</h3>
                  </div>

                  <ul className="thin-scrollbar mt-5 flex-1 divide-y divide-orange-100 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <li key={item._id} className="flex items-center justify-between gap-4 py-2.5">
                        <span className="font-['Poppins',sans-serif] text-sm font-semibold text-stone-800">{item.title}</span>
                        <span className="font-['Poppins',sans-serif] text-sm font-extrabold text-primary">{item.priceLabel}</span>
                      </li>
                    ))}
                  </ul>

                  {items[0]?.description && (
                    <p className="mt-4 flex-shrink-0 font-['Poppins',sans-serif] text-xs italic text-stone-500">{items[0].description}</p>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className="hidden h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-white shadow-md transition-all hover:bg-stone-800 sm:flex"
            aria-label="Next category"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="meal-deals-pagination mt-2 flex justify-center gap-1.5 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-orange-200 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:bg-primary" />

        <p className="mt-4 text-center font-['Poppins',sans-serif] text-xs text-gray-400 sm:hidden">Swipe to see more categories</p>
      </div>
    </section>
  )
}

export default StaticMealsSection
