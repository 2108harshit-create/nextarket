"use client";

import Link from "next/link";
import { useApp } from "@/lib/context";
import { Bell, Package, MessageSquare, Star, Tag, Settings, CheckCheck } from "lucide-react";

const TYPE_ICONS = { order: Package, message: MessageSquare, review: Star, promo: Tag, system: Settings };
const TYPE_COLORS = {
  order: "bg-purple-100 text-purple-600",
  message: "bg-blue-100 text-blue-600",
  review: "bg-yellow-100 text-yellow-600",
  promo: "bg-green-100 text-green-600",
  system: "bg-gray-100 text-gray-600",
};

export default function SellerNotificationsPage() {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const myNotifs = notifications.filter(n => n.userId === currentUser?.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const unreadCount = myNotifs.filter(n => !n.read).length;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">{unreadCount} new</span>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllNotificationsRead} className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 font-medium">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {myNotifs.length === 0 ? (
        <div className="text-center py-20">
          <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {myNotifs.map(notif => {
            const Icon = TYPE_ICONS[notif.type];
            return (
              <div key={notif.id} onClick={() => markNotificationRead(notif.id)}
                className={`flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-sm ${!notif.read ? "bg-purple-50 border border-purple-100" : "bg-white border border-gray-100"}`}>
                <div className={`w-10 h-10 rounded-xl ${TYPE_COLORS[notif.type]} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-sm font-semibold ${!notif.read ? "text-gray-900" : "text-gray-700"}`}>{notif.title}</h3>
                    {!notif.read && <span className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  {notif.link && (
                    <Link href={notif.link} className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium mt-2">View details →</Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
