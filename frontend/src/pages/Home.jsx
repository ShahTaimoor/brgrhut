import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import MenuBook from '@/components/custom/MenuBook'
import HeroSection from '@/components/custom/HeroSection'
import AboutSection from '@/components/custom/AboutSection'
import TestimonialsSection from '@/components/custom/TestimonialsSection'
import ContactSection from '@/components/custom/ContactSection'

const Home = () => {
  const location = useLocation()

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
  }, [location.hash])

  return (
    <div>
      <HeroSection />
      <MenuBook />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  )
}

export default Home
