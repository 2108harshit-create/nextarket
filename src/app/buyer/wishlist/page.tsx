"use client";

import Link from "next/link";
import { useApp } from "@/lib/context";
import { Heart, ShoppingBag, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

export default function WishlistPage() {
  const { wishlist, products, toggleWishlist, addToCart } = useApp();
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
        <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">{wishlistProducts.length}</span>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Save items you love by clicking the heart icon</p>
          <Link href="/buyer/browse" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistProducts.map(product => {
            const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
            return (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm group">
                <Link href={`/buyer/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {discount && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>}
                  <button
                    onClick={e => { e.preventDefault(); toggleWishlist(product.id); toast.success("Removed from wishlist"); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Link>
                <div className="p-3">
                  <p className="text-xs text-indigo-600 font-medium mb-1">{product.category}</p>
                  <Link href={`/buyer/product/${product.id}`}>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-indigo-600 transition-colors">{product.title}</h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviewCount})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && <span className="text-xs text-gray-400 line-through ml-1">${product.originalPrice}</span>}
                    </div>
                    <button
                      onClick={() => { addToCart(product); toast.success("Added to cart!"); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
