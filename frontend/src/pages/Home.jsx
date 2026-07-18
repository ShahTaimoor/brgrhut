import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ProductList from '@/components/custom/ProductList'
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
      <section id="menu" className="scroll-mt-14 sm:scroll-mt-16">
        <ProductList />
      </section>
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  )
}

export default Home
