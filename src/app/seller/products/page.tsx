"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { Package, Plus, Search, Edit, Trash2, Eye, Star, ToggleLeft, ToggleRight, Filter } from "lucide-react";
import { toast } from "sonner";

export default function SellerProductsPage() {
  const { currentUser, getProductsBySeller, deleteProduct, updateProduct } = useApp();
  const products = getProductsBySeller(currentUser?.id || "");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filtered = products
    .filter(p => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "stock") return a.stock - b.stock;
      return 0;
    });

  const handleToggleStatus = (id: string, current: string) => {
    const newStatus = current === "active" ? "inactive" : "active";
    updateProduct(id, { status: newStatus as "active" | "inactive" });
    toast.success(`Product ${newStatus === "active" ? "activated" : "deactivated"}`);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteProduct(id);
      toast.success("Product deleted");
    }
  };

  const counts = {
    all: products.length,
    active: products.filter(p => p.status === "active").length,
    inactive: products.filter(p => p.status === "inactive").length,
    out_of_stock: products.filter(p => p.stock === 0).length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} total products</p>
        </div>
        <Link href="/seller/products/new" className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-purple-200">
          <Plus className="w-5 h-5" /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: counts.all, color: "bg-gray-50 text-gray-700" },
          { label: "Active", value: counts.active, color: "bg-green-50 text-green-700" },
          { label: "Inactive", value: counts.inactive, color: "bg-yellow-50 text-yellow-700" },
          { label: "Out of Stock", value: counts.out_of_stock, color: "bg-red-50 text-red-700" },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-3 text-center cursor-pointer`} onClick={() => setStatusFilter(s.label === "Total" ? "all" : s.label.toLowerCase().replace(" ", "_"))}>
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-xs font-medium opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700">
          <option value="newest">Newest First</option>
          <option value="rating">Highest Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="stock">Low Stock First</option>
        </select>
      </div>

      {/* Products Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">{products.length === 0 ? "Start by adding your first product" : "Try adjusting your filters"}</p>
          {products.length === 0 && (
            <Link href="/seller/products/new" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
              <Plus className="w-5 h-5" /> Add First Product
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rating</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt={product.title} className="w-10 h-10 rounded-xl object-cover bg-gray-100 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-48">{product.title}</p>
                          <p className="text-xs text-gray-400">#{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">{product.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-gray-900">${product.price}</div>
                      {product.originalPrice && <div className="text-xs text-gray-400 line-through">${product.originalPrice}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-semibold ${product.stock === 0 ? "text-red-500" : product.stock <= 5 ? "text-orange-500" : "text-gray-900"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-gray-700">{product.rating > 0 ? product.rating : "—"}</span>
                        <span className="text-xs text-gray-400">({product.reviewCount})</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleToggleStatus(product.id, product.status)} className="flex items-center gap-1.5">
                        {product.status === "active"
                          ? <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-xs text-green-600 font-medium">Active</span></>
                          : <><ToggleLeft className="w-5 h-5 text-gray-400" /><span className="text-xs text-gray-400 font-medium">Inactive</span></>
                        }
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/buyer/product/${product.id}`} target="_blank"
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/seller/products/${product.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(product.id, product.title)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
