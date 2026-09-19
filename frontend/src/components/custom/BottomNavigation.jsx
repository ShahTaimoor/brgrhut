import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, BookOpen, Info, Phone, Download, LayoutDashboard } from "lucide-react";
import { useActiveSection, lockActiveSection } from "@/hooks/useActiveSection";
import { useState, useEffect } from "react";

const BottomNavigation = () => {
  const location = useLocation();
  // "/admin/dashboard" is the admin back-office, guarded by
  // AdminProtectedRoute (role >= 1) - showing this tab to every visitor
  // meant regular customers could tap it and just get bounced to the admin
  // login. Only show it once there's an actual logged-in admin.
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isAdmin = isAuthenticated && user && user.role >= 1;

  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // PWA Install functionality
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show install prompt if not already installed
      if (!window.matchMedia('(display-mode: standalone)').matches &&
          window.navigator.standalone !== true) {
        setShowInstallPrompt(true);
      }
    };

    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches ||
          window.navigator.standalone === true) {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      }
    };

    // Check if user has already dismissed the install prompt
    const hasUserDismissed = localStorage.getItem('pwa-install-dismissed');
    if (hasUserDismissed) {
      setShowInstallPrompt(false);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    checkIfInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      } else {
        // User dismissed the install prompt, remember this choice
        localStorage.setItem('pwa-install-dismissed', 'true');
        setShowInstallPrompt(false);
      }
    }
  };

  // Navigation items: Home (center/active), Menu, Dashboard, Install
  const navItems = [
    {
      path: "/#home",
      section: "home",
      icon: Home,
      label: "Home",
      show: true,
      isCenter: true,
      isHome: true
    },
    {
      path: "/#menu",
      section: "menu",
      icon: BookOpen,
      label: "Menu",
      show: true,
      isCenter: false
    },
    {
      path: "/#home",
      section: "home",
      isLogo: true,
      label: "brgrhut",
      show: true
    },
    {
      path: "/#about",
      section: "about",
      icon: Info,
      label: "About",
      show: true,
      isCenter: false
    },
    {
      path: "/#contact",
      section: "contact",
      icon: Phone,
      label: "Contact",
      show: true,
      isCenter: false
    },
    {
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      show: isAdmin,
      isCenter: false
    },
    {
      path: "/",
      icon: Download,
      label: "Install",
      show: showInstallPrompt || deferredPrompt !== null,
      isCenter: false,
      onClick: handleInstall,
      isAction: true
    },
  ];

  const activeSection = useActiveSection();

  const isActive = (item) => {
    if (item.section) return activeSection === item.section;
    if (item.path === "/admin/dashboard" && location.pathname.startsWith("/admin")) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-lg lg:hidden">
      <div className="flex items-end justify-around px-2 pb-3 pt-3 relative">
        {navItems.map((item, index) => {
          if (!item.show) return null;

          if (item.isLogo) {
            return (
              <Link
                key="logo"
                to={item.path}
                onClick={() => lockActiveSection(item.section)}
                aria-label="brgrhut home"
                className="relative -mt-7 flex flex-1 items-center justify-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-gray-200">
                  <img src="/brgrhut-logo.png" alt="" className="h-11 w-11 object-contain" />
                </span>
              </Link>
            );
          }

          const Icon = item.icon;
          const active = isActive(item);

          // Handle action items (like Install) with onClick
          if (item.isAction && item.onClick) {
            return (
              <button
                key={`${item.label}-${index}`}
                onClick={(e) => {
                  item.onClick(e);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex flex-col items-center justify-center relative transition-all duration-300 flex-1"
              >
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <Icon
                    size={22}
                    className="text-gray-400 transition-all duration-300"
                    strokeWidth={1.5}
                    fill="none"
                  />
                  <span className="text-[10px] text-gray-400 font-medium">{item.label}</span>
                </div>
              </button>
            );
          }

          return (
            <Link
              key={`${item.path}-${item.label}-${index}`}
              to={item.path}
              onClick={() => {
                if (item.section) lockActiveSection(item.section);
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-col items-center justify-center relative transition-all duration-300 flex-1"
            >
              <div className="flex flex-col items-center justify-center gap-0.5">
                <Icon
                  size={22}
                  className={`transition-all duration-300 ${
                    active ? "text-primary" : "text-gray-400"
                  }`}
                  strokeWidth={1.5}
                  fill="none"
                />
                <span className={`text-[10px] font-medium transition-all duration-300 ${
                  active ? "text-primary" : "text-gray-400"
                }`}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
