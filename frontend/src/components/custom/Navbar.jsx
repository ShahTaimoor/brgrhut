import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", hash: "#home" },
  { label: "Menu", hash: "#menu" },
  { label: "About", hash: "#about" },
  { label: "Contact Us", hash: "#contact" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Brand */}
          <Link to={onHome ? "/#home" : "/"} className="flex items-center space-x-2 flex-shrink-0">
            <svg
              className="h-8 w-8 sm:h-10 sm:w-10 drop-shadow-sm"
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
              <rect x="12" y="56" width="96" height="6" rx="3" fill="#F97316" />
              {/* Melted Cheese Slice */}
              <path d="M14 66H106L98 76L82 66L68 78L50 66L34 76L26 66" fill="#F59E0B" />
              {/* Flame Grilled Beef Patty */}
              <rect x="16" y="74" width="88" height="10" rx="5" fill="#7C4A22" />
              {/* Wavy Fresh Lettuce */}
              <path d="M12 87C20 90 30 84 40 87C50 90 60 84 70 87C80 90 90 84 108 87" stroke="#65A30D" strokeWidth="5" strokeLinecap="round" />
              {/* Bottom Bun */}
              <path d="M16 95H104C104 103 92 108 60 108C28 108 16 103 16 95Z" fill="#D97706" />
            </svg>
            <div className="hidden sm:block">
              <div className="text-lg sm:text-xl font-bold tracking-tight text-primary leading-none">brgrhut</div>
              <div className="text-[9px] uppercase tracking-wider text-amber-600 font-extrabold mt-0.5">Flame Grilled Burgers</div>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-4 sm:gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.hash}
                to={`/${link.hash}`}
                className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Demo mode: direct link into the admin dashboard, no login required */}
          <div className="flex-shrink-0">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
