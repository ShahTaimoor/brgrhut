import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
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
  const { user } = useSelector((state) => state.auth);

  // Show Dashboard link only for admin (role 1) and super admin (role 2)
  const isAdmin = user && user.role >= 1;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Brand */}
          <Link to={onHome ? "/#home" : "/"} className="flex items-center space-x-2 flex-shrink-0">
            <img
              src="/brgrhut-logo.png"
              alt="brgrhut"
              className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 object-contain drop-shadow-sm"
            />
            <div className="hidden sm:block">
              <div className="font-['Fredoka',sans-serif] text-lg sm:text-xl font-bold tracking-tight text-primary leading-none">brgrhut</div>
              <div className="font-['Fredoka',sans-serif] text-[9px] uppercase tracking-wider text-amber-600 font-extrabold mt-0.5">Flame Grilled Burgers</div>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-4 sm:gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.hash}
                to={`/${link.hash}`}
                className="font-['Poppins',sans-serif] text-xs sm:text-sm font-semibold text-gray-700 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Dashboard link — only visible to admin users (role >= 1) */}
          {isAdmin && (
            <div className="flex-shrink-0">
              <Link
                to="/admin/dashboard"
                className="font-['Poppins',sans-serif] inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
