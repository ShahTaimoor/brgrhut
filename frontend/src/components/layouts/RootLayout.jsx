import React from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../custom/Navbar'
import BottomNavigation from '../custom/BottomNavigation'
import Footer from '../custom/Footer'
import CartDrawer from '../custom/CartDrawer'
import { useIsMobile } from '../../hooks/use-mobile'
import AuthDrawer from '../custom/AuthDrawer'

// Routes where the floating cart button would be redundant (already checking
// out, or the order is already placed)
const HIDE_CART_ON = ['/checkout', '/success']

const RootLayout = ({ children }) => {
    const isMobile = useIsMobile()
    const { pathname } = useLocation()
    const showCart = !HIDE_CART_ON.includes(pathname)

    return (
        <>
            <Navbar />
            <main className={`pt-14 sm:pt-16 ${isMobile ? 'pb-20' : ''}`}>
                {children}
            </main>
            <Footer />
            <BottomNavigation />
            {showCart && <CartDrawer />}
            <AuthDrawer />
        </>
    )
}

export default RootLayout
