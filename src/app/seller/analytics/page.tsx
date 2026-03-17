"use client";

import { useApp } from "@/lib/context";
import { DollarSign, TrendingUp, ShoppingBag, Star, Package, Users, ArrowUp, ArrowDown } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b", "#ef4444"];

export default function SellerAnalytics() {
  const { currentUser, getProductsBySeller, getSellerOrders, getProductReviews } = useApp();
  const products = getProductsBySeller(currentUser?.id || "");
  const orders = getSellerOrders(currentUser?.id || "");

  const revenue = orders.filter(o => !["cancelled", "refunded"].includes(o.status)).reduce((s, o) => s + o.total, 0);
  const completedOrders = orders.filter(o => o.status === "delivered").length;
  const avgOrderValue = orders.length > 0 ? revenue / orders.length : 0;
  const totalReviews = products.reduce((s, p) => s + p.reviewCount, 0);
  const avgRating = products.length ? (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1) : "—";

  // Monthly revenue trend
  const monthlyRevenue = [
    { month: "Oct", revenue: 2400, orders: 18, customers: 14 },
    { month: "Nov", revenue: 3100, orders: 24, customers: 19 },
    { month: "Dec", revenue: 4800, orders: 38, customers: 31 },
    { month: "Jan", revenue: 3600, orders: 27, customers: 22 },
    { month: "Feb", revenue: 5200, orders: 41, customers: 35 },
    { month: "Mar", revenue: Math.max(revenue, 1000), orders: orders.length, customers: Math.ceil(orders.length * 0.8) },
  ];

  // Product performance
  const productPerformance = products.slice(0, 6).map(p => ({
    name: p.title.slice(0, 20) + (p.title.length > 20 ? "..." : ""),
    revenue: p.price * (Math.floor(Math.random() * 20) + 5),
    rating: p.rating,
    reviews: p.reviewCount,
  }));

  // Category breakdown
  const categoryData = Object.entries(
    products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + p.price;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value: Math.round(value) }));

  // Order status breakdown
  const statusBreakdown = [
    { name: "Delivered", value: orders.filter(o => o.status === "delivered").length },
    { name: "Shipped", value: orders.filter(o => o.status === "shipped").length },
    { name: "Confirmed", value: orders.filter(o => o.status === "confirmed").length },
    { name: "Pending", value: orders.filter(o => o.status === "pending").length },
    { name: "Cancelled", value: orders.filter(o => o.status === "cancelled").length },
  ].filter(s => s.value > 0);

  const kpis = [
    { label: "Total Revenue", value: `$${revenue.toFixed(2)}`, icon: DollarSign, color: "from-green-500 to-emerald-600", trend: "+12.5% vs last month", up: true },
    { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "from-indigo-500 to-purple-600", trend: "+8.3% vs last month", up: true },
    { label: "Avg Order Value", value: `$${avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: "from-blue-500 to-cyan-600", trend: "+4.2% vs last month", up: true },
    { label: "Avg Rating", value: avgRating, icon: Star, color: "from-orange-500 to-amber-600", trend: `${totalReviews} total reviews`, up: true },
    { label: "Active Products", value: products.filter(p => p.status === "active").length, icon: Package, color: "from-pink-500 to-rose-600", trend: `${products.length} total listed`, up: true },
    { label: "Completed Orders", value: completedOrders, icon: Users, color: "from-teal-500 to-green-600", trend: `${orders.length > 0 ? Math.round(completedOrders / orders.length * 100) : 0}% completion rate`, up: true },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Store performance and insights</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center mb-3`}>
              <kpi.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl font-bold text-gray-900">{kpi.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{kpi.label}</div>
            <div className={`text-xs mt-1.5 font-medium ${kpi.up ? "text-green-600" : "text-red-500"} flex items-center gap-0.5`}>
              {kpi.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Revenue & Orders Trend</h3>
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue ($)" />
              <Line type="monotone" dataKey="orders" stroke="#ec4899" strokeWidth={2} dot={{ fill: "#ec4899", r: 3 }} name="Orders" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Order Status</h3>
          {statusBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={statusBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                    {statusBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {statusBreakdown.map((s, i) => (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-gray-600">{s.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48">
              <ShoppingBag className="w-10 h-10 text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">No orders yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Product Revenue */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Product Revenue</h3>
          {productPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={productPerformance} layout="vertical" barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={120} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[0, 6, 6, 0]} name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-52">
              <Package className="w-10 h-10 text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">Add products to see analytics</p>
            </div>
          )}
        </div>

        {/* Revenue by Category */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Revenue by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Revenue ($)">
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-52">
              <Package className="w-10 h-10 text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">No category data yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
