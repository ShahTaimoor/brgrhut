import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Search, 
  Calendar, 
  Grid, 
  List, 
  ChevronDown, 
  Eye, 
  RefreshCw,
  Phone
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Orders() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  // --- 1. Redux Integration Placeholder ---
  // Replace this with your actual Redux state selection if you have an orders slice
  const { orders = [], isLoading = false } = useSelector((state) => state.orders || { orders: [], isLoading: false });

  // --- 2. Component Local States ---
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [shopSearch, setShopSearch] = useState('');
  const [mobileSearch, setMobileSearch] = useState('');
  
  // Initialize dates to today's date (7/15/2026 based on your screenshot)
  const [fromDate, setFromDate] = useState('2026-07-15');
  const [toDate, setToDate] = useState('2026-07-15');
  
  const [perPage, setPerPage] = useState('24');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // --- 3. Fetch Data ---
  useEffect(() => {
    // If you have a dispatch to fetch orders, trigger it here:
    // dispatch(getOrders());
  }, [dispatch]);

  // --- 4. Filtering Logic ---
  const filteredOrders = orders.filter((order) => {
    // Filter by status tab
    if (statusFilter === 'pending' && order.status !== 'pending') return false;
    if (statusFilter === 'completed' && order.status !== 'completed') return false;

    // Search by shop/customer name
    if (shopSearch && !order.shopName?.toLowerCase().includes(shopSearch.toLowerCase())) return false;

    // Search by mobile number
    if (mobileSearch && !order.mobile?.includes(mobileSearch)) return false;

    // Filter by date range (assuming order.createdAt exists)
    if (order.createdAt) {
      const orderDate = order.createdAt.split('T')[0];
      if (fromDate && orderDate < fromDate) return false;
      if (toDate && orderDate > toDate) return false;
    }

    return true;
  });

  // --- 5. Calculation for Stat Cards ---
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const completedOrdersCount = orders.filter(o => o.status === 'completed').length;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Orders Card */}
        <Card className="border border-zinc-100 shadow-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-500">Total Orders</p>
              <h3 className="text-4xl font-bold text-zinc-900">{totalOrdersCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Pending Orders Card */}
        <Card className="border border-zinc-100 shadow-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-500">Pending Orders</p>
              <h3 className="text-4xl font-bold text-orange-600">{pendingOrdersCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Completed Orders Card */}
        <Card className="border border-zinc-100 shadow-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-500">Completed</p>
              <h3 className="text-4xl font-bold text-green-600">{completedOrdersCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Advanced Filters & Utility Panel */}
      <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
        
        {/* Status Filtering Tabs */}
        <div className="flex gap-2 border-b border-zinc-100 pb-4">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            className={`rounded-full px-5 py-1.5 h-auto text-sm ${statusFilter === 'all' ? 'bg-zinc-900 hover:bg-zinc-800 text-white' : 'border-zinc-200 text-zinc-600'}`}
            onClick={() => setStatusFilter('all')}
          >
            All Orders
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            className={`rounded-full px-5 py-1.5 h-auto text-sm ${statusFilter === 'pending' ? 'bg-zinc-900 hover:bg-zinc-800 text-white' : 'border-zinc-200 text-zinc-600'}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'default' : 'outline'}
            className={`rounded-full px-5 py-1.5 h-auto text-sm ${statusFilter === 'completed' ? 'bg-zinc-900 hover:bg-zinc-800 text-white' : 'border-zinc-200 text-zinc-600'}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completed
          </Button>
        </div>

        {/* Filter Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
          
          {/* Shop Name Search */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Shop Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="Search shop..."
                className="pl-9 h-10 text-sm border-zinc-200 focus:border-blue-500"
                value={shopSearch}
                onChange={(e) => setShopSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Mobile Search */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Mobile</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="Search mobile..."
                className="pl-9 h-10 text-sm border-zinc-200 focus:border-blue-500"
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
              />
            </div>
          </div>

          {/* From Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">From Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 pointer-events-none" />
              <input
                type="date"
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-zinc-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-zinc-700 bg-white"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
          </div>

          {/* To Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">To Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 pointer-events-none" />
              <input
                type="date"
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-zinc-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-zinc-700 bg-white"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          {/* Per Page Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Per Page</label>
            <Select value={perPage} onValueChange={setPerPage}>
              <SelectTrigger className="h-10 border-zinc-200 text-sm bg-white">
                <SelectValue placeholder="24" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Grid/List Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">&nbsp;</label>
            <div className="flex items-center border border-zinc-200 rounded-lg p-0.5 bg-zinc-50 h-10 justify-center">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8 rounded-md"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4 text-zinc-600" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8 rounded-md"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4 text-zinc-600" />
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Main Data Area */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 min-h-[350px] flex flex-col justify-between">
        
        <div>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Live Orders Log</h2>
              <p className="text-sm text-zinc-500">{filteredOrders.length} matching order records found</p>
            </div>
          </div>

          {isLoading ? (
            /* Loading State spinner */
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <RefreshCw className="animate-spin text-blue-600 w-8 h-8" />
              <p className="text-sm text-zinc-500">Checking live feeds...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            /* Empty State matching your exact screenshot design */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4 border border-zinc-100">
                <List className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">No orders found</h3>
              <p className="text-zinc-500 max-w-sm mt-1 text-sm">
                There are no current orders matching your criteria right now.
              </p>
            </div>
          ) : (
            /* Grid View */
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="border border-zinc-200 rounded-xl p-4 hover:shadow-md transition-all bg-zinc-50/30 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-zinc-800 text-base">{order.shopName}</h4>
                        <p className="text-xs text-zinc-400 mt-0.5">ID: {order.orderId || order._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <Badge variant={order.status === 'completed' ? 'success' : 'warning'} className="capitalize">
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-zinc-600 space-y-1">
                      <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-zinc-400" /> {order.mobile}</p>
                      <p className="text-xs text-zinc-400">Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List / Table View */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-500 text-sm">
                      <th className="py-3 px-4 font-semibold">Order ID</th>
                      <th className="py-3 px-4 font-semibold">Shop Name</th>
                      <th className="py-3 px-4 font-semibold">Mobile</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-all text-sm">
                        <td className="py-3.5 px-4 font-mono text-zinc-500">{order.orderId || order._id.slice(-8).toUpperCase()}</td>
                        <td className="py-3.5 px-4 font-semibold text-zinc-800">{order.shopName}</td>
                        <td className="py-3.5 px-4 text-zinc-600">{order.mobile}</td>
                        <td className="py-3.5 px-4">
                          <Badge variant={order.status === 'completed' ? 'success' : 'warning'} className="capitalize">
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}