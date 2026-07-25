import { useState, useMemo, useCallback, useRef } from 'react'
import {
  COMPANY_INFO,
  CONTACT_INFO,
  LOCATION,
  SOCIAL_MEDIA,
  COPYRIGHT_TEXT,
  SECTION_TITLES,
} from '@/constants/footer'
import { getCurrentYear, renderSocialIcon } from '@/utils/footerHelpers'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const Footer = () => {
  const [hoveredIcon, setHoveredIcon] = useState(null)
  const footerRef = useRef(null)
  useScrollReveal(footerRef)

  const currentYear = useMemo(() => getCurrentYear(), [])

  const createMouseEnterHandler = useCallback(
    (socialName) => () => {
      setHoveredIcon(socialName)
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredIcon(null)
  }, [])

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-stone-950 text-white pb-20 lg:pb-0 -mt-16 lg:mt-0">
      {/* Ambient background accents — solid blurred circles, no gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl animate-float-gentle"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Top section with company info */}
        <div className="container mx-auto px-4 pt-2 pb-8 lg:pt-8 lg:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Company Brand Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="space-y-4">
                <h2 className="font-['Fredoka',sans-serif] text-3xl font-bold text-primary">
                  {COMPANY_INFO.name}
                </h2>
                <p className="font-['Fredoka',sans-serif] text-slate-300 text-sm font-medium tracking-wide uppercase">
                  {COMPANY_INFO.tagline}
                </p>
                <p className="font-['Poppins',sans-serif] text-slate-400 text-sm leading-relaxed">
                  {COMPANY_INFO.description}
                </p>
              </div>

              {/* Social Media Links */}
              <div className="flex space-x-4">
                {SOCIAL_MEDIA.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 rounded-full bg-slate-700/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${social.color} hover:bg-slate-600/50 hover:scale-110`}
                    onMouseEnter={createMouseEnterHandler(social.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {renderSocialIcon(social.icon)}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="font-['Fredoka',sans-serif] text-lg font-semibold text-white">
                {SECTION_TITLES.contactInfo}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 mt-0.5 text-primary">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-['Poppins',sans-serif] text-slate-300 text-sm">{CONTACT_INFO.phone}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Address & Map */}
            <div className="space-y-6">
              <h3 className="font-['Fredoka',sans-serif] text-lg font-semibold text-white">
                {SECTION_TITLES.location}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 mt-0.5 text-primary">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-['Poppins',sans-serif] text-slate-300 text-sm leading-relaxed">
                      {LOCATION.address.map((line, index) => (
                        <span key={index}>
                          {line}
                          {index < LOCATION.address.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                {/* Interactive Map */}
                <div className="mt-4 overflow-hidden rounded-lg border border-slate-700/50">
                  <iframe
                    src={LOCATION.mapEmbedUrl}
                    className="w-full h-48 rounded-lg"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-slate-700/50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-center items-center">
              <p className="font-['Poppins',sans-serif] text-slate-400 text-sm">
                © {currentYear}{' '}
                <span className="font-['Fredoka',sans-serif] text-primary font-semibold">
                  {COMPANY_INFO.name}
                </span>
                . {COPYRIGHT_TEXT}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
