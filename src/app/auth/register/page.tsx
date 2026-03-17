"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import { toast } from "sonner";
import { ShoppingBag, Eye, EyeOff, ShoppingCart, Store, Check } from "lucide-react";

export default function RegisterPage() {
  const { register } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { toast.error("Please agree to the terms of service"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = register(name, email, password, role);
    setLoading(false);
    if (result.success) {
      toast.success("Account created! Welcome to Venturova!");
      router.push(role === "buyer" ? "/buyer" : "/seller");
    } else {
      toast.error("Registration failed. Please try again.");
    }
  };

  const roleOption = (value: "buyer" | "seller", icon: React.ReactNode, title: string, desc: string, features: string[]) => (
    <button
      type="button"
      onClick={() => setRole(value)}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
        role === value ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${role === value ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold ${role === value ? "text-indigo-900" : "text-gray-900"}`}>{title}</h3>
            {role === value && <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {features.map(f => (
              <span key={f} className={`text-xs px-2 py-0.5 rounded-full ${role === value ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}>{f}</span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold">Venturova</span>
        </div>
        <div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Start Your<br />Journey Today
          </h1>
          <p className="text-lg text-white/80 mb-8">
            Whether you're looking to buy or sell, Venturova has everything you need.
          </p>
          <div className="space-y-4">
            {[
              { icon: "🛒", title: "For Buyers", desc: "Browse thousands of products, compare prices, and shop with confidence." },
              { icon: "🏪", title: "For Sellers", desc: "Set up your store, list products, and reach thousands of buyers instantly." },
              { icon: "🔒", title: "Secure & Trusted", desc: "Buyer protection, secure payments, and verified seller program." },
            ].map(item => (
              <div key={item.title} className="flex gap-4 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-white/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/60 text-sm">© 2026 Venturova. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Venturova</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
          <p className="text-gray-500 mb-6">Join Venturova — it's free!</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I want to...</label>
              <div className="space-y-2">
                {roleOption("buyer", <ShoppingCart className="w-5 h-5" />, "Buy Products", "Shop from thousands of sellers",
                  ["Browse Products", "Track Orders", "Wishlist", "Reviews"])}
                {roleOption("seller", <Store className="w-5 h-5" />, "Sell Products", "Create your own online store",
                  ["Manage Listings", "Analytics", "Order Management", "Earnings"])}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm pr-12 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 rounded border-gray-300" />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account...</>
              ) : `Create ${role === "buyer" ? "Buyer" : "Seller"} Account`}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
