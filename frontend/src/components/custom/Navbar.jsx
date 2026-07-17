import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import LogoutToggle from "./LogoutToggle";
import { useSelector } from "react-redux";
import { useRef, useState, useEffect, useMemo } from "react";
import { Badge } from "../ui/badge";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart, updateCartQuantity, fetchCart } from "../../redux/slices/cart/cartSlice";
import CartImage from "../ui/CartImage";
import Checkout from "../../pages/Checkout";
import { useAuthDrawer } from "../../contexts/AuthDrawerContext";
import SearchSuggestions from "./SearchSuggestions";

// Cart Product Component (Representing items in the food order)
const CartProduct = ({ product, quantity }) => {
  const dispatch = useDispatch();
  const [inputQty, setInputQty] = useState(quantity);
  const { _id, title, price, stock } = product;
  const image = product.image || product.picture?.secure_url;

  const updateQuantity = (newQty) => {
    if (newQty !== quantity && newQty > 0 && newQty <= stock) {
      setInputQty(newQty);
      dispatch(updateCartQuantity({ productId: _id, quantity: newQty }));
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    dispatch(removeFromCart(_id));
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    if (inputQty > 1) {
      updateQuantity(inputQty - 1);
    }
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    if (inputQty < stock) {
      updateQuantity(inputQty + 1);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        <CartImage
          src={image}
          alt={title}
          className="w-12 h-12 rounded-md border border-gray-200 object-cover"
          fallback="/fallback.jpg"
          quality={80}
        />
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-sm text-gray-900 line-clamp-2">{title}</h4>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center border border-gray-200 rounded-md">
          <button
            onClick={handleDecrease}
            className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={inputQty <= 1}
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium text-gray-900">{inputQty}</span>
          <button
            onClick={handleIncrease}
            className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={inputQty >= stock}
          >
            +
          </button>
        </div>
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { items: cartItems = [] } = useSelector((state) => state.cart);
  const cartRef = useRef(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);
  const { openDrawer } = useAuthDrawer();

  // Calculate total quantity of food items
  const totalQuantity = useMemo(() => 
    cartItems.reduce((sum, item) => sum + item.quantity, 0), 
    [cartItems]
  );

  // Fetch cart/order details
  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 100);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleBuyNow = () => {
    if (!user) {
      openDrawer('login');
      return;
    }
    if (cartItems.length === 0) {
      return;
    }
    setOpenCheckoutDialog(true);
  };

  return (
    <>
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm hidden lg:block`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left side: Beautiful Illustrated Burger SVG + Brand (brgrhut) */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <svg 
                  className="h-10 w-10 drop-shadow-sm" 
                  viewBox="0 0 120 120" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Top Bun */}
                  <path d="M15 52C15 25 35 15 60 15C85 15 105 25 105 52H15Z" fill="#D97706" />
                  
                  {/* Sesame Seeds */}
                  <circle cx="42" cy="28" r="1.8" fill="#FEF3C7" />
                  <circle cx="60" cy="24" r="1.8" fill="#FEF3C7" />
                  <circle cx="78" cy="30" r="1.8" fill="#FEF3C7" />
                  <circle cx="50" cy="38" r="1.8" fill="#FEF3C7" />
                  <circle cx="70" cy="36" r="1.8" fill="#FEF3C7" />
                  
                  {/* Fresh Tomato Slices */}
                  <rect x="12" y="56" width="96" height="6" rx="3" fill="#EF4444" />
                  
                  {/* Melted Cheese Slice */}
                  <path d="M14 66H106L98 76L82 66L68 78L50 66L34 76L26 66" fill="#F59E0B" />
                  
                  {/* Flame Grilled Beef Patty */}
                  <rect x="16" y="74" width="88" height="10" rx="5" fill="#451A03" />
                  
                  {/* Wavy Fresh Lettuce */}
                  <path d="M12 87C20 90 30 84 40 87C50 90 60 84 70 87C80 90 90 84 108 87" stroke="#22C55E" strokeWidth="5" strokeLinecap="round" />
                  
                  {/* Bottom Bun */}
                  <path d="M16 95H104C104 103 92 108 60 108C28 108 16 103 16 95Z" fill="#D97706" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold tracking-tight text-red-600 leading-none">brgrhut</div>
                <div className="text-[9px] uppercase tracking-wider text-amber-500 font-extrabold mt-0.5">Flame Grilled Burgers</div>
              </div>
            </Link>
          </div>

          {/* Center: Search Bar configured for food menu items */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <SearchSuggestions
              placeholder="Search menu, burgers, sides, drinks..."
              className="w-full"
              inputClassName="w-full focus:ring-red-500"
            />
          </div>

          {/* Right side: Contact, Food Bag, Auth */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Contact / Order Hotline */}
            <div className="hidden md:flex items-center">
              <div className="text-sm text-gray-700">
                <span className="font-medium text-gray-600">Order Hotline:</span>
                <span className="ml-2 text-red-600 font-semibold text-base">+92 311 4000096</span>
              </div>
            </div>

            {/* Cart Button (Stylized as Order Bag) */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="relative p-2 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 hover:scale-110">
                  <ShoppingCart size={20} className="text-gray-700" />
                  {totalQuantity > 0 && (
                    <Badge className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 bg-red-600 text-white border-0 min-w-[18px] h-[18px] flex items-center justify-center rounded-full animate-pulse">
                      {totalQuantity}
                    </Badge>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent className="w-full sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-lg font-bold text-gray-900">Your Order Bag</SheetTitle>
                  <SheetDescription className="text-gray-600">
                    {totalQuantity} {totalQuantity === 1 ? 'delicious item' : 'delicious items'} ready to go!
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 max-h-[60vh] overflow-y-auto">
                  {cartItems.length > 0 ? (
                    cartItems
                      .filter((item) => item.product && item.product._id)
                      .map((item) => (
                        <CartProduct
                          key={item.product._id}
                          product={item.product}
                          quantity={item.quantity}
                        />
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">Your bag is empty. Let's add some burgers! 🍔</p>
                    </div>
                  )}
                </div>
                <SheetFooter className="mt-6">
                  <SheetClose asChild>
                    <Button
                      onClick={handleBuyNow}
                      disabled={cartItems.length === 0}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 transition-colors"
                    >
                      Place Order
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* Auth */}
            {user == null ? (
              <button
                onClick={() => openDrawer()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-white bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Sign In
              </button>
            ) : (
              <LogoutToggle user={user} />
            )}
          </div>
        </div>
      </div>
    </nav>

    {/* Checkout Dialog */}
    <Dialog open={openCheckoutDialog} onOpenChange={setOpenCheckoutDialog}>
      <DialogContent className="w-full lg:max-w-6xl h-[62vh] sm:h-[70vh] sm:w-[60vw] overflow-hidden p-0 bg-white rounded-xl shadow-xl flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>Complete your order</DialogDescription>
        </DialogHeader>
        <Checkout closeModal={() => setOpenCheckoutDialog(false)} />
      </DialogContent>
    </Dialog>
    </>
  );
};

export default Navbar;