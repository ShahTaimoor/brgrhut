import { Star } from 'lucide-react';

// PLACEHOLDER TESTIMONIALS — replace with real customer reviews.
// Each entry: { name, location, quote, rating (1-5) }
const PLACEHOLDER_TESTIMONIALS = [
  {
    name: 'Ahmed R.',
    location: 'Hayatabad, Peshawar',
    quote:
      '[Placeholder review] The flame-grilled patty tastes nothing like the usual fast food burgers — smoky, juicy, and always fresh. brgrhut is our go-to order night.',
    rating: 5,
  },
  {
    name: 'Sana K.',
    location: 'Phase 6, Peshawar',
    quote:
      '[Placeholder review] Fast delivery, hot fries every time, and the pizza is surprisingly good for a burger place. Highly recommend the double zinger combo.',
    rating: 5,
  },
  {
    name: 'Bilal M.',
    location: 'University Town, Peshawar',
    quote:
      '[Placeholder review] Consistent quality and friendly service. The spicy burger has real heat, not the watered-down kind. Will keep ordering.',
    rating: 4,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="w-full bg-orange-50/40 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Reviews</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            What our customers say
          </h2>
          <p className="mt-2 text-xs italic text-gray-400">
            Placeholder testimonials shown below — swap in real customer reviews when ready.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < t.rating ? 'fill-primary text-primary' : 'fill-gray-200 text-gray-200'}
                  />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
