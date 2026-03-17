"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { ChevronLeft, Plus, X, Upload, Tag, DollarSign, Package, Save } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Toys", "Beauty", "Automotive"];

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
  "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500",
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
  "https://images.unsplash.com/photo-1601445638532-1d23e7b3e08d?w=500",
];

export default function NewProductPage() {
  const { addProduct, currentUser } = useApp();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "Electronics",
    stock: "10",
    tags: [] as string[],
    images: [DEFAULT_IMAGES[0]],
    status: "active" as "active" | "inactive",
  });

  const update = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }));

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && !form.tags.includes(tag)) {
      update("tags", [...form.tags, tag]);
      setTagInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.price || !form.stock) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    addProduct({
      sellerId: currentUser?.id || "",
      sellerName: currentUser?.name || "",
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      category: form.category,
      stock: parseInt(form.stock),
      tags: form.tags,
      images: form.images,
      status: form.status,
    });
    setSaving(false);
    toast.success("Product listed successfully! 🎉");
    router.push("/seller/products");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/seller/products" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Title *</label>
                  <input value={form.title} onChange={e => update("title", e.target.value)} placeholder="e.g., Wireless Bluetooth Headphones"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                  <textarea value={form.description} onChange={e => update("description", e.target.value)} rows={5} placeholder="Describe your product in detail..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                  <select value={form.category} onChange={e => update("category", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" /> Pricing & Stock
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sale Price ($) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                    <input type="number" value={form.price} onChange={e => update("price", e.target.value)} placeholder="0.00" min="0.01" step="0.01"
                      className="w-full pl-7 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Original Price ($) <span className="text-gray-400 text-xs">(optional)</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                    <input type="number" value={form.originalPrice} onChange={e => update("originalPrice", e.target.value)} placeholder="0.00" min="0" step="0.01"
                      className="w-full pl-7 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity *</label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="number" value={form.stock} onChange={e => update("stock", e.target.value)} placeholder="0" min="0"
                      className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Listing Status</label>
                  <select value={form.status} onChange={e => update("status", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                    <option value="active">Active (visible to buyers)</option>
                    <option value="inactive">Inactive (hidden)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-600" /> Tags
              </h2>
              <div className="flex gap-2 mb-3">
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  placeholder="Add tag and press Enter..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <button type="button" onClick={addTag} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full">
                    #{tag}
                    <button type="button" onClick={() => update("tags", form.tags.filter(t => t !== tag))} className="hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {form.tags.length === 0 && <p className="text-sm text-gray-400">No tags added yet</p>}
              </div>
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-600" /> Product Images
              </h2>
              {/* Main Image Preview */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3">
                <img src={form.images[0]} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-gray-500 mb-3">Select from demo images or paste a URL:</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {DEFAULT_IMAGES.map(img => (
                  <button key={img} type="button" onClick={() => update("images", [img])}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${form.images[0] === img ? "border-purple-500" : "border-transparent"}`}>
                    <img src={img} alt="Option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <input
                value={form.images[0]}
                onChange={e => update("images", [e.target.value])}
                placeholder="Or paste image URL..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Discount Preview */}
            {form.price && form.originalPrice && parseFloat(form.originalPrice) > parseFloat(form.price) && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <p className="text-sm font-semibold text-green-700 mb-1">Discount Preview</p>
                <p className="text-2xl font-bold text-green-800">
                  {Math.round((1 - parseFloat(form.price) / parseFloat(form.originalPrice)) * 100)}% OFF
                </p>
                <p className="text-sm text-green-600">Buyers save ${(parseFloat(form.originalPrice) - parseFloat(form.price)).toFixed(2)}</p>
              </div>
            )}

            <button type="submit" disabled={saving}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-2xl hover:opacity-90 disabled:opacity-60 transition-opacity shadow-md shadow-purple-200 flex items-center justify-center gap-2">
              {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Publishing...</> : <><Save className="w-5 h-5" /> Publish Product</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
