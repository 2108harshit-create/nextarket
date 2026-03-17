"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/lib/context";
import { Search, Filter, Star, Heart, ShoppingBag, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["All", "Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Toys", "Beauty", "Automotive"];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
];

export default function BrowsePage() {
  const { products, addToCart, toggleWishlist, isInWishlist } = useApp();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sort, setSort] = useState("featured");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(500);
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = products.filter(p => p.status === "active");
    if (search) list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
    if (category !== "All") list = list.filter(p => p.category === category);
    list = list.filter(p => p.price >= priceMin && p.price <= priceMax);
    if (minRating > 0) list = list.filter(p => p.rating >= minRating);
    if (onSaleOnly) list = list.filter(p => p.originalPrice && p.originalPrice > p.price);
    if (inStockOnly) list = list.filter(p => p.stock > 0);

    switch (sort) {
      case "price_asc": return [...list].sort((a, b) => a.price - b.price);
      case "price_desc": return [...list].sort((a, b) => b.price - a.price);
      case "rating": return [...list].sort((a, b) => b.rating - a.rating);
      case "newest": return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default: return list;
    }
  }, [products, search, category, sort, priceMin, priceMax, minRating, onSaleOnly, inStockOnly]);

  const activeFilterCount = [
    category !== "All",
    priceMin > 0 || priceMax < 500,
    minRating > 0,
    onSaleOnly,
    inStockOnly
  ].filter(Boolean).length;

  const resetFilters = () => {
    setCategory("All"); setPriceMin(0); setPriceMax(500);
    setMinRating(0); setOnSaleOnly(false); setInStockOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products, brands, categories..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === cat
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 font-medium">{filtered.length} products</span>
          {activeFilterCount > 0 && (
            <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium">
              <X className="w-3 h-3" /> Clear filters ({activeFilterCount})
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
              showFilters ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {activeFilterCount > 0 && <span className="w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">{activeFilterCount}</span>}
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
            <div className="flex items-center gap-2">
              <input type="number" value={priceMin} onChange={e => setPriceMin(Number(e.target.value))} min="0" max={priceMax}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Min" />
              <span className="text-gray-400">–</span>
              <input type="number" value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} min={priceMin}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Max" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Min Rating</h3>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5].map(r => (
                <button key={r} onClick={() => setMinRating(r)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${minRating === r ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {r === 0 ? "All" : `${r}+`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Availability</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={onSaleOnly} onChange={e => setOnSaleOnly(e.target.checked)} className="rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-700">On Sale Only</span>
              </label>
            </div>
          </div>
          <div className="flex items-end">
            <button onClick={resetFilters} className="w-full py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              Reset All
            </button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
          <button onClick={resetFilters} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(product => {
            const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
            const inWishlist = isInWishlist(product.id);
            return (
              <Link key={product.id} href={`/buyer/product/${product.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {discount && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>}
                  {product.stock <= 5 && product.stock > 0 && <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">Only {product.stock} left</span>}
                  <button
                    onClick={e => { e.preventDefault(); toggleWishlist(product.id); }}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${inWishlist ? "bg-red-500 text-white" : "bg-white/80 text-gray-400 hover:bg-white hover:text-red-500"}`}
                  >
                    <Heart className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs text-indigo-600 font-medium mb-1">{product.category}</p>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{product.title}</h3>
                  <p className="text-xs text-gray-400 mb-2">by {product.sellerName}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviewCount})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && <span className="text-xs text-gray-400 line-through ml-1">${product.originalPrice}</span>}
                    </div>
                    <button
                      onClick={e => { e.preventDefault(); addToCart(product); toast.success("Added to cart!"); }}
                      className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
