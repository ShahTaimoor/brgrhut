import { useRef } from 'react';
import { Phone, MapPin } from 'lucide-react';
import { CONTACT_INFO, LOCATION } from '@/constants/footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const ContactSection = () => {
  const sectionRef = useRef(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} id="contact" className="w-full scroll-mt-14 bg-orange-50/40 py-16 sm:scroll-mt-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-['Fredoka',sans-serif] text-xs font-bold uppercase tracking-[0.25em] text-primary">Get in touch</p>
          <h2 className="font-['Fredoka',sans-serif] mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Contact Us
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-5 rounded-2xl border border-orange-100 bg-white p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Phone size={18} />
              </div>
              <div>
                <p className="font-['Fredoka',sans-serif] text-xs font-semibold uppercase tracking-wide text-gray-400">Call us</p>
                <a href={`tel:${CONTACT_INFO.phone}`} className="font-['Poppins',sans-serif] text-sm font-semibold text-gray-900 hover:text-primary">
                  {CONTACT_INFO.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin size={18} />
              </div>
              <div>
                <p className="font-['Fredoka',sans-serif] text-xs font-semibold uppercase tracking-wide text-gray-400">Address</p>
                <p className="font-['Poppins',sans-serif] text-sm font-semibold leading-relaxed text-gray-900">
                  {LOCATION.address.map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < LOCATION.address.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-orange-100">
            <iframe
              src={LOCATION.mapEmbedUrl}
              className="h-full min-h-[280px] w-full"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="brgrhut location"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
