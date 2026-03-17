"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { ChevronLeft, Save, X, Plus, Tag, DollarSign, Package } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Toys", "Beauty", "Automotive"];

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { getProductById, updateProduct } = useApp();
  const router = useRouter();
  const product = getProductById(id);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState(product ? {
    title: product.title,
    description: product.description,
    price: String(product.price),
    originalPrice: String(product.originalPrice || ""),
    category: product.category,
    stock: String(product.stock),
    tags: [...product.tags],
    images: [...product.images],
    status: product.status,
  } : null);

  if (!product || !form) return (
    <div className="p-6 text-center">
      <p className="text-gray-500">Product not found</p>
      <Link href="/seller/products" className="text-indigo-600 font-medium mt-2 inline-block">← Back to Products</Link>
    </div>
  );

  const update = (key: string, value: unknown) => setForm(f => f ? { ...f, [key]: value } : f);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && form && !form.tags.includes(tag)) {
      update("tags", [...form.tags, tag]);
      setTagInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    updateProduct(id, {
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      category: form.category,
      stock: parseInt(form.stock),
      tags: form.tags,
      images: form.images,
      status: form.status as "active" | "inactive",
    });
    setSaving(false);
    toast.success("Product updated!");
    router.push("/seller/products");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/seller/products" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Title</label>
            <input value={form.title} onChange={e => update("title", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => update("description", e.target.value)} rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select value={form.category} onChange={e => update("category", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-green-600" /> Pricing & Stock</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sale Price ($)</label>
              <input type="number" value={form.price} onChange={e => update("price", e.target.value)} min="0.01" step="0.01"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Original Price ($)</label>
              <input type="number" value={form.originalPrice} onChange={e => update("originalPrice", e.target.value)} min="0" step="0.01"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity</label>
              <input type="number" value={form.stock} onChange={e => update("stock", e.target.value)} min="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select value={form.status} onChange={e => update("status", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Tag className="w-5 h-5 text-indigo-600" /> Tags</h2>
          <div className="flex gap-2 mb-3">
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Add tag..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <button type="button" onClick={addTag} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full">
                #{tag}
                <button type="button" onClick={() => update("tags", form.tags.filter(t => t !== tag))} className="hover:text-red-500"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-2xl hover:opacity-90 disabled:opacity-60 transition-opacity shadow-md shadow-purple-200 flex items-center justify-center gap-2">
          {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Save Changes</>}
        </button>
      </form>
    </div>
  );
}
