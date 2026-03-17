"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { LayoutDashboard, Package, ShoppingBag, MessageSquare, Bell, User, LogOut, Store, BarChart3, Settings, ChevronRight } from "lucide-react";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, getUnreadNotificationCount, getConversations, getSellerOrders } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!currentUser) { router.replace("/auth/login"); return; }
    if (currentUser.role === "buyer") { router.replace("/buyer"); return; }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== "seller") return null;

  const unreadNotifs = getUnreadNotificationCount(currentUser.id);
  const conversations = getConversations(currentUser.id);
  const unreadMessages = conversations.reduce((s, c) => s + c.unreadCount, 0);
  const pendingOrders = getSellerOrders(currentUser.id).filter(o => o.status === "pending").length;

  const navItems = [
    { href: "/seller", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/seller/products", label: "Products", icon: Package },
    { href: "/seller/orders", label: "Orders", icon: ShoppingBag, badge: pendingOrders },
    { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/seller/messages", label: "Messages", icon: MessageSquare, badge: unreadMessages },
  ];

  const isActive = (href: string, exact?: boolean) => exact ? pathname === href : pathname.startsWith(href);
  const handleLogout = () => { logout(); router.push("/auth/login"); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 fixed left-0 top-0 bottom-0 z-40">
        <div className="p-5 border-b border-gray-100">
          <Link href="/seller" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900 block">Venturova</span>
              <span className="text-xs text-purple-600 font-medium">Seller Panel</span>
            </div>
          </Link>
        </div>

        {/* Seller Profile */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-xl object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Store className="w-5 h-5 text-purple-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive(item.href, item.exact)
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
              {item.badge && item.badge > 0 && (
                <span className={`ml-auto w-5 h-5 text-xs rounded-full flex items-center justify-center font-bold ${isActive(item.href, item.exact) ? "bg-white/30 text-white" : "bg-red-500 text-white"}`}>
                  {item.badge}
                </span>
              )}
              {!isActive(item.href, item.exact) && <ChevronRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-gray-400" />}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1">
          <Link href="/seller/profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive("/seller/profile") ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <Settings className="w-5 h-5" /> Settings
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Top Bar (mobile + desktop notifications) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4 shadow-sm">
        <Link href="/seller" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-sm">Seller Panel</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/seller/notifications" className="relative p-2 text-gray-500 hover:text-gray-700">
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{unreadNotifs}</span>}
          </Link>
          <button onClick={handleLogout} className="p-2 text-red-400 hover:text-red-600"><LogOut className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen">
        {/* Desktop Top Bar */}
        <div className="hidden md:flex items-center justify-end gap-3 px-6 py-3 bg-white border-b border-gray-100 sticky top-0 z-30">
          <Link href="/seller/notifications" className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{unreadNotifs}</span>}
          </Link>
          <Link href="/seller/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            {currentUser.avatar ? <img src={currentUser.avatar} alt="" className="w-7 h-7 rounded-full object-cover" /> : <User className="w-5 h-5 text-gray-400" />}
            <span className="text-sm font-medium text-gray-700">{currentUser.name.split(" ")[0]}</span>
          </Link>
        </div>
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 transition-colors ${isActive(item.href, item.exact) ? "text-purple-600" : "text-gray-400 hover:text-gray-600"}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="absolute top-2 left-1/2 ml-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
