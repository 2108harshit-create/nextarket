"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, Truck } from "lucide-react";
import { toast } from "sonner";
import type { Order } from "@/lib/store";

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, cartCount, placeOrder, currentUser } = useApp();
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({ fullName: currentUser?.name || "", street: "", city: "", state: "", zip: "", country: "US", payment: "Credit Card" });

  const discount = promoApplied ? cartTotal * 0.1 : 0;
  const shipping = cartTotal >= 50 ? 0 : 4.99;
  const finalTotal = cartTotal - discount + shipping;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "SAVE10") {
      setPromoApplied(true);
      toast.success("Promo code applied! 10% off!");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handlePlaceOrder = async () => {
    if (!form.fullName || !form.street || !form.city || !form.state || !form.zip) {
      toast.error("Please fill in all shipping fields");
      return;
    }
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1000));
    const order = placeOrder({ fullName: form.fullName, street: form.street, city: form.city, state: form.state, zip: form.zip, country: form.country }, form.payment);
    setPlacing(false);
    if (order) {
      toast.success("Order placed successfully! 🎉");
      router.push("/buyer/orders");
    }
  };

  if (cart.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <ShoppingCart className="w-20 h-20 text-gray-200 mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-8">Looks like you haven't added anything yet</p>
      <Link href="/buyer/browse" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-colors">
        <ShoppingBag className="w-5 h-5" /> Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="w-6 h-6 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">{cartCount} items</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map(item => (
            <div key={item.product.id} className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm">
              <Link href={`/buyer/product/${item.product.id}`} className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/buyer/product/${item.product.id}`}>
                  <h3 className="font-semibold text-gray-900 text-sm hover:text-indigo-600 transition-colors line-clamp-2">{item.product.title}</h3>
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">by {item.product.sellerName}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                    <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 shadow-sm">
                      <Minus className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock} className="w-7 h-7 rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 shadow-sm disabled:opacity-40">
                      <Plus className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</div>
                    {item.quantity > 1 && <div className="text-xs text-gray-400">${item.product.price} each</div>}
                  </div>
                </div>
              </div>
              <button onClick={() => { removeFromCart(item.product.id); toast.success("Removed from cart"); }}
                className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-20">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Promo Code */}
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} placeholder="Promo code"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <button onClick={applyPromo} className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">Apply</button>
              </div>
              {promoApplied && <p className="text-xs text-green-600 font-medium mb-4">✓ Promo SAVE10 applied (10% off)</p>}

              <div className="space-y-3 pb-4 border-b border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({cartCount} items)</span><span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                {promoApplied && <div className="flex justify-between text-sm text-green-600"><span>Promo discount</span><span>-${discount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium"}>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                {cartTotal < 50 && <p className="text-xs text-indigo-600 flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Add ${(50 - cartTotal).toFixed(2)} more for free shipping</p>}
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 py-4">
                <span>Total</span><span>${finalTotal.toFixed(2)}</span>
              </div>

              {!showCheckout ? (
                <button onClick={() => setShowCheckout(true)} className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 text-sm">Shipping Address</h3>
                  {[
                    { key: "fullName", placeholder: "Full Name" },
                    { key: "street", placeholder: "Street Address" },
                    { key: "city", placeholder: "City" },
                    { key: "state", placeholder: "State/Province" },
                    { key: "zip", placeholder: "ZIP/Postal Code" },
                  ].map(f => (
                    <input key={f.key} value={form[f.key as keyof typeof form]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  ))}
                  <h3 className="font-semibold text-gray-900 text-sm pt-2">Payment Method</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["Credit Card", "PayPal", "Crypto", "Bank Transfer"].map(m => (
                      <button key={m} onClick={() => setForm(f => ({ ...f, payment: m }))}
                        className={`py-2 rounded-xl text-xs font-medium border-2 transition-all ${form.payment === m ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                  <button onClick={handlePlaceOrder} disabled={placing}
                    className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                    {placing ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</> : `Place Order · $${finalTotal.toFixed(2)}`}
                  </button>
                  <button onClick={() => setShowCheckout(false)} className="w-full py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors">
                    ← Back to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
