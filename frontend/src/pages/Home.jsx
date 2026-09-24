import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import MenuBook from '@/components/custom/MenuBook'
import StaticMealsSection from '@/components/custom/StaticMealsSection'
import HeroSection from '@/components/custom/HeroSection'
import AboutSection from '@/components/custom/AboutSection'
import TestimonialsSection from '@/components/custom/TestimonialsSection'
import ContactSection from '@/components/custom/ContactSection'

// True only for the page load that a browser refresh (F5 / reload button)
// produced - not for a normal link click or first-ever visit.
const isReload = () => performance.getEntriesByType?.('navigation')?.[0]?.type === 'reload'

const Home = () => {
  const location = useLocation()
  const navigate = useNavigate()
  // Whether the mount-time reload check (below) has run at all - true after
  // its first invocation, whatever it decided - so it's only ever applied to
  // the hash the page happened to load with, never to a later hash change
  // from clicking a nav link (isReload() itself stays true for the rest of
  // this page's lifetime, so that alone can't be the guard).
  const mountHandledRef = useRef(false)
  // The exact #hash a reload is in the middle of discarding, so a stale
  // duplicate of it can be recognized and ignored - React 18 StrictMode runs
  // this effect twice per commit in dev, and the second run still sees the
  // pre-navigate() hash in its closure and would otherwise scroll straight
  // back to it.
  const suppressedHashRef = useRef(null)

  // The browser has its own scroll-restoration-on-reload feature; disabling it
  // is what makes "reload = always land on Home" possible in the first place.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])

  // Scroll to the section named by the URL hash (e.g. /#menu) whenever it changes —
  // this is how the Navbar's Home/Menu/About/Contact links work on this single page.
  // The one exception is a hard refresh: whatever section/hash was open before
  // reloading is discarded so the site always comes back up on the Home top,
  // instead of restoring the previous scroll position or section.
  useEffect(() => {
    if (!mountHandledRef.current) {
      mountHandledRef.current = true
      if (location.hash && isReload()) {
        suppressedHashRef.current = location.hash
        window.scrollTo(0, 0)
        navigate('/', { replace: true })
        return
      }
    } else if (location.hash && location.hash === suppressedHashRef.current) {
      return
    }

    if (location.hash) {
      const id = location.hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        requestAnimationFrame(() => {
          // Layout position (offsetTop) ignores the fade-in slide transform that
          // scrollIntoView would otherwise measure, which made sections overshoot.
          let top = 0
          for (let node = el; node; node = node.offsetParent) top += node.offsetTop
          const headerHeight = window.innerWidth >= 1024 ? 64 : 0
          window.scrollTo({ top: Math.max(0, top - headerHeight), behavior: 'smooth' })
        })
      }
    }
  }, [location.hash, location.key, navigate])

  return (
    <div>
      <HeroSection />
      <MenuBook />
      <StaticMealsSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  )
}

export default Home
