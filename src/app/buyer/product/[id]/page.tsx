"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { Star, Heart, ShoppingCart, MessageSquare, ChevronLeft, Plus, Minus, Truck, Shield, RefreshCw, Award, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { getProductById, addToCart, toggleWishlist, isInWishlist, getProductReviews, addReview, currentUser } = useApp();
  const router = useRouter();
  const product = getProductById(id);
  const reviews = getProductReviews(id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "shipping">("description");

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">😔</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
      <Link href="/buyer/browse" className="text-indigo-600 hover:text-indigo-700 font-medium">← Back to Browse</Link>
    </div>
  );

  const inWishlist = isInWishlist(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} × ${product.title} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/buyer/cart");
  };

  const handleSubmitReview = () => {
    if (!currentUser) return;
    if (!reviewText.trim()) { toast.error("Please write a review"); return; }
    addReview({
      productId: product.id,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerAvatar: currentUser.avatar,
      rating: reviewRating,
      comment: reviewText
    });
    setReviewText("");
    setReviewRating(5);
    setShowReviewForm(false);
    toast.success("Review submitted!");
  };

  const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percent: reviews.length ? Math.round((reviews.filter(r => r.rating === stars).length / reviews.length) * 100) : 0
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/buyer/browse" className="flex items-center gap-1 hover:text-indigo-600 font-medium">
          <ChevronLeft className="w-4 h-4" /> Browse
        </Link>
        <span>/</span>
        <span className="text-indigo-600">{product.category}</span>
        <span>/</span>
        <span className="text-gray-700 truncate">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* Image Gallery */}
        <div>
          <div className="relative rounded-3xl overflow-hidden bg-gray-100 aspect-square mb-3">
            <img src={product.images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
            {discount && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">-{discount}% OFF</span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${inWishlist ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:text-red-500"}`}
            >
              <Heart className="w-6 h-6" fill={inWishlist ? "currentColor" : "none"} />
            </button>
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-indigo-500" : "border-gray-200"}`}>
                  <img src={img} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-1 flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">{product.category}</span>
            {product.stock <= 5 && product.stock > 0 && <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full animate-pulse">Low Stock</span>}
            {product.stock === 0 && <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Out of Stock</span>}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.title}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />)}
            </div>
            <span className="font-semibold text-gray-900">{product.rating}</span>
            <span className="text-gray-500 text-sm">({product.reviewCount} reviews)</span>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-lg">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">#{tag}</span>
            ))}
          </div>

          {/* Seller Info */}
          <Link href={`/buyer/messages?seller=${product.sellerId}&sellerName=${product.sellerName}`}
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mb-6 hover:bg-gray-100 transition-colors group">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg">{product.sellerName[0]}</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Sold by</p>
              <p className="font-semibold text-gray-900">{product.sellerName}</p>
            </div>
            <MessageSquare className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
          </Link>

          {/* Quantity + Actions */}
          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 shadow-sm">
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-900">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 shadow-sm">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">{product.stock} available</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={handleAddToCart} className="flex items-center justify-center gap-2 py-4 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-2xl hover:bg-indigo-50 transition-colors">
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
                <button onClick={handleBuyNow} className="flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-colors">
                  Buy Now
                </button>
              </div>
            </>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders $50+" },
              { icon: Shield, title: "Secure Payment", desc: "100% protected" },
              { icon: RefreshCw, title: "Easy Returns", desc: "30-day policy" },
            ].map(badge => (
              <div key={badge.title} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-2xl">
                <badge.icon className="w-5 h-5 text-indigo-600 mb-1" />
                <span className="text-xs font-semibold text-gray-900">{badge.title}</span>
                <span className="text-xs text-gray-500">{badge.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Description / Reviews / Shipping */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
        <div className="flex border-b border-gray-100">
          {(["description", "reviews", "shipping"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}>
              {tab} {tab === "reviews" && `(${reviews.length})`}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "description" && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-base">{product.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Product Details</h4>
                  <dl className="space-y-1 text-sm">
                    <div className="flex justify-between"><dt className="text-gray-500">Category</dt><dd className="font-medium">{product.category}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Stock</dt><dd className="font-medium">{product.stock} units</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Listed</dt><dd className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Seller</dt><dd className="font-medium">{product.sellerName}</dd></div>
                  </dl>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map(t => <span key={t} className="px-2 py-1 bg-white border border-gray-200 text-xs rounded-full text-gray-600">#{t}</span>)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              {reviews.length > 0 && (
                <div className="flex flex-col md:flex-row gap-8 mb-8 p-6 bg-gray-50 rounded-2xl">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900">{product.rating}</div>
                    <div className="flex items-center justify-center gap-1 my-2">
                      {[1,2,3,4,5].map(s => <Star key={s} className={`w-5 h-5 ${s <= Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />)}
                    </div>
                    <div className="text-sm text-gray-500">{product.reviewCount} reviews</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {ratingBreakdown.map(({ stars, count, percent }) => (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-12">{stars} star</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-sm text-gray-500 w-8">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentUser && (
                <div className="mb-6">
                  {!showReviewForm ? (
                    <button onClick={() => setShowReviewForm(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                      <Award className="w-4 h-4" /> Write a Review
                    </button>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Your Review</h3>
                      <div className="flex items-center gap-2 mb-4">
                        {[1,2,3,4,5].map(s => (
                          <button key={s} onClick={() => setReviewRating(s)}>
                            <Star className={`w-7 h-7 transition-colors ${s <= reviewRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300 hover:text-yellow-300 hover:fill-yellow-300"}`} />
                          </button>
                        ))}
                        <span className="text-sm text-gray-500 ml-2">{reviewRating}/5</span>
                      </div>
                      <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} rows={4} placeholder="Share your experience with this product..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm mb-4" />
                      <div className="flex gap-3">
                        <button onClick={handleSubmitReview} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm">Submit</button>
                        <button onClick={() => setShowReviewForm(false)} className="px-6 py-2 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {reviews.length === 0 ? (
                <div className="text-center py-10">
                  <Star className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="p-5 bg-gray-50 rounded-2xl">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {review.buyerAvatar ? (
                            <img src={review.buyerAvatar} alt={review.buyerName} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-semibold text-indigo-600">
                              {review.buyerName[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{review.buyerName}</p>
                            <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />)}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                      <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{review.helpful} found helpful</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-4">
              {[
                { icon: Truck, title: "Standard Delivery (3-7 days)", desc: "FREE on orders over $50. $4.99 otherwise.", color: "bg-blue-50 text-blue-600" },
                { icon: Truck, title: "Express Delivery (1-2 days)", desc: "$12.99 flat rate.", color: "bg-purple-50 text-purple-600" },
                { icon: RefreshCw, title: "Free Returns", desc: "Return within 30 days for any reason. No questions asked.", color: "bg-green-50 text-green-600" },
                { icon: Shield, title: "Buyer Protection", desc: "Full refund if item doesn't arrive or isn't as described.", color: "bg-indigo-50 text-indigo-600" },
              ].map(item => (
                <div key={item.title} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                    <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
