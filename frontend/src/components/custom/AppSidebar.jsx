import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { fetchOrdersAdmin, fetchPendingOrderCount, updateOrderStatus } from "@/redux/slices/order/orderSlice";
import { fetchLowStockCount } from "@/redux/slices/products/productSlice";
import { useAuth } from "@/hooks/use-auth";
import {
  FilePlus2Icon,
  ChartBarStacked,
  GalleryVerticalEnd,
  PackageSearch,
  UserCheck,
  ShoppingCart,
  UserCog,
  LogOut,
  AlertTriangle,
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
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";

const items = [
  { 
    title: "All Food Items", 
    url: "/admin/dashboard/all-products", 
    icon: GalleryVerticalEnd, 
    description: "Manage Food Items",
    category: "main"
  },
  { 
    title: "Add New Food", 
    url: "/admin/dashboard", 
    icon: FilePlus2Icon, 
    description: "Add New Menu Item",
    category: "main"
  },
  { 
    title: "Menu Categories", 
    url: "/admin/category", 
    icon: ChartBarStacked, 
    description: "Food Categories",
    category: "main"
  },
  { 
    title: "Low Ingredients", 
    url: "/admin/dashboard/low-stock", 
    icon: AlertTriangle, 
    showBadge: true,
    badgeKey: "lowStock",
    description: "Low Ingredient Items",
    category: "main"
  },
  { 
    title: "Live Orders", 
    url: "/admin/dashboard/orders", 
    icon: PackageSearch, 
    showBadge: true, 
    badgeKey: "pendingOrders",
    description: "Order Management",
    category: "orders"
  },
  { 
    title: "Customers", 
    url: "/admin/dashboard/users", 
    icon: UserCheck, 
    description: "Customer List & Info",
    category: "users"
  },
  { 
    title: "Customer Storefront", 
    url: "/", 
    icon: ShoppingCart, 
    description: "View Front End",
    category: "external"
  },
];

export function AppSidebar() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const pendingOrderCount = useSelector((state) => state.orders.pendingOrderCount);
  const lowStockCount = useSelector((state) => state.products.lowStockCount);
  const { handleLogout } = useAuth();
  const { setOpenMobile, isMobile } = useSidebar();

  useEffect(() => {
    if (user) {
      dispatch(fetchOrdersAdmin());
      dispatch(fetchPendingOrderCount());
      dispatch(fetchLowStockCount());
    }
  }, [dispatch, user]);

  const onLogout = async () => {
    setLoading(true);
    try {
      await handleLogout();
    } finally {
      setLoading(false);
    }
  };

  if (message) {
    return (
      <div className="h-screen flex justify-center items-center bg-white">
        <p className="text-red-500 font-semibold">{message}</p>
      </div>
    );
  }

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
            {items.filter(item => item.category === 'main').map((item) => {
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
                      onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                    >
                      <Icon className={`w-4 h-4 transition-all ${
                        isActive 
                          ? "text-white scale-110" 
                          : "text-zinc-400 group-hover:text-orange-500 group-hover:scale-105"
                      }`} />
                      <span className="text-xs font-medium">{item.title}</span>
                      
                      {item.showBadge && item.badgeKey === "lowStock" && lowStockCount > 0 && (
                        <Badge className={`text-[10px] font-bold px-1.5 py-0.5 ml-auto border-0 rounded-full min-w-[20px] text-center ${
                          isActive 
                            ? "bg-white text-orange-600" 
                            : "bg-orange-100 text-orange-700 group-hover:bg-orange-200"
                        }`}>
                          {lowStockCount}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Orders & Users Group */}
        <SidebarGroup className="p-0">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em] mb-2 px-3">
            Orders & Users
          </h3>
          <SidebarMenu className="space-y-1">
            {items.filter(item => item.category === 'orders' || item.category === 'users').map((item) => {
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
                      onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                    >
                      <Icon className={`w-4 h-4 transition-all ${
                        isActive 
                          ? "text-white scale-110" 
                          : "text-zinc-400 group-hover:text-orange-500 group-hover:scale-105"
                      }`} />
                      <span className="text-xs font-medium">{item.title}</span>
                      
                      {item.showBadge && item.badgeKey === "pendingOrders" && pendingOrderCount > 0 && (
                        <Badge className={`text-[10px] font-bold px-1.5 py-0.5 ml-auto border-0 rounded-full min-w-[20px] text-center ${
                          isActive 
                            ? "bg-white text-red-600" 
                            : "bg-red-500 text-white shadow-sm"
                        }`}>
                          {pendingOrderCount}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* External Group */}
        <SidebarGroup className="p-0">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em] mb-2 px-3">
            External
          </h3>
          <SidebarMenu className="space-y-1">
            {items.filter(item => item.category === 'external').map((item) => {
              const isActive = pathname === item.url;
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`group relative transition-all duration-150 rounded-xl h-10 ${
                      isActive
                        ? "bg-orange-500 text-white font-semibold shadow-md"
                        : "text-zinc-600 hover:bg-orange-50/60 hover:text-orange-600"
                    }`}
                  >
                    <Link 
                      to={item.url} 
                      className="flex items-center gap-3 p-2.5 w-full"
                      onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
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

      {/* Footer Profile & Logout */}
      <SidebarFooter className="p-4 border-t border-zinc-200/80 bg-white">
        <div className="space-y-2">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-zinc-600 hover:text-orange-600 hover:bg-orange-50/60 h-9 rounded-xl transition-all duration-150"
          >
            <Link 
              to="/admin/profile" 
              className="flex items-center gap-3"
              onClick={() => {
                if (isMobile) {
                  setOpenMobile(false);
                }
              }}
            >
              <UserCog className="w-4 h-4 text-zinc-400 group-hover:text-orange-500" />
              <span className="text-xs font-semibold">Admin Profile</span>
            </Link>
          </Button>
          
          <Button
            onClick={onLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold shadow-sm hover:shadow transition-all duration-150 h-9 rounded-xl text-xs"
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