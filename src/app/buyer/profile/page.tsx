"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { User, Mail, Phone, MapPin, Calendar, Star, Package, Heart, Edit3, Save, X } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { currentUser, updateProfile, getBuyerOrders, wishlist } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    bio: currentUser?.bio || "",
    location: currentUser?.location || "",
    phone: currentUser?.phone || "",
  });

  const orders = getBuyerOrders(currentUser?.id || "");

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast.success("Profile updated!");
  };

  if (!currentUser) return null;

  const stats = [
    { label: "Total Orders", value: orders.length, icon: Package, color: "text-indigo-600 bg-indigo-50" },
    { label: "Wishlist Items", value: wishlist.length, icon: Heart, color: "text-red-500 bg-red-50" },
    { label: "Member Rating", value: `${currentUser.rating}/5`, icon: Star, color: "text-yellow-500 bg-yellow-50" },
    { label: "Orders Delivered", value: orders.filter(o => o.status === "delivered").length, icon: Package, color: "text-green-600 bg-green-50" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-6">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="relative">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-indigo-100 border-4 border-white shadow-md flex items-center justify-center">
                  <User className="w-10 h-10 text-indigo-600" />
                </div>
              )}
            </div>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors ${editing ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {editing ? <><Save className="w-4 h-4" /> Save</> : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
            </button>
          </div>

          {editing ? (
            <div className="space-y-3 mb-4">
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full Name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Bio (tell us about yourself)"
                rows={2} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone"
                  className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Location"
                  className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button onClick={() => setEditing(false)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentUser.name}</h2>
              {currentUser.bio && <p className="text-gray-500 text-sm mt-1">{currentUser.bio}</p>}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" />{currentUser.email}</span>
                {currentUser.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" />{currentUser.phone}</span>}
                {currentUser.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{currentUser.location}</span>}
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />Member since {new Date(currentUser.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">Recent Orders</h3>
        {orders.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map(order => (
              <div key={order.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 2).map((item, i) => (
                    <img key={i} src={item.product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border-2 border-white" />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm">${order.total.toFixed(2)}</p>
                  <span className="text-xs capitalize px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
