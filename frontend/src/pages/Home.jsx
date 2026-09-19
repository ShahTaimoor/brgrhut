import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from '@/lib/gsap'
import MenuBook from '@/components/custom/MenuBook'
import StaticMealsSection from '@/components/custom/StaticMealsSection'
import HeroSection from '@/components/custom/HeroSection'
import AboutSection from '@/components/custom/AboutSection'
import TestimonialsSection from '@/components/custom/TestimonialsSection'
import ContactSection from '@/components/custom/ContactSection'

const SCROLL_KEY = 'home-scroll-y'
let restoreAttempted = false

// The browser's own scroll restoration runs while this lazy-loaded page is still
// short (fonts, hero video, map and flipbook haven't sized yet), so on a refresh
// it clamps the position near the top - or lands somewhere the scroll-reveal
// sections were measured wrongly and stay hidden. Restore it ourselves once the
// layout has settled.
const useRestoreScrollOnReload = (hasHash) => {
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

    let frame = null
    const save = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = null
        try { sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY))) } catch { /* storage unavailable */ }
      })
    }

    let saved = 0
    const navEntry = performance.getEntriesByType?.('navigation')?.[0]
    if (!restoreAttempted && !hasHash && navEntry?.type === 'reload') {
      try { saved = Number(sessionStorage.getItem(SCROLL_KEY)) || 0 } catch { saved = 0 }
    }

    let cancelled = false
    let timer = null
    if (saved > 0) {
      const ready = Promise.all([
        document.readyState === 'complete' ? null : new Promise((r) => window.addEventListener('load', r, { once: true })),
        document.fonts?.ready,
      ])
      ready.then(() => {
        if (cancelled) return
        timer = setTimeout(() => {
          restoreAttempted = true
          window.scrollTo({ top: saved, behavior: 'instant' })
          ScrollTrigger.refresh()
          window.addEventListener('scroll', save, { passive: true })
        }, 400)
      })
    } else {
      window.addEventListener('scroll', save, { passive: true })
    }

    return () => {
      cancelled = true
      clearTimeout(timer)
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', save)
    }
  }, [hasHash])
}

const Home = () => {
  const location = useLocation()
  useRestoreScrollOnReload(Boolean(location.hash))

  // Scroll to the section named by the URL hash (e.g. /#menu) whenever it changes —
  // this is how the Navbar's Home/Menu/About/Contact links work on this single page.
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
      }
    }
  }, [location.hash, location.key])

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
