"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/context";
import {
  Home, Search, ShoppingCart, Heart, Package, MessageSquare,
  Bell, User, LogOut, Store, ChevronRight
} from "lucide-react";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, cartCount, getUnreadNotificationCount, getConversations } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!currentUser) { router.replace("/auth/login"); return; }
    if (currentUser.role === "seller") { router.replace("/seller"); return; }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== "buyer") return null;

  const unreadNotifs = getUnreadNotificationCount(currentUser.id);
  const conversations = getConversations(currentUser.id);
  const unreadMessages = conversations.reduce((s, c) => s + c.unreadCount, 0);

  const navItems = [
    { href: "/buyer", label: "Home", icon: Home, exact: true },
    { href: "/buyer/browse", label: "Browse", icon: Search },
    { href: "/buyer/cart", label: "Cart", icon: ShoppingCart, badge: cartCount },
    { href: "/buyer/wishlist", label: "Wishlist", icon: Heart },
    { href: "/buyer/orders", label: "Orders", icon: Package },
    { href: "/buyer/messages", label: "Messages", icon: MessageSquare, badge: unreadMessages },
  ];

  const isActive = (href: string, exact?: boolean) => exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = () => { logout(); router.push("/auth/login"); };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/buyer" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Venturova</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.href, item.exact)
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/buyer/notifications" className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadNotifs}
                </span>
              )}
            </Link>
            <Link href="/buyer/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-indigo-600" />
                </div>
              )}
              <span className="hidden md:block text-sm font-medium text-gray-700">{currentUser.name.split(" ")[0]}</span>
            </Link>
            <button onClick={handleLogout} className="p-2 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg">
        <div className="grid grid-cols-6 h-16">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive(item.href, item.exact) ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
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
