import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import {
  FilePlus2Icon,
  GalleryVerticalEnd,
  UserCog,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";

const items = [
  {
    title: "All Food Items",
    url: "/admin/dashboard/all-products",
    icon: GalleryVerticalEnd,
    description: "Manage Food Items",
  },
  {
    title: "Add New Food",
    url: "/admin/dashboard",
    icon: FilePlus2Icon,
    description: "Add New Menu Item",
  },
];

// Kept reachable but out of the main nav — not deleted, just de-emphasized.
// See conversation notes: these still back real functionality (category
// CRUD, item availability/pricing edits, customer role & password-reset
// management) that has no other admin entry point yet.
const secondaryLinks = [
  { title: "Manage Categories", url: "/admin/category" },
  { title: "Manage Item Availability", url: "/admin/dashboard/low-stock" },
  { title: "Manage Customers & Roles", url: "/admin/dashboard/users" },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const { handleLogout } = useAuth();
  const { setOpenMobile, isMobile } = useSidebar();

  const onLogout = async () => {
    setLoading(true);
    try {
      await handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar className="border-r border-zinc-200 bg-zinc-50/80 shadow-sm font-['Inter',sans-serif]">
      {/* Profile Header */}
      <SidebarHeader className="p-4 border-b border-zinc-200/80 bg-white">
        {user && (
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9 border-2 border-orange-100 shadow-sm">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-orange-50 text-orange-600 text-xs font-bold">
                {user.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-zinc-900 font-semibold text-sm truncate tracking-tight">
                {user.name || 'Hut Admin'}
              </p>
              <p className="text-orange-600 text-[10px] truncate mt-0.5 font-bold uppercase tracking-wider">
                Store Manager
              </p>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="p-3 space-y-4 bg-transparent">
        {/* Main Navigation Group */}
        <SidebarGroup className="p-0">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em] mb-2 px-3">
            Main Navigation
          </h3>
          <SidebarMenu className="space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.url;
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`group relative transition-all duration-150 rounded-xl h-10 ${
                      isActive
                        ? "bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/10"
                        : "text-zinc-600 hover:bg-orange-50/60 hover:text-orange-600"
                    }`}
                  >
                    <Link
                      to={item.url}
                      className="flex items-center gap-3 p-2.5 w-full"
                      onClick={closeOnMobile}
                    >
                      <Icon className={`w-4 h-4 transition-all ${
                        isActive
                          ? "text-white scale-110"
                          : "text-zinc-400 group-hover:text-orange-500 group-hover:scale-105"
                      }`} />
                      <span className="text-xs font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: profile, de-emphasized secondary links, logout */}
      <SidebarFooter className="p-4 border-t border-zinc-200/80 bg-white">
        <div className="space-y-3">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-zinc-600 hover:text-orange-600 hover:bg-orange-50/60 h-9 rounded-xl transition-all duration-150"
          >
            <Link
              to="/admin/profile"
              className="flex items-center gap-3"
              onClick={closeOnMobile}
            >
              <UserCog className="w-4 h-4 text-zinc-400 group-hover:text-orange-500" />
              <span className="text-xs font-semibold">Admin Profile</span>
            </Link>
          </Button>

          <div className="space-y-0.5 pt-1 border-t border-zinc-100">
            {secondaryLinks.map((link) => (
              <Link
                key={link.url}
                to={link.url}
                onClick={closeOnMobile}
                className="block px-2 py-1.5 text-[11px] text-zinc-400 hover:text-orange-600 transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </div>

          <Button
            onClick={onLogout}
            className="w-full bg-destructive hover:bg-destructive/90 text-white font-semibold shadow-sm hover:shadow transition-all duration-150 h-9 rounded-xl text-xs"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Logging out...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </div>
            )}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
