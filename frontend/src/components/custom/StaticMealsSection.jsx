import React, { useMemo } from 'react'
import { STATIC_CATEGORIES, STATIC_PRODUCTS } from '@/data/staticMenu'

// Plain, non-interactive rendering of the same static menu data that also
// appears inside the MenuBook flipbook - grouped from the shared source so
// the two never drift apart. Exists as a fallback so the menu still reads
// for anyone who can't use the flipbook (no JS animation, screen readers,
// very small/old devices).
const StaticMealsSection = () => {
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

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {sections.map(({ category, items }) => (
            <div key={category._id} className="rounded-2xl border border-orange-100 bg-orange-50/50 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.emoji}</span>
                <h3 className="font-['Fredoka',sans-serif] text-xl font-extrabold text-stone-900">{category.name}</h3>
              </div>

              <ul className="mt-5 divide-y divide-orange-100">
                {items.map((item) => (
                  <li key={item._id} className="flex items-center justify-between gap-4 py-2.5">
                    <span className="font-['Poppins',sans-serif] text-sm font-semibold text-stone-800">{item.title}</span>
                    <span className="font-['Poppins',sans-serif] text-sm font-extrabold text-primary">{item.priceLabel}</span>
                  </li>
                ))}
              </ul>

              {items[0]?.description && (
                <p className="mt-4 font-['Poppins',sans-serif] text-xs italic text-stone-500">{items[0].description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StaticMealsSection
