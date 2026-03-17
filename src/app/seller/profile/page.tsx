"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { Store, Mail, Phone, MapPin, Calendar, Star, Package, ShoppingBag, Edit3, Save, X, Award } from "lucide-react";
import { toast } from "sonner";

export default function SellerProfilePage() {
  const { currentUser, updateProfile, getProductsBySeller, getSellerOrders } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    bio: currentUser?.bio || "",
    location: currentUser?.location || "",
    phone: currentUser?.phone || "",
  });

  const products = getProductsBySeller(currentUser?.id || "");
  const orders = getSellerOrders(currentUser?.id || "");
  const revenue = orders.filter(o => !["cancelled", "refunded"].includes(o.status)).reduce((s, o) => s + o.total, 0);

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast.success("Store profile updated!");
  };

  if (!currentUser) return null;

  const stats = [
    { label: "Total Revenue", value: `$${revenue.toFixed(0)}`, icon: ShoppingBag, color: "text-green-600 bg-green-50" },
    { label: "Products Listed", value: products.length, icon: Package, color: "text-indigo-600 bg-indigo-50" },
    { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "text-purple-600 bg-purple-50" },
    { label: "Store Rating", value: `${currentUser.rating || 5.0}/5`, icon: Star, color: "text-yellow-500 bg-yellow-50" },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-6">
        <div className="h-28 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="relative">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-purple-100 border-4 border-white shadow-md flex items-center justify-center">
                  <Store className="w-10 h-10 text-purple-600" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <Award className="w-3 h-3 text-white" />
              </div>
            </div>
            <button onClick={() => editing ? handleSave() : setEditing(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors ${editing ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              {editing ? <><Save className="w-4 h-4" /> Save</> : <><Edit3 className="w-4 h-4" /> Edit Store</>}
            </button>
          </div>

          {editing ? (
            <div className="space-y-3 mb-4">
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Store Name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Store description"
                rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone"
                  className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Location"
                  className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <button onClick={() => setEditing(false)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">{currentUser.name}</h2>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">Seller</span>
              </div>
              {currentUser.bio && <p className="text-gray-500 text-sm mt-1">{currentUser.bio}</p>}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" />{currentUser.email}</span>
                {currentUser.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" />{currentUser.phone}</span>}
                {currentUser.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{currentUser.location}</span>}
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />Since {new Date(currentUser.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
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

      {/* Top Products */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">Your Products</h3>
        {products.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No products listed yet</p>
        ) : (
          <div className="space-y-3">
            {products.slice(0, 5).map(product => (
              <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <img src={product.images[0]} alt={product.title} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">{product.rating} ({product.reviewCount} reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm">${product.price}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${product.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>{product.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
