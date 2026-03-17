"use client";

import Link from "next/link";
import { useApp } from "@/lib/context";
import { DollarSign, Package, ShoppingBag, Star, TrendingUp, ArrowUp, ArrowDown, Plus, Eye, Clock, CheckCircle, Truck, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const CHART_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b"];

export default function SellerDashboard() {
  const { currentUser, getProductsBySeller, getSellerOrders, products } = useApp();
  const myProducts = getProductsBySeller(currentUser?.id || "");
  const myOrders = getSellerOrders(currentUser?.id || "");

  const totalRevenue = myOrders.filter(o => o.status !== "cancelled" && o.status !== "refunded").reduce((s, o) => s + o.total, 0);
  const pendingOrders = myOrders.filter(o => o.status === "pending").length;
  const activeProducts = myProducts.filter(p => p.status === "active").length;
  const avgRating = myProducts.length ? (myProducts.reduce((s, p) => s + p.rating, 0) / myProducts.length).toFixed(1) : "—";

  // Monthly revenue data
  const monthlyData = [
    { month: "Oct", revenue: 2400, orders: 18 },
    { month: "Nov", revenue: 3100, orders: 24 },
    { month: "Dec", revenue: 4800, orders: 38 },
    { month: "Jan", revenue: 3600, orders: 27 },
    { month: "Feb", revenue: 5200, orders: 41 },
    { month: "Mar", revenue: totalRevenue > 0 ? Math.round(totalRevenue) : 4100, orders: myOrders.length },
  ];

  // Category breakdown
  const categoryData = Object.entries(
    myProducts.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const recentOrders = myOrders.slice(0, 5);

  const statusConfig = {
    pending: { color: "text-yellow-600 bg-yellow-50", icon: Clock },
    confirmed: { color: "text-blue-600 bg-blue-50", icon: CheckCircle },
    shipped: { color: "text-purple-600 bg-purple-50", icon: Truck },
    delivered: { color: "text-green-600 bg-green-50", icon: CheckCircle },
    cancelled: { color: "text-red-600 bg-red-50", icon: Package },
    refunded: { color: "text-gray-600 bg-gray-50", icon: Package },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser?.name.split(" ")[0]}! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening with your store today.</p>
        </div>
        <Link href="/seller/products/new" className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-purple-200">
          <Plus className="w-5 h-5" /> New Product
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Revenue", value: `₹${totalRevenue.toFixed(0)}`, icon: DollarSign, color: "from-green-500 to-emerald-600", trend: "+12.5%", up: true },
          { label: "Total Orders", value: myOrders.length, icon: ShoppingBag, color: "from-indigo-500 to-purple-600", trend: "+8.3%", up: true },
          { label: "Active Products", value: activeProducts, icon: Package, color: "from-blue-500 to-cyan-600", trend: "+2", up: true },
          { label: "Avg. Rating", value: avgRating, icon: Star, color: "from-orange-500 to-amber-600", trend: "4.8 all time", up: true },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${card.up ? "text-green-600" : "text-red-500"}`}>
                {card.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {card.trend}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-xs text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Revenue & Orders</h3>
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} name="Revenue ($)" />
              <Bar dataKey="orders" fill="#c7d2fe" radius={[6, 6, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Categories */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Products by Category</h3>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {categoryData.map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-gray-600">{cat.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{cat.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <Package className="w-10 h-10 text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">No products yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
            <Link href="/seller/orders" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View all</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <ShoppingBag className="w-10 h-10 text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => {
                const conf = statusConfig[order.status];
                const StatusIcon = conf.icon;
                return (
                  <div key={order.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className={`w-8 h-8 rounded-lg ${conf.color} flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{order.buyerName}</p>
                      <p className="text-xs text-gray-400">{order.items.reduce((s, i) => s + i.quantity, 0)} items · {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900">₹${order.total.toFixed(0)}</p>
                      <span className={`text-xs capitalize px-2 py-0.5 rounded-full font-medium ${conf.color}`}>{order.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Top Products</h3>
            <Link href="/seller/products" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">Manage</Link>
          </div>
          {myProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Package className="w-10 h-10 text-gray-200 mb-2" />
              <p className="text-sm text-gray-400 mb-4">No products listed yet</p>
              <Link href="/seller/products/new" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors">
                Add First Product
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {[...myProducts].sort((a, b) => b.rating - a.rating).slice(0, 4).map(product => (
                <div key={product.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <img src={product.images[0]} alt={product.title} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{product.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-gray-500">{product.rating} ({product.reviewCount})</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">₹${product.price}</p>
                    <p className="text-xs text-gray-400">{product.stock} stock</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
