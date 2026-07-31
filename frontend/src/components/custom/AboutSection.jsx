import { useRef } from 'react';
import { Flame, Clock, Leaf } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

// PLACEHOLDER COPY — replace with the real brand story when ready.
const FEATURES = [
  {
    icon: Flame,
    title: 'Flame Grilled, Always',
    text: 'Every patty is char-grilled over an open flame for that smoky, made-to-order taste — never frozen, never microwaved.',
  },
  {
    icon: Leaf,
    title: 'Fresh Ingredients Daily',
    text: 'Buns, produce, and sauces are prepped fresh every day so what lands on your table is never sitting around.',
  },
  {
    icon: Clock,
    title: 'Made to Order',
    text: 'We cook once you order, not before — a little extra wait for a lot more flavor.',
  },
];

const AboutSection = () => {
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} id="about" className="w-full scroll-mt-14 bg-white py-16 sm:scroll-mt-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="font-['Fredoka',sans-serif] text-xs font-bold uppercase tracking-[0.25em] text-primary">About brgrhut</p>
            <h2 className="font-['Fredoka',sans-serif] mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Smoky, handcrafted burgers since day one
            </h2>
            <p className="font-['Poppins',sans-serif] mt-4 text-sm italic text-gray-400">
              Placeholder brand story below — replace with your real founding story and details.
            </p>
            <p className="font-['Poppins',sans-serif] mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
              [Placeholder] brgrhut started with one simple idea: fast food doesn&apos;t have to mean
              average food. Every burger is flame-grilled to order, every side is made fresh, and
              every order is packed with the same care whether it&apos;s your first visit or your
              hundredth. From Darlaston, West Midlands, straight to your table.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-1">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-4 rounded-xl border border-orange-100 bg-orange-50/40 p-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon size={20} />
                </div>
                <div>
                  <h3 className="font-['Fredoka',sans-serif] text-sm font-bold text-gray-900">{f.title}</h3>
                  <p className="font-['Poppins',sans-serif] mt-1 text-sm text-gray-600">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
