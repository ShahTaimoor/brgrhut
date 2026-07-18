import { Link, useLocation } from "react-router-dom";
import { Home, User, Package, Download, LogOut, LayoutDashboard } from "lucide-react";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slices/auth/authSlice";
import { useAuthDrawer } from "../../contexts/AuthDrawerContext";

const BottomNavigation = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const { openDrawer } = useAuthDrawer();

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

  const clearCookies = () => {
    const cookies = ['accessToken', 'refreshToken'];
    const domains = [window.location.hostname, 'localhost', '127.0.0.1'];
    const paths = ['/', '/api', '/admin'];

    cookies.forEach(cookieName => {
      domains.forEach(domain => {
        paths.forEach(path => {
          // Clear with different combinations
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=.${domain};`;
          document.cookie = `${cookieName}=; max-age=0; path=${path};`;
          document.cookie = `${cookieName}=; max-age=0; path=${path}; domain=${domain};`;
          document.cookie = `${cookieName}=; max-age=0; path=${path}; domain=.${domain};`;
        });
      });
    });
  };

  const handleLogout = async () => {
    // Clear cookies on client side as fallback
    clearCookies();

    // Use Redux async thunk to handle logout (includes API call)
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      // Even if logout API fails, user is already logged out locally
    } finally {
      // Clear cookies again after logout attempt
      clearCookies();
      navigate('/');
    }
  };

  // Navigation items: Install, My Orders, Home (center/active), Admin, Profile
  const navItems = [
    {
      path: "/",
      icon: Home,
      label: "Home",
      show: true,
      isCenter: true, // This is the center/active item
      isHome: true
    },
    {
      path: "/orders",
      icon: Package,
      label: "My Orders",
      show: user !== null,
      isCenter: false
    },
    {
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Admin",
      show: user !== null && (user.role === 1 || user.role === 2),
      isCenter: false
    },
    {
      path: "/profile",
      icon: User,
      label: "Profile",
      show: true,
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

  const actionItems = [
    {
      icon: LogOut,
      label: "Logout",
      show: user !== null,
      onClick: handleLogout,
      className: "text-destructive hover:text-destructive/80 hover:bg-destructive/10"
    }
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path === "/admin/dashboard" && location.pathname.startsWith("/admin")) return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-lg lg:hidden">
        <div className="flex items-end justify-around px-2 pb-3 pt-3 relative">
        {navItems.map((item, index) => {
          if (!item.show) return null;

          const Icon = item.icon;
          const active = isActive(item.path) || (item.isHome && location.pathname === "/");

          // Handle action items (like Install) with onClick
          if (item.isAction && item.onClick) {
            return (
              <button
                key={`${item.label}-${index}`}
                onClick={(e) => {
                  item.onClick(e);
                  // Scroll to top when clicking navigation
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

          const handleNavClick = (e) => {
            // If profile and user not logged in, open auth drawer
            if (item.path === '/profile' && !user) {
              e.preventDefault();
              openDrawer('login');
              return;
            }
            // Scroll to top when clicking navigation
            window.scrollTo({ top: 0, behavior: 'smooth' });
          };

          return (
            <Link
              key={`${item.path}-${index}`}
              to={item.path}
              onClick={handleNavClick}
              className={`flex flex-col items-center justify-center relative transition-all duration-300 flex-1`}
            >
              {item.isCenter ? (
                // Home button - no background, same as other items
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
              ) : (
                // Inactive items - just icons, no background, light gray/silver color
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
              )}
            </Link>
          );
        })}

        {/* Logout button */}
        {actionItems.map((item, index) => {
          if (!item.show) return null;

          const Icon = item.icon;
          return (
            <button
              key={`${item.label}-${index}`}
              onClick={(e) => {
                e.preventDefault();
                item.onClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-col items-center justify-center relative transition-all duration-300 flex-1 min-w-0"
            >
              <div className="flex flex-col items-center justify-center gap-0.5">
                <Icon
                  size={22}
                  className={`transition-all duration-300 ${item.className || 'text-gray-400'}`}
                  strokeWidth={1.5}
                  fill="none"
                />
                <span className={`text-[10px] font-medium transition-all duration-300 ${item.className || 'text-gray-400'}`}>
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}

      </div>
    </nav>
    </>
  );
};

export default BottomNavigation;
