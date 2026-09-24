// Floating call-to-action shown on every customer-facing page (see RootLayout),
// desktop and mobile alike. On mobile it sits above the fixed BottomNavigation
// bar rather than under it; on desktop it sits in the bottom-right corner.
const WHATSAPP_NUMBER = '447512219392' // +44 7512 219392, wa.me format: no '+', no spaces
const WHATSAPP_MESSAGE = "Hi brgrhut, I'd like to place an order."
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

const WhatsAppButton = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp"
    title="Chat with us on WhatsApp"
    className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-110 active:scale-95 lg:bottom-6 lg:right-6"
  >
    {/* Soft attention ping, muted enough not to be annoying on a page that's open a while */}
    <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-40" style={{ animationDuration: '2.5s' }} />
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm5.8 14.1c-.24.68-1.39 1.32-1.94 1.4-.49.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.64-.6-2.9-1.25-4.78-4.18-4.93-4.38-.15-.2-1.18-1.57-1.18-2.99 0-1.42.75-2.12 1.01-2.4.26-.29.58-.36.77-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.81 2 .88 2.15.07.15.12.32.02.52-.1.2-.15.32-.29.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.35 1.46.29.15.46.13.63-.08.17-.2.72-.84.92-1.13.19-.29.38-.24.64-.15.26.1 1.68.79 1.97.94.29.14.48.21.55.33.07.13.07.72-.17 1.4z" />
    </svg>
  </a>
)

export default WhatsAppButton
