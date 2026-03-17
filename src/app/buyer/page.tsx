"use client";

import Link from "next/link";
import { useApp } from "@/lib/context";
import { Star, TrendingUp, Tag, ArrowRight, ShoppingBag, Package, Heart, Zap } from "lucide-react";
import { SEED_PRODUCTS } from "@/lib/store";

export default function BuyerHome() {
  const { currentUser, products, addToCart, toggleWishlist, isInWishlist, orders, getBuyerOrders } = useApp();
  const myOrders = getBuyerOrders(currentUser?.id || "");
  const featured = products.filter(p => p.status === "active").slice(0, 4);
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const onSale = products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 4);

  const categories = [
    { name: "Electronics", icon: "💻", color: "bg-blue-50 text-blue-700", count: products.filter(p => p.category === "Electronics").length },
    { name: "Clothing", icon: "👕", color: "bg-purple-50 text-purple-700", count: products.filter(p => p.category === "Clothing").length },
    { name: "Home & Garden", icon: "🏠", color: "bg-green-50 text-green-700", count: products.filter(p => p.category === "Home & Garden").length },
    { name: "Sports", icon: "⚽", color: "bg-orange-50 text-orange-700", count: products.filter(p => p.category === "Sports").length },
    { name: "Books", icon: "📚", color: "bg-yellow-50 text-yellow-700", count: products.filter(p => p.category === "Books").length },
    { name: "Beauty", icon: "💄", color: "bg-pink-50 text-pink-700", count: products.filter(p => p.category === "Beauty").length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 md:p-12 mb-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-yellow-300" />
            <span className="text-yellow-300 font-semibold text-sm uppercase tracking-wide">Welcome Back!</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Hi {currentUser?.name.split(" ")[0]}! 👋<br />
            <span className="text-white/90">What are you looking for?</span>
          </h1>
          <p className="text-white/80 text-lg mb-6 max-w-md">
            Discover amazing deals from thousands of trusted sellers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/buyer/browse" className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-2xl hover:bg-indigo-50 transition-colors flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Shop Now
            </Link>
            <Link href="/buyer/orders" className="px-6 py-3 bg-white/20 text-white font-semibold rounded-2xl hover:bg-white/30 transition-colors backdrop-blur-sm flex items-center gap-2">
              <Package className="w-5 h-5" /> My Orders ({myOrders.length})
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 right-12 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: myOrders.length, icon: Package, color: "text-indigo-600 bg-indigo-50" },
          { label: "Wishlist Items", value: 0, icon: Heart, color: "text-red-500 bg-red-50" },
          { label: "Products Available", value: products.length, icon: ShoppingBag, color: "text-purple-600 bg-purple-50" },
          { label: "Active Deals", value: onSale.length, icon: Tag, color: "text-green-600 bg-green-50" },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
          <Link href="/buyer/browse" className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map(cat => (
            <Link key={cat.name} href={`/buyer/browse?category=${cat.name}`}
              className={`${cat.color} rounded-2xl p-4 text-center hover:scale-105 transition-transform cursor-pointer`}>
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="text-xs font-semibold">{cat.name}</div>
              <div className="text-xs opacity-70 mt-0.5">{cat.count} items</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Flash Sale */}
      {onSale.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">Flash Deals</h2>
              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full animate-pulse">LIVE</span>
            </div>
            <Link href="/buyer/browse" className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {onSale.map(product => <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} onToggleWishlist={() => toggleWishlist(product.id)} inWishlist={isInWishlist(product.id)} />)}
          </div>
        </div>
      )}

      {/* Top Rated */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-bold text-gray-900">Top Rated</h2>
          </div>
          <Link href="/buyer/browse" className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topRated.map(product => <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} onToggleWishlist={() => toggleWishlist(product.id)} inWishlist={isInWishlist(product.id)} />)}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onAddToCart, onToggleWishlist, inWishlist }: {
  product: typeof SEED_PRODUCTS[0];
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  inWishlist: boolean;
}) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link href={`/buyer/product/${product.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
        )}
        <button
          onClick={e => { e.preventDefault(); onToggleWishlist(); }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${inWishlist ? "bg-red-500 text-white" : "bg-white/80 text-gray-400 hover:bg-white hover:text-red-500"}`}
        >
          <Heart className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-400 mb-1">{product.category}</p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">{product.title}</h3>
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
            onClick={e => { e.preventDefault(); onAddToCart(); }}
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
